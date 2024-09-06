import React from "react";
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
  DroppableProvidedProps,
} from "react-beautiful-dnd";
import {
  Typography,
  Box,
  Button,
  Paper,
  Collapse,
  CircularProgress,
  styled,
  BoxProps,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import type { IProject } from "app/types/projects.types";
import { useActions } from "app/context/ActionsContext";
import { InputModal, SimpleModal } from "app/layout/Modal";
import { ErrorAlert } from "app/layout/Alert";
import { useAppSelector } from "app/store/hooks";
import { selectBoardColumnWidth } from "app/store/settingsSlice";

import { useTasks } from "../../use-tasks.hook";

type BoardColumnProps = {
  title?: string;
  canEdit?: boolean;
  boardEdit?: boolean;
  board: IProject["board"];
  colId: string;
  children?: React.ReactNode;
  projectId?: number;

  draggableRef?: React.Ref<HTMLDivElement>;
  draggableProps?: DraggableProvidedDraggableProps;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  isDragging?: boolean;

  droppableRef?: React.Ref<HTMLDivElement>;
  droppableProps?: DroppableProvidedProps;
  isDraggingOver?: boolean;
};

export const BoardColumn: React.FC<BoardColumnProps> = ({
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

  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const toggleEditDialog = () => setEditDialogOpen((x) => !x);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const toggleDeleteDialog = () => setDeleteDialogOpen((x) => !x);

  const [newColName, setNewColName] = React.useState(title);
  const changeColName = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewColName(e.target.value);

  const [loading, setLoading] = React.useState(false);
  const [loadingDelete, setLoadingDelete] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleColumnRename() {
    const newBoard = {
      ...board,
      columns: {
        ...board.columns,
        [colId]: {
          ...board.columns[colId],
          name: newColName,
        },
      },
    };

    setLoading(true);
    try {
      await actions.project.updateTasksOrder({
        id: projectId,
        board: newBoard,
      });
      setLoading(false);
      toggleEditDialog();
    } catch (error) {
      console.error("Failed to rename column: ", error);
      setLoading(false);
      setError("Can't update column");
    }
  }

  async function handleColumnDelete() {
    const none = board.none.concat(board.columns[colId].taskIds);
    const columns = { ...board.columns };
    delete columns[colId];
    const newBoard = {
      ...board,
      none,
      columns,
      order: board.order.filter((col) => col !== colId),
    };

    setLoadingDelete(true);
    try {
      await actions.project.updateTasksOrder({
        id: projectId,
        board: newBoard,
      });
      setEditDialogOpen(false);
      setDeleteDialogOpen(false);
      setLoadingDelete(false);
    } catch (error) {
      console.error("Failed to delete column: ", error);
      setLoadingDelete(false);
      setError("Can't delete column");
    }
  }

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
              onConfirm={handleColumnRename}
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
                      board.columns[colId].taskIds.length === 0
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
                    onConfirm={handleColumnDelete}
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
              toggle={() => setError(null)}
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