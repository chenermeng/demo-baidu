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

    function getCss(curEle, attr){
        var val = null;
        if('getComputedStyle' in window){
            val = getComputedStyle(curEle, false)[attr];
        } else {
            if(attr == 'opacity'){
                val = curEle.currentStyle.opacity;
                var reg = /^alpha\(opacity[:=](\d+(\.\d+)?)\)$/; 
            }
        }

    }

    function setCss(){}

    function setGroupCss(){}

    function css(){}

    function getByClass(){}

    function hasClass(){}

    function addClass(){}

    function removeClass(){}

    function win(){}

    function offset(){}

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
})();