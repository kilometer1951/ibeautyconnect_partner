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
  ScrollView,
  RefreshControl,
  Modal,
  Linking,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import * as appActions from '../store/actions/appActions';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import {MaterialIndicator} from 'react-native-indicators';
import Moment from 'moment';
import ConfirmNoShow from '../components/Appoitments/ConfirmNoShow';
import NoShowMessage from '../components/Appoitments/NoShowMessage';
import AppointmentPast from '../components/Appoitments/AppointmentPast';
import ReSchedule from '../components/Appoitments/ReSchedule';
import CalendarStrip from 'react-native-calendar-strip';
import SupportModal from '../components/SupportModal';

import {URL} from '../socketURL';
import io from 'socket.io-client';

const AppoitmentScreen = (props) => {
  const socket = io(URL);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const allAppoitments = useSelector(
    (state) => state.appReducer.allAppoitments,
  );
  const [activity, setActivity] = useState(false);
  const [today, setToday] = useState(new Date());
  const [openNoShowModal, setConfirmNoShowModal] = useState(false);
  const [openNoShowMessage, setOpenNoShowMessage] = useState(false);
  const [noShowAppoitmentData, setNoShowAppoitmentData] = useState({});
  const [isMounted, setIsmounted] = useState(false);

  const [openAppintmentHasPastModal, setOpenAppintmentHasPastModal] = useState(
    false,
  );

  const [reminderData, setReminderData] = useState({});
  const [openReScheduleModal, setOpenReScheduleModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [supportModal, setSupportModal] = useState(false);

  const [page, setPage] = useState(2);
  const [endOfFile, setEndOfFile] = useState(false);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);

  const handleRefresAppoitments = async () => {
    setIsRefreshing(true);
    await dispatch(appActions.getAppoitments(user.user._id, 1));
    setIsRefreshing(false);
  };

  useEffect(() => {
    const getAppoitments = async () => {
      setActivity(true);
      await dispatch(appActions.getAppoitments(user.user._id, 1));
      setActivity(false);
    };
    getAppoitments();
  }, []);

  useEffect(() => {
    setIsmounted(true);
    console.log('Mounted');
    return () => {
      console.log('Unmounted');
      setIsmounted(false);
    };
  }, []);

  useEffect(() => {
    socket.on('reSchedule', function (reScheduleData) {
      if (isMounted) {
        if (
          reScheduleData.reScheduleData.reScheduleData.partnerId ==
          user.user._id
        ) {
          dispatch(appActions.getDailyAppoitments(user.user._id));
        }
      }
    });
  }, []);

  const handleLoadMore = async () => {
    try {
      if (!endOfFile) {
        if (!isLoadingMoreData) {
          setIsLoadingMoreData(true);
          await dispatch(
            appActions.handleLoadMoreAppoitments(user.user._id, page),
          );
          setIsLoadingMoreData(false);
          setPage((prev) => (prev = prev + 1));
        }
      }
    } catch (e) {
      setIsLoadingMoreData(false);
      setEndOfFile(true);
    }
  };

  const displayName = (str, idx, array) => {
    if (str !== '') {
      if (idx === array.length - 1) {
        return str;
      }

      return str + ',';
    } else {
      return str;
    }
  };

  const services = (items) => {
    return items.map((result, index, array) => {
      return (
        <Text
          key={index}
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 17,

            marginRight: 5,
            color: '#9e9e9e',
          }}>
          {displayName(result.services.serviceName, index, array)}
        </Text>
      );
    });
  };

  const handleNoShow = (
    cartId,
    clientId,
    clientPhone,
    stripe_charge_id,
    total,
    booking_date,
    booking_time,
  ) => {
    const date = new Date();

    if (Moment(booking_date).isSame(date, 'day')) {
      // //check time
      const systemTime = Moment(date).format('h:mm a');

      const outputTime = Moment(booking_time, ['h:mm a']).format('HH:mm');
      const newDate = Moment(new Date(booking_date)).format('MMM DD, YYYY');
      let dateTime = new Date(newDate + ' ' + outputTime);

      const newTime = Moment(dateTime).add(15, 'minutes').format('h:mm a');

      if (systemTime > newTime) {
        //cancel
        setNoShowAppoitmentData({
          clientId: clientId,
          cartId,
          partner_stripe_id: user.user.stripeAccountId,
          partnerId: user.user._id,
          partnerPhone: user.user.phone,
          clientPhone,
          stripe_charge_id,
          total,
          booking_date,
          booking_time,
        });
        setConfirmNoShowModal(true);
      } else {
        //cannot cancel
        setReminderData({
          cartId,
          clientPhone,
          booking_date,
          booking_time,
          partner_name: user.user.fName,
        });
        setOpenNoShowMessage(true);
      }
    } else {
      //appointment has past
      setOpenAppintmentHasPastModal(true);
    }
  };

  const handleReSchedule = (
    cartId,
    clientId,
    clientPhone,
    booking_date,
    booking_time,
    client_name,
  ) => {
    dispatch(
      appActions.handleUserToReSchedule({
        cartId,
        clientId,
        booking_date,
        booking_time,
        client_name: client_name,
        clientPhone: clientPhone,
        partner_name: user.user.fName + ' ' + user.user.lName,
        clientId: clientId,
      }),
    );
    setOpenReScheduleModal(true);
  };

  const queryAgendaByDate = async (date) => {
    let newDate = Moment(date).format('YYYY-MM-DD');
    let dateTime = new Date(newDate + '' + 'T05:00:00.000Z');
    setActivity(true);
    await dispatch(appActions.queryAgendaByDate(user.user._id, dateTime));
    setActivity(false);
  };

  //agenda initialization
  let customDatesStyles = [];
  let markedDates = [];
  let startDate = Moment();
  for (let i = 0; i < allAppoitments.length; i++) {
    let _date = allAppoitments[i].booking_date;
    markedDates.push({
      date: _date,
      dots: [
        {
          key: i,
          color: '#fff',
          selectedDotColor: '#fff',
        },
      ],
    });
  }

  let view;

  if (allAppoitments.length === 0) {
    view = activity ? (
      <MaterialIndicator color={Colors.purple_darken} style={{marginTop: 30}} />
    ) : (
      <View
        style={{
          marginTop: '60%',
          alignItems: 'center',
          flex: 1,
        }}>
        <Icon name="ios-calendar" size={30} color="#9e9e9e" />
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 15,
            color: '#9e9e9e',
          }}>
          You have no Appointments
        </Text>
      </View>
    );
  } else {
    view = (
      <FlatList
        data={allAppoitments}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            onRefresh={handleRefresAppoitments}
            refreshing={isRefreshing}
            tintColor={Colors.purple_darken}
            titleColor={Colors.purple_darken}
          />
        }
        renderItem={({item, index}) => (
          <View
            style={{
              marginBottom: 20,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <View
              style={{
                alignItems: 'center',
                width: '15%',
                marginTop: '10%',
                paddingRight: 10,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 20,
                  color: '#9e9e9e',
                }}>
                {Moment(item.booking_date).format('D')}
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.poppins_regular,
                  fontSize: 20,
                  color: '#9e9e9e',
                }}>
                {Moment(item.booking_date).format('MMM')}
              </Text>
            </View>
            <View style={styles.appointmentCard}>
              <View style={styles.appointmentBody}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.poppins_regular,
                      fontSize: 17,
                      marginBottom: 7,
                    }}>
                    {item.booking_time}
                  </Text>

                  <View
                    style={{
                      backgroundColor:
                        Moment(today).format('MM/DD/YYYY') ==
                        Moment(item.booking_date).format('MM/DD/YYYY')
                          ? Colors.pink
                          : Colors.blue,
                      width: 40,
                      alignItems: 'center',
                      borderRadius: 50,
                      height: 40,
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.poppins_regular,
                        fontSize: 20,
                        color: '#fff',
                        marginTop: 5,
                      }}>
                      {Moment(today).format('MM/DD/YYYY') ==
                      Moment(item.booking_date).format('MM/DD/YYYY')
                        ? 'T'
                        : 'UC'}
                    </Text>
                  </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      fontFamily: Fonts.poppins_regular,
                      fontSize: 17,
                      marginBottom: 7,
                    }}>
                    {item.client.name}
                  </Text>
                  <Text style={{color: Colors.blue, marginTop: 3}}>
                    {item.comfort_fee !== '0.00' && '( Comfort )'}
                  </Text>
                </View>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  {services(item.items)}
                </ScrollView>
                {item.comfort_fee !== '0.00' && (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      //  console.log(item.partner.locationLng);
                      Linking.openURL(
                        `https://maps.apple.com/?daddr=${item.comfortFeeAddress}`,
                      );
                    }}>
                    <Text
                      style={{
                        fontFamily: Fonts.poppins_regular,
                        fontSize: 15,
                        textDecorationLine: 'underline',
                        color: '#9e9e9e',
                      }}>
                      {item.comfortFeeAddress}
                    </Text>
                  </TouchableWithoutFeedback>
                )}

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 20,
                  }}>
                  <View>
                    <TouchableWithoutFeedback
                      onPress={handleNoShow.bind(
                        this,
                        item._id,
                        item.client._id,
                        item.client.phone,
                        item.stripe_charge_id,
                        item.total,
                        item.booking_date,
                        item.booking_time,
                      )}>
                      <View style={styles.button}>
                        <Icon
                          name="md-close"
                          size={20}
                          style={{marginRight: 10}}
                          color={Colors.purple_darken}
                        />
                        <Text>Confirm No-show</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                  <View>
                    <TouchableWithoutFeedback
                      onPress={handleReSchedule.bind(
                        this,
                        item._id,
                        item.client._id,
                        item.client.phone,
                        item.booking_date,
                        item.booking_time,
                        item.client.name,
                      )}>
                      <View style={styles.button}>
                        <Icon
                          name="md-calendar"
                          size={20}
                          style={{marginRight: 10}}
                          color={Colors.purple_darken}
                        />
                        <Text>Reschedule</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item._id}
        extraData={allAppoitments}
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
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.openAppoitmentModal}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.headerContainer}>
            <View style={{marginTop: 45}}>
              <View
                style={{
                  width: '100%',
                  backgroundColor: Colors.blue,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    zIndex: 1,
                    justifyContent: 'space-between',
                    position: 'absolute',
                    width: '100%',
                  }}>
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
                      props.setOpenAppoitmentModal(false);
                    }}>
                    <View
                      style={{
                        marginHorizontal: 20,
                        height: 30,
                        width: 30,
                        paddingTop: 4,
                        alignItems: 'center',
                      }}>
                      <Icon name="md-close" size={20} color="#fff" />
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() => setSupportModal(true)}>
                    <View
                      style={{
                        marginHorizontal: 20,
                        height: 30,
                        width: 30,
                        alignItems: 'center',
                        marginTop: 4,
                      }}>
                      <Icon name="md-help" size={20} color="#fff" />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <CalendarStrip
                  startingDate={new Date()}
                  selectedDate={'2021-11-20'}
                  calendarAnimation={{type: 'sequence', duration: 30}}
                  daySelectionAnimation={{
                    type: 'border',
                    duration: 200,
                    borderWidth: 1,
                    borderHighlightColor: '#fff',
                    highlightColor: '#9265DC',
                  }}
                  calendarHeaderContainerStyle={{marginBottom: 10}}
                  style={{height: 110, paddingBottom: 10}}
                  calendarHeaderStyle={{color: 'white'}}
                  calendarColor={Colors.blue}
                  dateNumberStyle={{color: 'white'}}
                  dateNameStyle={{color: 'white'}}
                  iconContainer={{flex: 0.1}}
                  markedDates={markedDates}
                  onDateSelected={queryAgendaByDate}
                  calendarHeaderStyle={{
                    color: 'white',
                    fontFamily: Fonts.poppins_regular,
                  }}
                  highlightDateNameStyle={{
                    color: 'white',
                  }}
                  highlightDateNumberStyle={{
                    color: 'white',
                  }}
                  leftSelector={
                    <Icon name="ios-arrow-back" size={40} color="#fff" />
                  }
                  rightSelector={
                    <Icon name="ios-arrow-forward" size={40} color="#fff" />
                  }
                />
              </View>
            </View>
          </View>
        </View>
        <View style={{marginHorizontal: 10, flex: 1}}>{view}</View>
        <ConfirmNoShow
          noShowAppoitmentData={noShowAppoitmentData}
          openNoShowModal={openNoShowModal}
          setConfirmNoShowModal={setConfirmNoShowModal}
        />

        <AppointmentPast
          openAppintmentHasPastModal={openAppintmentHasPastModal}
          setOpenAppintmentHasPastModal={setOpenAppintmentHasPastModal}
        />
        <NoShowMessage
          openNoShowMessage={openNoShowMessage}
          setOpenNoShowMessage={setOpenNoShowMessage}
          reminderData={reminderData}
        />
        <ReSchedule
          setOpenReScheduleModal={setOpenReScheduleModal}
          openReScheduleModal={openReScheduleModal}
        />
        <SupportModal
          supportModal={supportModal}
          setSupportModal={setSupportModal}
        />
      </View>
    </Modal>
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
    backgroundColor: Colors.blue,
  },
  appointmentCard: {
    alignSelf: 'center',
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 8,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    padding: 10,
  },

  appointmentBody: {
    padding: 10,
  },
  button: {
    width: '1000%',
    flexDirection: 'row',
    marginTop: 5,
  },
});

export default AppoitmentScreen;
