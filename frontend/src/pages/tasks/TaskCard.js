import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { selectHideDoneTasks } from "../../store/settingsSlice";
import { updateTask, selectTaskById } from "../../store/tasksSlice";

import * as api from "../../api/client";

import {
  Typography,
  Box,
  Card,
  CardActionArea,
  Checkbox,
  Collapse,
} from "@mui/material";

export function TaskCard(props) {
  const { projectId, taskId, setSelectedTask, taskDetailsToggle } = props;
  const hideDoneTasks = useSelector(selectHideDoneTasks);

  const task = useSelector(selectTaskById(taskId));
  const dispatch = useDispatch();

  const [doneValue, setDoneValue] = useState(task.done);
  const toggleDone = () => {
    const newDoneValue = !doneValue;
    setDoneValue(newDoneValue);
    api.tasks
      .update(projectId, taskId, { done: newDoneValue })
      .then((res) => {
        dispatch(updateTask(res));
      })
      .catch((err) => {
        console.log("Failed to update task-done status: ", err);
        setDoneValue(!newDoneValue);
      });
  };

  useEffect(() => {
    setDoneValue(task.done);
  }, [task]);

  const openTaskDetails = () => {
    setSelectedTask(taskId);
    taskDetailsToggle();
  };

  return (
    <Collapse in={!(hideDoneTasks && task.done)}>
      <Card sx={{ marginBottom: "0.5rem" }}>
        <CardActionArea
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ padding: "0.5rem" }}>
            <Checkbox
              sx={{ padding: "0.5rem" }}
              checked={doneValue}
              onChange={toggleDone}
            />
          </Box>

          <Box
            onClick={() => {
              setSelectedTask(taskId);
              taskDetailsToggle();
            }}
            sx={{ flexGrow: 1, padding: "1rem", paddingLeft: 0 }}
          >
            <Typography variant="body1">{task.title}</Typography>
            <Typography variant="body2">{task.notes}</Typography>
            <Typography variant="body2">{task.due}</Typography>
          </Box>
        </CardActionArea>
      </Card>
    </Collapse>
  );
}
