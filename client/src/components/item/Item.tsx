import  { 
  ChangeEvent, 
  FC, 
  FormEvent, 
  useState 
} from "react";

import { removeItem, saveItem } from '../../store/tasksSlice';

import { setSaveBtnIsDisabled } from '../../store/utilsSlice';

import { useSortable } from '@dnd-kit/sortable';

import { useAppDispatch } from '../../hooks/hooks';

import AppForm from '../appForm/AppForm';

import { ItemProps } from '../../interfaces/componentsProps/Item';

import './item.scss';


const Item: FC<ItemProps> = ({ task, dragOverlay, id, }) => {
  const {
    attributes,
    listeners,
  } = useSortable({ id });

  const [isEditing, setIsEditing] = useState(false);

  const [editedTitle, setEditedTitle] = useState(task.title);
 
  const [editedDescription, setEditedDescription] = useState(task.description || '');

  const [titleError, setTitleError] = useState({
    error: false,
    placeholder: 'Title'
  });

  const dispatch = useAppDispatch();

  const style = {
    cursor: dragOverlay ? "grabbing" : "grab",
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const setTilte = (e: ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);

    setTitleError({
      ...titleError,
      error: false,
    });
  }

  const setDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setEditedDescription(e.target.value);
  }

  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    setEditedTitle(prevTitle => prevTitle.trim());
    setEditedDescription(prevDescription => prevDescription.trim());

    if (!editedTitle.trim()) {
      setTitleError({
        ...titleError,
        error: true,
      });

      return;
    } 

    if(!(task.description === editedDescription && task.title === editedTitle)) {
      dispatch(setSaveBtnIsDisabled(false));
    } 

    const updatedTask = {
      ...task,
      title: editedTitle.trim(),
      description: editedDescription.trim(),
    };

    dispatch(saveItem(updatedTask));
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);

    setEditedDescription(task.description || '');

    setIsEditing(false);

    setTitleError({
      ...titleError,
      error: false
    });
  };

  const handleRemove = () => {
    dispatch(removeItem(task.id));

    dispatch(setSaveBtnIsDisabled(false));
  };


  return (
    <div className="task" >
      {isEditing ? (
        <AppForm 
          title={editedTitle} 
          setTitle={setTilte} 
          description={editedDescription}
          setDescription={setDescription} 
          submitForm={handleSave} 
          rejectForm={handleCancel}
          titleError={titleError}
        />
      ) : (
        <>
          <div 
            className='task__content' 
            style={style} 
            {...attributes} 
            {...listeners}
          >
            <h3 className='task__title'>{task.title}</h3>

            <p className='task__description'>{task.description}</p>
          </div>
          
          <div className='task__btns'>
            <div className='task__icon' onClick={handleEdit}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                height="24px" 
                viewBox="0 -960 960 960" 
                width="24px" 
                fill="#e8eaed">
                  <path 
                    d="M190.58-94.15q-39.43 0-67.93-28.5-28.5-28.5-28.5-67.93v-578.84q0-39.59 28.5-68.2t67.93-28.61H585l-96.43 96.81H190.58v578.84h578.84V-490l96.81-96.81v396.23q0 39.43-28.61 67.93-28.61 28.5-68.2 28.5H190.58ZM480-480ZM348.65-348.65v-186.29l368.5-368.49q14.07-14.46 31.62-21.1 17.54-6.63 35.37-6.63 19.06 0 36.82 7.33 17.75 7.32 32.56 21.4l48.58 49.11q14.15 14.52 21.39 32.17 7.23 17.64 7.23 35.9 0 18.38-7.26 36.78-7.27 18.4-21.69 32.56L534.94-348.65H348.65ZM847-785.23l-62.67-62.87L847-785.23ZM436.04-436.04h62.77l237.63-237.19-31.6-31.63-31.61-30.91-237.19 235.96v63.77Zm268.8-268.82-31.61-30.91 31.61 30.91 31.6 31.63-31.6-31.63Z"
                  />
              </svg>
            </div>
           
            <div className='task__icon' onClick={handleRemove}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                height="24px" 
                viewBox="0 -960 960 960" 
                width="24px" 
                fill="#e8eaed"
              >
                <path 
                  d="M276-88q-45 0-75.5-30.5T170-194v-530h-40v-106h228v-48h246v48h228v106h-40v530q0 43.73-31.14 74.86Q729.72-88 686-88H276Zm410-636H276v530h410v-530ZM339-275h106v-368H339v368Zm178 0h106v-368H517v368ZM276-724v530-530Z"
                />
              </svg>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Item;
