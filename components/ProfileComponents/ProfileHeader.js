import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  SafeAreaView,
  Image,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import {useSelector, useDispatch} from 'react-redux';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import * as appActions from '../../store/actions/appActions';
import * as galleryActions from '../../store/actions/galleryActions';

import Icon from 'react-native-vector-icons/Ionicons';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import ButtonComponent from '../ButtonComponent';

const ProfileHeader = (props) => {
  const {setOpenModal, setIsLoading, setLoadingMessage} = props;
  const user = useSelector((state) => state.authReducer.user);
  const dispatch = useDispatch();

  const handleUploadImages = () => {
    ImagePicker.openPicker({
      maxFiles: 10,
      multiple: true,
      mediaType: 'photo',
      showsSelectedCount: true,
    })
      .then(async (images) => {
        setIsLoading(true);
        setLoadingMessage('Uploading please wait');
        let i = 0;
        await images.forEach(async (image, index) => {
          let upload = {
            uri: image.path,
            type: image.mime,
            name: image.filename,
          };
          await dispatch(galleryActions.uploadImages(upload, user.user._id));
          //console.log(++i);
          setLoadingMessage('Uploading ' + ++i + ' of ' + images.length);
          if (index === images.length - 1) {
            setLoadingMessage('Uploading please wait');
            setIsLoading(false);
          }
          //  setImagesData(prev => [...prev, response.image]);
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleUploadvideos = async () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'video',
      showsSelectedCount: true,
    })
      .then(async (videos) => {
        setIsLoading(true);
        setLoadingMessage('Uploading please wait');
        let i = 0;
        await videos.forEach(async (video, index) => {
          let upload = {
            uri: video.path,
            type: video.mime,
            name: video.filename,
          };
          await dispatch(galleryActions.uploadVideos(upload, user.user._id));
          setLoadingMessage('Uploading ' + ++i + ' of ' + videos.length);
          if (index === videos.length - 1) {
            setLoadingMessage('Uploading please wait');
            setIsLoading(false);
          }
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <View>
      <View style={styles.topHeader}>
        <View style={styles.leftHeader}>
          <View>
            <View style={styles.imageContainer}>
              <Image
                source={{uri: user.user.profilePhoto}}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        <View style={styles.rightHeader}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.poppins_semibold,
              fontSize: 20,
            }}>
            @{user.user.fName + ' ' + user.user.lName}
          </Text>
          <Text style={styles.professionTagText}>
            Verified {'License ' + user.user.profession}
          </Text>
          <View>
            <Text style={styles.professionTagText}>
              {user.user.address + ', ' + user.user.locationCity + ', '}
            </Text>
          </View>
          <View style={{flexDirection: 'row', width: '95%'}}>
            <Text style={styles.professionTagText}>
              {user.user.locationState + ',' + user.user.postal_code}
            </Text>
            <TouchableWithoutFeedback onPress={() => setOpenModal(true)}>
              <Icon
                name="md-create"
                size={17}
                color={Colors.pink}
                style={{width: 25}}
              />
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
      <View style={{paddingHorizontal: 10, marginBottom: 10, marginTop: 5}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginLeft: 25,
            marginRight: 10,
          }}>
          <TouchableWithoutFeedback onPress={handleUploadImages}>
            <View style={{flexDirection: 'row'}}>
              <Icon name="ios-images" size={17} color={Colors.pink} />
              <Text style={{fontFamily: Fonts.poppins_regular, marginLeft: 5}}>
                Add Images
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={handleUploadvideos}>
            <View style={{flexDirection: 'row', marginLeft: 10}}>
              <Icon name="ios-videocam" size={17} color={Colors.pink} />
              <Text style={{fontFamily: Fonts.poppins_regular, marginLeft: 5}}>
                Add Videos
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 150,
    borderColor: 'black',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },

  professionTagText: {
    fontFamily: Fonts.poppins_regular,
    paddingRight: 10,
    marginLeft: 5,
    fontSize: 15,
  },

  topHeader: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    width: '100%',
    marginTop: 10,
  },

  leftHeader: {
    width: '23%',
    flexDirection: 'row',
  },
  rightHeader: {
    width: '76%',
    marginLeft: 7,
  },
});

export default ProfileHeader;
