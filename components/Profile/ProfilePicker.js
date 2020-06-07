import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, ActivityIndicator, Linking} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Modal from 'react-native-modalbox';
import ImagePicker from 'react-native-image-crop-picker';
import * as authAction from '../../store/actions/authAction';
import AsyncStorage from '@react-native-community/async-storage';

import ButtonComponent from '../ButtonComponent';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';

const ProfilePicker = props => {
  const user = useSelector(state => state.authReducer.user);
  const dispatch = useDispatch();

  const {
    openPickerModal,
    setOpenPickerModal,
    setImage,
    setImagePicker,
    setIsLoading,
    setLoadingMessage,
  } = props;

  const onClose = () => {
    setOpenPickerModal(false);
  };

  const handleImagePicker = () => {
    ImagePicker.openCamera({width: 300, height: 400, cropping: true})
      .then(async response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error:');
        } else {
          const source = {uri: response.path};
          let data = {
            uri: response.path,
            type: response.mime,
            name: response.filename + '.JPEG',
          };
          setImage(data);
          setImagePicker(source);
          //upload image
          setIsLoading(true);
          await dispatch(
            authAction.editPhoto(data, user.user._id, response.path),
          );
          setIsLoading(false);
          onClose();
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const handleBrowsePicker = () => {
    ImagePicker.openPicker({
      multiple: false,
      mediaType: 'photo',
    })
      .then(async response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error:');
        } else {
          const source = {uri: response.path};
          let data = {
            uri: response.path,
            type: response.mime,
            name: response.filename,
          };
          setImage(data);
          setImagePicker(source);
          //upload image
          setIsLoading(true);
          await dispatch(
            authAction.editPhoto(data, user.user._id, response.path),
          );
          setIsLoading(false);
          onClose();
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const onClosingState = state => {
    console.log('the open/close of the swipeToClose just changed');
  };

  return (
    <Modal
      style={styles.modal}
      position={'bottom'}
      isOpen={openPickerModal}
      onClosed={onClose}
      onClosingState={onClose}>
      <ButtonComponent
        moreStyles={{
          width: '90%',
          marginTop: 10,
          backgroundColor: Colors.purple_darken,
          borderRadius: 10,
        }}
        buttonTextStyle={{fontSize: 18, color: '#fff'}}
        title="Take Photo"
        onButtonPress={handleImagePicker}
      />
      <ButtonComponent
        moreStyles={{
          width: '90%',
          marginTop: 10,
          backgroundColor: Colors.purple_darken,
          borderRadius: 10,
        }}
        buttonTextStyle={{fontSize: 18, color: '#fff'}}
        title="Browse Libary"
        onButtonPress={handleBrowsePicker}
      />
      <ButtonComponent
        moreStyles={{
          width: '90%',
          marginTop: 10,
          backgroundColor: '#fff',
          borderRadius: 10,
          borderColor: '#9e9e9e',
          borderWidth: 1,
        }}
        buttonTextStyle={{fontSize: 18, color: '#000'}}
        title="Close"
        onButtonPress={onClose}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    height: '30%',
    width: '100%',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default ProfilePicker;
