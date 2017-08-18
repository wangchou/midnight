import React, { Component } from 'react';
import moment from 'moment';
import BookPage from './BookPage';
import {
  StyleSheet,
  ScrollView,
  Dimensions,
  Keyboard,
  View
} from 'react-native';
import {connect} from 'react-redux';
import {swipeStarted, swipeEnded} from '../actions/ui';
import {changeBookPage} from '../actions/books';

const windowWidth = Dimensions.get('window').width;
const pageSeparatorWidth = 20;
const snapToInterval = windowWidth + pageSeparatorWidth;
const pageCenterIndex = 2;

@connect(null,{
  swipeStarted,
  swipeEnded,
  changeBookPage
})
export default class BookSwipeContainer extends Component {
  constructor(props) {
    super(props);
    this.isKeyboardShow = false;
    this.scrollView = null;
    this.scrollToCenterPage = () => {
      this.scrollView.scrollTo({
        x: snapToInterval * pageCenterIndex,
        animated: false
      });
    }

    const preventTextInputFocused = () => {
      this.props.swipeStarted();
      if(this.scrollEndTimer) {
        clearTimeout(this.scrollEndTimer);
      }
      this.scrollEndTimer = setTimeout(this.props.swipeEnded, 100);
    };

    this.onScroll = preventTextInputFocused;

    // doing the hard coded infinite scroll
    this.onScrollEnd = (event) => {
      this.props.swipeEnded();
      const indexChange = event.nativeEvent.contentOffset.x/snapToInterval - pageCenterIndex;
      if (indexChange <= -1 || indexChange >= 1) {
        const bookModel = this.props.bookModel;
        const newBookMomentStr = moment(bookModel.momentStr).add(indexChange, bookModel.unit).format();
        this.props.changeBookPage(bookModel.id, newBookMomentStr);
      }
    }
  }

  componentDidMount() {
    this.scrollToCenterPage();
  }

  componentDidUpdate() {
    this.scrollToCenterPage();
  }

  shouldComponentUpdate(props) {
    return this.props.bookModel.id !== props.bookModel.id ||
           this.props.bookModel.momentStr !== props.bookModel.momentStr;
  }

  render() {
    const bookModel = this.props.bookModel;
    const pageViews = [-2, -1, 0, 1, 2]
      .map(shift => moment(bookModel.momentStr).add(shift, bookModel.unit))
      .map(moment => {
        const title = moment.format(bookModel.titleFormat);
        const dataKey = bookModel.id + "-" + moment.format(bookModel.dataKeyFormat);
        return (
          <BookPage
            key={dataKey}
            title={title}
            dataKey={dataKey}
          />
        );
      });

    return (
      <ScrollView
        ref={(scrollView) => {this.scrollView = scrollView}}
        style={styles.swipeContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate={'fast'}
        onMomentumScrollEnd= {this.onScrollEnd}
        keyboardShouldPersistTaps={'always'}
        snapToInterval={snapToInterval}
        scrollEventThrottle={100}
        onScroll={this.onScroll}
      >
        {pageViews[0]}
        <View style={styles.pageSeparator} />
        {pageViews[1]}
        <View style={styles.pageSeparator} />
        {pageViews[2]}
        <View style={styles.pageSeparator} />
        {pageViews[3]}
        <View style={styles.pageSeparator} />
        {pageViews[4]}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  swipeContainer: {
    backgroundColor: '#FAFAFA',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(155, 155, 155, 0.5)',
    marginBottom: 5,
  },
  pageSeparator: {
    width: pageSeparatorWidth,
    backgroundColor: 'rgba(155, 155, 155, 0.3)'
  }
});
