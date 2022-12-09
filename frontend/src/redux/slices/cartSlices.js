import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const shippingAddressFromStorage = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : {};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
  },
  reducers: {
    CART_ADD_ITEM: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);
      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product ? item : x
        );
      } else {
        state.cartItems.push(item);
      }
    },
    CART_REMOVE_ITEM: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (x) => x.product !== action.payload
      );
    },
    CART_SAVE_SHIPPING_ADDRESS: (state, action) => {
      state.shippingAddress = action.payload;
    },
    CART_SAVE_PAYMENT_METHOD: (state, action) => {
      state.paymentMethod = action.payload;
    },
    CART_CLEAR_ITEMS: () => {
      return {};
    },
  },
});

export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`);

  dispatch(
    CART_ADD_ITEM({
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    })
  );

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch(CART_REMOVE_ITEM(id));

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch(CART_SAVE_SHIPPING_ADDRESS(data));

  localStorage.setItem("shippingAddress", JSON.stringify(data));
};

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch(CART_SAVE_PAYMENT_METHOD(data));

  localStorage.setItem("paymentMethod", JSON.stringify(data));
};

export const {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_CLEAR_ITEMS,
} = cartSlice.actions;

export default cartSlice.reducer;
