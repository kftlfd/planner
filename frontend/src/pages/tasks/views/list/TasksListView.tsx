import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import { Container, Box, BoxProps } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import { useActions } from "app/context/ActionsContext";

import type { TasksViewProps } from "../index";
import { TaskCreateForm } from "../../TaskCreateForm";
import { CardSkeleton, TaskCard } from "../../TaskCard";
import { NoTasks } from "../../NoTasks";
import { useTasks } from "../../use-tasks.hook";

export const TasksListView: React.FC<TasksViewProps> = ({ selectTask }) => {
  const { projectId, tasksLoaded, taskIds } = useTasks();
  const actions = useActions();

  const updateTasksOrder: OnDragEndResponder = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newOrder = Array.from(taskIds);
    newOrder.splice(source.index, 1);
    newOrder.splice(destination.index, 0, Number(draggableId));

    actions.project.updateTasksOrder({ id: projectId, tasksOrder: newOrder });
  };

  if (!tasksLoaded) {
    return <LoadingList />;
  }

  return (
    <>
      <TaskCreateForm projectId={projectId} />

      {taskIds.length === 0 ? (
        <NoTasks />
      ) : (
        <TaskListWrapper>
          <DragDropContext onDragEnd={updateTasksOrder}>
            <DroppableList>
              {taskIds.map((taskId, index) => (
                <DraggableTask
                  key={`${taskId}`}
                  taskId={taskId}
                  index={index}
                  selectTask={selectTask}
                />
              ))}
            </DroppableList>
          </DragDropContext>
        </TaskListWrapper>
      )}
    </>
  );
};

type DroppableListProps = {
  children?: React.ReactNode;
};
const DroppableList: React.FC<DroppableListProps> = ({ children }) => (
  <Droppable droppableId="tasksListView">
    {({ innerRef, droppableProps, placeholder }) => (
      <Box ref={innerRef} {...droppableProps}>
        {children}
        {placeholder}
      </Box>
    )}
  </Droppable>
);

type DraggableTaskProps = {
  taskId: number;
  index: number;
  selectTask: (taskId: number) => () => void;
};
const DraggableTask: React.FC<DraggableTaskProps> = ({
  taskId,
  index,
  selectTask,
}) => (
  <Draggable draggableId={`${taskId}`} index={index}>
    {({ innerRef, draggableProps, dragHandleProps }) => (
      <Box ref={innerRef} {...draggableProps}>
        <TaskCard taskId={taskId} openDetails={selectTask(taskId)}>
          <DragHandle {...dragHandleProps} />
        </TaskCard>
      </Box>
    )}
  </Draggable>
);

type TaskListWrapperProps = {
  children?: React.ReactNode;
};
const TaskListWrapper: React.FC<TaskListWrapperProps> = ({ children }) => (
  <Container maxWidth="md" sx={{ paddingBottom: { xs: "1rem", sm: "1.5rem" } }}>
    {children}
  </Container>
);

const DragHandle: React.FC = (props) => (
  <Box
    {...props}
    sx={{
      display: "grid",
      placeContent: "center",
      margin: " 1rem -0.5rem 0 0.5rem",
    }}
  >
    <DragIndicatorIcon />
  </Box>
);

const LoadingList: React.FC = () => (
  <>
    <TaskCreateForm loading={true} />

    <TaskListWrapper>
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <CardSkeleton key={i} />
        ))}
    </TaskListWrapper>
  </>
);
