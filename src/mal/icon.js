import React from 'react';
import PropTypes from 'prop-types';

const Icon = ({ className }) => (
  <img
    alt="My Anime List"
    width="24"
    height="24"
    style={{ borderRadius: '15%' }}
    className={className}
    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAACQCAMAAADQmBKKAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAGtUExURS5SoqGx1ejr9LzI4f////7+/j1dqC5Roi5Roi5RomeAuvv8/UBgqnWLwdje7b3I4vr7/Ont9fX3+sTN5Pz8/f39/nqQw1RxszRVpOfr9DJVpEVkrFp1tfL0+ert9Vt3tbC93IabyW6Gvl55t/j5+3aNwUhmrTBTonCIv2+Hv114tn+UxuXp82V/utDY6rG+3MzU6N7j8Ky52WiBvGR+ujZZpp2t0zhZpomcyqKy1cvU6Fdzs2F8uNvh7vP0+fv7/dTb7Nnf7uLn8rvG4LbC3vf4+/Hz+Oru9nOLwd/l8b/K4vP1+U1qr/r6/Ovu9neOwuzv9kNjq8DL4/n6/PDy+EdlrDpbpsHL45Wmz7fD3mB6uPT1+f3+/oGWx1h1tUloroWZyKu52bPA3aW014yfy5Olzoqeyk5ssK+825mr0crT5/T2+niPw7vH4Zao0MfQ5u7x99Pa62yFveTo8q682+/x96e116m32KCw1GuDvLTB3drf7u7w96q42MjR5nuRxMPN5Obq9Nzi7+js9FFusfz9/rnE37rF4O/y95KkzTxcqLK+3OHm8UJhqj9fqQsCxzMAAAAJdFJOU8f////////Gmtj47TgAAAMoSURBVHja7dlld9swFAbgtrvadpdu7bqkzVJKmZlpK21lWsfMzMzM9Ju3Jql1DUq9Mzn2h/t+anRl6zk+BlXKwmBlSxaDGMQgBjGIQQxiEIMYxCAGMYhBDGIQgxjEIAYxiEEMYhCDGOQnqGeHkXb7ATWy+tDxjFXX7nSUld4oWM94srlrl5HCfwRtBplZW3FBFnNsh8Yuj4XBElGbKGXLlk3/ARL1luIIqEE9kzbNWrJ1gqC6z1Q7CmpQPASOmdEKglFauhJRgkr2gyJhvSDRT0qLoAI1RUCZeq0gCBcblfOgAl0Sag8c0AuCB+uFFqECnUrngYOaQTCQbI8WgAJUcjKdB8RvzSAxlGgfBAUoOmc7ovrr4k6ZBs2g5DVvEirQEYsm51vMPpBWENxCzN0LClCRWTo+v9a4kG9k1QOQuI8zoAJ1mHp2JhsJUngAgn0DoAKZLpC4iJkBgVCCWmlTHDMFAhWojr6iP6D/oAp6GasCAHpBGt6j16Cw/RO+2wKib4Npz0Ghj58snuUaM2ie1PLRexBWmB+vUO12M+g2fTfM5k18nnzedrXz1WPwCoRvTQ//ElpA7RvfappBuEzO/QOtoHeZB9XKqfJPtIHmMg/CwvXbqPq7HRTyAYTHUifuRhuoTvgBwubEj160g36BL6Dc1b9/30MH0Io/IKwUUBp1AhX7BMJzkSJ0Ah3yC4TluBHo9TaSp56D0BlEvlljtFehbyD5HtpDe930DXRCjltHl7V8A5Hp0RLpNe0baNSyppBKfTpQWZ4pDVpBF+TPu6RXZTqQJW+0gsrJwHLdBp+5B4mYVhCSZcUnsleXe9CU3nuI3tUvZa8W96AvmkETZORGo1e3e1ClZlAjmRG1Gr2GXYMimh97xFIy9IqxnO8a1KwdFCdnv258i12D2rSDiun/hKdTvYYESVrQsIvdIDmLOG4v9slqaopEnrORw8pPQjTXOR5sT501rk9vQPbLHqXmHyVB2cBLzMbEYCw4O4plAOGKIG1xNoipM8Hac+3nXWkGMYhBDGIQgxjEIAYxiEEMYhCDGMQgBjGIQQxiEIMY5BMoYNn6B/aiyjiUWiDYAAAAAElFTkSuQmCC"
  />
);

Icon.propTypes = {
  className: PropTypes.string,
};

Icon.defaultProps = {
  className: '',
};

export default Icon;
