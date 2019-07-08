var app = getApp();
Page({
    data: {
        handlderIndex: 0,
        verticalCurrent: 0,
        isSaving: false,
        verticalCode: '',
        bindVerticalCode: '',

        visibleSendBind: false,
        bindActions: [{
            name: '绑定',
            color: '#ed3f14'
        }]
    },
    onLoad: function(options) {},
    onShow: function() {},
    handleChange({
        detail
    }) {
        this.setData({
            handlderIndex: detail.key,
            verticalCurrent: detail.key == 1 ? 2 : 0
        })
    },
    handleInviteClick: function() {
        var self = this;
        self.setData({
            isSaving: true
        });
        wx.request({
            url: app.globalData.api + '/CostNote/GetInviteCode',
            data: { token: app.globalData.userInfo.token },
            method: 'GET',
            success: function(res) {
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
            complete: function() {
                self.setData({
                    isSaving: false
                });
            }
        })
    },
    handleCopyClick: function() {
        wx.setClipboardData({
            data: this.data.verticalCode,
            success: function() {
                wx.showToast({
                    title: '复制成功,快去分享吧',
                    icon: 'none'
                });
            }
        });
    },
    changeVerticalCodeThing: function(e) {
        this.setData({
            bindVerticalCode: e.detail.detail.value
        })
    },
    handleOpenBind: function() {
        this.setData({
            visibleSendBind: true
        });
    },
    handleCancelBind: function() {
        this.setData({
            visibleSendBind: false
        });
    },
    handleDoBind: function() {
        const action = [this.data.bindActions];
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
            success: function(res) {
                if (res.data.resultCode == 0) {
                    wx.showToast({
                        title: '绑定成功',
                        icon: 'success',
                        duration: 2000
                    })
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            complete: function() {
                action[0].loading = false;
                self.setData({
                    visibleSendBind: false,
                    bindActions: action
                });
            }
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