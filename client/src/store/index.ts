import { configureStore } from '@reduxjs/toolkit';
import itemGroupsReducer from './tasksSlice';
import utilsSlice from './utilsSlice';

const store = configureStore({
  reducer: {
    itemGroups: itemGroupsReducer,
    utils: utilsSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
