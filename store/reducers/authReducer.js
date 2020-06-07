import {
  USER,
  SERVICES,
  DELETE_SERVICES,
  UPDATE_LOCATION,
  PROFILE_PHOTO_DATA,
  LICENSE_PHOTO_DATA,
  PHOTO_ID_FRONT_DATA,
  PHOTO_ID_BACK_DATA,
  EDIT_PROFILE_PHOTO,
} from '../actions/authAction';
import AsyncStorage from '@react-native-community/async-storage';

const initialState = {
  user: {},
  services: [],
  profile_photo_data: {},
  license_photo_data: {},
  photo_id_front_data: {},
  photo_id_back_data: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case USER:
      return {
        ...state,
        user: action.user,
      };
    case SERVICES:
      return {
        ...state,
        services: action.services,
      };
    case DELETE_SERVICES:
      const foundData = state.services.filter(
        (value) => value._id !== action.serviceId,
      );
      return {
        ...state,
        services: foundData,
      };
    case UPDATE_LOCATION:
      const val = Object.assign(state.user.user, {
        address: action.address,
        locationCity: action.locationCity,
        locationState: action.locationState,
        postal_code: action.postalCode,
      });
      return {
        ...state,
      };
    case PROFILE_PHOTO_DATA:
      return {
        ...state,
        profile_photo_data: action.profile_photo_data,
      };
    case LICENSE_PHOTO_DATA:
      return {
        ...state,
        license_photo_data: action.license_photo_data,
      };
    case PHOTO_ID_FRONT_DATA:
      return {
        ...state,
        photo_id_front_data: action.photo_id_front_data,
      };
    case PHOTO_ID_BACK_DATA:
      return {
        ...state,
        photo_id_back_data: action.photo_id_back_data,
      };
    case EDIT_PROFILE_PHOTO:
      Object.assign(state.user.user, {
        profilePhoto: action.edited_photo,
      });
      return {
        ...state,
      };
    default:
      return state;
  }
  return state;
};
