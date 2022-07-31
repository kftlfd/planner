import React from "react";

import { TaskCreateForm } from "./TaskCreateForm";
import { TaskCard } from "./TaskCard";

import { Skeleton, Container } from "@mui/material";

export function TasksListView(props) {
  const {
    projectId,
    tasksLoaded,
    taskIds,
    setSelectedTask,
    taskDetailsToggle,
  } = props;

  if (!tasksLoaded) {
    return (
      <TaskListWrapper>
        {[...Array(4).keys()].map((x) => (
          <Skeleton key={x} height={60} animation="wave" />
        ))}
      </TaskListWrapper>
    );
  }

  return (
    <>
      <TaskListWrapper>
        <TaskCreateForm projectId={projectId} />

        {taskIds.map((taskId) => (
          <TaskCard
            key={`pj-${projectId}-task-${taskId}`}
            taskId={taskId}
            openDetails={() => {
              setSelectedTask(taskId);
              taskDetailsToggle();
            }}
          />
        ))}
      </TaskListWrapper>
    </>
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
