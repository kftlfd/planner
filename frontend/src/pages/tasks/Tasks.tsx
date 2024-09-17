import { FC, useEffect, useState } from "react";

import { useActions } from "~/context/ActionsContext";
import { useAppSelector } from "~/store/hooks";
import { selectProjectView } from "~/store/settingsSlice";
import type { ITask } from "~/types/tasks.types";

import { TaskDetails } from "./details/";
import { useTasks } from "./use-tasks.hook";
import { tasksViews } from "./views";

const Tasks: FC = () => {
  const view = useAppSelector(selectProjectView);
  const { projectId, tasksLoaded } = useTasks();
  const actions = useActions();
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);
  const taskDetailsToggle = () => {
    setTaskDetailsOpen((x) => !x);
  };

  useEffect(() => {
    setSelectedTask(null);
    if (!tasksLoaded) {
      actions.task.loadTasks(projectId).catch((err: unknown) => {
        console.error("Failed loading tasks: ", err);
      });
    }
  }, [actions.task, projectId, tasksLoaded]);

  const TasksView = tasksViews[view] || null;

  const selectTask = (taskId: ITask["id"]) => () => {
    setSelectedTask(taskId);
    taskDetailsToggle();
  };

  return (
    <>
      {TasksView && <TasksView selectTask={selectTask} />}

      <TaskDetails
        open={taskDetailsOpen}
        taskId={selectedTask}
        sidebarToggle={taskDetailsToggle}
        setTaskSelected={setSelectedTask}
      />
    </>
  );
};

export default Tasks;
