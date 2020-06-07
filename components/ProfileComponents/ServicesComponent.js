import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import Services from '../Others/Services';

const ServicesComponent = props => {
  return (
    <View style={styles.screen}>
      <Services />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default ServicesComponent;
