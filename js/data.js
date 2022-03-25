const initData = (function () {
  class TimeZoneData {
    constructor(city, country, phrase, lang) {
      this.city = city;
      this.country = country;
      this.phrase = phrase;
      this.lang = lang;
    }
  }

  return function init() {
    return {
      initialTime: new Date(),
      timeZoneData: {
        '-8': new TimeZoneData('Los Angeles', 'USA', 'Cheers!', 'English'),
        '-6': new TimeZoneData('Denver', 'USA', 'Cheers!', 'English'),
        '-5': new TimeZoneData('Austin', 'USA', 'Cheers!', 'English'),
        '-4': new TimeZoneData('Charlotte', 'USA', 'Cheers!', 'English'),
        '0': new TimeZoneData('London', 'UK', 'Cheers wankers!', 'English'),
        '3': new TimeZoneData('Kuwait City', 'Kuwait', 'في صحتك', 'Arabic'),
        '5': new TimeZoneData('New Delhi', 'India', 'चियर्स', 'Hindi'),
        '6': new TimeZoneData('Kathmandu', 'Nepal', 'जय हो', 'Nepali'),
      }
    };
  }
})();
