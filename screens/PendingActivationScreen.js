import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
  SafeAreaView,
  Linking,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {Accordion} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';

import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';

import HowItWorks from '../components/HowItWorks';

import RefreshNetworkError from '../components/RefreshNetworkError';

// iBeautyConnectPartner://
const PendingActivationScreen = (props) => {
  useEffect(() => {
    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          console.log('Initial url is: ' + url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
    Linking.addEventListener('url', _handleOpenURL);

    return () => {
      Linking.removeEventListener('url', _handleOpenURL);
    };
  }, []);

  function _handleOpenURL(event) {
    console.log(event.url);
    props.navigation.navigate('StartUpScreen');
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContainer}>
            <View
              style={{
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
              <Text style={{fontFamily: Fonts.poppins_bold, fontSize: 25}}>
                Account under review
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView>
        <View style={{padding: 10}}>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 18,
              marginTop: 10,
            }}>
            Hi there, thanks for partnering with iBeautyConnect. Your account is
            under review. Our review team usually takes one to two days to
            review your account. We will notify you when your account has been
            approved. During the review proccess, we expect you to have read how
            iBeautyConnect works.
          </Text>
        </View>
        <HowItWorks />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    height: '11%',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  headerContainer: {
    marginTop: 5,
    alignSelf: 'center',
  },
});

export default PendingActivationScreen;
