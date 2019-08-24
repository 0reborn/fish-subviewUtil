define([
    'modules/test/models/TestQryCondition',
    'modules/test/models/TestDetail',
    'modules/test/actions/TestAction',
    'text!modules/test/templates/Test.html',
    'i18n!modules/test/i18n/Test',
    'css!modules/test/css/test'
], function(QryCondition, Detail, ServiceAction, Tpl, I18N) {
    return fish.View.extend({
        template: fish.compile(Tpl),
        serialize: I18N,
        events: {
            'click .js-query': 'queryInfo',
            'click .js-user-detail .js-user-new': 'addNewItem',
            'click .js-user-detail .js-user-edit': 'editItem',
            'click .js-user-detail .js-user-ok': 'ok',
            'click .js-user-detail .js-user-cancel': 'cancel'
        },

        initialize: function () {
            this.$userGrid = null;
            this.qryCondition = new QryCondition();
            this.infoDetail = new Detail();

            this.listenTo(this.qryCondition, 'change', function () {
                this.pageData(true);
            });
            this.listenTo(this.infoDetail, 'change', this.detailUpdated);
        },

        afterRender: function () {
            var self = this;
            var $userQueryForm = this.$('.js-user-query');
            var $userDetailForm = this.$('.js-user-detail');

            $userQueryForm.form();
            $userQueryForm.find("[name='state']").combobox();
            $userQueryForm.find("[name='isLocked']").combobox();

            $userDetailForm.form();
            $userDetailForm.find("[name='userEffDate']").datetimepicker({
                viewType: 'date'
            });
            $userDetailForm.find("[name='userExpDate']").datetimepicker({
                viewType: 'date'
            });

            this.$userGrid = this.$('.js-user-grid').grid({
                colModel: [
                    {
                        name: 'userId',
                        label: '',
                        hidden: true,
                        key: true
                    },
                    {
                        name: 'userName',
                        label: I18N.USERMGR_USER_NAME,
                        width: '15%'
                    },
                    {
                        name: 'userCode',
                        label: I18N.USERMGR_USER_CODE,
                        width: '15%'
                    },
                    {
                        name: 'loginFail',
                        label: I18N.USERMGR_LOGIN_FAIL,
                        width: '10%'
                    },
                    {
                        name: 'state',
                        label: I18N.COMMON_STATE,
                        width: '10%',
                        formatter: 'select',
                        formatoptions: {
                            value: {
                                A: I18N.COMMON_ACTIVE,
                                X: I18N.COMMON_INACTIVE
                            }
                        }
                    },
                    {
                        name: 'isLocked',
                        label: I18N.USERMGR_IS_LOCKED,
                        width: '10%',
                        formatter: 'select',
                        formatoptions: {
                            value: {
                                Y: I18N.COMMON_YES,
                                N: I18N.COMMON_NO
                            }
                        }
                    },
                    {
                        name: 'portalName',
                        label: I18N.USERMGR_DEFAULT_PORTAL,
                        width: '30%'
                    },
                    {
                        name: 'operate',
                        label: '',
                        align: 'center',
                        exportable: false,
                        formatter: function () {
                            return '<div class="icon-group-embed"><a href="javascript:;" data-action="delete"><span class="glyphicon glyphicon-trash" aria-hidden="true" data-action="delete"></span></a></div>';
                        },
                        width: '10%'
                    }
                ],
                rowNum: 10,
                pager: true,
                datatype: 'json',
                showColumnsFeature: true,
                cached: true,
                pageData: function () {
                    this.pageData(false);
                }.bind(this),
                onSelectRow: this.rowSelectCallback.bind(this)
            });

            this.queryInfo();
            this.adjustLayout();
            $(window).resize(fish.debounce(function () {
                self.adjustLayout();
            }, 80));
        },

        pageData: function (reset, postLoad) {
            var qryCondition = this.qryCondition.toJSON();
            var pageLength = 10;
            var page = reset ? 1 : this.$userGrid.grid('getGridParam', 'page');
            var filter = {
                pageIndex: page - 1,
                pageSize: pageLength
            };
            var qrys = {};
            Object.keys(qryCondition).forEach(function (key) {
                var value = qryCondition[key];
                if (value && value.length > 0) {
                    qrys[key] = value;
                }
            });
            ServiceAction.qryUserListByPageInfo(
                qrys,
                filter,
                function (data) {
                    var userList = data.list;
                    fish.forEach(
                        userList,
                        function (user) {
                            this.normalizeDate(user);
                        },
                        this
                    );
                    this.$userGrid.grid('reloadData', {
                        rows: userList,
                        page: page,
                        records: data.total
                    });
                    if (fish.isFunction(postLoad)) {
                        postLoad.call(this);
                    } else if (userList.length > 0) {
                        this.$userGrid.grid('setSelection', userList[0]);
                    } else {
                        this.$('.js-user-detail').form('clear');
                        this.$('.js-user-detail').form('disable');
                    }
                }.bind(this)
            );
        },

        rowSelectCallback: function (event, rowid) {
            var that = this;
            var e = event.originalEvent;
            var $grid = this.$('.js-user-grid');
            var rowdata = $grid.grid('getRowData', rowid);
            var userId = rowdata.userId;
            this.infoDetail.clear({
                silent: true
            });
            this.infoDetail.set(rowdata);
            if (e && $(e.target).data('action') === 'delete') {
                fish.confirm(
                    I18N.USERMGR_DELETE_USER_CONFIRM,
                    function () {
                        ServiceAction.removeUser(
                            userId,
                            function () {
                                var data = $grid.grid('getRowData');
                                var currentDelIndex = data.findIndex(function (v) {
                                    return v.userId.toString() === rowid;
                                });
                                if (currentDelIndex >= data.length - 1) currentDelIndex += -1;
                                else currentDelIndex += 1;
                                that.infoDetail.set(data[currentDelIndex]);
                                $grid.grid('delRowData', rowid);
                                $grid.grid('setSelection', that.infoDetail.toJSON());
                                fish.success(I18N.USERMGR_DELETE_USER_SUCCESS);
                            }
                        );
                    },
                    $.noop
                );
            }
        },

        detailUpdated: function () {
            this.$('.js-user-detail').form('clear');
            this.$('.js-user-detail').form('disable');
            this.$('.js-user-detail').form('value', this.infoDetail.toJSON());
            this.$('.js-user-detail').resetValid();
            this.$('.js-user-cancel')
                .parent()
                .hide();
            this.$('.js-user-cancel')
                .parent()
                .prev()
                .show();
        },

        queryInfo: function () {
            var $form = this.$('.js-user-query');
            var value = $form.form('value');
            this.qryCondition.clear({
                silent: true
            });
            this.qryCondition.set(new QryCondition(value).toJSON(), {
                silent: true
            });
            this.qryCondition.trigger('change');
        },

        addNewItem: function () {
            var $form = this.$('.js-user-detail');
            $form.form('enable');
            $form.form('clear');
            this.$('.js-user-new')
                .parent()
                .hide();
            this.$('.js-user-new')
                .parent()
                .next()
                .show();
            $form.find(":input[name='userName']").focus();
            this.$('.js-user-ok').data('type', 'new');
            this.$('[name=userCode]').attr('disabled', false);
        },

        editItem: function () {
            this.$('.js-user-detail').form('enable');
            this.$('.js-user-edit')
                .parent()
                .hide();
            this.$('.js-user-edit')
                .parent()
                .next()
                .show();
            this.$('.js-user-ok').data('type', 'edit');
            this.$('[name=userCode]').attr('disabled', true);
        },

        ok: function () {
            var $grid = this.$('.js-user-grid');
            var $ok = this.$('.js-user-ok');
            var $form = this.$('.js-user-detail');
            var inputUser;
            var editItem;
            switch ($ok.data('type')) {
                case 'new':
                    if ($form.isValid()) {
                        inputUser = new Detail($form.form('getValue')).toJSON();
                        ServiceAction.addUser(
                            inputUser,
                            function (user) {
                                this.normalizeDate(user);
                                this.infoDetail.clear({
                                    silent: true
                                });
                                this.infoDetail.set(user);
                                $grid.grid('addRowData', this.infoDetail.toJSON(), 'last');
                                $grid.grid('setSelection', this.infoDetail.toJSON());
                                fish.success(I18N.USERMGR_ADD_USER_SUCCESS);
                            }.bind(this)
                        );
                    }
                    break;
                case 'edit':
                    if ($form.isValid()) {
                        editItem = fish.extend(this.infoDetail.toJSON(), $form.form('getValue', false));
                        ServiceAction.modUser(
                            editItem,
                            function () {
                                this.infoDetail.clear({
                                    silent: true
                                });
                                this.infoDetail.set(editItem);
                                $grid.grid('setRowData', this.infoDetail.toJSON());
                                fish.success(I18N.USERMGR_MOD_USER_SUCCESS);
                            }.bind(this)
                        );
                    }
                    break;
                default:
                    break;
            }
        },

        cancel: function () {
            this.$('.js-user-cancel')
                .parent()
                .hide();
            this.$('.js-user-cancel')
                .parent()
                .prev()
                .show();
            this.$('.js-user-detail').form('disable');
            this.$('.js-user-detail').resetValid();
            this.infoDetail.trigger('change');
        },

        normalizeDate: function (userDetail) {
            var effDate = userDetail.userEffDate;
            var expDate = userDetail.userExpDate;
            if ($.trim(effDate)) {
                userDetail.userEffDate = effDate.split(' ')[0];
            }
            if ($.trim(expDate)) {
                userDetail.userExpDate = expDate.split(' ')[0];
            }
        },

        adjustLayout: function () {
            var height = $(document.body).height();
            var $queryHeight = $('#search').height();
            var $detailHeight = $('#detail').height();
            var $grid = this.$('.js-user-grid');
            var gridHeight = height - $detailHeight - $queryHeight - 110;
            if (gridHeight < 114) {
                $grid.jqGrid('setGridHeight', 114);
            } else {
                $grid.jqGrid('setGridHeight', gridHeight > 360 ? 360 : gridHeight);
            }
        }
    });
});
