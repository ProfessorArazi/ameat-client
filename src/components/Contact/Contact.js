import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { useRef, useState } from "react";
import Header from "../Layout/Header";
import classes from "./Contact.module.css";
import LoadingSpinner from "../UI/LoadingSpinner";
import Footer from "../Layout/Footer";
import validator from "validator";

const Contact = () => {
  document.title = "דברו איתנו!";
  const loggedIn = sessionStorage.getItem("token");
  let userEmail;
  if (loggedIn) {
    userEmail = JSON.parse(sessionStorage.getItem("token")).email;
  }

  const [emailError, setEmailError] = useState();
  const [messageError, setMessageError] = useState();
  const [connectionError, setConnectionError] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);

  const emailInputRef = useRef();
  const messageInputRef = useRef();

  const submitHandler = async (event) => {
    event.preventDefault();
    setConnectionError(undefined);
    setEmailError(undefined);
    setMessageError(undefined);
    setDidSubmit(false);

    const email = userEmail || emailInputRef.current.value;
    const message = messageInputRef.current.value;

    let formIsValid = true;

    if (message.trim().length === 0) {
      setMessageError("לא ניתן לשלוח הודעה ריקה");
      formIsValid = false;
    }

    if (!validator.isEmail(email)) {
      setEmailError("אימייל לא חוקי");
      formIsValid = false;
    }

    if (!formIsValid) return;

    const messageData = {
      email: email,
      message: message,
    };

    setIsSubmitting(true);
    await axios
      .post(process.env.REACT_APP_SERVER + "/contact", messageData, {
        "Content-Type": "application/json",
      })
      .then((res) => {
        setIsSubmitting(false);

        if (res.data.messageError) {
          setMessageError("לא ניתן לשלוח הודעה ריקה");
          formIsValid = false;
        }

        if (res.data.emailError) {
          setEmailError("אימייל לא חוקי");
          formIsValid = false;
        }

        if (res.data.failed) {
          setConnectionError(true);
        }

        if (formIsValid) {
          setDidSubmit(true);
          emailInputRef.current.value = "";
          messageInputRef.current.value = "";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const didSubmitModalContent = (
    <p>{connectionError ? "...משהו השתבש" : "ההודעה נשלחה בהצלחה"}</p>
  );

  const emailControlClasses = `${classes.control} ${
    emailError && classes.invalid
  }`;

  const messageControlClasses = `${classes.control} ${
    messageError && classes.invalid
  }`;

  return (
    <>
      <Header cartButton={false}>
        <div className={classes.page}>
          <Form className={classes.form} onSubmit={submitHandler}>
            {!loggedIn && (
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <div className={emailControlClasses}>
                  <Form.Label>אימייל</Form.Label>
                  <Form.Control
                    placeholder="name@example.com"
                    ref={emailInputRef}
                    dir="ltr"
                  />
                  {emailError && <p> בבקשה הכנס אימייל חוקי</p>}
                </div>
              </Form.Group>
            )}
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <div className={messageControlClasses}>
                <Form.Label dir="rtl">ההודעה שלך</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  ref={messageInputRef}
                  dir="rtl"
                />
                {messageError && <p>...תכתוב משהו</p>}
              </div>
            </Form.Group>
            <Button className={classes.button} type="submit" variant="warning">
              שלח
            </Button>
            {isSubmitting && (
              <div className={classes.feedback}>
                <LoadingSpinner />
              </div>
            )}
            {didSubmit && (
              <div className={classes.feedback}>{didSubmitModalContent}</div>
            )}
          </Form>
        </div>
      </Header>
      <Footer />
    </>
  );
};

export default Contact;
