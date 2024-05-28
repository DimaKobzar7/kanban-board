import { useRef, MouseEvent, FC } from 'react';

import { ModalProps } from '../../interfaces/componentsProps/Modal';

import './modal.scss';

const Modal: FC<ModalProps> = ({ closeModal, children }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal();
    }
  };

  return (
    <div className="modal" onClick={handleClickOutside}>
      <div className="modal__content" ref={modalRef}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
