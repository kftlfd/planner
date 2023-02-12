import React, { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";

import { useActions } from "../../context/ActionsContext";
import {
  selectProjectaTasksLoaded,
  selectProjectTasksIds,
} from "../../store/projectsSlice";
import { TasksListView } from "./TasksListView";
import { TasksBoardView } from "./TasksBoardView";
import { TasksCalendarView } from "./TasksCalendarView";
import { Sidebar } from "../../layout/Sidebar";
import { TaskDetails } from "./TaskDetails";

import { Typography } from "@mui/material";

export type TasksViewProps = {
  tasksLoaded: boolean;
  projectId: number;
  taskIds: number[];
  setSelectedTask: (taskId: number) => void;
  taskDetailsToggle: () => void;
};

export default function Tasks() {
  const { projectId } = useParams<{ projectId: string }>();
  const { view }: { view: string } = useOutletContext();
  const projectsTasksLoaded = useSelector(selectProjectaTasksLoaded);
  const taskIds = useSelector(selectProjectTasksIds(Number(projectId)));
  const actions = useActions();

  const tasksLoaded = projectsTasksLoaded.includes(Number(projectId));

  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);
  const taskDetailsToggle = () => {
    setTaskDetailsOpen((x) => !x);
  };

  useEffect(() => {
    setSelectedTask(null);
    if (!tasksLoaded) {
      actions.task
        .loadTasks(projectId)
        .catch((err: Error) => console.error("Failed loading tasks: ", err));
    }
  }, [projectId]);

  const viewProps: TasksViewProps = {
    tasksLoaded: tasksLoaded,
    projectId: Number(projectId),
    taskIds: taskIds,
    setSelectedTask: setSelectedTask,
    taskDetailsToggle: taskDetailsToggle,
  };

  return (
    <>
      {view === "list" ? (
        <TasksListView {...viewProps} />
      ) : view === "board" ? (
        <TasksBoardView {...viewProps} />
      ) : view === "calendar" ? (
        <TasksCalendarView {...viewProps} />
      ) : null}

      <Sidebar open={taskDetailsOpen} toggle={taskDetailsToggle}>
        <TaskDetails
          open={taskDetailsOpen}
          taskId={selectedTask}
          sidebarToggle={taskDetailsToggle}
          setTaskSelected={setSelectedTask}
        />
      </Sidebar>
    </>
  );
}

export function NoTasks() {
  return (
    <Typography
      variant="h4"
      align="center"
      sx={{
        marginTop: "3rem",
        fontWeight: "fontWeightLight",
        color: "text.primary",
      }}
    >
      No tasks
    </Typography>
  );
}
