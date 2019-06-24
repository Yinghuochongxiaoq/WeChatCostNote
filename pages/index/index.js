var app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: true,
    userInfo: app.globalData.userInfo,
    imageBase64Data: '',
    loadingHidden: true
  },

  //页面加载
  onLoad: function () {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
          // 根据自己的需求有其他操作再补充
          // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
          wx.login({
            success: function (res) {
              if (!res.code) {
                wx.showToast({
                  title: 'code获取失败',
                  icon: 'none',
                  duration: 2000
                })
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
                        console.log(app.globalData)
                        if (!app.globalData.userInfo.accountId) {
                          //绑定账号
                          that.setData({
                            userInfo: app.globalData.userInfo,
                            isHide: false,
                            loadingHidden: false
                          });
                          that.getKaptchaImage()
                        } else {
                          wx.reLaunch({
                            url: '/pages/home/home'
                          })
                        }
                      }
                    }
                  })
                }
              });
            }
          });
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          console.log('用户没有授权')
          that.setData({
            isHide: true,
            loadingHidden: false
          });
        }
      }
    });
  },

  //授权
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
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
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              success: function (res) {
                if (res.data.resultCode == 0) {
                  app.globalData.userInfo = res.data.data;
                  if (!app.globalData.userInfo.accountId) {
                    //绑定账号
                    console.log('需要绑定账号')
                    that.setData({
                      userInfo: app.globalData.userInfo,
                      isHide: false,
                      loadingHidden: false
                    });
                    that.getKaptchaImage()
                  } else {
                    wx.reLaunch({
                      url: '/pages/home/home'
                    })
                  }
                }
              },
              fail: function () {
                wx.showToast({
                  title: '登录失败，退出重试',
                  icon: 'loading',
                  duration: 2000
                })
              }
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: '登录失败，退出重试',
            icon: 'loading',
            duration: 2000
          })
        }
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },

  //绑定账户
  formSubmit: function (e) {
    var that = this;
    wx.request({
      url: app.globalData.api + '/Account/BindWeChatUser',
      data: {
        Name: e.detail.value.txtname,
        Password: e.detail.value.txtpwd,
        Checkcode: e.detail.value.txtcheckcode,
        Token:app.globalData.userInfo.token
      },
      method: "GET",
      success: function (res) {
        if (res.data.resultCode == 0) {
          wx.showToast({
            title: '登录成功!', //这里打印出登录成功
            icon: 'success',
            duration: 1000
          })
          wx.reLaunch({
            url: '/pages/home/home'
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
          that.getKaptchaImage()
        }
      }
    })
  },

  //点击时，刷新验证码
  getKaptchaImage: function (e) {
    const that = this
    wx.request({
      url: app.globalData.api + '/Account/CheckCodeBaseStr',
      method: "GET",
      data: {
        token: that.data.userInfo.token || ''
      },
      success: function (res) {
        if (res.data.resultCode == 0) {
          that.setData({
            imageBase64Data: res.data.data
          })
        }
      }
    })
  }
})