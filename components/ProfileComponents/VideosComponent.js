import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Video from 'react-native-video';
import {MaterialIndicator} from 'react-native-indicators';
import Icon from 'react-native-vector-icons/Ionicons';

import EditGalleryVideos from './EditGalleryVideos';

import * as appActions from '../../store/actions/appActions';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';

const VideosComponent = props => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.authReducer.user);
  const videoData = useSelector(state => state.appReducer.videoData);
  const [activity, setActivity] = useState(false);

  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [videoModalData, setVideoModalData] = useState({});

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setActivity(true);
        await dispatch(appActions.getVideos(user.user._id, 1));
        setActivity(false);
      } catch (e) {
        console.log(e);
      }
    };
    loadVideos();
  }, []);

  const renderItem = ({item}) => (
    <View style={styles.videoGrid}>
      <TouchableWithoutFeedback
        onPress={() => {
          setVideoModalData(item);
          setOpenVideoModal(true);
        }}>
        <View style={styles.videoContainer}>
          <Video
            source={{uri: `${item.path}`}}
            style={styles.video}
            onBuffer={() => {
              console.log('buff');
            }}
            onError={() => {
              console.log('error');
            }}
            resizeMode="cover"
            paused={true}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );

  let videos;
  if (videoData.length === 0) {
    return (videos = activity ? (
      <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
        <MaterialIndicator
          color={Colors.purple_darken}
          style={{marginTop: 30}}
        />
      </View>
    ) : (
      <View
        style={{
          marginTop: '50%',
          alignItems: 'center',
          flex: 1,
          paddingHorizontal: 20,
        }}>
        <Icon name="md-videocam" size={30} color="#9e9e9e" />
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 15,
            color: '#9e9e9e',
            textAlign: 'center',
          }}>
          You have not added any videos of your work. You have a maximum of 10
          videos. Click the add videos button at the top to get started.
        </Text>
      </View>
    ));
  }
  videos = (
    <View style={{flex: 1, marginTop: 1}}>
      <FlatList
        data={videoData}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        numColumns={3}
        extraData={videoData}
      />
    </View>
  );
  return (
    <View style={{flex: 1}}>
      {activity ? (
        <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
          <MaterialIndicator
            color={Colors.purple_darken}
            style={{marginTop: 30}}
          />
        </View>
      ) : (
        videos
      )}

      <EditGalleryVideos
        openVideoModal={openVideoModal}
        setOpenVideoModal={setOpenVideoModal}
        videoModalData={videoModalData}
        setVideoModalData={setVideoModalData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  videoGrid: {
    marginHorizontal: 1,
  },
  videoContainer: {
    width: 136,
    height: 136,
    marginBottom: 2,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default VideosComponent;
