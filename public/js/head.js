/*! head.core - v1.0.2 */
(function(n,t){"use strict";function r(n){a[a.length]=n}function k(n){var t=new RegExp(" ?\\b"+n+"\\b");c.className=c.className.replace(t,"")}function p(n,t){for(var i=0,r=n.length;i<r;i++)t.call(n,n[i],i)}function tt(){var t,e,f,o;c.className=c.className.replace(/ (w-|eq-|gt-|gte-|lt-|lte-|portrait|no-portrait|landscape|no-landscape)\d+/g,""),t=n.innerWidth||c.clientWidth,e=n.outerWidth||n.screen.width,u.screen.innerWidth=t,u.screen.outerWidth=e,r("w-"+t),p(i.screens,function(n){t>n?(i.screensCss.gt&&r("gt-"+n),i.screensCss.gte&&r("gte-"+n)):t<n?(i.screensCss.lt&&r("lt-"+n),i.screensCss.lte&&r("lte-"+n)):t===n&&(i.screensCss.lte&&r("lte-"+n),i.screensCss.eq&&r("e-q"+n),i.screensCss.gte&&r("gte-"+n))}),f=n.innerHeight||c.clientHeight,o=n.outerHeight||n.screen.height,u.screen.innerHeight=f,u.screen.outerHeight=o,u.feature("portrait",f>t),u.feature("landscape",f<t)}function it(){n.clearTimeout(b),b=n.setTimeout(tt,50)}var y=n.document,rt=n.navigator,ut=n.location,c=y.documentElement,a=[],i={screens:[240,320,480,640,768,800,1024,1280,1440,1680,1920],screensCss:{gt:!0,gte:!1,lt:!0,lte:!1,eq:!1},browsers:[{ie:{min:6,max:11}}],browserCss:{gt:!0,gte:!1,lt:!0,lte:!1,eq:!0},html5:!0,page:"-page",section:"-section",head:"head"},v,u,s,w,o,h,l,d,f,g,nt,e,b;if(n.head_conf)for(v in n.head_conf)n.head_conf[v]!==t&&(i[v]=n.head_conf[v]);u=n[i.head]=function(){u.ready.apply(null,arguments)},u.feature=function(n,t,i){return n?(Object.prototype.toString.call(t)==="[object Function]"&&(t=t.call()),r((t?"":"no-")+n),u[n]=!!t,i||(k("no-"+n),k(n),u.feature()),u):(c.className+=" "+a.join(" "),a=[],u)},u.feature("js",!0),s=rt.userAgent.toLowerCase(),w=/mobile|android|kindle|silk|midp|phone|(windows .+arm|touch)/.test(s),u.feature("mobile",w,!0),u.feature("desktop",!w,!0),s=/(chrome|firefox)[ \/]([\w.]+)/.exec(s)||/(iphone|ipad|ipod)(?:.*version)?[ \/]([\w.]+)/.exec(s)||/(android)(?:.*version)?[ \/]([\w.]+)/.exec(s)||/(webkit|opera)(?:.*version)?[ \/]([\w.]+)/.exec(s)||/(msie) ([\w.]+)/.exec(s)||/(trident).+rv:(\w.)+/.exec(s)||[],o=s[1],h=parseFloat(s[2]);switch(o){case"msie":case"trident":o="ie",h=y.documentMode||h;break;case"firefox":o="ff";break;case"ipod":case"ipad":case"iphone":o="ios";break;case"webkit":o="safari"}for(u.browser={name:o,version:h},u.browser[o]=!0,l=0,d=i.browsers.length;l<d;l++)for(f in i.browsers[l])if(o===f)for(r(f),g=i.browsers[l][f].min,nt=i.browsers[l][f].max,e=g;e<=nt;e++)h>e?(i.browserCss.gt&&r("gt-"+f+e),i.browserCss.gte&&r("gte-"+f+e)):h<e?(i.browserCss.lt&&r("lt-"+f+e),i.browserCss.lte&&r("lte-"+f+e)):h===e&&(i.browserCss.lte&&r("lte-"+f+e),i.browserCss.eq&&r("eq-"+f+e),i.browserCss.gte&&r("gte-"+f+e));else r("no-"+f);r(o),r(o+parseInt(h,10)),i.html5&&o==="ie"&&h<9&&p("abbr|article|aside|audio|canvas|details|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|progress|section|summary|time|video".split("|"),function(n){y.createElement(n)}),p(ut.pathname.split("/"),function(n,u){if(this.length>2&&this[u+1]!==t)u&&r(this.slice(u,u+1).join("-").toLowerCase()+i.section);else{var f=n||"index",e=f.indexOf(".");e>0&&(f=f.substring(0,e)),c.id=f.toLowerCase()+i.page,u||r("root"+i.section)}}),u.screen={height:n.screen.height,width:n.screen.width},tt(),b=0,n.addEventListener?n.addEventListener("resize",it,!1):n.attachEvent("onresize",it)})(window);
/*! head.css3 - v1.0.0 */
(function(n,t){"use strict";function a(n){for(var r in n)if(i[n[r]]!==t)return!0;return!1}function r(n){var t=n.charAt(0).toUpperCase()+n.substr(1),i=(n+" "+c.join(t+" ")+t).split(" ");return!!a(i)}var h=n.document,o=h.createElement("i"),i=o.style,s=" -o- -moz- -ms- -webkit- -khtml- ".split(" "),c="Webkit Moz O ms Khtml".split(" "),l=n.head_conf&&n.head_conf.head||"head",u=n[l],e={gradient:function(){var n="background-image:";return i.cssText=(n+s.join("gradient(linear,left top,right bottom,from(#9f9),to(#fff));"+n)+s.join("linear-gradient(left top,#eee,#fff);"+n)).slice(0,-n.length),!!i.backgroundImage},rgba:function(){return i.cssText="background-color:rgba(0,0,0,0.5)",!!i.backgroundColor},opacity:function(){return o.style.opacity===""},textshadow:function(){return i.textShadow===""},multiplebgs:function(){i.cssText="background:url(https://),url(https://),red url(https://)";var n=(i.background||"").match(/url/g);return Object.prototype.toString.call(n)==="[object Array]"&&n.length===3},boxshadow:function(){return r("boxShadow")},borderimage:function(){return r("borderImage")},borderradius:function(){return r("borderRadius")},cssreflections:function(){return r("boxReflect")},csstransforms:function(){return r("transform")},csstransitions:function(){return r("transition")},touch:function(){return"ontouchstart"in n},retina:function(){return n.devicePixelRatio>1},fontface:function(){var t=u.browser.name,n=u.browser.version;switch(t){case"ie":return n>=9;case"chrome":return n>=13;case"ff":return n>=6;case"ios":return n>=5;case"android":return!1;case"webkit":return n>=5.1;case"opera":return n>=10;default:return!1}}},f;for(f in e)e[f]&&u.feature(f,e[f].call(),!0);u.feature()})(window);
/*! head.load - v1.0.1 */
(function(n,t){"use strict";function p(){}function u(n,t){if(n){typeof n=="object"&&(n=[].slice.call(n));for(var i=0,r=n.length;i<r;i++)t.call(n,n[i],i)}}function ut(n,i){var r=Object.prototype.toString.call(i).slice(8,-1);return i!==t&&i!==null&&r===n}function c(n){return ut("Function",n)}function w(n){return ut("Array",n)}function st(n){var i=n.split("/"),t=i[i.length-1],r=t.indexOf("?");return r!==-1?t.substring(0,r):t}function f(n){(n=n||p,n._done)||(n(),n._done=1)}function ht(n,t,r,u){var f=typeof n=="object"?n:{test:n,success:!t?!1:w(t)?t:[t],failure:!r?!1:w(r)?r:[r],callback:u||p},e=!!f.test;return e&&!!f.success?(f.success.push(f.callback),i.load.apply(null,f.success)):e||!f.failure?u():(f.failure.push(f.callback),i.load.apply(null,f.failure)),i}function l(n){var t={},i,r;if(typeof n=="object")for(i in n)!n[i]||(t={name:i,url:n[i]});else t={name:st(n),url:n};return(r=h[t.name],r&&r.url===t.url)?r:(h[t.name]=t,t)}function a(n){n=n||h;for(var t in n)if(n.hasOwnProperty(t)&&n[t].state!==y)return!1;return!0}function ct(n){n.state=ot,u(n.onpreload,function(n){n.call()})}function lt(n){n.state===t&&(n.state=it,n.onpreload=[],ft({url:n.url,type:"cache"},function(){ct(n)}))}function at(){var n=arguments,t=[].slice.call(n,1),r=t[0];return d?(r?(u(t,function(n){c(n)||!n||lt(l(n))}),b(l(n[0]),c(r)?r:function(){i.load.apply(null,t)})):b(l(n[0])),i):(nt.push(function(){i.load.apply(null,n)}),i)}function vt(){var n=arguments,t=n[n.length-1],r={};return(c(t)||(t=null),w(n[0]))?(n[0].push(t),i.load.apply(null,n[0]),i):(u(n,function(n){n!==t&&(n=l(n),r[n.name]=n)}),u(n,function(n){n!==t&&(n=l(n),b(n,function(){a(r)&&f(t)}))}),i)}function b(n,t){if(t=t||p,n.state===y){t();return}if(n.state===rt){i.ready(n.name,t);return}if(n.state===it){n.onpreload.push(function(){b(n,t)});return}n.state=rt,ft(n,function(){n.state=y,t(),u(s[n.name],function(n){f(n)}),o&&a()&&u(s.ALL,function(n){f(n)})})}function ft(t,i){function e(t){t=t||n.event,u.onload=u.onreadystatechange=u.onerror=null,i()}function o(t){t=t||n.event,(t.type==="load"||/loaded|complete/.test(u.readyState)&&(!r.documentMode||r.documentMode<9))&&(u.onload=u.onreadystatechange=u.onerror=null,i())}var u,f;i=i||p,/\.css[^\.]*$/.test(t.url)?(u=r.createElement("link"),u.type="text/"+(t.type||"css"),u.rel="stylesheet",u.href=t.url):(u=r.createElement("script"),u.type="text/"+(t.type||"javascript"),u.src=t.url),u.onload=u.onreadystatechange=o,u.onerror=e,u.async=!1,u.defer=!1,f=r.head||r.getElementsByTagName("head")[0],f.insertBefore(u,f.lastChild)}function yt(){for(var u=r.getElementsByTagName("script"),t,n=0,f=u.length;n<f;n++)if(t=u[n].getAttribute("data-headjs-load"),!!t){i.load(t);return}}function pt(n,t){var l,v,e;return n===r?(o?f(t):g.push(t),i):(c(n)&&(t=n,n="ALL"),w(n))?(l={},u(n,function(n){l[n]=h[n],i.ready(n,function(){a(l)&&f(t)})}),i):typeof n!="string"||!c(t)?i:(v=h[n],v&&v.state===y||n==="ALL"&&a()&&o)?(f(t),i):(e=s[n],e?e.push(t):e=s[n]=[t],i)}function e(){if(!r.body){n.clearTimeout(i.readyTimeout),i.readyTimeout=n.setTimeout(e,50);return}o||(o=!0,yt(),u(g,function(n){f(n)}))}function k(){r.addEventListener?(r.removeEventListener("DOMContentLoaded",k,!1),e()):r.readyState==="complete"&&(r.detachEvent("onreadystatechange",k),e())}var r=n.document,g=[],nt=[],s={},h={},et="async"in r.createElement("script")||"MozAppearance"in r.documentElement.style||n.opera,d,o,tt=n.head_conf&&n.head_conf.head||"head",i=n[tt]=n[tt]||function(){i.ready.apply(null,arguments)},it=1,ot=2,rt=3,y=4,v;if(r.readyState==="complete")e();else if(r.addEventListener)r.addEventListener("DOMContentLoaded",k,!1),n.addEventListener("load",e,!1);else{r.attachEvent("onreadystatechange",k),n.attachEvent("onload",e),v=!1;try{v=!n.frameElement&&r.documentElement}catch(bt){}v&&v.doScroll&&function wt(){if(!o){try{v.doScroll("left")}catch(t){n.clearTimeout(i.readyTimeout),i.readyTimeout=n.setTimeout(wt,50);return}e()}}()}i.load=i.js=et?vt:at,i.test=ht,i.ready=pt,i.ready(r,function(){d&&a()&&u(s.ALL,function(n){f(n)}),i.feature&&i.feature("domloaded",!0)}),setTimeout(function(){d=!0,u(nt,function(n){n()})},300)})(window);
//# sourceMappingURL=head.min.js.map