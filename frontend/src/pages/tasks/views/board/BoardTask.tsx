import React from "react";
import { Typography, Box, Card, Collapse } from "@mui/material";
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
} from "react-beautiful-dnd";

import { useAppSelector } from "app/store/hooks";
import { selectTaskById } from "app/store/tasksSlice";
import { selectHideDoneTasks } from "app/store/settingsSlice";

import { formatTime } from "../../format-time.util";

type BoardTaskProps = {
  taskId: number;
  onClick: React.MouseEventHandler<HTMLDivElement>;

  draggableRef?: React.Ref<HTMLDivElement>;
  draggableProps?: DraggableProvidedDraggableProps;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  isDragging?: boolean;
};

export const BoardTask: React.FC<BoardTaskProps> = ({
  taskId,
  onClick,
  draggableRef,
  draggableProps,
  dragHandleProps,
  isDragging,
}) => {
  const task = useAppSelector(selectTaskById(taskId));
  const hide = useAppSelector(selectHideDoneTasks);

  return (
    <Collapse in={!(hide && task.done)}>
      <Card
        ref={draggableRef}
        {...draggableProps}
        {...dragHandleProps}
        raised={isDragging}
        sx={{
          marginTop: "0.5rem",
          ...(!task.done &&
            Date.parse(task.due!) < Date.now() && {
              backgroundColor: "error.main",
              color: "error.contrastText",
            }),
        }}
      >
        <Box
          sx={{
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
          <Box onClick={onClick} sx={{ padding: "1rem" }}>
            <Typography variant="body1">{task.title}</Typography>
            <Typography variant="caption" component="div">
              {task.notes}
            </Typography>
            {task.due && (
              <Typography variant="caption" component="div" align="right">
                {formatTime(task.due)}
              </Typography>
            )}
          </Box>
        </Box>
      </Card>
    </Collapse>
  );
};
