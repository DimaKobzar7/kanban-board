import { Schema, Document } from 'mongoose';

export interface Task extends Document {
  id: string;
  title: string;
  description: string;
}

export const taskSchema = new Schema<Task>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: false }
}, { _id: false });