require('utils/v-request.js');
App({
    onLaunch: function () {
        wx.cloud.init({
            env: this.globalData.cloudId
        });
        if (wx.canIUse('getUpdateManager')) {
            const updateManager = wx.getUpdateManager()
            updateManager.onCheckForUpdate(function (res) {
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(function () {
                        wx.showModal({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启应用？',
                            success: function (res) {
                                if (res.confirm) {
                                    updateManager.applyUpdate();
                                }
                            }
                        });
                    });
                    updateManager.onUpdateFailed(function () {
                        wx.showModal({
                            title: '已经有新版本了哟~',
                            content: '新版本已经上线了，请您删除当前小程序，重新搜索打开'
                        });
                    });
                }
            });
        } else {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            });
        }
    },

    /**
     * 封装http请求
     * @param {string} url 
     * @param {object} data 
     * @param {string|GET|POST} method 
     */
    http: function (url, data = '', method = "GET") {
        var apiUrl = this.globalData.api;
        var currency = {
            token: this.globalData.userInfo ? (this.globalData.userInfo.token || '') : ''
        };
        return new Promise((resolve, reject) => {
            wx.request({
                url: apiUrl + url,
                data: Object.assign(currency, data),
                method: method,
                success: function (res) {
                    if (res.data.resultCode == 0) {
                        console.log('请求发起，响应成功.');
                    }
                    resolve(res.data);
                },
                fail: function (res) {
                    reject(res);
                },
                complete: function () {
                    console.log('http complete.');
                }
            });
        });
    },
    globalData: {
        userInfo: null,
        jdApiKey: 'w01831035fb65a1c696c8ade9d00df6a6',
        jdJokeUrl: 'https://way.jd.com/showapi/wbxh',
        shareImgUrl: 'https://aivabc.com:8080/Uploadfile/20210105/6369786934483499313738901.jpg',
        api: 'https://api.aivabc.com:8080/api',
        uploadFileUrl: 'https://api.aivabc.com:8080/UploadServer/HandlerFile/HandlerFile.ashx?fun=001&others=',
        cloudId: 'wcloud-http-online-4eo9hh8ef0ea88',
        // cloudId: 'wcommon-test-data-set-6bw06f34bd7',
        // uploadFileUrl: 'http://localhost:8004/UploadServer/HandlerFile/HandlerFile.ashx?fun=001&others=',
        // api: 'http://localhost:8004/api',
    }
});