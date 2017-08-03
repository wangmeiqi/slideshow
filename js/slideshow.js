
//构造函数模式
function Banner(id, opt) {
  this.opt=opt||{};
  this.container=document.getElementById(id);
  this.boxInner=this.container.getElementsByTagName('div')[0];
  //console.log(this.boxInner);
  this.aImg=this.boxInner.getElementsByTagName('img');
  this.oUl=this.container.getElementsByTagName('ul')[0];
  this.aLi=this.oUl.getElementsByTagName('li');
  this.btnLeft=this.container.getElementsByTagName('a')[0];
  this.btnRight=this.container.getElementsByTagName('a')[1];
  this.data=null;
  this.timer=null;
  this.n=0;
  this.url=this.opt.url||'json/data.txt';
  this.interval=this.opt.interval||2000;
  this.init();
}
Banner.prototype={
  constructor:Banner,
  init:function () {
    var me =this;
    //获取解析数据
    this.getData();
    //console.log(this.data);
    //绑定数据
    this.bind();
    //图片自动轮播
    clearInterval(this.timer);
    this.timer=setInterval(function () {
      me.autoMove();
    },1800);
    //鼠标移入移出
    this.overout();
    //按钮手动切换
    this.handleChange();
    //左右箭头切换
    this.leftRight();
  },
  //获取解析数据
  getData:function getData() {
    var me=this;
    var xml=new XMLHttpRequest;
    xml.open('get','json/data.txt?='+Math.random(),false);
    xml.onreadystatechange=function () {
      if(xml.readyState===4 && /^2\d{2}$/.test(xml.status)){
        me.data=JSON.parse(xml.responseText);
      }
    };
    xml.send();
  },

  //绑定数据
  bind:function bind() {
    var strImg='';//图片字符串
    var strLi='';//按钮字符串
    for(var i=0;i<this.data.length;i++){
      strImg+='<img src="'+this.data[i].imgSrc+'" alt=""/>';
      strLi+=i==0?'<li class="on"></li>':'<li></li>';
    }
    strImg+='<img src="'+this.data[0].imgSrc+'" alt=""/>';//多拼接一张图片
    this.boxInner.innerHTML=strImg;
    this.boxInner.style.width=this.aImg.length*this.aImg[0].offsetWidth+'px';//盒子的宽度增加
    this.oUl.innerHTML=strLi;
  },

  //图片自动轮播
  autoMove:function autoMove() {
    if(this.n>=this.aImg.length-1){
      this.n=0;
      this.boxInner.style['left']=-this.n*1000+ 'px';
    };
    this.n++;
    //console.log(this.n);
    this.boxInner.style['left']=-this.n*1000 + 'px';
    this.boxInner.style['transition-duration']=1000+'ms';
    this.boxInner.style['transition-property']='left';

    //console.log(this.boxInner.style.left);
    this.bannerTip();
  },
  //按钮切换
  bannerTip:function bannerTip() {
    var tmp=this.n>=this.aLi.length?0:this.n;
    for(var i=0;i<this.aLi.length;i++){
      this.aLi[i].className=tmp==i?'on':'';
    }
  },
  //鼠标移入移出
  overout:function overout() {
    var me=this;
    me.container.onmousemove=function () {
      clearInterval(me.timer);
      me.btnLeft.style.display=me.btnRight.style.display='block';
    };
    me.container.onmouseout=function () {
      me.timer=setInterval(function () {
        me.autoMove();
      },me.interval);
      me.btnLeft.style.display=me.btnRight.style.display='none';
    }
  },
  //按钮手动切换
  handleChange:function handleChange () {
    var me=this;
    for(var i=0;i<this.aLi.length;i++){
      me.aLi[i].index=i;
      me.aLi[i].onclick=function () {
        me.n=this.index;
        me.boxInner.style['left']=-me.n*1000 + 'px';
        me.bannerTip()
      }
    }
  },
  //左右箭头切换
  leftRight:function leftRight() {
    var me=this;
    this.btnLeft.onclick=function () {
      if(me.n<=0){
        me.n=me.aImg.length-1;
        me.boxInner.style['left']=-me.n*1000 + 'px';
      }
      me.n--;
      me.boxInner.style['left']=-me.n*1000 + 'px';
      me.bannerTip();
    };
    this.btnRight.onclick=function () {
      me.autoMove();
    }
  }
};