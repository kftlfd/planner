import React, { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { useProjects } from "../ProjectsContext";

import {
  Typography,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Checkbox,
  Paper,
  InputBase,
  Skeleton,
  Container,
  Toolbar,
} from "@mui/material";

export default function ProjectTasks(props) {
  const { projectId } = useParams();
  const { hideDoneTasks } = useOutletContext();
  const { projects, checkProjectTasks } = useProjects();

  useEffect(() => {
    checkProjectTasks(projectId);
  }, [[], projectId]);

  return (
    <Container
      maxWidth="md"
      sx={{ paddingTop: { xs: "1rem", sm: "1.5rem" }, paddingBottom: "3rem" }}
    >
      <Toolbar />
      {!projects[projectId] ? null : !projects[projectId].tasks ? (
        <>
          {[...Array(4).keys()].map((x) => (
            <Skeleton key={x} height={50} animation="wave" />
          ))}
        </>
      ) : (
        <>
          <TaskCreateForm projectId={projectId} />

          {Object.keys(projects[projectId].tasks).map((id) => (
            <Task
              key={`pj-${projectId}-task-${id}`}
              task={projects[projectId].tasks[id]}
              hide={hideDoneTasks && projects[projectId].tasks[id].done}
            />
          ))}
        </>
      )}
    </Container>
  );
}

function TaskCreateForm(props) {
  const { handleTasks } = useProjects();
  const [taskCreateTitle, setTaskCreateTitle] = useState("");
  const handleTaskCreateTitleChange = (e) => setTaskCreateTitle(e.target.value);

  const handleCreateTask = (event) => {
    event.preventDefault();
    handleTasks.create(props.projectId, taskCreateTitle);
    setTaskCreateTitle("");
  };

  return (
    <Paper
      component="form"
      onSubmit={handleCreateTask}
      sx={{ display: "flex", marginBottom: "1.5rem", padding: "0.3rem 1rem" }}
    >
      <InputBase
        type={"text"}
        value={taskCreateTitle}
        onChange={handleTaskCreateTitleChange}
        placeholder={"New task"}
        size={"small"}
        sx={{ flexGrow: "1" }}
        componentsProps={{
          input: { sx: { padding: "0" } },
        }}
      />
      <Button type={"submit"} disabled={!taskCreateTitle} size={"small"}>
        + Add task
      </Button>
    </Paper>
  );
}

function Task(props) {
  return (
    <Card
      sx={{
        marginBottom: props.hide ? "0" : "0.5rem",
        height: props.hide ? "0px" : "auto",
      }}
    >
      <CardActionArea>
        <CardContent sx={{ display: "flex", alignItems: "start", gap: "1rem" }}>
          <Checkbox sx={{ padding: "0" }} checked={props.task.done} />
          <div style={{ flexGrow: "1" }} onClick={() => {}}>
            <Typography variant="body1">{props.task.title}</Typography>
            <Typography variant="body2">{props.task.notes}</Typography>
            <Typography variant="body2">{props.task.due}</Typography>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
