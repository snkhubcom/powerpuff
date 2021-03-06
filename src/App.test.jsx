import React from 'react';
import ReactDOM from 'react-dom';
import { StaticRouter } from 'react-router-dom';
import { showMessage, textTruncate, arrayToObject } from './Helpers';
import reducer from './stores/modules';
import App from './App';
import { FETCH_SHOW_BEGIN, FETCH_SHOW_SUCCESS } from './stores/modules/series';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <StaticRouter location="someLocation" context={{}}>
      <App />
    </StaticRouter>, div,
  );
  ReactDOM.unmountComponentAtNode(div);
});

it('should have correct structure ', () => {
  expect(arrayToObject([{
    show: { id: 0, bla: 'test' },
  }]))
    .toEqual({ 0: { show: { bla: 'test', id: 0 } } });
});

it('should return an error message ', () => {
  expect(showMessage())
    .toEqual(false);
  expect(showMessage(true, false))
    .toEqual(<h2>loading..</h2>);
  expect(showMessage(false, 'error'))
    .toEqual(<h2>error</h2>);
});

it('should truncate text', () => {
  expect(textTruncate('bla', 100, ''))
    .toEqual('bla');
  expect(textTruncate('123', 2, '!'))
    .toEqual('1!');
});


it('should return the initial state ', () => {
  expect(reducer(undefined, {}))
    .toEqual({
      series: {
        episodeList: {},
        error: null,
        isFetching: false,
        shows: {},
        search: '',
      },
    });
});


it('should handle FETCH_SHOW_BEGIN', () => {
  expect(
    reducer({}, {
      type: FETCH_SHOW_BEGIN,
    }).series.isFetching,
  )
    .toEqual(true);
});

it('should update show for type FETCH_SHOW_SUCCESS', () => {
  expect(
    reducer({}, {
      type: FETCH_SHOW_SUCCESS,
      result: 'test',
      id: 1,
    }).series.shows,
  )
    .toEqual({ 1: { show: 'test' } });
});
