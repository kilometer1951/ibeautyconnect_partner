import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {Accordion} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';

import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';
import HowItWorks from '../components/HowItWorks';
import RefreshNetworkError from '../components/RefreshNetworkError';

const HowItWorksScreen = (props) => {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                props.navigation.goBack();
              }}>
              <View
                style={{
                  marginHorizontal: 20,
                  height: 30,
                  width: 30,
                  paddingTop: 4,
                  alignItems: 'center',
                }}>
                <Icon name="md-arrow-back" size={20} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </SafeAreaView>
      </View>
      <ScrollView>
        <HowItWorks />
      </ScrollView>
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
    height: '11%',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 5,
  },
});

export default HowItWorksScreen;
