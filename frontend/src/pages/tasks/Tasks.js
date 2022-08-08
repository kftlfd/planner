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

export default function Tasks(props) {
  const { projectId } = useParams();
  const { view } = useOutletContext();
  const projectsTasksLoaded = useSelector(selectProjectaTasksLoaded);
  const taskIds = useSelector(selectProjectTasksIds(projectId));
  const actions = useActions();

  const tasksLoaded = projectsTasksLoaded.includes(Number(projectId));

  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);
  const taskDetailsToggle = () => {
    setTaskDetailsOpen((x) => !x);
  };

  useEffect(() => {
    setSelectedTask(null);
    if (!tasksLoaded) {
      actions.task
        .loadTasks(projectId)
        .catch((err) => console.error("Failed loading tasks: ", err));
    }
  }, [projectId]);

  const viewProps = {
    tasksLoaded: tasksLoaded,
    projectId: projectId,
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
