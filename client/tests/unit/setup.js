// Import this file in all unit tests!
// Libraries
import Vue from "vue";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import axios from "axios";
import VueAxios from "vue-axios";
import { createLocalVue } from "@vue/test-utils";

// Vuetify needs to be registered globally
Vue.use(Vuetify);

//Mock axios
jest.mock("axios");
axios.get.mockResolvedValue({
  data: {
    success: true,
    message: "This is a fake response. Deal with it.",
    data: []
  }
});

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(VueAxios, axios);

export default localVue;
