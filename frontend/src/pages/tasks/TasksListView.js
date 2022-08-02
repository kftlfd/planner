import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { useActions } from "../../context/ActionsContext";
import { TaskCreateForm } from "./TaskCreateForm";
import { TaskCard } from "./TaskCard";
import { NoTasks } from "./Tasks";
import { BaseSkeleton } from "../../layout/Loading";

import { Container, Box } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

export function TasksListView(props) {
  const {
    projectId,
    tasksLoaded,
    taskIds,
    setSelectedTask,
    taskDetailsToggle,
  } = props;
  const actions = useActions();

  function updateTasksOrder(result) {
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
  }

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
            <Droppable droppableId="tasksListView">
              {(provided) => (
                <Box ref={provided.innerRef} {...provided.droppableProps}>
                  {taskIds.map((taskId, index) => (
                    <Draggable
                      key={`${taskId}`}
                      draggableId={`${taskId}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <TaskCard
                            taskId={taskId}
                            openDetails={() => {
                              setSelectedTask(taskId);
                              taskDetailsToggle();
                            }}
                          >
                            <DragHandle {...provided.dragHandleProps} />
                          </TaskCard>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        </TaskListWrapper>
      )}
    </>
  );
}

function TaskListWrapper({ children }) {
  return (
    <Container
      maxWidth="md"
      sx={{ paddingBottom: { xs: "1rem", sm: "1.5rem" } }}
    >
      {children}
    </Container>
  );
}

function DragHandle(props) {
  return (
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
}

function LoadingList() {
  return (
    <>
      <TaskCreateForm loading={true} />
      <TaskListWrapper>
        {[...Array(4).keys()].map((x) => (
          <BaseSkeleton
            key={x}
            height={"56px"}
            sx={{ marginBottom: "0.5rem" }}
          />
        ))}
      </TaskListWrapper>
    </>
  );
}
