import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

import ButtonComponent from '../ButtonComponent';
import Icons from 'react-native-vector-icons/Ionicons';
import * as appActions from '../../store/actions/appActions';
import {MaterialIndicator} from 'react-native-indicators';

const Earnings = props => {
  const dispatch = useDispatch();

  const user = useSelector(state => state.authReducer.user);
  const earnings = useSelector(state => state.appReducer.earnings);

  useEffect(() => {
    const getEarnings = async () => {
      await dispatch(
        appActions.getEarnings(user.user._id, user.user.stripeAccountId),
      );
    };
    getEarnings();
  }, []);

  let curr = new Date(); // get current date
  let first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
  let last = first + 6; // last day is the first day + 6

  const firstDayOfWeek = Moment(
    new Date(curr.setDate(first)),
    'DD-MM-YYYY',
  ).add(1, 'day');
  const lastDayOfWeek = Moment(new Date(curr.setDate(last)), 'DD-MM-YYYY').add(
    1,
    'day',
  );

  const startOfWeek = Moment(firstDayOfWeek).format('MMM DD');
  const endOfWeek = Moment(lastDayOfWeek).format('MMM DD');

  //const avaliable = ;

  let weekly_earnings;
  if (earnings.total_earned_per_week === undefined) {
    weekly_earnings = (
      <MaterialIndicator color={Colors.purple_darken} size={25} />
    );
  } else {
    weekly_earnings = (
      <View>
        <View style={{flexDirection: 'row', height: 134}}>
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 30,
              lineHeight: 65,
            }}>
            $
          </Text>
          <Text style={{fontFamily: Fonts.poppins_semibold, fontSize: 100}}>
            {earnings.total_earned_per_week.split('.')[0]}
          </Text>
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 35,
              lineHeight: 80,
            }}>
            .{earnings.total_earned_per_week.split('.')[1]}
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            marginTop: 115,
            alignSelf: 'center',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 14,
              color: Colors.grey_darken,
              textAlign: 'center',
            }}>
            Earnings are deposited daily
          </Text>
          <TouchableOpacity
            onPress={() => props.setOpenEarningsHelpModal(true)}>
            <Icon
              name="md-help-circle-outline"
              size={20}
              color={Colors.grey_darken}
              style={{marginLeft: 10}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  let textToRender;
  if (earnings.available_balance === undefined) {
    textToRender = <MaterialIndicator color="#fff" size={25} />;
  } else {
    textToRender = (
      <Text
        style={{
          fontFamily: Fonts.poppins_semibold,
          fontSize: 19,
          color: '#fff',
          textAlign: 'center',
        }}>
        Available Cash ${earnings.available_balance}
      </Text>
    );
  }
  // const available_balance =
  //
  //     ? earnings.available_balance
  //     : 'loading';
  // //if (Object.entries(earnings).length !== 0) {
  // console.log(!earnings ? 'earnings' : 'av');
  // //} else {
  // //  console.log('loaded');
  // //}

  return (
    <View style={styles.screen}>
      <Text style={{fontFamily: Fonts.poppins_semibold, fontSize: 15}}>
        {startOfWeek} - {endOfWeek}
      </Text>
      {weekly_earnings}

      <View
        style={{
          backgroundColor: Colors.purple_darken,
          marginTop: 20,
          padding: 20,
          borderRadius: 100,
          width: '85%',
        }}>
        {textToRender}
      </View>

      <View
        style={{
          borderTopWidth: 0.5,
          width: '100%',
          marginTop: 20,
          borderTopColor: Colors.light_grey,
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            props.navigation.navigate('WeeklyActivity');
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text
              style={{
                fontFamily: Fonts.poppins_semibold,
                fontSize: 14,
                paddingTop: 15,
              }}>
              Weekly activity
            </Text>
            <View style={{marginTop: 14, marginLeft: 10}}>
              <Icons name="md-arrow-round-forward" size={20} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

// <ButtonComponent
//   moreStyles={{
//     width: '80%',
//     marginTop: 25,
//   }}
//   buttonTextStyle={{fontFamily: Fonts.poppins_semibold}}
//   title={'Available Cash $' + available_balance}
//   onButtonPress={() => {
//     console.log('expanin');
//   }}
// />
const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
});

export default Earnings;
