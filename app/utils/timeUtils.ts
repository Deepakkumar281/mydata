import moment from 'moment';

export const utcToLocal = (dateString: string) => {
  var offset = moment().utcOffset();
  var localTime = moment
    .utc(dateString)
    .utcOffset(offset)
    .format('YYYY-MMM-DD h:mm A');
  return localTime;
};

export const localToUtc = (localTime: string) => {
  var utcTime = moment.utc(moment(localTime)).format();
  return utcTime;
};
