(this["webpackJsonpanimal-shogi"]=this["webpackJsonpanimal-shogi"]||[]).push([[0],[,,,,,,function(e,t,a){e.exports={colors:'"../../tokens/colors.css"',"board-border":"#ee607b",boardBorder:"Board_boardBorder__1M7He",board:"Board_board__1Y7VT Board_boardBorder__1M7He",boardRow:"Board_boardRow__5OjJn Board_boardBorder__1M7He",boardSquare:"Board_boardSquare__3MS44 Board_boardBorder__1M7He",label:"Board_label__2ed4V",rowLabel:"Board_rowLabel__1-Q5i Board_label__2ed4V",columnLabel:"Board_columnLabel__QmG0z Board_label__2ed4V",pieceContainer:"Board_pieceContainer__3b31e",capturedContainer:"Board_capturedContainer__3jCHn",skyCapturedContainer:"Board_skyCapturedContainer__1Hlzi Board_capturedContainer__3jCHn",landCapturedContainer:"Board_landCapturedContainer__4o-0y Board_capturedContainer__3jCHn",capturedPiece:"Board_capturedPiece__31yXv"}},function(e,t,a){e.exports={colors:'"../../tokens/colors.css"',fonts:'"../../tokens/fonts.css"',sky:"#a6def7",land:"#dde698",result:"bubblegum",background:"Result_background__1L6mz",container:"Result_container__1MMEc",landStar:"Result_landStar__-yK-w",skyStar:"Result_skyStar__2foCU",resultText:"Result_resultText__3AfAx",actionButtonContainer:"Result_actionButtonContainer__XMR4h",actionButton:"Result_actionButton__1Qn-h",landButton:"Result_landButton__1qSyk Result_actionButton__1Qn-h",skyButton:"Result_skyButton__Hv6ah Result_actionButton__1Qn-h"}},,,function(e,t,a){e.exports={colors:'"../../tokens/colors.css"',sky:"#a6def7","cloud-color":"#fff",container:"Sky_container__3_HNP",base:"Sky_base__3EDq8",path:"Sky_path__1Abky",cloud:"Sky_cloud__g4LYY",cloudLeft:"Sky_cloudLeft__1fqZF Sky_cloud__g4LYY",cloudMiddle:"Sky_cloudMiddle__1lt-v Sky_cloud__g4LYY",cloudRight:"Sky_cloudRight__2pJJN Sky_cloud__g4LYY"}},,function(e,t,a){e.exports={colors:'"../../tokens/colors.css"',land:"#dde698","simple-flower":"#fff",container:"Land_container__1y2lN",base:"Land_base__17nPx",path:"Land_path__2mdhg",flower:"Land_flower__1R3qU"}},,,,,,,,,,,,,,function(e,t,a){e.exports={colors:'"../../tokens/colors.css"',background:"#fffad8",world:"Background_world__2z5px",sky:"Background_sky__3_HKZ",land:"Background_land__Qv8ql"}},function(e,t,a){e.exports={colors:'"../../tokens/colors.css"',"board-border":"#ee607b",container:"BoardPiece_container__3D20-",capturedPieceNumber:"BoardPiece_capturedPieceNumber__1CFMi",skyCapturedPieceNumber:"BoardPiece_skyCapturedPieceNumber__GGaRM BoardPiece_capturedPieceNumber__1CFMi",landCapturedPieceNumber:"BoardPiece_landCapturedPieceNumber__3ZzXn BoardPiece_capturedPieceNumber__1CFMi"}},,,,,function(e,t,a){e.exports={colors:'"../../tokens/colors.css"',"board-hover":"rgba(238,96,123,0.5)","board-droppable":"rgba(238,96,123,0.2)",over:"BoardSquare_over__2mypn",droppable:"BoardSquare_droppable__CYYO4"}},function(e,t,a){e.exports={base:"Piece_base__3d_Q5",dot:"Piece_dot__1P__8","dot-tl":"Piece_dot-tl__3HNzC Piece_dot__1P__8","dot-tm":"Piece_dot-tm__3tOio Piece_dot__1P__8","dot-tr":"Piece_dot-tr__HmERG Piece_dot__1P__8","dot-ml":"Piece_dot-ml__2PNRR Piece_dot__1P__8","dot-mr":"Piece_dot-mr__3-jNi Piece_dot__1P__8","dot-bl":"Piece_dot-bl__5Xfww Piece_dot__1P__8","dot-bm":"Piece_dot-bm__2VdZD Piece_dot__1P__8","dot-br":"Piece_dot-br__2dQvV Piece_dot__1P__8"}},function(e,t,a){e.exports={iconButtonsContainer:"Game_iconButtonsContainer__1gtR6",helpButton:"Game_helpButton__1ES3T"}},,,,function(e,t,a){e.exports={cloud:"Cloud_cloud__1F94b"}},function(e,t,a){e.exports={flower:"SimpleFlower_flower__34run"}},function(e,t,a){e.exports={base:"IconButton_base__3ackL"}},function(e,t,a){e.exports=a.p+"static/media/reset-icon.f651b8d8.svg"},function(e,t,a){e.exports=a.p+"static/media/lion.07f5bd3d.svg"},function(e,t,a){e.exports=a.p+"static/media/chick.1595e17d.svg"},function(e,t,a){e.exports=a.p+"static/media/hen.11a67dae.svg"},function(e,t,a){e.exports=a.p+"static/media/elephant.c2d34d4d.svg"},function(e,t,a){e.exports=a.p+"static/media/giraffe.70bb2a93.svg"},,,,function(e,t,a){e.exports=a(60)},,,,,function(e,t,a){},,,,,function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(36),c=a.n(o),i=(a(55),a(3)),s=r.a.createContext(),l=r.a.createContext(),u=r.a.createContext(),d=r.a.createContext(),m=r.a.createContext(),p="piece",f=a(2),_=a(20),y=a(29),h=a.n(y),b=a(62),v=a(17),g=a(47),k=a(24),E=function(e,t){return e-t+Math.floor(Math.random()*t*2)},w=function(e,t){return Object(k.a)(Array(e)).map((function(e,a){return t(a)}))},x=function(e){return String.fromCharCode(64+e)};function S(){var e,t="",a=Object(_.a)(arguments);try{for(a.s();!(e=a.n()).done;){var n=e.value;if("object"===typeof n)for(var r in n)n[r]&&(t&&(t+=" "),t+=r);else n&&(t&&(t+=" "),t+=n)}}catch(o){a.e(o)}finally{a.f()}return t}var C=a(38),N=a.n(C),P=function(e){return E(e,5)},j=P(50),O=P(35),B=P(35),R=P(25),L=P(35),M=P(35);function T(e){var t=e.className;return r.a.createElement("svg",{viewBox:"0 0 210 130",className:S(N.a.cloud,t)},r.a.createElement("circle",{cx:"100",cy:"55",r:j}),r.a.createElement("circle",{cx:"80",cy:"90",r:O}),r.a.createElement("circle",{cx:"40",cy:"70",r:B}),r.a.createElement("circle",{cx:"130",cy:"95",r:R}),r.a.createElement("circle",{cx:"170",cy:"80",r:L}),r.a.createElement("circle",{cx:"155",cy:"40",r:M}))}T.defaultProps={className:""};var W=T,H=a(10),D=a.n(H),A=E(95,5);function Q(e){var t=e.className,a=e.style;return r.a.createElement("div",{className:S(D.a.container,t),style:a},r.a.createElement("svg",{viewBox:"0 0 500 150",preserveAspectRatio:"none",className:D.a.base},r.a.createElement("path",{d:"M0,150 Q75,".concat(A," 150,130 T300,130 T450,130 L500,150 L500,0 L0,0 Z"),className:D.a.path})),r.a.createElement(W,{className:D.a.cloudLeft}),r.a.createElement(W,{className:D.a.cloudMiddle}),r.a.createElement(W,{className:D.a.cloudRight}))}Q.defaultProps={className:""};var Y=Q,q=a(39),I=a.n(q),z=function(e){return E(e,1)},F=E(180,180),Z=z(25),G=z(15),V=z(10),J=z(12),U=z(10),X=z(35),K=z(10),$=z(25),ee=z(10),te=z(38),ae=z(10);function ne(e){var t=e.className,a=e.style;return r.a.createElement("svg",{viewBox:"0 0 50 50",className:S(I.a.flower,t),transform:"rotate(".concat(F,")"),style:a},r.a.createElement("circle",{cx:Z,cy:"25",r:13}),r.a.createElement("circle",{cx:G,cy:"15",r:V}),r.a.createElement("circle",{cx:X,cy:"12",r:U}),r.a.createElement("circle",{cx:J,cy:"32",r:K}),r.a.createElement("circle",{cx:$,cy:"39",r:ee}),r.a.createElement("circle",{cx:te,cy:"30",r:ae}))}ne.defaultProps={className:""};var re=ne,oe=a(12),ce=a.n(oe),ie=function(e){return E(e,5)},se=ie(0),le=ie(50),ue=ie(-40),de=ie(-20);function me(e){var t=e.className,a=e.style;return r.a.createElement("div",{className:S(ce.a.container,t),style:a},r.a.createElement("svg",{viewBox:"0 0 500 150",preserveAspectRatio:"none",className:ce.a.base},r.a.createElement("path",{d:"M0,20 Q70,".concat(se," 130,").concat(le," Q190,").concat(ue," 250,").concat(le," Q310,").concat(ue," 370,").concat(le," Q430,").concat(de," 500,20 L500,500 L0,500 Z"),className:ce.a.path})),w(5,(function(e){return r.a.createElement(re,{key:e,className:ce.a.flower,style:{bottom:"40%",left:"".concat(20*(e+1)-10,"%")}})})),w(4,(function(e){return r.a.createElement(re,{key:e,className:ce.a.flower,style:{bottom:"15%",left:"".concat(20*(e+1),"%")}})})))}me.defaultProps={className:""};var pe=me,fe=a(26),_e=a.n(fe);function ye(e){var t=e.className,a=e.skyHeight,n=e.landHeight;return r.a.createElement("div",{className:S(_e.a.world,t)},r.a.createElement(Y,{className:_e.a.sky,style:{height:a}}),r.a.createElement(pe,{className:_e.a.land,style:{height:n}}))}ye.defaultProps={className:""};var he=ye,be=a(14),ve=a(63),ge=a(32),ke=a.n(ge);function Ee(e){var t,a=e.className,o=e.children,c=e.position,s=Object(n.useContext)(u),l=s.canMove,d=s.move,m=s.canDrop,f=s.drop,_=Object(ve.a)({accept:p,drop:function(e){"object"===typeof e.from?d(e.from,c):f(e.isSky,e.from,c)},canDrop:function(e){return"object"===typeof e.from?l(e.from,c):m(e.isSky,e.from,c)},collect:function(e){return{isOver:!!e.isOver(),canDrop:!!e.canDrop()}}}),y=Object(i.a)(_,2),h=y[0],b=h.isOver,v=h.canDrop,g=y[1];return r.a.createElement("div",{className:S(a,(t={},Object(be.a)(t,ke.a.droppable,v&&!b),Object(be.a)(t,ke.a.over,v&&b),t)),ref:g},o)}Ee.defaultProps={className:""};var we=Ee,xe=a(48),Se=a(64),Ce=a(33),Ne=a.n(Ce);function Pe(e){var t=e.className,a=e.type,o=e.isSky,c=Object(n.useContext)(d),s=Object(n.useContext)(m),l=Object(n.useState)(0),u=Object(i.a)(l,2),p=u[0],f=u[1],_=s[a],y=_.color,h=_.image,b=_.moves,v=Object(n.useCallback)((function(e){null!==e&&f(e.getBoundingClientRect().width)}),[c.width,c.height]),g=Math.ceil(.05*p);return r.a.createElement("div",{className:S(Ne.a.base,t),ref:v,style:{backgroundColor:y||"white",transform:o&&"rotate(180deg)",backgroundImage:"url(".concat(h,")")}},b.map((function(e){var t="s"===e[0]?"dot":"triangle",a=e.substr(1);return g&&r.a.createElement("span",{key:e,className:Ne.a["".concat(t,"-").concat(a)],style:{width:g,height:g}})})))}Pe.defaultProps={className:"",isSky:!1};var je=Pe,Oe=a(27),Be=a.n(Oe),Re=function(){var e=Object(n.useContext)(v.a.Context),t=e.itemType,a=e.item,o=e.style;return t===p&&r.a.createElement("div",{style:Object(f.a)({height:a.height,width:a.width},o)},r.a.createElement(je,{type:a.piece,isSky:a.isSky,style:o}))};var Le=function(e){var t=e.height,a=e.width,n=e.position,o=e.isSkyTurn,c=e.result,s=e.number,l=e.type,u=e.isSky,d=Object(xe.a)(e,["height","width","position","isSkyTurn","result","number","type","isSky"]),m=Object(Se.a)({item:{type:p,piece:l,isSky:u,from:n,height:t,width:a},canDrag:function(){return!c.didEnd&&o===u},collect:function(e){return{isDragging:!!e.isDragging()}}}),f=Object(i.a)(m,2),_=f[0].isDragging,y=f[1],h={opacity:_?.15:1};return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:Be.a.container,ref:y,style:h},r.a.createElement(je,Object.assign({type:l,isSky:u},d))),s>1&&r.a.createElement("div",{className:u?Be.a.skyCapturedPieceNumber:Be.a.landCapturedPieceNumber,style:h},s),r.a.createElement(v.a,null,r.a.createElement(Re,null)))},Me=a(6),Te=a.n(Me);var We=function(e){var t=e.numRows,a=e.numCols,o=e.numRowsInSky,c=Object(n.useContext)(l),u=c.pieces,m=c.isSkyTurn,p=c.result,f=u.board,_=Object(n.useContext)(s),y=Object(n.useState)({width:"auto",height:"auto"}),h=Object(i.a)(y,2),b=h[0],v=h[1],g=Object(n.useState)({width:0,height:0}),k=Object(i.a)(g,2),E=k[0],S=k[1],C=function(e,n){return e/n*t/a},N=Object(n.useCallback)((function(e){if(null!==e){var n="auto",r="auto",o=C(_.width,_.height),c=.8*_.height,i=.8*_.width;o>=1?r=c*(a/t):n=i*(t/a),v({height:n,width:r}),e.style.visibility="visible"}}),[_.height,_.width,a,t]),P=Object(n.useCallback)((function(e){if(null!==e){var t=e.getBoundingClientRect(),a=t.width,n=t.height;S({width:a,height:n})}}),[b.height,b.width]),j=isNaN(b.height)?.8*_.height:b.height,O=(_.height-j)/2+j*o/t*1.1,B=(_.width-(isNaN(b.width)?.8*_.width:b.width))/2,R=(_.height-(isNaN(b.height)?.8*_.height:b.height))/2,L={height:E.height,width:E.width,isSkyTurn:m,result:p},M=C(_.width,_.height);return r.a.createElement(d.Provider,{value:b},r.a.createElement(he,{skyHeight:O,landHeight:O}),r.a.createElement("div",{className:Te.a.board,ref:N,style:{height:b.height,width:b.width,maxHeight:"".concat(80,"%"),maxWidth:"".concat(80,"%")}},w(t,(function(e){return r.a.createElement("div",{key:e,className:Te.a.boardRow,style:{}},r.a.createElement("div",{className:Te.a.rowLabel},e+1),w(a,(function(t){var a=f[e][t],n=a.isEmpty,o=a.type,c=a.isSky;return r.a.createElement(we,{key:t,className:Te.a.boardSquare,position:{x:e,y:t}},0===e&&r.a.createElement("div",{className:Te.a.columnLabel},x(t+1)),n||r.a.createElement("div",{className:Te.a.pieceContainer,ref:P},r.a.createElement(Le,Object.assign({type:o,isSky:c,position:{x:e,y:t}},L))))})))}))),r.a.createElement("div",{className:Te.a.skyCapturedContainer,style:{width:M>=1?B:_.width-60,height:M>=1?_.height-60:R,flexDirection:M>=1?"column":"row",padding:M>=1?"8px 20px 8px 8px":"8px 8px 20px 8px"}},u.captured.sky.map((function(e,t){return r.a.createElement("div",{key:t,className:Te.a.capturedPiece,style:{height:E.height,width:E.width}},r.a.createElement(Le,Object.assign({type:e.type,isSky:e.isSky,number:e.number,position:t},L)))}))),r.a.createElement("div",{className:Te.a.landCapturedContainer,style:{width:M>=1?B:_.width-60,height:M>=1?_.height-60:R,flexDirection:M>=1?"column-reverse":"row-reverse",padding:M>=1?"8px 8px 8px 20px":"20px 8px 8px 8px"}},u.captured.land.map((function(e,t){return r.a.createElement("div",{key:t,className:Te.a.capturedPiece,style:{height:E.height,width:E.width}},r.a.createElement(Le,Object.assign({type:e.type,isSky:e.isSky,number:e.number,position:t},L)))}))))},He=a(40),De=a.n(He);function Ae(e){var t=e.className,a=e.icon,n=e.text,o=e.onClick,c=e.ariaLabel;return r.a.createElement("button",{className:S(De.a.base,t),onClick:o,style:{backgroundImage:a&&"url(".concat(a,")")},"aria-label":c},a?"":n)}Ae.defaultProps={className:"",text:""};var Qe=Ae;function Ye(e){var t=e.className;return r.a.createElement("svg",{className:t,xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 504 458"},r.a.createElement("g",{"fill-rule":"evenodd",transform:"translate(-9)"},r.a.createElement("g",{transform:"translate(409 94)"},r.a.createElement("polygon",{points:"29.907 40.907 16.976 47.706 19.446 33.307 8.984 23.109 23.442 21.008 29.907 7.907 36.373 21.008 50.831 23.109 40.369 33.307 42.839 47.706",transform:"rotate(29 29.907 29.907)"}),r.a.createElement("g",{transform:"scale(1 -1) rotate(-4 -1287.062 -44.945)"},r.a.createElement("polygon",{points:"47.807 -38.19 50.231 47.408 43.657 47.064",transform:"rotate(-89 46.944 4.61)"}),r.a.createElement("polygon",{points:"49.216 -18.108 45.057 70.048 38.403 69.663",transform:"rotate(-73 43.81 25.97)"}))),r.a.createElement("g",{transform:"rotate(-137 82.899 96.852)"},r.a.createElement("polygon",{points:"48.339 -25.771 51.821 78.267 45.228 77.433",transform:"rotate(-116 48.524 26.248)"}),r.a.createElement("polygon",{points:"56.177 -2.623 60.177 95.377 52.177 95.377",transform:"rotate(-102 56.177 46.377)"})),r.a.createElement("g",{transform:"translate(421 297)"},r.a.createElement("polygon",{points:"47.634 -38.774 51.45 48.653 43.45 48.668",transform:"rotate(-89 47.45 4.947)"}),r.a.createElement("polygon",{points:"46.951 -19.558 47.959 68.656 40.033 68.897",transform:"rotate(-73 43.996 24.67)"})),r.a.createElement("g",{transform:"rotate(47 -260.313 558.549)"},r.a.createElement("polygon",{points:"40.259 -29.497 43.755 39.668 35.756 39.709",transform:"rotate(-89 39.756 5.106)"}),r.a.createElement("polygon",{points:"42.882 -10.833 38.722 60.478 30.923 61.136",transform:"rotate(-73 36.902 25.151)"})),r.a.createElement("g",{transform:"rotate(-67 223.186 -187.962)"},r.a.createElement("polygon",{points:"47.186 -36.875 50.246 46.282 43.246 46.331",transform:"rotate(-89 46.746 4.728)"}),r.a.createElement("polygon",{points:"48.141 -15.725 43.982 66.486 36.183 67.244",transform:"rotate(-73 42.162 25.76)"})),r.a.createElement("g",{transform:"scale(-1 1) rotate(-67 -28.952 191.468)"},r.a.createElement("polygon",{points:"41.856 -33.811 44.566 41.872 38.521 41.911",transform:"rotate(-89 41.543 4.05)"}),r.a.createElement("polygon",{points:"42.021 -15.266 39.48 59.174 32.724 59.76",transform:"rotate(-73 37.372 22.247)"})),r.a.createElement("g",{transform:"scale(-1 1) rotate(38 -634.181 -101.142)"},r.a.createElement("polygon",{points:"47.559 -38 51.055 48.155 43.409 47.254",transform:"rotate(-89 47.232 5.078)"}),r.a.createElement("polygon",{points:"49.216 -17.108 45.057 71.048 38.403 70.663",transform:"rotate(-73 43.81 26.97)"})),r.a.createElement("polygon",{points:"42.841 314.591 27.853 322.471 30.715 305.781 18.589 293.961 35.347 291.526 42.841 276.341 50.336 291.526 67.093 293.961 54.967 305.781 57.83 322.471",transform:"rotate(-17 42.841 301.841)"}),r.a.createElement("path",{d:"M450.2726,400.974182 C450.2726,400.974182 271.156825,262.424142 255.537849,457.530601 C255.537849,457.530601 255.537849,260.406277 66.7731696,405.416017 C66.7731696,405.416017 180.327798,284.168312 11,223.719869 C11,223.719869 74.7300189,228.223142 111.312407,206.23294 C148.580095,183.830794 139.918609,140.598574 66.7731696,67.8472771 C56.2623285,61.8466231 234.956209,195.106459 245.366628,0 C286.382999,208.375698 445.814939,49.1485683 445.814939,49.1485683 C445.814939,49.1485683 275.636446,228.7653 503.378307,222.310098 C514.234137,222.002396 347.593038,263.261558 450.2726,400.974182 Z"})))}Ye.defaultProps={className:""};var qe=Ye,Ie=a(7),ze=a.n(Ie);function Fe(e){var t=e.className,a=e.didSkyWin,n=e.onClose,o=e.onReset,c=a?"SKY WINS":"LAND WINS",i=a?ze.a.skyButton:ze.a.landButton;return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:ze.a.background}),r.a.createElement("div",{className:S(ze.a.container,t)},r.a.createElement(qe,{className:a?ze.a.skyStar:ze.a.landStar}),r.a.createElement("h1",{className:ze.a.resultText},c),r.a.createElement("div",{className:ze.a.actionButtonContainer},r.a.createElement("button",{className:i,onClick:o},"REPLAY"),r.a.createElement("button",{className:i,onClick:n},"CLOSE"))))}Fe.defaultProps={className:""};var Ze=Fe,Ge=a(41),Ve=a.n(Ge),Je={A1:"giraffe",B1:"lion",C1:"elephant",B2:"chick",isSymmetric:!0},Ue={mini:{numRows:4,numCols:3,initialSetup:Je},standard:{numRows:9,numCols:9,initialSetup:Je}},Xe=function(e){switch(e){case"micro":return Ue.mini;case"standard":default:return Ue.standard}},Ke=a(42),$e=a.n(Ke),et=a(43),tt=a.n(et),at=a(44),nt=a.n(at),rt=a(45),ot=a.n(rt),ct=a(46),it=a.n(ct),st={chick:"hen"},lt=function(e){return st[e]||e},ut=function(e){return function(e){var t={};return Object.keys(e).forEach((function(a){var n;t[a]=Object(f.a)(Object(f.a)({},e[a]),{},{moves:(n=e[a].moves,Object(k.a)(new Set(n.reduce((function(e,t){var a=[];return"*"===t[1]?["t","m","b"].forEach((function(e){return a.push(t[0]+e+t[2])})):a.push(t),a.forEach((function(t){"*"===t[2]?["l","m","r"].forEach((function(a){return e.push(t.substr(0,2)+a)})):e.push(t)})),e}),[]).filter((function(e){return"mm"!==e.substr(1,3)})))))})})),t}({lion:{image:$e.a,color:"#f8b9bb",moves:["s**"]},chick:{image:tt.a,color:"#ebf2d4",moves:["stm"]},hen:{image:nt.a,color:"#ebf2d4",moves:["st*","sm*","sbm"]},elephant:{image:ot.a,color:"#cdaed0",moves:["stl","str","sbl","sbr"]},giraffe:{image:it.a,color:"#cdaed0",moves:["s*m","sm*"]}})},dt=function(e){var t=Xe(e),a=t.numRows,n=t.numCols,r=t.initialSetup,o=[];return w(a,(function(e){o[e]=[],w(n,(function(t){var a=r[x(t+1)+(e+1)];o[e][t]=a?{type:a,isSky:e<n/2,isEmpty:!1}:{isEmpty:!0}}))})),r.isSymmetric&&w(a,(function(e){w(n,(function(t){var r=a-e-1,c=n-t-1;o[e][t].isEmpty&&!o[r][c].isEmpty&&(o[e][t]=Object(f.a)(Object(f.a)({},o[r][c]),{},{isSky:!o[r][c].isSky}))}))})),{board:o,captured:{land:[],sky:[]}}},mt=a(34),pt=a.n(mt),ft=function(e,t,a,n){var r=e[t.x][t.y],o=e[a.x][a.y];if("s"===n[0]){var c=t.x,i=t.y;if(c+=(r.isSky?-1:1)*{t:-1,m:0,b:1}[n[1]],i+=(r.isSky?-1:1)*{l:-1,m:0,r:1}[n[2]],a.x!==c||a.y!==i)return!1}return"m"!==n[0]&&!(!o.isEmpty&&r.isSky===o.isSky)},_t=function(e,t){return function(e,a){var n,r=ut()[t.board[e.x][e.y].type].moves,o=Object(_.a)(r);try{for(o.s();!(n=o.n()).done;){var c=n.value;if(ft(t.board,e,a,c))return!0}}catch(i){o.e(i)}finally{o.f()}return!1}},yt=function(e,t){return function(e,a,n){return t.board[n.x][n.y].isEmpty}},ht=function(e){return function(t,a){switch(a.type){case"reset":return Object(f.a)({initialState:t.initialState},t.initialState);case"move":var n=Xe(e).numRows,r=Math.floor(n/3),o=a.payload,c=o.from,i=o.to;if(!t.result.didEnd&&_t(0,t.pieces)(c,i)){var s=null,l=null,u=h()(t.pieces.captured),d={didEnd:!1,didWin:!1,didSkyWin:!1},m=t.pieces.board[c.x][c.y],p=t.pieces.board[i.x][i.y],_=t.pieces.board.map((function(e,t){return t!==c.x&&t!==i.x?e:e.map((function(e,a){return t===c.x&&a===c.y?{isEmpty:!0}:t===i.x&&a===i.y?Object(f.a)(Object(f.a)({},m),{},{isEmpty:!1}):e}))}));if(B=m.type,Object.values(st).includes(B)||(m.isSky?(c.x>=n-r||i.x>=n-r)&&("chick"===m.type&&i.x===n-1?l=i:s=i):(c.x<r||i.x<r)&&("chick"===m.type&&0===i.x?l=i:s=i)),!p.isEmpty){var y=function(e){for(var t=0,a=Object.keys(st);t<a.length;t++){var n=a[t];if(st[n]===e)return n}return e}(p.type);if("lion"!==y){var b=u[m.isSky?"sky":"land"],v=b.find((function(e){return e.type===y}));v?v.number+=1:b.push({type:y,isSky:m.isSky,number:1})}else d.didEnd=!0,d.didWin=!0,d.didSkyWin=m.isSky}var g={board:_,captured:u,shouldPromote:l,canPromote:s};return"micro"===e&&(d.didEnd||"lion"!==m.type||(m.isSky&&i.x>=n-r||!m.isSky&&i.x<r)&&(function(e,t){return function(a){var n,r,o=t.board[a.x][a.y];if("micro"===e)for(var c=-1;c<=1;c++)for(var i=-1;i<=1;i++)if(0!==c||0!==i){var s={x:a.x+c,y:a.y+i};if(n=t.board,!((r=s).x<0||r.x>=n.length||r.y<0||r.y>=n[0].length)){var l=t.board[s.x][s.y];if(!l.isEmpty&&l.isSky!==o.isSky&&_t(0,t)(s,a))return!0}}return!1}}(e,g)(i)||(d.didEnd=!0,d.didWin=!0,d.didSkyWin=m.isSky))),Object(f.a)(Object(f.a)({},t),{},{pieces:g,isSkyTurn:!t.isSkyTurn,result:d})}return t;case"drop":var k=a.payload,E=k.isSky,w=k.fromIndex,x=k.to,S=E?"sky":"land",C=t.pieces.captured[S][w];if(!t.result.didEnd&&yt(0,t.pieces)(E,w,x)){var N=h()(t.pieces.captured),P=N[S][w];P.number>1?P.number-=1:N[S]=N[S].filter((function(e,t){return t!==w}));var j=t.pieces.board.map((function(e,t){return t!==x.x?e:e.map((function(e,t){return t===x.y?{type:C.type,isSky:C.isSky}:e}))}));return Object(f.a)(Object(f.a)({},t),{},{pieces:{board:j,captured:N},isSkyTurn:!t.isSkyTurn})}return t;case"promote":var O=a.payload.position;return Object(f.a)(Object(f.a)({},t),{},{pieces:Object(f.a)(Object(f.a)({},t.pieces),{},{shouldPromote:null,canPromote:null,board:t.pieces.board.map((function(e,t){return t!==O.x?e:e.map((function(e,t){return t!==O.y?e:Object(f.a)(Object(f.a)({},e),{},{type:lt(e.type)})}))}))})});default:return t}var B}};var bt=function(e){var t=e.config,a=e.onHelp,o=t.gameType,c={result:{didEnd:!1,didWin:!1,didSkyWin:!1},isSkyTurn:!1,pieces:dt(o)},s=Object(n.useReducer)(ht(o),Object(f.a)({initialState:c},c)),d=Object(i.a)(s,2),p=d[0],_=p.pieces,y=p.isSkyTurn,h=p.result,k=d[1],E=Object(n.useState)(!1),w=Object(i.a)(E,2),x=w[0],S=w[1],C=Xe(o),N=C.numRows,P=C.numCols,j=Math.floor(N/3),O=ut();_.shouldPromote&&k({type:"promote",payload:{position:_.shouldPromote}});var B=function(){k({type:"reset"}),S(!1)};return r.a.createElement(b.a,{backend:v.b,options:g.a},r.a.createElement(m.Provider,{value:O},r.a.createElement(l.Provider,{value:{pieces:_,isSkyTurn:y,result:h}},r.a.createElement(u.Provider,{value:{canMove:_t(0,_),move:function(e,t){return k({type:"move",payload:{from:e,to:t}})},canDrop:yt(0,_),drop:function(e,t,a){return k({type:"drop",payload:{isSky:e,fromIndex:t,to:a}})}}},r.a.createElement(We,{numCols:P,numRows:N,numRowsInSky:j}),r.a.createElement("div",{className:pt.a.iconButtonsContainer},r.a.createElement(Qe,{icon:Ve.a,ariaLabel:"replay",onClick:B}),r.a.createElement(Qe,{className:pt.a.helpButton,text:"?",ariaLabel:"help",onClick:a})),!x&&h.didEnd&&r.a.createElement(Ze,{didSkyWin:h.didSkyWin,onReset:B,onClose:function(){return S(!0)}})))))};function vt(){var e=window;return{width:e.innerWidth,height:e.innerHeight}}var gt={gameType:"micro"};var kt=function(){var e=Object(n.useState)(vt()),t=Object(i.a)(e,2),a=t[0],o=t[1];return Object(n.useEffect)((function(){var e=function(){o(vt())};return window.addEventListener("resize",e),function(){window.removeEventListener("resize",e)}}),[]),r.a.createElement(s.Provider,{value:a},r.a.createElement(bt,{config:gt,onHelp:function(){window.open("https://en.wikipedia.org/wiki/D%C5%8Dbutsu_sh%C5%8Dgi")}}))},Et=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function wt(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var a=e.installing;null!=a&&(a.onstatechange=function(){"installed"===a.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}c.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(kt,null)),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("/animal-shogi",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("/animal-shogi","/service-worker.js");Et?(!function(e,t){fetch(e,{headers:{"Service-Worker":"script"}}).then((function(a){var n=a.headers.get("content-type");404===a.status||null!=n&&-1===n.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):wt(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")}))):wt(t,e)}))}}()}],[[50,1,2]]]);
//# sourceMappingURL=main.23cc34cb.chunk.js.map