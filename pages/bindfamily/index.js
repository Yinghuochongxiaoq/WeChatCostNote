const util = require("../../utils/util");
var app = getApp();
Page({
    data: {
        handlderIndex: 0,
        verticalCurrent: 0,
        isSaving: false,
        verticalCode: '',
        bindVerticalCode: '',
        //绑定操作
        visibleSendBind: false,
        bindActions: [{
            name: '绑定',
            color: '#ed3f14'
        }],

        //解除绑定
        visibleUnBind: false,
        unbindActions: [{
            name: '解除绑定',
            color: '#ed3f14'
        }],

        //重新绑定
        visibleReBind: false,
        rebindActions: [{
            name: '重新绑定',
            color: '#ed3f14'
        }],

        //家庭成员
        familyMembers: [],
        //是否显示家庭成员
        isShowFamilyMember: false,
        //当前用户id
        currentMemberId: -1,
        //绑定状态0：未绑定；1：正常绑定；2：解绑3天以内
        bindState: 0,
        isLogin: false
    },
    onLoad: function (options) {
        //检查token是否存在
        var userInfo = util.getStorageSync("userInfo");
        if (userInfo != null) {
            this.setData({
                userInfo: app.globalData.userInfo,
                currentMemberId: app.globalData.userInfo.accountId,
                isLogin: true
            });
        }

    },
    onShow: function () {
        if (!this.data.isLogin) {
            return;
        }
        this.getMemberInfo();
    },
    //获取用户信息
    getMemberInfo: function () {
        var self = this;
        wx.request({
            url: app.globalData.api + '/CostNote/GetCurrentUserFamilyMembers',
            data: {
                token: app.globalData.userInfo.token
            },
            method: 'GET',
            success: function (res) {
                if (res.data.resultCode == 0) {

                    self.setData({
                        familyMembers: res.data.data.members,
                        isShowFamilyMember: res.data.data.state != 0,
                        bindState: res.data.data.state
                    });
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
    },
    handleChange({
        detail
    }) {
        this.setData({
            handlderIndex: detail.key,
            verticalCurrent: detail.key == 1 ? 2 : 0
        })
    },
    handleInviteClick: function () {
        var self = this;
        self.setData({
            isSaving: true
        });
        wx.request({
            url: app.globalData.api + '/CostNote/GetInviteCode',
            data: {
                token: app.globalData.userInfo.token
            },
            method: 'GET',
            success: function (res) {
                if (res.data.resultCode == 0) {
                    wx.showToast({
                        title: '获取成功',
                        icon: 'success',
                        duration: 2000
                    })
                    self.setData({
                        verticalCode: res.data.data
                    })
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            complete: function () {
                self.setData({
                    isSaving: false
                });
            }
        })
    },
    handleCopyClick: function () {
        wx.setClipboardData({
            data: this.data.verticalCode,
            success: function () {
                wx.showToast({
                    title: '复制成功,快去分享吧',
                    icon: 'none'
                });
            }
        });
    },
    changeVerticalCodeThing: function (e) {
        this.setData({
            bindVerticalCode: e.detail.detail.value
        })
    },
    //点击绑定
    handleOpenBind: function () {
        if (!this.data.bindVerticalCode) {
            wx.showToast({
                title: '邀请码不能为空',
                icon: 'none',
                duration: 2000
            })
            return
        }
        this.setData({
            visibleSendBind: true
        });
    },
    //取消确认
    handleCancelBind: function () {
        this.setData({
            visibleSendBind: false
        });
    },
    //确认
    handleDoBind: function () {
        const action = [...this.data.bindActions];
        action[0].loading = true;
        this.setData({
            bindActions: action
        });
        var self = this;
        wx.request({
            url: app.globalData.api + '/CostNote/AddSelfToFamily',
            data: {
                token: app.globalData.userInfo.token,
                inviteCode: self.data.bindVerticalCode
            },
            method: 'GET',
            success: function (res) {
                if (res.data.resultCode == 0) {
                    wx.showToast({
                        title: '绑定成功',
                        icon: 'success',
                        duration: 2000
                    })
                    self.reLogin();
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            complete: function () {
                action[0].loading = false;
                self.setData({
                    visibleSendBind: false,
                    bindActions: action
                });
            }
        })
    },

    //点击解除绑定
    unbindHandler: function () {
        this.setData({
            visibleUnBind: true
        });
    },
    //取消确认
    handleCancelUnBind: function () {
        this.setData({
            visibleUnBind: false
        });
    },
    //确认取消绑定
    handleDoUnBind: function () {
        const action = [...this.data.unbindActions];
        action[0].loading = true;
        this.setData({
            unbindActions: action
        });
        var self = this;
        wx.request({
            url: app.globalData.api + '/CostNote/UnBindFamily',
            data: {
                token: app.globalData.userInfo.token
            },
            method: 'GET',
            success: function (res) {
                if (res.data.resultCode == 0) {
                    wx.showToast({
                        title: '解除绑定成功',
                        icon: 'success',
                        duration: 2000
                    })
                    self.reLogin();
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            complete: function () {
                action[0].loading = false;
                self.setData({
                    visibleUnBind: false,
                    unbindActions: action
                });
            }
        })
    },

    //点击重新绑定
    rebindHandler: function () {
        this.setData({
            visibleReBind: true
        });
    },
    //重新绑定取消确认
    handleCancelReBind: function () {
        this.setData({
            visibleReBind: false
        });
    },
    //确认重新绑定绑定
    handleDoReBind: function () {
        const action = [...this.data.rebindActions];
        action[0].loading = true;
        this.setData({
            rebindActions: action
        });
        var self = this;
        wx.request({
            url: app.globalData.api + '/CostNote/ReBindFamily',
            data: {
                token: app.globalData.userInfo.token
            },
            method: 'GET',
            success: function (res) {
                if (res.data.resultCode == 0) {
                    wx.showToast({
                        title: '绑定成功',
                        icon: 'success',
                        duration: 2000
                    })
                    self.reLogin();
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            complete: function () {
                action[0].loading = false;
                self.setData({
                    visibleReBind: false,
                    rebindActions: action
                });
            }
        })
    },
    //重新登录
    reLogin: function () {
        wx.reLaunch({
            url: '/pages/index/index'
        })
    },
    onShareAppMessage() {
        return {
            title: '记录你的一点一滴~',
            desc: '记录你的一点一滴~',
            path: 'pages/index/index',
            imageUrl: app.globalData.shareImgUrl
        }
    }
})