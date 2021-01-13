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
        overMsg: '游戏结束'
    },
    onLoad: function () {
        this.GameManager = new GameManager(4);

        this.setData({
            grids: this.GameManager.setup(),
            highScore: wx.getStorageSync('highScore') || 0
        });

    },
    onUnload: function () {
        var highScore = wx.getStorageSync('highScore') || 0;
        if (this.data.score > highScore) {
            wx.setStorageSync('highScore', this.data.score);
        }
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
    }
});