import immutable from 'object-path-immutable'
import {
  SET_FONT_SCALE,
  SET_BOOK_NUM_OF_LINES,
  RESET_SETTINGS,
  YEAR_BOOK_ID,
  MONTH_BOOK_ID,
  WEEK_BOOK_ID,
  DAY_BOOK_ID,
} from '../constants'

const intitialState = {
  fontScale: 1.0,
  numberOfLines: {
    [YEAR_BOOK_ID]: 10,
    [MONTH_BOOK_ID]: 10,
    [WEEK_BOOK_ID]: 10,
    [DAY_BOOK_ID]: 10,
  }
}

const max = (a ,b) => a > b ? a : b

export default (state = intitialState, action) => {
  switch (action.type) {
    case SET_FONT_SCALE:
      return immutable.set(state, 'fontScale', action.payload.data)
    case SET_BOOK_NUM_OF_LINES:
      return immutable.set(
        state,
        ['numberOfLines', action.payload.bookId],
        max(1, action.payload.data)
      )
    case RESET_SETTINGS:
      return intitialState
  }
  return state
}
