import type { IUser } from "./users.types";

export type IProject = {
  id: number;
  name: string;
  sharing: boolean;
  invite: null | string;
  tasksOrder: number[];
  board: {
    columns: {
      [col: string]: {
        id: string;
        name: string;
        taskIds: number[];
      };
    };
    order: string[];
    none: number[];
    lastColId: number;
  };
  modified: string;
  created: string;
  owner: IUser["id"];
  members: IUser["id"][];
};
