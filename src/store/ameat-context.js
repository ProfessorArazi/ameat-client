import React from "react";

const AmeatContext = React.createContext({
  items: [],
  totalAmount: 0,
  type: "",
  meals: [],
  // points: 0,
  // user: {},

  updateItems: (items) => {},
  addItem: () => {},
  removeItem: (id) => {},
  clearCart: () => {},
  updateMeals: (meals) => {},
  updateTotalAmount: (price) => {},
  // updateUser: (user) => {},
});

export default AmeatContext;
