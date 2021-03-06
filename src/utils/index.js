
import {
  Dimensions,
} from 'react-native'
import moment from 'moment'
import {
  getTitleFormatI18n,
  getThisTitleFormatI18n,
  getStatusTitleFormatI18n,
} from 'i18n'
import {
  CHECKED_CHECKBOX1,
  EMPTY_CHECKBOX1,
  YEAR_UNIT,
  MONTH_UNIT,
  WEEK_UNIT,
  DAY_UNIT,
  YEAR_BOOK_ID,
  MONTH_BOOK_ID,
  WEEK_BOOK_ID,
  DAY_BOOK_ID,
  YEAR_PAGE_ID_FORMAT,
  MONTH_PAGE_ID_FORMAT,
  WEEK_PAGE_ID_FORMAT,
  DAY_PAGE_ID_FORMAT,
} from 'constants'

export const getStartOfWeekTime = time => moment(time).startOf('isoweek').format()
export const getNow = () => moment().format()

const bookSettings = {
  [YEAR_BOOK_ID]: {
    unit: YEAR_UNIT,
    pageIdFormat: YEAR_PAGE_ID_FORMAT,
  },
  [MONTH_BOOK_ID]: {
    unit: MONTH_UNIT,
    pageIdFormat: MONTH_PAGE_ID_FORMAT,
  },
  [WEEK_BOOK_ID]: {
    unit: WEEK_UNIT,
    pageIdFormat: WEEK_PAGE_ID_FORMAT,
  },
  [DAY_BOOK_ID]: {
    unit: DAY_UNIT,
    pageIdFormat: DAY_PAGE_ID_FORMAT,
  },
}

export const getUnit = bookId => bookSettings[bookId].unit

export const getPageIdFormat = bookId => bookSettings[bookId].pageIdFormat

export const getPageTitle = (pageId) => {
  const array = pageId.split('-')
  const bookId = array[0]
  const generalTitle = getTimeFromPageId(pageId).format(getTitleFormatI18n(bookId))
  const now = (bookId === WEEK_BOOK_ID) ? getStartOfWeekTime() : getNow()
  const nowTitle = moment(now).format(getTitleFormatI18n(bookId))
  if (nowTitle === generalTitle) {
    return moment(now).format(getThisTitleFormatI18n(bookId))
  }
  return generalTitle
}

export const getPageId = (bookId, time) => `${bookId}-${moment(time).format(getPageIdFormat(bookId))}`

export const getNowPageId = (bookId) => {
  const time = (bookId === WEEK_BOOK_ID) ? getStartOfWeekTime() : getNow()
  return getPageId(bookId, moment(time))
}

export const getTimeFromPageId = (pageId) => {
  const array = pageId.split('-')
  const bookId = array[0]
  const timeString = array[1]

  // how this will work on week? really convert to correct time with locale?
  return moment(timeString, getPageIdFormat(bookId))
}

export const getSiblingPageId = (pageId, shift) => {
  const array = pageId.split('-')
  const bookId = array[0]
  const unit = getUnit(bookId)
  const time = getTimeFromPageId(pageId)
  return getPageId(bookId, time.add(shift, unit))
}

export const getNextPageId = pageId => getSiblingPageId(pageId, 1)
export const getPreviousPageId = pageId => getSiblingPageId(pageId, 1)

/* for  status page only */
export const getNowStatusTitle = bookId => moment(bookId === WEEK_BOOK_ID ?
  getStartOfWeekTime() : getNow()).format(getStatusTitleFormatI18n(bookId))

export const getMonthChildPageIds = (yearPageId) => {
  const yearTime = getTimeFromPageId(yearPageId)
  const shifts = [...Array(12).keys()]
  return shifts.map((shift) => {
    const monthTime = moment(yearTime).add(shift, MONTH_UNIT)
    return getPageId(MONTH_BOOK_ID, monthTime)
  })
}

export const getWeekChildPageIds = (monthPageId) => {
  const monthTime = getTimeFromPageId(monthPageId)
  const monthStr = monthTime.format('M')
  const weekPageIds = []
  const weekTime = monthTime.startOf('isoweek')
  if (weekTime.format('M') !== monthStr) { weekTime.add(1, WEEK_UNIT) }

  while (weekTime.format('M') === monthStr) {
    weekPageIds.push(getPageId(WEEK_BOOK_ID, weekTime))
    weekTime.add(1, WEEK_UNIT)
  }

  return weekPageIds
}

export const getDayChildPageIds = (weekPageId) => {
  const weekTime = getTimeFromPageId(weekPageId)
  const shifts = [...Array(7).keys()]
  return shifts.map((shift) => {
    const dayTime = moment(weekTime).add(shift, DAY_UNIT)
    return getPageId(DAY_BOOK_ID, dayTime)
  })
}

export const getChildPageIds = (parentPageId) => {
  const array = parentPageId.split('-')
  const bookId = array[0]
  if (bookId === YEAR_BOOK_ID) return getMonthChildPageIds(parentPageId)
  if (bookId === MONTH_BOOK_ID) return getWeekChildPageIds(parentPageId)
  if (bookId === WEEK_BOOK_ID) return getDayChildPageIds(parentPageId)
  return []
}


export const getCheckboxCount = (text) => {
  let checkedCount = 0
  let emptyCount = 0
  if (text) {
    for (let i = 0; i < text.length; i += 1) {
      const ch = text.charAt(i)
      if (ch === CHECKED_CHECKBOX1) {
        checkedCount++
      }
      if (ch === EMPTY_CHECKBOX1) {
        emptyCount++
      }
    }
  }
  return { checkedCount, emptyCount }
}


export const windowWidth = Dimensions.get('window').width
export const windowHeight = Dimensions.get('window').height
export const getFontSize = fontScale => (windowWidth / 20) * fontScale
export const getTitleHeight = fontScale => getFontSize(fontScale) * (5 / 4)

export const getTodayStr = () => moment().format('MMMM Do YYYY')

// See https://mydevice.io/devices/ for device dimensions
const X_WIDTH = 375
const X_HEIGHT = 812

export const isIPhoneX = () => (windowHeight === X_HEIGHT && windowWidth === X_WIDTH)
