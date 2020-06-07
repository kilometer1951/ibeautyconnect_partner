import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  SafeAreaView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  RefreshControl,
  Modal,
  Linking,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import * as appActions from '../store/actions/appActions';
import * as authActions from '../store/actions/authAction';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import {MaterialIndicator} from 'react-native-indicators';
import Moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import Loader from '../components/Loader';

import RefreshNetworkError from '../components/RefreshNetworkError';

const UploadPhotoId = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);

  const photo_id_front_data = useSelector(
    (state) => state.authReducer.photo_id_front_data,
  );
  const photo_id_back_data = useSelector(
    (state) => state.authReducer.photo_id_back_data,
  );

  const {
    openPhotoID_modal,
    setOpenPhotoID_modal,
    setDocumentIsVerified,
    setUploadMessage,
  } = props;
  const [photoSection, setPhotoSection] = useState('front');

  const [imageSelectedPhotoId, setImageSelectedPhotoId] = useState({});
  const [imageSelectedPhotoIdBack, setImageSelectedPhotoIdBack] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    'Uploading and saving changes',
  );
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
    setOpenPhotoID_modal(false);
    setDocumentIsVerified(true);
    setUploadMessage(true);
    setTimeout(() => {
      setUploadMessage(false);
    }, 2000);
  };

  const browseImage = () => {
    ImagePicker.openCamera({}, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error:');
      } else {
        let data = {
          uri: response.path,
          type: response.mime,
          name: response.filename + '.JPEG',
        };
        dispatch(authActions.referencePhotoIdFrontData(data));
        //setPhotoSectionButton('back');
        setImageSelectedPhotoId({uri: response.path});
      }
    });
  };

  const browseBackImage = () => {
    ImagePicker.openCamera({}, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error:');
      } else {
        let data = {
          uri: response.path,
          type: response.mime,
          name: response.filename + '.JPEG',
        };
        dispatch(authActions.referencePhotoIdBackData(data));
        setImageSelectedPhotoIdBack({uri: response.path});
      }
    });
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
    <Modal
      animationType="slide"
      transparent={false}
      visible={openPhotoID_modal}>
      <SafeAreaView>
        <TouchableWithoutFeedback
          onPress={() => {
            setOpenPhotoID_modal(false);
          }}>
          <View
            style={{
              marginHorizontal: 20,
              paddingTop: 4,
            }}>
            <Icon name="md-close" size={30} color="#000" />
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
      <ScrollView>
        <View style={{padding: 10}}>
          <Text style={{fontSize: 17, fontFamily: Fonts.poppins_regular}}>
            Inorder to proccess your earnings, an image of the front is required
            for government-issued IDs and driver’s licenses. Image should be in
            color and have all information clearly legible. Files should be in
            color, be rotated with the image right-side up, and have all
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
                      <Image
                        source={imageSelectedPhotoId}
                        style={styles.image}
                      />
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
      </ScrollView>
      <Loader
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        loadingMessage={loadingMessage}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
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

export default UploadPhotoId;
