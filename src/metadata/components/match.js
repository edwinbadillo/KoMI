/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Col, Row } from 'react-styled-flexboxgrid'

const Match = ({ currentMatch, matches, updateMatch }) => {
  const synonymLength = currentMatch && currentMatch.synonyms && currentMatch.synonyms.length;
  console.log('currentMatch', currentMatch);
  window.currentMatch = currentMatch
  return (
    <Row>
      {!currentMatch && <h2>No Results...</h2>}
      {currentMatch &&
        <Col xs={8}>
          <h2>Current Match</h2>
          <Row>
            {currentMatch.coverImage &&
              <Col xs={6}>
                <img
                  style={{ maxWidth: 220 }}
                  src={currentMatch.coverImage && (currentMatch.coverImage.extraLarge || currentMatch.coverImage.large || currentMatch.coverImage.medium)}
                  alt={currentMatch.title && (currentMatch.title.english || currentMatch.title.romaji || currentMatch.title.romaji)}
                />
              </Col>
            }
            <Col xs={6}>

              <div>
                {currentMatch.title &&
                  <>
                    <h3>Title</h3>
                    <p>English: {currentMatch.title.english}</p>
                    <p>Romaji: {currentMatch.title.romaji}</p>
                    <p>Native: {currentMatch.title.romaji}</p>
                  </>
                }
                {currentMatch.synonyms && currentMatch.synonyms.length &&
                  <>
                    <p>Synonyms:&nbsp;
                    {currentMatch.synonyms.map((synonym, index) => (
                      <span>
                        {synonym}
                        {index < synonymLength - 1 && ','}
                      </span>
                    ))}
                    </p>
                  </>
                }
              </div>


              {currentMatch.description &&
                <div style={{ marginTop: 24 }}>
                  <h3>Description</h3>
                  <p style={{
                    width: 205,
                    height: 160,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 8,
                  }}>
                    {currentMatch.description.replace(/<br>/gi, '\n').replace(/<b>|<\/b>|<i>|<\/i>/gi, '')}
                  </p>
                </div>
              }
            </Col>
          </Row>
        </Col>
      }

      {matches && matches.length > 0 &&
        <Col xs={4}>
          <h2>Other Matches:</h2>
          <ul>
            {matches.map((match) => (
              <li>
                <a
                  style={{
                    'text-decoration': match.id === currentMatch.id ? 'underline' : '',
                    'fontWeight': match.id === currentMatch.id ? 700 : 'normal',
                    cursor: 'pointer',
                  }}
                  onClick={() => { updateMatch(match) }}
                >
                  {match.title.english || match.title.romaji || match.title.romaji}
                </a>
              </li>
            ))}
          </ul>
        </Col>
      }
    </Row>
  )
};
export default Match;