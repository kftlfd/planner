import React, { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";

import { useProjects } from "../context/ProjectsContext";
import { Sidebar, SidebarHeader } from "../layout/Sidebar";

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

export default function Tasks(props) {
  return <TasksListView />;
}

function TasksListView(props) {
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

          <Sidebar open={taskDetailsOpen} toggle={taskDetailsToggle}>
            {taskSelected ? (
              <TaskDetails
                sidebarToggle={taskDetailsToggle}
                projectId={projectId}
                taskId={taskSelected}
                setTaskSelected={setTaskSelected}
              />
            ) : null}
          </Sidebar>
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
          <SidebarHeader title="Task details" toggle={sidebarToggle}>
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
          </SidebarHeader>

          <Toolbar />

          <Box
            sx={{
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <Box>
              <FormControlLabel
                label="Done"
                control={
                  <Checkbox
                    name="done"
                    checked={taskState.done}
                    onChange={updateTaskState}
                  />
                }
              />
            </Box>

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
              multiline
              rows={4}
            />

            <Box
              sx={{ display: "flex", justifyContent: "end", marginTop: "2rem" }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={handleTaskDelete}
              >
                Delete task
              </Button>
            </Box>
          </Box>
        </>
      )}
    </>
  );
}
