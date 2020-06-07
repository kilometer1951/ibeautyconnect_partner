import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  SafeAreaView,
  TouchableWithoutFeedback,
  FlatList,
  Image,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import * as appActions from '../store/actions/appActions';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import {MaterialIndicator} from 'react-native-indicators';
import Moment from 'moment';
import WeeklyActivityItems from '../components/WeeklyActivity/WeeklyActivityItems';
import SupportModal from '../components/SupportModal';

//import OrderHistoryItems from '../components/OrderHistory/OrderHistoryItems';

const WeeklyActivityScreen = (props) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.authReducer.user);
  const [weeklyActivity, setWeeklyActivity] = useState([]);

  const [activity, setActivity] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [page, setPage] = useState(2);
  const [endOfFile, setEndOfFile] = useState(false);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);

  const [supportModal, setSupportModal] = useState(false);

  useEffect(() => {
    const getWeeklyActivity = async () => {
      setActivity(true);
      const response = await appActions.getWeeklyActivity(user.user._id, 1);
      setWeeklyActivity(response.cart);
      setActivity(false);
    };
    getWeeklyActivity();
  }, []);

  const handleLoadMore = async () => {
    if (!endOfFile) {
      if (!isLoadingMoreData) {
        setIsLoadingMoreData(true);
        const response = await appActions.getWeeklyActivity(
          user.user._id,
          page,
        );
        setIsLoadingMoreData(false);
        //  console.log(response.images.length);
        if (!response.status) {
          console.log('error parsing server');
          return;
        }
        if (response.endOfFile === true) {
          setEndOfFile(true);
          return;
        }
        //  console.log(page);
        setPage((prev) => (prev = prev + 1));
        setWeeklyActivity((prev) => [...prev, ...response.cart]);
      }
    }
  };

  const expandOrders = async (items) => {
    dispatch(appActions.expandWeeklyActivity(items));
    setOpenModal(true);
  };

  let view;

  if (weeklyActivity.length === 0) {
    view = (
      <View
        style={{
          marginTop: '50%',
          alignItems: 'center',
          flex: 1,
        }}>
        <Icon name="ios-cart" size={30} color="#9e9e9e" />
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 15,
            color: '#9e9e9e',
          }}>
          You have no weekly activity yet
        </Text>
      </View>
    );
  } else {
    view = (
      <View style={{flex: 1}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={weeklyActivity}
          renderItem={({item, index}) => (
            <View style={styles.listView}>
              <View style={styles.serviceContainer}>
                <View style={styles.leftContainer}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{uri: item.client.profilePhoto}}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={{width: '80%'}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontFamily: Fonts.poppins_bold,
                          fontSize: 15,
                          marginLeft: 5,
                        }}>
                        {item.client.name}
                      </Text>

                      <Text
                        style={{
                          fontFamily: Fonts.poppins_semibold,
                          fontSize: 15,
                          color: Colors.purple_darken,
                        }}>
                        {item.hasCanceled && 'Client Cancelled'}
                        {item.noShow && 'No Show'}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: Fonts.poppins_light,
                        fontSize: 15,
                        marginLeft: 5,
                      }}>
                      {Moment(item.booking_date).format('MMM, D YYYY')}
                    </Text>
                  </View>
                </View>
                <View style={styles.rightContainer}>
                  <TouchableWithoutFeedback
                    onPress={expandOrders.bind(this, item)}>
                    <View style={styles.button}>
                      <Icon
                        name="ios-add"
                        size={25}
                        style={{marginRight: 10}}
                        color={Colors.pink}
                      />
                      <Text
                        style={{
                          fontFamily: Fonts.poppins_regular,
                          marginTop: 2,
                        }}>
                        Expand order
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item) => item._id}
          extraData={weeklyActivity}
          onEndReachedThreshold={0.5}
          initialNumToRender={20}
          style={{marginTop: 2}}
          onMomentumScrollBegin={() => {
            handleLoadMore();
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
            </View>
          }
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                dispatch(
                  appActions.getEarnings(
                    user.user._id,
                    user.user.stripeAccountId,
                  ),
                );
                dispatch(appActions.getDailyAppoitments(user.user._id));
                dispatch(appActions.getAllActivities(user.user._id, 1));
                props.navigation.navigate('Main');
              }}>
              <View
                style={{
                  marginHorizontal: 20,
                  height: 30,
                  width: 30,
                  paddingTop: 4,
                  alignItems: 'center',
                  marginTop: 8,
                }}>
                <Icon name="md-arrow-back" size={20} />
              </View>
            </TouchableWithoutFeedback>
            <View
              style={{
                width: '60%',
                marginLeft: 17,
                alignItems: 'center',
                backgroundColor: Colors.purple_darken,
                padding: 10,
                borderRadius: 50,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_bold,
                  fontSize: 19,
                  color: '#fff',
                }}>
                Weekly Activity
              </Text>
            </View>
            <TouchableWithoutFeedback onPress={() => setSupportModal(true)}>
              <View
                style={{
                  marginHorizontal: 20,
                  height: 30,
                  width: 30,
                  paddingTop: 4,
                  alignItems: 'center',
                  marginTop: 8,
                }}>
                <Icon name="md-help" size={20} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </SafeAreaView>
      </View>
      {activity ? (
        <MaterialIndicator
          color={Colors.purple_darken}
          style={{marginTop: 20}}
        />
      ) : (
        view
      )}
      <WeeklyActivityItems openModal={openModal} setOpenModal={setOpenModal} />

      <SupportModal
        supportModal={supportModal}
        setSupportModal={setSupportModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  listView: {
    flexDirection: 'column',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fafafa',
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 8,
    backgroundColor: 'white',
    bottom: 0,
    elevation: 5,
    marginHorizontal: 10,
    marginTop: 20,
    borderRadius: 10,
  },
  serviceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    width: '100%',
  },
  leftContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  rightContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 150,
    borderColor: 'black',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  button: {
    width: '100%',
    padding: 5,
    flexDirection: 'row',
    marginTop: 5,
    marginRight: 30,
  },
});

export default WeeklyActivityScreen;
