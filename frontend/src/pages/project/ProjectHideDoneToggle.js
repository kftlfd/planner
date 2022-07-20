import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { MenuListItem } from "./ProjectOprionsMenu";

import {
  selectHideDoneTasks,
  toggleHideDoneTasks,
} from "../../store/settingsSlice";

import { Box, MenuItem, Switch } from "@mui/material";

export function ProjectHideDoneToggle(props) {
  const hideDone = useSelector(selectHideDoneTasks);
  const dispatch = useDispatch();

  const [checked, setChecked] = useState(hideDone);
  const toggleChecked = () => {
    setChecked((x) => !x);
    dispatch(toggleHideDoneTasks());
  };

  return (
    <MenuListItem onClick={toggleChecked}>
      Hide done tasks
      <Switch checked={checked} />
    </MenuListItem>
  );
}
