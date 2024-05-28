import { 
  ChangeEvent, 
  FC, 
  FormEvent, 
  useRef, 
  useState 
} from "react";

import { createPortal } from 'react-dom';

import { setBoardWithTasks } from '../../store/tasksSlice';

import { 
  setBoardIDs, 
  setIsNewBoard, 
  setBoardUpdated, 
  setMenuErrorMessage, 
  setSearchBoardErrorMessage, 
  setSaveBtnIsDisabled, 
  setIsAddingNewItem
} from '../../store/utilsSlice';

import { useAppDispatch, useAppSelector } from '../../hooks/hooks';

import useFetchData from '../../hooks/useFetchData';

import Modal from '../Modal/Modal';

import { Actions } from '../../enums/Actions';

import './menu.scss'

const Menu: FC = () => {
  const tasks = useAppSelector((state) => state.itemGroups);

  const board = useAppSelector((state) => state.utils.board);

  const isNewBoard = useAppSelector((state) => state.utils.isNewBoard);

  const menuErrorMessage = useAppSelector((state) => state.utils.menuErrorMessage);

  const saveBtnIsDisabled = useAppSelector((state) => state.utils.saveBtnIsDisabled);

  const prevBoardIDName = useRef('');

  const prevErrorMessage = useRef('');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [boardName, setBoardName] = useState('');

  const dispatch = useAppDispatch();

  const openModal = () => {
    document.querySelector('body')?.classList.add('overflow-hiden');

    setIsModalOpen(true);
  };

  let url = import.meta.env.VITE_API_URL;
  
  let options: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const getUserRequest = async (req: string) => {

    switch (req) {
      case Actions.create:
        dispatch(setSearchBoardErrorMessage(''));

        dispatch(setBoardUpdated(false));

        setBoardName('');
        
        dispatch(setMenuErrorMessage(''));

        dispatch(setBoardUpdated(true));

        openModal()
   
        break;
        
      case Actions.save:
     
        dispatch(setSaveBtnIsDisabled(true));
        
        dispatch(setSearchBoardErrorMessage(''));

        dispatch(setMenuErrorMessage(''));
 
        options.method = 'PUT';

        options.body = JSON.stringify({tasks, boardIDName: board.boardIDName });

        await useFetchData(url + '/board/save', options);
      
        dispatch(setBoardUpdated(true));

        break;

      case Actions.delete:
        const initialState = {
          toDo: [],
          inProgress: [],
          done: [],
        };

        dispatch(setIsAddingNewItem(false));

        dispatch(setSearchBoardErrorMessage(''));

        dispatch(setMenuErrorMessage(''));

        dispatch(setIsNewBoard(false));
    
        dispatch(setBoardIDs({boardIDName: '', boardID: ''}));
        
        dispatch(setBoardWithTasks(initialState));
       
        options.method = 'DELETE';
      
        options.body = JSON.stringify({boardIDName: board.boardIDName});
        
       await useFetchData(url + '/board/delete', options);

        break;
      default:
      console.log("Unknown request type");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);

    document.querySelector('body')?.classList.remove('overflow-hiden');
  };

  const handleConfirm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setBoardName(prevName => prevName.trim())

    if (boardName.startsWith(' ') || boardName.endsWith(' ')) {
      dispatch(setMenuErrorMessage("Don't use spaces outside the board ID name!"));

      setBoardName('')

      return;
    } 
 
    if (!boardName ) {
      dispatch(setMenuErrorMessage('Create and enter your board ID name!'));

      return;
    } 

    if(menuErrorMessage) {
      return;
    }

    if(board.boardIDName === boardName) {
      dispatch(setMenuErrorMessage('You entered this value last time!'));

      return;
    }

    if (boardName === prevBoardIDName.current) {
      dispatch(setMenuErrorMessage( prevErrorMessage.current));

      return;
    }

    if(!saveBtnIsDisabled && isNewBoard) {
  
      dispatch(setSaveBtnIsDisabled(true));
          
      dispatch(setSearchBoardErrorMessage(''));

      dispatch(setMenuErrorMessage(''));

      options.method = "PUT";

      options.body = JSON.stringify({tasks, boardIDName: board.boardIDName });

      await useFetchData(url + '/board/save', options);

      dispatch(setBoardUpdated(true));
    }

    if(boardName ) {

      options.method = 'POST';
    
      options.body = JSON.stringify({boardIDName: boardName.trim()}); 

      const data = await useFetchData(url + '/board/create', options);

      if(data.message) {
        dispatch(setMenuErrorMessage(data.message))
       
        prevErrorMessage.current = data.message;

        prevBoardIDName.current = boardName;

        return;
      } else {
        const initialState = {
          toDo: [],
          inProgress: [],
          done: [],
        };

        prevBoardIDName.current = '';

        prevErrorMessage.current = '';
  
        dispatch(setBoardWithTasks(initialState));

        dispatch(setIsAddingNewItem(false));
      }
     
      dispatch(setBoardIDs({boardIDName: data.boardIDName, boardID: data.boardID}));
     
      dispatch(setIsNewBoard(true));

      setBoardName('');
    
      closeModal();
    } else {
      dispatch(setMenuErrorMessage('Enter board name!'))
    }
  };

  const handleClear = () => {
    setBoardName('');

    dispatch(setMenuErrorMessage(''));
  };

  const getBoardName = (e: ChangeEvent<HTMLInputElement>) => {

    setBoardName(e.target.value);

    dispatch(setMenuErrorMessage(''));
  }

  return (
    <>
      <div className='menu'>

      <button className='menu__btn menu__btn--create' onClick={() => getUserRequest(Actions.create)}>Create board</button>
        
        {isNewBoard && 
          <>
            <button 
              className='menu__btn menu__btn--update' 
              disabled={saveBtnIsDisabled}  
              onClick={() => getUserRequest(Actions.save)}
            >
              Save board
            </button>

            <button className='menu__btn menu__btn--delete' onClick={() => getUserRequest(Actions.delete)}>Delete board</button>
          </>
        }
      </div>
      {isModalOpen && createPortal(
        <Modal closeModal={closeModal} >
          <div className='menu__modal'>
            <form className='menu__form' onSubmit={handleConfirm}>
              <h3 className='menu__form-title'>Create and enter your ID name for the current board</h3>
              
              {!saveBtnIsDisabled && isNewBoard &&  <h4 className='menu__form-subtitle'>All unsaved data will be saved automatically!</h4>}
              
              <svg 
                className="menu__form-close" 
                onClick={closeModal} 
                xmlns="http://www.w3.org/2000/svg" 
                height="24px" 
                viewBox="0 -960 960 960" 
                width="24px" 
                fill="#e8eaed"
              >
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
              </svg>

              <div className='menu__form-wrap'>
                <input 
                  className='menu__form-input' 
                  onChange={getBoardName} 
                  value={boardName} 
                  type="text" 
                  placeholder="Enter your board ID name..." 
                />
              
                {menuErrorMessage && <p className='menu__form-error'>{menuErrorMessage}</p>}
              </div>
              
              <div className='menu__form-btns'>
                <button className='menu__form-submit' type='submit'>Confirm</button>

                <button className='menu__form-cancel' type='button' onClick={handleClear}>Clear</button>
              </div>
            </form>
          </div>  
        </Modal>,
        document.body
      )}
    </>
  );
};

export default Menu;
