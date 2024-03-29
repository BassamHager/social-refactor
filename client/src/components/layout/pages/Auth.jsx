import React, { Fragment, useContext, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
// formElement
import Input from "../../customized/formElement/Input";
import Button from "../../customized/formElement/Button";
// hooks
import { useForm } from "../../customized/hooks/Form-hook";
import { useHttpClient } from "../../customized/hooks/Http-hook";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "../../customized/hooks/Validators-hook";
// context
import { AlertContext } from "../../customized/context/alert-context";
import { AuthContext } from "../../customized/context/auth-context";

const Auth = () => {
  const { setAlert } = useContext(AlertContext);
  const { sendRequest } = useHttpClient();
  const { login, isToLoginMode, setIsToLoginMode } = useContext(AuthContext);
  const history = useHistory();
  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {},
      email: {},
      password: {},
      // password2: {},
    },
    false
  );

  const { name, email, password } = formState.inputs;

  const signInOrUpFrom = useCallback(() => {
    isToLoginMode
      ? setFormData(
          {
            ...formState.inputs,
            name: undefined,
          },
          email.isValid && password.isValid
        )
      : setFormData(
          {
            ...formState.inputs,
            name: {},
          },
          false
        );
  }, [
    email.isValid,
    formState.inputs,
    password.isValid,
    isToLoginMode,
    setFormData,
  ]);

  // SUBMIT FORM
  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isToLoginMode) {
      try {
        const resData = await sendRequest(
          "/api/users/login",
          "POST",
          JSON.stringify({
            email: email.value,
            password: password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        login(resData.userId, resData.token);

        setAlert("success", "You have logged in successfully!");
        history.push("/dashboard");
      } catch (err) {
        console.log(err.message);
        setAlert("danger", err.message);
      }
    } else {
      try {
        const resData = await sendRequest(
          "/api/users/signup",
          "POST",
          JSON.stringify({
            name: name.value,
            email: email.value,
            password: password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        if (resData) {
          login(resData.userId, resData.token);
          setAlert("success", "You have signed up successfully!");
        }
      } catch (err) {
        setAlert("danger", err.message);
      }
    }
  };

  useEffect(() => {
    signInOrUpFrom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isToLoginMode]);

  return (
    <Fragment>
      <h1 className="large text-primary">
        {!isToLoginMode ? "Sign Up" : "Sign In"}
      </h1>

      <p className="lead">
        {isToLoginMode ? "Sign In " : "Create "}Your Account
      </p>
      <form className="form" onSubmit={authSubmitHandler}>
        {!isToLoginMode && (
          <div className="form-group">
            <Input
              element="input"
              id="name"
              type="text"
              label="your name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name!"
              placeholder="your name..."
              onInput={inputHandler}
            />
          </div>
        )}

        <div className="form-group">
          <Input
            element="input"
            id="email"
            type="text"
            label="Email Address"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email!"
            placeholder="Email..."
            onInput={inputHandler}
          />
        </div>

        <div className="form-group">
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Password should contain 6 characters at least!"
            placeholder="Password..."
            onInput={inputHandler}
          />
        </div>

        {/* {!isToLoginMode && (
          <div className="form-group">
            <Input
              element="input"
              id="password2"
              type="password"
              label="Confirm Password"
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="Password should be the same as first password!"
              placeholder="Repeat Password..."
              onInput={inputHandler}
            />
          </div>
        )} */}

        <Button type="submit" disabled={!formState.isValid}>
          {isToLoginMode ? "LOGIN" : "SIGN UP"}
        </Button>
      </form>
      <br />
      <Button
        className="my-1"
        inverse
        onClick={() => setIsToLoginMode(!isToLoginMode)}
      >
        SWITCH TO {isToLoginMode ? "SIGN UP" : "LOGIN"}
      </Button>
    </Fragment>
  );
};

export default Auth;
