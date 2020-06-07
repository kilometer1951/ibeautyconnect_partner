import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {MaterialIndicator} from 'react-native-indicators';
import Feather from 'react-native-vector-icons/Feather';
import Video from 'react-native-video';
import {useSelector, useDispatch} from 'react-redux';

import * as galleryActions from '../../store/actions/galleryActions';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';

const EditGalleryVideos = props => {
  const user = useSelector(state => state.authReducer.user);
  const dispatch = useDispatch();

  const {
    openVideoModal,
    setOpenVideoModal,
    videoModalData,
    setVideoModalData,
  } = props;
  //console.log(modalDataVideo);
  return (
    <View>
      <Modal animationType="slide" transparent={false} visible={openVideoModal}>
        <View style={styles.screen}>
          <View
            style={{
              flexDirection: 'row',
              zIndex: 1,
            }}>
            <View
              style={{
                left: 0,
                marginTop: 50,
                paddingLeft: 20,
                position: 'absolute',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setVideoModalData({});
                  setOpenVideoModal(false);
                }}>
                <Feather name="x" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                right: 0,
                paddingRight: 20,
                marginTop: 50,
                position: 'absolute',
              }}>
              <TouchableOpacity
                onPress={() => {
                  dispatch(galleryActions.deleteVideo(videoModalData._id));
                  setOpenVideoModal(false);
                }}>
                <Feather name="trash" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <Video
            source={{uri: `${videoModalData.path}`}}
            style={styles.video}
            resizeMode="cover"
            onBuffer={() => {
              console.log('buff');
            }}
            onError={() => {
              console.log('error');
            }}
            resizeMode="contain"
            muted={false}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default EditGalleryVideos;
