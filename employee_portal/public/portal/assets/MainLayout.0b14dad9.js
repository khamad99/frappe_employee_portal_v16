var N=Object.defineProperty,O=Object.defineProperties;var q=Object.getOwnPropertyDescriptors;var b=Object.getOwnPropertySymbols;var j=Object.prototype.hasOwnProperty,H=Object.prototype.propertyIsEnumerable;var A=(t,e,a)=>e in t?N(t,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[e]=a,_=(t,e)=>{for(var a in e||(e={}))j.call(e,a)&&A(t,a,e[a]);if(b)for(var a of b(e))H.call(e,a)&&A(t,a,e[a]);return t},$=(t,e)=>O(t,q(e));var L=(t,e)=>{var a={};for(var s in t)j.call(t,s)&&e.indexOf(s)<0&&(a[s]=t[s]);if(t!=null&&b)for(var s of b(t))e.indexOf(s)<0&&H.call(t,s)&&(a[s]=t[s]);return a};import{C as M,D as I,l as S,k as T,f as Z,o as x,d as v,n,F as G,x as R,q as z,z as W,E as X,A as B,t as D,v as J,u as i,y as E,e as g,j as Q,G as Y}from"./vendor.800921c4.js";import{s as r}from"./index.134c9e46.js";import{s as k}from"./settings.4ea99676.js";/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),K=t=>t.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,a,s)=>s?s.toUpperCase():a.toLowerCase()),ee=t=>{const e=K(t);return e.charAt(0).toUpperCase()+e.slice(1)},te=(...t)=>t.filter((e,a,s)=>Boolean(e)&&e.trim()!==""&&s.indexOf(e)===a).join(" ").trim(),V=t=>t==="";/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var w={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=(y,{slots:u})=>{var p=y,{name:t,iconNode:e,absoluteStrokeWidth:a,"absolute-stroke-width":s,strokeWidth:o,"stroke-width":c,size:d=w.width,color:f=w.stroke}=p,h=L(p,["name","iconNode","absoluteStrokeWidth","absolute-stroke-width","strokeWidth","stroke-width","size","color"]);return M("svg",$(_(_({},w),h),{width:d,height:d,stroke:f,"stroke-width":V(a)||V(s)||a===!0||s===!0?Number(o||c||w["stroke-width"])*24/Number(d):o||c||w["stroke-width"],class:te("lucide",h.class,...t?[`lucide-${P(ee(t))}-icon`,`lucide-${P(t)}`]:["lucide-icon"])}),[...e.map(l=>M(...l)),...u.default?[u.default()]:[]])};/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=(t,e)=>(a,{slots:s,attrs:o})=>M(se,$(_(_({},o),a),{iconNode:e,name:t}),s);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=m("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=m("dollar-sign",[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ne=m("file-text",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=m("house",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"r6nss1"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const re=m("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=m("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=m("user",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ce=m("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),de={class:"flex flex-col h-full bg-gray-50 border-r w-full md:w-64"},he=n("div",{class:"h-16 flex items-center px-6 border-b bg-white"},[n("span",{class:"text-xl font-bold text-gray-800"},"Employee Portal")],-1),ue={class:"flex-1 overflow-y-auto py-4"},pe={class:"space-y-1 px-2"},me={class:"p-4 border-t bg-white"},fe={key:0,class:"flex items-center mb-3 px-2"},xe=["src"],ye={class:"flex-1 min-w-0"},_e={class:"text-sm font-medium text-gray-900 truncate"},ve=B(" Logout "),F={setup(t){const e=I();S(()=>{k.fetch()});const a=T(()=>{var c,d,f,h,u,y,p,l;return[{name:"Dashboard",href:"/",icon:oe,current:e.path==="/"},{name:"Leave Application",href:"/leave",icon:ne,current:e.path.startsWith("/leave"),enabled:((c=k.data)==null?void 0:c.enable_leave)!==0&&((d=r.permissions)==null?void 0:d.can_leave)!==!1},{name:"Expense Claim",href:"/expense",icon:U,current:e.path.startsWith("/expense"),enabled:((f=k.data)==null?void 0:f.enable_expense_claim)!==0&&((h=r.permissions)==null?void 0:h.can_expense)!==!1},{name:"Petty Cash",href:"/petty-cash",icon:U,current:e.path.startsWith("/petty-cash"),enabled:((u=k.data)==null?void 0:u.enable_petty_cash)!==0&&((y=r.permissions)==null?void 0:y.can_petty_cash)},{name:"Attendance",href:"/attendance",icon:ae,current:e.path.startsWith("/attendance"),enabled:((p=k.data)==null?void 0:p.enable_attendance)!==0&&((l=r.permissions)==null?void 0:l.can_attendance)!==!1},{name:"Profile",href:"/profile",icon:ie,current:e.path.startsWith("/profile")}].filter(C=>C.enabled===void 0||C.enabled)}),s=()=>{r.logout()};return(o,c)=>{var f,h,u,y,p;const d=Z("router-link");return x(),v("div",de,[he,n("div",ue,[n("nav",pe,[(x(!0),v(G,null,R(i(a),l=>(x(),z(d,{key:l.name,to:l.href,onClick:c[0]||(c[0]=C=>o.$emit("item-click")),class:J(["group flex items-center px-2 py-2 text-sm font-medium rounded-md",[l.current?"bg-gray-200 text-gray-900":"text-gray-600 hover:bg-gray-50 hover:text-gray-900"]])},{default:W(()=>[(x(),z(X(l.icon),{class:"mr-3 h-5 w-5 flex-shrink-0"})),B(" "+D(l.name),1)]),_:2},1032,["to","class"]))),128))])]),n("div",me,[i(r).user?(x(),v("div",fe,[n("img",{src:((f=i(r).employee)==null?void 0:f.image)||((h=i(r).user)==null?void 0:h.user_image)||`https://ui-avatars.com/api/?name=${((u=i(r).user)==null?void 0:u.full_name)||"User"}&background=random`,class:"h-8 w-8 rounded-full mr-3 object-cover border border-gray-200",alt:"Profile"},null,8,xe),n("div",ye,[n("p",_e,D(((y=i(r).employee)==null?void 0:y.employee_name)||((p=i(r).user)==null?void 0:p.full_name)),1)])])):E("",!0),n("button",{onClick:s,class:"w-full flex items-center px-2 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"},[g(i(re),{class:"mr-3 h-5 w-5"}),ve])])])}}},ge={class:"flex h-screen overflow-hidden bg-white"},ke={key:0,class:"fixed inset-0 z-40 flex md:hidden",role:"dialog","aria-modal":"true"},we={class:"relative flex-1 flex flex-col max-w-xs w-full bg-white transition ease-in-out duration-300 transform"},be={class:"absolute top-0 right-0 -mr-12 pt-2"},Ce=n("span",{class:"sr-only"},"Close sidebar",-1),$e=n("div",{class:"flex-shrink-0 w-14","aria-hidden":"true"},null,-1),Me={class:"hidden md:flex md:flex-shrink-0"},je={class:"flex flex-col flex-1 w-0 overflow-hidden"},He={class:"md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white border-b border-gray-200 flex items-center"},Ae=n("span",{class:"sr-only"},"Open sidebar",-1),Le=n("span",{class:"ml-2 text-lg font-bold text-gray-900"},"Employee Portal",-1),ze={class:"flex-1 relative overflow-y-auto focus:outline-none"},Be={class:"py-6"},De={class:"max-w-7xl mx-auto px-4 sm:px-6 md:px-8"},Fe={setup(t){const e=Q(!1);return(a,s)=>(x(),v("div",ge,[e.value?(x(),v("div",ke,[n("div",{class:"fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity","aria-hidden":"true",onClick:s[0]||(s[0]=o=>e.value=!1)}),n("div",we,[n("div",be,[n("button",{class:"ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white",onClick:s[1]||(s[1]=o=>e.value=!1)},[Ce,g(i(ce),{class:"h-6 w-6 text-white","aria-hidden":"true"})])]),g(F,{onItemClick:s[2]||(s[2]=o=>e.value=!1)})]),$e])):E("",!0),n("div",Me,[g(F)]),n("div",je,[n("div",He,[n("button",{class:"-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500",onClick:s[3]||(s[3]=o=>e.value=!0)},[Ae,g(i(le),{class:"h-6 w-6","aria-hidden":"true"})]),Le]),n("main",ze,[n("div",Be,[n("div",De,[Y(a.$slots,"default")])])])])]))}};export{ae as C,U as D,ne as F,ie as U,Fe as _,m as c};
