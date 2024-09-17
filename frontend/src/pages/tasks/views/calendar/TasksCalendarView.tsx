import { FC, useMemo } from "react";
import { useSelector } from "react-redux";
import { addMonths } from "date-fns";

import { Today as TodayIcon, West as WestIcon } from "@mui/icons-material";
import { Box, Container, IconButton } from "@mui/material";

import { useActions } from "~/context/ActionsContext";
import { selectSelectedCalDate } from "~/store/projectsSlice";
import { selectAllTasks } from "~/store/tasksSlice";
import type { ITask } from "~/types/tasks.types";

import { CardSkeleton, TaskCard } from "../../TaskCard";
import { CreateTaskWithDate } from "../../TaskCreateForm";
import { useTasks } from "../../use-tasks.hook";
import type { TasksViewProps } from "../index";
import { MonthDays } from "./MonthDays";
import {
  CalendarCard,
  CalendarHeadingTile,
  CalendarMonthTitle,
  CalendarNavigation,
  DayTasks,
} from "./styled";
import { getDayTimestamp, getMonthTitle, TaskDayTimestamp } from "./utils";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const TasksCalendarView: FC<TasksViewProps> = ({ selectTask }) => {
  const { projectId, tasksLoaded } = useTasks();
  const actions = useActions();
  const allTasks = useSelector(selectAllTasks);
  const selectedDate =
    useSelector(selectSelectedCalDate(projectId)) || new Date();

  const tasksByDate = useMemo(() => {
    const tasksByDateAccumulator: { [timestamp: TaskDayTimestamp]: ITask[] } =
      {};

    const tasks = Object.values(allTasks).reduce((acc, task) => {
      if (!task) return acc;

      if (task.project !== projectId || !task.due) return acc;

      const taskTimestamp = getDayTimestamp(new Date(task.due));
      if (!acc[taskTimestamp]) acc[taskTimestamp] = [];
      acc[taskTimestamp].push(task);

      return acc;
    }, tasksByDateAccumulator);

    Object.values(tasks).forEach((tasksList) =>
      tasksList.sort((a, b) => {
        if (!a.due || !b.due) {
          return a.due === b.due ? 0 : a.due === null ? 1 : -1;
        }
        return a.due > b.due ? 1 : -1;
      }),
    );

    return tasks;
  }, [allTasks, projectId]);

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
