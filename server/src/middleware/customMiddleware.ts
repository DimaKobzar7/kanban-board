import { Request, Response, NextFunction  } from 'express';
import { Board } from '../models/Board';
import mongoose from 'mongoose';

export const customMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { boardIDName } = req.body;

  try {
    const board = await Board.findOne({ boardIDName });

    if(board) {
      req.boardIDs = {
        boardIDName: boardIDName,
        boardID: board._id as mongoose.Types.ObjectId,
      }
    }
 
    next();
  } catch (error) {
    next(error);
    return res.status(500).json({ message: 'An error occurred', error });
  }
};
