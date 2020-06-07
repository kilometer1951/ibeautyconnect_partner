import {
  LIVE_REQUEST_STATUS,
  IMAGES_DATA,
  HANDLE_LOAD_MORE_PHOTOS,
  REFRESH_PHOTOS,
  VIDEOS_DATA,
  REVIEWS,
  HANDLE_LOAD_MORE_REVIEWS,
  GET_EARNINGS,
  EXPAND_WEEKLY_ACTIVITY,
  DAILY_APPOITMENTS,
  CONFIRM_NO_SHOW,
  GET_ALL_ACTIVITIES,
  HANDLE_LOAD_MORE_ALLACTIVITY,
  EXPAND_ALL_ACTIVITY_ITEM,
  RESCHEDULE_DATA,
  QUERY_APPOITMENTS,
  HANDLE_LOAD_MORE_APPOITMENTS,
  MESSAGES,
  LOAD_SUPPORT_MESSAGES,
  CANCELLEDORDERS,
} from '../actions/appActions';
import {
  UPLOAD_IMAGES,
  UPLOAD_VIDEOS,
  DELETE_IMAGE,
  DELETE_VIDEO,
} from '../actions/galleryActions';
//import AsyncStorage from '@react-native-community/async-storage';

const initialState = {
  status: false,
  imagesData: [],
  videoData: [],
  reviews: [],
  earnings: {},
  expanded_weekly_activity: {},

  dailyAppoitments: [],
  allAppoitments: [],
  allactivities: [],
  expanded_all_activity_item: {},
  reScheduleData: {},

  messages: [],
  supportMessages: [],

  cancelledOrders: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LIVE_REQUEST_STATUS:
      //  console.log(action.status);
      return {
        ...state,
        status: action.status,
      };

    case RESCHEDULE_DATA:
      console.log(action.reScheduleData);
      return {
        ...state,
        reScheduleData: action.reScheduleData,
      };
    case IMAGES_DATA:
      return {
        ...state,
        imagesData: action.imagesData,
      };
    case HANDLE_LOAD_MORE_PHOTOS:
      return {
        ...state,
        imagesData: [...state.imagesData, ...action.imagesData],
      };
    case UPLOAD_IMAGES:
      //  console.log(action.image);
      return {
        ...state,
        imagesData: [...state.imagesData, action.image],
      };
    case VIDEOS_DATA:
      return {
        ...state,
        videoData: action.videoData,
      };
    case UPLOAD_VIDEOS:
      //  console.log(action.image);
      return {
        ...state,
        videoData: [...state.videoData, action.video],
      };
    case DELETE_IMAGE:
      const foundData = state.imagesData.filter(
        value => value._id !== action.imageId,
      );
      return {
        ...state,
        imagesData: foundData,
      };
    case DELETE_VIDEO:
      const newData = state.videoData.filter(
        value => value._id !== action.videoId,
      );
      return {
        ...state,
        videoData: newData,
      };

    case REVIEWS:
      return {
        ...state,
        reviews: action.reviews,
      };
    case HANDLE_LOAD_MORE_REVIEWS:
      return {
        ...state,
        reviews: [...state.reviews, ...action.reviews],
      };
    case GET_EARNINGS:
      return {
        ...state,
        earnings: action.earnings,
      };
    case EXPAND_WEEKLY_ACTIVITY:
      return {
        ...state,
        expanded_weekly_activity: action.expanded_weekly_activity,
      };
    case DAILY_APPOITMENTS:
      return {
        ...state,
        dailyAppoitments: action.dailyAppoitments,
      };
    case CONFIRM_NO_SHOW:
      const newAppoitment = state.dailyAppoitments.filter(
        value => value._id !== action.cartId,
      );
      return {
        ...state,
        dailyAppoitments: newAppoitment,
      };
    case GET_ALL_ACTIVITIES:
      return {
        ...state,
        allactivities: action.allactivities,
      };
    case HANDLE_LOAD_MORE_ALLACTIVITY:
      return {
        ...state,
        allactivities: [...state.allactivities, ...action.allactivities],
      };
    case EXPAND_ALL_ACTIVITY_ITEM:
      return {
        ...state,
        expanded_all_activity_item: action.expanded_all_activity_item,
      };
    case QUERY_APPOITMENTS:
      return {
        ...state,
        allAppoitments: action.allAppoitments,
      };
    case HANDLE_LOAD_MORE_APPOITMENTS:
      return {
        ...state,
        allAppoitments: [...state.allAppoitments, ...action.allAppoitments],
      };
    case MESSAGES:
      return {
        ...state,
        messages: action.messages,
      };

    case LOAD_SUPPORT_MESSAGES:
      return {
        ...state,
        supportMessages: action.allSupportMessages,
      };
    case CANCELLEDORDERS:
      return {
        ...state,
        cancelledOrders: action.cancelledOrders,
      };

    default:
      return state;
  }
  return state;
};
