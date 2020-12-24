// pages/Calendar/Calendar.js
//打卡日历页面
var util = require('../../utils/util.js');
const {
  watch,
  computed
} = require('../../utils/vuefy.js')
var selectedDate = new Date().toString();
var currentDate = new Date();
Page({
  /**
   * 上月数据
   */
  preMonth: function () {
    this.setData({
      calendarDisplayTime: util.dateUtil.preMonth(this.data.calendarDisplayTime).toString()
    });
    this.initData(new Date(this.data.calendarDisplayTime));
  },
  /**
   * 下月数据
   */
  nextMonth: function () {
    this.setData({
      calendarDisplayTime: util.dateUtil.nextMonth(this.data.calendarDisplayTime).toString()
    });
    this.initData(new Date(this.data.calendarDisplayTime));
  },
  /**
   * 点击当前单元
   * @param {any} e 
   */
  onCalendarDayTap: function (e) {
    var data = e.currentTarget.dataset;
    var date = new Date(data.year, data.month, data.day);
    var that = this;
    if (this.calendarHook) this.calendarHook(date);
    var days = that.data.days;
    if (days) {
      days.forEach(function (f) {
        f.isSelected = false;
      });
      days[date.getDate() + that.data.firstDayOfWeek - 1].isSelected = true;
    }
    that.setData({
      calendarSelectedDate: date.toString(),
      calendarSelectedDateStr: util.dateUtil.format(date, 'Y年M月D日'),
      days: days,
      visible1: true
    });
  },

  data: {
    calendarDisplayTime: selectedDate,
    calendarSelectedDate: selectedDate,
    calendarSelectedDateStr: util.dateUtil.format(new Date(selectedDate), 'Y年M月D日'),
    weekDayArr: ['日', '一', '二', '三', '四', '五', '六'],
    objectId: '',
    days: [],
    signUp: [],
    cur_year: 0,
    cur_month: 0,
    count: 0,
    firstDayOfWeek: 0,
    sign_day_number: 23,
    calendarHeight: 740,
    answer: [{
        "describeInfo": "内容不错，如果这里有很多的内容诶内容不错，如果这里有很多的内容诶内容不错，如果这里有很多的内容诶内容不错，如果这里有很多的内容诶内容不错，如果这里有很多的内容诶内容不错，如果这里有很多的内容诶内容不错，如果这里有很多的内容诶内容不错，如果这里有很多的内容诶内容不错，如果这里有很多的内容诶内容不错，如果这里有很多的内容诶",
        "work": "工作量1",
        "date": "2020-12-01"
      }, {
        "describeInfo": "内容不错，如果这里有很多的内容诶内容不错"
      },
      {
        "describeInfo": "内容不错，如果这里有很多的内容诶内容不错内容不错，如果这里有很多的内容诶内容不错"
      }
    ],
    visible1: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      objectId: options.objectId
    });
    this.initData(new Date(this.data.calendarDisplayTime));
    computed(this, {
      calendarHeight: function () {
        return Math.ceil(this.data.days.length / 7) * 100 + 140;
      }
    });
    var that = this;
    var query = wx.createSelectorQuery();
    query.selectAll('.content').fields({
      size: true,
    }).exec(function (res) {
      console.log(res[0], '所有节点信息');
      //固定高度值 单位：PX
      var lineHeight = 26;
      for (var i = 0; i < res[0].length; i++) {
        if ((res[0][i].height / lineHeight) > 2) {
          that.data.answer[i].auto = true;
          that.data.answer[i].seeMore = true;
        }
      }
      that.setData({
        answer: that.data.answer
      });
    });
  },

  /**
   * 展开更多
   * @param {e} e 
   */
  foldHandler: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    if (that.data.answer.length - 1 >= index) {
      that.data.answer[index].seeMore = false;
    }
    that.setData({
      answer: that.data.answer
    });
  },
  /**
   * 收起更多
   * @param {e} e 
   */
  unfoldHandler: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    if (that.data.answer.length - 1 >= index) {
      that.data.answer[index].seeMore = true;
    }
    that.setData({
      answer: that.data.answer
    });
  },

  /**
   * 数据加载
   * @param {Date}} date 
   */
  initData: function (date) {
    var cur_year = date.getFullYear();
    var cur_month = date.getMonth() + 1;
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    //获取当前用户当前任务的人签到状态
    this.onGetSignUp();
    this.setData({
      cur_year: cur_year,
      cur_month: cur_month
    });
  },
  /**
   * 获取当月共多少天
   * @param {number} year 
   * @param {number} month 
   */
  getThisMonthDays: function (year, month) {
    return new Date(year, month, 0).getDate()
  },

  /**
   * 获取当月第一天星期几
   * @param {number} year 
   * @param {number} month 
   */
  getFirstDayOfWeek: function (year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },

  /**
   * 计算当月1号前空了几个格子，把它填充在days数组的前面
   * @param {number} year 
   * @param {number} month 
   */
  calculateEmptyGrids: function (year, month) {
    var that = this;
    //计算每个月时要清零
    that.setData({
      days: []
    });
    var firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    if (firstDayOfWeek > 0) {
      for (var i = 0; i < firstDayOfWeek; i++) {
        var obj = {
          date: null,
          isSign: false,
          isSelected: false,
          isCurrentDay: false
        }
        that.data.days.push(obj);
      }
      that.setData({
        days: that.data.days,
        firstDayOfWeek: firstDayOfWeek
      });
      //清空
    } else {
      that.setData({
        days: [],
        firstDayOfWeek: firstDayOfWeek
      });
    }
  },

  /**
   * 绘制当月天数占的格子，并把它放到days数组中
   * @param {number} year 
   * @param {number} month 
   */
  calculateDays: function (year, month) {
    var that = this;
    var thisMonthDays = this.getThisMonthDays(year, month);
    for (var i = 1; i <= thisMonthDays; i++) {
      var obj = {
        date: i,
        isSign: false,
        isSelected: false,
        isCurrentDay: year == currentDate.getFullYear() && currentDate.getMonth() == (month - 1) && currentDate.getDate() == i
      }
      that.data.days.push(obj);
    }
    this.setData({
      days: that.data.days
    });
  },

  /**
   * 匹配判断当月与当月哪些日子签到打卡
   */
  onJudgeSign: function () {
    var that = this;
    var signs = that.data.signUp;
    var daysArr = that.data.days;
    for (var i = 0; i < signs.length; i++) {
      var current = new Date(signs[i].date.replace(/-/g, "/"));
      var year = current.getFullYear();
      var month = current.getMonth() + 1;
      var day = current.getDate();
      day = parseInt(day);
      for (var j = 0; j < daysArr.length; j++) {
        //年月日相同并且已打卡
        if (year == that.data.cur_year && month == that.data.cur_month && daysArr[j].date == day && signs[i].isSign == "今日已打卡") {
          daysArr[j].isSign = true;
        }
      }
    }
    that.setData({
      days: daysArr
    });
  },

  //获取当前用户该任务的签到数组
  onGetSignUp: function () {
    // var that = this;
    // var Task_User = Bmob.Object.extend("task_user");
    // var q = new Bmob.Query(Task_User);
    // q.get(that.data.objectId, {
    //   success: function (result) {
    //     that.setData({
    //       signUp: result.get("signUp"),
    //       count: result.get("score")
    //     });
    //     //获取后就判断签到情况
    //     that.onJudgeSign();
    //   },
    //   error: function (object, error) {}
    // });
  },
  handleClose1() {
    this.setData({
      visible1: false
    });
  }
});