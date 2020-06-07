import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import * as authActions from '../../store/actions/authAction';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Confirm from '../Confirm';
import Loader from '../Loader';

import TextComponent from '../TextComponent';
import ButtonComponent from '../ButtonComponent';

const PhotoID = (props) => {
  const user = useSelector((state) => state.authReducer.user);
  const photo_id_front_data = useSelector(
    (state) => state.authReducer.photo_id_front_data,
  );
  const photo_id_back_data = useSelector(
    (state) => state.authReducer.photo_id_back_data,
  );

  const {
    setSectionHeaderNumber,
    setSectionHeader,
    setSectionToRender,
    navigation,
    openPickerModal,
    setOpenPickerModal,
    imageSelectedPhotoId,
    setIsLoading,
    setOpenPickerBackModal,
    imageSelectedPhotoIdBack,
  } = props;
  const [dialogVisible, setDialogVisible] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Uploading please wait');
  const [imageSelectedPhoto, setImageSelectedPhoto] = useState({});
  const [nextButton, setNextButton] = useState();
  const [photoSection, setPhotoSection] = useState('front');
  //console.log(governmentPhotoId);
  const dispatch = useDispatch();

  const onNext = async () => {
    setIsLoading(true);
    const upload = await authActions.uploadPhotoIdFront(
      photo_id_front_data,
      user.user._id,
    );
    setIsLoading(false);
    setPhotoSection('back');
  };

  const onDone = async () => {
    setIsLoading(true);
    const upload = await authActions.uploadPhotoIdBack(
      photo_id_back_data,
      user.user._id,
    );
    setIsLoading(false);
    await dispatch(authActions.authUser(upload.user));
    navigation.navigate('Main', {displayScreen: 'home'});
  };

  const browseImage = () => {
    setOpenPickerModal(true);
  };

  const browseBackImage = () => {
    setOpenPickerBackModal(true);
  };

  let buttonToRender;

  if (photoSection === 'front') {
    buttonToRender = Object.entries(imageSelectedPhotoId).length !== 0 && (
      <TouchableWithoutFeedback
        onPress={() => {
          ReactNativeHapticFeedback.trigger('impactLight', {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: false,
          });
          onNext();
        }}>
        <View style={styles.button}>
          <Icon name="md-arrow-round-forward" size={40} color="white" />
        </View>
      </TouchableWithoutFeedback>
    );
  } else {
    buttonToRender = Object.entries(imageSelectedPhotoIdBack).length !== 0 && (
      <TouchableWithoutFeedback
        onPress={() => {
          ReactNativeHapticFeedback.trigger('impactLight', {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: false,
          });
          onDone();
        }}>
        <View style={styles.button}>
          <Icon name="md-arrow-round-forward" size={40} color="white" />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <View style={{marginTop: 10}}>
      <View>
        <Text style={{fontSize: 17, fontFamily: Fonts.poppins_regular}}>
          We need a copy of any government-issued ID. This is for verification
          purposes. Inorder to proccess your earnings, an image of the front is
          required for government-issued IDs and driver’s licenses. Image should
          be in color and have all information clearly legible. Files should be
          in color, be rotated with the image right-side up, and have all
          information clearly legible. Raise your phone above image to take a
          clear photo.
        </Text>
        <Text
          style={{
            fontSize: 27,
            fontFamily: Fonts.poppins_semibold,
            marginTop: 30,
            textAlign: 'center',
          }}>
          {photoSection === 'front' ? 'Front' : 'Back'}
        </Text>
        <View style={{alignItems: 'center'}}>
          {photoSection === 'front' ? (
            <>
              <TouchableOpacity onPress={browseImage}>
                {Object.entries(imageSelectedPhotoId).length === 0 ? (
                  <View style={styles.image}>
                    <Icon
                      name="md-add-circle"
                      color={Colors.pink}
                      size={30}
                      style={{alignSelf: 'center', marginTop: '28%'}}
                    />
                  </View>
                ) : (
                  <View>
                    <View style={styles.changeImageButton}>
                      <Icon
                        name="md-close-circle"
                        color="#fff"
                        size={30}
                        style={{left: 8}}
                      />
                    </View>
                    <Image source={imageSelectedPhotoId} style={styles.image} />
                  </View>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={browseBackImage}>
                {Object.entries(imageSelectedPhotoIdBack).length === 0 ? (
                  <View style={styles.image}>
                    <Icon
                      name="md-add-circle"
                      color={Colors.pink}
                      size={30}
                      style={{alignSelf: 'center', marginTop: '28%'}}
                    />
                  </View>
                ) : (
                  <View>
                    <View style={styles.changeImageButton}>
                      <Icon
                        name="md-close-circle"
                        color="#fff"
                        size={30}
                        style={{left: 8}}
                      />
                    </View>
                    <Image
                      source={imageSelectedPhotoIdBack}
                      style={styles.image}
                    />
                  </View>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

        {buttonToRender}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 370,
    height: 250,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#eeeeee',
    alignSelf: 'center',
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
    position: 'absolute',
    zIndex: 1,
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 8,
    width: '100%',
  },
});

export default PhotoID;
