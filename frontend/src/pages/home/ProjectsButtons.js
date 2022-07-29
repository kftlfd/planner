import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";

import { selectProjectById } from "../../store/projectsSlice";
import { useActions } from "../../context/ActionsContext";

import {
  List,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import PeopleIcon from "@mui/icons-material/People";

export function ProjectsButtons(props) {
  const { type, projectIds, drawerToggle } = props;
  const { projectId } = useParams();
  const actions = useActions();

  function onDragEnd(result) {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newOrder = Array.from(projectIds);
    newOrder.splice(source.index, 1);
    newOrder.splice(destination.index, 0, Number(draggableId));

    actions.user.updateProjectsOrder(type, newOrder);
  }

  const bgFix = { background: "inherit" };

  return (
    <List sx={bgFix}>
      <ListSubheader component={"div"} sx={bgFix}>
        {type === "owned" && "Projects"}
        {type === "shared" && "Shared Projects"}
      </ListSubheader>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={type}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {projectIds.map((id, index) => (
                <Draggable key={`${id}`} draggableId={`${id}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ProjectButton
                        projectId={id}
                        selected={Number(projectId) === id}
                        drawerToggle={drawerToggle}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </List>
  );
}

function ProjectButton(props) {
  const { projectId, selected, drawerToggle } = props;
  const project = useSelector(selectProjectById(projectId));
  const navigate = useNavigate();

  function handleClick() {
    if (!selected) navigate(`project/${project.id}`);
    drawerToggle();
  }

  const noTextWrap = {
    span: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  };

  return (
    <ListItemButton selected={selected} onClick={handleClick}>
      <ListItemIcon>
        {project.sharing ? <PeopleIcon /> : <ListIcon />}
      </ListItemIcon>
      <ListItemText primary={project.name} sx={noTextWrap} />
    </ListItemButton>
  );
}
