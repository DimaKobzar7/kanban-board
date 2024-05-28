import { Router, Request, Response } from 'express';
import { Board } from '../models/Board';

const router = Router();

router.post('/create', async (req: Request, res: Response) => {
  if(req.boardIDs) {
    return res.status(400).json({ message: 'Board name already exists' });
  }

  try {
    const newBoard = new Board(req.body);

    await newBoard.save();

    return res.status(201).send({ boardID: newBoard._id, boardIDName: newBoard.boardIDName });
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred', error });
  }

  
});

router.put('/save', async (req: Request, res: Response) => {
  try {
    const updatedTasks = await Board.findOneAndUpdate(
      { boardIDName: req.boardIDs.boardIDName, _id: req.boardIDs.boardID }, 
      { ...req.body.tasks },  
      { new: true, upsert: true, runValidators: true },
    ).exec();

   return res.status(200).json({ message: 'Board saved successfully', tasks: updatedTasks });
  } catch (error) {
   return res.status(500).json({ message: 'Error saving board', error });
  }

  
});

router.delete('/delete', async (req: Request, res: Response) => {
  try {
    const result = await Board.findOneAndDelete({ _id: req.boardIDs.boardID, boardIDName: req.boardIDs.boardIDName }).exec();

    if (!result) {
      return res.status(404).json({ message: 'Board not found' });
    }

    return res.status(200).json({ message: `Board named ${req.boardIDs.boardIDName} was successfully deleted` });
    
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred it was deleted', error });
  }
});

router.post('/search', async (req: Request, res: Response)  => {
  try {
    const board = await Board.findOne({ _id: req.boardIDs.boardID, boardIDName: req.boardIDs.boardIDName }).exec();

    if (board) {
      const response = {
        tasks: {
          toDo: board.toDo,
          inProgress: board.inProgress,
          done: board.done
        },
        boardInfo: {
          boardID: board._id,
          boardIDName: board.boardIDName
        }
      }

      return res.status(200).send(response);
    } else {
      return res.status(404).json({ message: 'Board not found' });
    }
   
  } catch (error) {
    return res.status(500).json({ message: 'There is no board with that name' });
  }
});

export default router;