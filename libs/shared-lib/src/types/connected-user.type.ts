import { IUser } from "../interfaces";

export type ConnectedUser = Omit<IUser, 'id' | 'password'>;