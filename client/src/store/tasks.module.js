import axios from "./axios";
import i18n from "@/i18n";
import {
  checkStatus,
  computeNextDueDay,
  isToday,
  getOnDemandStatus,
  getSingleStatus,
  formatDateString,
  nextAssignedMember,
  previousAssignedMember,
  dateToLocalTime
} from "@/assets/tasksHelper.js";

// Vuex module storing task data (for use in tasks page and widget)
const vuexModule = {
  namespaced: true,
  state: () => ({
    tasks: [],
    loggedTasks: []
  }),
  mutations: {
    // (state, arg)
    set_tasks(state, tasks) {
      state.tasks = tasks.sort((a, b) => a.nextDueDay - b.nextDueDay);
    },
    set_logged_tasks(state, logged_tasks) {
      state.loggedTasks = logged_tasks.sort(
        (a, b) => new Date(b.time) - new Date(a.time)
      );
    }
  },
  actions: {
    // ({ state, commit, dispatch, getters, rootState, rootGetters })
    // Fetches all household tasks from remote and updates state.tasks
    async fetchTasks({ commit }) {
      const { data } = await axios.get("/_/fetchtasks");
      if (data.success) {
        let tasks = [];
        let curDateBegin = new Date();
        curDateBegin.setHours(0, 0, 1, 0);
        let curDateEnd = new Date();
        curDateEnd.setHours(12, 59, 59, 0);
        let curDate = new Date();
        curDate.setHours(12, 0, 0, 0);
        data.data.forEach(element => {
          let lastExecution = new Date(element.lastExecution * 1000);
          if (isNaN(lastExecution.getTime())) {
            lastExecution = new Date(0);
          }
          switch (element.mode) {
            case 0: {
              //Single
              let startDate = new Date(element.startDate * 1000);
              let time = dateToLocalTime(startDate);

              let status = getSingleStatus(startDate, lastExecution);
              tasks.push({
                id: element.id,
                mode: element.mode,
                name: element.name,
                assigned: element.assignedMember,
                day: formatDateString(startDate),
                nextDueDay: startDate,
                startDate: startDate,
                dueDay: startDate,
                time: time.substr(0, 5),
                missed: status == 1,
                checked: status == 2,
                icon: element.icon
              });
              break;
            }
            case 1: {
              //Repeating
              let startDate = new Date(element.startDate * 1000);
              if (element.repetitionDays.length == 0) {
                console.warn("Empty repetitionDays configuration for", element);
                return;
              }
              let nextDueDay = computeNextDueDay(
                curDate,
                startDate,
                element.repetitionDays,
                element.repetitionUnit,
                element.repetitionEvery
              );
              let taskStatus = checkStatus(
                lastExecution,
                nextDueDay,
                element.repetitionDays,
                element.repetitionEvery,
                element.repetitionUnit,
                startDate,
                curDateBegin,
                curDateEnd
              );
              tasks.push({
                id: element.id,
                mode: element.mode,
                name: element.name,
                startDate: startDate,
                repetitionDays: element.repetitionDays,
                repetitionEvery: element.repetitionEvery,
                repetitionUnit: element.repetitionUnit,
                assigned: element.assignedMember,
                day: formatDateString(nextDueDay),
                iteratingMode: element.iteratingMode,
                nextDueDay: new Date(nextDueDay),
                time: dateToLocalTime(startDate).substr(0, 5),
                lastExecution: lastExecution,
                missed: !taskStatus[0],
                checked: taskStatus[0] == 2,
                icon: element.icon,
                lastDueDay: taskStatus[1]
              });
              break;
            }
            case 2: {
              //On-Demand
              tasks.push({
                id: element.id,
                mode: element.mode,
                name: element.name,
                assigned: element.assignedMember,
                lastExecution: lastExecution,
                checked: getOnDemandStatus(new Date(), lastExecution),
                icon: element.icon
              });
              break;
            }
          }
        });
        commit("set_tasks", tasks);
        let loggedTasks = data.loggedTasks
          ? data.loggedTasks.map(task => ({
              name: task.name,
              time: task.time,
              icon: task.icon,
              working: task.workingMember,
              assigned: task.assignedMember
            }))
          : [];
        commit("set_logged_tasks", loggedTasks);
      } else throw data.message;
    },
    // Marks a task as checked or unchecked and updates it on the server
    async updateTaskChecked({ rootGetters }, { task, checked }) {
      let lastExecution, assignedMember, due;
      let users = rootGetters.getHouseholdUserIDs;
      let index = users.indexOf(task.assigned);
      if (checked) {
        //check
        switch (task.mode) {
          case 0:
            lastExecution = new Date().toString();
            assignedMember = task.assigned;
            due = task.dueDay;
            break;
          case 1: {
            if (task.missed) {
              lastExecution = new Date(task.lastDueDay).toString();
            } else {
              lastExecution = new Date().toString();
            }
            if (task.iteratingMode) {
              assignedMember = users[nextAssignedMember(users, index)];
            } else {
              assignedMember = task.assigned;
            }
            let curDate = new Date();
            if (new Date() < task.nextDueDay) {
              due = task.nextDueDay;
            } else {
              curDate.setDate(curDate.getDate() + 1);
              due = computeNextDueDay(
                curDate,
                new Date(task.startDate),
                task.repetitionDays,
                task.repetitionUnit == "Weeks" ? 0 : 1,
                task.repetitionEvery
              );
            }
            due = new Date(
              due.toISOString().substr(0, 10) + "T" + task.time + ":00.000Z"
            ).toISOString();
            break;
          }
          case 2:
            assignedMember = users[nextAssignedMember(users, index)];
            lastExecution = new Date().toISOString();
            due = "";
            break;
        }
      } else {
        //uncheck
        switch (task.mode) {
          case 0:
            lastExecution = "0";
            assignedMember = task.assigned;
            due = task.dueDay;
            break;
          case 1: {
            let date = new Date(task.lastDueDay);
            date.setDate(date.getDate() - 1);
            lastExecution = date.toString();
            if (task.iteratingMode) {
              assignedMember = users[previousAssignedMember(users, index)];
            } else {
              assignedMember = task.assigned;
            }
            due = new Date(
              task.lastDueDay.toISOString().substr(0, 10) +
                "T" +
                task.time +
                ":00.000Z"
            ).toISOString();
            break;
          }
          case 2:
            throw i18n.t("store.tasks.undoOnDemandError");
        }
      }
      // Perform checking on server
      const { data } = await axios.post("/_/checktask", {
        id: task.id,
        lastExecution,
        assignedMember,
        due
      });
      if (!data.success) throw data.message;
      // In case of uncheck, log to server
      const { data: data2 } = await axios.post("/_/pushtaskaction", {
        id: task.id,
        time: new Date().toISOString(),
        name: task.name,
        assignedMember: task.assigned,
        icon: task.icon,
        done: checked
      });
      if (!data2.success) throw data.message;
    },
    // Triggers a reminder (push notification) for the user assigned to the task
    async triggerReminder(instance, task) {
      const { data } = await axios.post("/_/pushreminder", { id: task.id });
      if (!data.success) throw data.message;
    }
  },
  getters: {
    // (state, getters, rootState, rootGetters)
    getTodaysTasks(state, getters) {
      return getters.timedTasks.filter(task => {
        if (task.mode == 0) {
          return isToday(task.dueDay, new Date());
        } else {
          return isToday(task.nextDueDay, new Date());
        }
      });
    },
    repeatingTasks(state) {
      return state.tasks.filter(task => task.mode == 1);
    },
    timedTasks(state) {
      let curDate = new Date();
      return state.tasks.filter(
        task =>
          task.mode == 1 ||
          (task.mode == 0 && (task.dueDay > curDate || task.missed))
      );
    },
    onDemandTasks(state) {
      return state.tasks.filter(task => task.mode == 2);
    }
  }
};

export default vuexModule;
