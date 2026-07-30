var TwilightPanel=(function(Ne){"use strict";var xa;const ya=customElements.define;customElements.define=function(t,e,i){if(customElements.get(t)){console.warn(`[Twilight] Custom element ${t} is already defined.`);return}ya.call(customElements,t,e,i)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const L=t=>(e,i)=>{i!==void 0?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Qe=globalThis,xi=Qe.ShadowRoot&&(Qe.ShadyCSS===void 0||Qe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,yi=Symbol(),ls=new WeakMap;let ds=class{constructor(e,i,a){if(this._$cssResult$=!0,a!==yi)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=i}get styleSheet(){let e=this.o;const i=this.t;if(xi&&e===void 0){const a=i!==void 0&&i.length===1;a&&(e=ls.get(i)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),a&&ls.set(i,e))}return e}toString(){return this.cssText}};const wa=t=>new ds(typeof t=="string"?t:t+"",void 0,yi),P=(t,...e)=>{const i=t.length===1?t[0]:e.reduce((a,s,o)=>a+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new ds(i,t,yi)},$a=(t,e)=>{if(xi)t.adoptedStyleSheets=e.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(const i of e){const a=document.createElement("style"),s=Qe.litNonce;s!==void 0&&a.setAttribute("nonce",s),a.textContent=i.cssText,t.appendChild(a)}},cs=xi?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let i="";for(const a of e.cssRules)i+=a.cssText;return wa(i)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ca,defineProperty:ka,getOwnPropertyDescriptor:Sa,getOwnPropertyNames:Da,getOwnPropertySymbols:Aa,getPrototypeOf:Ea}=Object,ne=globalThis,ps=ne.trustedTypes,Ta=ps?ps.emptyScript:"",wi=ne.reactiveElementPolyfillSupport,Re=(t,e)=>t,ti={toAttribute(t,e){switch(e){case Boolean:t=t?Ta:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=t!==null;break;case Number:i=t===null?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch{i=null}}return i}},$i=(t,e)=>!Ca(t,e),hs={attribute:!0,type:String,converter:ti,reflect:!1,useDefault:!1,hasChanged:$i};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ne.litPropertyMetadata??(ne.litPropertyMetadata=new WeakMap);let ke=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,i=hs){if(i.state&&(i.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((i=Object.create(i)).wrapped=!0),this.elementProperties.set(e,i),!i.noAccessor){const a=Symbol(),s=this.getPropertyDescriptor(e,a,i);s!==void 0&&ka(this.prototype,e,s)}}static getPropertyDescriptor(e,i,a){const{get:s,set:o}=Sa(this.prototype,e)??{get(){return this[i]},set(r){this[i]=r}};return{get:s,set(r){const l=s==null?void 0:s.call(this);o==null||o.call(this,r),this.requestUpdate(e,l,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??hs}static _$Ei(){if(this.hasOwnProperty(Re("elementProperties")))return;const e=Ea(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Re("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Re("properties"))){const i=this.properties,a=[...Da(i),...Aa(i)];for(const s of a)this.createProperty(s,i[s])}const e=this[Symbol.metadata];if(e!==null){const i=litPropertyMetadata.get(e);if(i!==void 0)for(const[a,s]of i)this.elementProperties.set(a,s)}this._$Eh=new Map;for(const[i,a]of this.elementProperties){const s=this._$Eu(i,a);s!==void 0&&this._$Eh.set(s,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const i=[];if(Array.isArray(e)){const a=new Set(e.flat(1/0).reverse());for(const s of a)i.unshift(cs(s))}else e!==void 0&&i.push(cs(e));return i}static _$Eu(e,i){const a=i.attribute;return a===!1?void 0:typeof a=="string"?a:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(i=>i(this))}addController(e){var i;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((i=e.hostConnected)==null||i.call(e))}removeController(e){var i;(i=this._$EO)==null||i.delete(e)}_$E_(){const e=new Map,i=this.constructor.elementProperties;for(const a of i.keys())this.hasOwnProperty(a)&&(e.set(a,this[a]),delete this[a]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return $a(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(i=>{var a;return(a=i.hostConnected)==null?void 0:a.call(i)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(i=>{var a;return(a=i.hostDisconnected)==null?void 0:a.call(i)})}attributeChangedCallback(e,i,a){this._$AK(e,a)}_$ET(e,i){var o;const a=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,a);if(s!==void 0&&a.reflect===!0){const r=(((o=a.converter)==null?void 0:o.toAttribute)!==void 0?a.converter:ti).toAttribute(i,a.type);this._$Em=e,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,i){var o,r;const a=this.constructor,s=a._$Eh.get(e);if(s!==void 0&&this._$Em!==s){const l=a.getPropertyOptions(s),c=typeof l.converter=="function"?{fromAttribute:l.converter}:((o=l.converter)==null?void 0:o.fromAttribute)!==void 0?l.converter:ti;this._$Em=s;const p=c.fromAttribute(i,l.type);this[s]=p??((r=this._$Ej)==null?void 0:r.get(s))??p,this._$Em=null}}requestUpdate(e,i,a,s=!1,o){var r;if(e!==void 0){const l=this.constructor;if(s===!1&&(o=this[e]),a??(a=l.getPropertyOptions(e)),!((a.hasChanged??$i)(o,i)||a.useDefault&&a.reflect&&o===((r=this._$Ej)==null?void 0:r.get(e))&&!this.hasAttribute(l._$Eu(e,a))))return;this.C(e,i,a)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,i,{useDefault:a,reflect:s,wrapped:o},r){a&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,r??i??this[e]),o!==!0||r!==void 0)||(this._$AL.has(e)||(this.hasUpdated||a||(i=void 0),this._$AL.set(e,i)),s===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var a;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,r]of this._$Ep)this[o]=r;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[o,r]of s){const{wrapped:l}=r,c=this[o];l!==!0||this._$AL.has(o)||c===void 0||this.C(o,void 0,r,c)}}let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),(a=this._$EO)==null||a.forEach(s=>{var o;return(o=s.hostUpdate)==null?void 0:o.call(s)}),this.update(i)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(i)}willUpdate(e){}_$AE(e){var i;(i=this._$EO)==null||i.forEach(a=>{var s;return(s=a.hostUpdated)==null?void 0:s.call(a)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(i=>this._$ET(i,this[i]))),this._$EM()}updated(e){}firstUpdated(e){}};ke.elementStyles=[],ke.shadowRootOptions={mode:"open"},ke[Re("elementProperties")]=new Map,ke[Re("finalized")]=new Map,wi==null||wi({ReactiveElement:ke}),(ne.reactiveElementVersions??(ne.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Oa={attribute:!0,type:String,converter:ti,reflect:!1,hasChanged:$i},Ia=(t=Oa,e,i)=>{const{kind:a,metadata:s}=i;let o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),a==="setter"&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),a==="accessor"){const{name:r}=i;return{set(l){const c=e.get.call(this);e.set.call(this,l),this.requestUpdate(r,c,t,!0,l)},init(l){return l!==void 0&&this.C(r,void 0,t,l),l}}}if(a==="setter"){const{name:r}=i;return function(l){const c=this[r];e.call(this,l),this.requestUpdate(r,c,t,!0,l)}}throw Error("Unsupported decorator location: "+a)};function h(t){return(e,i)=>typeof i=="object"?Ia(t,e,i):((a,s,o)=>{const r=s.hasOwnProperty(o);return s.constructor.createProperty(o,a),r?Object.getOwnPropertyDescriptor(s,o):void 0})(t,e,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function b(t){return h({...t,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Le=globalThis,us=t=>t,ei=Le.trustedTypes,fs=ei?ei.createPolicy("lit-html",{createHTML:t=>t}):void 0,gs="$lit$",le=`lit$${Math.random().toFixed(9).slice(2)}$`,vs="?"+le,za=`<${vs}>`,fe=document,je=()=>fe.createComment(""),He=t=>t===null||typeof t!="object"&&typeof t!="function",Ci=Array.isArray,Ma=t=>Ci(t)||typeof(t==null?void 0:t[Symbol.iterator])=="function",ki=`[ 	
\f\r]`,Ue=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,bs=/-->/g,ms=/>/g,ge=RegExp(`>|${ki}(?:([^\\s"'>=/]+)(${ki}*=${ki}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),_s=/'/g,xs=/"/g,ys=/^(?:script|style|textarea|title)$/i,ws=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),n=ws(1),Dt=ws(2),Se=Symbol.for("lit-noChange"),rt=Symbol.for("lit-nothing"),$s=new WeakMap,ve=fe.createTreeWalker(fe,129);function Cs(t,e){if(!Ci(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return fs!==void 0?fs.createHTML(e):e}const Pa=(t,e)=>{const i=t.length-1,a=[];let s,o=e===2?"<svg>":e===3?"<math>":"",r=Ue;for(let l=0;l<i;l++){const c=t[l];let p,u,g=-1,d=0;for(;d<c.length&&(r.lastIndex=d,u=r.exec(c),u!==null);)d=r.lastIndex,r===Ue?u[1]==="!--"?r=bs:u[1]!==void 0?r=ms:u[2]!==void 0?(ys.test(u[2])&&(s=RegExp("</"+u[2],"g")),r=ge):u[3]!==void 0&&(r=ge):r===ge?u[0]===">"?(r=s??Ue,g=-1):u[1]===void 0?g=-2:(g=r.lastIndex-u[2].length,p=u[1],r=u[3]===void 0?ge:u[3]==='"'?xs:_s):r===xs||r===_s?r=ge:r===bs||r===ms?r=Ue:(r=ge,s=void 0);const f=r===ge&&t[l+1].startsWith("/>")?" ":"";o+=r===Ue?c+za:g>=0?(a.push(p),c.slice(0,g)+gs+c.slice(g)+le+f):c+le+(g===-2?l:f)}return[Cs(t,o+(t[i]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),a]};class Be{constructor({strings:e,_$litType$:i},a){let s;this.parts=[];let o=0,r=0;const l=e.length-1,c=this.parts,[p,u]=Pa(e,i);if(this.el=Be.createElement(p,a),ve.currentNode=this.el.content,i===2||i===3){const g=this.el.content.firstChild;g.replaceWith(...g.childNodes)}for(;(s=ve.nextNode())!==null&&c.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const g of s.getAttributeNames())if(g.endsWith(gs)){const d=u[r++],f=s.getAttribute(g).split(le),v=/([.?@])?(.*)/.exec(d);c.push({type:1,index:o,name:v[2],strings:f,ctor:v[1]==="."?Ra:v[1]==="?"?La:v[1]==="@"?ja:ii}),s.removeAttribute(g)}else g.startsWith(le)&&(c.push({type:6,index:o}),s.removeAttribute(g));if(ys.test(s.tagName)){const g=s.textContent.split(le),d=g.length-1;if(d>0){s.textContent=ei?ei.emptyScript:"";for(let f=0;f<d;f++)s.append(g[f],je()),ve.nextNode(),c.push({type:2,index:++o});s.append(g[d],je())}}}else if(s.nodeType===8)if(s.data===vs)c.push({type:2,index:o});else{let g=-1;for(;(g=s.data.indexOf(le,g+1))!==-1;)c.push({type:7,index:o}),g+=le.length-1}o++}}static createElement(e,i){const a=fe.createElement("template");return a.innerHTML=e,a}}function De(t,e,i=t,a){var r,l;if(e===Se)return e;let s=a!==void 0?(r=i._$Co)==null?void 0:r[a]:i._$Cl;const o=He(e)?void 0:e._$litDirective$;return(s==null?void 0:s.constructor)!==o&&((l=s==null?void 0:s._$AO)==null||l.call(s,!1),o===void 0?s=void 0:(s=new o(t),s._$AT(t,i,a)),a!==void 0?(i._$Co??(i._$Co=[]))[a]=s:i._$Cl=s),s!==void 0&&(e=De(t,s._$AS(t,e.values),s,a)),e}class Na{constructor(e,i){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:i},parts:a}=this._$AD,s=((e==null?void 0:e.creationScope)??fe).importNode(i,!0);ve.currentNode=s;let o=ve.nextNode(),r=0,l=0,c=a[0];for(;c!==void 0;){if(r===c.index){let p;c.type===2?p=new Fe(o,o.nextSibling,this,e):c.type===1?p=new c.ctor(o,c.name,c.strings,this,e):c.type===6&&(p=new Ha(o,this,e)),this._$AV.push(p),c=a[++l]}r!==(c==null?void 0:c.index)&&(o=ve.nextNode(),r++)}return ve.currentNode=fe,s}p(e){let i=0;for(const a of this._$AV)a!==void 0&&(a.strings!==void 0?(a._$AI(e,a,i),i+=a.strings.length-2):a._$AI(e[i])),i++}}class Fe{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,i,a,s){this.type=2,this._$AH=rt,this._$AN=void 0,this._$AA=e,this._$AB=i,this._$AM=a,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=i.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,i=this){e=De(this,e,i),He(e)?e===rt||e==null||e===""?(this._$AH!==rt&&this._$AR(),this._$AH=rt):e!==this._$AH&&e!==Se&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ma(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==rt&&He(this._$AH)?this._$AA.nextSibling.data=e:this.T(fe.createTextNode(e)),this._$AH=e}$(e){var o;const{values:i,_$litType$:a}=e,s=typeof a=="number"?this._$AC(e):(a.el===void 0&&(a.el=Be.createElement(Cs(a.h,a.h[0]),this.options)),a);if(((o=this._$AH)==null?void 0:o._$AD)===s)this._$AH.p(i);else{const r=new Na(s,this),l=r.u(this.options);r.p(i),this.T(l),this._$AH=r}}_$AC(e){let i=$s.get(e.strings);return i===void 0&&$s.set(e.strings,i=new Be(e)),i}k(e){Ci(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let a,s=0;for(const o of e)s===i.length?i.push(a=new Fe(this.O(je()),this.O(je()),this,this.options)):a=i[s],a._$AI(o),s++;s<i.length&&(this._$AR(a&&a._$AB.nextSibling,s),i.length=s)}_$AR(e=this._$AA.nextSibling,i){var a;for((a=this._$AP)==null?void 0:a.call(this,!1,!0,i);e!==this._$AB;){const s=us(e).nextSibling;us(e).remove(),e=s}}setConnected(e){var i;this._$AM===void 0&&(this._$Cv=e,(i=this._$AP)==null||i.call(this,e))}}class ii{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,i,a,s,o){this.type=1,this._$AH=rt,this._$AN=void 0,this.element=e,this.name=i,this._$AM=s,this.options=o,a.length>2||a[0]!==""||a[1]!==""?(this._$AH=Array(a.length-1).fill(new String),this.strings=a):this._$AH=rt}_$AI(e,i=this,a,s){const o=this.strings;let r=!1;if(o===void 0)e=De(this,e,i,0),r=!He(e)||e!==this._$AH&&e!==Se,r&&(this._$AH=e);else{const l=e;let c,p;for(e=o[0],c=0;c<o.length-1;c++)p=De(this,l[a+c],i,c),p===Se&&(p=this._$AH[c]),r||(r=!He(p)||p!==this._$AH[c]),p===rt?e=rt:e!==rt&&(e+=(p??"")+o[c+1]),this._$AH[c]=p}r&&!s&&this.j(e)}j(e){e===rt?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Ra extends ii{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===rt?void 0:e}}class La extends ii{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==rt)}}class ja extends ii{constructor(e,i,a,s,o){super(e,i,a,s,o),this.type=5}_$AI(e,i=this){if((e=De(this,e,i,0)??rt)===Se)return;const a=this._$AH,s=e===rt&&a!==rt||e.capture!==a.capture||e.once!==a.once||e.passive!==a.passive,o=e!==rt&&(a===rt||s);s&&this.element.removeEventListener(this.name,this,a),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var i;typeof this._$AH=="function"?this._$AH.call(((i=this.options)==null?void 0:i.host)??this.element,e):this._$AH.handleEvent(e)}}class Ha{constructor(e,i,a){this.element=e,this.type=6,this._$AN=void 0,this._$AM=i,this.options=a}get _$AU(){return this._$AM._$AU}_$AI(e){De(this,e)}}const Si=Le.litHtmlPolyfillSupport;Si==null||Si(Be,Fe),(Le.litHtmlVersions??(Le.litHtmlVersions=[])).push("3.3.2");const Ua=(t,e,i)=>{const a=(i==null?void 0:i.renderBefore)??e;let s=a._$litPart$;if(s===void 0){const o=(i==null?void 0:i.renderBefore)??null;a._$litPart$=s=new Fe(e.insertBefore(je(),o),o,void 0,i??{})}return s._$AI(t),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const be=globalThis;class B extends ke{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var i;const e=super.createRenderRoot();return(i=this.renderOptions).renderBefore??(i.renderBefore=e.firstChild),e}update(e){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ua(i,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return Se}}B._$litElement$=!0,B.finalized=!0,(xa=be.litElementHydrateSupport)==null||xa.call(be,{LitElement:B});const Di=be.litElementPolyfillSupport;Di==null||Di({LitElement:B}),(be.litElementVersions??(be.litElementVersions=[])).push("4.2.2");var Ba=Object.defineProperty,Fa=Object.getOwnPropertyDescriptor,Ai=(t,e,i,a)=>{for(var s=a>1?void 0:a?Fa(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Ba(e,i,s),s};let We=class extends B{constructor(){super(...arguments),this.activeTab="analytics",this.tabs=[]}connectedCallback(){super.connectedCallback(),this.setAttribute("role","tablist")}render(){return this.tabs.map(t=>n`
        <button
          class="tab-btn ${t.id===this.activeTab?"active":""}"
          role="tab"
          aria-selected=${t.id===this.activeTab?"true":"false"}
          @click=${()=>this._handleTabClick(t.id)}
        >
          <span class="tab-label">${t.label}</span>
        </button>
      `)}_handleTabClick(t){this.dispatchEvent(new CustomEvent("tab-changed",{detail:t,bubbles:!0,composed:!0}))}};We.styles=P`
    :host {
      display: flex;
      gap: 0;
      flex-shrink: 0;
      white-space: nowrap;
    }
    .tab-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      color: var(--secondary-text-color);
      border: none;
      border-bottom: 2px solid transparent;
      padding: 0 16px;
      height: 56px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      cursor: pointer;
      transition: color 0.2s, border-color 0.2s;
    }
    .tab-btn:hover {
      color: var(--primary-text-color);
    }
    .tab-btn.active {
      color: var(--primary-text-color);
      border-bottom-color: var(--accent-color);
    }
  `,Ai([h({type:String})],We.prototype,"activeTab",2),Ai([h({type:Array})],We.prototype,"tabs",2),We=Ai([L("twilight-tab-bar")],We);const A="primary",Wa=3,Ei=10,ks=10,si={night:"#141926",astro:"#1e2e45",nautical:"#2c4268",civil:"#3d5c8a",gold:"#bfb39b",day:"#8ab0cd"},Ti=["astro_dawn","nautical_dawn","civil_dawn","gold_dawn","day","gold_dusk","civil_dusk","nautical_dusk","astro_dusk","night"],Oi={astro_dawn:"Astronomical dawn",nautical_dawn:"Nautical dawn",civil_dawn:"Civil dawn",gold_dawn:"Golden dawn",day:"Day",gold_dusk:"Golden dusk",civil_dusk:"Civil dusk",nautical_dusk:"Nautical dusk",astro_dusk:"Astronomical dusk",night:"Night"},gi=class gi extends CustomEvent{constructor(e){super(gi.eventName,{detail:e,bubbles:!0,composed:!0})}};gi.eventName="sensors-changed";let Ii=gi;const vi=class vi extends CustomEvent{constructor(e){super(vi.eventName,{detail:{inputs:e},bubbles:!0,composed:!0})}};vi.eventName="inputs-changed";let zi=vi;const bi=class bi extends CustomEvent{constructor(e){super(bi.eventName,{detail:e,bubbles:!0,composed:!0})}};bi.eventName="activities-changed";let Mi=bi;const mi=class mi extends CustomEvent{constructor(e){super(mi.eventName,{detail:e,bubbles:!0,composed:!0})}};mi.eventName="rules-changed";let Pi=mi;const _i=class _i extends CustomEvent{constructor(e,i){super(_i.eventName,{detail:{slots:e,transitionOnSeconds:i},bubbles:!0,composed:!0})}};_i.eventName="slots-changed";let Ni=_i;function qa(t,e){return e.simCritical?{label:"Critical Alarm",color:"#d32f2f",class:"fast-blink-glow",sub:"Simulation: Smoke / Panic Alarm"}:e.simError?{label:"System Error",color:"var(--error-color, #f44336)",class:"blink-glow",sub:"Simulation: Device Offline"}:e.simSensorOffline?{label:"Sensor Offline",color:"#ff5722",class:"fast-pulse-glow",sub:"Simulation: Ambient Sensor Failure"}:e.simWarning?{label:"System Warning",color:"var(--warning-color, #ff9800)",class:"pulse-glow",sub:"Simulation: Low Illuminance"}:(t==null?void 0:t.active_activity)==="sleep"?{label:"Sleeping",color:"#3f51b5",class:"static-glow",sub:"Sleep Mode Active"}:{label:"Running / Auto",color:"var(--success-color, #4caf50)",class:"static-glow",sub:"Automatic Mode"}}function me(t){const e=(Math.round(t)%1440+1440)%1440;return`${String(Math.floor(e/60)).padStart(2,"0")}:${String(e%60).padStart(2,"0")}`}function Va(t){return t.startType==="fixed"?t.fixedStartTime||"12:00":t.startEvent||"civil_dawn"}function Ri(t){const e=t.to-t.from;return e>=1440?1440:e<=0?e+1440:e}function Ae(t,e){const i=a=>(a%1440+1440)%1440;return i(e-i(t.from))<Ri(t)}function Li(t,e){var a;const i=(a=t==null?void 0:t.states[e])==null?void 0:a.attributes;return(i==null?void 0:i.friendly_name)??(i==null?void 0:i.name)??e}function qe(t,e){if(!t||t.length===0)return[];const i=[],a=t.length;for(let s=0;s<a;s++){const o=t[s],r=a===1?o.start+1440:s<a-1?t[s+1].start:t[0].start+1440,l=e==null?void 0:e.find(d=>d.id===o.id),c=(l==null?void 0:l.start_type)==="fixed",p=(l==null?void 0:l.zone)||o.id;let u=p;["civil_dawn","civil_dusk"].includes(u)?u="civil":["nautical_dawn","nautical_dusk"].includes(u)?u="nautical":["astro_dawn","astro_dusk"].includes(u)?u="astro":["gold_dawn","gold_dusk"].includes(u)&&(u="gold");const g=si[u]||si.day;i.push({id:o.id,label:(l==null?void 0:l.name)||Oi[o.id]||o.id,color:g,from:o.start,to:r,scene:(l==null?void 0:l.scene_entity_id)||null,isCustom:!Ti.includes(o.id),startType:c?"fixed":"astral",startEvent:c?void 0:p,startOffset:(l==null?void 0:l.offset_minutes)||0,fixedStartTime:c&&(l==null?void 0:l.fixed_time)||void 0})}return i}function Ya(t){if(t.length===0)return"var(--divider-color)";const e=s=>(s%1440+1440)%1440,i=[...t].sort((s,o)=>e(s.from)-e(o.from)),a=[];e(i[0].from)>0&&a.push(`${i[i.length-1].color} 0%`);for(const s of i){const o=(e(s.from)/1440*100).toFixed(1),r=(e(s.to)/1440*100).toFixed(1);a.push(`${s.color} ${o}%`),a.push(`${s.color} ${e(s.from)>e(s.to)?"100":r}%`)}return`linear-gradient(to right, ${a.join(", ")})`}async function ai(){if(!customElements.get("ha-entity-picker"))try{if(window.loadCardHelpers){const t=await window.loadCardHelpers();if(t){if(t.createCardElement){const e=await t.createCardElement({type:"entities",entities:[]});e&&e.getConfigElement&&await e.getConfigElement()}if(!customElements.get("ha-entity-picker")&&t.createRowElement){const e=await t.createRowElement({type:"attribute"});e&&e.getConfigElement&&await e.getConfigElement()}}}if(!customElements.get("ha-entity-picker")){const t=customElements.get("hui-glance-card");t&&t.getConfigElement&&await t.getConfigElement()}}catch(t){console.warn("[Twilight] Failed to preload HA entity picker:",t)}}function ji(t,e,i){const a=window.devicePixelRatio||1,s=Math.round(e*a),o=Math.round(i*a);(t.width!==s||t.height!==o)&&(t.width=s,t.height=o);const r=t.getContext("2d");return r.clearRect(0,0,s,o),r.save(),r.scale(a,a),r}var Ga=Object.defineProperty,Ee=(t,e,i,a)=>{for(var s=void 0,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=r(e,i,s)||s);return s&&Ga(e,i,s),s};class _e extends B{constructor(){super(...arguments),this.narrow=!1,this.tabs=[],this.panel=null,this._activeTab="areas",this._hass=null,this._globalConfigOverride=null}connectedCallback(){super.connectedCallback(),ai()}createRenderRoot(){return this}get hass(){return this._hass}set hass(e){this._hass=e}render(){var e;return n`
      <style>
        twilight-panel, twilight-dev-panel {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          background: var(--secondary-background-color);
          color: var(--primary-text-color);
          --font-family: var(--ha-font-family, var(--paper-font-body1_-_font-family, system-ui, sans-serif));
          font-family: var(--font-family);
          --tp-accent: var(--accent-color, #e91e8c);
          --tp-border: var(--divider-color, rgba(255,255,255,0.1));
        }

        twilight-panel *, twilight-dev-panel * { box-sizing: border-box; }

        .tp-header {
          background: var(--secondary-background-color);
          flex-shrink: 0;
          z-index: 10;
        }

        .tp-header-inner {
          padding: 0 24px;
          display: flex;
          align-items: center;
          gap: 32px;
          height: 56px;
        }

        .tp-menu-btn-wrap {
          margin: 0 -20px;
        }

        .tp-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 20px;
          font-weight: 500;
          white-space: nowrap;
          color: var(--primary-text-color);
        }

        .tp-title-icon {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          object-fit: cover;
        }

        .tp-badge {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.5px;
          padding: 2px 8px;
          border-radius: 12px;
          border: 1.5px solid #e04f32;
          color: #e04f32;
          background: rgba(224, 79, 50, 0.1);
          line-height: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          vertical-align: middle;
          margin-left: 4px;
          margin-top: -2px;
          box-shadow: 0 0 6px rgba(224, 79, 50, 0.15);
        }

        .tp-tabs {
          flex: 1;
          height: 100%;
          display: flex;
          align-items: flex-end;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .tp-tabs::-webkit-scrollbar { display: none; }

        .tp-content {
          flex: 1;
          min-height: 0;
          overflow: auto;
          display: flex;
          flex-direction: column;
        }

        .view-container {
          display: none;
          flex: 1;
          min-height: 0;
        }

        .view-container.active {
          display: flex;
          flex-direction: column;
        }
      </style>

      <div class="tp-header">
        <div class="tp-header-inner">
          ${this.narrow?n`<div class="tp-menu-btn-wrap"><ha-menu-button .hass=${this._hass} .narrow=${this.narrow}></ha-menu-button></div>`:n`
          <div class="tp-title">
            <img class="tp-title-icon" src="/twilight/logo.png" alt="Twilight">
            <span>Twilight</span>
            ${((e=this.panel)==null?void 0:e.url_path)==="twilight_dev"?n`<span class="tp-badge">dev</span>`:n`<span class="tp-badge">experimental</span>`}
          </div>`}
          <div class="tp-tabs">
            <twilight-tab-bar
              .activeTab=${this._activeTab}
              .tabs=${this.tabs}
              @tab-changed=${i=>this._activeTab=i.detail}
            ></twilight-tab-bar>
          </div>
        </div>
      </div>
      <div class="tp-content">
        ${this._renderViews()}
      </div>
    `}_renderViews(){const e=this._activeTab;return n`
      ${e==="areas"&&this._isTabAvailable("areas")?n`
        <twilight-areas-view
          class="view-container active"
          .hass=${this._hass}
          .globalConfigOverride=${this._globalConfigOverride}
        ></twilight-areas-view>
      `:""}
      ${e==="analytics"&&this._isTabAvailable("analytics")?n`
        <twilight-analytics-view
          class="view-container active"
          .hass=${this._hass}
        ></twilight-analytics-view>
      `:""}
      ${e==="timeline"&&this._isTabAvailable("timeline")?n`
        <twilight-timeline-view
          class="view-container active"
          .hass=${this._hass}
        ></twilight-timeline-view>
      `:""}
      ${e==="settings"&&this._isTabAvailable("settings")?n`
        <twilight-settings-view
          class="view-container active"
          .hass=${this._hass}
          @global-changed=${this._onGlobalChanged}
        ></twilight-settings-view>
      `:""}
      ${e==="lab"&&this._isTabAvailable("lab")?n`
        <twilight-lab-view
          class="view-container active"
          .hass=${this._hass}
        ></twilight-lab-view>
      `:""}
      ${e==="lab-two"&&this._isTabAvailable("lab-two")?n`
        <twilight-lab-two-view
          class="view-container active"
          .hass=${this._hass}
        ></twilight-lab-two-view>
      `:""}
    `}_isTabAvailable(e){return this.tabs.some(i=>i.id===e)}_onGlobalChanged(e){this._globalConfigOverride=e.detail}}Ee([h({type:Boolean})],_e.prototype,"narrow"),Ee([h({type:Array})],_e.prototype,"tabs"),Ee([h({type:Object})],_e.prototype,"panel"),Ee([b()],_e.prototype,"_activeTab"),Ee([b()],_e.prototype,"_hass"),Ee([b()],_e.prototype,"_globalConfigOverride");function oi(t){return t.callWS({type:"twilight/areas/list"})}function Xa(t){return t.callWS({type:"twilight/area_registry/list"})}function Ss(t,e){return t.callWS({type:"twilight/areas/new_draft",area_id:e})}function Ka(t,e){return t.callWS({type:"twilight/area/save",...e})}function Za(t,e){return t.callWS({type:"twilight/area/delete",area_id:e})}function Ja(t,e){const i={type:"twilight/area/extracted"};return e&&(i.area_id=e),t.callWS(i)}function Qa(t,e){return t.callWS({type:"twilight/lab/area_entities",area_id:e})}function Ds(t){return t.callWS({type:"twilight/global/get"})}function As(t,e){return t.callWS({type:"twilight/global/save",config:e})}function to(t){return t.callWS({type:"twilight/global/export"})}function Es(t,e){return t.callWS({type:"twilight/global/import",payload:e})}function eo(t){return t.callWS({type:"twilight/global/defaults"})}function Hi(t,e){return t.callWS({type:"twilight/placeholder_defaults",...e?{area_id:e}:{}})}function Ui(t,e){return t.callWS({type:"twilight/sun/day",...e})}function Ts(t,e){return t.callWS({type:"twilight/sun/year",...e})}function Os(t,e){return t.callWS({type:"twilight/area/slot_times",...e})}function Bi(t,e){return t.callWS({type:"twilight/slot_times/preview",...e})}function io(t,e){return t.callWS({type:"twilight/timeline/slot_times",...e})}function so(t,e){return t.callWS({type:"twilight/analytics/get",...e})}function ao(t,e){return t.callWS({type:"twilight/trigger_input",...e})}function Is(t,e){return t.callWS({type:"twilight/heatmap/profile/save",...e})}function oo(t,e){return t.callWS({type:"twilight/heatmap/profile/delete",...e})}class zs{constructor(e,i={}){this.original=null,this.draft=null,this.saving=!1,this.loading=!1,this.saveError=null,this.isDirty=!1,this._host=e,this._options=i,this._host.addController(this)}hostConnected(){}hostDisconnected(){}init(e){this.original=structuredClone(e),this.draft=structuredClone(e),this.isDirty=!1,this._host.requestUpdate()}update(e){this.draft&&(typeof e=="function"?e(this.draft):this.draft={...this.draft,...e},this.isDirty=!0,this._host.requestUpdate())}async save(){if(!(!this.draft||this.saving)){this.saving=!0,this.saveError=null,this._host.requestUpdate();try{if(this._options.onSave){const e=await this._options.onSave(this.draft);e!==void 0&&(this.draft=e)}this.original=structuredClone(this.draft),this.isDirty=!1}catch(e){console.error("Error saving draft",e),this.saveError=e}finally{this.saving=!1,this._host.requestUpdate()}}}cancel(){this.original&&(this.draft=structuredClone(this.original),this.isDirty=!1,this._host.requestUpdate())}reset(){this.original=null,this.draft=null,this.saving=!1,this.loading=!1,this.saveError=null,this.isDirty=!1,this._host.requestUpdate()}}class ri{constructor(e){this._ticker=null,this.liveMins=0,this.host=e,e.addController(this),this._updateTime()}hostConnected(){this._ticker=setInterval(()=>{this._updateTime(),this.host.requestUpdate()},15e3)}hostDisconnected(){this._ticker&&(clearInterval(this._ticker),this._ticker=null)}_updateTime(){const e=new Date;this.liveMins=e.getHours()*60+e.getMinutes()}}const Ms=!1,Ps="none";function Fi(t,e){const i=t.lux_threshold!==null&&t.lux_threshold!==void 0?t.lux_threshold:(e==null?void 0:e.lux_threshold)??30,a=t.lux_watch_window!==null&&t.lux_watch_window!==void 0?t.lux_watch_window:(e==null?void 0:e.lux_watch_window)??10,s=t.lux_ignore_active!==null&&t.lux_ignore_active!==void 0?t.lux_ignore_active:Ms,o=t.lux_ignore_scope!==null&&t.lux_ignore_scope!==void 0?t.lux_ignore_scope:Ps;return{threshold:i,watch:a,ignoreActive:s,ignoreScope:o}}function ni(t){const e=`lux ≤ ${t.threshold} lx`+(t.watch?` (watch: ${t.watch}s)`:""),i=[t.ignoreActive?"ignore when active":"",t.ignoreScope==="twilight_slots"?"ignore twilight/night":"",t.ignoreScope==="all_slots"?"ignore lux (all slots)":""].filter(Boolean).join(", ");return`${e}${i?` · ${i}`:""}`}function li(t,e){const i=t.entity_ids??[];if(i.length===0)return{friendlyName:"No entities configured",subText:"—"};const a=i.map(r=>{var l,c;return((c=(l=e==null?void 0:e.states[r])==null?void 0:l.attributes)==null?void 0:c.friendly_name)??r});let s=a.join(", ");s.length>35&&a.length>1&&(s=`${a[0]} + ${a.length-1} more`);let o=i.join(", ");if(o.length>50&&i.length>1&&(o=`${i[0]} + ${i.length-1} more`),t.type==="motion"){const r=t.retrigger??"every";o+=` [retrigger: ${r}]`}else if(i.length>=2&&t.type==="binary"){const r=t.aggregation??"any",l=r==="count"?`count:${t.aggregation_count??1}`:r;o+=` [combine: ${l}]`}return{friendlyName:s,subText:o}}function At(t,e){if(t.name&&t.name.trim())return t.name.trim();if(t.label&&t.label.trim())return t.label.trim();if(t.entity_ids&&t.entity_ids.length>0&&e){const{friendlyName:i}=li(t,e);if(i&&i!=="No entities configured")return i}return t.type==="motion"?"Motion Sensor":t.type==="event"?"Event Input":t.type==="binary"?"Binary Input":t.type==="button"?"Button":t.type==="timer"?"Daily Timer":t.id}function Ns(t){const e=t.trim();if(e==="")return null;const i=e.split(":");if(i.length<1||i.length>3||!i.every(r=>/^\d+$/.test(r)))return null;const[a,s=0,o=0]=i.map(r=>parseInt(r,10));return a>23||s>59||o>59?null:[a,s,o]}function ro(t){const e=Ns(t);if(e===null)return null;const i=a=>String(a).padStart(2,"0");return`${i(e[0])}:${i(e[1])}:${i(e[2])}`}function Wi(t){return t.trim()===""||Ns(t)!==null}function no(t,e,i){return t.map(s=>{if(s==="no_entity")return"No entity configured";if(s==="user")return"Disabled by user";if(s.startsWith("activity:")){const o=s.substring(9),r=i==null?void 0:i.find(l=>l.id===o);return`Disabled by Activity: ${(r==null?void 0:r.name)||(r==null?void 0:r.id)||o}`}if(s.startsWith("rule:")){const o=s.substring(5),r=e==null?void 0:e.find(l=>l.id===o);return`Disabled by Rule: ${(r==null?void 0:r.name)||(r==null?void 0:r.id)||o}`}return s}).join(", ")}const de=P`
  .activity-badge {
    font-size: 11px;
    font-weight: 600;
    border-radius: 12px;
    padding: 2px 10px;
    text-transform: capitalize;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    box-sizing: border-box;
  }
  .activity-badge.slot {
    background: rgba(25, 118, 210, 0.9);
    border: 1px solid rgba(25, 118, 210, 0.95);
    color: #fff;
  }
  .activity-badge.entity {
    background: rgba(142, 36, 170, 0.9);
    border: 1px solid rgba(142, 36, 170, 0.95);
    color: #fff;
  }
  .activity-badge.light {
    background: rgba(230, 160, 0, 0.9);
    border: 1px solid rgba(230, 160, 0, 0.95);
    color: #fff;
  }
  .activity-badge.none {
    background: rgba(96, 112, 120, 0.9);
    border: 1px solid rgba(96, 112, 120, 0.95);
    color: #fff;
  }
  .activity-badge.reset {
    background: rgba(211, 47, 47, 0.9);
    border: 1px solid rgba(211, 47, 47, 0.95);
    color: #fff;
  }
  .activity-badge.rule {
    background: rgba(230, 160, 0, 0.9);
    border: 1px solid rgba(230, 160, 0, 0.95);
    color: #fff;
    border-radius: 4px;
  }
  .activity-badge.simulation {
    background: rgba(0, 121, 107, 0.9);
    border: 1px solid rgba(0, 121, 107, 0.95);
    color: #fff;
  }
  .activity-badge.block {
    background: rgba(79, 70, 229, 0.9);
    border: 1px solid rgba(79, 70, 229, 0.95);
    color: #fff;
  }
  .activity-badge.turn_off {
    background: rgba(220, 38, 38, 0.9);
    border: 1px solid rgba(220, 38, 38, 0.95);
    color: #fff;
  }
`,Zt=P`
  .card-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--dot-color, var(--accent-color, #3b82f6));
    box-shadow: 0 0 6px var(--dot-color, var(--accent-color, #3b82f6));
    flex-shrink: 0;
    display: inline-block;
  }
`,qi=P`
  :host {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    box-sizing: border-box;
    font-family: var(--font-family, inherit);
  }
`,Ve=P`
  .view-header-container {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    min-height: 64px;
    padding: 12px 24px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
    scrollbar-color: color-mix(in srgb, var(--primary-text-color, #fff) 20%, transparent) transparent;
  }
  .view-header-container::-webkit-scrollbar {
    height: 4px;
  }
  .view-header-container::-webkit-scrollbar-track {
    background: transparent;
  }
  .view-header-container::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--primary-text-color, #fff) 20%, transparent);
    border-radius: 4px;
  }
  .view-header-container::-webkit-scrollbar-thumb:hover {
    background: color-mix(in srgb, var(--primary-text-color, #fff) 40%, transparent);
  }
  .view-header-container > * {
    min-width: max-content;
  }
`,Rs=P`
  .detail-footer {
    position: sticky;
    bottom: 0;
    background: var(--primary-background-color);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding: 12px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    z-index: 10;
  }
  .save-status {
    font-size: 13px;
    color: var(--secondary-text-color);
  }
  .btn-cancel {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    color: var(--secondary-text-color);
    cursor: pointer;
    padding: 8px 20px;
    font-size: 14px;
    transition: background 0.15s, color 0.15s;
  }
  .btn-cancel:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--primary-text-color);
  }
  .btn-save {
    background: var(--tp-accent, var(--accent-color, #e91e8c));
    color: white;
    border: none;
    padding: 8px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .btn-save:hover {
    opacity: 0.85;
  }
  .btn-save:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`,Et=P`
  .overlay {
    position: fixed;
    inset: 0;
    background: var(--dialog-backdrop-color, rgba(0, 0, 0, 0.6));
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }
  .edit-panel, .modal-card {
    background: var(--primary-background-color, #14141f);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-radius: 16px;
    border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 12%, transparent));
    width: 95vw;
    max-width: 1150px;
    max-height: calc(100vh - 96px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: var(--ha-card-box-shadow, 0 24px 64px rgba(0, 0, 0, 0.5));
    box-sizing: border-box;
  }
  /* Content-driven width for table/list panels: grows with the widest row,
     never below min-width, never wider than the viewport allows. */
  .edit-panel.list-panel {
    width: fit-content;
    min-width: min(750px, 95vw);
    max-width: 95vw;
  }
  .panel-header, .modal-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 24px;
    background: var(--secondary-background-color, #1c1a26);
    border-bottom: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 8%, transparent));
    flex-shrink: 0;
    box-sizing: border-box;
  }
  .panel-header-icon {
    font-size: 20px;
    opacity: 0.7;
  }
  .card-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--dot-color, var(--accent-color, #3b82f6));
    box-shadow: 0 0 6px var(--dot-color, var(--accent-color, #3b82f6));
    flex-shrink: 0;
    display: inline-block;
  }

  /* Unified Configuration Table Styles */
  .config-table {
    width: 100%;
    border-collapse: collapse;
  }
  .config-table th {
    text-align: left;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--secondary-text-color);
    padding: 6px 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .config-table td {
    padding: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    vertical-align: middle;
    font-size: 13px;
  }
  .config-table tr:hover {
    background: rgba(255, 255, 255, 0.015);
  }
  .config-table tr.dragging {
    opacity: 0.4;
    background: rgba(255, 255, 255, 0.08);
  }
  .config-table .drag-handle {
    cursor: grab;
    user-select: none;
    color: var(--secondary-text-color);
    opacity: 0.4;
    font-size: 15px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    transition: opacity 0.15s, color 0.15s;
  }
  .config-table .drag-handle:hover {
    opacity: 1;
    color: var(--primary-text-color);
  }
  .panel-header-title, .modal-title {
    flex: 1;
    font-size: 16px;
    font-weight: 600;
    color: var(--primary-text-color);
    margin: 0;
  }
  .panel-close {
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--secondary-text-color);
    font-size: 22px;
    line-height: 1;
    padding: 4px 8px;
    border-radius: 6px;
    box-sizing: border-box;
  }
  .panel-close:hover {
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    color: var(--primary-text-color);
  }
  .panel-body, .modal-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-sizing: border-box;
  }
  .panel-footer, .modal-footer {
    padding: 16px 24px;
    background: var(--secondary-background-color, #1c1a26);
    border-top: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 8%, transparent));
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    flex-shrink: 0;
    box-sizing: border-box;
  }
  .btn-cancel-dialog {
    background: transparent;
    border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 12%, transparent));
    border-radius: 8px;
    color: var(--secondary-text-color);
    cursor: pointer;
    padding: 10px 24px;
    font-size: 13px;
    font-weight: 600;
    transition: background 0.15s, color 0.15s;
    box-sizing: border-box;
  }
  .btn-cancel-dialog:hover {
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    color: var(--primary-text-color);
  }
  .btn-save-dialog {
    background: var(--tp-accent, var(--accent-color, #e91e8c));
    color: white;
    border: none;
    padding: 10px 28px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s;
    box-sizing: border-box;
  }
  .btn-save-dialog:hover {
    opacity: 0.85;
  }
  .btn-save-dialog:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;var lo=Object.defineProperty,co=Object.getOwnPropertyDescriptor,ct=(t,e,i,a)=>{for(var s=a>1?void 0:a?co(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&lo(e,i,s),s};let nt=class extends B{constructor(){super(...arguments),this._clock=new ri(this),this.hass=null,this.slots=[],this.inputs=[],this.activitiesConfig=[],this.noHeader=!1,this.runState=null,this.areaEnabled=!0,this.channels={},this.channelSlotsMap={},this.simCritical=!1,this.simError=!1,this.simSensorOffline=!1,this.simWarning=!1,this.entities=[]}_activityCountdown(t){if(t.activity_expire_frozen_seconds!==void 0&&t.activity_expire_frozen_seconds!==null){const o=Math.round(t.activity_expire_frozen_seconds),r=Math.floor(o/60),l=o%60;return`Paused (${r>0?`${r}m ${l}s`:`${l}s`})`}if(!t.activity_expires_at)return null;const e=new Date(t.activity_expires_at).getTime()-Date.now();if(e<=0)return null;const i=Math.ceil(e/1e3),a=Math.floor(i/60),s=i%60;return a>0?`${a}m ${s}s`:`${s}s`}_runStateEngineInfo(t){const e=t.scene_activated_at!==null,i=t.active_activity;if(i){const a=(this.activitiesConfig||[]).find(p=>p.id===i),s=(a==null?void 0:a.name)||i.charAt(0).toUpperCase()+i.slice(1),o=t.activity_trigger,r=o!=null&&o.input_id?this.inputs.find(p=>p.id===o.input_id):void 0,l=r?At(r,this.hass):o==null?void 0:o.input_id,c=o!=null&&o.input_id?`via ${l}${o.entity_id?` (${o.entity_id})`:""}`:"";return{label:s,color:"#9c27b0",class:"pulse-glow",sub:c}}return{label:e?"Scene Active":"Idle",color:e?"#4caf50":"#2196f3",class:"entity-indicator",sub:e?"Scene switched by engine":"Waiting for input"}}render(){if(!this.sensorConfig)return n``;const t=this._clock.liveMins,e=this.runState,i=Object.keys(this.channels||{}).sort((r,l)=>r===A?-1:l===A?1:0),a=i.length>0?i:[A],s={simCritical:this.simCritical,simError:this.simError,simSensorOffline:this.simSensorOffline,simWarning:this.simWarning},o=this.areaEnabled?e?this._runStateEngineInfo(e):qa(this.runState,s):{label:"Disabled",color:"#888888",class:"entity-indicator",sub:"Engine inactive"};return n`
      <div class="status-card">
        ${this.noHeader?"":n`
          <div class="status-header">
            <span class="card-dot" style="--dot-color: #06b6d4;"></span>
            <span class="status-title">Engine Live Monitor</span>
            <span style="font-size:11px; color:var(--secondary-text-color)">Live updating</span>
          </div>
        `}
        <div class="status-grid">
          <!-- Widget 1: Active Timeslots -->
          <div class="status-widget" style="--widget-accent: var(--accent-color, #e91e8c)">
            <div class="status-widget-label">Active Timeslots</div>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px; flex: 1; justify-content: center;">
              ${a.map(r=>{var x,_,D,T;const l=(x=this.channels)==null?void 0:x[r],c=l?l.enabled!==!1:!0,p=(l==null?void 0:l.name)||(r===A?"Twilight":r);if(!c)return n`
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 13px; opacity: 0.5;">
                      <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
                        <div class="slot-color-dot" style="background: #888; flex-shrink: 0;"></div>
                        <span style="font-weight: 600; color: var(--secondary-text-color); font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;">${p}:</span>
                        <span style="color: var(--secondary-text-color); text-decoration: line-through;">Disabled</span>
                      </div>
                      <span style="font-size: 11px; color: var(--secondary-text-color);">—</span>
                    </div>
                  `;const u=((_=this.channelSlotsMap)==null?void 0:_[r])||(r===A?this.slots:[])||[],g=((D=e==null?void 0:e.active_slots)==null?void 0:D[r])||null,d=g?u.find(E=>E.id===g):u.find(E=>Ae(E,t));if(!d)return n`
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 13px; opacity: 0.7;">
                      <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
                        <div class="slot-color-dot" style="background: #888; flex-shrink: 0;"></div>
                        <span style="font-weight: 600; color: var(--secondary-text-color); font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;">${p}:</span>
                        <span style="color: var(--secondary-text-color); font-style: italic;">No active slot</span>
                      </div>
                      <span style="font-size: 11px; color: var(--secondary-text-color);">—</span>
                    </div>
                  `;const f=d.color||"var(--secondary-text-color)",v=d.label,y=`${me(d.from)} - ${me(d.to)}`,w=((T=e==null?void 0:e.active_scene_names)==null?void 0:T[r])||(d.scene?Li(this.hass,d.scene):"No Scene");return n`
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 13px;">
                    <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
                      <div class="slot-color-dot" style="background:${f}; box-shadow: 0 0 6px ${f}; flex-shrink: 0;"></div>
                      <span style="font-weight: 600; color: var(--secondary-text-color); font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;">${p}:</span>
                      <span style="color: var(--primary-text-color); font-weight: 500; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${v}</span>
                      <span style="color: var(--secondary-text-color); font-size: 11px; font-style: italic; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">(${w})</span>
                    </div>
                    <span style="font-family: monospace; font-size: 11px; color: var(--secondary-text-color); flex-shrink: 0;">${y}</span>
                  </div>
                `})}
            </div>
          </div>

          <!-- Widget 2: Engine State -->
          <div class="status-widget" style="--widget-accent: ${o.color}">
            <div class="status-widget-label">Engine State</div>
            <div class="status-widget-value">
              <div class="${o.class}" style="--dot-color: ${o.color}"></div>
              ${o.label}
            </div>
            <div class="status-widget-sub">
              <div style="text-overflow:ellipsis; overflow:hidden; white-space:nowrap">${o.sub}</div>
              ${e&&this._activityCountdown(e)?n`
                <div style="font-family: monospace; font-size: 11px; color: var(--secondary-text-color);">
                  ends in ${this._activityCountdown(e)}
                </div>
              `:""}
            </div>
          </div>
        </div>
      </div>
    `}};nt.styles=[Zt,P`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      font-family: var(--font-family, inherit);
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      overflow: clip;
    }

    .status-card {
      box-sizing: border-box;
      background: transparent;
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .status-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }

    .status-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
      flex: 1;
    }

    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
    }

    .status-widget {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 10px 14px 10px 18px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      position: relative;
      overflow: hidden;
      min-width: 0;
      box-sizing: border-box;
    }

    .status-widget::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: var(--widget-accent, color-mix(in srgb, var(--primary-text-color) 10%, transparent));
    }

    .status-widget-label {
      font-size: 9px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--secondary-text-color);
      letter-spacing: 0.5px;
    }

    .status-widget-value {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-widget-sub {
      font-size: 11px;
      color: var(--secondary-text-color);
      line-height: 1.35;
      min-width: 0;
    }

    .entity-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--dot-color, var(--success-color, #4caf50));
      flex-shrink: 0;
      box-shadow: 0 0 5px var(--dot-glow, transparent);
    }

    .slot-color-dot {
      width: 10px;
      height: 10px;
      border-radius: 3px;
      flex-shrink: 0;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 20%, transparent);
      box-sizing: border-box;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--dot-color, #4caf50);
      box-shadow: 0 0 0 0 var(--dot-glow, rgba(76, 175, 80, 0.4));
      animation: pulse 2s infinite;
      flex-shrink: 0;
    }

    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 var(--dot-glow, rgba(76, 175, 80, 0.4));
      }
      70% {
        box-shadow: 0 0 0 6px var(--dot-glow, rgba(76, 175, 80, 0));
      }
      100% {
        box-shadow: 0 0 0 0 var(--dot-glow, rgba(76, 175, 80, 0));
      }
    }

    /* Dynamic glow effects for indicators */
    .static-glow {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
      background: var(--dot-color, #4caf50);
      box-shadow: 0 0 6px var(--dot-color, #4caf50);
      transition: box-shadow 0.3s ease, background-color 0.3s ease;
    }

    .breathe-glow {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
      background: var(--dot-color, #4caf50);
      animation: glow-breathe-anim 4s infinite ease-in-out;
    }

    @keyframes glow-breathe-anim {
      0%, 100% {
        box-shadow: 0 0 3px var(--dot-color, #4caf50);
        opacity: 0.85;
      }
      50% {
        box-shadow: 0 0 12px var(--dot-color, #4caf50);
        opacity: 1;
      }
    }

    .pulse-glow {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
      background: var(--dot-color, #4caf50);
      animation: glow-pulse-anim 1.5s infinite ease-in-out;
    }

    @keyframes glow-pulse-anim {
      0%, 100% {
        box-shadow: 0 0 2px var(--dot-color, #4caf50);
        transform: scale(0.95);
      }
      50% {
        box-shadow: 0 0 12px var(--dot-color, #4caf50), 0 0 18px var(--dot-color, #4caf50);
        transform: scale(1.08);
      }
    }

    .blink-glow {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
      background: var(--dot-color, #4caf50);
      box-shadow: 0 0 6px var(--dot-color, #4caf50);
      animation: glow-blink-anim 1s infinite steps(2, start);
    }

    @keyframes glow-blink-anim {
      to {
        visibility: hidden;
      }
    }

    .fast-pulse-glow {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
      background: var(--dot-color, #ff5722);
      animation: glow-fast-pulse-anim 0.75s infinite ease-in-out;
    }

    @keyframes glow-fast-pulse-anim {
      0%, 100% {
        box-shadow: 0 0 2px var(--dot-color, #ff5722);
        transform: scale(0.92);
      }
      50% {
        box-shadow: 0 0 14px var(--dot-color, #ff5722), 0 0 20px var(--dot-color, #ff5722);
        transform: scale(1.15);
      }
    }

    .fast-blink-glow {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
      background: var(--dot-color, #d32f2f);
      box-shadow: 0 0 8px var(--dot-color, #d32f2f);
      animation: glow-fast-blink-anim 0.4s infinite steps(2, start);
    }

    @keyframes glow-fast-blink-anim {
      to {
        visibility: hidden;
      }
    }
  `],ct([h({attribute:!1})],nt.prototype,"hass",2),ct([h({type:Array})],nt.prototype,"slots",2),ct([h({attribute:!1})],nt.prototype,"sensorConfig",2),ct([h({type:Array})],nt.prototype,"inputs",2),ct([h({attribute:!1})],nt.prototype,"activitiesConfig",2),ct([h({type:Boolean})],nt.prototype,"noHeader",2),ct([h({attribute:!1})],nt.prototype,"runState",2),ct([h({type:Boolean})],nt.prototype,"areaEnabled",2),ct([h({attribute:!1})],nt.prototype,"channels",2),ct([h({attribute:!1})],nt.prototype,"channelSlotsMap",2),ct([h({type:Boolean})],nt.prototype,"simCritical",2),ct([h({type:Boolean})],nt.prototype,"simError",2),ct([h({type:Boolean})],nt.prototype,"simSensorOffline",2),ct([h({type:Boolean})],nt.prototype,"simWarning",2),ct([h({type:Array})],nt.prototype,"entities",2),nt=ct([L("twilight-status-card")],nt);class xe{constructor(e){this.host=e,this.confirmOpen=!1,this.confirmTitle="",this.confirmMessage="",this._confirmResolve=null,this.alertOpen=!1,this.alertTitle="",this.alertMessage="",this._alertResolve=null,this.promptOpen=!1,this.promptTitle="",this.promptMessage="",this.promptPlaceholder="",this.promptValue="",this._promptResolve=null,this._onConfirm=()=>{this.confirmOpen=!1,this._confirmResolve&&(this._confirmResolve(!0),this._confirmResolve=null),this.host.requestUpdate()},this._onCancelConfirm=()=>{this.confirmOpen=!1,this._confirmResolve&&(this._confirmResolve(!1),this._confirmResolve=null),this.host.requestUpdate()},this._onCloseAlert=()=>{this.alertOpen=!1,this._alertResolve&&(this._alertResolve(),this._alertResolve=null),this.host.requestUpdate()},this._onSubmitPrompt=i=>{this.promptOpen=!1,this._promptResolve&&(this._promptResolve(i.detail.value),this._promptResolve=null),this.host.requestUpdate()},this._onCancelPrompt=()=>{this.promptOpen=!1,this._promptResolve&&(this._promptResolve(null),this._promptResolve=null),this.host.requestUpdate()},this.host.addController(this)}hostConnected(){}hostDisconnected(){this._confirmResolve&&(this._confirmResolve(!1),this._confirmResolve=null),this._alertResolve&&(this._alertResolve(),this._alertResolve=null),this._promptResolve&&(this._promptResolve(null),this._promptResolve=null),this.confirmOpen=!1,this.alertOpen=!1,this.promptOpen=!1}showConfirm(e,i){return this._confirmResolve&&(this._confirmResolve(!1),this._confirmResolve=null),new Promise(a=>{this.confirmTitle=e,this.confirmMessage=i,this.confirmOpen=!0,this._confirmResolve=a,this.host.requestUpdate()})}showAlert(e,i){return this._alertResolve&&(this._alertResolve(),this._alertResolve=null),new Promise(a=>{this.alertTitle=e,this.alertMessage=i,this.alertOpen=!0,this._alertResolve=a,this.host.requestUpdate()})}showPrompt(e,i="",a="",s=""){return this._promptResolve&&(this._promptResolve(null),this._promptResolve=null),new Promise(o=>{this.promptTitle=e,this.promptMessage=s,this.promptPlaceholder=a,this.promptValue=i,this.promptOpen=!0,this._promptResolve=o,this.host.requestUpdate()})}}var po=Object.defineProperty,ho=Object.getOwnPropertyDescriptor,ft=(t,e,i,a)=>{for(var s=a>1?void 0:a?ho(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&po(e,i,s),s};class ce extends B{}let Te=class extends ce{constructor(){super(...arguments),this.open=!1,this.dialogTitle="Alert",this.message=""}render(){return this.open?n`
      <div class="overlay" @click=${this._onClose}>
        <div
          class="modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="alert-dialog-title"
          @click=${t=>t.stopPropagation()}
        >
          <div class="modal-header">
            <h3 class="modal-title" id="alert-dialog-title">${this.dialogTitle}</h3>
          </div>
          <div class="modal-body">
            <p style="margin: 0; line-height: 1.5; font-size: 14px; color: var(--primary-text-color);">${this.message}</p>
          </div>
          <div class="modal-footer">
            <button class="btn-save-dialog" @click=${this._onClose}>OK</button>
          </div>
        </div>
      </div>
    `:n``}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}};Te.styles=[Et,P`
      /* Above the sub-edit overlays (z-index 1100) — validation alerts fire
         from inside the sub-modals and must stay visible on top. */
      .overlay { z-index: 1200; }
      .modal-card {
        max-width: 450px;
      }
    `],ft([h({type:Boolean})],Te.prototype,"open",2),ft([h({type:String})],Te.prototype,"dialogTitle",2),ft([h({type:String})],Te.prototype,"message",2),Te=ft([L("twilight-alert-dialog")],Te);let Oe=class extends ce{constructor(){super(...arguments),this.open=!1,this.dialogTitle="Confirm",this.message=""}render(){return this.open?n`
      <div class="overlay" @click=${this._onCancel}>
        <div
          class="modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          @click=${t=>t.stopPropagation()}
        >
          <div class="modal-header">
            <h3 class="modal-title" id="confirm-dialog-title">${this.dialogTitle}</h3>
          </div>
          <div class="modal-body">
            <p style="margin: 0; line-height: 1.5; font-size: 14px; color: var(--primary-text-color);">${this.message}</p>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel-dialog" @click=${this._onCancel}>Cancel</button>
            <button class="btn-save-dialog" @click=${this._onConfirm}>Confirm</button>
          </div>
        </div>
      </div>
    `:n``}_onConfirm(){this.dispatchEvent(new CustomEvent("confirm",{bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}};Oe.styles=[Et,P`
      .overlay { z-index: 1200; }
      .modal-card {
        max-width: 450px;
      }
    `],ft([h({type:Boolean})],Oe.prototype,"open",2),ft([h({type:String})],Oe.prototype,"dialogTitle",2),ft([h({type:String})],Oe.prototype,"message",2),Oe=ft([L("twilight-confirm-dialog")],Oe);let te=class extends ce{constructor(){super(...arguments),this.open=!1,this.dialogTitle="Prompt",this.message="",this.placeholder="",this.value="",this._currentValue=""}willUpdate(t){t.has("open")&&this.open&&(this._currentValue=this.value||"")}render(){return this.open?n`
      <div class="overlay" @click=${this._onCancel}>
        <div
          class="modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="prompt-dialog-title"
          @click=${t=>t.stopPropagation()}
        >
          <div class="modal-header">
            <h3 class="modal-title" id="prompt-dialog-title">${this.dialogTitle}</h3>
          </div>
          <div class="modal-body" style="gap: 12px;">
            ${this.message?n`<p style="margin: 0; font-size: 13px; color: var(--secondary-text-color);">${this.message}</p>`:""}
            <input
              type="text"
              class="prompt-input"
              autofocus
              .value=${this._currentValue}
              .placeholder=${this.placeholder}
              @input=${this._onInput}
              @keydown=${this._onKeyDown}
            />
          </div>
          <div class="modal-footer">
            <button class="btn-cancel-dialog" @click=${this._onCancel}>Cancel</button>
            <button class="btn-save-dialog" @click=${this._onConfirm}>OK</button>
          </div>
        </div>
      </div>
    `:n``}_onInput(t){this._currentValue=t.target.value}_onKeyDown(t){t.key==="Enter"?this._onConfirm():t.key==="Escape"&&this._onCancel()}_onConfirm(){this.dispatchEvent(new CustomEvent("submit",{detail:{value:this._currentValue},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}};te.styles=[Et,P`
      .overlay { z-index: 1200; }
      .modal-card {
        max-width: 450px;
      }
      .prompt-input {
        width: 100%;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 6px;
        color: var(--primary-text-color);
        padding: 10px 12px;
        font-size: 14px;
        outline: none;
        box-sizing: border-box;
      }
      .prompt-input:focus {
        border-color: var(--tp-accent, var(--accent-color, #e91e8c));
      }
    `],ft([h({type:Boolean})],te.prototype,"open",2),ft([h({type:String})],te.prototype,"dialogTitle",2),ft([h({type:String})],te.prototype,"message",2),ft([h({type:String})],te.prototype,"placeholder",2),ft([h({type:String})],te.prototype,"value",2),ft([b()],te.prototype,"_currentValue",2),te=ft([L("twilight-prompt-dialog")],te);const _t="#141926",Ut="#1e2e45",Bt="#2c4268",Ft="#3d5c8a",Ye="#bfb39b",ee="#8ab0cd",Ls="rgba(255,255,255,0.15)",Vi=t=>t>=-.833?ee:t>=-6?Ft:t>=-12?Bt:t>=-18?Ut:_t;function di(t){return`200 14px ${getComputedStyle(t).getPropertyValue("--font-family").trim()||"system-ui, sans-serif"}`}function Yi(t){return getComputedStyle(t).getPropertyValue("--primary-text-color").trim()||"rgba(255,255,255,0.90)"}function js(t){return getComputedStyle(t).getPropertyValue("--divider-color").trim()||"rgba(255, 255, 255, 0.08)"}function Hs(t,e){var i;for(let a=0;a<t.length-1;a++)if(t[a].time<=e&&t[a+1].time>e){const s=(e-t[a].time)/(t[a+1].time-t[a].time);return t[a].elevation+(t[a+1].elevation-t[a].elevation)*s}return((i=t[t.length-1])==null?void 0:i.elevation)??0}function Us(t,e,i){t.save(),t.beginPath(),t.arc(e,i,11,0,Math.PI*2),t.fillStyle="rgba(249,217,118,0.28)",t.shadowColor="#f9d976",t.shadowBlur=12,t.fill(),t.beginPath(),t.arc(e,i,7.5,0,Math.PI*2),t.strokeStyle="rgba(10, 15, 25, 0.65)",t.lineWidth=1.5,t.stroke(),t.beginPath(),t.arc(e,i,7,0,Math.PI*2),t.fillStyle="#f9d976",t.fill(),t.restore()}function Bs(t,e,i){t.save(),t.shadowColor="#a4c5f0",t.shadowBlur=10,t.beginPath(),t.arc(e,i,7,0,Math.PI*2),t.fillStyle="#c8dff5",t.fill(),t.beginPath(),t.arc(e+3.15,i-.7,5.46,0,Math.PI*2),t.fillStyle=_t,t.fill(),t.restore()}function Fs(t,e,i){t.save(),t.shadowColor="#c8c8f0",t.shadowBlur=10,t.beginPath(),t.arc(e,i,7,Math.PI/2,-Math.PI/2),t.lineTo(e,i-7),t.fillStyle="#f9d976",t.fill(),t.beginPath(),t.arc(e,i,7,-Math.PI/2,Math.PI/2),t.lineTo(e,i+7),t.fillStyle="#c8dff5",t.fill(),t.beginPath(),t.moveTo(e,i-7),t.lineTo(e,i+7),t.strokeStyle="rgba(0,0,0,0.3)",t.lineWidth=.5,t.stroke(),t.restore()}const U=t=>Math.round(t*1e3)/1e3;function Gi(t){const i=[],a=t.sunrise!==null?U(t.sunrise):null,s=t.sunset!==null?U(t.sunset):null,o=t.astro_dawn!==null&&(a===null||U(t.astro_dawn)<a)?U(t.astro_dawn):null,r=t.nautical_dawn!==null&&(a===null||U(t.nautical_dawn)<a)?U(t.nautical_dawn):null,l=t.dawn!==null&&(a===null||U(t.dawn)<a)?U(t.dawn):null,c=t.dusk!==null&&t.dusk<=1440&&(s===null||U(t.dusk)>s)?U(t.dusk):null,p=t.nautical_dusk!==null&&t.nautical_dusk<=1440&&(s===null||U(t.nautical_dusk)>s)?U(t.nautical_dusk):null,u=t.astro_dusk!==null&&t.astro_dusk<=1440&&(s===null||U(t.astro_dusk)>s)?U(t.astro_dusk):null,g=t.slot_gold_dawn!==null&&t.slot_gold_dawn!==void 0;return o!==null&&i.push({t:o,c:Ut}),r!==null&&i.push({t:r,c:Bt}),l!==null&&i.push({t:l,c:Ft}),a!==null&&i.push({t:a,c:g?Ye:ee}),g&&t.slot_day!==null&&t.slot_day!==void 0&&i.push({t:U(t.slot_day),c:ee}),g&&t.slot_gold_dusk!==null&&t.slot_gold_dusk!==void 0&&t.slot_gold_dusk<=1440&&i.push({t:U(t.slot_gold_dusk),c:Ye}),s!==null&&s<=1440&&i.push({t:s,c:Ft}),c!==null&&i.push({t:c,c:Bt}),p!==null&&i.push({t:p,c:Ut}),u!==null&&i.push({t:u,c:_t}),i}function Xi(t){const i=[],a=t.slot_sunrise!==null?U(t.slot_sunrise):null,s=t.slot_astro_dawn!==null&&(a===null||U(t.slot_astro_dawn)<a)?U(t.slot_astro_dawn):null,o=t.slot_nautical_dawn!==null&&(a===null||U(t.slot_nautical_dawn)<a)?U(t.slot_nautical_dawn):null,r=t.slot_civil_dawn!==null&&(a===null||U(t.slot_civil_dawn)<a)?U(t.slot_civil_dawn):null,l=t.slot_civil_dusk!==null&&t.slot_civil_dusk<=1440?U(t.slot_civil_dusk):null,c=t.slot_nautical_dusk!==null&&t.slot_nautical_dusk<=1440?U(t.slot_nautical_dusk):null,p=t.slot_astro_dusk!==null&&t.slot_astro_dusk<=1440?U(t.slot_astro_dusk):null,u=t.slot_night!==null&&t.slot_night<=1440?U(t.slot_night):null,g=t.slot_gold_dawn!==null&&t.slot_gold_dawn!==void 0;return s!==null&&i.push({t:s,c:Ut}),o!==null&&i.push({t:o,c:Bt}),r!==null&&i.push({t:r,c:Ft}),a!==null&&i.push({t:a,c:g?Ye:ee}),g&&t.slot_day!==null&&t.slot_day!==void 0&&i.push({t:U(t.slot_day),c:ee}),g&&t.slot_gold_dusk!==null&&t.slot_gold_dusk!==void 0&&t.slot_gold_dusk<=1440&&i.push({t:U(t.slot_gold_dusk),c:Ye}),l!==null&&i.push({t:l,c:Ft}),c!==null&&i.push({t:c,c:Bt}),p!==null&&i.push({t:p,c:Ut}),u!==null&&i.push({t:u,c:_t}),i}function uo(t,e,i){const a=s=>{const o=e[s];if(!o||i<0||i>=o.length)return null;const r=o[i];return r==null||!Number.isFinite(r)?null:r};return{...t,slot_astro_dawn:a("astro_dawn"),slot_nautical_dawn:a("nautical_dawn"),slot_civil_dawn:a("civil_dawn"),slot_gold_dawn:a("gold_dawn"),slot_day:a("day"),slot_gold_dusk:a("gold_dusk"),slot_civil_dusk:a("civil_dusk"),slot_nautical_dusk:a("nautical_dusk"),slot_astro_dusk:a("astro_dusk"),slot_night:a("night"),slot_sunrise:a("gold_dawn")??a("day")}}function Ki(t,e,i){if(!t)return Vi(e.midnight_el);const a=1440;if(i){if(t.slot_civil_dusk!==null)return t.slot_night!==null&&t.slot_night<=a?_t:t.slot_astro_dusk!==null&&t.slot_astro_dusk<=a?Ut:t.slot_nautical_dusk!==null&&t.slot_nautical_dusk<=a?Bt:t.slot_civil_dusk!==null&&t.slot_civil_dusk<=a?Ft:ee}else if(t.sunset!==null)return t.astro_dusk!==null&&t.astro_dusk<=a?_t:t.nautical_dusk!==null&&t.nautical_dusk<=a?Ut:t.dusk!==null&&t.dusk<=a?Bt:t.sunset!==null&&t.sunset<=a?Ft:ee;return Vi(t.midnight_el)}function Zi(t,e,i,a){const o=(r,l,c,p)=>{if(r===null||r<=1440||p===null)return;const u=U(r-1440);c!==null&&u>=c||t.push({t:u,c:l})};a?(o(e.slot_civil_dusk,Ft,i.slot_sunrise,i.slot_sunrise),o(e.slot_nautical_dusk,Bt,i.slot_civil_dawn,i.slot_civil_dawn),o(e.slot_astro_dusk,Ut,i.slot_nautical_dawn,i.slot_nautical_dawn),o(e.slot_night,_t,i.slot_astro_dawn,i.slot_astro_dawn)):(o(e.sunset,Ft,i.sunrise,i.sunrise),o(e.dusk,Bt,i.dawn,i.dawn),o(e.nautical_dusk,Ut,i.nautical_dawn,i.nautical_dawn),o(e.astro_dusk,_t,i.astro_dawn,i.astro_dawn))}function Ws(t,e,i,a,s,o,r,l,c){let p=r,u=e;for(const g of o){const d=l(Math.max(0,Math.min(c,g.t)));d>u&&(t.fillStyle=p,t.fillRect(u,i,d-u,a)),p=g.c,u=d}t.fillStyle=p,t.fillRect(u,i,s-u,a)}function fo(t,e,i,a,s,o,r){let l=s,c=0;for(const p of a)p.t>c&&p.t<=r&&(t.fillStyle=l,t.fillRect(e,o(p.t),i,o(c)-o(p.t))),l=p.c,c=Math.max(c,p.t);c<r&&(t.fillStyle=l,t.fillRect(e,o(r),i,o(c)-o(r)))}var go=Object.defineProperty,vo=Object.getOwnPropertyDescriptor,G=(t,e,i,a)=>{for(var s=a>1?void 0:a?vo(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&go(e,i,s),s};const qs=[210,145,35,280,190,330,15],Vs=50,Ys=20,bo=0,mo=30,Ji=72,Gs=12,_o=2,ci=20;let q=class extends B{constructor(){super(...arguments),this.hass=null,this.date=new Date().toISOString().slice(0,10),this.clamped=!1,this.noHeader=!1,this.noAxisLabels=!1,this.noYAxis=!1,this.showSlots=!1,this.primaryOnly=!1,this.noSolarNoonMidnight=!1,this.hoverTime=null,this.liveTime=null,this.embedded=!1,this.sparkline=!1,this.channels={},this.selectedChannelId="primary",this.channelSlotsMap={},this.days=[],this.sunData=null,this.slots=[],this._days=[],this._sunData=null,this._loading=!1,this._w=0,this._geom=null,this._ro=null}connectedCallback(){super.connectedCallback()}disconnectedCallback(){var t;(t=this._ro)==null||t.disconnect(),super.disconnectedCallback()}updated(t){var i;if(!this._ro){const a=(i=this.shadowRoot)==null?void 0:i.querySelector(".canvas-wrap");a&&(this._ro=new ResizeObserver(s=>{const o=s[0].contentRect.width;o>0&&o!==this._w&&(this._w=o,this._draw())}),this._ro.observe(a))}t.has("days")&&this.days.length&&(this._days=this.days),t.has("sunData")&&this.sunData&&(this._sunData=this.sunData),(t.has("hass")||t.has("date"))&&this.hass&&!this.days.length&&this._load(),(t.has("_sunData")||t.has("_days")||t.has("clamped")||t.has("showSlots")||t.has("primaryOnly")||t.has("noSolarNoonMidnight")||t.has("noYAxis")||t.has("hoverTime")||t.has("liveTime")||t.has("channels")||t.has("selectedChannelId")||t.has("channelSlotsMap"))&&requestAnimationFrame(()=>this._draw())}async _load(){if(this.hass){this._loading=!0;try{const t=await Ui(this.hass,{date:this.date});this._sunData=t;const e=[];t.prev_day_data&&e.push(t.prev_day_data),t.day_data&&e.push(t.day_data),this._days=e}finally{this._loading=!1}}}_getLiveTime(){const t=new Date;return t.getHours()*60+t.getMinutes()+t.getSeconds()/60}_interpolateEl(t){var e;return Hs(((e=this._sunData)==null?void 0:e.points)??[],t)}_draw(){var Ce,Mt,Xe,Ke,Ze;const t=(Ce=this.shadowRoot)==null?void 0:Ce.querySelector("canvas"),e=this._sunData??this.sunData;if(!t||!e||!this._w)return;const{points:i}=e;if(!i.length)return;const a=this._w,s=t.getBoundingClientRect().height;if(!s)return;const o=ji(t,a,s),r=this.noAxisLabels?10:this.noYAxis?ci+Ji:Vs,l=this.noAxisLabels?10:this.noYAxis?ci:Ys,c=this.noAxisLabels?10:bo,p=this.noAxisLabels?10:mo,u=a-r-l,g=s-c-p,d=this.primaryOnly?[]:Object.keys(this.channels||{}).filter($=>$!=="primary"),v=1+d.length,y=g/v,w=g,x=c,_=c+w,D=r,T=r+u,E=x+g/2,C=1440;this._geom={plotT:x,stripeH:y,numStripes:v};const z=e.lat??50,m=Math.abs(z),O=m<=23.44?90:113.44-m,j=Math.max(O,...i.map($=>Math.abs($.elevation)))+10,S=$=>D+$/C*u,M=$=>E-$/j*(w/2);o.save(),o.beginPath(),o.roundRect(D,x,u,g,8),o.fillStyle=_t,o.fill(),o.restore(),o.save(),o.beginPath(),o.roundRect(D,x,u,g,8),o.clip();const V=y;o.save(),o.beginPath(),o.rect(D,x,u,V),o.clip();const I=this._days.length?this._days:this.days,J=I.findIndex($=>$.date===this.date),k=J>=0?I[J]:null,st=J>0?I[J-1]:null,et=((Mt=this.channelSlotsMap)==null?void 0:Mt[A])??((Xe=this.slots)!=null&&Xe.length?this.slots:null);if(et&&et.length>0){const $=Kt=>(Kt%1440+1440)%1440,R=[...et].sort((Kt,ns)=>$(Kt.from)-$(ns.from)),mt=R.map(Kt=>({t:$(Kt.from),c:Kt.color})),Je=R.length>0?R[R.length-1].color:_t;Ws(o,D,x,V,T,mt,Je,S,C)}else if(k){const $=this.clamped,mt=[...$?Xi(k):Gi(k)];st&&Zi(mt,st,k,$),mt.sort((Kt,ns)=>Kt.t-ns.t);const Je=Ki(st,k,$);Ws(o,D,x,V,T,mt,Je,S,C)}else o.fillStyle=_t,o.fillRect(D,x,u,V);o.restore(),this._drawCustomStripes(o,d,k,st,e,D,x,T,u,y,S),o.save(),o.beginPath(),o.rect(D,x,u,g),o.clip(),o.save(),o.beginPath(),o.moveTo(D,E);for(const $ of i)o.lineTo(S($.time),M($.elevation));o.lineTo(T,E),o.closePath();const at=o.createLinearGradient(0,x,0,E);at.addColorStop(0,"rgba(249,217,118,0.11)"),at.addColorStop(1,"rgba(249,217,118,0.01)"),o.fillStyle=at,o.fill(),o.restore(),o.save(),o.strokeStyle="rgba(255,255,255,0.35)",o.lineWidth=1.5,o.setLineDash([4,4]),o.beginPath(),o.moveTo(D,E),o.lineTo(T,E),o.stroke(),o.restore();const N=o.createLinearGradient(0,x,0,_);N.addColorStop(0,"#f9d976"),N.addColorStop(.47,"#e8a020"),N.addColorStop(.53,"#34507a"),N.addColorStop(1,"#1b233a"),o.save(),o.beginPath();let ot=!0;for(const $ of i){const R=S($.time),mt=M($.elevation);ot?(o.moveTo(R,mt),ot=!1):o.lineTo(R,mt)}o.strokeStyle=N,o.lineWidth=2,o.stroke(),o.restore(),o.save(),o.strokeStyle=N,o.lineWidth=2,o.shadowColor="rgba(249, 217, 118, 0.55)",o.shadowBlur=8,o.beginPath();let bt=!1;for(const $ of i){const R=S($.time),mt=M($.elevation);$.elevation>=0?bt?o.lineTo(R,mt):(o.moveTo(R,mt),bt=!0):bt=!1}if(o.stroke(),o.restore(),!this.noYAxis)for(const $ of[-18,-12,-6,0,30,60]){const R=M($);R<x-2||R>_+2||[-18,-12,-6,0].includes($)&&(o.save(),o.strokeStyle=Ls,o.lineWidth=.5,o.setLineDash([3,4]),o.beginPath(),o.moveTo(D,R),o.lineTo(T,R),o.stroke(),o.restore())}o.restore();const W=this.liveTime??this._getLiveTime(),Y=this._interpolateEl(W),it=S(W),ut=M(Y),zt=x+y,K=($,R,mt=[],Je=zt)=>{if($===null)return;const Kt=S(($%C+C)%C);o.save(),o.strokeStyle=R,o.lineWidth=1.5,o.setLineDash(mt),o.beginPath(),o.moveTo(Kt,x),o.lineTo(Kt,Je),o.stroke(),o.restore()};if(this.noSolarNoonMidnight||(K((k==null?void 0:k.solar_noon)??null,"rgba(255,214,0,0.7)",[],x+g),K((k==null?void 0:k.solar_midnight)??null,"rgba(60,100,200,0.7)",[],x+g)),this.showSlots){const $=((Ke=this.channelSlotsMap)==null?void 0:Ke[A])??((Ze=this.slots)!=null&&Ze.length?this.slots:null);if($&&$.length>0)for(const R of $)K(R.from,"rgba(255,255,255,0.65)");else k&&(K(k.slot_sunset,"rgba(255,255,255,0.75)"),K(k.slot_nautical_dusk,"rgba(255,255,255,0.60)"),K(k.slot_astro_dusk,"rgba(255,255,255,0.45)"),K(k.slot_night,"rgba(255,255,255,0.30)"),K(k.slot_astro_dawn,"rgba(255,255,255,0.30)"),K(k.slot_nautical_dawn,"rgba(255,255,255,0.45)"),K(k.slot_civil_dawn,"rgba(255,255,255,0.60)"),K(k.slot_sunrise,"rgba(255,255,255,0.75)"),K(k.slot_day,"rgba(255,255,255,0.65)"),K(k.slot_gold_dusk,"rgba(255,255,255,0.65)"))}for(const $ of[0,360,720,1080,1440]){const R=S($);o.save(),o.strokeStyle=Ls,o.lineWidth=.5,o.beginPath(),o.moveTo(R,x),o.lineTo(R,x+g),o.stroke(),o.restore()}if(o.save(),o.strokeStyle="rgba(255,255,255,0.25)",o.lineWidth=1,o.setLineDash([3,3]),o.beginPath(),o.moveTo(it,x),o.lineTo(it,x+g),o.stroke(),o.restore(),this.hoverTime!==null){const $=S(this.hoverTime);o.save(),o.strokeStyle="rgba(255,255,255,0.35)",o.lineWidth=1,o.setLineDash([3,3]),o.beginPath(),o.moveTo($,x),o.lineTo($,x+g),o.stroke(),o.restore()}if(o.restore(),o.save(),o.beginPath(),o.roundRect(D,x,u,g,8),o.strokeStyle=js(this),o.lineWidth=1,o.stroke(),o.restore(),Y>=0?Us(o,it,ut):Y>=-6?Fs(o,it,ut):Bs(o,it,ut),!this.noAxisLabels){o.fillStyle=Yi(this),o.font=di(this);for(const $ of[0,360,720,1080,1440]){const R=S($);o.textAlign=$===0?"start":$===1440?"end":"center",o.fillText(`${String($/60|0).padStart(2,"0")}:00`,R,x+g+20)}}if(!this.noAxisLabels&&!this.noYAxis){o.font=di(this),o.textAlign="end";for(const $ of[-18,-12,-6,0,30,60]){const R=M($);if(R<x-10||R>_+10)continue;const mt=Math.min(Math.max(R,x+10),_-6);[0,30,60,-18].includes($)&&(o.fillStyle=Yi(this),o.fillText(`${$}°`,D-6,mt+4))}}this.noYAxis&&!this.noAxisLabels&&this._drawChannelAxisLabels(o,["primary",...d],D,x,y),o.restore()}_elevationToLightRatio(t){return Math.max(0,Math.min(1,(t- -18)/48))}_drawCustomStripes(t,e,i,a,s,o,r,l,c,p,u){const g=i||a||s.day_data;if(e.length===0||!g)return;const d=f=>(f%1440+1440)%1440;e.forEach((f,v)=>{var m,O,j;const y=r+(v+1)*p,w=y+p,x=((m=this.channelSlotsMap)==null?void 0:m[f])??[],_=((j=(O=this.channels)==null?void 0:O[f])==null?void 0:j.enabled)!==!1,D=qs[v%qs.length],T=_?35:0,E=_?12:6,C=_?42:14;t.fillStyle=_t,t.fillRect(o,y,c,p);const z=c/1440;if(x.forEach(S=>{const M=Ri(S);if(M<=0)return;const V=d(S.from),I=o+V*z,J=d(S.from+M/2),k=this._interpolateEl(J),st=this._elevationToLightRatio(k),et=E+st*(C-E);t.fillStyle=`hsl(${D}, ${T}%, ${et}%)`;const at=M*z,N=I+at-l;N<=0?t.fillRect(I,y,at,p):(t.fillRect(I,y,l-I,p),t.fillRect(o,y,N,p))}),this.showSlots){t.strokeStyle="rgba(255, 255, 255, 0.35)",t.lineWidth=1.5;for(const S of x){const M=u(d(S.from));t.beginPath(),t.moveTo(M,y),t.lineTo(M,w),t.stroke()}}t.strokeStyle="rgba(255, 255, 255, 0.08)",t.lineWidth=.5,t.beginPath(),t.moveTo(o,y),t.lineTo(l,y),t.stroke()})}_drawChannelAxisLabels(t,e,i,a,s){const l=Ji-Gs-_o,c=i-Gs;t.save(),t.font="600 11px system-ui, sans-serif",t.textAlign="end",t.textBaseline="middle",e.forEach((p,u)=>{var _,D,T,E;const g=((D=(_=this.channels)==null?void 0:_[p])==null?void 0:D.enabled)!==!1,d=(((E=(T=this.channels)==null?void 0:T[p])==null?void 0:E.name)||p).toUpperCase(),f=a+u*s,v=Math.max(1,Math.floor((s-8)/13)),y=this._wrapText(t,d,l,v);t.fillStyle=g?Yi(this):"rgba(255,255,255,0.35)";const w=y.length*13;let x=f+(s-w)/2+13/2;for(const C of y)t.fillText(C,c,x),x+=13}),t.restore()}_wrapText(t,e,i,a){const s=g=>t.measureText(g).width<=i,o=e.split(/\s+/).filter(Boolean),r=[];let l="";const c=g=>{for(const d of g)l&&!s(l+d)&&(r.push(l),l=""),l+=d};for(const g of o){const d=l?`${l} ${g}`:g;if(s(d)){l=d;continue}l&&(r.push(l),l=""),s(g)?l=g:c(g)}if(l&&r.push(l),r.length<=a)return r;const p=r.slice(0,a);let u=p[a-1];for(;u.length>0&&!s(`${u}…`);)u=u.slice(0,-1);return p[a-1]=`${u}…`,p}get _padLeft(){return this.noAxisLabels?10:this.noYAxis?ci+Ji:Vs}get _padRight(){return this.noAxisLabels?10:this.noYAxis?ci:Ys}_channelAtY(t,e){const i=this._geom;if(!i||i.numStripes<=1)return this.selectedChannelId;const a=t-e,s=Math.max(0,Math.min(i.numStripes-1,Math.floor((a-i.plotT)/i.stripeH)));return s===0?"primary":Object.keys(this.channels||{}).filter(r=>r!=="primary")[s-1]??"primary"}_timeAtX(t,e){const i=this._w-this._padLeft-this._padRight,a=t-e;return Math.round(Math.max(0,Math.min(1,(a-this._padLeft)/i))*1440)}_getSlotAtTimeIn(t,e){const i=s=>(s%1440+1440)%1440,a=i(e);for(const s of t){const o=Ri(s);if(!(o<=0)&&i(a-i(s.from))<o)return s}return null}_slotsForChannel(t){var i;const e=(i=this.channelSlotsMap)==null?void 0:i[t];return e&&e.length?e:this.slots}_onCanvasClick(t){if(!this._w)return;const e=t.currentTarget.getBoundingClientRect(),i=this._timeAtX(t.clientX,e.left),a=this._channelAtY(t.clientY,e.top),s=this._getSlotAtTimeIn(this._slotsForChannel(a),i);s&&this.dispatchEvent(new CustomEvent("slot-selected",{detail:{slotId:s.id,channelId:a},bubbles:!0,composed:!0}))}_onMouseMove(t){if(!this._w)return;const e=t.currentTarget.getBoundingClientRect();this.hoverTime=this._timeAtX(t.clientX,e.left);const i=this._channelAtY(t.clientY,e.top);this.dispatchEvent(new CustomEvent("time-hover-changed",{detail:{hoverTime:this.hoverTime,channelId:i,scrubbing:!0},bubbles:!0,composed:!0})),this._draw()}_onMouseLeave(){this.hoverTime=null,this.dispatchEvent(new CustomEvent("time-hover-changed",{detail:{hoverTime:null,scrubbing:!1},bubbles:!0,composed:!0})),this._draw()}_onTouchMove(t){if(!this._w)return;const e=t.touches[0],i=t.currentTarget.getBoundingClientRect();this.hoverTime=this._timeAtX(e.clientX,i.left);const a=this._channelAtY(e.clientY,i.top);this.dispatchEvent(new CustomEvent("time-hover-changed",{detail:{hoverTime:this.hoverTime,channelId:a,scrubbing:!0},bubbles:!0,composed:!0})),this._draw()}_onTouchEnd(){this.hoverTime=null,this.dispatchEvent(new CustomEvent("time-hover-changed",{detail:{hoverTime:null,scrubbing:!1},bubbles:!0,composed:!0})),this._draw()}_getSparklineGradient(){const t=this._days.length?this._days:this.days,e=t.findIndex(g=>g.date===this.date),i=e>=0?t[e]:null,a=e>0?t[e-1]:null;if(!i)return"var(--divider-color)";const s=this.clamped,r=[...s?Xi(i):Gi(i)];a&&Zi(r,a,i,s),r.sort((g,d)=>g.t-d.t);const l=Ki(a,i,s),c=[],p=1440;let u=l;c.push(`${u} 0%`);for(const g of r){const f=(Math.max(0,Math.min(p,g.t))/p*100).toFixed(1);c.push(`${u} ${f}%`),u=g.c,c.push(`${u} ${f}%`)}return c.push(`${u} 100%`),`linear-gradient(to right, ${c.join(", ")})`}render(){if(this.sparkline){const t=this._getSparklineGradient(),i=(this.liveTime??this._getLiveTime())/1440*100;return n`
        <div class="sparkline-container">
          <div class="sparkline-bar" style="--bar-gradient: ${t}">
            <div class="sparkline-pointer" style="left: calc(${i}% - 3px)"></div>
          </div>
        </div>
        ${this.noAxisLabels?"":n`
          <div class="sparkline-labels">
            <span>00:00</span>
            <span>12:00</span>
            <span>24:00</span>
          </div>
        `}
      `}return n`
      ${this.noHeader?"":n`
        <div class="card-header">
          <span class="card-dot" style="--dot-color: #f59e0b;"></span>
          <span class="card-title">Sun path</span>
        </div>
      `}
      <div class="canvas-wrap">
        ${this._loading&&!this._sunData&&!this.sunData?n`<div class="loading"><ha-circular-progress active size="small"></ha-circular-progress></div>`:n`<canvas
              @click=${this._onCanvasClick}
              @mousemove=${this._onMouseMove}
              @mouseleave=${this._onMouseLeave}
              @touchstart=${this._onTouchMove}
              @touchmove=${this._onTouchMove}
              @touchend=${this._onTouchEnd}
            ></canvas>`}
      </div>
    `}};q.styles=[Zt,P`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      min-height: 280px; /* Enforces a minimum height so it never collapses on mobile! */
      box-sizing: border-box;
      font-family: var(--font-family, inherit);
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      overflow: clip;
    }
    :host([embedded]) {
      background: transparent !important;
      backdrop-filter: none !important;
      border: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      overflow: visible !important;
      min-height: 160px !important;
      height: 180px;
    }
    :host([sparkline]) {
      background: transparent !important;
      backdrop-filter: none !important;
      border: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      overflow: visible !important;
      min-height: 0 !important;
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px 12px;
    }
    .card-dot {
      margin-left: 3px;
    }
    .card-title {
      flex: 1;
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
      margin-left: 3px;
    }
    .canvas-wrap {
      position: relative;
      flex: 1;
      min-height: 0;
      min-width: 0;
    }
    canvas {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: ew-resize;
    }
    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 13px;
      color: rgba(255,255,255,0.4);
    }
    /* Sparkline styles */
    .sparkline-container {
      position: relative;
      width: 100%;
      height: 16px;
      display: flex;
      align-items: center;
      margin: 6px 0;
    }
    .sparkline-bar {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: var(--bar-gradient);
      position: relative;
    }
    .sparkline-pointer {
      position: absolute;
      top: -3px;
      width: 6px;
      height: 12px;
      background: #fff;
      border-radius: 3px;
      box-shadow: 0 0 8px #fff, 0 0 12px #fff;
      transition: left 0.5s ease;
    }
    .sparkline-labels {
      display: flex;
      justify-content: space-between;
      width: 100%;
      font-size: 9px;
      color: var(--secondary-text-color);
      opacity: 0.5;
      margin-top: 4px;
    }
  `],G([h({attribute:!1})],q.prototype,"hass",2),G([h({type:String})],q.prototype,"date",2),G([h({type:Boolean})],q.prototype,"clamped",2),G([h({type:Boolean})],q.prototype,"noHeader",2),G([h({type:Boolean})],q.prototype,"noAxisLabels",2),G([h({type:Boolean,reflect:!0})],q.prototype,"noYAxis",2),G([h({type:Boolean})],q.prototype,"showSlots",2),G([h({type:Boolean})],q.prototype,"primaryOnly",2),G([h({type:Boolean})],q.prototype,"noSolarNoonMidnight",2),G([h({type:Number})],q.prototype,"hoverTime",2),G([h({type:Number})],q.prototype,"liveTime",2),G([h({type:Boolean,reflect:!0})],q.prototype,"embedded",2),G([h({type:Boolean,reflect:!0})],q.prototype,"sparkline",2),G([h({type:Object})],q.prototype,"channels",2),G([h({type:String})],q.prototype,"selectedChannelId",2),G([h({attribute:!1})],q.prototype,"channelSlotsMap",2),G([h({attribute:!1})],q.prototype,"days",2),G([h({attribute:!1})],q.prototype,"sunData",2),G([h({type:Array})],q.prototype,"slots",2),G([b()],q.prototype,"_days",2),G([b()],q.prototype,"_sunData",2),G([b()],q.prototype,"_loading",2),G([b()],q.prototype,"_w",2),q=G([L("twilight-sun-path-card")],q);var xo=Object.defineProperty,yo=Object.getOwnPropertyDescriptor,Pt=(t,e,i,a)=>{for(var s=a>1?void 0:a?yo(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&xo(e,i,s),s};let xt=class extends B{constructor(){super(...arguments),this.hass=null,this.slots=[],this.noHeader=!1,this.entities=[],this.loading=!1,this.channels={},this.selectedChannelId=A,this.templateMode=!1,this.date=new Date().toISOString().slice(0,10),this.channelSlotsMap={},this._menuOpen=!1,this._dialog=new xe(this),this._clock=new ri(this),this._handleWindowClick=t=>{if(!this._menuOpen)return;t.composedPath().some(a=>a instanceof HTMLElement&&a.classList.contains("kebab-container"))||(this._menuOpen=!1)}}connectedCallback(){super.connectedCallback(),window.addEventListener("click",this._handleWindowClick)}disconnectedCallback(){window.removeEventListener("click",this._handleWindowClick),super.disconnectedCallback()}_toggleMenu(t){t.stopPropagation(),this._menuOpen=!this._menuOpen}_orderedChannelIds(){const t=Object.keys(this.channels);if(this.templateMode){const e=t.filter(i=>i!==A).sort();return[A,...e]}return t.sort((e,i)=>e===A?-1:i===A?1:0)}_selectChannel(t){this._menuOpen=!1,this.dispatchEvent(new CustomEvent("channel-selected",{detail:{channelId:t},bubbles:!0,composed:!0}))}async _addChannel(){this._menuOpen=!1;const t=await this._dialog.showPrompt("New Channel","","Name of the new channel");t===null||t.trim()===""||this.dispatchEvent(new CustomEvent("channel-added",{detail:{name:t.trim()},bubbles:!0,composed:!0}))}async _renameChannel(){var i;this._menuOpen=!1;const t=((i=this.channels[this.selectedChannelId])==null?void 0:i.name)??"",e=await this._dialog.showPrompt("Rename Channel",t,"New channel name");e===null||e.trim()===""||this.dispatchEvent(new CustomEvent("channel-renamed",{detail:{channelId:this.selectedChannelId,name:e.trim()},bubbles:!0,composed:!0}))}async _deleteChannel(){var i;if(this._menuOpen=!1,this.selectedChannelId===A)return;const t=((i=this.channels[this.selectedChannelId])==null?void 0:i.name)??this.selectedChannelId;await this._dialog.showConfirm("Delete Channel",`Delete channel "${t}"? Its lights will be turned off.`)&&this.dispatchEvent(new CustomEvent("channel-deleted",{detail:{channelId:this.selectedChannelId},bubbles:!0,composed:!0}))}_toggleChannelEnabled(){if(this._menuOpen=!1,this.selectedChannelId===A)return;const t=this.channels[this.selectedChannelId];t&&this.dispatchEvent(new CustomEvent("channel-enabled-toggled",{detail:{channelId:this.selectedChannelId,enabled:!t.enabled},bubbles:!0,composed:!0}))}_fireEditRequested(){this.dispatchEvent(new CustomEvent("edit-requested",{bubbles:!0,composed:!0}))}render(){const t=this._clock.liveMins,e=this.templateMode?-1:this.slots.findIndex(a=>Ae(a,t)),i=e!==-1?[...this.slots.slice(e),...this.slots.slice(0,e)]:this.slots;return n`
      <div class="slot-card">
        ${this.noHeader?"":n`
          <div class="slot-card-header">
            <span class="card-dot" style="--dot-color: #f97316;"></span>
            <span class="slot-card-title">Timetable</span>
            <div class="kebab-container">
              <button class="edit-btn" @click=${this._toggleMenu}>⋮</button>
              ${this._menuOpen?n`
                <div class="dropdown-menu">
                  ${(()=>{var l;const a=this.selectedChannelId===A,s=this.selectedChannelId&&!a&&!!this.channels[this.selectedChannelId],r=Object.keys(this.channels).filter(c=>c!==A).length>=Wa;return n`
                      <button class="dropdown-item" @click=${()=>{this._menuOpen=!1,this._fireEditRequested()}}>
                        📝 Edit Slots
                      </button>
                      <button class="dropdown-item" ?disabled=${r} @click=${this._addChannel}>
                        ➕ ${r?"Add channel (max reached)":"Add channel"}
                      </button>
                      ${s?n`
                        <button class="dropdown-item" @click=${this._renameChannel}>
                          ✏️ Rename channel
                        </button>
                        <button class="dropdown-item" @click=${this._toggleChannelEnabled}>
                          ${((l=this.channels[this.selectedChannelId])==null?void 0:l.enabled)===!1?"Enable channel":"Disable channel"}
                        </button>
                        <button class="dropdown-item danger" @click=${this._deleteChannel}>
                          🗑️ Delete channel
                        </button>
                      `:""}
                    `})()}
                </div>
              `:""}
            </div>
          </div>
          <div class="channel-tabs">
            ${this._orderedChannelIds().map(a=>{const s=a===A,o=this.channels[a],r=a===this.selectedChannelId,l=(o==null?void 0:o.enabled)===!1;return n`
                <button
                  class="channel-tab ${r?"active":""} ${l?"disabled":""}"
                  @click=${()=>this._selectChannel(a)}
                  title=${l?"Channel disabled":""}
                >${s?"Primary":(o==null?void 0:o.name)||a}</button>
              `})}
          </div>
        `}
        ${!this.templateMode&&!this.loading?n`
          <div style="padding-top: 12px;">
            <twilight-sun-path-card
              .hass=${this.hass}
              .date=${this.date}
              .clamped=${!0}
              .showSlots=${!0}
              .slots=${this.slots}
              .channels=${this.channels}
              .selectedChannelId=${this.selectedChannelId}
              .channelSlotsMap=${this.channelSlotsMap}
              .noHeader=${!0}
              .noAxisLabels=${!1}
              .noYAxis=${!0}
              .noSolarNoonMidnight=${!0}
              ?embedded=${!0}
            ></twilight-sun-path-card>
          </div>
        `:""}
        <div class="slot-summary">
          ${this.loading?n`<div class="entity-list-empty">Loading…</div>`:i.length>0?i.map(a=>{const s=!this.templateMode&&Ae(a,t),o=this.templateMode?a.startType==="fixed"?a.fixedStartTime||"12:00":`${a.startEvent||"astral"}${a.startOffset?a.startOffset>0?` +${a.startOffset}m`:` ${a.startOffset}m`:""}`:`${me(a.from)} → ${me(a.to)}`;return n`
                    <div class="slot-summary-row ${s?"active":""}" style="cursor: pointer;" @click=${()=>this._fireEditRequested()}>
                      <div class="slot-color-dot" style="background:${a.color}; box-shadow:${s?`0 0 6px ${a.color}`:"none"}"></div>
                      <span class="slot-summary-label">${a.label}</span>
                      <span class="slot-summary-scene">
                        ${a.scene?Li(this.hass,a.scene):"—"}
                      </span>
                      <span class="slot-summary-time">${o}</span>
                    </div>
                  `}):n`<div class="entity-list-empty">${this.templateMode?"No custom channels in template. Click ⋮ → Add channel":"No slots configured."}</div>`}
        </div>
      </div>

      <twilight-confirm-dialog
        .open=${this._dialog.confirmOpen}
        .dialogTitle=${this._dialog.confirmTitle}
        .message=${this._dialog.confirmMessage}
        @confirm=${this._dialog._onConfirm}
        @cancel=${this._dialog._onCancelConfirm}
      ></twilight-confirm-dialog>

      <twilight-prompt-dialog
        .open=${this._dialog.promptOpen}
        .dialogTitle=${this._dialog.promptTitle}
        .placeholder=${this._dialog.promptPlaceholder}
        .value=${this._dialog.promptValue}
        @submit=${this._dialog._onSubmitPrompt}
        @cancel=${this._dialog._onCancelPrompt}
      ></twilight-prompt-dialog>
    `}};xt.styles=[Zt,P`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      font-family: var(--font-family, inherit);
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      overflow: clip;
    }

    .slot-card {
      box-sizing: border-box;
      background: transparent;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .slot-card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px 0;
    }

    .slot-card-title {
      flex: 1;
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
    }

    .edit-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.6;
      transition: opacity 0.15s, background 0.15s;
      font-size: 16px;
      line-height: 1;
    }
    .edit-btn:hover {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      opacity: 1;
    }

    /* ── Channel Tab Bar ── */
    .channel-tabs {
      display: flex;
      gap: 0;
      padding: 8px 20px 0;
      border-bottom: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      overflow-x: auto;
      scrollbar-width: none;
    }
    .channel-tabs::-webkit-scrollbar { display: none; }

    .channel-tab {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 8px 16px;
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
      border-bottom: 2px solid transparent;
      transition: color 0.15s, border-color 0.15s;
      white-space: nowrap;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .channel-tab:hover {
      color: var(--primary-text-color);
    }
    .channel-tab.active {
      color: var(--accent-color, #e91e8c);
      border-bottom-color: var(--accent-color, #e91e8c);
    }
    .channel-tab.disabled {
      text-decoration: line-through;
      opacity: 0.5;
    }

    .slot-summary {
      padding: 12px 0;
      /* Reserve room for the full 10-slot list so the card height stays constant
         across channels (Primary always has 10, custom channels at most 10).
         min-height targets the content area; padding (12px top + 12px bottom) is added on top. */
      --slot-row-h: 32px;
      min-height: calc(10 * var(--slot-row-h));
    }

    .slot-summary-row {
      display: grid;
      grid-template-columns: 10px 120px 1fr auto;
      align-items: center;
      gap: 12px;
      padding: 0 20px;
      height: var(--slot-row-h);
      box-sizing: border-box;
      transition: background 0.15s;
    }

    .slot-summary-row:hover {
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    }

    .slot-summary-row.active {
      font-weight: 500;
      background: color-mix(in srgb, var(--primary-text-color) 3%, transparent);
    }

    .slot-color-dot {
      width: 10px;
      height: 10px;
      border-radius: 3px;
      flex-shrink: 0;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 20%, transparent);
    }

    .slot-summary-label {
      font-size: 13px;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .slot-summary-scene {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-style: italic;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .slot-summary-time {
      font-size: 12px;
      font-weight: 500;
      color: var(--secondary-text-color);
      font-family: monospace;
      white-space: nowrap;
    }

    @media (max-width: 480px) {
      .slot-summary-row {
        grid-template-columns: 10px 90px 1fr auto;
        gap: 8px;
        padding: 0 12px;
      }
      .slot-summary-label {
        font-size: 11px;
      }
      .slot-summary-scene {
        font-size: 10px;
      }
      .slot-summary-time {
        font-size: 11px;
      }
    }

    .entity-list-empty {
      padding: 12px 20px;
      font-size: 13px;
      color: var(--secondary-text-color);
      font-style: italic;
    }

    .kebab-container {
      position: relative;
      display: inline-block;
    }

    .dropdown-menu {
      position: absolute;
      right: 0;
      top: 100%;
      background: var(--paper-card-background-color, #1c1c1c);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      z-index: 100;
      min-width: 180px;
      display: flex;
      flex-direction: column;
      padding: 4px 0;
      margin-top: 4px;
    }

    .dropdown-item {
      background: transparent;
      border: none;
      color: var(--primary-text-color);
      padding: 10px 16px;
      text-align: left;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background 0.15s;
      white-space: nowrap;
    }

    .dropdown-item:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.08);
    }

    .dropdown-item:disabled {
      color: var(--secondary-text-color);
      opacity: 0.45;
      cursor: not-allowed;
    }

    .dropdown-item.danger {
      color: var(--error-color, #db4437);
    }
    .dropdown-item.danger:hover:not(:disabled) {
      background: rgba(219, 68, 55, 0.15);
    }
  `],Pt([h({attribute:!1})],xt.prototype,"hass",2),Pt([h({type:Array})],xt.prototype,"slots",2),Pt([h({type:Boolean})],xt.prototype,"noHeader",2),Pt([h({type:Array})],xt.prototype,"entities",2),Pt([h({type:Boolean})],xt.prototype,"loading",2),Pt([h({attribute:!1})],xt.prototype,"channels",2),Pt([h({type:String})],xt.prototype,"selectedChannelId",2),Pt([h({type:Boolean})],xt.prototype,"templateMode",2),Pt([h({type:String})],xt.prototype,"date",2),Pt([h({attribute:!1})],xt.prototype,"channelSlotsMap",2),Pt([b()],xt.prototype,"_menuOpen",2),xt=Pt([L("twilight-timetable-card")],xt);function Xs(t,e){var i;try{const a=e||document.body,s=window.getComputedStyle(a),o=s.getPropertyValue("--primary-text-color").trim()||s.color;if(o)return wo(o)}catch{}return((i=t==null?void 0:t.themes)==null?void 0:i.darkMode)!==void 0?!!t.themes.darkMode:!!(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)}function wo(t){const e=t.toLowerCase().trim();if(e==="white"||e.startsWith("#fff")||e.includes("255,255,255")||e.includes("255, 255, 255"))return!0;if(e==="black"||e==="#000"||e==="#000000"||e.includes("0,0,0")||e.includes("0, 0, 0"))return!1;if(e.startsWith("#")){const a=e.substring(1);let s=0,o=0,r=0;return a.length===3||a.length===4?(s=parseInt(a[0]+a[0],16),o=parseInt(a[1]+a[1],16),r=parseInt(a[2]+a[2],16)):a.length>=6&&(s=parseInt(a.substring(0,2),16),o=parseInt(a.substring(2,4),16),r=parseInt(a.substring(4,6),16)),(.299*s+.587*o+.114*r)/255>.5}const i=e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);if(i){const a=parseInt(i[1],10),s=parseInt(i[2],10),o=parseInt(i[3],10);return(.299*a+.587*s+.114*o)/255>.5}return!1}function Qi(t,e){if(!t)return n`<span>—</span>`;const i=s=>s?n`<div style="width:10px; height:10px; border-radius:3px; background:${s}; flex-shrink:0;"></div>`:"",a=(s,o,r)=>n`
    <div style="display:flex; justify-content:center; align-items:center; gap:6px;">
      ${i(o)}
      <span class=${r?`mismatch-badge ${e}`:""}>${s}</span>
    </div>`;return t.deviates?n`
    <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
      ${a(t.actual,t.actual_swatch,!1)}
      ${a(t.target,t.target_swatch,!0)}
    </div>`:a(t.actual,t.actual_swatch,!1)}var $o=Object.defineProperty,Co=Object.getOwnPropertyDescriptor,Ie=(t,e,i,a)=>{for(var s=a>1?void 0:a?Co(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&$o(e,i,s),s};let pe=class extends ce{constructor(){super(...arguments),this.open=!1,this.hass=null,this.entities=[],this.manualOnly=!1,this._pickerValue=""}updated(t){super.updated(t),t.has("open")&&this.open&&ai()}_closeDialog(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_toggleManualOnly(){const t=!this.manualOnly;this.dispatchEvent(new CustomEvent("mode-changed",{detail:{manualOnly:t},bubbles:!0,composed:!0}))}_toggleEntity(t){const e=this.entities.map(i=>i.entity_id===t?{...i,isManual:!i.isManual}:i);this._fireChange(e)}_addEntity(t){var a,s,o;if(!t)return;const e=this.entities.find(r=>r.entity_id===t);let i=[...this.entities];if(e)e.isManual||(i=this.entities.map(r=>r.entity_id===t?{...r,isManual:!0}:r));else{const r=((o=(s=(a=this.hass)==null?void 0:a.states[t])==null?void 0:s.attributes)==null?void 0:o.friendly_name)??t,l=t.split(".")[0];i=[...this.entities,{entity_id:t,name:r,domain:l,in_area:!1,isManual:!0,isExtracted:!1,checked:!0}]}this._fireChange(i),this._pickerValue=""}_fireChange(t){this.dispatchEvent(new CustomEvent("lights-changed",{detail:{entities:t},bubbles:!0,composed:!0}))}render(){if(!this.open)return n``;const t=this.entities.filter(s=>s.isExtracted&&(s.domain==="light"||s.domain==="switch")),e=this.entities.filter(s=>s.in_area&&!s.isExtracted&&(s.domain==="light"||s.domain==="switch")),i=this.entities.filter(s=>!s.in_area&&s.isManual&&(s.domain==="light"||s.domain==="switch")),a=this.entities.some(s=>s.isManual);return n`
      <div class="overlay" @click=${s=>{s.target===s.currentTarget&&this._closeDialog()}}>
        <div class="edit-panel" style="max-width: 1000px;">
          <div class="panel-header">
            <span class="card-dot" style="--dot-color: #eab308;"></span>
            <span class="panel-header-title">Area Lights — Configuration</span>
            <button class="panel-close" @click=${this._closeDialog}>✕</button>
          </div>

          <div class="panel-body">
            ${t.length>0?n`
              <div class="list-section-label">Entities in Scene (Automatically Controlled)</div>
              <div class="grid-list">
                ${t.map(s=>n`
                  <div class="picker-row static">
                    <div style="font-size: 14px; color: var(--secondary-text-color); margin-right: 4px; display: flex; align-items: center;">🎬</div>
                    <div style="flex: 1; min-width: 0;">
                      <div style="display:flex; align-items:center; gap:8px;">
                        <span class="picker-label">${s.name}</span>
                        <span style="font-size: 9px; opacity: 0.5; text-transform: uppercase; font-weight: bold;">(${s.domain})</span>
                      </div>
                      <div class="picker-sublabel">${s.entity_id}</div>
                    </div>
                  </div>
                `)}
              </div>
              <div class="divider"></div>
            `:""}

            <div class="list-section-label">Entities in this Area (Additional Turn-Off Control)</div>
            <div class="grid-list">
              ${e.map(s=>n`
                <div class="picker-row" @click=${()=>this._toggleEntity(s.entity_id)}>
                  <div class="picker-checkbox ${s.isManual?"checked":""}"></div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="display:flex; align-items:center; gap:8px;">
                      <span class="picker-label">${s.name}</span>
                      <span style="font-size: 9px; opacity: 0.5; text-transform: uppercase; font-weight: bold;">(${s.domain})</span>
                    </div>
                    <div class="picker-sublabel">${s.entity_id}</div>
                  </div>
                </div>
              `)}
            </div>

            ${i.length>0?n`
              <div class="divider"></div>
              <div class="list-section-label">Additional Entities (Manually Added)</div>
              <div class="grid-list">
                ${i.map(s=>n`
                  <div class="picker-row" @click=${()=>this._toggleEntity(s.entity_id)}>
                    <div class="picker-checkbox checked"></div>
                    <div style="flex: 1; min-width: 0;">
                      <div style="display:flex; align-items:center; gap:8px;">
                        <span class="picker-label">${s.name}</span>
                        ${s.isExtracted?n`
                          <span class="entity-badge" style="background: color-mix(in srgb, var(--info-color, #2196f3) 20%, transparent); color: var(--info-color, #2196f3); border: 1px solid color-mix(in srgb, var(--info-color, #2196f3) 40%, transparent); font-size: 8px; padding: 1px 4px; border-radius: 3px; font-weight: bold; text-transform: uppercase;">
                            in scene
                          </span>
                        `:""}
                        <span style="font-size: 9px; opacity: 0.5; text-transform: uppercase; font-weight: bold;">(${s.domain})</span>
                      </div>
                      <div class="picker-sublabel">${s.entity_id}</div>
                    </div>
                  </div>
                `)}
              </div>
            `:""}

            <div class="divider"></div>
            <div>
              <div class="list-section-label">Add Entity</div>
              <ha-entity-picker
                .hass=${this.hass}
                .value=${this._pickerValue}
                .includeDomains=${["light","switch"]}
                allow-custom-entity
                @value-changed=${s=>{s.detail.value&&this._addEntity(s.detail.value)}}
              ></ha-entity-picker>
            </div>

            ${a?n`
              <div class="divider"></div>
              <div>
                <div class="list-section-label">Turn-Off Options</div>
                <div class="picker-row" @click=${this._toggleManualOnly}>
                  <div class="picker-checkbox ${this.manualOnly?"checked":""}"></div>
                  <div style="flex: 1; min-width: 0;">
                    <span class="picker-label">Additional entities only</span>
                    <div class="picker-sublabel" style="font-family: inherit; font-size: 11px;">
                      If checked, only manually configured entities will be turned off.
                    </div>
                  </div>
                </div>
              </div>
            `:""}
          </div>

          <div class="panel-footer">
            <button class="btn-save-dialog" @click=${this._closeDialog}>Done</button>
          </div>
        </div>
      </div>
    `}};pe.styles=[Et,P`
      :host {
        display: contents;
      }

      .list-section-label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.9px;
        color: var(--secondary-text-color);
        padding: 0 0 6px;
      }

      .grid-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 8px 16px;
      }

      .picker-row {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 10px 12px;
        cursor: pointer;
        transition: background 0.12s;
        border-radius: 8px;
      }
      .picker-row:hover {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
      }
      .picker-row.static {
        cursor: default;
        background: transparent;
      }
      .picker-row.static:hover {
        background: transparent;
      }

      .picker-checkbox {
        width: 18px;
        height: 18px;
        border-radius: 4px;
        border: 2px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 25%, transparent));
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: border-color 0.12s, background 0.12s;
      }
      .picker-checkbox.checked {
        background: var(--tp-accent, var(--accent-color, #e91e8c));
        border-color: var(--tp-accent, var(--accent-color, #e91e8c));
      }
      .picker-checkbox.checked::after {
        content: '✓';
        color: white;
        font-size: 11px;
        font-weight: 700;
      }

      .picker-label {
        font-size: 14px;
        color: var(--primary-text-color);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .picker-sublabel {
        font-size: 11px;
        color: var(--secondary-text-color);
        font-family: monospace;
      }

      .divider {
        height: 1px;
        background: color-mix(in srgb, var(--primary-text-color, #fff) 8%, transparent);
        margin: 8px 0;
      }
    `],Ie([h({type:Boolean})],pe.prototype,"open",2),Ie([h({attribute:!1})],pe.prototype,"hass",2),Ie([h({type:Array})],pe.prototype,"entities",2),Ie([h({type:Boolean})],pe.prototype,"manualOnly",2),Ie([b()],pe.prototype,"_pickerValue",2),pe=Ie([L("twilight-area-lights-dialog")],pe);var ko=Object.defineProperty,So=Object.getOwnPropertyDescriptor,ie=(t,e,i,a)=>{for(var s=a>1?void 0:a?So(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&ko(e,i,s),s};let Wt=class extends B{constructor(){super(...arguments),this.hass=null,this.activeSceneName="No Scene Active",this.noHeader=!1,this.runState=null,this.entities=[],this.manualOnly=!1,this._editOpen=!1,this._isDark=!1}willUpdate(t){t.has("hass")&&(this._isDark=Xs(this.hass,this))}_toggleManualOnly(t){this.manualOnly=t.detail.manualOnly,this.dispatchEvent(new CustomEvent("mode-changed",{detail:{manualOnly:this.manualOnly},bubbles:!0,composed:!0}))}_onLightsChanged(t){this.entities=t.detail.entities,this.dispatchEvent(new CustomEvent("lights-changed",{detail:{entities:this.entities},bubbles:!0,composed:!0}))}render(){var r;const t=((r=this.runState)==null?void 0:r.light_states)??{},e=this._isDark?"dark":"light",i=Object.keys(t).length>0;let a=[],s=[];i?Object.keys(t).forEach(l=>{const c=t[l],p=this.entities.find(f=>f.entity_id===l),u=p?!!p.isExtracted:!0,g=p?!!p.isManual:!1,d={entity_id:l,name:c.name||(p==null?void 0:p.name)||l,actual_on:c.actual_on,on:c.on,brightness:c.brightness,color:c.color};u?a.push(d):g?s.push(d):a.push(d)}):this.entities.forEach(l=>{const c=!!l.isManual,p=!!l.isExtracted;if(!c&&!p)return;const u={entity_id:l.entity_id,name:l.name||l.entity_id,actual_on:!1,on:null,brightness:null,color:null};p?a.push(u):s.push(u)});const o=a.length+s.length;return n`
      <div class="devices-card">
        ${this.noHeader?"":n`
          <div class="devices-card-header">
            <span class="card-dot" style="--dot-color: #eab308;"></span>
            <span class="devices-card-title">Area Lights</span>
            <div class="active-scene-wrap">
              <span class="active-scene-label">Active Scene:</span>
              <span class="active-scene-value">${this.activeSceneName}</span>
            </div>
            <button class="edit-btn" @click=${()=>{this._editOpen=!0,this.dispatchEvent(new CustomEvent("open-edit",{bubbles:!0,composed:!0}))}} title="Configure Lights">⋮</button>
          </div>
        `}

        <div class="table-container">
          ${o===0?n`<div style="padding: 12px 0; font-size: 13px; color: var(--secondary-text-color); font-style: italic;">No lights configured</div>`:n`
                <table class="lights-table">
                  <thead>
                    <tr>
                      <th style="width: 45%;">Light / Switch</th>
                      <th style="width: 15%; text-align: center;">Status</th>
                      <th style="width: 20%; text-align: center;">Brightness</th>
                      <th style="width: 20%; text-align: center;">Color</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${a.length>0?n`
                      <tr class="section-row">
                        <td colspan="4">Scene Lights (Extracted)</td>
                      </tr>
                      ${a.map(l=>this._renderTableRow(l,e))}
                    `:""}

                    ${s.length>0?n`
                      <tr class="section-row">
                        <td colspan="4">Additional Entities (Manually Configured)</td>
                      </tr>
                      ${s.map(l=>this._renderTableRow(l,e))}
                    `:""}
                  </tbody>
                </table>
              `}
        </div>
      </div>
    `}_renderTableRow(t,e){const i=t.actual_on?"var(--success-color, #4caf50)":"color-mix(in srgb, var(--primary-text-color) 15%, transparent)";return n`
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="entity-indicator"
              style="background:${i}; margin:0; --dot-glow:${t.actual_on?"rgba(76,175,80,0.5)":"transparent"}"
              title="${t.entity_id}"></div>
            <div class="lights-table-entity">
              <span class="lights-table-name" title="${t.name}">${t.name}</span>
              <span class="lights-table-id" title="${t.entity_id}">${t.entity_id}</span>
            </div>
          </div>
        </td>
        <td style="text-align: center; font-weight: 500; vertical-align: top; padding-top: 10px;">${Qi(t.on,e)}</td>
        <td style="text-align: center; font-weight: 500; vertical-align: top; padding-top: 10px;">${Qi(t.brightness,e)}</td>
        <td style="text-align: center; font-weight: 500; vertical-align: top; padding-top: 10px;">${Qi(t.color,e)}</td>
      </tr>
    `}};Wt.styles=[Zt,P`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      font-family: var(--font-family, inherit);
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      overflow: clip;
    }

    .devices-card {
      box-sizing: border-box;
      background: transparent;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .devices-card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px 12px;
    }

    .devices-card-title {
      flex: 1;
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
    }

    .active-scene-wrap {
      display: flex;
      align-items: baseline;
      gap: 4px;
      font-size: 11px;
      font-weight: 500;
      max-width: 250px;
      white-space: nowrap;
      margin-right: 8px;
      line-height: 1;
    }

    .active-scene-label {
      color: var(--secondary-text-color);
      text-transform: uppercase;
      font-size: 9px;
      letter-spacing: 0.5px;
    }

    .active-scene-value {
      color: var(--primary-text-color);
      font-size: 12px;
      font-weight: 700;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .edit-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.6;
      transition: opacity 0.15s, background 0.15s;
      font-size: 16px;
      line-height: 1;
    }
    .edit-btn:hover {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      opacity: 1;
    }

    .entity-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: color-mix(in srgb, var(--primary-text-color) 15%, transparent);
      flex-shrink: 0;
      box-shadow: 0 0 5px var(--dot-glow, transparent);
    }

    .table-container {
      padding: 0 20px 16px;
    }

    .lights-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      text-align: left;
    }
    .lights-table th {
      padding: 8px 16px;
      color: var(--secondary-text-color);
      font-weight: 700;
      border-bottom: 1px solid color-mix(in srgb, var(--primary-text-color, #fff) 8%, transparent);
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 0.8px;
    }
    .lights-table td {
      padding: 10px 16px;
      vertical-align: middle;
    }
    .lights-table th:first-child,
    .lights-table td:first-child {
      padding-left: 0;
    }
    .lights-table th:last-child,
    .lights-table td:last-child {
      padding-right: 0;
    }

    .section-row td {
      padding: 14px 0 6px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--secondary-text-color);
      border-bottom: 1px solid color-mix(in srgb, var(--primary-text-color, #fff) 8%, transparent);
      opacity: 0.8;
    }

    @media (max-width: 480px) {
      .table-container {
        padding: 0 8px;
      }
      .lights-table th, .lights-table td {
        padding: 8px 4px;
      }
      .lights-table-name {
        font-size: 11px;
      }
      .lights-table-id {
        font-size: 9px;
      }
      .mismatch-badge {
        font-size: 8px;
        padding: 1px 4px;
      }
    }

    .lights-table-entity {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .lights-table-name {
      font-weight: 600;
      font-size: 12px;
      color: var(--primary-text-color);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .lights-table-id {
      font-size: 10px;
      font-weight: 200;
      color: var(--secondary-text-color);
      font-family: monospace;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .mismatch-badge {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      white-space: nowrap;
      display: inline-block;
      background: rgba(255, 152, 0, 0.08);
      border: 1px solid rgba(255, 152, 0, 0.3);
      color: #b25e00;
    }

    @media (prefers-color-scheme: dark) {
      .mismatch-badge:not(.light) {
        background: rgba(255, 152, 0, 0.22);
        border: 1px solid rgba(255, 152, 0, 0.7);
        color: var(--warning-color, #ff9800);
      }
    }

    .mismatch-badge.dark {
      background: rgba(255, 152, 0, 0.22);
      border: 1px solid rgba(255, 152, 0, 0.7);
      color: var(--warning-color, #ff9800);
    }

    .mismatch-badge.light {
      background: rgba(255, 152, 0, 0.08);
      border: 1px solid rgba(255, 152, 0, 0.3);
      color: #b25e00;
    }

    .divider {
      height: 1px;
      background: color-mix(in srgb, var(--primary-text-color, #fff) 8%, transparent);
      margin: 8px 0;
    }
  `],ie([h({attribute:!1})],Wt.prototype,"hass",2),ie([h({type:String})],Wt.prototype,"activeSceneName",2),ie([h({type:Boolean})],Wt.prototype,"noHeader",2),ie([h({attribute:!1})],Wt.prototype,"runState",2),ie([h({type:Array})],Wt.prototype,"entities",2),ie([h({type:Boolean})],Wt.prototype,"manualOnly",2),ie([b()],Wt.prototype,"_editOpen",2),ie([b()],Wt.prototype,"_isDark",2),Wt=ie([L("twilight-area-lights-card")],Wt);function Ks(t,e){if(t.name&&t.name.trim())return t.name.trim();const i=t.entity_ids??[];if(i.length>0&&e){const a=i.map(o=>{var r,l;return((l=(r=e.states[o])==null?void 0:r.attributes)==null?void 0:l.friendly_name)??o});let s=a.join(", ");return s.length>35&&a.length>1&&(s=`${a[0]} + ${a.length-1} more`),s}return t.type==="illuminance"?"Illuminance Sensor":t.id}function Zs(t){switch(t){case"min":return"Minimum";case"max":return"Maximum";case"mean":return"Average";case"median":return"Median";default:return"Minimum"}}class pi{constructor(e,i={}){this._prevOpen=!1,this.draft=null,this.draggedIndex=null,this._host=e,this._options=i,this._host.addController(this)}hostConnected(){}hostDisconnected(){}hostUpdate(){var e,i;this._host.open!==this._prevOpen&&(this._prevOpen=this._host.open,this._host.open?(this.draft=this._host.config?structuredClone(this._host.config):null,(i=(e=this._options).onOpen)==null||i.call(e),ai()):this.draft=null)}closeDiscard(){this._host.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}closeAndSave(e){this._host.dispatchEvent(e),this._host.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}onDragStart(e,i){this.draggedIndex=i,e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",String(i)))}onDragOver(e,i){if(e.preventDefault(),this.draggedIndex===null||this.draggedIndex===i||!Array.isArray(this.draft))return;const a=[...this.draft],s=a[this.draggedIndex];a.splice(this.draggedIndex,1),a.splice(i,0,s),this.draft=a,this.draggedIndex=i,this._host.requestUpdate()}onDragEnd(){this.draggedIndex=null}}var Do=Object.defineProperty,Ao=Object.getOwnPropertyDescriptor,he=(t,e,i,a)=>{for(var s=a>1?void 0:a?Ao(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Do(e,i,s),s};let Jt=class extends ce{constructor(){super(...arguments),this.open=!1,this.hass=null,this.config=[],this.templateMode=!1,this._subEditOpen=!1,this._subEditingIndex=null,this._editDraft=null,this._draftController=new pi(this,{onOpen:()=>{this._subEditOpen=!1}})}_closeAndSave(){const t=this._draftController.draft??this.config;this._draftController.closeAndSave(new Ii([...t]))}_openAddSensor(){this._subEditingIndex=null,this._editDraft={id:"",name:void 0,type:"illuminance",entity_ids:[],aggregation:void 0},this._subEditOpen=!0}_openEditSensor(t){const e=this._draftController.draft;if(!e)return;const i=e[t];this._subEditingIndex=t,this._editDraft={id:i.id??"",name:i.name??void 0,type:i.type,entity_ids:i.entity_ids??[],aggregation:i.aggregation??void 0},this._subEditOpen=!0}_removeSensor(t){if(!this._draftController.draft)return;const e=[...this._draftController.draft];e.splice(t,1),this._draftController.draft=e,this.requestUpdate()}_saveSubEdit(){if(!this._editDraft||!this._draftController.draft)return;const t=[...this._draftController.draft],e=this._subEditingIndex;e===null?t.push(this._editDraft):t[e]=this._editDraft,this._draftController.draft=t,this._subEditOpen=!1,this._editDraft=null,this.requestUpdate()}render(){if(!this.open||!this._draftController.draft)return n``;const t=this._draftController.draft,e=t.some(i=>i.type==="illuminance");return n`
      <div class="overlay" @click=${i=>{i.target===i.currentTarget&&!this._subEditOpen&&this._draftController.closeDiscard()}}>
        <div class="edit-panel list-panel" style="${this._subEditOpen?"display: none;":""}">
          <div class="panel-header">
            <span class="card-dot" style="--dot-color: #3b82f6;"></span>
            <span class="panel-header-title">Sensors — Configuration</span>
            <button class="panel-close" @click=${()=>this._draftController.closeDiscard()}>✕</button>
          </div>

          <div class="panel-body">
            <div class="list-section-label">Configured Sensors</div>
            <table class="config-table sensor-table">
              <thead>
                <tr>
                  <th style="min-width: 30px;"></th>
                  <th style="min-width: 150px;">Name</th>
                  <th style="min-width: 80px;">Type</th>
                  <th style="min-width: 220px;">Entities / Aggregation</th>
                  <th style="min-width: 100px; text-align: center;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${t.map((i,a)=>{const s=i.entity_ids||[],o=Zs(i.aggregation);return n`
                    <tr
                      class="sensor-row ${this._draftController.draggedIndex===a?"dragging":""}"
                      draggable="true"
                      @dragstart=${r=>this._draftController.onDragStart(r,a)}
                      @dragover=${r=>this._draftController.onDragOver(r,a)}
                      @dragend=${()=>this._draftController.onDragEnd()}
                    >
                      <td style="text-align: center; padding: 0 4px; vertical-align: middle;">
                        <div class="drag-handle" title="Drag to reorder">⋮⋮</div>
                      </td>
                      <td>
                        <div style="font-weight: 600;">${Ks(i,this.hass)}</div>
                      </td>
                      <td>
                        <span class="type-badge ${i.type}">${i.type}</span>
                      </td>
                      <td>
                        <div style="display: flex; flex-wrap: wrap; gap: 4px; align-items: center;">
                          ${s.length>0?s.map(r=>{var c,p,u;const l=this.templateMode?r:((u=(p=(c=this.hass)==null?void 0:c.states[r])==null?void 0:p.attributes)==null?void 0:u.friendly_name)??r;return n`<span class="pill">${l}</span>`}):n`<span style="opacity: 0.4;">—</span>`}
                          <span class="pill" style="opacity: 0.8;" title="Aggregation mode">Agg: ${o}</span>
                        </div>
                      </td>
                      <td style="text-align: center;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                          <button class="row-action-btn edit" title="Edit sensor" @click=${()=>this._openEditSensor(a)}>✏️</button>
                          <button class="row-action-btn remove" title="Remove sensor" @click=${()=>this._removeSensor(a)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  `})}
                ${t.length===0?n`
                  <tr>
                    <td colspan="5" style="text-align: center; color: var(--secondary-text-color); font-style: italic; padding: 16px;">
                      No sensors configured
                    </td>
                  </tr>
                `:""}
              </tbody>
            </table>

            <div style="display: flex; flex-direction: column; align-items: flex-start; margin-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 16px; gap: 8px;">
              <button class="btn-add" ?disabled=${e} @click=${this._openAddSensor}>
                <span>+</span> Add Sensor
              </button>
              ${e?n`
                <div style="font-size: 11px; color: var(--secondary-text-color);">
                  Only one illuminance sensor per area is supported at this time.
                </div>
              `:""}
            </div>
          </div>

          <div class="panel-footer">
            <button class="btn-save-dialog" @click=${this._closeAndSave}>Done</button>
          </div>
        </div>

        <!-- Sub-dialog: Add/Edit Sensor -->
        ${this._subEditOpen&&this._editDraft?n`
          <div class="edit-panel" @click=${i=>i.stopPropagation()}>
            <div class="panel-header">
              <span class="card-dot" style="--dot-color: #3b82f6;"></span>
              <span class="panel-header-title">${this._subEditingIndex===null?"Add Sensor":"Edit Sensor"}</span>
              <button class="panel-close" @click=${()=>{this._subEditOpen=!1,this._editDraft=null}}>✕</button>
            </div>

            <div class="panel-body">
              <div class="form-field">
                <label class="form-label">Name (Optional)</label>
                <input
                  type="text"
                  class="activity-input"
                  placeholder="e.g. Outdoor Lux"
                  .value=${this._editDraft.name||""}
                  @input=${i=>{const a=i.target.value;this._editDraft={...this._editDraft,name:a||void 0}}}
                />
              </div>

              <div class="form-field">
                <label class="form-label">Sensor Type</label>
                <select class="option-select" disabled>
                  <option value="illuminance">Illuminance</option>
                </select>
              </div>

              ${this.templateMode?"":n`
                <div class="form-field">
                  <label class="form-label">Entities</label>
                  <table class="entity-table">
                    <tbody>
                      ${(this._editDraft.entity_ids||[]).map((i,a)=>{var o,r,l;const s=this.templateMode?i:((l=(r=(o=this.hass)==null?void 0:o.states[i])==null?void 0:r.attributes)==null?void 0:l.friendly_name)??i;return n`
                          <tr class="entity-row">
                            <td style="padding: 6px 0;">
                              <div style="font-weight: 500;">${s}</div>
                              <div style="font-size: 11px; color: var(--secondary-text-color); font-family: monospace;">${i}</div>
                            </td>
                            <td style="text-align: right; width: 40px;">
                              <button class="entity-remove-btn" @click=${()=>{this._editDraft={...this._editDraft,entity_ids:(this._editDraft.entity_ids||[]).filter((c,p)=>p!==a)}}}>✕</button>
                            </td>
                          </tr>
                        `})}
                      ${(this._editDraft.entity_ids||[]).length===0?n`
                        <tr>
                          <td style="text-align: center; color: var(--secondary-text-color); font-style: italic; padding: 12px 0;">
                            No entities selected
                          </td>
                        </tr>
                      `:""}
                    </tbody>
                  </table>

                  <ha-entity-picker
                    .hass=${this.hass}
                    .includeDomains=${["sensor"]}
                    allow-custom-entity
                    label="Add Entity"
                    @value-changed=${i=>{const a=i.detail.value;if(a){const s=this._editDraft.entity_ids||[];s.includes(a)||(this._editDraft={...this._editDraft,entity_ids:[...s,a]}),i.target.value=""}}}
                  ></ha-entity-picker>
                </div>
              `}

              <div class="form-field">
                <label class="form-label">Aggregation</label>
                <div style="font-size: 11px; color: var(--secondary-text-color); margin-bottom: 4px;">
                  How values are combined if multiple entities are added.
                </div>
                <select class="option-select" .value=${this._editDraft.aggregation||"min"} @change=${i=>{const a=i.target.value;this._editDraft={...this._editDraft,aggregation:a}}}>
                  <option value="min">Minimum</option>
                  <option value="max">Maximum</option>
                  <option value="mean">Average</option>
                  <option value="median">Median</option>
                </select>
              </div>
            </div>

            <div class="panel-footer" style="gap: 12px;">
              <button class="btn-cancel-dialog" @click=${()=>{this._subEditOpen=!1,this._editDraft=null}}>Cancel</button>
              <button class="btn-save-dialog" ?disabled=${!this.templateMode&&!(this._editDraft.entity_ids||[]).length} @click=${this._saveSubEdit}>
                ${this._subEditingIndex===null?"Add":"Save"}
              </button>
            </div>
          </div>
        `:""}
      </div>
    `}};Jt.styles=[Et,P`
      :host {
        display: contents;
      }

      .panel-body {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding: 16px 24px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .sensor-table {
        border-collapse: collapse;
      }
      .sensor-table th {
        text-align: left;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--secondary-text-color);
        padding: 6px 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .sensor-table td {
        padding: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        vertical-align: middle;
        font-size: 13px;
      }
      .sensor-row:hover {
        background: rgba(255, 255, 255, 0.015);
      }

      .row-action-btn {
        background: transparent;
        border: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 14px;
        padding: 6px 10px;
        border-radius: 6px;
        transition: color 0.15s, background-color 0.15s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .row-action-btn.edit:hover {
        color: var(--primary-text-color);
        background: rgba(255, 255, 255, 0.08);
      }
      .row-action-btn.remove:hover {
        color: var(--error-color, #db4437);
        background: rgba(219, 68, 55, 0.1);
      }

      .list-section-label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.9px;
        color: var(--secondary-text-color);
        padding: 0 0 6px;
      }

      .entity-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 8px;
      }
      .entity-row:hover {
        background: rgba(255, 255, 255, 0.015);
      }
      .entity-remove-btn {
        background: transparent;
        border: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 15px;
        padding: 4px;
        border-radius: 4px;
        transition: color 0.15s, background-color 0.15s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .entity-remove-btn:hover {
        color: var(--error-color, #db4437);
        background: rgba(219, 68, 55, 0.1);
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .form-label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--secondary-text-color);
      }

      .option-select {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.10);
        border-radius: 4px;
        color: var(--primary-text-color);
        padding: 8px 12px;
        font-size: 13px;
        outline: none;
        cursor: pointer;
        box-sizing: border-box;
        height: 38px;
      }
      .option-select:focus {
        border-color: var(--tp-accent, var(--accent-color, #e91e8c));
      }

      .type-badge {
        font-size: 13px;
        color: var(--primary-text-color);
        font-weight: normal;
        text-transform: lowercase;
      }

      .btn-add {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: var(--primary-text-color);
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        transition: background 0.15s, border-color 0.15s;
        width: fit-content;
      }
      .btn-add:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.2);
      }
      .btn-add:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .activity-input {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.10);
        border-radius: 4px;
        color: var(--primary-text-color);
        padding: 8px 12px;
        font-size: 13px;
        outline: none;
        box-sizing: border-box;
        height: 38px;
        transition: border-color 0.15s;
      }
      .activity-input:focus {
        border-color: var(--tp-accent, var(--accent-color, #e91e8c));
      }
    `],he([h({type:Boolean})],Jt.prototype,"open",2),he([h({attribute:!1})],Jt.prototype,"hass",2),he([h({attribute:!1})],Jt.prototype,"config",2),he([h({type:Boolean})],Jt.prototype,"templateMode",2),he([b()],Jt.prototype,"_subEditOpen",2),he([b()],Jt.prototype,"_subEditingIndex",2),he([b()],Jt.prototype,"_editDraft",2),Jt=he([L("twilight-sensors-dialog")],Jt);var Eo=Object.defineProperty,To=Object.getOwnPropertyDescriptor,ze=(t,e,i,a)=>{for(var s=a>1?void 0:a?To(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Eo(e,i,s),s};let ue=class extends B{constructor(){super(...arguments),this.hass=null,this.config=[],this.noHeader=!1,this.templateMode=!1,this._editOpen=!1}_openEdit(){this._editOpen=!0,this.dispatchEvent(new CustomEvent("open-edit",{bubbles:!0,composed:!0}))}render(){return n`
      <div class="devices-card">
        ${this.noHeader?"":n`
          <div class="devices-card-header">
            <span class="card-dot" style="--dot-color: #3b82f6;"></span>
            <span class="devices-card-title">Sensors</span>
            <button class="edit-btn" @click=${this._openEdit}>⋮</button>
          </div>
        `}
        <div class="entity-list">
          ${(this.config||[]).map((t,e)=>{const i=t.entity_ids||[],a=this.templateMode?i.length>0?i.join(", "):"Template Sensor (No Entities)":i.map(o=>{var r,l,c;return((c=(l=(r=this.hass)==null?void 0:r.states[o])==null?void 0:l.attributes)==null?void 0:c.friendly_name)??o}).join(", ")||"—",s=Zs(t.aggregation||"min");return n`
              <div class="entity-row">
                <span class="type-badge ${t.type}">${t.type}</span>
                <div class="entity-name-wrap">
                  <span class="entity-name">${t.name||"Illuminance Sensors"}</span>
                  <span class="entity-id">${a}</span>
                </div>
                <span class="agg-badge" title="Aggregation Method">
                  ${s}
                </span>
              </div>
              ${e<this.config.length-1?n`<div class="divider"></div>`:""}
            `})}
          ${!this.config||this.config.length===0?n`
            <div class="empty-state">No sensors configured. Click edit to configure.</div>
          `:""}
        </div>
      </div>
    `}};ue.styles=[Zt,P`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      font-family: var(--font-family, inherit);
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      overflow: clip;
    }

    .devices-card {
      box-sizing: border-box;
      background: transparent;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .devices-card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px 12px;
    }

    .devices-card-title {
      flex: 1;
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
    }

    .edit-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.6;
      transition: opacity 0.15s, background 0.15s;
      font-size: 16px;
      line-height: 1;
    }
    .edit-btn:hover {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      opacity: 1;
    }

    .entity-list {
      padding: 0 0 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .entity-row {
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 20px;
    }

    .entity-row:hover {
      background: rgba(255, 255, 255, 0.015);
    }

    .entity-name-wrap {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }

    .entity-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .entity-id {
      font-size: 11px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px;
    }

    .type-badge {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
      color: #fff;
      min-width: 48px;
      text-align: center;
      letter-spacing: 0.3px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      height: 18px;
    }

    .type-badge.illuminance {
      background: rgba(230, 160, 0, 0.9);
      border: 1px solid rgba(230, 160, 0, 0.95);
    }

    .agg-badge {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      padding: 2px 8px;
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      color: var(--secondary-text-color);
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 18%, transparent);
      margin-left: auto;
      white-space: nowrap;
    }

    .divider {
      height: 1px;
      background: color-mix(in srgb, var(--primary-text-color, #fff) 8%, transparent);
      margin: 8px 20px;
    }

    .empty-state {
      padding: 20px;
      text-align: center;
      color: var(--secondary-text-color);
      font-size: 13px;
      font-style: italic;
    }
  `],ze([h({attribute:!1})],ue.prototype,"hass",2),ze([h({attribute:!1})],ue.prototype,"config",2),ze([h({type:Boolean})],ue.prototype,"noHeader",2),ze([h({type:Boolean})],ue.prototype,"templateMode",2),ze([b()],ue.prototype,"_editOpen",2),ue=ze([L("twilight-sensors-card")],ue);const Oo="respect_lux",ts="slot",Js="turn_off";function es(t){return{auto_expire:(t==null?void 0:t.auto_expire)??"03:00:00",transition_off_seconds:(t==null?void 0:t.transition_off_seconds)??0,expire_check_mode:Oo,action_type:ts,release_action_type:Js}}function Qs(t){const e=t.trim();if(e==="")return null;const i=e.split(":");if(i.length>3||!i.every(s=>/^\d+$/.test(s)))return null;const a=i.map(s=>parseInt(s,10));return a.length===1?a[0]:a.length===2?a[0]*60+a[1]:a[0]*3600+a[1]*60+a[2]}function Io(t){const e=Math.floor(t/3600),i=Math.floor(t%3600/60),a=t%60,s=o=>String(o).padStart(2,"0");return`${s(e)}:${s(i)}:${s(a)}`}function zo(t){const e=Qs(t);return e===null?null:Io(e)}function is(t){return t.trim()===""||Qs(t)!==null}function ta(t,e){const i=t??e;if(i==null)return"—";if(i==="00:00:00"||i===0||i==="0")return"none";if(typeof i=="number"){if(i<=0)return"none";const s=Math.floor(i/3600),o=Math.floor(i%3600/60),r=Math.floor(i%60);let l="";return s>0&&(l+=`${s}h `),o>0&&(l+=`${o}m `),r>0&&(l+=`${r}s`),l.trim()||"none"}const a=i.split(":");if(a.length===3){const s=parseInt(a[0],10),o=parseInt(a[1],10),r=parseInt(a[2],10);let l="";return s>0&&(l+=`${s}h `),o>0&&(l+=`${o}m `),r>0&&(l+=`${r}s`),l.trim()||"none"}return i}function ea(t){var i;const e=(t==null?void 0:t.type)||ts;return e==="slot"?"slot":e==="block"?"block":e==="reset"?"reset":e==="simulation"?"simulation":e==="entity"?`entity: ${((t==null?void 0:t.entity_id)||"").split(".")[1]||(t==null?void 0:t.entity_id)||"—"}`:e==="light"?`lights: ${((i=t==null?void 0:t.targets)==null?void 0:i.length)??0}`:e}function ia(t){const e=(t==null?void 0:t.type)||Js;return e==="turn_off"?"turn off":e==="slot"?"restore slot":e==="none"?"nothing":e}function sa(t,e){var a;const i=e==null?void 0:e.find(s=>s.id===t);return(a=i==null?void 0:i.action)!=null&&a.type?i.action.type:ts}function aa(t){return!t||t.length===0?[{id:"sleep",suppress_inputs:[],auto_expire:null}]:t}var Mo=Object.defineProperty,Po=Object.getOwnPropertyDescriptor,qt=(t,e,i,a)=>{for(var s=a>1?void 0:a?Po(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Mo(e,i,s),s};let Tt=class extends B{constructor(){super(...arguments),this.open=!1,this.hass=null,this.input=null,this.editIndex=null,this.activities=[],this.activitiesConfig=[],this.rules=[],this.placeholderDefaults=null,this.templateMode=!1,this._editDraft=null}willUpdate(t){(t.has("open")||t.has("input"))&&(this.open&&this.input?this._editDraft={...this.input}:this.open||(this._editDraft=null))}_cancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}_canTargetRule(t){return t.type==="binary"||t.type==="button"&&t.button_mode==="toggle"}_isSaveDisabled(t){const e=!this.templateMode&&t.type!=="timer"&&t.type!=="button"&&(!t.entity_ids||t.entity_ids.length===0),i=t.type==="timer"&&!Wi(t.trigger_time??""),a=!t.activity&&!t.rule,s=!!t.rule&&!this._canTargetRule(t);return e||i||a||s}_save(){if(!this._editDraft||this._isSaveDisabled(this._editDraft))return;const t={...this._editDraft,enabled:this.templateMode?!0:this._editDraft.enabled};t.type==="timer"?(t.trigger_time=ro(t.trigger_time??"")??"00:00:00",delete t.entity_ids,delete t.aggregation,delete t.aggregation_count,delete t.retrigger,delete t.event_type,delete t.lux_threshold,delete t.lux_watch_window,delete t.lux_ignore_active,delete t.lux_ignore_scope,delete t.label,delete t.button_mode,delete t.create_entity):t.type==="button"?(delete t.entity_ids,delete t.aggregation,delete t.aggregation_count,delete t.retrigger,delete t.event_type,delete t.lux_threshold,delete t.lux_watch_window,delete t.lux_ignore_active,delete t.lux_ignore_scope):(delete t.trigger_time,delete t.label,delete t.button_mode,delete t.create_entity,t.type!=="event"&&delete t.event_type,t.type!=="motion"&&(delete t.lux_threshold,delete t.lux_watch_window,delete t.lux_ignore_active,delete t.lux_ignore_scope),t.type!=="motion"&&delete t.retrigger,t.type!=="binary"&&(delete t.aggregation,delete t.aggregation_count)),!t.name||!t.name.trim()?delete t.name:t.name=t.name.trim(),this.dispatchEvent(new CustomEvent("save",{detail:t,bubbles:!0,composed:!0}))}_getIncludeDomains(t){return t==="binary"?["input_boolean","binary_sensor","switch","sensor"]:t==="event"?["event"]:t==="motion"?["binary_sensor","device_tracker","sensor","input_boolean","switch"]:[]}render(){var r,l,c,p,u,g;if(!this.open||!this._editDraft)return n``;const t=this._editDraft,e=this.editIndex!==null,i=this._isSaveDisabled(t),a=this._getIncludeDomains(t.type),s=((r=t.entity_ids)==null?void 0:r[0])||"",o=t.type==="event"&&s&&((p=(c=(l=this.hass)==null?void 0:l.states[s])==null?void 0:c.attributes)==null?void 0:p.event_types)||[];return n`
      <div class="overlay" style="z-index: 1100;" @click=${d=>{d.target===d.currentTarget&&this._cancel()}}>
        <div class="edit-panel" style="max-width: 560px; max-height: calc(100vh - 120px);">
          <div class="panel-header">
            <span class="card-dot" style="--dot-color: #10b981;"></span>
            <span class="panel-header-title">${e?"Edit Input":"Add Input"}</span>
            <button class="panel-close" @click=${this._cancel}>✕</button>
          </div>

          <div class="panel-body" style="padding: 16px 20px;">
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div class="form-field">
                <span class="form-label">Name (Optional)</span>
                <input
                  type="text"
                  class="activity-input"
                  placeholder="e.g. Motion Sensor"
                  .value=${t.name??""}
                  @input=${d=>{const f=d.target.value;this._editDraft={...this._editDraft,name:f||void 0}}}
                />
              </div>

              ${this.templateMode?"":n`
                <div class="form-field">
                  <span class="form-label">Status</span>
                  <select class="option-select" .value=${t.enabled!==!1?"true":"false"} @change=${d=>{this._editDraft={...this._editDraft,enabled:d.target.value==="true"}}}>
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              `}

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div class="form-field">
                  <span class="form-label">Type</span>
                  <select class="option-select" .value=${t.type} @change=${d=>{var y;const f=d.target.value,v=f==="binary";this._editDraft={...this._editDraft,type:f,entity_ids:[],aggregation:void 0,aggregation_count:void 0,retrigger:void 0,event_type:void 0,lux_threshold:null,lux_watch_window:null,lux_ignore_active:null,lux_ignore_scope:null,trigger_time:"00:00:00",label:"",button_mode:"click",...(y=this._editDraft)!=null&&y.rule&&!v?{rule:null,activity:this.activities[0]??null}:{}}}}>
                    <option value="binary">Binary</option>
                    <option value="button">Button</option>
                    <option value="event">Event</option>
                    <option value="motion">Motion</option>
                    <option value="timer">Timer</option>
                  </select>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                  <div class="form-field">
                    <span class="form-label">Target Type</span>
                    <select class="option-select" .value=${t.rule?"rule":"activity"} @change=${d=>{var v;if(d.target.value==="rule"){const y=((v=this.rules[0])==null?void 0:v.id)??"";this._editDraft={...this._editDraft,rule:y,activity:null}}else{const y=this.activities[0]??"";this._editDraft={...this._editDraft,activity:y,rule:null}}}}>
                      <option value="activity">Activity</option>
                      ${this._canTargetRule(t)?n`
                        <option value="rule" ?disabled=${(this.rules||[]).length===0}>Rule${(this.rules||[]).length===0?" (No rules)":""}</option>
                      `:""}
                    </select>
                  </div>

                  ${t.rule?n`
                    <div class="form-field">
                      <span class="form-label">Target Rule</span>
                      <select class="option-select" .value=${t.rule??""} @change=${d=>{this._editDraft={...this._editDraft,rule:d.target.value,activity:null}}}>
                        ${(this.rules||[]).map(d=>n`
                          <option value="${d.id}" ?selected=${d.id===t.rule}>${d.name||d.id}</option>
                        `)}
                      </select>
                    </div>
                  `:n`
                    <div class="form-field">
                      <span class="form-label">Target Activity</span>
                      <select class="option-select" @change=${d=>{this._editDraft={...this._editDraft,activity:d.target.value,rule:null}}}>
                        ${this.activities.map(d=>{const f=(this.activitiesConfig||[]).find(v=>v.id===d);return n`<option value="${d}" ?selected=${d===t.activity}>${(f==null?void 0:f.name)||(f==null?void 0:f.id)||d}</option>`})}
                      </select>
                    </div>
                  `}
                </div>
              </div>

              ${t.type==="timer"?n`
                <div class="form-field">
                  <span class="form-label">Trigger Time (HH:MM:SS)</span>
                  <input
                    type="text"
                    class="activity-input ${Wi(t.trigger_time??"")?"":"invalid"}"
                    .value=${t.trigger_time??"00:00:00"}
                    placeholder="22:00:00"
                    @input=${d=>{this._editDraft={...this._editDraft,trigger_time:d.target.value.trim()}}}
                  />
                  <span class="form-hint">Accepts <code>22</code>, <code>22:30</code> or <code>22:30:15</code> — saved as HH:MM:SS.</span>
                  ${Wi(t.trigger_time??"")?"":n`
                    <span class="form-error">Enter a time like 22, 22:30 or 22:30:15 (0–23h).</span>
                  `}
                </div>
              `:t.type==="button"?n`
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                  <div class="form-field">
                    <span class="form-label">Label (Optional)</span>
                    <input
                      type="text"
                      class="activity-input"
                      placeholder="e.g. Reset"
                      .value=${t.label??""}
                      @input=${d=>{this._editDraft={...this._editDraft,label:d.target.value}}}
                    />
                  </div>
                  <div class="form-field">
                    <span class="form-label">Mode</span>
                    <select class="option-select" .value=${t.button_mode??"click"} @change=${d=>{var v;const f=d.target.value;this._editDraft={...this._editDraft,button_mode:f,...(v=this._editDraft)!=null&&v.rule&&f==="click"?{rule:null,activity:this.activities[0]??null}:{}}}}>
                      <option value="click">Click (fire once)</option>
                      <option value="toggle">Toggle (on/off)</option>
                    </select>
                  </div>
                  <div class="form-field" style="grid-column: 1 / -1;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                      <input
                        type="checkbox"
                        ?checked=${t.create_entity??!1}
                        @change=${d=>{this._editDraft={...this._editDraft,create_entity:d.target.checked}}}
                      />
                      <span class="form-label" style="margin: 0;">Create HA entity</span>
                    </label>
                    <div style="font-size: 11px; color: var(--secondary-text-color); margin-top: 2px;">
                      Exposes this button in Home Assistant dashboards/automations —
                      a ${t.button_mode==="toggle"?"switch":"button"} entity.
                    </div>
                  </div>
                </div>
              `:this.templateMode?"":n`
                <div class="form-field">
                  <span class="form-label">Entities</span>
                  <table class="sensor-table">
                    <tbody>
                      ${(t.entity_ids||[]).map((d,f)=>{var y,w,x;const v=((x=(w=(y=this.hass)==null?void 0:y.states[d])==null?void 0:w.attributes)==null?void 0:x.friendly_name)??d;return n`
                          <tr class="sensor-row">
                            <td style="padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                              <div style="font-weight: 500; font-size: 13px;">${v}</div>
                              <div style="font-size: 11px; color: var(--secondary-text-color); font-family: monospace;">${d}</div>
                            </td>
                            <td style="text-align: center; width: 40px; padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                              <button class="sensor-remove-btn" title="Remove entity" @click=${()=>{this._editDraft={...this._editDraft,entity_ids:(this._editDraft.entity_ids||[]).filter((_,D)=>D!==f)}}}>✕</button>
                            </td>
                          </tr>
                        `})}
                      ${!t.entity_ids||t.entity_ids.length===0?n`
                        <tr>
                          <td colspan="2" style="text-align: center; color: var(--secondary-text-color); font-style: italic; padding: 12px; font-size: 12px; border-bottom: 1px solid rgba(255,255,255,0.04);">
                            No entities configured
                          </td>
                        </tr>
                      `:""}
                    </tbody>
                  </table>

                  <ha-entity-picker
                    .hass=${this.hass}
                    .includeDomains=${a}
                    allow-custom-entity
                    label="Add input entity"
                    @value-changed=${d=>{const f=d.detail.value;if(f){const v=this._editDraft.entity_ids||[];v.includes(f)||(this._editDraft={...this._editDraft,entity_ids:[...v,f]});const y=d.target;y&&(y.value="")}}}
                  ></ha-entity-picker>
                </div>
              `}

              ${t.type==="motion"?n`
                <div class="form-field" style="margin-top: 4px;">
                  <span class="form-label">Re-trigger</span>
                  <select class="option-select" .value=${t.retrigger??"every"} @change=${d=>{this._editDraft={...this._editDraft,retrigger:d.target.value||void 0}}}>
                    <option value="every">Every motion re-triggers the activity</option>
                    <option value="first">Only the first motion triggers the activity</option>
                  </select>
                  <span class="form-hint">Whether every motion re-triggers the activity, or only the first activation does.</span>
                </div>
              `:""}

              ${t.type==="binary"?n`
                <div class="form-field" style="margin-top: 4px;">
                  <span class="form-label">Combine multiple sensors</span>
                  <select class="option-select" .value=${t.aggregation??"any"} @change=${d=>{const f=d.target.value||void 0;this._editDraft={...this._editDraft,aggregation:f,aggregation_count:f!=="count"?void 0:this._editDraft.aggregation_count}}}>
                    <option value="any">Any (active if at least one is active)</option>
                    <option value="all">All (active only if all are active)</option>
                    <option value="count">Count (active if N or more are active)</option>
                  </select>
                  <span class="form-hint">How the states of multiple sensors combine into one active signal.</span>
                </div>

                ${t.aggregation==="count"?n`
                  <div class="form-field" style="margin-top: 4px;">
                    <span class="form-label">Required Active Entities (N)</span>
                    <input
                      type="number"
                      class="activity-input"
                      min="1"
                      .max=${String(Math.max(1,(t.entity_ids||[]).length))}
                      .value=${t.aggregation_count!=null?String(t.aggregation_count):"1"}
                      @input=${d=>{const f=d.target.value;this._editDraft={...this._editDraft,aggregation_count:f!==""?Number(f):1}}}
                    />
                  </div>
                `:""}
              `:""}

              ${t.type==="event"&&(t.entity_ids||[]).length>0?n`
                <div class="form-field">
                  <span class="form-label">Event Type (Optional)</span>
                  ${o.length>0?n`
                    <select class="option-select" @change=${d=>{this._editDraft={...this._editDraft,event_type:d.target.value||void 0}}}>
                      <option value="" ?selected=${!t.event_type}>All Events</option>
                      ${o.map(d=>n`
                        <option value="${d}" ?selected=${d===t.event_type}>${d}</option>
                      `)}
                    </select>
                  `:n`
                    <input
                      type="text"
                      class="activity-input"
                      placeholder="All Events"
                      .value=${t.event_type??""}
                      @input=${d=>{this._editDraft={...this._editDraft,event_type:d.target.value.trim()||void 0}}}
                    />
                  `}
                </div>
              `:""}

              ${t.type==="motion"?n`
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                  <div class="form-field">
                    <span class="form-label">Lux Threshold (lx)</span>
                    <input
                      type="number"
                      class="activity-input"
                      .placeholder=${String(((u=this.placeholderDefaults)==null?void 0:u.lux_threshold)??30)}
                      .value=${t.lux_threshold!==null?String(t.lux_threshold):""}
                      @input=${d=>{const f=d.target.value;this._editDraft={...this._editDraft,lux_threshold:f!==""?Number(f):null}}}
                      min="0"
                    />
                  </div>

                  <div class="form-field">
                    <span class="form-label">Lux Watch (sec)</span>
                    <input
                      type="number"
                      class="activity-input"
                      .placeholder=${String(((g=this.placeholderDefaults)==null?void 0:g.lux_watch_window)??10)}
                      .value=${t.lux_watch_window!==null?String(t.lux_watch_window):""}
                      @input=${d=>{const f=d.target.value;this._editDraft={...this._editDraft,lux_watch_window:f!==""?Number(f):null}}}
                      min="0"
                    />
                  </div>
                </div>

                <div class="form-field" style="margin-top: 4px;">
                  <span class="form-label">Ignore lux when scene active</span>
                  <select class="option-select" .value=${String(t.lux_ignore_active)} @change=${d=>{const f=d.target.value;this._editDraft={...this._editDraft,lux_ignore_active:f==="true"}}}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div class="form-field" style="margin-top: 4px;">
                  <span class="form-label">Ignore lux during</span>
                  <select class="option-select" .value=${t.lux_ignore_scope??"none"} @change=${d=>{const f=d.target.value;this._editDraft={...this._editDraft,lux_ignore_scope:f}}}>
                    <option value="none">None</option>
                    <option value="twilight_slots">Twilight slots (dawn/dusk/night)</option>
                    <option value="all_slots">All slots (incl. day)</option>
                  </select>
                </div>
              `:""}
            </div>
          </div>

          <div class="panel-footer" style="gap: 12px;">
            <button class="btn-cancel-dialog" @click=${this._cancel}>Cancel</button>
            <button class="btn-add-primary" ?disabled=${i} @click=${this._save}>${e?"Save":"Add"}</button>
          </div>
        </div>
      </div>
    `}};Tt.styles=[Et,P`
      :host {
        display: contents;
      }

      .panel-body {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding: 16px 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .sensor-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 8px;
      }
      .sensor-row:hover {
        background: rgba(255, 255, 255, 0.015);
      }
      .sensor-remove-btn {
        background: transparent;
        border: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 15px;
        padding: 4px;
        border-radius: 4px;
        transition: color 0.15s, background-color 0.15s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .sensor-remove-btn:hover {
        color: var(--error-color, #db4437);
        background: rgba(219, 68, 55, 0.1);
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .form-label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--secondary-text-color);
      }

      .form-hint {
        display: block;
        margin-top: 4px;
        font-size: 11px;
        line-height: 1.35;
        color: var(--secondary-text-color);
        opacity: 0.85;
      }
      .form-hint code {
        font-family: monospace;
        background: rgba(255, 255, 255, 0.06);
        padding: 0 4px;
        border-radius: 3px;
      }
      .form-error {
        display: block;
        margin-top: 4px;
        font-size: 11px;
        color: var(--error-color, #db4437);
      }

      .option-select {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.10);
        border-radius: 4px;
        color: var(--primary-text-color);
        padding: 8px 12px;
        font-size: 13px;
        outline: none;
        cursor: pointer;
        box-sizing: border-box;
        height: 38px;
      }
      .option-select:focus {
        border-color: var(--tp-accent, var(--accent-color, #e91e8c));
      }

      .activity-input {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.10);
        border-radius: 4px;
        color: var(--primary-text-color);
        padding: 8px 12px;
        font-size: 13px;
        outline: none;
        box-sizing: border-box;
        height: 38px;
        transition: border-color 0.15s;
      }
      .activity-input:focus {
        border-color: var(--tp-accent, var(--accent-color, #e91e8c));
      }
      .activity-input.invalid {
        border-color: var(--error-color, #db4437);
      }

      .btn-add-primary {
        background: var(--tp-accent, var(--accent-color, #e91e8c));
        color: white;
        border: none;
        padding: 10px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.15s;
      }
      .btn-add-primary:hover { opacity: 0.9; }
      .btn-add-primary:disabled {
        background: rgba(255, 255, 255, 0.05);
        color: var(--secondary-text-color);
        cursor: not-allowed;
      }
    `],qt([h({type:Boolean})],Tt.prototype,"open",2),qt([h({attribute:!1})],Tt.prototype,"hass",2),qt([h({attribute:!1})],Tt.prototype,"input",2),qt([h({type:Number})],Tt.prototype,"editIndex",2),qt([h({type:Array})],Tt.prototype,"activities",2),qt([h({attribute:!1})],Tt.prototype,"activitiesConfig",2),qt([h({attribute:!1})],Tt.prototype,"rules",2),qt([h({attribute:!1})],Tt.prototype,"placeholderDefaults",2),qt([h({type:Boolean})],Tt.prototype,"templateMode",2),qt([b()],Tt.prototype,"_editDraft",2),Tt=qt([L("twilight-input-row-editor")],Tt);function No(t){return{id:"",name:void 0,type:"binary",activity:t,enabled:!0,entity_ids:[],aggregation:void 0,aggregation_count:void 0,retrigger:void 0,trigger_time:"00:00:00",event_type:void 0,lux_threshold:null,lux_watch_window:null,lux_ignore_active:Ms,lux_ignore_scope:Ps,label:"",button_mode:"click",create_entity:!1}}var Ro=Object.defineProperty,Lo=Object.getOwnPropertyDescriptor,yt=(t,e,i,a)=>{for(var s=a>1?void 0:a?Lo(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Ro(e,i,s),s};let pt=class extends ce{constructor(){super(...arguments),this.open=!1,this.hass=null,this.config=[],this.activities=[],this.activitiesConfig=[],this.rulesConfig=[],this.placeholderDefaults=null,this.runState=null,this.templateMode=!1,this.areaId=null,this._subEditOpen=!1,this._subEditingIndex=null,this._subEditInput=null,this._dialog=new xe(this),this._draftController=new pi(this,{onOpen:()=>{this._subEditOpen=!1}})}_closeDiscard(){this._draftController.closeDiscard()}_getRuleName(t){if(!t)return"None";const e=(this.rulesConfig||[]).find(i=>i.id===t);return(e==null?void 0:e.name)||(e==null?void 0:e.id)||t}_getActivityName(t){if(!t)return"None";const e=(this.activitiesConfig||[]).find(i=>i.id===t);return(e==null?void 0:e.name)||(e==null?void 0:e.id)||t}_closeAndSave(){this._draftController.closeAndSave(new zi(this._draftController.draft||[]))}_openAddInput(){this._subEditingIndex=null,this._subEditInput=No(this.activities[0]||""),this._subEditOpen=!0}_openEditInput(t){const e=this._draftController.draft;e&&(this._subEditingIndex=t,this._subEditInput={...e[t]},this._subEditOpen=!0)}_onSubEditSave(t){const e=this._draftController.draft;if(!e)return;const i=t.detail,a=this._subEditingIndex,s=a===null?[...e,i]:e.map((o,r)=>r===a?i:o);this._draftController.draft=s,this._subEditOpen=!1,this.requestUpdate()}_onSubEditCancel(){this._subEditOpen=!1}_onRemoveInput(t){const e=this._draftController.draft;e&&(this._draftController.draft=e.filter((i,a)=>a!==t),this.requestUpdate())}_getResolvedMotionInfo(t){return Fi(t,this.placeholderDefaults)}render(){if(!this.open||!this._draftController.draft)return n``;const t=this._draftController.draft;return n`
      <div class="overlay" @click=${e=>{e.target===e.currentTarget&&!this._subEditOpen&&this._closeDiscard()}}>
        <div class="edit-panel list-panel">
          <div class="panel-header">
            <span class="card-dot" style="--dot-color: #10b981;"></span>
            <span class="panel-header-title">Inputs — Configuration</span>
            <button class="panel-close" @click=${this._closeDiscard}>✕</button>
          </div>

          <div class="panel-body">
            <div class="list-section-label">Configured Inputs</div>
            <table class="config-table input-table">
              <thead>
                <tr>
                  <th style="min-width: 30px;"></th>
                  <th style="min-width: 150px;">Name</th>
                  <th style="min-width: 80px;">Type</th>
                  <th style="min-width: 200px;">Entity / Info</th>
                  <th style="min-width: 140px;">Target Activity</th>
                  <th style="min-width: 100px; text-align: center;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${t.map((e,i)=>{var g,d;let a=n`—`,s=n`—`;if(this.templateMode)if(e.type==="motion"){const f=this._getResolvedMotionInfo(e),v=ni(f);a=n`<div style="opacity: 0.7; font-size: 11px;">${v}</div>`}else e.type==="timer"?a=n`<div class="entity-id">Trigger Time: ${e.trigger_time??"00:00:00"}</div>`:e.type==="event"&&e.event_type?a=n`<div style="opacity: 0.7; font-size: 11px;">Event Type: ${e.event_type}</div>`:e.type==="button"&&(a=n`<div style="opacity: 0.7; font-size: 11px;">Mode: ${e.button_mode??"click"}</div>`);else if(e.type==="motion"){const{friendlyName:f,subText:v}=li(e,this.hass??void 0);s=n`<div style="font-weight: 500; word-break: break-word;">${e.name||f}</div>`;const y=this._getResolvedMotionInfo(e),w=ni(y);a=n`
                        <div class="entity-id">${e.name?`${f} (${v})`:v}</div>
                        <div style="opacity: 0.7; font-size: 11px; margin-top: 2px;">${w}</div>
                      `}else if(e.type==="timer")s=n`<div style="font-weight: 500; word-break: break-word;">${e.name||"Daily Timer"}</div>`,a=n`<div class="entity-id">Trigger Time: ${e.trigger_time??"00:00:00"}</div>`;else if(e.type==="button")s=n`<div style="font-weight: 500; word-break: break-word;">${e.name||e.label||e.id}</div>`,a=n`<div style="opacity: 0.7; font-size: 11px;">Mode: ${e.button_mode??"click"}${e.create_entity?n` <ha-icon icon="mdi:home-assistant" style="--mdc-icon-size: 12px; vertical-align: middle;"></ha-icon>`:""}</div>`;else if(e.entity_ids&&e.entity_ids.length>0){const{friendlyName:f,subText:v}=li(e,this.hass??void 0);s=n`<div style="font-weight: 500; word-break: break-word;">${e.name||f}</div>`;let y=v;e.type==="event"&&e.event_type&&(y+=` [event: ${e.event_type}]`),a=n`<div class="entity-id">${e.name?`${f} (${y})`:y}</div>`}const o=(d=(g=this.runState)==null?void 0:g.inputs)==null?void 0:d[e.id],r=(o==null?void 0:o.disabled_by)||[],l=!!(e.entity_ids&&e.entity_ids.length>0),c=new Set;!this.templateMode&&e.type!=="timer"&&e.type!=="button"&&!l&&c.add("no_entity"),e.enabled===!1&&c.add("user");for(const f of r)c.add(f);const p=Array.from(c),u=e.enabled===!1||!this.templateMode&&e.type!=="timer"&&e.type!=="button"&&!l||p.length>0;return n`
                    <tr
                      class="input-row ${this._draftController.draggedIndex===i?"dragging":""} ${u?"disabled":""}"
                      draggable="true"
                      @dragstart=${f=>this._draftController.onDragStart(f,i)}
                      @dragover=${f=>this._draftController.onDragOver(f,i)}
                      @dragend=${()=>this._draftController.onDragEnd()}
                    >
                      <td style="text-align: center; padding: 0 4px; vertical-align: middle;">
                        <div class="drag-handle" title="Drag to reorder">⋮⋮</div>
                      </td>
                      <td>
                        <div style="font-weight: 600;">${At(e,this.hass)}</div>
                      </td>
                      <td>
                        <div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-start;">
                          <span class="type-badge ${e.type}">${e.type}</span>
                          ${p.map(f=>{let v="user",y="Disabled";return f==="no_entity"?(v="no_entity",y="No Entity"):f.startsWith("activity:")&&(v="activity",y=`Suppressed: ${f.substring(9)}`),n`
                              <span class="status-badge ${v}">${y}</span>
                            `})}
                        </div>
                      </td>
                      <td>
                        ${s}
                        ${a}
                      </td>
                      <td>
                        ${e.rule?n`
                          <span class="pill" title="Targets Rule">${this._getRuleName(e.rule)}</span>
                        `:n`
                          <span class="pill">${this._getActivityName(e.activity)}</span>
                        `}
                      </td>
                      <td style="text-align: center;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                          <button class="row-action-btn edit" title="Edit input" @click=${()=>this._openEditInput(i)}>✏️</button>
                          <button class="row-action-btn remove" title="Remove input" @click=${()=>this._onRemoveInput(i)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  `})}
                ${t.length===0?n`
                  <tr>
                    <td colspan="6" style="text-align: center; color: var(--secondary-text-color); font-style: italic; padding: 16px;">
                      No inputs configured
                    </td>
                  </tr>
                `:""}
              </tbody>
            </table>

            <div style="display: flex; justify-content: flex-start; margin-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 16px;">
              <button class="btn-add" @click=${this._openAddInput}>
                <span>+</span> Add Input
              </button>
            </div>
          </div>

          <div class="panel-footer">
            <button class="btn-save-dialog" @click=${this._closeAndSave}>Done</button>
          </div>
        </div>
      </div>

      <twilight-input-row-editor
        .open=${this._subEditOpen}
        .hass=${this.hass}
        .input=${this._subEditInput}
        .editIndex=${this._subEditingIndex}
        .activities=${this.activities}
        .activitiesConfig=${this.activitiesConfig}
        .rules=${this.rulesConfig}
        .placeholderDefaults=${this.placeholderDefaults}
        .templateMode=${this.templateMode}
        @save=${this._onSubEditSave}
        @cancel=${this._onSubEditCancel}
      ></twilight-input-row-editor>

      <twilight-alert-dialog
        .open=${this._dialog.alertOpen}
        .dialogTitle=${this._dialog.alertTitle}
        .message=${this._dialog.alertMessage}
        @close=${this._dialog._onCloseAlert}
      ></twilight-alert-dialog>
    `}};pt.styles=[de,Et,P`
      :host {
        display: contents;
      }

      .panel-body {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding: 16px 24px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .input-table {
        border-collapse: collapse;
      }
      .input-table th {
        text-align: left;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--secondary-text-color);
        padding: 6px 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .input-table td {
        padding: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        vertical-align: middle;
        font-size: 13px;
      }
      .input-row:hover {
        background: rgba(255, 255, 255, 0.015);
      }

      .row-action-btn {
        background: transparent;
        border: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 14px;
        padding: 6px 10px;
        border-radius: 6px;
        transition: color 0.15s, background-color 0.15s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .row-action-btn.edit:hover {
        color: var(--primary-text-color);
        background: rgba(255, 255, 255, 0.08);
      }
      .row-action-btn.remove:hover {
        color: var(--error-color, #db4437);
        background: rgba(219, 68, 55, 0.1);
      }
      .row-action-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
        pointer-events: none;
      }

      .input-row.dragging {
        opacity: 0.4;
        background: rgba(255, 255, 255, 0.08);
      }

      .drag-handle {
        cursor: grab;
        user-select: none;
        color: var(--secondary-text-color);
        opacity: 0.4;
        font-size: 15px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        transition: opacity 0.15s, color 0.15s;
      }

      .drag-handle:active {
        cursor: grabbing;
      }

      .input-row:hover .drag-handle {
        opacity: 0.8;
        color: var(--primary-text-color);
      }

      .list-section-label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.9px;
        color: var(--secondary-text-color);
        padding: 0 0 6px;
      }

      .pill {
        display: inline-block;
        font-size: 11px;
        padding: 1px 6px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.08);
        color: var(--secondary-text-color);
        margin-right: 4px;
      }

      .sensor-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 8px;
      }
      .sensor-row:hover {
        background: rgba(255, 255, 255, 0.015);
      }
      .sensor-remove-btn {
        background: transparent;
        border: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 15px;
        padding: 4px;
        border-radius: 4px;
        transition: color 0.15s, background-color 0.15s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .sensor-remove-btn:hover {
        color: var(--error-color, #db4437);
        background: rgba(219, 68, 55, 0.1);
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .form-label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--secondary-text-color);
      }

      .form-hint {
        display: block;
        margin-top: 4px;
        font-size: 11px;
        line-height: 1.35;
        color: var(--secondary-text-color);
        opacity: 0.85;
      }

      .option-select {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.10);
        border-radius: 4px;
        color: var(--primary-text-color);
        padding: 8px 12px;
        font-size: 13px;
        outline: none;
        cursor: pointer;
        box-sizing: border-box;
        height: 38px;
      }
      .option-select:focus {
        border-color: var(--tp-accent, var(--accent-color, #e91e8c));
      }

      .activity-input {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.10);
        border-radius: 4px;
        color: var(--primary-text-color);
        padding: 8px 12px;
        font-size: 13px;
        outline: none;
        box-sizing: border-box;
        height: 38px;
        transition: border-color 0.15s;
      }
      .activity-input:focus {
        border-color: var(--tp-accent, var(--accent-color, #e91e8c));
      }

      .btn-add {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: var(--primary-text-color);
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: background 0.15s, border-color 0.15s;
        width: fit-content;
      }
      .btn-add:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.2);
      }

      .btn-add-primary {
        background: var(--tp-accent, var(--accent-color, #e91e8c));
        color: white;
        border: none;
        padding: 10px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.15s;
      }
      .btn-add-primary:hover { opacity: 0.9; }
      .btn-add-primary:disabled {
        background: rgba(255, 255, 255, 0.05);
        color: var(--secondary-text-color);
        cursor: not-allowed;
      }


      .entity-id {
        font-size: 11px;
        color: var(--secondary-text-color);
        font-family: monospace;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin-top: 2px;
      }

      .status-badge {
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        padding: 2px 6px;
        border-radius: 4px;
        min-width: 48px;
        max-width: 100%;
        text-align: center;
        letter-spacing: 0.3px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        white-space: normal;
        line-height: 1.3;
      }

      .status-badge.no_entity {
        background: rgba(244, 67, 54, 0.12);
        border: 1px solid rgba(244, 67, 54, 0.3);
        color: #ff5252;
      }

      .status-badge.user {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: var(--secondary-text-color);
      }

      .status-badge.activity {
        background: rgba(233, 30, 140, 0.12);
        border: 1px solid rgba(233, 30, 140, 0.3);
        color: var(--tp-accent, #e91e8c);
      }

      .input-row.disabled {
        opacity: 0.55;
      }

      .input-row.disabled .type-badge,
      .input-row.disabled .entity-id {
        opacity: 0.45;
      }
    `],yt([h({type:Boolean})],pt.prototype,"open",2),yt([h({attribute:!1})],pt.prototype,"hass",2),yt([h({attribute:!1})],pt.prototype,"config",2),yt([h({type:Array})],pt.prototype,"activities",2),yt([h({attribute:!1})],pt.prototype,"activitiesConfig",2),yt([h({attribute:!1})],pt.prototype,"rulesConfig",2),yt([h({attribute:!1})],pt.prototype,"placeholderDefaults",2),yt([h({attribute:!1})],pt.prototype,"runState",2),yt([h({type:Boolean})],pt.prototype,"templateMode",2),yt([h({type:String})],pt.prototype,"areaId",2),yt([b()],pt.prototype,"_subEditOpen",2),yt([b()],pt.prototype,"_subEditingIndex",2),yt([b()],pt.prototype,"_subEditInput",2),pt=yt([L("twilight-inputs-dialog")],pt);var jo=Object.defineProperty,Ho=Object.getOwnPropertyDescriptor,Nt=(t,e,i,a)=>{for(var s=a>1?void 0:a?Ho(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&jo(e,i,s),s};let wt=class extends B{constructor(){super(...arguments),this.hass=null,this.config=[],this.activities=[],this.activitiesConfig=[],this.rulesConfig=[],this.noHeader=!1,this.placeholderDefaults=null,this.runState=null,this.templateMode=!1,this.areaId=null,this._editOpen=!1}_openEdit(){this._editOpen=!0,this.dispatchEvent(new CustomEvent("open-edit",{bubbles:!0,composed:!0}))}async _triggerButton(t,e){if(!this.hass||this._editOpen)return;const i=this.areaId;if(!i)return;const a={area_id:i,input_id:t.id};t.button_mode==="toggle"&&e!==void 0&&(a.active=e);try{await ao(this.hass,a)}catch(s){console.error("[twilight] trigger_input failed",s)}}_renderManualTriggers(){const t=this.config.filter(e=>e.type==="button");return t.length===0?n``:n`
      <div style="padding: 10px 12px 4px; border-bottom: 1px solid rgba(255,255,255,0.08);">
        <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--secondary-text-color); margin-bottom: 8px;">Manual Triggers</div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; padding-bottom: 10px;">
          ${t.map(e=>{var l,c,p;const i=(c=(l=this.runState)==null?void 0:l.inputs)==null?void 0:c[e.id],a=(i==null?void 0:i.active)||!1,o=(((p=i==null?void 0:i.disabled_by)==null?void 0:p.filter(u=>u!=="no_entity"))||[]).length>0||!!this._editOpen,r=e.name||e.label||e.id;return e.button_mode==="toggle"?n`
                <button
                  class="manual-trigger-btn ${a?"active":""}"
                  ?disabled=${o}
                  title="${o?"Disabled":a?"Click to deactivate":"Click to activate"}"
                  @click=${()=>this._triggerButton(e,!a)}
                >
                  <span class="manual-trigger-icon">${"⏻"}</span>
                  ${r}
                  ${a?n`<span class="manual-trigger-dot"></span>`:""}
                </button>
              `:n`
              <button
                class="manual-trigger-btn"
                ?disabled=${o}
                title="${o?"Disabled":`Trigger ${r}`}"
                @click=${()=>this._triggerButton(e)}
              >
                <span class="manual-trigger-icon">▶</span>
                ${r}
              </button>
            `})}
        </div>
      </div>
    `}_getEntityDisplay(t){return li(t,this.hass??void 0)}_getActivityActionType(t){return t?sa(t,this.activitiesConfig):"none"}_getActivityName(t){if(!t)return"";const e=(this.activitiesConfig||[]).find(i=>i.id===t);return(e==null?void 0:e.name)||(e==null?void 0:e.id)||t}_getRuleName(t){const e=(this.rulesConfig||[]).find(i=>i.id===t);return(e==null?void 0:e.name)||t}render(){return n`
      <div class="devices-card">
        ${this.noHeader?"":n`
          <div class="devices-card-header">
            <span class="card-dot" style="--dot-color: #10b981;"></span>
            <span class="devices-card-title">Inputs</span>
            <button class="edit-btn" @click=${this._openEdit}>⋮</button>
          </div>
        `}

        ${this._renderManualTriggers()}

        <div class="entity-list">
          ${this.config.map((t,e)=>{var u,g;const i=(g=(u=this.runState)==null?void 0:u.inputs)==null?void 0:g[t.id],a=(i==null?void 0:i.disabled_by)||[],s=this.templateMode||t.type==="button"?a.filter(d=>d!=="no_entity"):a,o=s.length>0,r=(i==null?void 0:i.active)||!1;let l="user";s.includes("no_entity")?l="no_entity":s.some(d=>d.startsWith("activity:"))?l="activity":s.some(d=>d.startsWith("rule:"))&&(l="rule");let c=n`—`,p=n`—`;if(this.templateMode){const d=At(t,this.hass);if(c=n`<span class="entity-name">${d}</span>`,t.type==="motion"){const f=Fi(t,this.placeholderDefaults),v=ni(f);p=n`<span class="entity-id" style="margin-top: 2px; font-family: inherit;">${v}</span>`}else t.type==="timer"?p=n`<span class="entity-id">Trigger Time: ${t.trigger_time??"00:00:00"}</span>`:t.type==="event"?t.event_type&&(p=n`<span class="entity-id">Event Type: ${t.event_type}</span>`):t.type==="button"&&(p=n`<span class="entity-id">Mode: ${t.button_mode??"click"}</span>`)}else if(t.type==="motion"){const{friendlyName:d,subText:f}=this._getEntityDisplay(t);c=n`<span class="entity-name">${t.name||d}</span>`;const v=Fi(t,this.placeholderDefaults),y=ni(v);p=n`
                  <span class="entity-id" style="font-family: monospace;">${t.name?`${d} (${f})`:f}</span>
                  <span class="entity-id" style="margin-top: 2px; font-family: inherit;">${y}</span>
                `}else if(t.type==="timer")c=n`<span class="entity-name">${t.name||"Daily Timer"}</span>`,p=n`
                  <span class="entity-id">Trigger Time: ${t.trigger_time??"00:00:00"}</span>
                `;else if(t.type==="button")c=n`<span class="entity-name">${t.name||t.label||"Button"}</span>`,p=n`<span class="entity-id">Mode: ${t.button_mode??"click"}${t.create_entity?n` <ha-icon icon="mdi:home-assistant" style="--mdc-icon-size: 12px; vertical-align: middle;"></ha-icon>`:""}</span>`;else{const{friendlyName:d,subText:f}=this._getEntityDisplay(t);c=n`<span class="entity-name">${t.name||d}</span>`;let v="";t.type==="event"&&t.event_type&&(v=` [event: ${t.event_type}]`),p=n`
                  <span class="entity-id">${t.name?`${d} (${f})`:f}${v}</span>
                `}return n`
              <div class="entity-row ${o?"disabled":""}">
                <span class="type-badge ${t.type}">${t.type}</span>
                <div class="entity-name-wrap">
                  ${c}
                  ${p}
                </div>
                ${r?n`<span class="active-indicator" title="Sensor active"></span>`:""}
                ${t.rule?n`
                  <span class="activity-badge rule" title="Targets Rule">${this._getRuleName(t.rule)}</span>
                `:t.activity?n`
                  <span class="activity-badge ${this._getActivityActionType(t.activity)}">${this._getActivityName(t.activity)}</span>
                `:n`
                  <span class="activity-badge none">None</span>
                `}
                ${o?n`
                  <div class="disabled-overlay">
                    <span class="disabler-badge ${l}">
                      ${no(s,this.rulesConfig,this.activitiesConfig)}
                    </span>
                  </div>
                `:""}
              </div>
              ${e<this.config.length-1?n`<div class="divider"></div>`:""}
            `})}
          ${this.config.length===0?n`
            <div class="empty-state">No inputs configured. Click edit to configure.</div>
          `:""}
        </div>
      </div>
    `}};wt.styles=[de,Zt,P`
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        font-family: var(--font-family, inherit);
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
        overflow: clip;
      }

      .devices-card {
        box-sizing: border-box;
        background: transparent;
        display: flex;
        flex-direction: column;
        flex: 1;
      }

      .devices-card-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 16px 20px 12px;
      }

      .devices-card-title {
        flex: 1;
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-text-color);
      }

      .edit-btn {
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--secondary-text-color);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.6;
        transition: opacity 0.15s, background 0.15s;
        font-size: 16px;
        line-height: 1;
      }
      .edit-btn:hover {
        background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
        color: var(--primary-text-color);
        opacity: 1;
      }

      .entity-list {
        padding: 0 0 12px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .entity-row {
        position: relative;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 20px;
      }

      .type-badge {
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        padding: 2px 6px;
        border-radius: 4px;
        color: #fff;
        min-width: 48px;
        text-align: center;
        letter-spacing: 0.3px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        height: 18px;
      }
      .type-badge.binary {
        background: rgba(63, 81, 181, 0.85);
        border: 1px solid rgba(63, 81, 181, 0.9);
      }
      .type-badge.event {
        background: rgba(156, 39, 176, 0.85);
        border: 1px solid rgba(156, 39, 176, 0.9);
      }
      .type-badge.motion {
        background: rgba(56, 142, 60, 0.9);
        border: 1px solid rgba(56, 142, 60, 0.95);
      }
      .type-badge.timer {
        background: rgba(230, 130, 0, 0.9);
        border: 1px solid rgba(230, 130, 0, 0.95);
      }
      .type-badge.button {
        background: rgba(139, 92, 246, 0.85);
        border: 1px solid rgba(139, 92, 246, 0.9);
      }

      .manual-trigger-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        background: rgba(255, 255, 255, 0.06);
        color: var(--primary-text-color);
        font-size: 13px;
        cursor: pointer;
        transition: background 0.15s, border-color 0.15s;
        position: relative;
      }

      .manual-trigger-btn:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 255, 255, 0.3);
      }

      .manual-trigger-btn.active {
        background: rgba(139, 92, 246, 0.22);
        border-color: rgba(139, 92, 246, 0.6);
      }

      .manual-trigger-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .manual-trigger-icon {
        font-size: 11px;
        opacity: 0.7;
      }

      .manual-trigger-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: rgba(139, 92, 246, 0.9);
        display: inline-block;
        margin-left: 2px;
      }

      .entity-name-wrap {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
      }

      .entity-name {
        font-size: 13px;
        color: var(--primary-text-color);
        font-weight: 600;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .entity-id {
        font-size: 11px;
        color: var(--secondary-text-color);
        font-family: monospace;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin-top: 2px;
      }

      .active-indicator {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--success-color, #4caf50);
        box-shadow: 0 0 8px var(--success-color, #4caf50);
        flex-shrink: 0;
        margin-right: 8px;
      }

      .disabled-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(var(--rgb-card-background-color, 20, 20, 31), 0.25);
        backdrop-filter: blur(1px);
        -webkit-backdrop-filter: blur(1px);
        pointer-events: none;
        z-index: 2;
      }

      .disabler-badge {
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        padding: 2px 6px;
        border-radius: 4px;
        min-width: 48px;
        text-align: center;
        letter-spacing: 0.3px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        height: 18px;
        white-space: nowrap;
      }

      .disabler-badge.no_entity {
        background: rgba(211, 47, 47, 0.9);
        border: 1px solid rgba(211, 47, 47, 0.95);
        color: #fff;
      }

      .disabler-badge.user {
        background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 18%, transparent);
        color: var(--secondary-text-color);
      }

      .disabler-badge.activity {
        background: rgba(194, 24, 91, 0.9);
        border: 1px solid rgba(194, 24, 91, 0.95);
        color: #fff;
      }

      .disabler-badge.rule {
        background: rgba(123, 31, 162, 0.9);
        border: 1px solid rgba(123, 31, 162, 0.95);
        color: #fff;
      }

      .entity-row.disabled .type-badge,
      .entity-row.disabled .entity-name-wrap,
      .entity-row.disabled .activity-badge {
        opacity: 0.45;
      }

      .divider {
        height: 1px;
        background: color-mix(in srgb, var(--primary-text-color, #fff) 8%, transparent);
        margin: 4px 20px;
      }

      .empty-state {
        padding: 24px;
        text-align: center;
        color: var(--secondary-text-color);
        font-style: italic;
        font-size: 13px;
      }
    `],Nt([h({attribute:!1})],wt.prototype,"hass",2),Nt([h({attribute:!1})],wt.prototype,"config",2),Nt([h({type:Array})],wt.prototype,"activities",2),Nt([h({attribute:!1})],wt.prototype,"activitiesConfig",2),Nt([h({attribute:!1})],wt.prototype,"rulesConfig",2),Nt([h({type:Boolean})],wt.prototype,"noHeader",2),Nt([h({attribute:!1})],wt.prototype,"placeholderDefaults",2),Nt([h({attribute:!1})],wt.prototype,"runState",2),Nt([h({type:Boolean})],wt.prototype,"templateMode",2),Nt([h({type:String})],wt.prototype,"areaId",2),Nt([b()],wt.prototype,"_editOpen",2),wt=Nt([L("twilight-inputs-card")],wt);var Uo=Object.defineProperty,Bo=Object.getOwnPropertyDescriptor,hi=(t,e,i,a)=>{for(var s=a>1?void 0:a?Bo(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Uo(e,i,s),s};let Me=class extends B{constructor(){super(...arguments),this.channels={},this.excludedSlotIds={},this._expandedNodes={}}get _nodes(){return Object.keys(this.channels).sort((e,i)=>e===A?-1:i===A?1:0).map(e=>{var i,a;return{id:e,label:((i=this.channels[e])==null?void 0:i.name)||e,children:(((a=this.channels[e])==null?void 0:a.slots)??[]).map(s=>({id:s.id,label:s.name||s.id}))}})}_isExcluded(t,e){return(this.excludedSlotIds[t]??[]).includes(e)}_isChannelIndeterminate(t){if(t.children.length===0)return!1;const e=t.children.filter(i=>this._isExcluded(t.id,i.id)).length;return e>0&&e<t.children.length}_isChannelFullyExcluded(t){return t.children.length>0&&t.children.every(e=>this._isExcluded(t.id,e.id))}_setChannelExcluded(t,e,i){const a={...this.excludedSlotIds};a[t]=i?e:[],this._emit(a)}_setSlotExcluded(t,e,i){const a=new Set(this.excludedSlotIds[t]??[]);i?a.add(e):a.delete(e);const s={...this.excludedSlotIds,[t]:[...a]};this._emit(s)}_emit(t){this.excludedSlotIds=t,this.dispatchEvent(new CustomEvent("excluded-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_toggleExpanded(t){this._expandedNodes={...this._expandedNodes,[t]:!this._expandedNodes[t]}}render(){const t=this._nodes;return t.length===0?n``:n`
      <p class="hint">Unchecked channels/slots are excluded: while this activity is active and one of its excluded slots is current, that channel is turned off instead of following the schedule.</p>
      <div class="tree">
        ${t.map(e=>{const i=!!this._expandedNodes[e.id],a=this._isChannelFullyExcluded(e);return n`
            <div class="tree-node">
              <div
                class="tree-node-header"
                @click=${s=>{s.target.tagName!=="INPUT"&&this._toggleExpanded(e.id)}}
              >
                <span class="tree-node-chevron ${i?"expanded":""}">&#9656;</span>
                <input
                  type="checkbox"
                  .checked=${!a}
                  .indeterminate=${this._isChannelIndeterminate(e)}
                  @change=${s=>{const o=s.target.checked;this._setChannelExcluded(e.id,e.children.map(r=>r.id),!o)}}
                />
                <span>${e.label}</span>
              </div>

              ${i?n`
                <div class="tree-node-children">
                  ${e.children.map(s=>n`
                    <div class="tree-leaf">
                      <input
                        type="checkbox"
                        .checked=${!this._isExcluded(e.id,s.id)}
                        @change=${o=>{const r=o.target.checked;this._setSlotExcluded(e.id,s.id,!r)}}
                      />
                      <span>${s.label}</span>
                    </div>
                  `)}
                </div>
              `:""}
            </div>
          `})}
      </div>
    `}};Me.styles=P`
    *, *:before, *:after {
      box-sizing: border-box;
    }

    .tree {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .tree-node {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .tree-node-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 500;
      padding: 6px 8px;
      border-radius: 6px;
      cursor: pointer;
      user-select: none;
    }

    .tree-node-header:hover {
      background: rgba(255, 255, 255, 0.04);
    }

    .tree-node-chevron {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      color: var(--secondary-text-color);
      transition: transform 0.2s;
    }

    .tree-node-chevron.expanded {
      transform: rotate(90deg);
    }

    .tree-node-children {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding-left: 28px;
      border-left: 1px dashed rgba(255, 255, 255, 0.1);
      margin-left: 14px;
    }

    .tree-leaf {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      padding: 4px 8px;
      color: var(--secondary-text-color);
    }

    input[type="checkbox"] {
      appearance: none;
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.05);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: background 0.15s, border-color 0.15s;
      outline: none;
      margin: 0;
      flex-shrink: 0;
    }

    input[type="checkbox"]:checked {
      background: var(--tp-accent, var(--accent-color, #e91e8c));
      border-color: var(--tp-accent, var(--accent-color, #e91e8c));
    }

    input[type="checkbox"]:checked::after {
      content: '';
      width: 8px;
      height: 4px;
      border-left: 2px solid white;
      border-bottom: 2px solid white;
      transform: rotate(-45deg) translate(1px, -1px);
      position: absolute;
    }

    input[type="checkbox"]:indeterminate {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.4);
    }

    input[type="checkbox"]:indeterminate::after {
      content: '';
      width: 8px;
      height: 2px;
      background: white;
      position: absolute;
    }

    .hint {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin: 0 0 4px 0;
    }
  `,hi([h({attribute:!1})],Me.prototype,"channels",2),hi([h({attribute:!1})],Me.prototype,"excludedSlotIds",2),hi([b()],Me.prototype,"_expandedNodes",2),Me=hi([L("twilight-slot-action-tree")],Me);var Fo=Object.defineProperty,Wo=Object.getOwnPropertyDescriptor,Rt=(t,e,i,a)=>{for(var s=a>1?void 0:a?Wo(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Fo(e,i,s),s};const oa={input_boolean:[{value:"on",label:"On"},{value:"off",label:"Off"},{value:"toggle",label:"Toggle"}],switch:[{value:"on",label:"On"},{value:"off",label:"Off"},{value:"toggle",label:"Toggle"}],script:[{value:"activate",label:"Activate"}]};function qo(){return{id:"",name:"",suppress_inputs:[],auto_expire:null,expire_check_mode:null,action_type:"",action_entity_id:"",action_targets:[],action_target_picker_value:"",action_state:"on",action_brightness:255,action_color_temp:370,action_entity_targets:[],action_excluded_slots:{},action_sim_template_activity:"",action_sim_lux_mode:"dusk_dawn",action_sim_heatmap_profile_id:"",release_action_type:"",transition_off_seconds:null}}function Vo(t){const e=t.action,i=t.release_action;return{id:t.id,name:t.name??"",suppress_inputs:[...t.suppress_inputs??[]],auto_expire:t.auto_expire??null,expire_check_mode:t.expire_check_mode??null,action_type:(e==null?void 0:e.type)??"",action_entity_id:(e==null?void 0:e.entity_id)??"",action_targets:(e==null?void 0:e.targets)??[],action_target_picker_value:"",action_state:(e==null?void 0:e.state)??"on",action_brightness:(e==null?void 0:e.brightness)??255,action_color_temp:(e==null?void 0:e.color_temp)??370,action_entity_targets:[...(e==null?void 0:e.entity_targets)??[]],action_excluded_slots:{...(e==null?void 0:e.excluded_slots)??{}},action_sim_template_activity:(e==null?void 0:e.template_activity)??"",action_sim_lux_mode:(e==null?void 0:e.lux_mode)??"dusk_dawn",action_sim_heatmap_profile_id:(e==null?void 0:e.heatmap_profile_id)??"",release_action_type:(i==null?void 0:i.type)??"",transition_off_seconds:t.transition_off_seconds??null}}let $t=class extends B{constructor(){super(...arguments),this.open=!1,this.hass=null,this.activity=null,this.editIndex=null,this.inputs=[],this.placeholderDefaults=null,this.channels={},this.existingIds=[],this.allActivities=[],this.heatmapProfiles=[],this._editDraft=null}willUpdate(t){(t.has("open")||t.has("activity"))&&(this.open&&this.activity?this._editDraft=this.editIndex===null&&this.activity.id===""?qo():Vo(this.activity):this.open||(this._editDraft=null))}_getFallbackActivityInfo(){return es(this.placeholderDefaults)}_eligibleTemplateActivities(){var e;const t=(e=this._editDraft)==null?void 0:e.id.trim().toLowerCase();return this.allActivities.filter(i=>{var s;if(i.id===t)return!1;const a=((s=i.action)==null?void 0:s.type)??"slot";return a==="slot"||a==="entity"||a==="light"})}_cancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}_isSaveDisabled(t){const e=!!(t.name.trim()||t.id.trim()),i=t.auto_expire!==null&&!is(t.auto_expire);return!e||i}_save(){if(!this._editDraft)return;let t=this._editDraft.id.trim().toLowerCase();const e=this._editDraft.name.trim()||void 0;t||(t=`activity_${Array.from({length:8},()=>Math.floor(Math.random()*16).toString(16)).join("")}`);const i=this._getFallbackActivityInfo(),a=this._editDraft.action_type===""?i.action_type:this._editDraft.action_type,s={type:a};a==="entity"?s.entity_id=this._editDraft.action_entity_id:a==="light"?(s.targets=this._editDraft.action_targets,s.state=this._editDraft.action_state,this._editDraft.action_state==="on"&&(s.brightness=this._editDraft.action_brightness,this._editDraft.action_color_temp>0&&(s.color_temp=this._editDraft.action_color_temp))):a==="reset"?this._editDraft.action_entity_targets.length>0&&(s.entity_targets=this._editDraft.action_entity_targets):a==="simulation"?(s.mode="presence_heatmap",s.template_activity=this._editDraft.action_sim_template_activity,s.lux_mode=this._editDraft.action_sim_lux_mode,this._editDraft.action_sim_heatmap_profile_id&&(s.heatmap_profile_id=this._editDraft.action_sim_heatmap_profile_id)):a==="slot"&&Object.values(this._editDraft.action_excluded_slots).some(p=>p.length>0)&&(s.excluded_slots=this._editDraft.action_excluded_slots);const r={type:a==="reset"?"none":this._editDraft.release_action_type===""?null:this._editDraft.release_action_type},l=this._editDraft.auto_expire===null?null:zo(this._editDraft.auto_expire),c={id:t,name:e,suppress_inputs:a==="reset"?[]:this._editDraft.suppress_inputs,auto_expire:a==="reset"?null:l,...a!=="reset"&&a!=="block"&&{expire_check_mode:this._editDraft.expire_check_mode??"respect_lux"},transition_off_seconds:a==="block"||a==="reset"?null:this._editDraft.transition_off_seconds,action:s,release_action:r};this.dispatchEvent(new CustomEvent("save",{detail:c,bubbles:!0,composed:!0}))}render(){if(!this.open||!this._editDraft)return n``;const t=this._editDraft,e=this.editIndex!==null,i=this._isSaveDisabled(t),a=this._getFallbackActivityInfo(),s=t.action_type===""?a.action_type:t.action_type;return n`
      <div class="overlay" style="z-index: 1100;" @click=${o=>{o.target===o.currentTarget&&this._cancel()}}>
        <div class="edit-panel" style="max-width: 640px; max-height: calc(100vh - 120px);">
          <div class="panel-header">
            <span class="card-dot" style="--dot-color: #a855f7;"></span>
            <span class="panel-header-title">${e?`Edit Activity: ${t.name||t.id}`:"Add Activity"}</span>
            <button class="panel-close" @click=${this._cancel}>✕</button>
          </div>

          <div class="panel-body" style="padding: 16px 20px;">
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div class="list-section-label">General</div>
                <div class="form-field">
                  <span class="form-label">Activity Name</span>
                  <input
                    type="text"
                    class="activity-input"
                    .value=${t.name||t.id}
                    placeholder="e.g. Cinema Mode"
                    @input=${o=>{this._editDraft={...this._editDraft,name:o.target.value}}}
                  />
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div class="list-section-label">Light Control</div>
                <div class="form-field">
                  <span class="form-label">Action Type</span>
                  <select
                    class="option-select"
                    .value=${t.action_type||a.action_type}
                    @change=${o=>{this._editDraft={...this._editDraft,action_type:o.target.value}}}
                  >
                    <option value="slot">Slot</option>
                    <option value="entity">Scene / Script</option>
                    <option value="light">Direct Lights</option>
                    <option value="block">Block Only (No Action)</option>
                    <option value="reset">Reset (Off + Idle)</option>
                    <option value="simulation">Presence Simulation</option>
                  </select>
                </div>

                ${s==="slot"?n`
                  <div class="form-field">
                    <span class="form-label">Channels / Slots</span>
                    <twilight-slot-action-tree
                      .channels=${this.channels}
                      .excludedSlotIds=${t.action_excluded_slots}
                      @excluded-changed=${o=>{this._editDraft={...this._editDraft,action_excluded_slots:o.detail.value}}}
                    ></twilight-slot-action-tree>
                  </div>
                `:""}

                ${t.action_type==="entity"?n`
                  <div class="form-field">
                    <span class="form-label">Scene or Script Entity</span>
                    <ha-entity-picker
                      .hass=${this.hass}
                      .value=${t.action_entity_id}
                      .includeDomains=${["scene","script"]}
                      allow-custom-entity
                      @value-changed=${o=>{this._editDraft={...this._editDraft,action_entity_id:o.detail.value??""}}}
                    ></ha-entity-picker>
                  </div>
                `:""}

                ${t.action_type==="light"?n`
                  <div class="form-field">
                    <span class="form-label">Target Lights</span>
                    <ha-entity-picker
                      .hass=${this.hass}
                      .value=${t.action_target_picker_value}
                      .includeDomains=${["light"]}
                      allow-custom-entity
                      placeholder="Select light to add..."
                      @value-changed=${o=>{const r=o.detail.value,l=this._editDraft.action_targets,c=r&&!l.includes(r)?[...l,r]:l;this._editDraft={...this._editDraft,action_targets:c,action_target_picker_value:""}}}
                    ></ha-entity-picker>
                    <div class="checkbox-list" style="margin-top: 8px;">
                      ${t.action_targets.map(o=>n`
                        <div class="checkbox-item" style="justify-content: space-between;">
                          <span>${o}</span>
                          <button class="row-action-btn remove" style="padding: 2px 6px;" @click=${()=>{this._editDraft={...this._editDraft,action_targets:this._editDraft.action_targets.filter(r=>r!==o)}}}>✕</button>
                        </div>
                      `)}
                      ${t.action_targets.length===0?n`<div style="font-style: italic; opacity: 0.4; font-size: 11px;">No lights selected</div>`:""}
                    </div>
                  </div>

                  <div class="form-field">
                    <span class="form-label">State</span>
                    <select class="option-select" .value=${t.action_state} @change=${o=>{this._editDraft={...this._editDraft,action_state:o.target.value}}}>
                      <option value="on">On</option>
                      <option value="off">Off</option>
                    </select>
                  </div>

                  ${t.action_state==="on"?n`
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                      <div class="form-field">
                        <span class="form-label">Brightness (1-255)</span>
                        <input
                          type="number"
                          class="activity-input"
                          min="1"
                          max="255"
                          .value=${String(t.action_brightness)}
                          @input=${o=>{this._editDraft={...this._editDraft,action_brightness:Number(o.target.value)}}}
                        />
                      </div>
                      <div class="form-field">
                        <span class="form-label">Color Temp (mireds, 0=skip)</span>
                        <input
                          type="number"
                          class="activity-input"
                          min="0"
                          max="500"
                          .value=${String(t.action_color_temp)}
                          @input=${o=>{this._editDraft={...this._editDraft,action_color_temp:Number(o.target.value)}}}
                        />
                      </div>
                    </div>
                  `:""}
                `:""}

                ${t.action_type==="reset"?n`
                  <div class="form-field">
                    <span class="form-label">Additional Entities</span>
                    <table class="sensor-table">
                      <tbody>
                        ${t.action_entity_targets.map((o,r)=>{var u,g,d;const l=o.entity_id.split(".")[0],c=oa[l]??[],p=((d=(g=(u=this.hass)==null?void 0:u.states[o.entity_id])==null?void 0:g.attributes)==null?void 0:d.friendly_name)??o.entity_id;return n`
                            <tr class="sensor-row">
                              <td style="padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                                <div style="font-weight: 500; font-size: 13px;">${p}</div>
                                <div style="font-size: 11px; color: var(--secondary-text-color); font-family: monospace;">${o.entity_id}</div>
                              </td>
                              <td style="text-align: right; width: 170px; padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                                <select
                                  class="option-select"
                                  style="width: 100%; min-width: 0;"
                                  @change=${f=>{const v=[...this._editDraft.action_entity_targets];v[r]={...o,action:f.target.value},this._editDraft={...this._editDraft,action_entity_targets:v}}}
                                >
                                  ${c.map(f=>n`<option value=${f.value} ?selected=${f.value===o.action}>${f.label}</option>`)}
                                </select>
                              </td>
                              <td style="text-align: center; width: 40px; padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                                <button class="sensor-remove-btn" title="Remove entity" @click=${()=>{this._editDraft={...this._editDraft,action_entity_targets:this._editDraft.action_entity_targets.filter((f,v)=>v!==r)}}}>✕</button>
                              </td>
                            </tr>
                          `})}
                        ${t.action_entity_targets.length===0?n`
                          <tr>
                            <td colspan="3" style="text-align: center; color: var(--secondary-text-color); font-style: italic; padding: 12px; font-size: 12px; border-bottom: 1px solid rgba(255,255,255,0.04);">
                              No additional entities
                            </td>
                          </tr>
                        `:""}
                      </tbody>
                    </table>

                    <ha-entity-picker
                      .hass=${this.hass}
                      .includeDomains=${["input_boolean","switch","script"]}
                      allow-custom-entity
                      label="Add entity"
                      @value-changed=${o=>{var l,c;const r=o.detail.value;if(r){const p=this._editDraft.action_entity_targets;if(!p.some(g=>g.entity_id===r)){const g=r.split(".")[0],d=((c=(l=oa[g])==null?void 0:l[0])==null?void 0:c.value)??"off";this._editDraft={...this._editDraft,action_entity_targets:[...p,{entity_id:r,action:d}]}}const u=o.target;u&&(u.value="")}}}
                    ></ha-entity-picker>
                  </div>
                `:""}

                ${t.action_type==="simulation"?n`
                  <div class="form-field">
                    <span class="form-label">Template Activity</span>
                    <select
                      class="option-select"
                      .value=${t.action_sim_template_activity}
                      @change=${o=>{this._editDraft={...this._editDraft,action_sim_template_activity:o.target.value}}}
                    >
                      <option value="">Select activity…</option>
                      ${this._eligibleTemplateActivities().map(o=>n`
                        <option value=${o.id} ?selected=${o.id===t.action_sim_template_activity}>${o.id}</option>
                      `)}
                    </select>
                    <span class="form-hint">Its start/release action is played back timed by the heatmap. Only light-switching activities (slot/scene/light) are listed.</span>
                  </div>

                  <div class="form-field">
                    <span class="form-label">Heatmap Profile</span>
                    <select
                      class="option-select"
                      .value=${t.action_sim_heatmap_profile_id}
                      @change=${o=>{this._editDraft={...this._editDraft,action_sim_heatmap_profile_id:o.target.value}}}
                    >
                      <option value="">Dynamic (last 30 days)</option>
                      ${this.heatmapProfiles.map(o=>n`
                        <option value=${o.id} ?selected=${o.id===t.action_sim_heatmap_profile_id}>${o.name}</option>
                      `)}
                    </select>
                  </div>

                  <div class="form-field">
                    <span class="form-label">Lux Mode</span>
                    <select
                      class="option-select"
                      .value=${t.action_sim_lux_mode}
                      @change=${o=>{this._editDraft={...this._editDraft,action_sim_lux_mode:o.target.value}}}
                    >
                      <option value="dusk_dawn">Only dusk–dawn</option>
                      <option value="threshold">Lux threshold</option>
                      <option value="always">Always</option>
                    </select>
                  </div>
                `:""}

                ${s!=="reset"?n`
                  <div class="form-field">
                    <span class="form-label">Release Action</span>
                    <select
                      class="option-select"
                      .value=${t.release_action_type||a.release_action_type}
                      @change=${o=>{this._editDraft={...this._editDraft,release_action_type:o.target.value}}}
                    >
                      <option value="turn_off">Turn Off</option>
                      <option value="slot">Restore Slot</option>
                      <option value="none">Nothing</option>
                    </select>
                  </div>
                `:""}
              </div>

              ${s!=="reset"?n`
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  <div class="list-section-label">Timing</div>

                  <div class="form-field">
                    <span class="form-label">Auto-Expire Duration (HH:MM:SS, 0 = never expires)</span>
                    <input
                      type="text"
                      class="activity-input ${t.auto_expire!==null&&!is(t.auto_expire)?"invalid":""}"
                      .value=${t.auto_expire&&t.auto_expire!=="00:00:00"&&t.auto_expire!=="0"?t.auto_expire:""}
                      .placeholder=${a.auto_expire}
                      @input=${o=>{this._editDraft={...this._editDraft,auto_expire:o.target.value.trim()||null}}}
                    />
                    <span class="form-hint">Accepts seconds (<code>90</code>), <code>M:SS</code> (<code>5:30</code>) or <code>H:MM:SS</code> — saved as HH:MM:SS.</span>
                    ${t.auto_expire!==null&&!is(t.auto_expire)?n`
                      <span class="form-error">Enter a duration like 90, 5:30 or 1:02:03.</span>
                    `:""}
                  </div>

                  ${s!=="block"&&s!=="reset"?n`
                    <div class="form-field">
                      <span class="form-label">Auto-Expire Motion Check</span>
                      <select class="option-select" .value=${t.expire_check_mode??"respect_lux"} @change=${o=>{this._editDraft={...this._editDraft,expire_check_mode:o.target.value}}}>
                        <option value="disabled">Disabled</option>
                        <option value="respect_lux">Enabled (respect lux)</option>
                        <option value="ignore_lux">Enabled (ignore lux)</option>
                      </select>
                    </div>
                  `:""}

                  ${s!=="block"&&s!=="reset"?n`
                    <div class="form-field">
                      <span class="form-label">Transition Off Duration (Seconds)</span>
                      <div class="form-desc">Fade duration when this activity is turned off or released.</div>
                      <input
                        type="number"
                        class="activity-input"
                        min="0"
                        max="300"
                        .placeholder=${String(a.transition_off_seconds)}
                        .value=${t.transition_off_seconds!=null?String(t.transition_off_seconds):""}
                        @input=${o=>{const r=o.target.value.trim();this._editDraft={...this._editDraft,transition_off_seconds:r===""?null:parseInt(r,10)||0}}}
                      />
                    </div>
                  `:""}
                </div>

                <div style="display: flex; flex-direction: column; gap: 12px;">
                  <div class="list-section-label">Input Suppression</div>
                  <div class="form-field">
                    <span class="form-label">Check inputs to ignore while active</span>
                    <div class="checkbox-list">
                      ${this.inputs.map(o=>{const r=t.suppress_inputs.includes(o.id);return n`
                          <label class="checkbox-item">
                            <input
                              type="checkbox"
                              ?checked=${r}
                              @change=${l=>{const c=l.target.checked,p=this._editDraft.suppress_inputs,u=c?[...p,o.id]:p.filter(g=>g!==o.id);this._editDraft={...this._editDraft,suppress_inputs:u}}}
                            />
                            <span>${At(o,this.hass)} (${o.type})</span>
                          </label>
                        `})}
                      ${this.inputs.length===0?n`<div style="font-style: italic; opacity: 0.4; font-size: 11px;">No inputs configured</div>`:""}
                    </div>
                  </div>
                </div>
              `:""}
            </div>
          </div>

          <div class="panel-footer" style="gap: 12px;">
            <button class="btn-cancel-dialog" @click=${this._cancel}>Cancel</button>
            <button class="btn-add-primary" ?disabled=${i} @click=${this._save}>${e?"Save":"Add"}</button>
          </div>
        </div>
      </div>
    `}};$t.styles=[de,Et,P`
      :host {
        display: contents;
      }

      .panel-body {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding: 16px 24px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .list-section-label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.9px;
        color: var(--secondary-text-color);
        padding: 0 0 6px;
      }

      .row-action-btn {
        background: transparent;
        border: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 14px;
        padding: 6px 10px;
        border-radius: 6px;
        transition: color 0.15s, background-color 0.15s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .row-action-btn.remove:hover {
        color: var(--error-color, #db4437);
        background: rgba(219, 68, 55, 0.1);
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .form-label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--secondary-text-color);
      }

      .activity-input {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.10);
        border-radius: 4px;
        color: var(--primary-text-color);
        padding: 8px 12px;
        font-size: 13px;
        outline: none;
        box-sizing: border-box;
        height: 38px;
        transition: border-color 0.15s;
      }
      .activity-input:focus {
        border-color: var(--tp-accent, var(--accent-color, #e91e8c));
      }
      .activity-input:disabled {
        background: rgba(255, 255, 255, 0.01);
        color: var(--secondary-text-color);
        cursor: not-allowed;
        border-color: rgba(255, 255, 255, 0.04);
      }
      .activity-input.invalid {
        border-color: var(--error-color, #db4437);
      }

      .form-hint {
        font-size: 11px;
        line-height: 1.35;
        color: var(--secondary-text-color);
        opacity: 0.85;
      }
      .form-hint code {
        font-family: monospace;
        background: rgba(255, 255, 255, 0.06);
        padding: 0 4px;
        border-radius: 3px;
      }
      .form-error {
        font-size: 11px;
        color: var(--error-color, #db4437);
      }

      .option-select {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.10);
        border-radius: 4px;
        color: var(--primary-text-color);
        padding: 8px 12px;
        font-size: 13px;
        outline: none;
        cursor: pointer;
        box-sizing: border-box;
        height: 38px;
      }
      .option-select:focus {
        border-color: var(--tp-accent, var(--accent-color, #e91e8c));
      }

      .btn-add-primary {
        background: var(--tp-accent, var(--accent-color, #e91e8c));
        color: white;
        border: none;
        padding: 10px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.15s;
      }
      .btn-add-primary:hover { opacity: 0.9; }
      .btn-add-primary:disabled {
        background: rgba(255, 255, 255, 0.05);
        color: var(--secondary-text-color);
        cursor: not-allowed;
      }

      .checkbox-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 6px;
        padding: 12px;
        max-height: 150px;
        overflow-y: auto;
      }

      .checkbox-item {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 13px;
        color: var(--primary-text-color);
        cursor: pointer;
      }
      .checkbox-item input {
        cursor: pointer;
      }

      .sensor-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 8px;
      }
      .sensor-row:hover {
        background: rgba(255, 255, 255, 0.015);
      }
      .sensor-remove-btn {
        background: transparent;
        border: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 15px;
        padding: 4px;
        border-radius: 4px;
        transition: color 0.15s, background-color 0.15s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .sensor-remove-btn:hover {
        color: var(--error-color, #db4437);
        background: rgba(219, 68, 55, 0.1);
      }
    `],Rt([h({type:Boolean})],$t.prototype,"open",2),Rt([h({attribute:!1})],$t.prototype,"hass",2),Rt([h({attribute:!1})],$t.prototype,"activity",2),Rt([h({type:Number})],$t.prototype,"editIndex",2),Rt([h({attribute:!1})],$t.prototype,"inputs",2),Rt([h({attribute:!1})],$t.prototype,"placeholderDefaults",2),Rt([h({attribute:!1})],$t.prototype,"channels",2),Rt([h({type:Array})],$t.prototype,"existingIds",2),Rt([h({attribute:!1})],$t.prototype,"allActivities",2),Rt([h({attribute:!1})],$t.prototype,"heatmapProfiles",2),Rt([b()],$t.prototype,"_editDraft",2),$t=Rt([L("twilight-activity-row-editor")],$t);var Yo=Object.defineProperty,Go=Object.getOwnPropertyDescriptor,Lt=(t,e,i,a)=>{for(var s=a>1?void 0:a?Go(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Yo(e,i,s),s};let Ct=class extends ce{constructor(){super(...arguments),this.open=!1,this.hass=null,this.config=[],this.inputs=[],this.placeholderDefaults=null,this.templateMode=!1,this.channels={},this.heatmapProfiles=[],this._subEditOpen=!1,this._subEditingIndex=null,this._subEditActivity=null,this._dialog=new xe(this),this._draftController=new pi(this,{onOpen:()=>{this._subEditOpen=!1}})}_closeDiscard(){this._draftController.closeDiscard()}_closeAndSave(){this._draftController.closeAndSave(new Mi({activities:this._draftController.draft||[]}))}_getFallbackActivityInfo(){return es(this.placeholderDefaults)}_openAddActivity(){this._subEditingIndex=null,this._subEditActivity={id:""},this._subEditOpen=!0}_openEditActivity(t){const e=this._draftController.draft;e&&(this._subEditingIndex=t,this._subEditActivity=e[t],this._subEditOpen=!0)}async _onSubEditSave(t){const e=this._draftController.draft;if(!e)return;const i=t.detail;if(this._subEditingIndex===null){const a=i.id;if(!/^[a-z0-9_-]+$/.test(a)){await this._dialog.showAlert("Invalid Name","Activity name must contain only lowercase letters, numbers, hyphens and underscores.");return}if(e.some(s=>s.id===a)){await this._dialog.showAlert("Duplicate Name","This activity name already exists!");return}this._draftController.draft=[...e,i]}else{const a=this._subEditingIndex,s=[...e];s[a]=i,this._draftController.draft=s}this._subEditOpen=!1,this.requestUpdate()}_onSubEditCancel(){this._subEditOpen=!1}_onRemoveActivity(t){const e=this._draftController.draft;e&&(this._draftController.draft=e.filter((i,a)=>a!==t),this.requestUpdate())}render(){if(!this.open||!this._draftController.draft)return n``;const t=this._draftController.draft;return n`
      <div class="overlay" @click=${e=>{e.target===e.currentTarget&&!this._subEditOpen&&this._closeDiscard()}}>
        <div class="edit-panel list-panel">
          <div class="panel-header">
            <span class="card-dot" style="--dot-color: #a855f7;"></span>
            <span class="panel-header-title">Activities — Configuration</span>
            <button class="panel-close" @click=${this._closeDiscard}>✕</button>
          </div>

          <div class="panel-body">
            <div style="display: flex; flex-direction: column; gap: 20px;">
              <div class="list-section-label">Configured Activities</div>
              <table class="config-table activity-table">
                <thead>
                  <tr>
                    <th style="min-width: 30px;"></th>
                    <th style="min-width: 140px;">Name</th>
                    <th style="min-width: 120px;">Triggers</th>
                    <th style="min-width: 100px;">Action</th>
                    <th style="min-width: 100px;">Release</th>
                    <th style="min-width: 100px;">Suppresses</th>
                    <th style="min-width: 100px;">Auto-Expire</th>
                    <th style="min-width: 100px; text-align: center;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${t.map((e,i)=>{var c,p;const a=this._getFallbackActivityInfo(),o=(((c=e.action)==null?void 0:c.type)||a.action_type)==="reset",l=(this.inputs||[]).filter(u=>u.activity===e.id).map(u=>At(u,this.hass));return n`
                      <tr
                        class="input-row ${this._draftController.draggedIndex===i?"dragging":""}"
                        draggable="true"
                        @dragstart=${u=>this._draftController.onDragStart(u,i)}
                        @dragover=${u=>this._draftController.onDragOver(u,i)}
                        @dragend=${()=>this._draftController.onDragEnd()}
                      >
                        <td style="text-align: center; padding: 0 4px; vertical-align: middle;">
                          <div class="drag-handle" title="Drag to reorder">⋮⋮</div>
                        </td>
                        <td>
                          <div style="font-weight: 600;">${e.name||e.id}</div>
                        </td>
                        <td style="color: var(--primary-text-color);">
                          ${l.length>0?l.map(u=>n`<span class="pill" style="margin-right: 4px;">${u}</span>`):n`<span style="opacity:0.4">—</span>`}
                        </td>
                        <td style="color: var(--primary-text-color);">
                          ${ea(e.action)}
                        </td>
                        <td style="color: var(--primary-text-color);">
                          ${o?"—":ia(e.release_action)}
                        </td>
                        <td style="color: var(--primary-text-color);">
                          ${(p=e.suppress_inputs)!=null&&p.length?e.suppress_inputs.map(u=>{const g=this.inputs.find(d=>d.id===u);return g?At(g,this.hass):u}).join(" · "):n`<span style="opacity:0.4">—</span>`}
                        </td>
                        <td style="color: var(--primary-text-color);">${o?"—":ta(e.auto_expire,a.auto_expire)}</td>
                        <td style="text-align: center;">
                          <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <button class="row-action-btn edit" title="Edit activity" @click=${()=>this._openEditActivity(i)}>✏️</button>
                            <button class="row-action-btn remove" title="Remove activity" @click=${()=>this._onRemoveActivity(i)}>✕</button>
                          </div>
                        </td>
                      </tr>
                    `})}
                  ${t.length===0?n`
                    <tr>
                      <td colspan="9" style="text-align: center; color: var(--secondary-text-color); font-style: italic; padding: 16px;">
                        No custom activities configured
                      </td>
                    </tr>
                  `:""}
                </tbody>
              </table>

              <div style="display: flex; justify-content: flex-start; margin-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 16px;">
                <button class="btn-add" @click=${this._openAddActivity}>
                  <span>+</span> Add Custom Activity
                </button>
              </div>

            </div>
          </div>

          <div class="panel-footer">
            <button class="btn-save-dialog" @click=${this._closeAndSave}>Done</button>
          </div>
        </div>
      </div>

      <twilight-activity-row-editor
        .open=${this._subEditOpen}
        .hass=${this.hass}
        .activity=${this._subEditActivity}
        .editIndex=${this._subEditingIndex}
        .inputs=${this.inputs}
        .placeholderDefaults=${this.placeholderDefaults}
        .channels=${this.channels}
        .existingIds=${(this._draftController.draft??[]).map(e=>e.id)}
        .allActivities=${this._draftController.draft??[]}
        .heatmapProfiles=${this.heatmapProfiles}
        @save=${this._onSubEditSave}
        @cancel=${this._onSubEditCancel}
      ></twilight-activity-row-editor>

      <twilight-alert-dialog
        .open=${this._dialog.alertOpen}
        .dialogTitle=${this._dialog.alertTitle}
        .message=${this._dialog.alertMessage}
        @close=${this._dialog._onCloseAlert}
      ></twilight-alert-dialog>
    `}};Ct.styles=[de,Et,P`
      :host {
        display: contents;
      }


      .panel-body {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding: 16px 24px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .activity-table {
        border-collapse: collapse;
      }
      .activity-table th {
        text-align: left;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--secondary-text-color);
        padding: 6px 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .activity-table td {
        padding: 10px 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        vertical-align: middle;
        font-size: 13px;
      }
      .input-row:hover {
        background: rgba(255, 255, 255, 0.015);
      }

      .row-action-btn {
        background: transparent;
        border: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 14px;
        padding: 6px 10px;
        border-radius: 6px;
        transition: color 0.15s, background-color 0.15s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .row-action-btn.edit:hover {
        color: var(--primary-text-color);
        background: rgba(255, 255, 255, 0.08);
      }
      .row-action-btn.remove:hover {
        color: var(--error-color, #db4437);
        background: rgba(219, 68, 55, 0.1);
      }

      .list-section-label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.9px;
        color: var(--secondary-text-color);
        padding: 0 0 6px;
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .form-label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--secondary-text-color);
      }

      .activity-input {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.10);
        border-radius: 4px;
        color: var(--primary-text-color);
        padding: 8px 12px;
        font-size: 13px;
        outline: none;
        box-sizing: border-box;
        height: 38px;
        transition: border-color 0.15s;
      }
      .activity-input:focus {
        border-color: var(--tp-accent, var(--accent-color, #e91e8c));
      }
      .activity-input:disabled {
        background: rgba(255, 255, 255, 0.01);
        color: var(--secondary-text-color);
        cursor: not-allowed;
        border-color: rgba(255, 255, 255, 0.04);
      }

      .option-select {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.10);
        border-radius: 4px;
        color: var(--primary-text-color);
        padding: 8px 12px;
        font-size: 13px;
        outline: none;
        cursor: pointer;
        box-sizing: border-box;
        height: 38px;
      }
      .option-select:focus {
        border-color: var(--tp-accent, var(--accent-color, #e91e8c));
      }

      .btn-add {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: var(--primary-text-color);
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: background 0.15s, border-color 0.15s;
        width: fit-content;
      }
      .btn-add:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.2);
      }

      .btn-add-primary {
        background: var(--tp-accent, var(--accent-color, #e91e8c));
        color: white;
        border: none;
        padding: 10px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.15s;
      }
      .btn-add-primary:hover { opacity: 0.9; }
      .btn-add-primary:disabled {
        background: rgba(255, 255, 255, 0.05);
        color: var(--secondary-text-color);
        cursor: not-allowed;
      }


      .checkbox-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 6px;
        padding: 12px;
        max-height: 150px;
        overflow-y: auto;
      }

      .checkbox-item {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 13px;
        color: var(--primary-text-color);
        cursor: pointer;
      }
      .checkbox-item input {
        cursor: pointer;
      }

      .sensor-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 8px;
      }
      .sensor-row:hover {
        background: rgba(255, 255, 255, 0.015);
      }
      .sensor-remove-btn {
        background: transparent;
        border: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 15px;
        padding: 4px;
        border-radius: 4px;
        transition: color 0.15s, background-color 0.15s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .sensor-remove-btn:hover {
        color: var(--error-color, #db4437);
        background: rgba(219, 68, 55, 0.1);
      }

      .input-row.dragging {
        opacity: 0.4;
        background: rgba(255, 255, 255, 0.08);
      }

      .drag-handle {
        cursor: grab;
        user-select: none;
        color: var(--secondary-text-color);
        opacity: 0.4;
        font-size: 15px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        transition: opacity 0.15s, color 0.15s;
      }

      .drag-handle:active {
        cursor: grabbing;
      }

      .input-row:hover .drag-handle {
        opacity: 0.8;
        color: var(--primary-text-color);
      }

      .divider {
        height: 1px;
        background: color-mix(in srgb, var(--primary-text-color, #fff) 8%, transparent);
        margin: 16px 0 8px 0;
      }

      .pill {
        display: inline-block;
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.08);
        color: var(--secondary-text-color);
        font-weight: 500;
      }
    `],Lt([h({type:Boolean})],Ct.prototype,"open",2),Lt([h({attribute:!1})],Ct.prototype,"hass",2),Lt([h({attribute:!1})],Ct.prototype,"config",2),Lt([h({attribute:!1})],Ct.prototype,"inputs",2),Lt([h({attribute:!1})],Ct.prototype,"placeholderDefaults",2),Lt([h({type:Boolean})],Ct.prototype,"templateMode",2),Lt([h({attribute:!1})],Ct.prototype,"channels",2),Lt([h({attribute:!1})],Ct.prototype,"heatmapProfiles",2),Lt([b()],Ct.prototype,"_subEditOpen",2),Lt([b()],Ct.prototype,"_subEditingIndex",2),Lt([b()],Ct.prototype,"_subEditActivity",2),Ct=Lt([L("twilight-activities-dialog")],Ct);var Xo=Object.defineProperty,Ko=Object.getOwnPropertyDescriptor,Qt=(t,e,i,a)=>{for(var s=a>1?void 0:a?Ko(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Xo(e,i,s),s};let jt=class extends B{constructor(){super(...arguments),this.hass=null,this.config=[],this.inputs=[],this.noHeader=!1,this.placeholderDefaults=null,this.templateMode=!1,this.channels={},this.heatmapProfiles=[],this._editOpen=!1}_openEdit(){this._editOpen=!0,this.dispatchEvent(new CustomEvent("open-edit",{bubbles:!0,composed:!0}))}render(){return n`
      <div class="devices-card">
        ${this.noHeader?"":n`
          <div class="devices-card-header">
            <span class="card-dot" style="--dot-color: #a855f7;"></span>
            <span class="devices-card-title">Activities</span>
            <button class="edit-btn" @click=${this._openEdit}>⋮</button>
          </div>
        `}

        <div class="entity-list">
          ${this.config.map((t,e)=>{var d,f;const i=es(this.placeholderDefaults),s=(((d=t.action)==null?void 0:d.type)||i.action_type)==="reset",o=ea(t.action),r=ta(t.auto_expire,i.auto_expire),l=s?"—":ia(t.release_action),c=(f=t.suppress_inputs)!=null&&f.length?t.suppress_inputs.map(v=>{const y=this.inputs.find(w=>w.id===v);return y?At(y,this.hass):v}).join(", "):"none",p=(this.inputs||[]).filter(v=>v.activity===t.id),u=p.length>0?p.map(v=>At(v,this.hass)).join(", "):"none",g=s?`Triggers: ${u} · Action: ${o}`:`Triggers: ${u} · Action: ${o} · Auto-expire: ${r} · Release: ${l} · Suppresses: ${c}`;return n`
              <div class="activity-row">
                <span class="activity-badge ${sa(t.id,this.config)}">${t.name||t.id}</span>
                <div class="activity-desc">
                  <div style="font-weight: 600;">${t.name||t.id}</div>
                  <div style="font-size: 11px; color: var(--secondary-text-color); margin-top: 2px;">
                    ${g}
                  </div>
                </div>
              </div>
              ${e<this.config.length-1?n`<div class="divider"></div>`:""}
            `})}
          ${this.config.length===0?n`
            <div style="padding:20px; text-align:center; color: var(--secondary-text-color); font-style:italic;">
              No custom activities configured
            </div>
          `:""}
        </div>
      </div>
    `}};jt.styles=[de,Zt,P`
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        font-family: var(--font-family, inherit);
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
        overflow: clip;
      }

      .devices-card {
        box-sizing: border-box;
        background: transparent;
        display: flex;
        flex-direction: column;
        flex: 1;
      }

      .devices-card-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 16px 20px 12px;
      }

      .devices-card-title {
        flex: 1;
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-text-color);
      }

      .edit-btn {
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--secondary-text-color);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.6;
        transition: opacity 0.15s, background 0.15s;
        font-size: 16px;
        line-height: 1;
      }
      .edit-btn:hover {
        background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
        color: var(--primary-text-color);
        opacity: 1;
      }

      .entity-list {
        padding: 0 0 12px;
        display: flex;
        flex-direction: column;
      }

      .activity-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 20px;
      }

      .activity-desc {
        font-size: 13px;
        color: var(--primary-text-color);
        flex: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .divider {
        height: 1px;
        background: color-mix(in srgb, var(--primary-text-color, #fff) 8%, transparent);
        margin: 4px 20px;
      }
    `],Qt([h({attribute:!1})],jt.prototype,"hass",2),Qt([h({attribute:!1})],jt.prototype,"config",2),Qt([h({attribute:!1})],jt.prototype,"inputs",2),Qt([h({type:Boolean})],jt.prototype,"noHeader",2),Qt([h({attribute:!1})],jt.prototype,"placeholderDefaults",2),Qt([h({type:Boolean})],jt.prototype,"templateMode",2),Qt([h({attribute:!1})],jt.prototype,"channels",2),Qt([h({attribute:!1})],jt.prototype,"heatmapProfiles",2),Qt([b()],jt.prototype,"_editOpen",2),jt=Qt([L("twilight-activities-card")],jt);var Zo=Object.defineProperty,Jo=Object.getOwnPropertyDescriptor,se=(t,e,i,a)=>{for(var s=a>1?void 0:a?Jo(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Zo(e,i,s),s};let Vt=class extends B{constructor(){super(...arguments),this.open=!1,this.rule=null,this.editIndex=null,this.inputsConfig=[],this.activitiesConfig=[],this.channels={},this.siblings=[],this._editDraft=null}updated(t){if(t.has("open")||t.has("rule"))if(this.open&&this.rule){this._editDraft=structuredClone(this.rule);const i=(this.activitiesConfig||[]).map(a=>a.id)[0]||"motion";(!this._editDraft.applied_activities||this._editDraft.applied_activities.length===0)&&(this._editDraft.applied_activities=[i]),this._editDraft.suppressed_inputs_override||(this._editDraft.suppressed_inputs_override=[])}else this.open||(this._editDraft=null)}_onSlotOverridesChanged(t,e){this._editDraft&&(this._editDraft={...this._editDraft,applied_activities:[t],excluded_slots_override:{...this._editDraft.excluded_slots_override||{},[t]:e}},this.requestUpdate())}_cancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}_save(){if(!this._editDraft)return;const t=(this.activitiesConfig||[]).map(a=>a.id),e=this._editDraft.applied_activities&&this._editDraft.applied_activities.length>0?this._editDraft.applied_activities[0]:t[0];let i={...this._editDraft,applied_activities:[e],suppressed_inputs_override:this._editDraft.suppressed_inputs_override||[]};if(!i.id){const a=new Set((this.siblings||[]).map(o=>o.id));let s=`rule_${Array.from({length:8},()=>Math.floor(Math.random()*16).toString(16)).join("")}`;for(;a.has(s);)s=`rule_${Array.from({length:8},()=>Math.floor(Math.random()*16).toString(16)).join("")}`;i.id=s}this.dispatchEvent(new CustomEvent("save",{detail:i,bubbles:!0,composed:!0}))}render(){var l,c;if(!this.open||!this._editDraft)return n``;const t=this._editDraft,e=this.editIndex!==null,i=!((l=t.name)!=null&&l.trim()),a=(this.activitiesConfig||[]).map(p=>p.id),s=t.applied_activities&&t.applied_activities.length>0?t.applied_activities[0]:a[0],o=t.suppressed_inputs_override||[],r=(this.inputsConfig||[]).filter(p=>!t.id||p.rule!==t.id);return n`
      <div class="overlay" @click=${p=>{p.target===p.currentTarget&&this._cancel()}}>
        <div class="edit-panel" style="max-width: 650px;" @click=${p=>p.stopPropagation()}>
          <div class="panel-header">
            <span class="panel-header-title">${e?`Edit Rule: ${t.name||t.id}`:"Add Rule"}</span>
            <button class="panel-close" @click=${this._cancel}>✕</button>
          </div>

          <div class="panel-body">
            <div class="form-field">
              <div class="list-section-label">General</div>
              <span class="form-label">Rule Name</span>
              <input
                type="text"
                class="activity-input"
                placeholder="e.g. Nachtmodus Ausnahmen"
                .value=${t.name||""}
                @input=${p=>{this._editDraft={...this._editDraft,name:p.target.value}}}
              />
            </div>

            <div class="form-field">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input
                  type="checkbox"
                  ?checked=${t.enabled??!0}
                  @change=${p=>{this._editDraft={...this._editDraft,enabled:p.target.checked}}}
                />
                <span class="form-label" style="margin: 0;">Enable Rule</span>
              </label>
            </div>

            <div class="form-field">
              <div class="list-section-label">Target Activity & Excluded Slots</div>
              <span class="form-label">Target Activity</span>
              <select class="option-select" .value=${s} @change=${p=>{const u=p.target.value;this._editDraft={...this._editDraft,applied_activities:[u]}}}>
                ${a.map(p=>{const u=(this.activitiesConfig||[]).find(g=>g.id===p);return n`<option value="${p}" ?selected=${p===s}>${(u==null?void 0:u.name)||(u==null?void 0:u.id)||p}</option>`})}
              </select>
              <span class="form-hint">Select the single activity whose channel/slot schedule this rule overrides when active.</span>
            </div>

            <div class="form-field">
              <span class="form-label">Auto-Expire Behavior</span>
              <select class="option-select" .value=${t.auto_expire_mode||"none"} @change=${p=>{const u=p.target.value;this._editDraft={...this._editDraft,auto_expire_mode:u}}}>
                <option value="none" ?selected=${(t.auto_expire_mode||"none")==="none"}>None</option>
                <option value="pause" ?selected=${t.auto_expire_mode==="pause"}>Pause</option>
                <option value="suspend" ?selected=${t.auto_expire_mode==="suspend"}>Suspend</option>
                <option value="restart" ?selected=${t.auto_expire_mode==="restart"}>Restart</option>
              </select>
              <span class="form-hint">Controls what happens to the target activity's auto-expire timer while this rule is active. Pause: freeze the remaining time. Suspend: freeze at zero, so the activity expires as soon as the rule ends. Restart: resume with the full duration once the rule ends.</span>
            </div>

            <div class="form-field">
              <div class="list-section-label">Input Suppression</div>
              <span class="form-label">Suppressed Inputs</span>
              <div class="checkbox-list">
                ${r.map(p=>{const u=o.includes(p.id);return n`
                    <label class="checkbox-item">
                      <input
                        type="checkbox"
                        ?checked=${u}
                        @change=${g=>{const d=g.target.checked,f=this._editDraft.suppressed_inputs_override||[],v=d?[...f,p.id]:f.filter(y=>y!==p.id);this._editDraft={...this._editDraft,suppressed_inputs_override:v}}}
                      />
                      <span>${At(p,null)} (${p.type})</span>
                    </label>
                  `})}
                ${r.length===0?n`<div style="font-style: italic; opacity: 0.4; font-size: 11px;">No eligible inputs configured</div>`:""}
              </div>
              <span class="form-hint">Check inputs that should be suppressed/ignored while this rule is active.</span>
            </div>

            <div class="form-field">
              <span class="form-label">Channels / Slots</span>
              <twilight-slot-action-tree
                .channels=${this.channels}
                .excludedSlotIds=${((c=t.excluded_slots_override)==null?void 0:c[s])||{}}
                @excluded-changed=${p=>this._onSlotOverridesChanged(s,p.detail.value)}
              ></twilight-slot-action-tree>
            </div>
          </div>

          <div class="panel-footer">
            <button class="btn-cancel-dialog" @click=${this._cancel}>Cancel</button>
            <button class="btn-save-dialog" ?disabled=${i} @click=${this._save}>${e?"Save":"Add"}</button>
          </div>
        </div>
      </div>
    `}};Vt.styles=[de,Et,P`
      :host {
        display: contents;
      }

      .panel-body {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding: 16px 24px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .list-section-label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.9px;
        color: var(--secondary-text-color);
        padding: 0 0 6px;
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .form-label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--secondary-text-color);
      }

      .form-hint {
        display: block;
        margin-top: 4px;
        font-size: 11px;
        line-height: 1.35;
        color: var(--secondary-text-color);
        opacity: 0.85;
      }

      .activity-input {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.10);
        border-radius: 4px;
        color: var(--primary-text-color);
        padding: 8px 12px;
        font-size: 13px;
        outline: none;
        box-sizing: border-box;
        height: 38px;
        transition: border-color 0.15s;
      }
      .activity-input:focus {
        border-color: var(--tp-accent, var(--accent-color, #e91e8c));
      }

      .option-select {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.10);
        border-radius: 4px;
        color: var(--primary-text-color);
        padding: 8px 12px;
        font-size: 13px;
        outline: none;
        cursor: pointer;
        box-sizing: border-box;
        height: 38px;
      }
      .option-select:focus {
        border-color: var(--tp-accent, var(--accent-color, #e91e8c));
      }

      .checkbox-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 6px;
        padding: 12px;
        max-height: 150px;
        overflow-y: auto;
      }

      .checkbox-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        cursor: pointer;
      }
    `],se([h({type:Boolean})],Vt.prototype,"open",2),se([h({attribute:!1})],Vt.prototype,"rule",2),se([h({type:Number})],Vt.prototype,"editIndex",2),se([h({attribute:!1})],Vt.prototype,"inputsConfig",2),se([h({attribute:!1})],Vt.prototype,"activitiesConfig",2),se([h({attribute:!1})],Vt.prototype,"channels",2),se([h({attribute:!1})],Vt.prototype,"siblings",2),se([b()],Vt.prototype,"_editDraft",2),Vt=se([L("twilight-rule-row-editor")],Vt);function Qo(){return{id:"",name:"",enabled:!0,applied_activities:[],excluded_slots_override:{},auto_expire_mode:"none",suppressed_inputs_override:[]}}var tr=Object.defineProperty,er=Object.getOwnPropertyDescriptor,Yt=(t,e,i,a)=>{for(var s=a>1?void 0:a?er(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&tr(e,i,s),s};let Ot=class extends B{constructor(){super(...arguments),this.open=!1,this.hass=null,this.config=[],this.inputsConfig=[],this.activitiesConfig=[],this.channels={},this._subEditOpen=!1,this._subEditingIndex=null,this._subEditRule=null,this._draftController=new pi(this,{onOpen:()=>{this._subEditOpen=!1}})}set rules(t){this.config=t||[]}get rules(){return this.config}_closeDiscard(){this._draftController.closeDiscard()}_closeAndSave(){this._draftController.closeAndSave(new Pi(this._draftController.draft||[]))}_openAddRule(){this._subEditingIndex=null,this._subEditRule=Qo(),this._subEditOpen=!0}_openEditRule(t){const e=this._draftController.draft;e&&(this._subEditingIndex=t,this._subEditRule=structuredClone(e[t]),this._subEditOpen=!0)}_closeSubEdit(){this._subEditOpen=!1,this._subEditingIndex=null,this._subEditRule=null}_handleSubEditSave(t){const e=this._draftController.draft;if(!e)return;const i=t.detail,a=new Set((this.inputsConfig||[]).filter(l=>l.rule===i.id).map(l=>l.id)),s=(i.suppressed_inputs_override||[]).filter(l=>!a.has(l)),o={...i,suppressed_inputs_override:s},r=[...e];this._subEditingIndex===null?r.push(o):r[this._subEditingIndex]=o,this._draftController.draft=r,this.requestUpdate(),this._closeSubEdit()}_removeRule(t){const e=this._draftController.draft;if(!e)return;const i=[...e];i.splice(t,1),this._draftController.draft=i,this.requestUpdate()}render(){if(!this.open)return n``;const t=this._draftController.draft||[];return n`
      <div class="overlay" @click=${e=>{e.target===e.currentTarget&&!this._subEditOpen&&this._closeDiscard()}}>
        <div class="edit-panel list-panel">
          <div class="panel-header">
            <span class="card-dot" style="--dot-color: #ef4444;"></span>
            <span class="panel-header-title">Rules — Configuration</span>
            <button class="panel-close" @click=${this._closeDiscard}>✕</button>
          </div>

          <div class="panel-body">
            <table class="config-table rule-table">
              <thead>
                <tr>
                  <th style="min-width: 30px;"></th>
                  <th style="min-width: 140px;">Name</th>
                  <th style="min-width: 140px;">Triggers</th>
                  <th style="min-width: 140px;">Target Activities</th>
                  <th style="min-width: 90px;">Status</th>
                  <th style="min-width: 100px; text-align: center;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${t.map((e,i)=>{const s=(this.inputsConfig||[]).filter(o=>o.rule===e.id).map(o=>At(o,this.hass));return n`
                    <tr
                      class="input-row ${this._draftController.draggedIndex===i?"dragging":""}"
                      draggable="true"
                      @dragstart=${o=>this._draftController.onDragStart(o,i)}
                      @dragover=${o=>this._draftController.onDragOver(o,i)}
                      @dragend=${()=>this._draftController.onDragEnd()}
                    >
                      <td style="text-align: center; padding: 0 4px; vertical-align: middle;">
                        <div class="drag-handle" title="Drag to reorder">⋮⋮</div>
                      </td>
                      <td>
                        <div style="font-weight: 600;">${e.name||e.id}</div>
                        ${e.name&&e.id?n`<div style="font-size: 10px; font-family: monospace; opacity: 0.5;">${e.id}</div>`:""}
                      </td>
                      <td>
                        ${s.length>0?s.map(o=>n`<span class="pill">${o}</span>`):n`<span style="opacity: 0.4;">—</span>`}
                      </td>
                      <td>
                        ${(e.applied_activities||[]).length>0?(e.applied_activities||[]).map(o=>{const r=(this.activitiesConfig||[]).find(l=>l.id===o);return(r==null?void 0:r.name)||(r==null?void 0:r.id)||o}).map(o=>n`<span class="pill">${o}</span>`):n`<span class="pill" style="opacity: 0.8;">All</span>`}
                      </td>
                      <td>
                        <span class="status-badge ${e.enabled?"enabled":""}">
                          ${e.enabled?"Enabled":"Disabled"}
                        </span>
                      </td>
                      <td style="text-align: center;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                          <button class="row-action-btn edit" title="Edit rule" @click=${()=>this._openEditRule(i)}>✏️</button>
                          <button class="row-action-btn remove" title="Remove rule" @click=${()=>this._removeRule(i)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  `})}
                ${t.length===0?n`
                  <tr>
                    <td colspan="6" style="text-align: center; color: var(--secondary-text-color); font-style: italic; padding: 16px;">
                      No rules configured
                    </td>
                  </tr>
                `:""}
              </tbody>
            </table>

            <div style="display: flex; justify-content: flex-start; margin-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 16px;">
              <button class="btn-add" @click=${this._openAddRule}>
                <span>+</span> Add Rule
              </button>
            </div>
          </div>

          <div class="panel-footer">
            <button class="btn-save-dialog" @click=${this._closeAndSave}>Done</button>
          </div>
        </div>
      </div>

      <twilight-rule-row-editor
        .open=${this._subEditOpen}
        .rule=${this._subEditRule}
        .editIndex=${this._subEditingIndex}
        .inputsConfig=${this.inputsConfig}
        .activitiesConfig=${this.activitiesConfig}
        .channels=${this.channels}
        .siblings=${t}
        @save=${this._handleSubEditSave}
        @cancel=${this._closeSubEdit}
      ></twilight-rule-row-editor>
    `}};Ot.styles=[de,Et,P`
      :host {
        display: contents;
      }

      .panel-body {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding: 16px 24px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .rule-table {
        width: 100%;
        border-collapse: collapse;
      }
      .rule-table th {
        text-align: left;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--secondary-text-color);
        padding: 6px 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .rule-table td {
        padding: 10px 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        vertical-align: middle;
        font-size: 13px;
      }
      .input-row:hover {
        background: rgba(255, 255, 255, 0.015);
      }

      .row-action-btn {
        background: transparent;
        border: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 14px;
        padding: 6px 10px;
        border-radius: 6px;
        transition: color 0.15s, background-color 0.15s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .row-action-btn.edit:hover {
        color: var(--primary-text-color);
        background: rgba(255, 255, 255, 0.08);
      }
      .row-action-btn.remove:hover {
        color: var(--error-color, #db4437);
        background: rgba(219, 68, 55, 0.1);
      }

      .drag-handle {
        cursor: grab;
        color: var(--secondary-text-color);
        opacity: 0.4;
        user-select: none;
      }
      .drag-handle:hover {
        opacity: 1;
      }

      .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.05);
        color: var(--secondary-text-color);
      }
      .status-badge.enabled {
        background: rgba(76, 175, 80, 0.15);
        color: #81c784;
      }

      .pill {
        display: inline-block;
        font-size: 11px;
        padding: 1px 6px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.08);
        color: var(--secondary-text-color);
        margin-right: 4px;
      }

      .btn-add {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: var(--primary-text-color);
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: background 0.15s, border-color 0.15s;
        width: fit-content;
      }
      .btn-add:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.2);
      }
    `],Yt([h({type:Boolean})],Ot.prototype,"open",2),Yt([h({attribute:!1})],Ot.prototype,"hass",2),Yt([h({attribute:!1})],Ot.prototype,"config",2),Yt([h({attribute:!1})],Ot.prototype,"rules",1),Yt([h({attribute:!1})],Ot.prototype,"inputsConfig",2),Yt([h({attribute:!1})],Ot.prototype,"activitiesConfig",2),Yt([h({attribute:!1})],Ot.prototype,"channels",2),Yt([b()],Ot.prototype,"_subEditOpen",2),Yt([b()],Ot.prototype,"_subEditingIndex",2),Yt([b()],Ot.prototype,"_subEditRule",2),Ot=Yt([L("twilight-rules-dialog")],Ot);var ir=Object.defineProperty,sr=Object.getOwnPropertyDescriptor,ae=(t,e,i,a)=>{for(var s=a>1?void 0:a?sr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&ir(e,i,s),s};let Gt=class extends B{constructor(){super(...arguments),this.hass=null,this.rules=[],this.inputsConfig=[],this.activitiesConfig=[],this.runState=null,this.channels={},this.noHeader=!1,this._editOpen=!1}_openEdit(){this._editOpen=!0,this.dispatchEvent(new CustomEvent("open-edit",{bubbles:!0,composed:!0}))}render(){var e;const t=((e=this.runState)==null?void 0:e.active_rules)||{};return n`
      <div class="devices-card">
        ${this.noHeader?"":n`
          <div class="devices-card-header">
            <span class="card-dot" style="--dot-color: #ef4444;"></span>
            <span class="devices-card-title">Rules</span>
            <button class="edit-btn" @click=${this._openEdit}>⋮</button>
          </div>
        `}

        <div class="entity-list">
          ${this.rules.map((i,a)=>{const s=!!t[i.id],o=!i.enabled,r=(this.inputsConfig||[]).filter(u=>u.rule===i.id),l=r.length>0?r.map(u=>At(u,this.hass)).join(", "):"none",p=`Target: ${(i.applied_activities||[]).length>0?i.applied_activities.map(u=>{const g=(this.activitiesConfig||[]).find(d=>d.id===u);return(g==null?void 0:g.name)||(g==null?void 0:g.id)||u}).join(", "):"All"} · Triggers: ${l} · Status: ${i.enabled?"Enabled":"Disabled"}`;return n`
              <div class="activity-row ${o?"disabled":""}">
                <span class="status-indicator ${s?"active":""}" title="${s?"Rule active":o?"Rule disabled":"Rule inactive"}"></span>
                <span class="activity-badge rule">${i.name||i.id}</span>
                <div class="activity-desc">
                  <div style="font-weight: 600;">${i.name||i.id}</div>
                  <div style="font-size: 11px; color: var(--secondary-text-color); margin-top: 2px;">
                    ${p}
                  </div>
                </div>
              </div>
              ${a<this.rules.length-1?n`<div class="divider"></div>`:""}
            `})}

          ${this.rules.length===0?n`
            <div class="empty-state">No rules configured. Click edit to configure.</div>
          `:""}
        </div>
      </div>
    `}};Gt.styles=[de,Zt,P`
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        font-family: var(--font-family, inherit);
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
        overflow: clip;
      }

      .devices-card {
        box-sizing: border-box;
        background: transparent;
        display: flex;
        flex-direction: column;
        flex: 1;
      }

      .devices-card-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 16px 20px 12px;
      }

      .devices-card-title {
        flex: 1;
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-text-color);
      }

      .edit-btn {
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--secondary-text-color);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.6;
        transition: opacity 0.15s, background 0.15s;
        font-size: 16px;
        line-height: 1;
      }
      .edit-btn:hover {
        background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
        color: var(--primary-text-color);
        opacity: 1;
      }

      .entity-list {
        padding: 0 0 12px;
        display: flex;
        flex-direction: column;
      }

      .activity-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 20px;
      }

      .activity-row.disabled {
        opacity: 0.45;
      }

      .status-indicator {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        flex-shrink: 0;
      }
      .status-indicator.active {
        background: var(--success-color, #4caf50);
        box-shadow: 0 0 8px var(--success-color, #4caf50);
      }

      .activity-desc {
        font-size: 13px;
        color: var(--primary-text-color);
        flex: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .divider {
        height: 1px;
        background: color-mix(in srgb, var(--primary-text-color, #fff) 8%, transparent);
        margin: 4px 20px;
      }

      .empty-state {
        padding: 24px;
        text-align: center;
        color: var(--secondary-text-color);
        font-style: italic;
        font-size: 13px;
      }
    `],ae([h({attribute:!1})],Gt.prototype,"hass",2),ae([h({attribute:!1})],Gt.prototype,"rules",2),ae([h({attribute:!1})],Gt.prototype,"inputsConfig",2),ae([h({attribute:!1})],Gt.prototype,"activitiesConfig",2),ae([h({attribute:!1})],Gt.prototype,"runState",2),ae([h({attribute:!1})],Gt.prototype,"channels",2),ae([h({type:Boolean})],Gt.prototype,"noHeader",2),ae([b()],Gt.prototype,"_editOpen",2),Gt=ae([L("twilight-rules-card")],Gt);var ar=Object.defineProperty,or=Object.getOwnPropertyDescriptor,ye=(t,e,i,a)=>{for(var s=a>1?void 0:a?or(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&ar(e,i,s),s};let oe=class extends B{constructor(){super(...arguments),this.open=!1,this.title="Reset Settings",this.description="",this.nodes=[],this._selectedNodes={},this._expandedNodes={}}willUpdate(t){if(t.has("open")&&this.open||t.has("nodes")){const e={},i={};this.nodes.forEach(a=>{e[a.id]=!0,i[a.id]=!0,a.children&&a.children.forEach(s=>{e[s.id]=!0})}),this._selectedNodes=e,this._expandedNodes=i}}_isNodeSelected(t){return!!this._selectedNodes[t]}_isNodeIndeterminate(t){if(!t.children||t.children.length===0)return!1;const e=t.children.filter(i=>this._selectedNodes[i.id]).length;return e>0&&e<t.children.length}_onCheckboxChange(t,e){const i={...this._selectedNodes};if(i[t.id]=e,t.children)t.children.forEach(a=>{i[a.id]=e});else{const a=this.nodes.find(s=>{var o;return(o=s.children)==null?void 0:o.some(r=>r.id===t.id)});if(a&&a.children){const s=a.children.every(o=>{const r=o.id;return r===t.id?e:!!i[r]});i[a.id]=s}}this._selectedNodes=i,this.requestUpdate()}_toggleExpanded(t){this._expandedNodes={...this._expandedNodes,[t]:!this._expandedNodes[t]},this.requestUpdate()}_onConfirm(){const t=Object.keys(this._selectedNodes).filter(e=>this._selectedNodes[e]);this.dispatchEvent(new CustomEvent("confirm",{detail:{selectedIds:t},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}render(){return this.open?n`
      <div class="modal-overlay" @click=${this._onCancel}>
        <div
          class="modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-dialog-title"
          @click=${t=>t.stopPropagation()}
        >
          <h3 class="modal-title" id="reset-dialog-title">${this.title}</h3>
          ${this.description?n`<p class="modal-desc">${this.description}</p>`:""}

          <div class="modal-tree">
            ${this.nodes.map(t=>{const e=t.children&&t.children.length>0,i=!!this._expandedNodes[t.id];return n`
                <div class="tree-node">
                  <div
                    class="tree-node-header"
                    @click=${a=>{a.target.tagName!=="INPUT"&&e&&this._toggleExpanded(t.id)}}
                  >
                    ${e?n`<span class="tree-node-chevron ${i?"expanded":""}">&#9656;</span>`:n`<span class="tree-node-chevron" style="visibility: hidden;">&#9656;</span>`}
                    <input
                      type="checkbox"
                      .checked=${this._isNodeSelected(t.id)}
                      .indeterminate=${this._isNodeIndeterminate(t)}
                      @change=${a=>this._onCheckboxChange(t,a.target.checked)}
                    />
                    <span>${t.label}</span>
                  </div>

                  ${e&&i?n`
                        <div class="tree-node-children">
                          ${t.children.map(a=>n`
                            <div class="tree-leaf">
                              <input
                                type="checkbox"
                                .checked=${this._isNodeSelected(a.id)}
                                @change=${s=>{const o={id:a.id};this._onCheckboxChange(o,s.target.checked)}}
                              />
                              <span>${a.label}</span>
                            </div>
                          `)}
                        </div>
                      `:""}
                </div>
              `})}
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click=${this._onCancel}>Cancel</button>
            <button class="btn-save" @click=${this._onConfirm}>Reset Selected</button>
          </div>
        </div>
      </div>
    `:n``}};oe.styles=P`
    *, *:before, *:after {
      box-sizing: border-box;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(8px);
      box-sizing: border-box;
    }

    .modal-card {
      background: color-mix(in srgb, var(--primary-background-color, #1e1e28) 85%, transparent);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 24px;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      display: flex;
      flex-direction: column;
      gap: 16px;
      color: var(--primary-text-color);
      box-sizing: border-box;
    }

    .modal-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      color: var(--primary-text-color);
    }

    .modal-desc {
      font-size: 13px;
      color: var(--secondary-text-color);
      margin: 0;
      line-height: 1.4;
    }

    .modal-tree {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 8px 0;
      box-sizing: border-box;
    }

    .tree-node {
      display: flex;
      flex-direction: column;
      gap: 4px;
      box-sizing: border-box;
    }

    .tree-node-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 500;
      padding: 6px 8px;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.15s;
      user-select: none;
      box-sizing: border-box;
    }

    .tree-node-header:hover {
      background: rgba(255, 255, 255, 0.04);
    }

    .tree-node-chevron {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      cursor: pointer;
      color: var(--secondary-text-color);
      transition: transform 0.2s;
    }

    .tree-node-chevron.expanded {
      transform: rotate(90deg);
    }

    .tree-node-children {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding-left: 28px;
      border-left: 1px dashed rgba(255, 255, 255, 0.1);
      margin-left: 14px;
      box-sizing: border-box;
    }

    .tree-leaf {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      padding: 4px 8px;
      color: var(--secondary-text-color);
      box-sizing: border-box;
    }

    .modal-card input[type="checkbox"] {
      appearance: none;
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.05);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: background 0.15s, border-color 0.15s;
      outline: none;
      margin: 0;
    }

    .modal-card input[type="checkbox"]:checked {
      background: var(--tp-accent, var(--accent-color, #e91e8c));
      border-color: var(--tp-accent, var(--accent-color, #e91e8c));
    }

    .modal-card input[type="checkbox"]:checked::after {
      content: '';
      width: 8px;
      height: 4px;
      border-left: 2px solid white;
      border-bottom: 2px solid white;
      transform: rotate(-45deg) translate(1px, -1px);
      position: absolute;
    }

    .modal-card input[type="checkbox"]:indeterminate {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.4);
    }

    .modal-card input[type="checkbox"]:indeterminate::after {
      content: '';
      width: 8px;
      height: 2px;
      background: white;
      position: absolute;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 8px;
      box-sizing: border-box;
    }

    .btn-cancel {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      color: var(--secondary-text-color);
      cursor: pointer;
      padding: 8px 20px;
      font-size: 14px;
      transition: background 0.15s, color 0.15s;
    }

    .btn-cancel:hover {
      background: rgba(255, 255, 255, 0.05);
      color: var(--primary-text-color);
    }

    .btn-save {
      background: var(--tp-accent, var(--accent-color, #e91e8c));
      color: white;
      border: none;
      padding: 8px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s;
    }

    .btn-save:hover {
      opacity: 0.85;
    }
  `,ye([h({type:Boolean})],oe.prototype,"open",2),ye([h({type:String})],oe.prototype,"title",2),ye([h({type:String})],oe.prototype,"description",2),ye([h({type:Array})],oe.prototype,"nodes",2),ye([b()],oe.prototype,"_selectedNodes",2),ye([b()],oe.prototype,"_expandedNodes",2),oe=ye([L("twilight-reset-dialog")],oe);var rr=Object.defineProperty,nr=Object.getOwnPropertyDescriptor,gt=(t,e,i,a)=>{for(var s=a>1?void 0:a?nr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&rr(e,i,s),s};const ra={astro_dawn:"Astro Dawn",nautical_dawn:"Nautical Dawn",civil_dawn:"Civil Dawn",gold_dawn:"Golden Dawn",day:"Day",gold_dusk:"Golden Dusk",civil_dusk:"Civil Dusk",nautical_dusk:"Nautical Dusk",astro_dusk:"Astro Dusk",night:"Night"};let dt=class extends B{constructor(){super(...arguments),this.hass=null,this.slots=[],this.entities=[],this.open=!1,this.highlightSlotId=null,this.areaId="",this.areaName="",this.isPrimaryChannel=!0,this.templateMode=!1,this.channelName="",this.transitionOnSeconds=null,this.placeholderDefaults=null,this._draft=null,this._draftTransitionOnSeconds=null,this._transitionDraftInitialized=!1}_isValidHHMM(t){if(!t)return!1;const e=/^(\d{1,2}):(\d{2})$/.exec(t);if(!e)return!1;const i=Number(e[1]),a=Number(e[2]);return i>=0&&i<=23&&a>=0&&a<=59}_hasInvalidSlot(){return(this._draft??this.slots).some(e=>e.startType==="fixed"&&!this._isValidHHMM(e.fixedStartTime))}_closeAndSave(){if(this._hasInvalidSlot())return;const t=this._draftTransitionOnSeconds!==this.transitionOnSeconds;if(this._draft!==null||t){const i=this._draft??this.slots;this.dispatchEvent(new Ni(i,this._draftTransitionOnSeconds))}this._draft=null,this._transitionDraftInitialized=!1,this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_closeDiscard(){this._draft=null,this._transitionDraftInitialized=!1,this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_updateDraft(t){this._draft=t}_clampOffset(t,e,i){var u,g;const a=((u=this.placeholderDefaults)==null?void 0:u.max_offset_minutes)??180,s=((g=this.placeholderDefaults)==null?void 0:g.min_slot_distance_minutes)??ks;let o=Math.max(-a,Math.min(a,e));const r=["astro_dawn","nautical_dawn","civil_dawn","gold_dawn","day","gold_dusk","civil_dusk","nautical_dusk","astro_dusk","night"],l=i.find(d=>d.id===t);if(!l||(l.startType||"fixed")!=="astral")return o;const c=i.filter(d=>(d.startType||"fixed")==="astral").map(d=>{const f=d.startEvent||"civil_dawn",v=r.indexOf(f);return{slot:d,zoneIdx:v!==-1?v:99}}).sort((d,f)=>d.zoneIdx-f.zoneIdx),p=c.findIndex(d=>d.slot.id===t);if(p!==-1){if(p>0){const d=c[p-1].slot.startOffset||0;o<d-s&&(o=d-s)}if(p<c.length-1){const d=c[p+1].slot.startOffset||0;o>d+s&&(o=d+s)}}return o}_addCustomSlot(){const t=this._draft??this.slots;if(t.length>=Ei)return;const e=t.filter(a=>a.isCustom).length+1,i={id:`draft_${Date.now()}_${e}`,label:`Custom Slot ${e}`,color:"#8e44ad",from:720,to:780,scene:null,isCustom:!0,startType:"fixed",fixedStartTime:"12:00"};this._updateDraft([...t,i])}_deleteSlot(t){this._updateDraft((this._draft??this.slots).filter(e=>e.id!==t))}_setSlotScene(t,e){this._updateDraft((this._draft??this.slots).map(i=>i.id===t?{...i,scene:e}:i))}willUpdate(t){t.has("open")&&(this.open?(this._draft===null&&(this._draft=this.slots.map(e=>({...e}))),this._transitionDraftInitialized||(this._draftTransitionOnSeconds=this.transitionOnSeconds,this._transitionDraftInitialized=!0),ai()):(this._draft=null,this._transitionDraftInitialized=!1))}render(){var p,u,g;if(!this.open)return n``;const t=this._draft;if(!t)return n``;const e=(this.areaId||"").toLowerCase(),i=(this.areaName||"").toLowerCase(),a=new Set;if(e&&(a.add(e),e==="badezimmer"&&a.add("bad"),e==="kuche"&&a.add("küche"),e==="buro"&&(a.add("büro"),a.add("office"))),i){a.add(i);const d=i.normalize("NFD").replace(/[\u0300-\u036f]/g,"");a.add(d),i==="bad"&&a.add("badezimmer"),i==="büro"&&a.add("office")}const s=(d,f)=>{const v=d.toLowerCase(),y=(f||"").toLowerCase();for(const w of a)if(v.includes(w)||y.includes(w))return!0;return!1},o=new Set(t.map(d=>d.scene).filter(d=>!!d)),r=!!(this.areaId&&this.entities&&this.entities.length>0),l=new Set(r?this.entities.filter(d=>d.domain!=="scene"&&d.domain!=="script"?!1:d.in_area||o.has(d.entity_id)||s(d.entity_id,d.name)).map(d=>d.entity_id):[]),c=t;return n`
      <div class="overlay" @click=${d=>{d.target===d.currentTarget&&this._closeDiscard()}}>
        <div class="edit-panel">
          <div class="panel-header">
            <span class="card-dot" style="--dot-color: #f97316;"></span>
            <span class="panel-header-title">
              Slots Configuration${this.channelName?n` · <span style="color:var(--secondary-text-color);font-weight:500">${this.channelName}</span>`:""}
            </span>
            <button class="panel-close" @click=${this._closeDiscard}>✕</button>
          </div>

          <div class="panel-body">
            <div class="slots-list">
              <div style="display:flex; align-items:center; justify-content:space-between; gap:16px; padding:12px 16px; background:color-mix(in srgb, var(--primary-text-color) 4%, transparent); border:1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 8%, transparent)); border-radius:12px; margin-bottom:12px;">
                <div>
                  <div style="font-size:13px; font-weight:600; color:var(--primary-text-color)">Slot Transition Duration</div>
                  <div style="font-size:11px; color:var(--secondary-text-color)">Transition duration in seconds for slot changes on this channel</div>
                </div>
                <div style="width:100px;">
                  <input
                    type="number"
                    min="0"
                    class="sensor-input"
                    .value=${this._draftTransitionOnSeconds!==null?String(this._draftTransitionOnSeconds):""}
                    placeholder=${String(((p=this.placeholderDefaults)==null?void 0:p.transition_on_seconds)??60)}
                    @input=${d=>{const f=d.target.value.trim();if(f==="")this._draftTransitionOnSeconds=null;else{const v=parseInt(f,10);this._draftTransitionOnSeconds=isNaN(v)?null:v}}}
                  />
                </div>
              </div>
              <div class="slots-notice">
                <span>⏱️</span>
                <span>A minimum distance of ${((u=this.placeholderDefaults)==null?void 0:u.min_slot_distance_minutes)??ks} minutes between consecutive slots is maintained, with a maximum offset of ±${((g=this.placeholderDefaults)==null?void 0:g.max_offset_minutes)??180} minutes.</span>
              </div>
              <div class="slots-header ${this.templateMode?"slots-header--no-time":""}">
                <div>Slot</div>
                <div>Start Type</div>
                <div>Value / Offset</div>
                ${this.templateMode?"":n`<div>Time</div>`}
                <div>Scene / Script</div>
                <div></div>
              </div>

              ${c.map(d=>{const f=d.id===this.highlightSlotId,v=!this.isPrimaryChannel,y=d.startType==="fixed"&&!this._isValidHHMM(d.fixedStartTime);return n`
                  <div class="slot-edit-card ${f?"highlighted":""} ${y?"invalid":""} ${this.templateMode?"slot-edit-card--no-time":""}">
                    <!-- Col 1: Icon/Dot + Label/Input -->
                    <div style="display:flex; align-items:center; gap:8px; min-width: 0;">
                      <div class="slot-edit-dot" style="background:${d.color}"></div>
                      <div style="flex: 1; min-width: 0;">
                        ${v?n`
                            <input
                              type="text"
                              class="sensor-input"
                              .value=${d.label}
                              @input=${w=>{const x=w.target.value;this._updateDraft(t.map(_=>_.id===d.id?{..._,label:x}:_))}}
                              placeholder="Slot Name"
                            />
                          `:n`<div class="slot-edit-label" style="font-size:13px; font-weight:600">${d.label}</div>`}
                      </div>
                    </div>

                    <!-- Col 2: Start Type -->
                    <div>
                      <span class="mobile-label">Start Type</span>
                      ${v?n`
                          <select
                            class="sensor-input"
                            @change=${w=>{const x=w.target.value;this._updateDraft(t.map(_=>_.id===d.id?{..._,startType:x,startEvent:x==="astral"?"civil_dawn":void 0,fixedStartTime:x==="fixed"?"12:00":void 0,startOffset:x==="astral"?0:void 0}:_))}}
                          >
                            <option value="fixed" ?selected=${(d.startType||"fixed")==="fixed"}>Fixed Time</option>
                            <option value="astral" ?selected=${d.startType==="astral"}>Sun Event</option>
                          </select>
                        `:n`
                          <select class="sensor-input" disabled style="opacity:0.6">
                            <option>Sun Event</option>
                          </select>
                        `}
                    </div>

                    <!-- Col 3: Value / Offset -->
                    <div>
                      <span class="mobile-label">Value / Offset</span>
                      ${d.startType==="fixed"?n`
                          <input
                            type="time"
                            class="sensor-input"
                            .value=${d.fixedStartTime||"12:00"}
                            @change=${w=>{const x=w.target.value;this._updateDraft(t.map(_=>_.id===d.id?{..._,fixedStartTime:x}:_))}}
                          />
                        `:n`
                          <div style="display:flex; gap:6px;">
                            ${v?n`
                                <select
                                  class="sensor-input"
                                  style="flex:1"
                                  @change=${w=>{const x=w.target.value;this._updateDraft(t.map(_=>_.id===d.id?{..._,startEvent:x}:_))}}
                                >
                                  ${Object.entries(ra).map(([w,x])=>n`
                                    <option value=${w} ?selected=${(d.startEvent||"civil_dawn")===w}>${x}</option>
                                  `)}
                                </select>
                              `:n`<input class="sensor-input" style="flex:1; opacity:0.6" disabled .value=${ra[d.startEvent||""]||d.startEvent||""} />`}
                            <input
                              type="number"
                              class="sensor-input"
                              style="width:64px;"
                              .value=${String(d.startOffset||0)}
                              @input=${w=>{const x=w.target,_=Number(x.value),D=this._clampOffset(d.id,_,t);D!==_&&(x.value=String(D)),this._updateDraft(t.map(T=>T.id===d.id?{...T,startOffset:D}:T))}}
                              placeholder="Offset"
                            />
                          </div>
                        `}
                    </div>

                    ${this.templateMode?"":n`
                      <!-- Col 4: Time -->
                      <div>
                        <span class="mobile-label">Time</span>
                        <span class="slot-edit-time" style="font-size: 13px; font-family: monospace; font-weight: 500;">
                          ${me(d.from)} → ${me(d.to)}
                        </span>
                      </div>
                    `}

                    <!-- Col 5: Scene / Script -->
                    <div>
                      <span class="mobile-label">Scene / Script</span>
                      <ha-entity-picker
                        .hass=${this.hass}
                        .value=${d.scene??""}
                        .includeDomains=${["scene","script"]}
                        .entityFilter=${r?w=>l.has(w.entity_id):void 0}
                        allow-custom-entity
                        @value-changed=${w=>{const x=w.detail.value||null;x!==d.scene&&this._setSlotScene(d.id,x)}}
                      ></ha-entity-picker>
                    </div>

                    <!-- Col 6: Delete action -->
                    <div style="display: flex; justify-content: flex-end;">
                      ${v?n`
                          <button
                            class="panel-close"
                            style="color: var(--error-color, #db4437); font-size:16px; padding: 4px;"
                            @click=${()=>this._deleteSlot(d.id)}
                            title="Delete"
                          >
                            ✕
                          </button>
                        `:""}
                    </div>
                  </div>
                `})}

              ${this.isPrimaryChannel?"":t.length>=Ei?n`<button class="btn-add-slot" disabled>Max ${Ei} slots reached</button>`:n`<button class="btn-add-slot" @click=${this._addCustomSlot}>➕ Add Slot</button>`}
            </div>
          </div>

          <div class="panel-footer">
            ${this._hasInvalidSlot()?n`
              <span style="flex:1; color:var(--error-color, #db4437); font-size:13px; align-self:center;">
                ⚠️ Fix invalid times (HH:MM) before saving
              </span>
            `:""}
            <button class="btn-done" ?disabled=${this._hasInvalidSlot()} @click=${this._closeAndSave}>Save</button>
          </div>
        </div>
      </div>
    `}};dt.styles=[Et,P`
      .panel-body {
        padding: 16px 0;
        overflow-x: auto;
      }

    .slots-list {
      display: flex;
      flex-direction: column;
      padding: 4px 24px 16px;
    }

    .slots-notice {
      font-size: 11px;
      color: var(--secondary-text-color);
      padding: 0 16px 18px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .slots-header {
      display: grid;
      grid-template-columns: minmax(110px, 1.1fr) minmax(110px, 1fr) minmax(180px, 1.6fr) minmax(100px, 1fr) minmax(220px, 2.5fr) 30px;
      gap: 12px;
      padding: 0 16px 8px;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--secondary-text-color);
      letter-spacing: 0.5px;
      border-bottom: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 8%, transparent));
    }
    .slots-header--no-time {
      grid-template-columns: minmax(110px, 1.1fr) minmax(110px, 1fr) minmax(180px, 1.6fr) minmax(220px, 2.5fr) 30px;
    }

    .slot-edit-card {
      display: grid;
      grid-template-columns: minmax(110px, 1.1fr) minmax(110px, 1fr) minmax(180px, 1.6fr) minmax(100px, 1fr) minmax(220px, 2.5fr) 30px;
      gap: 12px;
      align-items: center;
      padding: 4px 16px;
      background: transparent;
      border: none;
      border-bottom: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 8%, transparent));
      border-radius: 0;
      box-sizing: border-box;
      transition: background-color 0.2s;
      margin-bottom: 0;
    }
    .slot-edit-card--no-time {
      grid-template-columns: minmax(110px, 1.1fr) minmax(110px, 1fr) minmax(180px, 1.6fr) minmax(220px, 2.5fr) 30px;
    }

    .slot-edit-card.highlighted {
      border-left: 3px solid var(--accent-color, #e91e8c);
      background: color-mix(in srgb, var(--accent-color, #e91e8c) 6%, transparent);
      padding-left: 13px;
    }

    .slot-edit-card.invalid {
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      box-shadow: inset 3px 0 0 var(--error-color, #db4437);
    }

    .slot-edit-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 20%, transparent);
    }

    .slot-edit-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .slot-edit-time {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-family: monospace;
      white-space: nowrap;
    }

    .sensor-input {
      width: 100%;
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
      border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 15%, transparent));
      border-radius: 4px;
      color: var(--primary-text-color);
      padding: 6px 10px;
      font-size: 13px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.15s;
    }
    .sensor-input:focus {
      border-color: var(--accent-color, #e91e8c);
    }

    .panel-footer {
      padding: 16px 24px;
      border-top: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 8%, transparent));
      display: flex;
      justify-content: flex-end;
      flex-shrink: 0;
    }

    .btn-done {
      background: var(--accent-color, #e91e8c);
      color: white;
      border: none;
      padding: 10px 32px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s;
    }
    .btn-done:hover { opacity: 0.85; }
    .btn-done:disabled { opacity: 0.4; cursor: not-allowed; }

    .btn-add-slot {
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
      color: var(--primary-text-color);
      border: 1px dashed var(--ha-card-border-color, var(--divider-color, color-mix(in srgb, var(--primary-text-color) 15%, transparent)));
      padding: 12px 32px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.15s, border-color 0.15s;
      margin-top: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-sizing: border-box;
      width: 100%;
    }
    .btn-add-slot:hover:not(:disabled) {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      border-color: var(--accent-color, #e91e8c);
    }
    .btn-add-slot:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    ha-entity-picker {
      display: block;
      width: 100%;
    }

    .mobile-label {
      display: none;
    }

    @media (max-width: 768px) {
      .slots-header {
        display: none;
      }
      .slot-edit-card {
        display: flex;
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
        padding: 16px;
        border-radius: 12px;
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid var(--ha-card-border-color, var(--divider-color, color-mix(in srgb, var(--primary-text-color) 5%, transparent)));
        border-bottom: 1px solid var(--ha-card-border-color, var(--divider-color, color-mix(in srgb, var(--primary-text-color) 5%, transparent)));
        margin-bottom: 12px;
      }
      .mobile-label {
        display: block;
        font-size: 10px;
        text-transform: uppercase;
        color: var(--secondary-text-color);
        font-weight: 700;
        margin-bottom: 4px;
      }
    }
  `],gt([h({attribute:!1})],dt.prototype,"hass",2),gt([h({type:Array})],dt.prototype,"slots",2),gt([h({type:Array})],dt.prototype,"entities",2),gt([h({type:Boolean})],dt.prototype,"open",2),gt([h({type:String})],dt.prototype,"highlightSlotId",2),gt([h({type:String})],dt.prototype,"areaId",2),gt([h({type:String})],dt.prototype,"areaName",2),gt([h({type:Boolean})],dt.prototype,"isPrimaryChannel",2),gt([h({type:Boolean})],dt.prototype,"templateMode",2),gt([h({type:String})],dt.prototype,"channelName",2),gt([h({type:Number})],dt.prototype,"transitionOnSeconds",2),gt([h({attribute:!1})],dt.prototype,"placeholderDefaults",2),gt([b()],dt.prototype,"_draft",2),gt([b()],dt.prototype,"_draftTransitionOnSeconds",2),dt=gt([L("twilight-slot-editor")],dt);function Q(t){return t.channels||{}}function na(t){return Object.keys(Q(t)).sort((i,a)=>i===A?-1:a===A?1:0)}function we(t,e){var i;return((i=Q(t)[e])==null?void 0:i.slots)||[]}var lr=Object.defineProperty,dr=Object.getOwnPropertyDescriptor,F=(t,e,i,a)=>{for(var s=a>1?void 0:a?dr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&lr(e,i,s),s};let H=class extends B{constructor(){super(...arguments),this.hass=null,this.areaId="",this.areaConfigs=[],this.areas=[],this.todayData=null,this.globalConfig={},this.placeholderDefaults=null,this.areasState={},this._areaPlaceholderDefaults=null,this._isNewArea=!1,this._selectedChannelId=A,this._areaEntities=[],this._extractedEntities={},this._slotEditOpen=!1,this._inputsEditOpen=!1,this._activitiesEditOpen=!1,this._sensorsEditOpen=!1,this._areaLightsEditOpen=!1,this._rulesEditOpen=!1,this._editingSlotId=null,this._hoveredTime=null,this._hoveredChannelId=A,this._tooltipX=0,this._tooltipY=0,this._resetDialogOpen=!1,this._globalDefaultsTemplate=null,this._resetNodes=[],this._slotTimes=null,this._dialog=new xe(this),this._clock=new ri(this),this._lastLoadedKey="",this._draftController=new zs(this,{onSave:async t=>{if(!this.hass)return;const e=await Ka(this.hass,t),i=this.areaConfigs.findIndex(s=>s.area_id===e.area_id);let a;return i>=0?a=this.areaConfigs.map((s,o)=>o===i?e:s):a=[...this.areaConfigs,e],this._isNewArea=!1,this.dispatchEvent(new CustomEvent("areas-changed",{detail:a,bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent("engines-changed",{bubbles:!0,composed:!0})),await this._fetchSlotTimes(),e}})}get _effectivePlaceholderDefaults(){return this._areaPlaceholderDefaults??this.placeholderDefaults}async _saveOrUpdateDraft(){this._isNewArea?this.requestUpdate():await this._draftController.save()}connectedCallback(){super.connectedCallback(),this.hass&&this.areaId&&this._loadAreaDetails()}updated(t){if(super.updated(t),(t.has("areaId")||t.has("hass"))&&this.areaId&&this.hass){const e=t.get("areaId"),i=t.get("hass");(this.areaId!==e||this.hass!==i)&&this._loadAreaDetails()}}async _loadAreaDetails(){var s;const t=`${this.areaId}_${(s=this.hass)!=null&&s.states?"has_hass":"no_hass"}`;if(t===this._lastLoadedKey||(this._lastLoadedKey=t,!this.hass||!this.areaId))return;this._draftController.loading=!0,this.requestUpdate(),this._selectedChannelId=A;const e=this.areaConfigs.find(o=>o.area_id===this.areaId),i=this.areas.find(o=>o.area_id===this.areaId);let a;e?(this._isNewArea=!1,a=structuredClone(e)):(this._isNewArea=!0,a=await Ss(this.hass,this.areaId),i&&(a.name=i.name)),a.activities=aa(a.activities),this._draftController.init(a);try{const[o,r]=await Promise.all([Qa(this.hass,this.areaId),Ja(this.hass,this.areaId).catch(l=>(console.warn("Backend extraction not available yet, using empty fallback",l),{}))]);this._extractedEntities=r||{},this._updateAreaEntities(this._draftController.draft,o),await this._fetchSlotTimes()}catch(o){console.error("Error fetching area entities",o)}finally{this._draftController.loading=!1,this.requestUpdate()}}async _fetchSlotTimes(){if(!(!this.hass||!this.areaId)){try{this._isNewArea?this._slotTimes=await this._fetchDraftSlotTimes():this._slotTimes=await Os(this.hass,{area_id:this.areaId})}catch(t){console.warn("Failed to fetch area slot times:",t)}if(!this._isNewArea)try{this._areaPlaceholderDefaults=await Hi(this.hass,this.areaId)}catch(t){console.warn("Failed to fetch area placeholder defaults:",t)}}}async _fetchDraftSlotTimes(){const t=this._draftController.draft,e=new Date().toISOString().slice(0,10),i={};if(this.hass&&t){const a=Object.entries(Q(t)),s=await Promise.all(a.map(([,o])=>Bi(this.hass,{slots:o.slots||[]})));a.forEach(([o],r)=>{i[o]={[e]:s[r].slots}})}return{area_id:this.areaId,dates:[e],channels:i}}_activeChannelId(t){return na(t).includes(this._selectedChannelId)?this._selectedChannelId:A}_updateAreaEntities(t,e){const i=new Set;this._extractedEntities&&Object.values(this._extractedEntities).forEach(r=>{(Array.isArray(r)?r:(r==null?void 0:r.extracted)??[]).forEach(c=>i.add(c))});const a=new Set,s=this._activeChannelId(t);we(t,s).forEach(r=>{var l;(l=r.configured_entities)==null||l.forEach(c=>a.add(c))});const o=a.size>0;this._areaEntities=e.map(r=>{const l=i.has(r.entity_id),c=o&&a.has(r.entity_id);return{entity_id:r.entity_id,name:r.name,domain:r.domain,in_area:r.in_area,checked:c||l,isExtracted:l,isManual:c}})}_refreshExtractedEntities(){this._draftController.draft&&this._updateAreaEntities(this._draftController.draft,this._areaEntities)}async _confirmDiscardIfDirty(){return!this._isNewArea&&!this._draftController.isDirty?!0:this._dialog.showConfirm("Discard Changes","You have unsaved changes. Are you sure you want to discard them?")}async _backToOverview(){await this._confirmDiscardIfDirty()&&this.dispatchEvent(new CustomEvent("back",{bubbles:!0,composed:!0}))}_saveStatusText(){if(this._draftController.saving)return"Saving…";const t=this._draftController.saveError;return t?`Save failed: ${t&&typeof t=="object"&&"message"in t?String(t.message):String(t)}`:this._isNewArea?"New Area Setup":this._draftController.isDirty?"Unsaved changes":"All changes saved"}_onSunPathHover(t){this._hoveredTime=t.detail.hoverTime,t.detail.channelId&&(this._hoveredChannelId=t.detail.channelId)}async _onSensorsChanged(t){this._draftController.update({sensors:t.detail}),await this._saveOrUpdateDraft()}_availableActivities(t){const e=(t.activities??[]).map(i=>i.id);return e.length>0?e:["sleep"]}async _onInputsChanged(t){this._draftController.update({inputs:t.detail.inputs}),await this._saveOrUpdateDraft()}async _onActivitiesChanged(t){this._draftController.update({activities:t.detail.activities}),await this._saveOrUpdateDraft()}async _onRulesChanged(t){this._draftController.update({rules:t.detail}),await this._saveOrUpdateDraft()}_onSunPathMove(t){this._tooltipX=t.clientX,this._tooltipY=t.clientY}_onSlotSelected(t){t.detail.channelId&&(this._selectedChannelId=t.detail.channelId),this._editingSlotId=t.detail.slotId,this._slotEditOpen=!0}_onChannelSelected(t){this._selectedChannelId=t.detail.channelId,this._refreshExtractedEntities()}async _onChannelAdded(t){const e=this._draftController.draft;if(!e)return;const i=t.detail.name.trim();if(!i)return;const a=i.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"");if(!a)return;const s={...Q(e)};if(s[a]){await this._dialog.showAlert("Channel already exists",`A channel named "${i}" already exists.`);return}s[a]={name:i,enabled:!0,slots:[]},this._draftController.update({channels:s}),this._selectedChannelId=a,await this._saveOrUpdateDraft()}async _onChannelRenamed(t){const e=this._draftController.draft;if(!e)return;const{channelId:i,name:a}=t.detail,s={...Q(e)},o=s[i];o&&(s[i]={...o,name:a},this._draftController.update({channels:s}),await this._saveOrUpdateDraft())}async _onChannelDeleted(t){const e=this._draftController.draft;if(!e||t.detail.channelId===A)return;const i={...Q(e)};delete i[t.detail.channelId],this._draftController.update({channels:i}),this._selectedChannelId===t.detail.channelId&&(this._selectedChannelId=A),await this._saveOrUpdateDraft()}async _onChannelToggled(t){const e=this._draftController.draft;if(!e||t.detail.channelId===A)return;const i={...Q(e)},a=i[t.detail.channelId];a&&(i[t.detail.channelId]={...a,enabled:t.detail.enabled},this._draftController.update({channels:i}),await this._saveOrUpdateDraft())}_withChannelSlots(t,e,i,a){const s={...Q(t)},o=s[e];return o&&(s[e]={...o,slots:i,...a!==void 0?{transition_on_seconds:a}:{}}),s}async _onSlotsChanged(t){const e=this._draftController.draft;if(!e)return;const i=this._activeChannelId(e),a=we(e,i),s=t.detail.slots.map(o=>{const r=a.find(c=>c.id===o.id),l=o.startType==="fixed";return{id:o.id,name:o.label,start_type:l?"fixed":"astral",zone:l?null:o.startEvent||(r==null?void 0:r.zone)||"civil_dawn",fixed_time:l?o.fixedStartTime||"00:00":null,offset_minutes:o.startOffset||0,scene_entity_id:o.scene,configured_entities:(r==null?void 0:r.configured_entities)||[]}});this._draftController.update({channels:this._withChannelSlots(e,i,s,t.detail.transitionOnSeconds)}),this._refreshExtractedEntities(),await this._saveOrUpdateDraft(),await this._fetchSlotTimes()}async _onLightsChanged(t){const e=this._draftController.draft;if(!e)return;this._areaEntities=t.detail.entities;const i=t.detail.entities.filter(o=>o.isManual).map(o=>o.entity_id),a=this._activeChannelId(e),s=we(e,a).map(o=>({...o,configured_entities:i}));this._draftController.update({channels:this._withChannelSlots(e,a,s)}),this._refreshExtractedEntities(),await this._saveOrUpdateDraft()}async _onLightsModeChanged(t){this._draftController.update({manual_only:t.detail.manualOnly}),await this._saveOrUpdateDraft()}async _onSelectAreaChanged(t){var s;const e=t.target,i=e.value,a=(s=this._draftController.draft)==null?void 0:s.area_id;if(i!==a){if(!await this._confirmDiscardIfDirty()){e.value=a??"";return}this.dispatchEvent(new CustomEvent("select-area",{detail:{areaId:i},bubbles:!0,composed:!0}))}}async _onAreaEnabledToggled(t){const e=t.target.checked;this._draftController.update({enabled:e}),await this._saveOrUpdateDraft()}async _deleteArea(){if(!(!this.areaId||!this.hass||!await this._dialog.showConfirm("Delete Configuration","Are you sure you want to delete the Twilight configuration for this area?")))try{await Za(this.hass,this.areaId);const e=this.areaConfigs.filter(i=>i.area_id!==this.areaId);this.dispatchEvent(new CustomEvent("areas-changed",{detail:e,bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent("engines-changed",{bubbles:!0,composed:!0})),this._backToOverview()}catch(e){console.error("Error deleting area config",e)}}async _resetAreaToGlobalDefaults(){const t=this._draftController.draft;if(!(!t||!this.hass))try{const e=await Ss(this.hass,t.area_id);this._globalDefaultsTemplate=e;const i=[{id:"inherited",label:"Inherited Defaults (Lux Threshold, Extend Window, etc.)"},{id:"area_inputs",label:"Area Inputs",children:(e.inputs||[]).map(a=>{const s=(e.activities||[]).find(o=>o.id===a.activity);return{id:`area_inputs:${a.id}`,label:`${At(a,this.hass)} — ${(s==null?void 0:s.name)||(s==null?void 0:s.id)||a.activity}`}})},{id:"area_activities",label:"Area Activities",children:(e.activities||[]).map(a=>({id:`area_activities:${a.id}`,label:a.name||a.id}))},{id:"area_channels",label:"Area Custom Channels",children:Object.entries(e.channels||{}).filter(([a])=>a!==A).map(([a,s])=>({id:`area_channels:${a}`,label:s.name||a}))}];this._resetNodes=i,this._resetDialogOpen=!0,this.requestUpdate()}catch(e){console.error("Failed to load area global defaults template:",e)}}async _executeReset(t){if(!this._globalDefaultsTemplate||!this._draftController.draft)return;const e=new Set(t.detail.selectedIds),i=this._globalDefaultsTemplate;this._draftController.update(a=>{e.has("inherited")&&(a.lux_threshold=null,a.lux_watch_window=null);const s=e.has("area_inputs"),o=i.inputs||[];if(s)a.inputs=structuredClone(o);else{const u=[...a.inputs||[]];o.forEach(g=>{if(e.has(`area_inputs:${g.id}`)){const d=u.findIndex(f=>f.id===g.id);d>=0?u[d]=structuredClone(g):u.push(structuredClone(g))}}),a.inputs=u}const r=e.has("area_activities"),l=i.activities||[];if(r)a.activities=structuredClone(l);else{const u=[...a.activities||[]];l.forEach(g=>{if(e.has(`area_activities:${g.id}`)){const d=u.findIndex(f=>f.id===g.id);d>=0?u[d]=structuredClone(g):u.push(structuredClone(g))}}),a.activities=u}const c=e.has("area_channels"),p=i.channels||{};if(c){const u={...a.channels||{}};Object.keys(u).forEach(g=>{g!==A&&delete u[g]}),Object.entries(p).forEach(([g,d])=>{g!==A&&(u[g]=structuredClone(d))}),a.channels=u}else{const u={...a.channels||{}};Object.keys(p).forEach(g=>{g!==A&&e.has(`area_channels:${g}`)&&(u[g]=structuredClone(p[g]))}),a.channels=u}}),this._resetDialogOpen=!1,this.requestUpdate(),await this._saveOrUpdateDraft()}_renderTooltip(t,e){if(this._hoveredTime===null)return n``;const i=this._hoveredTime,s=(t[this._hoveredChannelId]??e).find(r=>Ae(r,i));if(!s)return n``;const o=s.scene?Li(this.hass,s.scene):s.label;return n`
      <div class="slot-tooltip" style="left:${this._tooltipX+15}px; top:${this._tooltipY+15}px">
        <span class="slot-tooltip-badge" style="background:${s.color}; color:#fff; box-shadow:0 0 10px ${s.color}40">
          ${o} (${me(i)})
        </span>
      </div>
    `}_areaToSlots(t,e){var s,o,r;const i=new Date().toISOString().slice(0,10),a=((r=(o=(s=this._slotTimes)==null?void 0:s.channels)==null?void 0:o[t])==null?void 0:r[i])||[];return qe(a,e)}_activeSceneName(t){var o,r,l;const e=this.areasState[this.areaId]||null;if(e)return e.active_scene_name??"No Scene Active";const i=this._clock.liveMins,a=t.find(c=>Ae(c,i)),s=(a==null?void 0:a.scene)??null;return s?((l=(r=(o=this.hass)==null?void 0:o.states[s])==null?void 0:r.attributes)==null?void 0:l.friendly_name)??s:"No Scene Active"}render(){var g,d;if(this._draftController.loading)return n`<div style="padding:24px;color:var(--secondary-text-color)">Loading Area Details…</div>`;const t=this._draftController.draft;if(!t)return n``;const e=this.areas.find(f=>f.area_id===t.area_id),i=t.name||(e==null?void 0:e.name)||t.area_id,a=new Date().toISOString().slice(0,10),s=this._activeChannelId(t),o=this._areaToSlots(s,we(t,s)),r=this._areaToSlots(A,we(t,A)),l=t.sensors||[],c=this._activeSceneName(o),p=this.areasState[t.area_id]||null,u={};for(const[f,v]of Object.entries(Q(t)))u[f]=this._areaToSlots(f,v.slots||[]);return n`
      <div class="view-header-container">
        <div class="view-header-grid detail-header">
          <div class="header-left">
            <button class="back-btn" @click=${()=>this._backToOverview()} title="Back to Areas">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            </button>
            <h2>${i}</h2>
          </div>
          <div class="header-right">
            <select class="area-select"
              @change=${this._onSelectAreaChanged}>
              ${this.areaConfigs.map(f=>n`
                <option value="${f.area_id}" ?selected=${f.area_id===t.area_id}>${f.name||f.area_id}</option>
              `)}
            </select>
            <span class="enabled-label" style="margin-left: 8px;">${t.enabled?"Enabled":"Disabled"}</span>
            <ha-switch
              .checked=${t.enabled}
              @change=${this._onAreaEnabledToggled}
            ></ha-switch>
          </div>
        </div>
      </div>
 
      <div class="view-content-container">
        <div class="view-content-grid">
          <div class="span-12">
            <twilight-status-card
              .hass=${this.hass}
              .slots=${r}
              .channels=${Q(t)}
              .channelSlotsMap=${u}
              .sensorConfig=${l}
              .inputs=${t.inputs||[]}
              .activitiesConfig=${t.activities||[]}
              .entities=${this._areaEntities}
              .runState=${p}
              .areaEnabled=${t.enabled}
            ></twilight-status-card>
          </div>
          <div class="span-6">
            <twilight-timetable-card
              .hass=${this.hass}
              .date=${a}
              .slots=${o}
              .entities=${this._areaEntities}
              .loading=${!1}
              .noHeader=${!1}
              .channels=${Q(t)}
              .selectedChannelId=${s}
              .channelSlotsMap=${u}
              @slots-changed=${this._onSlotsChanged}
              @edit-requested=${()=>{this._slotEditOpen=!0}}
              @channel-selected=${this._onChannelSelected}
              @channel-added=${this._onChannelAdded}
              @channel-renamed=${this._onChannelRenamed}
              @channel-deleted=${this._onChannelDeleted}
              @channel-enabled-toggled=${this._onChannelToggled}
              @time-hover-changed=${this._onSunPathHover}
              @mousemove=${this._onSunPathMove}
              @slot-selected=${this._onSlotSelected}
            ></twilight-timetable-card>
          </div>
          <div class="span-6">
            <twilight-area-lights-card
              .hass=${this.hass}
              .entities=${this._areaEntities}
              .activeSceneName=${c}
              .runState=${p}
              .manualOnly=${t.manual_only??!1}
              @lights-changed=${this._onLightsChanged}
              @mode-changed=${this._onLightsModeChanged}
              @open-edit=${()=>{this._areaLightsEditOpen=!0}}
            ></twilight-area-lights-card>
          </div>
          <div class="span-6">
            <twilight-inputs-card
              .hass=${this.hass}
              .config=${t.inputs??[]}
              .activities=${this._availableActivities(t)}
              .activitiesConfig=${t.activities??[]}
              .rulesConfig=${t.rules??[]}
              .placeholderDefaults=${this.placeholderDefaults}
              .runState=${p}
              .areaId=${t.area_id}
              @inputs-changed=${this._onInputsChanged}
              @open-edit=${()=>{this._inputsEditOpen=!0}}
            ></twilight-inputs-card>
          </div>
          <div class="span-6">
            <twilight-activities-card
              .hass=${this.hass}
              .config=${t.activities??[]}
              .inputs=${t.inputs??[]}
              .placeholderDefaults=${this.placeholderDefaults}
              .channels=${Q(t)}
              .heatmapProfiles=${t.heatmap_profiles??[]}
              @activities-changed=${this._onActivitiesChanged}
              @open-edit=${()=>{this._activitiesEditOpen=!0}}
            ></twilight-activities-card>
          </div>
          <div class="span-6">
            <twilight-sensors-card
              .hass=${this.hass}
              .config=${l}
              .noHeader=${!1}
              @sensors-changed=${this._onSensorsChanged}
              @open-edit=${()=>{this._sensorsEditOpen=!0}}
            ></twilight-sensors-card>
          </div>
          <div class="span-6">
            <twilight-rules-card
              .hass=${this.hass}
              .rules=${t.rules??[]}
              .inputsConfig=${t.inputs??[]}
              .activitiesConfig=${t.activities??[]}
              .channels=${Q(t)}
              .runState=${p}
              @rules-changed=${this._onRulesChanged}
              @open-edit=${()=>{this._rulesEditOpen=!0}}
            ></twilight-rules-card>
          </div>
        </div>
      </div>
 
      <div class="detail-footer">
        <div>
          <button class="btn-cancel" @click=${this._resetAreaToGlobalDefaults}>Reset to Global Defaults</button>
          ${this.areaConfigs.some(f=>f.area_id===t.area_id)?n`
            <button class="btn-cancel" style="border-color: var(--error-color, #db4437); color: var(--error-color, #db4437); margin-left: 12px;" @click=${()=>this._deleteArea()}>
              Remove Area
            </button>
          `:""}
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span class="save-status ${this._draftController.saveError?"error":""}">${this._saveStatusText()}</span>
          ${this._isNewArea||this._draftController.isDirty&&!this._draftController.saving?n`
            ${this._isNewArea?n`
              <button class="btn-cancel" ?disabled=${this._draftController.saving} @click=${()=>this._backToOverview()}>Cancel</button>
            `:n`
              <button class="btn-cancel" ?disabled=${this._draftController.saving} @click=${()=>this._draftController.cancel()}>Cancel</button>
            `}
            <button
              class="btn-save"
              ?disabled=${this._draftController.saving}
              @click=${()=>this._draftController.save()}
            >
              Save
            </button>
          `:""}
        </div>
      </div>

      <twilight-slot-editor
        .hass=${this.hass}
        .slots=${o}
        .entities=${this._areaEntities}
        .placeholderDefaults=${this._effectivePlaceholderDefaults}
        .open=${this._slotEditOpen}
        .highlightSlotId=${this._editingSlotId}
        .areaId=${t.area_id}
        .areaName=${t.name||""}
        .isPrimaryChannel=${s===A}
        .channelName=${((g=Q(t)[s])==null?void 0:g.name)||""}
        .transitionOnSeconds=${((d=Q(t)[s])==null?void 0:d.transition_on_seconds)??null}
        @slots-changed=${this._onSlotsChanged}
        @close=${()=>{this._slotEditOpen=!1,this._editingSlotId=null}}
      ></twilight-slot-editor>

      ${this._renderTooltip(u,o)}

      <twilight-reset-dialog
        .open=${this._resetDialogOpen}
        .title=${"Reset Area Settings"}
        .description=${"Select the sections or specific items you want to reset to inherit global defaults."}
        .nodes=${this._resetNodes}
        @confirm=${this._executeReset}
        @cancel=${()=>{this._resetDialogOpen=!1}}
      ></twilight-reset-dialog>

      <twilight-alert-dialog
        .open=${this._dialog.alertOpen}
        .dialogTitle=${this._dialog.alertTitle}
        .message=${this._dialog.alertMessage}
        @close=${this._dialog._onCloseAlert}
      ></twilight-alert-dialog>

      <twilight-area-lights-dialog
        .open=${this._areaLightsEditOpen}
        .hass=${this.hass}
        .entities=${this._areaEntities}
        .activeSceneName=${c}
        .runState=${p}
        .manualOnly=${t.manual_only??!1}
        @lights-changed=${this._onLightsChanged}
        @close=${()=>{this._areaLightsEditOpen=!1}}
      ></twilight-area-lights-dialog>

      <twilight-inputs-dialog
        .open=${this._inputsEditOpen}
        .hass=${this.hass}
        .config=${t.inputs??[]}
        .activities=${this._availableActivities(t)}
        .activitiesConfig=${t.activities??[]}
        .rulesConfig=${t.rules??[]}
        .placeholderDefaults=${this.placeholderDefaults}
        .runState=${p}
        .areaId=${t.area_id}
        @inputs-changed=${this._onInputsChanged}
        @close=${()=>{this._inputsEditOpen=!1}}
      ></twilight-inputs-dialog>

      <twilight-activities-dialog
        .open=${this._activitiesEditOpen}
        .hass=${this.hass}
        .config=${t.activities??[]}
        .inputs=${t.inputs??[]}
        .placeholderDefaults=${this.placeholderDefaults}
        .channels=${Q(t)}
        .heatmapProfiles=${t.heatmap_profiles??[]}
        @activities-changed=${this._onActivitiesChanged}
        @close=${()=>{this._activitiesEditOpen=!1}}
      ></twilight-activities-dialog>

      <twilight-sensors-dialog
        .open=${this._sensorsEditOpen}
        .hass=${this.hass}
        .config=${l}
        @sensors-changed=${this._onSensorsChanged}
        @close=${()=>{this._sensorsEditOpen=!1}}
      ></twilight-sensors-dialog>

      <twilight-rules-dialog
        .open=${this._rulesEditOpen}
        .hass=${this.hass}
        .config=${t.rules??[]}
        .rules=${t.rules??[]}
        .inputsConfig=${t.inputs??[]}
        .activitiesConfig=${t.activities??[]}
        .channels=${Q(t)}
        .runState=${p}
        @rules-changed=${this._onRulesChanged}
        @close=${()=>{this._rulesEditOpen=!1}}
      ></twilight-rules-dialog>

      <twilight-confirm-dialog
        .open=${this._dialog.confirmOpen}
        .dialogTitle=${this._dialog.confirmTitle}
        .message=${this._dialog.confirmMessage}
        @confirm=${this._dialog._onConfirm}
        @cancel=${this._dialog._onCancelConfirm}
      ></twilight-confirm-dialog>
    `}};H.styles=[qi,Ve,Rs,P`
      .view-header-grid {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: 16px;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
      }

      .span-6 { grid-column: span 6; min-width: 0; }
      .span-12 { grid-column: span 12; min-width: 0; }
      @media (max-width: 768px) {
        .view-content-grid .span-6 { grid-column: span 12; }
      }

      .detail-header {
        display: flex !important;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        width: 100%;
      }

      .detail-header .header-left {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
      }

      .detail-header .header-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 12px;
      }

      .back-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: none;
        border: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        width: 36px;
        height: 36px;
        padding: 0;
        margin: 0;
        line-height: 1;
        transition: background 0.15s, color 0.15s;
        flex-shrink: 0;
      }

      .back-btn:hover {
        background: rgba(255,255,255,0.08);
        color: var(--primary-text-color);
      }

      .header-left h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .area-select {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        color: var(--primary-text-color);
        border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 15%, transparent));
        border-radius: 4px;
        padding: 4px 10px;
        font-size: 12px;
        cursor: pointer;
      }

      .enabled-label {
        font-size: 13px;
        color: var(--secondary-text-color);
      }

      .view-content-container {
        padding: 24px;
        width: 100%;
        box-sizing: border-box;
        flex: 1;
        overflow-y: auto;
      }

      .view-content-grid {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: 16px;
        align-items: stretch;
        align-content: start;
        box-sizing: border-box;
      }

      .detail-footer {
        position: sticky;
        bottom: 0;
        background: var(--primary-background-color);
        border-top: 1px solid rgba(255,255,255,0.08);
        padding: 12px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        z-index: 10;
      }

      .save-status {
        font-size: 13px;
        color: var(--secondary-text-color);
      }

      .save-status.error {
        color: var(--error-color, #db4437);
      }

      .btn-cancel {
        background: transparent;
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 8px;
        color: var(--secondary-text-color);
        cursor: pointer;
        padding: 8px 20px;
        font-size: 14px;
        transition: background 0.15s, color 0.15s;
      }

      .btn-cancel:hover {
        background: rgba(255,255,255,0.05);
        color: var(--primary-text-color);
      }

      .btn-save {
        background: var(--tp-accent, var(--accent-color, #e91e8c));
        color: white;
        border: none;
        padding: 8px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.15s;
      }

      .btn-save:hover {
        opacity: 0.85;
      }

      .btn-save:disabled {
        background: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.3);
        cursor: not-allowed;
      }

      .slot-tooltip {
        position: fixed;
        z-index: 200;
        pointer-events: none;
        white-space: nowrap;
      }

      .slot-tooltip-badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.7px;
        font-family: inherit;
      }
    `],F([h({type:Object})],H.prototype,"hass",2),F([h({type:String})],H.prototype,"areaId",2),F([h({type:Array})],H.prototype,"areaConfigs",2),F([h({type:Array})],H.prototype,"areas",2),F([h({type:Object})],H.prototype,"todayData",2),F([h({type:Object})],H.prototype,"globalConfig",2),F([h({type:Object})],H.prototype,"placeholderDefaults",2),F([h({type:Object})],H.prototype,"areasState",2),F([b()],H.prototype,"_areaPlaceholderDefaults",2),F([b()],H.prototype,"_isNewArea",2),F([b()],H.prototype,"_selectedChannelId",2),F([b()],H.prototype,"_areaEntities",2),F([b()],H.prototype,"_extractedEntities",2),F([b()],H.prototype,"_slotEditOpen",2),F([b()],H.prototype,"_inputsEditOpen",2),F([b()],H.prototype,"_activitiesEditOpen",2),F([b()],H.prototype,"_sensorsEditOpen",2),F([b()],H.prototype,"_areaLightsEditOpen",2),F([b()],H.prototype,"_rulesEditOpen",2),F([b()],H.prototype,"_editingSlotId",2),F([b()],H.prototype,"_hoveredTime",2),F([b()],H.prototype,"_hoveredChannelId",2),F([b()],H.prototype,"_tooltipX",2),F([b()],H.prototype,"_tooltipY",2),F([b()],H.prototype,"_resetDialogOpen",2),F([b()],H.prototype,"_globalDefaultsTemplate",2),F([b()],H.prototype,"_resetNodes",2),F([b()],H.prototype,"_slotTimes",2),H=F([L("twilight-area-detail-view")],H);var cr=Object.defineProperty,pr=Object.getOwnPropertyDescriptor,kt=(t,e,i,a)=>{for(var s=a>1?void 0:a?pr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&cr(e,i,s),s};let ht=class extends B{constructor(){super(...arguments),this.hass=null,this.globalConfigOverride=null,this._areaConfigs=[],this._areas=[],this._todayData=null,this._activeAreaId=null,this._view="overview",this._loading=!1,this._showAddAreaList=!1,this._areasState={},this._unsubAll=null,this._globalConfig={},this._placeholderDefaults=null,this._areaSlotTimesMap={},this._subscribedConnection=null,this._clock=new ri(this)}firstUpdated(t){super.firstUpdated(t),this._loadData(),this.hass&&this._subscribeAll()}updated(t){super.updated(t),t.has("hass")&&this.hass&&this.hass.connection!==this._subscribedConnection&&this._subscribeAll(),t.has("globalConfigOverride")&&this.globalConfigOverride&&(this._globalConfig=this.globalConfigOverride)}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribeAll(),this._areasState={}}async _loadData(){this._loading=!0;try{if(this.hass){const[t,e,i,a,s]=await Promise.all([oi(this.hass),Xa(this.hass),Ui(this.hass),Ds(this.hass).catch(()=>({})),Hi(this.hass).catch(()=>null)]);this._areaConfigs=t.map(l=>({...l,activities:aa(l.activities)})),this._areas=e,this._todayData=i.day_data||null,this._globalConfig=a||{},this._placeholderDefaults=s;const o=new Date().toISOString().slice(0,10),r={};await Promise.all(this._areaConfigs.map(async l=>{try{const c=await Os(this.hass,{area_id:l.area_id,date:o});r[l.area_id]=c}catch{}})),this._areaSlotTimesMap=r}}finally{this._loading=!1}}_selectArea(t){this._activeAreaId=t,this._showAddAreaList=!1,this._view="config"}_subscribeAll(){this._unsubscribeAll(),this.hass&&(this._subscribedConnection=this.hass.connection,this.hass.connection.subscribeMessage(t=>{this._areasState=t.full?t.areas||{}:{...this._areasState,...t.areas||{}}},{type:"twilight/subscribe_all"}).then(t=>{this._unsubAll=t},t=>{console.warn("Error subscribing to all areas",t)}))}_unsubscribeAll(){this._subscribedConnection=null,this._unsubAll&&(this._unsubAll(),this._unsubAll=null)}_backToOverview(){this._view="overview",this._activeAreaId=null}_overviewEngineInfo(t,e){if(!e.enabled)return{label:"Disabled",color:"#888",sub:"Engine inactive"};if(!t)return{label:"Standby",color:"var(--secondary-text-color)",sub:"Idle"};const i=t.active_activity;if(i)return{label:i.charAt(0).toUpperCase()+i.slice(1),color:"#9c27b0",sub:`Activity: ${i}`};const a=t.scene_activated_at!==null;return{label:a?"Scene Active":"Idle",color:a?"#4caf50":"#2196f3",sub:a?"Scene switched by engine":"Waiting for input"}}_emitAreasChanged(){this.dispatchEvent(new CustomEvent("areas-changed",{detail:this._areaConfigs,bubbles:!0,composed:!0}))}render(){return this._loading?n`<div style="padding:24px;color:var(--secondary-text-color)">Loading…</div>`:this._view==="config"&&this._activeAreaId?n`
        <twilight-area-detail-view
          .hass=${this.hass}
          .areaId=${this._activeAreaId}
          .areaConfigs=${this._areaConfigs}
          .areas=${this._areas}
          .todayData=${this._todayData}
          .globalConfig=${this._globalConfig}
          .placeholderDefaults=${this._placeholderDefaults}
          .areasState=${this._areasState}
          @back=${this._backToOverview}
          @select-area=${t=>this._selectArea(t.detail.areaId)}
          @areas-changed=${t=>{this._areaConfigs=t.detail,this._emitAreasChanged()}}
          @engines-changed=${()=>this._subscribeAll()}
        ></twilight-area-detail-view>
      `:this._renderOverview()}_buildAreaCardData(t){var J,k,st,et,at;const e=this._areas.find(N=>N.area_id===t.area_id),i=(J=this._areasState)==null?void 0:J[t.area_id],a=this._todayData,s=this._clock.liveMins,o=new Date().toISOString().slice(0,10),r=this._areaSlotTimesMap[t.area_id],l=na(t),c=[];for(const N of l){const ot=Q(t)[N],bt=((st=(k=r==null?void 0:r.channels)==null?void 0:k[N])==null?void 0:st[o])||[],W=qe(bt,we(t,N)),Y=Ya(W),it=t.enabled&&(ot==null?void 0:ot.enabled)!==!1;c.push({id:N,name:(ot==null?void 0:ot.name)||(N===A?"Primary":N),slots:W,gradient:Y,enabled:it})}const p=((at=(et=r==null?void 0:r.channels)==null?void 0:et[A])==null?void 0:at[o])||[],g=qe(p,we(t,A)).find(N=>Ae(N,s)),d=t.enabled?(g==null?void 0:g.label)??"None":"Disabled",f=t.enabled?(g==null?void 0:g.color)??"rgba(255,255,255,0.15)":"#888",v=(g==null?void 0:g.id)==="day",y=t.enabled?v?"#141926":`color-mix(in srgb, ${f} 25%, #ffffff)`:"var(--secondary-text-color)",w=t.enabled?f:"rgba(255,255,255,0.05)",_=`--badge-border:${t.enabled?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.08)"};--badge-bg:${w};--badge-text:${y}`,D=this._overviewEngineInfo(i,t),T=(i==null?void 0:i.lights_on)??0,E=(i==null?void 0:i.lights_total)??0,C=(s/1440*100).toFixed(2),z=i==null?void 0:i.active_scene_names,m=[];if(i&&i.scene_activated_at!==null&&z)for(const N of l){const ot=z[N];if(ot){const bt=Q(t)[N],W=(bt==null?void 0:bt.name)||(N===A?"Primary":N);m.push({channelName:W,sceneName:ot})}}let O=9,j=9;c.length===1?(O=12,j=10):c.length===2?(O=11,j=10):c.length===3&&(O=10,j=9);const S=O/2,M=O+(O>=16?8:O>=12?6:5),V=c.length===1?0:O/2,I=`--row-height:${M}px;--bar-height:${O}px;--bar-radius:${S}px;--label-font-size:${j}px;--row-gap:${V}px;`;return{areaName:t.name||(e==null?void 0:e.name)||t.area_id,slotLabel:d,slotColor:f,badgeStyle:_,sparklineStyle:I,rows:c,liveLeft:C,engineInfo:D,lightsOn:T,lightsTotal:E,activeSceneItems:m,todayData:a}}_renderOverview(){const t=this._areaConfigs.length,e=this._areas.length,i=this._areas.filter(a=>!this._areaConfigs.some(s=>s.area_id===a.area_id));return n`
      <div class="view-header-container">
        <div class="overview-header">
          <div class="header-left">
            <h2>Twilight Areas</h2>
          </div>
          <div class="header-right">
            ${t} configured · <span style="color:var(--tp-accent,var(--accent-color)); margin-left: 4px;">${e-t} pending</span>
          </div>
        </div>
      </div>

      <div class="rv-content">
        <div class="area-grid">
          ${this._areaConfigs.map(a=>{const s=this._buildAreaCardData(a);return n`
              <div class="area-card ${a.enabled?"enabled":""}"
                   style="--shadow-color:${s.slotColor}"
                   @click=${()=>this._selectArea(a.area_id)}>
                <div class="card-header">
                  <div class="title-group">
                    <div class="area-name">${s.areaName}</div>
                    <div class="area-id-sub">${a.area_id}</div>
                  </div>
                  <div class="slot-badge" style=${s.badgeStyle}>
                    ${s.slotLabel}
                  </div>
                </div>

                <div class="sparkline-container" style=${s.sparklineStyle}>
                  ${s.rows.length>0?n`
                    <div class="sparkline-wrapper">
                      ${s.rows.map(o=>n`
                        <div class="sparkline-row ${o.enabled?"":"disabled"}">
                          <span class="sparkline-label" title="${o.name}">${o.name}</span>
                          <div class="sparkline-bar-wrapper">
                            <div class="sparkline-bar" style="--bar-gradient:${o.gradient}"></div>
                          </div>
                        </div>
                      `)}
                      ${a.enabled&&s.todayData?n`
                        <div class="sparkline-indicator-line" style="left: calc(86px + (100% - 86px) * ${s.liveLeft} / 100)"></div>
                      `:""}
                    </div>
                  `:n`
                    <div class="no-scenes" style="text-align: center;">
                      No slots configured
                    </div>
                  `}
                </div>

                <div class="card-details">
                  <div class="details-column">
                    <div class="detail-row">
                      <span class="detail-icon" style="background: color-mix(in srgb, ${s.engineInfo.color} 10%, transparent)">
                        <div class="engine-dot" style="background: ${s.engineInfo.color}; box-shadow: 0 0 6px ${s.engineInfo.color}"></div>
                      </span>
                      <div class="detail-content">
                        <span class="detail-label">
                          Engine
                        </span>
                        <span class="detail-value" style="color: ${s.engineInfo.color}">
                          ${s.engineInfo.label}
                        </span>
                      </div>
                    </div>

                    ${(()=>{const o=s.lightsOn>0;return n`
                        <div class="detail-row">
                          <span class="detail-icon" style="color: ${o?"#fdd835":"var(--secondary-text-color)"}; background: ${o?"rgba(253, 216, 53, 0.1)":"rgba(255, 255, 255, 0.04)"}; font-size: 10px;">
                            💡
                          </span>
                          <div class="detail-content">
                            <span class="detail-label">
                              Lights
                            </span>
                            <span class="detail-value" style="color: ${o?"#fdd835":"var(--primary-text-color)"}">
                              ${s.lightsTotal>0?`${s.lightsOn}/${s.lightsTotal} On`:"No lights"}
                            </span>
                          </div>
                        </div>
                      `})()}
                  </div>

                  <div class="details-column scenes-col">
                    <div class="scenes-title" style="margin-bottom: 2px;">
                      Active Scenes
                    </div>
                    ${s.activeSceneItems.length>0?n`
                      <div class="scenes-list">
                        ${s.activeSceneItems.map(o=>n`
                          <div class="scene-item" style="flex-direction: column;">
                            <span class="scene-channel">
                              ${o.channelName}
                            </span>
                            <span class="scene-name" style="color: var(--tp-accent, var(--accent-color));" title="${o.sceneName}">
                              ${o.sceneName}
                            </span>
                          </div>
                        `)}
                      </div>
                    `:n`
                      <div class="no-scenes" style="display: flex; align-items: center; height: 100%;">
                        None
                      </div>
                    `}
                  </div>
                </div>
              </div>
            `})}

          <div class="add-area-card" @click=${()=>{this._showAddAreaList=!this._showAddAreaList}}>
            <span class="add-icon">+</span>
            <span class="add-label">Add Area</span>
          </div>
        </div>

        ${this._showAddAreaList?n`
          <div class="add-area-list" style="margin-top:20px">
            <div class="add-area-list-header">
              <span>Select an area to configure:</span>
              <button class="close-add-btn" @click=${a=>{a.stopPropagation(),this._showAddAreaList=!1}}>×</button>
            </div>
            <div class="unconfigured-grid">
              ${i.map(a=>n`
                <div class="unconfigured-row" @click=${()=>this._selectArea(a.area_id)}>
                  <span class="unconfigured-name">${a.name}</span>
                  <span class="setup-badge">Setup</span>
                </div>
              `)}
              ${i.length===0?n`<div class="no-unconfigured">All areas are already configured!</div>`:""}
            </div>
          </div>
        `:""}
      </div>
    `}};ht.styles=[qi,Ve,P`
    *, *:before, *:after {
      box-sizing: border-box;
    }


    /* ── Overview: Header ── */
    .overview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      gap: 12px;
      box-sizing: border-box;
    }
    .overview-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      line-height: 24px;
    }
    .overview-header .header-left {
      display: flex;
      align-items: center;
      min-width: 0;
    }
    .overview-header .header-right {
      font-size: 13px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }

    /* ── Overview: Content ── */
    .rv-content {
      padding: 24px;
      box-sizing: border-box;
      flex: 1;
      overflow-y: auto;
    }

    .area-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .area-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-left: 3px solid transparent;
      border-radius: 16px;
      padding: 16px;
      cursor: pointer;
      transition: border-color 0.2s ease, outline-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 10px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
      outline: 1px solid transparent;
      outline-offset: -1px;
    }
    .area-card.enabled { border-left-color: var(--success-color, #4caf50); }
    .area-card:hover {
      transform: scale(1.01);
      outline-color: var(--shadow-color, var(--tp-accent, var(--accent-color)));
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35),
                  0 0 20px color-mix(in srgb, var(--shadow-color, var(--tp-accent, var(--accent-color))) 30%, transparent);
    }

    .card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
    .title-group { display: flex; flex-direction: column; gap: 2px; }
    .area-name { font-size: 18px; font-weight: 600; color: var(--primary-text-color); }
    .area-id-sub { display: none; font-size: 11px; color: var(--secondary-text-color); font-family: monospace; opacity: 0.7; }

    .slot-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
      border: 1px solid var(--badge-border, rgba(255,255,255,0.1));
      background: var(--badge-bg, rgba(255,255,255,0.05));
      color: var(--badge-text, var(--primary-text-color));
    }

    .sparkline-container {
      margin: 2px 0 2px 0;
      position: relative;
      height: 64px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .sparkline-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--row-gap, 4px);
      width: 100%;
    }

    .sparkline-row {
      display: flex;
      align-items: center;
      height: var(--row-height, 14px);
    }

    .sparkline-label {
      width: 78px;
      font-size: var(--label-font-size, 9px);
      font-weight: 700;
      color: var(--secondary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      opacity: 0.8;
    }

    .sparkline-row.disabled .sparkline-label {
      text-decoration: none;
      opacity: 0.4;
    }

    .sparkline-bar-wrapper {
      flex: 1;
      height: var(--bar-height, 10px);
      position: relative;
    }

    .sparkline-bar {
      width: 100%;
      height: 100%;
      border-radius: var(--bar-radius, 5px);
      background: var(--bar-gradient, rgba(255, 255, 255, 0.05));
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-sizing: border-box;
    }

    .sparkline-row.disabled .sparkline-bar {
      opacity: 0.3;
      filter: grayscale(100%);
    }

    .sparkline-bar.empty {
      background: rgba(255, 255, 255, 0.01);
      border: 1px dashed rgba(255, 255, 255, 0.08);
    }

    .sparkline-indicator-line {
      position: absolute;
      top: 0px;
      bottom: 0px;
      width: 2px;
      background: #ffffff;
      box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
      pointer-events: none;
      z-index: 5;
    }

    .card-details {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 10px;
      padding-top: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .details-column {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 8px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 8px;
      min-height: 64px;
      box-sizing: border-box;
      min-width: 0;
    }

    .details-column.scenes-col {
      justify-content: flex-start;
      gap: 5px;
    }

    .detail-row {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .detail-icon {
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 50%;
      flex-shrink: 0;
    }

    .engine-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .detail-content {
      display: flex;
      flex-direction: column;
      gap: 1px;
      min-width: 0;
      flex: 1;
    }

    .detail-label {
      font-size: 8.5px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--secondary-text-color);
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .detail-value {
      font-size: 11px;
      font-weight: 600;
      color: var(--primary-text-color);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .scenes-title {
      font-size: 8.5px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--secondary-text-color);
      letter-spacing: 0.5px;
    }

    .scenes-list {
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
    }

    .scene-item {
      display: flex;
      gap: 4px;
      font-size: 10.5px;
      line-height: 1.2;
      min-width: 0;
    }

    .scene-channel {
      color: var(--secondary-text-color);
      font-weight: 500;
      flex-shrink: 0;
    }

    .scene-name {
      color: var(--success-color, #4caf50);
      font-weight: 600;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .no-scenes {
      font-size: 10.5px;
      color: var(--secondary-text-color);
      font-style: italic;
    }

    /* ── Add Area tile ── */
    .add-area-card {
      background: transparent;
      border: 2px dashed rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      min-height: 180px;
      cursor: pointer;
      transition: border-color 0.2s ease, background 0.2s ease;
      color: var(--secondary-text-color);
    }
    .add-area-card:hover {
      border-color: var(--tp-accent, var(--accent-color));
      color: var(--primary-text-color);
      background: rgba(255, 255, 255, 0.015);
    }
    .add-icon { font-size: 32px; font-weight: 300; }
    .add-label { font-size: 14px; font-weight: 600; letter-spacing: 0.5px; }

    /* ── Unconfigured list ── */
    .add-area-list {
      background: rgba(255, 255, 255, 0.02);
      border: 1px dashed rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      animation: rv-slide-down 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    @keyframes rv-slide-down {
      from { opacity: 0; transform: translateY(-10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .add-area-list-header { display: flex; justify-content: space-between; align-items: center; font-weight: 600; color: var(--primary-text-color); }
    .close-add-btn { background: transparent; border: none; color: var(--secondary-text-color); font-size: 20px; cursor: pointer; padding: 4px 8px; }
    .close-add-btn:hover { color: var(--primary-text-color); }
    .unconfigured-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
    .unconfigured-row {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.05);
      padding: 14px 18px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      transition: background 0.2s ease, border-color 0.2s ease;
    }
    .unconfigured-row:hover { background: rgba(255,255,255,0.08); border-color: var(--tp-accent, var(--accent-color)); }
    .unconfigured-name { font-weight: 600; color: var(--primary-text-color); font-size: 13px; }
    .setup-badge { font-size: 9px; font-weight: 700; text-transform: uppercase; padding: 2px 6px; background: var(--tp-accent, var(--accent-color)); color: #fff; border-radius: 4px; }
    .no-unconfigured { grid-column: 1/-1; text-align: center; font-style: italic; color: var(--secondary-text-color); padding: 20px; }
    `],kt([h({type:Object})],ht.prototype,"hass",2),kt([h({type:Object})],ht.prototype,"globalConfigOverride",2),kt([b()],ht.prototype,"_areaConfigs",2),kt([b()],ht.prototype,"_areas",2),kt([b()],ht.prototype,"_todayData",2),kt([b()],ht.prototype,"_activeAreaId",2),kt([b()],ht.prototype,"_view",2),kt([b()],ht.prototype,"_loading",2),kt([b()],ht.prototype,"_showAddAreaList",2),kt([b()],ht.prototype,"_areasState",2),kt([b()],ht.prototype,"_globalConfig",2),kt([b()],ht.prototype,"_placeholderDefaults",2),kt([b()],ht.prototype,"_areaSlotTimesMap",2),ht=kt([L("twilight-areas-view")],ht);var hr=Object.defineProperty,ur=Object.getOwnPropertyDescriptor,Ht=(t,e,i,a)=>{for(var s=a>1?void 0:a?ur(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&hr(e,i,s),s};const Pe=60,la=15,ss=15,da=25,ca={"1w":"1 Week","2w":"2 Weeks","1m":"1 Month","3m":"3 Months","6m":"6 Months"},pa={"1m":"1 Min","5m":"5 Min","10m":"10 Min","15m":"15 Min","30m":"30 Min","60m":"60 Min"},ha={"1m":{count:1440,duration:60},"5m":{count:288,duration:300},"10m":{count:144,duration:600},"15m":{count:96,duration:900},"30m":{count:48,duration:1800},"60m":{count:24,duration:3600}},ua={"1w":7,"2w":14,"1m":30,"3m":90,"6m":180},as=5,fa=new Map;function fr(t){let e=fa.get(t);return e||(e=new Intl.DateTimeFormat("en-US",{timeZone:t,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1}),fa.set(t,e)),e}function ga(t,e){const i=Object.fromEntries(fr(e).formatToParts(t).map(o=>[o.type,o.value])),a=Number(i.hour)%24,s=Date.UTC(Number(i.year),Number(i.month)-1,Number(i.day),a,Number(i.minute),Number(i.second));return Math.round((s-t.getTime())/1e3)}function va(t,e){const i=ga(t,e),a=Math.floor(t.getTime()/1e3)+i,s=Math.floor(a/86400)*86400,o=ga(new Date(s*1e3),e);return s-o}function gr(t,e,i,a,s=new Date){const o=Math.floor(s.getTime()/1e3),{duration:r,count:l}=ha[a],c=Array.from({length:7},()=>new Array(l).fill(0)),p=new Array(7).fill(0),u=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:e}),g={Mon:0,Tue:1,Wed:2,Thu:3,Fri:4,Sat:5,Sun:6},d=[];let f=[],v=-1;for(const w of t)w[0]<v&&(f.length>0&&d.push(f),f=[]),f.push(w),v=w[0];if(f.length>0&&d.push(f),d.length===0)return Array.from({length:7},()=>new Array(l).fill(0));for(let w=0;w<i;w++){const x=new Date(s.getTime()-w*24*60*60*1e3),_=va(x,e),D=va(new Date((_+25*3600)*1e3),e),T=Math.min(D,o);if(_>=T)continue;const E=g[u.format(new Date(_*1e3))]??0,C=[];for(const z of d){let m=0;for(const[S,M]of z)if(S<=_)m=M;else break;let O=_,j=m;for(const[S,M]of z)if(!(S<=_)){if(S>=T){C.push({start:O,end:T,val:j}),O=T;break}C.push({start:O,end:S,val:j}),O=S,j=M}O<T&&C.push({start:O,end:T,val:j})}for(let z=0;z<l;z++){const m=_+z*r,O=m+r;if(m>=T)continue;const j=Math.min(O,T),S=j-m;if(S<=0)continue;let M=0;for(const I of C){const J=Math.max(I.start,m),k=Math.min(I.end,j);J<k&&I.val===1&&(M+=k-J)}const V=Math.min(1,M/S);c[E][z]+=V}p[E]++}const y=Array.from({length:7},()=>new Array(l).fill(0));for(let w=0;w<7;w++){const x=p[w];for(let _=0;_<l;_++)y[w][_]=x>0?c[w][_]/x:0}return y}let St=class extends B{constructor(){super(...arguments),this.hass=null,this.activeAreaId=null,this._activeMode="motion",this._activeRange="1w",this._activeResolution="10m",this._loading=!1,this._motionData=[],this._lightData=[],this._profiles=[],this._activeSource="live",this._w=0,this._dialogs=new xe(this),this._ro=null}get _activeProfile(){return this._activeSource==="live"?null:this._profiles.find(t=>t.id===this._activeSource)??null}disconnectedCallback(){var t;(t=this._ro)==null||t.disconnect(),super.disconnectedCallback()}updated(t){var s;if(!this._ro){const o=(s=this.shadowRoot)==null?void 0:s.querySelector(".canvas-wrap");o&&(this._ro=new ResizeObserver(r=>{const l=r[0].contentRect.width;l>0&&l!==this._w&&(this._w=l,this._draw())}),this._ro.observe(o))}const e=t.has("hass")&&!t.get("hass")&&this.hass,i=t.has("activeAreaId")&&t.get("activeAreaId")!==this.activeAreaId,a=t.has("_activeRange");(e||i||a)&&this._load(),(t.has("_motionData")||t.has("_lightData")||t.has("_activeMode")||t.has("_activeResolution")||t.has("_activeSource")||t.has("_profiles")||t.has("_w"))&&requestAnimationFrame(()=>this._draw())}async _loadProfiles(){if(!(!this.hass||!this.activeAreaId))try{const e=(await oi(this.hass)).find(i=>i.area_id===this.activeAreaId);this._profiles=(e==null?void 0:e.heatmap_profiles)??[]}catch(t){console.error("Twilight heatmap profiles load error:",t)}}async _load(){if(!(!this.hass||!this.activeAreaId)){this._loading=!0;try{const[t]=await Promise.all([so(this.hass,{area_id:this.activeAreaId,days:ua[this._activeRange],binary_only:!0}),this._loadProfiles()]);this._motionData=t.motion??[],this._lightData=t.light_on??[]}catch(t){console.error("Twilight heatmap load error:",t)}finally{this._loading=!1}}}async _saveCurrentProfile(){if(!this.hass||!this.activeAreaId)return;if(this._profiles.length>=as){await this._dialogs.showAlert("Limit Reached",`Maximum ${as} saved heatmap profiles allowed per area.`);return}const t=this._activeResolution==="1m"?"5m":this._activeResolution,e=await this._dialogs.showPrompt("Save Heatmap Profile","Workweek Profile","Profile Name");if(e)try{await Is(this.hass,{area_id:this.activeAreaId,name:e,resolution:t,range:this._activeRange}),await this._loadProfiles()}catch(i){await this._dialogs.showAlert("Error",`Failed to save profile: ${i.message}`)}}async _updateProfile(t){if(!(!this.hass||!this.activeAreaId))try{await Is(this.hass,{area_id:this.activeAreaId,name:t.name,resolution:t.resolution,range:t.range,profile_id:t.id}),await this._loadProfiles(),await this._dialogs.showAlert("Updated",`Profile "${t.name}" recalculated from current recorder history.`)}catch(e){await this._dialogs.showAlert("Error",`Failed to update profile: ${e.message}`)}}async _deleteProfile(t){if(!(!this.hass||!this.activeAreaId||!await this._dialogs.showConfirm("Delete Profile",`Delete profile "${t.name}"?`)))try{await oo(this.hass,{area_id:this.activeAreaId,profile_id:t.id}),this._activeSource===t.id&&this._setSource("live"),await this._loadProfiles()}catch(i){await this._dialogs.showAlert("Error",`Failed to delete profile: ${i.message}`)}}_setSource(t){this._activeSource=t;const e=t==="live"?null:this._profiles.find(i=>i.id===t);e&&(this._activeMode="motion",this._activeResolution=e.resolution,this._activeRange=e.range)}_setMode(t){this._activeProfile||(this._activeMode=t)}_setRange(t){this._activeProfile||(this._activeRange=t)}_setResolution(t){this._activeProfile||(this._activeResolution=t)}_getFillColorRGB(){const t=this._activeMode==="motion"?"--tw-chart-motion":"--tw-chart-light-on",e=this._activeMode==="motion"?"#00e5ff":"#ff9100",i=getComputedStyle(this).getPropertyValue(t).trim()||e;if(i.startsWith("#")){const s=parseInt(i.slice(1,3),16),o=parseInt(i.slice(3,5),16),r=parseInt(i.slice(5,7),16);return`${s}, ${o}, ${r}`}const a=i.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);return a?`${a[1]}, ${a[2]}, ${a[3]}`:this._activeMode==="motion"?"0, 176, 255":"255, 145, 0"}_getTextColor(){return getComputedStyle(this).getPropertyValue("--primary-text-color").trim()||"rgba(255,255,255,0.9)"}_getGridColor(){return getComputedStyle(this).getPropertyValue("--divider-color").trim()||"rgba(128,128,128,0.2)"}_getAxisFont(){return`400 11px ${getComputedStyle(this).getPropertyValue("--font-family").trim()||"system-ui, sans-serif"}`}_profileDensities(t,e){return Array.from({length:7},(i,a)=>{const s=t.motion_buckets[String(a)]??[];return Array.from({length:e},(o,r)=>s[r]??0)})}_draw(){var T,E;const t=(T=this.shadowRoot)==null?void 0:T.querySelector("canvas");if(!t||!this._w||!this.hass)return;const e=this._w,i=t.getBoundingClientRect().height;if(!i)return;const a=ji(t,e,i),s=e-Pe-la,r=(i-ss-da)/7,l=this.hass.config.time_zone||"UTC",c=((E=this.hass.locale)==null?void 0:E.language)||navigator.language||"en-US",p=new Date,g=(p.getUTCDay()+6)%7,d=new Date(Date.UTC(p.getUTCFullYear(),p.getUTCMonth(),p.getUTCDate()-g)),f=Array.from({length:7},(C,z)=>{const m=new Date(d.getTime()+z*24*60*60*1e3);return new Intl.DateTimeFormat(c,{weekday:"short",timeZone:l}).format(m)}),v=this._activeProfile,{count:y}=ha[this._activeResolution];let w;if(v)w=this._profileDensities(v,y);else{const C=this._activeMode==="motion"?this._motionData:this._lightData;if(!C||C.length===0){a.restore();return}w=gr(C,l,ua[this._activeRange],this._activeResolution)}if(!w){a.restore();return}const x=this._getFillColorRGB(),_=this._getTextColor(),D=this._getGridColor();a.font=this._getAxisFont();for(let C=0;C<7;C++){const z=ss+C*r;a.fillStyle=_,a.textAlign="right",a.fillText(f[C],Pe-10,z+r/2+4),C>0&&(a.strokeStyle=D,a.beginPath(),a.moveTo(Pe,z),a.lineTo(e-la,z),a.stroke());for(let m=0;m<y;m++){const O=w[C][m];if(O>0){const j=Pe+m/y*s,S=s/y+.5,M=r-2;let V=0;this._activeMode==="motion"?V=Math.min(1,Math.sqrt(O)*1.8):V=Math.min(1,O*1.2),a.fillStyle=`rgba(${x}, ${V})`,a.fillRect(j,z+1,S,M)}}}a.strokeStyle=D,a.lineWidth=1;for(let C=0;C<=24;C+=2){const z=Pe+C/24*s;a.beginPath(),a.moveTo(z,ss),a.lineTo(z,i-da),a.stroke()}a.fillStyle=_;for(let C=0;C<=24;C+=4){const z=Pe+C/24*s,m=`${C.toString().padStart(2,"0")}:00`;a.textAlign=C===0?"start":C===24?"end":"center",a.fillText(m,z,i-8)}a.restore()}render(){var a;const t=this._activeProfile,e=t!==null,i=e?Object.keys(t.motion_buckets).length>0:((a=this._activeMode==="motion"?this._motionData:this._lightData)==null?void 0:a.length)>0;return n`
      <div class="card-header">
        <div class="header-left">
          <span class="card-dot" style="--dot-color: #8b5cf6;"></span>
          <span class="card-title">Activity Profile (Heatmap)</span>
        </div>
        <div class="header-controls">
          <select
            class="source-select"
            .value=${this._activeSource}
            @change=${s=>this._setSource(s.target.value)}
            title="Data source"
          >
            <option value="live" ?selected=${this._activeSource==="live"}>Live (Recorder)</option>
            ${this._profiles.map(s=>n`
              <option value=${s.id} ?selected=${s.id===this._activeSource}>${s.name}</option>
            `)}
          </select>
          <div class="toggle-group">
            <button
              class="toggle-btn ${this._activeMode==="motion"?"active":""}"
              ?disabled=${e}
              @click=${()=>this._setMode("motion")}
            >
              Motion
            </button>
            <button
              class="toggle-btn ${this._activeMode==="light"?"active":""}"
              ?disabled=${e}
              @click=${()=>this._setMode("light")}
            >
              Light
            </button>
          </div>
          <div class="toggle-group">
            ${Object.keys(pa).map(s=>n`
              <button
                class="toggle-btn ${this._activeResolution===s?"active":""}"
                ?disabled=${e}
                @click=${()=>this._setResolution(s)}
              >
                ${pa[s]}
              </button>
            `)}
          </div>
          <div class="toggle-group">
            ${Object.keys(ca).map(s=>n`
              <button
                class="toggle-btn ${this._activeRange===s?"active":""}"
                ?disabled=${e}
                @click=${()=>this._setRange(s)}
              >
                ${ca[s]}
              </button>
            `)}
          </div>
        </div>
      </div>
      <div class="profiles-bar">
        <div class="profiles-label">
          <span>Saved Profiles:</span>
        </div>
        <div class="profiles-list">
          ${this._profiles.map(s=>n`
              <div class="profile-chip ${this._activeSource===s.id?"active":""}">
                <span style="cursor:pointer" @click=${()=>this._setSource(s.id)} title="Click to view this profile">
                  ${s.name}
                </span>
                <span class="badge">${s.resolution} / ${s.range}</span>
                <button
                  class="chip-action"
                  title="Update profile from current recorder data"
                  @click=${()=>this._updateProfile(s)}
                >
                  🔄
                </button>
                <button
                  class="chip-action"
                  title="Delete profile"
                  @click=${()=>this._deleteProfile(s)}
                >
                  ✕
                </button>
              </div>
            `)}
          ${this._profiles.length<as?n`
                <button class="save-profile-btn" @click=${this._saveCurrentProfile}>
                  + Save Profile
                </button>
              `:""}
        </div>
      </div>

      <div class="canvas-wrap">
        ${!i&&!this._loading?n`<div class="no-data">No activity data available for the selected period</div>`:n`<canvas></canvas>`}
        ${this._loading?n`<div class="loading-overlay">Loading heatmap data…</div>`:""}
      </div>

      <twilight-alert-dialog
        .open=${this._dialogs.alertOpen}
        .dialogTitle=${this._dialogs.alertTitle}
        .message=${this._dialogs.alertMessage}
        @close=${this._dialogs._onCloseAlert}
      ></twilight-alert-dialog>

      <twilight-confirm-dialog
        .open=${this._dialogs.confirmOpen}
        .dialogTitle=${this._dialogs.confirmTitle}
        .message=${this._dialogs.confirmMessage}
        @confirm=${this._dialogs._onConfirm}
        @cancel=${this._dialogs._onCancelConfirm}
      ></twilight-confirm-dialog>

      <twilight-prompt-dialog
        .open=${this._dialogs.promptOpen}
        .dialogTitle=${this._dialogs.promptTitle}
        .message=${this._dialogs.promptMessage}
        .placeholder=${this._dialogs.promptPlaceholder}
        .value=${this._dialogs.promptValue}
        @submit=${this._dialogs._onSubmitPrompt}
        @cancel=${this._dialogs._onCancelPrompt}
      ></twilight-prompt-dialog>
    `}};St.styles=[Zt,P`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      font-family: var(--font-family, inherit);
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      overflow: clip;
      box-sizing: border-box;
      font-family: var(--font-family, inherit);

      --tw-chart-light-on: #ff9100;
      --tw-chart-motion: #00e5ff;
    }
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 16px 20px 12px;
      border-bottom: 1px solid var(--divider-color);
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .card-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .header-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .toggle-group {
      display: flex;
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
      border-radius: 8px;
      padding: 2px;
      border: 1px solid var(--divider-color);
    }
    .toggle-btn {
      background: transparent;
      border: none;
      color: var(--secondary-text-color);
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.2s;
      outline: none;
    }
    .toggle-btn:hover {
      color: var(--primary-text-color);
    }
    .toggle-btn.active {
      background: var(--tp-accent, var(--accent-color));
      color: white;
    }
    .toggle-btn:disabled {
      opacity: 0.35;
      cursor: default;
    }
    .toggle-btn:disabled:hover {
      color: var(--secondary-text-color);
    }
    .source-select {
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 5px 8px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      outline: none;
    }
    .canvas-wrap {
      position: relative;
      width: 100%;
      height: 180px;
      min-height: 180px;
      min-width: 0;
    }
    canvas {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .no-data {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 13px;
      color: var(--secondary-text-color);
      border-radius: 8px;
    }
    .loading-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--card-background-color) 60%, transparent);
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 500;
      backdrop-filter: blur(1px);
      z-index: 5;
    }
    .profiles-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 20px;
      background: color-mix(in srgb, var(--primary-text-color) 2%, transparent);
      border-bottom: 1px solid var(--divider-color);
      gap: 12px;
      flex-wrap: wrap;
    }
    .profiles-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .profiles-list {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .profile-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 8px;
      border-radius: 6px;
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      border: 1px solid var(--divider-color);
      font-size: 12px;
      color: var(--primary-text-color);
    }
    .profile-chip.active {
      border-color: var(--tp-accent, var(--accent-color));
      background: color-mix(in srgb, var(--tp-accent, var(--accent-color)) 14%, transparent);
    }
    .profile-chip .badge {
      font-size: 10px;
      opacity: 0.75;
      background: color-mix(in srgb, var(--primary-text-color) 12%, transparent);
      padding: 1px 4px;
      border-radius: 4px;
    }
    .chip-action {
      background: transparent;
      border: none;
      color: var(--secondary-text-color);
      cursor: pointer;
      padding: 2px;
      font-size: 12px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.15s, background 0.15s;
    }
    .chip-action:hover {
      color: var(--primary-text-color);
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    }
    .save-profile-btn {
      background: color-mix(in srgb, var(--tp-accent, var(--accent-color)) 15%, transparent);
      color: var(--tp-accent, var(--accent-color));
      border: 1px solid color-mix(in srgb, var(--tp-accent, var(--accent-color)) 30%, transparent);
      border-radius: 6px;
      padding: 3px 10px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .save-profile-btn:hover {
      background: var(--tp-accent, var(--accent-color));
      color: white;
    }
  `],Ht([h({attribute:!1})],St.prototype,"hass",2),Ht([h({type:String})],St.prototype,"activeAreaId",2),Ht([b()],St.prototype,"_activeMode",2),Ht([b()],St.prototype,"_activeRange",2),Ht([b()],St.prototype,"_activeResolution",2),Ht([b()],St.prototype,"_loading",2),Ht([b()],St.prototype,"_motionData",2),Ht([b()],St.prototype,"_lightData",2),Ht([b()],St.prototype,"_profiles",2),Ht([b()],St.prototype,"_activeSource",2),Ht([b()],St.prototype,"_w",2),St=Ht([L("twilight-heatmap-card")],St);var vr=Object.defineProperty,br=Object.getOwnPropertyDescriptor,Ge=(t,e,i,a)=>{for(var s=a>1?void 0:a?br(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&vr(e,i,s),s};let $e=class extends B{constructor(){super(...arguments),this.hass=null,this._areaConfigs=[],this._activeAreaId=null,this._loading=!0}firstUpdated(t){super.firstUpdated(t),this._loadAreas()}updated(t){super.updated(t),t.has("hass")&&this.hass&&this._areaConfigs.length===0&&this._loadAreas()}async _loadAreas(){if(this.hass)try{const t=await oi(this.hass);this._areaConfigs=t,t.length>0&&!this._activeAreaId&&(this._activeAreaId=t[0].area_id)}catch(t){console.error("Failed to load areaConfigs for analytics",t)}finally{this._loading=!1}}render(){return this._loading?n`<div class="loading-state" style="padding: 24px; color: var(--secondary-text-color);">Loading areaConfigs…</div>`:n`
      <!-- Header Grid (1 Row, 12 columns, max 6 items) -->
      <div class="view-header-container">
        <div class="view-header-grid">
          <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
            <h2 style="margin:0; font-size:20px; font-weight:500; color:var(--primary-text-color);">Analytics</h2>
          </div>
          <div style="display: flex; align-items: center; justify-content: flex-end; gap: 12px; flex-shrink: 0;">
            ${this._areaConfigs.length>0?n`
              <select
                class="area-select"
                @change=${t=>this._activeAreaId=t.target.value}
              >
                ${this._areaConfigs.map(t=>n`
                  <option value="${t.area_id}" ?selected=${this._activeAreaId===t.area_id}>${t.name||t.area_id}</option>
                `)}
              </select>
            `:n`<span style="color:var(--secondary-text-color);font-size:13px">No areas configured</span>`}
          </div>
        </div>
      </div>

      <!-- Main Content Grid (12 columns) -->
      <div class="view-content-container">
        <div class="view-content-grid">
          ${this._areaConfigs.length===0?n`<div class="span-12 no-areaConfigs">No areaConfigs configured. Go to "Areas" tab to configure an area.</div>`:n`
              <div class="span-12">
                <twilight-heatmap-card
                  .hass=${this.hass}
                  .activeAreaId=${this._activeAreaId}
                ></twilight-heatmap-card>
              </div>
            `}
        </div>
      </div>
    `}};$e.styles=[Ve,P`
    :host {
      --dev-border: 1px dashed color-mix(in srgb, var(--primary-text-color, #fff) 25%, transparent);
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      min-height: 0;
      overflow: hidden;
      box-sizing: border-box;
      font-family: var(--font-family, inherit);
      padding: 0;
    }

    /* New two-tier 12-column grid layout */
    .view-header-grid {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 16px;
      align-items: center;
      box-sizing: border-box;
      width: 100%;
    }
    .view-header-grid h2 {
      line-height: 24px;
    }

    .view-content-container {
      padding: 24px;
      width: 100%;
      box-sizing: border-box;
      flex: 1;
      overflow-y: auto;
    }

    .view-content-grid {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 16px;
      align-items: stretch;
      align-content: start;
      box-sizing: border-box;
    }

    .span-2  { grid-column: span 2; min-width: 0; }
    .span-3  { grid-column: span 3; min-width: 0; }
    .span-4  { grid-column: span 4; min-width: 0; }
    .span-5  { grid-column: span 5; min-width: 0; }
    .span-6  { grid-column: span 6; min-width: 0; }
    .span-7  { grid-column: span 7; min-width: 0; }
    .span-8  { grid-column: span 8; min-width: 0; }
    .span-9  { grid-column: span 9; min-width: 0; }
    .span-12 { grid-column: span 12; min-width: 0; }

    @media (max-width: 768px) {
      .view-content-grid .span-2,
      .view-content-grid .span-3,
      .view-content-grid .span-4,
      .view-content-grid .span-5,
      .view-content-grid .span-6,
      .view-content-grid .span-7,
      .view-content-grid .span-8,
      .view-content-grid .span-9 {
        grid-column: span 12;
      }
      .view-header-grid {
        gap: 8px;
        text-align: left;
      }
    }

    .area-select {
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 15%, transparent));
      border-radius: 4px;
      padding: 4px 10px;
      font-size: 12px;
      cursor: pointer;
    }

    .no-areaConfigs {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px 0;
      color: var(--secondary-text-color);
      font-size: 14px;
    }
  `],Ge([h({attribute:!1})],$e.prototype,"hass",2),Ge([b()],$e.prototype,"_areaConfigs",2),Ge([b()],$e.prototype,"_activeAreaId",2),Ge([b()],$e.prototype,"_loading",2),$e=Ge([L("twilight-analytics-view")],$e);var mr=Object.defineProperty,_r=Object.getOwnPropertyDescriptor,lt=(t,e,i,a)=>{for(var s=a>1?void 0:a?_r(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&mr(e,i,s),s};const ui=50,fi=20,ba=0,ma=30,os=300;let tt=class extends B{constructor(){super(...arguments),this.hass=null,this.year=new Date().getFullYear(),this.selectedDate=new Date().toISOString().slice(0,10),this.clamped=!1,this.noHeader=!1,this.noAxisLabels=!1,this.showSlots=!1,this.noSolarNoonMidnight=!1,this.scatterMode=!1,this.sunData=null,this.hoverTime=null,this.hoverIdx=null,this.days=[],this.slotCurves=null,this.liveTime=null,this._loading=!1,this._w=0,this._ro=null}connectedCallback(){super.connectedCallback()}disconnectedCallback(){var t;(t=this._ro)==null||t.disconnect(),super.disconnectedCallback()}updated(t){var i;if(!this._ro){const a=(i=this.shadowRoot)==null?void 0:i.querySelector(".wrap");a&&(this._ro=new ResizeObserver(s=>{const o=s[0].contentRect.width;o>0&&o!==this._w&&(this._w=o,this._draw())}),this._ro.observe(a))}(t.has("hass")||t.has("year"))&&this.hass&&!this.days.length&&!this._loading&&this._load(),(t.has("days")||t.has("selectedDate")||t.has("clamped")||t.has("showSlots")||t.has("noSolarNoonMidnight")||t.has("scatterMode")||t.has("sunData")||t.has("hoverIdx")||t.has("liveTime")||t.has("slotCurves"))&&requestAnimationFrame(()=>this._draw())}async _load(){if(this.hass){this._loading=!0;try{const t=await Ts(this.hass,{year:this.year});this.days=t.days}catch(t){console.error("Year load failed",t)}finally{this._loading=!1}}}_getLiveTime(){const t=new Date;return t.getHours()*60+t.getMinutes()+t.getSeconds()/60}_todayIdx(){return this.days.findIndex(t=>t.date===new Date().toISOString().slice(0,10))}_interpolateEl(t){var e;return Hs(((e=this.sunData)==null?void 0:e.points)??[],t)}_draw(){var z;const t=(z=this.shadowRoot)==null?void 0:z.querySelector("canvas");if(!t)return;const e=this.days,i=e.length;if(!i||!this._w)return;const a=this._w,s=t.getBoundingClientRect().height||os,o=ji(t,a,s),r=this.noAxisLabels?10:ui,l=this.noAxisLabels?10:fi,c=this.noAxisLabels?10:ba,p=this.noAxisLabels?10:ma,u=a-r-l,g=s-c-p,d=c,f=c+g,v=r,y=r+u,w=1440,x=m=>d+g-Math.max(0,Math.min(w,m))/w*g;if(o.save(),o.beginPath(),o.roundRect(v,d,u,g,8),o.fillStyle=_t,o.fill(),o.restore(),o.save(),o.beginPath(),o.roundRect(v,d,u,g,8),o.clip(),this.scatterMode){const m=(O,j,S)=>{const M=e.map(k=>k[j]),V=e.map(k=>k[S]);o.strokeStyle=O,o.lineWidth=1;let I=[];const J=k=>{if(!k.length)return;o.beginPath();let st=!1,et=0,at=0,N=0;const ot=(W,Y)=>{o.moveTo(W,Y),st=!0,et=(Y-d)/g*w|0,at=W,N=Y},bt=(W,Y,it,ut)=>{const zt=Math.abs(it-et),K=Mt=>Mt>0&&Mt<i&&e[Mt].tz_offset!==e[Mt-1].tz_offset,Ce=K(ut)||K(ut-1)||K(ut+1);if(zt>120)ot(W,Y);else if(Ce&&zt>30){const Mt=(at+W)/2;o.lineTo(Mt,N),o.moveTo(Mt,Y),o.lineTo(W,Y),et=it,at=W,N=Y}else o.lineTo(W,Y),et=it,at=W,N=Y};for(const W of k){const Y=M[W];if(Y===null)continue;const it=v+W/(i-1)*u,ut=(Y%1440+1440)%1440,zt=x(ut);st?bt(it,zt,ut,W):ot(it,zt)}for(let W=k.length-1;W>=0;W--){const Y=k[W],it=V[Y];if(it===null)continue;const ut=v+Y/(i-1)*u,zt=(it%1440+1440)%1440,K=x(zt);st?bt(ut,K,zt,Y):ot(ut,K)}o.stroke()};for(let k=0;k<i;k++)M[k]!==null&&V[k]!==null?I.push(k):I.length&&(J(I),I=[]);I.length&&J(I)};m(Ut,"astro_dawn","astro_dusk"),m(Bt,"nautical_dawn","nautical_dusk"),m(Ft,"dawn","dusk"),m(ee,"sunrise","sunset")}else{const m=this.clamped,O=this.slotCurves,j=S=>m&&O?uo(e[S],O,S):e[S];for(let S=0;S<i;S++){const M=j(S),V=S>0?j(S-1):null,I=S===0?v:v+(S-.5)/(i-1)*u,k=(S===i-1?y:v+(S+.5)/(i-1)*u)-I+.5,st=m?Xi(M):Gi(M);if(st.length===0){o.fillStyle=Vi(M.midnight_el),o.fillRect(I,d,k,g);continue}const et=[...st];V&&Zi(et,V,M,m),et.sort((at,N)=>at.t-N.t),fo(o,I,k,et,Ki(V,M,m),x,w)}}const _=(m,O,j=1.5,S)=>{o.save(),o.strokeStyle=m,o.lineWidth=j,S&&(o.shadowColor=S,o.shadowBlur=8),o.beginPath();const M=I=>I===0?v:v+(I-.5)/(i-1)*u,V=I=>I===i-1?y:v+(I+.5)/(i-1)*u;for(let I=0;I<i;I++){const J=O[I];if(J===null)continue;const k=x((J%w+w)%w);o.moveTo(M(I),k),o.lineTo(V(I),k)}o.stroke(),o.restore()};if(this.noSolarNoonMidnight||(_("rgba(255,214,0,1)",e.map(m=>m.solar_noon),1.5,"rgba(255, 214, 0, 0.6)"),_("rgba(60,100,200,1)",e.map(m=>m.solar_midnight))),this.showSlots)if(this.slotCurves){const m=this.slotCurves;_("rgba(255,255,255,0.75)",m.civil_dusk??[]),_("rgba(255,255,255,0.60)",m.nautical_dusk??[]),_("rgba(255,255,255,0.45)",m.astro_dusk??[]),_("rgba(255,255,255,0.30)",m.night??[]),_("rgba(255,255,255,0.30)",m.astro_dawn??[]),_("rgba(255,255,255,0.45)",m.nautical_dawn??[]),_("rgba(255,255,255,0.60)",m.civil_dawn??[]),_("rgba(255,255,255,0.75)",m.gold_dawn??[]),_("rgba(255,255,255,0.75)",m.day??[]),_("rgba(255,255,255,0.75)",m.gold_dusk??[])}else _("rgba(255,255,255,0.75)",e.map(m=>m.slot_sunset)),_("rgba(255,255,255,0.60)",e.map(m=>m.slot_nautical_dusk)),_("rgba(255,255,255,0.45)",e.map(m=>m.slot_astro_dusk)),_("rgba(255,255,255,0.30)",e.map(m=>m.slot_night)),_("rgba(255,255,255,0.30)",e.map(m=>m.slot_astro_dawn)),_("rgba(255,255,255,0.45)",e.map(m=>m.slot_nautical_dawn)),_("rgba(255,255,255,0.60)",e.map(m=>m.slot_civil_dawn)),_("rgba(255,255,255,0.75)",e.map(m=>m.slot_sunrise)),_("rgba(255,255,255,0.75)",e.map(m=>m.slot_gold_dawn)),_("rgba(255,255,255,0.75)",e.map(m=>m.slot_day)),_("rgba(255,255,255,0.75)",e.map(m=>m.slot_gold_dusk));const D=this._todayIdx();if(D>=0){const m=v+D/(i-1)*u;o.save(),o.strokeStyle="rgba(255,255,255,0.55)",o.lineWidth=1.5,o.setLineDash([4,3]),o.beginPath(),o.moveTo(m,d),o.lineTo(m,f),o.stroke(),o.restore()}const T=this.days.findIndex(m=>m.date===this.selectedDate);if(T>=0&&T!==D){const m=v+T/(i-1)*u;o.save(),o.strokeStyle="rgba(255,255,255,0.4)",o.lineWidth=1,o.setLineDash([2,2]),o.beginPath(),o.moveTo(m,d),o.lineTo(m,f),o.stroke(),o.restore()}o.restore(),o.save(),o.beginPath(),o.roundRect(v,d,u,g,8),o.strokeStyle=js(this),o.lineWidth=1,o.stroke(),o.restore();const E=this.liveTime??this._getLiveTime();let C=T;if(C===-1&&(C=D),C>=0&&C<i){const m=v+C/(i-1)*u,O=x(E),j=this._interpolateEl(E);j>=0?Us(o,m,O):j>=-6?Fs(o,m,O):Bs(o,m,O)}o.restore()}_renderAxis(){var T;const t=this._w;if(!t)return Dt``;const e=(T=this.shadowRoot)==null?void 0:T.querySelector("canvas"),i=e&&e.getBoundingClientRect().height||os,a=this.noAxisLabels?10:ui,s=this.noAxisLabels?10:fi,o=this.noAxisLabels?10:ba,r=this.noAxisLabels?10:ma,l=t-a-s,c=i-o-r,p=o,u=o+c,g=E=>p+c-E/1440*c,d=this.days.length||365,f=Array.from({length:13},(E,C)=>C*2).map(E=>{const C=g(E*60),z=E%6===0&&E!==0&&E!==24,m=E!==0&&E!==24;return Dt`
        ${z&&!this.noAxisLabels?Dt`<text x=${a-6} y=${C} text-anchor="end" dominant-baseline="middle" class="axis-label" style="font: ${di(this)}">${String(E).padStart(1,"0")}:00</text>`:Dt``}
        ${m?Dt`<line x1=${a} y1=${C} x2=${a+l} y2=${C} class="grid-line" stroke-width="0.5" clip-path="url(#rect-clip)"/>`:Dt``}
      `}),v=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],y=[0,31,59,90,120,151,181,212,243,273,304,334],w=[15,45,74,105,135,166,196,227,258,288,319,349],x=v.map((E,C)=>{const z=a+Math.min(y[C],d-1)/(d-1)*l,m=a+Math.min(w[C],d-1)/(d-1)*l;return Dt`
        ${C>0?Dt`<line x1=${z} y1=${p} x2=${z} y2=${u} class="grid-line" stroke-width="0.5" clip-path="url(#rect-clip)"/>`:Dt``}
        ${this.noAxisLabels?Dt``:Dt`<text x=${m} y=${u+20} text-anchor="middle" class="axis-label" style="font: ${di(this)}">${E}</text>`}`}),_=this.hoverIdx!==null?this.days[this.hoverIdx]:null,D=_?a+this.hoverIdx/(d-1)*l:null;return Dt`
      <svg class="overlay" width="100%" height="100%">
        <defs>
          <clipPath id="rect-clip">
            <rect x=${a} y=${p} width=${l} height=${c} rx="8" ry="8" />
          </clipPath>
        </defs>
        ${f}
        ${x}
        ${D!==null&&_?Dt`
          <line x1=${D} y1=${p} x2=${D} y2=${u} stroke="rgba(255,255,255,0.28)" stroke-width="1" stroke-dasharray="3 3" clip-path="url(#rect-clip)"/>
        `:""}
      </svg>
    `}_onMove(t){if(!this._w)return;const e=t.currentTarget.getBoundingClientRect(),i=this.noAxisLabels?10:ui,a=this.noAxisLabels?10:fi,s=this._w-i-a,o=t.clientX-e.left;this.hoverIdx=Math.round(Math.max(0,Math.min(1,(o-i)/s))*(this.days.length-1));const r=this.days[this.hoverIdx];this.dispatchEvent(new CustomEvent("year-hover-changed",{detail:{index:this.hoverIdx,date:r?r.date:null},bubbles:!0,composed:!0}))}_onLeave(){this.hoverIdx=null,this.dispatchEvent(new CustomEvent("year-hover-changed",{detail:{index:null,date:null},bubbles:!0,composed:!0}))}_onClick(){if(this.hoverIdx!==null&&this.days[this.hoverIdx]){const t=this.days[this.hoverIdx].date;this.dispatchEvent(new CustomEvent("date-selected",{detail:t,bubbles:!0,composed:!0}))}}_onTouchMove(t){if(!this._w)return;const e=t.touches[0],i=t.currentTarget.getBoundingClientRect(),a=this.noAxisLabels?10:ui,s=this.noAxisLabels?10:fi,o=this._w-a-s,r=e.clientX-i.left;this.hoverIdx=Math.round(Math.max(0,Math.min(1,(r-a)/o))*(this.days.length-1));const l=this.days[this.hoverIdx];this.dispatchEvent(new CustomEvent("year-hover-changed",{detail:{index:this.hoverIdx,date:l?l.date:null},bubbles:!0,composed:!0}))}_onTouchEnd(){this.hoverIdx=null,this.dispatchEvent(new CustomEvent("year-hover-changed",{detail:{index:null,date:null},bubbles:!0,composed:!0}))}render(){return n`
      ${this.noHeader?"":n`
        <div class="card-header">
          <span class="card-dot" style="--dot-color: #f59e0b;"></span>
          <span class="card-title">Year overview</span>
        </div>
      `}
      <div class="wrap">
        ${this._loading?n`<div class="loading"><ha-circular-progress active size="small"></ha-circular-progress></div>`:n`
            <canvas></canvas>
            ${this._renderAxis()}
            <div class="hit-area"
              @mousemove=${this._onMove}
              @mouseleave=${this._onLeave}
              @click=${this._onClick}
              @touchstart=${this._onTouchMove}
              @touchmove=${this._onTouchMove}
              @touchend=${this._onTouchEnd}
            ></div>
          `}
      </div>
    `}};tt.styles=[Zt,P`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      min-height: 0;
      box-sizing: border-box;
      font-family: var(--font-family, inherit);
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      overflow: clip;
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px 12px;
    }
    .card-dot {
      margin-left: 3px;
    }
    .card-title {
      flex: 1;
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
      margin-left: 3px;
    }
    .wrap {
      position: relative;
      flex: 1;
      min-height: 0;
      min-width: 0;
    }
    canvas {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: crosshair;
    }
    svg.overlay {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      overflow: visible;
    }
    svg.overlay text.axis-label {
      fill: var(--primary-text-color, rgba(255, 255, 255, 0.65));
    }
    svg.overlay line.grid-line {
      stroke: rgba(255, 255, 255, 0.15);
    }
    .hit-area {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      cursor: crosshair;
      z-index: 2;
    }
    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 13px;
      color: rgba(255,255,255,0.4);
    }
  `],lt([h({attribute:!1})],tt.prototype,"hass",2),lt([h({type:Number})],tt.prototype,"year",2),lt([h({type:String})],tt.prototype,"selectedDate",2),lt([h({type:Boolean})],tt.prototype,"clamped",2),lt([h({type:Boolean})],tt.prototype,"noHeader",2),lt([h({type:Boolean})],tt.prototype,"noAxisLabels",2),lt([h({type:Boolean})],tt.prototype,"showSlots",2),lt([h({type:Boolean})],tt.prototype,"noSolarNoonMidnight",2),lt([h({type:Boolean})],tt.prototype,"scatterMode",2),lt([h({attribute:!1})],tt.prototype,"sunData",2),lt([h({attribute:!1})],tt.prototype,"hoverTime",2),lt([h({type:Number})],tt.prototype,"hoverIdx",2),lt([h({attribute:!1})],tt.prototype,"days",2),lt([h({attribute:!1})],tt.prototype,"slotCurves",2),lt([h({type:Number})],tt.prototype,"liveTime",2),lt([b()],tt.prototype,"_loading",2),lt([b()],tt.prototype,"_w",2),tt=lt([L("twilight-sun-year-card")],tt);var xr=Object.defineProperty,yr=Object.getOwnPropertyDescriptor,Z=(t,e,i,a)=>{for(var s=a>1?void 0:a?yr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&xr(e,i,s),s};const rs=[{name:"North Pole",lat:90,lon:0,tz:"UTC"},{name:"Qaanaaq",lat:77.47,lon:-69.23,tz:"America/Thule"},{name:"Reykjavík",lat:64.13,lon:-21.9,tz:"Atlantic/Reykjavik"},{name:"Helsinki",lat:60.17,lon:24.94,tz:"Europe/Helsinki"},{name:"Hamburg",lat:53.55,lon:9.99,tz:"Europe/Berlin"},{name:"Paris",lat:48.85,lon:2.35,tz:"Europe/Paris"},{name:"New York",lat:40.71,lon:-74.01,tz:"America/New_York"},{name:"Tokyo",lat:35.68,lon:139.69,tz:"Asia/Tokyo"},{name:"Cairo",lat:30.05,lon:31.24,tz:"Africa/Cairo"},{name:"Honolulu",lat:21.31,lon:-157.86,tz:"Pacific/Honolulu"},{name:"Equator",lat:0,lon:0,tz:"UTC"},{name:"Nairobi",lat:-1.29,lon:36.82,tz:"Africa/Nairobi"},{name:"Santiago",lat:-33.45,lon:-70.67,tz:"America/Santiago"},{name:"Cape Town",lat:-33.93,lon:18.42,tz:"Africa/Johannesburg"},{name:"Auckland",lat:-36.85,lon:174.76,tz:"Pacific/Auckland"},{name:"Ushuaia",lat:-54.8,lon:-68.3,tz:"America/Argentina/Ushuaia"},{name:"McMurdo Station",lat:-77.85,lon:166.67,tz:"Pacific/Auckland"},{name:"South Pole",lat:-90,lon:0,tz:"UTC"}],_a=[10,25,50,100,250];let X=class extends B{constructor(){super(...arguments),this.hass=null,this._days=[],this._year=new Date().getFullYear(),this._loading=!1,this._error="",this._hoverIdx=null,this._selectedDate=new Date().toISOString().slice(0,10),this._sunData=null,this._hoverTime=null,this._scrubbing=!1,this._isDark=!1,this._demoLocationIdx=-1,this._demoPlaying=!1,this._demoDayIdx=0,this._demoSpeed=_a[2]||50,this._clamped=!1,this._showSlots=!1,this._slotCurves=null,this._areas=[],this._selectedAreaId=null,this._channelSlotsMap=void 0,this._updateInterval=null,this._demoInterval=null,this._dayCache=new Map,this._channelSlotsCache=new Map,this._lastLoadDayTime=0,this._loadDayTimeout=null}connectedCallback(){super.connectedCallback(),this._updateInterval=window.setInterval(()=>{this._scrubbing||this.requestUpdate()},1e3)}disconnectedCallback(){this._updateInterval&&clearInterval(this._updateInterval),this._stopDemo(),this._loadDayTimeout&&(clearTimeout(this._loadDayTimeout),this._loadDayTimeout=null),super.disconnectedCallback()}updated(t){if(t.has("hass")&&this.hass){const e=Xs(this.hass,this);e!==this._isDark&&(this._isDark=e,this.toggleAttribute("dark",e))}t.has("hass")&&this.hass&&!this._areas.length&&this._loadAreas(),t.has("hass")&&this.hass&&!this._days.length&&!this._loading&&this._loadYear(),t.has("_selectedDate")&&this.hass&&this._selectedDate&&this._loadDay()}async _loadAreas(){if(this.hass)try{this._areas=await oi(this.hass)}catch(t){console.error("Failed to load areas for timeline view",t)}}_locParams(){const t=rs[this._demoLocationIdx];return t?{lat:t.lat,lon:t.lon,tz:t.tz}:{}}async _loadYear(){var t;if(this.hass){this._loading=!0,this._error="";try{const[e,i]=await Promise.all([Ts(this.hass,{year:this._year,...this._locParams()}),io(this.hass,{year:this._year,...this._locParams(),area_id:this._selectedAreaId??void 0}).catch(()=>null)]);this._days=e.days,this._year=e.year,this._slotCurves=(i==null?void 0:i.curves)??null;const a=new Date().toISOString().slice(0,10);this._selectedDate=this._days.some(s=>s.date===a)?a:((t=this._days[0])==null?void 0:t.date)??a}catch(e){this._error=e instanceof Error?e.message:String(e)}finally{this._loading=!1}}}_loadDay(){this._loadDayTimeout&&(clearTimeout(this._loadDayTimeout),this._loadDayTimeout=null);const t=`${this._demoLocationIdx}_${this._selectedAreaId}_${this._selectedDate}`;if(this._demoPlaying&&this._dayCache.has(t)){this._sunData=this._dayCache.get(t),this._channelSlotsMap=this._channelSlotsCache.get(t);return}if(this._dayCache.has(t)){this._sunData=this._dayCache.get(t),this._channelSlotsMap=this._channelSlotsCache.get(t);return}const i=Date.now()-this._lastLoadDayTime,a=10;i>=a?this._executeLoadDay():this._loadDayTimeout=window.setTimeout(()=>{this._executeLoadDay()},a-i)}async _executeLoadDay(){if(!this.hass||!this._selectedDate)return;this._lastLoadDayTime=Date.now();const t=this._selectedDate,e=`${this._demoLocationIdx}_${this._selectedAreaId}_${t}`;try{const i=await Ui(this.hass,{date:t,...this._locParams()});this._dayCache.set(e,i),this._selectedDate===t&&(this._sunData=i)}catch{this._selectedDate===t&&(this._sunData=null)}await this._loadChannelSlots(t)}async _loadChannelSlots(t){if(!this.hass||!this._selectedAreaId){this._channelSlotsMap=void 0;return}const e=this._areas.find(s=>s.area_id===this._selectedAreaId);if(!e){this._channelSlotsMap=void 0;return}const i=`${this._demoLocationIdx}_${this._selectedAreaId}_${t}`,a=Object.entries(Q(e));try{const s=await Promise.all(a.map(([,r])=>Bi(this.hass,{slots:r.slots||[],date:t}))),o={};a.forEach(([r,l],c)=>{o[r]=qe(s[c].slots,l.slots||[])}),this._channelSlotsCache.set(i,o),this._selectedDate===t&&(this._channelSlotsMap=o)}catch(s){console.error("Failed to load channel slots for timeline area selection",s),this._selectedDate===t&&(this._channelSlotsMap=void 0)}}_stopDemo(){this._demoInterval&&(clearInterval(this._demoInterval),this._demoInterval=null),this._demoPlaying=!1}_toggleDemo(){if(this._demoPlaying){this._stopDemo();return}this._demoPlaying=!0,this._demoDayIdx=0,this._advanceDemoDay(),this._demoInterval=window.setInterval(()=>this._advanceDemoDay(),this._demoSpeed)}_changeDemoSpeed(t){this._demoSpeed=t,this._demoPlaying&&(this._demoInterval&&clearInterval(this._demoInterval),this._demoInterval=window.setInterval(()=>this._advanceDemoDay(),this._demoSpeed))}_advanceDemoDay(){if(!this._days.length)return;const t=Math.min(this._demoDayIdx,this._days.length-1);this._selectedDate=this._days[t].date,this._demoDayIdx++,this._demoDayIdx>=this._days.length&&this._stopDemo()}async _selectLocation(t){this._stopDemo(),this._demoLocationIdx=t,t!==-1&&(this._selectedAreaId=null),this._days=[],this._sunData=null,await this._loadYear(),await this._loadDay()}async _selectArea(t){this._stopDemo(),this._selectedAreaId=t,t!==null&&(this._demoLocationIdx=-1),this._days=[],this._sunData=null,await this._loadYear(),await this._loadDay()}_toggleClamped(){this._clamped=!this._clamped}_toggleSlots(){this._showSlots=!this._showSlots}_fmt(t){if(t===null)return"—";const e=Math.round((t%1440+1440)%1440),i=Math.floor(e/60)%24,a=e%60;return`${String(i).padStart(2,"0")}:${String(a).padStart(2,"0")}`}_fmtDur(t){if(t===null||t<0)return"—";const e=Math.floor(t/60),i=Math.round(t%60);return e>0&&i>0?`${e}h ${i}min`:e>0?`${e}h`:`${i}min`}_getLiveTime(){var a,s,o;const t=rs[this._demoLocationIdx],e=(t==null?void 0:t.tz)??void 0,i=new Date;if(e){const r=new Intl.DateTimeFormat("en-GB",{timeZone:e,hour:"numeric",minute:"numeric",second:"numeric",hour12:!1}).formatToParts(i),l=Number(((a=r.find(u=>u.type==="hour"))==null?void 0:a.value)??0),c=Number(((s=r.find(u=>u.type==="minute"))==null?void 0:s.value)??0),p=Number(((o=r.find(u=>u.type==="second"))==null?void 0:o.value)??0);return l*60+c+p/60}return i.getHours()*60+i.getMinutes()}_interpolateSun(t){var u;if(!((u=this._sunData)!=null&&u.points.length))return{elevation:0,azimuth:0};const e=this._sunData.points;let i=0,a=e.length-1;for(;i<a-1;){const g=i+a>>1;e[g].time<=t?i=g:a=g}const s=e[i],o=e[a];if(!s)return{elevation:0,azimuth:0};if(s===o||o.time===s.time)return{elevation:s.elevation,azimuth:s.azimuth};const r=(t-s.time)/(o.time-s.time),l=s.elevation+(o.elevation-s.elevation)*r;let c=s.azimuth,p=o.azimuth;return Math.abs(p-c)>180&&(p<c?p+=360:c+=360),{elevation:l,azimuth:(c+(p-c)*r)%360}}_phaseName(t){return t>=0?"Day":t>=-6?"Civil twilight":t>=-12?"Nautical twilight":t>=-18?"Astronomical twilight":"Night"}_phaseClass(t){return t>=0?"phase-day":t>=-6?"phase-civil":t>=-12?"phase-naut":t>=-18?"phase-astro":"phase-night"}render(){const t=new Date().toISOString().slice(0,10),e=this._hoverIdx!==null?this._days[this._hoverIdx]:null,i=this._days.findIndex(f=>f.date===this._selectedDate),a=i>=0?this._days[i]:this._days.length?this._days[0]:null,s=e??a,o=e?e.date:this._selectedDate,r=this._hoverTime??this._getLiveTime(),{elevation:l,azimuth:c}=this._interpolateSun(r),p=Math.round(r),u=`${String(Math.floor(p/60)%24).padStart(2,"0")}:${String(p%60).padStart(2,"0")}`,g=this._selectedAreaId?this._areas.find(f=>f.area_id===this._selectedAreaId):null,d=g?this._channelSlotsMap:void 0;return n`
    <!-- Header Grid (1 Row, 12 columns, max 6 items) -->
    <div class="view-header-container">
      <div class="view-header-grid">
        <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 500;">Twilight Timeline</h2>
          <span class="year-label">${this._year}</span>
        </div>
        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px; flex-shrink: 0;">
          <select class="demo-select" style="width: auto;"
            ?disabled=${this._demoLocationIdx!==-1}
            @change=${f=>{const v=f.target.value;this._selectArea(v===""?null:v)}}>
            <option value="" ?selected=${this._selectedAreaId===null}>Area Default</option>
            ${this._areas.map(f=>n`
              <option value=${f.area_id} ?selected=${this._selectedAreaId===f.area_id}>${f.name||f.area_id}</option>
            `)}
          </select>

          <div class="zone-toggle" style="margin-right: 8px;" role="group" aria-label="Zone visualisation mode">
            <button class=${this._showSlots?"active":""}
              title="Toggle slot lines (on/off)"
              @click=${this._toggleSlots}>Lines</button>
            <button class=${this._clamped?"active":""}
              title="Toggle slot-adjusted fields (on/off)"
              @click=${this._toggleClamped}>Fields</button>
          </div>

          <select class="demo-select" style="width: auto;"
            ?disabled=${this._selectedAreaId!==null}
            @change=${f=>this._selectLocation(Number(f.target.value))}>
            <option value="-1" ?selected=${this._demoLocationIdx===-1}>HA Home</option>
            ${rs.map((f,v)=>n`
              <option value=${v} ?selected=${this._demoLocationIdx===v}>${f.name} (${f.lat>0?"+":""}${f.lat}°)</option>
            `)}
          </select>

          <button class="demo-play ${this._demoPlaying?"playing":""}" style="width: 36px; min-width: 36px;"
            title=${this._demoPlaying?"Stop":"Play year"}
            @click=${()=>this._toggleDemo()}>
            ${this._demoPlaying?"⏹":"▶"}
          </button>

          <select class="demo-select" style="width: 80px;"
            @change=${f=>this._changeDemoSpeed(Number(f.target.value))}>
            ${_a.map(f=>n`
              <option value=${String(f)} ?selected=${this._demoSpeed===f}>${f} ms</option>
            `)}
          </select>
        </div>
        ${this._error?n`<div class="span-12 error">${this._error}</div>`:""}
      </div>
    </div>

    ${!this._loading&&this._days.length?n`
      <!-- Main Content Grid (12 columns) -->
      <div class="view-content-container">
        <div class="view-content-grid">
          <!-- Left: stacked canvases (span-9) -->
          <div class="span-9">
            <div class="day-wrap">
              <twilight-sun-path-card
                .hass=${this.hass}
                .date=${this._selectedDate}
                .clamped=${this._clamped}
                .showSlots=${this._showSlots}
                .primaryOnly=${!0}
                .noSolarNoonMidnight=${!1}
                .days=${this._days}
                .sunData=${this._sunData}
                .channelSlotsMap=${d}
                .channels=${g?Q(g):{}}
                .hoverTime=${this._hoverTime}
                .liveTime=${this._getLiveTime()}
                .noHeader=${!1}
                .noAxisLabels=${!1}
                @time-hover-changed=${f=>{this._hoverTime=f.detail.hoverTime,this._scrubbing=f.detail.scrubbing}}
              ></twilight-sun-path-card>
            </div>
            <div class="year-wrap">
              <twilight-sun-year-card
                .hass=${this.hass}
                .days=${this._days}
                .slotCurves=${this._slotCurves}
                .selectedDate=${this._selectedDate}
                .clamped=${this._clamped}
                .showSlots=${this._showSlots}
                .noSolarNoonMidnight=${!1}
                .sunData=${this._sunData}
                .hoverTime=${this._hoverTime}
                .hoverIdx=${this._hoverIdx}
                .liveTime=${this._getLiveTime()}
                .noHeader=${!1}
                .noAxisLabels=${!1}
                @date-selected=${f=>this._selectedDate=f.detail}
                @year-hover-changed=${f=>this._hoverIdx=f.detail.index}
              ></twilight-sun-year-card>
            </div>
          </div>

          <!-- Right: info panel (span-3) -->
          ${s?n`
            <div class="span-3">
              <div class="info-panel">
                <div class="info-date">
                  ${o===t?"Today":e?"Browse":"Selected"}
                  <span>${o}</span>
                </div>

                ${this._sunData?n`
                  <div class="info-section">Live</div>
                  <div class="info-row">
                    <span class="info-label">Time</span>
                    <span class="info-value">${u}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Phase</span>
                    <span class="info-value"><span class="phase-badge ${this._phaseClass(l)}">${this._phaseName(l)}</span></span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Elevation</span>
                    <span class="info-value">${l.toFixed(1)}°</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Azimuth</span>
                    <span class="info-value">${c.toFixed(1)}°</span>
                  </div>
                `:""}

                <div class="info-section">Sun times</div>
                <div class="info-row"><span class="info-label">Solar Noon</span>
                  <span class="info-value noon">${this._fmt(s.solar_noon)}</span></div>
                <div class="info-row"><span class="info-label">Solar Midnight</span>
                  <span class="info-value midnight">${this._fmt(s.solar_midnight)}</span></div>
                <div class="info-row"><span class="info-label">Sunrise / Sunset</span>
                  <span class="info-value">${this._fmt(s.sunrise)} / ${this._fmt(s.sunset)}</span></div>
                ${(()=>{const f=x=>x!==null?(x%1440+1440)%1440:null,y=((x,_)=>{const D=f(x),T=f(_);if(D===null||T===null)return null;let E=T-D;return E<0&&(E+=1440),E})(s.sunrise,s.sunset),w=y!==null?1440-y:null;return n`
                  <div class="info-row"><span class="info-label">Day length</span>
                    <span class="info-value">${this._fmtDur(y)}</span></div>
                  <div class="info-row"><span class="info-label">Night length</span>
                    <span class="info-value" style="color:var(--secondary-text-color)">${this._fmtDur(w)}</span></div>`})()}

                <div class="info-section">Twilight</div>
                <div class="info-row"><span class="info-label">Day</span>
                  <span class="info-value">
                    ${(()=>{const f=s.slot_day??s.sunrise,v=s.slot_gold_dusk??s.sunset;return f!==null&&v!==null?`${this._fmt(f)}–${this._fmt(v)}`:"—"})()}
                  </span></div>
                <div class="info-row"><span class="info-label">Civil</span>
                  <span class="info-value">${this._fmt(s.sunrise)} / ${this._fmt(s.sunset)}</span></div>
                <div class="info-row"><span class="info-label">Nautical</span>
                  <span class="info-value">${this._fmt(s.dawn)} / ${this._fmt(s.dusk)}</span></div>
                <div class="info-row"><span class="info-label">Astronomical</span>
                  <span class="info-value">${this._fmt(s.nautical_dawn)} / ${this._fmt(s.nautical_dusk)}</span></div>
                <div class="info-row"><span class="info-label">Night</span>
                  <span class="info-value">${this._fmt(s.astro_dusk)} / ${this._fmt(s.astro_dawn)}</span></div>
                <div class="info-row"><span class="info-label">Golden hour</span>
                  <span class="info-value">${this._fmt(s.slot_gold_dawn)} / ${this._fmt(s.slot_gold_dusk)}</span></div>

                <div class="info-section legend-section">Legend</div>
                ${[[_t,"Night"],[Ut,"Astronomical twilight"],[Bt,"Nautical twilight"],[Ft,"Civil twilight"],[Ye,"Golden hour"],[ee,"Daylight"]].map(([f,v])=>n`
                  <div class="legend-item">
                    <div class="legend-swatch" style="background:${f}"></div>
                    ${v}
                  </div>`)}
                ${[["#d2dce8","Civil dusk / Daylight"],["#aeb9c9","Nautical dusk / Civil dawn"],["#8792a2","Astro dusk / Nautical dawn"],["#5e6572","Night / Astro dawn"]].map(([f,v])=>n`
                  <div class="legend-item">
                    <div class="legend-swatch" style="background:${f}; height:5px; border-radius:1.5px; border:1px solid color-mix(in srgb, var(--primary-text-color, #fff) 15%, transparent); box-sizing:border-box;"></div>
                    ${v}
                  </div>`)}
              </div>
            </div>
          `:""}
        </div>
      </div>
    `:""}
    `}};X.styles=[Ve,P`
    :host {
      --dev-border: 0px dashed color-mix(in srgb, var(--primary-text-color, #fff) 25%, transparent);
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      min-height: 0;
      overflow: hidden;
      box-sizing: border-box;
      font-family: var(--font-family, inherit);
      background: transparent;
      padding: 0;
    }

    /* New two-tier 12-column grid layout */
    .view-header-grid {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-sizing: border-box;
      width: 100%;
      min-width: max-content;
    }
    .view-header-grid h2 {
      line-height: 24px;
      white-space: nowrap;
    }

    .view-content-container {
      padding: 24px;
      width: 100%;
      box-sizing: border-box;
      flex: 1;
      overflow-y: auto;
    }

    .view-content-grid {
      display: flex;
      flex-direction: row;
      gap: 16px;
      align-items: stretch;
      box-sizing: border-box;
      width: 100%;
    }

    .view-content-grid .span-9 {
      flex: 9;
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 0;
      min-height: 0;
    }

    .view-content-grid .span-3 {
      flex: 3;
      min-width: 300px;
    }

    .view-content-grid .day-wrap {
      height: 280px;
      flex-shrink: 0;
    }

    .view-content-grid .year-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .span-2  { grid-column: span 2; min-width: 0; }
    .span-3  { grid-column: span 3; min-width: 0; }
    .span-4  { grid-column: span 4; min-width: 0; }
    .span-5  { grid-column: span 5; min-width: 0; }
    .span-6  { grid-column: span 6; min-width: 0; }
    .span-7  { grid-column: span 7; min-width: 0; }
    .span-8  { grid-column: span 8; min-width: 0; }
    .span-9  { grid-column: span 9; min-width: 0; }
    .span-12 { grid-column: span 12; min-width: 0; }

    @media (max-width: 1024px) {
      .view-content-grid {
        flex-direction: column;
        align-items: stretch;
      }
      .view-content-grid .span-9,
      .view-content-grid .span-3 {
        flex: none;
        width: 100%;
      }
      .view-content-grid .year-wrap {
        flex: none;
        height: 380px;
      }
      .span-2, .span-3, .span-4, .span-5, .span-6, .span-7, .span-8, .span-9 {
        grid-column: span 12;
      }
      .view-header-grid {
        gap: 12px;
      }
      .view-header-grid .demo-controls {
        grid-column: span 12;
        margin-left: 0 !important;
        flex-wrap: wrap;
      }
    }


    /* ── Right: info panel ──────────────────────────────────── */
    .info-panel {
      display: flex;
      flex-direction: column;
      padding: 20px;
      gap: 0;
      overflow-y: auto;
      min-width: 0;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
    }

    .info-date {
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 600;
      font-variant: small-caps;
      text-align: center;
    }
    .info-date span {
      color: var(--secondary-text-color);
      display: block;
      font-size: 13px;
      font-weight: 400;
      margin-top: 2px;
    }

    .info-section {
      border-bottom: 1px solid color-mix(in srgb, var(--primary-text-color, #fff) 15%, transparent);
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1.5px;
      margin: 14px 0 4px;
      padding-bottom: 4px;
      text-transform: uppercase;
    }
    .info-section:first-of-type { margin-top: 4px; }

    .info-row {
      align-items: center;
      display: flex;
      font-size: 13px;
      justify-content: space-between;
      padding: 2px 0px;
    }
    .info-label {
      color: var(--secondary-text-color);
      font-weight: 300;
    }
    .info-value {
      color: var(--primary-text-color);
      font-weight: 500;
    }

    /* Legend inside info panel */
    .legend-section { margin-top: 16px; }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 13px;
      color: var(--secondary-text-color);
      padding: 3px 0;
    }
    .legend-swatch {
      width: 12px; height: 12px;
      border-radius: 2px;
      flex-shrink: 0;
      border: 1px solid color-mix(in srgb, var(--primary-text-color, #fff) 15%, transparent);
      box-sizing: border-box;
    }

    /* Phase badge */
    .phase-badge {
      display: inline-block;
      padding: 1px 7px;
      border-radius: 9px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      font-family: inherit;
    }
    .phase-day   { background: rgba(122, 184, 212, 0.15); color: #7ab8d4; border: 1px solid rgba(122, 184, 212, 0.3); }
    .phase-civil { background: rgba(70, 104, 144, 0.18);  color: #7ab8d4; border: 1px solid rgba(70, 104, 144, 0.35); }
    .phase-naut  { background: rgba(52, 80, 122, 0.25);   color: #8bb3e8; border: 1px solid rgba(52, 80, 122, 0.45); }
    .phase-astro { background: rgba(37, 58, 90, 0.35);    color: #a4c5f0; border: 1px solid rgba(37, 58, 90, 0.55); }
    .phase-night { background: rgba(13, 15, 24, 0.5);     color: #5b6f8a; border: 1px solid color-mix(in srgb, var(--primary-text-color) 12%, transparent); }

    /* Phase badge - Light Theme overrides */
    :host:not([dark]) .phase-day   { background: rgba(122, 184, 212, 0.12); color: #2b7396; border: 1px solid rgba(122, 184, 212, 0.4); }
    :host:not([dark]) .phase-civil { background: rgba(70, 104, 144, 0.12);  color: #284d7a; border: 1px solid rgba(70, 104, 144, 0.4); }
    :host:not([dark]) .phase-naut  { background: rgba(52, 80, 122, 0.12);   color: #1a3d6c; border: 1px solid rgba(52, 80, 122, 0.4); }
    :host:not([dark]) .phase-astro { background: rgba(37, 58, 90, 0.12);    color: #172b49; border: 1px solid rgba(37, 58, 90, 0.4); }
    :host:not([dark]) .phase-night { background: rgba(0, 0, 0, 0.05);       color: #2d3748; border: 1px solid rgba(0, 0, 0, 0.15); }

    /* Solar Noon & Midnight colors */
    .noon {
      color: #ffb300;
    }
    .midnight {
      color: #8bb3e8;
    }
    :host:not([dark]) .noon {
      color: #b25e00;
    }
    :host:not([dark]) .midnight {
      color: #1a5ea8;
    }

    /* ── Demo controls ──────────────────────────────────────── */
    .demo-select {
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 15%, transparent));
      border-radius: 4px;
      padding: 3px 8px;
      font-size: 12px;
      cursor: pointer;
      max-width: 130px;
    }
    .demo-select:focus { outline: none; border-color: var(--accent-color, #e91e8c); }
    .demo-play {
      background: transparent;
      color: var(--secondary-text-color);
      border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 12%, transparent));
      border-radius: 4px;
      padding: 3px 10px;
      font-size: 13px;
      cursor: pointer;
      line-height: 1;
    }
    .demo-play:hover { background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); color: var(--primary-text-color); }
    .demo-play.playing { border-color: var(--accent-color, #e91e8c); color: var(--accent-color, #e91e8c); }

    /* ── Zone-mode toggle (Phase 7) ───────────────────────────── */
    .zone-toggle {
      display: inline-flex;
      align-items: center;
      border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 12%, transparent));
      border-radius: 4px;
      overflow: hidden;
    }
    .zone-toggle button {
      background: transparent;
      color: var(--secondary-text-color);
      border: 0;
      border-left: 1px solid color-mix(in srgb, var(--primary-text-color, #fff) 15%, transparent);
      padding: 3px 9px;
      font-size: 11px;
      letter-spacing: 0.3px;
      cursor: pointer;
      line-height: 1;
      text-transform: uppercase;
    }
    .zone-toggle button:first-child { border-left: 0; }
    .zone-toggle button:hover { background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); color: var(--primary-text-color); }
    .zone-toggle button.active {
      background: color-mix(in srgb, var(--primary-text-color) 12%, transparent);
      color: var(--accent-color, #e91e8c);
    }

    .demo-location-badge {
      font-size: 11px;
      color: var(--accent-color, #e91e8c);
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .error { color: var(--error-color, #f44336); font-size: 13px; }
  `],Z([h({attribute:!1})],X.prototype,"hass",2),Z([b()],X.prototype,"_days",2),Z([b()],X.prototype,"_year",2),Z([b()],X.prototype,"_loading",2),Z([b()],X.prototype,"_error",2),Z([b()],X.prototype,"_hoverIdx",2),Z([b()],X.prototype,"_selectedDate",2),Z([b()],X.prototype,"_sunData",2),Z([b()],X.prototype,"_hoverTime",2),Z([b()],X.prototype,"_scrubbing",2),Z([b()],X.prototype,"_isDark",2),Z([b()],X.prototype,"_demoLocationIdx",2),Z([b()],X.prototype,"_demoPlaying",2),Z([b()],X.prototype,"_demoDayIdx",2),Z([b()],X.prototype,"_demoSpeed",2),Z([b()],X.prototype,"_clamped",2),Z([b()],X.prototype,"_showSlots",2),Z([b()],X.prototype,"_slotCurves",2),Z([b()],X.prototype,"_areas",2),Z([b()],X.prototype,"_selectedAreaId",2),Z([b()],X.prototype,"_channelSlotsMap",2),X=Z([L("twilight-timeline-view")],X);var wr=Object.defineProperty,$r=Object.getOwnPropertyDescriptor,re=(t,e,i,a)=>{for(var s=a>1?void 0:a?$r(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&wr(e,i,s),s};let Xt=class extends ce{constructor(){super(...arguments),this.open=!1,this.isDraftDirty=!1,this._loading=!1,this._error="",this._resetDialogOpen=!1,this._resetNodes=[],this._resetDefaults=null,this.dialog=new xe(this),this._onClose=()=>{this._error="",this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))},this._onTriggerFileInput=()=>{var e;if(this.isDraftDirty){this.dialog.showAlert("Unsaved Changes","Please save or discard your unsaved settings changes before restoring from a backup.");return}const t=(e=this.shadowRoot)==null?void 0:e.querySelector("#restoreFileInput");t==null||t.click()}}async _onDownloadBackup(){if(this.hass)try{this._loading=!0,this._error="";const t=await to(this.hass),e=new Date,i=`twilight-backup-${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}.json`,a=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),s=URL.createObjectURL(a),o=document.createElement("a");o.href=s,o.download=i,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(s)}catch(t){this._error=t instanceof Error?t.message:"Failed to export backup"}finally{this._loading=!1}}async _onFileSelected(t){var a;const e=t.target,i=(a=e.files)==null?void 0:a[0];if(!(!i||!this.hass)){e.value="";try{this._loading=!0,this._error="";const s=await i.text();let o;try{o=JSON.parse(s)}catch{await this.dialog.showAlert("Invalid Backup File","The selected file is not valid JSON.");return}if(!o||typeof o!="object"||!o.areas||typeof o.areas!="object"){await this.dialog.showAlert("Invalid Backup File","This file does not appear to be a valid Twilight backup structure.");return}const r=Object.keys(o.areas).length;if(!await this.dialog.showConfirm("Restore Backup",`This will replace ALL areas and global settings with the contents of this backup file (${r} area(s)). Areas not included in this file will be deleted. This action cannot be undone.

Are you sure you want to proceed?`))return;await Es(this.hass,o),await this.dialog.showAlert("Restore Complete","Backup restored successfully. The panel will now reload."),window.location.reload()}catch(s){this._error=s instanceof Error?s.message:"Failed to restore backup"}finally{this._loading=!1}}}async _onResetSettings(){if(this.hass){if(this.isDraftDirty){await this.dialog.showAlert("Unsaved Changes","Please save or discard your unsaved settings changes before resetting settings.");return}try{this._loading=!0,this._error="";const t=await eo(this.hass);this._resetDefaults=t;const e=t.area_template||{};this._resetNodes=[{id:"template_inputs",label:"Area Template: Inputs",children:(e.inputs||[]).map(i=>{const a=(e.activities||[]).find(s=>s.id===i.activity);return{id:`template_inputs:${i.id}`,label:`${At(i,this.hass)} — ${(a==null?void 0:a.name)||(a==null?void 0:a.id)||i.activity}`}})},{id:"template_activities",label:"Area Template: Activities",children:(e.activities||[]).map(i=>({id:`template_activities:${i.id}`,label:i.name||i.id}))},{id:"template_channels",label:"Area Template: Custom Channels",children:Object.entries(e.custom_channels||{}).map(([i,a])=>({id:`template_channels:${i}`,label:a.name||i}))},{id:"template_sensors",label:"Area Template: Sensors",children:(e.sensors||[]).map(i=>({id:`template_sensors:${i.id}`,label:Ks(i,this.hass)}))},{id:"template_primary",label:"Area Template: Primary Channel"},{id:"template_rules",label:"Area Template: Rules",children:(e.rules||[]).map(i=>({id:`template_rules:${i.id}`,label:i.name||i.id}))}],this._resetDialogOpen=!0}catch(t){this._error=t instanceof Error?t.message:"Failed to load system defaults"}finally{this._loading=!1}}}async _executeResetSettings(t){if(!this.hass||!this._resetDefaults)return;const e=new Set(t.detail.selectedIds),i=this._resetDefaults.area_template||{},a={primary_slots:e.has("template_primary")?structuredClone(i.primary_slots||{}):{},inputs:e.has("template_inputs")?structuredClone(i.inputs||[]):(i.inputs||[]).filter(s=>e.has(`template_inputs:${s.id}`)).map(s=>structuredClone(s)),activities:e.has("template_activities")?structuredClone(i.activities||[]):(i.activities||[]).filter(s=>e.has(`template_activities:${s.id}`)).map(s=>structuredClone(s)),custom_channels:e.has("template_channels")?structuredClone(i.custom_channels||{}):Object.fromEntries(Object.entries(i.custom_channels||{}).filter(([s])=>e.has(`template_channels:${s}`)).map(([s,o])=>[s,structuredClone(o)])),sensors:e.has("template_sensors")?structuredClone(i.sensors||[]):(i.sensors||[]).filter(s=>e.has(`template_sensors:${s.id}`)).map(s=>structuredClone(s)),rules:e.has("template_rules")?structuredClone(i.rules||[]):(i.rules||[]).filter(s=>e.has(`template_rules:${s.id}`)).map(s=>structuredClone(s))};this._resetDialogOpen=!1;try{this._loading=!0,this._error="",await As(this.hass,{area_template:a}),await this.dialog.showAlert("Reset Complete","Settings have been reset. The panel will now reload."),window.location.reload()}catch(s){this._error=s instanceof Error?s.message:"Failed to reset settings"}finally{this._loading=!1}}async _onFactoryReset(){if(!this.hass)return;if(this.isDraftDirty){await this.dialog.showAlert("Unsaved Changes","Please save or discard your unsaved settings changes before performing a factory reset.");return}if(await this.dialog.showConfirm("Factory Reset Configuration",`⚠️ DANGER: This will delete ALL areas and reset all settings to system defaults.

This action cannot be undone. Are you sure you want to delete all areas and reset Twilight?`))try{this._loading=!0,this._error="",await Es(this.hass,{twilight_backup_version:1,areas:{},global:{}}),await this.dialog.showAlert("Factory Reset Complete","All areas and settings have been reset to factory defaults. The panel will now reload."),window.location.reload()}catch(e){this._error=e instanceof Error?e.message:"Failed to reset configuration"}finally{this._loading=!1}}render(){return this.open?n`
      <div class="overlay" @click=${this._onClose}>
        <div class="modal-card" @click=${t=>t.stopPropagation()}>
          <div class="modal-header">
            <h3 class="modal-title">Backup & Restore</h3>
            <button class="panel-close" @click=${this._onClose}>✕</button>
          </div>

          <div class="modal-body">
            <p style="margin: 0 0 16px 0; font-size: 14px; color: var(--secondary-text-color); line-height: 1.4;">
              Export a full snapshot of all area configurations, restore from a backup file, or reset all data to factory defaults.
            </p>

            ${this.isDraftDirty?n`
                  <div class="warning-banner">
                    ⚠️ You have unsaved settings changes. Please save or discard them before restoring or resetting.
                  </div>
                `:""}
            ${this._error?n`<div class="error-banner">❌ ${this._error}</div>`:""}

            <div class="actions-container">
              <div class="action-card" @click=${this._onDownloadBackup}>
                <div class="action-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </div>
                <div class="action-content">
                  <div class="action-title">Download Backup</div>
                  <div class="action-desc">Save all area configurations, template settings, and global defaults into a portable JSON file.</div>
                </div>
              </div>

              <div class="action-card ${this.isDraftDirty?"disabled":""}" @click=${this._onTriggerFileInput}>
                <div class="action-icon restore">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <div class="action-content">
                  <div class="action-title">Restore from File</div>
                  <div class="action-desc">Replace your current Twilight configuration with the contents of a backup JSON file.</div>
                </div>
              </div>

              <div class="action-card ${this.isDraftDirty?"disabled":""}" @click=${this._onResetSettings}>
                <div class="action-icon restore">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                  </svg>
                </div>
                <div class="action-content">
                  <div class="action-title">Reset Settings</div>
                  <div class="action-desc">Clear the area template (inputs, activities, channels, sensors, rules) and selectively restore chosen items from the system defaults.</div>
                </div>
              </div>

              <div class="action-card danger ${this.isDraftDirty?"disabled":""}" @click=${this._onFactoryReset}>
                <div class="action-icon danger">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </div>
                <div class="action-content">
                  <div class="action-title" style="color: var(--error-color, #f44336);">Factory Reset</div>
                  <div class="action-desc">Delete ALL areas and reset all global settings to system defaults.</div>
                </div>
              </div>
            </div>

            <input type="file" id="restoreFileInput" accept="application/json" @change=${this._onFileSelected} />
          </div>

          <div class="modal-footer">
            <button class="btn-cancel-dialog" @click=${this._onClose} ?disabled=${this._loading}>
              Close
            </button>
          </div>
        </div>
      </div>

      <twilight-alert-dialog
        .open=${this.dialog.alertOpen}
        .dialogTitle=${this.dialog.alertTitle}
        .message=${this.dialog.alertMessage}
        @close=${this.dialog._onCloseAlert}
      ></twilight-alert-dialog>

      <twilight-confirm-dialog
        .open=${this.dialog.confirmOpen}
        .dialogTitle=${this.dialog.confirmTitle}
        .message=${this.dialog.confirmMessage}
        @confirm=${this.dialog._onConfirm}
        @cancel=${this.dialog._onCancelConfirm}
      ></twilight-confirm-dialog>

      <twilight-reset-dialog
        .open=${this._resetDialogOpen}
        title="Reset Settings"
        description="The area template's inputs, activities, custom channels, sensors, and rules will be cleared. Only the items checked below will be restored from the system defaults."
        .nodes=${this._resetNodes}
        @confirm=${this._executeResetSettings}
        @cancel=${()=>{this._resetDialogOpen=!1}}
      ></twilight-reset-dialog>
    `:n``}};Xt.styles=[Et,P`
      .modal-card {
        max-width: 520px;
      }
      .actions-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-top: 12px;
      }
      .action-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px 20px;
        border-radius: 12px;
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, transparent);
        cursor: pointer;
        transition: background 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
      }
      .action-card:hover:not(.disabled) {
        background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
        border-color: color-mix(in srgb, var(--tp-accent, #e91e8c) 50%, transparent);
        transform: translateY(-1px);
      }
      .action-card.disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .action-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: color-mix(in srgb, var(--tp-accent, #e91e8c) 14%, transparent);
        color: var(--tp-accent, #e91e8c);
        border: 1px solid color-mix(in srgb, var(--tp-accent, #e91e8c) 25%, transparent);
        flex-shrink: 0;
      }
      .action-icon.restore {
        background: color-mix(in srgb, var(--warning-color, #ff9800) 14%, transparent);
        color: var(--warning-color, #ff9800);
        border-color: color-mix(in srgb, var(--warning-color, #ff9800) 25%, transparent);
      }
      .action-icon.danger {
        background: color-mix(in srgb, var(--error-color, #f44336) 14%, transparent);
        color: var(--error-color, #f44336);
        border-color: color-mix(in srgb, var(--error-color, #f44336) 25%, transparent);
      }
      .action-card.danger:hover:not(.disabled) {
        border-color: color-mix(in srgb, var(--error-color, #f44336) 50%, transparent);
      }
      .action-content {
        flex: 1;
      }
      .action-title {
        margin: 0 0 4px 0;
        font-size: 15px;
        font-weight: 600;
        color: var(--primary-text-color);
      }
      .action-desc {
        margin: 0;
        font-size: 13px;
        line-height: 1.4;
        color: var(--secondary-text-color);
      }
      .warning-banner {
        margin-top: 12px;
        padding: 10px 12px;
        border-radius: 8px;
        background: rgba(255, 152, 0, 0.12);
        border: 1px solid rgba(255, 152, 0, 0.3);
        color: var(--warning-color, #ff9800);
        font-size: 13px;
      }
      .error-banner {
        margin-top: 12px;
        padding: 10px 12px;
        border-radius: 8px;
        background: rgba(244, 67, 54, 0.12);
        border: 1px solid rgba(244, 67, 54, 0.3);
        color: var(--error-color, #f44336);
        font-size: 13px;
      }
      input[type='file'] {
        display: none;
      }
    `],re([h({type:Object})],Xt.prototype,"hass",2),re([h({type:Boolean})],Xt.prototype,"open",2),re([h({type:Boolean})],Xt.prototype,"isDraftDirty",2),re([b()],Xt.prototype,"_loading",2),re([b()],Xt.prototype,"_error",2),re([b()],Xt.prototype,"_resetDialogOpen",2),re([b()],Xt.prototype,"_resetNodes",2),re([b()],Xt.prototype,"_resetDefaults",2),Xt=re([L("twilight-backup-restore-dialog")],Xt);var Cr=Object.defineProperty,kr=Object.getOwnPropertyDescriptor,It=(t,e,i,a)=>{for(var s=a>1?void 0:a?kr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Cr(e,i,s),s};let vt=class extends B{constructor(){super(...arguments),this.hass=null,this._hasLoaded=!1,this._selectedChannelId="",this._slotEditOpen=!1,this._editingSlotId=null,this._templateInputsEditOpen=!1,this._templateActivitiesEditOpen=!1,this._templateSensorsEditOpen=!1,this._templateRulesEditOpen=!1,this._backupDialogOpen=!1,this._placeholderDefaults=null,this._calculatedSlotTimes=[],this._slotTimesRequestId=0,this._dialog=new xe(this),this._draftController=new zs(this,{onSave:async t=>{this.hass&&(await As(this.hass,t),this.dispatchEvent(new CustomEvent("global-changed",{detail:t,bubbles:!0,composed:!0})))}})}updated(t){t.has("hass")&&this.hass&&!this._hasLoaded&&(this._hasLoaded=!0,this._loadData())}async _loadData(){if(this.hass){this._draftController.loading=!0,this.requestUpdate();try{const[t,e]=await Promise.all([Ds(this.hass),Hi(this.hass).catch(()=>null)]);this._draftController.init(t||{}),this._placeholderDefaults=e,this._selectFirstChannel(),await this._loadCalculatedSlotTimes()}catch(t){console.error("Failed to load global config:",t)}finally{this._draftController.loading=!1,this.requestUpdate()}}}async _loadCalculatedSlotTimes(){var s,o;if(!this.hass)return;const e=(((o=(s=this._draftController.draft)==null?void 0:s.area_template)==null?void 0:o.custom_channels)||{})[this._selectedChannelId],i=(e==null?void 0:e.slots)||[];if(i.length===0){this._calculatedSlotTimes=[];return}const a=++this._slotTimesRequestId;try{const r=await Bi(this.hass,{slots:i});if(a!==this._slotTimesRequestId)return;this._calculatedSlotTimes=r.slots}catch(r){console.warn("Failed to load slot time preview:",r),a===this._slotTimesRequestId&&(this._calculatedSlotTimes=[])}}_selectFirstChannel(){var e,i;if(this._selectedChannelId===A)return;const t=((i=(e=this._draftController.draft)==null?void 0:e.area_template)==null?void 0:i.custom_channels)||{};(!this._selectedChannelId||!t[this._selectedChannelId])&&(this._selectedChannelId=A)}async _saveSettings(){await this._draftController.save()}_cancelChanges(){this._draftController.cancel()}_saveStatusText(){if(this._draftController.saving)return"Saving…";const t=this._draftController.saveError;return t?`Save failed: ${t&&typeof t=="object"&&"message"in t?String(t.message):String(t)}`:this._draftController.isDirty?"Unsaved changes":"All changes saved"}async _onTemplateInputsChanged(t){this._draftController.update(e=>{e.area_template||(e.area_template={}),e.area_template.inputs=t.detail.inputs}),await this._draftController.save()}async _onTemplateActivitiesChanged(t){this._draftController.update(e=>{e.area_template||(e.area_template={}),e.area_template.activities=t.detail.activities}),await this._draftController.save()}async _onTemplateSensorsChanged(t){this._draftController.update(e=>{e.area_template||(e.area_template={}),e.area_template.sensors=t.detail}),await this._draftController.save()}async _onTemplateRulesChanged(t){this._draftController.update(e=>{e.area_template||(e.area_template={}),e.area_template.rules=t.detail}),await this._draftController.save()}_onTemplateChannelSelected(t){this._selectedChannelId=t.detail.channelId,this._loadCalculatedSlotTimes()}async _onTemplateChannelAdded(t){var o;const e=this._draftController.draft;if(!e)return;const i=t.detail.name.trim();if(!i)return;const a=i.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"");if(!a)return;const s={...((o=e.area_template)==null?void 0:o.custom_channels)||{}};if(s[a]){await this._dialog.showAlert("Channel already exists",`A channel named "${i}" already exists.`);return}s[a]={name:i,enabled:!0,slots:[]},this._draftController.update(r=>{r.area_template||(r.area_template={}),r.area_template.custom_channels=s}),await this._draftController.save(),this._selectedChannelId=a,this._loadCalculatedSlotTimes()}async _onTemplateChannelRenamed(t){var r;const e=this._draftController.draft;if(!e)return;const{channelId:i,name:a}=t.detail,s={...((r=e.area_template)==null?void 0:r.custom_channels)||{}},o=s[i];o&&(s[i]={...o,name:a},this._draftController.update(l=>{l.area_template||(l.area_template={}),l.area_template.custom_channels=s}),await this._draftController.save())}async _onTemplateChannelDeleted(t){var s;const e=this._draftController.draft;if(!e)return;const{channelId:i}=t.detail,a={...((s=e.area_template)==null?void 0:s.custom_channels)||{}};delete a[i],this._draftController.update(o=>{o.area_template||(o.area_template={}),o.area_template.custom_channels=a}),await this._draftController.save(),this._selectFirstChannel(),this._loadCalculatedSlotTimes()}async _onTemplateChannelToggled(t){var r;const e=this._draftController.draft;if(!e)return;const{channelId:i,enabled:a}=t.detail,s={...((r=e.area_template)==null?void 0:r.custom_channels)||{}},o=s[i];o&&(s[i]={...o,enabled:a},this._draftController.update(l=>{l.area_template||(l.area_template={}),l.area_template.custom_channels=s}),await this._draftController.save())}async _onTemplateSlotsChanged(t){var l;const e=this._draftController.draft;if(!e)return;let i=this._selectedChannelId;const a={...((l=e.area_template)==null?void 0:l.custom_channels)||{}};if(!i||!a[i]){const c=Object.keys(a);c.length>0&&(i=c[0],this._selectedChannelId=i)}const s=a[i];if(!s)return;const o=s.slots||[],r=t.detail.slots.map(c=>{const p=o.find(g=>g.id===c.id),u=c.startType==="fixed";return{id:c.id,name:c.label,start_type:u?"fixed":"astral",zone:u?null:Va(c),fixed_time:u?c.fixedStartTime||"00:00":null,offset_minutes:c.startOffset||0,scene_entity_id:c.scene,configured_entities:(p==null?void 0:p.configured_entities)||[]}});a[i]={...s,slots:r,...t.detail.transitionOnSeconds!==void 0?{transition_on_seconds:t.detail.transitionOnSeconds}:{}},this._draftController.update(c=>{c.area_template||(c.area_template={}),c.area_template.custom_channels=a}),await this._draftController.save(),this._loadCalculatedSlotTimes()}async _onTemplatePrimarySlotsChanged(t){const e={};for(const i of t.detail.slots){const a=i.id,s={};i.startOffset&&(s.offset_minutes=i.startOffset),i.scene&&(s.scene_entity_id=i.scene),Object.keys(s).length>0&&(e[a]=s)}this._draftController.update(i=>{i.area_template||(i.area_template={}),i.area_template.primary_slots=e}),await this._draftController.save()}_primaryChannelForTemplate(){var i,a;const t=((a=(i=this._draftController.draft)==null?void 0:i.area_template)==null?void 0:a.primary_slots)||{};return{name:"Primary",enabled:!0,slots:Ti.map(s=>{const o=t[s]||{};return{id:s,name:Oi[s]||s,start_type:"astral",zone:s,offset_minutes:o.offset_minutes??0,scene_entity_id:o.scene_entity_id??null,configured_entities:o.configured_entities??[]}})}}_primaryDisplaySlots(){var e,i;const t=((i=(e=this._draftController.draft)==null?void 0:e.area_template)==null?void 0:i.primary_slots)||{};return Ti.map(a=>{let s=a;["civil_dawn","civil_dusk"].includes(s)?s="civil":["nautical_dawn","nautical_dusk"].includes(s)?s="nautical":["astro_dawn","astro_dusk"].includes(s)?s="astro":["gold_dawn","gold_dusk"].includes(s)&&(s="gold");const o=t[a]||{};return{id:a,label:Oi[a]||a,color:si[s]||si.day,from:0,to:0,scene:o.scene_entity_id||null,isCustom:!1,startType:"astral",startEvent:a,startOffset:o.offset_minutes||0}})}render(){var r,l,c,p,u,g,d,f,v,y,w,x,_,D,T,E,C,z,m,O,j,S,M,V,I,J,k,st,et,at,N,ot,bt,W,Y,it,ut,zt,K,Ce,Mt,Xe,Ke,Ze;const t=((l=(r=this._draftController.draft)==null?void 0:r.area_template)==null?void 0:l.custom_channels)||{};let e=this._selectedChannelId||A;e!==A&&!t[e]&&Object.keys(t).length>0&&(e=Object.keys(t).sort()[0]);const i=e===A,a=t[e],s=(a==null?void 0:a.slots)||[],o=i?this._primaryDisplaySlots():this._calculatedSlotTimes.length>0?qe(this._calculatedSlotTimes,s).map($=>({...$,color:"#8e44ad",isCustom:!0})):s.map($=>{const R=$.start_type==="fixed";return{id:$.id,label:$.name||$.id,color:"#8e44ad",from:0,to:0,scene:$.scene_entity_id||null,isCustom:!0,startType:R?"fixed":"astral",startEvent:R?void 0:$.zone||"civil_dawn",fixedStartTime:R?$.fixed_time||"12:00":void 0,startOffset:$.offset_minutes||0}});return n`
      <div class="view-header-container">
        <div class="settings-header">
          <div class="header-left">
            <h2>Settings</h2>
          </div>
        </div>
      </div>

      <div class="view-content-container">
        ${this._draftController.loading?n`
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 64px 0; gap: 16px; color: var(--secondary-text-color);">
            <div class="spinner"></div>
            <div>Loading settings…</div>
          </div>
        `:n`
          <div class="view-content-grid">
            <!-- Card 2: General Settings -->
            <div class="span-12">
              <div class="settings-group">
                <div class="group-title">General</div>
                <div class="form-desc" style="line-height:1.5; opacity:0.85;">
                  There are currently no global settings. Unlike Inputs, Activities,
                  Sensors, Rules and Channels — which fall back to a system default when unset —
                  a global setting applies uniformly to every area with no per-object
                  override. None of the current options need that.
                </div>
              </div>
            </div>

            <!-- Area Template Header -->
            <div class="span-12">
              <div style="font-size: 13px; font-weight: 600; color: var(--primary-text-color); padding-top: 8px;">
                Area Template
              </div>
              <div style="font-size: 11px; color: var(--secondary-text-color); margin-top: 2px;">
                Used as the default template when creating a new area.
              </div>
            </div>

            <!-- Template: Inputs -->
            <div class="span-6">
              <twilight-inputs-card
                .hass=${this.hass}
                .config=${((p=(c=this._draftController.draft)==null?void 0:c.area_template)==null?void 0:p.inputs)??[]}
                .activities=${(((g=(u=this._draftController.draft)==null?void 0:u.area_template)==null?void 0:g.activities)??[]).map($=>$.id)}
                .activitiesConfig=${((f=(d=this._draftController.draft)==null?void 0:d.area_template)==null?void 0:f.activities)??[]}
                .rulesConfig=${((y=(v=this._draftController.draft)==null?void 0:v.area_template)==null?void 0:y.rules)??[]}
                .placeholderDefaults=${this._placeholderDefaults}
                .templateMode=${!0}
                @inputs-changed=${this._onTemplateInputsChanged}
                @open-edit=${()=>{this._templateInputsEditOpen=!0}}
              ></twilight-inputs-card>
            </div>

            <!-- Template: Activities -->
            <div class="span-6">
              <twilight-activities-card
                .hass=${this.hass}
                .config=${((x=(w=this._draftController.draft)==null?void 0:w.area_template)==null?void 0:x.activities)??[]}
                .inputs=${((D=(_=this._draftController.draft)==null?void 0:_.area_template)==null?void 0:D.inputs)??[]}
                .placeholderDefaults=${this._placeholderDefaults}
                .channels=${{[A]:this._primaryChannelForTemplate(),...t}}
                .templateMode=${!0}
                @activities-changed=${this._onTemplateActivitiesChanged}
                @open-edit=${()=>{this._templateActivitiesEditOpen=!0}}
              ></twilight-activities-card>
            </div>

            <!-- Left Column: Sensors & Rules stacked -->
            <div class="span-6" style="display: flex; flex-direction: column; gap: 16px;">
              <twilight-sensors-card
                .hass=${this.hass}
                .config=${((E=(T=this._draftController.draft)==null?void 0:T.area_template)==null?void 0:E.sensors)??[]}
                .templateMode=${!0}
                @sensors-changed=${this._onTemplateSensorsChanged}
                @open-edit=${()=>{this._templateSensorsEditOpen=!0}}
              ></twilight-sensors-card>

              <twilight-rules-card
                .hass=${this.hass}
                .rules=${((z=(C=this._draftController.draft)==null?void 0:C.area_template)==null?void 0:z.rules)??[]}
                .inputsConfig=${((O=(m=this._draftController.draft)==null?void 0:m.area_template)==null?void 0:O.inputs)??[]}
                .activitiesConfig=${((S=(j=this._draftController.draft)==null?void 0:j.area_template)==null?void 0:S.activities)??[]}
                .channels=${{[A]:this._primaryChannelForTemplate(),...t}}
                .placeholderDefaults=${this._placeholderDefaults}
                .templateMode=${!0}
                @rules-changed=${this._onTemplateRulesChanged}
                @open-edit=${()=>{this._templateRulesEditOpen=!0}}
              ></twilight-rules-card>
            </div>

            <!-- Right Column: Timetable spanning full height -->
            <div class="span-6">
              <twilight-timetable-card
                .hass=${this.hass}
                .slots=${o}
                .entities=${[]}
                .loading=${!1}
                .noHeader=${!1}
                .channels=${t}
                .selectedChannelId=${e}
                .templateMode=${!0}
                @slots-changed=${this._onTemplateSlotsChanged}
                @edit-requested=${()=>{this._slotEditOpen=!0}}
                @channel-selected=${this._onTemplateChannelSelected}
                @channel-added=${this._onTemplateChannelAdded}
                @channel-renamed=${this._onTemplateChannelRenamed}
                @channel-deleted=${this._onTemplateChannelDeleted}
                @channel-enabled-toggled=${this._onTemplateChannelToggled}
              ></twilight-timetable-card>
            </div>
          </div>
        `}
      </div>

      <div class="detail-footer">
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="btn-cancel" @click=${()=>{this._backupDialogOpen=!0}}>Backup & Restore</button>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span class="save-status ${this._draftController.saveError?"error":""}">${this._saveStatusText()}</span>
          ${this._draftController.isDirty&&!this._draftController.saving?n`
            <button class="btn-cancel" ?disabled=${this._draftController.saving} @click=${this._cancelChanges}>Cancel</button>
            <button
              class="btn-save"
              ?disabled=${this._draftController.saving}
              @click=${this._saveSettings}
            >
              Save
            </button>
          `:""}
        </div>
      </div>

      <twilight-slot-editor
        .hass=${this.hass}
        .slots=${o}
        .entities=${[]}
        .placeholderDefaults=${this._placeholderDefaults}
        .open=${this._slotEditOpen}
        .highlightSlotId=${this._editingSlotId}
        .areaId=${""}
        .areaName=${""}
        .isPrimaryChannel=${i}
        .templateMode=${!0}
        .channelName=${i?"Primary":(a==null?void 0:a.name)||""}
        .transitionOnSeconds=${i?null:(a==null?void 0:a.transition_on_seconds)??null}
        @slots-changed=${i?this._onTemplatePrimarySlotsChanged:this._onTemplateSlotsChanged}
        @close=${()=>{this._slotEditOpen=!1,this._editingSlotId=null}}
      ></twilight-slot-editor>

      <twilight-backup-restore-dialog
        .hass=${this.hass||void 0}
        .open=${this._backupDialogOpen}
        .isDraftDirty=${this._draftController.isDirty}
        @close=${()=>{this._backupDialogOpen=!1}}
      ></twilight-backup-restore-dialog>

      <twilight-inputs-dialog
        .open=${this._templateInputsEditOpen}
        .hass=${this.hass}
        .config=${((V=(M=this._draftController.draft)==null?void 0:M.area_template)==null?void 0:V.inputs)??[]}
        .activities=${(((J=(I=this._draftController.draft)==null?void 0:I.area_template)==null?void 0:J.activities)??[]).map($=>$.id)}
        .activitiesConfig=${((st=(k=this._draftController.draft)==null?void 0:k.area_template)==null?void 0:st.activities)??[]}
        .rulesConfig=${((at=(et=this._draftController.draft)==null?void 0:et.area_template)==null?void 0:at.rules)??[]}
        .placeholderDefaults=${this._placeholderDefaults}
        .templateMode=${!0}
        @inputs-changed=${this._onTemplateInputsChanged}
        @close=${()=>{this._templateInputsEditOpen=!1}}
      ></twilight-inputs-dialog>

      <twilight-activities-dialog
        .open=${this._templateActivitiesEditOpen}
        .hass=${this.hass}
        .config=${((ot=(N=this._draftController.draft)==null?void 0:N.area_template)==null?void 0:ot.activities)??[]}
        .inputs=${((W=(bt=this._draftController.draft)==null?void 0:bt.area_template)==null?void 0:W.inputs)??[]}
        .placeholderDefaults=${this._placeholderDefaults}
        .channels=${{[A]:this._primaryChannelForTemplate(),...t}}
        .templateMode=${!0}
        @activities-changed=${this._onTemplateActivitiesChanged}
        @close=${()=>{this._templateActivitiesEditOpen=!1}}
      ></twilight-activities-dialog>

      <twilight-sensors-dialog
        .open=${this._templateSensorsEditOpen}
        .hass=${this.hass}
        .config=${((it=(Y=this._draftController.draft)==null?void 0:Y.area_template)==null?void 0:it.sensors)??[]}
        .templateMode=${!0}
        @sensors-changed=${this._onTemplateSensorsChanged}
        @close=${()=>{this._templateSensorsEditOpen=!1}}
      ></twilight-sensors-dialog>

      <twilight-rules-dialog
        .open=${this._templateRulesEditOpen}
        .hass=${this.hass}
        .config=${((zt=(ut=this._draftController.draft)==null?void 0:ut.area_template)==null?void 0:zt.rules)??[]}
        .rules=${((Ce=(K=this._draftController.draft)==null?void 0:K.area_template)==null?void 0:Ce.rules)??[]}
        .inputsConfig=${((Xe=(Mt=this._draftController.draft)==null?void 0:Mt.area_template)==null?void 0:Xe.inputs)??[]}
        .activitiesConfig=${((Ze=(Ke=this._draftController.draft)==null?void 0:Ke.area_template)==null?void 0:Ze.activities)??[]}
        .channels=${{[A]:this._primaryChannelForTemplate(),...t}}
        .placeholderDefaults=${this._placeholderDefaults}
        .templateMode=${!0}
        @rules-changed=${this._onTemplateRulesChanged}
        @close=${()=>{this._templateRulesEditOpen=!1}}
      ></twilight-rules-dialog>

      <twilight-alert-dialog
        .open=${this._dialog.alertOpen}
        .dialogTitle=${this._dialog.alertTitle}
        .message=${this._dialog.alertMessage}
        @close=${this._dialog._onCloseAlert}
      ></twilight-alert-dialog>
    `}};vt.styles=[qi,Ve,Rs,P`
      .save-status.error {
        color: var(--error-color, #db4437);
      }

      *, *:before, *:after {
        box-sizing: border-box;
      }



    .settings-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      gap: 12px;
      box-sizing: border-box;
    }

    .settings-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      line-height: 24px;
    }

    .settings-header .header-left {
      display: flex;
      align-items: center;
      min-width: 0;
    }

    .settings-header .header-right {
      font-size: 13px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }

    .view-content-container {
      padding: 24px;
      width: 100%;
      box-sizing: border-box;
      flex: 1;
      overflow-y: auto;
    }

    .view-content-grid {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 16px;
      align-items: stretch;
      align-content: start;
      box-sizing: border-box;
    }

    .span-6  { grid-column: span 6; min-width: 0; }
    .span-12 { grid-column: span 12; min-width: 0; }

    @media (max-width: 768px) {
      .view-content-grid .span-6 { grid-column: span 12; }
      .view-content-container { padding: 16px; }
    }

    /* ── Settings Cards ── */
    .settings-group {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .group-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.9px;
      color: var(--secondary-text-color);
      border-bottom: 1px solid color-mix(in srgb, var(--primary-text-color) 5%, transparent);
      padding-bottom: 8px;
      margin-bottom: 4px;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    .form-desc {
      font-size: 11px;
      color: var(--secondary-text-color);
      margin-top: -2px;
      line-height: 1.3;
    }

    .sensor-input {
      width: 100%;
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
      border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 15%, transparent));
      border-radius: 6px;
      color: var(--primary-text-color);
      padding: 10px 14px;
      font-size: 14px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .sensor-input:focus {
      border-color: var(--tp-accent, var(--accent-color, #e91e8c));
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--tp-accent, var(--accent-color, #e91e8c)) 20%, transparent);
    }

    .option-select {
      width: 100%;
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
      border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 15%, transparent));
      border-radius: 6px;
      color: var(--primary-text-color);
      padding: 10px 14px;
      font-size: 14px;
      outline: none;
      cursor: pointer;
      box-sizing: border-box;
      transition: border-color 0.15s, box-shadow 0.15s;
      appearance: none;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 14px center;
      background-size: 16px;
      padding-right: 40px;
    }

    .option-select:focus {
      border-color: var(--tp-accent, var(--accent-color, #e91e8c));
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--tp-accent, var(--accent-color, #e91e8c)) 20%, transparent);
    }

    .setting-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding: 8px 0;
    }

    .setting-row-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
    }

    .setting-row-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    .setting-row-description {
      font-size: 11px;
      color: var(--secondary-text-color);
      line-height: 1.3;
    }


    /* ── Loader spinner ── */
    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      border-top-color: var(--tp-accent, var(--accent-color, #e91e8c));
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],It([h({attribute:!1})],vt.prototype,"hass",2),It([b()],vt.prototype,"_hasLoaded",2),It([b()],vt.prototype,"_selectedChannelId",2),It([b()],vt.prototype,"_slotEditOpen",2),It([b()],vt.prototype,"_editingSlotId",2),It([b()],vt.prototype,"_templateInputsEditOpen",2),It([b()],vt.prototype,"_templateActivitiesEditOpen",2),It([b()],vt.prototype,"_templateSensorsEditOpen",2),It([b()],vt.prototype,"_templateRulesEditOpen",2),It([b()],vt.prototype,"_backupDialogOpen",2),It([b()],vt.prototype,"_placeholderDefaults",2),It([b()],vt.prototype,"_calculatedSlotTimes",2),vt=It([L("twilight-settings-view")],vt);var Sr=Object.getOwnPropertyDescriptor,Dr=(t,e,i,a)=>{for(var s=a>1?void 0:a?Sr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=r(s)||s);return s};const Ar=[{id:"areas",label:"Areas"},{id:"timeline",label:"Timeline"},{id:"analytics",label:"Analytics"},{id:"settings",label:"Settings"}];return Ne.TwilightPanel=class extends _e{constructor(){super(),this.tabs=Ar}},Ne.TwilightPanel=Dr([L("twilight-panel")],Ne.TwilightPanel),Object.defineProperty(Ne,Symbol.toStringTag,{value:"Module"}),Ne})({});
