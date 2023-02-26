import React from "react";
import { useSelector } from "react-redux";
import { addMonths } from "date-fns";
import { Container, Box, IconButton } from "@mui/material";
import { West as WestIcon, Today as TodayIcon } from "@mui/icons-material";

import type { ITask } from "app/types/tasks.types";
import { selectSelectedCalDate } from "app/store/projectsSlice";
import { selectAllTasks } from "app/store/tasksSlice";
import { useActions } from "app/context/ActionsContext";

import type { TasksViewProps } from "../index";
import { TaskCard, CardSkeleton } from "../../TaskCard";
import { CreateTaskWithDate } from "../../TaskCreateForm";
import { useTasks } from "../../use-tasks.hook";
import { MonthDays } from "./MonthDays";
import { getDayTimestamp, TaskDayTimestamp, getMonthTitle } from "./utils";
import {
  CalendarCard,
  CalendarHeadingTile,
  CalendarNavigation,
  DayTasks,
  CalendarMonthTitle,
} from "./styled";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const TasksCalendarView: React.FC<TasksViewProps> = ({ selectTask }) => {
  const { projectId, tasksLoaded } = useTasks();
  const actions = useActions();
  const allTasks = useSelector(selectAllTasks);
  const selectedDate =
    useSelector(selectSelectedCalDate(projectId)) || new Date();

  const tasksByDateAccumulator: { [timestamp: TaskDayTimestamp]: ITask[] } = {};

  const tasksByDate = Object.entries(allTasks).reduce((acc, [taskId, task]) => {
    if (task.project !== projectId || !task.due) return acc;

    const taskTimestamp = getDayTimestamp(new Date(task.due));
    if (!acc[taskTimestamp]) acc[taskTimestamp] = [];
    acc[taskTimestamp].push(task);

    return acc;
  }, tasksByDateAccumulator);

  Object.keys(tasksByDate).forEach((d) =>
    tasksByDate[d].sort((a, b) => (a.due! > b.due! ? 1 : -1))
  );

  const goToPrevMonth = () => {
    const newSelect = addMonths(selectedDate, -1);
    actions.project.selectCalDate(projectId, newSelect);
  };

  const goToNextMonth = () => {
    const newSelect = addMonths(selectedDate, 1);
    actions.project.selectCalDate(projectId, newSelect);
  };

  const goToToday = () => {
    actions.project.selectCalDate(projectId, new Date());
  };

  const selectDate = (day: Date) => {
    actions.project.selectCalDate(projectId, day);
  };

  return (
    <Container maxWidth="md">
      <CalendarNavigation>
        <Box sx={{ flexBasis: "40px", flexShrink: 10 }} />

        <IconButton onClick={goToPrevMonth}>
          <WestIcon />
        </IconButton>

        <CalendarMonthTitle variant="h6" align="center">
          {getMonthTitle(selectedDate)}
        </CalendarMonthTitle>

        <IconButton onClick={goToNextMonth}>
          <WestIcon sx={{ transform: "rotate(180deg)" }} />
        </IconButton>

        <IconButton onClick={goToToday}>
          <TodayIcon />
        </IconButton>
      </CalendarNavigation>

      <CalendarCard>
        {weekdays.map((day) => (
          <CalendarHeadingTile key={`cal-heading-${day}`}>
            {day}
          </CalendarHeadingTile>
        ))}
        <MonthDays
          selectedDate={selectedDate}
          selectDate={selectDate}
          tasksByDate={tasksByDate}
          tasksLoaded={tasksLoaded}
        />
      </CalendarCard>

      <DayTasks>
        {tasksLoaded ? (
          <>
            {(tasksByDate[getDayTimestamp(selectedDate)] || []).map((task) => (
              <TaskCard
                key={`caltask-${task.id}`}
                taskId={task.id}
                openDetails={selectTask(task.id)}
              />
            ))}

            <CreateTaskWithDate projectId={projectId} due={selectedDate} />
          </>
        ) : (
          <CardSkeleton />
        )}
      </DayTasks>
    </Container>
  );
};
