import React, { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { useProjects } from "../ProjectsContext";
import { MainSidebar, MainSidebarHeader } from "./Main";

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
  TextField,
  FormControlLabel,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

export default function ProjectTasks(props) {
  const { projectId } = useParams();
  const { hideDoneTasks } = useOutletContext();
  const { projects, checkProjectTasks } = useProjects();

  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);
  function taskDetailsToggle() {
    setTaskDetailsOpen((x) => !x);
  }

  const [taskSelected, setTaskSelected] = useState(null);

  useEffect(() => {
    checkProjectTasks(projectId);
  }, []);

  useEffect(() => {
    setTaskSelected(null);
    checkProjectTasks(projectId);
  }, [projectId]);

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

          {Object.keys(projects[projectId].tasks).map((taskId) => (
            <Collapse
              key={`pj-${projectId}-task-${taskId}`}
              in={!(hideDoneTasks && projects[projectId].tasks[taskId].done)}
            >
              <Task
                task={projects[projectId].tasks[taskId]}
                setTaskSelected={setTaskSelected}
                taskDetailsToggle={taskDetailsToggle}
              />
            </Collapse>
          ))}

          <MainSidebar open={taskDetailsOpen} toggle={taskDetailsToggle}>
            {taskSelected ? (
              <TaskDetails
                sidebarToggle={taskDetailsToggle}
                projectId={projectId}
                taskId={taskSelected}
                setTaskSelected={setTaskSelected}
              />
            ) : null}
          </MainSidebar>
        </>
      )}
    </Container>
  );
}

function TaskCreateForm(props) {
  const { handleTasks } = useProjects();
  const [taskCreateTitle, setTaskCreateTitle] = useState("");
  const handleTaskCreateTitleChange = (e) => {
    if (e.target.value.length <= 150) {
      setTaskCreateTitle(e.target.value);
    }
  };

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
  const { task, setTaskSelected, taskDetailsToggle } = props;

  const [doneValue, setDoneValue] = useState(task.done);
  const toggleDone = () => {
    let newDoneValue = !doneValue;
    setDoneValue(newDoneValue);
    handleTasks.update(task.project, task.id, { done: newDoneValue });
  };

  const openTaskDetails = () => {
    setTaskSelected(task.id);
    taskDetailsToggle();
  };

  useEffect(() => {
    setDoneValue(task.done);
  }, [task.done]);

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
            onChange={toggleDone}
          />
        </Box>

        <Box
          onClick={openTaskDetails}
          sx={{ flexGrow: 1, padding: "1rem", paddingLeft: 0 }}
        >
          <Typography variant="body1">{task.title}</Typography>
          <Typography variant="body2">{task.notes}</Typography>
          <Typography variant="body2">{task.due}</Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}

function TaskDetails(props) {
  const { projects, handleTasks } = useProjects();
  const { sidebarToggle, projectId, taskId, setTaskSelected } = props;
  let task = projects[projectId].tasks[taskId];

  const [taskState, setTaskState] = useState({ ...task });

  const updateTaskState = (e) => {
    let { name, value } = e.target;
    if (name === "done") {
      value = !taskState.done;
    }
    setTaskState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    setTaskState({ ...task });
  }, [taskId]);

  const handleTaskUpdate = () => {
    handleTasks.update(projectId, task.id, {
      done: taskState.done,
      title: taskState.title,
      notes: taskState.notes,
    });
    sidebarToggle();
  };

  const handleTaskDelete = () => {
    handleTasks.delete(projectId, task.id);
    setTaskSelected(null);
    sidebarToggle();
  };

  return (
    <>
      {!task ? null : (
        <>
          <MainSidebarHeader title="Task details" toggle={sidebarToggle}>
            <Button
              disabled={
                task.done === taskState.done &&
                task.title === taskState.title &&
                task.notes === taskState.notes
              }
              onClick={handleTaskUpdate}
              endIcon={<SaveIcon />}
            >
              Save
            </Button>
          </MainSidebarHeader>

          <Toolbar />

          <Box
            sx={{
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <FormControlLabel
              label="Done"
              labelPlacement="start"
              control={
                <Checkbox
                  name="done"
                  checked={taskState.done}
                  onChange={updateTaskState}
                />
              }
            />

            <TextField
              name="title"
              label={"Title"}
              inputProps={{ maxlenth: 150 }}
              value={taskState.title}
              onChange={updateTaskState}
            />

            <TextField
              name="notes"
              label={"Notes"}
              value={taskState.notes}
              onChange={updateTaskState}
            />

            <div>Last modified: {task.modified}</div>
            <div>Created: {task.created}</div>

            <div>
              <Button
                variant="contained"
                color="error"
                onClick={handleTaskDelete}
              >
                Delete
              </Button>
            </div>
          </Box>
        </>
      )}
    </>
  );
}
