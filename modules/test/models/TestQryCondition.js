define(function() {
    return fish.Model.extend({
        defaults: {
            state: null,
            userName: null,
            userCode: null,
            isLocked: null,
            portalId: null
        }
    });
});
