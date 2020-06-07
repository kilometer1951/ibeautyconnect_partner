import {URL} from '../../socketURL';
import Moment from 'moment';

//const URL = 'https://hidden-lowlands-41526.herokuapp.com';
//https://hidden-lowlands-41526.herokuapp.com
//http://localhost:5002

export const LIVE_REQUEST_STATUS = 'LIVE_REQUEST_STATUS';
export const IMAGES_DATA = 'IMAGES_DATA';
export const HANDLE_LOAD_MORE_PHOTOS = 'HANDLE_LOAD_MORE_PHOTOS';
export const HANDLE_LOAD_MORE_REVIEWS = 'HANDLE_LOAD_MORE_REVIEWS';
export const HANDLE_LOAD_MORE_ALLACTIVITY = 'HANDLE_LOAD_MORE_ALLACTIVITY';

export const VIDEOS_DATA = 'VIDEOS_DATA';
export const REVIEWS = 'REVIEWS';
export const GET_EARNINGS = 'GET_EARNINGS';

export const EXPAND_WEEKLY_ACTIVITY = 'EXPAND_WEEKLY_ACTIVITY';

export const DAILY_APPOITMENTS = 'DAILY_APPOITMENTS';
export const CONFIRM_NO_SHOW = 'CONFIRM_NO_SHOW';
export const GET_ALL_ACTIVITIES = 'GET_ALL_ACTIVITIES';
export const EXPAND_ALL_ACTIVITY_ITEM = 'EXPAND_ALL_ACTIVITY_ITEM';

export const RESCHEDULE_DATA = 'RESCHEDULE_DATA';

export const QUERY_APPOITMENTS = 'QUERY_APPOITMENTS';
export const HANDLE_LOAD_MORE_APPOITMENTS = 'HANDLE_LOAD_MORE_APPOITMENTS';
export const MESSAGES = 'MESSAGES';
export const LOAD_SUPPORT_MESSAGES = 'LOAD_SUPPORT_MESSAGES';

export const CANCELLEDORDERS = 'CANCELLEDORDERS';

export const loadSupportMessages = partnerId => {
  return async dispatch => {
    const response = await fetch(
      `${URL}/api/get_supportMessages_partner/${partnerId}`,
    );
    const resData = await response.json();
    dispatch({
      type: LOAD_SUPPORT_MESSAGES,
      allSupportMessages: resData.supportMessage,
    });
  };
};

export const getSupportConversations = async supportMessageId => {
  const response = await fetch(
    `${URL}/api/get_supportConvo/${supportMessageId}`,
  );
  const resData = await response.json();
  return resData;
};

export const checkPhotoID_document = async partnerId => {
  const response = await fetch(`${URL}/api/check_stripe_document/${partnerId}`);
  const resData = await response.json();
  return resData;
};

export const getPoints = async partnerId => {
  const response = await fetch(`${URL}/api/get_points_partner/${partnerId}`);
  const resData = await response.json();
  return resData;
};

export const newSupportMessage = async messageData => {
  const response = await fetch(`${URL}/api/new_support_message_partner`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messageData,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const getMessages = partnerId => {
  return async dispatch => {
    const response = await fetch(`${URL}/api/messages_partner/${partnerId}`);
    const resData = await response.json();
    dispatch({type: MESSAGES, messages: resData.messages});
  };
};

export const getConversations = async messageId => {
  const response = await fetch(`${URL}/api/conversations/${messageId}`);
  const resData = await response.json();
  return resData;
};

export const newMessage = async messageData => {
  const response = await fetch(`${URL}/api/new_message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messageData,
    }),
  });
  const resData = await response.json();
  return resData;
};

export const toggleLiveRequest = status => {
  //console.log(status);
  return async dispatch => {
    //  console.log(status);
    dispatch({type: LIVE_REQUEST_STATUS, status: status});
  };
};

export const handleUserToReSchedule = reScheduleData => {
  //console.log(status);
  return async dispatch => {
    //  console.log(status);
    dispatch({type: RESCHEDULE_DATA, reScheduleData: reScheduleData});
  };
};

export const reSchedule = (reScheduleData, bookingDate, bookingTime) => {
  return async dispatch => {
    const response = await fetch(`${URL}/api/reSchedule_partner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reScheduleData,
        bookingDate,
        bookingTime,
      }),
    });
    const resData = await response.json();

    if (!resData.status) {
      throw new Error(false);
    }
    return;
  };
};

export const getImages = (userId, page) => {
  return async dispatch => {
    const response = await fetch(`${URL}/api/images/${userId}?page=${page}`);
    const resData = await response.json();
    if (!resData.status) {
      throw new Error(false);
    }

    dispatch({type: IMAGES_DATA, imagesData: resData.images});
  };
};

export const handleLoadMorePhotos = (userId, page) => {
  return async dispatch => {
    const response = await fetch(`${URL}/api/images/${userId}?page=${page}`);
    const resData = await response.json();
    if (!resData.status) {
      console.log(response);
      return;
    }
    if (resData.endOfFile) {
      throw new Error(false);
    }
    dispatch({type: HANDLE_LOAD_MORE_PHOTOS, imagesData: resData.images});
  };
};

export const getVideos = (userId, page) => {
  return async dispatch => {
    const response = await fetch(`${URL}/api/videos/${userId}?page=${page}`);
    const resData = await response.json();
    if (!resData.status) {
      throw new Error(false);
    }

    dispatch({type: VIDEOS_DATA, videoData: resData.videos});
  };
};

