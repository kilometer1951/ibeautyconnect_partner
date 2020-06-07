import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ProfileHeader from '../components/ProfileComponents/ProfileHeader';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {TabHeading, Tab, Tabs} from 'native-base';
import {MaterialIndicator} from 'react-native-indicators';

import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import SearchAddress from '../components/SearchAddress';

import Loader from '../components/Loader';

import ImagesComponent from '../components/ProfileComponents/ImagesComponent';
import VideosComponent from '../components/ProfileComponents/VideosComponent';
import ServicesComponent from '../components/ProfileComponents/ServicesComponent';
import ReviewsComponent from '../components/ProfileComponents/ReviewsComponent';
import DisplayImages from '../components/ProfileComponents/DisplayImages';

import RefreshNetworkError from '../components/RefreshNetworkError';

const Profile = (props) => {
  const user = useSelector((state) => state.authReducer.user);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Uploading please wait');

  const [openModal, setOpenModal] = useState(false);
  const [activity, setActivity] = useState(false);

  return (
    <View style={styles.screen}>
      <ProfileHeader
        setOpenModal={setOpenModal}
        setIsLoading={setIsLoading}
        setLoadingMessage={setLoadingMessage}
      />
      <Tabs
        tabBarUnderlineStyle={{
          backgroundColor: Colors.purple_darken,
          marginTop: 20,
          height: 1,
        }}>
        <Tab
          heading={
            <TabHeading>
              <Text style={styles.tabTextStyle}>Portfolio</Text>
            </TabHeading>
          }>
          <View style={{flex: 1}}>
            <ImagesComponent />
          </View>
        </Tab>
        <Tab
          heading={
            <TabHeading>
              <Text style={{marginLeft: 5}}>Videos</Text>
            </TabHeading>
          }>
          <View style={{flex: 1}}>
            <VideosComponent />
          </View>
        </Tab>
        <Tab
          heading={
            <TabHeading>
              <Text style={{marginLeft: 5}}>Services</Text>
            </TabHeading>
          }>
          <View style={{flex: 1}}>
            <ServicesComponent />
          </View>
        </Tab>
        <Tab
          heading={
            <TabHeading>
              <Text style={{marginLeft: 5}}>Reviews</Text>
            </TabHeading>
          }>
          <View style={{flex: 1}}>
            <ReviewsComponent />
          </View>
        </Tab>
        <Tab
          heading={
            <TabHeading>
              <Text style={{marginLeft: 5}}>Display</Text>
            </TabHeading>
          }>
          <ScrollView>
            <DisplayImages />
          </ScrollView>
        </Tab>
      </Tabs>
      <SearchAddress openModal={openModal} setOpenModal={setOpenModal} />

      <Loader isLoading={isLoading} loadingMessage={loadingMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default Profile;
