import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { loadTasks, selectProjectTasksIds } from "../../store/tasksSlice";

import * as api from "../../api/client";

import { Sidebar } from "../../layout/Sidebar";
import { TaskCreateForm } from "./TaskCreateForm";
import { TaskCard } from "./TaskCard";
import { TaskDetails } from "./TaskDetails";

import { Skeleton, Container } from "@mui/material";

export function TasksListView(props) {
  const { projectId } = useParams();

  const taskIds = useSelector(selectProjectTasksIds(projectId));
  const dispatch = useDispatch();
  const notLoaded = taskIds === undefined;

  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);
  const taskDetailsToggle = useCallback(() => {
    setTaskDetailsOpen((x) => !x);
  }, []);

  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    setSelectedTask(null);
    if (notLoaded) {
      api.tasks
        .load(projectId)
        .then((res) => {
          const payload = {
            projectId,
            tasks: res,
            ids: Object.keys(res),
          };
          dispatch(loadTasks(payload));
        })
        .catch((err) => console.error("Failed to load tasks: ", err));
    }
  }, [projectId]);

  if (notLoaded) {
    return (
      <TaskListWrapper>
        {[...Array(4).keys()].map((x) => (
          <Skeleton key={x} height={60} animation="wave" />
        ))}
      </TaskListWrapper>
    );
  }

  return (
    <TaskListWrapper>
      <TaskCreateForm projectId={projectId} />

      {taskIds.map((taskId) => (
        <TaskCard
          key={`pj-${projectId}-task-${taskId}`}
          projectId={projectId}
          taskId={taskId}
          setSelectedTask={setSelectedTask}
          taskDetailsToggle={taskDetailsToggle}
        />
      ))}

      <Sidebar open={taskDetailsOpen} toggle={taskDetailsToggle}>
        {!selectedTask ? null : (
          <TaskDetails
            projectId={projectId}
            taskId={selectedTask}
            sidebarToggle={taskDetailsToggle}
            setTaskSelected={setSelectedTask}
          />
        )}
      </Sidebar>
    </TaskListWrapper>
  );
}

function TaskListWrapper({ children }) {
  return (
    <Container
      maxWidth="md"
      sx={{ paddingTop: { xs: "1rem", sm: "1.5rem" }, paddingBottom: "3rem" }}
    >
      {children}
    </Container>
  );
}
