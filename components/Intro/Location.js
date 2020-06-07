import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Ionicons';
import {MaterialIndicator} from 'react-native-indicators';
import TextComponent from '../TextComponent';
import TextInputComponent from '../TextInputComponent';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {useSelector, useDispatch} from 'react-redux';

import * as authActions from '../../store/actions/authAction';
import Colors from '../../contants/Colors';
import Fonts from '../../contants/Fonts';

import ButtonComponent from '../ButtonComponent';

const Location = (props) => {
  const user = useSelector((state) => state.authReducer.user);

  const {setSectionHeaderNumber, setSectionHeader, setSectionToRender} = props;

  const [activityIndicator, setActivityIndicator] = useState(false);
  const [displayNextButton, setDisplayNextButton] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [search, setSearch] = useState('');
  const [locationLat, setLocationLat] = useState('');
  const [locationLng, setLocationLng] = useState('');
  const [displayError, setDisplayError] = useState(false);

  const myApiKey = 'AIzaSyDEeUA1zS0cT-YHR8UyawDsYkoJop-enog';
  const myLocation = (section) => {
    Geolocation.getCurrentPosition(
      async (position) => {
        setActivityIndicator(true);
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${myApiKey}`,
        );
        const res = await response.json();
        let address = res.results[0].formatted_address;
        setLocationLat(res.results[0].geometry.location.lat);
        setLocationLng(res.results[0].geometry.location.lng);

        setSearch(address);
        setActivityIndicator(false);
        setDisplayNextButton(true);
      },
      (error) => {
        console.log(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const handleSearch = async (value) => {
    setSearch(value);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${value}&key=${myApiKey}`,
    );
    const resData = await response.json();
    setSearchData(resData.results);
    let newAdressArray = search.split(',');
    newAdressArray.length !== 4 && setDisplayNextButton(false);
  };

  updateLocation = async () => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };
    ReactNativeHapticFeedback.trigger('impactLight', options);

    let newAdressArray = search.split(',');
    if (newAdressArray.length == 4) {
      let address = newAdressArray[0].trim();
      let locationState = newAdressArray[2].slice(0, 3).trim();
      let locationCity = newAdressArray[1].trim();
      let postalCode = newAdressArray[2].split(`${locationState}`)[1].trim();
      authActions.userLocation(
        locationState,
        locationCity,
        address,
        postalCode,
        user.user._id,
        locationLat,
        locationLng,
      );
      setSectionHeaderNumber(3);
      setSectionHeader('Profile Photo');
      setSectionToRender('photo');
    } else {
      setDisplayError(true);
    }
  };
  return (
    <View style={styles.screen}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{width: displayNextButton ? '85%' : '100%'}}>
          <TextInputComponent
            placeholder={'Search'}
            onChangeText={handleSearch}
            moreStyles={{width: '100%'}}
            value={search}
            autoFocus
          />
          {displayError && (
            <View>
              <Text
                style={{fontFamily: Fonts.poppins_regular, color: Colors.pink}}>
                Invalid address. We need a complete address. For example: 1800
                Ellis St, San Francisco, CA 94115, USA
              </Text>
            </View>
          )}
        </View>
        {displayNextButton && (
          <View>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.purple_darken,
                marginTop: 15,
                padding: 10,
                width: 50,
                borderRadius: 50,
                alignItems: 'center',
              }}
              onPress={updateLocation}>
              <Icon name="md-arrow-forward" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View>
        {!activityIndicator ? (
          <TouchableOpacity style={styles.nextButton} onPress={myLocation}>
            <Icon
              name="md-locate"
              size={20}
              style={{marginRight: 10, marginTop: 3}}
              color={Colors.pink}
            />
            <Text
              style={{
                fontSize: 20,
                color: '#000',
                fontFamily: Fonts.poppins_regular,
              }}>
              Use my current location
            </Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              marginTop: 30,
            }}>
            <MaterialIndicator color={Colors.pink} />
          </View>
        )}
      </View>
      <FlatList
        data={searchData}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.listView}
            onPress={() => {
              setLocationLat(item.geometry.location.lat);
              setLocationLng(item.geometry.location.lng);
              setSearch(item.formatted_address);
              setDisplayNextButton(true);
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: Fonts.poppins_regular,
              }}>
              {item.formatted_address}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        style={{height: '100%'}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  listView: {
    flexDirection: 'column',
    padding: 5,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#bdbdbd',
  },
  nextButton: {
    paddingHorizontal: 5,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#bdbdbd',
    width: '100%',
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row',
    //display: !displayCheckButton ? 'none' : 'flex',
  },
});

export default Location;
