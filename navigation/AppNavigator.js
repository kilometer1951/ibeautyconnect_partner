import React from 'react';

import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';

import MainScreen from '../screens/MainScreen';
import AuthScreen from '../screens/AuthScreen';
import StartUpScreen from '../screens/StartUpScreen';
import IntroScreen from '../screens/IntroScreen';
import PendingActivationScreen from '../screens/PendingActivationScreen';
import FinalScreen from '../screens/FinalScreen';
import GetStartedScreen from '../screens/GetStartedScreen';
import SettingScreen from '../screens/SettingScreen';
import WeeklyActivityScreen from '../screens/WeeklyActivityScreen';
import DailyAppoitmentScreen from '../screens/DailyAppoitmentScreen';
import AllactivityScreen from '../screens/AllactivityScreen';
import ConversationScreen from '../screens/ConversationScreen';
import WebViewScreen from '../screens/WebViewScreen';

import HowItWorksScreen from '../screens/HowItWorksScreen';

import SupportScreen from '../screens/SupportScreen';
import SupportConversationScreen from '../screens/SupportConversationScreen';
import UpdateBankingInfo from '../screens/UpdateBankingInfo';

import CancelledOrdersScreen from '../screens/CancelledOrdersScreen';

const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen,
  },
  {headerMode: 'none'},
);

const TabScreens = createBottomTabNavigator({
  Main: {screen: MainScreen, navigationOptions: {tabBarVisible: false}},
});

const AppNavigator = createStackNavigator(
  {
    Tabs: TabScreens,
    Conversations: ConversationScreen,
    WebViewScreen: WebViewScreen,

    Setting: SettingScreen,

    HowItWorksScreen: HowItWorksScreen,
    CancelledOrders: CancelledOrdersScreen,
    WeeklyActivity: WeeklyActivityScreen,
    DailyAppoitment: DailyAppoitmentScreen,
    Allactivity: AllactivityScreen,
    Support: SupportScreen,
    SupportConversation: SupportConversationScreen,
    UpdateBankingInfo: UpdateBankingInfo,
  },
  {headerMode: 'none'},
);

const MainNavigator = createSwitchNavigator({
  StartUpScreen: StartUpScreen,
  Intro: IntroScreen,
  PendingActivation: PendingActivationScreen,
  GetStarted: GetStartedScreen,
  Final: FinalScreen,
  Auth: AuthNavigator,
  App: AppNavigator,
});

export default createAppContainer(MainNavigator);
