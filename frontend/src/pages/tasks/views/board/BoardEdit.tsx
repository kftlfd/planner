import { FC, useState } from "react";

import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Collapse, Paper } from "@mui/material";

import { useActions } from "~/context/ActionsContext";
import { ErrorAlert } from "~/layout/Alert";
import { InputModal } from "~/layout/Modal";
import type { IProject } from "~/types/projects.types";

export const BoardEdit: FC<{
  projectId: number;
  board: IProject["board"];
  boardEdit: boolean;
  toggleBoardEdit: () => void;
}> = ({ projectId, board, boardEdit, toggleBoardEdit }) => {
  const actions = useActions();

  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => {
    setModalOpen((x) => !x);
  };

  const [newColName, setNewColName] = useState("");
  const changeColName = (v: string) => {
    setNewColName(v);
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createNewColumn() {
    const newCol = {
      id: `col-${board.lastColId + 1}`,
      name: newColName,
      taskIds: [],
    };

    const newOrder = Array.from(board.order);
    newOrder.push(newCol.id);

    const newBoard: IProject["board"] = {
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
      } as IProject);
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
        variant={boardEdit ? "contained" : "text"}
        onClick={toggleBoardEdit}
      >
        <EditIcon />
      </Button>

      <InputModal
        open={modalOpen}
        onConfirm={() => void createNewColumn()}
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
        toggle={() => {
          setError(null);
        }}
        message={error}
      />
    </Paper>
  );
};
