import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {MaterialIndicator} from 'react-native-indicators';
import {useSelector, useDispatch} from 'react-redux';

import Feather from 'react-native-vector-icons/Feather';
import * as galleryActions from '../../store/actions/galleryActions';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';

const EditGalleryImages = props => {
  const user = useSelector(state => state.authReducer.user);
  const dispatch = useDispatch();

  const {
    openImageModal,
    setOpenImageModal,
    imageModalData,
    setImageModalData,
  } = props;
  //  console.log(modalData);
  return (
    <View>
      <Modal animationType="slide" transparent={false} visible={openImageModal}>
        <View style={styles.screen}>
          <View
            style={{
              flexDirection: 'row',
              zIndex: 1,
            }}>
            <View
              style={{
                left: 0,
                marginTop: 50,

                paddingLeft: 20,
                position: 'absolute',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setImageModalData({});
                  setOpenImageModal(false);
                }}>
                <Feather name="x" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                right: 0,
                marginTop: 50,
                paddingRight: 20,
                position: 'absolute',
              }}>
              <TouchableOpacity
                onPress={() => {
                  //  update db
                  dispatch(galleryActions.deleteImage(imageModalData._id));
                  setOpenImageModal(false);
                }}>
                <Feather name="trash" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <Image
            source={{uri: `${imageModalData.path}`}}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default EditGalleryImages;
