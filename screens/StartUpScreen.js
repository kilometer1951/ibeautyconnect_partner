import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, ActivityIndicator, Linking} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {URL} from '../socketURL';
import NetInfo from '@react-native-community/netinfo';
import {DotIndicator} from 'react-native-indicators';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import AsyncStorage from '@react-native-community/async-storage';

import * as authActions from '../store/actions/authAction';

const StartUpScreen = (props) => {
  const dispatch = useDispatch();
  const [networkError, setNetworkError] = useState(false);

  useEffect(() => {
    //AsyncStorage.clear();
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        setNetworkError(false);
        const tryLogin = async () => {
          const userData = await AsyncStorage.getItem('@userData');
          //  console.log(userData);
          if (!userData) {
            props.navigation.navigate('Auth');
            return;
          }
          const parseUserData =
            userData !== null && (await JSON.parse(userData));
          const respond = await fetch(
            URL + '/auth/userIsActive/' + parseUserData.user._id,
          );
          const resData = await respond.json();
          if (!resData.introScreen) {
            await dispatch(authActions.authUser(resData));
            props.navigation.navigate('Intro');
            return;
          }
          if (!resData.isApproved) {
            await dispatch(authActions.authUser(resData));
            props.navigation.navigate('PendingActivation', {resData});
            return;
          }
          if (resData.isApproved && !resData.hasGoneThroughFinalScreen) {
            await dispatch(authActions.authUser(resData));
            props.navigation.navigate('GetStarted', {
              resData,
            });
            return;
          }
          //dispatch
          await dispatch(authActions.authUser(resData));

          props.navigation.navigate('App');
        };
        tryLogin();
      } else {
        setNetworkError(true);
      }
    });
  }, []);

  return (
    <View style={styles.screen}>
      {networkError && (
        <Text
          style={{
            position: 'absolute',
            top: 70,
            fontFamily: Fonts.poppins_regular,
            zIndex: 1,
          }}>
          Network error please check your network
        </Text>
      )}
      <View style={styles.screen}>
        <Text
          style={{
            fontFamily: Fonts.poppins_bold,
            fontSize: 30,
            color: Colors.pink,
          }}>
          iBeautyConnect
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
          }}>
          Instant Beauty Connect
        </Text>
      </View>
      <View style={{bottom: 40, flexDirection: 'row'}}>
        <View style={{height: 20}}>
          <DotIndicator
            color={Colors.purple_darken}
            size={10}
            style={{marginTop: 15}}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default StartUpScreen;
