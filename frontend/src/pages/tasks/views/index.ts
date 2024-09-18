import { FC, lazy, LazyExoticComponent } from "react";

const TasksBoardView = lazy(() => import("./board/"));
const TasksCalendarView = lazy(() => import("./calendar"));
const TasksListView = lazy(() => import("./list"));

export type TasksViewProps = {
  selectTask: (taskId: number) => () => void;
};

type ViewComponent = LazyExoticComponent<FC<TasksViewProps>>;

export const tasksViews: Record<string, ViewComponent> = {
  list: TasksListView,
  board: TasksBoardView,
  calendar: TasksCalendarView,
};
