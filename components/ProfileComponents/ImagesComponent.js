import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  RefreshControl,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import EditGalleryImages from './EditGalleryImages';

import ImageView from 'react-native-image-view';
import Icon from 'react-native-vector-icons/Ionicons';
import * as appActions from '../../store/actions/appActions';
import {MaterialIndicator} from 'react-native-indicators';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';

const ImagesComponent = props => {
  const user = useSelector(state => state.authReducer.user);
  const imagesData = useSelector(state => state.appReducer.imagesData);
  const dispatch = useDispatch();
  const [page, setPage] = useState(2);
  const [endOfFile, setEndOfFile] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);
  const [activity, setActivity] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [imageModalData, setImageModalData] = useState({});

  useEffect(() => {
    const loadImages = async () => {
      try {
        setActivity(true);
        await dispatch(appActions.getImages(user.user._id, 1));
        setActivity(false);
      } catch (e) {
        console.log(e);
      }
    };
    loadImages();
  }, []);

  const handleLoadMorePhotos = async () => {
    try {
      if (!endOfFile) {
        if (!isLoadingMoreData) {
          setIsLoadingMoreData(true);
          const res = await dispatch(
            appActions.handleLoadMorePhotos(user.user._id, page),
          );
          setIsLoadingMoreData(false);
          setPage(prev => (prev = prev + 1));
          //  await setImagesData(prev => [...prev, ...response.images]);
        }
      }
    } catch (e) {
      setIsLoadingMoreData(false);
      setEndOfFile(true);
    }
  };

  const handleRefreshPhoto = async () => {
    setIsRefreshing(true);
    setEndOfFile(false);
    setPage(2);
    await dispatch(appActions.getImages(user.user._id, 1));
    setIsRefreshing(false);
  };
  const handleImagePreivew = item => {
    setImageModalData(item);
    setOpenImageModal(true);
  };

  const renderItem = ({item}) => (
    <View style={styles.imageGrid}>
      <TouchableWithoutFeedback onPress={handleImagePreivew.bind(this, item)}>
        <View style={styles.imageContainer}>
          <Image
            source={{uri: `${item.path}`}}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );

  let images;
  if (imagesData.length === 0) {
    return (images = activity ? (
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
        }}>
        <Icon name="md-images" size={30} color="#9e9e9e" />
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 15,
            color: '#9e9e9e',
            textAlign: 'center',
          }}>
          You have not added any portfolio yet. Click the add image button at
          the top to add your portfolio.
        </Text>
      </View>
    ));
  }
  images = (
    <FlatList
      refreshControl={
        <RefreshControl
          onRefresh={handleRefreshPhoto}
          refreshing={isRefreshing}
          title="Pull to refresh"
          tintColor={Colors.pink}
          titleColor={Colors.pink}
        />
      }
      data={imagesData}
      renderItem={renderItem}
      keyExtractor={item => item._id}
      numColumns={3}
      extraData={imagesData}
      onEndReachedThreshold={0.5}
      initialNumToRender={20}
      style={{marginTop: 2}}
      onMomentumScrollBegin={() => {
        handleLoadMorePhotos();
      }}
      ListFooterComponent={
        <View
          style={{
            alignItems: 'center',
            position: 'absolute',
            alignSelf: 'center',
          }}>
          {isLoadingMoreData && (
            <MaterialIndicator color={Colors.purple_darken} size={30} />
          )}
          {endOfFile &&
            (imagesData.length > 16 && (
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  color: Colors.grey_darken,
                }}>
                No more images to load
              </Text>
            ))}
        </View>
      }
    />
  );

  return (
    <View style={styles.screen}>
      {activity ? (
        <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
          <MaterialIndicator
            color={Colors.purple_darken}
            style={{marginTop: 30}}
          />
        </View>
      ) : (
        images
      )}

      <ImageView
        images={previewData}
        imageIndex={0}
        isVisible={previewModal}
        onClose={() => setPreviewModal(false)}
        glideAlways
        animationType="fade"
      />

      <EditGalleryImages
        openImageModal={openImageModal}
        setOpenImageModal={setOpenImageModal}
        imageModalData={imageModalData}
        setImageModalData={setImageModalData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  imageGrid: {
    marginHorizontal: 1,
  },
  imageContainer: {
    width: 136,
    height: 136,
    marginBottom: 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImagesComponent;
