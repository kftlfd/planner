import { FC, ReactNode, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";

import { Box } from "@mui/material";

import { useActions } from "~/context/ActionsContext";
import { useAppSelector } from "~/store/hooks";
import {
  selectProjectBoard,
  selectSharedProjectIds,
} from "~/store/projectsSlice";
import type { IProject } from "~/types/projects.types";

import { NoTasks } from "../../NoTasks";
import { TaskCreateForm } from "../../TaskCreateForm";
import { useTasks } from "../../use-tasks.hook";
import type { TasksViewProps } from "../index";
import { BoardColumn } from "./BoardColumn";
import { BoardEdit } from "./BoardEdit";
import { BoardTask } from "./BoardTask";
import { BoardWrapper } from "./BoardWrapper";
import { LoadingBoard } from "./Loading";

export const TasksBoardView: FC<TasksViewProps> = ({ selectTask }) => {
  const { projectId, tasksLoaded, taskIds } = useTasks();
  const board = useAppSelector(selectProjectBoard(projectId));
  const actions = useActions();

  const sharedIds = useAppSelector(selectSharedProjectIds);
  const isOwned = !sharedIds.includes(projectId);

  const [boardEdit, setBoardEdit] = useState(false);
  const toggleBoardEdit = () => {
    setBoardEdit((x) => !x);
  };

  if (!board) return null;

  const updateBoard = async (newBoard: IProject["board"]) => {
    try {
      await actions.project.updateTasksOrder({
        id: projectId,
        board: newBoard,
      } as IProject);
    } catch (error) {
      console.error("Failed to update board: ", error);
    }
  };

  const onDragEnd: OnDragEndResponder = (result) => {
    const { destination, source, draggableId, type } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    )
      return;

    const newBoard = JSON.parse(JSON.stringify(board)) as typeof board;

    if (type === "column") {
      const newColumnOrder = Array.from(board.order);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);
      newBoard.order = newColumnOrder;
    }

    if (type === "task") {
      let src: number[] = [];
      if (source.droppableId === "default-col") {
        src = Array.from(newBoard.none);
        src.splice(source.index, 1);
        newBoard.none = src;
      } else {
        const curCol = newBoard.columns[source.droppableId];
        if (curCol) {
          src = Array.from(curCol.taskIds);
          src.splice(source.index, 1);
          curCol.taskIds = src;
        }
      }

      let dest: number[] = [];
      if (destination.droppableId === "default-col") {
        dest = Array.from(newBoard.none);
        dest.splice(destination.index, 0, Number(draggableId));
        newBoard.none = dest;
      } else {
        const curCol = newBoard.columns[destination.droppableId];
        if (curCol) {
          dest = Array.from(curCol.taskIds);
          dest.splice(destination.index, 0, Number(draggableId));
          curCol.taskIds = dest;
        }
      }
    }

    void updateBoard(newBoard);
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

      {!taskIds || taskIds.length === 0 ? (
        <NoTasks />
      ) : (
        <BoardWrapper>
          <DragDropContext onDragEnd={onDragEnd}>
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
                  {board.columns[colId]?.taskIds.map((taskId, taskIndex) => (
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

const DroppableColumn: FC<{
  colId: string;
  board: IProject["board"];
  children?: ReactNode;
}> = ({ colId, board, children }) => (
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

const DraggableBoardTask: FC<{
  taskId: number;
  index: number;
  selectTask: (taskId: number) => () => void;
}> = ({ taskId, index, selectTask }) => (
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

const DraggableColumnsContainer: FC<{
  children?: ReactNode;
}> = ({ children }) => (
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

const DraggableDroppableColumn: FC<{
  colId: string;
  colIndex: number;
  board: IProject["board"];
  boardEdit: boolean;
  children?: ReactNode;
}> = ({ colId, colIndex, board, children, boardEdit }) => (
  <Draggable draggableId={colId} index={colIndex}>
    {(dragProvided, dragSnapshot) => (
      <Droppable droppableId={colId} type="task">
        {(dropProvided, dropSnapshot) => (
          <BoardColumn
            title={board.columns[colId]?.name}
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
