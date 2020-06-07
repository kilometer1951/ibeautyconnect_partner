import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../contants/Colors';

const AppFooter = props => {
  const {activeTab, setActiveTab} = props;
  //  console.log(online);

  return (
    <View style={styles.footer}>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 20,
          justifyContent: 'space-around',
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            setActiveTab('home');
            //  console.log(online);
            props.navigation.navigate('Main', {displayScreen: 'home'});
            //  setViewToRender('home');
          }}>
          <View style={styles.tabWidth}>
            <Icon
              name="ios-home"
              size={30}
              color={
                activeTab === 'home' ? Colors.purple_darken : Colors.light_grey
              }
            />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            //  console.log(online);
            props.setOpenAppoitmentModal(true);
            //  setViewToRender('home');
          }}>
          <View style={styles.tabWidth}>
            <Icon name="ios-calendar" size={30} color={Colors.light_grey} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            setActiveTab('message');
            props.navigation.navigate('Main', {displayScreen: 'message'});
          }}>
          <View
            style={{
              width: '20%',
              alignItems: 'center',
            }}>
            <Icon
              name="ios-chatbubbles"
              size={30}
              color={
                activeTab === 'message'
                  ? Colors.purple_darken
                  : Colors.light_grey
              }
            />
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() => {
            setActiveTab('profile');
            props.navigation.navigate('Main', {displayScreen: 'profile'});
            //  setViewToRender('profile');
          }}>
          <View style={styles.tabWidth}>
            <Icon
              name="ios-person"
              size={30}
              color={
                activeTab === 'profile'
                  ? Colors.purple_darken
                  : Colors.light_grey
              }
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    height: 90,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: 'white',
    bottom: 0,
    elevation: 5,
  },
  tabWidth: {
    width: '20%',
    alignItems: 'center',
  },
});

export default AppFooter;
