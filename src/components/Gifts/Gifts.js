import { useContext, useState, useEffect } from "react";
import AmeatContext from "../../store/ameat-context";
import axios from "axios";
import classes from "./Gifts.module.css";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import LoadingSpinner from "../UI/LoadingSpinner";

const Gifts = () => {
  const [showGift, setShowGift] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const currentMonth = new Date().getMonth();
  const ctx = useContext(AmeatContext);

  const { items } = ctx;
  const { redeemed, birthday, id } = JSON.parse(
    sessionStorage.getItem("token")
  );

  useEffect(() => {
    if (items.find((item) => item.price === 0)) {
      setShowGift(false);
      return;
    } else if (!sessionStorage.getItem("gift")) {
      if (!redeemed && birthday === currentMonth) {
        setisLoading(true);
        axios(`${process.env.REACT_APP_SERVER}/users/gifts/${id}`)
          .then((res) => {
            const birthdayMeal = res.data[0].meals.find(
              (meal) => meal.group === "birthday"
            );
            sessionStorage.setItem("gift", JSON.stringify(birthdayMeal));
            if (!items.find((item) => item.price === birthdayMeal.price)) {
              setShowGift(birthdayMeal);
            }
            setisLoading(false);
          })
          .catch((error) => {
            setisLoading(false);
            console.log(error);
          });
      } else if (redeemed && birthday !== currentMonth) {
        axios(`${process.env.REACT_APP_SERVER}/users/redeemed/${id}`)
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      setShowGift(JSON.parse(sessionStorage.getItem("gift")));
    }
  }, [id, items, redeemed, birthday, currentMonth]);

  const addToCartHandler = () => {
    ctx.addItem({ ...showGift, amount: 1 });
    setShowGift(false);
  };

  return (
    <>
      {isLoading && (
        <div className={classes.loading}>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
        <Header cartButton={true}>
          {showGift && (
            <div className={classes.tabcards}>
              <div onClick={addToCartHandler} className={classes["gift-card"]}>
                <h3>המבורגר מתנה</h3>
              </div>
            </div>
          )}

          {!showGift && !isLoading && (
            <p className={classes["no-gifts"]}>אין שוברים</p>
          )}
        </Header>
      )}
      {!isLoading && <Footer />}
    </>
  );
};

export default Gifts;
