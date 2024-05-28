import  { ObjectId } from 'mongoose';

import mongoose from 'mongoose';

declare global {
  namespace Express {
    export interface Request {
      boardIDs: {
        boardIDName: string;
        boardID: mongoose.Types.ObjectId
      };
    }
  }
}
