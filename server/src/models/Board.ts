import { Schema, model, Document } from 'mongoose';
import {taskSchema, Task} from './Task'

export interface Board extends Document {
  toDo: Task[];
  inProgress: Task[];
  done: Task[];
  boardIDName: string;
}

const boardSchema = new Schema<Board>({
  toDo: { type: [taskSchema], required: true },
  inProgress: { type: [taskSchema], required: true },
  done: { type: [taskSchema], required: true },
  boardIDName: { type: String, required: true },
});

export const Board = model<Board>('Board', boardSchema);