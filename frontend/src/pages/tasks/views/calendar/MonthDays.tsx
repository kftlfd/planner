import { FC } from "react";
import {
  addDays,
  getDaysInMonth,
  isSameDay,
  lastDayOfMonth,
  startOfMonth,
} from "date-fns";

import type { ITask } from "~/types/tasks.types";

import { CalendarDay } from "./CalendarDay";
import { getDayTimestamp, TaskDayTimestamp } from "./utils";

export const MonthDays: FC<{
  tasksByDate: { [timestamp: TaskDayTimestamp]: ITask[] };
  selectedDate: Date;
  selectDate: (day: Date) => void;
  tasksLoaded: boolean;
}> = ({ selectedDate, selectDate, tasksLoaded, tasksByDate }) => {
  const getDays = (
    firstDate: Date,
    nDays: number,
    isPrev: boolean = false,
    isCurr: boolean = false,
  ) => {
    const days = Array(nDays)
      .fill(0)
      .map((_, i) => {
        const day = addDays(firstDate, isPrev ? -i : i);
        const tasks = tasksByDate[getDayTimestamp(day)] || [];
        const doneCount = tasks.reduce(
          (count, task) => count + (task.done ? 1 : 0),
          0,
        );
        const notDoneCount = tasks.length - doneCount;

        return (
          <CalendarDay
            key={day.toISOString()}
            day={day}
            isSelected={isSameDay(day, selectedDate)}
            onClick={() => {
              selectDate(day);
            }}
            notCurrentMonth={!isCurr}
            doneCount={doneCount}
            notDoneCount={notDoneCount}
            tasksLoaded={tasksLoaded}
          />
        );
      });
    return isPrev ? days.reverse() : days;
  };

  const prevMonthDays = () => {
    const firstDayOfCurrMonth = startOfMonth(selectedDate);
    const firstDay = addDays(firstDayOfCurrMonth, -1);
    const nDays = (firstDayOfCurrMonth.getDay() + 6) % 7;
    return getDays(firstDay, nDays, true);
  };

  const currMonthDays = () => {
    const firstDay = startOfMonth(selectedDate);
    const nDays = getDaysInMonth(firstDay);
    return getDays(firstDay, nDays, false, true);
  };

  const nextMonthDays = () => {
    const lastDayOfCurrMonth = lastDayOfMonth(selectedDate);
    const firstDay = addDays(lastDayOfCurrMonth, 1);
    const nDays = (7 - lastDayOfCurrMonth.getDay()) % 7;
    return getDays(firstDay, nDays);
  };

  return (
    <>
      {prevMonthDays()}
      {currMonthDays()}
      {nextMonthDays()}
    </>
  );
};
