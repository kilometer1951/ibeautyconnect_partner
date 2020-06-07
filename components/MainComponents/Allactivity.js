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

const Allactivity = props => {
  const dispatch = useDispatch();

  const user = useSelector(state => state.authReducer.user);
  const allactivities = useSelector(state => state.appReducer.allactivities);
  const [activity, setActivity] = useState(false);

  const today = Moment(new Date()).format('MMM DD');

  useEffect(() => {
    const getAllActivities = async () => {
      setActivity(true);
      await dispatch(appActions.getAllActivities(user.user._id, 1));
      setActivity(false);
    };
    getAllActivities();
  }, []);

  const renderAllactivites = allactivities.slice(0, 3).map((data, index) => {
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
              <Icons name="ios-timer" size={20} color={Colors.pink} />
              <Text style={styles.textStyle}>
                {data.client.name}{' '}
                <Text style={[{...styles.textStyle}, {color: Colors.blue}]}>
                  {data.comfort_fee !== '0.00' && '( Comfort )'}
                </Text>
              </Text>
            </View>
            <Text style={styles.textStyle}>${data.total}</Text>
          </View>
          <View style={{paddingHorizontal: 18}}>
            <Text style={[{...styles.textStyle}, {color: Colors.grey_darken}]}>
              {Moment(data.booking_date).format('MMMM, DD YYYY')}
            </Text>
          </View>
          <View style={{paddingHorizontal: 19}}>
            <Text style={[{...styles.textStyle}, {color: Colors.grey_darken}]}>
              {data.comfortFeeAddress}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  });

  let viewToRender;

  if (allactivities.length === 0) {
    viewToRender = (
      <View style={{alignItems: 'center', marginTop: 73, marginBottom: 20}}>
        {activity ? (
          <MaterialIndicator color={Colors.purple_darken} size={30} />
        ) : (
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 15,
              color: Colors.grey_darken,
              textAlign: 'center',
            }}>
            You have no history yet. All transactions between you and clients
            are displayed here
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
          renderAllactivites
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
          Order History
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
          onPress={() => props.navigation.navigate('Allactivity')}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text
              style={{
                fontFamily: Fonts.poppins_semibold,
                fontSize: 14,
                paddingTop: 15,
              }}>
              See order history
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
    height: 365,
  },
  textStyle: {
    fontFamily: Fonts.poppins_regular,
    marginLeft: 10,
  },
});

export default Allactivity;
