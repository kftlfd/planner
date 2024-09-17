import { FC, ReactNode } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "react-beautiful-dnd";

import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Box, BoxProps, Container } from "@mui/material";

import { useActions } from "~/context/ActionsContext";
import { IProject } from "~/types/projects.types";

import { NoTasks } from "../../NoTasks";
import { CardSkeleton, TaskCard } from "../../TaskCard";
import { TaskCreateForm } from "../../TaskCreateForm";
import { useTasks } from "../../use-tasks.hook";
import type { TasksViewProps } from "../index";

export const TasksListView: FC<TasksViewProps> = ({ selectTask }) => {
  const { projectId, tasksLoaded, taskIds } = useTasks();
  const actions = useActions();

  const updateTasksOrder: OnDragEndResponder = (result) => {
    if (!taskIds) return;
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

    actions.project
      .updateTasksOrder({
        id: projectId,
        tasksOrder: newOrder,
      } as IProject)
      .catch((err: unknown) => {
        console.error(err);
      });
  };

  if (!tasksLoaded) {
    return <LoadingList />;
  }

  return (
    <>
      <TaskCreateForm projectId={projectId} />

      {!taskIds || taskIds.length === 0 ? (
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

const DroppableList: FC<{
  children?: ReactNode;
}> = ({ children }) => (
  <Droppable droppableId="tasksListView">
    {({ innerRef, droppableProps, placeholder }) => (
      <Box ref={innerRef} {...droppableProps}>
        {children}
        {placeholder}
      </Box>
    )}
  </Droppable>
);

const DraggableTask: FC<{
  taskId: number;
  index: number;
  selectTask: (taskId: number) => () => void;
}> = ({ taskId, index, selectTask }) => (
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

const TaskListWrapper: FC<{
  children?: ReactNode;
}> = ({ children }) => (
  <Container maxWidth="md" sx={{ paddingBottom: { xs: "1rem", sm: "1.5rem" } }}>
    {children}
  </Container>
);

const DragHandle: FC<BoxProps> = (props) => (
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

const LoadingList: FC = () => (
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
