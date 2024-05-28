import { FC } from "react";

import { useSortable } from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import Item from "../item/Item";

import { SortableItemProps } from '../../interfaces/componentsProps/SortableItem';

const SortableItem: FC<SortableItemProps> = ({ id, task }) => {
  const {
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li 
      style={style} 
      ref={setNodeRef}
    >
      
      <Item 
        task={task} 
        id={id}  
      />
    </li>
  );
};

export default SortableItem;
