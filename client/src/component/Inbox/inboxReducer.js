import { FETCH_ALL_CLIENTS_DETAILS, FETCH_ALL_CLIENTS_LAST_MESSAGE, FETCH_ALL_CLIENTS_LIST, UPDATE_ALL_CLIENTS_LIST, UPDATE_CLIENT_DETAILS, UPDATE_CLIENT_LAST_MESSAGE, FETCH_ALL_CHATS_WITH_CLIENT, UPDATE_ALL_CHATS_WITH_CLIENT } from "./inboxConstant";

export const INBOX_DETAILS_INITIAL_STATE = {
    listOfAllClients: null,
    allClientsDetails: null,
    allClientUserLastMessage: null,
    inboxMessages: null,
}

export const inboxReducer = (state, action) => {
    switch (action.type) {
        case UPDATE_ALL_CLIENTS_LIST:
            return {
                ...state,
                listOfAllClients: action.payload
            }
        case UPDATE_CLIENT_DETAILS: {
            return {
                ...state,
                allClientsDetails: action.payload
            }
        }
        case UPDATE_CLIENT_LAST_MESSAGE: {
            return {
                ...state,
                allClientUserLastMessage: action.payload,
            }
        }
        case FETCH_ALL_CLIENTS_LIST: {
            return {
                ...state,
                listOfAllClients: action.payload,
            }
        }
        case FETCH_ALL_CLIENTS_LAST_MESSAGE: {
            return {
                ...state,
                allClientUserLastMessage: action.payload,
            }
        }
        case FETCH_ALL_CLIENTS_DETAILS: {
            return {
                ...state,
                allClientsDetails: action.payload,
            }
        }
        case FETCH_ALL_CHATS_WITH_CLIENT: {
            // console.log(action.payload);
            return {
                ...state,
                inboxMessages: action.payload,
            }
        }
        case UPDATE_ALL_CHATS_WITH_CLIENT: {
            return {
                ...state,
                inboxMessages: action.payload,
            }
        }
        default:
            return state;
    }
};