import { FC, ReactNode, Ref, useState } from "react";
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
  DroppableProvidedProps,
} from "@hello-pangea/dnd";

import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Paper,
  styled,
  Typography,
} from "@mui/material";

import { useActions } from "~/context/ActionsContext";
import { ErrorAlert } from "~/layout/Alert";
import { InputModal, SimpleModal } from "~/layout/Modal";
import { useAppSelector } from "~/store/hooks";
import { selectBoardColumnWidth } from "~/store/settingsSlice";
import type { IProject } from "~/types/projects.types";

import { useTasks } from "../../use-tasks.hook";

export const BoardColumn: FC<{
  title?: string;
  canEdit?: boolean;
  boardEdit?: boolean;
  board: IProject["board"];
  colId: string;
  children?: ReactNode;
  projectId?: number;

  draggableRef?: Ref<HTMLDivElement>;
  draggableProps?: DraggableProvidedDraggableProps;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  isDragging?: boolean;

  droppableRef?: Ref<HTMLDivElement>;
  droppableProps?: DroppableProvidedProps;
  isDraggingOver?: boolean;
}> = ({
  title,
  canEdit,
  boardEdit,
  board,
  colId,
  children,
  draggableRef,
  draggableProps,
  dragHandleProps,
  isDragging,
  droppableRef,
  droppableProps,
  isDraggingOver,
}) => {
  const { projectId } = useTasks();
  const actions = useActions();

  const columnWidth = useAppSelector(selectBoardColumnWidth);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const toggleEditDialog = () => {
    setEditDialogOpen((x) => !x);
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const toggleDeleteDialog = () => {
    setDeleteDialogOpen((x) => !x);
  };

  const [newColName, setNewColName] = useState(title ?? "");
  const changeColName = (v: string) => {
    setNewColName(v);
  };

  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleColumnRename = async () => {
    const newBoard = JSON.parse(JSON.stringify(board)) as typeof board;
    const curCol = newBoard.columns[colId];
    if (!curCol) return;
    curCol.name = newColName;

    setLoading(true);
    try {
      await actions.project.updateTasksOrder({
        id: projectId,
        board: newBoard,
      } as IProject);
      setLoading(false);
      toggleEditDialog();
    } catch (error) {
      console.error("Failed to rename column: ", error);
      setLoading(false);
      setError("Can't update column");
    }
  };

  const handleColumnDelete = async () => {
    const none = board.none.concat(board.columns[colId]?.taskIds ?? []);
    const newBoard: IProject["board"] = {
      ...board,
      none,
      columns: Object.fromEntries(
        Object.entries(board.columns).filter(([key]) => key !== colId),
      ),
      order: board.order.filter((col) => col !== colId),
    };

    setLoadingDelete(true);
    try {
      await actions.project.updateTasksOrder({
        id: projectId,
        board: newBoard,
      } as IProject);
      setEditDialogOpen(false);
      setDeleteDialogOpen(false);
      setLoadingDelete(false);
    } catch (error) {
      console.error("Failed to delete column: ", error);
      setLoadingDelete(false);
      setError("Can't delete column");
    }
  };

  return (
    <Column
      ref={draggableRef}
      {...draggableProps}
      elevation={isDragging ? 8 : 0}
      columnWidth={columnWidth}
      canEdit={canEdit}
      isDragging={isDragging}
    >
      <ColumnHeader>
        <Typography
          variant="h6"
          component="div"
          {...(!title && { sx: { color: "text.disabled" } })}
        >
          {title || "Default"}
        </Typography>

        {canEdit && (
          <ColumnEditContainer>
            <Collapse in={boardEdit} orientation="horizontal">
              <ColumnEditBtn size="small" onClick={toggleEditDialog}>
                <EditIcon />
              </ColumnEditBtn>
            </Collapse>

            <Collapse in={boardEdit} orientation="horizontal">
              <ColumnEditBtn size="small" {...dragHandleProps}>
                <DragIndicatorIcon />
              </ColumnEditBtn>
            </Collapse>

            <InputModal
              open={editDialogOpen}
              onConfirm={() => void handleColumnRename()}
              onClose={toggleEditDialog}
              title={`Edit column "${title}"`}
              action={"Rename"}
              inputValue={newColName}
              inputChange={changeColName}
              actionsChildren={
                <>
                  <Button
                    color="error"
                    onClick={
                      board.columns[colId]?.taskIds.length === 0
                        ? handleColumnDelete
                        : toggleDeleteDialog
                    }
                    disabled={loading || loadingDelete}
                    endIcon={loadingDelete && <CircularProgress size={20} />}
                  >
                    Delete
                  </Button>

                  <SimpleModal
                    open={deleteDialogOpen}
                    onConfirm={() => void handleColumnDelete()}
                    onClose={toggleDeleteDialog}
                    title={`Delete column "${title}"?`}
                    content={`Tasks will be moved to default column`}
                    action={"Delete"}
                    loading={loadingDelete}
                  />

                  <Box sx={{ flexGrow: 1 }} />
                </>
              }
              loading={loading}
            />

            <ErrorAlert
              open={error !== null}
              toggle={() => {
                setError(null);
              }}
              message={error}
            />
          </ColumnEditContainer>
        )}
      </ColumnHeader>

      <ColumnBody
        ref={droppableRef}
        {...droppableProps}
        isDraggingOver={isDraggingOver}
      >
        {children}
      </ColumnBody>
    </Column>
  );
};

type ColumnProps = {
  columnWidth: number;
  canEdit?: boolean;
  isDragging?: boolean;
};
const ColumnPropsArray: PropertyKey[] = [
  "columnWidth",
  "canEdit",
  "isDragging",
];
const Column = styled(Paper, {
  shouldForwardProp: (prop) => !ColumnPropsArray.includes(prop),
})<ColumnProps>(({ columnWidth, canEdit, isDragging, theme }) => ({
  flexShrink: 0,
  width: `${columnWidth}px`,
  display: "flex",
  flexDirection: "column",
  padding: "0.5rem",
  backgroundColor: "transparent",
  transition: "background 0.3s ease",
  ...(canEdit && {
    marginLeft: "0.5rem",
  }),
  ...(isDragging && {
    backgroundColor: theme.palette.action.focus,
  }),
}));

const ColumnHeader = styled(Box)({
  display: "flex",
  gap: "1rem",
});

type ColumnBodyProps = {
  isDraggingOver?: boolean;
};
const ColumnBody = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isDraggingOver",
})<ColumnBodyProps>(({ isDraggingOver, theme }) => ({
  flexGrow: 1,
  margin: "0 -0.5rem -0.5rem",
  padding: "0 0.5rem 0.5rem",
  borderRadius: "0.25rem",
  transition: "background 0.3s ease",
  ...(isDraggingOver && {
    backgroundColor: theme.palette.action.focus,
  }),
}));

const ColumnEditContainer = styled(Box)({
  flexGrow: 1,
  display: "flex",
  justifyContent: "space-between",
});

const ColumnEditBtn = styled(Button)({
  height: "2rem",
  minWidth: 0,
  aspectRatio: 1,
});
