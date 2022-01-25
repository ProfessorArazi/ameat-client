import { useReducer } from "react";
import AmeatContext from "./ameat-context";
const defaultCartState = {
  items: [],
  totalAmount: 0,
  type: "",
  meals: [],
  // user: {},
};

const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );
    const existingCartItem = state.items[existingCartItemIndex];
    let updatedItems;

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems = state.items.concat(action.item);
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
      // user: state.user,
      food: state.food,
      meals: state.meals,
    };
  }
  if (action.type === "REMOVE") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingItem = state.items[existingCartItemIndex];
    const updatedTotalAmount =
      state.totalAmount - existingItem.price < 0
        ? 0
        : state.totalAmount - existingItem.price;

    let updatedItems;
    if (existingItem.amount === 1) {
      updatedItems = state.items.filter((item) => item.id !== action.id);
    } else {
      const updatedItem = { ...existingItem, amount: existingItem.amount - 1 };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
      // user: state.user,
      food: state.food,
      meals: state.meals,
    };
  }

  if (action.type === "CLEAR") {
    return {
      items: [],
      totalAmount: 0,
      // user: state.user,
      food: "",
      meals: state.meals,
    };
  }

  if (action.type === "UPDATE") {
    return {
      food: state.food,
      items: action.items,
      totalAmount: state.totalAmount,
      meals: state.meals,
      // user: state.user,
    };
  }
  if (action.type === "MEALS") {
    return {
      meals: action.meals,
      food: state.food,
      items: state.items,
      totalAmount: state.totalAmount,
      // user: state.user,
    };
  }

  if (action.type === "PRICE") {
    return {
      totalAmount: action.price,
      meals: state.meals,
      food: state.food,
      items: state.items,
      // user: state.user,
    };
  }

  // if (action.type === "USER") {
  //   return {
  //     user: action.user,
  //     food: state.food,
  //     items: state.items,
  //     totalAmount: state.totalAmount,
  //   };
  // }

  return defaultCartState;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: "ADD", item: item });
  };

  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: "REMOVE", id: id });
  };

  const clearCartHandler = () => {
    dispatchCartAction({ type: "CLEAR" });
  };

  const updateItemsHandler = (items) => {
    dispatchCartAction({ type: "UPDATE", items: items });
  };

  const updateMealsHandler = (meals) => {
    dispatchCartAction({ type: "MEALS", meals: meals });
  };

  const updateTotalAmountHandler = (price) => {
    dispatchCartAction({ type: "PRICE", price: price });
  };

  // const updateUser = (user) => {
  //   dispatchCartAction({ type: "USER", user: user });
  // };

  const ameatContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    food: cartState.type,
    meals: cartState.meals,
    // user: cartState.user,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
    clearCart: clearCartHandler,
    updateItems: updateItemsHandler,
    updateMeals: updateMealsHandler,
    updateTotalAmount: updateTotalAmountHandler, // updateUser: updateUser,
  };

  return (
    <AmeatContext.Provider value={ameatContext}>
      {props.children}
    </AmeatContext.Provider>
  );
};

export default CartProvider;
