const util = require("../../utils/util");
var app = getApp();

var Grid = require('./grid.js');
var Tile = require('./tile.js');
var GameManager = require('./gameManager.js');

Page({
    data: {
        hidden: false,
        grids: [],
        over: false,
        win: false,
        score: 0,
        highScore: 0,
        overMsg: '游戏结束',
        showGame: false,
        page: 1,
        allPages: 10,
        jokeList: [],
        showAllJoke: false,
        //是否已经登录
        isLogin: false,
        couldInGame: false
    },
    onLoad: function (options) {
        var couldInGame = options.couldInGame;
        var userInfo = util.getStorageSync("userInfo");
        if (userInfo != null) {
            this.setData({
                isLogin: true,
                couldInGame: couldInGame ? true : false
            });
        }
        this.initJokeData();
    },
    onUnload: function () {
        var highScore = wx.getStorageSync('highScore') || 0;
        if (this.data.score > highScore) {
            wx.setStorageSync('highScore', this.data.score);
        }
    },
    /**
     * 加载游戏
     */
    loadGame: function () {
        this.GameManager = new GameManager(4);
        this.setData({
            showGame: true,
            grids: this.GameManager.setup(),
            highScore: wx.getStorageSync('highScore') || 0
        });
    },
    /**
     * 展开更多
     * @param {e} e 
     */
    foldHandler: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        if (that.data.jokeList.length - 1 >= index) {
            that.data.jokeList[index].seeMore = false;
        }
        that.setData({
            jokeList: that.data.jokeList
        });
    },
    /**
     * 收起更多
     * @param {e} e 
     */
    unfoldHandler: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        if (that.data.jokeList.length - 1 >= index) {
            that.data.jokeList[index].seeMore = true;
        }
        that.setData({
            jokeList: that.data.jokeList
        });
    },
    /**
     * 笑话集数据加载
     */
    initJokeData: function () {
        var that = this;
        wx.vrequest({
            url: app.globalData.jdJokeUrl +
                '?time=2015-07-10&page=' + that.data.page + '&maxResult=20&showapi_sign=bd0592992b4d4050bfc927fe7a4db9f3&appkey=' + app.globalData.jdApiKey,
            success: res => {
                console.log('云接口获取成功');
            }
        }).then(res => {
            if (res &&
                res.data &&
                "10000" == res.data.code &&
                res.data.result &&
                res.data.result.showapi_res_body &&
                res.data.result.showapi_res_body.contentlist &&
                res.data.result.showapi_res_body.contentlist.length > 0) {
                var tmpJokeList = that.data.jokeList;
                res.data.result.showapi_res_body.contentlist.forEach(element => {
                    tmpJokeList.push({
                        ct: util.dateUtil.displayTime(element.ct),
                        text: element.text,
                        title: element.title
                    });
                });
                var nextPage = that.data.page + 1;
                that.setData({
                    jokeList: tmpJokeList,
                    page: nextPage,
                    allPages: res.data.result.showapi_res_body.allPages,
                    showAllJoke: nextPage >= res.data.result.showapi_res_body.allPages ? true : false
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
                            if ((res[0][i].height / lineHeight) > 4) {
                                that.data.jokeList[i].auto = true;
                                that.data.jokeList[i].seeMore = true;
                            }
                        }
                        that.setData({
                            jokeList: that.data.jokeList
                        });
                    });
                }, 1000);
            }
        });
    },
    onReady: function () {
        var that = this;
        // 页面渲染完毕隐藏loading
        that.setData({
            hidden: true
        });
    },
    /**
     * 更新视图数据
     * @param {object} data 
     */
    updateView: function (data) {
        // 游戏结束
        if (data.over) {
            data.overMsg = '游戏结束';
        }

        // 获胜
        if (data.win) {
            data.overMsg = '恭喜';
        }
        if (data.over || data.win) {
            var highScore = wx.getStorageSync('highScore') || 0;
            if (data.score > highScore) {
                wx.setStorageSync('highScore', data.score);
            }
        }

        this.setData(data);
    },

    /**
     * 重新开始
     */
    restart: function () {
        this.updateView({
            grids: this.GameManager.restart(),
            over: false,
            won: false,
            score: 0
        });
    },

    touchStartClientX: 0,
    touchStartClientY: 0,
    touchEndClientX: 0,
    touchEndClientY: 0,
    // 多手指操作
    isMultiple: false,

    touchStart: function (events) {
        // 多指操作
        this.isMultiple = events.touches.length > 1;
        if (this.isMultiple) {
            return;
        }

        var touch = events.touches[0];

        this.touchStartClientX = touch.clientX;
        this.touchStartClientY = touch.clientY;

    },

    touchMove: function (events) {
        var touch = events.touches[0];
        this.touchEndClientX = touch.clientX;
        this.touchEndClientY = touch.clientY;
    },

    touchEnd: function (events) {
        if (this.isMultiple) {
            return;
        }

        var dx = this.touchEndClientX - this.touchStartClientX;
        var absDx = Math.abs(dx);
        var dy = this.touchEndClientY - this.touchStartClientY;
        var absDy = Math.abs(dy);

        if (Math.max(absDx, absDy) > 10) {
            var direction = absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0);

            var data = this.GameManager.move(direction) || {
                grids: this.data.grids,
                over: this.data.over,
                won: this.data.won,
                score: this.data.score
            };
            this.updateView({
                grids: data.grids,
                over: data.over,
                won: data.won,
                score: data.score
            });
        }
    },
    onShareAppMessage: function () {
        return {
            title: '吾计轻松一刻',
            desc: '上班,学习,无聊?来吾计轻松一下吧^v^',
            path: 'pages/relax/relax',
            imageUrl: app.globalData.shareImgUrl
        };
    }
});