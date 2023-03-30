import { useEffect, useRef, useState } from "react";
import classes from "./Checkout.module.css";
import axios from "axios";
import checkoutData from "./checkoutData";

const Checkout = (props) => {
  const [streets, setStreets] = useState([]);
  const [myStreets, setMyStreets] = useState(null);
  const [cities, setCities] = useState(null);
  const [formInputValidity, setFormInputValidity] = useState({
    name: true,
    phone: true,
    email: true,
    city: true,
    street: true,
    apartment: true,
    home: true,
  });

  useEffect(() => {
    axios(
      "https://raw.githubusercontent.com/GabMic/israeli-cities-and-streets-list/master/israeli_street_and_cities_names.json"
    )
      .then((res) => {
        setStreets(res.data.streets);
      })
      .catch((err) => console.log(err));
  }, []);

  const nameInputRef = useRef();
  const phoneInputRef = useRef();
  const emailInputRef = useRef();
  const cityInputRef = useRef();
  const streetInputRef = useRef();
  const apartmentInputRef = useRef();
  const homeInputRef = useRef();
  const commentsInputRef = useRef();
  const formRef = useRef();

  const showStreets = (value) => {
    setMyStreets(streets.filter((street) => street.city_name === value));
  };

  const confirmHandler = (event) => {
    event.preventDefault();

    const enteredName = nameInputRef.current.value;
    const enteredPhone = phoneInputRef.current.value;
    const enteredCity = cityInputRef.current.value;
    const enteredStreet = streetInputRef.current.value;
    const enteredApartment = apartmentInputRef.current.value;
    const enteredHome = homeInputRef.current.value;
    const enteredComments = commentsInputRef.current.value;
    const enteredEmail = sessionStorage.getItem("token")
      ? JSON.parse(sessionStorage.getItem("token")).email
      : emailInputRef.current.value;

    const enteredNameIsValid = !checkoutData.isEmpty(enteredName);
    const enteredCityIsValid = !checkoutData.isEmpty(enteredCity);
    const enteredPhoneIsValid = checkoutData.isValidPhone(enteredPhone);
    const enteredStreetIsValid = !checkoutData.isEmpty(enteredStreet);
    const enteredApartmentIsValid =
      checkoutData.isValidApartment(enteredApartment);
    const enteredHomeIsValid = !checkoutData.isEmpty(enteredHome);
    const enteredEmailIsValid = sessionStorage.getItem("token")
      ? true
      : checkoutData.isValidMail(enteredEmail);

    setFormInputValidity({
      name: enteredNameIsValid,
      city: enteredCityIsValid,
      phone: enteredPhoneIsValid,
      email: enteredEmailIsValid,
      street: enteredStreetIsValid,
      apartment: enteredApartmentIsValid,
      home: enteredHomeIsValid,
    });

    const formIsValid =
      enteredEmailIsValid &&
      enteredNameIsValid &&
      enteredCityIsValid &&
      enteredStreetIsValid &&
      enteredHomeIsValid &&
      enteredPhoneIsValid &&
      enteredApartmentIsValid;

    if (!formIsValid) {
      formRef.current.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      return;
    }

    props.onConfirm({
      name: enteredName,
      phone: enteredPhone,
      email: enteredEmail,
      city: enteredCity,
      street: enteredStreet,
      apartment: enteredApartment,
      home: enteredHome,
      comments: enteredComments,
    });
  };

  const nameControlClasses = `${classes.control} ${
    !formInputValidity.name && classes.invalid
  }`;

  const phoneControlClasses = `${classes.control} ${
    !formInputValidity.phone && classes.invalid
  }`;

  const cityControlClasses = `${classes.control} ${
    !formInputValidity.city && classes.invalid
  }`;

  const streetControlClasses = `${classes.control} ${
    !formInputValidity.street && classes.invalid
  }`;

  const emailControlClasses = `${classes.control} ${
    !formInputValidity.email && classes.invalid
  }`;

  const apartmentControlClasses = `${classes["small-input"]} ${
    !formInputValidity.apartment && classes["invalid-small-input"]
  }`;

  const homeControlClasses = `${classes["small-input"]} ${
    !formInputValidity.home && classes["invalid-small-input"]
  }`;

  return (
    <>
      {cities ? (
        <form ref={formRef} className={classes.form} onSubmit={confirmHandler}>
          <div className={nameControlClasses}>
            <label htmlFor="name">השם שלך</label>
            <input dir="rtl" ref={nameInputRef} type="text" id="name" />
          </div>
          <div className={phoneControlClasses}>
            <label htmlFor="phone">טלפון</label>
            <input dir="ltr" ref={phoneInputRef} type="text" id="phone" />
          </div>
          {!sessionStorage.getItem("token") && (
            <div className={emailControlClasses}>
              <label htmlFor="email">מייל</label>
              <input dir="ltr" ref={emailInputRef} type="text" id="email" />
            </div>
          )}

          <div className={cityControlClasses}>
            <label htmlFor="city">עיר</label>
            {/* <input
              onChange={(event) => setMyCities(showCities(event.target.value))}
              onBlur={(event) => showStreets(event.target.value)}
              dir="rtl"
              ref={cityInputRef}
              type="text"
              id="city"
              list="cityname"
            />

            <datalist id="cityname">
              {myCities
                ? myCities.map((city) => <option value={city} />)
                : cities
                ? cities.map((city) => <option value={city} />)
                : ""}
            </datalist> */}
            <select
              dir="rtl"
              onChange={(event) => showStreets(event.target.value)}
              ref={cityInputRef}
            >
              {cities &&
                cities.map((city, i) =>
                  i > 0 ? (
                    <option value={city}>{city}</option>
                  ) : (
                    <option value="" disabled selected>
                      {city}
                    </option>
                  )
                )}
            </select>
          </div>

          <div className={streetControlClasses}>
            <label htmlFor="street">רחוב</label>
            <input
              dir="rtl"
              ref={streetInputRef}
              type="text"
              id="street"
              list="streetname"
            />
            <datalist id="streetname">
              {myStreets &&
                myStreets.map((street) => (
                  <option value={street.street_name} />
                ))}
            </datalist>
          </div>
          <div dir="rtl" className={classes.control}>
            <div className={classes["row-inputs"]}>
            <input
              ref={homeInputRef}
              placeholder="בית"
              className={homeControlClasses}
            />
            <input
              ref={apartmentInputRef}
              placeholder="דירה"
              className={apartmentControlClasses}
            />
            </div>
            <textarea
              ref={commentsInputRef}
              dir="rtl"
              rows={3}
              placeholder="הערות"
              className={classes.comments}
            />
          </div>

          <div className={classes.actions}>
            <button type="button" onClick={props.onCancel}>
              בטל
            </button>
            <button className={classes.submit}>הזמן</button>
          </div>
        </form>
      ) : (
        <>
          <h3 className={classes.area}>? מאיזה סניף תרצו להזמין</h3>
          <div className={classes.actions}>
            <button onClick={() => setCities(checkoutData.areas.south)}>
              אשדוד
            </button>
            <button onClick={() => setCities(checkoutData.areas.center)}>
              רמת גן
            </button>
            <button onClick={() => setCities(checkoutData.areas.north)}>
              חיפה
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Checkout;
