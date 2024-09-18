import { FC } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";

import ListIcon from "@mui/icons-material/List";
import PeopleIcon from "@mui/icons-material/People";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";

import { useActions } from "~/context/ActionsContext";
import { selectProjectById } from "~/store/projectsSlice";

const ProjectsButtons: FC<{
  type: string;
  header: string;
  projectIds: number[];
  drawerToggle: () => void;
}> = ({ type, projectIds, drawerToggle }) => {
  const { projectId } = useParams();
  const actions = useActions();

  const onDragEnd: OnDragEndResponder = (result) => {
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
  };

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
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              {projectIds.map((id, index) => (
                <Draggable key={`${id}`} draggableId={`${id}`} index={index}>
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        backgroundColor: snapshot.isDragging
                          ? "background.default"
                          : "initial",
                      }}
                    >
                      <ProjectButton
                        projectId={id}
                        selected={Number(projectId) === id}
                        drawerToggle={drawerToggle}
                      />
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </List>
  );
};

export default ProjectsButtons;

const ProjectButton: FC<{
  projectId: number;
  selected: boolean;
  drawerToggle: () => void;
}> = ({ projectId, selected, drawerToggle }) => {
  const project = useSelector(selectProjectById(projectId));
  const navigate = useNavigate();

  if (!project) {
    return null;
  }

  const handleClick = () => {
    if (!selected) navigate(`project/${project.id}`);
    drawerToggle();
  };

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
};
