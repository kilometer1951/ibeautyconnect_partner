import AsyncStorage from '@react-native-community/async-storage';
import {URL} from '../../socketURL';

export const USER = 'USER';
export const SERVICES = 'SERVICESS';
export const DELETE_SERVICES = 'DELETE_SERVICES';
export const UPDATE_LOCATION = 'UPDATE_LOCATION';

export const PROFILE_PHOTO_DATA = 'PROFILE_PHOTO_DATA';

export const LICENSE_PHOTO_DATA = 'LICENSE_PHOTO_DATA';

export const PHOTO_ID_FRONT_DATA = 'PHOTO_ID_FRONT_DATA';
export const PHOTO_ID_BACK_DATA = 'PHOTO_ID_BACK_DATA';

//https://hidden-lowlands-41526.herokuapp.com
//http://localhost:5002

export const EDIT_PROFILE_PHOTO = 'EDIT_PROFILE_PHOTO';

export const editPhoto = (photo, partnerId, uri_of_photo) => {
  return async dispatch => {
    let formData = new FormData();
    formData.append('photo', photo);
    const response = await fetch(`${URL}/api/edit_partner_photo/${partnerId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    dispatch({type: EDIT_PROFILE_PHOTO, edited_photo: uri_of_photo});
  };
};

export const verifiyPhoneNumber = async phone => {
  //  return async dispatch => {
  const response = await fetch(`${URL}/auth/verification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const verifiyPhoneNumberForgotPassword = async phone => {
  //  return async dispatch => {
  const response = await fetch(
    `${URL}/auth/verification_phone_forgot_password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone,
      }),
    },
  );
  const resData = await response.json();
  return resData;
};

export const verifyLicenseNumber = async (licenseNumber, phoneNumber) => {
  //  return async dispatch => {
  const response = await fetch(`${URL}/auth/verify_license_number`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      licenseNumber,
      phoneNumber,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const createAcctount = async (fName, lName, phone, email, password) => {
  const response = await fetch(`${URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fName,
      lName,
      phone,
      email,
      password,
    }),
  });
  console.log(fName, lName, phone, email, password);
  const resData = await response.json();

  return resData;
};

export const getUser = userData => {
  return async dispatch => {
    const data = await JSON.parse(userData);
    dispatch({type: USER, user: data});
  };
};

export const authUser = user => {
  return async dispatch => {
    const data = {user: user};
    dispatch({type: USER, user: data});
  };
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const resData = await response.json();
  return resData;
};

export const getAuthUser = async userId => {
  const respond = await fetch(`${URL}/auth/userIsActive/${userId}`);
  const resData = await respond.json();
  return resData;
};

export const getProfessions = async () => {
  const response = await fetch(`${URL}/api/profession`);
  const resData = await response.json();
  return resData;
};

export const serviceGender = async (service_gender, userId) => {
  const response = await fetch(`${URL}/auth/service_gender/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      service_gender,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const userLocation = async (
  locationState,
  locationCity,
  address,
  postalCode,
  userId,
  locationLat,
  locationLng,
) => {
  const response = await fetch(`${URL}/auth/user_location/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      locationState,
      locationCity,
      address,
      postalCode,
      userId,
      locationLat,
      locationLng,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const updateLocation = (
  locationState,
  locationCity,
  address,
  postalCode,
  userId,
  locationLat,
  locationLng,
) => {
  return async dispatch => {
    const response = await fetch(`${URL}/auth/user_location/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationState,
        locationCity,
        address,
        postalCode,
        userId,
        locationLat,
        locationLng,
      }),
    });

    dispatch({
      type: UPDATE_LOCATION,
      locationState: locationState,
      locationCity: locationCity,
      address: address,
      postalCode: postalCode,
      userId: userId,
    });
  };
};

export const userPhoto = async (profilePhoto, userId) => {
  let formData = new FormData();
  formData.append('profilePhoto', profilePhoto);
  const response = await fetch(`${URL}/auth/uploadProfilePhoto/${userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
  const resData = await response.json();
  return resData;
};

export const userProfession = async (profession, userId) => {
  const response = await fetch(`${URL}/auth/profession/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      profession,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const uploadLicense = async (licensePhoto, userId) => {
  let formData = new FormData();
  formData.append('licensePhoto', licensePhoto);
  const response = await fetch(`${URL}/auth/uploadLicense/${userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
  const resData = await response.json();
  return resData;
};

export const uploadDocuments = async (
  licenseNumber,
  ssnNumber,
  licenseExpirationDate,
  userId,
) => {
  const response = await fetch(`${URL}/auth/uploadDocuments/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      licenseNumber,
      ssnNumber,
      licenseExpirationDate,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const addService = (
  serviceName,
  serviceHour,
  servicePricePerHour,
  serviceDescription,
  userId,
) => {
  return async dispatch => {
    const response = await fetch(`${URL}/api/add/service/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serviceName,
        serviceHour,
        servicePricePerHour,
        serviceDescription,
      }),
    });
    const resData = await response.json();
    dispatch({type: SERVICES, services: resData.user.services});
  };
};

export const getServices = userId => {
  return async dispatch => {
    const response = await fetch(`${URL}/api/services/${userId}`);
    const resData = await response.json();
    dispatch({type: SERVICES, services: resData.data.services});
  };
};

export const updateService = (
  serviceName,
  serviceHour,
  servicePricePerHour,
  serviceDescription,
  userId,
  serviceId,
) => {
  return async dispatch => {
    const response = await fetch(
      `${URL}/api/edit/${userId}/service/${serviceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceName,
          serviceHour,
          servicePricePerHour,
          serviceDescription,
        }),
      },
    );

    const resData = await response.json();
    dispatch({type: SERVICES, services: resData.user.services});
  };
};

export const deleteServices = (userId, serviceId) => {
  return async dispatch => {
    fetch(`${URL}/api/delete/${userId}/service/${serviceId}`);
    dispatch({type: DELETE_SERVICES, serviceId: serviceId});
  };
};

export const updateBusinessAddress = async (
  userId,
  businessAddress,
  businessAddressLine1,
  businessCity,
  businessState,
  businessPostal,
) => {
  const response = await fetch(`${URL}/api/updateBusinessAddress/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      businessAddress,
      businessAddressLine1,
      businessCity,
      businessState,
      businessPostal,
    }),
  });
  const resData = await response.json();
  return resData;
};
export const updateComfortFee = async (userId, comfortFeeInput) => {
  const response = await fetch(`${URL}/api/updateComfortFee/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      comfortFeeInput,
    }),
  });
  const resData = await response.json();
  return resData;
};
export const uploadVideo = async (uploadVideo, userId) => {
  let formData = new FormData();
  formData.append('uploadVideo', uploadVideo);
  const response = await fetch(`${URL}/auth/uploadVideo/${userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
  const resData = await response.json();
  return resData;
};

export const deleteVideo = async cloudinaryImageId => {
  const response = await fetch(`${URL}/auth/deleteVideo/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      videoId: cloudinaryImageId,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const UpdateStripeAccount = async (userId, token, dob) => {
  const response = await fetch(`${URL}/auth/add_debit_card/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      token,
      dob,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const updateStripeAccountBankingInfo = async (
  userId,
  bankAccountToken,
) => {
  const response = await fetch(`${URL}/auth/add_bank_account_info/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      bankAccountToken,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const updateStripeAccountBankingInfo_Settings = async (
  userId,
  bankAccountToken,
) => {
  const response = await fetch(`${URL}/auth/add_bank_account_info_settings/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      bankAccountToken,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const uploadPhotoIdFront = async (photo_front, userId) => {
  let formData = new FormData();
  formData.append('photo_front', photo_front);
  const response = await fetch(`${URL}/auth/upload_photo_id_front/${userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
  const resData = await response.json();
  return resData;
};

export const uploadPhotoIdBack = async (photo_back, userId) => {
  let formData = new FormData();
  formData.append('photo_back', photo_back);
  const response = await fetch(`${URL}/auth/upload_photo_id_back/${userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
  const resData = await response.json();
  return resData;
};

export const uploadBestFive = async (fileName, partnerId, display) => {
  let formData = new FormData();
  formData.append('fileName', fileName);
  formData.append('display', display);
  const response = await fetch(`${URL}/api/upload_best_five/${partnerId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
  const resData = await response.json();
  return resData;
};

export const hasGoneThroughFinalScreen = async userId => {
  const response = await fetch(`${URL}/auth/hasGoneThroughFinalScreen/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const referenceProfilePhotoData = data => {
  return async dispatch => {
    dispatch({type: PROFILE_PHOTO_DATA, profile_photo_data: data});
  };
};

export const referenceLicensePhotoData = data => {
  return async dispatch => {
    dispatch({type: LICENSE_PHOTO_DATA, license_photo_data: data});
  };
};

export const referencePhotoIdFrontData = data => {
  return async dispatch => {
    dispatch({type: PHOTO_ID_FRONT_DATA, photo_id_front_data: data});
  };
};

export const referencePhotoIdBackData = data => {
  return async dispatch => {
    dispatch({type: PHOTO_ID_BACK_DATA, photo_id_back_data: data});
  };
};
