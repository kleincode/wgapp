<template>
  <div>
    <div class="md-layout md-gutter md-alignment-top-center">
      <md-card class="editTask-card">
        <md-card-header>
          <div class="div-flex md-title">Edit Task - {{name}}</div>
        </md-card-header>
        <md-card-content>
          <div class="md-layout md-gutter md-alignment-top-center fill-width">
            <div class="md-layout-item">
              <md-field>
                <label>Name</label>
                <md-input v-model="name"></md-input>
              </md-field>
              <div class="md-subheading">Member mode</div>
              <div class="md-layout md-gutter md-alignment-center-left fill-width">
                <div class="md-layout-item">
                  <md-radio class="md-primary" v-model="iterating" :value="true">Single</md-radio>
                </div>
                <div class="md-layout-item">
                  <md-field>
                    <label for="member">Choose Member</label>
                    <md-select v-model="member" name="member" id="member" :disabled="!iterating">
                      <md-option value="felix">Felix</md-option>
                      <md-option value="matti">Matti</md-option>
                    </md-select>
                  </md-field>
                </div>
              </div>
              <md-radio class="md-primary" v-model="iterating" :value="false">Iterating</md-radio>
            </div>
            <div class="md-layout-item md-size-30" style="text-align: center;">
              <md-icon class="md-size-4x">bathtub</md-icon>
              <br />
              <md-button>Change icon</md-button>
            </div>
          </div>
          <div class="md-subheading" style="margin-top: 1em">Repetition</div>
          <div>
            <md-switch class="md-primary" v-model="days" value="monday">Monday</md-switch>
            <md-switch class="md-primary" v-model="days" value="tuesday">Tuesday</md-switch>
            <md-switch class="md-primary" v-model="days" value="wednesday">Wednesday</md-switch>
            <md-switch class="md-primary" v-model="days" value="thursday">Thursday</md-switch>
            <md-switch class="md-primary" v-model="days" value="friday">Friday</md-switch>
            <md-switch class="md-primary" v-model="days" value="saturday">Saturday</md-switch>
            <md-switch class="md-primary" v-model="days" value="sunday">Sunday</md-switch>
          </div>
          <md-field>
            <label>Time</label>
            <md-input v-model="time"></md-input>
          </md-field>
          <div class="md-layout div-flex" style="display:flex; align-items: center">
            <div class="md-layout-item md-size-15">
              <p>Repeat every:</p>
            </div>
            <div class="md-layout-item" style="margin: 0em 1em 0em 1em">
              <md-field md-inline>
                <label>Repetition count</label>
                <md-input v-model="repetition"></md-input>
              </md-field>
            </div>
            <div class="md-layout-item">
              <md-field>
                <label for="repetition_unit">Repetition unit</label>
                <md-select v-model="repetition_unit" name="repetition_unit" id="repetition_unit">
                  <md-option value="weeks">Weeks</md-option>
                  <md-option value="months">Months</md-option>
                </md-select>
              </md-field>
            </div>
          </div>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>
<script>
export default {
  name: "EditTask",
  data: () => ({
    name: "Bad putzen",
    iterating: true,
    member: "none",
    days: [],
    time: "",
    repetition: "",
    repetition_unit: ""
  })
};
</script>
<style lang="scss" scoped>
.editTask-card {
  min-width: 50%;
  max-width: 90%;
  width: 700px;
}
.fill-width {
  width: 100%;
}

.div-flex {
  display: flex;
}
</style>