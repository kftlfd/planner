import React, { useState } from "react";
import {
  Container,
  Box,
  Button,
  IconButton,
  Paper,
  InputBase,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  AddCircle as AddCircleIcon,
} from "@mui/icons-material";

import { useActions } from "app/context/ActionsContext";
import { BaseSkeleton } from "app/layout/Loading";
import { InputModal } from "app/layout/Modal";
import { ErrorAlert } from "app/layout/Alert";

import { DueForm } from "./DueForm";

export function TaskCreateForm(props: {
  projectId?: number;
  loading?: boolean;
  sx?: any;
  children?: React.ReactNode;
}) {
  const { projectId } = props;
  const actions = useActions();

  const [taskCreateTitle, setTaskCreateTitle] = useState("");
  const handleTaskCreateTitleChange: React.ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    if (e.target.value.length <= 150) {
      setTaskCreateTitle(e.target.value);
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTask: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();
    setLoading(true);
    try {
      await actions.task.create(projectId, { title: taskCreateTitle });
      setLoading(false);
      setTaskCreateTitle("");
    } catch (error) {
      console.error("Failed to create task: ", error);
      setLoading(false);
      setError("Can't create task");
    }
  };

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
            input: { style: { padding: "0" } },
          }}
          disabled={loading}
        />
        <Button
          type={"submit"}
          disabled={!taskCreateTitle || loading}
          size={"small"}
          sx={{ flexShrink: 0 }}
          startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
        >
          Add task
        </Button>
        <ErrorAlert
          open={error !== null}
          toggle={() => setError(null)}
          message={error}
        />
      </Paper>
      {props.children}
    </CreateFormWrapper>
  );
}

function CreateFormWrapper({ children }: { children: React.ReactNode }) {
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

export function CreateTaskWithDate(props: { projectId: number; due: Date }) {
  const actions = useActions();

  const [state, setState] = React.useState<{
    open: boolean;
    taskTitle: string;
    taskDue: Date | null;
  }>({
    open: false,
    taskTitle: "",
    taskDue: props.due || null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setLoading(true);
    try {
      await actions.task.create(props.projectId, {
        title: state.taskTitle,
        ...(state.taskDue && { due: state.taskDue.toISOString() }),
      });
      setLoading(false);
      handleClose();
    } catch (error) {
      console.error("Failed to create task: ", error);
      setLoading(false);
      setError("Can't create task");
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
        inputChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setState((prev) => ({ ...prev, taskTitle: e.target.value }))
        }
        formChildren={
          <DueForm
            value={state.taskDue}
            onChange={(newVal) =>
              setState((prev) => ({ ...prev, taskDue: newVal }))
            }
            onClear={() => setState((prev) => ({ ...prev, taskDue: null }))}
            mt
            disabled={loading}
          />
        }
        loading={loading}
      />
      <ErrorAlert
        open={error !== null}
        toggle={() => setError(null)}
        message={error}
      />
    </Box>
  );
}
