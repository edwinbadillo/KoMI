import React from 'react';
import { useDispatch, shallowEqual, useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Form from './form';
import Match from './match';
import { closeModal } from '../actions';
import { selectModalStatus } from '../selectors';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 800,
    maxWidth: '90%',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxHeight: '80vh',
    overflowY: 'scroll',
  },
}));

const MetadataModal = () => {
  const dispatch = useDispatch();
  const modalStatus = useSelector(selectModalStatus, shallowEqual);
  const showModal = modalStatus.show;

  const classes = useStyles();

  const onClose = () => {
    dispatch(closeModal());
  };

  return (
    <Modal
      open={showModal}
      onClose={onClose}
    >
      <div className={classes.paper}>
        <Match />
        <Form />
      </div>
    </Modal>
  );
};

export default MetadataModal;
