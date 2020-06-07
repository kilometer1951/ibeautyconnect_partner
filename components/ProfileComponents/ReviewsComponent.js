import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import StarRating from 'react-native-star-rating';
import {MaterialIndicator} from 'react-native-indicators';

import * as appActions from '../../store/actions/appActions';

import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';

const Reviews = props => {
  const user = useSelector(state => state.authReducer.user);
  const reviews = useSelector(state => state.appReducer.reviews);
  const [activity, setActivity] = useState(false);
  const dispatch = useDispatch();

  const [page, setPage] = useState(2);
  const [endOfFile, setEndOfFile] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);

  useEffect(() => {
    const loadReview = async () => {
      try {
        setActivity(true);
        await dispatch(appActions.getReviews(user.user._id, 1));
        setActivity(false);
      } catch (e) {
        console.log(e);
      }
    };
    loadReview();
  }, []);

  const handleLoadMore = async () => {
    try {
      if (!endOfFile) {
        if (!isLoadingMoreData) {
          setIsLoadingMoreData(true);
          const res = await dispatch(
            appActions.handleLoadMoreReviews(user.user._id, page),
          );
          setIsLoadingMoreData(false);
          setPage(prev => (prev = prev + 1));
          //  await setImagesData(prev => [...prev, ...response.images]);
        }
      }
    } catch (e) {
      setIsLoadingMoreData(false);
      setEndOfFile(true);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setEndOfFile(false);
    setPage(2);
    await dispatch(appActions.getReviews(user.user._id, 1));
    setIsRefreshing(false);
  };

  const renderItem = ({item}) => (
    <View
      style={{
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingBottom: 10,
        borderColor: '#e0e0e0',
        paddingTop: 15,
      }}>
      <View style={styles.imageContainer}>
        <Image
          source={{uri: item.client.profilePhoto}}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View
        style={{
          marginLeft: 5,
          width: '100%',
        }}>
        <Text style={{fontFamily: Fonts.poppins_regular, fontSize: 16}}>
          {item.client.name}
        </Text>

        <View style={{width: 100}}>
          <StarRating
            key={item._id}
            disabled={false}
            maxStars={5}
            rating={item.rateNumber}
            disabled={true}
            starSize={18}
            fullStarColor={Colors.purple_darken}
          />
        </View>
        <View style={{width: '100%'}}>
          <Text
            style={{
              fontFamily: Fonts.poppins_regular,
              fontSize: 18,
              width: '80%',
            }}>
            {item.comment}
          </Text>
        </View>
      </View>
    </View>
  );

  let view;
  if (reviews.length === 0) {
    view = (
      <View style={{flex: 1, alignItems: 'center', marginTop: '50%'}}>
        <Icon name="md-star" size={30} color="#9e9e9e" />
        <Text
          style={{
            fontFamily: Fonts.poppins_regular,
            fontSize: 15,
            color: '#9e9e9e',
          }}>
          You have no reviews yet.
        </Text>
      </View>
    );
  } else {
    view = (
      <View style={{flex: 1}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={reviews}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              onRefresh={handleRefresh}
              refreshing={isRefreshing}
              title="Pull to refresh"
              tintColor={Colors.pink}
              titleColor={Colors.pink}
            />
          }
          keyExtractor={item => item._id}
          extraData={reviews}
          onEndReachedThreshold={0.5}
          initialNumToRender={20}
          style={{marginTop: 2}}
          onMomentumScrollBegin={() => {
            handleLoadMore();
          }}
          ListFooterComponent={
            <View
              style={{
                alignItems: 'center',
                position: 'absolute',
                alignSelf: 'center',
              }}>
              {isLoadingMoreData && (
                <MaterialIndicator color={Colors.purple_darken} size={30} />
              )}
              {endOfFile &&
                (reviews.length > 16 && (
                  <Text
                    style={{
                      fontFamily: Fonts.poppins_regular,
                      color: Colors.grey_darken,
                    }}>
                    No more reviews to load
                  </Text>
                ))}
            </View>
          }
        />
      </View>
    );
  }

  return <View style={styles.screen}>{view}</View>;
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 150,
    borderColor: 'black',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default Reviews;
