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
    var flag = true;
    var data = null;
    /*设置开关 键盘事件不加载数据*/
    var n = -1;

    oTxt.onkeyup = oTxt.onfocus = function(e){
        e = e || window.event;
        if(oTxt.value.length){
            oUl.style.display = 'block';
            getData(oTxt.value);
            /*if(oTxt.value!=prevStr){
             var str = oTxt.value;
             }
             var prevStr = oTxt.value;
             getData(str)
             var arr = utils.makeArray(aA);
             console.log(typeof str)
             if(arr&&arr.length){
             flag = arr.every(function(item,index,arr){
             return str !=item.innerHTML
             })
             prevStr = str;
             }
             //  console.log(flag)
             if(flag){
             flag = false;
             getData(str);
             }*/
        } else {
            oUl.style.display = 'none'
        }
    }
  /*  oTxt.onkeydown = function(e){
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

    }
    //键盘上下按键
    function listShow(){
        for(var i=0;i<aA.length;i++){
            aA[i].style.background = null;
        }
        if(!oldValue){
            oldValue = oTxt.value;
        }
        console.log(n)
        if(n == -1){
            oTxt.value = oldValue;
        }else {
            aA[n].style.background = '#ccc';
            oTxt.value = aA[n].innerHTML;
        }
    }*/

    //禁止冒泡
    oTxt.onclick = function(e){
        e = e || window.event;
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    }
    //事件委托
    document.body.onclick = function(e){
        e = e || window.event;
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
        }
    }
    //点击搜索
    function search(){
        var str = 'https://www.baidu.com/s?&wd=' + oTxt.value;
        window.open(str, '_blank');
    }

    //获取数据
    function getData(str){
        //防止多次添加script标签
        //flag = false;
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
        // if(a){}
        data = data.s;
        var oUl = utils.$('search-wrap').getElementsByTagName('ul')[0];
        var str = ''
        data.forEach(function(item, index, data){
            /* if(index >= 4)return;*/
            str += '<li><a href="javascript:;">' + item + '</a></li>'
        })
        oUl.innerHTML = str;
    }
})();