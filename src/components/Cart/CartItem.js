import classes from "./CartItem.module.css";

const CartItem = (props) => {
  const price = `₪${props.price.toFixed(2)}`;

  return (
    <li className={classes["cart-item"]}>
      {props.price > 0 && (
        <div className={classes.actions}>
          <button onClick={props.onAdd}>+</button>
          <button onClick={props.onRemove}>−</button>
        </div>
      )}
      {props.price === 0 && <div></div>}
      <div>
        <h5>{props.name}</h5>
        <div className={classes.summary}>
          <span className={classes.price}>{price}</span>
          <span className={classes.amount}>x {props.amount}</span>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
