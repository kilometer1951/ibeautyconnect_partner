import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, SafeAreaView, ScrollView} from 'react-native';

import UploadVideo from '../components/Final/UploadVideo';
import Services from '../components/Final/Services';
import BusinessLocation from '../components/Final/BusinessLocation';
import ComfortServices from '../components/Final/ComfortServices';
import InstantPay from '../components/Final/InstantPay';
import BankInfo from '../components/Final/BankInfo';
import PhotoID from '../components/Final/PhotoID';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ImagePickerModalPhotoID from '../components/ImagePickerModalPhotoID';
import ImagePickerModalPhotoIDBack from '../components/ImagePickerModalPhotoIDBack';
import Loader from '../components/Loader';
import RefreshNetworkError from '../components/RefreshNetworkError';

const FinalScreen = (props) => {
  const resData = props.navigation.getParam('resData');
  //console.log(resData);
  const {cardId, debitCardLastFour, bankLastFour, bankId} = resData;

  const dateOfBirth = resData.dob;

  const [sectionHeader, setSectionHeader] = useState('Services');
  const [sectionToRender, setSectionToRender] = useState('services');
  const [sectionHeaderNumber, setSectionHeaderNumber] = useState(1);

  const [openPickerModal, setOpenPickerModal] = useState(false);
  const [imageSelectedPhotoId, setImageSelectedPhotoId] = useState({});

  const [openPickerBackModal, setOpenPickerBackModal] = useState(false);
  const [imageSelectedPhotoIdBack, setImageSelectedPhotoIdBack] = useState({});
  //const [photoSectionButton, setPhotoSectionButton] = useState('front');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    'Uploading and saving changes',
  );

  if (sectionToRender === 'services') {
    section = (
      <Services
        setSectionHeaderNumber={setSectionHeaderNumber}
        setSectionHeader={setSectionHeader}
        setSectionToRender={setSectionToRender}
      />
    );
  }

  if (sectionToRender === 'comfortServices') {
    section = (
      <ComfortServices
        setSectionHeaderNumber={setSectionHeaderNumber}
        setSectionHeader={setSectionHeader}
        setSectionToRender={setSectionToRender}
      />
    );
  }

  if (sectionToRender === 'uploadVideo') {
    section = (
      <ScrollView
        style={{height: '100%'}}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        <UploadVideo
          setSectionHeaderNumber={setSectionHeaderNumber}
          setSectionHeader={setSectionHeader}
          setSectionToRender={setSectionToRender}
        />
      </ScrollView>
    );
  }

  if (sectionToRender === 'instantPay') {
    section = (
      <ScrollView style={{height: '100%'}} keyboardShouldPersistTaps="always">
        <InstantPay
          setSectionHeaderNumber={setSectionHeaderNumber}
          setSectionHeader={setSectionHeader}
          setSectionToRender={setSectionToRender}
          cardId={cardId}
          dateOfBirth={dateOfBirth}
          debitCardLastFour={debitCardLastFour}
        />
      </ScrollView>
    );
  }
  if (sectionToRender === 'bankinfo') {
    section = (
      <ScrollView style={{height: '100%'}} keyboardShouldPersistTaps="always">
        <BankInfo
          setSectionHeaderNumber={setSectionHeaderNumber}
          setSectionHeader={setSectionHeader}
          setSectionToRender={setSectionToRender}
          bankLastFour={bankLastFour}
          bankId={bankId}
          navigation={props.navigation}
        />
      </ScrollView>
    );
  }
  if (sectionToRender === 'photoId') {
    section = (
      <ScrollView style={{height: '100%'}} keyboardShouldPersistTaps="always">
        <PhotoID
          setSectionHeaderNumber={setSectionHeaderNumber}
          setSectionHeader={setSectionHeader}
          setSectionToRender={setSectionToRender}
          navigation={props.navigation}
          openPickerModal={openPickerModal}
          setOpenPickerModal={setOpenPickerModal}
          setOpenPickerBackModal={setOpenPickerBackModal}
          imageSelectedPhotoId={imageSelectedPhotoId}
          imageSelectedPhotoIdBack={imageSelectedPhotoIdBack}
          setIsLoading={setIsLoading}
        />
      </ScrollView>
    );
  }

  return (
    <View style={styles.screen}>
      <RefreshNetworkError navigation={props.navigation} />
      <SafeAreaView style={styles.screen}>
        <Text
          style={{
            marginTop: 20,
            fontSize: 20,
            fontWeight: '800',
            fontFamily: Fonts.poppins_bold,
          }}>
          ({sectionHeaderNumber}/6) {sectionHeader}
        </Text>
        {section}
      </SafeAreaView>

      <ImagePickerModalPhotoID
        openPickerModal={openPickerModal}
        setOpenPickerModal={setOpenPickerModal}
        setImageSelectedPhotoId={setImageSelectedPhotoId}
      />

      <ImagePickerModalPhotoIDBack
        openPickerBackModal={openPickerBackModal}
        setOpenPickerBackModal={setOpenPickerBackModal}
        setImageSelectedPhotoIdBack={setImageSelectedPhotoIdBack}
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
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
});

export default FinalScreen;
