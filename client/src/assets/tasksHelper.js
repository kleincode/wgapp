//2=done today, 1=not done but okay, 0=missed
function checkStatus(
  lastExecution,
  nextDueDay,
  repDays,
  repEvery,
  repUnit,
  startDate,
  curDateBegin,
  curDateEnd
) {
  let repDayInts = repDays.map(day => mapWeekdayToInt(day));
  nextDueDay = new Date(nextDueDay);
  if (curDateEnd < startDate) {
    //in the future
    if (curDateBegin < lastExecution || isToday(curDateBegin, lastExecution)) {
      return [2, new Date()];
    }
    return [1, null];
  }
  if (curDateBegin < lastExecution || isToday(curDateBegin, lastExecution)) {
    return [2, new Date()];
  }
  let max = -1;
  let lastDueDay = new Date(curDateBegin);
  for (let i = 0; i < repDayInts.length; i++) {
    if (repDayInts[i] > max && repDayInts[i] < curDateBegin.getDay()) {
      max = repDayInts[i];
    }
  }
  if (max == -1) {
    //change intervall
    lastDueDay = shiftIntervall(nextDueDay, -repEvery, repUnit);
    max = -1;
    for (let i = 0; i < repDayInts.length; i++) {
      if (repDayInts[i] > max) {
        max = repDayInts[i];
      }
    }
  }
  if (max == -1) {
    return;
  }
  lastDueDay.setDate(lastDueDay.getDate() + (max - lastDueDay.getDay()));

  lastDueDay.setHours(0, 0, 0, 0);
  let endLastDueDay = new Date(lastDueDay);
  endLastDueDay.setHours(23, 59, 59, 0);
  if (lastExecution < lastDueDay) {
    return [0, lastDueDay];
  }
  return [1, lastDueDay];
}

function isToday(date, curDate) {
  return (
    date.getDate() == curDate.getDate() &&
    date.getMonth() == curDate.getMonth() &&
    date.getYear() == curDate.getYear()
  );
}

function computeNextDueDay(
  curDate,
  startDateInput,
  repetitionDays,
  repetitionUnit,
  repetitionEvery
) {
  let repDayInts = repetitionDays.map(day => mapWeekdayToInt(day));
  let startDate = new Date(startDateInput);
  if (curDate < startDate) {
    let res = computeNextDueInWeek(curDate, repDayInts, startDate);
    if (res == null) {
      startDate = shiftToNextIntervall(
        startDate,
        repetitionEvery,
        repetitionUnit
      );
      res = computeNextDueInWeek(curDate, repDayInts, startDate);
    }
    return res;
  } else {
    let tempDate = new Date(startDate);
    let prevTempDate;
    while (curDate > tempDate) {
      prevTempDate = new Date(tempDate);
      tempDate = shiftToNextIntervall(
        tempDate,
        repetitionEvery,
        repetitionUnit
      );
    }
    let res = computeNextDueInWeek(curDate, repDayInts, prevTempDate);
    if (res == null) {
      startDate = shiftToNextIntervall(
        prevTempDate,
        repetitionEvery,
        repetitionUnit
      );
      res = computeNextDueInWeek(curDate, repDayInts, prevTempDate);
    }
    return res;
  }
}

function isSameWeek(d1, d2) {
  let date1 = new Date(d1),
    date2 = new Date(d2);
  if (date1.getDay() == 0) {
    date1.setDate(date1.getDate() - 6);
  } else {
    date1.setDate(date1.getDate() - date1.getDay() + 1);
  }
  if (date2.getDay() == 0) {
    date2.setDate(date2.getDate() - 6);
  } else {
    date2.setDate(date2.getDate() - date2.getDay() + 1);
  }
  return isToday(date1, date2);
}

