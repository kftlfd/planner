import React, { useEffect, useState, useCallback } from "react";
import { useParams, useOutletContext } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import {
  loadTasks,
  addTask,
  updateTask,
  deleteTask,
  selectProjectTasksIds,
  selectTaskById,
} from "../store/tasksSlice";

import * as api from "../api/client";

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
        <TaskDetails
          projectId={projectId}
          taskId={selectedTask}
          sidebarToggle={taskDetailsToggle}
          setTaskSelected={setSelectedTask}
        />
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

function TaskCreateForm(props) {
  const { projectId } = props;
  const dispatch = useDispatch();

  const [taskCreateTitle, setTaskCreateTitle] = useState("");
  const handleTaskCreateTitleChange = (e) => {
    if (e.target.value.length <= 150) {
      setTaskCreateTitle(e.target.value);
    }
  };

  const handleCreateTask = (event) => {
    event.preventDefault();
    api.tasks
      .create(projectId, taskCreateTitle)
      .then((res) => {
        const payload = {
          projectId,
          task: res,
        };
        dispatch(addTask(payload));
        setTaskCreateTitle("");
      })
      .catch((err) => console.log("Failed to create task: ", err));
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

function TaskCard(props) {
  const { projectId, taskId, setSelectedTask, taskDetailsToggle } = props;
  const { hideDoneTasks } = useOutletContext();

  const task = useSelector(selectTaskById(taskId));
  const dispatch = useDispatch();

  const [doneValue, setDoneValue] = useState(task.done);
  const toggleDone = () => {
    const newDoneValue = !doneValue;
    setDoneValue(newDoneValue);
    api.tasks
      .update(projectId, taskId, { done: newDoneValue })
      .then((res) => {
        dispatch(updateTask(res));
      })
      .catch((err) => {
        console.log("Failed to update task-done status: ", err);
        setDoneValue(!newDoneValue);
      });
  };

  useEffect(() => {
    setDoneValue(task.done);
  }, [task]);

  const openTaskDetails = () => {
    setSelectedTask(taskId);
    taskDetailsToggle();
  };

  return (
    <Collapse in={!(hideDoneTasks && task.done)}>
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
            onClick={() => {
              setSelectedTask(taskId);
              taskDetailsToggle();
            }}
            sx={{ flexGrow: 1, padding: "1rem", paddingLeft: 0 }}
          >
            <Typography variant="body1">{task.title}</Typography>
            <Typography variant="body2">{task.notes}</Typography>
            <Typography variant="body2">{task.due}</Typography>
          </Box>
        </CardActionArea>
      </Card>
    </Collapse>
  );
}

function TaskDetails(props) {
  const { projectId, taskId, sidebarToggle, setTaskSelected } = props;
  if (!taskId) return null;

  const task = useSelector(selectTaskById(taskId));
  const dispatch = useDispatch();

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
  }, [taskId, task]);

  const handleTaskUpdate = () => {
    api.tasks
      .update(projectId, taskId, {
        done: taskState.done,
        title: taskState.title,
        notes: taskState.notes,
      })
      .then((res) => {
        dispatch(updateTask(res));
        sidebarToggle();
      })
      .catch((err) => {
        console.error("Failed to update task: ", err);
      });
  };

  const handleTaskDelete = () => {
    api.tasks
      .delete(projectId, taskId)
      .then((res) => {
        setTaskSelected(null);
        sidebarToggle();
        dispatch(deleteTask({ projectId, taskId }));
      })
      .catch((err) => {
        console.log("Failed to delete task: ", err);
      });
  };

  return (
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

        <Box sx={{ display: "flex", justifyContent: "end", marginTop: "2rem" }}>
          <Button variant="contained" color="error" onClick={handleTaskDelete}>
            Delete task
          </Button>
        </Box>
      </Box>
    </>
  );
}
