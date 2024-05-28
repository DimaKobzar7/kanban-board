import { 
  FC, 
  useRef, 
  useState, 
  FormEvent, 
  ChangeEvent
} from "react";

import { setBoardWithTasks } from '../../store/tasksSlice';

import { 
  setBoardIDs, 
  setIsNewBoard, 
  setBoardUpdated, 
  setSearchBoardErrorMessage, 
  setSaveBtnIsDisabled, 
  setIsAddingNewItem
} from '../../store/utilsSlice';

import { useAppDispatch, useAppSelector } from '../../hooks/hooks';

import useFetchData from '../../hooks/useFetchData';

import './selectBoard.scss'

const SelectBoard: FC = () => {
  const [boardIDName, setboardIDName] = useState<string>('');
  
  const board = useAppSelector((state) => state.utils.board);

  const searchBoardErrorMessage = useAppSelector((state) => state.utils.searchBoardErrorMessage);

  const tasks = useAppSelector((state) => state.itemGroups);

  const saveBtnIsDisabled = useAppSelector((state) => state.utils.saveBtnIsDisabled);

  const isNewBoard = useAppSelector((state) => state.utils.isNewBoard);

  const dispatch = useAppDispatch();

  const prevBoardIDName = useRef<string>('');
  
  const prevErrorMessage = useRef<string>('');

  let url = import.meta.env.VITE_API_URL;

  let options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  };

  const getBoard = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   
    if(!boardIDName) {
      dispatch(setSearchBoardErrorMessage('Enter your query to start searching!'));
      return;
    } 

    if(searchBoardErrorMessage) {
      return;
    } 

    if(boardIDName === board.boardIDName) {
      dispatch(setSearchBoardErrorMessage(`You are already on the board under the name: ${board.boardIDName}`));
      return;
    } 

    if (boardIDName === prevBoardIDName.current) {
      dispatch(setSearchBoardErrorMessage( prevErrorMessage.current));
      return;
    }

    dispatch(setIsAddingNewItem(false));

    if(!saveBtnIsDisabled && isNewBoard) {
      dispatch(setSaveBtnIsDisabled(true));
          
      dispatch(setSearchBoardErrorMessage(''));
   
      options.method = "PUT";

      options.body =  JSON.stringify({tasks, boardIDName: board.boardIDName });

      await useFetchData(url + '/board/save', options);

      dispatch(setBoardUpdated(true));
    } 
    
    dispatch(setSaveBtnIsDisabled(true));
    
    try {
      options.method = "POST";

      options.body =  JSON.stringify({boardIDName});

      const response = await useFetchData( url + '/board/search', options);
 
      if(response.message) {
    
        dispatch(setSearchBoardErrorMessage(response.message));
        
        prevErrorMessage.current = response.message;

        prevBoardIDName.current = boardIDName;

        return;
      } else {
        dispatch(setSearchBoardErrorMessage(''));
      
        prevBoardIDName.current = '';

        prevErrorMessage.current = '';

        dispatch(setIsNewBoard(true));
      }

      dispatch(setBoardIDs(response.boardInfo));

      dispatch(setBoardWithTasks(response.tasks));

      dispatch(setBoardUpdated(false));

      setboardIDName('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("Error message:", err.message);
      } else {
        console.error("Unknown error occurred:", err);
      }
    }
  };

  const getBoardNameID = (e: ChangeEvent<HTMLInputElement>) => {
    setboardIDName(e.target.value);
    
    dispatch(setSearchBoardErrorMessage(''));
  };

  return (
    <form onSubmit={getBoard} className='selectBoard'>
     <div  className='selectBoard__wrap'>
        <input 
          onChange={getBoardNameID} 
          value={boardIDName} 
          type="text" 
          placeholder='Enter a board ID here...' 
          className='selectBoard__input'
        />
      </div>
      
      <button 
        type='submit' 
        className='selectBoard__btn'
      >
        Load
      </button>

      {searchBoardErrorMessage &&  <p className='selectBoard__error'>{searchBoardErrorMessage}</p>}
    </form>
  );
};

export default SelectBoard;
