import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {Accordion} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';

import Fonts from '../contants/Fonts';
import Colors from '../contants/Colors';

const HowItWorks = props => {
  return (
    <View style={styles.screen}>
      <View style={{paddingLeft: 10}}>
        <Text
          style={{
            fontFamily: Fonts.poppins_bold,
            fontSize: 30,
            color: Colors.blue,
            textDecorationLine: 'underline',
            textAlign: 'center',
          }}>
          How It Works
        </Text>
      </View>
      <View style={{padding: 10}}>
        <Text
          style={{
            fontFamily: Fonts.poppins_bold,
            fontSize: 20,
          }}>
          What is iBeautyConnect?
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 18,
          }}>
          iBeautyConnect means "instant Beauty Connect". iBeautyConnect is a
          marketplace where licensed Health and Beauty professionals can sell
          their services. Our goal is to build a community of licensed Health
          and Beauty professionals and making iBeautyConnect the one stop
          marketplace for everything Health and Beauty related.
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_bold,
            fontSize: 20,
            marginTop: 10,
          }}>
          Avalilablility
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 18,
          }}>
          iBeautyConnect believes in real time avalibility and not an
          avalibility based on an automated time interval. We understand you
          have other clients you work with out of iBeautyConnect. To solve this
          problem, iBeautyConnect offers a real-time messaging functionality
          that allow clients to ask for your avalibility in real time. This
          message will come to you as an in-app message and as an SMS.
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_bold,
            fontSize: 20,
            marginTop: 10,
          }}>
          Online / Offline
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 18,
          }}>
          Online and Offline mode allow clients to know if your are available
          for future and/or present booking.
        </Text>
        <View style={{flexDirection: 'row', marginLeft: 15, marginTop: 5}}>
          <Icon
            name="ios-radio-button-on"
            size={15}
            style={{marginTop: 5}}
            color={Colors.purple_darken}
          />
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 18,
              marginLeft: 5,
            }}>
            Online - available for the present date and future dates
          </Text>
        </View>
        <View style={{flexDirection: 'row', marginLeft: 15, marginTop: 5}}>
          <Icon
            name="ios-radio-button-on"
            size={15}
            style={{marginTop: 5}}
            color={Colors.purple_darken}
          />
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 18,
              marginLeft: 5,
            }}>
            Offline - available for only futrue bookings
          </Text>
        </View>

        <Text
          style={{
            fontFamily: Fonts.poppins_bold,
            fontSize: 20,
            marginTop: 10,
          }}>
          Display Of Profiles
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 18,
          }}>
          iBeautyConnect believes in giving every Health and Beauty professional
          an opportunity to be found. iBeautyConnect uses display images (five
          images and a video ) to show case your work to clients. The more
          appealing your display images are, the more bookings you may get.
        </Text>

        <Text
          style={{
            fontFamily: Fonts.poppins_semibold,
            fontSize: 20,
            marginTop: 10,
          }}>
          SMS Notifications
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 18,
          }}>
          Every client matters and every notification missed results in loosing
          clients. iBeautyConnect uses SMS notifications to notify you on the
          following:
        </Text>
        <View style={{flexDirection: 'row', marginLeft: 15, marginTop: 5}}>
          <Icon
            name="ios-radio-button-on"
            size={15}
            style={{marginTop: 5}}
            color={Colors.purple_darken}
          />
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 18,
              marginLeft: 5,
            }}>
            Up coming appointments
          </Text>
        </View>
        <View style={{flexDirection: 'row', marginLeft: 15, marginTop: 10}}>
          <Icon
            name="ios-radio-button-on"
            size={15}
            style={{marginTop: 5}}
            color={Colors.purple_darken}
          />
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 18,
              marginLeft: 5,
            }}>
            Availability request from a client
          </Text>
        </View>
        <View style={{flexDirection: 'row', marginLeft: 15, marginTop: 10}}>
          <Icon
            name="ios-radio-button-on"
            size={15}
            style={{marginTop: 5}}
            color={Colors.purple_darken}
          />
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 18,
              marginLeft: 5,
            }}>
            In-app messaging
          </Text>
        </View>
        <View style={{flexDirection: 'row', marginLeft: 15, marginTop: 10}}>
          <Icon
            name="ios-radio-button-on"
            size={15}
            style={{marginTop: 5}}
            color={Colors.purple_darken}
          />
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 18,
              marginLeft: 5,
            }}>
            Check-ins
          </Text>
        </View>
        <Text
          style={{
            fontFamily: Fonts.poppins_semibold,
            fontSize: 20,
            marginTop: 10,
          }}>
          Appointment Reminders
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 18,
          }}>
          iBeautyConnect manages all appointment reminders. We send appointment
          reminders to you and your client thirty minute before the appointment
          time and at the time of the appointment.
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_bold,
            fontSize: 20,
            marginTop: 10,
          }}>
          Payment
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 18,
          }}>
          iBeautyConnect deposit all earnings daily directly into your bank
          account. Your first deposit takes 7 business days. Subsequently, you
          will receive deposits daily to your bank account. It may take up to
          two days to reflect in your bank statement.
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_semibold,
            fontSize: 20,
            marginTop: 10,
          }}>
          How Do Clients Pay
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 18,
          }}>
          When a client books for your service, we place a hold on the clients
          card for the full amount of your service.
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_semibold,
            fontSize: 20,
            marginTop: 10,
          }}>
          Check-in
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 18,
          }}>
          This is how you get paid. On the day of the appointment, when your
          client arrives do not forget to tell your client to check-in through
          the app. We notify the client not to forget to check-in. If you or
          your client forgets to check-in, you can send us a support message
          through the app selecting check-in as the category. We respond to
          check-in request immediately.
        </Text>

        <Text
          style={{
            fontFamily: Fonts.poppins_semibold,
            fontSize: 20,
            marginTop: 10,
          }}>
          Client Cancellations
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 18,
          }}>
          If a client cancels their appointment at any time, we give you fifty
          percent of the total amount the client paid for your service.
        </Text>

        <Text
          style={{
            fontFamily: Fonts.poppins_semibold,
            fontSize: 20,
            marginTop: 10,
          }}>
          Rescheduling
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 18,
          }}>
          You and your client can reschedule an appointment at anytime. We do
          this because of our strict cancellation rule. If a client reschedules
          to often, you can send us a support message in the app and after
          review, client maybe eligible for cancellation. In this case, you
          still get paid
        </Text>

        <Text
          style={{
            fontFamily: Fonts.poppins_semibold,
            fontSize: 20,
            marginTop: 10,
          }}>
          No-show
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 18,
          }}>
          If a client is fifteen minutes late for their appointment, you can
          confirm a no-show and you get paid fifty percent of the total amount
          the client paid for your service. In this case, you must click on the
          no-show button and send your client a reminder. Once your client has
          missed their appointment, you now will be eligible for no-show
          payment.
        </Text>

        <Text
          style={{
            fontFamily: Fonts.poppins_bold,
            fontSize: 20,
            marginTop: 10,
          }}>
          Comfort (Home Services)
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 18,
          }}>
          Comfort means you go to your clients location. A comfort fee is then
          applied. After your account has been approved, you will be asked to
          set a comfort fee. This fee will be applied to your client's bill upon
          check out and the client's location will be sent to you.
        </Text>

        <Text
          style={{
            fontFamily: Fonts.poppins_bold,
            fontSize: 20,
            marginTop: 10,
          }}>
          Reviews
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 18,
          }}>
          iBeautyConnect does not show your negative reviews to clients. We show
          only your best reviews. However, we do maintain bad reviews in your
          partner record. Too many bad reviews might lead to deactiviation.
        </Text>

        <Text
          style={{
            fontFamily: Fonts.poppins_bold,
            fontSize: 20,
            marginTop: 10,
          }}>
          Subscription
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 18,
          }}>
          iBeautyConnect takes no subscription fee.
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_bold,
            fontSize: 20,
            marginTop: 10,
          }}>
          Sharing Contacts
        </Text>
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 18,
          }}>
          It is against our policy for you and your client to share contact
          details such as phone numbers and emails. iBeautyConnect has a built
          in chat for you to communicate with your client. iBeautyConnect
          handles all appointment notifications between you and your clients.
        </Text>
      </View>
    </View>
  );
};

//
//   .
// ,,  and every
// other activity within the app such as when a client .

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default HowItWorks;
