import React, { Component } from 'react'
import moment from 'moment'
import { TouchableWithoutFeedback, Text, View, StyleSheet, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import {
  getNowPageId,
  getChildPageIds,
  getCheckboxCount,
  getNowStatusTitle,
} from '../utils/books'
import {
  YEAR_BOOK_ID,
  MONTH_BOOK_ID,
  WEEK_BOOK_ID,
  DAY_BOOK_ID,
} from '../constants'
import StatusBar from './StatusBar'
import { toggleIsStatusMode } from '../actions'
import {
  yearBarColor,
  yearBarBackgroundColor,
  monthBarColor,
  monthBarBackgroundColor,
  weekBarColor,
  weekBarBackgroundColor,
  dayBarColor,
  dayBarBackgroundColor,
} from '../constants'

const getStatus = (book, pages) => {
  const parentPageId = getNowPageId(book)
  const parentGoalStatus =  getCheckboxCount(pages[parentPageId])
  const childGoalStatus = getChildPageIds(parentPageId)
    .map(id => getCheckboxCount(pages[id]))
    .reduce(
      (child, sum) => ({
        checkedCount: sum.checkedCount + child.checkedCount,
        emptyCount: sum.emptyCount + child.emptyCount,
      }),
      { checkedCount: 0, emptyCount: 0 }
    )

  const leftDays = (moment().endOf(book.unit).format('DDD') - moment().format('DDD') + 1)
  let days = 7;
  if(book.id === YEAR_BOOK_ID) {
    days = moment().endOf(book.unit).format('DDD') - 0
  }
  if(book.id === MONTH_BOOK_ID) {
    days = moment().daysInMonth()
  }

  return ({
    title: getNowStatusTitle(book.id),
    leftDays,
    days,
    parent: {
      text: `${parentGoalStatus.checkedCount}/${parentGoalStatus.checkedCount + parentGoalStatus.emptyCount}`,
      percentage: parentGoalStatus.checkedCount /
        (parentGoalStatus.checkedCount + parentGoalStatus.emptyCount - 0.0001), // avoid Nan
    },
    child: {
      text: `${childGoalStatus.checkedCount}/${childGoalStatus.checkedCount + childGoalStatus.emptyCount}`,
      percentage: childGoalStatus.checkedCount /
        (childGoalStatus.checkedCount + childGoalStatus.emptyCount - 0.0001), // avoid Nan
    },
  })
}

@connect(state => ({
  isStatusMode: state.ui.isStatusMode,
  isKeyboardShow: state.ui.isKeyboardShow,
  yearBook: state.books.byId[YEAR_BOOK_ID],
  monthBook: state.books.byId[MONTH_BOOK_ID],
  weekBook: state.books.byId[WEEK_BOOK_ID],
  pages: state.pages,
}), {
  toggleIsStatusMode,
})
export default class StatusPage extends Component {
  render() {
    const { isStatusMode, isKeyboardShow, yearBook, monthBook, weekBook, pages } = this.props;
    const yearStatus = getStatus(yearBook, pages)
    const monthStatus = getStatus(monthBook, pages)
    const weekStatus = getStatus(weekBook, pages)

    if(!isStatusMode || isKeyboardShow) { return null }
    return (
      <TouchableWithoutFeedback
        onPress={this.props.toggleIsStatusMode}
      >
        <View
          style={styles.container}
        >
          <View style={styles.section}>
            <StatusBar
              leftText={yearStatus.title}
              percentage={1 - yearStatus.leftDays/yearStatus.days}
            />
            <StatusBar
              leftText={"年"}
              barColor={yearBarColor}
              barBackgroundColor={yearBarBackgroundColor}
              rightText={yearStatus.parent.text}
              percentage={yearStatus.parent.percentage}
            />
            <StatusBar
              leftText={"月"}
              rightText={yearStatus.child.text}
              barColor={monthBarColor}
              barBackgroundColor={monthBarBackgroundColor}
              percentage={yearStatus.child.percentage}
            />
          </View>
          <View style={styles.section}>
            <StatusBar
              leftText={monthStatus.title}
              percentage={1 - monthStatus.leftDays/monthStatus.days}
            />
            <StatusBar
              leftText={"月"}
              rightText={monthStatus.parent.text}
              barColor={monthBarColor}
              barBackgroundColor={monthBarBackgroundColor}
              percentage={monthStatus.parent.percentage}
            />
            <StatusBar
              leftText={"週"}
              rightText={monthStatus.child.text}
              barColor={weekBarColor}
              barBackgroundColor={weekBarBackgroundColor}
              percentage={monthStatus.child.percentage}
            />
          </View>
          <View style={styles.section}>
            <StatusBar
              leftText={weekStatus.title}
              percentage={1 - weekStatus.leftDays/weekStatus.days}
            />
            <StatusBar
              leftText={"週"}
              rightText={weekStatus.parent.text}
              barColor={weekBarColor}
              barBackgroundColor={weekBarBackgroundColor}
              percentage={weekStatus.parent.percentage}
            />
            <StatusBar
              leftText={"日"}
              rightText={weekStatus.child.text}
              barColor={dayBarColor}
              barBackgroundColor={dayBarBackgroundColor}
              percentage={weekStatus.child.percentage}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}


const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height
const gray = 'rgba(240, 240, 240, 1)'
const darkGray = 'rgba(180, 180, 180, 1)'
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: windowWidth,
    height: windowHeight/5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderColor: darkGray,
    borderBottomWidth: 0.5,
  },
  section: {
    flex: 1,
    height: windowHeight/5,
    backgroundColor: gray,
    borderRightWidth: 0.5,
    borderColor: darkGray,
  },
})
