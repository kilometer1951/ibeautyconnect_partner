import React, {useState, useEffect} from 'react';

import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Button,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//import Spinner from 'react-native-loading-spinner-overlay';
import {MaterialIndicator} from 'react-native-indicators';
import ImagePickerModal from '../components/ImagePickerModal';
import ImagePickerLicenseModal from '../components/ImagePickerLicenseModal';

import RefreshNetworkError from '../components/RefreshNetworkError';

// import Video from 'react-native-video';
//import Geolocation from '@react-native-community/geolocation';
import {useSelector, useDispatch} from 'react-redux';

import Confirm from '../components/Confirm';
import Loader from '../components/Loader';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import * as authActions from '../store/actions/authAction';
import Gender from '../components/Intro/Gender';
import Location from '../components/Intro/Location';
import Photo from '../components/Intro/Photo';
import Profession from '../components/Intro/Profession';
import ButtonComponent from '../components/ButtonComponent';
import License from '../components/Intro/License';

const IntroScreen = (props) => {
  const user = useSelector((state) => state.authReducer.user);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [uploadingContent, setUploadingContent] = useState(false);
  const [sectionToRender, setSectionToRender] = useState('gender');
  const [sectionHeader, setSectionHeader] = useState('Gender');
  const [sectionHeaderNumber, setSectionHeaderNumber] = useState(1);
  const [renderDone, setRenderDone] = useState(false);

  const [openPickeLicenseModal, setOpenPickerLicenseModal] = useState(false);

  const [openPickerModal, setOpenPickerModal] = useState(false);
  const [imageSelectedPhoto, setImageSelectedPhoto] = useState({});
  //const [profilePhoto, setProfilePhoto] = useState({});
  //  const [pickerToDisplay, setPickerToDisplay] = useState('');

  const [imageSelectedLicense, setImageSelectedLicense] = useState({});

  const [licenseNumber, setLicenseNumber] = useState('');
  const [ssnNumber, setSsnNumber] = useState('');
  const [errorLicense, setErrorLicense] = useState('');
  const [errorSSN, setErrorSSN] = useState('');
  const [errordate, setErrorDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    'Uploading and saving changes',
  );

  const [licenseExpirationDate, setLicenseExpirationDate] = useState(
    'License Expiration Date',
  );

  useEffect(() => {
    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          console.log('Initial url is: ' + url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
    Linking.addEventListener('url', _handleOpenURL);
    const _handleOpenURL = (event) => {
      console.log(event.url);
    };
  }, []);

  let section;
  const submitForms = async () => {
    if (licenseNumber === '') {
      setErrorLicense('License number is required');
      setDialogVisible(false);
      return;
    } else {
      setErrorLicense('');
    }
    if (ssnNumber === '') {
      setErrorSSN('Social security number is required');
      setDialogVisible(false);
      return;
    } else if (ssnNumber.length !== 9) {
      setErrorSSN('Social security number is invalid');
      setDialogVisible(false);
      return;
    } else {
      setErrorSSN('');
    }

    if (licenseExpirationDate === 'License Expiration Date') {
      setErrorDate('License expiration date required');
      setDialogVisible(false);
      return;
    } else {
      setErrorDate('');
    }

    setDialogVisible(false);

    authActions.uploadDocuments(
      licenseNumber,
      ssnNumber,
      licenseExpirationDate.replace(/\s/g, ''),
      user.user._id,
    );
    props.navigation.navigate('PendingActivation');
  };

  section = (
    <ScrollView style={{height: '100%'}} keyboardShouldPersistTaps="always">
      <Gender
        setSectionHeaderNumber={setSectionHeaderNumber}
        setSectionHeader={setSectionHeader}
        setSectionToRender={setSectionToRender}
      />
    </ScrollView>
  );

  if (sectionToRender === 'location') {
    section = (
      <View style={{height: '100%'}}>
        <Location
          setSectionHeaderNumber={setSectionHeaderNumber}
          setSectionHeader={setSectionHeader}
          setSectionToRender={setSectionToRender}
        />
      </View>
    );
  } else if (sectionToRender === 'photo') {
    section = (
      <Photo
        setSectionHeaderNumber={setSectionHeaderNumber}
        setSectionHeader={setSectionHeader}
        setSectionToRender={setSectionToRender}
        sectionToRender={sectionToRender}
        setOpenPickerModal={setOpenPickerModal}
        imageSelectedPhoto={imageSelectedPhoto}
      />
    );
  } else if (sectionToRender === 'profession') {
    section = (
      <Profession
        setSectionHeaderNumber={setSectionHeaderNumber}
        setSectionHeader={setSectionHeader}
        setSectionToRender={setSectionToRender}
      />
    );
  } else if (sectionToRender === 'license') {
    section = (
      <ScrollView style={{height: '100%'}} keyboardShouldPersistTaps="always">
        <License
          sectionToRender={sectionToRender}
          setRenderDone={setRenderDone}
          setLicenseNumber={setLicenseNumber}
          setSsnNumber={setSsnNumber}
          setLicenseExpirationDate={setLicenseExpirationDate}
          licenseNumber={licenseNumber}
          ssnNumber={ssnNumber}
          licenseExpirationDate={licenseExpirationDate}
          errorLicense={errorLicense}
          setErrorLicense={setErrorLicense}
          setErrorDate={setErrorDate}
          errorSSN={errorSSN}
          setErrorSSN={setErrorSSN}
          errordate={errordate}
          setOpenPickerLicenseModal={setOpenPickerLicenseModal}
          imageSelectedLicense={imageSelectedLicense}
        />
        {renderDone && (
          <ButtonComponent
            moreStyles={{
              width: '100%',
              marginTop: 20,
              alignSelf: 'center',
            }}
            title="Done"
            onButtonPress={() => {
              setDialogVisible(true);
            }}
          />
        )}
      </ScrollView>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <RefreshNetworkError navigation={props.navigation} />
      <SafeAreaView>
        <KeyboardAvoidingView>
          <View style={{marginTop: 20, paddingHorizontal: 10}}>
            <Text
              style={{
                fontSize: 25,
                marginBottom: 10,
                fontFamily: Fonts.poppins_bold,
              }}>
              Lets get your business online
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '800',
                fontFamily: Fonts.poppins_bold,
              }}>
              ({sectionHeaderNumber}/5) {sectionHeader}
            </Text>
            {section}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <Confirm
        dialogVisible={dialogVisible}
        setDialogVisible={setDialogVisible}
        action={submitForms}
        title="Are you okay with your inputs?"
      />
      <Loader
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        loadingMessage={loadingMessage}
      />

      <ImagePickerModal
        openPickerModal={openPickerModal}
        setOpenPickerModal={setOpenPickerModal}
        setImageSelectedPhoto={setImageSelectedPhoto}
      />
      <ImagePickerLicenseModal
        openPickeLicenseModal={openPickeLicenseModal}
        setOpenPickerLicenseModal={setOpenPickerLicenseModal}
        setImageSelectedLicense={setImageSelectedLicense}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default IntroScreen;
