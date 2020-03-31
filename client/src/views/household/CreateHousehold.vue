<template>
  <div>
    <div class="md-layout md-gutter md-alignment-top-center">
      <md-card class="view-card">
        <md-card-header>
          <div class="md-title">Create household</div>
        </md-card-header>
        <md-card-content>
          <md-steppers :md-active-step.sync="active" md-vertical md-linear>
            <md-step
              id="first"
              md-label="Create new household"
              :md-editable="false"
              :md-done.sync="first"
            >
              <p>
                Please give your household a sweet little name. You will be able
                to change it later.
              </p>
              <form @submit.prevent="submitStep(0)" :auto-complete="false">
                <md-field>
                  <label>Household name</label>
                  <md-input v-model="householdName" required></md-input>
                </md-field>
                <md-button class="md-raised md-primary" type="submit"
                  >Continue</md-button
                >
              </form>
            </md-step>

            <md-step
              id="second"
              md-label="Second Step"
              :md-editable="false"
              :md-done.sync="second"
            >
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestias doloribus eveniet quaerat modi cumque quos sed,
                temporibus nemo eius amet aliquid, illo minus blanditiis
                tempore, dolores voluptas dolore placeat nulla.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestias doloribus eveniet quaerat modi cumque quos sed,
                temporibus nemo eius amet aliquid, illo minus blanditiis
                tempore, dolores voluptas dolore placeat nulla.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestias doloribus eveniet quaerat modi cumque quos sed,
                temporibus nemo eius amet aliquid, illo minus blanditiis
                tempore, dolores voluptas dolore placeat nulla.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestias doloribus eveniet quaerat modi cumque quos sed,
                temporibus nemo eius amet aliquid, illo minus blanditiis
                tempore, dolores voluptas dolore placeat nulla.
              </p>
              <md-button class="md-raised md-primary" @click="submitStep(1)"
                >Continue</md-button
              >
            </md-step>

            <md-step
              id="third"
              md-label="Third Step"
              :md-editable="false"
              :md-done.sync="third"
            >
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestias doloribus eveniet quaerat modi cumque quos sed,
                temporibus nemo eius amet aliquid, illo minus blanditiis
                tempore, dolores voluptas dolore placeat nulla.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestias doloribus eveniet quaerat modi cumque quos sed,
                temporibus nemo eius amet aliquid, illo minus blanditiis
                tempore, dolores voluptas dolore placeat nulla.
              </p>
              <md-button class="md-raised md-primary" @click="submitStep(2)"
                >Done</md-button
              >
            </md-step>
          </md-steppers>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>
<script>
export default {
  name: "CreateHousehold",
  data: () => ({
    active: "first",
    first: false,
    second: false,
    third: false,
    householdName: "My household"
  }),
  methods: {
    submitStep(index) {
      switch (index) {
        case 0:
          this.first = true;
          this.active = "second";
          break;
        case 1:
          this.second = true;
          this.active = "third";
          break;
        case 2:
          this.third = true;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.view-card {
  min-width: 50%;
  max-width: 90%;
  width: 700px;
}
</style>
