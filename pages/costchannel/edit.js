var app = getApp();
Page({
    data: {
        model: {
            costChannelName: "",
            costChannelNo: "",
            id: 0,
            sort: 0,
            isValid: 0
        },
        typeList: ['请选择', '停用', '启用'],
        typeIds: [-1, 0, 1],
        typeIndex: 0,
        isSaving: false
    },
    onLoad: function(options) {
        var id = options.id;
        if (id && id > 0) {
            this.getCostChannelModel(id)
        }
    },
    bindTypeChange: function(e) {
        this.setData({
            typeIndex: e.detail.value,
            "model.isValid": this.data.typeIds[e.detail.value]
        })
    },
    changeChannelSort: function(e) {
        this.setData({
            "model.sort": e.detail.detail.value
        })
    },
    getCostChannelModel: function(id) {
        var self = this;
        wx.request({
            url: app.globalData.api + '/CostNote/GetCostChannelModel',
            data: {
                token: app.globalData.userInfo.token,
                id: id
            },
            method: 'GET',
            success: function(res) {
                if (res.data.resultCode == 0) {
                    self.setData({
                        model: res.data.data,
                        typeIndex: res.data.data.isValid + 1
                    })
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
    },
    changeName: function(e) {
        this.setData({
            "model.costChannelName": e.detail.detail.value
        })
    },
    changeNo: function(e) {
        this.setData({
            "model.costChannelNo": e.detail.detail.value
        })
    },
    handleSaveClick: function(e) {
        var self = this;
        self.setData({
            isSaving: true
        })
        wx.request({
            url: app.globalData.api + '/CostNote/SaveCostChannelInfo',
            data: {
                token: app.globalData.userInfo.token,
                id: self.data.model.id,
                costChannelName: self.data.model.costChannelName,
                costChannelNo: self.data.model.costChannelNo,
                sort: self.data.model.sort,
                isValid: self.data.model.isValid
            },
            method: 'GET',
            success: function(res) {
                if (res.data.resultCode == 0) {
                    self.setData({
                        model: {
                            costChannelName: "",
                            costChannelNo: "",
                            id: 0,
                            isValid: 0
                        },
                        typeIndex: 0,
                        isSaving: false
                    })
                    wx.showToast({
                        title: '保存成功',
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
            }
        })
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