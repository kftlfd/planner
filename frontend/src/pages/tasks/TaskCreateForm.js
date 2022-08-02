import React, { useState } from "react";

import { useActions } from "../../context/ActionsContext";
import { BaseSkeleton } from "../../layout/Loading";

import { Container, Button, Paper, InputBase } from "@mui/material";

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

  if (props.loading) {
    return (
      <CreateFormWrapper>
        <BaseSkeleton height={"2.5rem"} sx={{ flexGrow: 1 }} />
      </CreateFormWrapper>
    );
  }

  return (
    <CreateFormWrapper>
      <Paper
        component="form"
        onSubmit={handleCreateTask}
        sx={{
          flexGrow: 1,
          display: "flex",
          height: "2.5rem",
          padding: "0.3rem 1rem",
          ...props.sx,
        }}
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
        <Button
          type={"submit"}
          disabled={!taskCreateTitle}
          size={"small"}
          sx={{ flexShrink: 0 }}
        >
          + Add task
        </Button>
      </Paper>
      {props.children}
    </CreateFormWrapper>
  );
}

function CreateFormWrapper({ children }) {
  return (
    <Container
      maxWidth="md"
      sx={{
        paddingBlock: { xs: "1rem", sm: "1.5rem" },
        display: "flex",
        justifyContent: "end",
        alignItems: "start",
        gap: "1rem",
        flexWrap: "wrap",
      }}
    >
      {children}
    </Container>
  );
}
