import React, { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { useProjects } from "../ProjectsContext";

import Typography from "@mui/material/Typography";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Checkbox,
  Paper,
  InputBase,
  Skeleton,
  Container,
} from "@mui/material";

export default function ProjectTasks(props) {
  const params = useParams();
  const context = useOutletContext();
  const [projectId, setProjectId] = useState(Number(params.projectId));
  const { projects, checkProjectTasks, handleTasks } = useProjects();

  useEffect(() => {
    checkProjectTasks(projectId);
  }, [[], projectId]);

  useEffect(() => {
    setProjectId(Number(params.projectId));
  }, [params.projectId]);

  const TaskCreateForm = () => {
    const [taskCreateTitle, setTaskCreateTitle] = useState("");
    const handleTaskCreateTitleChange = (e) =>
      setTaskCreateTitle(e.target.value);

    const handleCreateTask = (event) => {
      event.preventDefault();
      handleTasks.create(projectId, taskCreateTitle);
      setTaskCreateTitle("");
    };

    return (
      <Paper
        component="form"
        onSubmit={handleCreateTask}
        sx={{ display: "flex", marginBottom: "1.5rem", padding: "0.3rem 1rem" }}
      >
        <InputBase
          type={"text"}
          value={taskCreateTitle}
          onChange={handleTaskCreateTitleChange}
          placeholder={"New task"}
          size={"small"}
          sx={{ flexGrow: "1" }}
          componentsProps={{
            input: { sx: { padding: "0" } },
          }}
        />
        <Button type={"submit"} disabled={!taskCreateTitle} size={"small"}>
          + Add task
        </Button>
      </Paper>
    );
  };

  const TasksList = () => (
    <div>
      {projects[projectId].tasks
        ? Object.keys(projects[projectId].tasks).map((id) => {
            if (projects[projectId].tasks?.[id]) {
              return (
                <Task
                  key={`pj-${projectId}-task-${id}`}
                  task={projects[projectId].tasks[id]}
                />
              );
            }
          })
        : null}
    </div>
  );

  const Task = (props) => {
    const hide = context.hideDoneTasks && props.task.done;

    return (
      <Card
        sx={{
          marginBottom: hide ? "0px" : "0.5rem",
          height: hide ? "0px" : "auto",
        }}
      >
        <CardActionArea>
          <CardContent
            sx={{ display: "flex", alignItems: "start", gap: "1rem" }}
          >
            <Checkbox sx={{ padding: "0" }} checked={props.task.done} />
            <div style={{ flexGrow: "1" }} onClick={() => {}}>
              <Typography variant="body1">{props.task.title}</Typography>
              <Typography variant="body2">{props.task.notes}</Typography>
              <Typography variant="body2">{props.task.due}</Typography>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  };

  const TaskDetailsModal = () => {
    return <></>;
  };

  return (
    <Container maxWidth="md" sx={{ paddingTop: "1rem", paddingBottom: "3rem" }}>
      {projects[projectId] ? (
        projects[projectId].tasks ? (
          <>
            <TaskCreateForm />
            <TasksList />
            <TaskDetailsModal />
          </>
        ) : (
          <>
            {[...Array(4).keys()].map((x) => (
              <Skeleton key={x} height={50} animation="wave" />
            ))}
          </>
        )
      ) : (
        <></>
      )}
    </Container>
  );
}
