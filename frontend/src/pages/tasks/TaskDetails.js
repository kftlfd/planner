import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

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
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

export function TaskDetails(props) {
  const { taskId, sidebarToggle, setTaskSelected } = props;
  const task = useSelector(selectTaskById(taskId));
  const actions = useActions();

  const [loading, setLoading] = useState(false);

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

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const toggleDeleteModal = () => setDeleteModalOpen((x) => !x);

  useEffect(() => {
    setTaskState({ ...task });
  }, [taskId, task]);

  async function handleTaskUpdate() {
    setLoading(true);
    const taskUpdate = {
      done: taskState.done,
      title: taskState.title,
      notes: taskState.notes,
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

  if (!task) return null;

  return (
    <>
      <SidebarHeader title="Task details" toggle={sidebarToggle}>
        {taskId && task && (
          <Button
            disabled={
              (task.done === taskState.done &&
                task.title === taskState.title &&
                task.notes === taskState.notes) ||
              loading
            }
            onClick={handleTaskUpdate}
            endIcon={<SaveIcon />}
            sx={{ position: "relative" }}
          >
            Save
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
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
