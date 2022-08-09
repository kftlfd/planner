import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useActions } from "../../context/ActionsContext";
import { selectHideDoneTasks } from "../../store/settingsSlice";
import { selectTaskById } from "../../store/tasksSlice";

import {
  Typography,
  Box,
  Card,
  CardActionArea,
  Checkbox,
  Collapse,
} from "@mui/material";
import { BaseSkeleton } from "../../layout/Loading";

const timeFormat = [
  {},
  {
    month: "short",
    day: "numeric",
    hour12: false,
    hour: "numeric",
    minute: "2-digit",
  },
];

export function TaskCard(props) {
  const { taskId, openDetails, children } = props;
  const hideDoneTasks = useSelector(selectHideDoneTasks);
  const task = useSelector(selectTaskById(taskId));
  const actions = useActions();

  const [doneValue, setDoneValue] = useState(task.done);
  const toggleDone = () => {
    const newDoneValue = !doneValue;
    const taskUpdate = { done: newDoneValue };
    setDoneValue(newDoneValue);
    actions.task.update(taskId, taskUpdate).catch((err) => {
      console.error("Failed to update task-done status: ", err);
      setDoneValue(!newDoneValue);
    });
  };

  useEffect(() => {
    setDoneValue(task.done);
  }, [task]);

  return (
    <Collapse in={!(hideDoneTasks && task.done)}>
      <Card
        sx={{
          marginBottom: "0.5rem",
          ...(!doneValue &&
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
            <Typography variant="body1">{task.title}</Typography>
            <Typography variant="caption" component="div">
              {task.notes}
            </Typography>
            {task.due && (
              <Typography variant="caption" component="div" align="right">
                {new Date(task.due).toLocaleString(...timeFormat)}
              </Typography>
            )}
          </Box>
        </CardActionArea>
      </Card>
    </Collapse>
  );
}

export function BoardTask(props) {
  const { taskId, isDragging, dragProps, dragHandle, onClick } = props;
  const task = useSelector(selectTaskById(taskId));
  const hide = useSelector(selectHideDoneTasks);

  return (
    <Collapse in={!(hide && task.done)}>
      <Card
        raised={isDragging}
        {...dragProps}
        {...dragHandle}
        sx={{
          marginTop: "0.5rem",
          ...(!task.done &&
            Date.parse(task.due) < Date.now() && {
              backgroundColor: "error.main",
              color: "error.contrastText",
            }),
        }}
      >
        <Box
          sx={{
            padding: "1rem",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "action.hover",
            },
            ...(task.done && {
              opacity: 0.5,
              textDecoration: "line-through",
            }),
          }}
        >
          <Box onClick={onClick}>
            <Typography variant="body1">{task.title}</Typography>
            <Typography variant="caption" component="div">
              {task.notes}
            </Typography>
            {task.due && (
              <Typography variant="caption" component="div" align="right">
                {new Date(task.due).toLocaleString(...timeFormat)}
              </Typography>
            )}
          </Box>
        </Box>
      </Card>
    </Collapse>
  );
}

export function CardSkeleton(props) {
  return <BaseSkeleton height={"56px"} sx={{ marginBottom: "0.5rem" }} />;
}
