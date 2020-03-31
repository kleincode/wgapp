<template>
  <div>
    <div class="md-layout md-gutter md-alignment-top-center">
      <md-card class="view-card">
        <md-card-header>
          <div class="md-title">Add household</div>
        </md-card-header>
        <md-card-content>
          <form @submit.prevent="formSubmit" :auto-complete="false">
            <md-field>
              <label>Household ID</label>
              <md-input
                v-model="householdId"
                required
                :maxlength="32"
              ></md-input>
            </md-field>
            <md-field>
              <label>Security Code</label>
              <md-input
                v-model="securityCode"
                required
                :maxlength="6"
              ></md-input>
            </md-field>
            <md-button class="md-raised md-primary" type="submit">
              Check
            </md-button>
          </form>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>
<script>
export default {
  name: "AddHousehold",
  data: () => ({
    householdId: "",
    securityCode: ""
  }),
  methods: {
    formSubmit() {
      alert("form submitted");
    }
  },
  mounted() {
    this.householdId = this.$route.query.h || "";
    this.securityCode = this.$route.query.s || "";
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
