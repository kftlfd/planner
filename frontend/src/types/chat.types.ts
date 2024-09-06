import type { IProject } from "./projects.types";
import type { IUser } from "./users.types";

export type IChatMessage = {
  id: number;
  text: string;
  time: string;
  project: IProject["id"];
  user: IUser["id"];
};
