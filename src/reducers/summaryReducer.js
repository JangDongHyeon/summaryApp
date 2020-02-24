import {
    SUMMARY_REQUEST,
    SUMMARY_ERROR,
    REMOVE_ERROR
} from "../actions/types";

const INTIAL_STATE = {
    summary: null,
    error: null
};

export default (state = INTIAL_STATE, action) => {
    switch (action.type) {
        case SUMMARY_REQUEST:
            return {
                ...state, summary: action.payload, error: null
            };
        case SUMMARY_ERROR:
            return {
                ...state, summary: null, error: action.payload
            };
        case REMOVE_ERROR:
            return {
                ...state, summary: null, error: null
            }
            default:
                return state;
    }
};