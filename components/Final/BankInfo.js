import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import stripe from 'tipsi-stripe';
import Moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

import TextInputComponent from '../TextInputComponent';
import ButtonComponent from '../ButtonComponent';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Error from '../Error';
import Loader from '../Loader';

import * as authActions from '../../store/actions/authAction';

const BankInfo = (props) => {
  const user = useSelector((state) => state.authReducer.user);

  const {
    setSectionToRender,
    setSectionHeader,
    setSectionHeaderNumber,
    bankLastFour,
    bankId,
    navigation,
  } = props;
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [loadingMessage, setLoadingMessage] = useState(
    'Updating account please wait',
  );

  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const dispatch = useDispatch();
  //const [bankAccountToken, setBankAccountToken] = useState('');
  stripe.setOptions({
    publishableKey: 'pk_live_QWsiQoGX6Jrxu9x2kjUrL8Pu',
    merchantId: 'MERCHANT_ID', // Optional
    androidPayMode: 'test', // Android only
  });

  const done = async () => {
    const userData = await AsyncStorage.getItem('@userData');
    if (bankId === '') {
      try {
        if (routingNumber.length !== 9) {
          setError('Error handling routing number');
          return;
        }
        if (accountNumber.length < 6) {
          setError('Error handling account number');
          return;
        }
        if (accountNumber !== confirmAccountNumber) {
          setError('Account number does not match');
          return;
        }
        setError('');
        const params = {
          accountNumber: accountNumber, //14 digits
          countryCode: 'us',
          currency: 'usd',
          routingNumber: routingNumber, // 9 digits
          accountHolderName: user.user.fName + ' ' + user.user.lName,
          accountHolderType: 'individual', // "company" or "individual"
        };
        const token = await stripe.createTokenWithBankAccount(params);
        setIsLoading(true);
        const response = await authActions.updateStripeAccountBankingInfo(
          user.user._id,
          token.tokenId,
        );
        //  console.log(response);
        if (!response.status) {
          setIsLoading(false);
          setError(response.message);
          return;
        }
        setIsLoading(false);
        setSectionHeaderNumber(6);
        setSectionHeader('Government-Issued ID');
        setSectionToRender('photoId');
      } catch (e) {
        setIsLoading(false);
        setError(e.toString());
        return;
      }
    } else {
      //update db
      setSectionHeaderNumber(6);
      setSectionHeader('Government-issued ID');
      setSectionToRender('photoId');
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={{fontSize: 20, fontFamily: Fonts.poppins_regular}}>
        For weekly deposit into your account
      </Text>
      {error !== '' && <Error error={error} moreStyles={{marginTop: 20}} />}
      {bankId !== '' ? (
        <View>
          <Text style={{fontSize: 20, marginTop: 17, marginBottom: 20}}>
            Bank account ending in {bankLastFour}
          </Text>
          <ButtonComponent
            moreStyles={{
              width: '100%',
              marginTop: 10,
            }}
            title="Next"
            onButtonPress={done}
          />
        </View>
      ) : (
        <View style={{marginTop: 20}}>
          <View>
            <TextInputComponent
              placeholder={'Routing Number'}
              onChangeText={(value) => {
                setRoutingNumber(value);
              }}
              value={routingNumber}
              label="Routing number*"
              keyboardType="number-pad"
              returnKeyType="done"
            />
          </View>
          <View style={{marginTop: 20}}>
            <TextInputComponent
              placeholder={'Account Number'}
              onChangeText={(value) => {
                setAccountNumber(value);
              }}
              value={accountNumber}
              label="Account number*"
              keyboardType="number-pad"
              returnKeyType="done"
            />
          </View>
          <View style={{marginTop: 20}}>
            <TextInputComponent
              placeholder={'Confirm Account Number'}
              onChangeText={(value) => {
                setConfirmAccountNumber(value);
              }}
              value={confirmAccountNumber}
              label="Confirm account number*"
              keyboardType="number-pad"
              returnKeyType="done"
            />
          </View>
          <ButtonComponent
            moreStyles={{
              width: '100%',
              marginTop: 15,
            }}
            onButtonPress={done}
            title="Next"
            disabled={
              routingNumber === '' ||
              accountNumber === '' ||
              confirmAccountNumber === ''
                ? true
                : false
            }
          />
        </View>
      )}
      <Loader
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        loadingMessage={loadingMessage}
      />
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
});

export default BankInfo;
