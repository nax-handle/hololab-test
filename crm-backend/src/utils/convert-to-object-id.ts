import { Types } from 'mongoose';

export const convertToObjectId = (id: string) => new Types.ObjectId(id);
