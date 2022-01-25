import axios from "axios";
import { useContext, useState } from "react";
import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import classes from "./Cart.module.css";
import AmeatContext from "../../store/ameat-context";
import Checkout from "./Checkout";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const Cart = (props) => {
  const [isCheckOut, setIsCheckOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [showSlider, setShowSlider] = useState(true);

  const isLoggedIn = sessionStorage.getItem("token");
  let totalAmount;
  const ctx = useContext(AmeatContext);
  const { points } = JSON.parse(sessionStorage.getItem("token")) || 0;
  const hasItems = ctx.items.length > 0;
  if (hasItems) {
    totalAmount = `₪${
      isCheckOut
        ? (ctx.totalAmount - sliderValue / 10 + 10).toFixed(2)
        : (ctx.totalAmount - sliderValue / 10).toFixed(2)
    }`;
  }

  const submitOrderHelper = (res) => {
    setIsSubmitting(false);
    if (res.data.error) {
      setDidSubmit("משהו השתבש... נסה שוב");
    } else {
      setDidSubmit("!ההזמנה הגיעה בהצלחה");
      sessionStorage.removeItem("items");
      ctx.clearCart();
    }
  };

  const cartItemRemoveHandler = (id) => {
    ctx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    ctx.addItem({ ...item, amount: 1 });
  };

  const cartClearItemsHandler = () => {
    ctx.clearCart();
    sessionStorage.removeItem("items");
  };

  const orderHandler = () => {
    setIsCheckOut(true);
    setShowSlider(false);
  };

  const submitOrderHandler = (userData) => {
    if (isLoggedIn) {
      const { id } = JSON.parse(sessionStorage.getItem("token"));
      const orderedItems = ctx.items;
      const points = sliderValue;
      const totalPrice = ctx.totalAmount - points / 10;

      if (orderedItems.find((item) => item.price === 0)) {
        sessionStorage.removeItem("gift");
      }

      const order = {
        user: userData,
        orderedItems,
        totalPrice,
        points,
      };
      setIsSubmitting(true);
      axios
        .post(`${process.env.REACT_APP_SERVER}/order/${id}`, order, {
          "Content-Type": "application/json",
        })
        .then((res) => {
          let user = JSON.parse(sessionStorage.getItem("token"));
          user.redeemed = res.data.redeemed || user.redeemed;
          user.points = res.data.points || user.points;
          sessionStorage.setItem("token", JSON.stringify(user));
          submitOrderHelper(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const order = {
        user: userData,
        items: ctx.items,
        totalPrice: ctx.totalAmount,
      };
      setIsSubmitting(true);
      axios
        .post(`${process.env.REACT_APP_SERVER}/order`, order, {
          "Content-Type": "application/json",
        })
        .then((res) => {
          submitOrderHelper(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {ctx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.price === 0 ? 1 : item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onClose}>
        סגור
      </button>
      {hasItems && (
        <button
          className={classes["button--alt"]}
          onClick={cartClearItemsHandler}
        >
          נקה עגלה
        </button>
      )}

      {hasItems && ctx.totalAmount >= 30 && (
        <button onClick={orderHandler} className={classes.button}>
          הזמן
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <>
      {!isCheckOut && cartItems}
      {showSlider &&
        ctx.totalAmount >= 30 &&
        sessionStorage.getItem("token") &&
        points >= 10 && (
          <div>
            <h3 className={classes.points}>{`נקודות  : ${points}`}</h3>
            <Slider
              onChange={(value) => {
                setSliderValue(value);
              }}
              className={classes.slider}
              step={10}
              max={
                points > ctx.totalAmount * 10
                  ? ctx.totalAmount * 10 - ((ctx.totalAmount * 10) % 10)
                  : points - (points % 10)
              }
            />
            <h3 className={classes["slider-value"]}>{sliderValue}</h3>
          </div>
        )}
      {!isCheckOut && (
        <span className={classes.minimum}>
          <p>מינימום הזמנה : ₪30</p>
        </span>
      )}
      <div className={!isCheckOut ? classes.total : classes["full-price"]}>
        <span>{totalAmount}</span>
        <span>{hasItems && (isCheckOut ? "מחיר כולל משלוח" : "מחיר")}</span>
      </div>
      {isCheckOut && (
        <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />
      )}
      {!isCheckOut && modalActions}
    </>
  );

  const isSubmittingModalContent = (
    <p className={classes.order}>...ההזמנה בדרך למסעדה</p>
  );

  const didSubmitModalContent = (
    <>
      <p className={classes.order}>{didSubmit}</p>
      <div className={classes.actions}>
        <button className={classes.button} onClick={props.onClose}>
          סגור
        </button>
      </div>
    </>
  );

  return (
    <Modal background="cart" onClose={props.onClose}>
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {didSubmit && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;
