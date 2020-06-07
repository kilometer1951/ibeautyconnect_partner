import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Linking,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-community/async-storage';
import * as authActions from '../store/actions/authAction';
import * as appActions from '../store/actions/appActions';

import RefreshNetworkError from '../components/RefreshNetworkError';

import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';

import Profile from './Profile';
import MessageScreen from './MessageScreen';
import Home from './Home';
import AppoitmentScreen from './AppoitmentScreen';
import UploadPhotoId from './UploadPhotoId';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';

import EarningsHelpModal from '../components/EarningsHelpModal';
//import OneSignal from 'react-native-onesignal';

const HomeScreen = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const [activeTab, setActiveTab] = useState('home');
  const [online, setOnline] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openAppoitmentModal, setOpenAppoitmentModal] = useState(false);
  const [openPhotoID_modal, setOpenPhotoID_modal] = useState(false);
  const [documentIsVerified, setDocumentIsVerified] = useState(true);

  const [uploadMessage, setUploadMessage] = useState(false);
  const [openEarningsHelpModal, setOpenEarningsHelpModal] = useState(false);

  const [onlineOfflineView, setOnlineOfflineView] = useState(false);
  const [onlineOfflineText, setOnlineOfflineText] = useState(false);

  const handleRefreshHome = async () => {
    setIsRefreshing(true);
    await dispatch(
      appActions.getEarnings(user.user._id, user.user.stripeAccountId),
    );
    await dispatch(appActions.getDailyAppoitments(user.user._id));
    await dispatch(appActions.getAllActivities(user.user._id, 1));
    setIsRefreshing(false);
  };

  // useEffect(() => {
  //   OneSignal.init('bf90e054-c1cb-41ce-ba9b-b1ba40a357f0'); // set kOSSettingsKeyAutoPrompt to false prompting manually on iOS
  //
  //   OneSignal.addEventListener('received', onReceived);
  //   OneSignal.addEventListener('opened', onOpened);
  //   OneSignal.addEventListener('ids', onIds);
  //   return () => {
  //     OneSignal.removeEventListener('received', onReceived);
  //     OneSignal.removeEventListener('opened', onOpened);
  //     OneSignal.removeEventListener('ids', onIds);
  //   };
  // }, []);
  //
  // useEffect(() => {
  //   OneSignal.init('bf90e054-c1cb-41ce-ba9b-b1ba40a357f0'); // set kOSSettingsKeyAutoPrompt to false prompting manually on iOS
  //
  //   OneSignal.addEventListener('received', onReceived);
  //   OneSignal.addEventListener('opened', onOpened);
  //   OneSignal.addEventListener('ids', onIds);
  //   return () => {
  //     OneSignal.removeEventListener('received', onReceived);
  //     OneSignal.removeEventListener('opened', onOpened);
  //     OneSignal.removeEventListener('ids', onIds);
  //   };
  // }, []);
  //
  // const onReceived = notification => {
  //   console.log('Notification received: ', notification);
  // };
  //
  // const onOpened = openResult => {
  //   console.log('Message: ', openResult.notification.payload.body);
  //   console.log('Data: ', openResult.notification.payload.additionalData);
  //   console.log('isActive: ', openResult.notification.isAppInFocus);
  //   console.log('openResult: ', openResult);
  // };
  //
  // const onIds = device => {
  //   console.log('Device info: ', device);
  // };

  useEffect(() => {
    const checkPhotoID_document = async () => {
      const response = await appActions.checkPhotoID_document(user.user._id);
      if (!response.status) {
        setDocumentIsVerified(false);
      }
    };
    checkPhotoID_document();
  }, []);

  useEffect(() => {
    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          //console.log('Initial url is: ' + url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
    Linking.addEventListener('url', _handleOpenURL);

    return () => {
      Linking.removeEventListener('url', _handleOpenURL);
    };
  }, []);

  function _handleOpenURL(event) {
    const route = event.url.replace(/.*?:\/\//g, '');
    const id = route.match(/\/([^\/]+)\/?$/);
    const routeName = route.split('/');
    if (routeName.length !== 0) {
      if (routeName[0] === 'messages') {
        setActiveTab('message');
        props.navigation.navigate('Main', {displayScreen: 'message'});
      }
    }
  }

  const openPhotoIDModal = () => {
    setOpenPhotoID_modal(true);
  };

  //const [viewToRender, setViewToRender] = useState('home');

  let viewToRender;
  if (props.navigation.getParam('displayScreen') == undefined) {
    viewToRender = 'home';
    //    setViewToRender('home');
  } else if (props.navigation.getParam('displayScreen') == 'home') {
    //  setViewToRender('profile');
    viewToRender = 'home';
  } else if (props.navigation.getParam('displayScreen') == 'profile') {
    //  setViewToRender('profile');
    viewToRender = 'profile';
  } else if (props.navigation.getParam('displayScreen') == 'message') {
    //  setViewToRender('profile');
    viewToRender = 'message';
  }

  let view;

  if (viewToRender === 'home') {
    view = (
      <>
        <AppHeader
          navigation={props.navigation}
          setActiveTab={setActiveTab}
          viewToRender={viewToRender}
          setOnlineOfflineView={setOnlineOfflineView}
          onlineOfflineView={onlineOfflineView}
          setOnlineOfflineText={setOnlineOfflineText}
          onlineOfflineText={onlineOfflineText}
        />
        <ScrollView
          style={{backgroundColor: '#f5f5f5'}}
          refreshControl={
            <RefreshControl
              onRefresh={handleRefreshHome}
              refreshing={isRefreshing}
              tintColor={Colors.purple_darken}
              titleColor={Colors.purple_darken}
            />
          }>
          <Home
            navigation={props.navigation}
            setOpenEarningsHelpModal={setOpenEarningsHelpModal}
          />
        </ScrollView>
      </>
    );
  } else if (viewToRender === 'profile') {
    view = (
      <View style={{flex: 1}}>
        <AppHeader
          navigation={props.navigation}
          setActiveTab={setActiveTab}
          viewToRender={viewToRender}
          setOnlineOfflineView={setOnlineOfflineView}
          onlineOfflineView={onlineOfflineView}
          setOnlineOfflineText={setOnlineOfflineText}
          onlineOfflineText={onlineOfflineText}
        />
        <Profile navigation={props.navigation} />
      </View>
    );
  } else if (viewToRender === 'message') {
    view = (
      <View style={{flex: 1}}>
        <MessageScreen navigation={props.navigation} />
      </View>
    );
  }
  return (
    <View style={styles.screen}>
      <RefreshNetworkError navigation={props.navigation} />
      {onlineOfflineView && (
        <View
          style={[
            {...styles.onlineOfflineViewStyle},
            {
              backgroundColor: onlineOfflineText ? Colors.blue : Colors.pink,
              borderBottomColor: onlineOfflineText ? Colors.blue : Colors.pink,
              shadowColor: onlineOfflineText ? Colors.blue : Colors.pink,
            },
          ]}>
          <Text
            style={{
              fontSize: 25,
              fontFamily: Fonts.poppins_regular,
              color: '#fff',
              textAlign: 'center',
              marginTop: 2,
            }}>
            {onlineOfflineText ? 'Online' : 'Offline'}
          </Text>
        </View>
      )}
      <View style={{flex: 1}}>
        {!documentIsVerified && (
          <View style={styles.errorCard}>
            <Text
              style={{
                fontSize: 17,
                fontFamily: Fonts.poppins_regular,
                color: '#000',
              }}>
              There was a problem with one of your documents. Please reupload
              your government issued ID. To enable payments and payouts, we need
              to verify your identity.
            </Text>
            <TouchableWithoutFeedback onPress={openPhotoIDModal}>
              <View
                style={{
                  marginTop: 20,
                  backgroundColor: Colors.pink,
                  alignItems: 'center',
                  padding: 20,
                  borderRadius: 8,
                }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: Fonts.poppins_semibold,
                    color: '#fff',
                  }}>
                  Reupload Photo ID
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        )}
        {uploadMessage && (
          <View style={styles.successCard}>
            <Text
              style={{
                fontSize: 25,
                fontFamily: Fonts.poppins_regular,
                color: '#fff',
                textAlign: 'center',
                marginTop: 5,
              }}>
              Success!!!!
            </Text>
          </View>
        )}
        {view}
      </View>
      <AppFooter
        navigation={props.navigation}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setOpenAppoitmentModal={setOpenAppoitmentModal}
      />

      {openPhotoID_modal && (
        <UploadPhotoId
          setOpenPhotoID_modal={setOpenPhotoID_modal}
          openPhotoID_modal={openPhotoID_modal}
          setDocumentIsVerified={setDocumentIsVerified}
          setUploadMessage={setUploadMessage}
        />
      )}

      {openAppoitmentModal && (
        <AppoitmentScreen
          setOpenAppoitmentModal={setOpenAppoitmentModal}
          openAppoitmentModal={openAppoitmentModal}
        />
      )}

      <EarningsHelpModal
        setOpenEarningsHelpModal={setOpenEarningsHelpModal}
        openEarningsHelpModal={openEarningsHelpModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    height: '100%',
    backgroundColor: '#fff',
  },
  errorCard: {
    position: 'absolute',
    zIndex: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 8,
    backgroundColor: '#fff',
    elevation: 5,
    marginTop: '10%',
    borderRadius: 5,
    width: '95%',
    alignSelf: 'center',
  },
  successCard: {
    position: 'absolute',
    zIndex: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 8,
    elevation: 5,
    marginTop: '10%',
    borderRadius: 5,
    width: '60%',
    height: 50,
    alignSelf: 'center',
    backgroundColor: Colors.blue,
  },
  onlineOfflineViewStyle: {
    position: 'absolute',
    zIndex: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.blue,
    shadowColor: Colors.blue,
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 50,
    elevation: 5,
    marginTop: '10%',
    borderRadius: 5,
    width: '40%',
    borderRadius: 50,
    alignSelf: 'center',
    backgroundColor: Colors.blue,
    padding: 5,
    height: 25,
  },
});

export default HomeScreen;
