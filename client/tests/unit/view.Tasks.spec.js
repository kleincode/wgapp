// Unit test for views/Tasks.vue

// Libraries
import Vuetify from "vuetify";
import VueRouter from "vue-router";

// Utilities
import {
  checkStatus,
  computeNextDueDay,
  computeNextDueInWeek,
  shiftToNextIntervall,
  isSameWeek,
  mapWeekdayToInt,
  getOnDemandStatus
} from "@/assets/tasksHelper.js";

describe("tasksHelper.js", () => {
  let vuetify, router;

  beforeEach(() => {
    vuetify = new Vuetify();
    router = new VueRouter();
  });

  it("computes weekdays correctly", () => {
    expect(mapWeekdayToInt("sunday")).toBe(0);
    expect(mapWeekdayToInt("monday")).toBe(1);
    expect(mapWeekdayToInt("tuesday")).toBe(2);
    expect(mapWeekdayToInt("thursday")).toBe(3);
    expect(mapWeekdayToInt("wednesday")).toBe(4);
    expect(mapWeekdayToInt("friday")).toBe(5);
    expect(mapWeekdayToInt("saturday")).toBe(6);
  });

  it("isSameWeek correct", () => {
    expect(isSameWeek(new Date("April 2, 2020 10:00:00"), new Date("April 1, 2020 10:00:00"))).toBe(true);
    expect(isSameWeek(new Date("April 3, 2020 10:00:00"), new Date("April 4, 2020 10:00:00"))).toBe(true);
    expect(isSameWeek(new Date("April 1, 2020 10:00:00"), new Date("April 5, 2020 10:00:00"))).toBe(true);
    expect(isSameWeek(new Date("April 5, 2020 10:00:00"), new Date("March 31, 2020 10:00:00"))).toBe(true);
    expect(isSameWeek(new Date("April 5, 2020 10:00:00"), new Date("March 29, 2020 10:00:00"))).toBe(false);
  });

  it("computes nextDueDayInWeek correctly", () => {
    let curDate = new Date("April 2, 2020 10:00:00");
    let prevTempDate = new Date("March 31, 2020 10:00:00");
    let repDayInts = [6];
    let resDate = computeNextDueInWeek(
      curDate,
      repDayInts,
      prevTempDate
    );
    expect(resDate.getDate()).toBe(4);
    expect(resDate.getMonth()).toBe(3);

    prevTempDate = new Date("March 31, 2020 10:00:00");
    repDayInts = [0];
    resDate = computeNextDueInWeek(
      curDate,
      repDayInts,
      prevTempDate
    );
    expect(resDate.getDate()).toBe(5);
    expect(resDate.getMonth()).toBe(3);

    repDayInts = [6, 0];
    prevTempDate = new Date("March 31, 2020 10:00:00");
    resDate = computeNextDueInWeek(
      curDate,
      repDayInts,
      prevTempDate
    );
    expect(resDate.getDate()).toBe(4);
    expect(resDate.getMonth()).toBe(3);

    repDayInts = [4, 0];
    prevTempDate = new Date("April 1, 2020 10:00:00");
    resDate = computeNextDueInWeek(
      curDate,
      repDayInts,
      prevTempDate
    );
    expect(resDate.getDate()).toBe(2);
    expect(resDate.getMonth()).toBe(3);

    repDayInts = [4, 0];
    prevTempDate = new Date("April 2, 2020 10:00:00");
    resDate = computeNextDueInWeek(
      curDate,
      repDayInts,
      prevTempDate
    );
    expect(resDate.getDate()).toBe(2);
    expect(resDate.getMonth()).toBe(3);

    repDayInts = [6, 0];
    prevTempDate = new Date("March 31, 2020 10:00:00");
    resDate = computeNextDueInWeek(
      curDate,
      repDayInts,
      prevTempDate
    );
    expect(resDate.getDate()).toBe(4);
    expect(resDate.getMonth()).toBe(3);

    repDayInts = [3, 5];
    prevTempDate = new Date("April 6, 2020 10:00:00");
    resDate = computeNextDueInWeek(
      curDate,
      repDayInts,
      prevTempDate
    );
    expect(resDate.getDate()).toBe(8);
    expect(resDate.getMonth()).toBe(3);

    repDayInts = [3, 1];
    prevTempDate = new Date("March 31, 2020 10:00:00");
    resDate = computeNextDueInWeek(
      curDate,
      repDayInts,
      prevTempDate
    );
    expect(resDate).toBe(null);

    repDayInts = [1,2,3,4,5,6,0];
    prevTempDate = new Date("April 1, 2020 10:00:00");
    resDate = computeNextDueInWeek(
      curDate,
      repDayInts,
      prevTempDate
    );
    expect(resDate.getDate()).toBe(2);
    expect(resDate.getMonth()).toBe(3);

    curDate = new Date("April 5, 2020 10:00:00");
    repDayInts = [1,2,3,4,5,6,0];
    prevTempDate = new Date("April 1, 2020 10:00:00");
    resDate = computeNextDueInWeek(
      curDate,
      repDayInts,
      prevTempDate
    );
    expect(resDate.getDate()).toBe(5);
    expect(resDate.getMonth()).toBe(3);

    repDayInts = [1,2,3,4,5,6];
    prevTempDate = new Date("April 1, 2020 10:00:00");
    resDate = computeNextDueInWeek(
      curDate,
      repDayInts,
      prevTempDate
    );
    expect(resDate).toBe(null);
  });

  it("shift to next intervall ", () => {
    let date = new Date("April 8, 2020 10:00:00");
    let repEvery = 1;
    let repUnit = 0;
    let res = shiftToNextIntervall(date, repEvery, repUnit);
    expect(res.getDate()).toBe(13);
    expect(res.getMonth()).toBe(3);

    date = new Date("April 8, 2020 10:00:00");
    repEvery = 2;
    repUnit = 0;
    res = shiftToNextIntervall(date, repEvery, repUnit);
    expect(res.getDate()).toBe(20);
    expect(res.getMonth()).toBe(3);

    date = new Date("April 8, 2020 10:00:00");
    repEvery = 1;
    repUnit = 1;
    res = shiftToNextIntervall(date, repEvery, repUnit);
    expect(res.getDate()).toBe(4);
    expect(res.getMonth()).toBe(4);

    date = new Date("April 8, 2020 10:00:00");
    repEvery = 2;
    repUnit = 1;
    res = shiftToNextIntervall(date, repEvery, repUnit);
    expect(res.getDate()).toBe(1);
    expect(res.getMonth()).toBe(5);
  });

  it("computes computeNextDueDay with weeks correctly", () => {
    let curDate = new Date("April 3, 2020 10:00:00");

    //in the future 1 - 1 week
    let startDateInput = new Date("April 6, 2020 10:00:00");
    let repetitionDays = ["thursday", "friday"];
    let repetitionUnit = 0;
    let repetitionEvery = 1;
    let resDate = computeNextDueDay(
      curDate,
      startDateInput,
      repetitionDays,
      repetitionUnit,
      repetitionEvery
    );
    expect(resDate.getDate()).toBe(8);
    expect(resDate.getMonth()).toBe(3);

    //in the future 2 - 1 week
    startDateInput = new Date("April 8, 2020 10:00:00");
    repetitionDays = ["monday"];
    repetitionUnit = 0;
    repetitionEvery = 1;
    resDate = computeNextDueDay(
      curDate,
      startDateInput,
      repetitionDays,
      repetitionUnit,
      repetitionEvery
    );
    expect(resDate.getDate()).toBe(13);
    expect(resDate.getMonth()).toBe(3);

    //in the future 1 - 2 weeks
    startDateInput = new Date("April 6, 2020 10:00:00");
    repetitionDays = ["thursday", "friday"];
    repetitionUnit = 0;
    repetitionEvery = 2;
    resDate = computeNextDueDay(
      curDate,
      startDateInput,
      repetitionDays,
      repetitionUnit,
      repetitionEvery
    );
    expect(resDate.getDate()).toBe(8);
    expect(resDate.getMonth()).toBe(3);

    //in the future 2 - 2 weeks
    startDateInput = new Date("April 8, 2020 10:00:00");
    repetitionDays = ["monday"];
    repetitionUnit = 0;
    repetitionEvery = 2;
    resDate = computeNextDueDay(
      curDate,
      startDateInput,
      repetitionDays,
      repetitionUnit,
      repetitionEvery
    );
    expect(resDate.getDate()).toBe(20);
    expect(resDate.getMonth()).toBe(3);

    //custom - 1
    startDateInput = new Date("March 24, 2020 10:00:00");
    repetitionDays = ["monday"];
    repetitionUnit = 0;
    repetitionEvery = 1;
    resDate = computeNextDueDay(
      curDate,
      startDateInput,
      repetitionDays,
      repetitionUnit,
      repetitionEvery
    );
    expect(resDate.getDate()).toBe(6);
    expect(resDate.getMonth()).toBe(3);

    //custom - 2
    startDateInput = new Date("March 31, 2020 10:00:00");
    repetitionDays = ["monday", "friday"];
    repetitionUnit = 0;
    repetitionEvery = 3;
    resDate = computeNextDueDay(
      curDate,
      startDateInput,
      repetitionDays,
      repetitionUnit,
      repetitionEvery
    );
    expect(resDate.getDate()).toBe(3);
    expect(resDate.getMonth()).toBe(3);

    //custom - 2
    curDate = new Date("April 3, 2020 12:00:00");
    startDateInput = new Date("March 24, 2020 12:00:00");
    repetitionDays = ["friday"];
    repetitionUnit = 0;
    repetitionEvery = 1;
    resDate = computeNextDueDay(
      curDate,
      startDateInput,
      repetitionDays,
      repetitionUnit,
      repetitionEvery
    );
    expect(resDate.getDate()).toBe(3);
    expect(resDate.getMonth()).toBe(3);

    //custom - 3
    curDate = new Date("April 2, 2020 12:00:00");
    startDateInput = new Date("March 24, 2020 12:00:00");
    repetitionDays = ["monday", "tuesday", "thursday", "wednesday", "friday", "saturday", "sunday"];
    repetitionUnit = 0;
    repetitionEvery = 1;
    resDate = computeNextDueDay(
      curDate,
      startDateInput,
      repetitionDays,
      repetitionUnit,
      repetitionEvery
    );
    expect(resDate.getDate()).toBe(2);
    expect(resDate.getMonth()).toBe(3);

    //custom - 4
    curDate = new Date("April 12, 2020 12:00:00");
    startDateInput = new Date("March 14, 2020 12:00:00");
    repetitionDays = ["monday", "wednesday", "friday"];
    repetitionUnit = 0;
    repetitionEvery = 1;
    resDate = computeNextDueDay(
      curDate,
      startDateInput,
      repetitionDays,
      repetitionUnit,
      repetitionEvery
    );
    expect(resDate.getDate()).toBe(13);
    expect(resDate.getMonth()).toBe(3);
  });

  it("computes computeNextDueDay with months correctly", () => {
    let curDate = new Date("April 3, 2020 10:00:00");

    //in the future 1 - 1 month
    let startDateInput = new Date("April 6, 2020 10:00:00");
    let repetitionDays = ["thursday", "friday"];
    let repetitionUnit = 1;
    let repetitionEvery = 1;
    let resDate = computeNextDueDay(
      curDate,
      startDateInput,
      repetitionDays,
      repetitionUnit,
      repetitionEvery
    );
    expect(resDate.getDate()).toBe(8);
    expect(resDate.getMonth()).toBe(3);

    //in the future 2 - 1 month
    startDateInput = new Date("April 8, 2020 10:00:00");
    repetitionDays = ["monday"];
    repetitionUnit = 1;
    repetitionEvery = 1;
    resDate = computeNextDueDay(
      curDate,
      startDateInput,
      repetitionDays,
      repetitionUnit,
      repetitionEvery
    );
    expect(resDate.getDate()).toBe(4);
    expect(resDate.getMonth()).toBe(4);

    //in the future 1 - 2 month
    startDateInput = new Date("April 6, 2020 10:00:00");
    repetitionDays = ["thursday", "friday"];
    repetitionUnit = 1;
    repetitionEvery = 2;
    resDate = computeNextDueDay(
      curDate,
      startDateInput,
      repetitionDays,
      repetitionUnit,
      repetitionEvery
    );
    expect(resDate.getDate()).toBe(8);
    expect(resDate.getMonth()).toBe(3);

    //in the future 2 - 2 month
    startDateInput = new Date("April 8, 2020 10:00:00");
    repetitionDays = ["monday"];
    repetitionUnit = 1;
    repetitionEvery = 2;
    resDate = computeNextDueDay(
      curDate,
      startDateInput,
      repetitionDays,
      repetitionUnit,
      repetitionEvery
    );
    expect(resDate.getDate()).toBe(1);
    expect(resDate.getMonth()).toBe(5);

    //custom - 1
    startDateInput = new Date("March 24, 2020 10:00:00");
    repetitionDays = ["monday"];
    repetitionUnit = 1;
    repetitionEvery = 1;
    resDate = computeNextDueDay(
      curDate,
      startDateInput,
      repetitionDays,
      repetitionUnit,
      repetitionEvery
    );
    expect(resDate.getDate()).toBe(20);
    expect(resDate.getMonth()).toBe(3);

    //custom - 2
    startDateInput = new Date("March 31, 2020 10:00:00");
    repetitionDays = ["monday", "friday"];
    repetitionUnit = 1;
    repetitionEvery = 3;
    resDate = computeNextDueDay(
      curDate,
      startDateInput,
      repetitionDays,
      repetitionUnit,
      repetitionEvery
    );
    expect(resDate.getDate()).toBe(3);
    expect(resDate.getMonth()).toBe(3);

    //custom - 3
    startDateInput = new Date("March 25, 2020 10:00:00");
    repetitionDays = ["monday", "friday"];
    repetitionUnit = 1;
    repetitionEvery = 1;
    resDate = computeNextDueDay(
      curDate,
      startDateInput,
      repetitionDays,
      repetitionUnit,
      repetitionEvery
    );
    expect(resDate.getDate()).toBe(20);
    expect(resDate.getMonth()).toBe(3);

    //custom - 4
    startDateInput = new Date("March 22, 2020 10:00:00");
    repetitionDays = ["saturday"];
    repetitionUnit = 1;
    repetitionEvery = 1;
    resDate = computeNextDueDay(
      curDate,
      startDateInput,
      repetitionDays,
      repetitionUnit,
      repetitionEvery
    );
    expect(resDate.getDate()).toBe(18);
    expect(resDate.getMonth()).toBe(3);
  });

  it("computes getOnDemandStatus correctly", () => {
    let curDate = new Date("April 14, 2020 10:00:00");
    let lastExecution = new Date("April 2, 2020 10:00:00");
    expect(getOnDemandStatus(curDate, lastExecution)).toBe(0);

    curDate = new Date("April 14, 2020 10:00:00");
    lastExecution = new Date("April 14, 2020 09:00:00");
    expect(getOnDemandStatus(curDate, lastExecution)).toBe(2);

  });

  it("computes checkStatus correctly", () => {
    let startDate = new Date("March 1, 2020 10:00:00");
    let curDateBegin = new Date("April 3, 2020 00:00:01");
    let curDateEnd = new Date("April 3, 2020 23:59:59");

    //not missed bc not over
    let repDays = ["monday", "friday"];
    expect(
      checkStatus(
        new Date("March 30, 2020 10:00:00"),
        new Date("April 3, 2020 10:00:00"),
        repDays,
        1,
        0,
        startDate,
        curDateBegin,
        curDateEnd
      )[0]
    ).toBe(1);

    //not missed bc not due
    repDays = ["sunday"];
    expect(
      checkStatus(
        new Date("April 1, 2020 10:00:00"),
        new Date("April 5, 2020 10:00:00"),
        repDays,
        1,
        0,
        startDate,
        curDateBegin,
        curDateEnd
      )[0]
    ).toBe(1);

    //not missed bc second execution not over
    repDays = ["wednesday", "sunday"];
    expect(
      checkStatus(
        new Date("April 2, 2020 10:00:00"),
        new Date("April 9, 2020 10:00:00"),
        repDays,
        1,
        0,
        startDate,
        curDateBegin,
        curDateEnd
      )[0]
    ).toBe(1);
    //missed
    repDays = ["wednesday", "sunday"];
    expect(
      checkStatus(
        new Date("April 1, 2020 10:00:00"),
        new Date("April 9, 2020 10:00:00"),
        repDays,
        1,
        0,
        startDate,
        curDateBegin,
        curDateEnd
      )[0]
    ).toBe(0);

    //missed bc over
    repDays = ["wednesday"];
    expect(
      checkStatus(
        new Date("April 1, 2020 10:00:00"),
        new Date("April 9, 2020 10:00:00"),
        repDays,
        1,
        0,
        startDate,
        curDateBegin,
        curDateEnd
      )[0]
    ).toBe(0);
    //missed bc way over
    expect(
      checkStatus(
        new Date("April 1, 2020 10:00:00"),
        new Date("April 16, 2020 10:00:00"),
        repDays,
        1,
        0,
        startDate,
        curDateBegin,
        curDateEnd
      )[0]
    ).toBe(0);

    //okay bc start in future
    startDate = new Date("May 1, 2020 10:00:00");
    expect(
      checkStatus(
        new Date("April 3, 2020 10:00:00"),
        new Date("April 16, 2020 10:00:00"),
        repDays,
        1,
        0,
        startDate,
        curDateBegin,
        curDateEnd
      )[0]
    ).toBe(2);

    //custom
    startDate = new Date("March 22, 2020 10:00:00");
    repDays = ["saturday"];
    expect(
      checkStatus(
        new Date("March 18, 2020 10:00:00"),
        new Date("April 18, 2020 10:00:00"),
        repDays,
        1,
        1,
        startDate,
        curDateBegin,
        curDateEnd
      )[0]
    ).toBe(0);
  });
});
