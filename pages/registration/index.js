//获取公共ui操作类实例
const _page = require('../../utils/abstract-page.js');
var modCalendar = require('../mod/calendar.js');


//获取应用实例
const app = getApp();

Page(_page.initPage({
  data: {
    sss: 'sss'
  },
  methods: {},
  goList: function () {
    if (!this.data.cityStartId) {
      this.showToast('请选择出发城市');
      return;
    }
    if (!this.data.cityArriveId) {
      this.showToast('请选择到达城市');
      return;
    }
  },
  onLoad: function () {
    this.setData({
      sss: 222
    });
  }
}, {
  modCalendar: modCalendar
}));