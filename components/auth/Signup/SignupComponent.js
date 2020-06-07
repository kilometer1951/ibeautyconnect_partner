import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Button,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {useSelector, useDispatch} from 'react-redux';
import {MaterialIndicator} from 'react-native-indicators';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from '../../Loader';
import Icons from 'react-native-vector-icons/Ionicons';

import * as authActions from '../../../store/actions/authAction';
import Colors from '../../../contants/Colors';

import ModalWebView from '../../ModalWebView';

import Fonts from '../../../contants/Fonts';
import TextInputComponent from '../../TextInputComponent';
import TextComponent from '../../TextComponent';
import Error from '../../Error';
import ButtonComponent from '../../ButtonComponent';

const validateEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const Signup = props => {
  const {activityIndicator, setActivityIndicator} = props;
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [resendActivityIndicator, setResendActivityIndicator] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorPhone, setErrorPhoneNumber] = useState('');
  const [errorVerification, setErrorVerification] = useState('');
  const [errorFname, setErrorFname] = useState('');
  const [errorLname, setErrorLname] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [modalWebView, setModalWebView] = useState(false);
  const [errorPassword, setErrorPassword] = useState('');
  const [view, setView] = useState('phoneNumber');
  const [code, setCode] = useState('');
  const dispatch = useDispatch();

  const handlePosition = async viewToShow => {
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
        setLoadingMessage('Verifying your number please wait');
        setTimeout(function() {
          setLoadingMessage('We are almost there');
        }, 4000);
        const response = await authActions.verifiyPhoneNumber(phoneNumber);
        setLoadingMessage('Verifying your number please wait');
        setIsLoading(false);
        //  setActivityIndicator(false);
        //if resData.status is true continue else return error
        if (!response.status) {
          setErrorPhoneNumber('Error handling phone number');
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
    if (view === 'profileDetails') {
      if (fName === '') {
        setErrorFname('Please enter your legal first name');
        return;
      } else {
        setErrorFname('');
      }
      if (lName === '') {
        setErrorLname('Please enter your legal last name');
        return;
      } else {
        setErrorLname('');
      }
      setView(viewToShow);
    }
    //console.log(viewToShow);
  };

  const handleSignup = async () => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };
    ReactNativeHapticFeedback.trigger('impactLight', options);
    if (email === '') {
      setErrorEmail('Please enter your email');
      return;
    } else if (!validateEmail(email)) {
      setErrorEmail('Email not valid');
      return;
    } else {
      setErrorEmail('');
    }
    if (password === '') {
      setErrorPassword('Please enter a password');
      return;
    } else {
      setErrorPassword('');
    }
    setLoadingMessage('Creating account');
    setIsLoading(true);
    const respond = await authActions.createAcctount(
      fName,
      lName,
      phoneNumber,
      email,
      password,
    );
    setIsLoading(false);
    if (!respond.status) {
      setErrorPassword('Error signing up user exist');
      return;
    }
    await AsyncStorage.setItem(
      '@userData',
      JSON.stringify({
        user: respond.user,
      }),
    );
    await dispatch(authActions.authUser(respond.user));
    props.navigationProperties.navigation.navigate('Intro');
  };

  const handlePhoneNumber = value => {
    const formatted = value
      .replace(/[^\d]+/g, '')
      .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    setPhoneNumber(formatted);
  };

  const resendCode = async () => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };
    ReactNativeHapticFeedback.trigger('impactLight', options);
    setResendActivityIndicator(true);
    const response = await authActions.verifiyPhoneNumber(phoneNumber);
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
    if (view === 'profileDetails') {
      setView('verification');
    }
    if (view === 'profileSecurity') {
      setView('profileDetails');
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
          <TouchableOpacity
            style={{marginTop: 10}}
            onPress={() => {
              props.setShowSignupComponent(false);
            }}>
            <Text
              style={{
                fontFamily: Fonts.poppins_bold,
                fontSize: 18,
                color: Colors.purple_darken,
              }}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={120}>
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
              disabled={phoneNumber === '' ? true : false}>
              <View style={styles.button}>
                <Icons name="md-arrow-round-forward" size={40} color="white" />
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
                handlePosition('profileDetails');
              }}
              disabled={verificationCode === '' ? true : false}>
              <View style={styles.button}>
                <Icons name="md-arrow-round-forward" size={40} color="white" />
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  } else if (view === 'profileDetails') {
    displayedView = (
      <View>
        <View
          style={{
            paddingHorizontal: 10,
            height: '90%',
          }}>
          <View style={{marginBottom: 10}}>
            <TextInputComponent
              placeholder={'your legal first name*'}
              onChangeText={value => {
                setErrorFname('');
                setFName(value);
              }}
              value={fName}
              moreStyles={{width: '100%'}}
              label="What's your legal first name"
              autoFocus
            />
            {errorFname !== '' && <Error error={errorFname} />}
          </View>
          <TextInputComponent
            placeholder={'your legal last name*'}
            onChangeText={value => setLName(value)}
            value={lName}
            moreStyles={{width: '100%'}}
            label="What's your legal last name"
          />
          {errorLname !== '' && <Error error={errorLname} />}
        </View>
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={130}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            style={{paddingRight: 20}}>
            <TouchableWithoutFeedback
              onPress={() => {
                ReactNativeHapticFeedback.trigger('impactLight', {
                  enableVibrateFallback: true,
                  ignoreAndroidSystemSettings: false,
                });
                handlePosition('profileSecurity');
              }}
              disabled={lName === '' || fName === '' ? true : false}>
              <View style={styles.button}>
                <Icons name="md-arrow-round-forward" size={40} color="white" />
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  } else if (view === 'profileSecurity') {
    displayedView = (
      <View>
        <View
          style={{
            paddingHorizontal: 10,
            height: '90%',
          }}>
          <View style={{marginBottom: 10}}>
            <TextInputComponent
              placeholder={'your email*'}
              onChangeText={value => {
                setErrorEmail('');
                setEmail(value);
              }}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              moreStyles={{width: '100%'}}
              label="What's your email"
              autoFocus
            />
            {errorEmail !== '' && <Error error={errorEmail} />}
          </View>

          <TextInputComponent
            placeholder={'password*'}
            onChangeText={value => {
              setErrorPassword('');
              setPassword(value);
            }}
            value={password}
            secureTextEntry={true}
            moreStyles={{width: '100%'}}
            label="Create your password"
            returnKeyType="done"
          />
          {errorPassword !== '' && <Error error={errorPassword} />}
          <TouchableOpacity
            style={{marginTop: 5, paddingHorizontal: 3}}
            onPress={() => {
              props.setShowSignupComponent(false);
            }}>
            <Text
              style={{
                fontFamily: Fonts.poppins_bold,
                fontSize: 18,
                color: Colors.purple_darken,
              }}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{paddingHorizontal: 3, marginTop: 3}}
            onPress={() => {
              setModalWebView(true);
            }}>
            <Text
              style={{
                fontFamily: Fonts.poppins_bold,
                fontSize: 18,
              }}>
              By Signing up, you agree to our terms and conditions
            </Text>
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={150}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            style={{paddingRight: 20}}>
            <TouchableWithoutFeedback
              onPress={() => {
                ReactNativeHapticFeedback.trigger('impactLight', {
                  enableVibrateFallback: true,
                  ignoreAndroidSystemSettings: false,
                });
                handleSignup();
              }}
              disabled={email === '' || password === '' ? true : false}>
              <View style={styles.button}>
                <Icons name="md-arrow-round-forward" size={40} color="white" />
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <SafeAreaView>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <View>
            {view !== 'phoneNumber' && (
              <TouchableOpacity
                onPress={handleBack}
                style={{paddingHorizontal: 10, flexDirection: 'row'}}>
                <MaterialCommunityIcons name="chevron-left" size={30} />
                <Text
                  style={{
                    fontFamily: Fonts.poppins_semibold,
                    fontSize: 18,
                    marginTop: 2,
                  }}>
                  back
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableWithoutFeedback>
        <View style={{paddingHorizontal: 10}}>
          <Text
            style={{
              fontFamily: Fonts.poppins_bold,
              fontSize: 35,
              marginTop: 2,
            }}>
            Signup
          </Text>
        </View>
      </SafeAreaView>
      <View style={styles.authContainer}>{displayedView}</View>
      <Loader
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        loadingMessage={loadingMessage}
      />
      <ModalWebView
        setModalWebView={setModalWebView}
        modalWebView={modalWebView}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  authContainer: {
    flexDirection: 'column',
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

export default Signup;
