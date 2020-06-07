import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
  FlatList,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import * as authActions from '../store/actions/authAction';
import Icon from 'react-native-vector-icons/Ionicons';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import {MaterialIndicator} from 'react-native-indicators';

const SearchAddress = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);

  const {setOpenModal, openModal} = props;
  const [addressSearch, setAddressSearch] = useState('');
  const [activityIndicator, setActivityIndicator] = useState(false);
  const [displayCheckButton, setDisplayCheckButton] = useState(true);
  const [searchData, setSearchData] = useState([]);
  const [locationLat, setLocationLat] = useState('');
  const [locationLng, setLocationLng] = useState('');

  const myApiKey = 'AIzaSyDEeUA1zS0cT-YHR8UyawDsYkoJop-enog';

  //https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value}&types=(cities)&language=pt_BR&key=${myApiKey}

  const searchHandler = async (value) => {
    //  setBusinessAddress(value);
    setAddressSearch(value);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${value}&key=${myApiKey}`,
    );
    const resData = await response.json();
    value !== '' ? setDisplayCheckButton(false) : setDisplayCheckButton(true);
    //  const pre = resData.predictions.map(value => console.log(value.place_id));
    //  console.log(pre);
    setSearchData(resData.results);
  };

  const getLocation = async () => {
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

        setActivityIndicator(false);
        setAddressSearch(address);
        setDisplayCheckButton(false);
        //setOpenModal(false);
      },
      (error) => {
        console.log(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  return (
    <Modal animationType="slide" transparent={false} visible={openModal}>
      <View>
        <View style={styles.modalHeader}>
          <View style={styles.modalHeaderContent}>
            <TouchableOpacity
              onPress={() => {
                setAddressSearch('');
                setOpenModal(false);
              }}>
              <MaterialCommunityIcons name="close" color="#fff" size={30} />
            </TouchableOpacity>
            <Text style={{color: '#fff', fontSize: 20}}>My Location</Text>
            <TouchableOpacity
              disabled={displayCheckButton}
              onPress={async () => {
                let newAdressArray = addressSearch.split(',');
                let address = newAdressArray[0].trim();
                let locationState = newAdressArray[2].slice(0, 3).trim();
                let locationCity = newAdressArray[1].trim();
                let postalCode = newAdressArray[2]
                  .split(`${locationState}`)[1]
                  .trim();
                await dispatch(
                  authActions.updateLocation(
                    locationState,
                    locationCity,
                    address,
                    postalCode,
                    user.user._id,
                    locationLat,
                    locationLng,
                  ),
                );
                setAddressSearch('');
                setOpenModal(false);
              }}>
              <MaterialCommunityIcons
                name="check"
                color="#fff"
                size={30}
                style={{opacity: displayCheckButton ? 0.0 : 1.0}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: Colors.blue,
            padding: 10,
          }}>
          <TextInput
            style={{
              height: 40,
              width: '90%',
              borderRadius: 5,
              backgroundColor: '#fff',
              fontSize: 20,
              padding: 10,
            }}
            value={addressSearch}
            onChangeText={(value) => {
              searchHandler(value);
            }}
            placeholder="Search"
            autoFocus
          />
        </View>
        {!activityIndicator ? (
          <TouchableOpacity
            style={{
              paddingHorizontal: 10,
              paddingBottom: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#bdbdbd',
              width: '90%',
              alignSelf: 'center',
              marginTop: 20,

              flexDirection: 'row',
            }}
            onPress={getLocation}>
            <Icon
              name="md-locate"
              size={20}
              style={{marginRight: 10, marginTop: 3}}
              color={Colors.pink}
            />
            <Text style={{fontSize: 20, color: '#000'}}>
              Use my current location
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{marginTop: 30, paddingHorizontal: 30}}>
            <MaterialIndicator
              color={Colors.purple_darken}
              size={25}
              style={{alignSelf: 'flex-start'}}
            />
          </View>
        )}
        <FlatList
          keyboardShouldPersistTaps={'handled'}
          data={searchData}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.listView}
              onPress={() => {
                setLocationLat(item.geometry.location.lat);
                setLocationLng(item.geometry.location.lng);
                setAddressSearch(item.formatted_address);
                //setOpenModal(false);
              }}>
              <Text style={{fontSize: 18}}>{item.formatted_address}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          style={{height: '100%', paddingHorizontal: 25}}
          extraData={searchData}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  modalHeader: {
    backgroundColor: Colors.blue,
    height: 100,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 55,
  },
  listView: {
    flexDirection: 'column',
    padding: 5,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#bdbdbd',
  },
});

export default SearchAddress;
