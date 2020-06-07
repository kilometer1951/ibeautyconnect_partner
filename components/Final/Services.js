import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {MaterialIndicator} from 'react-native-indicators';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Icons from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';

import * as authActions from '../../store/actions/authAction';
import ButtonComponent from '../ButtonComponent';
import ServiceModal from './ServiceModal';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Confirm from '../Confirm';

const Services = props => {
  const user = useSelector(state => state.authReducer.user);
  const services = useSelector(state => state.authReducer.services);
  const dispatch = useDispatch();

  const {setSectionToRender, setSectionHeader, setSectionHeaderNumber} = props;
  const [dialogVisible, setDialogVisible] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [activityIndicator, setActivityIndicator] = useState(false);
  const [actionToPerform, setActionToPerform] = useState('');
  const [editServiceData, setEditServiceData] = useState({});
  const [serviceId, setServiceId] = useState('');
  //let serviceId;

  useEffect(() => {
    //console.log(userId);
    const getServices = async () => {
      setActivityIndicator(true);
      await dispatch(authActions.getServices(user.user._id));
      setActivityIndicator(false);
      //  setServices(response.data.services);
    };
    getServices();
  }, []);

  String.prototype.trunc =
    String.prototype.trunc ||
    function(n) {
      return this.length > n ? this.substr(0, n - 1) + '...' : this;
    };

  const serviceControllerHandler = async action => {
    setActionToPerform(action.action);
    if (action.action === 'new') {
      setOpenModal(true);
      return;
    }
    if (action.action === 'edit') {
      setEditServiceData(action.serviceData);
      setOpenModal(true);
      return;
    }
    if (action.action === 'delete') {
      dispatch(authActions.deleteServices(user.user._id, serviceId));
      setDialogVisible(false);
    }
  };

  const goToSection = section => {
    setSectionToRender(section);
    setSectionHeader('Comfort Services');
    setSectionHeaderNumber(2);
  };

  const openDeleteDialog = id => {
    setServiceId(id);
    setDialogVisible(true);
  };
  return (
    <View style={styles.screen}>
      <Text style={{fontSize: 20, fontFamily: Fonts.poppins_regular}}>
        What services do you offer?
      </Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <ButtonComponent
          moreStyles={{
            width: '50%',
            marginTop: 20,
          }}
          title="Add Service"
          onButtonPress={serviceControllerHandler.bind(this, {action: 'new'})}
        />
        {services.length !== 0 && (
          <TouchableWithoutFeedback
            onPress={() => {
              ReactNativeHapticFeedback.trigger('impactLight', {
                enableVibrateFallback: true,
                ignoreAndroidSystemSettings: false,
              });
              goToSection('comfortServices');
            }}>
            <View style={styles.button}>
              <Icons name="md-arrow-round-forward" size={40} color="white" />
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>

      <View style={{height: '100%'}}>
        {activityIndicator ? (
          <View>
            <MaterialIndicator color={Colors.pink} style={{marginTop: '50%'}} />
          </View>
        ) : (
          <FlatList
            data={services}
            renderItem={({item}) => (
              <View style={styles.listView}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{width: '75%'}}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: Fonts.poppins_regular,
                      }}>
                      {item.serviceName}
                    </Text>
                    {item.serviceDescription !== '' && (
                      <Text
                        style={{
                          fontSize: 18,
                          marginTop: 10,
                          color: '#9e9e9e',
                          fontFamily: Fonts.poppins_regular,
                        }}>
                        {item.serviceDescription.trunc(60)}
                      </Text>
                    )}
                  </View>
                  <View style={{width: '22%'}}>
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        onPress={serviceControllerHandler.bind(this, {
                          action: 'edit',
                          serviceData: {
                            serviceId: item._id,
                            serviceName: item.serviceName,
                            serviceHour: item.serviceHour,
                            servicePricePerHour: item.servicePricePerHour,
                            serviceDescription: item.serviceDescription,
                          },
                        })}>
                        <MaterialCommunityIcons
                          name="pencil"
                          color={Colors.blue}
                          size={30}
                          style={{marginRight: 20}}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={openDeleteDialog.bind(this, item._id)}>
                        <MaterialCommunityIcons
                          name="delete"
                          size={30}
                          color={Colors.pink}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={item => item._id}
            style={{height: '100%', marginTop: 10}}
          />
        )}
      </View>

      {openModal && (
        <ServiceModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          setActionToPerform={setActionToPerform}
          actionToPerform={actionToPerform}
          editServiceData={editServiceData}
        />
      )}
      <Confirm
        dialogVisible={dialogVisible}
        setDialogVisible={setDialogVisible}
        action={serviceControllerHandler.bind(this, {
          action: 'delete',
        })}
        title="Delete this service"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginBottom: 100,
  },
  listView: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#fafafa',
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 8,
    backgroundColor: 'white',
    bottom: 0,
    elevation: 5,
    marginHorizontal: 5,
    marginTop: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: Colors.purple_darken,
    width: 65,
    borderRadius: 50,
    alignItems: 'center',
    padding: 10,
    alignSelf: 'flex-end',
  },
});

export default Services;
