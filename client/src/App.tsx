import  { 
  useRef, 
  useState,
  ChangeEvent, 
  FormEvent, 
  FC
} from "react";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
   DragStartEvent,
   DragOverEvent,
   DragEndEvent
} from "@dnd-kit/core";

import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import Droppable from "./components/droppable/Droppable";

import Item from "./components/item/Item";

import AppForm from './components/appForm/AppForm';

import SelectBoard from './components/selectBoard/SelectBoard';

import Menu from './components/menu/Menu';

import { addItem, moveItem, moveWithinContainer } from './store/tasksSlice';

import { useAppDispatch, useAppSelector } from './hooks/hooks';

import { setIsAddingNewItem, setSaveBtnIsDisabled } from './store/utilsSlice';

import { ItemGroupsState } from './interfaces/store/TasksSlice';

import "./App.scss";

const App: FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const [newItemTitle, setNewItemTitle] = useState("");

  const [newItemDescription, setNewItemDescription] = useState("");

  const [titleError, setTitleError] = useState({
    error: false,
    placeholder: 'Title'
  });

  const itemGroups = useAppSelector((state) => state.itemGroups);

  const isAddingNewItem =  useAppSelector(state => state.utils.isAddingNewItem)

  const isNewBoard = useAppSelector(state => state.utils.isNewBoard);

  const board = useAppSelector(state => state.utils.board);

  const dispatch = useAppDispatch();

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const initialDragState = useRef<{ containerId: string, index: number } | null>(null);

  const handleDragStart = ({ active }: DragStartEvent) =>  {
    if(active.id) {
      setActiveId(String(active.id)); 
    }

    initialDragState.current = {
      containerId: active.data.current?.sortable.containerId,
      index: active.data.current?.sortable.index,
    };
  };


  const handleDragCancel = () => {
    setActiveId(null)
   
    initialDragState.current = null;
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    requestAnimationFrame(() => {
      const overId = over?.id;

      if (!overId) return;

      const activeContainer: keyof ItemGroupsState = active.data.current?.sortable.containerId as keyof ItemGroupsState;
      const overContainer: keyof ItemGroupsState = (over.data.current?.sortable.containerId || over.id) as keyof ItemGroupsState;
  
      if (activeContainer && activeContainer !== overContainer) {
        dispatch(moveItem({
          activeContainer,
          activeIndex: active.data.current?.sortable.index,
          overContainer,
          overIndex: over.id in itemGroups ? itemGroups[overContainer].length + 1 : over.data.current?.sortable.index,
        }));
      }
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {

    if (!over) {
      setActiveId(null);

      initialDragState.current = null;

      return;
    }

    const activeContainer: keyof ItemGroupsState = active.data.current?.sortable.containerId as keyof ItemGroupsState;

    const overContainer: keyof ItemGroupsState = (over.data.current?.sortable.containerId || over.id) as keyof ItemGroupsState;

    const activeIndex = active.data.current?.sortable.index;

    const overIndex = over.id in itemGroups ? itemGroups[overContainer].length + 1 : over.data.current?.sortable.index;

    
    if (activeContainer === overContainer) {
      dispatch(moveWithinContainer({
        container: activeContainer,
        activeIndex,
        overIndex,
      }));
    } else {
      dispatch(moveItem({
        activeContainer,
        activeIndex,
        overContainer,
        overIndex,
      }));
    }

    setActiveId(null);
   
    const hasContainerChanged = initialDragState.current?.containerId !== overContainer;
    const hasIndexChanged = initialDragState.current?.index !== overIndex;
 
    if (hasContainerChanged || hasIndexChanged) {
      dispatch(setSaveBtnIsDisabled(false));
    }

    initialDragState.current = null;
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewItemTitle(event.target.value);

    setTitleError({
      ...titleError,
      error: false
    });
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNewItemDescription(event.target.value);
  };

  const handleAddNewItem = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setNewItemTitle(prevTitle => prevTitle.trim());

    setNewItemDescription(prevDescription => prevDescription.trim());

    if (newItemTitle.trim() === "" ) {
      setTitleError({
        ...titleError,
        error: true,
      });

      return;
    }
 
    dispatch(setSaveBtnIsDisabled(false))

    dispatch(addItem({ title: newItemTitle.trim(), description: newItemDescription.trim() }));

    setNewItemTitle("");

    setNewItemDescription("");

    dispatch(setIsAddingNewItem(false));
  };

  const getItemById = (id: string) => {
    const { toDo, inProgress, done } = itemGroups;

    const allItems = [...toDo, ...inProgress, ...done];

    const foundItem = allItems.find((item) => item && item.id === id);

    return foundItem;
  };

  const handleCancel = () => {
    dispatch(setIsAddingNewItem(false));
    
    setNewItemTitle("");

    setNewItemDescription("");
    
    setTitleError({
      ...titleError,
      error: false
    });

  };

  const openNewTaskCreateForm = () => {
    dispatch(setIsAddingNewItem(true))

    setNewItemTitle("");

    setNewItemDescription("");
  }

  let activeTask;

  if(activeId) {
    activeTask = getItemById(activeId);
  }

  const columnTitles = ['To Do', 'In Progress', 'Done']

  const columnTitleStyles = Object.keys(itemGroups);

  return (
    <div className="app">
      <div className='container'>
        <Menu />

        <SelectBoard /> 

        {isNewBoard && <h1 className='app__title'>Board name: {board.boardIDName}</h1>} 

        {isNewBoard && <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="app__wrap">
          {(Object.keys(itemGroups) as (keyof ItemGroupsState)[]).map((group, i) => (
            <Droppable
              id={group}
              items={itemGroups[group]}
              key={group}
              title={columnTitles[i]}
              columnTitleStyles={columnTitleStyles[i]}
            >
              {group === "toDo" && (
                <>
                  {!isAddingNewItem && (
                    <div className='app__inner' onClick={openNewTaskCreateForm}>
                          <div className='app__icon' >
                        <svg viewBox="0 0 45.402 45.402">
                        <g>
                          <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141
                            c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27
                            c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435
                            c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"/>
                        </g>
                      </svg>
                      </div>
                    </div>
                  )}
                  {isAddingNewItem && (
                    <div className='app__inner' >
                      <AppForm 
                        title={newItemTitle} 
                        setTitle={handleTitleChange} 
                        description={newItemDescription}
                        setDescription={handleDescriptionChange} 
                        submitForm={handleAddNewItem} 
                        rejectForm={handleCancel} 
                        titleError={titleError}
                      /> 
                    </div>
                  )}
                </>
              )}
            </Droppable>
          ))}
          </div>
   
          <DragOverlay>
            {activeTask && activeId ? (
              <Item task={activeTask} id={activeId} dragOverlay />
            ) : null}
          </DragOverlay>

        </DndContext>}
      </div>
    </div>
  );
}

export default App;
