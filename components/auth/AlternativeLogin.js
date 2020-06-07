import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Modal,
  SafeAreaView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icons from 'react-native-vector-icons/Ionicons';
import TextInputComponent from '../TextInputComponent';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Error from '../Error';
import {MaterialIndicator} from 'react-native-indicators';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as authActions from '../../store/actions/authAction';
import AsyncStorage from '@react-native-community/async-storage';

import Colors from '../../contants/Colors';
import Fonts from '../../contants/Fonts';

const AlternativeLogin = props => {
  const dispatch = useDispatch();

  const {
    openAlternativeLoginModal,
    setOpenAlternativeLoginModal,
    navigation,
  } = props;
  const [view, setView] = useState('phoneNumber');
  const [code, setCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [errorPhone, setErrorPhoneNumber] = useState('');
  const [errorVerification, setErrorVerification] = useState('');
  const [errorLicense, setErrorLicense] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendActivityIndicator, setResendActivityIndicator] = useState(false);

  const handlePhoneNumber = value => {
    const formatted = value
      .replace(/[^\d]+/g, '')
      .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    setPhoneNumber(formatted);
  };

  const handlePosition = async viewToShow => {
    try {
      const options = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      };
      ReactNativeHapticFeedback.trigger('impactLight', options);
      if (view === 'phoneNumber') {
        if (phoneNumber === '') {
          setErrorVerification('Please enter your phone number');
          return;
        } else {
          //    setActivityIndicator(true);
          setIsLoading(true);

          const response = await authActions.verifiyPhoneNumberForgotPassword(
            phoneNumber,
          );
          setIsLoading(false);
          //  setActivityIndicator(false);
          //if resData.status is true continue else return error
          if (!response.status) {
            setErrorPhoneNumber('Error handling phone number');
            return;
          }
          if (!response.userFound) {
            setErrorPhoneNumber('User does not exist');
            return;
          }
          setErrorPhoneNumber('');
          setCode(response.code);
          setView(viewToShow);
        }
      }
      if (view === 'verification') {
        if (verificationCode === '') {
          setErrorVerification(`Please enter the code sent to:${phoneNumber}`);
          return;
        } else if (verificationCode != code) {
          setErrorVerification(`Code is not valid`);
          return;
        }
        setView(viewToShow);
      } else {
        setErrorVerification('');
      }
      if (view === 'license_number') {
        if (licenseNumber === '') {
          setErrorVerification('Please enter your license number');
          return;
        } else {
          setIsLoading(true);
          const response = await authActions.verifyLicenseNumber(
            licenseNumber,
            phoneNumber,
          );
          setIsLoading(false);
          if (!response.licenseDocument) {
            setErrorLicense('Error handling license number');
            return;
          }
          if (response.licenseDocument) {
            //login user
            await AsyncStorage.setItem(
              '@userData',
              JSON.stringify({
                user: response.user,
              }),
            );
          }
          setOpenAlternativeLoginModal(false);
          await dispatch(authActions.authUser(response.user));
          navigation.navigation.navigate('StartUpScreen');
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const resendCode = async () => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };
    ReactNativeHapticFeedback.trigger('impactLight', options);
    setResendActivityIndicator(true);
    const response = await authActions.verifiyPhoneNumberForgotPassword(
      phoneNumber,
    );
    setResendActivityIndicator(false);
    setErrorVerification(`Code sent to: ${phoneNumber}`);

    //if resData.status is true continue else return error
    if (!response.status) {
      setErrorVerification(`Error handling phone number`);
      return;
    }
    setCode(response.code);
  };

  const handleBack = () => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };
    ReactNativeHapticFeedback.trigger('impactLight', options);
    if (view === 'verification') {
      setView('phoneNumber');
    }
    if (view === 'license_number') {
      setView('verification');
    }
  };

  let displayedView;

  if (view === 'phoneNumber') {
    displayedView = (
      <View>
        <View style={{paddingHorizontal: 10, height: '90%'}}>
          <TextInputComponent
            placeholder={'(312) 401-0122*'}
            onChangeText={handlePhoneNumber}
            value={phoneNumber}
            keyboardType="phone-pad"
            maxLength={14}
            moreStyles={{width: '100%'}}
            label="What's your phone number*"
            autoFocus
          />
          {errorPhone !== '' && <Error error={errorPhone} />}
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 18,
            }}>
            We will send you a code to verify your phone number.
          </Text>
        </View>

        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={100}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            style={{paddingRight: 20}}>
            <TouchableWithoutFeedback
              onPress={() => {
                ReactNativeHapticFeedback.trigger('impactLight', {
                  enableVibrateFallback: true,
                  ignoreAndroidSystemSettings: false,
                });
                handlePosition('verification', 1);
              }}
              disabled={phoneNumber === '' || isLoading ? true : false}>
              <View style={styles.button}>
                {isLoading ? (
                  <MaterialIndicator color="#fff" />
                ) : (
                  <Icons
                    name="md-arrow-round-forward"
                    size={40}
                    color="white"
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  } else if (view === 'verification') {
    displayedView = (
      <View>
        <View
          style={{
            paddingHorizontal: 10,
            height: '90%',
          }}>
          <TextInputComponent
            placeholder={'Enter Verification Code'}
            onChangeText={value => setVerificationCode(value)}
            value={verificationCode}
            keyboardType="phone-pad"
            maxLength={5}
            moreStyles={{width: '100%'}}
            label="Verification Code*"
            autoFocus
          />
          {errorVerification !== '' && <Error error={errorVerification} />}

          {resendActivityIndicator ? (
            <View style={{marginTop: 50}}>
              <MaterialIndicator
                color={Colors.purple_darken}
                style={{
                  alignSelf: 'flex-start',
                  paddingHorizontal: 10,
                }}
              />
            </View>
          ) : (
            <TouchableOpacity
              onPress={resendCode}
              style={{paddingHorizontal: 2}}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_bold,
                  fontSize: 18,
                }}>
                Resend Code
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={130}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            style={{paddingRight: 20, bottom: 30}}>
            <TouchableWithoutFeedback
              onPress={() => {
                ReactNativeHapticFeedback.trigger('impactLight', {
                  enableVibrateFallback: true,
                  ignoreAndroidSystemSettings: false,
                });
                handlePosition('license_number');
              }}
              disabled={verificationCode === '' || isLoading ? true : false}>
              <View style={styles.button}>
                {isLoading ? (
                  <MaterialIndicator color="#fff" />
                ) : (
                  <Icons
                    name="md-arrow-round-forward"
                    size={40}
                    color="white"
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  } else if (view === 'license_number') {
    displayedView = (
      <View>
        <View
          style={{
            paddingHorizontal: 10,
            height: '90%',
          }}>
          <TextInputComponent
            placeholder={'Enter Your License Number'}
            onChangeText={value => setLicenseNumber(value)}
            value={licenseNumber}
            moreStyles={{width: '100%'}}
            label="License Number*"
            autoFocus
          />
          {errorLicense !== '' && <Error error={errorLicense} />}
        </View>
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={130}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            style={{paddingRight: 20, bottom: 30}}>
            <TouchableWithoutFeedback
              onPress={() => {
                ReactNativeHapticFeedback.trigger('impactLight', {
                  enableVibrateFallback: true,
                  ignoreAndroidSystemSettings: false,
                });
                handlePosition('license_number');
              }}
              disabled={licenseNumber === '' || isLoading ? true : false}>
              <View style={styles.button}>
                {isLoading ? (
                  <MaterialIndicator color="#fff" />
                ) : (
                  <Icons
                    name="md-arrow-round-forward"
                    size={40}
                    color="white"
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={openAlternativeLoginModal}>
        <SafeAreaView>
          <View style={{paddingHorizontal: 20}}>
            <TouchableWithoutFeedback
              onPress={() => {
                setPhoneNumber('');
                setErrorPhoneNumber('');
                setOpenAlternativeLoginModal(false);
              }}>
              <Icons
                name="md-close"
                size={30}
                style={{alignSelf: 'flex-end'}}
              />
            </TouchableWithoutFeedback>
          </View>
        </SafeAreaView>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <View>
            {view !== 'phoneNumber' && (
              <TouchableOpacity
                onPress={handleBack}
                style={{flexDirection: 'row'}}>
                <MaterialCommunityIcons name="chevron-left" size={30} />
                <Text
                  style={{
                    fontFamily: Fonts.poppins_bold,
                    fontSize: 18,
                    marginTop: 2,
                    marginBottom: 10,
                  }}>
                  back
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableWithoutFeedback>
        <View>{displayedView}</View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.purple_darken,
    width: 65,
    borderRadius: 50,
    alignItems: 'center',
    padding: 10,
    alignSelf: 'flex-end',
  },
});

export default AlternativeLogin;
