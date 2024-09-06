import type { IProject } from "./projects.types";
import type { IUser } from "./users.types";

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
