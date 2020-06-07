import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Button,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Video from 'react-native-video';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {useSelector, useDispatch} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import * as authActions from '../../store/actions/authAction';
import ButtonComponent from '../ButtonComponent';
import Confirm from '../Confirm';
import Error from '../Error';
import Loader from '../Loader';

const UploadVideo = props => {
  const user = useSelector(state => state.authReducer.user);

  const {setSectionHeaderNumber, setSectionHeader, setSectionToRender} = props;
  const [dialogVisible, setDialogVisible] = useState(false);

  const [cloudinaryImageId, setCloudinaryImageId] = useState('');
  const [videoPreview, setVideoPreview] = useState({});
  const [nextButton, setNextButton] = useState();
  const [removeImage, setRemoveImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoLength, setVideoLength] = useState(0);
  const [error, setError] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('Uploading please wait');

  const [image1, setImage1] = useState({});
  const [image2, setImage2] = useState({});
  const [image3, setImage3] = useState({});
  const [image4, setImage4] = useState({});
  const [image5, setImage5] = useState({});

  const goToSection = section => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };
    ReactNativeHapticFeedback.trigger('impactLight', options);
    setSectionHeaderNumber(4);
    setSectionHeader('Instant Pay');
    setSectionToRender(section);
  };

  const browseImage = display => {
    if (display === 'image1') {
      ImagePicker.openPicker({
        multiple: false,
        mediaType: 'photo',
      })
        .then(async response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error:');
          } else {
            const source = {uri: response.path};

            let data = {
              uri: response.path,
              type: response.mime,
              name: response.filename,
            };
            setIsLoading(true);
            await authActions.uploadBestFive(data, user.user._id, display);
            setIsLoading(false);
            setImage1(source);
          }
        })
        .catch(e => {
          console.log(e);
        });
      return;
    }
    if (display === 'image2') {
      ImagePicker.openPicker({
        multiple: false,
        mediaType: 'photo',
      })
        .then(async response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error:');
          } else {
            const source = {uri: response.path};

            let data = {
              uri: response.path,
              type: response.mime,
              name: response.filename,
            };
            setIsLoading(true);
            await authActions.uploadBestFive(data, user.user._id, display);
            setIsLoading(false);
            setImage2(source);
          }
        })
        .catch(e => {
          console.log(e);
        });
      return;
    }
    if (display === 'image3') {
      ImagePicker.openPicker({
        multiple: false,
        mediaType: 'photo',
      })
        .then(async response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error:');
          } else {
            const source = {uri: response.path};

            let data = {
              uri: response.path,
              type: response.mime,
              name: response.filename,
            };
            setIsLoading(true);
            await authActions.uploadBestFive(data, user.user._id, display);
            setIsLoading(false);
            setImage3(source);
          }
        })
        .catch(e => {
          console.log(e);
        });
      return;
    }
    if (display === 'image4') {
      ImagePicker.openPicker({
        multiple: false,
        mediaType: 'photo',
      })
        .then(async response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error:');
          } else {
            const source = {uri: response.path};

            let data = {
              uri: response.path,
              type: response.mime,
              name: response.filename,
            };
            setIsLoading(true);
            await authActions.uploadBestFive(data, user.user._id, display);
            setIsLoading(false);
            setImage4(source);
          }
        })
        .catch(e => {
          console.log(e);
        });
      return;
    }
    if (display === 'image5') {
      ImagePicker.openPicker({
        multiple: false,
        mediaType: 'photo',
      })
        .then(async response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error:');
          } else {
            const source = {uri: response.path};

            let data = {
              uri: response.path,
              type: response.mime,
              name: response.filename,
            };
            setIsLoading(true);
            await authActions.uploadBestFive(data, user.user._id, display);
            setIsLoading(false);
            setImage5(source);
          }
        })
        .catch(e => {
          console.log(e);
        });
      return;
    }
    if (display === 'video') {
      ImagePicker.openPicker({
        mediaType: 'video',
      })
        .then(async video => {
          let data = {
            uri: video.sourceURL,
            type: video.mime,
            name: video.filename,
          };
          setIsLoading(true);
          const resData = await authActions.uploadBestFive(
            data,
            user.user._id,
            display,
          );
          setIsLoading(false);
          console.log(resData);
          setVideoPreview({uri: resData.videoURL});
        })
        .catch(e => {
          console.log(e);
        });

      return;
    }
  };
  let button;

  if (
    (Object.entries(image1).length &&
      Object.entries(image2).length &&
      Object.entries(image3).length &&
      Object.entries(image4).length &&
      Object.entries(image5).length) !== 0
  ) {
    button = (
      <TouchableWithoutFeedback
        onPress={() => {
          ReactNativeHapticFeedback.trigger('impactLight', {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: false,
          });
          if (videoLength > 124) {
            setError('Video length to long. Max is 2:05 minute');
            return;
          }
          goToSection('instantPay');
        }}>
        <View style={styles.button}>
          <Ionicons name="md-arrow-round-forward" size={40} color="white" />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <View style={{marginTop: 10}}>
      <Text style={{fontSize: 20, fontFamily: Fonts.poppins_regular}}>
        Lets get your best five work and a two minutes video showing you doing
        what you do best. This is your display page.
      </Text>
      {error !== '' && <Error error={error} />}

      <View style={styles.container}>
        {Object.entries(image1).length === 0 ? (
          <TouchableOpacity onPress={browseImage.bind(this, 'image1')}>
            <View style={styles.image}>
              <Ionicons
                name="md-images"
                color={Colors.pink}
                size={30}
                style={{alignSelf: 'center', marginTop: '40%'}}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={browseImage.bind(this, 'image1')}>
            <View style={styles.changeImageButton}>
              <Ionicons
                name="md-close-circle"
                color="#fff"
                size={30}
                style={{left: 5}}
              />
            </View>

            <Image source={image1} style={styles.image} />
          </TouchableOpacity>
        )}
        {Object.entries(image2).length === 0 ? (
          <TouchableOpacity onPress={browseImage.bind(this, 'image2')}>
            <View style={styles.image}>
              <Ionicons
                name="md-images"
                color={Colors.pink}
                size={30}
                style={{alignSelf: 'center', marginTop: '40%'}}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={browseImage.bind(this, 'image2')}>
            <View style={styles.changeImageButton}>
              <Ionicons
                name="md-close-circle"
                color="#fff"
                size={30}
                style={{left: 5}}
              />
            </View>

            <Image source={image2} style={styles.image} />
          </TouchableOpacity>
        )}
        {Object.entries(image3).length === 0 ? (
          <TouchableOpacity onPress={browseImage.bind(this, 'image3')}>
            <View style={styles.image}>
              <Ionicons
                name="md-images"
                color={Colors.pink}
                size={30}
                style={{alignSelf: 'center', marginTop: '40%'}}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={browseImage.bind(this, 'image3')}>
            <View style={styles.changeImageButton}>
              <Ionicons
                name="md-close-circle"
                color="#fff"
                size={30}
                style={{left: 5}}
              />
            </View>

            <Image source={image3} style={styles.image} />
          </TouchableOpacity>
        )}
        {Object.entries(image4).length === 0 ? (
          <TouchableOpacity onPress={browseImage.bind(this, 'image4')}>
            <View style={styles.image}>
              <Ionicons
                name="md-images"
                color={Colors.pink}
                size={30}
                style={{alignSelf: 'center', marginTop: '40%'}}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={browseImage.bind(this, 'image4')}>
            <View style={styles.changeImageButton}>
              <Ionicons
                name="md-close-circle"
                color="#fff"
                size={30}
                style={{left: 5}}
              />
            </View>

            <Image source={image4} style={styles.image} />
          </TouchableOpacity>
        )}
        {Object.entries(image5).length === 0 ? (
          <TouchableOpacity onPress={browseImage.bind(this, 'image5')}>
            <View style={styles.image}>
              <Ionicons
                name="md-images"
                color={Colors.pink}
                size={30}
                style={{alignSelf: 'center', marginTop: '40%'}}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={browseImage.bind(this, 'image5')}>
            <View style={styles.changeImageButton}>
              <Ionicons
                name="md-close-circle"
                color="#fff"
                size={30}
                style={{left: 5}}
              />
            </View>

            <Image source={image5} style={styles.image} />
          </TouchableOpacity>
        )}

        {Object.entries(videoPreview).length === 0 ? (
          <TouchableOpacity onPress={browseImage.bind(this, 'video')}>
            <View style={styles.image}>
              <Ionicons
                name="md-videocam"
                color={Colors.pink}
                size={30}
                style={{alignSelf: 'center', marginTop: '40%'}}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={browseImage.bind(this, 'video')}>
            <View style={styles.changeImageButton}>
              <Ionicons
                name="md-close-circle"
                color="#fff"
                size={30}
                style={{left: 5}}
              />
            </View>
            <Video
              source={videoPreview}
              style={styles.image}
              muted={true}
              repeat={true}
              resizeMode={'cover'}
              rate={1.0}
              onBuffer={() => {
                console.log('buff');
              }}
              onError={e => {
                console.log(e);
              }}
              onLoad={load => {
                setVideoLength(parseInt(load.duration));
              }}
            />
          </TouchableOpacity>
        )}
      </View>

      {button}

      <Loader
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        loadingMessage={loadingMessage}
      />
    </View>
  );
};

