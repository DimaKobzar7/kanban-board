import { ItemGroupsState } from './store/TasksSlice';

export interface ResponseData {
  message?: string;
  boardInfo: {
    boardIDName: string;
    boardID: string;
  };
  tasks: ItemGroupsState;
}