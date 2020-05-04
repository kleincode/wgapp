<template>
  <HelpArticle title="Tasks" :path="path">
    <template v-slot:content>
      <div class="headline mb-1 font-weight-bold">Tasks</div>
      <p class="text-justify body-1">
        Your turn to clean the bathroom! No, I already cleaned last week. Stop
        arguing! Distribute and document all your tasks here.
      </p>
      <div class="title mb-1">First Task</div>
      <p class="text-justify body-1">
        With the round plus in the upper right corner you can create new tasks.
        You can divide your tasks into three categories:
      </p>
      <p class="text-justify body-1">
        <b>Repeating tasks:</b> For classic tasks, such as cleaning the
        bathroom, which must be made regularly, there is the "Repeating" mode.
        Here you can set a titel and the "Member mode".With this setting you can
        assign always the task to the same person or you can switch through.
        Under "Time and Date" you can then select the starting event and set
        repetitions. First select on which days of the week and then after how
        many weeks or months it should be repeated.
      </p>
      <p class="text-justify body-1">
        <b>Singel tasks:</b> For a one-time task, you can choose the mode
        "Single". Since the task is only available once, the setting "Member
        mode" is deactivated here. So select someone and set the date of the
        task.
      </p>
      <p class="text-justify body-1">
        <b>On-Demand tasks:</b> There are tasks that do not have to be done
        every week, but are more irregular. For example, taking out the garbage
        depends on how much was cooked or bought throug out a day. Therefore we
        got "on-demand tasks". Similar to the "Repeating Tasks" you can choose
        the "Member mode" again, but though the regularity is not given the time
        selection is deactivated.
      </p>
      <v-alert type="info" color="primary lighten-1"
        >Don't forget to active the Toggle Reminder, so you receive
        notifications when things need to be done.</v-alert
      >

      <div class="title mb-1">Upcoming Tasks</div>
      <p class="text-justify body-1">
        Here you will find all upcoming tasks, divided into "Timed Tasks" and
        "On-Demand Tasks". Each of the three task categories has a different
        colour in the display. Next to each task there are different options.
        Besides changing and checking off, there is also the possibility to send
        a reminder to the person who is assigned.
      </p>
      <div class="title mb-1">Recently finished tasks</div>
      <p class="text-justify body-1">
        All tasks completed so far are noted and documented here so that
        everyone can see when what was done.
      </p>
      <v-alert type="info" color="primary lighten-1"
        >If someone takes over the task of another person, he can simply check
        off the task himself. This will be recorded in the history. Iteration
        will continue normally.
      </v-alert>
    </template>
  </HelpArticle>
</template>
<script>
import HelpArticle from "@/components/HelpArticle.vue";
export default {
  name: "TasksHelp",
  components: { HelpArticle },
  data: () => ({
    path: [
      {
        text: "Jeff",
        to: { name: "Help" },
        exact: true,
        disabled: false
      },
      {
        text: "Tasks",
        disabled: true,
        exact: true,
        to: { name: "Help" }
      }
    ]
  })
};
</script>
