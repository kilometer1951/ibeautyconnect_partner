import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import AsyncStorage from '@react-native-community/async-storage';
import Icons from 'react-native-vector-icons/Ionicons';

import * as authActions from '../../../store/actions/authAction';
import Fonts from '../../../contants/Fonts';
import Colors from '../../../contants/Colors';
import TextInputComponent from '../../TextInputComponent';
import ButtonComponent from '../../ButtonComponent';
import Error from '../../Error';
import Loader from '../../Loader';
import AlternativeLogin from '../AlternativeLogin';

const validateEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const Login = props => {
  const user = useSelector(state => state.authReducer.user);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openAlternativeLoginModal, setOpenAlternativeLoginModal] = useState(
    false,
  );

  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (loginEmail === '') {
      setErrorEmail('Please enter your email');
      return;
    } else if (!validateEmail(loginEmail)) {
      setErrorEmail('Email not valid');
      return;
    }
    if (loginPassword === '') {
      setErrorPassword('Please enter your password');
      return;
    }
    setIsLoading(true);
    const respond = await authActions.loginUser(loginEmail, loginPassword);
    setIsLoading(false);

    if (!respond.status) {
      setErrorEmail('Invalid email or password');
      return;
    }

    if (respond.status) {
      await AsyncStorage.setItem(
        '@userData',
        JSON.stringify({
          user: respond.user,
        }),
      );
    }

    if (!respond.user.introScreen) {
      await dispatch(authActions.authUser(respond.user));
      props.navigationProperties.navigation.navigate('Intro');
      return;
    }
    if (!respond.user.isApproved) {
      await dispatch(authActions.authUser(respond.user));
      props.navigationProperties.navigation.navigate('PendingActivation', {
        resData: respond.user,
      });
      return;
    }
    if (respond.user.isApproved && !respond.user.hasGoneThroughFinalScreen) {
      await dispatch(authActions.authUser(respond.user));
      props.navigationProperties.navigation.navigate('GetStarted', {
        resData: respond.user,
      });
      return;
    }

    await dispatch(authActions.authUser(respond.user));
    props.navigationProperties.navigation.navigate('App');
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView>
        <View>
          <View style={{paddingHorizontal: 10, height: '90%', marginTop: 10}}>
            <View>
              <Text
                style={{
                  fontFamily: Fonts.poppins_bold,
                  fontSize: 35,
                  marginTop: 2,
                }}>
                Login
              </Text>
            </View>
            <TextInputComponent
              placeholder={"What's your email"}
              onChangeText={value => {
                setErrorEmail('');
                setLoginEmail(value);
              }}
              value={loginEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              moreStyles={{width: '100%'}}
              label="What's your email*"
              autoFocus
            />
            {errorEmail !== '' && <Error error={errorEmail} />}
            <View style={{marginTop: 10}}>
              <TextInputComponent
                placeholder={"What's your password"}
                onChangeText={value => {
                  setErrorPassword('');
                  setLoginPassword(value);
                }}
                value={loginPassword}
                secureTextEntry={true}
                moreStyles={{width: '100%'}}
                label="What's your password*"
              />
            </View>
            {errorPassword !== '' && <Error error={errorPassword} />}

            <TouchableOpacity
              style={{marginTop: 10}}
              onPress={() => {
                props.setShowSignupComponent(true);
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_bold,
                  fontSize: 18,
                  color: Colors.purple_darken,
                }}>
                Don't have an account? Signup
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginTop: 5}}
              onPress={() => setOpenAlternativeLoginModal(true)}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_bold,
                  fontSize: 18,
                }}>
                Forgot your password?
              </Text>
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={40}>
            <ScrollView
              keyboardShouldPersistTaps="always"
              style={{paddingRight: 20}}>
              <TouchableWithoutFeedback
                onPress={() => {
                  ReactNativeHapticFeedback.trigger('impactLight', {
                    enableVibrateFallback: true,
                    ignoreAndroidSystemSettings: false,
                  });
                  handleLogin();
                }}
                disabled={
                  loginEmail === '' || loginPassword === '' ? true : false
                }>
                <View style={styles.button}>
                  <Icons
                    name="md-arrow-round-forward"
                    size={40}
                    color="white"
                  />
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
      <Loader
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        loadingMessage="Verifying account"
      />
      <AlternativeLogin
        openAlternativeLoginModal={openAlternativeLoginModal}
        setOpenAlternativeLoginModal={setOpenAlternativeLoginModal}
        navigation={props.navigationProperties}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.purple_darken,
    width: 65,
    borderRadius: 50,
    alignItems: 'center',
    padding: 10,
    alignSelf: 'flex-end',
  },
});

export default Login;
