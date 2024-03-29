// pages/Calendar/Calendar.js
//打卡日历页面
var util = require('../../utils/util.js');
const {
    watch,
    computed
} = require('../../utils/vuefy.js');
var app = getApp();
var currentDate = new Date();
var selectedDate = currentDate.toString();
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
        var showDetail = false;
        var showDetailTitle = '';
        var showDetailContent = '';
        var validDayId = 0;
        var days = that.data.days;
        if (days) {
            days.forEach(function (f) {
                f.isSelected = false;
            });
            days[date.getDate() + that.data.firstDayOfWeek - 1].isSelected = true;
            if (days[date.getDate() + that.data.firstDayOfWeek - 1].isSign) {
                showDetail = true;
                showDetailTitle = util.dateUtil.format(date, 'Y.M.D') + days[date.getDate() + that.data.firstDayOfWeek - 1].work;
                showDetailContent = days[date.getDate() + that.data.firstDayOfWeek - 1].describeInfo;
                validDayId = days[date.getDate() + that.data.firstDayOfWeek - 1].id;
            }
        }
        that.setData({
            days: days,
            showDetail: showDetail,
            showDetailTitle: showDetailTitle,
            showDetailContent: showDetailContent,
            validDayId: validDayId
        });
    },

    data: {
        calendarDisplayTime: selectedDate,
        weekDayArr: ['日', '一', '二', '三', '四', '五', '六'],
        objectId: '',
        days: [],
        signUp: [],
        cur_year: 0,
        cur_month: 0,
        count: 0,
        firstDayOfWeek: 0,
        sign_day_number: 0,
        calendarHeight: 740,
        answer: [],
        showDetail: false,
        showDetailTitle: '',
        showDetailContent: '',
        showDetailActions: [{
                name: '修改',
                color: '#2d8cf0',
            },
            {
                name: '删除',
                color: '#FF7B0E'
            },
            {
                name: '取消',
                color: '#19be6b'
            }
        ],
        showDelete: false,
        showDeleteActions: [{
                name: '取消'
            },
            {
                name: '删除',
                color: '#ed3f14',
                loading: false
            }
        ],
        isLogin: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //检查token是否存在
        var userInfo = util.getStorageSync("userInfo");
        if (userInfo != null) {
            this.setData({
                isLogin: true
            });
        }
        this.setData({
            objectId: options.objectId
        });
        computed(this, {
            calendarHeight: function () {
                return Math.ceil(this.data.days.length / 7) * 100 + 140;
            }
        });
    },
    /**
     * 重新回到页面
     */
    onShow: function () {
        this.initData(new Date(this.data.calendarDisplayTime));
    },
    /**
     * 刷新页面
     */
    onPullDownRefresh: function () {
        this.initData(new Date(this.data.calendarDisplayTime));
    },

    /**
     * 预览图片
     * @param {any} e 
     */
    previewImg: function (e) {
        //获取记录的下标
        var index = e.currentTarget.dataset.index;
        var img_index = e.currentTarget.dataset.img_index;
        //所有图片
        var mediaList = this.data.answer[index].mediaList;
        if (mediaList && mediaList.length > 0) {
            var imgs = [];
            mediaList.forEach(item => {
                imgs.push(item.fullUrl);
            });
            wx.previewImage({
                //当前显示图片
                current: imgs[img_index],
                //所有图片
                urls: imgs
            });
        }
    },

    /**
     * 图片加载失败
     */
    imageOnloadError: function (e) {
        var that = this;
        //获取加载出错的图片下标
        var index = e.currentTarget.dataset.img_index;
        var detailIndex = e.currentTarget.dataset.index;

        console.log("图片加载出错啦,打卡下标：" + detailIndex + "图片下标：" + index);
        //后台返回的图片路径数组
        var errorMedia = this.data.answer[detailIndex].mediaList[index];
        if (!errorMedia.loadError) {
            var _imgUrl = this.data.answer[detailIndex].mediaList[index].fullUrl;
            var answer = this.data.answer;
            answer[detailIndex].mediaList[index].fullUrl = _imgUrl + "?_v=" + Math.random();
            answer[detailIndex].mediaList[index].loadError = true;
            console.log(answer);
            that.setData({
                answer: answer
            });
        }
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
        var that = this;
        var cur_year = date.getFullYear();
        var cur_month = date.getMonth() + 1;
        that.calculateEmptyGrids(cur_year, cur_month);
        that.calculateDays(cur_year, cur_month);
        //获取当前用户当前任务的人签到状态
        that.onGetSignUp(cur_year, cur_month);
        that.setData({
            cur_year: cur_year,
            cur_month: cur_month
        });
        //可能出现还没有绑定数据到视图中，计算结果为空的情况
        setTimeout(function () {
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
        }, 1000);
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
                };
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
     * 获取当前用户该任务的签到数组
     * @param {number} year 
     * @param {number} month 
     */
    onGetSignUp: function (year, month) {
        var self = this;
        if (!this.data.isLogin) {
            return;
        }
        wx.request({
            url: app.globalData.api + '/CostNote/GetUserDailyHistoryList',
            data: {
                token: app.globalData.userInfo.token,
                year: year,
                month: month
            },
            method: 'GET',
            success: function (res) {
                if (res.data.resultCode == 0) {
                    var dataList = res.data.data.resultList;
                    var countNumber = res.data.data.countNumber;
                    var answer = [];
                    var daysArr = self.data.days;
                    if (daysArr && dataList && dataList.length > 0) {
                        dataList.forEach(function (f) {
                            daysArr[f.dailyDay + self.data.firstDayOfWeek - 1].isSign = true;
                            daysArr[f.dailyDay + self.data.firstDayOfWeek - 1].describeInfo = f.dailyContent;
                            daysArr[f.dailyDay + self.data.firstDayOfWeek - 1].work = "工作量: " + f.dailyNumber + "天";
                            daysArr[f.dailyDay + self.data.firstDayOfWeek - 1].id = f.id;
                            answer.push({
                                "describeInfo": f.dailyContent,
                                "work": "工作量: " + f.dailyNumber + "天",
                                "date": f.dailyDate,
                                "mediaList": f.mediaList
                            });
                        });
                    }
                    self.setData({
                        sign_day_number: countNumber,
                        days: daysArr,
                        answer: answer
                    });
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    });
                }
            },
            fail: function () {
                wx.showToast({
                    title: '网络异常',
                    icon: 'none',
                    duration: 2000
                });
            }
        });
    },
    /**
     * 点击详情信息中的按钮
     * @param {any} param0 
     */
    detailHandleClick: function ({
        detail
    }) {
        var index = detail.index;
        if (index === 0) {
            if (this.data.validDayId > 0) {
                wx.navigateTo({
                    url: '/pages/registration/index' + "?id=" + this.data.validDayId
                });
            }
            this.setData({
                showDetail: false,
                showDetailTitle: '',
                showDetailContent: ''
            });
        } else if (index === 1) {
            this.setData({
                showDelete: true
            });
        } else if (index === 2) {
            this.setData({
                showDetail: false,
                showDetailTitle: '',
                showDetailContent: ''
            });
        }
    },
    /**
     * 删除记录逻辑
     * @param {any} param0 
     */
    deleteHandlerClick: function ({
        detail
    }) {
        var self = this;
        if (detail.index === 0) {
            self.setData({
                showDelete: false
            });
        } else {
            if (self.data.validDayId < 1) {
                self.setData({
                    showDelete: false
                });
            }
            var action = [...this.data.showDeleteActions];
            action[1].loading = true;

            self.setData({
                showDeleteActions: action
            });
            //提交删除
            wx.request({
                url: app.globalData.api + '/CostNote/DeleteDetailHistoryInfo',
                data: {
                    token: app.globalData.userInfo.token,
                    id: self.data.validDayId
                },
                method: 'GET',
                success: function (res) {
                    if (res.data.resultCode == 0) {
                        wx.showToast({
                            title: '删除成功',
                            icon: 'success',
                            duration: 2000
                        });
                        //刷新页面
                        self.onPullDownRefresh();
                    } else {
                        wx.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 2000
                        });
                    }
                    action[1].loading = false;
                    self.setData({
                        showDelete: false,
                        showDeleteActions: action,
                        showDetail: false,
                        showDetailTitle: '',
                        showDetailContent: ''
                    });
                },
                fail: function () {
                    wx.showToast({
                        title: '网络异常',
                        icon: 'none',
                        duration: 2000
                    });
                    action[1].loading = false;
                    self.setData({
                        showDelete: false,
                        showDeleteActions: action
                    });
                }
            });
        }
    }
});