import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import CircularProgress from '@material-ui/core/CircularProgress';

import Metadata from './Metadata';
import Icon from './Icon'
import { getCookie, fetchAnilistData } from './helpers';

let updateForm = () => null;

let setUpdateForm = (updateFunc) => {
  updateForm = updateFunc;
}

function App() {
  const [open, setOpen] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(false);
  const [anilistData, setAnilistData] = React.useState({});
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)') || getCookie('theme') === 'Dark';

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  const anilistCallback = (data, update) => {
    setIsFetching(false);
    setAnilistData(data);
    setOpen(true);
    if(update){
      updateForm(data)
    }
  }

  const fetchData = (inputTitle) => {
    const titleElement = document.querySelector('.v-main__wrap .v-toolbar__content .v-toolbar__title span')
    const title = inputTitle || (titleElement && titleElement.innerText) || '';// a.innerText
    console.log('title', title)
    if (title) {
      setIsFetching(true);
      fetchAnilistData(title, anilistCallback, !!inputTitle);
    }
  };

  const onClose = () => setOpen(false);
  const buttonStyle = {
    position: 'absolute',
    right: 21,
    top: 12,
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <button
          type="button"
          className="v-btn v-btn--flat v-btn--icon v-btn--round theme--dark v-size--default"
          onClick={()=>fetchData()}
        >
          <Icon aria-hidden="true" />
        </button>
        {isFetching && <CircularProgress style={buttonStyle} />}

        <Metadata
          open={open}
          onClose={onClose}
          anilistData={anilistData}
          setIsFetching={setIsFetching}
          setAnilistData={setAnilistData}
          fetchData={fetchData}
          setUpdateForm={setUpdateForm}
        />
      </div>
    </ThemeProvider>

  );
}

export default App;
