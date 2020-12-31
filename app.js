//app.js
App({
    onLaunch: function () {
        if (wx.canIUse('getUpdateManager')) {
            const updateManager = wx.getUpdateManager()
            updateManager.onCheckForUpdate(function (res) {
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(function () {
                        wx.showModal({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启应用？',
                            success: function (res) {
                                debugger
                                if (res.confirm) {
                                    updateManager.applyUpdate()
                                }
                            }
                        })
                    })
                    updateManager.onUpdateFailed(function () {
                        wx.showModal({
                            title: '已经有新版本了哟~',
                            content: '新版本已经上线了，请您删除当前小程序，重新搜索打开'
                        })
                    })
                }
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }
    },
    globalData: {
        userInfo: null,
        shareImgUrl: 'https://aivabc.com/Uploadfile/ShareDetailImage/20190704/6369786934483499313738901.jpg',
        // api: 'https://api.aivabc.com:8080/api',
        // uploadFileUrl: 'https://api.aivabc.com:8080/UploadServer/HandlerFile/HandlerFile.ashx?fun=001&others=',
        uploadFileUrl: 'http://localhost:8004/UploadServer/HandlerFile/HandlerFile.ashx?fun=001&others=',
        api: 'http://localhost:8004/api',
    }
})