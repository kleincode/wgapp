import axios from "./axios";
import icons from "@/assets/icons.js";
import {
  checkStatus,
  computeNextDueDay,
  isToday,
  getOnDemandStatus,
  getSingleStatus,
  formatDateString,
  nextAssignedMember,
  previousAssignedMember
} from "@/assets/tasksHelper.js";

// Vuex module storing task data (for use in tasks page and widget)
const vuexModule = {
  namespaced: true,
  state: () => ({
    tasks: [],
    oldSingleTasks: []
  }),
  mutations: {
    // (state, arg)
    set_tasks(state, tasks) {
      state.tasks = tasks.sort((a, b) => a.nextDueDay - b.nextDueDay);
    },
    set_old_single_tasks(state, old_single_tasks) {
      state.oldSingleTasks = old_single_tasks;
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
          let lastExecution = new Date(element.lastExecution);
          if (isNaN(lastExecution.getTime())) {
            lastExecution = new Date(0);
          }
          switch (element.mode) {
            case 0: {
              //Single
              let correctedStartDate = new Date(element.startDate);
              let time = element.time.substr(0, 5);
              let status = getSingleStatus(correctedStartDate, lastExecution);
              tasks.push({
                id: element.id,
                mode: element.mode,
                name: element.name,
                assigned: element.assignedMember,
                day: formatDateString(correctedStartDate),
                nextDueDay: correctedStartDate,
                startDate: correctedStartDate,
                dueDay: correctedStartDate,
                time: time,
                missed: status == 1,
                checked: status == 2,
                icon: icons[element.icon]
              });
              break;
            }
            case 1: {
              //Repeating
              let correctedStartDate = new Date(
                element.startDate.substr(0, 19)
              );
              correctedStartDate.setHours(correctedStartDate.getHours() + 13);
              if (element.repetitionDays.length == 0) {
                console.warn("Empty repetitionDays configuration for", element);
                return;
              }
              let nextDueDay = computeNextDueDay(
                curDate,
                correctedStartDate,
                element.repetitionDays,
                element.repetitionUnit,
                element.repetitionEvery
              );
              lastExecution.setHours(lastExecution.getHours() + 2);
              let taskStatus = checkStatus(
                lastExecution,
                nextDueDay,
                element.repetitionDays,
                element.repetitionEvery,
                element.repetitionUnit,
                correctedStartDate,
                curDateBegin,
                curDateEnd
              );
              tasks.push({
                id: element.id,
                mode: element.mode,
                name: element.name,
                startDate: correctedStartDate,
                repetitionDays: element.repetitionDays,
                repetitionEvery: element.repetitionEvery,
                repetitionUnit: element.repetitionUnit,
                assigned: element.assignedMember,
                day: formatDateString(nextDueDay),
                iteratingMode: element.iteratingMode,
                nextDueDay: new Date(nextDueDay),
                time: element.time.substr(0, 5),
                lastExecution: lastExecution,
                missed: !taskStatus[0],
                checked: taskStatus[0] == 2,
                icon: icons[element.icon],
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
                icon: icons[element.icon]
              });
              break;
            }
          }
        });
        commit("set_tasks", tasks);
        let oldSingleTasks = data.oldTasks
          ? data.oldTasks.map(task => ({
              id: task.id,
              name: task.name,
              day: task.startDate,
              icon: icons[task.icon],
              assigned: task.assignedMember,
              checked: true,
              mode: 0
            }))
          : [];
        commit("set_old_single_tasks", oldSingleTasks);
      } else throw data.message;
    },
    // Marks specific task as checked
    async checkTask({ rootGetters }, task) {
      let lastExecution, assignedMember, due;
      let users = rootGetters.getHouseholdUserIDs;
      let index = users.indexOf(task.assigned);
      if (!task.checked) {
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
                task.startDate,
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
            throw "You can't undo on-demand tasks. The task will automatically undone 2h after it was checked.";
        }
      }
      const { data } = await axios.post("/_/checktask", {
        id: task.id,
        lastExecution,
        assignedMember,
        due
      });
      if (!data.success) throw data.message;
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
