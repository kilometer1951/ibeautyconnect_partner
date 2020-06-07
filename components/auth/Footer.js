import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const Footer = props => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        const options = {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false,
        };
        ReactNativeHapticFeedback.trigger('impactLight', options);
        const prev = !props.showSignupComponent;
        props.setShowSignupComponent(prev);
      }}>
      <View style={styles.footer}>
        <Text style={{fontSize: 20, color: '#cfdef2'}}>{props.title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    height: 70,
    backgroundColor: '#0a3542',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
  },
});

export default Footer;