export const getReviews = (userId, page) => {
  return async dispatch => {
    const response = await fetch(
      `${URL}/api/get_partner_review/${userId}?page=${page}`,
    );
    const resData = await response.json();
    console.log(resData.reviews);

    dispatch({type: REVIEWS, reviews: resData.reviews});
  };
};

export const handleLoadMoreReviews = (userId, page) => {
  return async dispatch => {
    const response = await fetch(
      `${URL}/api/get_partner_review/${userId}?page=${page}`,
    );
    const resData = await response.json();
    if (!resData.status) {
      console.log(response);
      return;
    }
    if (resData.endOfFile) {
      throw new Error(false);
    }
    dispatch({type: HANDLE_LOAD_MORE_REVIEWS, reviews: resData.reviews});
  };
};

export const getEarnings = (userId, stripeAccountId) => {
  return async dispatch => {
    let newDate = Moment(new Date()).format('YYYY-MM-DD');
    let dateTime = new Date(newDate + '' + 'T05:00:00.000Z');
    const response = await fetch(
      `${URL}/api/get_earnings/${userId}/${stripeAccountId}/${dateTime}`,
    );
    const resData = await response.json();
    dispatch({type: GET_EARNINGS, earnings: resData.earnings});
  };
};

export const getWeeklyActivity = async (partnerId, page) => {
  let newDate = Moment(new Date()).format('YYYY-MM-DD');
  let dateTime = new Date(newDate + '' + 'T05:00:00.000Z');
  const response = await fetch(
    `${URL}/api/weekly_activity/${partnerId}/${dateTime}?page=${page}`,
  );
  const resData = await response.json();
  return resData;
};
export const getDailyAppoitments = userId => {
  return async dispatch => {
    let newDate = Moment(new Date()).format('YYYY-MM-DD');
    let dateTime = new Date(newDate + '' + 'T05:00:00.000Z');
    const response = await fetch(
      `${URL}/api/get_daily_appoitments/${userId}/${dateTime}`,
    );
    const resData = await response.json();
    dispatch({
      type: DAILY_APPOITMENTS,
      dailyAppoitments: resData.dailyAppoitments,
    });
  };
};

export const getAppoitments = (partnerId, page) => {
  return async dispatch => {
    const response = await fetch(
      `${URL}/api/get_all_appoitments/${partnerId}?page=${page}`,
    );
    const resData = await response.json();
    dispatch({
      type: QUERY_APPOITMENTS,
      allAppoitments: resData.allAppoitments,
    });
  };
};

export const handleLoadMoreAppoitments = (partnerId, page) => {
  return async dispatch => {
    const response = await fetch(
      `${URL}/api/get_all_appoitments/${partnerId}?page=${page}`,
    );
    const resData = await response.json();
    if (!resData.status) {
      console.log(response);
      return;
    }
    if (resData.endOfFile) {
      throw new Error(false);
    }
    dispatch({
      type: HANDLE_LOAD_MORE_APPOITMENTS,
      allAppoitments: resData.allAppoitments,
    });
  };
};

export const queryAgendaByDate = (partnerId, dateTime) => {
  return async dispatch => {
    const response = await fetch(
      `${URL}/api/query_partner_agenda_by_date/${partnerId}/${dateTime}`,
    );
    const resData = await response.json();
    dispatch({
      type: QUERY_APPOITMENTS,
      allAppoitments: resData.allAppoitments,
    });
  };
};

export const expandWeeklyActivity = items => {
  return async dispatch => {
    dispatch({type: EXPAND_WEEKLY_ACTIVITY, expanded_weekly_activity: items});
  };
};

export const expandAllactivity = items => {
  //console.log(items);
  return async dispatch => {
    dispatch({
      type: EXPAND_ALL_ACTIVITY_ITEM,
      expanded_all_activity_item: items,
    });
  };
};

export const handleNoShow = noShowAppoitmentData => {
  return async dispatch => {
    const response = await fetch(`${URL}/api/confirm_no_show`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        noShowAppoitmentData,
      }),
    });
    const resData = await response.json();
    if (!resData.status) {
      throw new Error(false);
    }
    dispatch({type: CONFIRM_NO_SHOW, cartId: noShowAppoitmentData.cartId});
  };
};

export const getAllActivities = (userId, page) => {
  return async dispatch => {
    const response = await fetch(
      `${URL}/api/get_all_activities/${userId}?page=${page}`,
    );
    const resData = await response.json();
    dispatch({
      type: GET_ALL_ACTIVITIES,
      allactivities: resData.allactivities,
    });
  };
};

export const handleLoadMoreAllactivity = (userId, page) => {
  return async dispatch => {
    const response = await fetch(
      `${URL}/api/get_all_activities/${userId}?page=${page}`,
    );
    const resData = await response.json();
    if (!resData.status) {
      console.log(response);
      return;
    }
    if (resData.endOfFile) {
      throw new Error(false);
    }
    dispatch({
      type: HANDLE_LOAD_MORE_ALLACTIVITY,
      allactivities: resData.allactivities,
    });
  };
};

export const setOrderCancelledItemsData = items => {
  return async dispatch => {
    dispatch({type: CANCELLEDORDERS, cancelledOrders: items});
  };
};

export const getCancelledOrders = async (partnerId, page) => {
  const response = await fetch(
    `${URL}/api/cancelled_orders_partner/${partnerId}?page=${page}`,
  );
  const resData = await response.json();
  return resData;
};
