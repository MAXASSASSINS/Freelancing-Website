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
    UPDATE_ALL_ORDERS_REQUEST,
    UPDATE_ALL_ORDERS_SUCCESS,
    UPDATE_ALL_ORDERS_FAIL,
    CLEAR_ERRORS
} from '../constants/orderConstants'

export const orderReducer = ((state = { orders: null }, action) => {
    switch (action.type) {
        case ALL_ORDER_REQUEST:
        case UPDATE_ALL_ORDERS_REQUEST:
            return {
                loading: true,
                orders: null,
            };
        case ALL_ORDER_SUCCESS:
            return {
                loading: false,
                orders: action.payload.orders,
                ordersCount: action.payload.ordersCount,
            };
        case ALL_ORDER_FAIL:
        case UPDATE_ALL_ORDERS_FAIL:
            return {
                loading: false,
                error: action.payload
            };

        case UPDATE_ALL_ORDERS_SUCCESS:
            return{
                ...state,
                loading: false,
                orders: action.payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
});


export const userOrdersDetailsReducer = ((state = { userOrders: [] }, action) => {
    switch (action.type) {
        case USER_ORDERS_REQUEST:
            return {
                loading: true,
                userOrders: null,
            };
        case USER_ORDERS_SUCCESS:
            return {
                loading: false,
                userOrders: action.payload.userOrders,
            };
        case USER_ORDERS_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
});

export const orderDetailReducer = ((state = { orderDetail: null }, action) => {
    switch (action.type) {
        case ORDER_DETAIL_REQUEST:
            return {
                loading: true,
                orderDetail: null,
            };
        case ORDER_DETAIL_SUCCESS:
            return {
                loading: false,
                orderDetail: action.payload.order,
            };
        case ORDER_DETAIL_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
});