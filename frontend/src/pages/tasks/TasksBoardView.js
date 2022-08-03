import React from "react";
import { useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { selectProjectBoard } from "../../store/projectsSlice";
import { selectTaskById } from "../../store/tasksSlice";
import { selectHideDoneTasks } from "../../store/settingsSlice";
import { useActions } from "../../context/ActionsContext";
import { TaskCreateForm } from "./TaskCreateForm";
import { NoTasks } from "./Tasks";
import { InputModal, SimpleModal } from "../../layout/Modal";
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
  const columnWidth = 250;

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
        <BoardEdit
          projectId={projectId}
          board={board}
          boardEdit={boardEdit}
          toggleBoardEdit={toggleBoardEdit}
        />
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
                        <Task
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
                                      <Task
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

  async function resetBoard() {
    const updBoard = { ...board, order: [], columns: {} };

    await actions.project.updateTasksOrder({
      id: projectId,
      board: updBoard,
    });
  }

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

    try {
      await actions.project.updateTasksOrder({
        id: projectId,
        board: newBoard,
      });
      setNewColName("");
      toggleModal();
    } catch (error) {
      console.error("Failed to update board: ", error);
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
        inputValue={newColName}
        inputChange={changeColName}
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

    try {
      await actions.project.updateTasksOrder({
        id: projectId,
        board: newBoard,
      });
      toggleEditDialog();
    } catch (error) {
      console.error("Failed to rename column: ", error);
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

    try {
      await actions.project.updateTasksOrder({
        id: projectId,
        board: newBoard,
      });
      setEditDialogOpen(false);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete column: ", error);
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
                    />
                    <Box sx={{ flexGrow: 1 }} />
                  </>
                }
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

function Task(props) {
  const task = useSelector(selectTaskById(props.taskId));
  const hide = useSelector(selectHideDoneTasks);

  return (
    <Collapse in={!(hide && task.done)}>
      <Card
        raised={props.isDragging}
        {...props.dragProps}
        {...props.dragHandle}
        sx={{ marginTop: "0.5rem" }}
      >
        <Box
          sx={{
            padding: "1rem",
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
          <Box onClick={props.onClick}>
            <Typography variant="body1">{task.title}</Typography>
            <Typography variant="caption" component="div">
              {task.notes}
            </Typography>
            <Typography variant="caption" component="div" align="right">
              {task.due}
            </Typography>
          </Box>
        </Box>
      </Card>
    </Collapse>
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
