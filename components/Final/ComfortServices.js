import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';

import Icons from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import TextInputComponent from '../TextInputComponent';
import ButtonComponent from '../ButtonComponent';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import * as authActions from '../../store/actions/authAction';

const ComfortServices = props => {
  const user = useSelector(state => state.authReducer.user);

  const {setSectionToRender, setSectionHeader, setSectionHeaderNumber} = props;
  const [checkedYes, setCheckedYes] = useState(false);
  const [checkedNo, setCheckedNo] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [comfortFeeInput, setComfortFeeInput] = useState('');

  const updateComfortHandler = async () => {
    authActions.updateComfortFee(
      user.user._id,
      parseFloat(comfortFeeInput).toFixed(2),
    );
    setSectionToRender('uploadVideo');
    setSectionHeader('Portfolio');
    setSectionHeaderNumber(3);
  };
  return (
    <View style={styles.screen}>
      <Text style={{fontSize: 20, fontFamily: Fonts.poppins_regular}}>
        Comfort services are services you offer out of your establishment. Do
        you offer comfort services?
      </Text>
      <View>
        <TouchableWithoutFeedback
          onPress={() => {
            ReactNativeHapticFeedback.trigger('impactLight', {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            });

            setOpenModal(true);
          }}>
          <View style={styles.listView}>
            <Text
              style={{
                fontSize: 20,
                marginLeft: 10,
                fontFamily: Fonts.poppins_regular,
              }}>
              Yes, I offer
            </Text>
            <Icons
              name="ios-arrow-forward"
              size={30}
              color={Colors.purple_darken}
            />
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() => {
            ReactNativeHapticFeedback.trigger('impactLight', {
              enableVibrateFallback: true,
              ignoreAndroidSystemSettings: false,
            });

            setSectionToRender('uploadVideo');
            setSectionHeader('Portfolio');
            setSectionHeaderNumber(3);
          }}>
          <View style={styles.listView}>
            <Text
              style={{
                fontSize: 20,
                marginLeft: 10,
                fontFamily: Fonts.poppins_regular,
              }}>
              No, I do not offer
            </Text>
            <Icons
              name="ios-arrow-forward"
              size={30}
              color={Colors.purple_darken}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View>
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={openModal}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <View
            style={{
              backgroundColor: 'rgba(158, 158, 158, 0.3)',
              flex: 1,
            }}>
            <View
              style={{
                height: '35%',
                width: '90%',
                alignSelf: 'center',
                backgroundColor: '#fff',
                borderRadius: 10,
                marginTop: '50%',
                padding: 15,
              }}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    marginBottom: 20,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      const options = {
                        enableVibrateFallback: true,
                        ignoreAndroidSystemSettings: false,
                      };
                      ReactNativeHapticFeedback.trigger('impactLight', options);
                      setCheckedNo(false);
                      setCheckedYes(false);
                      setOpenModal(false);
                    }}>
                    <Icons name="md-close" size={35} />
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={{fontSize: 20, fontFamily: Fonts.poppins_bold}}>
                    How much is your comfort fee?
                  </Text>
                  <TextInputComponent
                    placeholder={'Price in dollars'}
                    onChangeText={value => {
                      setComfortFeeInput(value);
                    }}
                    moreStyles={{marginBottom: 20}}
                    value={comfortFeeInput}
                    autoFocus
                    keyboardType="decimal-pad"
                  />
                  <ButtonComponent
                    moreStyles={{
                      width: '100%',
                    }}
                    title="Save"
                    onButtonPress={updateComfortHandler}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  listView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 20,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fafafa',
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 8,
    backgroundColor: 'white',
    bottom: 0,
    elevation: 5,
    marginTop: 20,
    borderRadius: 10,
  },
});

export default ComfortServices;
