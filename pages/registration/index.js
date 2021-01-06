//获取公共ui操作类实例
const _page = require('../../utils/abstract-page.js');
var modCalendar = require('../mod/calendar.js');
var util = require('../../utils/util.js');
var media_index = 0;
var media_count = 0;
const {
    watch,
    computed
} = require('../../utils/vuefy.js');

//获取应用实例
const app = getApp();

Page(_page.initPage({
    data: {
        number: 1,
        workContent: '',
        isSaving: false,
        id: 0,
        currentNoteLen: 0,
        noteMaxLen: 500,
        textareaDisable: false,
        date: new Date().toString(),
        lenMore: 0,
        imgs: [],
        media_list: [],
        isUploadFile: false,
        isLogin: false
    },
    methods: {},
    onLoad: function (options) {
        var that = this;
        //检查token是否存在
        var userInfo = util.getStorageSync("userInfo");
        if (userInfo != null) {
            wx.request({
                url: app.globalData.api + '/CostNote/GetUploadConfig',
                data: {
                    token: app.globalData.userInfo.token
                },
                method: 'GET',
                success: function (res) {
                    if (res.data.resultCode == 0) {
                        if (res.data.data) {
                            media_count = res.data.data.media_count;
                        }
                    } else {
                        wx.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 2000
                        });
                    }
                },
                fail: function () {
                    wx.showToast({
                        title: '网络异常',
                        icon: 'none',
                        duration: 2000
                    });
                },
                complete: function () {
                    //初始化数据，如果传入的id大于0时
                    if (options.id) {
                        that.init(options.id);
                    } else {
                        that.defaultData();
                    }
                }
            });
        }
        computed(this, {
            textareaDisable: function () {
                console.log("当前时间:" + new Date() + "显示日历:" + this.data.isCalendarShow + "判断值：" + (this.data.isCalendarShow != 'none'));
                return this.data.isCalendarShow != 'none';
            }
        });
    },
    /**
     * 初始化数据
     * @param {number} id 
     */
    init: function (id) {
        var that = this;
        if (id && id > 0) {
            wx.request({
                url: app.globalData.api + '/CostNote/GetUserDailyHistoryInfoById',
                data: {
                    token: app.globalData.userInfo.token,
                    id: id
                },
                method: 'GET',
                success: function (res) {
                    if (res.data.resultCode == 0) {
                        var img_url = [];
                        var media_list = [];
                        if (res.data.data && res.data.data.mediaList && res.data.data.mediaList.length > 0) {
                            var interfaceMediaList = res.data.data.mediaList;
                            for (var i = 0; i < interfaceMediaList.length; i++) {
                                if (img_url.length >= media_count) {
                                    break;
                                } else {
                                    media_list.push({
                                        type: "image",
                                        size: interfaceMediaList[i].size,
                                        tempFilePath: interfaceMediaList[i].tempFilePath,
                                        url: interfaceMediaList[i].url,
                                        fullUrl: interfaceMediaList[i].fullUrl,
                                        id: interfaceMediaList[i].id,
                                        index: media_index++
                                    });
                                    img_url.push(interfaceMediaList[i].fullUrl);
                                }
                            }
                        }

                        that.setData({
                            number: res.data.data.dailyNumber,
                            workContent: res.data.data.dailyContent,
                            currentNoteLen: parseInt(res.data.data.dailyContent.length),
                            isSaving: false,
                            id: res.data.data.id,
                            imgs: img_url,
                            media_list: media_list,
                            lenMore: img_url.length >= media_count ? 1 : 0,
                            date: res.data.data.dailyDate,
                            calendarDisplayTime: res.data.data.dailyDate,
                            calendarSelectedDate: res.data.data.dailyDate,
                            calendarSelectedDateStr: util.dateUtil.format(new Date(res.data.data.dailyDate), 'Y年M月D日')
                        });
                    } else {
                        wx.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 2000
                        });
                    }
                },
                fail: function () {
                    wx.showToast({
                        title: '网络异常',
                        icon: 'none',
                        duration: 2000
                    });
                }
            });
        } else {
            this.defaultData();
        }
    },
    /**
     * 保存信息
     */
    send: function () {
        var that = this;
        that.setData({
            isSaving: true
        });
        wx.showLoading({
            title: '玩命处理中...',
        });
        that.imgUpload();
    },
    /**
     * 图片上传
     */
    imgUpload: function () {
        var that = this;
        that.setData({
            isUploadFile: false
        });
        var media_list = that.data.media_list;
        //字典，需要记录原始url，以及服务器返回url
        var media_list_ok = [];
        var media_list_need = [];
        //没有发布多媒体文件
        if (media_list.length < 1) {
            //保存文字信息
            that.handleSaveClick();
            return false;
        }
        for (var i = 0; i < media_list.length; i++) {
            if (!media_list[i].id) {
                media_list_need.push({
                    tempFilePath: media_list[i].tempFilePath,
                    index: media_list[i].index
                });
            }
        }
        //没有需要重新处理的图片
        if (media_list_need.length < 1) {
            that.handleSaveClick();
            return false;
        }
        for (var j = 0; j < media_list_need.length; j++) {
            var file_url = media_list_need[j].tempFilePath;
            wx.uploadFile({
                url: app.globalData.uploadFileUrl + media_list_need[j].index,
                filePath: file_url,
                name: 'upfile',
                success: (res) => {
                    var rsp_data = util.strToJson(res.data);
                    //放入url
                    media_list_ok.push({
                        index: rsp_data.Others,
                        url: rsp_data.Url,
                        fullUrl: rsp_data.FullUrl
                    });
                    if (media_list_ok.length == media_list_need.length && !that.data.isUploadFile) {
                        that.setData({
                            isUploadFile: true
                        });
                        var index = 0;
                        for (var f = 0; f < media_list.length; f++) {
                            index = media_list[f].index;
                            var tmp = media_list_ok.filter(item => {
                                return item.index == index;
                            })[0];
                            if (tmp) {
                                media_list[f].url = tmp.url;
                                media_list[f].fullUrl = tmp.fullUrl;
                            }
                        }
                        that.setData({
                            media_list: media_list
                        });
                        that.handleSaveClick();
                    }
                },
                fail: (res) => {
                    that.setData({
                        isSaving: false
                    });
                    wx.hideLoading();
                    wx.showToast({
                        title: '文件上传失败',
                        icon: 'none',
                        duration: 1500
                    });
                }
            });
        }
    },
    /**
     * 保存数据
     */
    handleSaveClick: function () {
        var that = this;
        wx.request({
            url: app.globalData.api + '/CostNote/AddDailyModel',
            data: {
                token: app.globalData.userInfo.token,
                id: that.data.id,
                workNumber: that.data.number,
                dailyTime: that.data.calendarSelectedDateStr,
                mediaList: that.data.media_list,
                workContent: that.data.workContent
            },
            method: 'POST',
            success: function (res) {
                if (res.data.resultCode == 0) {
                    wx.hideLoading();
                    that.defaultData();
                    setTimeout(function () {
                        wx.showToast({
                            title: res.data.message,
                            icon: 'success',
                            duration: 2000
                        });
                        wx.navigateBack();
                    }, 1000);
                } else {
                    wx.hideLoading();
                    setTimeout(function () {
                        wx.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 2000
                        });
                    }, 200);
                }
            },
            fail: function () {
                wx.hideLoading();
                wx.showToast({
                    title: '网络异常',
                    icon: 'none',
                    duration: 2000
                });
            },
            complete: function () {
                wx.hideLoading();
                that.setData({
                    isSaving: false,
                });
            }
        });
    },
    /**
     * 选择图片
     * @param {any} e 
     */
    chooseImg: function (e) {
        var that = this;
        var imgs = this.data.imgs;
        if (imgs.length >= media_count) {
            this.setData({
                lenMore: 1
            });
            return false;
        } else {
            that.setData({
                lenMore: 0
            });
        }
        wx.chooseImage({
            count: media_count,
            // 可以指定是原图还是压缩图，默认二者都有
            sizeType: ['original', 'compressed'],
            // 可以指定来源是相册还是相机，默认二者都有
            sourceType: ['album', 'camera'],
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                var tempFiles = res.tempFiles;
                var img_url = that.data.imgs;
                var media_list = that.data.media_list;
                console.log(tempFilePaths + '----');
                for (var i = 0; i < tempFilePaths.length; i++) {
                    if (img_url.length >= media_count) {
                        that.setData({
                            imgs: img_url,
                            media_list: media_list
                        });
                        break;
                    } else {
                        if (tempFiles[i].size > 5242880) {
                            wx.showToast({
                                title: '图片大小不能超过5M',
                                icon: 'none',
                                duration: 2000
                            });
                            continue;
                        }
                        media_list.push({
                            type: "image",
                            size: tempFiles[i].size,
                            tempFilePath: tempFilePaths[i],
                            url: '',
                            fullUrl: '',
                            index: media_index++
                        });
                        img_url.push(tempFilePaths[i]);
                    }
                }
                console.log(img_url);
                that.setData({
                    imgs: img_url,
                    media_list: media_list,
                    lenMore: img_url.length >= media_count ? 1 : 0
                });
            }
        });
    },
    /**
     * 删除图片
     * @param {any} e 
     */
    deleteImg: function (e) {
        var imgs = this.data.imgs;
        var media_list = this.data.media_list;
        var index = e.currentTarget.dataset.index;
        imgs.splice(index, 1);
        media_list.splice(index, 1);
        this.setData({
            imgs: imgs,
            media_list: media_list,
            lenMore: imgs.length >= media_count ? 1 : 0
        });
    },
    /**
     * 预览图片
     * @param {any} e 
     */
    previewImg: function (e) {
        //获取当前图片的下标
        var index = e.currentTarget.dataset.index;
        //所有图片
        var imgs = this.data.imgs;
        wx.previewImage({
            //当前显示图片
            current: imgs[index],
            //所有图片
            urls: imgs
        });
    },

    /**
     * 处理默认数据
     */
    defaultData: function () {
        this.setData({
            number: 1,
            workContent: '',
            isSaving: false,
            id: 0,
            currentNoteLen: 0,
            noteMaxLen: 500,
            textareaDisable: false,
            date: new Date().toString(),
            lenMore: 0,
            imgs: [],
            media_list: [],
            isUploadFile: false
        });
    },
    handleChangeWorkNumber: function ({
        detail
    }) {
        this.setData({
            number: detail.value
        });
    },
    handleChangeWorkContent: function (event) {
        var length = parseInt(event.detail.value.length);
        this.setData({
            currentNoteLen: length,
            workContent: event.detail.value
        });
    }
}, {
    modCalendar: modCalendar
}));