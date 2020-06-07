import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Button, TouchableOpacity} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {MaterialIndicator} from 'react-native-indicators';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import Moment from 'moment';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Error from '../Error';

import stripe from 'tipsi-stripe';

import ButtonComponent from '../ButtonComponent';
import * as authActions from '../../store/actions/authAction';

const InstantPay = (props) => {
  const user = useSelector((state) => state.authReducer.user);
  const {
    setSectionToRender,
    setSectionHeader,
    setSectionHeaderNumber,
    cardId,
    dateOfBirth,
    debitCardLastFour,
  } = props;
  const [textColorDate, setTextColorDate] = useState('#bdbdbd');
  const [textColorDebitCard, setTextColorDebitCard] = useState('#bdbdbd');
  const [debitcard, setDebitcard] = useState('');
  const [activityIndicator, setActivityIndicator] = useState(false);
  const [debitcardToken, setDebitcardToken] = useState({});
  const [error, setError] = useState('');
  const [debitcardPlaceHolder, setDebitcardPlaceHolder] = useState(
    'Add debit card',
  );
  const [dob, setDob] = useState('');
  const [dobPlaceHolder, setDobPlaceHolder] = useState('Date of birth');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  stripe.setOptions({
    publishableKey: 'pk_live_QWsiQoGX6Jrxu9x2kjUrL8Pu',
    merchantId: 'MERCHANT_ID', // Optionalfff
    androidPayMode: 'test', // Android only
  });

  const creditCardHandler = async () => {
    const options = {
      managedAccountCurrency: 'usd',
    };
    stripe
      .paymentRequestWithCardForm(options)
      .then((token) => {
        console.log(token);
        setDebitcardToken(token);
        setDebitcard('card ending in ' + token.card.last4);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.log('A date has been picked: ', date);

    const newDate = Moment(date).format('MM / DD / YYYY');
    setTextColorDate('#000');
    setDob(newDate);
    hideDatePicker();
  };

  const goToSection = async (section) => {
    //submit to server and update stripe account info on server
    setActivityIndicator(true);
    const response = await authActions.UpdateStripeAccount(
      user.user._id,
      debitcardToken,
      dob,
    );
    setActivityIndicator(false);
    if (!response.status) {
      setError(response.message);
      return;
    }

    setSectionToRender(section);
    setSectionHeader('Banking Information');
    setSectionHeaderNumber(5);
  };
  console.log(cardId !== '');
  return (
    <View>
      <Text style={{fontSize: 20, fontFamily: Fonts.poppins_regular}}>
        With instant pay you can cash out all your earnings instantly to your
        debit card in minutes
      </Text>
      {error !== '' && <Error error={error} />}
      {cardId !== '' ? (
        <View>
          <Text
            style={{
              fontSize: 20,
              marginTop: 17,
              fontFamily: Fonts.poppins_regular,
            }}>
            Date of Birth: {Moment(dateOfBirth).format('MM / DD / YYYY')}
          </Text>
          <Text
            style={{
              fontSize: 20,
              marginTop: 17,
              marginBottom: 20,
              fontFamily: Fonts.poppins_regular,
            }}>
            Card ending in {debitCardLastFour}
          </Text>

          <ButtonComponent
            moreStyles={{
              width: '100%',
              marginTop: 10,
            }}
            title="Next"
            onButtonPress={() => {
              setSectionToRender('bankinfo');
              setSectionHeader('Banking Information');
              setSectionHeaderNumber(5);
            }}
          />
        </View>
      ) : (
        <View>
          <TouchableOpacity
            style={styles.dropDownList}
            onPress={showDatePicker}>
            <Text
              style={{
                fontSize: 22,
                paddingLeft: 13,
                paddingBottom: 10,
                color: dob === '' ? textColorDate : '#000',
                marginTop: 10,
                fontFamily: Fonts.poppins_regular,
              }}>
              {dob !== '' ? dob : dobPlaceHolder}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={30}
              style={{marginRight: 10, marginTop: 5}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropDownList}
            onPress={creditCardHandler}>
            <Text
              style={{
                fontSize: 22,
                paddingLeft: 13,
                paddingBottom: 10,
                color: debitcard === '' ? textColorDebitCard : '#000',
                marginTop: 10,
                fontFamily: Fonts.poppins_regular,
              }}>
              {debitcard !== '' ? debitcard : debitcardPlaceHolder}
            </Text>
          </TouchableOpacity>
          {dob !== '' &&
            debitcard !== '' &&
            (!activityIndicator ? (
              <ButtonComponent
                moreStyles={{
                  width: '100%',
                  marginTop: 20,
                }}
                title="Next"
                onButtonPress={goToSection.bind(this, 'bankinfo')}
              />
            ) : (
              <MaterialIndicator color={Colors.pink} style={{marginTop: 30}} />
            ))}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            locale="en_GB" // Use "en_GB" here
            date={new Date('1999-10-05T14:48:00.000Z')}
          />
        </View>
      )}
      <View
        style={{
          marginTop: 60,
          alignSelf: 'center',
          justifyContent: 'flex-end',
          paddingHorizontal: 10,
          flexDirection: 'row',
          width: '80%',
        }}>
        <Icon name="ios-lock" size={30} />
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            textAlign: 'center',
            marginTop: 8,
            marginLeft: 10,
          }}>
          Your payout information is saved securly
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  dropDownList: {
    borderColor: '#bdbdbd',
    borderRadius: 5,
    width: '100%',
    marginTop: 25,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 55,
  },
});

export default InstantPay;
