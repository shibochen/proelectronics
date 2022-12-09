import { configureStore } from "@reduxjs/toolkit";
import {
  productListReducer,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
  productCreateReviewReducer,
  productTopRatedReducer,
} from "./slices/productSlices";
import cartReducer from "./slices/cartSlices";
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
} from "./slices/userSlices";
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  orderDeliverReducer,
  orderListMyReducer,
  orderListReducer,
} from "../redux/slices/orderSlices";

// const cartItemsFromStorage = localStorage.getItem("cartItems")
//   ? JSON.parse(localStorage.getItem("cartItems"))
//   : [];

// const userInfoFromStorage = localStorage.getItem("userInfo")
//   ? JSON.parse(localStorage.getItem("userInfo"))
//   : null;

// const shippingAddressFromStorage = localStorage.getItem("shippingAddress")
//   ? JSON.parse(localStorage.getItem("shippingAddress"))
//   : {};

// const initialState = {
  // cart: {
  //   cartItems: cartItemsFromStorage,
  //   shippingAddress: shippingAddressFromStorage,
  // },
  // userLogin: { userInfo: userInfoFromStorage },
// };

export default configureStore({
  reducer: {
    productList: productListReducer,
    productDetails: productDetailsReducer,
    productDelete: productDeleteReducer,
    productCreate: productCreateReducer,
    productUpdate: productUpdateReducer,
    productCreateReview: productCreateReviewReducer,
    productTopRated: productTopRatedReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderDeliver: orderDeliverReducer,
    orderListMy: orderListMyReducer,
    orderList: orderListReducer,
  }
  // preloadedState: initialState,
});
