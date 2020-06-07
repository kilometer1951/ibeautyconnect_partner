import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
  Linking,
  FlatList,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import AppFooter from '../components/AppFooter';
import * as appActions from '../store/actions/appActions';
import Moment from 'moment';
import {MaterialIndicator} from 'react-native-indicators';
import RefreshNetworkError from '../components/RefreshNetworkError';

import Icon from 'react-native-vector-icons/Ionicons';

import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';

import io from 'socket.io-client';
import {URL} from '../socketURL';

const MessageScreen = (props) => {
  const socket = io(URL);
  const dispatch = useDispatch();

  const messages = useSelector((state) => state.appReducer.messages);

  const user = useSelector((state) => state.authReducer.user);

  const [activeTab, setActiveTab] = useState('message');
  const [today, setToday] = useState(new Date());
  const partnerId = user.user._id;

  const [isLoading, setIsloading] = useState(false);

  String.prototype.trunc =
    String.prototype.trunc ||
    function (n) {
      return this.length > n ? this.substr(0, n - 1) + '...' : this;
    };

  useEffect(() => {
    const getMessages = async () => {
      setIsloading(true);
      await dispatch(appActions.getMessages(partnerId));
      //  console.log(response.messages);
      //    setMessages(response.messages);
      setIsloading(false);
    };
    getMessages();
  }, []);

  const getMessagesSocket = async () => {
    await dispatch(appActions.getMessages(partnerId));
    //  setMessages(response.messages);
  };

  useEffect(() => {
    socket.on('newMessage', function (msg) {
      if (msg.msg.to == user.user._id || msg.msg.from == user.user._id) {
        getMessagesSocket();
      }
    });
  }, []);

  useEffect(() => {
    socket.on('checkIn', function (checkInData) {
      if (checkInData.partnerId == user.user._id) {
        getMessagesSocket();
      }
    });
  }, []);

  useEffect(() => {
    socket.on('cancelAppoitment', function (cancelAppoitmentData) {
      if (cancelAppoitmentData.partnerId == user.user._id) {
        getMessagesSocket();
      }
    });
  }, []);

  useEffect(() => {
    socket.on('noShow', function (noShowAppoitmentData) {
      if (noShowAppoitmentData.partnerId == user.user._id) {
        getMessagesSocket();
      }
    });
  }, []);

  const openConversation = (messageId, client_name, clientId) => {
    props.navigation.navigate('Conversations', {
      messageId,
      client_name,
      clientId,
    });
  };

  const renderItem = ({item}) => (
    <TouchableWithoutFeedback
      key={item._id}
      onPress={openConversation.bind(
        this,
        item._id,
        item.client.name,
        item.client._id,
      )}>
      <View style={{marginTop: 10}}>
        <View>
          <View
            style={{
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <View style={styles.imageContainer}>
              <Image
                source={{uri: item.client.profilePhoto}}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            <View style={{marginTop: 5, width: '75%'}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    fontWeight: 'bold',
                    fontSize: 20,
                  }}>
                  {item.client.name}
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.poppins_regular,
                    color: '#757575',
                  }}>
                  {Moment(item.dateModified).format('MM/DD/YYYY') ==
                  Moment(today).format('MM/DD/YYYY')
                    ? 'Today'
                    : Moment(item.dateModified).format('MMM, DD YYYY')}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{width: '80%'}}>
                  <Text
                    style={{
                      fontFamily: Fonts.poppins_regular,
                      color: '#757575',
                    }}>
                    {item.recentMesage.trunc(70)}
                  </Text>
                </View>

                {!item.partnerHasViewed && <View style={styles.notification} />}
              </View>
            </View>
          </View>
          <View style={styles.line} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  let view;

  if (messages.length === 0) {
    view = (
      <View style={{flex: 1}}>
        <View
          style={{
            marginTop: '40%',
            alignItems: 'center',
            flex: 1,
            marginHorizontal: 15,
          }}>
          <Icon name="ios-chatbubbles" size={30} color="#9e9e9e" />
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 18,
              color: '#9e9e9e',
              textAlign: 'center',
              marginTop: 20,
            }}>
            You have no chats yet. Messages between you and clients are
            displayed here.
          </Text>
        </View>
      </View>
    );
  } else {
    view = (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        extraData={messages}
        initialNumToRender={10}
        style={{marginTop: 2}}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <RefreshNetworkError navigation={props.navigation} />

      <SafeAreaView>
        <View style={styles.messageHeader}>
          <Text
            style={{
              fontFamily: Fonts.poppins_bold,
              fontSize: 30,
            }}>
            Chats
          </Text>
        </View>
      </SafeAreaView>
      {isLoading ? (
        <MaterialIndicator
          color={Colors.purple_darken}
          style={{marginTop: 30}}
        />
      ) : (
        view
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 150,
    borderColor: 'black',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  notification: {
    backgroundColor: Colors.purple_darken,
    borderRadius: 55,
    width: 10,
    borderWidth: 1,
    borderColor: '#fff',
    height: 10,
  },

  line: {
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    marginLeft: '25%',
    backgroundColor: '#e0e0e0',
  },
  messageHeader: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
});

export default MessageScreen;
