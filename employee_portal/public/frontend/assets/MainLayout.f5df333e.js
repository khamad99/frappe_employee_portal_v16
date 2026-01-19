var B=Object.defineProperty,D=Object.defineProperties;var z=Object.getOwnPropertyDescriptors;var p=Object.getOwnPropertySymbols;var g=Object.prototype.hasOwnProperty,k=Object.prototype.propertyIsEnumerable;var w=(e,t,s)=>t in e?B(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s,i=(e,t)=>{for(var s in t||(t={}))g.call(t,s)&&w(e,s,t[s]);if(p)for(var s of p(t))k.call(t,s)&&w(e,s,t[s]);return e},m=(e,t)=>D(e,z(t));var C=(e,t)=>{var s={};for(var o in e)g.call(e,o)&&t.indexOf(o)<0&&(s[o]=e[o]);if(e!=null&&p)for(var o of p(e))t.indexOf(o)<0&&k.call(e,o)&&(s[o]=e[o]);return s};import{A as f,C as E,v as V,f as U,o as d,d as x,m as a,F as q,x as F,z as b,y as N,D as P,E as M,t as I,q as O,u as $,e as H,G as S}from"./vendor.d55d1341.js";import{s as T}from"./index.f3903556.js";/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Z=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,s,o)=>o?o.toUpperCase():s.toLowerCase()),G=e=>{const t=Z(e);return t.charAt(0).toUpperCase()+t.slice(1)},R=(...e)=>e.filter((t,s,o)=>Boolean(t)&&t.trim()!==""&&o.indexOf(t)===s).join(" ").trim(),L=e=>e==="";/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var h={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J=(ue,{slots:v})=>{var _=ue,{name:e,iconNode:t,absoluteStrokeWidth:s,"absolute-stroke-width":o,strokeWidth:c,"stroke-width":u,size:l=h.width,color:r=h.stroke}=_,y=C(_,["name","iconNode","absoluteStrokeWidth","absolute-stroke-width","strokeWidth","stroke-width","size","color"]);return f("svg",m(i(i({},h),y),{width:l,height:l,stroke:r,"stroke-width":L(s)||L(o)||s===!0||o===!0?Number(c||u||h["stroke-width"])*24/Number(l):c||u||h["stroke-width"],class:R("lucide",y.class,...e?[`lucide-${A(G(e))}-icon`,`lucide-${A(e)}`]:["lucide-icon"])}),[...t.map(j=>f(...j)),...v.default?[v.default()]:[]])};/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n=(e,t)=>(s,{slots:o,attrs:c})=>f(J,m(i(i({},c),s),{iconNode:t,name:e}),o);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q=n("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=n("dollar-sign",[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=n("file-text",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y=n("house",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"r6nss1"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=n("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]);/**
 * @license lucide-vue-next v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=n("user",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]),te={class:"flex flex-col h-full bg-gray-50 border-r w-64"},se=a("div",{class:"h-16 flex items-center px-6 border-b bg-white"},[a("span",{class:"text-xl font-bold text-gray-800"},"Employee Portal")],-1),oe={class:"flex-1 overflow-y-auto py-4"},ae={class:"space-y-1 px-2"},re={class:"p-4 border-t bg-white"},ne=M(" Logout "),ce={setup(e){const t=E(),s=V(()=>[{name:"Dashboard",href:"/",icon:Y,current:t.path==="/"},{name:"Leave Application",href:"/leave",icon:X,current:t.path.startsWith("/leave")},{name:"Expense Claim",href:"/expense",icon:W,current:t.path.startsWith("/expense")},{name:"Attendance",href:"/attendance",icon:Q,current:t.path.startsWith("/attendance")},{name:"Profile",href:"/profile",icon:ee,current:t.path.startsWith("/profile")}]),o=()=>{T.logout()};return(c,u)=>{const l=U("router-link");return d(),x("div",te,[se,a("div",oe,[a("nav",ae,[(d(!0),x(q,null,F($(s),r=>(d(),b(l,{key:r.name,to:r.href,class:O(["group flex items-center px-2 py-2 text-sm font-medium rounded-md",[r.current?"bg-gray-200 text-gray-900":"text-gray-600 hover:bg-gray-50 hover:text-gray-900"]])},{default:N(()=>[(d(),b(P(r.icon),{class:"mr-3 h-5 w-5 flex-shrink-0"})),M(" "+I(r.name),1)]),_:2},1032,["to","class"]))),128))])]),a("div",re,[a("button",{onClick:o,class:"w-full flex items-center px-2 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"},[H($(K),{class:"mr-3 h-5 w-5"}),ne])])])}}},le={class:"flex h-screen overflow-hidden bg-white"},ie={class:"flex flex-col flex-1 w-0 overflow-hidden"},de={class:"flex-1 relative overflow-y-auto focus:outline-none"},he={class:"py-6"},pe={class:"max-w-7xl mx-auto px-4 sm:px-6 md:px-8"},ye={setup(e){return(t,s)=>(d(),x("div",le,[H(ce),a("div",ie,[a("main",de,[a("div",he,[a("div",pe,[S(t.$slots,"default")])])])])]))}};export{Q as C,W as D,ee as U,ye as _,n as c};
