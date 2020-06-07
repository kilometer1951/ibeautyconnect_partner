import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Icons from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import * as authActions from '../../store/actions/authAction';

import TextComponent from '../TextComponent';
import ButtonComponent from '../ButtonComponent';

const Gender = props => {
  const user = useSelector(state => state.authReducer.user);

  const {setSectionHeaderNumber, setSectionHeader, setSectionToRender} = props;
  const [checkedMale, setCheckedMale] = useState(false);
  const [checkedFemale, setCheckedFemale] = useState(false);
  const [checkedBoth, setCheckedBoth] = useState(false);

  const goToSection = async gender => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };
    ReactNativeHapticFeedback.trigger('impactLight', options);

    authActions.serviceGender(gender, user.user._id);
    setSectionHeaderNumber(2);
    setSectionHeader('Business Location');
    setSectionToRender('location');
  };
  return (
    <View>
      <TextComponent text="What gender do you service?" />

      <TouchableWithoutFeedback
        onPress={() => {
          goToSection('male');
        }}>
        <View style={styles.listView}>
          <Text
            style={{
              fontSize: 20,
              marginLeft: 10,
              fontFamily: Fonts.poppins_regular,
            }}>
            Male
          </Text>
          <Icons name="ios-arrow-forward" size={30} />
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        style={{flexDirection: 'row', marginBottom: 30, marginRight: 30}}
        onPress={() => {
          goToSection('female');
        }}>
        <View style={styles.listView}>
          <Text
            style={{
              fontSize: 20,
              marginLeft: 10,
              fontFamily: Fonts.poppins_regular,
            }}>
            Female
          </Text>
          <Icons name="ios-arrow-forward" size={30} />
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        style={{flexDirection: 'row', marginBottom: 30}}
        onPress={() => {
          goToSection('both');
        }}>
        <View style={styles.listView}>
          <Text
            style={{
              fontSize: 20,
              marginLeft: 10,
              fontFamily: Fonts.poppins_regular,
            }}>
            Both
          </Text>
          <Icons name="ios-arrow-forward" size={30} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  listView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#fafafa',
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 8,
    backgroundColor: 'white',
    bottom: 0,
    elevation: 5,
    marginHorizontal: 5,
    marginTop: 20,
    borderRadius: 10,
  },
});

export default Gender;
