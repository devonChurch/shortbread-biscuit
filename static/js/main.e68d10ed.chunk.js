(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{132:function(e,t,n){e.exports=n(233)},233:function(e,t,n){"use strict";n.r(t);var a,r=n(1),i=n.n(r),o=n(7),l=n.n(o),c=(n(137),n(29)),u=n(128),s=n(85),f=n.n(s),m=n(36),p=n(114),d=n(115),g=n(116),h=n(129),w=n(117),b=n(130),v=n(118),B=n.n(v),E=n(119),j=n.n(E),D=n(12),x=n.n(D),y=n(205),O=n(214),k=n(238),T="#6200EA",C="#E53935",q="#00BFA5",A="#FF6D00",S="#2962FF",F="#001529",I="#f0f2f5",P="do MMMM YYYY",M=n(51);!function(e){e.position1="position1",e.position2="position2",e.position3="position3",e.position4="position4",e.position5="position5",e.position6="position6",e.bonusBall1="bonusBall1",e.bonusBall2="bonusBall2",e.powerBall="powerBall",e.drawNum="drawNum",e.drawDate="drawDate",e.drawTime="drawTime"}(a||(a={}));var Y=function(e,t){return new Array(t-e+1).fill(0).map(function(t,n){return e+n})},N=function(e){switch(!0){case e>=40:return T;case e>=30:return C;case e>=20:return q;case e>=10:return A;default:return S}},J=function(e,t,n,a){var r=new Array(n).fill(0).reduce(function(e,t,n){return Object(m.a)({},e,Object(M.a)({},"".concat(n+1),0))},{}),i=e.reduce(function(e,n){return t.reduce(function(e,t){var a=n[t];return Object(m.a)({},e,Object(M.a)({},a,e[a]+1))},e)},r);return Object.entries(i).sort(function(e,t){return Object(c.a)(e,2)[1]>Object(c.a)(t,2)[1]?-1:1}).map(function(e){var t=Object(c.a)(e,2),n=t[0];return[+n,+t[1],a(+n)]})},z=function(e){return e.map(function(e){var t=e[1],n=e[2],a=e[3],r=e[4],i=e[5],o=e[6],l=e.Draw,c=e["Bonus Ball"],u=e["2nd Bonus Ball"],s=e["Power Ball"],f=e["Draw Date"];return{position1:+t,position2:+n,position3:+a,position4:+r,position5:+i,position6:+o,bonusBall1:+c,bonusBall2:+u,powerBall:+s,drawNum:+l,drawDate:f,drawTime:new Date(f).getTime()}})},L=function(e,t,n){var r=function(e,t,n){return e.filter(function(e){var a=e.drawTime;return a>=t&&a<=n})}(e,t,n),i=a.position1,o=a.position2,l=a.position3,c=a.position4,u=a.position5,s=a.position6,f=a.bonusBall1,m=a.powerBall;return{data:[{title:"Most Frequent",frequencies:J(r,[i,i,o,l,c,u,s,f],40,N)},{title:"Position One",frequencies:J(r,[i],40,N)},{title:"Position Two",frequencies:J(r,[o],40,N)},{title:"Position Three",frequencies:J(r,[l],40,N)},{title:"Position Four",frequencies:J(r,[c],40,N)},{title:"Position Five",frequencies:J(r,[u],40,N)},{title:"Position Six",frequencies:J(r,[s],40,N)},{title:"Bonus Ball",frequencies:J(r,[f],40,N)},{title:"Power Ball",frequencies:J(r,[m],10,function(){return"blue"})}],jsonSlice:r,fromDate:t,toDate:n}},R=n(239),V=n(234),W=function(e){var t=e.ball,n=e.color,a=e.handleClick;return i.a.createElement(V.a,{color:n,style:{minWidth:"40px",textAlign:"center"},onClick:function(){return a(t)}},t)},G=[Y(1,9),Y(10,19),Y(20,29),Y(30,39),[40]],H=function(e){var t=e.handleToggle,n=e.checkIsActive;return i.a.createElement(R.a,{title:"Selection",style:{height:"100%"}},G.map(function(e){return i.a.createElement("div",{key:e.join(",")},e.map(function(e){return i.a.createElement("span",{key:e,style:{opacity:n(e)?1:.2,marginBottom:"8px",display:"inline-block"}},i.a.createElement(W,{style:{marginBottom:"8px"},ball:e,color:N(e),handleClick:function(){return t(e)}}))}))}))},K=n(237),Q=function(e){var t=e.fromDate,n=e.toDate,a=e.handleChange,o=e.currentDraws,l=e.totalDraws;return i.a.createElement(R.a,{title:"Time",style:{height:"100%"}},Boolean(t&&n)&&i.a.createElement(r.Fragment,null,i.a.createElement(K.a.RangePicker,{size:"large",defaultValue:[x()(new Date(t)),x()(new Date(n))],format:P,onChange:a}),i.a.createElement("h3",{style:{margin:"18px 0 0"}},"Showing ",i.a.createElement("strong",null,o)," from a possible"," ",i.a.createElement("strong",null,l)," draws.")))},U=function(e){var t=e.title,n=e.frequencies,a=e.handleToggle,r=e.checkIsActive;return i.a.createElement(R.a,{title:t},n.map(function(e){var t=Object(c.a)(e,3),n=t[0],o=t[1],l=t[2];return Boolean(n)&&i.a.createElement("div",{key:n,style:{opacity:r(n)?1:.2}},i.a.createElement(W,{ball:n,color:l,handleClick:function(){return a(n)}}),"x",o)}))},X=function(e){function t(){var e;return Object(d.a)(this,t),(e=Object(h.a)(this,Object(w.a)(t).call(this,{}))).state={data:[],currentBalls:[],fromDate:0,toDate:0,jsonAll:[],jsonSlice:[]},e.getData=Object(p.a)(f.a.mark(function t(){var n,a,r,i,o,l,c;return f.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,B()({method:"get",url:"/lotto-numbers.csv"});case 2:return n=t.sent,a=n.data,t.next=6,j()().fromString(a);case 6:r=t.sent,i=z(r),o=i,l=i.slice(-1)[0].drawTime,c=i[0].drawTime,e.setState(function(e){return Object(m.a)({},e,{jsonAll:o},L(o,l,c))});case 12:case"end":return t.stop()}},t,this)})),e.toggleCurrentBall=function(t){e.setState(function(e){var n=e.currentBalls,a=n.includes(t)?n.filter(function(e){return e!==t}):[].concat(Object(u.a)(n),[t]);return Object(m.a)({},e,{currentBalls:a})})},e.checkIsCurrentBall=function(t){var n=e.state.currentBalls,a=!n.length,r=n.includes(t);return a||r},e.updateFromToDates=function(t,n){var a=Object(c.a)(n,2),r=a[0],i=a[1],o=e.state.jsonAll,l=x()(r,P).valueOf(),u=x()(i,P).valueOf();e.setState(function(e){return Object(m.a)({},e,L(o,l,u))})},e.getData(),e}return Object(b.a)(t,e),Object(g.a)(t,[{key:"render",value:function(){var e=this,t=this.state,n=t.fromDate,a=t.toDate,r=t.jsonAll,o=t.jsonSlice;return i.a.createElement("div",null,i.a.createElement("div",{style:{background:F,padding:"8px 16px"}},i.a.createElement("h1",{style:{color:"white",margin:0}},"Lotto Settings"),i.a.createElement(y.a,{type:"flex",gutter:16},i.a.createElement(O.a,{span:24,xs:24,lg:24,xxl:12,style:{margin:"8px 0"}},i.a.createElement(H,{handleToggle:this.toggleCurrentBall,checkIsActive:this.checkIsCurrentBall})),i.a.createElement(O.a,{span:24,xs:24,lg:24,xxl:6,style:{margin:"8px 0"}},i.a.createElement(Q,{fromDate:n,toDate:a,handleChange:this.updateFromToDates,currentDraws:o.length,totalDraws:r.length})))),i.a.createElement("div",{style:{background:I,padding:"16px"}},i.a.createElement("h2",null,"Statistics"),i.a.createElement(k.a,{grid:{gutter:16,xs:2,md:4,xxl:8},dataSource:this.state.data,renderItem:function(t){var n=t.title,a=t.frequencies;return i.a.createElement(k.a.Item,null,i.a.createElement(U,{title:n,frequencies:a,handleToggle:e.toggleCurrentBall,checkIsActive:e.checkIsCurrentBall}))}})))}}]),t}(r.Component);l.a.render(i.a.createElement(X,null),document.getElementById("root"))}},[[132,2,1]]]);
//# sourceMappingURL=main.e68d10ed.chunk.js.map