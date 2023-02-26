import { TasksListView } from "./list";
import { TasksBoardView } from "./board/";
import { TasksCalendarView } from "./calendar";

export type TasksViewProps = {
  selectTask: (taskId: number) => () => void;
};

export const tasksViews: Record<string, React.FC<TasksViewProps>> = {
  list: TasksListView,
  board: TasksBoardView,
  calendar: TasksCalendarView,
};
