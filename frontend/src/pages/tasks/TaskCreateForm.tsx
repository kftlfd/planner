import { FC, ReactNode, useEffect, useState } from "react";

import {
  Add as AddIcon,
  AddCircle as AddCircleIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputBase,
  Paper,
  SxProps,
} from "@mui/material";

import { useActions } from "~/context/ActionsContext";
import { ErrorAlert } from "~/layout/Alert";
import { BaseSkeleton } from "~/layout/Loading";
import { InputModal } from "~/layout/Modal";

import { DueForm } from "./DueForm";

export const TaskCreateForm: FC<{
  projectId?: number;
  loading?: boolean;
  sx?: SxProps;
  children?: ReactNode;
}> = ({ projectId, loading: loadingProp, sx, children }) => {
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

  const handleCreateTask = async () => {
    if (projectId === undefined) return;
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

  if (loadingProp) {
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
        onSubmit={(e) => {
          e.preventDefault();
          void handleCreateTask();
        }}
        sx={{
          flexGrow: 1,
          display: "flex",
          height: "2.5rem",
          padding: "0.3rem 1rem",
          ...sx,
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
          toggle={() => {
            setError(null);
          }}
          message={error}
        />
      </Paper>
      {children}
    </CreateFormWrapper>
  );
};

const CreateFormWrapper: FC<{ children?: ReactNode }> = ({ children }) => (
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

export const CreateTaskWithDate: FC<{
  projectId: number;
  due?: Date;
}> = ({ projectId, due = null }) => {
  const actions = useActions();

  const [state, setState] = useState<{
    open: boolean;
    taskTitle: string;
    taskDue: Date | null;
  }>({
    open: false,
    taskTitle: "",
    taskDue: due,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setState((prev) => ({ ...prev, taskDue: due }));
  }, [due]);

  function handleClose() {
    setState(() => ({
      open: false,
      taskTitle: "",
      taskDue: due ?? null,
    }));
  }

  async function handleCreate() {
    setLoading(true);
    try {
      await actions.task.create(projectId, {
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
      <IconButton
        onClick={() => {
          setState((prev) => ({ ...prev, open: true }));
        }}
      >
        <AddCircleIcon sx={{ height: "3rem", width: "3rem" }} />
      </IconButton>

      <InputModal
        open={state.open}
        onConfirm={() => void handleCreate()}
        onClose={handleClose}
        title={"Create new task"}
        action={"Create"}
        inputLabel={"Task title"}
        inputValue={state.taskTitle}
        inputChange={(v) => {
          setState((prev) => ({ ...prev, taskTitle: v }));
        }}
        formChildren={
          <DueForm
            value={state.taskDue}
            onChange={(newVal) => {
              setState((prev) => ({ ...prev, taskDue: newVal }));
            }}
            onClear={() => {
              setState((prev) => ({ ...prev, taskDue: null }));
            }}
            mt
            disabled={loading}
          />
        }
        loading={loading}
      />
      <ErrorAlert
        open={error !== null}
        toggle={() => {
          setError(null);
        }}
        message={error}
      />
    </Box>
  );
};
