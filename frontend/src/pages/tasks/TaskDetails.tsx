import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { isEqual } from "date-fns";

import { useActions } from "../../context/ActionsContext";
import {
  selectSharedProjectIds,
  selectProjectById,
} from "../../store/projectsSlice";
import { selectUserById } from "../../store/usersSlice";
import { selectTaskById } from "../../store/tasksSlice";
import { SidebarHeader, SidebarBody } from "../../layout/Sidebar";
import { SimpleModal } from "../../layout/Modal";
import { ErrorAlert } from "../../layout/Alert";

import {
  Box,
  Button,
  Checkbox,
  TextField,
  FormControlLabel,
  CircularProgress,
  IconButton,
  Avatar,
  Collapse,
  BoxProps,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDateTimePicker } from "@mui/x-date-pickers";

export function TaskDetails(props: {
  open: boolean;
  taskId: number | null;
  sidebarToggle: () => void;
  setTaskSelected: (taskId: number | null) => void;
}) {
  const { open, taskId, sidebarToggle, setTaskSelected } = props;

  const { projectId } = useParams<{ projectId: string }>();
  const project = useSelector(selectProjectById(Number(projectId)));
  const sharedIds = useSelector(selectSharedProjectIds);
  const isShared = sharedIds.includes(Number(projectId));

  const task = useSelector(selectTaskById(taskId || -1));
  const actions = useActions();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [taskState, setTaskState] = useState<{
    done: boolean;
    title: string;
    notes: string;
    due: Date | null;
    newDue: Date | null;
  }>({
    done: false,
    title: "",
    notes: "",
    due: null,
    newDue: null,
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const toggleDeleteModal = () => setDeleteModalOpen((x) => !x);

  useEffect(() => {
    setTaskState({
      done: task ? task.done : false,
      title: task ? task.title : "",
      notes: task ? task.notes : "",
      due: task?.due ? new Date(task.due) : null,
      newDue: task?.due ? new Date(task.due) : null,
    });
  }, [open, task]);

  function updateTaskState(e: React.ChangeEvent<HTMLInputElement>) {
    let { name, value } = e.target;
    if (name === "done") {
      value = `${!taskState.done}`;
    }
    setTaskState((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleTaskUpdate() {
    setLoading(true);
    const taskUpdate = {
      done: taskState.done,
      title: taskState.title,
      notes: taskState.notes,
      due: taskState.newDue?.toISOString() || null,
    };
    try {
      await actions.task.update(taskId, taskUpdate);
      setLoading(false);
      sidebarToggle();
    } catch (error) {
      console.error("Failed to update task: ", error);
      setLoading(false);
      setError("Can't update task");
    }
  }

  async function handleTaskDelete() {
    setLoading(true);
    try {
      await actions.task.delete(task.project, task.id);
      setLoading(false);
      sidebarToggle();
      setTaskSelected(null);
      toggleDeleteModal();
    } catch (error) {
      console.error("Failed to delete task: ", error);
      setLoading(false);
      setError("Can't delete task");
    }
  }

  return (
    <>
      <SidebarHeader title="Task details" toggle={sidebarToggle}>
        {taskId && task && (
          <Button
            endIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={
              loading ||
              [
                task.done === taskState.done,
                task.title === taskState.title,
                task.notes === taskState.notes,
                (taskState.due === null && taskState.newDue === null) ||
                  (taskState.due &&
                    taskState.newDue &&
                    isEqual(taskState.due, taskState.newDue)),
              ].every((x) => x === true)
            }
            onClick={handleTaskUpdate}
          >
            Save
          </Button>
        )}
      </SidebarHeader>

      <SidebarBody>
        {taskId && task ? (
          <Box
            sx={{
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
                    checked={taskState.done || false}
                    onChange={updateTaskState}
                  />
                }
              />
            </Box>

            <TextField
              name="title"
              label={"Title"}
              inputProps={{ maxlenth: 150 }}
              value={taskState.title || ""}
              onChange={updateTaskState}
            />

            <TextField
              name="notes"
              label={"Notes"}
              value={taskState.notes || ""}
              onChange={updateTaskState}
              multiline
              rows={4}
            />

            <DueForm
              value={taskState.newDue}
              onChange={(newValue) =>
                setTaskState((prev) => ({
                  ...prev,
                  newDue: newValue,
                }))
              }
              onClear={() =>
                setTaskState((prev) => ({ ...prev, newDue: null }))
              }
            />

            <LastModified
              timestamp={task.modified}
              userId={task.userModified}
              showUser={project.sharing}
            />

            {!isShared && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  marginTop: "2rem",
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  onClick={toggleDeleteModal}
                  disabled={loading}
                >
                  Delete task
                </Button>

                <SimpleModal
                  open={deleteModalOpen}
                  onConfirm={handleTaskDelete}
                  onClose={toggleDeleteModal}
                  title={"Delete task?"}
                  content={"This action cannot be undone."}
                  action={"Delete"}
                  loading={loading}
                />
              </Box>
            )}

            <ErrorAlert
              open={error !== null}
              toggle={() => setError(null)}
              message={error}
            />
          </Box>
        ) : (
          "Task not found"
        )}
      </SidebarBody>
    </>
  );
}

export function DueForm(props: {
  value: Date | null;
  onChange: (value: any, keyboardInputValue?: string | undefined) => void;
  onClear: () => void;
  boxSx?: BoxProps["sx"];
  disabled?: boolean;
}) {
  const { value, onChange, onClear, boxSx, disabled } = props;

  return (
    <Box sx={{ display: "flex", alignItems: "center", ...boxSx }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileDateTimePicker
          // name="due"
          label={"Due"}
          value={value}
          ampm={false}
          onChange={onChange}
          renderInput={(params) => (
            <TextField {...params} sx={{ flexGrow: 1 }} />
          )}
          disabled={disabled}
        />
      </LocalizationProvider>

      <Collapse in={value !== null} orientation="horizontal">
        <IconButton
          disabled={value === null || disabled}
          onClick={onClear}
          sx={{ marginLeft: "0.5rem" }}
        >
          <CancelIcon />
        </IconButton>
      </Collapse>
    </Box>
  );
}

function LastModified(props: {
  timestamp: string;
  userId: number;
  showUser: boolean;
}) {
  const { timestamp, userId, showUser } = props;
  const user = useSelector(selectUserById(userId));

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <Box>Last modified</Box>
      <Box>
        {new Date(timestamp).toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          hour12: false,
          hour: "numeric",
          minute: "2-digit",
        })}
      </Box>
      {showUser && user && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Avatar sx={{ width: "2rem", height: "2rem" }}>
            {user.username[0]}
          </Avatar>{" "}
          {user.username}
        </Box>
      )}
    </Box>
  );
}
