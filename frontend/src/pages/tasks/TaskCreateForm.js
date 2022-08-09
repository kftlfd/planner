import React, { useState } from "react";

import { useActions } from "../../context/ActionsContext";
import { BaseSkeleton } from "../../layout/Loading";
import { InputModal } from "../../layout/Modal";
import { DueForm } from "./TaskDetails";

import {
  Container,
  Box,
  Button,
  IconButton,
  Paper,
  InputBase,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

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
      await actions.task.create(projectId, { title: taskCreateTitle });
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

export function CreateTaskWithDate(props) {
  const actions = useActions();

  const [state, setState] = React.useState({
    open: false,
    taskTitle: "",
    taskDue: props.due || null,
  });

  React.useEffect(() => {
    setState((prev) => ({ ...prev, taskDue: props.due }));
  }, [props.due]);

  function handleClose() {
    setState((prev) => ({
      open: false,
      taskTitle: "",
      taskDue: props.due || null,
    }));
  }

  async function handleCreate() {
    try {
      await actions.task.create(props.projectId, {
        title: state.taskTitle,
        ...(state.taskDue && { due: state.taskDue.toISOString() }),
      });
      handleClose();
    } catch (error) {
      console.error("Failed to create task: ", error);
    }
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <IconButton onClick={() => setState((prev) => ({ ...prev, open: true }))}>
        <AddCircleIcon sx={{ height: "3rem", width: "3rem" }} />
      </IconButton>

      <InputModal
        open={state.open}
        onConfirm={handleCreate}
        onClose={handleClose}
        title={"Create new task"}
        action={"Create"}
        inputLabel={"Task title"}
        inputValue={state.taskTitle}
        inputChange={(e) =>
          setState((prev) => ({ ...prev, taskTitle: e.target.value }))
        }
        formChildren={
          <DueForm
            value={state.taskDue}
            onChange={(newVal) =>
              setState((prev) => ({ ...prev, taskDue: newVal }))
            }
            onClead={() => setState((prev) => ({ ...prev, taskDue: null }))}
            boxSx={{ marginTop: "1rem" }}
          />
        }
      />
    </Box>
  );
}
