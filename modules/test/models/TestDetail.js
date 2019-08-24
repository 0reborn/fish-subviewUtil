define(function() {
    return fish.Model.extend({
        defaults: {
            userId: null,
            userName: null,
            userCode: null,
            contactInfo: null,
            userEffDate: null,
            userExpDate: null,
            memo: null,
            ipAddress: null
        }
    });
});
