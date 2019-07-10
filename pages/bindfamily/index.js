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
        }],


        showModalStatus: false
    },
    powerDrawer: function (e) {
        var currentStatue = e.currentTarget.dataset.statue;
        this.util(currentStatue)
      },
      powerDrawer_two:function(e){
          debugger
          this.util('close')
      },
      util: function(currentStatue){
        /* 动画部分 */
        // 第1步：创建动画实例 
        var animation = wx.createAnimation({
          duration: 200,  //动画时长
          timingFunction: "linear", //线性
          delay: 0  //0则不延迟
        });
        
        // 第2步：这个动画实例赋给当前的动画实例
        this.animation = animation;
     
        // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停
        animation.translateY(240).step();
     
        // 第4步：导出动画对象赋给数据对象储存
        this.setData({
          animationData: animation.export()
        })
        
        // 第5步：设置定时器到指定时候后，执行第二组动画
        setTimeout(function () {
          // 执行第二组动画：Y轴不偏移，停
          animation.translateY(0).step()
          // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
          this.setData({
            animationData: animation
          })
          
          //关闭抽屉
          if (currentStatue == "close") {
            this.setData(
              {
                showModalStatus: false
              }
            );
          }
        }.bind(this), 200)
      
        // 显示抽屉
        if (currentStatue == "open") {
          this.setData(
            {
              showModalStatus: true
            }
          );
        }
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
        if(!this.data.bindVerticalCode){
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
    handleCancelBind: function() {
        this.setData({
            visibleSendBind: false
        });
    },
    handleDoBind: function() {
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