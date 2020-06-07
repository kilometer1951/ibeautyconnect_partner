import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import Modal from 'react-native-modalbox';

import Icon from 'react-native-vector-icons/Ionicons';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';

import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const NoShowMessage = props => {
  const onClose = () => {
    props.setOpenAppintmentHasPastModal(false);
  };

  const onClosingState = state => {
    console.log('the open/close of the swipeToClose just changed');
  };

  return (
    <Modal
      style={styles.modal}
      isOpen={props.openAppintmentHasPastModal}
      position="bottom"
      onClosed={onClose}>
      <View style={{flex: 1}}>
        <TouchableWithoutFeedback
          onPress={() => {
            ReactNativeHapticFeedback.trigger('impactLight', {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            });
            onClose();
          }}>
          <View
            style={{
              alignItems: 'flex-end',
              paddingRight: 10,
            }}>
            <Icon
              name="ios-close-circle-outline"
              size={25}
              style={{marginBottom: 20, paddingTop: 10}}
            />
          </View>
        </TouchableWithoutFeedback>

        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 18,
            textAlign: 'center',
          }}>
          You cannot confirm a no-show on an appointment in the past. If your
          client forgot to check in, Please contact support.
        </Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    height: '22%',
    width: '100%',
    padding: 15,
    borderRadius: 5,
  },
});

export default NoShowMessage;
