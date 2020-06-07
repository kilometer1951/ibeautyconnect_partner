import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Modal} from 'react-native';
import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import ButtonComponent from './ButtonComponent';

const Confirm = props => {
  const {
    setSectionHeaderNumber,
    setSectionHeader,
    setSectionToRender,
    dialogVisible,
    setDialogVisible,
    action,
    title,
  } = props;
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.dialogVisible}>
        <View style={styles.screen}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#fff',
              padding: 40,
              borderRadius: 10,
            }}>
            <Text
              style={{
                fontFamily: Fonts.poppins_regular,
                fontSize: 18,
              }}>
              {props.title}
            </Text>
            <View style={{flexDirection: 'row', marginTop: 30}}>
              <ButtonComponent
                moreStyles={{
                  width: '50%',
                  marginRight: 10,
                }}
                title="Yes"
                onButtonPress={action}
              />
              <ButtonComponent
                moreStyles={{
                  width: '50%',

                  backgroundColor: '#fff',
                  borderWidth: 0.5,
                  borderColor: Colors.grey_darken,
                }}
                buttonTextStyle={{color: Colors.midnight_blue}}
                title="No"
                onButtonPress={() => {
                  setDialogVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(158, 158, 158, 0.3)',
  },
});

export default Confirm;
