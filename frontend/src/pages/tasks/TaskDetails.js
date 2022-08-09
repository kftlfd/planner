import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isEqual } from "date-fns";

import { useActions } from "../../context/ActionsContext";
import { selectTaskById } from "../../store/tasksSlice";
import { SidebarHeader, SidebarBody } from "../../layout/Sidebar";

import {
  Box,
  Button,
  Checkbox,
  TextField,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDateTimePicker } from "@mui/x-date-pickers";

export function TaskDetails(props) {
  const { open, taskId, sidebarToggle, setTaskSelected } = props;
  const task = useSelector(selectTaskById(taskId));
  const actions = useActions();

  const [loading, setLoading] = useState(false);

  const [taskState, setTaskState] = useState({});

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

  function updateTaskState(e) {
    let { name, value } = e.target;
    if (name === "done") {
      value = !taskState.done;
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
      sidebarToggle();
    } catch (error) {
      console.error("Failed to update task: ", error);
    }
    setLoading(false);
  }

  async function handleTaskDelete() {
    try {
      await actions.task.delete(task.project, task.id);
      sidebarToggle();
      setTaskSelected(null);
      toggleDeleteModal();
    } catch (error) {
      console.error("Failed to delete task: ", error);
    }
  }

  return (
    <>
      <SidebarHeader title="Task details" toggle={sidebarToggle}>
        {taskId && task && (
          <Button
            endIcon={
              loading ? <CircularProgress size={"100%"} /> : <SaveIcon />
            }
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

            <Box
              sx={{ display: "flex", justifyContent: "end", marginTop: "2rem" }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={toggleDeleteModal}
              >
                Delete task
              </Button>

              <TaskDeleteModal
                open={deleteModalOpen}
                onClose={toggleDeleteModal}
                onConfirm={handleTaskDelete}
              />
            </Box>
          </Box>
        ) : (
          "Task not found"
        )}
      </SidebarBody>
    </>
  );
}

function TaskDeleteModal(props) {
  const { open, onClose, onConfirm } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete task?</DialogTitle>
      <DialogContent>
        <DialogContentText>This action cannot be undone.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} color={"error"}>
          Delete
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export function DueForm(props) {
  const { value, onChange, onClear, boxSx } = props;

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", gap: "0.5rem", ...boxSx }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileDateTimePicker
          name="due"
          label={"Due"}
          value={value}
          ampm={false}
          onChange={onChange}
          renderInput={(params) => (
            <TextField {...params} sx={{ flexGrow: 1 }} />
          )}
        />
      </LocalizationProvider>

      <IconButton disabled={value === null} onClick={onClear}>
        <CancelIcon />
      </IconButton>
    </Box>
  );
}
