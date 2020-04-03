// Unit test for views/Tasks.vue

// Libraries
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import localVue from "./setup";

// Components
import Tasks from '@/views/Tasks.vue';

// Utilities
import { shallowMount } from '@vue/test-utils';

describe('Tasks.vue', () => {
  let vuetify, router;

  beforeEach(() => {
    vuetify = new Vuetify();
    router = new VueRouter()
  });

  // Two simple test cases below

  it('has the right title', () => {
    //Shallow mount: child components get stubbed
    const wrapper = shallowMount(Tasks, {
      localVue,
      vuetify,
      router,
      propsData: {}
    });
    const title = wrapper.find('h1.display-2')

    expect(title.text()).toBe('Tasks')
  });

  it("computes weekdays correctly", () => {
    const wrapper = shallowMount(Tasks, {
      localVue,
      vuetify,
      router,
      propsData: {}
    });
    expect(wrapper.vm.mapWeekdayToInt("sunday")).toBe(0);
    expect(wrapper.vm.mapWeekdayToInt("monday")).toBe(1);
    expect(wrapper.vm.mapWeekdayToInt("tuesday")).toBe(2);
    expect(wrapper.vm.mapWeekdayToInt("thursday")).toBe(3);
    expect(wrapper.vm.mapWeekdayToInt("wednesday")).toBe(4);
    expect(wrapper.vm.mapWeekdayToInt("friday")).toBe(5);
    expect(wrapper.vm.mapWeekdayToInt("saturday")).toBe(6);
  });

  it("computes nextDueDayInWeek correctly", () => {
    const wrapper = shallowMount(Tasks, {
      localVue,
      vuetify,
      router,
      propsData: {}
    });
    let curDate = new Date('April 2, 2020 10:00:00');
    let prevTempDate = new Date('March 31, 2020 10:00:00');
    let repDayInts = [6];
    let resDate = wrapper.vm.computeNextDueInWeek(curDate, repDayInts, prevTempDate);
    expect(resDate.getDate()).toBe(4);
    expect(resDate.getMonth()).toBe(3);

    prevTempDate = new Date('March 31, 2020 10:00:00');
    repDayInts = [0];
    resDate = wrapper.vm.computeNextDueInWeek(curDate, repDayInts, prevTempDate);
    expect(resDate.getDate()).toBe(5);
    expect(resDate.getMonth()).toBe(3);

    repDayInts = [6, 0];
    prevTempDate = new Date('March 31, 2020 10:00:00');
    resDate = wrapper.vm.computeNextDueInWeek(curDate, repDayInts, prevTempDate);
    expect(resDate.getDate()).toBe(4);
    expect(resDate.getMonth()).toBe(3);

    repDayInts = [4, 0];
    prevTempDate = new Date('April 1, 2020 10:00:00');
    resDate = wrapper.vm.computeNextDueInWeek(curDate, repDayInts, prevTempDate);
    expect(resDate.getDate()).toBe(2);
    expect(resDate.getMonth()).toBe(3);

    repDayInts = [4, 0];
    prevTempDate = new Date('April 2, 2020 10:00:00');
    resDate = wrapper.vm.computeNextDueInWeek(curDate, repDayInts, prevTempDate);
    expect(resDate.getDate()).toBe(2);
    expect(resDate.getMonth()).toBe(3);


    repDayInts = [6, 0];
    prevTempDate = new Date('March 31, 2020 10:00:00');
    resDate = wrapper.vm.computeNextDueInWeek(curDate, repDayInts, prevTempDate);
    expect(resDate.getDate()).toBe(4);
    expect(resDate.getMonth()).toBe(3);

    repDayInts = [3, 5];
    prevTempDate = new Date('April 6, 2020 10:00:00');
    resDate = wrapper.vm.computeNextDueInWeek(curDate, repDayInts, prevTempDate);
    expect(resDate.getDate()).toBe(8);
    expect(resDate.getMonth()).toBe(3);

    repDayInts = [3, 1];
    prevTempDate = new Date('March 31, 2020 10:00:00');
    resDate = wrapper.vm.computeNextDueInWeek(curDate, repDayInts, prevTempDate);
    expect(resDate).toBe(null);
  });

  it ("shift to next intervall ", () => {
    const wrapper = shallowMount(Tasks, {
      localVue,
      vuetify,
      router,
      propsData: {}
    });
    let date = new Date('April 8, 2020 10:00:00');
    let repEvery = 1;
    let repUnit = 0;
    let res = wrapper.vm.shiftToNextIntervall(date, repEvery, repUnit);
    expect(res.getDate()).toBe(13);
    expect(res.getMonth()).toBe(3);

    date = new Date('April 8, 2020 10:00:00');
    repEvery = 2;
    repUnit = 0;
    res = wrapper.vm.shiftToNextIntervall(date, repEvery, repUnit);
    expect(res.getDate()).toBe(20);
    expect(res.getMonth()).toBe(3);

    date = new Date('April 8, 2020 10:00:00');
    repEvery = 1;
    repUnit = 1;
    res = wrapper.vm.shiftToNextIntervall(date, repEvery, repUnit);
    expect(res.getDate()).toBe(4);
    expect(res.getMonth()).toBe(4);

    date = new Date('April 8, 2020 10:00:00');
    repEvery = 2;
    repUnit = 1;
    res = wrapper.vm.shiftToNextIntervall(date, repEvery, repUnit);
    expect(res.getDate()).toBe(1);
    expect(res.getMonth()).toBe(5);
  });

  it ("computes computeNextDueDay with weeks correctly", () => {
    const wrapper = shallowMount(Tasks, {
      localVue,
      vuetify,
      router,
      propsData: {}
    });
    let curDate = new Date('April 3, 2020 10:00:00');

    //in the future 1 - 1 week
    let startDateInput = new Date('April 6, 2020 10:00:00');
    let repetitionDays = ["thursday", "friday"];
    let repetitionUnit = 0;
    let repetitionEvery = 1;
    let resDate = wrapper.vm.computeNextDueDay(curDate, startDateInput, repetitionDays, repetitionUnit, repetitionEvery);
    expect(resDate.getDate()).toBe(8);
    expect(resDate.getMonth()).toBe(3);

    //in the future 2 - 1 week
    startDateInput = new Date('April 8, 2020 10:00:00');
    repetitionDays = ["monday"];
    repetitionUnit = 0;
    repetitionEvery = 1;
    resDate = wrapper.vm.computeNextDueDay(curDate, startDateInput, repetitionDays, repetitionUnit, repetitionEvery);
    expect(resDate.getDate()).toBe(13);
    expect(resDate.getMonth()).toBe(3);

    //in the future 1 - 2 weeks
    startDateInput = new Date('April 6, 2020 10:00:00');
    repetitionDays = ["thursday", "friday"];
    repetitionUnit = 0;
    repetitionEvery = 2;
    resDate = wrapper.vm.computeNextDueDay(curDate, startDateInput, repetitionDays, repetitionUnit, repetitionEvery);
    expect(resDate.getDate()).toBe(8);
    expect(resDate.getMonth()).toBe(3);

    //in the future 2 - 2 weeks
    startDateInput = new Date('April 8, 2020 10:00:00');
    repetitionDays = ["monday"];
    repetitionUnit = 0;
    repetitionEvery = 2;
    resDate = wrapper.vm.computeNextDueDay(curDate, startDateInput, repetitionDays, repetitionUnit, repetitionEvery);
    expect(resDate.getDate()).toBe(20);
    expect(resDate.getMonth()).toBe(3);

    //custom - 1
    startDateInput = new Date('March 24, 2020 10:00:00');
    repetitionDays = ["monday"];
    repetitionUnit = 0;
    repetitionEvery = 1;
    resDate = wrapper.vm.computeNextDueDay(curDate, startDateInput, repetitionDays, repetitionUnit, repetitionEvery);
    expect(resDate.getDate()).toBe(6);
    expect(resDate.getMonth()).toBe(3);

    //custom - 2
    startDateInput = new Date('March 31, 2020 10:00:00');
    repetitionDays = ["monday", "friday"];
    repetitionUnit = 0;
    repetitionEvery = 3;
    resDate = wrapper.vm.computeNextDueDay(curDate, startDateInput, repetitionDays, repetitionUnit, repetitionEvery);
    expect(resDate.getDate()).toBe(3);
    expect(resDate.getMonth()).toBe(3);

    //custom - 2
    console.log("### Start deubg");
    curDate = new Date('April 3, 2020 12:00:00');
    startDateInput = new Date('March 24, 2020 12:00:00');
    repetitionDays = ["friday"];
    repetitionUnit = 0;
    repetitionEvery = 1;
    resDate = wrapper.vm.computeNextDueDay(curDate, startDateInput, repetitionDays, repetitionUnit, repetitionEvery);
    console.log("resDate: " + resDate);
    expect(resDate.getDate()).toBe(3);
    expect(resDate.getMonth()).toBe(3);

  });

  it ("computes computeNextDueDay with months correctly", () => {
    const wrapper = shallowMount(Tasks, {
      localVue,
      vuetify,
      router,
      propsData: {}
    });
    let curDate = new Date('April 3, 2020 10:00:00');

    //in the future 1 - 1 month
    let startDateInput = new Date('April 6, 2020 10:00:00');
    let repetitionDays = ["thursday", "friday"];
    let repetitionUnit = 1;
    let repetitionEvery = 1;
    let resDate = wrapper.vm.computeNextDueDay(curDate, startDateInput, repetitionDays, repetitionUnit, repetitionEvery);
    expect(resDate.getDate()).toBe(8);
    expect(resDate.getMonth()).toBe(3);

    //in the future 2 - 1 month
    startDateInput = new Date('April 8, 2020 10:00:00');
    repetitionDays = ["monday"];
    repetitionUnit = 1;
    repetitionEvery = 1;
    resDate = wrapper.vm.computeNextDueDay(curDate, startDateInput, repetitionDays, repetitionUnit, repetitionEvery);
    expect(resDate.getDate()).toBe(4);
    expect(resDate.getMonth()).toBe(4);

    //in the future 1 - 2 month
    startDateInput = new Date('April 6, 2020 10:00:00');
    repetitionDays = ["thursday", "friday"];
    repetitionUnit = 1;
    repetitionEvery = 2;
    resDate = wrapper.vm.computeNextDueDay(curDate, startDateInput, repetitionDays, repetitionUnit, repetitionEvery);
    expect(resDate.getDate()).toBe(8);
    expect(resDate.getMonth()).toBe(3);

    //in the future 2 - 2 month
    startDateInput = new Date('April 8, 2020 10:00:00');
    repetitionDays = ["monday"];
    repetitionUnit = 1;
    repetitionEvery = 2;
    resDate = wrapper.vm.computeNextDueDay(curDate, startDateInput, repetitionDays, repetitionUnit, repetitionEvery);
    expect(resDate.getDate()).toBe(1);
    expect(resDate.getMonth()).toBe(5);

    //custom - 1
    startDateInput = new Date('March 24, 2020 10:00:00');
    repetitionDays = ["monday"];
    repetitionUnit = 1;
    repetitionEvery = 1;
    resDate = wrapper.vm.computeNextDueDay(curDate, startDateInput, repetitionDays, repetitionUnit, repetitionEvery);
    expect(resDate.getDate()).toBe(20);
    expect(resDate.getMonth()).toBe(3);

    //custom - 2
    startDateInput = new Date('March 31, 2020 10:00:00');
    repetitionDays = ["monday", "friday"];
    repetitionUnit = 1;
    repetitionEvery = 3;
    resDate = wrapper.vm.computeNextDueDay(curDate, startDateInput, repetitionDays, repetitionUnit, repetitionEvery);
    expect(resDate.getDate()).toBe(3);
    expect(resDate.getMonth()).toBe(3);

    //custom - 3
    startDateInput = new Date('March 25, 2020 10:00:00');
    repetitionDays = ["monday", "friday"];
    repetitionUnit = 1;
    repetitionEvery = 1;
    resDate = wrapper.vm.computeNextDueDay(curDate, startDateInput, repetitionDays, repetitionUnit, repetitionEvery);
    expect(resDate.getDate()).toBe(20);
    expect(resDate.getMonth()).toBe(3);

    //custom - 4
    startDateInput = new Date('March 22, 2020 10:00:00');
    repetitionDays = ["saturday"];
    repetitionUnit = 1;
    repetitionEvery = 1;
    resDate = wrapper.vm.computeNextDueDay(curDate, startDateInput, repetitionDays, repetitionUnit, repetitionEvery);
    expect(resDate.getDate()).toBe(18);
    expect(resDate.getMonth()).toBe(3);
  });

  it ("computes checkStatus", () => {
    const wrapper = shallowMount(Tasks, {
      localVue,
      vuetify,
      router,
      propsData: {}
    });
    let curDate = new Date('April 3, 2020 10:00:00');
    let startDate = new Date('March 1, 2020 10:00:00');

    //not missed bc not over
    let repDays = ["monday","friday"];
    expect(wrapper.vm.checkStatus(new Date('March 30, 2020 10:00:00'), new Date('April 3, 2020 10:00:00'), repDays, 1, 0, startDate, curDate)).toBe(1);

    //not missed bc not due
    repDays = ["sunday"];
    expect(wrapper.vm.checkStatus(new Date('April 1, 2020 10:00:00'), new Date('April 5, 2020 10:00:00'), repDays, 1, 0, startDate, curDate)).toBe(1);

    //not missed bc second execution not over
    repDays = ["wednesday", "sunday"];
    expect(wrapper.vm.checkStatus(new Date('April 2, 2020 10:00:00'), new Date('April 9, 2020 10:00:00'), repDays, 1, 0, startDate, curDate)).toBe(1);
    //missed
    repDays = ["wednesday", "sunday"];
    expect(wrapper.vm.checkStatus(new Date('April 1, 2020 10:00:00'), new Date('April 9, 2020 10:00:00'), repDays, 1, 0, startDate, curDate)).toBe(0);

    //missed bc over
    repDays = ["wednesday"];
    expect(wrapper.vm.checkStatus(new Date('April 1, 2020 10:00:00'), new Date('April 9, 2020 10:00:00'), repDays, 1, 0, startDate, curDate)).toBe(0);
    //missed bc way over
    expect(wrapper.vm.checkStatus(new Date('April 1, 2020 10:00:00'), new Date('April 16, 2020 10:00:00'), repDays, 1, 0, startDate, curDate)).toBe(0);

    
    //okay bc start in future 
    startDate = new Date('May 1, 2020 10:00:00');
    expect(wrapper.vm.checkStatus(new Date('April 1, 2020 10:00:00'), new Date('April 16, 2020 10:00:00'), repDays, 1, 0, startDate, curDate)).toBe(1);
    
    //custom 
    startDate = new Date('March 22, 2020 10:00:00');
    repDays = ["saturday"];
    expect(wrapper.vm.checkStatus(new Date('March 18, 2020 10:00:00'), new Date('April 18, 2020 10:00:00'), repDays, 1, 1, startDate, curDate)).toBe(0);

  });
});