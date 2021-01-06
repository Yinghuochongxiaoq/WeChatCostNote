const util = require("../../utils/util");
var app = getApp();
Page({
    data: {
        userInfo: app.globalData.userInfo
    },

    //页面加载
    onLoad: function () {
        var that = this;
        //检查token是否存在
        var userInfo = util.getStorageSync("userInfo");
        if (userInfo != null) {
            app.globalData.userInfo = userInfo;
            console.log('存在userInfo信息');
            setTimeout(function () {
                wx.reLaunch({
                    url: '/pages/home/home'
                });
            }, 2000);
            return;
        }
        console.log('不存在userInfo信息,检查是否授权');
        // 查看是否授权
        wx.getSetting({
            success: function (res) {
                console.log('授权成功');
                if (res.authSetting['scope.userInfo']) {
                    wx.login({
                        success: function (res) {
                            if (!res.code) {
                                wx.showToast({
                                    title: 'code获取失败',
                                    icon: 'none',
                                    duration: 2000
                                });
                                return;
                            }
                            wx.getUserInfo({
                                success: res_user => {
                                    // 获取到用户的 code 之后：res.code
                                    wx.request({
                                        url: app.globalData.api + '/Account/GetUserOpenId',
                                        data: {
                                            code: res.code,
                                            encryptedData: res_user.encryptedData || '',
                                            iv: res_user.iv || '',
                                            rawData: res_user.rawData || '',
                                            signature: res_user.signature || ''
                                        },
                                        method: 'POST',
                                        success: function (res) {
                                            if (res.data.resultCode == 0) {
                                                app.globalData.userInfo = res.data.data;
                                                util.setStorageSync("userInfo", app.globalData.userInfo, 2 * 60 * 60);
                                                if (!app.globalData.userInfo.accountId) {
                                                    //绑定账号
                                                    that.setData({
                                                        userInfo: app.globalData.userInfo
                                                    });
                                                } else {
                                                    wx.reLaunch({
                                                        url: '/pages/home/home'
                                                    });
                                                }
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
                    // 用户没有授权
                    // 改变 isHide 的值，显示授权页面
                    console.log('用户没有授权');
                    setTimeout(function () {
                        wx.reLaunch({
                            url: '/pages/home/home'
                        });
                    }, 1000);
                }
            }
        });
    }
});