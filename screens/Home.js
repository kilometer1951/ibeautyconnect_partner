import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import Moment from 'moment';
import ButtonComponent from '../components/ButtonComponent';
import Earnings from '../components/MainComponents/Earnings';
import DailyAppoitments from '../components/MainComponents/DailyAppoitments';
import Allactivity from '../components/MainComponents/Allactivity';
import Icons from 'react-native-vector-icons/Ionicons';

const Home = (props) => {
  // console.log({
  //   from_date: startOfWeek.toString(),
  //   to_date: endOfWeek.toString(),
  // });

  return (
    <View style={styles.screen}>
      <Earnings
        navigation={props.navigation}
        setOpenEarningsHelpModal={props.setOpenEarningsHelpModal}
      />
      <DailyAppoitments navigation={props.navigation} />
      <Allactivity navigation={props.navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default Home;
