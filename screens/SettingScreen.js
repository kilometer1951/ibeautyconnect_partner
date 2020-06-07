import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
  Linking,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import * as appActions from '../store/actions/appActions';
import Moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';

import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ProfilePicker from '../components/Profile/ProfilePicker';
import io from 'socket.io-client';
import {URL} from '../socketURL';
import Loader from '../components/Loader';
import RefreshNetworkError from '../components/RefreshNetworkError';

const SettingScreen = (props) => {
  const socket = io(URL);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.authReducer.user);
  const [image, setImage] = useState({});
  const [imagePicker, setImagePicker] = useState({uri: user.user.profilePhoto});
  const [openPickerModal, setOpenPickerModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Uploading please wait');
  const [points, setPoints] = useState();

  useEffect(() => {
    const getPoints = async () => {
      const response = await appActions.getPoints(user.user._id);
      setPoints(response.points);
    };
    getPoints();
  }, []);

  return (
    <View style={styles.screen}>
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableWithoutFeedback
            onPress={() => {
              dispatch(
                appActions.getEarnings(
                  user.user._id,
                  user.user.stripeAccountId,
                ),
              );
              dispatch(appActions.getDailyAppoitments(user.user._id));
              dispatch(appActions.getAllActivities(user.user._id, 1));
              props.navigation.goBack();
            }}>
            <View
              style={{
                marginHorizontal: 8,
                height: 30,
                width: 50,
                paddingTop: 4,
                alignItems: 'center',
                marginTop: 8,
              }}>
              <Icon name="md-arrow-back" size={20} />
            </View>
          </TouchableWithoutFeedback>
          <Text style={{fontFamily: Fonts.poppins_bold, fontSize: 30}}>
            Settings
          </Text>
        </View>
      </SafeAreaView>
      <ScrollView>
        <View style={{alignItems: 'center', marginTop: '5%'}}>
          <View style={styles.imageContainer}>
            <Image
              source={imagePicker}
              style={styles.image}
              resizeMode="cover"
            />
          </View>

          <View
            style={{
              position: 'absolute',
              marginTop: '40%',
              backgroundColor: '#fff',
              width: 120,
              height: 5,
              borderRadius: 150,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />

          <View
            style={{
              position: 'absolute',
              marginTop: '38%',
              width: '100%',
              height: 100,
              borderRadius: 150,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableWithoutFeedback onPress={() => setOpenPickerModal(true)}>
              <Icon name="md-create" size={30} style={{marginTop: 10}} />
            </TouchableWithoutFeedback>
            <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 20}}>
              {user.user.fName} {user.user.lName}
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: '13%',
            alignItems: 'center',
            marginBottom: 20,
            paddingHorizontal: 5,
            width: '90%',
            alignSelf: 'center',
          }}>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 18,
              textAlign: 'center',
              flexWrap: 'wrap',
              flex: 1,
            }}>
            You are {1000 - points} points away from winning a free trip
          </Text>
        </View>
        <View style={styles.settingsContainer}>
          <TouchableWithoutFeedback
            onPress={() => props.navigation.navigate('UpdateBankingInfo')}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 15,
                }}>
                Update Banking info
              </Text>
              <Icon name="md-card" size={20} />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.settingsContainer2}>
          <TouchableWithoutFeedback
            onPress={() => props.navigation.navigate('CancelledOrders')}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 15,
                }}>
                Cancellations
              </Text>
              <Icon name="md-close" size={20} />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.settingsContainer2}>
          <TouchableWithoutFeedback
            onPress={() => props.navigation.navigate('Support')}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 15,
                }}>
                Support
              </Text>
              <Icon name="ios-headset" size={20} />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.settingsContainer2}>
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.navigate('WebViewScreen', {
                url: 'https://www.ibeautyconnect.com/privacy.html',
                title: 'privacy',
              });
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 15,
                }}>
                Data and Privacy
              </Text>
              <Icon name="ios-document" size={20} />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.settingsContainer2}>
          <TouchableWithoutFeedback
            onPress={() =>
              props.navigation.navigate('WebViewScreen', {
                url: 'https://www.ibeautyconnect.com/terms.html',
                title: 'terms',
              })
            }>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 15,
                }}>
                Terms of Use
              </Text>
              <Icon name="md-document" size={20} />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.settingsContainer2}>
          <TouchableWithoutFeedback
            onPress={() => props.navigation.navigate('HowItWorksScreen')}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 15,
                }}>
                How it Works
              </Text>
              <Icon name="md-book" size={20} />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={[{...styles.settingsContainer2}, {marginBottom: 50}]}>
          <TouchableWithoutFeedback
            onPress={() => {
              AsyncStorage.clear();
              props.navigation.navigate('Auth');
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 15,
                }}>
                Sign out
              </Text>
              <Icon name="ios-log-out" size={20} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>

      <ProfilePicker
        openPickerModal={openPickerModal}
        setOpenPickerModal={setOpenPickerModal}
        setImagePicker={setImagePicker}
        setImage={setImage}
        setIsLoading={setIsLoading}
        setLoadingMessage={setLoadingMessage}
      />

      <Loader
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        loadingMessage={loadingMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 150,
    borderColor: 'black',
    overflow: 'hidden',
    borderWidth: 5,
    borderColor: Colors.purple_darken,
  },
  image: {
    width: '100%',
    height: '100%',
    borderWidth: 5,
    borderRadius: 150,
    borderColor: '#fff',
  },
  settingsContainer: {
    marginHorizontal: 20,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    paddingTop: 20,
    paddingBottom: 20,
    borderColor: '#e0e0e0',
    flex: 1,
  },
  settingsContainer2: {
    marginHorizontal: 20,
    borderBottomWidth: 0.5,
    paddingTop: 20,
    paddingBottom: 20,
    borderColor: '#e0e0e0',
  },
});

export default SettingScreen;
