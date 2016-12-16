/**
 * Created by chenmeng on 2016/12/6.
 */
/**
 * Created by chenmeng on 2016/11/29.
 */

//utils为一些常用的方法
var utils = (function () {

    /**
     * 通过id命获取元素 注意不用传#
     * @param id
     * @returns {Element}
     */
    function $(id) {
        return document.getElementById(id);
    }

    /**
     * json字符串转换
     * @param str
     * @returns {Object}
     */
    function jsonParse(str) {
        return 'JSON' in window ? JSON.parse(str) : eval('(' + str + ')');
    }

    /*
     * 类数组转数组
     * @param likeArray
     * @returns Array;
     */

    function makeArray(likeArray) {
        try {
            return Array.prototype.slice.call(likeArray);
        } catch (e) {
            var arr = [];
            for (var i = 0; i < likeArray.length; i++) {
                arr.push(likeArray[i])
            }
            return arr;
        }
    }

    /**
     * 获取[m,n]的随机整数;
     * @param m
     * @param n
     * @returns random int;
     */
    function getRandom(m, n) {
        m = Number(m)
        n = Number(n);
        if (isNaN(m) || isNaN(n)) {
            return Math.random();
        }
        if (m > n) {
            m = m + n;
            n = m - n;
            m = m - n;
        }
        return Math.round(Math.random() * (n - m) + m);
    }

    /**
     * 获取curELe的样式
     * @param curEle
     * @param attr
     * @returns {*}
     */
    function getCss(curEle, attr) {
        var val = null;
        if ('getComputedStyle' in window) {
            val = getComputedStyle(curEle, false)[attr];
        } else {
            if (attr == 'opacity') {
                val = curEle.currentStyle.opacity;
                var reg = /^alpha\(opacity[:=](\d+(\.\d+)?)\)$/;
                return reg.test(val) ? reg.exec(val)[1] / 100 : 1;
            } else {
                val = curEle.currentStyle[attr];
            }
        }
        var reg = /^([+-])?(\d+(\.\d+)?)(px|pt|rem|em|deg)$/ig;
        return reg.test(val) ? parseFloat(val) : val;
    }

    /**
     * 设置css样式
     * @param curEle
     * @param attr
     * @param val val有单位的传参时需要加上单位(未作单位处理)；
     */
    function setCss(curEle, attr, val) {
        if (attr == 'float') {
            curEle.style.cssFloat = val;
            curEle.style.styleFloat = val;
            return;
            ``
        }
        if (attr == 'opacity') {
            curEle.style.opacity = val;
            curEle.style.filter = 'alpha(opacity:' + (val * 100) + ')';
            return;
        }
        curEle.style[attr] = val;
    }

    /**
     * 设置一组css样式
     * @param curEle
     * @param opt
     */
    function setGroupCss(curEle, opt) {
        if ({}.toString.call(opt) !== '[object Object]')return;
        for (var attr in opt) {
            this.setCss(curEle, attr, opt[attr]);
        }
    }

    /**
     * 设置或者获取css样式
     * @param curEle
     * @returns {*}
     */

    function css(curEle) {
        var secondParam = arguments[1];
        var thirdParam = arguments[2];
        if (typeof secondParam == 'string') {
            if (thirdParam == null) {
                return this.getCss(curEle, secondParam)
            }
            this.setCss(curEle, secondParam, thirdParam)
        }
        if ({}.toString.call(secondParam) === '[object Object]') {
            this.setGroupCss(curEle, secondParam)
        }
    }

    /**
     * 通过class名字获取元素标签
     * @param strClass  class名 支持多个 用空格隔开
     * @param context 指定上下文
     * @returns {*}
     */
    function getByClass(strClass, context) {
        context = context || document;
        if (document.getElementsByClassName) {
            return context.getElementsByClassName(strClass);
        }
        var arr = [];
        var arrClass = strClass.replace(/^\s+|\s+$/, '').split(/\s+/);
        var tags = context.getElementsByTagName('*');
        for (var i = 0; i < tags.length; i++) {
            var curTag = tags[i];
            var flag = true;
            for (var j = 0; j < arrClass.length; j++) {
                var curClass = arrClass[j];
                var reg = new RegExp('(^|\\s+)' + curClass + '(\\s+|$)')
                if (!reg.test(curTag.className)) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                arr.push(curTag);
            }
        }
        return arr;
    }

    /**
     * 判断是否有class名
     * @param curEle
     * @param strClass 单个className
     * @returns {boolean}
     */
    function hasClass(curEle, strClass) {
        var reg = new RegExp('(^|\\s+)' + strClass + '(\\s+|$)')
        return reg.test(curEle.className)
    }

    /**
     * 添加className 支持添加多个
     * @param curEle
     * @param strClass
     */
    function addClass(curEle, strClass) {
        var arrClass = strClass.replace(/^\s+|\s+$/, '').split(/\s+/);
        for (var i = 0; i < arrClass.length; i++) {
            if (!utils.hasClass(curEle, arrClass[i])) {
                curEle.className += ' ' + arrClass[i];
            }
        }
    }

    /**
     * remove className 支持删除多个
     * @param curEle
     * @param strClass
     */
    function removeClass(curEle, strClass) {
        var arrClass = strClass.replace(/^\s+|\s+$/, '').split(/\s+/);
        for (var i = 0; i < arrClass.length; i++) {
            var reg = new RegExp('(^|\\s+)' + arrClass[i] + '(\\s+|$)');
            if (utils.hasClass(curEle, arrClass[i])) {
                curEle.className = curEle.className.replace(reg, ' ');
            }
        }
    }

    /**
     * 设置或者获取浏览器窗口的一些数据
     * @param attr
     * @param val
     * @returns {*}
     */
    function win(attr, val) {
        if (val == null) {
            return document.documentElement[attr] || document.body[attr];
        }
        document.documentElement[attr] = document.body[attr] = val;
    }

    /**
     *  curEle 到 body的距离
     * @param curEle
     * @returns {{left: (number|Number), top: (number|Number)}}
     */
    function offset(curEle) {
        var oParent = curEle.offsetParent;
        var l = curEle.offsetLeft;
        var t = curEle.offsetTop;
        while (oParent) {
            if (window.navigator.userAgent.indexOf('IE 8') == -1) {
                l += oParent.clientLeft;
                t += oParent.clientTop;
            }
            l += oParent.offsetLeft;
            t += oParent.offsetTop;
            oParent = oParent.offsetParent;
        }
        return {
            left: l,
            top: t
        }
    }

    /**
     * 获取子元素 支持筛选标签
     * @param curEle
     * @param tagName
     * @returns {Array}
     */
    function getChildren(curEle, tagName) {
        var childs = curEle.childNodes;
        var arr = [];
        for (var i = 0; i < childs.length; i++) {
            var cur = childs[i];
            if (cur.nodeType == 1) {
                if (tagName) {
                    if (tagName.toUpperCase() == cur.nodeName.toUpperCase()) {
                        arr.push(cur);
                    }
                } else {
                    arr.push(cur);
                }
            }
        }
        return arr;
    }

    /**
     * 获取哥哥元素
     * @param curEle
     * @returns {*}
     */
    function prev(curEle) {
        if (curEle.previousElementSibling) {
            return curEle.previousElementSibling;
        }
        var prev = curEle.previousSibling;
        while (prev && prev.nodeType !== 1) {
            prev = prev.previousSibling;
        }
        return prev;
    }

    /**
     * 获取弟弟元素
     * @param curEle
     * @returns {*}
     */
    function next(curEle) {
        if (curEle.nextElementSibling) {
            return curEle.nextElementSibling;
        }
        var next = curEle.nextSibling;
        while (next && next.nodeType !== 1) {
            next = next.nextSibling;
        }
        return next;
    }

    /**
     * 获取相邻元素
     * @param curEle
     * @returns {Array}
     */
    function sibling(curEle) {
        var arr = []
        var prev = this.prev(curEle);
        var next = this.next(curEle)
        if (prev)arr.push(prev)
        if (next)arr.push(next)
        return arr;
    }

    /**
     * 获取所有哥哥元素
     * @param curEle
     * @returns {Array}
     */
    function prevAll(curEle) {
        var prev = this.prev(curEle);
        var arr = [];
        while (prev) {
            arr.push(prev)
            prev = this.prev(prev);
        }
        return arr;
    }

    /**
     * 获取所有弟弟元素
     * @param curEle
     * @returns {Array}
     */
    function nextAll(curEle) {
        var next = this.next(curEle)
        var arr = [];
        while (next) {
            arr.push(next);
            next = this.next(next);
        }
        return arr;
    }

    /**获取所有相邻元素
     *
     * @param curEle
     * @returns {*}
     */
    function siblings(curEle) {
        var prevAll = this.prevAll(curEle);
        var nextAll = this.nextAll(curEle);
        return prevAll.concat(nextAll)
    }

    /**
     * 获取第一个子元素
     * @param curEle
     * @returns {*}
     */
    function firstChild(curEle) {
        var childs = this.getChildren(curEle);
        return childs[0]
    }

    /**
     * 获取最后一个子元素
     * @param curEle
     * @returns {*}
     */
    function lastChild(curEle) {
        var childs = this.getChildren(curEle);
        return childs[childs.length - 1]
    }

    /**获取当前元素的索引
     *
     * @param curEle
     * @returns {*}
     */
    function index(curEle) {
        return this.prevAll(curEle).length;
    }

    /**
     * 末尾添加元素
     * @param curEle
     * @param oParent
     */
    function appendChild(curEle, oParent) {
        oParent.appendChild(curEle);
    }

    /**
     * 开头添加元素
     * @param curEle
     * @param oParent
     */
    function prependChild(curEle, oParent) {
        var first = this.first(curEle);
        if (first) {
            oParent.insertBefore(curEle, first);
        } else {
            oParent.appendChild(curEle)
        }
    }

    /**
     * 插入-前边
     * @param curEle
     * @param oldEle
     */
    function insertBefore(curEle, oldEle) {
        oldEle.parentNode.insertBefore(curEle, oldEle);
    }

    /**
     * 插入-后边
     * @param curEle
     * @param oldEle
     */
    function insertAfter(curEle, oldEle) {
        var next = this.next(oldEle);
        if (next) {
            oldEle.parentNode.insertBefore(curEle, next);
        } else {
            oldEle.parentNode.appendChild(curEle)
        }
    }


    /**
     * 解析url地址中？后边传递的参数以键值对形式输出
     * @param str url
     * @returns {{}}
     */
    function queryURLParameter(str) {
        var obj = {};
        var reg = /([^?=&#]+)=([^?=&#]+)/ig;
        str.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        })
        return obj;
    }


    /**
     * ajax的封装
     */
    function ajax() {
    }

    /**
     * jsonp的封装
     */
    function jsonp() {
    }

    /**
     * 判断数据类型
     * @param {*} data 待判断的数据
     * @param {string} type 类型
     */
    function isType(data, type) {
        return Object.prototype.toString.call(data) === '[object ' + type + ']';

    }
    /**
     * 把键值对形式的转化为 key1=val1&key2=val2 形式
     */
    function paramsSerialize() {
            // 判断data是否为字符串
            if (utils.isType(data, 'String')) {
                return data;
            }
            // 如果data为null或者undefined
            if (data === null || data === undefined) {
                return '';
            }
            // 如果data为对象
            // {a:1,b:2}
            if (utils.isType(data, 'Object')) {
                var arr = [];
                for (var name in data) {
                    if (!data.hasOwnProperty(name)) continue;
                    // 因为URL中不能存在非英文字符，所以需要格式化为URIString格式
                    arr.push(encodeURIComponent(name)
                        + '='
                        + encodeURIComponent(data[name]));
                }
                // ['a=1','b=2'] 使用 & 来join
                return arr.join('&');
            }
            return String(data);
    }

    /**
     * 字符串拼接到url后边
     * @param url
     * @param string
     */
    function appendToURL(url, string) {
            // 先将用户传过来的参数格式化一下
        string = utils.param(padStirng);
            // 判断url中是否含有？，如有？说明URL中已存在请求参数，
            // 否则，不存请求参数
            var hasQuery = /\?/.test(url);
            // 有问号，再往后拼接参数，应该使用&
            // a.com?a=1&b=2
            // a.com?c=3
            return url + (hasQuery ? '&' : '?') + string;
    }

    return {
        $: $,
        makeArray: makeArray,
        jsonParse: jsonParse,
        getRandom: getRandom,
        getCss: getCss,
        setCss: setCss,
        setGroupCss: setGroupCss,
        css: css,
        getByClass: getByClass,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        win: win,
        offset: offset,
        getChildren: getChildren,
        prev: prev,
        next: next,
        sibling: sibling,
        prevAll: prevAll,
        nextAll: nextAll,
        siblings: siblings,
        firstChild: firstChild,
        lastChild: lastChild,
        index: index,
        appendChild: appendChild,
        prependChild: prependChild,
        insertBefore: insertBefore,
        insertAfter: insertAfter

    }
})();
