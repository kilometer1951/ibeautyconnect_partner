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
import Icon from 'react-native-vector-icons/Ionicons';
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

  const openDeleteDialog = id => {
    setServiceId(id);
    setDialogVisible(true);
  };
  return (
    <View style={styles.screen}>
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
                <View>
                  <Text style={{fontFamily: Fonts.poppins_regular}}>
                    {item.serviceName}
                  </Text>
                  {item.serviceDescription !== '' && (
                    <Text
                      style={{
                        marginTop: 10,
                        color: '#9e9e9e',
                        fontFamily: Fonts.poppins_regular,
                      }}>
                      {item.serviceDescription.trunc(30)}
                    </Text>
                  )}
                </View>
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
                      size={20}
                      style={{marginRight: 15}}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={openDeleteDialog.bind(this, item._id)}>
                    <MaterialCommunityIcons
                      name="delete"
                      size={20}
                      color={Colors.pink}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          keyExtractor={item => item._id}
          style={{height: '100%', marginTop: 10}}
        />
      )}
      <View style={styles.floatingButtonsRight}>
        <TouchableWithoutFeedback
          onPress={serviceControllerHandler.bind(this, {action: 'new'})}>
          <View style={styles.button}>
            <Icon name="md-add" size={40} color={Colors.purple_darken} />
          </View>
        </TouchableWithoutFeedback>
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
  },
  listView: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light_grey,
    elevation: 5,
    marginHorizontal: 10,
    marginTop: 15,
    borderRadius: 10,
    height: 100,
  },
  floatingButtonsRight: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 0,
    marginBottom: 40,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  button: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 100,
    height: 60,
    width: 60,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 8,
    elevation: 5,
    marginTop: 20,
  },
});

// <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//   <ButtonComponent
//     moreStyles={{
//       width: '50%',
//       marginTop: 20,
//     }}
//     title="Add Service"
//     onButtonPress={}
//   />
// </View>

export default Services;
