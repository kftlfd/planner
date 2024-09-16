import { FC, useState } from "react";
import { useSelector } from "react-redux";

import { Switch } from "@mui/material";

import { useActions } from "~/context/ActionsContext";
import { selectHideDoneTasks } from "~/store/settingsSlice";

import { MenuListItem } from "./ProjectOprionsMenu";

export const ProjectHideDoneToggle: FC = () => {
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
};
