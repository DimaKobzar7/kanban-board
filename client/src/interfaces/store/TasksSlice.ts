import { ItemGroups } from '../../enums/store/Tasks';
import { Task } from '../Task';

export interface ItemGroupsState {
  [ItemGroups.toDo]: Task[];
  [ItemGroups.inProgress]: Task[];
  [ItemGroups.done]: Task[];
}