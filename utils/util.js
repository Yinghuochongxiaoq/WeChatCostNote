const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};
const strToJson = str => {
  var json = JSON.parse(str);
  return json;
};

/**
 * 
 * @param {string}} k 
 * @param {any} v 
 * @param {day} time 
 */
const setStorageSync = (k, v, time) => {
  //有效时期时间戳
  var effTime = parseInt(Date.parse(new Date())) + 1000 * time;
  wx.setStorageSync(k, v);
  wx.setStorageSync(k + "StorTime", effTime);
};

const getStorageSync = k => {
  //当前时间戳
  var currentTime = Date.parse(new Date());
  if (currentTime < wx.getStorageSync(k + "StorTime")) {
    console.log("缓存时间有效");
    return wx.getStorageSync(k);
  } else {
    console.log("缓存时间已过期");
    try {
      wx.removeStorageSync(k);
      wx.removeStorageSync(k + "StorTime");
    } catch (e) {}
    return null;
  }
};

var getBiggerzIndex = (function () {
  //定义弹出层ui的最小zIndex
  let index = 2000;
  return function (level = 0) {
    return level + (++index);
  };
})();

var dateUtil = {
  /**
   * 根据一个日期获取所有的信息
   * @param {日期} date 
   */
  getDetail: function (date) {
    if (!date) {
      date = new Date();
    }
    var d, now = new Date(),
      dateInfo = {},
      _diff;
    var weekDayArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    if (typeof date === 'number') {
      d = new Date();
      d.setTime(date);
      date = d;
    }
    //充值date对象，让其成为一天的起点时间
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    now = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    _diff = date.getTime() - now.getTime();
    if (_diff == 0) {
      dateInfo.day1 = '今天';
    } else if (_diff == 86400000) {
      dateInfo.day1 = '明天';
    } else if (_diff == 172800000) {
      dateInfo.day1 = '后天';
    }
    dateInfo.weekday = weekDayArr[date.getDay()];

    dateInfo.year = date.getFullYear();
    dateInfo.month = date.getMonth() + 1;
    dateInfo.day = date.getDate();

    return dateInfo;
  },

  /**
   * 获取前一个月
   * @param {string} d 
   */
  preMonth: function (d) {
    if (typeof d === 'string') {
      d = new Date(d);
    } else {
      d = new Date();
    }
    var date = new Date(d.getFullYear(), d.getMonth() - 1);
    return date;
  },

  /**
   * 获取后一个月
   * @param {string} d 
   */
  nextMonth: function (d) {
    if (typeof d === 'string') d = new Date(d);
    else d = new Date();
    var date = new Date(d.getFullYear(), d.getMonth() + 1);
    return date;
  },
  /**
   * 获取前一个天
   * @param {string} d 
   */
  preDay: function (d) {
    if (typeof d === 'string') d = new Date(d);
    else d = new Date();
    var date = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
    return date;
  },

  /**
   * 获取后一个天
   * @param {string} d 
   */
  nextDay: function (d) {
    if (typeof d === 'string') d = new Date(d);
    else d = new Date();
    var date = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    return date;
  },

  /**
   * @description 数字操作，
   * @return {string} 返回处理后的数字
   */
  formatNum: function (n) {
    if (n < 10) return '0' + n;
    return n;
  },

  /**
   * @description 将字符串转换为日期，支持格式y-m-d ymd (y m r)以及标准的
   * @return {Date} 返回日期对象
   */
  parse: function (dateStr, formatStr) {
    if (typeof dateStr === 'undefined') return null;
    if (typeof formatStr === 'string') {
      //首先取得顺序相关字符串
      var arrStr = formatStr.replace(/[^ymd]/g, '').split('');
      if (!arrStr && arrStr.length != 3) return null;

      formatStr = formatStr.replace(/y|m|d/g, function (k) {
        switch (k) {
          case 'y':
            return '(\\d{4})';
          case 'm':
          case 'd':
            return '(\\d{1,2})';
        }
      });

      var reg = new RegExp(formatStr, 'g');
      var arr = reg.exec(dateStr)

      var dateObj = {};
      for (var i = 0, len = arrStr.length; i < len; i++) {
        dateObj[arrStr[i]] = arr[i + 1];
      }
      return new Date(dateObj['y'], dateObj['m'] - 1, dateObj['d']);
    }
    return null;
  },

  /**
   * @description将日期格式化为字符串
   * @return {string} 常用格式化字符串
   */
  format: function (date, f) {
    if (arguments.length < 2 && !date.getTime) {
      date = new Date();
    } else if (arguments.length == 2 && typeof date === 'number' && typeof f === 'string') {
      var d = new Date();
      d.setTime(date);
      date = d;
    }

    typeof f != 'string' && (f = 'Y年M月D日 H时F分S秒');
    return f.replace(/Y|y|M|m|D|d|H|h|F|f|S|s/g, function (a) {
      switch (a) {
        case "y":
          return (date.getFullYear() + "").slice(2);
        case "Y":
          return date.getFullYear();
        case "m":
          return date.getMonth() + 1;
        case "M":
          return dateUtil.formatNum(date.getMonth() + 1);
        case "d":
          return date.getDate();
        case "D":
          return dateUtil.formatNum(date.getDate());
        case "h":
          return date.getHours();
        case "H":
          return dateUtil.formatNum(date.getHours());
        case "f":
          return date.getMinutes();
        case "F":
          return dateUtil.formatNum(date.getMinutes());
        case "s":
          return date.getSeconds();
        case "S":
          return dateUtil.formatNum(date.getSeconds());
      }
    });
  },

  // @description 是否为为日期对象，该方法可能有坑，使用需要慎重
  // @param year {num} 日期对象
  // @return {boolean} 返回值
  isDate: function (d) {
    if ((typeof d == 'object') && (d instanceof Date)) return true;
    return false;
  },

  // @description 是否为闰年
  // @param year {num} 可能是年份或者为一个date时间
  // @return {boolean} 返回值
  isLeapYear: function (year) {
    //传入为时间格式需要处理
    if (_.dateUtil.isDate(year)) year = year.getFullYear()
    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) return true;
    return false;
  },

  // @description 获取一个月份的天数
  // @param year {num} 可能是年份或者为一个date时间
  // @param year {num} 月份
  // @return {num} 返回天数
  getDaysOfMonth: function (year, month) {
    //自动减一以便操作
    month--;
    if (_.dateUtil.isDate(year)) {
      month = year.getMonth(); //注意此处月份要加1，所以我们要减一
      year = year.getFullYear();
    }
    return [31, _.dateUtil.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  },

  // @description 获取一个月份1号是星期几，注意此时的月份传入时需要自主减一
  // @param year {num} 可能是年份或者为一个date时间
  // @param year {num} 月份
  // @return {num} 当月一号为星期几0-6
  getBeginDayOfMouth: function (year, month) {
    //自动减一以便操作
    month--;
    if ((typeof year == 'object') && (year instanceof Date)) {
      month = year.getMonth();
      year = year.getFullYear();
    }
    var d = new Date(year, month, 1);
    return d.getDay();
  },

  /**
   * 时间展示格式化
   * @param {string} dateTimeStamp 
   */
  displayTime: function (dateTimeStamp) {
    //ios时间格式转换时，要求2019/07/04
    let newT = dateTimeStamp.replace(/-/g, '/');
    var result;
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var month = day * 30;
    var now = new Date().getTime();
    //后端返回的是秒数
    var curTime = new Date(newT);
    var diffValue = now - curTime;
    if (diffValue < 0) {
      return;
    }
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (monthC >= 1) {
      if (monthC <= 12)
        result = "" + parseInt(monthC) + "月前";
      else {
        result = "" + parseInt(monthC / 12) + "年前";
      }
    } else if (weekC >= 1) {
      result = "" + parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
      result = "" + parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
      result = "" + parseInt(hourC) + "小时前";
    } else if (minC >= 1) {
      result = "" + parseInt(minC) + "分钟前";
    } else {
      result = "刚刚";
    }
    return result;
  },
};

module.exports = {
  formatTime: formatTime,
  getBiggerzIndex: getBiggerzIndex,
  strToJson: strToJson,
  dateUtil: dateUtil,
  setStorageSync: setStorageSync,
  getStorageSync: getStorageSync
};