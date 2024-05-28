import { Task } from '../Task';

export interface ItemProps {
  task: Task;
  dragOverlay?: boolean;
  id: string;
}