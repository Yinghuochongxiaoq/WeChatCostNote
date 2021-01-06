Component({
    externalClasses: ['i-class'],

    properties: {
        isLogin: {
            type: Boolean,
            value: false
        }
    },
    methods: {
        onCustomerTap: function (e) {
            this.triggerEvent('onCustomerTap', e.currentTarget.dataset);
        },
        /**
         * 跳转到登录页
         */
        handleToLogin: function () {
            wx.clearStorageSync();
            wx.navigateTo({
                url: '/pages/login/index'
            });
        },
    }
});