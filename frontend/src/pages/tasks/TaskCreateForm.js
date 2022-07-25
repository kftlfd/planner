import React, { useState } from "react";

import { useActions } from "../../context/ActionsContext";

import { Button, Paper, InputBase } from "@mui/material";

export function TaskCreateForm(props) {
  const { projectId } = props;
  const actions = useActions();

  const [taskCreateTitle, setTaskCreateTitle] = useState("");
  const handleTaskCreateTitleChange = (e) => {
    if (e.target.value.length <= 150) {
      setTaskCreateTitle(e.target.value);
    }
  };

  async function handleCreateTask(event) {
    event.preventDefault();
    try {
      await actions.task.create(projectId, taskCreateTitle);
      setTaskCreateTitle("");
    } catch (error) {
      console.error("Failed to create task: ", error);
    }
  }

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
