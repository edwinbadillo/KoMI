import React from 'react';
import { useDispatch, shallowEqual, useSelector } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';

import Icon from './icon';
import * as CONSTANTS from '../constants';
import { search } from '../actions';
import { selectLoaderStatus } from '../selectors';

function App() {
  const dispatch = useDispatch();
  const loaderStatus = useSelector(selectLoaderStatus, shallowEqual);
  // const metadaForm = useSelector(selectMetadataForm, shallowEqual);

  const isFetching = loaderStatus.show && loaderStatus?.type === CONSTANTS.MAL;

  const fetchData = () => {
    dispatch(search({ type: CONSTANTS.MAL, initial: true }));
  };

  const buttonStyle = {
    position: 'absolute',
    right: 5,
    top: 5,
  };

  return (
    <>
      <button
        type="button"
        className="v-btn v-btn--flat v-btn--icon v-btn--round theme--dark v-size--default"
        onClick={fetchData}
      >
        <Icon aria-hidden="true" />
        {isFetching && <CircularProgress style={buttonStyle} aria-hidden="true" />}
      </button>
    </>
  );
}

export default App;
