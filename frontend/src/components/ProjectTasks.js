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

  const [showDoneTasks, setShowDoneTasks] = useState(true);
  const handleShowDoneChange = () => setShowDoneTasks(!showDoneTasks);

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
      onSubmit={(event) => {
        event.preventDefault();
        handleTasks.create(projectId, taskAddTitle);
      }}
    >
      <input
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

  const ShowDoneToggle = () => (
    <div>
      <input
        id={"show-done-toggle"}
        type={"checkbox"}
        checked={showDoneTasks}
        onChange={handleShowDoneChange}
      />
      <label htmlFor={"show-done-toggle"}>Show done</label>
    </div>
  );

  const TasksList = () => (
    <div>
      {projects[projectId].tasks
        ? Object.keys(projects[projectId].tasks).map((id) => {
            if (projects[projectId].tasks?.[id]) {
              return (
                <Task
                  key={`pj-${projectId}-task-${id}`}
                  projectId={projectId}
                  task={projects[projectId].tasks[id]}
                  showDoneTasks={showDoneTasks}
                />
              );
            }
          })
        : null}
    </div>
  );

  const Task = (props) => (
    <Card sx={{ marginBottom: "0.5rem" }}>
      <CardActionArea>
        <CardContent sx={{ display: "flex", alignItems: "start", gap: "1rem" }}>
          <Checkbox sx={{ padding: "0" }} />
          <div style={{ flexGrow: "1" }} onClick={() => {}}>
            <Typography variant="body1">{props.task.title}</Typography>
            <Typography variant="body2">{props.task.notes}</Typography>
            <Typography variant="body2">{props.task.due}</Typography>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  const TaskDetailsModal = () => {};

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.7rem",
        }}
      >
        <TaskCreateForm />
        <ShowDoneToggle />
      </div>
      <TasksList />
    </>
  );
}
