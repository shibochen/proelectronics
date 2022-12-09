import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ORDER_LIST_MY_RESET } from "../slices/orderSlices";
import { CART_CLEAR_ITEMS } from "../slices/cartSlices";

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const userLoginSlice = createSlice({
  name: "userLogin",
  initialState: { userInfo: userInfoFromStorage },
  reducers: {
    USER_LOGIN_REQUEST: (state) => {
      state.loading = true;
    },
    USER_LOGIN_SUCCESS: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
    },
    USER_LOGIN_FAIL: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    USER_LOGOUT: () => {
      //这里再考虑下  要不要写 state.userInfo = null 还是继续这样写
      return {};
    },
  },
});

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(USER_LOGIN_REQUEST());
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/users/login",
      { email, password },
      config
    );

    dispatch(USER_LOGIN_SUCCESS(data));

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch(USER_LOGIN_FAIL(message));
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("cartItems");
  localStorage.removeItem("shippingAddress");
  localStorage.removeItem("paymentMethod");
  localStorage.removeItem("__paypal_storage__");
  dispatch(USER_LOGOUT());
  dispatch(USER_REGISTER_LOGOUT());
  dispatch(USER_DETAILS_RESET());
  dispatch(ORDER_LIST_MY_RESET());
  dispatch(USER_LIST_RESET());
  dispatch(CART_CLEAR_ITEMS());
};

export const {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
} = userLoginSlice.actions;

export const userLoginReducer = userLoginSlice.reducer;

const userRegisterSlice = createSlice({
  name: "userRegister",
  initialState: {},
  reducers: {
    USER_REGISTER_REQUEST: (state) => {
      state.loading = true;
    },
    USER_REGISTER_SUCCESS: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
    },
    USER_REGISTER_FAIL: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    USER_REGISTER_LOGOUT: () => {
      return {};
    },
  },
});

export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch(USER_REGISTER_REQUEST());

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/users/register",
      { name, email, password },
      config
    );

    dispatch(USER_REGISTER_SUCCESS(data));

    dispatch(USER_LOGIN_SUCCESS(data));

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch(USER_REGISTER_FAIL(message));
  }
};

export const {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_REGISTER_LOGOUT,
} = userRegisterSlice.actions;

export const userRegisterReducer = userRegisterSlice.reducer;

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState: {
    user: {},
  },
  reducers: {
    USER_DETAILS_REQUEST: (state) => {
      state.loading = true;
    },
    USER_DETAILS_SUCCESS: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    USER_DETAILS_FAIL: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    USER_DETAILS_RESET: (state) => {
      return {
        user: {},
      };
    },
  },
});

export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch(USER_DETAILS_REQUEST());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/users/${id}`, config);

    dispatch(USER_DETAILS_SUCCESS(data));
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch(USER_DETAILS_FAIL(message));
  }
};

export const {
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_RESET,
} = userDetailsSlice.actions;

export const userDetailsReducer = userDetailsSlice.reducer;

const userUpdateProfileSlice = createSlice({
  name: "userUpdateProfile",
  initialState: {},
  reducers: {
    USER_UPDATE_PROFILE_REQUEST: (state) => {
      state.loading = true;
    },
    USER_UPDATE_PROFILE_SUCCESS: (state, action) => {
      state.loading = false;
      state.success = true;
      state.userInfo = action.payload;
    },
    USER_UPDATE_PROFILE_FAIL: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    USER_UPDATE_PROFILE_RESET: () => {
      return {};
    },
  },
});

export const updataUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch(USER_UPDATE_PROFILE_REQUEST());

    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put("/api/users/profile", user, config);

    dispatch(USER_UPDATE_PROFILE_SUCCESS(data));
    dispatch(USER_LOGIN_SUCCESS(data));
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch(USER_UPDATE_PROFILE_FAIL());
  }
};

export const {
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_RESET,
} = userUpdateProfileSlice.actions;

export const userUpdateProfileReducer = userUpdateProfileSlice.reducer;

const userListSlice = createSlice({
  name: "userList",
  initialState: {
    users: [],
  },
  reducers: {
    USER_LIST_REQUEST: (state) => {
      state.loading = true;
    },
    USER_LIST_SUCCESS: (state, action) => {
      state.loading = false;
      state.users = action.payload;
    },
    USER_LIST_FAIL: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    USER_LIST_RESET: () => {
      return { users: [] };
    },
  },
});

export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch(USER_LIST_REQUEST());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/users`, config);

    dispatch(USER_LIST_SUCCESS(data));
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch(USER_LIST_FAIL(message));
  }
};

export const {
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
} = userListSlice.actions;

export const userListReducer = userListSlice.reducer;

const userDeleteSlice = createSlice({
  name: "userDelete",
  initialState: {},
  reducers: {
    USER_DELETE_REQUEST: (state) => {
      state.loading = true;
    },
    USER_DELETE_SUCCESS: (state) => {
      state.loading = false;
      state.success = true;
    },
    USER_DELETE_FAIL: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch(USER_DELETE_REQUEST());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/users/${id}`, config);

    dispatch(USER_DELETE_SUCCESS());
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch(USER_DELETE_FAIL(message));
  }
};
export const { USER_DELETE_REQUEST, USER_DELETE_SUCCESS, USER_DELETE_FAIL } =
  userDeleteSlice.actions;
export const userDeleteReducer = userDeleteSlice.reducer;

const userUpdateSlice = createSlice({
  name: "userUpdate",
  initialState: {
    user: {},
  },
  reducers: {
    USER_UPDATE_REQUEST: (state) => {
      state.loading = true;
    },
    USER_UPDATE_SUCCESS: (state) => {
      state.loading = false;
      state.success = true;
    },
    USER_UPDATE_FAIL: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    USER_UPDATE_RESET: () => {
      return { user: {} };
    },
  },
});

export const updateUser = (user) => async (dispatch, getState) => {
  try {
    dispatch(USER_UPDATE_REQUEST());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(`/api/users/${user._id}`, user, config);

    dispatch(USER_UPDATE_SUCCESS());

    dispatch(USER_DETAILS_SUCCESS(data));

    dispatch(USER_DETAILS_RESET());
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: USER_UPDATE_FAIL,
      payload: message,
    });
  }
};

export const {
  USER_UPDATE_SUCCESS,
  USER_UPDATE_REQUEST,
  USER_UPDATE_FAIL,
  USER_UPDATE_RESET,
} = userUpdateSlice.actions;
export const userUpdateReducer = userUpdateSlice.reducer;
