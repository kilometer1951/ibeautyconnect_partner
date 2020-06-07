import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import WalkThrough from '../components/auth/WalkThrough';
import Signup from '../components/auth/Signup/SignupComponent';
import Login from '../components/auth/Login/LoginComponent';
import RefreshNetworkError from '../components/RefreshNetworkError';

const AuthScreen = (props) => {
  const [showAuthComponent, setShowAuthComponent] = useState(false);
  const [showSignupComponent, setShowSignupComponent] = useState(true);
  const [activityIndicator, setActivityIndicator] = useState(false);

  // const navigate = url => {
  //   console.log(url);
  //   props.navigation.navigate('Intro');
  // };
  //
  // // useEffect(() => {
  // //
  // // }, []);

  const handleOpenURL = (event) => {
    navigate(event.url);
  };

  if (showAuthComponent) {
    return (
      <View style={styles.mainContainer}>
        <RefreshNetworkError navigation={props.navigation} />
        {showSignupComponent ? (
          <Signup
            setShowSignupComponent={setShowSignupComponent}
            showSignupComponent={showSignupComponent}
            navigationProperties={props}
            activityIndicator={activityIndicator}
            setActivityIndicator={setActivityIndicator}
          />
        ) : (
          <Login
            setShowSignupComponent={setShowSignupComponent}
            showSignupComponent={showSignupComponent}
            activityIndicator={activityIndicator}
            setActivityIndicator={setActivityIndicator}
            navigationProperties={props}
          />
        )}
      </View>
    );
  } else {
    return (
      <WalkThrough
        setShowAuthComponent={setShowAuthComponent}
        setShowSignupComponent={setShowSignupComponent}
      />
    );
  }
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default AuthScreen;
