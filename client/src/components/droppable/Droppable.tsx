
import  { FC, memo} from 'react';

import { useDroppable } from "@dnd-kit/core";

import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";

import SortableItem from '../sortableItem/SortableItem';

import { DroppableProps } from '../../interfaces/componentsProps/Droppable';

import './droppable.scss';

// возможно мемо ьуь не нужен
const Droppable: FC<DroppableProps> = memo(({ 
  id, 
  items, 
  title, 
  children, 
  columnTitleStyles 
}) => {
  const { setNodeRef } = useDroppable({ id });

const sortedItemIds = items.filter(item => item !== null && item !== undefined).map(item => item.id);

  return (
    <SortableContext id={id} items={sortedItemIds} strategy={rectSortingStrategy}>
      <div className={`droppable droppable--${columnTitleStyles}`} ref={setNodeRef}>
        <h2 className="droppable__title">{title}</h2>

        <ul className="droppable__list">
           {items && items.map((item) => (
            item && item.id ? <SortableItem key={item.id} id={item.id} task={item} /> : null
          ))}
          
          {children}
        </ul>
      </div>
    </SortableContext>
  );
});

export default Droppable;
