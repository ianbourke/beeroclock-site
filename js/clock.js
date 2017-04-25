const init = (function () {
  function fadeIn(selector) {
    document.querySelector(selector).style.opacity = 100;
  }

  function getDials(time, useLocalTime) {
    return [ {
      type: 'second',
      el: document.querySelector('#second-dial'),
      currentRotation: 270 + (time.getSeconds() * 6),
      rotationIncrement: 6,
      rotationInterval: 1000
    }, {
      type: 'minute',
      el: document.querySelector('#minute-dial'),
      currentRotation: 270 + (time.getMinutes() * 6),
      rotationIncrement: 6,
      rotationInterval: 60000
    }, {
      type: 'hour',
      el: document.querySelector('#hour-dial'),
      currentRotation: 270 + ((useLocalTime ? time.getHours() : 17) * 30),
      rotationIncrement: 30,
      rotationInterval: 3600000
    } ];
  }

  function isPastBeerOClock(time) {
    const hour = time.getHours();

    return hour < 3 || hour >= 17;
  }

  function getTransform(rotation) {
    return 'translateX(22em) translateY(24.5em) rotate(' + rotation + 'deg)';
  }

  function getRotation(dial, increment) {
    return increment ? dial.currentRotation + dial.rotationIncrement : dial.currentRotation;
  }

  function getInitialTimeout(dial, time) {
    switch (dial.type) {
      case 'second':
        return (dial.rotationInterval) - (time.getMilliseconds());
      case 'minute':
        return (dial.rotationInterval) - (time.getMilliseconds()) - (time.getSeconds() * 1000);
      case 'hour':
        return (dial.rotationInterval) - (time.getMilliseconds()) - (time.getSeconds() * 1000) - (time.getMinutes() * 60000);
    }
  }

  function isDialHourDial(dial) {
    return dial.type === 'hour';
  }

  function shouldRotate(dial, time) {
    return !isDialHourDial(dial) || time.getHours() !== 17 && isPastBeerOClock(time);
  }

  function rotate(dial, newRotation = null) {
    if (!newRotation) {
      newRotation = getRotation(dial, true);
    }

    dial.currentRotation = newRotation;
    dial.el.style.transform = getTransform(dial.currentRotation);

  }

  function setAnswer(time, timeZoneData) {
    const answer = document.querySelector('#answer');

    if (isPastBeerOClock(time)) {
      answer.innerText = 'It\'s well past beer o\'clock where you\'re now, mate!\nGet your drink on! Cheers!';
    } else {
      const { city, country, phrase, lang } = getCurrentTimeZoneData(time, timeZoneData);
      answer.innerText = `It\'s beer o\'clock in ${city}, ${country}.\n${phrase} (That\'s \"Cheers!\" in ${lang})!`;
    }
  }

  function getCurrentTimeZoneData(time, timeZoneData) {
    return timeZoneData[ (17 - time.getUTCHours()).toString() ];
  }

  function update(dial, timeZoneData) {
    if (isDialHourDial(dial)) {
      const currentTime = new Date();

      if (shouldRotate(dial, currentTime))
        rotate(dial);
      else if (!isPastBeerOClock(currentTime))
        rotate(dial, 270 + (17 * 30));

      setAnswer(currentTime, timeZoneData);
    } else {
      rotate(dial);
    }
  }

  return function init(initialTime, timeZoneData) {
    setTimeout(() => fadeIn('#clock'), 500);
    setTimeout(() => fadeIn('#answer'), 1000);

    getDials(initialTime, isPastBeerOClock(initialTime)).forEach(dial => {
      dial.el.style.transform = getTransform(getRotation(dial, false));

      setTimeout(() => dial.el.style.transition = 'linear 0.5s', 1);

      setTimeout(() => {
        update(dial, timeZoneData);
        setInterval(() => {
          update(dial, timeZoneData);
        }, dial.rotationInterval);
      }, getInitialTimeout(dial, initialTime));
    });

    setAnswer(initialTime, timeZoneData);
  }
})();

