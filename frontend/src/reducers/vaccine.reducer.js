import {
  VACCINE_LIST_REQUEST,
  VACCINE_LIST_SUCCESS,
  VACCINE_LIST_FAIL,
  VACCINE_DETAIL_REQUEST,
  VACCINE_DETAIL_SUCCESS,
  VACCINE_DETAIL_FAIL,
  SINGLE_PRODUCT_DELETE_REQUEST,
  SINGLE_PRODUCT_DELETE_SUCCESS,
  SINGLE_PRODUCT_DELETE_FAIL
} from '../constants/vaccine.constant';

const initialState = {
  loading: false,
  vaccines: [],
  error: null
};

export const vaccineListReducer = (state = initialState, action) => {
  switch (action.type) {
    case VACCINE_LIST_REQUEST:
      return { ...state, loading: true };
    case VACCINE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        vaccines: action.payload.rows,
        totalItem: action.payload.count
      };
    case VACCINE_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const vaccineDetailReducer = (state = {}, action) => {
  switch (action.type) {
    case VACCINE_DETAIL_REQUEST:
      return { ...state, loading: true };
    case VACCINE_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        vaccine: action.payload
      };
    case VACCINE_DETAIL_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const vaccineSingleDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case SINGLE_PRODUCT_DELETE_REQUEST:
      return { loading: true };
    case SINGLE_PRODUCT_DELETE_SUCCESS:
      return {
        loading: false,
        success: true
      };
    case SINGLE_PRODUCT_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
