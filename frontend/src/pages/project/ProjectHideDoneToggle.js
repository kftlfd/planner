import React, { useState } from "react";
import { useSelector } from "react-redux";

import { selectHideDoneTasks } from "../../store/settingsSlice";
import { useActions } from "../../context/ActionsContext";
import { MenuListItem } from "./ProjectOprionsMenu";

import { Switch } from "@mui/material";

export function ProjectHideDoneToggle(props) {
  const hideDone = useSelector(selectHideDoneTasks);
  const actions = useActions();

  const [checked, setChecked] = useState(hideDone);
  const toggleChecked = () => {
    setChecked((x) => !x);
    actions.settings.toggleHideDoneTasks();
  };

  return (
    <MenuListItem onClick={toggleChecked}>
      Hide done tasks
      <Switch checked={checked} />
    </MenuListItem>
  );
}
