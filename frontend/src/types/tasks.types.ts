import type { IUser } from "app/types/users.types";
import type { IProject } from "app/types/projects.types";

export type ITask = {
  id: number;
  title: string;
  done: boolean;
  notes: string;
  due: null | string;
  modified: string;
  created: string;
  project: IProject["id"];
  userCreated: IUser["id"];
  userModified: IUser["id"];
};
