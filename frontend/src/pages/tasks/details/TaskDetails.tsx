import { FC, ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isEqual } from "date-fns";

import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  styled,
  TextField,
} from "@mui/material";

import { useActions } from "~/context/ActionsContext";
import { ErrorAlert } from "~/layout/Alert";
import { SimpleModal } from "~/layout/Modal";
import { SidebarBody, SidebarHeader } from "~/layout/Sidebar";
import { Sidebar } from "~/layout/Sidebar";
import {
  selectProjectById,
  selectSharedProjectIds,
} from "~/store/projectsSlice";
import { selectTaskById } from "~/store/tasksSlice";

import { DueForm } from "../DueForm";
import { LastModified } from "../LastModified";
import { useTasks } from "../use-tasks.hook";

export const TaskDetails: FC<{
  open: boolean;
  taskId: number | null;
  sidebarToggle: () => void;
  setTaskSelected: (taskId: number | null) => void;
}> = ({ open, taskId, sidebarToggle, setTaskSelected }) => {
  const { projectId } = useTasks();

  const project = useSelector(selectProjectById(projectId));
  const sharedIds = useSelector(selectSharedProjectIds);
  const isShared = sharedIds.includes(projectId);

  const task = useSelector(selectTaskById(taskId || -1));
  const actions = useActions();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [done, setDone] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [due, setDue] = useState<Date | null>(null);
  const [newDue, setNewDue] = useState<Date | null>(null);

  useEffect(() => {
    setDone(task ? task.done : false);
    setTitle(task ? task.title : "");
    setNotes(task ? task.notes : "");
    setDue(task?.due ? new Date(task.due) : null);
    setNewDue(task?.due ? new Date(task.due) : null);
  }, [open, task]);

  const handleTaskUpdate = async () => {
    if (taskId === null) return;
    setLoading(true);
    const taskUpdate = {
      done,
      title,
      notes,
      due: newDue?.toISOString() || null,
    };
    try {
      await actions.task.update(taskId, taskUpdate);
      sidebarToggle();
    } catch (error) {
      console.error("Failed to update task: ", error);
      setError("Can't update task");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskDelete = async (closeModal: () => void) => {
    if (!task) return;
    setLoading(true);
    try {
      await actions.task.delete(task.project, task.id);
      sidebarToggle();
      setTaskSelected(null);
      closeModal();
    } catch (error) {
      console.error("Failed to delete task: ", error);
      setError("Can't delete task");
    } finally {
      setLoading(false);
    }
  };

  const saveBtnDisabled =
    loading ||
    ((task &&
      task.done === done &&
      task.title === title &&
      task.notes === notes &&
      ((due === null && newDue === null) ||
        (due !== null && newDue !== null && isEqual(due, newDue)))) ??
      true);

  return (
    <Sidebar open={open} toggle={sidebarToggle}>
      <DetailsHeader
        toggleSidebar={sidebarToggle}
        onTaskSave={() => void handleTaskUpdate()}
        isTask={!!(taskId && task)}
        isLoading={loading}
        isDisabled={saveBtnDisabled}
      />

      <DetailsBody isTask={!!(taskId && task)}>
        {!!(taskId && task) && (
          <>
            <Box>
              <FormControlLabel
                label="Done"
                control={
                  <Checkbox
                    name="done"
                    checked={done}
                    onChange={() => {
                      setDone((prev) => !prev);
                    }}
                  />
                }
              />
            </Box>

            <TextField
              name="title"
              label={"Title"}
              inputProps={{ maxlenth: 150 }}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />

            <TextField
              name="notes"
              label={"Notes"}
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
              }}
              multiline
              rows={4}
            />

            <DueForm
              value={newDue}
              onChange={(newValue) => {
                setNewDue(newValue);
              }}
              onClear={() => {
                setNewDue(null);
              }}
            />

            <LastModified
              timestamp={task.modified}
              userId={task.userModified}
              showUser={project?.sharing ?? false}
            />

            {!isShared && (
              <DeleteTaskBtn
                onDelete={(close) => void handleTaskDelete(close)}
                isLoading={loading}
              />
            )}

            <ErrorAlert
              open={error !== null}
              toggle={() => {
                setError(null);
              }}
              message={error}
            />
          </>
        )}
      </DetailsBody>
    </Sidebar>
  );
};

const DetailsFieldsContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});

const DeleteBtnContainer = styled(Box)({
  display: "flex",
  justifyContent: "end",
  marginTop: "2rem",
});

const DetailsHeader: FC<{
  toggleSidebar: () => void;
  onTaskSave: () => void;
  isTask: boolean;
  isLoading: boolean;
  isDisabled: boolean;
}> = ({ toggleSidebar, onTaskSave, isTask, isLoading, isDisabled }) => (
  <SidebarHeader title="Task details" toggle={toggleSidebar}>
    {isTask && (
      <Button
        endIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
        disabled={isDisabled}
        onClick={onTaskSave}
      >
        Save
      </Button>
    )}
  </SidebarHeader>
);

const DetailsBody: FC<{
  isTask: boolean;
  children?: ReactNode;
}> = ({ isTask, children }) => (
  <SidebarBody>
    {isTask ? (
      <DetailsFieldsContainer>{children}</DetailsFieldsContainer>
    ) : (
      "Task not found"
    )}
  </SidebarBody>
);

const DeleteTaskBtn: FC<{
  onDelete: (closeModal: () => void) => void;
  isLoading: boolean;
}> = ({ onDelete, isLoading }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const toggleDeleteModal = () => {
    setDeleteModalOpen((x) => !x);
  };

  return (
    <DeleteBtnContainer>
      <Button
        variant="contained"
        color="error"
        onClick={toggleDeleteModal}
        disabled={isLoading}
      >
        Delete task
      </Button>

      <SimpleModal
        open={deleteModalOpen}
        onConfirm={() => {
          onDelete(toggleDeleteModal);
        }}
        onClose={toggleDeleteModal}
        title={"Delete task?"}
        content={"This action cannot be undone."}
        action={"Delete"}
        loading={isLoading}
      />
    </DeleteBtnContainer>
  );
};
