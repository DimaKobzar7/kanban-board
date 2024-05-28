import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { arrayMove, insertAtIndex, removeAtIndex } from '../utils/dragAndDropActions';
import { ItemGroupsState } from '../interfaces/store/TasksSlice';
import { Task } from '../interfaces/Task';


const initialState: ItemGroupsState = {
  toDo: [],
  inProgress: [],
  done: [],
};

const itemGroupsSlice = createSlice({
  name: 'itemGroups',

  initialState,

  reducers: {
    addItem: (state,action: PayloadAction<Omit<Task, 'id'>>) => {
      const newItem = {
        id: nanoid(),
        title: action.payload.title,
        description: action.payload.description || '',
      };

      state.toDo.push(newItem);
    },

    removeItem: (state, action: PayloadAction<string>) => {
      for (const group in state) {
        state[group as keyof ItemGroupsState] = state[group as keyof ItemGroupsState].filter((item) => item.id !== action.payload);
      }
    },

    saveItem: (state, action: PayloadAction<Task>) => {
      for (const group in state) {
        state[group as keyof ItemGroupsState] = state[group as keyof ItemGroupsState].map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      }
    },
  
    moveItem: (state, action: PayloadAction<{ activeContainer: keyof ItemGroupsState; activeIndex: number; overContainer: keyof ItemGroupsState; overIndex: number; }>) => {
      const { activeContainer, activeIndex, overContainer, overIndex } = action.payload;
      const itemToMove = state[activeContainer][activeIndex];

      state[activeContainer] = removeAtIndex(state[activeContainer], activeIndex);

      state[overContainer] = insertAtIndex(state[overContainer], overIndex, itemToMove);
    },

    moveWithinContainer: (state, action: PayloadAction<{ container: keyof ItemGroupsState; activeIndex: number; overIndex: number; }>) => {
      const { container, activeIndex, overIndex } = action.payload;
      state[container] = arrayMove(state[container], activeIndex, overIndex);
    },

   setBoardWithTasks: (_state, action: PayloadAction<ItemGroupsState>) => {
      return action.payload
    },
  },
});

export const { 
  addItem, 
  removeItem, 
  saveItem, 
  moveItem, 
  moveWithinContainer, 
  setBoardWithTasks 
} = itemGroupsSlice.actions;

export default itemGroupsSlice.reducer;
