import type { IUser } from "./users.types";
import type { IProject } from "./projects.types";

export type IChatMessage = {
  id: number;
  text: string;
  time: string;
  project: IProject["id"];
  user: IUser["id"];
};
