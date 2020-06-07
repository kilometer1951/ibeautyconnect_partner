import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import {MaterialIndicator} from 'react-native-indicators';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TimePicker from 'react-native-24h-timepicker';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Moment from 'moment';
import {useSelector, useDispatch} from 'react-redux';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import * as authActions from '../../store/actions/authAction';
import TextInputComponent from '../TextInputComponent';
import ButtonComponent from '../ButtonComponent';

const ServiceModal = props => {
  const user = useSelector(state => state.authReducer.user);
  const dispatch = useDispatch();

  const {openModal, setOpenModal, actionToPerform, editServiceData} = props;
  const [textColor, setTextColor] = useState('#bdbdbd');

  const [serviceName, setServiceName] = useState(
    actionToPerform === 'edit' ? editServiceData.serviceName : '',
  );
  const [servicePricePerHour, setServicePricePerHour] = useState(
    actionToPerform === 'edit' ? editServiceData.servicePricePerHour : '',
  );
  const [serviceHour, setServiceHour] = useState(
    actionToPerform === 'edit' ? editServiceData.serviceHour : '',
  );
  const [serviceDescription, setServiceDescription] = useState(
    actionToPerform === 'edit' ? editServiceData.serviceDescription : '',
  );
  const [errorSuccessView, setErrorSuccessView] = useState(false);
  const [errorSuccessViewMessage, setErrorSuccessViewMessage] = useState('');
  const [
    errorSuccessViewBackgrounColor,
    setErrorSuccessViewBackgrounColor,
  ] = useState('');
  const [activityIndicator, setActivityIndicator] = useState(false);
  const errorSuccessHandler = (view, message, color) => {
    setErrorSuccessView(view);
    setErrorSuccessViewMessage(message);
    setErrorSuccessViewBackgrounColor(color);
    setTimeout(function() {
      setErrorSuccessView(false);
    }, 1000);
  };

  const serviceHandler = async action => {
    if (serviceName === '') {
      errorSuccessHandler(
        true,
        'Service name is required',
        Colors.purple_darken,
      );
      return false;
    }
    if (serviceHour === '') {
      errorSuccessHandler(
        true,
        'Service hour is required',
        Colors.purple_darken,
      );
      return false;
    }
    if (servicePricePerHour === '') {
      errorSuccessHandler(
        true,
        'Service price is required',
        Colors.purple_darken,
      );
      return false;
    }

    if (action === 'new') {
      setActivityIndicator(true);
      dispatch(
        authActions.addService(
          serviceName,
          serviceHour,
          parseFloat(servicePricePerHour).toFixed(2),
          serviceDescription,
          user.user._id,
        ),
      );
      setServiceName('');
      setServicePricePerHour('');
      setServiceHour('');
      setServiceDescription('');
      errorSuccessHandler(true, 'Service added!!', Colors.purple_darken);
      setActivityIndicator(false);
      return true;
    }

    if (action === 'edit') {
      setActivityIndicator(true);
      dispatch(
        authActions.updateService(
          serviceName,
          serviceHour,
          parseFloat(servicePricePerHour).toFixed(2),
          serviceDescription,
          user.user._id,
          editServiceData.serviceId,
        ),
      );
      //errorSuccessHandler(true, 'Service updated!!', Colors.purple_darken);
      setActivityIndicator(false);
      setOpenModal(false);
      return true;
    }
  };

  return (
    <Modal animationType="slide" transparent={false} visible={openModal}>
      {errorSuccessView && (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            backgroundColor: errorSuccessViewBackgrounColor,
            height: 65,
          }}>
          <Text
            style={{
              alignSelf: 'center',
              marginTop: 35,
              fontSize: 20,
              color: '#fff',
              fontFamily: Fonts.poppins_regular,
            }}>
            {errorSuccessViewMessage}
          </Text>
        </View>
      )}
      <SafeAreaView
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 10,
          marginBottom: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            setOpenModal(false);
          }}>
          <MaterialCommunityIcons name="close" size={35} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            serviceHandler(actionToPerform);
            Keyboard.dismiss();
          }}>
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 20,
              marginTop: 5,
              color: Colors.pink,
              display:
                serviceName === '' ||
                serviceHour === '' ||
                servicePricePerHour === ''
                  ? 'none'
                  : 'flex',
            }}>
            {actionToPerform === 'new' ? 'save' : 'Update'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
      <KeyboardAvoidingView style={{paddingHorizontal: 10}}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <TextInputComponent
            onChangeText={value => {
              setServiceName(value);
            }}
            moreStyles={{marginBottom: 15}}
            value={serviceName}
            label="What's the name of your service*"
            returnKeyType="done"
            autoFocus
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{width: '50%'}}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_semibold,
                  fontSize: 20,
                  marginBottom: 5,
                }}>
                Duration*
              </Text>
              <TouchableOpacity
                style={{
                  width: '100%',
                  borderWidth: 1,
                  height: 45,
                  borderColor: '#bdbdbd',
                  borderRadius: 5,
                  height: 50,
                }}
                onPress={() => {
                  timePicker.open();
                  //  setTimePickerVisibility(true);
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    paddingLeft: 13,
                    paddingBottom: 10,
                    color: serviceHour === '' ? textColor : '#000',
                    marginTop: 10,
                    fontFamily: Fonts.poppins_regular,
                  }}>
                  {serviceHour !== '' ? serviceHour : 'example 2h:30m'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{width: '45%'}}>
              <TextInputComponent
                placeholder={'example 100.00'}
                onChangeText={value => {
                  setServicePricePerHour(value);
                }}
                moreStyles={{
                  marginBottom: 15,
                  width: '100%',
                }}
                value={servicePricePerHour}
                keyboardType="decimal-pad"
                label="Price*"
                returnKeyType="done"
              />
            </View>
          </View>
          <TimePicker
            ref={ref => {
              timePicker = ref;
            }}
            onCancel={() => timePicker.close()}
            onConfirm={(hour, minute) => {
              setServiceHour(`${hour}h:${minute}m`);
              timePicker.close();
            }}
            itemStyle={{
              fontFamily: Fonts.poppins_regular,
            }}
          />

          <TextInputComponent
            placeholder={
              'Anything you want to say about this service (Optional)'
            }
            onChangeText={value => {
              setServiceDescription(value);
            }}
            moreStyles={{
              height: 100,
            }}
            value={serviceDescription}
            multiline={true}
            numberOfLines={4}
            label="Service Description"
            returnKeyType="done"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  labelText: {
    fontSize: 17,
  },
});

export default ServiceModal;
