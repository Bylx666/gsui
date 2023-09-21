(()=> {
  // dom
  function $(t) {this._=t;}
  $.prototype = {
    c(d){d.append(this._);return this;},
    s(d){this._.className=d;return this;},
    t(d){this._.style.cssText=d;return this;},
    a(d,e){this._.setAttribute(d,e);return this;},
    h(d){this._.innerHTML=d;return this;}
  };
  var c = (t)=> new $(document.createElement(t));

  // GSUI
  var G = {};
  const S2 = Math.sqrt(2);


  // === progress ===
  G.progress = function() {
    var d = c("canvas").s("gs-progress")._; // canvas
    var ct = d.getContext("2d"); // content
    var mid = 0; // middle of height
    var hid = 0; // height
    var wid = 0; // width
    var barShow = false;
    var value = 0;

    function dp(path, dx) {
      ct.beginPath();
      for(let i=0; i<path.length; i+=2) ct.lineTo(path[i]+(dx?dx:0), path[i+1]);
      ct.closePath();
      ct.fill();
    }

    // progressbar render
    function bar() {
      if(!barShow) return 0;
      var p1 = 2.5*mid;
      var p2 = 3.6*mid; // 2nd point x
      ct.fillStyle = "#544";
      dp([p1,mid, p2,0, wid-p2,0, wid-p1,mid, wid-p2,hid, p2,hid]);
      ct.fillStyle = "#fff";
      ct.globalCompositeOperation = "source-atop";
      var vl = p1+(wid-2*p1)*value;
      dp([p1,0, vl,0, vl,hid, p1,hid]);
      ct.globalCompositeOperation = "source-over";
    }

    // start anime
    var startT = 0; // start time
    var frameid = 0;
    var isEnding = false;
    function start() {
      var t = Date.now() - startT;
      if(isEnding) t = 400 - t;
      ct.globalAlpha = 1;
      if(t<0) ct.clearRect(0,0,wid,hid);
      if(t>400||t<0) return cancelAnimationFrame(frameid);

      ct.clearRect(0,0,wid,hid);
      var path = [0,mid, mid*0.9,mid*0.1, mid*1.8,mid, mid*0.9,mid*1.8];
      var dx = (1-(
        t>240?336+0.4*(t-240):1.4*t
      )/400)/2*wid;
      ct.fillStyle = "#fff";
      dp(path, dx);
      dp(path, wid-dx-mid*1.8);
      if(t>240) {
        barShow = true;
        ct.globalAlpha = (t-240)/160;
        bar();
      }
      requestAnimationFrame(start);
    }
    d.start = ()=> {
      wid = d.width = d.clientWidth;
      hid = d.height = d.clientHeight;
      mid = 0 | d.height / 2;
      barShow = false;
      isEnding = false;
      // start dom anime
      var pos = d.getBoundingClientRect();
      var dom = c("div").s("gs-progress").c(document.body)
        .h("<a></a><b style='outline-width:"+mid/2+"px'></b>")
        .t(`height:${mid}px;width:${mid}px;left:${pos.left+(wid-mid)/2}px;top:${pos.top+mid/2}px`);
      // remove dom and start canvas
      setTimeout(()=>{
        dom._.remove();
        startT = Date.now();
        frameid = requestAnimationFrame(start);
      },300);
    };
    d.end = ()=> {
      startT = Date.now();
      isEnding = true;
      frameid = requestAnimationFrame(start);
    };

    Object.defineProperty(d, "value", {get:()=>value, set(v) {
      value = v;
      bar();
    }})
    return d;
  }


  // ==== button ====
  G.button = (text)=> {
    var d = c("div").s("gs-button").h(`<o></o><t>${text}</t>`)._;
    return d;
  };

  window.GSUI = G;
})();