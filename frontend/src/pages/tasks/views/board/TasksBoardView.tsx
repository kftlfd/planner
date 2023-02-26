import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import { Box } from "@mui/material";

import { useAppSelector } from "app/store/hooks";
import {
  selectProjectBoard,
  selectSharedProjectIds,
} from "app/store/projectsSlice";
import { useActions } from "app/context/ActionsContext";
import type { IProject } from "app/types/projects.types";

import type { TasksViewProps } from "../index";
import { TaskCreateForm } from "../../TaskCreateForm";
import { BoardTask } from "./BoardTask";
import { NoTasks } from "../../NoTasks";
import { useTasks } from "../../use-tasks.hook";

import { LoadingBoard } from "./Loading";
import { BoardWrapper } from "./BoardWrapper";
import { BoardColumn } from "./BoardColumn";
import { BoardEdit } from "./BoardEdit";

export const TasksBoardView: React.FC<TasksViewProps> = ({ selectTask }) => {
  const { projectId, tasksLoaded, taskIds } = useTasks();
  const board = useAppSelector(selectProjectBoard(projectId));
  const actions = useActions();

  const sharedIds = useAppSelector(selectSharedProjectIds);
  const isOwned = !sharedIds.includes(projectId);

  const [boardEdit, setBoardEdit] = React.useState(false);
  const toggleBoardEdit = () => setBoardEdit((x) => !x);

  const updateBoard: OnDragEndResponder = async (result) => {
    const { destination, source, draggableId, type } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    )
      return;

    let newBoard = { ...board };

    if (type === "column") {
      const newColumnOrder = Array.from(board.order);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);
      newBoard.order = newColumnOrder;
    }

    if (type === "task") {
      let src;
      if (source.droppableId === "default-col") {
        src = Array.from(newBoard.none);
        src.splice(source.index, 1);
        newBoard.none = src;
      } else {
        src = Array.from(newBoard.columns[source.droppableId].taskIds);
        src.splice(source.index, 1);
        newBoard = {
          ...newBoard,
          columns: {
            ...newBoard.columns,
            [source.droppableId]: {
              ...newBoard.columns[source.droppableId],
              taskIds: src,
            },
          },
        };
      }

      let dest;
      if (destination.droppableId === "default-col") {
        dest = Array.from(newBoard.none);
        dest.splice(destination.index, 0, Number(draggableId));
        newBoard.none = dest;
      } else {
        dest = Array.from(newBoard.columns[destination.droppableId].taskIds);
        dest.splice(destination.index, 0, Number(draggableId));
        newBoard = {
          ...newBoard,
          columns: {
            ...newBoard.columns,
            [destination.droppableId]: {
              ...newBoard.columns[destination.droppableId],
              taskIds: dest,
            },
          },
        };
      }
    }

    try {
      await actions.project.updateTasksOrder({
        id: projectId,
        board: newBoard,
      });
    } catch (error) {
      console.error("Failed to update board: ", error);
    }
  };

  if (!tasksLoaded) return <LoadingBoard />;

  return (
    <>
      <TaskCreateForm projectId={projectId}>
        {isOwned && (
          <BoardEdit
            projectId={projectId}
            board={board}
            boardEdit={boardEdit}
            toggleBoardEdit={toggleBoardEdit}
          />
        )}
      </TaskCreateForm>

      {taskIds.length === 0 ? (
        <NoTasks />
      ) : (
        <BoardWrapper>
          <DragDropContext onDragEnd={updateBoard}>
            <DroppableColumn colId="default-col" board={board}>
              {board.none.map((taskId, index) => (
                <DraggableBoardTask
                  key={taskId}
                  taskId={taskId}
                  index={index}
                  selectTask={selectTask}
                />
              ))}
            </DroppableColumn>

            <DraggableColumnsContainer>
              {board.order.map((colId, colIndex) => (
                <DraggableDroppableColumn
                  key={colId}
                  colId={colId}
                  colIndex={colIndex}
                  board={board}
                  boardEdit={boardEdit}
                >
                  {board.columns[colId].taskIds.map((taskId, taskIndex) => (
                    <DraggableBoardTask
                      key={taskId}
                      taskId={taskId}
                      index={taskIndex}
                      selectTask={selectTask}
                    />
                  ))}
                </DraggableDroppableColumn>
              ))}
            </DraggableColumnsContainer>
          </DragDropContext>
        </BoardWrapper>
      )}
    </>
  );
};

type DroppableColumnProps = {
  colId: string;
  board: IProject["board"];
  children?: React.ReactNode;
};
const DroppableColumn: React.FC<DroppableColumnProps> = ({
  colId,
  board,
  children,
}) => (
  <Droppable droppableId={colId} type="task">
    {(dropProvided, dropSnapshot) => (
      <BoardColumn
        board={board}
        colId="none"
        droppableRef={dropProvided.innerRef}
        droppableProps={dropProvided.droppableProps}
        isDraggingOver={dropSnapshot.isDraggingOver}
      >
        {children}
        {dropProvided.placeholder}
      </BoardColumn>
    )}
  </Droppable>
);

type DraggableBoardTaskProps = {
  taskId: number;
  index: number;
  selectTask: (taskId: number) => () => void;
};
const DraggableBoardTask: React.FC<DraggableBoardTaskProps> = ({
  taskId,
  index,
  selectTask,
}) => (
  <Draggable draggableId={`${taskId}`} index={index}>
    {(dragProvided, dragSnapshot) => (
      <BoardTask
        taskId={taskId}
        onClick={selectTask(taskId)}
        draggableRef={dragProvided.innerRef}
        draggableProps={dragProvided.draggableProps}
        dragHandleProps={dragProvided.dragHandleProps}
        isDragging={dragSnapshot.isDragging}
      />
    )}
  </Draggable>
);

type DraggableColumnsContainerProps = {
  children?: React.ReactNode;
};
const DraggableColumnsContainer: React.FC<DraggableColumnsContainerProps> = ({
  children,
}) => (
  <Droppable droppableId="columns" direction="horizontal" type="column">
    {(dropProvided) => (
      <Box
        ref={dropProvided.innerRef}
        {...dropProvided.droppableProps}
        sx={{ display: "flex" }}
      >
        {children}
        {dropProvided.placeholder}
      </Box>
    )}
  </Droppable>
);

type DraggableDroppableColumnProps = {
  colId: string;
  colIndex: number;
  board: IProject["board"];
  boardEdit: boolean;
  children?: React.ReactNode;
};
const DraggableDroppableColumn: React.FC<DraggableDroppableColumnProps> = ({
  colId,
  colIndex,
  board,
  children,
  boardEdit,
}) => (
  <Draggable draggableId={colId} index={colIndex}>
    {(dragProvided, dragSnapshot) => (
      <Droppable droppableId={colId} type="task">
        {(dropProvided, dropSnapshot) => (
          <BoardColumn
            title={board.columns[colId].name}
            canEdit={true}
            boardEdit={boardEdit}
            board={board}
            colId={colId}
            //
            draggableRef={dragProvided.innerRef}
            draggableProps={dragProvided.draggableProps}
            dragHandleProps={dragProvided.dragHandleProps}
            isDragging={dragSnapshot.isDragging}
            //
            droppableRef={dropProvided.innerRef}
            droppableProps={dropProvided.droppableProps}
            isDraggingOver={dropSnapshot.isDraggingOver}
          >
            {children}
            {dropProvided.placeholder}
          </BoardColumn>
        )}
      </Droppable>
    )}
  </Draggable>
);
