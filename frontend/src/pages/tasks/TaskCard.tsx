import { FC, ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  Box,
  Card,
  CardActionArea,
  Checkbox,
  Collapse,
  Typography,
} from "@mui/material";

import { useActions } from "~/context/ActionsContext";
import { BaseSkeleton } from "~/layout/Loading";
import { selectHideDoneTasks } from "~/store/settingsSlice";
import { selectTaskById } from "~/store/tasksSlice";

import { formatTime } from "./format-time.util";

export const TaskCard: FC<{
  taskId: number;
  openDetails: () => void;
  children?: ReactNode;
}> = ({ taskId, openDetails, children }) => {
  const hideDoneTasks = useSelector(selectHideDoneTasks);
  const task = useSelector(selectTaskById(taskId));
  const actions = useActions();

  const [doneValue, setDoneValue] = useState(task?.done ?? false);
  const toggleDone = () => {
    const newDoneValue = !doneValue;
    const taskUpdate = { done: newDoneValue };
    setDoneValue(newDoneValue);
    actions.task.update(taskId, taskUpdate).catch((err: unknown) => {
      console.error("Failed to update task-done status: ", err);
      setDoneValue(!newDoneValue);
    });
  };

  useEffect(() => {
    if (task) setDoneValue(task.done);
  }, [task]);

  return (
    <Collapse in={!(hideDoneTasks && task?.done)}>
      <Card
        sx={{
          marginBottom: "0.5rem",
          ...(!doneValue &&
            task?.due &&
            Date.parse(task.due) < Date.now() && {
              backgroundColor: "error.main",
              color: "error.contrastText",
            }),
        }}
      >
        <CardActionArea
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "flex-start",
            opacity: doneValue ? 0.5 : 1,
          }}
        >
          {children}

          <Box sx={{ padding: "0.5rem" }}>
            <Checkbox
              sx={{ padding: "0.5rem" }}
              checked={doneValue}
              onChange={toggleDone}
            />
          </Box>

          <Box
            onClick={openDetails}
            sx={{
              flexGrow: 1,
              padding: "1rem",
              paddingLeft: 0,
              textDecoration: doneValue ? "line-through" : "none",
            }}
          >
            <Typography variant="body1">{task?.title}</Typography>
            <Typography variant="caption" component="div">
              {task?.notes}
            </Typography>
            {task?.due && (
              <Typography variant="caption" component="div" align="right">
                {formatTime(task.due)}
              </Typography>
            )}
          </Box>
        </CardActionArea>
      </Card>
    </Collapse>
  );
};

export function CardSkeleton() {
  return <BaseSkeleton height={"56px"} sx={{ marginBottom: "0.5rem" }} />;
}
