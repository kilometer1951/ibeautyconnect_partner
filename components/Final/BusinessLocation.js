import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import * as authActions from '../../store/actions/authAction';

import ButtonComponent from '../ButtonComponent';
//import SearchAddress from './SearchAddress';

const BusinessLocation = props => {
  const {
    businessAddress,
    setBusinessAddress,
    setSectionToRender,
    setSectionHeader,
    setSectionHeaderNumber,
    businessAddressLine1,
    setBusinessAddressLine1,
    businessCity,
    setBusinessCity,
    businessState,
    setBusinessState,
    businessPostal,
    setBusinessPostal,
    userId,
  } = props;

  const [addressSearch, setAddressSearch] = useState('');

  const [openModal, setOpenModal] = useState(false);
  const [activityIndicator, setActivityIndicator] = useState(false);

  const myApiKey = 'AIzaSyDEeUA1zS0cT-YHR8UyawDsYkoJop-enog';

  const goToSection = async section => {
    //update business location and move next
    //  setActivityIndicator(true);
    authActions.updateBusinessAddress(
      userId,
      businessAddress,
      businessAddressLine1,
      businessCity,
      businessState,
      businessPostal,
    );
    //  setActivityIndicator(false);
    setSectionToRender('services');
    setSectionHeader('Services');
    setSectionHeaderNumber(2);
  };

  return (
    <View style={styles.screen}>
      <Text style={{fontSize: 20}}>
        Your business location can be your home or an established facility where
        you serve your clients
      </Text>
      <Text style={{marginTop: 20, fontSize: 18}}>{businessAddress}</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity
          style={{marginTop: 15}}
          onPress={() => {
            setAddressSearch('');
            setOpenModal(true);
          }}>
          <Text style={{fontSize: 20, color: 'blue'}}>Edit Location </Text>
        </TouchableOpacity>
      </View>
      {!activityIndicator ? (
        <ButtonComponent
          styles={{
            width: '100%',
            marginTop: 40,
          }}
          title="Next"
          onButtonPress={goToSection.bind(this, 'services')}
        />
      ) : (
        <ActivityIndicator style={{marginTop: 40}} />
      )}
    </View>
  );
};

// {openModal && (
//   <SearchAddress
//     setAddressSearch={setAddressSearch}
//     openModal={openModal}
//     setBusinessAddress={setBusinessAddress}
//     setOpenModal={setOpenModal}
//     addressSearch={addressSearch}
//     setBusinessAddressLine1={setBusinessAddressLine1}
//     setBusinessCity={setBusinessCity}
//     setBusinessState={setBusinessState}
//     setBusinessPostal={setBusinessPostal}
//   />
// )}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default BusinessLocation;
