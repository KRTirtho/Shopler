import {
  FETCHED_PRODUCTS,
  FETCHING_PRODUCTS,
  ERROR_GET_PRODUCTS,
  PAGINATING,
  HAS_NO_MORE_DATA,
  ERROR_FETCHING_SINGLE_PRODUCT,
  FETCHING_SINGLE_PRODUCT,
  FETCHED_SINGLE_PRODUCT,
  FETCHING_QUERY_PRODUCT,
  FETCHED_QUERY_PRODUCT,
  ERROR_FETCHING_QUERY_PRODUCT,
  NO_QUERY_PRODUCT_FOUND,
  CLEAR_PRODUCT_CACHE,
  CLEAR_SINGLE_PRODUCT_CACHE,
} from "../actions/productActions";

const initialState = {
  products: [],
  paginating: false,
  single_product: [],
  single_product_loading: true,
  single_product_error: false,
  loading: true,
  error: false,
  hasMoreProduct: true,
  query_product: [],
  query_product_loading: true,
  query_product_error: false,
  no_query_product: false
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCHING_PRODUCTS:
      return {
        ...state,
        loading: true,
      };
    case FETCHED_PRODUCTS:
      return {
        ...state,
        products: state.paginating? [...state.products,  ...action.payload]: action.payload,
        hasMoreProduct: true,
        loading: false,
        error: false,
      };

    case PAGINATING:
      return {
        ...state,
        paginating: action.payload
      }
    case ERROR_GET_PRODUCTS:
      return {
        ...state,
        loading: false,
      };
    case HAS_NO_MORE_DATA:
      return {
        ...state,
        products: state.products,
        loading: false,
        error: false,
        hasMoreProduct: false
      }
      case FETCHING_SINGLE_PRODUCT:
        return {
          ...state,
          single_product_loading: true,
          single_product_error: false,
        };
      case FETCHED_SINGLE_PRODUCT:
        return {
          ...state,
          single_product: action.payload,
          single_product_loading: false,
          single_product_error: false,
        };
      case ERROR_FETCHING_SINGLE_PRODUCT:
        return {
          ...state,
          single_product_loading: false,
        };
        
        case FETCHING_QUERY_PRODUCT:
          return {
            ...state,
            query_product_loading: true,
            query_product_error: false,
            no_query_product: true
          };
        case FETCHED_QUERY_PRODUCT:
          return {
            ...state,
            query_product: action.payload,
            query_product_loading: false,
            query_product_error: false,
            no_query_product: false
          };
        case ERROR_FETCHING_QUERY_PRODUCT:
          return {
            ...state,
            query_product_loading: false,
            query_product_error: true,
            no_query_product: false
          };
        case NO_QUERY_PRODUCT_FOUND:
          return{
            ...state,
            query_product: [],
            query_product_error: false,
            query_product_loading: false,
            no_query_product: true
          }
        case CLEAR_PRODUCT_CACHE:
          return {
            ...state,
            loading: true,
            error: false,
          }
        case CLEAR_SINGLE_PRODUCT_CACHE:
          return{
            ...state,
            single_product: [],
            single_product_loading: true,
            single_product_error: false,
          }
    default:
      return state;
  }
};

export default productReducer;
