/* eslint-disable*/
define(function() {
    return {

        /**
         * @deprecated  请统一使用fish.nest
         * [从一个数组中根据对应的selfField和parentField的关系构造出树形结构]
         * @param  {[Array]} srcData     [数据源，是一个数组]
         * @param  {[String]} selfField   [数据源中代表当前记录的key]
         * @param  {[String]} parentField [数据源中代表父元素的key]
         * @param  {[Object]} topFlag     [数据源中最上层的值（比如最顶部的parentField的值为null，就是表示parentField的值为null的作为根元素）]
         * @return {[Array]}             [返回一个数组，数组中的每条元素可能有children选项，里面也是数组记录了子数据]
         */
        getTree: function(srcData, selfField, parentField, topFlag) {
            var tree = new Array();
            if (srcData) {
                var dict = new Array();
                // add  roodnode
                var n = srcData.length;
                for (var i = 0; i < n; i++) {
                    var item = srcData[i];
                    dict[item[selfField]] = item;
                    if (item[parentField] == undefined || item[parentField] == topFlag || item[parentField] === '') {
                        tree[tree.length] = item; // 添加根节点
                    }
                }
                // 由下至上，构造树
                for (var j = 0; j < n; j++) {
                    var child = srcData[j];
                    if (child[parentField] == topFlag || child[parentField] === '') {
                        continue;
                    }
                    var parent = dict[child[parentField]];
                    if (parent) {
                        //child.parent = parent;
                        if (!parent.children) {
                            parent.children = new Array();
                        }
                        parent.children[parent.children.length] = child;
                    }
                }
                return tree;
            }
        },
        htmlEncodeAllData: function(obj) {
            if (typeof obj == 'string') {
                return fish.htmlEncode(obj);
            }
            if (typeof obj == 'object') {
                var keys = fish.keys(obj),
                    retObj = {};
                fish.forEach(keys, function(key) {
                    if (typeof obj[key] == 'string') {
                        retObj[key] = fish.htmlEncode(obj[key]);
                    } else {
                        retObj[key] = obj[key];
                    }
                });
                return retObj;
            }
            return obj;
        },
        filterUpperCaseKey: function(obj) {
            var keys = fish.keys(obj),
                retObj = {};
            fish.forEach(keys, function(key) {
                if (key.toUpperCase() === key) {
                    retObj[key] = obj[key];
                }
            });
            return retObj;
        },
        gridIncHeight: function($grid, delta) {
            if ($grid.outerHeight() + delta < 114) {
                $grid.jqGrid('setGridHeight', 114);
            } else {
                $grid.jqGrid('setGridHeight', $grid.outerHeight() + delta);
            }
        },
        incHeight: function($el, delta) {
            $el.height($el.height() + delta);
        },
        getDeltaHeight: function($el) {
            return $el.parent().height() - $el.outerHeight(true);
        },
        seekBeforeRemRow: function($grid, rowdata) {
            var nextrow = this.$tree.jqGrid('getNextSelection', rowdata),
                prevrow = this.$tree.jqGrid('getPrevSelection', rowdata),
                parerow = this.$tree.jqGrid('getNodeParent', rowdata);
            if (nextrow) {
                $grid.jqGrid('setSelection', nextrow);
            } else if (prevrow) {
                $grid.jqGrid('setSelection', prevrow);
            } else if (parerow) {
                $grid.jqGrid('setSelection', parerow);
            }
        },
        drawViewType: function($view) {
            return $view.hasClass('ui-dialog') ? 'C' : 'M';
        },
        extractUrlParam: function(url) {
            var compArr = url.split('?'),
                paramStr = null,
                paramObj = {};
            if (compArr.length > 1) {
                paramStr = compArr[1];
                var paramArr = paramStr.split('&');
                fish.forEach(paramArr, function(item) {
                    var pair = item.split('=');
                    if (pair.length >= 2) {
                        paramObj[pair[0]] = pair[1];
                    }
                });
            }
            return {
                url: compArr[0],
                params: paramObj,
                paramStr: paramStr
            };
            // },
            // isFullscreenMode: function () {
            // we drop part of the criteria for fullscrenn mode identification
            // document.body.clientWidth == screen.width
            //不同浏览器screen.height是一样的，但是document.body.clientHeight取值不一样，会与screen.height相等或者比其少1px左右。
            // return document.body.clientHeight <= screen.height && document.body.clientHeight > screen.height - 5;
        },

        // spliceParams: function (sParam, params) {
        //     for (obj in params) {
        //         sParam += "&" + obj + "=" + params[obj];
        //     }
        //     return sParam;
        // },

        spliceParams: function(params) {
            var sRet = '';
            for (obj in params) {
                sRet += '&' + obj + '=' + params[obj];
            }
            return sRet;
        },

        isMatchPwdRule: function(password, composition) {
            var i18n = portal.appGlobal.get('commoni18n')[portal.appGlobal.get('language')];
            var userPwdMaxLength = 30;
            var msg = true;

            if (!password) {
                return i18n.PWD_REQUIRED;
            }
            if (/(.)\1{2}/.test(password)) {
                return i18n.PWD_CONTINUOUS_CHAR_NUM.replace('{0}', 2);
            }
            if (!portal.utils.checkWeakPwd(password)) {
                return i18n.PWD_NOT_USER_CODE;
            }
            if (arguments.length === 1) {
                var options = {
                    url: 'sysparams/securityrules/current',
                    async: false,
                    success: function(securityRule) {
                        var userPwdMinLength = securityRule.pwdMinLength; // 密码的最小长度
                        var pwdComposition = securityRule.pwdComposition; // 密码的组成规则
                        if (password.length < userPwdMinLength || password.length > userPwdMaxLength) {
                            msg = i18n.PWD_LENGTH.replace('{1}', userPwdMinLength).replace('{2}', userPwdMaxLength);
                        } else {
                            msg = portal.utils.matchPwdByComposition(pwdComposition, password, i18n);
                        }
                    }
                };
                fish.get(options);
                return msg;
            } else {
                return portal.utils.matchPwdByComposition(composition, password, i18n);
            }
        },
        matchPwdByComposition: function(composition, password, i18n) {
            var hasUpperCase = /[A-Z]/.test(password);
            var hasLowerCase = /[a-z]/.test(password);
            var hasSpecialChar = /[@#$%!&*]/.test(password);
            var hasDigitsChar = /[0-9]/.test(password);
            switch (composition) {
                case '2':
                    if (!hasDigitsChar || !(hasLowerCase || hasUpperCase)) {
                        return i18n.PWD_COMPOTION_2;
                    }
                    break;
                case '3':
                    if (!hasDigitsChar || !hasLowerCase || !hasUpperCase) {
                        return i18n.PWD_COMPOTION_3;
                    }
                    break;
                case '4':
                    if (!hasDigitsChar || !(hasLowerCase || hasUpperCase) || !hasSpecialChar) {
                        return i18n.PWD_COMPOTION_4;
                    }
                    break;
                case '5':
                    if (!hasDigitsChar || !hasLowerCase || !hasUpperCase || !hasSpecialChar) {
                        return i18n.PWD_COMPOTION_5;
                    }
                    break;
                default:
                    break;
            }
            return true;
        },
        checkWeakPwd: function(pwd) {
            pwd = pwd.toLowerCase();
            if (portal.appGlobal.get('userCode')) {
                var userCode = portal.appGlobal.get('userCode').toLowerCase();
                var reversedUc = userCode
                    .split('')
                    .reverse()
                    .join('');
                if (!(pwd === userCode || pwd === reversedUc)) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        },
        getDateFormatStr: function(value) {
            var ret = '';
            if (value) {
                var tempMonth = value.replace(/[m]+/g, 'MM'); // fish前端格式例如：yyyy-mm-dd hh:ii:ss
                var tempMinute = tempMonth.replace(/[i]+/g, 'mm');
                var temp12Hour = tempMinute.replace(/[H]+/g, 'hh'); // fish前端HH表示12进制，hh表示24小时进制，与后台相反，需要转换。
                var temp24Hour = tempMinute.replace(/[h]+/g, 'HH');
                ret = temp24Hour;
            } else {
                ret = 'yyyy-MM-dd HH:mm:ss';
            }
            return ret;
        },
        dateFormat: function(value) {
            var time = Date.parse(value.replace(/-/g, '/'));
            return fish.dateutil.format(new Date(time), fish.config.get('dateDisplayFormat.date'));
        },
        dateTimeFormat: function(value) {
            var time = Date.parse(value.replace(/-/g, '/'));
            return fish.dateutil.format(new Date(time), fish.config.get('dateDisplayFormat.datetime'));
        },
        timeFormat: function(value) {
            var time = Date.parse(value.replace(/-/g, '/'));
            return fish.dateutil.format(new Date(time), fish.config.get('dateDisplayFormat.time'));
        }
    };
});
