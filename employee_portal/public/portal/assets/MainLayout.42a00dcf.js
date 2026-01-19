var U=Object.defineProperty,N=Object.defineProperties;var O=Object.getOwnPropertyDescriptors;var w=Object.getOwnPropertySymbols;var M=Object.prototype.hasOwnProperty,j=Object.prototype.propertyIsEnumerable;var H=(t,e,a)=>e in t?U(t,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[e]=a,v=(t,e)=>{for(var a in e||(e={}))M.call(e,a)&&H(t,a,e[a]);if(w)for(var a of w(e))j.call(e,a)&&H(t,a,e[a]);return t},C=(t,e)=>N(t,O(e));var A=(t,e)=>{var a={};for(var s in t)M.call(t,s)&&e.indexOf(s)<0&&(a[s]=t[s]);if(t!=null&&w)for(var s of w(t))e.indexOf(s)<0&&j.call(t,s)&&(a[s]=t[s]);return a};import{A as $,C as q,k as F,v as I,f as S,o as x,d as _,m as o,F as T,x as Z,z as L,y as G,D as R,E as z,t as B,q as X,u as r,n as D,e as g,j as J,G as Q}from"./vendor.7d676abb.js";import{s as l}from"./index.d8fa7968.js";import{s as b}from"./settings.d0e1ae0c.js";/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),W=t=>t.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,a,s)=>s?s.toUpperCase():a.toLowerCase()),Y=t=>{const e=W(t);return e.charAt(0).toUpperCase()+e.slice(1)},K=(...t)=>t.filter((e,a,s)=>Boolean(e)&&e.trim()!==""&&s.indexOf(e)===a).join(" ").trim(),V=t=>t==="";/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var k={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=(y,{slots:u})=>{var h=y,{name:t,iconNode:e,absoluteStrokeWidth:a,"absolute-stroke-width":s,strokeWidth:n,"stroke-width":i,size:d=k.width,color:p=k.stroke}=h,c=A(h,["name","iconNode","absoluteStrokeWidth","absolute-stroke-width","strokeWidth","stroke-width","size","color"]);return $("svg",C(v(v({},k),c),{width:d,height:d,stroke:p,"stroke-width":V(a)||V(s)||a===!0||s===!0?Number(n||i||k["stroke-width"])*24/Number(d):n||i||k["stroke-width"],class:K("lucide",c.class,...t?[`lucide-${E(Y(t))}-icon`,`lucide-${E(t)}`]:["lucide-icon"])}),[...e.map(f=>$(...f)),...u.default?[u.default()]:[]])};/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=(t,e)=>(a,{slots:s,attrs:n})=>$(ee,C(v(v({},n),a),{iconNode:e,name:t}),s);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const te=m("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=m("dollar-sign",[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=m("file-text",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=m("house",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"r6nss1"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ne=m("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const re=m("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=m("user",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=m("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),de={class:"flex flex-col h-full bg-gray-50 border-r w-full md:w-64"},ce=o("div",{class:"h-16 flex items-center px-6 border-b bg-white"},[o("span",{class:"text-xl font-bold text-gray-800"},"Employee Portal")],-1),ue={class:"flex-1 overflow-y-auto py-4"},he={class:"space-y-1 px-2"},me={class:"p-4 border-t bg-white"},pe={key:0,class:"flex items-center mb-3 px-2"},fe=["src"],xe={class:"flex-1 min-w-0"},ye={class:"text-sm font-medium text-gray-900 truncate"},ve=z(" Logout "),P={setup(t){const e=q();F(()=>{b.fetch()});const a=I(()=>{var i,d,p,c,u,y;return[{name:"Dashboard",href:"/",icon:oe,current:e.path==="/"},{name:"Leave Application",href:"/leave",icon:ae,current:e.path.startsWith("/leave"),enabled:((i=b.data)==null?void 0:i.enable_leave)!==0&&((d=l.permissions)==null?void 0:d.can_leave)!==!1},{name:"Expense Claim",href:"/expense",icon:se,current:e.path.startsWith("/expense"),enabled:((p=b.data)==null?void 0:p.enable_expense_claim)!==0&&((c=l.permissions)==null?void 0:c.can_expense)!==!1},{name:"Attendance",href:"/attendance",icon:te,current:e.path.startsWith("/attendance"),enabled:((u=b.data)==null?void 0:u.enable_attendance)!==0&&((y=l.permissions)==null?void 0:y.can_attendance)!==!1},{name:"Profile",href:"/profile",icon:le,current:e.path.startsWith("/profile")}].filter(h=>h.enabled===void 0||h.enabled)}),s=()=>{l.logout()};return(n,i)=>{var p,c,u,y,h;const d=S("router-link");return x(),_("div",de,[ce,o("div",ue,[o("nav",he,[(x(!0),_(T,null,Z(r(a),f=>(x(),L(d,{key:f.name,to:f.href,onClick:i[0]||(i[0]=De=>n.$emit("item-click")),class:X(["group flex items-center px-2 py-2 text-sm font-medium rounded-md",[f.current?"bg-gray-200 text-gray-900":"text-gray-600 hover:bg-gray-50 hover:text-gray-900"]])},{default:G(()=>[(x(),L(R(f.icon),{class:"mr-3 h-5 w-5 flex-shrink-0"})),z(" "+B(f.name),1)]),_:2},1032,["to","class"]))),128))])]),o("div",me,[r(l).user?(x(),_("div",pe,[o("img",{src:((p=r(l).employee)==null?void 0:p.image)||((c=r(l).user)==null?void 0:c.user_image)||`https://ui-avatars.com/api/?name=${((u=r(l).user)==null?void 0:u.full_name)||"User"}&background=random`,class:"h-8 w-8 rounded-full mr-3 object-cover border border-gray-200",alt:"Profile"},null,8,fe),o("div",xe,[o("p",ye,B(((y=r(l).employee)==null?void 0:y.employee_name)||((h=r(l).user)==null?void 0:h.full_name)),1)])])):D("",!0),o("button",{onClick:s,class:"w-full flex items-center px-2 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"},[g(r(ne),{class:"mr-3 h-5 w-5"}),ve])])])}}},_e={class:"flex h-screen overflow-hidden bg-white"},ge={key:0,class:"fixed inset-0 z-40 flex md:hidden",role:"dialog","aria-modal":"true"},ke={class:"relative flex-1 flex flex-col max-w-xs w-full bg-white transition ease-in-out duration-300 transform"},we={class:"absolute top-0 right-0 -mr-12 pt-2"},be=o("span",{class:"sr-only"},"Close sidebar",-1),Ce=o("div",{class:"flex-shrink-0 w-14","aria-hidden":"true"},null,-1),$e={class:"hidden md:flex md:flex-shrink-0"},Me={class:"flex flex-col flex-1 w-0 overflow-hidden"},je={class:"md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white border-b border-gray-200 flex items-center"},He=o("span",{class:"sr-only"},"Open sidebar",-1),Ae=o("span",{class:"ml-2 text-lg font-bold text-gray-900"},"Employee Portal",-1),Le={class:"flex-1 relative overflow-y-auto focus:outline-none"},ze={class:"py-6"},Be={class:"max-w-7xl mx-auto px-4 sm:px-6 md:px-8"},Ne={setup(t){const e=J(!1);return(a,s)=>(x(),_("div",_e,[e.value?(x(),_("div",ge,[o("div",{class:"fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity","aria-hidden":"true",onClick:s[0]||(s[0]=n=>e.value=!1)}),o("div",ke,[o("div",we,[o("button",{class:"ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white",onClick:s[1]||(s[1]=n=>e.value=!1)},[be,g(r(ie),{class:"h-6 w-6 text-white","aria-hidden":"true"})])]),g(P,{onItemClick:s[2]||(s[2]=n=>e.value=!1)})]),Ce])):D("",!0),o("div",$e,[g(P)]),o("div",Me,[o("div",je,[o("button",{class:"-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500",onClick:s[3]||(s[3]=n=>e.value=!0)},[He,g(r(re),{class:"h-6 w-6","aria-hidden":"true"})]),Ae]),o("main",Le,[o("div",ze,[o("div",Be,[Q(a.$slots,"default")])])])])]))}};export{te as C,se as D,le as U,Ne as _,m as c};
