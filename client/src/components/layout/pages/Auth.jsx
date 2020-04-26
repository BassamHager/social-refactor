import React, { Fragment, useState, useContext } from "react";
import Input from "../../customized/formElement/Input";
import Button from "../../customized/formElement/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "../../util/Validators";
import { AlertContext } from "../../context/alert-context";
import { useForm } from "../../customized/hooks/Form-hook";
import { useHttpClient } from "../../customized/hooks/Http-hook";
import { AuthContext } from "../../context/auth-context";

const Auth = () => {
  const { setAlert } = useContext(AlertContext);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [formState, inputHandler, setFormData] = useForm(
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

  //  SWITCH LOGGING MODE
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

  // SUBMIT FORM
  const authSubmitHandler = async (event) => {
    event.preventDefault();

    //
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          "/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          formData
        );

        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
    //

    // if (isLoginMode) {
    //   if (password.value === password2.value) {
    //     setAlert("success", "You have logged in successfully!");
    //   } else {
    //     setAlert("danger", "Passwords don't match!");
    //   }
    // } else {
    //   setAlert("danger", "You have logged out!");
    // }
  };

  return (
    <Fragment>
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
