import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UtilsState, Board } from '../interfaces/store/UtilsSlice';

const initialState: UtilsState = {
  board: {
    boardIDName: "",
    boardID: ""
  },

  isNewBoard: false,

  boardUpdated: false,

  menuErrorMessage: '',

  searchBoardErrorMessage: '',

  saveBtnIsDisabled: true,

  isAddingNewItem: false,
};

const utilsSlice = createSlice({
  name: 'utils',

  initialState,

  reducers: {
    setBoardIDs: (state, action: PayloadAction<Board>) => {
      state.board = action.payload;
    },

    setIsNewBoard: (state, action: PayloadAction<boolean>) => {
      state.isNewBoard = action.payload;
    },

    setBoardUpdated: (state, action: PayloadAction<boolean>) => {
      state.boardUpdated = action.payload;
    },

    setMenuErrorMessage: (state, action: PayloadAction<string>) => {
      state.menuErrorMessage = action.payload;
    },

    setSearchBoardErrorMessage: (state, action: PayloadAction<string>) => {
      state.searchBoardErrorMessage = action.payload;
    },

    setSaveBtnIsDisabled: (state, action: PayloadAction<boolean>) => {
      state.saveBtnIsDisabled= action.payload;
    },
    
    setIsAddingNewItem: (state, action: PayloadAction<boolean>) => {
      state.isAddingNewItem = action.payload;
    },
  },
});

export const { 
  setBoardIDs, 
  setIsNewBoard, 
  setBoardUpdated, 
  setMenuErrorMessage, 
  setSearchBoardErrorMessage, 
  setSaveBtnIsDisabled, 
  setIsAddingNewItem 
} = utilsSlice.actions;

export default utilsSlice.reducer;
