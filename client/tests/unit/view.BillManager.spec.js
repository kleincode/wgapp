// Unit test for views/Tasks.vue

// Libraries
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import localVue from "./setup";

// Components
import BillManager from "@/views/finances/BillManager.vue";

// Utilities
import { shallowMount, createWrapper } from "@vue/test-utils";

describe("BillManager.vue", () => {
  let vuetify, router;

  beforeEach(() => {
    vuetify = new Vuetify();
    router = new VueRouter();
  });

  it("monthly fac is correct", () => {
    const wrapper = shallowMount(BillManager, {
      localVue,
      vuetify,
      router,
      propsData: {}
    });
    expect(wrapper.vm.getMonthlyFac(new Date("April 2, 2020 10:00:00"), new Date("April 12, 2020 10:00:00"))).toBe(0);
    expect(wrapper.vm.getMonthlyFac(new Date("March 2, 2020 10:00:00"), new Date("April 2, 2020 10:00:00"))).toBe(1);
    expect(wrapper.vm.getMonthlyFac(new Date("February 2, 2020 10:00:00"), new Date("April 2, 2020 10:00:00"))).toBe(2);
    expect(wrapper.vm.getMonthlyFac(new Date("January 2, 2020 10:00:00"), new Date("April 2, 2020 10:00:00"))).toBe(3);
    expect(wrapper.vm.getMonthlyFac(new Date("December 2, 2019 10:00:00"), new Date("April 2, 2020 10:00:00"))).toBe(4);
    expect(wrapper.vm.getMonthlyFac(new Date("November 2, 2019 10:00:00"), new Date("April 2, 2020 10:00:00"))).toBe(5);
  });
})