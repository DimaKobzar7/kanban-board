import { ReactNode } from 'react';

export interface ModalProps {
  closeModal: () => void;
  children: ReactNode;
}