import {
  VACCINE_LIST_REQUEST,
  VACCINE_LIST_SUCCESS,
  VACCINE_LIST_FAIL,
  SINGLE_PRODUCT_DELETE_REQUEST,
  SINGLE_PRODUCT_DELETE_SUCCESS,
  SINGLE_PRODUCT_DELETE_FAIL,
  MULTI_PRODUCT_DELETE_REQUEST,
  MULTI_PRODUCT_DELETE_SUCCESS,
  MULTI_PRODUCT_DELETE_FAIL,
  VACCINE_CREATE_REQUEST,
  VACCINE_CREATE_SUCCESS,
  VACCINE_CREATE_FAIL,
  VACCINE_EDIT_REQUEST,
  VACCINE_EDIT_SUCCESS,
  VACCINE_EDIT_FAIL,
  VACCINE_REQUEST,
  VACCINE_SUCCESS,
  VACCINE_FAIL
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

export const vaccineReducer = (state = {}, action) => {
  switch (action.type) {
    case VACCINE_REQUEST:
      return { loading: true };
    case VACCINE_SUCCESS:
      return {
        loading: false,
        vaccine: action.payload.vaccine
      };
    case VACCINE_FAIL:
      return { loading: false, error: action.payload };
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
        singleDeleteSuccess: true
      };
    case SINGLE_PRODUCT_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const vaccineMultiDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case MULTI_PRODUCT_DELETE_REQUEST:
      return { loading: true };
    case MULTI_PRODUCT_DELETE_SUCCESS:
      return {
        loading: false,
        multiDeleteSuccess: true
      };
    case MULTI_PRODUCT_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const vaccineCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case VACCINE_CREATE_REQUEST:
      return { loading: true };
    case VACCINE_CREATE_SUCCESS:
      return {
        loading: false,
        createSuccess: true
      };
    case VACCINE_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const vaccineEditReducer = (state = {}, action) => {
  switch (action.type) {
    case VACCINE_EDIT_REQUEST:
      return { loading: true };
    case VACCINE_EDIT_SUCCESS:
      return {
        loading: false,
        editSuccess: true
      };
    case VACCINE_EDIT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
