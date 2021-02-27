import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import Metadata from '../../metadata/components';
import Icon from './icon'
import { fetchAnilistData, getDefaultValues } from '../../helpers';
import * as CONSTANTS from '../../constants';

function App(props) {
  console.log('props => ', props)
  const [anilistData, setAnilistData] = React.useState({});
  const isFetching = props.loaderStatus.show && props.loaderStatus.type === CONSTANTS.ANILIST;
  const showModal = props.modalStatus.show && props.modalStatus.type === CONSTANTS.ANILIST

  const anilistCallback = (data, update) => {
    setAnilistData(data); // TODO: remove
    props.openModal(CONSTANTS.ANILIST);
    if (update) {
      props.formData.metadata.reset(getDefaultValues(data))
    }
  }

  const fetchData = (inputTitle, initialLoad) => {
    props.search({ title: inputTitle, type: CONSTANTS.ANILIST });
    fetchAnilistData(inputTitle, anilistCallback); // TODO: remove
  };

  const buttonStyle = {
    position: 'absolute',
    right: 21,
    top: 12,
  }

  return (
    <>
      <button
        type="button"
        className="v-btn v-btn--flat v-btn--icon v-btn--round theme--dark v-size--default"
        onClick={() => fetchData(undefined, true)}
      >
        <Icon aria-hidden="true" />
      </button>
      {isFetching && <CircularProgress style={buttonStyle} />}

      <Metadata
        open={showModal}
        onClose={props.closeModal}

        anilistData={anilistData} // TODO: remove
        setAnilistData={setAnilistData} // TODO: remove
        fetchData={fetchData} // TODO: remove
      />
    </>
  );
}

export default App;
