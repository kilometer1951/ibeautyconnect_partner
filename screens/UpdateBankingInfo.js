import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  SafeAreaView,
  TouchableWithoutFeedback,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import * as authAction from '../store/actions/authAction';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import {MaterialIndicator} from 'react-native-indicators';
import Moment from 'moment';
import TextInputComponent from '../components/TextInputComponent';
import ButtonComponent from '../components/ButtonComponent';
import Error from '../components/Error';

import RefreshNetworkError from '../components/RefreshNetworkError';

import stripe from 'tipsi-stripe';

const UpdateBankingInfo = (props) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.authReducer.user);

  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [success, setSuccess] = useState(false);
  stripe.setOptions({
    publishableKey: 'pk_live_QWsiQoGX6Jrxu9x2kjUrL8Pu',
    merchantId: 'MERCHANT_ID', // Optional
    androidPayMode: 'test', // Android only
  });
  const done = async () => {
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
      const response = await authAction.updateStripeAccountBankingInfo_Settings(
        user.user._id,
        token.tokenId,
      );
      //  console.log(response);
      if (!response.status) {
        setIsLoading(false);
        setError(response.message);
        return;
      }

      setAccountNumber('');
      setRoutingNumber('');
      setConfirmAccountNumber('');
      setSuccess(true);
      setIsLoading(false);
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (e) {
      setIsLoading(false);
      setError(e.toString());
      return;
    }
  };
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                props.navigation.goBack();
              }}>
              <View
                style={{
                  marginHorizontal: 20,
                  height: 30,
                  width: 30,
                  paddingTop: 4,
                  alignItems: 'center',
                }}>
                <Icon name="md-arrow-back" size={20} />
              </View>
            </TouchableWithoutFeedback>
            <View
              style={{
                width: '60%',
                marginLeft: 17,
                alignItems: 'center',
              }}>
              <Text style={{fontFamily: Fonts.poppins_bold, fontSize: 19}}>
                Update Banking Info
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
      <View style={{padding: 20}}>
        {error !== '' && <Error error={error} />}
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

        {success && (
          <Text
            style={{
              fontFamily: Fonts.poppins_semibold,
              fontSize: 18,
              textAlign: 'center',
              color: Colors.pink,
            }}>
            Account updated Successfully
          </Text>
        )}

        {isLoading ? (
          <View>
            <MaterialIndicator color={Colors.pink} style={{marginTop: '10%'}} />
          </View>
        ) : (
          <ButtonComponent
            moreStyles={{
              width: '100%',
              marginTop: 15,
              opacity:
                routingNumber === '' ||
                accountNumber === '' ||
                confirmAccountNumber === ''
                  ? 0.4
                  : 1,
            }}
            onButtonPress={done}
            title="Update"
            disabled={
              routingNumber === '' ||
              accountNumber === '' ||
              confirmAccountNumber === ''
                ? true
                : false
            }
          />
        )}
      </View>
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
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 5,
  },
  listView: {
    flexDirection: 'column',
    padding: 10,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fafafa',
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 8,
    backgroundColor: 'white',
    bottom: 0,
    elevation: 5,
    marginHorizontal: 10,
    marginTop: 20,
    borderRadius: 10,
  },
  serviceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    width: '100%',
  },
  leftContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  rightContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 150,
    borderColor: 'black',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  button: {
    width: '100%',
    padding: 5,
    flexDirection: 'row',
    marginTop: 5,
    marginRight: 30,
  },
});

export default UpdateBankingInfo;
