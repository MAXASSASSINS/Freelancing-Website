import axios from "axios";
import {
  ALL_ORDER_REQUEST,
  ALL_ORDER_SUCCESS,
  ALL_ORDER_FAIL,
  USER_ORDERS_REQUEST,
  USER_ORDERS_SUCCESS,
  USER_ORDERS_FAIL,
  ORDER_DETAIL_REQUEST,
  ORDER_DETAIL_SUCCESS,
  ORDER_DETAIL_FAIL,
  UPDATE_ORDER_DETAIL_REQUEST,
  UPDATE_ORDER_DETAIL_SUCCESS,
  UPDATE_ORDER_DETAIL_FAIL,
  UPDATE_ALL_ORDERS_REQUEST,
  UPDATE_ALL_ORDERS_SUCCESS,
  UPDATE_ALL_ORDERS_FAIL,
  CLEAR_ERRORS,
} from "../constants/orderConstants";

export const getAllOrder = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_ORDER_REQUEST });
    const { data } = await axios.get("/order/orders");

    dispatch({
      type: ALL_ORDER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_ORDER_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getUserOrders = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_ORDERS_REQUEST });

    const { data } = await axios.get(`/order/orders/user/${id}`);

    dispatch({
      type: USER_ORDERS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_ORDERS_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getOrderDetail = (id) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_DETAIL_REQUEST });

    const { data } = await axios.get(`/order/details/${id}`);

    dispatch({
      type: ORDER_DETAIL_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_DETAIL_FAIL,
      payload: error.response.data,
    });
  }
};

export const updateOrderDetail = (data) => async (dispatch) => {
  dispatch({ type: UPDATE_ORDER_DETAIL_REQUEST });

  dispatch({
    type: UPDATE_ORDER_DETAIL_SUCCESS,
    payload: data,
  });
};

export const updateAllOrders = (data) => async (dispatch) => {
  dispatch({
    type: UPDATE_ALL_ORDERS_SUCCESS,
    payload: data,
  });
};

export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
