import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  SafeAreaView,
  Image,
  Switch,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Fonts from '../contants/Fonts';

import Colors from '../contants/Colors';
import * as authActions from '../store/actions/authAction';

const AppHeader = (props) => {
  const user = useSelector((state) => state.authReducer.user);
  const {
    setActiveTab,
    navigation,
    viewToRender,
    setOnlineOfflineView,
    onlineOfflineView,
    setOnlineOfflineText,
    onlineOfflineText,
  } = props;
  const [online, setOnline] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const loadFromUrl = async () => {
      const response = await authActions.getAuthUser(user.user._id);
      setOnline(response.liveRequest);
      //console.log(response);
    };
    loadFromUrl();
  }, []);

  return (
    <View style={styles.header}>
      <SafeAreaView>
        <View
          style={[
            {...styles.headerContainer},
            {
              justifyContent:
                viewToRender !== 'home' ? 'flex-end' : 'space-between',
            },
          ]}>
          {viewToRender === 'home' && (
            <TouchableWithoutFeedback
              onPress={() => {
                setActiveTab('profile');
                navigation.navigate('Main', {displayScreen: 'profile'});
              }}>
              <View style={styles.imageContainer}>
                <Image
                  source={{uri: user.user.profilePhoto}}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            </TouchableWithoutFeedback>
          )}

          {viewToRender === 'home' && (
            <View>
              <Switch
                value={online}
                onValueChange={async () => {
                  ReactNativeHapticFeedback.trigger('impactLight', {
                    enableVibrateFallback: true,
                    ignoreAndroidSystemSettings: false,
                  });
                  const userId = user.user._id;
                  setOnlineOfflineView(true);
                  setTimeout(() => {
                    setOnlineOfflineView(false);
                  }, 1000);
                  setOnline((prev) => {
                    setOnlineOfflineText(!prev);
                    return !prev;
                  });
                  fetch(
                    `https://ibeautyconnectserver.herokuapp.com/api/online_status`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        userId,
                      }),
                    },
                  );
                }}
                trackColor={{true: Colors.purple_darken}}
              />
            </View>
          )}

          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate('Setting');
            }}>
            <View>
              <Icon name="ios-options" size={30} color={Colors.light_grey} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '11%',
    backgroundColor: 'white',
    top: 0,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: 34,
    height: 34,
    borderRadius: 150,
    borderColor: 'black',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default AppHeader;
