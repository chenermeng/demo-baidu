/**
 * Created by chenmeng on 2016/11/29.
 */

/**
 * 百度搜索框模块
 *
 */
(function(){
    var oBox = utils.$('search-wrap')
    var oTxt = utils.$('form-text')
    var oBtn = utils.$('form-btn')
    var oUl = oBox.getElementsByTagName('ul')[0];
    var aLi = oUl.getElementsByTagName('li');
    var aA = oUl.getElementsByTagName('a');
    var oldValue = null;
    var newValue = null;
    var data = null;
    /*var arrData = [];*/
    var n = -1;
    var isKey=false;
    oTxt.onkeyup = oTxt.onfocus = function(e){
        e = e || window.event;
        if(oTxt.value.length){
            oUl.style.display = 'block';
          //  newValue = oTxt.value;
            getData(oTxt.value);
           /*if(arrData){
               var flag= arrData.every(function(item){
                    return newValue != item;
                })
               if(flag){
                   arrData = [];
                   getData(newValue)
                   n=-1;
               }
           }else{
               getData(newValue);
               n = -1;
           }*/
        } else {
            oUl.style.display = 'none'
        }
    }
    oTxt.onkeydown = function(e){
        e = e || window.event;
        if(e.keyCode == 40){
            if(n >= aA.length - 1){
                n = -2;
            }
            n++;
            listShow();
        } else if(e.keyCode == 38){
            if(n <= -1){
                n = aA.length;
            }
            n--;
            listShow();
        }

        if(e.keyCode==37||e.keyCode==38||e.keyCode==39||e.keyCode==40 ||e.keyCode==13  ){
            isKey = true;
        }else{
            isKey = false;
        }

    }
    //键盘上下按键
    function listShow(){
        for(var i=0;i<aA.length;i++){
            aA[i].style.background = null;
        }
        if(!oldValue){
            oldValue = oTxt.value;
        }
        if(n == -1){
            oTxt.value = oldValue;
        }else {
            aA[n].style.background = '#ccc';
            oTxt.value = aA[n].innerHTML;
        }
    }
    //禁止冒泡
    oTxt.onclick = function(e){
        e = e || window.event;
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    }
    //事件委托
    document.body.onclick = function(e){
        e = e || window.event;
        n=-1;/*初始化n的值*/
        var target = e.target || e.srcElement;
        if(target == oBtn){
            search();
        }
        if(target.tagName.toLowerCase() == 'a'){
            oTxt.value = target.innerHTML;
            oUl.style.display = 'none';
        }
        if(target != oBtn || target != oTxt){
            oUl.style.display = 'none';
            for(var i=0;i<aA.length;i++){
                aA[i].style.background = null;
            }
        }
    }
    //点击搜索
    function search(){
        var str = 'https://www.baidu.com/s?&wd=' + oTxt.value;
        window.open(str, '_blank');
    }
    //获取数据
    function getData(str){
       // isKey = true;
        if(isKey)return;//防止多次加载数据
        //防止多次添加script标签
        var oS = document.getElementsByClassName('getData')[0];
        if(oS){
            oS.parentNode.removeChild(oS)
        }
        var oScript = document.createElement('script');
        oScript.className = 'getData';
        oScript.src = 'http://suggestion.baidu.com/su?wd=' + str + '&cb=myCallback';
        document.body.appendChild(oScript);
    }
    //回调函数 数据插入页面
    window.myCallback = function(data){
        data = data.s;
        if(!data) return;
        var oUl = utils.$('search-wrap').getElementsByTagName('ul')[0];
        var str = ''
        data.forEach(function(item, index, data){
            /* if(index >= 4)return;*/
            str += '<li><a href="javascript:;">' + item + '</a></li>'
           // arrData.push(item);
        })
        oUl.innerHTML = str;
        n = -1;/*初始化n的数值*/
        /*初始化oldvalue*/
        oldValue = null;
    }
})();