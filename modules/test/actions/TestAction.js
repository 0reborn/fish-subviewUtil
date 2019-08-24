define(function() {
    return {
        qryUserListByPageInfo: function(userDetailJSON, filter, success) {
            fish.get('user', fish.extend(userDetailJSON, filter), success);
        },

        addUser: function(userDetailJSON, success) {
            fish.post(
                'user',
                fish.pick(
                    userDetailJSON,
                    'userId',
                    'userName',
                    'userCode',
                    'phone',
                    'email',
                    'address',
                    'userEffDate',
                    'userExpDate',
                    'memo'
                ),
                success);
        },
        modUser: function(userDetailJSON, success) {
            fish.put(
                'user',
                fish.pick(
                    userDetailJSON,
                    'userId',
                    'userName',
                    'userCode',
                    'phone',
                    'email',
                    'address',
                    'userEffDate',
                    'userExpDate',
                    'memo'
                ),
                success);
        },
        // 将priv从user中解除
        removeUser: function(userId, success) {
            fish.remove('user/' + userId, success);
        }
    };
});
