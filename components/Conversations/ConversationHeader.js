import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  SafeAreaView,
  Image,
  Switch,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import * as appActions from '../../store/actions/appActions';

import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../contants/Colors';
import Fonts from '../../contants/Fonts';

const ConversationHeader = props => {
  const user = useSelector(state => state.authReducer.user);

  const dispatch = useDispatch();

  return (
    <View style={styles.header}>
      <SafeAreaView>
        <View>
          <View style={styles.headerContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                dispatch(appActions.getMessages(user.user._id));
                props.navigation.navigate('Main', {displayScreen: 'message'});
              }}>
              <View style={{width: '20%', alignItems: 'center', marginTop: 9}}>
                <Icon
                  name="ios-arrow-back"
                  size={25}
                  color={Colors.midnight_blue}
                />
              </View>
            </TouchableWithoutFeedback>

            <View
              style={{
                marginTop: 8,
                width: '65%',
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 20,
                }}>
                {props.client_name}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '11%',
    top: 0,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    paddingBottom: 15,
  },
});

export default ConversationHeader;
