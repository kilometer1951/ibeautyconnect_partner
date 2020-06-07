import {URL} from '../../socketURL';
//https://hidden-lowlands-41526.herokuapp.com
//http://localhost:5002

export const UPLOAD_IMAGES = 'UPLOAD_IMAGES';
export const UPLOAD_VIDEOS = 'UPLOAD_VIDEOS';
export const DELETE_IMAGE = 'DELETE_IMAGE';
export const DELETE_VIDEO = 'DELETE_VIDEO';

export const uploadImages = (upload, userId) => {
  return async dispatch => {
    let formData = new FormData();
    formData.append('upload', upload);
    const response = await fetch(`${URL}/api/upload_images/${userId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    const resData = await response.json();

    dispatch({type: UPLOAD_IMAGES, image: resData.image});
  };
};

export const uploadVideos = (upload, userId) => {
  return async dispatch => {
    let formData = new FormData();
    formData.append('upload', upload);
    const response = await fetch(`${URL}/api/upload_videos/${userId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    const resData = await response.json();

    dispatch({type: UPLOAD_VIDEOS, video: resData.video});
  };
};

export const deleteImage = imageId => {
  return async dispatch => {
    fetch(`${URL}/api/delete_image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageId,
      }),
    });

    dispatch({type: DELETE_IMAGE, imageId: imageId});
  };
};

export const deleteVideo = videoId => {
  return async dispatch => {
    fetch(`${URL}/api/delete_video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoId,
      }),
    });

    dispatch({type: DELETE_VIDEO, videoId: videoId});
  };
};

// export const getImages = async (userId, page) => {
//   const response = await fetch(`${URL}/api/images/${userId}?page=${page}`);
//   const resData = await response.json();
//   return resData;
// };

// export const getVideos = async (userId, page) => {
//   const response = await fetch(`${URL}/api/videos/${userId}?page=${page}`);
//   const resData = await response.json();
//   return resData;
// };
