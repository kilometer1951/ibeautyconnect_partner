import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Keyboard,
  TouchableOpacity,
  Button,
  TouchableWithoutFeedback,
} from 'react-native';
import {Overlay} from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {useSelector, useDispatch} from 'react-redux';

import * as authActions from '../../store/actions/authAction';
import Error from '../Error';
import Colors from '../../contants/Colors';
import Fonts from '../../contants/Fonts';
import TextComponent from '../TextComponent';
import Loader from '../Loader';

import Moment from 'moment';

import TextInputComponent from '../TextInputComponent';
import ButtonComponent from '../ButtonComponent';

const License = (props) => {
  const user = useSelector((state) => state.authReducer.user);
  const license_photo_data = useSelector(
    (state) => state.authReducer.license_photo_data,
  );

  const [goToLicenseButton, setGoToLicenseButton] = useState();
  const [textColorDate, setTextColorDate] = useState('#bdbdbd');
  const [textColorState, setTextColorState] = useState('#bdbdbd');
  const [licenseText, setLicenseText] = useState(
    'iBeautyConnect allows only licensed professionals to use the platform. We need a copy of your professional license to verify your professional standing.',
  );
  const [dialog, setDialog] = useState(false);

  const [overLayIsVisible, setOverLayIsVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [licenseSection, setLicenseSection] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Uploading please wait');

  const {
    licenseNumber,
    setLicenseNumber,
    ssnNumber,
    setSsnNumber,
    licenseExpirationDate,
    setLicenseExpirationDate,
    errorLicense,
    setErrorLicense,
    errorSSN,
    setErrorSSN,
    errordate,
    setErrorDate,
    setOpenPickerLicenseModal,
    imageSelectedLicense,
    setRenderDone,
  } = props;

  const goToPosition1 = async () => {
    setIsLoading(true);
    await authActions.uploadLicense(license_photo_data, user.user._id);
    setIsLoading(false);
    setLicenseText(
      'By providing iBeautyConnect with your social security number, you are allowing iBeautyConnect to run a background check on you.',
    );
    setLicenseSection(false);
    setRenderDone(true);
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
    setLicenseExpirationDate(newDate);
    setErrorDate('');
    hideDatePicker();
  };

  const browseImage = () => {
    setOpenPickerLicenseModal(true);
  };

  return (
    <View>
      <TextComponent text={licenseText} />

      {licenseSection ? (
        <View>
          <TouchableOpacity onPress={browseImage}>
            {Object.entries(imageSelectedLicense).length === 0 ? (
              <View style={styles.image}>
                <Icon
                  name="md-add-circle"
                  size={30}
                  color={Colors.pink}
                  style={{alignSelf: 'center', marginTop: '30%'}}
                />
              </View>
            ) : (
              <View>
                <View style={styles.changeImageButton}>
                  <Icon
                    name="md-close-circle"
                    color="#fff"
                    size={30}
                    style={{right: 15}}
                  />
                </View>
                <Image source={imageSelectedLicense} style={styles.image} />
              </View>
            )}
          </TouchableOpacity>
          {Object.entries(imageSelectedLicense).length !== 0 && (
            <TouchableWithoutFeedback
              onPress={() => {
                ReactNativeHapticFeedback.trigger('impactLight', {
                  enableVibrateFallback: true,
                  ignoreAndroidSystemSettings: false,
                });
                goToPosition1();
              }}>
              <View style={styles.button}>
                <Icon name="md-arrow-round-forward" size={40} color="white" />
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      ) : (
        <View>
          <View style={{width: '100%'}}>
            <TextInputComponent
              placeholder={'Enter your license Number *'}
              onChangeText={(value) => {
                setErrorLicense('');
                setLicenseNumber(value);
              }}
              value={licenseNumber}
              moreStyles={{width: '100%', alignSelf: 'center'}}
              returnKeyType="done"
            />
            {errorLicense !== '' && (
              <Error error={errorLicense} moreStyles={{marginLeft: 4}} />
            )}
            <TextInputComponent
              placeholder={'SSN Number *'}
              onChangeText={(value) => {
                setErrorSSN('');
                setSsnNumber(value);
              }}
              moreStyles={{width: '100%', marginTop: 10, alignSelf: 'center'}}
              value={ssnNumber}
              returnKeyType="done"
            />
            {errorSSN !== '' && (
              <Error error={errorSSN} moreStyles={{marginLeft: 4}} />
            )}
          </View>

          <TouchableOpacity
            style={styles.dropDownList}
            onPress={showDatePicker}>
            <Text
              style={{
                fontSize: 22,
                paddingLeft: 13,
                paddingBottom: 10,
                color:
                  licenseExpirationDate === 'License Expiration Date'
                    ? textColorDate
                    : '#000',
                marginTop: 10,
                fontFamily: Fonts.poppins_regular,
              }}>
              {licenseExpirationDate}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={30}
              style={{marginRight: 10, marginTop: 10}}
            />
          </TouchableOpacity>
          {errordate !== '' && (
            <Error error={errordate} moreStyles={{marginLeft: 4}} />
          )}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            locale="en_GB" // Use "en_GB" here
            date={new Date('2020-10-05T14:48:00.000Z')}
            isDarkModeEnabled={false}
          />
        </View>
      )}
      <Loader
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        loadingMessage={loadingMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 350,
    height: 250,
    marginTop: 40,
    borderRadius: 10,
    backgroundColor: '#eeeeee',
    alignSelf: 'center',
  },
  dropDownList: {
    borderColor: '#bdbdbd',
    borderRadius: 5,
    width: '100%',
    marginTop: 25,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: Colors.purple_darken,
    width: 65,
    borderRadius: 50,
    alignItems: 'center',
    padding: 10,
    alignSelf: 'flex-end',
    marginRight: 10,
    marginTop: 20,
  },
  changeImageButton: {
    alignItems: 'flex-end',
    marginTop: '8%',
    position: 'absolute',
    zIndex: 1,
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 8,
    width: '100%',
  },
});
export default License;
