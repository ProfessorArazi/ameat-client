import { useContext } from "react";

import classes from "./MealItem.module.css";
import MealItemForm from "./MealItemForm";
import AmeatContext from "../../../store/ameat-context";

const MealItem = (props) => {
  const ctx = useContext(AmeatContext);
  const oldPrice = props.price;
  const oldPriceShekels = `₪${oldPrice}`;
  let price = oldPrice;
  let PriceShekels = `₪${price}`;

  if (props.discount) {
    price = Math.floor((props.price * (100 - props.discount)) / 100);
    PriceShekels = `₪${price}`;
  }

  const addToCartHandler = (amount) => {
    ctx.addItem({
      id: props.id,
      name: props.name,
      amount: +amount,
      price: +price,
      image: props.image,
      group: props.group,
      twoInOne: props.twoInOne,
      discount: props.discount,
      happyHour: props.happyHour,
    });
  };
  return (
    <div>
      <li className={classes.meal}>
        <div>
          <MealItemForm onAddToCart={addToCartHandler} />
        </div>
        <div>
          <h2>{props.name}</h2>
          <div className={classes.description}>{props.description}</div>
          <div className={classes.price}>
            {!props.discount ? (
              PriceShekels
            ) : (
              <div>
                <div className={classes.onSale}>{oldPriceShekels}</div>
                <div>{PriceShekels}</div>
              </div>
            )}
          </div>
          <div className={classes.image}>{props.image}</div>
        </div>
      </li>
    </div>
  );
};
export default MealItem;
