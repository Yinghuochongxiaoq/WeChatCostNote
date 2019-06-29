var app = getApp();
Page({
    data: {
        model: {
            id: 0,
            name: '',
            sort: 0,
            spendType: -1
        },
        spendTypeList: ['请选择', '支出', '收入'],
        spendTypeIds: [-1, 0, 1],
        spendTypeIndex: 0,
        isSaving: false,
        canDelete: false,
        visibleDelete: false,
        deleteActions: [{
            name: '删除',
            color: '#ed3f14'
        }]
    },
    onLoad: function(options) {
        var id = options.id;
        if (id && id > 0) {
            this.getCostTypeModel(id)
        }
    },
    bindSpendTypeChange: function(e) {
        this.setData({
            spendTypeIndex: e.detail.value,
            "model.spendType": this.data.spendTypeIds[e.detail.value]
        })
    },
    changeSort: function(e) {
        this.setData({
            "model.sort": e.detail.detail.value
        })
    },
    getCostTypeModel: function(id) {
        var self = this;
        wx.request({
            url: app.globalData.api + '/CostNote/GetCostTypeModel',
            data: {
                token: app.globalData.userInfo.token,
                id: id
            },
            method: 'GET',
            success: function(res) {
                if (res.data.resultCode == 0) {
                    self.setData({
                        model: res.data.data,
                        canDelete: true,
                        spendTypeIndex: res.data.data.spendType + 1
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
            "model.name": e.detail.detail.value
        })
    },
    handleSaveClick: function(e) {
        var self = this;
        wx.request({
            url: app.globalData.api + '/CostNote/SaveTypeInfo',
            data: {
                token: app.globalData.userInfo.token,
                id: self.data.model.id,
                name: self.data.model.name,
                sort: self.data.model.sort,
                spendType: self.data.model.spendType
            },
            method: 'GET',
            success: function(res) {
                if (res.data.resultCode == 0) {
                    self.setData({
                        model: {
                            id: 0,
                            name: '',
                            sort: 0,
                            spendType: -1
                        },
                        canDelete: false,
                        spendTypeIndex: 0
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
    handleOpenDelete: function() {
        this.setData({
            visibleDelete: true
        });
    },
    handleCancelDelete: function() {
        this.setData({
            visibleDelete: false
        });
    },
    handleDeleteCostType: function() {
        const action = [this.data.deleteActions];
        action[0].loading = true;
        this.setData({
            deleteActions: action
        });

        var self = this;
        wx.request({
            url: app.globalData.api + '/CostNote/DeleteCostTypeModel',
            data: {
                token: app.globalData.userInfo.token,
                id: self.data.model.id
            },
            method: 'GET',
            success: function(res) {
                if (res.data.resultCode == 0) {
                    action[0].loading = false;
                    self.setData({
                        visibleDelete: false,
                        deleteActions: action,
                        model: {
                            id: 0,
                            name: '',
                            sort: 0,
                            spendType: -1
                        },
                        canDelete: false,
                        spendTypeIndex: 0
                    });
                    wx.showToast({
                        title: '删除成功',
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