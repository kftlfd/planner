import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { updateTask, deleteTask, selectTaskById } from "../../store/tasksSlice";

import * as api from "../../api/client";

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
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

export function TaskDetails(props) {
  const { projectId, taskId, sidebarToggle, setTaskSelected } = props;

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

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const toggleDeleteModal = () => setDeleteModalOpen((x) => !x);

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

  if (!task) return null;

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

      <SidebarBody>
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
              toggle={toggleDeleteModal}
              handleDelete={handleTaskDelete}
            />
          </Box>
        </Box>
      </SidebarBody>
    </>
  );
}

function TaskDeleteModal(props) {
  const { open, toggle, handleDelete } = props;

  return (
    <Dialog open={open} onClose={toggle}>
      <DialogTitle>Delete task?</DialogTitle>
      <DialogContent>
        <DialogContentText>This action cannot be undone.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            toggle();
            handleDelete();
          }}
          color={"error"}
        >
          Delete
        </Button>
        <Button onClick={toggle}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
