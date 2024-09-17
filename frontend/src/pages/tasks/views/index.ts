import { FC } from "react";

import { TasksBoardView } from "./board/";
import { TasksCalendarView } from "./calendar";
import { TasksListView } from "./list";

export type TasksViewProps = {
  selectTask: (taskId: number) => () => void;
};

export const tasksViews: Record<string, FC<TasksViewProps>> = {
  list: TasksListView,
  board: TasksBoardView,
  calendar: TasksCalendarView,
};
