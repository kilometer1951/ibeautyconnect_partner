/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import 'react-native-gesture-handler';

import React, {useState, useEffect} from 'react';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import io from 'socket.io-client';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  YellowBox,
  AppState,
} from 'react-native';
import authReducer from './store/reducers/authReducer';
import appReducer from './store/reducers/appReducer';
import {URL} from './socketURL';
import Colors from './contants/Colors';
import Fonts from './contants/Fonts';
import AsyncStorage from '@react-native-community/async-storage';

const rootReducer = combineReducers({
  authReducer: authReducer,
  appReducer: appReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
]);

import AppNavigator from './navigation/AppNavigator';

const App: () => React$Node = () => {
  const socket = io(URL);
  const [messageNotification, setMessageNotification] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');

  // useEffect(() => {
  //   AppState.addEventListener('change', _handleAppStateChange);
  //   return () => {
  //     AppState.removeEventListener('change', _handleAppStateChange);
  //   };
  // }, []);
  //
  // const _handleAppStateChange = (nextAppState) => {
  //   if (nextAppState === 'active') {
  //     console.log('App has come to the foreground!');
  //   } else {
  //     console.log('background');
  //   }
  // };

  useEffect(() => {
    socket.on('newMessage', async function (msg) {
      const userData = await AsyncStorage.getItem('@userData');
      const data = await JSON.parse(userData);
      if (data) {
        if (msg.msg.to == data.user._id) {
          setNewMessageText(`You have a new message from ${msg.msg.from_name}`);
          setMessageNotification(true);
          setTimeout(() => {
            setMessageNotification(false);
          }, 2000);
        }
      }
    });
  }, []);

  useEffect(() => {
    socket.on('checkIn', async function (checkInData) {
      const userData = await AsyncStorage.getItem('@userData');
      const data = await JSON.parse(userData);
      if (data) {
        if (checkInData.partnerId == data.user._id) {
          setNewMessageText(`One of your client just checked in`);
          setMessageNotification(true);
          setTimeout(() => {
            setMessageNotification(false);
          }, 2000);
        }
      }
    });
  }, []);

  useEffect(() => {
    socket.on('reSchedule', async function (reScheduleData) {
      const userData = await AsyncStorage.getItem('@userData');
      const data = await JSON.parse(userData);
      if (data) {
        if (
          reScheduleData.reScheduleData.reScheduleData.partnerId ==
          data.user._id
        ) {
          setNewMessageText(`One of your client has updated their appoitment.`);
          setMessageNotification(true);
          setTimeout(() => {
            setMessageNotification(false);
          }, 2000);
        }
      }
    });
  }, []);

  useEffect(() => {
    socket.on('cancelAppoitment', async function (cancelAppoitmentData) {
      const userData = await AsyncStorage.getItem('@userData');
      const data = await JSON.parse(userData);
      if (data) {
        if (cancelAppoitmentData.partnerId == data.user._id) {
          setNewMessageText(
            `One of your client has cancelled their appoitment`,
          );
          setMessageNotification(true);
          setTimeout(() => {
            setMessageNotification(false);
          }, 2000);
        }
      }
    });
  }, []);

  return (
    <Provider store={store}>
      <View style={{flex: 1}}>
        {messageNotification && (
          <SafeAreaView
            style={{
              backgroundColor: Colors.purple_darken,
              alignItems: 'center',
              height: 80,
              flex: 1,
              position: 'absolute',
              zIndex: 1,
              width: '100%',
            }}>
            <Text style={{color: '#fff', fontFamily: Fonts.poppins_semibold}}>
              {newMessageText}
            </Text>
          </SafeAreaView>
        )}

        <AppNavigator />
      </View>
    </Provider>
  );
};

export default App;
