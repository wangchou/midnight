import {combineReducers} from 'redux';
import books from './books';
import pageData from './pageData';
import ui from './ui';

export default combineReducers({
  books,
  pageData,
  ui
});