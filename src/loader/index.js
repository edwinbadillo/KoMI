import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import FocusLock from 'react-focus-lock';

import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';

import { selectLoaderStatus } from '../selectors';
import * as CONSTANTS from '../constants';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const Loader = () => {
  const loaderStatus = useSelector(selectLoaderStatus, shallowEqual);
  const classes = useStyles();

  const isFetching = loaderStatus.show && loaderStatus.type === CONSTANTS.SEARCH;

  return (isFetching
    && (
    <FocusLock>
      <Backdrop className={classes.backdrop} open={isFetching}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </FocusLock>
    )
  );
};

export default Loader;