// <View style={{alignItems: 'center'}}>
//   {videoPreview.uri && (
//     <TouchableOpacity onPress={browseImage}>
//       <MaterialCommunityIcons
//         name="pencil"
//         color={Colors.tan}
//         size={30}
//         style={{marginRight: 30, alignSelf: 'center', marginTop: 30}}
//       />

//     </TouchableOpacity>
//   )}
//   <View
//     style={{
//       flexDirection: 'row',
//       justifyContent: 'space-around',
//     }}>
//     {nextButton}
//   </View>
//   <Confirm
//     dialogVisible={dialogVisible}
//     setDialogVisible={setDialogVisible}
//     action={goToSection.bind(this, 'instantPay')}
//     title="Will you like to use this video?"
//   />
// </View>

const styles = StyleSheet.create({
  image: {
    width: 110,
    height: 110,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: '#eeeeee',
    alignSelf: 'center',
  },
  backgroundVideo: {
    height: 300,
    width: 400,
    position: 'relative',
    zIndex: -1,
    backgroundColor: '#000',
    marginTop: 20,
    marginBottom: 20,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  changeImageButton: {
    alignItems: 'flex-end',
    marginTop: '8%',
    position: 'absolute',
    zIndex: 1,
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 8,
    width: '100%',
  },
  button: {
    backgroundColor: Colors.purple_darken,
    width: 65,
    borderRadius: 50,
    alignItems: 'center',
    padding: 10,
    alignSelf: 'flex-end',
    marginTop: 30,
  },
});

export default UploadVideo;
