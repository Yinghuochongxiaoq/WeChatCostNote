const util = require("../../utils/util");
var app = getApp();
Page({
    data: {
        userInfo: app.globalData.userInfo,
        id: 0,
        nickname: '',
        end: '',
        start: '',
        isSaving: false,
        isLogin: false,
        //时段配置
        detailList: [],
        scrollTop: 0,
        selectId: 0,
        selectRange: '',
        showDetailAction: false,
        detailAction: [{
                name: '修改',
                icon: 'editor'
            },
            {
                name: '删除',
                icon: 'delete'
            }
        ],
        visibleShowDelete: false,
        deleteActions: [{
            name: '删除',
            color: '#ed3f14'
        }],
    },
    onLoad: function (options) {
        var self = this;
        //检查token是否存在
        var userInfo = util.getStorageSync("userInfo");
        if (userInfo != null && app.globalData.userInfo) {
            self.setData({
                userInfo: app.globalData.userInfo,
                isLogin: true
            });
        }
        var id = options.id;
        if (id && id > 0) {
            this.getCarConfigById(id);
        }
    },
    //页面滚动执行方式
    onPageScroll(event) {
        this.setData({
            scrollTop: event.scrollTop
        });
    },
    onChange(event) {
        var id = event.target.dataset.id;
        var rangeName = event.target.dataset.range;
        this.setData({
            showDetailAction: true,
            selectId: id,
            selectRange: rangeName,
        });
    },
    handleCancel: function () {
        this.setData({
            showDetailAction: false,
            selectId: 0,
            selectRange: '',
        });
    },
    handleClickItem({
        detail
    }) {
        var index = detail.index + 1;
        //删除
        if (index == 2) {
            this.setData({
                visibleShowDelete: true
            });
        }
        //修改
        else if (index == 1) {
            console.log('修改')
        }
    },
    //取消删除
    handleCancelDelete: function () {
        this.setData({
            visibleShowDelete: false
        });
    },
    /**
     * 确认删除
     */
    handleClickDelete: function () {
        self = this;
        const action = [...self.data.deleteActions];
        if (action[0].loading) {
            return;
        }
        action[0].loading = true;

        self.setData({
            deleteActions: action
        });
        //提交删除
        wx.request({
            url: app.globalData.api + '/CarNotice/DeleteDetailInfoById',
            data: {
                token: app.globalData.userInfo.token,
                id: self.data.selectId
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
                    self.getCarConfigById(self.data.id);
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    });
                }
                action[0].loading = false;
                self.setData({
                    visibleShowDelete: false,
                    deleteActions: action,
                    showDetailAction: false,
                    selectId: 0,
                    selectRange: '',
                });
            },
            fail: function () {
                wx.showToast({
                    title: '网络异常',
                    icon: 'none',
                    duration: 2000
                });
                action[0].loading = false;
                self.setData({
                    visibleShowDelete: false,
                    deleteActions: action,
                    showDetailAction: false,
                    selectId: 0,
                    selectRange: '',
                });
            }
        });
    },
    onShow: function () {},
    getCarConfigById: function (id) {
        var self = this;
        // 请求数据，并渲染
        wx.request({
            url: app.globalData.api + '/CarNotice/GetCarNoticeById',
            data: {
                token: app.globalData.userInfo.token,
                id: id
            },
            method: 'GET',
            success: function (res) {
                if (res.data.resultCode == 0) {
                    if (res.data.data) {
                        self.setData({
                            id: res.data.data.id,
                            nickname: res.data.data.nickname,
                            end: res.data.data.end,
                            start: res.data.data.start,
                            detailList: res.data.data.detailList
                        });
                    }
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    });
                }
            }
        });
    },
    handleSaveClick: function () {
        //拼接参数
        var self = this;
        if (!self.data.isLogin) {
            wx.showModal({
                title: '温馨提示',
                content: '您还没有登录，将无法获取用户标识，点击去登录前往登录。',
                confirmText: '去登录',
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/login/index'
                        });
                    }
                }
            });
            return;
        }
        if (!self.data.nickname || self.data.nickname == '') {
            wx.showToast({
                title: '项目名称不能为空',
                icon: 'error',
                duration: 2000
            });
            return;
        }
        if (!self.data.start || self.data.start == '') {
            wx.showToast({
                title: '开始时间不能为空',
                icon: 'error',
                duration: 2000
            });
            return;
        }
        if (!self.data.end || self.data.end == '') {
            wx.showToast({
                title: '结束时间不能为空',
                icon: 'error',
                duration: 2000
            });
            return;
        }
        self.setData({
            isSaving: true
        });
        wx.request({
            url: app.globalData.api + '/CarNotice/SaveCarConfigInfo',
            data: {
                token: app.globalData.userInfo.token,
                id: self.data.id,
                nickName: self.data.nickname,
                start: self.data.start,
                end: self.data.end
            },
            method: 'Get',
            success: function (res) {
                if (res.data.resultCode == 0) {
                    wx.showToast({
                        title: '保存成功',
                        icon: 'success',
                        duration: 2000
                    });
                    if (res.data.data) {
                        self.setData({
                            id: res.data.data.id,
                            nickname: res.data.data.nickname,
                            end: res.data.data.end,
                            start: res.data.data.start,
                            detailList: res.data.data.detailList
                        });
                    }
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    });
                }
                self.setData({
                    isSaving: false
                });
            },
            fail: function () {
                wx.showToast({
                    title: '网络错误',
                    icon: 'error',
                    duration: 2000
                });
            }
        });
    },
    changeNickName: function (e) {
        this.setData({
            nickname: e.detail.detail.value
        });
    },
    bindStartTimeChange: function (e) {
        this.setData({
            start: e.detail.value
        });
    },
    bindEndTimeChange: function (e) {
        this.setData({
            end: e.detail.value
        });
    },
    onShareAppMessage() {
        return {
            title: '记录你的一点一滴~',
            desc: '记录你的一点一滴~',
            path: 'pages/index/index',
            imageUrl: app.globalData.shareImgUrl
        };
    }
});