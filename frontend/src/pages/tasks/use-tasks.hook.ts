import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  selectProjectaTasksLoaded,
  selectProjectTasksIds,
} from "app/store/projectsSlice";

export const useTasks = () => {
  const params = useParams<{ projectId: string }>();
  const projectId = Number(params.projectId);

  const projectsTasksLoaded = useSelector(selectProjectaTasksLoaded);
  const tasksLoaded = projectsTasksLoaded.includes(projectId);
  const taskIds = useSelector(selectProjectTasksIds(projectId));

  return {
    projectId,
    tasksLoaded,
    taskIds,
  };
};
