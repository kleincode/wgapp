// Unit test for views/Tasks.vue

// Libraries
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import localVue from "./setup";

// Components
import BillManager from "@/components/BillManager.vue";

// Utilities
import { shallowMount } from "@vue/test-utils";
import { getMonthlyFac } from "@/assets/billingCalculator.js";

describe("BillManager.vue", () => {
  var vuetify, router;

  beforeEach(() => {
    vuetify = new Vuetify();
    router = new VueRouter();
  });

  it("monthly fac is correct", () => {
    expect(
      getMonthlyFac(
        new Date("April 2, 2020 10:00:00"),
        new Date("April 12, 2020 10:00:00")
      )
    ).toBe(0);
    expect(
      getMonthlyFac(
        new Date("March 2, 2020 10:00:00"),
        new Date("April 2, 2020 10:00:00")
      )
    ).toBe(1);
    expect(
      getMonthlyFac(
        new Date("February 2, 2020 10:00:00"),
        new Date("April 2, 2020 10:00:00")
      )
    ).toBe(2);
    expect(
      getMonthlyFac(
        new Date("January 2, 2020 10:00:00"),
        new Date("April 2, 2020 10:00:00")
      )
    ).toBe(3);
    expect(
      getMonthlyFac(
        new Date("December 2, 2019 10:00:00"),
        new Date("April 2, 2020 10:00:00")
      )
    ).toBe(4);
    expect(
      getMonthlyFac(
        new Date("November 2, 2019 10:00:00"),
        new Date("April 2, 2020 10:00:00")
      )
    ).toBe(5);
  });
});
