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
//import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import * as authActions from '../../store/actions/authAction';
import ButtonComponent from '../ButtonComponent';
import Confirm from '../Confirm';
import Error from '../Error';
import Loader from '../Loader';

const DisplayImages = props => {
  const user = useSelector(state => state.authReducer.user);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [cloudinaryImageId, setCloudinaryImageId] = useState('');

  const [videoPreview, setVideoPreview] = useState(
    user.user.salesVideo ? {uri: user.user.salesVideo} : {},
  );
  const [nextButton, setNextButton] = useState();
  const [removeImage, setRemoveImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoLength, setVideoLength] = useState(0);
  const [error, setError] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('Uploading please wait');

  const [image1, setImage1] = useState({uri: user.user.image1});
  const [image2, setImage2] = useState({uri: user.user.image2});
  const [image3, setImage3] = useState({uri: user.user.image3});
  const [image4, setImage4] = useState({uri: user.user.image4});
  const [image5, setImage5] = useState({uri: user.user.image5});

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
            await Object.assign(user.user, {
              image1: response.path,
            });
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
            await Object.assign(user.user, {
              image2: response.path,
            });
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
            await Object.assign(user.user, {
              image3: response.path,
            });
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
            await Object.assign(user.user, {
              image4: response.path,
            });
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
            await Object.assign(user.user, {
              image5: response.path,
            });
            setIsLoading(false);
            setImage5(source);
          }
        })
        .catch(e => {
          console.log(e);
        });
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
          await Object.assign(user.user, {
            salesVideo: resData.videoURL,
          });
          setVideoPreview({uri: resData.videoURL});
        })
        .catch(e => {
          console.log(e);
        });

      return;
    }
  };

  return (
    <View>
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

      <Loader
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        loadingMessage={loadingMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 120,
    height: 120,
    marginTop: 15,
    borderRadius: 10,
    backgroundColor: '#eeeeee',
    alignSelf: 'center',
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
    backgroundColor: '#8e24aa',
    width: 65,
    borderRadius: 50,
    alignItems: 'center',
    padding: 10,
    alignSelf: 'flex-end',
    marginTop: 30,
  },
});

export default DisplayImages;
