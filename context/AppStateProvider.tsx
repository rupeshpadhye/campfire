import React, { useEffect, useReducer } from 'react'
import AppReducer from './AppReducer';
import AppContext from './AppContext';
import { useSession } from 'next-auth/client';


const initialState = {}
const AppStateProvider: React.FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState)
    useSession();
  return (
    <div>
      <AppContext.Provider
        value={state}
      >
        {children}
      </AppContext.Provider>
    </div>
  )
}
export default AppStateProvider;