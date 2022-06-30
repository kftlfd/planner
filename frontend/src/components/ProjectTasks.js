import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProjects } from "../ProjectsContext";
import Task from "./Task";

export default function ProjectTasks(props) {
  const { getProjectTasks, handleTasks } = useProjects();
  const params = useParams();
  const [tasks, setTasks] = useState([]);
  const [projectId, setProjectId] = useState(Number(params.projectId));

  const [addTaskTitle, setAddTaskTitle] = useState("");
  const handleAddTaskTitleChange = (e) => setAddTaskTitle(e.target.value);

  async function loadTasks(projectId) {
    setTasks([]);
    setTasks(await getProjectTasks(projectId));
  }

  useEffect(() => {
    loadTasks(projectId);
  }, []);

  useEffect(() => {
    loadTasks(projectId);
  }, [projectId]);

  useEffect(() => {
    setProjectId(Number(params.projectId));
  }, [params.projectId]);

  const taskAddForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleTasks.create(projectId, addTaskTitle);
      }}
    >
      <input
        type={"text"}
        placeholder={"New task"}
        value={addTaskTitle}
        onChange={handleAddTaskTitleChange}
      />
      <button type={"submit"} disabled={!addTaskTitle}>
        + Add task
      </button>
    </form>
  );

  const tasksList = tasks.map((item, index) => {
    if (item.id) {
      return <Task key={`pj-${projectId}-task-${item.id}`} task={item} />;
    }
    if (item.error) {
      return <div key={`pj-${projectId}-err-${index}`}>{item.error}</div>;
    }
  });

  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: "lightblue",
        wordWrap: "anywhere",
      }}
    >
      <h4>{"<ProjectTasks.js>"}</h4>
      {taskAddForm}
      {tasksList}
    </div>
  );
}
