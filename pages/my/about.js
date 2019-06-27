// about.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: 'https://github.com/Yinghuochongxiaoq',
    },

    bindCopyUrl: function() {
        var url = this.data.url;
        wx.setClipboardData({
            data: url,
            success: function() {
                wx.showToast({
                    title: '复制成功',
                    icon: 'success'
                });
                console.log('复制成功：', url);
            }
        });
    },

    onShareAppMessage() {     
        return {    
            title: '记录生活印迹',
            desc: '在这里记录你的每一点一滴~',
            path: 'pages/index/index',
            imageUrl: '/images/share.jpg'   
        }   
    }
})