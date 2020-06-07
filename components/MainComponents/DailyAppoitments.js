import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import * as appActions from '../../store/actions/appActions';
import {MaterialIndicator} from 'react-native-indicators';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Moment from 'moment';
import ButtonComponent from '../ButtonComponent';
import Icons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';

const DailyAppoitments = props => {
  const dispatch = useDispatch();

  const user = useSelector(state => state.authReducer.user);
  const dailyAppoitments = useSelector(
    state => state.appReducer.dailyAppoitments,
  );
  const [activity, setActivity] = useState(false);

  const today = Moment(new Date()).format('MMM DD');

  useEffect(() => {
    const getDailyAppoitments = async () => {
      setActivity(true);
      await dispatch(appActions.getDailyAppoitments(user.user._id));
      setActivity(false);
    };
    getDailyAppoitments();
  }, []);

  const renderDailyAppoitments = dailyAppoitments
    .slice(0, 3)
    .map((data, index) => {
      return (
        <TouchableWithoutFeedback key={index}>
          <View
            style={{
              marginTop: 15,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row'}}>
                <Icons name="ios-calendar" size={20} color={Colors.pink} />
                <Text style={styles.textStyle}>
                  {data.client.name}{' '}
                  <Text style={[{...styles.textStyle}, {color: Colors.blue}]}>
                    {data.comfort_fee !== '0.00' && '( Comfort )'}
                  </Text>
                </Text>
              </View>
              <Text style={styles.textStyle}>${data.total}</Text>
            </View>

            <View style={{paddingHorizontal: 19}}>
              <Text
                style={[{...styles.textStyle}, {color: Colors.grey_darken}]}>
                {Moment(data.booking_time, ['h:mm a']).format('h:mm a')}
              </Text>
            </View>

            <View style={{paddingHorizontal: 19}}>
              <Text
                style={[{...styles.textStyle}, {color: Colors.grey_darken}]}>
                {data.comfortFeeAddress}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    });

  let viewToRender;

  if (dailyAppoitments.length === 0) {
    viewToRender = (
      <View style={{alignItems: 'center', marginTop: 23, marginBottom: 20}}>
        {activity ? (
          <MaterialIndicator color={Colors.purple_darken} size={30} />
        ) : (
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 15,
              color: Colors.grey_darken,
            }}>
            You have no appointments today
          </Text>
        )}
      </View>
    );
  } else {
    viewToRender = (
      <View style={{marginTop: 10, marginBottom: 20}}>
        {activity ? (
          <MaterialIndicator color={Colors.purple_darken} size={30} />
        ) : (
          renderDailyAppoitments
        )}
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            fontFamily: Fonts.poppins_semibold,
            fontSize: 18,
          }}>
          Appointments
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_semibold,
            fontSize: 18,
          }}>
          Today{' '}
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 18,
              color: Colors.grey_darken,
            }}>
            {' '}
            {today}
          </Text>
        </Text>
      </View>
      <View style={{flex: 1}}>{viewToRender}</View>
      <View
        style={{
          borderTopWidth: 0.5,
          width: '100%',

          borderTopColor: Colors.light_grey,
        }}>
        <TouchableWithoutFeedback
          onPress={() => props.navigation.navigate('DailyAppoitment')}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text
              style={{
                fontFamily: Fonts.poppins_semibold,
                fontSize: 14,
                paddingTop: 15,
              }}>
              Today's appointments
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

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    marginTop: 5,
  },
  textStyle: {
    fontFamily: Fonts.poppins_regular,
    marginLeft: 10,
  },
});

export default DailyAppoitments;
