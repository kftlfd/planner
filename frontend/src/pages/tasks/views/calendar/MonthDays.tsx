import React from "react";
import {
  getDaysInMonth,
  addDays,
  startOfMonth,
  lastDayOfMonth,
  isSameDay,
} from "date-fns";

import type { ITask } from "app/types/tasks.types";

import { CalendarDay } from "./CalendarDay";
import { getDayTimestamp, TaskDayTimestamp } from "./utils";

type MonthDaysProps = {
  tasksByDate: { [timestamp: TaskDayTimestamp]: ITask[] };
  selectedDate: Date;
  selectDate: (day: Date) => void;
  tasksLoaded: boolean;
};

export const MonthDays: React.FC<MonthDaysProps> = ({
  selectedDate,
  selectDate,
  tasksLoaded,
  tasksByDate,
}) => {
  function getDays(
    firstDate: Date,
    nDays: number,
    isPrev: boolean = false,
    isCurr: boolean = false
  ) {
    let days = Array(nDays)
      .fill(0)
      .map((_, i) => {
        const day = addDays(firstDate, isPrev ? -i : i);
        const tasks = tasksByDate[getDayTimestamp(day)] || [];
        const doneCount = tasks.reduce(
          (count, task) => count + (task.done === true ? 1 : 0),
          0
        );
        const notDoneCount = tasks.length - doneCount;

        return (
          <CalendarDay
            key={`${day.toISOString()}`}
            day={day}
            isSelected={isSameDay(day, selectedDate)}
            onClick={() => selectDate(day)}
            notCurrentMonth={!isCurr}
            doneCount={doneCount}
            notDoneCount={notDoneCount}
            tasksLoaded={tasksLoaded}
          />
        );
      });
    return isPrev ? days.reverse() : days;
  }

  function prevMonthDays() {
    const firstDayOfCurrMonth = startOfMonth(selectedDate);
    const firstDay = addDays(firstDayOfCurrMonth, -1);
    const nDays = (firstDayOfCurrMonth.getDay() + 6) % 7;
    return getDays(firstDay, nDays, true);
  }

  function currMonthDays() {
    const firstDay = startOfMonth(selectedDate);
    const nDays = getDaysInMonth(firstDay);
    return getDays(firstDay, nDays, false, true);
  }

  function nextMonthDays() {
    const lastDayOfCurrMonth = lastDayOfMonth(selectedDate);
    const firstDay = addDays(lastDayOfCurrMonth, 1);
    const nDays = (7 - lastDayOfCurrMonth.getDay()) % 7;
    return getDays(firstDay, nDays);
  }

  return (
    <>
      {prevMonthDays()}
      {currMonthDays()}
      {nextMonthDays()}
    </>
  );
};
