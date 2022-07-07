import React, { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { useProjects } from "../ProjectsContext";
import { MainSidebar } from "./Main";

import {
  Typography,
  Box,
  Button,
  Card,
  CardActionArea,
  Checkbox,
  Collapse,
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

  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);
  const taskDetailToggle = () => setTaskDetailsOpen((x) => !x);

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
            <Collapse
              key={`pj-${projectId}-task-${id}`}
              in={!(hideDoneTasks && projects[projectId].tasks[id].done)}
            >
              <Task
                task={projects[projectId].tasks[id]}
                deatailsToggle={taskDetailToggle}
              />
            </Collapse>
          ))}

          <MainSidebar
            open={taskDetailsOpen}
            toggle={taskDetailToggle}
            title={"Task details"}
            children={null}
          />
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
  const { handleTasks } = useProjects();
  const { projectId } = useParams();
  const [doneValue, setDoneValue] = useState(props.task.done);
  const doneToggle = () => {
    handleTasks.update(projectId, props.task.id, { done: !doneValue });
    setDoneValue((x) => !x);
  };

  return (
    <Card sx={{ marginBottom: "0.5rem" }}>
      <CardActionArea
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ padding: "0.5rem" }}>
          <Checkbox
            sx={{ padding: "0.5rem" }}
            checked={doneValue}
            onChange={doneToggle}
          />
        </Box>

        <Box
          onClick={props.deatailsToggle}
          sx={{ flexGrow: 1, padding: "1rem", paddingLeft: 0 }}
        >
          <Typography variant="body1">{props.task.title}</Typography>
          <Typography variant="body2">{props.task.notes}</Typography>
          <Typography variant="body2">{props.task.due}</Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}
