var View = require('behavior-view');

Component({
  externalClasses: ['ex-class'],
  behaviors: [
    View
  ],
  properties: {
    displayMonthNum: {
      type: Number
    },
    displayTime: {
      type: String
    },
    selectedDate: {
      type: String
    }
  },
  data: {
    weekDayArr: ['日', '一', '二', '三', '四', '五', '六'],
  },

  attached: function () {},
  methods: {
    onDayTap: function (e) {
      this.triggerEvent('onDayTap', e.currentTarget.dataset);
    }
  }
});