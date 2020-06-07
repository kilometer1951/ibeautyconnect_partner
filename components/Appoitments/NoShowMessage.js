import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {MaterialIndicator} from 'react-native-indicators';

import Modal from 'react-native-modalbox';
import ButtonComponent from '../ButtonComponent';

import Icon from 'react-native-vector-icons/Ionicons';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import {URL} from '../../socketURL';

import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const NoShowMessage = props => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.authReducer.user);

  const {reminderData} = props;
  const [success, setSuccess] = useState(false);
  const [displayMessage, setDisplayMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const onClose = () => {
    setDisplayMessage('');
    props.setOpenNoShowMessage(false);
  };

  const onClosingState = state => {
    console.log('the open/close of the swipeToClose just changed');
  };

  const sendReminder = async () => {
    setIsLoading(true);
    const response = await fetch(`${URL}/api/send_reminder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reminderData,
      }),
    });
    setIsLoading(false);
    const resData = await response.json();
    if (resData.status) {
      setSuccess(true);
      setDisplayMessage('Reminder Sent');
      setTimeout(() => {
        setSuccess(false);
        setDisplayMessage('');
      }, 2000);
    } else {
      setSuccess(true);
      setDisplayMessage('Somthings went wrong');
      dispatch(appActions.getAppoitments(user.user._id, 1));
      dispatch(appActions.getDailyAppoitments(user.user._id));
      setTimeout(() => {
        setSuccess(false);
        setDisplayMessage('');
      }, 2000);
    }
  };

  return (
    <Modal
      style={styles.modal}
      isOpen={props.openNoShowMessage}
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
        {success && (
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 18,
              textAlign: 'center',
              color: Colors.pink,
            }}>
            {displayMessage}
          </Text>
        )}

        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 18,
            textAlign: 'center',
          }}>
          Hi, we are sorry for the inconvenience of waiting. We give clients a
          fifteen minutes grace period. After fifteen minutes you can confirm
          the client as a no show. You will get paid 50% of the total the client
          paid.
        </Text>
      </View>
      <ButtonComponent
        moreStyles={{
          width: '100%',
          height: 70,
          padding: 20,
          marginBottom: 10,
          backgroundColor: Colors.purple_darken,
          bottom: 0,
        }}
        loader={isLoading && <MaterialIndicator color="#fff" />}
        buttonTextStyle={{color: '#fff'}}
        title={isLoading ? '' : 'Send reminder'}
        onButtonPress={sendReminder}
        disabled={isLoading ? true : false}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    height: '38%',
    width: '100%',
    padding: 15,
    borderRadius: 5,
  },
});

export default NoShowMessage;
