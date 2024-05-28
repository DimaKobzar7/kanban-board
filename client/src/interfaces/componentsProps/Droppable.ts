import { ReactNode } from 'react';
import { Task } from '../Task';

export interface DroppableProps {
  id: string;
  items: Task[];
  title: string;
  children: ReactNode;
  columnTitleStyles: string;
}