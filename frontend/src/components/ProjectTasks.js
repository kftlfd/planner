import React, { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { useProjects } from "../ProjectsContext";

import Typography from "@mui/material/Typography";
import { Card, CardActionArea, CardContent, Checkbox } from "@mui/material";

export default function ProjectTasks(props) {
  const params = useParams();
  const context = useOutletContext();
  const [projectId, setProjectId] = useState(Number(params.projectId));
  const { projects, checkProjectTasks, handleTasks } = useProjects();

  const [taskAddTitle, setTaskAddTitle] = useState("");
  const handleTaskAddTitleChange = (e) => setTaskAddTitle(e.target.value);

  useEffect(() => {
    checkProjectTasks(projectId);
  }, [[], projectId]);

  useEffect(() => {
    setProjectId(Number(params.projectId));
  }, [params.projectId]);

  if (!projects[projectId]) {
    return <></>;
  }

  if (!projects[projectId].tasks) {
    return <div>Loading tasks</div>;
  }

  const TaskCreateForm = () => (
    <form
      style={{ display: "flex", marginBottom: "0.7rem" }}
      onSubmit={(event) => {
        event.preventDefault();
        handleTasks.create(projectId, taskAddTitle);
      }}
    >
      <input
        style={{ flexGrow: "1" }}
        type={"text"}
        placeholder={"New task"}
        value={taskAddTitle}
        onChange={handleTaskAddTitleChange}
      />
      <button type={"submit"} disabled={!taskAddTitle}>
        + Add task
      </button>
    </form>
  );

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
    <>
      <TaskCreateForm />
      <TasksList />
      <TaskDetailsModal />
    </>
  );
}
