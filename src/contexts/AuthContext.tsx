import React from "react";

import { IUser } from "../interfaces";
import { IWeb3Client } from "../web3/web3Client";

export interface IAuthContext {
  isAuthenticated: boolean;
  user?: IUser;
  setUser?: (user: IUser) => void;
  logoutUser?: () => void;
  web3Client?: IWeb3Client;
}

export const AuthContext = React.createContext<IAuthContext>({
  isAuthenticated: false,
  user: undefined,
  setUser: undefined,
  logoutUser: undefined,
  web3Client: undefined,
});
