import React, { useCallback, useEffect, useState } from "react";


let logoutTimer;
const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime)=>{
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();
    const remainigDuration = adjExpirationTime - currentTime;
    return remainigDuration
}

const retrieveStoredToken = ()=>{
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = localStorage.getItem('expirationTime')

  const remainingTime = calculateRemainingTime(storedExpirationDate)

  if(remainingTime <= 60000){
    localStorage.removeItem('token')
    localStorage.removeItem('expirationTime')
    return null
  }

  return {
    token: storedToken,
    duration: remainingTime
  }
}

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken()
  let initialToken;
  if(tokenData){
    initialToken= tokenData.token
  }
  // const initialToken= localStorage.getItem('token');
  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  
  // state functions like setToken React garantied never changes,clearTimeout and removeItem are javascript not react specefic function and logoutTime is out of React rendering view so never change  so dont need to add as dependency

  const logoutHandler =useCallback(() => {
    setToken(null);
    localStorage.removeItem('token')
    localStorage.removeItem('expirationTime')
    if(logoutTimer){
      clearTimeout(logoutTimer)
    }

  },[]);

  const loginHandler = (token,expirationTime) => {
    setToken(token);
     localStorage.setItem('token',token)
     localStorage.setItem('expirationTime',expirationTime)

     const remainingTime = calculateRemainingTime(expirationTime);
    logoutTimer = setTimeout(logoutHandler,remainingTime)

  };

  useEffect(()=>{
    if(tokenData){
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler,tokenData.duration)
    }
  },[tokenData])

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
