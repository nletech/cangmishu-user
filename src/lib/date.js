import moment from 'moment';

/**
 * 获取过去七天时间range
 */
export const getLast7DaysRange = () => {
  const beginTime = moment()
    .subtract(6, 'days')
    .format('YYYY-MM-DD');
  const endTime = moment(new Date()).format('YYYY-MM-DD');
  return { beginTime, endTime };
};

export const getLast3MonthsRange = () => {
  const beginTime = moment()
    .subtract(3, 'months')
    .format('YYYY-MM-DD');
  const endTime = moment(new Date()).format('YYYY-MM-DD');
  return { beginTime, endTime };
};

/**
 * 这个月
 */
export const getThisMonthRange = () => {
  const beginTime = moment()
    .startOf('month')
    .format('YYYY-MM-DD');
  const endTime = moment()
    .endOf('month')
    .format('YYYY-MM-DD');
  return { beginTime, endTime };
};

/**
 * 这个礼拜
 */
export const getThisWeekRange = () => {
  const weekOfday = parseInt(moment().format('d')); // 计算今天是这周第几天 周日为一周中的第一天
  const beginTime = moment()
    .subtract(weekOfday - 1, 'days')
    .format('YYYY-MM-DD'); // 周一日期
  const endTime = moment()
    .add(7 - weekOfday, 'days')
    .format('YYYY-MM-DD'); // 周日日期
  return { beginTime, endTime };
};

/**
 * 今天
 */
export const getTodayRange = () => {
  // date.push(moment().format('YYYY-MM-DD'))
  // date.push(moment().format('YYYY-MM-DD'))
  // 获取当天的开始结束时间，精确到时分秒
  const beginTime = moment()
    .startOf('days')
    .format('YYYY-MM-DD');
  const endTime = moment()
    .endOf('days')
    .add(1, 'days')
    .format('YYYY-MM-DD');
  return { beginTime, endTime };
};

export const getNullRange = () => {
  const beginTime = null;
  const endTime = null;
  return { beginTime, endTime };
};
