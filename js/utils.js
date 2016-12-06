/**
 * Created by chenmeng on 2016/12/6.
 */
/**
 * Created by chenmeng on 2016/11/29.
 */

//utils为一些常用的方法
var utils = (function(){

    /**
     * 通过id命获取元素 注意不用传#
     * @param id
     * @returns {Element}
     */
    function $(id){
        return document.getElementById(id);
    }

    /**
     * json字符串转换
     * @param str
     * @returns {Object}
     */
    function jsonParse(str){
        return 'JSON' in window ? JSON.parse(str) : eval('(' + str + ')');
    }

    /*
     * 类数组转数组
     * @param likeArray
     * @returns Array;
     */

    function makeArray(likeArray){
        try{
            return Array.prototype.slice.call(likeArray);
        } catch (e) {
            var arr = [];
            for(var i = 0; i < likeArray.length; i++){
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
    function getRandom(m, n){
        m = Number(m)
        n = Number(n);
        if(isNaN(m) || isNaN(n)){
            return Math.random();
        }
        if(m > n){
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
    function getCss(curEle, attr){
        var val = null;
        if('getComputedStyle' in window){
            val = getComputedStyle(curEle, false)[attr];
        } else {
            if(attr == 'opacity'){
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
    function setCss(curEle, attr, val){
        if(attr == 'float'){
            curEle.style.cssFloat = val;
            curEle.style.styleFloat = val;
            return;
            ``
        }
        if(attr == 'opacity'){
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
    function setGroupCss(curEle, opt){
        if({}.toString.call(opt) !== '[object Object]')return;
        for(var attr in opt){
            this.setCss(curEle, attr, opt[attr]);
        }
    }

    /**
     * 设置或者获取css样式
     * @param curEle
     * @returns {*}
     */

    function css(curEle){
        var secondParam = arguments[1];
        var thirdParam = arguments[2];
        if(typeof secondParam == 'string'){
            if(thirdParam == null){
                return this.getCss(curEle, secondParam)
            }
            this.setCss(curEle, secondParam, thirdParam)
        }
        if({}.toString.call(secondParam) === '[object Object]'){
            this.setGroupCss(curEle, secondParam)
        }
    }

    /**
     * 通过class名字获取元素标签
     * @param strClass  class名 支持多个 用空格隔开
     * @param context 指定上下文
     * @returns {*}
     */
    function getByClass(strClass, context){
        context = context || document;
        if(document.getElementsByClassName){
            return context.getElementsByClassName(strClass);
        }
        var arr = [];
        var arrClass = strClass.replace(/^\s+|\s+$/, '').split(/\s+/);
        var tags = context.getElementsByTagName('*');
        for(var i = 0; i < tags.length; i++){
            var curTag = tags[i];
            var flag = true;
            for(var j = 0; j < arrClass.length; j++){
                var curClass = arrClass[j];
                var reg = new RegExp('(^|\\s+)' + curClass + '(\\s+|$)')
                if(!reg.test(curTag.className)){
                    flag = false;
                    break;
                }
            }
            if(flag){
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
    function hasClass(curEle, strClass){
        var reg = new RegExp('(^|\\s+)' + strClass + '(\\s+|$)')
        return reg.test(curEle.className)
    }

    /**
     * 添加className 支持添加多个
     * @param curEle
     * @param strClass
     */
    function addClass(curEle, strClass){
        var arrClass = strClass.replace(/^\s+|\s+$/, '').split(/\s+/);
        for(var i = 0; i < arrClass.length; i++){
            if(!utils.hasClass(curEle, arrClass[i])){
                curEle.className += ' ' + arrClass[i];
            }
        }
    }

    /**
     * remove className 支持删除多个
     * @param curEle
     * @param strClass
     */
    function removeClass(curEle, strClass){
        var arrClass = strClass.replace(/^\s+|\s+$/, '').split(/\s+/);
        for(var i = 0; i < arrClass.length; i++){
            var reg = new RegExp('(^|\\s+)' + arrClass[i] + '(\\s+|$)');
            if(utils.hasClass(curEle, arrClass[i])){
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
    function win(attr, val){
        if(val == null){
            return document.documentElement[attr] || document.body[attr];
        }
        document.documentElement[attr] = document.body[attr] = val;
    }

    /**
     *  curEle 到 body的距离
     * @param curEle
     * @returns {{left: (number|Number), top: (number|Number)}}
     */
    function offset(curEle){
        var oParent = curEle.offsetParent;
        var l = curEle.offsetLeft;
        var t = curEle.offsetTop;
        while(oParent){
            if(window.navigator.userAgent.indexOf('IE 8') == -1){
                l += oParent.clientLeft;
                t += oParent.clientTop;
            }
            l += oParent.offsetLeft;
            t += oParent.offsetTop;
            oParent = oParent.offsetParent;
        }
        return {
            left : l,
            top : t
        }
    }

    function getChildren(){}

    function prev(){}

    function next(){}

    function sibling(){}

    function prevAll(){}

    function nextAll(){}

    function siblings(){}

    function firstChild(){}

    function lastChild(){}

    function index(){}

    function appendChild(curEle,oParent){
        oParent.appendChild(curEle);
    }

    function prependChild(curEle,oParent){
        var first = this.first(curEle);
        if(first){
            oParent.insertBefore(curEle,first);
        }else{
            oParent.appendChild(curEle)
        }
    }

    function insertBefore(){}

    function insertAfter(){}

    return {
        $ : $,
        makeArray : makeArray,
        jsonParse : jsonParse,
        getRandom : getRandom,
        getCss : getCss,
        setCss : setCss,
        setGroupCss : setGroupCss,
        css : css,
        getByClass : getByClass,
        hasClass : hasClass,
        addClass : addClass,
        removeClass : removeClass,
        win : win,
        offset : offset,
        getChildren : getChildren,
        prev : prev,
        next : next,
        sibling : sibling,
        prevAll : prevAll,
        nextAll : nextAll,
        siblings : siblings,
        firstChild : firstChild,
        lastChild : lastChild,
        index : index,
        appendChild : appendChild,
        prependChild : prependChild,
        insertBefore : insertBefore,
        insertAfter : insertAfter

    }
})();
