import React, { useEffect, useState } from "react";

import type { ITask } from "app/types/tasks.types";
import { useAppSelector } from "app/store/hooks";
import { selectProjectView } from "app/store/settingsSlice";
import { useActions } from "app/context/ActionsContext";

import { useTasks } from "./use-tasks.hook";
import { TaskDetails } from "./details/";
import { tasksViews } from "./views";

const Tasks: React.FC = () => {
  const view = useAppSelector(selectProjectView);
  const { projectId, tasksLoaded } = useTasks();
  const actions = useActions();
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);
  const taskDetailsToggle = () => setTaskDetailsOpen((x) => !x);

  useEffect(() => {
    setSelectedTask(null);
    if (!tasksLoaded) {
      actions.task
        .loadTasks(projectId)
        .catch((err: Error) => console.error("Failed loading tasks: ", err));
    }
  }, [projectId]);

  const TasksView = tasksViews[view] || null;

  const selectTask = (taskId: ITask["id"]) => () => {
    setSelectedTask(taskId);
    taskDetailsToggle();
  };

  return (
    <>
      <TasksView selectTask={selectTask} />

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
