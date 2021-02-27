import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Form from '../containers/form';
import Match from './match';
import { getDefaultValues } from '../../helpers';


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


const MetadataModal = (props) => {
  const { closest = null, existingMetadata = {}, list = [] } = (props.anilistData || {});
  const classes = useStyles();
  const defaultValues = getDefaultValues(props.anilistData);


  console.log('Data', props.anilistData);

  const readOnly = {
    title: existingMetadata.titleLock && window.komga.enforceLocks,
    sortTitle: existingMetadata.titleSortLock && window.komga.enforceLocks,
    summary: existingMetadata.summaryLock && window.komga.enforceLocks,
    status: existingMetadata.statusLock && window.komga.enforceLocks,
    publisher: existingMetadata.publisherLock && window.komga.enforceLocks,
    genres: existingMetadata.genresLock && window.komga.enforceLocks,
    tags: existingMetadata.tagsLock && window.komga.enforceLocks,
    language: existingMetadata.languageLock && window.komga.enforceLocks,
    ageRating: existingMetadata.ageRatingLock && window.komga.enforceLocks,
  };

  const updateMatch = (match) => {
    props.setAnilistData({
      ...props.anilistData,
      closest: match,
    });

    props.formData.metadata.reset(getDefaultValues({
      ...props.anilistData,
      closest: match,
    }))
  }



  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
    >
      <div className={classes.paper}>
        <Match
          currentMatch={closest}
          matches={list} updateMatch={updateMatch}
        />
        <Form
          defaultValues={defaultValues}
          readOnly={readOnly}
          fetchData={props.fetchData}
        />
      </div>
    </Modal>
  );
}

export default MetadataModal;
