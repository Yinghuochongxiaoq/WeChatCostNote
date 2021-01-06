const util = require("../../utils/util");
var app = getApp();
Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    //页面加载
    onLoad: function () {
        //检查token是否存在
        var userInfo = util.getStorageSync("userInfo");
        if (userInfo != null) {
            app.globalData.userInfo = userInfo;
            wx.reLaunch({
                url: '/pages/home/home'
            });
            return;
        }
        // 查看是否授权
        wx.getSetting({
            success: function (res) {
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
                                                wx.reLaunch({
                                                    url: '/pages/home/home'
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
                    // 用户没有授权
                    console.log('在登录页用户没有授权');
                }
            }
        });
    },

    /**
     * 点击按钮授权登录
     * @param {any} e 
     */
    bindGetUserInfo: function (e) {
        if (e.detail.userInfo) {
            //用户按了允许授权按钮
            var that = this;
            wx.login({
                success: function (res) {
                    if (res.code) {
                        wx.request({
                            url: app.globalData.api + '/Account/GetUserOpenId',
                            data: {
                                code: res.code,
                                encryptedData: e.detail.encryptedData || '',
                                iv: e.detail.iv || '',
                                rawData: e.detail.rawData || '',
                                signature: e.detail.signature || ''
                            },
                            method: 'POST',
                            success: function (res) {
                                if (res.data.resultCode == 0) {
                                    app.globalData.userInfo = res.data.data;
                                    util.setStorageSync("userInfo", app.globalData.userInfo, 2 * 60 * 60);
                                    wx.reLaunch({
                                        url: '/pages/home/home'
                                    });
                                }
                            },
                            fail: function () {
                                wx.showToast({
                                    title: '登录失败，退出重试',
                                    icon: 'loading',
                                    duration: 2000
                                });
                            }
                        });
                    }
                },
                fail: function () {
                    wx.showToast({
                        title: '登录失败，退出重试',
                        icon: 'loading',
                        duration: 2000
                    });
                }
            });
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '温馨提示',
                content: '您点击了拒绝授权，将无法获取用户标识，点击返回后将返回上一页，小程序提供的部分功能将受限。',
                showCancel: false,
                confirmText: '返回',
                success: function (res) {
                    // 用户没有授权成功，不需要改变 isHide 的值
                    if (res.confirm) {
                        console.log('用户点击了“返回”');
                        wx.navigateBack();
                    }
                }
            });
        }
    }
});