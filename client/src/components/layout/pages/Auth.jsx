import React, { Fragment, useState, useContext } from "react";
import Input from "../../customized/formElement/Input";
import Button from "../../customized/formElement/Button";
import UseForm from "../../customized/hooks/Form-hook";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "../../util/Validators";
import { AlertContext } from "../../context/alert-context";

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(false);

  // Alert
  const { setAlert } = useContext(AlertContext);

  //
  const [formState, inputHandler, setFormData] = UseForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
      password2: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const { email, password, password2 } = formState.inputs;

  //  Switch Mode Handler
  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          password2: undefined,
        },
        email.isValid && password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          password2: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    if (!isLoginMode) {
      if (password.value === password2.value) {
        setAlert("success", "You have logged in successfully!");
      } else {
        setAlert("danger", "Passwords don't match!");
      }
    } else {
      setAlert("danger", "You have logged out!");
    }
  };

  return (
    <Fragment>
      {/* <Alert /> */}

      <h1 className="large text-primary">
        {!isLoginMode ? "Sign Up" : "Sign In"}
      </h1>

      <p className="lead">{isLoginMode ? "Sign In " : "Create "}Your Account</p>
      <form className="form" onSubmit={authSubmitHandler}>
        {!isLoginMode && (
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

        {!isLoginMode && (
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
        )}

        <Button type="submit" disabled={!formState.isValid}>
          {isLoginMode ? "LOGIN" : "SIGN UP"}
        </Button>
      </form>
      <br />
      <Button className="my-1" inverse onClick={switchModeHandler}>
        SWITCH TO {isLoginMode ? "SIGN UP" : "LOGIN"}
      </Button>
    </Fragment>
  );
};

export default Auth;