function computeNextDueInWeek(curDate, repDayInts, prevTempDate) {
  prevTempDate = new Date(prevTempDate);
  let day = prevTempDate.getDay();
  if (curDate.getDay() == 0 && repDayInts.includes(0)) {
    return curDate;
  }
  if (day > 0) {
    let minShift = 8;
    for (let i = 0; i < repDayInts.length; i++) {
      if (repDayInts[i] != 0) {
        if (repDayInts[i] >= day && repDayInts[i] < minShift) {
          let sameWeek = isSameWeek(curDate, prevTempDate);
          if ((sameWeek && repDayInts[i] >= curDate.getDay()) || !sameWeek) {
            minShift = repDayInts[i];
          }
        }
      } else {
        if (7 < minShift) {
          minShift = 7;
        }
      }
    }
    if (minShift == 7) {
      prevTempDate.setDate(
        prevTempDate.getDate() + (6 - prevTempDate.getDay() + 1)
      );
      return prevTempDate;
    }
    prevTempDate.setDate(
      prevTempDate.getDate() + (minShift - prevTempDate.getDay())
    );
    if (prevTempDate < curDate || minShift == 8) {
      return null;
    }
    return prevTempDate;
  } else {
    return null;
  }
}

function shiftToNextIntervall(date, repEvery, repUnit) {
  if (repUnit == 0) {
    date.setDate(date.getDate() + 7 * repEvery);
    return setToMonday(date);
  } else {
    date.setDate(date.getDate() + 28 * repEvery);
    return setToMonday(date);
  }
}

function shiftIntervall(date, repEvery, repUnit) {
  if (repUnit == 0) {
    date.setDate(date.getDate() + 7 * repEvery);
    return date;
  } else {
    date.setDate(date.getDate() + 28 * repEvery);
    return date;
  }
}

function setToMonday(date) {
  if (date.getDay() == 0) {
    date.setDate(date.getDate() - 6);
  } else {
    date.setDate(date.getDate() - date.getDay() + 1);
  }
  return date;
}

function getOnDemandStatus(curDate, lastExecution) {
  if (lastExecution.toString() == "Invalid Date") {
    return 0;
  }
  curDate.setHours(curDate.getHours() - 2);
  if (curDate > lastExecution) {
    return 0;
  } else {
    return 2;
  }
}

function getSingleStatus(dueDate, lastExecution) {
  let curDate = new Date();
  if (curDate < dueDate) {
    if (lastExecution.getTime() < 997590000000) {
      // Januar 2000
      return 0;
    } else {
      return 2;
    }
  } else {
    if (lastExecution.getTime() < 997590000000) {
      return 1;
    } else {
      return 2;
    }
  }
}

function formatDateString(date) {
  let curDate = new Date();
  if (
    date.getDate() == curDate.getDate() &&
    date.getMonth() == curDate.getMonth() &&
    date.getYear() == curDate.getYear()
  ) {
    return "Today";
  }
  curDate.setDate(curDate.getDate() + 1);
  if (
    date.getDate() == curDate.getDate() &&
    date.getMonth() == curDate.getMonth() &&
    date.getYear() == curDate.getYear()
  ) {
    return "Tomorrow";
  }
  return (
    mapIntoToWeekday(date.getDay()) +
    ", " +
    date.getDate() +
    ". " +
    (date.getMonth() + 1)
  );
}

function mapIntoToWeekday(day) {
  switch (day) {
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Thursday";
    case 4:
      return "Wednesday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    case 0:
      return "Sunday";
  }
}

function mapWeekdayToInt(repetitionDay) {
  switch (repetitionDay) {
    case "monday":
      return 1;
    case "tuesday":
      return 2;
    case "thursday":
      return 3;
    case "wednesday":
      return 4;
    case "friday":
      return 5;
    case "saturday":
      return 6;
    case "sunday":
      return 0;
  }
}

export {
  checkStatus,
  computeNextDueDay,
  computeNextDueInWeek,
  isToday,
  shiftToNextIntervall,
  isSameWeek,
  mapWeekdayToInt,
  mapIntoToWeekday,
  getOnDemandStatus,
  getSingleStatus,
  formatDateString
};
