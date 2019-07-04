// about.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        authUrl: 'https://aivabc.com'
    },

    bindCopyUrl: function() {
        var url = this.data.authUrl;
        wx.setClipboardData({
            data: url,
            success: function() {
                wx.showToast({
                    title: '复制成功',
                    icon: 'success'
                });
            }
        });
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