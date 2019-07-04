var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var pieChart = null;
var windowWidth = 320;
var lineChart = null;

Page({
    data: {
        chartType: 0,
        timePieIndex: 0,
        timeLineIndex: 1,
        typeArray: [],
        monthArray: [],
        userInfo: app.globalData.userInfo,
        pulldownrefresh: false,
        pieDo: false,
        lineDo: false,
        pieTip: ''
    },
    //点击饼图
    touchHandler: function(e) {
        console.log(pieChart.getCurrentDataIndex(e));
        if (this.data.typeArray && this.data.typeArray.length > 0 && pieChart.getCurrentDataIndex(e) > -1) {
            this.setData({
                pieTip: this.data.typeArray[pieChart.getCurrentDataIndex(e)].name + '类型累计消费' + this.data.typeArray[pieChart.getCurrentDataIndex(e)].data + '元'
            })
        }
    },
    onShow: function() {
        this.getPieData()
        this.getLineData()
    },
    onPullDownRefresh: function() {
        this.setData({
            pulldownrefresh: true
        })
        this.getPieData()
        this.getLineData()
    },
    onLoad: function(e) {
        this.setData({
            userInfo: app.globalData.userInfo
        });
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
            console.log('获取到屏幕宽度' + windowWidth)
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        //初始化一个无数据
        this.drawPie([{
            name: '无数据',
            data: 1
        }]);
        this.drawLine(['无数据'], [0], [0])
    },
    //获取饼图数据
    getPieData: function() {
        var self = this;
        self.setData({
            pieDo: true
        })
        wx.showLoading({
                title: '数据加载中…'
            })
            // 请求数据，并渲染
        wx.request({
            url: app.globalData.api + '/CostNote/ChartPieData',
            data: {
                token: app.globalData.userInfo.token,
                pieIndex: self.data.timePieIndex
            },
            method: 'GET',
            success: function(res) {
                if (res.data.resultCode == 0) {
                    if (res.data.data.length > 0) {
                        var sumData = 0;
                        for (var i = 0; i < res.data.data.length; i++) {
                            sumData += res.data.data[i].data * 100;
                        }
                        self.setData({
                            typeArray: res.data.data,
                            pieTip: '总计消费' + sumData / 100 + '元'
                        })
                        self.drawPie(res.data.data)
                    } else {
                        self.setData({
                            pieTip: '暂无数据，快去记账吧~'
                        })
                    }
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            complete: () => {
                self.setData({
                        pieDo: false
                    })
                    //停止刷新
                if (self.data.pulldownrefresh && !self.data.lineDo) {
                    wx.stopPullDownRefresh()
                }
                wx.hideLoading()
            }
        })
    },
    //获取折线图数据
    getLineData: function() {
        var self = this;
        self.setData({
            lineDo: true
        })
        wx.showLoading({
                title: '数据加载中…'
            })
            // 请求数据，并渲染
        wx.request({
            url: app.globalData.api + '/CostNote/ChartLineData',
            data: {
                token: app.globalData.userInfo.token,
                lineIndex: self.data.timeLineIndex
            },
            method: 'GET',
            success: function(res) {
                if (res.data.resultCode == 0) {
                    if (res.data.data.nameArray.length > 0) {
                        var lineData = [];
                        for (var i = 0; i < res.data.data.nameArray.length; i++) {
                            lineData.push({
                                month: res.data.data.nameArray[i],
                                sumCost: res.data.data.dataOutArray[i],
                                sumIn: res.data.data.dataInArray[i]
                            })
                        }
                        self.setData({
                            monthArray: lineData
                        })
                        self.drawLine(res.data.data.nameArray, res.data.data.dataOutArray, res.data.data.dataInArray)
                    }
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            complete: () => {
                self.setData({
                        lineDo: false
                    })
                    //停止刷新
                if (self.data.pulldownrefresh && !self.data.pieDo) {
                    wx.stopPullDownRefresh()
                }
                wx.hideLoading()
            }
        })
    },
    //绘制饼图
    drawPie: function(data) {
        pieChart = new wxCharts({
            animation: true,
            canvasId: 'pieCanvas',
            title: {
                name: '消费类型占比'
            },
            type: 'pie',
            series: data,
            width: windowWidth,
            height: 300,
            dataLabel: true,
        });
    },
    //绘制折线图
    drawLine: function(categories, dataOut, dataIn) {
        if(dataOut.length>1){
            var lineOutData=[];
            for(var i=0;i<dataOut.length;i++){
                if(!dataOut[i]){
                    lineOutData.push(null)
                }else{
                    lineOutData.push(dataOut[i])
                }
            }
            dataOut=lineOutData;
        }
        if(dataIn.length>1){
            var lineInData=[];
            for(var i=0;i<dataIn.length;i++){
                if(!dataIn[i]){
                    lineInData.push(null)
                }else{
                    lineInData.push(dataIn[i])
                }
            }
            dataIn=lineInData;
        }
        lineChart = new wxCharts({
            canvasId: 'lineCanvas',
            type: 'line',
            categories: categories,
            animation: true,
            series: [{
                name: '月度消费走势',
                data: dataOut,
                format: function(val, name) {
                    return val.toFixed(2) + '元';
                }
            }, {
                name: '月度收入走势',
                data: dataIn,
                format: function(val, name) {
                    return val.toFixed(2) + '元';
                }
            }],
            xAxis: {
                disableGrid: false
            },
            yAxis: {
                title: '月度消费/收入金额 (元)',
                format: function(val) {
                    return val.toFixed(2);
                },
                min: 0
            },
            width: windowWidth,
            height: 200,
            dataLabel: true,
            dataPointShape: true,
            enableScroll: true,
            extra: {
                lineStyle: 'curve'
            }
        });
    },
    //切换图形分类
    handlerTypeChange: function({
        detail
    }) {
        this.setData({
            chartType: detail.key
        })
    },
    //时间选择
    changePieTabBar(e) {
        this.setData({
            timePieIndex: e.currentTarget.dataset.id
        })
        this.getPieData()
    },
    changeLineTabBar(e) {
        this.setData({
            timeLineIndex: e.currentTarget.dataset.id
        })
        this.getLineData()
    },
    touchLineHandler: function(e) {
        lineChart.scrollStart(e);
    },
    moveHandler: function(e) {
        lineChart.scroll(e);
    },
    touchEndHandler: function(e) {
        lineChart.scrollEnd(e);
        lineChart.showToolTip(e, {
            format: function(item, category) {
                return category + ' ' + item.name + ':' + item.data
            }
        });
    }
});