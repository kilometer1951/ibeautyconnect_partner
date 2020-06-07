import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, FlatList, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';

import TextComponent from '../TextComponent';
import Colors from '../../contants/Colors';
import Fonts from '../../contants/Fonts';

import * as authActions from '../../store/actions/authAction';

const Profession = props => {
  const user = useSelector(state => state.authReducer.user);

  const [professionData, setProfessionData] = useState([]);
  const {setSectionHeaderNumber, setSectionHeader, setSectionToRender} = props;

  const goToSection = async (section, professionName) => {
    authActions.userProfession(professionName, user.user._id);
    // //update AsyncStorage
    // parseUserData.user.profession = professionName;
    // AsyncStorage.setItem('@userData', JSON.stringify(parseUserData));
    setSectionHeaderNumber(5);
    setSectionHeader('Professional License');
    setSectionToRender(section);
  };

  useEffect(() => {
    const fetchProfession = async () => {
      const response = await authActions.getProfessions();
      setProfessionData(response);
    };
    fetchProfession();
  }, []);
  return (
    <View style={{marginTop: 5}}>
      <TextComponent text="Select a profession below" />
      <FlatList
        data={professionData.data}
        renderItem={({item}) => (
          <View style={styles.listView}>
            <TouchableOpacity
              style={{flexDirection: 'row', justifyContent: 'space-between'}}
              onPress={goToSection.bind(this, 'license', item.name)}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: Fonts.poppins_regular,
                }}>
                {item.name}
              </Text>
              <MaterialCommunityIcons name="chevron-right" size={30} />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item._id}
        style={{height: '100%'}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listView: {
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 8,
    backgroundColor: 'white',
    elevation: 5,
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
});

export default Profession;
