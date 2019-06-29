var app = getApp();
Page({
    data: {
        userInfo: app.globalData
    },
    onLoad: function() {
        this.setData({
            userInfo: app.globalData.userInfo
        });
    },
    onShareAppMessage() {     
        return {    
            title: '记录你的一点一滴~',
            desc: '记录你的一点一滴~',
            path: 'pages/index/index',
            imageUrl: '/images/share.jpg'   
        }   
    }
})