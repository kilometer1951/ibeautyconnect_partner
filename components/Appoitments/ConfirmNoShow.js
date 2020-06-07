import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import Modal from 'react-native-modalbox';
import Moment from 'moment';
import {MaterialIndicator} from 'react-native-indicators';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/Ionicons';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import ButtonComponent from '../ButtonComponent';
import Loader from '../../components/Loader';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import * as appActions from '../../store/actions/appActions';
import {URL} from '../../socketURL';

import io from 'socket.io-client';

const ConfirmNoShow = props => {
  const socket = io(URL);
  const dispatch = useDispatch();
  const user = useSelector(state => state.authReducer.user);

  const {
    openNoShowModal,
    setConfirmNoShowModal,

    noShowAppoitmentData,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [viewToRender, setViewToRender] = useState('');

  let responseView;

  const onClose = () => {
    setViewToRender('');
    setConfirmNoShowModal(false);
  };

  const onClosingState = state => {
    console.log('the open/close of the swipeToClose just changed');
  };

  const handleNoShow = async () => {
    try {
      setIsLoading(true);
      await dispatch(appActions.handleNoShow(noShowAppoitmentData));
      await dispatch(appActions.getDailyAppoitments(user.user._id));
      await dispatch(appActions.getAppoitments(user.user._id, 1));
      setIsLoading(false);
      socket.emit('noShow', noShowAppoitmentData);
      setViewToRender('success');
    } catch (e) {
      dispatch(appActions.getDailyAppoitments(user.user._id));
      dispatch(appActions.getAppoitments(user.user._id, 1));
      setIsLoading(false);
      setViewToRender('error');
    }
  };

  if (viewToRender === 'success') {
    responseView = (
      <View>
        <TouchableWithoutFeedback
          onPress={() => {
            ReactNativeHapticFeedback.trigger('impactLight', {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            });
            onClose();
          }}>
          <Icon
            name="ios-close-circle-outline"
            size={25}
            style={{alignSelf: 'flex-end', marginBottom: 20}}
          />
        </TouchableWithoutFeedback>
        <View style={{alignItems: 'center', marginTop: 40}}>
          <Icon
            name="md-checkmark-circle"
            size={55}
            color={Colors.purple_darken}
          />
          <Text style={{fontSize: 30, fontFamily: Fonts.poppins_regular}}>
            success
          </Text>
        </View>
      </View>
    );
  } else if (viewToRender === 'error') {
    responseView = (
      <View>
        <TouchableWithoutFeedback
          onPress={() => {
            ReactNativeHapticFeedback.trigger('impactLight', {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            });
            onClose();
          }}>
          <Icon
            name="ios-close-circle-outline"
            size={25}
            style={{alignSelf: 'flex-end', marginBottom: 20}}
          />
        </TouchableWithoutFeedback>
        <View style={{alignItems: 'center'}}>
          <Icon name="md-close-circle" size={55} color={Colors.pink} />
          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.poppins_regular,
              textAlign: 'center',
            }}>
            Snap, this appointment does not exist!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Modal
      style={styles.modal}
      isOpen={openNoShowModal}
      position="bottom"
      backdropPressToClose={isLoading ? false : true}
      onClosed={onClose}>
      {isLoading ? (
        <View style={{marginTop: '20%', alignItems: 'center'}}>
          <MaterialIndicator color={Colors.purple_darken} />
          <Text
            style={{
              fontSize: 18,
              fontFamily: Fonts.poppins_regular,
              marginTop: 20,
            }}>
            Please wait
          </Text>
        </View>
      ) : viewToRender === '' ? (
        <View>
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
            Hi, we are sorry for any inconveniences. You will be paid 50% of the
            total amount the client paid. Thanks.
          </Text>

          <ButtonComponent
            moreStyles={{
              width: '100%',
              height: 70,
              padding: 20,
              marginTop: 20,
              backgroundColor: Colors.purple_darken,
            }}
            buttonTextStyle={{color: '#fff'}}
            title="Confirm no-show"
            onButtonPress={handleNoShow}
          />
        </View>
      ) : (
        responseView
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    height: '35%',
    width: '100%',
    padding: 15,
    borderRadius: 5,
  },
});

export default ConfirmNoShow;
