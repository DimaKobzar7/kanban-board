import { ChangeEvent, FormEvent } from 'react';
import { TitleError } from '../Errors';

export interface AppFormProps {
  title: string;
  setTitle: (event: ChangeEvent<HTMLInputElement>) => void;
  description?: string;
  setDescription: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  submitForm: (event: FormEvent<HTMLFormElement>) => void;
  rejectForm: () => void;
  titleError: TitleError;
}