import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { CART_CLEAR_ITEMS } from "./cartSlices";
import { logout } from "./userSlices";

const orderCreateSlice = createSlice({
  name: "orderCreate",
  initialState: {},
  reducers: {
    ORDER_CREATE_REQUEST: (state) => {
      state.loading = true;
    },
    ORDER_CREATE_SUCCESS: (state, action) => {
      state.loading = false;
      state.success = true;
      state.order = action.payload;
    },
    ORDER_CREATE_FAIL: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    ORDER_CREATE_RESET: () => {
      return {};
    },
  },
});

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch(ORDER_CREATE_REQUEST());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/orders`, order, config);

    dispatch(ORDER_CREATE_SUCCESS(data));
    dispatch(CART_CLEAR_ITEMS());
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch(ORDER_CREATE_FAIL(message));
  }
};

export const {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_RESET,
} = orderCreateSlice.actions;

export const orderCreateReducer = orderCreateSlice.reducer;

const orderDetailsSlice = createSlice({
  name: "orderDetails",
  initialState: {
    loading: true,
    orderItems: [],
    shippingAddress: {},
  },
  reducers: {
    ORDER_DETAILS_REQUEST: (state) => {
      state.loading = true;
    },
    ORDER_DETAILS_SUCCESS: (state, action) => {
      state.loading = false;
      state.order = action.payload;
    },
    ORDER_DETAILS_FAIL: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch(ORDER_DETAILS_REQUEST());
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/orders/${id}`, config);

    dispatch(ORDER_DETAILS_SUCCESS(data));
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch(ORDER_DETAILS_FAIL(message));
  }
};

export const {
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
} = orderDetailsSlice.actions;

export const orderDetailsReducer = orderDetailsSlice.reducer;

const orderPaySlice = createSlice({
  name: "orderPay",
  initialState: {},
  reducers: {
    ORDER_PAY_REQUEST: (state) => {
      state.loading = true;
    },
    ORDER_PAY_SUCCESS: (state) => {
      state.loading = false;
      state.success = true;
    },
    ORDER_PAY_FAIL: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    ORDER_PAY_RESET: () => {
      return {};
    },
  },
});

export const payOrder =
  (orderId, paymentResult) => async (dispatch, getState) => {
    try {
      dispatch(ORDER_PAY_REQUEST());

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/orders/${orderId}/pay`,
        paymentResult,
        config
      );

      dispatch(ORDER_PAY_SUCCESS(data));
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === "Not authorized, token failed") {
        dispatch(logout());
      }
      dispatch(ORDER_PAY_FAIL(message));
    }
  };

export const {
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_RESET,
} = orderPaySlice.actions;

export const orderPayReducer = orderPaySlice.reducer;

const orderListMySlice = createSlice({
  name: "orderListMy",
  initialState: {
    orders: [],
  },
  reducers: {
    ORDER_LIST_MY_REQUEST: (state) => {
      state.loading = true;
    },
    ORDER_LIST_MY_SUCCESS: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    ORDER_LIST_MY_FAIL: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    ORDER_LIST_MY_RESET: () => {
      return { orders: [] };
    },
  },
});

export const listMyOrders = () => async (dispatch, getState) => {
  try {
    dispatch(ORDER_LIST_MY_REQUEST());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/orders/myorders`, config);

    dispatch(ORDER_LIST_MY_SUCCESS(data));
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout())
    }
    dispatch(ORDER_LIST_MY_FAIL(message));
  }
};

export const {
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_MY_RESET,
} = orderListMySlice.actions;

export const orderListMyReducer = orderListMySlice.reducer;

const orderDeliverSlice = createSlice({
  name: "orderDeliver",
  initialState: {},
  reducers: {
    ORDER_DELIVER_REQUEST: (state) => {
      state.loading = true;
    },
    ORDER_DELIVER_SUCCESS: (state) => {
      state.loading = false;
      state.success = true;
    },
    ORDER_DELIVER_FAIL: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    ORDER_DELIVER_RESET: () => {
      return {};
    },
  },
});

export const deliverOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch(ORDER_DELIVER_REQUEST());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(
      `/api/orders/${order._id}/deliver`,
      {},
      config
    );

    dispatch(ORDER_DELIVER_SUCCESS(data));
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch(ORDER_DELIVER_FAIL(message));
  }
};

export const {
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DELIVER_FAIL,
  ORDER_DELIVER_RESET,
} = orderDeliverSlice.actions;

export const orderDeliverReducer = orderDeliverSlice.reducer;

const orderListSlice = createSlice({
  name: "orderList",
  initialState: {
    orders: [],
  },
  reducers: {
    ORDER_LIST_REQUEST: (state) => {
      state.loading = true;
    },
    ORDER_LIST_SUCCESS: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    ORDER_LIST_FAIL: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const listOrders = () => async (dispatch, getState) => {
  try {
    dispatch(ORDER_LIST_MY_REQUEST());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/orders`, config);

    dispatch(ORDER_LIST_SUCCESS(data));
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch(ORDER_LIST_FAIL(message));
  }
};

export const { ORDER_LIST_REQUEST, ORDER_LIST_SUCCESS, ORDER_LIST_FAIL } =
  orderListSlice.actions;
export const orderListReducer = orderListSlice.reducer;
