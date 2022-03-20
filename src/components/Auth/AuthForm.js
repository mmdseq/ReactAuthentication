import { useState, useRef, useContext } from "react";

import classes from "./AuthForm.module.css";
import AuthContext from "../../store/auth-context";
import { useHistory } from "react-router-dom";

const AuthForm = () => {
  const history = useHistory()
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const authCtx = useContext(AuthContext)
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const emailEntered = emailInputRef.current.value;
    const passwordEntered = passwordInputRef.current.value;

    setIsLoading(true);
    let url;
    if (isLogin) {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBym569JNYc0fbUOBgdHj_Dl79Jfxvq_0E`;
    } else {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBym569JNYc0fbUOBgdHj_Dl79Jfxvq_0E`;
    }

    fetch(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          email: emailEntered,
          password: passwordEntered,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      setIsLoading(false);
      if (res.ok) {
        return res.json()
        //...
      } else {
        return res.json().then((data) => {
          // show an error modal
          console.log(data);

          let errorMessage = "Authentication failed!";
          // if(data && data.error && data.error.message){
          //   errorMessage= data.error.message
          // }

          throw new Error(errorMessage)

          
        });
      }
    }).then(data=> { 
      // console.log(data);
      const expirationTime = new Date(new Date().getTime() + +data.expiresIn * 1000)

      console.log(expirationTime);
      console.log(expirationTime.toISOString);
      const date= new Date()
      console.log(date);

      authCtx.login(data.idToken,expirationTime.toISOString())
      history.replace('/')

      
    })
    .catch(err => {
      alert(err.message);
    })
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Sending request...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;






// // mal khodam 
// // To test a function and get back its return
// function printElapsedTime(fTest) {
//   let nStartTime = Date.now(),
//       vReturn = fTest(),
//       nEndTime = Date.now()

//   console.log(`Elapsed time: ${ String(nEndTime - nStartTime) } milliseconds`)
//   return vReturn
// }

// let yourFunctionReturn = printElapsedTime(yourFunction)


// // Get the number of seconds since the ECMAScript Epoch
// let seconds = Math.floor(Date.now() / 1000)
