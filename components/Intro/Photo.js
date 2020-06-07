import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {useSelector, useDispatch} from 'react-redux';

import * as authActions from '../../store/actions/authAction';
import Colors from '../../contants/Colors';
import Confirm from '../Confirm';
import Loader from '../Loader';

import TextComponent from '../TextComponent';
import ButtonComponent from '../ButtonComponent';

const Photo = (props) => {
  const user = useSelector((state) => state.authReducer.user);
  const profile_photo_data = useSelector(
    (state) => state.authReducer.profile_photo_data,
  );

  const {
    setSectionHeaderNumber,
    setSectionHeader,
    setSectionToRender,
    setOpenPickerModal,
    imageSelectedPhoto,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const goToSection = async (section) => {
    setIsLoading(true);
    await authActions.userPhoto(profile_photo_data, user.user._id);
    setIsLoading(false);
    setSectionHeaderNumber(4);
    setSectionHeader('Profession');
    setSectionToRender(section);
  };

  const browseImage = () => {
    setOpenPickerModal(true);
  };

  return (
    <View style={{marginTop: 10}}>
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity onPress={browseImage}>
          {Object.entries(imageSelectedPhoto).length === 0 ? (
            <View style={styles.image}>
              <Icon
                name="md-add-circle"
                size={30}
                color={Colors.pink}
                style={{alignSelf: 'center', marginTop: '40%'}}
              />
            </View>
          ) : (
            <Image source={imageSelectedPhoto} style={styles.image} />
          )}
        </TouchableOpacity>

        {Object.entries(imageSelectedPhoto).length !== 0 && (
          <TouchableWithoutFeedback
            onPress={() => {
              ReactNativeHapticFeedback.trigger('impactLight', {
                enableVibrateFallback: true,
                ignoreAndroidSystemSettings: false,
              });
              goToSection('profession');
            }}>
            <View style={styles.button}>
              <Icon name="md-arrow-round-forward" size={40} color="white" />
            </View>
          </TouchableWithoutFeedback>
        )}

        <Loader
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          loadingMessage="Uploading please wait"
        />
      </View>
    </View>
  );
};

//

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    marginTop: 40,
    borderRadius: 100,
    backgroundColor: '#eeeeee',
  },
  button: {
    backgroundColor: Colors.purple_darken,
    width: 65,
    borderRadius: 50,
    alignItems: 'center',
    padding: 10,
    alignSelf: 'flex-end',
    marginRight: 10,
  },
});

export default Photo;
