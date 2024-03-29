import React from "react";
import { useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import {
  selectProjectBoard,
  selectSharedProjectIds,
} from "../../store/projectsSlice";
import { selectBoardColumnWidth } from "../../store/settingsSlice";
import { useActions } from "../../context/ActionsContext";
import { TaskCreateForm } from "./TaskCreateForm";
import { BoardTask } from "./TaskCard";
import { NoTasks } from "./Tasks";
import { InputModal, SimpleModal } from "../../layout/Modal";
import { ErrorAlert } from "../../layout/Alert";
import { BaseSkeleton } from "../../layout/Loading";

import {
  Typography,
  Container,
  Box,
  Button,
  Card,
  Paper,
  Collapse,
} from "@mui/material";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import EditIcon from "@mui/icons-material/Edit";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

export function TasksBoardView(props) {
  const {
    projectId,
    tasksLoaded,
    taskIds,
    setSelectedTask,
    taskDetailsToggle,
  } = props;
  const board = useSelector(selectProjectBoard(projectId));
  const actions = useActions();
  const columnWidth = useSelector(selectBoardColumnWidth);

  const sharedIds = useSelector(selectSharedProjectIds);
  const isOwned = !sharedIds.includes(Number(projectId));

  const [boardEdit, setBoardEdit] = React.useState(false);
  const toggleBoardEdit = () => setBoardEdit((x) => !x);

  async function updateBoard(result) {
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
  }

  if (!tasksLoaded) return <LoadingBoard columnWidth={columnWidth} />;

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
            <Droppable droppableId="default-col" type="task">
              {(dropProvided, snapshot) => (
                <BoardColumn
                  columnWidth={columnWidth}
                  dropProps={{
                    ref: dropProvided.innerRef,
                    ...dropProvided.droppableProps,
                  }}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  {board.none.map((taskId, index) => (
                    <Draggable
                      key={taskId}
                      draggableId={`${taskId}`}
                      index={index}
                    >
                      {(dragProvided, dragSnapshot) => (
                        <BoardTask
                          taskId={taskId}
                          dragProps={{
                            ref: dragProvided.innerRef,
                            ...dragProvided.draggableProps,
                          }}
                          dragHandle={{
                            ...dragProvided.dragHandleProps,
                          }}
                          onClick={() => {
                            setSelectedTask(taskId);
                            taskDetailsToggle();
                          }}
                          isDragging={dragSnapshot.isDragging}
                        />
                      )}
                    </Draggable>
                  ))}
                  {dropProvided.placeholder}
                </BoardColumn>
              )}
            </Droppable>

            <Droppable
              droppableId="columns"
              direction="horizontal"
              type="column"
            >
              {(providedWrapper) => (
                <Box
                  ref={providedWrapper.innerRef}
                  {...providedWrapper.droppableProps}
                  sx={{ display: "flex" }}
                >
                  {board.order.map((colId, colIndex) => (
                    <Draggable
                      key={colId}
                      draggableId={`${colId}`}
                      index={colIndex}
                    >
                      {(draggableColumnProvided, draggableColumnSnapshot) => (
                        <Droppable droppableId={`${colId}`} type="task">
                          {(dropProvided, dropSnapshot) => (
                            <BoardColumn
                              columnWidth={columnWidth}
                              title={board.columns[colId].name}
                              canEdit={true}
                              boardEdit={boardEdit}
                              board={board}
                              colId={colId}
                              projectId={projectId}
                              dragProps={{
                                ref: draggableColumnProvided.innerRef,
                                ...draggableColumnProvided.draggableProps,
                              }}
                              dragHandle={{
                                ...draggableColumnProvided.dragHandleProps,
                              }}
                              dropProps={{
                                ref: dropProvided.innerRef,
                                ...dropProvided.droppableProps,
                              }}
                              isDragging={draggableColumnSnapshot.isDragging}
                              isDraggingOver={dropSnapshot.isDraggingOver}
                            >
                              {board.columns[colId].taskIds.map(
                                (taskId, taskIndex) => (
                                  <Draggable
                                    key={taskId}
                                    draggableId={`${taskId}`}
                                    index={taskIndex}
                                  >
                                    {(dragProvided, dragSnapshot) => (
                                      <BoardTask
                                        taskId={taskId}
                                        dragProps={{
                                          ref: dragProvided.innerRef,
                                          ...dragProvided.draggableProps,
                                        }}
                                        dragHandle={{
                                          ...dragProvided.dragHandleProps,
                                        }}
                                        onClick={() => {
                                          setSelectedTask(taskId);
                                          taskDetailsToggle();
                                        }}
                                        isDragging={dragSnapshot.isDragging}
                                      />
                                    )}
                                  </Draggable>
                                )
                              )}
                              {dropProvided.placeholder}
                            </BoardColumn>
                          )}
                        </Droppable>
                      )}
                    </Draggable>
                  ))}
                  {providedWrapper.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        </BoardWrapper>
      )}
    </>
  );
}

function BoardWrapper({ children }) {
  return (
    <Container
      sx={{
        flexGrow: 1,
        paddingBottom: { xs: "1rem", sm: "1.5rem" },
        display: "flex",
        overflow: "scroll",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          marginInline: "-0.5rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {children}
      </Box>
    </Container>
  );
}

function BoardEdit(props) {
  const { projectId, board, boardEdit, toggleBoardEdit } = props;
  const actions = useActions();

  const [modalOpen, setModalOpen] = React.useState(false);
  const toggleModal = () => setModalOpen((x) => !x);

  const [newColName, setNewColName] = React.useState("");
  const changeColName = (e) => setNewColName(e.target.value);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  async function createNewColumn() {
    const newCol = {
      id: `col-${board.lastColId + 1}`,
      name: newColName,
      taskIds: [],
    };

    const newOrder = Array.from(board.order);
    newOrder.push(newCol.id);

    const newBoard = {
      ...board,
      order: newOrder,
      columns: {
        ...board.columns,
        [newCol.id]: newCol,
      },
      lastColId: board.lastColId + 1,
    };

    setLoading(true);
    try {
      await actions.project.updateTasksOrder({
        id: projectId,
        board: newBoard,
      });
      setLoading(false);
      setNewColName("");
      toggleModal();
    } catch (error) {
      console.error("Failed to update board: ", error);
      setLoading(false);
      setError("Can't create new column");
    }
  }

  return (
    <Paper sx={{ flexShrink: 0, display: "flex" }}>
      <Collapse in={boardEdit} orientation="horizontal">
        <Button
          size={"small"}
          endIcon={<DashboardCustomizeIcon />}
          onClick={toggleModal}
          sx={{
            height: "2.5rem",
            paddingInline: "1rem",
            marginRight: "0.5rem",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          Add column
        </Button>
      </Collapse>

      <Button
        size={"small"}
        sx={{ height: "2.5rem", minWidth: 0, aspectRatio: "1/1", padding: 0 }}
        variant={boardEdit ? "contained" : "default"}
        onClick={toggleBoardEdit}
      >
        <EditIcon />
      </Button>

      <InputModal
        open={modalOpen}
        onConfirm={createNewColumn}
        onClose={toggleModal}
        title={"Add new column"}
        content={null}
        action={"Add"}
        inputLabel={"Column name"}
        inputValue={newColName}
        inputChange={changeColName}
        loading={loading}
      />

      <ErrorAlert
        open={error !== null}
        toggle={() => setError(null)}
        message={error}
      />
    </Paper>
  );
}

function BoardColumn(props) {
  const { title, canEdit, boardEdit, board, colId, children, projectId } =
    props;
  const actions = useActions();

  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const toggleEditDialog = () => setEditDialogOpen((x) => !x);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const toggleDeleteDialog = () => setDeleteDialogOpen((x) => !x);

  const [newColName, setNewColName] = React.useState(title);
  const changeColName = (e) => setNewColName(e.target.value);

  const [loading, setLoading] = React.useState(false);
  const [loadingDelete, setLoadingDelete] = React.useState(false);
  const [error, setError] = React.useState(null);

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

  const columnStyle = {
    flexShrink: 0,
    width: `${props.columnWidth}px`,
    display: "flex",
    flexDirection: "column",
    padding: "0.5rem",
    backgroundColor: "transparent",
    transition: "background 0.3s ease",
    ...(canEdit && { marginLeft: "0.5rem" }),
    ...(props.isDragging && {
      backgroundColor: "action.focus",
    }),
  };

  const titleStyle = {
    display: "flex",
    gap: "1rem",
  };

  const bodyStyle = {
    flexGrow: 1,
    marginInline: "-0.5rem",
    marginBottom: "-0.5rem",
    paddingInline: "0.5rem",
    paddingBottom: "0.5rem",
    borderRadius: "0.25rem",
    transition: "background 0.3s ease",
    ...(props.isDraggingOver && {
      backgroundColor: "action.focus",
    }),
  };

  return (
    <Paper
      {...props.dragProps}
      elevation={props.isDragging ? 8 : 0}
      sx={columnStyle}
    >
      <Box sx={titleStyle}>
        <Typography
          variant="h6"
          component="div"
          {...(!title && { sx: { color: "text.disabled" } })}
        >
          {title || "Default"}
        </Typography>
        {canEdit && (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Collapse in={boardEdit} orientation="horizontal">
              <Button
                onClick={toggleEditDialog}
                size="small"
                sx={{ height: "2rem", minWidth: 0, aspectRatio: "1/1" }}
              >
                <EditIcon />
              </Button>
            </Collapse>

            <Collapse in={boardEdit} orientation="horizontal">
              <Button
                size="small"
                {...props.dragHandle}
                sx={{ height: "2rem", minWidth: 0, aspectRatio: "1/1" }}
              >
                <DragIndicatorIcon />
              </Button>

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
            </Collapse>
          </Box>
        )}
      </Box>
      <Box {...props.dropProps} sx={bodyStyle}>
        {children}
      </Box>
    </Paper>
  );
}

function LoadingBoard(props) {
  function skeleton(height) {
    return (
      <BaseSkeleton
        width={`${props.columnWidth}px`}
        height={height}
        variant="rectangular"
        animation="wave"
        sx={{ marginInline: "0.5rem" }}
      />
    );
  }

  return (
    <>
      <TaskCreateForm loading={true} />
      <BoardWrapper>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            maxHeight: "50vh",
            overflow: "hidden",
          }}
        >
          {skeleton("50vh")}
          {skeleton("25vh")}
          {skeleton("37vh")}
          {skeleton("42vh")}
          {skeleton("30vh")}
        </Box>
      </BoardWrapper>
    </>
  );
}
