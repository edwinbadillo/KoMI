import React from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Form from './Form';
import Match from './Match';


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


const getDefaultValues = (anilistData) => {
  const { closest = {}, existingMetadata = {} } = (anilistData || {});
  let tags;
  let genres;
  let status;

  // Tags Logic
  if (existingMetadata.tagsLock && window.komga.enforceLocks) {
    tags = existingMetadata.tags || []
  } else {
    const aniListTags = (closest.tags || []).map((tagObj) => tagObj.name);
    tags = [...new Set([...(existingMetadata.tags || []), ...(aniListTags || [])])]
  }

  // Genres Logic
  if (existingMetadata.genresLock && window.komga.enforceLocks) {
    genres = existingMetadata.genres;
  } else {
    genres = [...new Set([...(existingMetadata.genres || []), ...(closest.genres || [])])]
  }

  // Status Logic
  if (existingMetadata.statusLock && window.komga.enforceLocks) {
    status = existingMetadata.status;
  } else {
    // Map Anilist
    switch (closest.status) {
      case 'FINISHED':
        status = 'ENDED'
        break;
      case 'RELEASING':
        status = 'ONGOING'
        break;
      case 'ABANDONED': // Anilist does not handle this.
        status = 'ABANDONED'
        break;
      case 'HIATUS': // Anilist does not handle this.
        status = 'HIATUS'
        break;
      default:
        status = existingMetadata.status;
        break;
    }
  }

  // Not gonna do a full decode, do not trust anilist and don't care that much to do a full implementation for little gain
  let summary = existingMetadata.summaryLock && window.komga.enforceLocks ? existingMetadata.summary : closest.description || existingMetadata.summary;
  if (summary) {
    summary = summary.replace(/<br>/gi, '\n');
    summary = summary.replace(/<b>|<\/b>|<i>|<\/i>/gi, '');
  }

  const defaultValues = {
    title: existingMetadata.title,
    sortTitle: existingMetadata.titleSort,
    summary,
    status,
    publisher: existingMetadata.publisherLock && window.komga.enforceLocks ? existingMetadata.publisher : closest.publisher || existingMetadata.publisher,
    genres,
    tags,
    language: existingMetadata.languageLock && window.komga.enforceLocks ? existingMetadata.language : window.komga.defaultLanguage || existingMetadata.language,
    ageRating: existingMetadata.ageRating,
  };
  return defaultValues;
}

let resetForm = () => null;



const MetadataModal = (props) => {
  const { setIsFetching } = props;
  const { closest = null, existingMetadata = {}, list = [] } = (props.anilistData || {});
  const classes = useStyles();
  const defaultValues = getDefaultValues(props.anilistData);

  let setReset = (reset) => {
    resetForm = reset;
    props.setUpdateForm((anilistData) =>{
      resetForm(getDefaultValues(anilistData));    
    });
  }

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
    resetForm(getDefaultValues({
      ...props.anilistData,
      closest: match,
    }));
  }

  const onSubmit = (formData) => {
    console.log('formData', formData)
    let data = {
      ...formData,
      statusLock: existingMetadata.statusLock,
      readingDirectionLock: existingMetadata.readingDirectionLock,
      ageRatingLock: existingMetadata.ageRatingLock,
      publisherLock: existingMetadata.publisherLock,
      languageLock: existingMetadata.languageLock,
      genresLock: existingMetadata.genresLock,
      tagsLock: existingMetadata.tagsLock,
      titleLock: existingMetadata.titleLock,
      titleSortLock: existingMetadata.titleSortLock,
      summaryLock: existingMetadata.summaryLock,
    };

    if (!window.komga.keepExistingLocksOnUpdate) {
      const lockData = {
        statusLock: window.komga.newLockValue,
        readingDirectionLock: window.komga.newLockValue,
        ageRatingLock: window.komga.newLockValue,
        publisherLock: window.komga.newLockValue,
        languageLock: window.komga.newLockValue,
        genresLock: window.komga.newLockValue,
        tagsLock: window.komga.newLockValue,
        titleLock: window.komga.newLockValue,
        titleSortLock: window.komga.newLockValue,
        summaryLock: window.komga.newLockValue
      };

      if (typeof data.genres === 'string') {
        data.genres = data.genres.split(',');
      }

      if (typeof data.tags === 'string') {
        data.tags = data.tags.split(',');
      }

      data = { ...data, ...lockData };
    }

    setIsFetching(true);

    axios({
      method: 'patch',
      url: `${window.location.origin}/api/v1${window.location.pathname}/metadata`,
      // url: 'https://run.mocky.io/v3/f304e0dd-e722-4a81-a031-26d899586972',
      data,
    }).then((response) => {
      props.onClose();
      window.location.reload();
    }).catch((error) => {
      setIsFetching(false);
      console.log(error);
    });
  };

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
    // aria-labelledby="simple-modal-title"
    // aria-describedby="simple-modal-description"
    >
      <div className={classes.paper}>
        <Match currentMatch={closest} matches={list} updateMatch={updateMatch} />
        <Form
          defaultValues={defaultValues}
          readOnly={readOnly}
          onSubmit={onSubmit}
          setReset={setReset}
          fetchData={props.fetchData}
        />
      </div>
    </Modal>
  );
}

export default MetadataModal;
