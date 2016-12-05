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

    function appendChild(){}

    function prependChild(){}

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
(function(){
    var cm = {
        //匀速
        Linear : function(t, b, c, d){
            return c * t / d + b;
        },
        //指数衰减的反弹缓动
        Bounce : {
            easeIn : function(t, b, c, d){
                return c - cm.Bounce.easeOut(d - t, 0, c, d) + b;
            },
            easeOut : function(t, b, c, d){
                if((t /= d) < (1 / 2.75)){
                    return c * (7.5625 * t * t) + b;
                } else if(t < (2 / 2.75)){
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                } else if(t < (2.5 / 2.75)){
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                } else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                }
            },
            easeInOut : function(t, b, c, d){
                if(t < d / 2){
                    return cm.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
                }
                return cm.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
            }
        },
        //二次方的缓动
        Quad : {
            easeIn : function(t, b, c, d){
                return c * (t /= d) * t + b;
            },
            easeOut : function(t, b, c, d){
                return -c * (t /= d) * (t - 2) + b;
            },
            easeInOut : function(t, b, c, d){
                if((t /= d / 2) < 1){
                    return c / 2 * t * t + b;
                }
                return -c / 2 * ((--t) * (t - 2) - 1) + b;
            }
        },
        //三次方的缓动
        Cubic : {
            easeIn : function(t, b, c, d){
                return c * (t /= d) * t * t + b;
            },
            easeOut : function(t, b, c, d){
                return c * ((t = t / d - 1) * t * t + 1) + b;
            },
            easeInOut : function(t, b, c, d){
                if((t /= d / 2) < 1){
                    return c / 2 * t * t * t + b;
                }
                return c / 2 * ((t -= 2) * t * t + 2) + b;
            }
        },
        //四次方的缓动
        Quart : {
            easeIn : function(t, b, c, d){
                return c * (t /= d) * t * t * t + b;
            },
            easeOut : function(t, b, c, d){
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            },
            easeInOut : function(t, b, c, d){
                if((t /= d / 2) < 1){
                    return c / 2 * t * t * t * t + b;
                }
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            }
        },
        //五次方的缓动
        Quint : {
            easeIn : function(t, b, c, d){
                return c * (t /= d) * t * t * t * t + b;
            },
            easeOut : function(t, b, c, d){
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            },
            easeInOut : function(t, b, c, d){
                if((t /= d / 2) < 1){
                    return c / 2 * t * t * t * t * t + b;
                }
                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
            }
        },
        //正弦曲线的缓动
        Sine : {
            easeIn : function(t, b, c, d){
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            },
            easeOut : function(t, b, c, d){
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
            },
            easeInOut : function(t, b, c, d){
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
            }
        },
        //指数曲线的缓动
        Expo : {
            easeIn : function(t, b, c, d){
                return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
            },
            easeOut : function(t, b, c, d){
                return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
            },
            easeInOut : function(t, b, c, d){
                if(t == 0) return b;
                if(t == d) return b + c;
                if((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
            }
        },
        //圆形曲线的缓动
        Circ : {
            easeIn : function(t, b, c, d){
                return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
            },
            easeOut : function(t, b, c, d){
                return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
            },
            easeInOut : function(t, b, c, d){
                if((t /= d / 2) < 1){
                    return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                }
                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
            }
        },
        //超过范围的三次方缓动
        Back : {
            easeIn : function(t, b, c, d, s){
                if(s == undefined) s = 1.70158;
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
            },
            easeOut : function(t, b, c, d, s){
                if(s == undefined) s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },
            easeInOut : function(t, b, c, d, s){
                if(s == undefined) s = 1.70158;
                if((t /= d / 2) < 1){
                    return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                }
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
            }
        },
        //指数衰减的正弦曲线缓动
        Elastic : {
            easeIn : function(t, b, c, d, a, p){
                if(t == 0) return b;
                if((t /= d) == 1) return b + c;
                if(!p) p = d * .3;
                var s;
                !a || a < Math.abs(c) ? (a = c, s = p / 4) : s = p / (2 * Math.PI) * Math.asin(c / a);
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            },
            easeOut : function(t, b, c, d, a, p){
                if(t == 0) return b;
                if((t /= d) == 1) return b + c;
                if(!p) p = d * .3;
                var s;
                !a || a < Math.abs(c) ? (a = c, s = p / 4) : s = p / (2 * Math.PI) * Math.asin(c / a);
                return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
            },
            easeInOut : function(t, b, c, d, a, p){
                if(t == 0) return b;
                if((t /= d / 2) == 2) return b + c;
                if(!p) p = d * (.3 * 1.5);
                var s;
                !a || a < Math.abs(c) ? (a = c, s = p / 4) : s = p / (2 * Math.PI) * Math.asin(c / a);
                if(t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
            }
        }
    };

    function myMove(opt){
        /**
         * 30种运动形式
        ["Linear","Bounce-easeIn","Bounce-easeOut","Bounce-easeInOut","Quad-easeIn","Quad-easeOut","Quad-easeInOut","Cubic-easeIn","Cubic-easeOut","Cubic-easeInOut","Quart-easeIn","Quart-easeOut","Quart-easeInOut","Quint-easeIn","Quint-easeOut","Quint-easeInOut","Sine-easeIn","Sine-easeOut","Sine-easeInOut","Expo-easeIn","Expo-easeOut","Expo-easeInOut","Circ-easeIn","Circ-easeOut","Circ-easeInOut","Back-easeIn","Back-easeOut","Back-easeInOut","Elastic-easeIn","Elastic-easeOut","Elastic-easeInOut"];
         */
        //其中的几种运动形式
        var arr = ["Linear", "Elastic-easeOut", "Back-easeOut", "Bounce-easeOut", "Expo-easeIn", "Sine-easeInOut", "Circ-easeIn", "Quad-easeIn"];

    }
    window.myMove = myMove;
})();


