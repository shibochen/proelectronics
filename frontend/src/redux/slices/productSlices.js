import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "./userSlices";

const productListSlice = createSlice({
  name: "productList",
  initialState: {
    products: [],
  },
  reducers: {
    PRODUCT_LIST_REQUEST: (state) => {
      state.loading = true;
    },
    PRODUCT_LIST_SUCCESS: (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
      state.pages = action.payload.pages;
      state.page = action.payload.page;
    },
    PRODUCT_LIST_FAIL: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const listProducts =
  (keyword = "", pageNumber = "") =>
  async (dispatch) => {
    try {
      dispatch(PRODUCT_LIST_REQUEST());
      const { data } = await axios.get(
        `/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
      );
      dispatch(PRODUCT_LIST_SUCCESS(data));
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch(PRODUCT_LIST_FAIL(message));
    }
  };

export const { PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS, PRODUCT_LIST_FAIL } =
  productListSlice.actions;
export const productListReducer = productListSlice.reducer;

const productDetailsSlice = createSlice({
  name: "productDetails",
  initialState: {
    product: {
      reviews: [],
    },
  },
  reducers: {
    PRODUCT_DETAILS_REQUEST: (state) => {
      state.loading = true;
    },
    PRODUCT_DETAILS_SUCCESS: (state, action) => {
      state.loading = false;
      state.product = action.payload;
    },
    PRODUCT_DETAILS_FAIL: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch(PRODUCT_DETAILS_REQUEST());

    const { data } = await axios.get(`/api/products/${id}`);

    dispatch(PRODUCT_DETAILS_SUCCESS(data));
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch(PRODUCT_DETAILS_FAIL(message));
  }
};

export const {
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
} = productDetailsSlice.actions;

export const productDetailsReducer = productDetailsSlice.reducer;

const productDeleteSlice = createSlice({
  name: "productDelete",
  initialState: {},
  reducers: {
    PRODUCT_DELETE_REQUEST: (state) => {
      state.loading = true;
    },
    PRODUCT_DELETE_SUCCESS: (state) => {
      state.loading = false;
      state.success = true;
    },
    PRODUCT_DELETE_FAIL: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch(PRODUCT_DELETE_REQUEST());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/products/${id}`, config);

    dispatch(PRODUCT_DELETE_SUCCESS());
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch(PRODUCT_DELETE_FAIL(message));
  }
};

export const {
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
} = productDeleteSlice.actions;

export const productDeleteReducer = productDeleteSlice.reducer;

const productCreateSlice = createSlice({
  name: "productCreate",
  initialState: {},
  reducers: {
    PRODUCT_CREATE_REQUEST: (state) => {
      state.loading = true;
    },
    PRODUCT_CREATE_SUCCESS: (state, action) => {
      state.loading = false;
      state.success = true;
      state.product = action.payload;
    },
    PRODUCT_CREATE_FAIL: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    PRODUCT_CREATE_RESET: () => {
      return {};
    },
  },
});

export const createProduct = () => async (dispatch, getState) => {
  try {
    dispatch(PRODUCT_CREATE_REQUEST());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/products`, {}, config);

    dispatch(PRODUCT_CREATE_SUCCESS(data));
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch(PRODUCT_CREATE_FAIL(message));
  }
};

export const {
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_RESET,
} = productCreateSlice.actions;

export const productCreateReducer = productCreateSlice.reducer;

const productUpdateSlice = createSlice({
  name: "productUpdate",
  initialState: {
    product: {},
  },
  reducers: {
    PRODUCT_UPDATE_REQUEST: (state) => {
      state.loading = true;
    },
    PRODUCT_UPDATE_SUCCESS: (state, action) => {
      state.loading = false;
      state.success = true;
      state.product = action.payload;
    },
    PRODUCT_UPDATE_FAIL: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    PRODUCT_UPDATE_RESET: () => {
      return { product: {} };
    },
  },
});

export const updateProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch(PRODUCT_UPDATE_REQUEST());

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
      `/api/products/${product._id}`,
      product,
      config
    );

    dispatch(PRODUCT_UPDATE_SUCCESS(data));
    dispatch(PRODUCT_DETAILS_SUCCESS(data));
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch(PRODUCT_UPDATE_FAIL(message));
  }
};

export const {
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_RESET,
} = productUpdateSlice.actions;
export const productUpdateReducer = productUpdateSlice.reducer;

const productReviewCreateSlice = createSlice({
  name: "productReviewCreate",
  initialState: {},
  reducers: {
    PRODUCT_CREATE_REVIEW_REQUEST: (state) => {
      state.loading = true;
    },
    PRODUCT_CREATE_REVIEW_SUCCESS: (state) => {
      state.loading = false;
      state.success = true;
    },
    PRODUCT_CREATE_REVIEW_FAIL: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    PRODUCT_CREATE_REVIEW_RESET: () => {
      return {};
    },
  },
});

export const createProductReview =
  (productId, review) => async (dispatch, getState) => {
    try {
      dispatch(PRODUCT_CREATE_REVIEW_REQUEST());

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(`/api/products/${productId}/reviews`, review, config);

      dispatch(PRODUCT_CREATE_REVIEW_SUCCESS());
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === "Not authorized, token failed") {
        dispatch(logout());
      }
      dispatch(PRODUCT_CREATE_REVIEW_FAIL(message));
    }
  };

export const {
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL,
  PRODUCT_CREATE_REVIEW_RESET,
} = productReviewCreateSlice.actions;

export const productCreateReviewReducer = productReviewCreateSlice.reducer;

const productTopRatedSlice = createSlice({
  name: "productTopRated",
  initialState: {
    products: [],
  },
  reducers: {
    PRODUCT_TOP_REQUEST: (state) => {
      state.loading = true;
      state.products = [];
    },
    PRODUCT_TOP_SUCCESS: (state, action) => {
      state.loading = false;
      state.products = action.payload;
    },
    PRODUCT_TOP_FAIL: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const listTopProducts = () => async (dispatch) => {
  try {
    dispatch(PRODUCT_TOP_REQUEST());

    const { data } = await axios.get(`/api/products/top`);

    dispatch(PRODUCT_TOP_SUCCESS(data));
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch(PRODUCT_TOP_FAIL(message));
  }
};

export const { PRODUCT_TOP_REQUEST, PRODUCT_TOP_SUCCESS, PRODUCT_TOP_FAIL } =
  productTopRatedSlice.actions;
export const productTopRatedReducer = productTopRatedSlice.reducer;
