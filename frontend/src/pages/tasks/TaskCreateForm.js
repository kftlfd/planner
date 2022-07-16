import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { addTask } from "../../store/tasksSlice";

import * as api from "../../api/client";

import { Button, Paper, InputBase } from "@mui/material";

export function TaskCreateForm(props) {
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
