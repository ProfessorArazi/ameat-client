import LoadingSpinner from "../UI/LoadingSpinner";
import classes from "./Member.module.css";
import { Form, Button } from "react-bootstrap";
import { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Modal from "../UI/Modal";
import validator from "validator";

const Member = (props) => {
  let history = useHistory();

  const [register, setRegister] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const [fullNameError, setFullNameError] = useState();
  const [dateError, setDateError] = useState();
  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState();
  const [loginError, setLoginError] = useState();
  const [password, setPassword] = useState(null);

  const fullNameRef = useRef();
  const dateRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef("");

  const resetErrors = () => {
    setLoginError(undefined);
    setFullNameError(undefined);
    setDateError(undefined);
    setEmailError(undefined);
    setPasswordError(undefined);
  };

  const registerHandler = () => {
    resetErrors();
    setPassword(null);
    emailRef.current.value = "";
    passwordRef.current.value = "";
    setRegister(!register);
  };

  const memberHandler = (event) => {
    event.preventDefault();

    resetErrors();

    if (register) {
      const registerData = {
        fullName: fullNameRef.current.value,
        birthday: dateRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
      let formIsValid = true;

      if (registerData.fullName.trim().length < 2) {
        setFullNameError("error");
        formIsValid = false;
      }

      if (!registerData.birthday) {
        setDateError("error");
        formIsValid = true;
      }

      if (!validator.isEmail(registerData.email)) {
        setEmailError("error");
        formIsValid = false;
      }

      if (password.trim().length < 8) {
        setPasswordError("error");
        formIsValid = false;
      }

      if (!formIsValid) return;

      setIsSubmitting(true);
      axios
        .post(process.env.REACT_APP_SERVER + "/users", registerData, {
          "Content-Type": "application/json",
        })
        .then((res) => {
          setIsSubmitting(false);

          if (res.data.fullNameError) {
            setFullNameError("error");
            formIsValid = false;
          }

          if (res.data.dateError) {
            setDateError("error");
            formIsValid = false;
          }

          if (res.data.emailError) {
            setEmailError("error");
            formIsValid = false;
          }

          if (res.data.passwordError) {
            setPasswordError("error");
            formIsValid = false;
          }

          if (formIsValid) {
            setDidSubmit(true);
            sessionStorage.setItem(
              "token",
              JSON.stringify({ token: res.data.token, ...res.data.user })
            );
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const loginData = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
      setIsSubmitting(true);
      axios
        .post(process.env.REACT_APP_SERVER + "/users/login", loginData, {
          "Content-Type": "application/json",
        })
        .then((res) => {
          setIsSubmitting(false);
          setDidSubmit(true);
          sessionStorage.setItem(
            "token",
            JSON.stringify({ token: res.data.token, ...res.data.user })
          );
          history.push("/");
        })
        .catch((err) => {
          setIsSubmitting(false);
          setLoginError(true);
        });
    }
  };

  const fullNameControlClasses = `mb-3 ${classes.control} ${
    fullNameError && classes.invalid
  }`;

  const dateControlClasses = `mb-3 ${classes.control} ${
    dateError && classes.invalid
  }`;

  const emailControlClasses = `mb-3 ${classes.control} ${
    emailError && classes.invalid
  }`;

  const passwordControlClasses = `mb-3 ${classes.control} ${
    passwordError && classes.invalid
  }`;

  return (
    <>
      {!didSubmit && (
        <Modal
          background={register ? "memberRegister" : "memberLogin"}
          onClose={props.onClose}
          onClick={props.onClick}
        >
          <Form onSubmit={memberHandler} className={classes.form}>
            <h1 className={classes.title}>{register ? "!הצטרפו" : "התחבר"}</h1>

            {register && (
              <>
                <Form.Group className={fullNameControlClasses}>
                  <Form.Control
                    ref={fullNameRef}
                    dir="rtl"
                    placeholder="שם מלא"
                  />
                </Form.Group>
                <Form.Group className={dateControlClasses}>
                  <Form.Control
                  className={classes.input}
                    ref={dateRef}
                    type="text"
                    placeholder="יום הולדת"
                    onFocus={(e) => {
                      e.target.type = "date";
                      e.target.focus();
                    }}
                    min="1970-01-01"
                    max={new Date().toISOString().slice(0, 10)}
                  />
                </Form.Group>
              </>
            )}
            <Form.Group className={emailControlClasses}>
              <Form.Control
                className={classes.input}
                ref={emailRef}
                type="email"
                placeholder="אימייל"
              />
            </Form.Group>

            <Form.Group className={passwordControlClasses}>
              <Form.Control
                onChange={(e) => setPassword(e.target.value)}
                ref={passwordRef}
                type="password"
                placeholder={`סיסמה${register ? " - לפחות 8 תווים" : ""}`}
              />

              <div>
              </div>
              {!isSubmitting && (
                <Button
                  className={classes.button}
                  variant={loginError ? "danger" : "warning"}
                  type="submit"
                >
                  {register ? "הצטרף " : "התחבר"}
                </Button>
              )}
            </Form.Group>

            {isSubmitting && (
              <div className={classes.loading}>
                <LoadingSpinner />
              </div>
            )}
          </Form>
          <p className={classes["not-member"]} onClick={registerHandler}>
            {register ? "?חבר מועדון" : "?עדיין לא חבר מועדון"}
          </p>
        </Modal>
      )}
    </>
  );
};
export default Member;
