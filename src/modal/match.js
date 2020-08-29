/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useDispatch, shallowEqual, useSelector } from 'react-redux';

import { Col, Row } from 'react-styled-flexboxgrid';

import { updateSelectedSeries } from '../actions';
import {
  selectSelectedSeries, selectSearchResults,
} from '../selectors';

const Match = () => {
  const dispatch = useDispatch();
  const selectedSeries = useSelector(selectSelectedSeries, shallowEqual);
  const searchResults = useSelector(selectSearchResults, shallowEqual);

  const updateMatch = (series) => {
    dispatch(updateSelectedSeries(series));
  };

  const synonymLength = selectedSeries && selectedSeries.synonyms && selectedSeries.synonyms.length;
  // window.selectedSeries = selectedSeries;
  return (
    <Row>
      {!selectedSeries && <h2>No Results...</h2>}
      {selectedSeries
        && (
          <Col xs={8}>
            <h2>Current Match</h2>
            <Row>
              {selectedSeries.coverImage
                && (
                  <Col xs={6}>
                    <img
                      style={{ maxWidth: 220 }}
                      src={selectedSeries?.coverImage?.extraLarge
                        || selectedSeries?.coverImage?.large
                        || selectedSeries?.coverImage?.medium}
                      alt={selectedSeries?.title?.english
                        || selectedSeries?.title?.romaji
                        || selectedSeries?.title?.native}
                    />
                  </Col>
                )}
              <Col xs={6} style={{ wordBreak: 'break-word' }}>

                <div>
                  {selectedSeries.title
                    && (
                      <>
                        <h3>Title</h3>
                        <p>
                          English:
                          {selectedSeries.title?.english}
                        </p>
                        <p>
                          Romaji:
                          {selectedSeries.title?.romaji}
                        </p>
                        <p>
                          Native:
                          {selectedSeries.title?.native}
                        </p>
                      </>
                    )}
                  {selectedSeries.synonyms && selectedSeries.synonyms?.length
                    && (
                      <>
                        <p>
                          Synonyms:&nbsp;
                          {selectedSeries.synonyms?.map((synonym, index) => (
                            <span>
                              {synonym}
                              {index < synonymLength - 1 && ','}
                            </span>
                          ))}
                        </p>
                      </>
                    )}
                </div>

                {selectedSeries.description
                  && (
                    <div style={{ marginTop: 24 }}>
                      <h3>Description</h3>
                      <p style={{
                        width: 205,
                        height: 160,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 8,
                      }}
                      >
                        {selectedSeries.description.replace(/<br>/gi, '\n').replace(/<b>|<\/b>|<i>|<\/i>/gi, '')}
                      </p>
                    </div>
                  )}
              </Col>
            </Row>
          </Col>
        )}

      {searchResults && searchResults.length > 0
        && (
          <Col xs={4}>
            <h2>Other Matches:</h2>
            <ul>
              {searchResults.map((match) => (
                <li>
                  <a
                    role="button"
                    tabIndex="0"
                    style={{
                      'text-decoration': match.id === selectedSeries.id ? 'underline' : '',
                      fontWeight: match.id === selectedSeries.id ? 700 : 'normal',
                      cursor: 'pointer',
                    }}
                    onClick={() => { updateMatch(match); }}
                    onKeyDown={(e) => {
                      if (e?.code === 'Space' || e?.code === 'Enter') {
                        updateMatch(match);
                      }
                    }}
                  >
                    {match.title.english || match.title.romaji || match.title.romaji}
                  </a>
                </li>
              ))}
            </ul>
          </Col>
        )}
    </Row>
  );
};

export default Match;
