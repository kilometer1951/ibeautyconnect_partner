import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import {useSelector, useDispatch} from 'react-redux';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Icons from 'react-native-vector-icons/Ionicons';

import RefreshNetworkError from '../components/RefreshNetworkError';

const GetStartedScreen = (props) => {
  const resData = props.navigation.getParam('resData');

  const user = useSelector((state) => state.authReducer.user);

  return (
    <View style={styles.screen}>
      <RefreshNetworkError navigation={props.navigation} />
      <SafeAreaView style={{flex: 1}}>
        <Text
          style={{
            fontSize: 35,
            marginBottom: 20,
            textAlign: 'center',
            fontFamily: Fonts.poppins_semibold,
            marginTop: 40,
          }}>
          Welcome to iBeautyConnect
        </Text>

        <View style={{flexDirection: 'row', paddingHorizontal: '15%'}}>
          <View style={{marginTop: 50}}>
            <Icons name="ios-people" size={40} color={Colors.pink} />
          </View>
          <View>
            <Text
              style={{
                fontSize: 16,
                marginLeft: 20,
                fontFamily: Fonts.poppins_semibold,
                marginTop: 20,
              }}>
              Get Discovered
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts.poppins_regular,
                marginLeft: 20,
              }}>
              Our goal is to build a community of health and beauty
              professionals. We value your business and make it our priority to
              showcase your skills to clients.
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: '15%',
            marginTop: 30,
          }}>
          <View style={{marginTop: 30}}>
            <Icons name="ios-calendar" size={40} color={Colors.blue} />
          </View>
          <View>
            <Text
              style={{
                fontSize: 16,
                marginLeft: 20,
                fontFamily: Fonts.poppins_semibold,
              }}>
              Appointments
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts.poppins_regular,
                marginLeft: 20,
              }}>
              Clients can book for your services and iBeautyConnect manages your
              appoitment reminders.
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: '15%',
            marginTop: 30,
          }}>
          <View style={{marginTop: 30}}>
            <Icons name="ios-cash" size={40} color={Colors.blue} />
          </View>
          <View>
            <Text
              style={{
                fontSize: 16,
                marginLeft: 20,
                fontFamily: Fonts.poppins_semibold,
              }}>
              Get Paid
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts.poppins_regular,
                marginLeft: 20,
              }}>
              iBeautyConnect directly deposits your eranings daily to your bank
              account
            </Text>
          </View>
        </View>
      </SafeAreaView>
      <View style={styles.buttonContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            ReactNativeHapticFeedback.trigger('impactLight', {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            });
            props.navigation.navigate('Final', {
              resData,
            });
          }}>
          <View style={styles.button}>
            <Text
              style={{
                fontFamily: Fonts.poppins_semibold,
                fontSize: 20,
                fontWeight: 'bold',
                color: '#fff',
              }}>
              Get started
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    height: '20%',
    marginBottom: 30,
  },

  button: {
    padding: 20,
    width: '60%',
    alignItems: 'center',
    borderRadius: 40,
    marginTop: '20%',
    backgroundColor: Colors.purple_darken,
  },
});

export default GetStartedScreen;
