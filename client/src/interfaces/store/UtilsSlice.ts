export interface Board {
  boardIDName: string;
  boardID: string;
}

export interface UtilsState {
  board: Board;
  isNewBoard: boolean;
  boardUpdated: boolean;
  menuErrorMessage: string;
  searchBoardErrorMessage: string;
  saveBtnIsDisabled: boolean;
  isAddingNewItem: boolean;
}