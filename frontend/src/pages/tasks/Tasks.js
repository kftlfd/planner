import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { useActions } from "../../context/ActionsContext";
import { selectProjectTasksIds } from "../../store/tasksSlice";
import { TasksListView } from "./TasksListView";
import { Sidebar } from "../../layout/Sidebar";
import { TaskDetails } from "./TaskDetails";

export default function Tasks(props) {
  const { projectId } = useParams();
  const taskIds = useSelector(selectProjectTasksIds(projectId));
  const actions = useActions();

  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);
  const taskDetailsToggle = () => {
    setTaskDetailsOpen((x) => !x);
  };

  useEffect(() => {
    setSelectedTask(null);
    if (!taskIds) {
      actions.task
        .loadTasks(projectId)
        .catch((err) => console.error("Failed loading tasks: ", err));
    }
  }, [projectId]);

  return (
    <>
      <TasksListView
        projectId={projectId}
        taskIds={taskIds}
        setSelectedTask={setSelectedTask}
        taskDetailsToggle={taskDetailsToggle}
      />

      <Sidebar open={taskDetailsOpen} toggle={taskDetailsToggle}>
        <TaskDetails
          taskId={selectedTask}
          sidebarToggle={taskDetailsToggle}
          setTaskSelected={setSelectedTask}
        />
      </Sidebar>
    </>
  );
}
