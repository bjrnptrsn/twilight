var TwilightPanel=function($e){"use strict";var Ka;const Za=customElements.define;customElements.define=function(t,e,i){if(customElements.get(t)){console.warn(`[Twilight] Custom element ${t} is already defined.`);return}Za.call(customElements,t,e,i)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const H=t=>(e,i)=>{i!==void 0?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pe=globalThis,ii=Pe.ShadowRoot&&(Pe.ShadyCSS===void 0||Pe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ai=Symbol(),Bi=new WeakMap;let Fi=class{constructor(e,i,a){if(this._$cssResult$=!0,a!==ai)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=i}get styleSheet(){let e=this.o;const i=this.t;if(ii&&e===void 0){const a=i!==void 0&&i.length===1;a&&(e=Bi.get(i)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),a&&Bi.set(i,e))}return e}toString(){return this.cssText}};const Ja=t=>new Fi(typeof t=="string"?t:t+"",void 0,ai),z=(t,...e)=>{const i=t.length===1?t[0]:e.reduce((a,s,o)=>a+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new Fi(i,t,ai)},Qa=(t,e)=>{if(ii)t.adoptedStyleSheets=e.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(const i of e){const a=document.createElement("style"),s=Pe.litNonce;s!==void 0&&a.setAttribute("nonce",s),a.textContent=i.cssText,t.appendChild(a)}},Wi=ii?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let i="";for(const a of e.cssRules)i+=a.cssText;return Ja(i)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ts,defineProperty:es,getOwnPropertyDescriptor:is,getOwnPropertyNames:as,getOwnPropertySymbols:ss,getPrototypeOf:os}=Object,Xt=globalThis,qi=Xt.trustedTypes,ns=qi?qi.emptyScript:"",si=Xt.reactiveElementPolyfillSupport,ke=(t,e)=>t,Ne={toAttribute(t,e){switch(e){case Boolean:t=t?ns:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=t!==null;break;case Number:i=t===null?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch{i=null}}return i}},oi=(t,e)=>!ts(t,e),Yi={attribute:!0,type:String,converter:Ne,reflect:!1,useDefault:!1,hasChanged:oi};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Xt.litPropertyMetadata??(Xt.litPropertyMetadata=new WeakMap);let ce=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,i=Yi){if(i.state&&(i.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((i=Object.create(i)).wrapped=!0),this.elementProperties.set(e,i),!i.noAccessor){const a=Symbol(),s=this.getPropertyDescriptor(e,a,i);s!==void 0&&es(this.prototype,e,s)}}static getPropertyDescriptor(e,i,a){const{get:s,set:o}=is(this.prototype,e)??{get(){return this[i]},set(n){this[i]=n}};return{get:s,set(n){const l=s==null?void 0:s.call(this);o==null||o.call(this,n),this.requestUpdate(e,l,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Yi}static _$Ei(){if(this.hasOwnProperty(ke("elementProperties")))return;const e=os(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(ke("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ke("properties"))){const i=this.properties,a=[...as(i),...ss(i)];for(const s of a)this.createProperty(s,i[s])}const e=this[Symbol.metadata];if(e!==null){const i=litPropertyMetadata.get(e);if(i!==void 0)for(const[a,s]of i)this.elementProperties.set(a,s)}this._$Eh=new Map;for(const[i,a]of this.elementProperties){const s=this._$Eu(i,a);s!==void 0&&this._$Eh.set(s,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const i=[];if(Array.isArray(e)){const a=new Set(e.flat(1/0).reverse());for(const s of a)i.unshift(Wi(s))}else e!==void 0&&i.push(Wi(e));return i}static _$Eu(e,i){const a=i.attribute;return a===!1?void 0:typeof a=="string"?a:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(i=>i(this))}addController(e){var i;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((i=e.hostConnected)==null||i.call(e))}removeController(e){var i;(i=this._$EO)==null||i.delete(e)}_$E_(){const e=new Map,i=this.constructor.elementProperties;for(const a of i.keys())this.hasOwnProperty(a)&&(e.set(a,this[a]),delete this[a]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Qa(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(i=>{var a;return(a=i.hostConnected)==null?void 0:a.call(i)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(i=>{var a;return(a=i.hostDisconnected)==null?void 0:a.call(i)})}attributeChangedCallback(e,i,a){this._$AK(e,a)}_$ET(e,i){var o;const a=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,a);if(s!==void 0&&a.reflect===!0){const n=(((o=a.converter)==null?void 0:o.toAttribute)!==void 0?a.converter:Ne).toAttribute(i,a.type);this._$Em=e,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(e,i){var o,n;const a=this.constructor,s=a._$Eh.get(e);if(s!==void 0&&this._$Em!==s){const l=a.getPropertyOptions(s),c=typeof l.converter=="function"?{fromAttribute:l.converter}:((o=l.converter)==null?void 0:o.fromAttribute)!==void 0?l.converter:Ne;this._$Em=s;const u=c.fromAttribute(i,l.type);this[s]=u??((n=this._$Ej)==null?void 0:n.get(s))??u,this._$Em=null}}requestUpdate(e,i,a,s=!1,o){var n;if(e!==void 0){const l=this.constructor;if(s===!1&&(o=this[e]),a??(a=l.getPropertyOptions(e)),!((a.hasChanged??oi)(o,i)||a.useDefault&&a.reflect&&o===((n=this._$Ej)==null?void 0:n.get(e))&&!this.hasAttribute(l._$Eu(e,a))))return;this.C(e,i,a)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,i,{useDefault:a,reflect:s,wrapped:o},n){a&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,n??i??this[e]),o!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||a||(i=void 0),this._$AL.set(e,i)),s===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var a;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[o,n]of s){const{wrapped:l}=n,c=this[o];l!==!0||this._$AL.has(o)||c===void 0||this.C(o,void 0,n,c)}}let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),(a=this._$EO)==null||a.forEach(s=>{var o;return(o=s.hostUpdate)==null?void 0:o.call(s)}),this.update(i)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(i)}willUpdate(e){}_$AE(e){var i;(i=this._$EO)==null||i.forEach(a=>{var s;return(s=a.hostUpdated)==null?void 0:s.call(a)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(i=>this._$ET(i,this[i]))),this._$EM()}updated(e){}firstUpdated(e){}};ce.elementStyles=[],ce.shadowRootOptions={mode:"open"},ce[ke("elementProperties")]=new Map,ce[ke("finalized")]=new Map,si==null||si({ReactiveElement:ce}),(Xt.reactiveElementVersions??(Xt.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const rs={attribute:!0,type:String,converter:Ne,reflect:!1,hasChanged:oi},ls=(t=rs,e,i)=>{const{kind:a,metadata:s}=i;let o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),a==="setter"&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),a==="accessor"){const{name:n}=i;return{set(l){const c=e.get.call(this);e.set.call(this,l),this.requestUpdate(n,c,t,!0,l)},init(l){return l!==void 0&&this.C(n,void 0,t,l),l}}}if(a==="setter"){const{name:n}=i;return function(l){const c=this[n];e.call(this,l),this.requestUpdate(n,c,t,!0,l)}}throw Error("Unsupported decorator location: "+a)};function h(t){return(e,i)=>typeof i=="object"?ls(t,e,i):((a,s,o)=>{const n=s.hasOwnProperty(o);return s.constructor.createProperty(o,a),n?Object.getOwnPropertyDescriptor(s,o):void 0})(t,e,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function b(t){return h({...t,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ce=globalThis,Vi=t=>t,Le=Ce.trustedTypes,Gi=Le?Le.createPolicy("lit-html",{createHTML:t=>t}):void 0,Xi="$lit$",Kt=`lit$${Math.random().toFixed(9).slice(2)}$`,Ki="?"+Kt,ds=`<${Ki}>`,ee=document,Se=()=>ee.createComment(""),De=t=>t===null||typeof t!="object"&&typeof t!="function",ni=Array.isArray,cs=t=>ni(t)||typeof(t==null?void 0:t[Symbol.iterator])=="function",ri=`[ 	
\f\r]`,Ae=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Zi=/-->/g,Ji=/>/g,ie=RegExp(`>|${ri}(?:([^\\s"'>=/]+)(${ri}*=${ri}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Qi=/'/g,ta=/"/g,ea=/^(?:script|style|textarea|title)$/i,ia=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),r=ia(1),_t=ia(2),pe=Symbol.for("lit-noChange"),it=Symbol.for("lit-nothing"),aa=new WeakMap,ae=ee.createTreeWalker(ee,129);function sa(t,e){if(!ni(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Gi!==void 0?Gi.createHTML(e):e}const ps=(t,e)=>{const i=t.length-1,a=[];let s,o=e===2?"<svg>":e===3?"<math>":"",n=Ae;for(let l=0;l<i;l++){const c=t[l];let u,g,p=-1,d=0;for(;d<c.length&&(n.lastIndex=d,g=n.exec(c),g!==null);)d=n.lastIndex,n===Ae?g[1]==="!--"?n=Zi:g[1]!==void 0?n=Ji:g[2]!==void 0?(ea.test(g[2])&&(s=RegExp("</"+g[2],"g")),n=ie):g[3]!==void 0&&(n=ie):n===ie?g[0]===">"?(n=s??Ae,p=-1):g[1]===void 0?p=-2:(p=n.lastIndex-g[2].length,u=g[1],n=g[3]===void 0?ie:g[3]==='"'?ta:Qi):n===ta||n===Qi?n=ie:n===Zi||n===Ji?n=Ae:(n=ie,s=void 0);const f=n===ie&&t[l+1].startsWith("/>")?" ":"";o+=n===Ae?c+ds:p>=0?(a.push(u),c.slice(0,p)+Xi+c.slice(p)+Kt+f):c+Kt+(p===-2?l:f)}return[sa(t,o+(t[i]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),a]};class Te{constructor({strings:e,_$litType$:i},a){let s;this.parts=[];let o=0,n=0;const l=e.length-1,c=this.parts,[u,g]=ps(e,i);if(this.el=Te.createElement(u,a),ae.currentNode=this.el.content,i===2||i===3){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(s=ae.nextNode())!==null&&c.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const p of s.getAttributeNames())if(p.endsWith(Xi)){const d=g[n++],f=s.getAttribute(p).split(Kt),x=/([.?@])?(.*)/.exec(d);c.push({type:1,index:o,name:x[2],strings:f,ctor:x[1]==="."?us:x[1]==="?"?gs:x[1]==="@"?fs:Re}),s.removeAttribute(p)}else p.startsWith(Kt)&&(c.push({type:6,index:o}),s.removeAttribute(p));if(ea.test(s.tagName)){const p=s.textContent.split(Kt),d=p.length-1;if(d>0){s.textContent=Le?Le.emptyScript:"";for(let f=0;f<d;f++)s.append(p[f],Se()),ae.nextNode(),c.push({type:2,index:++o});s.append(p[d],Se())}}}else if(s.nodeType===8)if(s.data===Ki)c.push({type:2,index:o});else{let p=-1;for(;(p=s.data.indexOf(Kt,p+1))!==-1;)c.push({type:7,index:o}),p+=Kt.length-1}o++}}static createElement(e,i){const a=ee.createElement("template");return a.innerHTML=e,a}}function he(t,e,i=t,a){var n,l;if(e===pe)return e;let s=a!==void 0?(n=i._$Co)==null?void 0:n[a]:i._$Cl;const o=De(e)?void 0:e._$litDirective$;return(s==null?void 0:s.constructor)!==o&&((l=s==null?void 0:s._$AO)==null||l.call(s,!1),o===void 0?s=void 0:(s=new o(t),s._$AT(t,i,a)),a!==void 0?(i._$Co??(i._$Co=[]))[a]=s:i._$Cl=s),s!==void 0&&(e=he(t,s._$AS(t,e.values),s,a)),e}class hs{constructor(e,i){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:i},parts:a}=this._$AD,s=((e==null?void 0:e.creationScope)??ee).importNode(i,!0);ae.currentNode=s;let o=ae.nextNode(),n=0,l=0,c=a[0];for(;c!==void 0;){if(n===c.index){let u;c.type===2?u=new Ee(o,o.nextSibling,this,e):c.type===1?u=new c.ctor(o,c.name,c.strings,this,e):c.type===6&&(u=new vs(o,this,e)),this._$AV.push(u),c=a[++l]}n!==(c==null?void 0:c.index)&&(o=ae.nextNode(),n++)}return ae.currentNode=ee,s}p(e){let i=0;for(const a of this._$AV)a!==void 0&&(a.strings!==void 0?(a._$AI(e,a,i),i+=a.strings.length-2):a._$AI(e[i])),i++}}class Ee{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,i,a,s){this.type=2,this._$AH=it,this._$AN=void 0,this._$AA=e,this._$AB=i,this._$AM=a,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=i.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,i=this){e=he(this,e,i),De(e)?e===it||e==null||e===""?(this._$AH!==it&&this._$AR(),this._$AH=it):e!==this._$AH&&e!==pe&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):cs(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==it&&De(this._$AH)?this._$AA.nextSibling.data=e:this.T(ee.createTextNode(e)),this._$AH=e}$(e){var o;const{values:i,_$litType$:a}=e,s=typeof a=="number"?this._$AC(e):(a.el===void 0&&(a.el=Te.createElement(sa(a.h,a.h[0]),this.options)),a);if(((o=this._$AH)==null?void 0:o._$AD)===s)this._$AH.p(i);else{const n=new hs(s,this),l=n.u(this.options);n.p(i),this.T(l),this._$AH=n}}_$AC(e){let i=aa.get(e.strings);return i===void 0&&aa.set(e.strings,i=new Te(e)),i}k(e){ni(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let a,s=0;for(const o of e)s===i.length?i.push(a=new Ee(this.O(Se()),this.O(Se()),this,this.options)):a=i[s],a._$AI(o),s++;s<i.length&&(this._$AR(a&&a._$AB.nextSibling,s),i.length=s)}_$AR(e=this._$AA.nextSibling,i){var a;for((a=this._$AP)==null?void 0:a.call(this,!1,!0,i);e!==this._$AB;){const s=Vi(e).nextSibling;Vi(e).remove(),e=s}}setConnected(e){var i;this._$AM===void 0&&(this._$Cv=e,(i=this._$AP)==null||i.call(this,e))}}class Re{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,i,a,s,o){this.type=1,this._$AH=it,this._$AN=void 0,this.element=e,this.name=i,this._$AM=s,this.options=o,a.length>2||a[0]!==""||a[1]!==""?(this._$AH=Array(a.length-1).fill(new String),this.strings=a):this._$AH=it}_$AI(e,i=this,a,s){const o=this.strings;let n=!1;if(o===void 0)e=he(this,e,i,0),n=!De(e)||e!==this._$AH&&e!==pe,n&&(this._$AH=e);else{const l=e;let c,u;for(e=o[0],c=0;c<o.length-1;c++)u=he(this,l[a+c],i,c),u===pe&&(u=this._$AH[c]),n||(n=!De(u)||u!==this._$AH[c]),u===it?e=it:e!==it&&(e+=(u??"")+o[c+1]),this._$AH[c]=u}n&&!s&&this.j(e)}j(e){e===it?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class us extends Re{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===it?void 0:e}}class gs extends Re{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==it)}}class fs extends Re{constructor(e,i,a,s,o){super(e,i,a,s,o),this.type=5}_$AI(e,i=this){if((e=he(this,e,i,0)??it)===pe)return;const a=this._$AH,s=e===it&&a!==it||e.capture!==a.capture||e.once!==a.once||e.passive!==a.passive,o=e!==it&&(a===it||s);s&&this.element.removeEventListener(this.name,this,a),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var i;typeof this._$AH=="function"?this._$AH.call(((i=this.options)==null?void 0:i.host)??this.element,e):this._$AH.handleEvent(e)}}class vs{constructor(e,i,a){this.element=e,this.type=6,this._$AN=void 0,this._$AM=i,this.options=a}get _$AU(){return this._$AM._$AU}_$AI(e){he(this,e)}}const li=Ce.litHtmlPolyfillSupport;li==null||li(Te,Ee),(Ce.litHtmlVersions??(Ce.litHtmlVersions=[])).push("3.3.2");const bs=(t,e,i)=>{const a=(i==null?void 0:i.renderBefore)??e;let s=a._$litPart$;if(s===void 0){const o=(i==null?void 0:i.renderBefore)??null;a._$litPart$=s=new Ee(e.insertBefore(Se(),o),o,void 0,i??{})}return s._$AI(t),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const se=globalThis;class L extends ce{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var i;const e=super.createRenderRoot();return(i=this.renderOptions).renderBefore??(i.renderBefore=e.firstChild),e}update(e){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=bs(i,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return pe}}L._$litElement$=!0,L.finalized=!0,(Ka=se.litElementHydrateSupport)==null||Ka.call(se,{LitElement:L});const di=se.litElementPolyfillSupport;di==null||di({LitElement:L}),(se.litElementVersions??(se.litElementVersions=[])).push("4.2.2");var ms=Object.defineProperty,xs=Object.getOwnPropertyDescriptor,ci=(t,e,i,a)=>{for(var s=a>1?void 0:a?xs(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&ms(e,i,s),s};let Oe=class extends L{constructor(){super(...arguments),this.activeTab="analytics",this.tabs=[]}connectedCallback(){super.connectedCallback(),this.setAttribute("role","tablist")}render(){return this.tabs.map(t=>r`
        <button
          class="tab-btn ${t.id===this.activeTab?"active":""}"
          role="tab"
          aria-selected=${t.id===this.activeTab?"true":"false"}
          @click=${()=>this._handleTabClick(t.id)}
        >
          <span class="tab-icon">${t.icon}</span>
          <span class="tab-label">${t.label}</span>
        </button>
      `)}_handleTabClick(t){this.dispatchEvent(new CustomEvent("tab-changed",{detail:t,bubbles:!0,composed:!0}))}};Oe.styles=z`
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
    .tab-icon {
      font-size: 18px;
    }
  `,ci([h({type:String})],Oe.prototype,"activeTab",2),ci([h({type:Array})],Oe.prototype,"tabs",2),Oe=ci([H("twilight-tab-bar")],Oe);var _s=Object.defineProperty,ue=(t,e,i,a)=>{for(var s=void 0,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=n(e,i,s)||s);return s&&_s(e,i,s),s};class oe extends L{constructor(){super(...arguments),this.narrow=!1,this.tabs=[],this.panel=null,this._activeTab="areas",this._hass=null,this._globalConfigOverride=null}createRenderRoot(){return this}get hass(){return this._hass}set hass(e){this._hass=e}render(){var e;return r`
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
          ${this.narrow?r`<div class="tp-menu-btn-wrap"><ha-menu-button .hass=${this._hass} .narrow=${this.narrow}></ha-menu-button></div>`:r`
          <div class="tp-title">
            <img class="tp-title-icon" src="/twilight/logo.png" alt="Twilight">
            <span>Twilight</span>
            ${((e=this.panel)==null?void 0:e.url_path)==="twilight_dev"?r`<span class="tp-badge">dev</span>`:r`<span class="tp-badge">experimental</span>`}
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
    `}_renderViews(){const e=this._activeTab;return r`
      ${e==="areas"&&this._isTabAvailable("areas")?r`
        <twilight-areas-view
          class="view-container active"
          .hass=${this._hass}
          .globalConfigOverride=${this._globalConfigOverride}
        ></twilight-areas-view>
      `:""}
      ${e==="analytics"&&this._isTabAvailable("analytics")?r`
        <twilight-analytics-view
          class="view-container active"
          .hass=${this._hass}
        ></twilight-analytics-view>
      `:""}
      ${e==="timeline"&&this._isTabAvailable("timeline")?r`
        <twilight-timeline-view
          class="view-container active"
          .hass=${this._hass}
        ></twilight-timeline-view>
      `:""}
      ${e==="settings"&&this._isTabAvailable("settings")?r`
        <twilight-settings-view
          class="view-container active"
          .hass=${this._hass}
          @global-changed=${this._onGlobalChanged}
        ></twilight-settings-view>
      `:""}
      ${e==="lab"&&this._isTabAvailable("lab")?r`
        <twilight-lab-view
          class="view-container active"
          .hass=${this._hass}
        ></twilight-lab-view>
      `:""}
      ${e==="lab-two"&&this._isTabAvailable("lab-two")?r`
        <twilight-lab-two-view
          class="view-container active"
          .hass=${this._hass}
        ></twilight-lab-two-view>
      `:""}
    `}_isTabAvailable(e){return this.tabs.some(i=>i.id===e)}_onGlobalChanged(e){this._globalConfigOverride=e.detail}}ue([h({type:Boolean})],oe.prototype,"narrow"),ue([h({type:Array})],oe.prototype,"tabs"),ue([h({type:Object})],oe.prototype,"panel"),ue([b()],oe.prototype,"_activeTab"),ue([b()],oe.prototype,"_hass"),ue([b()],oe.prototype,"_globalConfigOverride");const T="primary",ys=3,pi=10,oa=10,na={night:"#141926",astro:"#1e2e45",nautical:"#2c4268",civil:"#3d5c8a",gold:"#bfb39b",day:"#8ab0cd"},ws=["astro_dawn","nautical_dawn","civil_dawn","gold_dawn","day","gold_dusk","civil_dusk","nautical_dusk","astro_dusk","night"],$s={astro_dawn:"Astronomical dawn",nautical_dawn:"Nautical dawn",civil_dawn:"Civil dawn",gold_dawn:"Golden dawn",day:"Day",gold_dusk:"Golden dusk",civil_dusk:"Civil dusk",nautical_dusk:"Nautical dusk",astro_dusk:"Astronomical dusk",night:"Night"},Ze=class Ze extends CustomEvent{constructor(e){super(Ze.eventName,{detail:e,bubbles:!0,composed:!0})}};Ze.eventName="sensors-changed";let hi=Ze;const Je=class Je extends CustomEvent{constructor(e){super(Je.eventName,{detail:{inputs:e},bubbles:!0,composed:!0})}};Je.eventName="inputs-changed";let ui=Je;const Qe=class Qe extends CustomEvent{constructor(e){super(Qe.eventName,{detail:e,bubbles:!0,composed:!0})}};Qe.eventName="activities-changed";let gi=Qe;const ti=class ti extends CustomEvent{constructor(e,i){super(ti.eventName,{detail:{slots:e,transitionOnSeconds:i},bubbles:!0,composed:!0})}};ti.eventName="slots-changed";let fi=ti;function ks(t,e){return e.simCritical?{label:"Critical Alarm",color:"#d32f2f",class:"fast-blink-glow",sub:"Simulation: Smoke / Panic Alarm"}:e.simError?{label:"System Error",color:"var(--error-color, #f44336)",class:"blink-glow",sub:"Simulation: Device Offline"}:e.simSensorOffline?{label:"Sensor Offline",color:"#ff5722",class:"fast-pulse-glow",sub:"Simulation: Ambient Sensor Failure"}:e.simWarning?{label:"System Warning",color:"var(--warning-color, #ff9800)",class:"pulse-glow",sub:"Simulation: Low Illuminance"}:(t==null?void 0:t.active_activity)==="sleep"?{label:"Sleeping",color:"#3f51b5",class:"static-glow",sub:"Sleep Mode Active"}:{label:"Running / Auto",color:"var(--success-color, #4caf50)",class:"static-glow",sub:"Automatic Mode"}}function ra(t){return t.callWS({type:"twilight/areas/list"})}function Cs(t){return t.callWS({type:"twilight/area_registry/list"})}function la(t,e){return t.callWS({type:"twilight/areas/new_draft",area_id:e})}function Ss(t,e){return t.callWS({type:"twilight/area/save",...e})}function Ds(t,e){return t.callWS({type:"twilight/area/delete",area_id:e})}function As(t,e){const i={type:"twilight/area/extracted"};return e&&(i.area_id=e),t.callWS(i)}function Ts(t,e){return t.callWS({type:"twilight/lab/area_entities",area_id:e})}function da(t){return t.callWS({type:"twilight/global/get"})}function Es(t,e){return t.callWS({type:"twilight/global/save",config:e})}function Os(t){return t.callWS({type:"twilight/global/export"})}function ca(t,e){return t.callWS({type:"twilight/global/import",payload:e})}function Is(t){return t.callWS({type:"twilight/global/defaults"})}function vi(t,e){return t.callWS({type:"twilight/placeholder_defaults",...e?{area_id:e}:{}})}function je(t,e){return t.callWS({type:"twilight/sun/day",...e})}function pa(t,e){return t.callWS({type:"twilight/sun/year",...e})}function ha(t,e){return t.callWS({type:"twilight/area/slot_times",...e})}function zs(t,e){return t.callWS({type:"twilight/slot_times/preview",...e})}function Ms(t,e){return t.callWS({type:"twilight/timeline/slot_times",...e})}function Ps(t,e){return t.callWS({type:"twilight/analytics/get",...e})}function Ns(t,e){return t.callWS({type:"twilight/trigger_input",...e})}class ua{constructor(e,i={}){this.original=null,this.draft=null,this.saving=!1,this.loading=!1,this.saveError=null,this.isDirty=!1,this._host=e,this._options=i,this._host.addController(this)}hostConnected(){}hostDisconnected(){}init(e){this.original=structuredClone(e),this.draft=structuredClone(e),this.isDirty=!1,this._host.requestUpdate()}update(e){this.draft&&(typeof e=="function"?e(this.draft):this.draft={...this.draft,...e},this.isDirty=!0,this._host.requestUpdate())}async save(){if(this.draft){this.saving=!0,this.saveError=null,this._host.requestUpdate();try{if(this._options.onSave){const e=await this._options.onSave(this.draft);e!==void 0&&(this.draft=e)}this.original=structuredClone(this.draft),this.isDirty=!1}catch(e){console.error("Error saving draft",e),this.saveError=e}finally{this.saving=!1,this._host.requestUpdate()}}}cancel(){this.original&&(this.draft=structuredClone(this.original),this.isDirty=!1,this._host.requestUpdate())}reset(){this.original=null,this.draft=null,this.saving=!1,this.loading=!1,this.saveError=null,this.isDirty=!1,this._host.requestUpdate()}}function ne(t){const e=(Math.round(t)%1440+1440)%1440;return`${String(Math.floor(e/60)).padStart(2,"0")}:${String(e%60).padStart(2,"0")}`}function Ls(t){return t.startType==="fixed"?t.fixedStartTime||"12:00":t.startEvent||"civil_dawn"}function bi(t){const e=t.to-t.from;return e>=1440?1440:e<=0?e+1440:e}function ge(t,e){const i=a=>(a%1440+1440)%1440;return i(e-i(t.from))<bi(t)}function mi(t,e){var a;const i=(a=t==null?void 0:t.states[e])==null?void 0:a.attributes;return(i==null?void 0:i.friendly_name)??(i==null?void 0:i.name)??e}function He(t,e){if(!t||t.length===0)return[];const i=[],a=t.length;for(let s=0;s<a;s++){const o=t[s],n=a===1?o.start+1440:s<a-1?t[s+1].start:t[0].start+1440,l=e==null?void 0:e.find(d=>d.id===o.id),c=(l==null?void 0:l.start_type)==="fixed",u=(l==null?void 0:l.zone)||o.id;let g=u;["civil_dawn","civil_dusk"].includes(g)?g="civil":["nautical_dawn","nautical_dusk"].includes(g)?g="nautical":["astro_dawn","astro_dusk"].includes(g)?g="astro":["gold_dawn","gold_dusk"].includes(g)&&(g="gold");const p=na[g]||na.day;i.push({id:o.id,label:(l==null?void 0:l.name)||$s[o.id]||o.id,color:p,from:o.start,to:n,scene:(l==null?void 0:l.scene_entity_id)||null,isCustom:!ws.includes(o.id),startType:c?"fixed":"astral",startEvent:c?void 0:u,startOffset:(l==null?void 0:l.offset_minutes)||0,fixedStartTime:c&&(l==null?void 0:l.fixed_time)||void 0})}return i}function Rs(t){if(t.length===0)return"var(--divider-color)";const e=s=>(s%1440+1440)%1440,i=[...t].sort((s,o)=>e(s.from)-e(o.from)),a=[];e(i[0].from)>0&&a.push(`${i[i.length-1].color} 0%`);for(const s of i){const o=(e(s.from)/1440*100).toFixed(1),n=(e(s.to)/1440*100).toFixed(1);a.push(`${s.color} ${o}%`),a.push(`${s.color} ${e(s.from)>e(s.to)?"100":n}%`)}return`linear-gradient(to right, ${a.join(", ")})`}async function xi(){if(!customElements.get("ha-entity-picker"))try{if(window.loadCardHelpers){const t=await window.loadCardHelpers();if(t){const e=await t.createCardElement({type:"entities",entities:[]});e&&e.getConfigElement&&await e.getConfigElement()}}if(!customElements.get("ha-entity-picker")){const t=customElements.get("hui-glance-card");t&&t.getConfigElement&&await t.getConfigElement()}}catch(t){console.warn("[Twilight] Failed to preload HA entity picker:",t)}}function _i(t,e,i){const a=window.devicePixelRatio||1,s=Math.round(e*a),o=Math.round(i*a);(t.width!==s||t.height!==o)&&(t.width=s,t.height=o);const n=t.getContext("2d");return n.clearRect(0,0,s,o),n.save(),n.scale(a,a),n}class Ue{constructor(e){this._ticker=null,this.liveMins=0,this.host=e,e.addController(this),this._updateTime()}hostConnected(){this._ticker=setInterval(()=>{this._updateTime(),this.host.requestUpdate()},15e3)}hostDisconnected(){this._ticker&&(clearInterval(this._ticker),this._ticker=null)}_updateTime(){const e=new Date;this.liveMins=e.getHours()*60+e.getMinutes()}}var js=Object.defineProperty,Hs=Object.getOwnPropertyDescriptor,pt=(t,e,i,a)=>{for(var s=a>1?void 0:a?Hs(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&js(e,i,s),s};let st=class extends L{constructor(){super(...arguments),this._clock=new Ue(this),this.hass=null,this.slots=[],this.inputs=[],this.noHeader=!1,this.runState=null,this.areaEnabled=!0,this.channels={},this.channelSlotsMap={},this.simCritical=!1,this.simError=!1,this.simSensorOffline=!1,this.simWarning=!1,this.entities=[]}_activityCountdown(t){if(!t.activity_expires_at)return null;const e=new Date(t.activity_expires_at).getTime()-Date.now();if(e<=0)return null;const i=Math.ceil(e/1e3),a=Math.floor(i/60),s=i%60;return a>0?`${a}m ${s}s`:`${s}s`}_runStateEngineInfo(t){const e=t.scene_activated_at!==null,i=t.active_activity;if(i){const a=i.charAt(0).toUpperCase()+i.slice(1),s=t.activity_trigger,o=s!=null&&s.input_id?this.inputs.find(c=>c.id===s.input_id):void 0,n=o?o.name||o.label||o.id:s==null?void 0:s.input_id,l=s!=null&&s.input_id?`via ${n}${s.entity_id?` (${s.entity_id})`:""}`:"";return{label:a,color:"#9c27b0",class:"pulse-glow",sub:l}}return{label:e?"Scene Active":"Idle",color:e?"#4caf50":"#2196f3",class:"entity-indicator",sub:e?"Scene switched by engine":"Waiting for input"}}render(){if(!this.sensorConfig)return r``;const t=this._clock.liveMins,e=this.runState,i=Object.keys(this.channels||{}).sort((n,l)=>n===T?-1:l===T?1:0),a=i.length>0?i:[T],s={simCritical:this.simCritical,simError:this.simError,simSensorOffline:this.simSensorOffline,simWarning:this.simWarning},o=this.areaEnabled?e?this._runStateEngineInfo(e):ks(this.runState,s):{label:"Disabled",color:"#888888",class:"entity-indicator",sub:"Engine inactive"};return r`
      <div class="status-card">
        ${this.noHeader?"":r`
          <div class="status-header">
            <span class="devices-card-icon">📊</span>
            <span class="status-title">Engine Live Monitor</span>
            <span style="font-size:11px; color:var(--secondary-text-color)">Live updating</span>
          </div>
        `}
        <div class="status-grid">
          <!-- Widget 1: Active Timeslots -->
          <div class="status-widget" style="--widget-accent: var(--accent-color, #e91e8c)">
            <div class="status-widget-label">Active Timeslots</div>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px; flex: 1; justify-content: center;">
              ${a.map(n=>{var v,m,C,O;const l=(v=this.channels)==null?void 0:v[n],c=l?l.enabled!==!1:!0,u=(l==null?void 0:l.name)||(n===T?"Twilight":n);if(!c)return r`
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 13px; opacity: 0.5;">
                      <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
                        <div class="slot-color-dot" style="background: #888; flex-shrink: 0;"></div>
                        <span style="font-weight: 600; color: var(--secondary-text-color); font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;">${u}:</span>
                        <span style="color: var(--secondary-text-color); text-decoration: line-through;">Disabled</span>
                      </div>
                      <span style="font-size: 11px; color: var(--secondary-text-color);">—</span>
                    </div>
                  `;const g=((m=this.channelSlotsMap)==null?void 0:m[n])||(n===T?this.slots:[])||[],p=((C=e==null?void 0:e.active_slots)==null?void 0:C[n])||null,d=p?g.find(A=>A.id===p):g.find(A=>ge(A,t));if(!d)return r`
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 13px; opacity: 0.7;">
                      <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
                        <div class="slot-color-dot" style="background: #888; flex-shrink: 0;"></div>
                        <span style="font-weight: 600; color: var(--secondary-text-color); font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;">${u}:</span>
                        <span style="color: var(--secondary-text-color); font-style: italic;">No active slot</span>
                      </div>
                      <span style="font-size: 11px; color: var(--secondary-text-color);">—</span>
                    </div>
                  `;const f=d.color||"var(--secondary-text-color)",x=d.label,w=`${ne(d.from)} - ${ne(d.to)}`,k=((O=e==null?void 0:e.active_scene_names)==null?void 0:O[n])||(d.scene?mi(this.hass,d.scene):"No Scene");return r`
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 13px;">
                    <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
                      <div class="slot-color-dot" style="background:${f}; box-shadow: 0 0 6px ${f}; flex-shrink: 0;"></div>
                      <span style="font-weight: 600; color: var(--secondary-text-color); font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;">${u}:</span>
                      <span style="color: var(--primary-text-color); font-weight: 500; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${x}</span>
                      <span style="color: var(--secondary-text-color); font-size: 11px; font-style: italic; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">(${k})</span>
                    </div>
                    <span style="font-family: monospace; font-size: 11px; color: var(--secondary-text-color); flex-shrink: 0;">${w}</span>
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
              ${e&&this._activityCountdown(e)?r`
                <div style="font-family: monospace; font-size: 11px; color: var(--secondary-text-color);">
                  ends in ${this._activityCountdown(e)}
                </div>
              `:""}
            </div>
          </div>
        </div>
      </div>
    `}};st.styles=z`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      font-family: var(--font-family, inherit);
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      overflow: hidden;
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

    .devices-card-icon {
      font-size: 18px;
      opacity: 0.7;
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
  `,pt([h({attribute:!1})],st.prototype,"hass",2),pt([h({type:Array})],st.prototype,"slots",2),pt([h({attribute:!1})],st.prototype,"sensorConfig",2),pt([h({type:Array})],st.prototype,"inputs",2),pt([h({type:Boolean})],st.prototype,"noHeader",2),pt([h({attribute:!1})],st.prototype,"runState",2),pt([h({type:Boolean})],st.prototype,"areaEnabled",2),pt([h({attribute:!1})],st.prototype,"channels",2),pt([h({attribute:!1})],st.prototype,"channelSlotsMap",2),pt([h({type:Boolean})],st.prototype,"simCritical",2),pt([h({type:Boolean})],st.prototype,"simError",2),pt([h({type:Boolean})],st.prototype,"simSensorOffline",2),pt([h({type:Boolean})],st.prototype,"simWarning",2),pt([h({type:Array})],st.prototype,"entities",2),st=pt([H("twilight-status-card")],st);class fe{constructor(e){this.host=e,this.confirmOpen=!1,this.confirmTitle="",this.confirmMessage="",this._confirmResolve=null,this.alertOpen=!1,this.alertTitle="",this.alertMessage="",this._alertResolve=null,this.promptOpen=!1,this.promptTitle="",this.promptMessage="",this.promptPlaceholder="",this.promptValue="",this._promptResolve=null,this._onConfirm=()=>{this.confirmOpen=!1,this._confirmResolve&&(this._confirmResolve(!0),this._confirmResolve=null),this.host.requestUpdate()},this._onCancelConfirm=()=>{this.confirmOpen=!1,this._confirmResolve&&(this._confirmResolve(!1),this._confirmResolve=null),this.host.requestUpdate()},this._onCloseAlert=()=>{this.alertOpen=!1,this._alertResolve&&(this._alertResolve(),this._alertResolve=null),this.host.requestUpdate()},this._onSubmitPrompt=i=>{this.promptOpen=!1,this._promptResolve&&(this._promptResolve(i.detail.value),this._promptResolve=null),this.host.requestUpdate()},this._onCancelPrompt=()=>{this.promptOpen=!1,this._promptResolve&&(this._promptResolve(null),this._promptResolve=null),this.host.requestUpdate()},this.host.addController(this)}hostConnected(){}hostDisconnected(){}showConfirm(e,i){return new Promise(a=>{this.confirmTitle=e,this.confirmMessage=i,this.confirmOpen=!0,this._confirmResolve=a,this.host.requestUpdate()})}showAlert(e,i){return new Promise(a=>{this.alertTitle=e,this.alertMessage=i,this.alertOpen=!0,this._alertResolve=a,this.host.requestUpdate()})}showPrompt(e,i="",a="",s=""){return new Promise(o=>{this.promptTitle=e,this.promptMessage=s,this.promptPlaceholder=a,this.promptValue=i,this.promptOpen=!0,this._promptResolve=o,this.host.requestUpdate()})}}const Ie=z`
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
    background: rgba(33, 150, 243, 0.18);
    border: 1px solid rgba(33, 150, 243, 0.45);
    color: #29b6f6;
  }
  .activity-badge.entity {
    background: rgba(171, 71, 188, 0.18);
    border: 1px solid rgba(171, 71, 188, 0.45);
    color: #e040fb;
  }
  .activity-badge.light {
    background: rgba(255, 179, 0, 0.18);
    border: 1px solid rgba(255, 179, 0, 0.45);
    color: #ffd54f;
  }
  .activity-badge.none {
    background: rgba(144, 164, 174, 0.18);
    border: 1px solid rgba(144, 164, 174, 0.45);
    color: #cfd8dc;
  }
  .activity-badge.reset {
    background: rgba(244, 67, 54, 0.18);
    border: 1px solid rgba(244, 67, 54, 0.45);
    color: #ff5252;
  }
`,yi=z`
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
`,wi=z`
  .view-header-container {
    background: var(--primary-background-color);
    min-height: 64px;
    padding: 12px 24px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
  }
`,ga=z`
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
`,jt=z`
  .overlay {
    position: fixed;
    inset: 0;
    background: var(--dialog-backdrop-color, rgba(0, 0, 0, 0.5));
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }
  .edit-panel, .modal-card {
    background: var(--input-fill-color, var(--mdc-text-field-fill-color, var(--card-background-color, #2d2a3d)));
    border-radius: 16px;
    border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 10%, transparent));
    width: 95vw;
    max-width: 780px;
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
    min-width: min(560px, 95vw);
    max-width: 95vw;
  }
  .panel-header, .modal-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 24px;
    background: var(--primary-background-color, #14141f);
    border-bottom: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 8%, transparent));
    flex-shrink: 0;
    box-sizing: border-box;
  }
  .panel-header-icon {
    font-size: 20px;
    opacity: 0.7;
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
    background: var(--primary-background-color, #14141f);
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
`;var Us=Object.defineProperty,Bs=Object.getOwnPropertyDescriptor,ht=(t,e,i,a)=>{for(var s=a>1?void 0:a?Bs(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&Us(e,i,s),s};class Be extends L{connectedCallback(){super.connectedCallback(),this.parentNode!==document.body&&document.body.appendChild(this)}disconnectedCallback(){super.disconnectedCallback(),queueMicrotask(()=>{this.isConnected||this.remove()})}}let ve=class extends Be{constructor(){super(...arguments),this.open=!1,this.dialogTitle="Alert",this.message=""}render(){return this.open?r`
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
    `:r``}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}};ve.styles=[jt,z`
      /* Above the sub-edit overlays (z-index 1100) — validation alerts fire
         from inside the sub-modals and must stay visible on top. */
      .overlay { z-index: 1200; }
      .modal-card {
        max-width: 450px;
      }
    `],ht([h({type:Boolean})],ve.prototype,"open",2),ht([h({type:String})],ve.prototype,"dialogTitle",2),ht([h({type:String})],ve.prototype,"message",2),ve=ht([H("twilight-alert-dialog")],ve);let be=class extends Be{constructor(){super(...arguments),this.open=!1,this.dialogTitle="Confirm",this.message=""}render(){return this.open?r`
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
    `:r``}_onConfirm(){this.dispatchEvent(new CustomEvent("confirm",{bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}};be.styles=[jt,z`
      .overlay { z-index: 1200; }
      .modal-card {
        max-width: 450px;
      }
    `],ht([h({type:Boolean})],be.prototype,"open",2),ht([h({type:String})],be.prototype,"dialogTitle",2),ht([h({type:String})],be.prototype,"message",2),be=ht([H("twilight-confirm-dialog")],be);let Wt=class extends Be{constructor(){super(...arguments),this.open=!1,this.dialogTitle="Prompt",this.message="",this.placeholder="",this.value="",this._currentValue=""}willUpdate(t){t.has("open")&&this.open&&(this._currentValue=this.value||"")}render(){return this.open?r`
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
            ${this.message?r`<p style="margin: 0; font-size: 13px; color: var(--secondary-text-color);">${this.message}</p>`:""}
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
    `:r``}_onInput(t){this._currentValue=t.target.value}_onKeyDown(t){t.key==="Enter"?this._onConfirm():t.key==="Escape"&&this._onCancel()}_onConfirm(){this.dispatchEvent(new CustomEvent("submit",{detail:{value:this._currentValue},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}};Wt.styles=[jt,z`
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
    `],ht([h({type:Boolean})],Wt.prototype,"open",2),ht([h({type:String})],Wt.prototype,"dialogTitle",2),ht([h({type:String})],Wt.prototype,"message",2),ht([h({type:String})],Wt.prototype,"placeholder",2),ht([h({type:String})],Wt.prototype,"value",2),ht([b()],Wt.prototype,"_currentValue",2),Wt=ht([H("twilight-prompt-dialog")],Wt);const yt="#141926",Ot="#1e2e45",It="#2c4268",zt="#3d5c8a",ze="#bfb39b",qt="#8ab0cd",fa="rgba(255,255,255,0.15)",$i=t=>t>=-.833?qt:t>=-6?zt:t>=-12?It:t>=-18?Ot:yt;function Fe(t){return`200 14px ${getComputedStyle(t).getPropertyValue("--font-family").trim()||"system-ui, sans-serif"}`}function ki(t){return getComputedStyle(t).getPropertyValue("--primary-text-color").trim()||"rgba(255,255,255,0.90)"}function va(t){return getComputedStyle(t).getPropertyValue("--divider-color").trim()||"rgba(255, 255, 255, 0.08)"}function ba(t,e){var i;for(let a=0;a<t.length-1;a++)if(t[a].time<=e&&t[a+1].time>e){const s=(e-t[a].time)/(t[a+1].time-t[a].time);return t[a].elevation+(t[a+1].elevation-t[a].elevation)*s}return((i=t[t.length-1])==null?void 0:i.elevation)??0}function ma(t,e,i){t.save(),t.beginPath(),t.arc(e,i,11,0,Math.PI*2),t.fillStyle="rgba(249,217,118,0.28)",t.shadowColor="#f9d976",t.shadowBlur=12,t.fill(),t.beginPath(),t.arc(e,i,7.5,0,Math.PI*2),t.strokeStyle="rgba(10, 15, 25, 0.65)",t.lineWidth=1.5,t.stroke(),t.beginPath(),t.arc(e,i,7,0,Math.PI*2),t.fillStyle="#f9d976",t.fill(),t.restore()}function xa(t,e,i){t.save(),t.shadowColor="#a4c5f0",t.shadowBlur=10,t.beginPath(),t.arc(e,i,7,0,Math.PI*2),t.fillStyle="#c8dff5",t.fill(),t.beginPath(),t.arc(e+3.15,i-.7,5.46,0,Math.PI*2),t.fillStyle=yt,t.fill(),t.restore()}function _a(t,e,i){t.save(),t.shadowColor="#c8c8f0",t.shadowBlur=10,t.beginPath(),t.arc(e,i,7,Math.PI/2,-Math.PI/2),t.lineTo(e,i-7),t.fillStyle="#f9d976",t.fill(),t.beginPath(),t.arc(e,i,7,-Math.PI/2,Math.PI/2),t.lineTo(e,i+7),t.fillStyle="#c8dff5",t.fill(),t.beginPath(),t.moveTo(e,i-7),t.lineTo(e,i+7),t.strokeStyle="rgba(0,0,0,0.3)",t.lineWidth=.5,t.stroke(),t.restore()}const R=t=>Math.round(t*1e3)/1e3;function Ci(t){const i=[],a=t.sunrise!==null?R(t.sunrise):null,s=t.sunset!==null?R(t.sunset):null,o=t.astro_dawn!==null&&(a===null||R(t.astro_dawn)<a)?R(t.astro_dawn):null,n=t.nautical_dawn!==null&&(a===null||R(t.nautical_dawn)<a)?R(t.nautical_dawn):null,l=t.dawn!==null&&(a===null||R(t.dawn)<a)?R(t.dawn):null,c=t.dusk!==null&&t.dusk<=1440&&(s===null||R(t.dusk)>s)?R(t.dusk):null,u=t.nautical_dusk!==null&&t.nautical_dusk<=1440&&(s===null||R(t.nautical_dusk)>s)?R(t.nautical_dusk):null,g=t.astro_dusk!==null&&t.astro_dusk<=1440&&(s===null||R(t.astro_dusk)>s)?R(t.astro_dusk):null,p=t.slot_gold_dawn!==null&&t.slot_gold_dawn!==void 0;return o!==null&&i.push({t:o,c:Ot}),n!==null&&i.push({t:n,c:It}),l!==null&&i.push({t:l,c:zt}),a!==null&&i.push({t:a,c:p?ze:qt}),p&&t.slot_day!==null&&t.slot_day!==void 0&&i.push({t:R(t.slot_day),c:qt}),p&&t.slot_gold_dusk!==null&&t.slot_gold_dusk!==void 0&&t.slot_gold_dusk<=1440&&i.push({t:R(t.slot_gold_dusk),c:ze}),s!==null&&s<=1440&&i.push({t:s,c:zt}),c!==null&&i.push({t:c,c:It}),u!==null&&i.push({t:u,c:Ot}),g!==null&&i.push({t:g,c:yt}),i}function Si(t){const i=[],a=t.slot_sunrise!==null?R(t.slot_sunrise):null,s=t.slot_astro_dawn!==null&&(a===null||R(t.slot_astro_dawn)<a)?R(t.slot_astro_dawn):null,o=t.slot_nautical_dawn!==null&&(a===null||R(t.slot_nautical_dawn)<a)?R(t.slot_nautical_dawn):null,n=t.slot_civil_dawn!==null&&(a===null||R(t.slot_civil_dawn)<a)?R(t.slot_civil_dawn):null,l=t.slot_civil_dusk!==null&&t.slot_civil_dusk<=1440?R(t.slot_civil_dusk):null,c=t.slot_nautical_dusk!==null&&t.slot_nautical_dusk<=1440?R(t.slot_nautical_dusk):null,u=t.slot_astro_dusk!==null&&t.slot_astro_dusk<=1440?R(t.slot_astro_dusk):null,g=t.slot_night!==null&&t.slot_night<=1440?R(t.slot_night):null,p=t.slot_gold_dawn!==null&&t.slot_gold_dawn!==void 0;return s!==null&&i.push({t:s,c:Ot}),o!==null&&i.push({t:o,c:It}),n!==null&&i.push({t:n,c:zt}),a!==null&&i.push({t:a,c:p?ze:qt}),p&&t.slot_day!==null&&t.slot_day!==void 0&&i.push({t:R(t.slot_day),c:qt}),p&&t.slot_gold_dusk!==null&&t.slot_gold_dusk!==void 0&&t.slot_gold_dusk<=1440&&i.push({t:R(t.slot_gold_dusk),c:ze}),l!==null&&i.push({t:l,c:zt}),c!==null&&i.push({t:c,c:It}),u!==null&&i.push({t:u,c:Ot}),g!==null&&i.push({t:g,c:yt}),i}function Di(t,e,i){if(!t)return $i(e.midnight_el);const a=1440;if(i){if(t.slot_civil_dusk!==null)return t.slot_night!==null&&t.slot_night<=a?yt:t.slot_astro_dusk!==null&&t.slot_astro_dusk<=a?Ot:t.slot_nautical_dusk!==null&&t.slot_nautical_dusk<=a?It:t.slot_civil_dusk!==null&&t.slot_civil_dusk<=a?zt:qt}else if(t.sunset!==null)return t.astro_dusk!==null&&t.astro_dusk<=a?yt:t.nautical_dusk!==null&&t.nautical_dusk<=a?Ot:t.dusk!==null&&t.dusk<=a?It:t.sunset!==null&&t.sunset<=a?zt:qt;return $i(t.midnight_el)}function Ai(t,e,i,a){const o=(n,l,c,u)=>{if(n===null||n<=1440||u===null)return;const g=R(n-1440);c!==null&&g>=c||t.push({t:g,c:l})};a?(o(e.slot_civil_dusk,zt,i.slot_sunrise,i.slot_sunrise),o(e.slot_nautical_dusk,It,i.slot_civil_dawn,i.slot_civil_dawn),o(e.slot_astro_dusk,Ot,i.slot_nautical_dawn,i.slot_nautical_dawn),o(e.slot_night,yt,i.slot_astro_dawn,i.slot_astro_dawn)):(o(e.sunset,zt,i.sunrise,i.sunrise),o(e.dusk,It,i.dawn,i.dawn),o(e.nautical_dusk,Ot,i.nautical_dawn,i.nautical_dawn),o(e.astro_dusk,yt,i.astro_dawn,i.astro_dawn))}function Fs(t,e,i,a,s,o,n,l,c){let u=n,g=e;for(const p of o){const d=l(Math.max(0,Math.min(c,p.t)));d>g&&(t.fillStyle=u,t.fillRect(g,i,d-g,a)),u=p.c,g=d}t.fillStyle=u,t.fillRect(g,i,s-g,a)}function Ws(t,e,i,a,s,o,n){let l=s,c=0;for(const u of a)u.t>c&&u.t<=n&&(t.fillStyle=l,t.fillRect(e,o(u.t),i,o(c)-o(u.t))),l=u.c,c=Math.max(c,u.t);c<n&&(t.fillStyle=l,t.fillRect(e,o(n),i,o(c)-o(n)))}var qs=Object.defineProperty,Ys=Object.getOwnPropertyDescriptor,X=(t,e,i,a)=>{for(var s=a>1?void 0:a?Ys(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&qs(e,i,s),s};const ya=[210,145,35,280,190,330,15],wa=50,$a=20,Vs=0,Gs=30,Ti=72,ka=12,Xs=2,We=20;let Y=class extends L{constructor(){super(...arguments),this.hass=null,this.date=new Date().toISOString().slice(0,10),this.clamped=!1,this.noHeader=!1,this.noAxisLabels=!1,this.noYAxis=!1,this.showSlots=!1,this.noSolarNoonMidnight=!1,this.hoverTime=null,this.liveTime=null,this.embedded=!1,this.sparkline=!1,this.channels={},this.selectedChannelId="primary",this.channelSlotsMap={},this.days=[],this.sunData=null,this.slots=[],this._days=[],this._sunData=null,this._loading=!1,this._w=0,this._scrubbing=!1,this._geom=null,this._interval=null,this._ro=null}connectedCallback(){super.connectedCallback(),this._interval=window.setInterval(()=>{this._scrubbing||this._draw()},1e3)}disconnectedCallback(){var t;this._interval&&clearInterval(this._interval),(t=this._ro)==null||t.disconnect(),super.disconnectedCallback()}updated(t){var i;if(!this._ro){const a=(i=this.shadowRoot)==null?void 0:i.querySelector(".canvas-wrap");a&&(this._ro=new ResizeObserver(s=>{const o=s[0].contentRect.width;o>0&&o!==this._w&&(this._w=o,this._draw())}),this._ro.observe(a))}t.has("days")&&this.days.length&&(this._days=this.days),t.has("sunData")&&this.sunData&&(this._sunData=this.sunData),(t.has("hass")||t.has("date"))&&this.hass&&!this.days.length&&this._load(),(t.has("_sunData")||t.has("_days")||t.has("clamped")||t.has("showSlots")||t.has("noSolarNoonMidnight")||t.has("noYAxis")||t.has("hoverTime")||t.has("liveTime")||t.has("channels")||t.has("selectedChannelId"))&&requestAnimationFrame(()=>this._draw())}async _load(){if(this.hass){this._loading=!0;try{const t=await je(this.hass,{date:this.date});this._sunData=t;const e=[];t.prev_day_data&&e.push(t.prev_day_data),t.day_data&&e.push(t.day_data),this._days=e}finally{this._loading=!1}}}_getLiveTime(){const t=new Date;return t.getHours()*60+t.getMinutes()+t.getSeconds()/60}_interpolateEl(t){var e;return ba(((e=this._sunData)==null?void 0:e.points)??[],t)}_draw(){var St;const t=(St=this.shadowRoot)==null?void 0:St.querySelector("canvas"),e=this._sunData??this.sunData;if(!t||!e||!this._w)return;const{points:i}=e;if(!i.length)return;const a=this._w,s=t.getBoundingClientRect().height;if(!s)return;const o=_i(t,a,s),n=this.noAxisLabels?10:this.noYAxis?We+Ti:wa,l=this.noAxisLabels?10:this.noYAxis?We:$a,c=this.noAxisLabels?10:Vs,u=this.noAxisLabels?10:Gs,g=a-n-l,p=s-c-u,d=Object.keys(this.channels||{}).filter(S=>S!=="primary"),x=1+d.length,w=p/x,k=p,v=c,m=c+k,C=n,O=n+g,A=v+p/2,U=1440;this._geom={plotT:v,stripeH:w,numStripes:x};const ot=e.lat??50,_=Math.abs(ot),I=_<=23.44?90:113.44-_,V=Math.max(I,...i.map(S=>Math.abs(S.elevation)))+10,j=S=>C+S/U*g,F=S=>A-S/V*(k/2);o.save(),o.shadowColor="rgba(0, 0, 0, 0.2)",o.shadowBlur=36,o.shadowOffsetX=0,o.shadowOffsetY=0,o.beginPath(),o.roundRect(C,v,g,p,8),o.fillStyle=yt,o.fill(),o.restore(),o.save(),o.beginPath(),o.roundRect(C,v,g,p,8),o.clip();const dt=w;o.save(),o.beginPath(),o.rect(C,v,g,dt),o.clip();const $=this._days.length?this._days:this.days,E=$.findIndex(S=>S.date===this.date),y=E>=0?$[E]:null,q=E>0?$[E-1]:null;if(y){const S=this.clamped,Rt=[...S?Si(y):Ci(y)];q&&Ai(Rt,q,y,S),Rt.sort((ei,en)=>ei.t-en.t);const Ui=Di(q,y,S);Fs(o,C,v,dt,O,Rt,Ui,j,U)}else o.fillStyle=yt,o.fillRect(C,v,g,dt);o.restore(),this._drawCustomStripes(o,d,y,q,e,C,v,O,g,w,j),o.save(),o.beginPath(),o.rect(C,v,g,p),o.clip(),o.save(),o.beginPath(),o.moveTo(C,A);for(const S of i)o.lineTo(j(S.time),F(S.elevation));o.lineTo(O,A),o.closePath();const tt=o.createLinearGradient(0,v,0,A);tt.addColorStop(0,"rgba(249,217,118,0.11)"),tt.addColorStop(1,"rgba(249,217,118,0.01)"),o.fillStyle=tt,o.fill(),o.restore(),o.save(),o.strokeStyle="rgba(255,255,255,0.35)",o.lineWidth=1.5,o.setLineDash([4,4]),o.beginPath(),o.moveTo(C,A),o.lineTo(O,A),o.stroke(),o.restore();const Z=o.createLinearGradient(0,v,0,m);Z.addColorStop(0,"#f9d976"),Z.addColorStop(.47,"#e8a020"),Z.addColorStop(.53,"#34507a"),Z.addColorStop(1,"#1b233a"),o.save(),o.beginPath();let M=!0;for(const S of i){const P=j(S.time),Rt=F(S.elevation);M?(o.moveTo(P,Rt),M=!1):o.lineTo(P,Rt)}o.strokeStyle=Z,o.lineWidth=2,o.stroke(),o.restore(),o.save(),o.strokeStyle=Z,o.lineWidth=2,o.shadowColor="rgba(249, 217, 118, 0.55)",o.shadowBlur=8,o.beginPath();let B=!1;for(const S of i){const P=j(S.time),Rt=F(S.elevation);S.elevation>=0?B?o.lineTo(P,Rt):(o.moveTo(P,Rt),B=!0):B=!1}if(o.stroke(),o.restore(),!this.noYAxis)for(const S of[-18,-12,-6,0,30,60]){const P=F(S);P<v-2||P>m+2||[-18,-12,-6,0].includes(S)&&(o.save(),o.strokeStyle=fa,o.lineWidth=.5,o.setLineDash([3,4]),o.beginPath(),o.moveTo(C,P),o.lineTo(O,P),o.stroke(),o.restore())}o.restore();const ct=this.liveTime??this._getLiveTime(),D=this._interpolateEl(ct),N=j(ct),nt=F(D),xt=v+w,K=(S,P,Rt=[],Ui=xt)=>{if(S===null)return;const ei=j((S%U+U)%U);o.save(),o.strokeStyle=P,o.lineWidth=1.5,o.setLineDash(Rt),o.beginPath(),o.moveTo(ei,v),o.lineTo(ei,Ui),o.stroke(),o.restore()};this.noSolarNoonMidnight||(K((y==null?void 0:y.solar_noon)??null,"rgba(255,214,0,0.7)",[],v+p),K((y==null?void 0:y.solar_midnight)??null,"rgba(60,100,200,0.7)",[],v+p)),this.showSlots&&y&&(K(y.slot_sunset,"rgba(255,255,255,0.75)"),K(y.slot_nautical_dusk,"rgba(255,255,255,0.60)"),K(y.slot_astro_dusk,"rgba(255,255,255,0.45)"),K(y.slot_night,"rgba(255,255,255,0.30)"),K(y.slot_astro_dawn,"rgba(255,255,255,0.30)"),K(y.slot_nautical_dawn,"rgba(255,255,255,0.45)"),K(y.slot_civil_dawn,"rgba(255,255,255,0.60)"),K(y.slot_sunrise,"rgba(255,255,255,0.75)"),K(y.slot_day,"rgba(255,255,255,0.65)"),K(y.slot_gold_dusk,"rgba(255,255,255,0.65)"));for(const S of[0,360,720,1080,1440]){const P=j(S);o.save(),o.strokeStyle=fa,o.lineWidth=.5,o.beginPath(),o.moveTo(P,v),o.lineTo(P,v+p),o.stroke(),o.restore()}if(o.save(),o.strokeStyle="rgba(255,255,255,0.25)",o.lineWidth=1,o.setLineDash([3,3]),o.beginPath(),o.moveTo(N,v),o.lineTo(N,v+p),o.stroke(),o.restore(),this.hoverTime!==null){const S=j(this.hoverTime);o.save(),o.strokeStyle="rgba(255,255,255,0.35)",o.lineWidth=1,o.setLineDash([3,3]),o.beginPath(),o.moveTo(S,v),o.lineTo(S,v+p),o.stroke(),o.restore()}if(o.restore(),o.save(),o.beginPath(),o.roundRect(C,v,g,p,8),o.strokeStyle=va(this),o.lineWidth=1,o.stroke(),o.restore(),D>=0?ma(o,N,nt):D>=-6?_a(o,N,nt):xa(o,N,nt),!this.noAxisLabels){o.fillStyle=ki(this),o.font=Fe(this),o.textAlign="center";for(const S of[0,360,720,1080,1440]){const P=j(S);S!==0&&S!==1440&&o.fillText(`${String(S/60|0).padStart(2,"0")}:00`,P,v+p+20)}}if(!this.noAxisLabels&&!this.noYAxis){o.font=Fe(this),o.textAlign="end";for(const S of[-18,-12,-6,0,30,60]){const P=F(S);P<v-2||P>m+2||[0,30,60,-18].includes(S)&&(o.fillStyle=ki(this),o.fillText(`${S}°`,C-6,P+4))}}this.noYAxis&&!this.noAxisLabels&&this._drawChannelAxisLabels(o,["primary",...d],C,v,w),o.restore()}_elevationToLightRatio(t){return Math.max(0,Math.min(1,(t- -18)/48))}_drawCustomStripes(t,e,i,a,s,o,n,l,c,u,g){const p=i||a||s.day_data;if(e.length===0||!p)return;const d=f=>(f%1440+1440)%1440;e.forEach((f,x)=>{var _,I,V;const w=n+(x+1)*u,k=w+u,v=((_=this.channelSlotsMap)==null?void 0:_[f])??[],m=((V=(I=this.channels)==null?void 0:I[f])==null?void 0:V.enabled)!==!1,C=ya[x%ya.length],O=m?35:0,A=m?12:6,U=m?42:14;t.fillStyle=yt,t.fillRect(o,w,c,u);const ot=c/1440;v.forEach(j=>{const F=bi(j);if(F<=0)return;const dt=d(j.from),$=o+dt*ot,E=d(j.from+F/2),y=this._interpolateEl(E),q=this._elevationToLightRatio(y),tt=A+q*(U-A);t.fillStyle=`hsl(${C}, ${O}%, ${tt}%)`;const Z=F*ot,M=$+Z-l;M<=0?t.fillRect($,w,Z,u):(t.fillRect($,w,l-$,u),t.fillRect(o,w,M,u))}),t.strokeStyle="rgba(255, 255, 255, 0.35)",t.lineWidth=1.5;for(const j of v){const F=g(d(j.from));t.beginPath(),t.moveTo(F,w),t.lineTo(F,k),t.stroke()}t.strokeStyle="rgba(255, 255, 255, 0.08)",t.lineWidth=.5,t.beginPath(),t.moveTo(o,w),t.lineTo(l,w),t.stroke()})}_drawChannelAxisLabels(t,e,i,a,s){const l=Ti-ka-Xs,c=i-ka;t.save(),t.font="600 11px system-ui, sans-serif",t.textAlign="end",t.textBaseline="middle",e.forEach((u,g)=>{var m,C,O,A;const p=((C=(m=this.channels)==null?void 0:m[u])==null?void 0:C.enabled)!==!1,d=(((A=(O=this.channels)==null?void 0:O[u])==null?void 0:A.name)||u).toUpperCase(),f=a+g*s,x=Math.max(1,Math.floor((s-8)/13)),w=this._wrapText(t,d,l,x);t.fillStyle=p?ki(this):"rgba(255,255,255,0.35)";const k=w.length*13;let v=f+(s-k)/2+13/2;for(const U of w)t.fillText(U,c,v),v+=13}),t.restore()}_wrapText(t,e,i,a){const s=p=>t.measureText(p).width<=i,o=e.split(/\s+/).filter(Boolean),n=[];let l="";const c=p=>{for(const d of p)l&&!s(l+d)&&(n.push(l),l=""),l+=d};for(const p of o){const d=l?`${l} ${p}`:p;if(s(d)){l=d;continue}l&&(n.push(l),l=""),s(p)?l=p:c(p)}if(l&&n.push(l),n.length<=a)return n;const u=n.slice(0,a);let g=u[a-1];for(;g.length>0&&!s(`${g}…`);)g=g.slice(0,-1);return u[a-1]=`${g}…`,u}get _padLeft(){return this.noAxisLabels?10:this.noYAxis?We+Ti:wa}get _padRight(){return this.noAxisLabels?10:this.noYAxis?We:$a}_channelAtY(t,e){const i=this._geom;if(!i||i.numStripes<=1)return this.selectedChannelId;const a=t-e,s=Math.max(0,Math.min(i.numStripes-1,Math.floor((a-i.plotT)/i.stripeH)));return s===0?"primary":Object.keys(this.channels||{}).filter(n=>n!=="primary")[s-1]??"primary"}_timeAtX(t,e){const i=this._w-this._padLeft-this._padRight,a=t-e;return Math.round(Math.max(0,Math.min(1,(a-this._padLeft)/i))*1440)}_getSlotAtTimeIn(t,e){const i=s=>(s%1440+1440)%1440,a=i(e);for(const s of t){const o=bi(s);if(!(o<=0)&&i(a-i(s.from))<o)return s}return null}_slotsForChannel(t){var i;const e=(i=this.channelSlotsMap)==null?void 0:i[t];return e&&e.length?e:this.slots}_onCanvasClick(t){if(!this._w)return;const e=t.currentTarget.getBoundingClientRect(),i=this._timeAtX(t.clientX,e.left),a=this._channelAtY(t.clientY,e.top),s=this._getSlotAtTimeIn(this._slotsForChannel(a),i);s&&this.dispatchEvent(new CustomEvent("slot-selected",{detail:{slotId:s.id,channelId:a},bubbles:!0,composed:!0}))}_onMouseMove(t){if(!this._w)return;const e=t.currentTarget.getBoundingClientRect();this.hoverTime=this._timeAtX(t.clientX,e.left);const i=this._channelAtY(t.clientY,e.top);this._scrubbing=!0,this.dispatchEvent(new CustomEvent("time-hover-changed",{detail:{hoverTime:this.hoverTime,channelId:i,scrubbing:!0},bubbles:!0,composed:!0})),this._draw()}_onMouseLeave(){this.hoverTime=null,this._scrubbing=!1,this.dispatchEvent(new CustomEvent("time-hover-changed",{detail:{hoverTime:null,scrubbing:!1},bubbles:!0,composed:!0})),this._draw()}_onTouchMove(t){if(!this._w)return;const e=t.touches[0],i=t.currentTarget.getBoundingClientRect();this.hoverTime=this._timeAtX(e.clientX,i.left);const a=this._channelAtY(e.clientY,i.top);this._scrubbing=!0,this.dispatchEvent(new CustomEvent("time-hover-changed",{detail:{hoverTime:this.hoverTime,channelId:a,scrubbing:!0},bubbles:!0,composed:!0})),this._draw()}_onTouchEnd(){this.hoverTime=null,this._scrubbing=!1,this.dispatchEvent(new CustomEvent("time-hover-changed",{detail:{hoverTime:null,scrubbing:!1},bubbles:!0,composed:!0})),this._draw()}_getSparklineGradient(){const t=this._days.length?this._days:this.days,e=t.findIndex(p=>p.date===this.date),i=e>=0?t[e]:null,a=e>0?t[e-1]:null;if(!i)return"var(--divider-color)";const s=this.clamped,n=[...s?Si(i):Ci(i)];a&&Ai(n,a,i,s),n.sort((p,d)=>p.t-d.t);const l=Di(a,i,s),c=[],u=1440;let g=l;c.push(`${g} 0%`);for(const p of n){const f=(Math.max(0,Math.min(u,p.t))/u*100).toFixed(1);c.push(`${g} ${f}%`),g=p.c,c.push(`${g} ${f}%`)}return c.push(`${g} 100%`),`linear-gradient(to right, ${c.join(", ")})`}render(){if(this.sparkline){const t=this._getSparklineGradient(),i=(this.liveTime??this._getLiveTime())/1440*100;return r`
        <div class="sparkline-container">
          <div class="sparkline-bar" style="--bar-gradient: ${t}">
            <div class="sparkline-pointer" style="left: calc(${i}% - 3px)"></div>
          </div>
        </div>
        ${this.noAxisLabels?"":r`
          <div class="sparkline-labels">
            <span>00:00</span>
            <span>12:00</span>
            <span>24:00</span>
          </div>
        `}
      `}return r`
      ${this.noHeader?"":r`
        <div class="card-header">
          <span class="card-icon">🌍</span>
          <span class="card-title">Sun path</span>
        </div>
      `}
      <div class="canvas-wrap">
        ${this._loading&&!this._sunData&&!this.sunData?r`<div class="loading"><ha-circular-progress active size="small"></ha-circular-progress></div>`:r`<canvas
              @click=${this._onCanvasClick}
              @mousemove=${this._onMouseMove}
              @mouseleave=${this._onMouseLeave}
              @touchstart=${this._onTouchMove}
              @touchmove=${this._onTouchMove}
              @touchend=${this._onTouchEnd}
            ></canvas>`}
      </div>
    `}};Y.styles=z`
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
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      overflow: hidden;
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
    .card-icon {
      font-size: 18px;
      opacity: 0.7;
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
  `,X([h({attribute:!1})],Y.prototype,"hass",2),X([h({type:String})],Y.prototype,"date",2),X([h({type:Boolean})],Y.prototype,"clamped",2),X([h({type:Boolean})],Y.prototype,"noHeader",2),X([h({type:Boolean})],Y.prototype,"noAxisLabels",2),X([h({type:Boolean,reflect:!0})],Y.prototype,"noYAxis",2),X([h({type:Boolean})],Y.prototype,"showSlots",2),X([h({type:Boolean})],Y.prototype,"noSolarNoonMidnight",2),X([h({type:Number})],Y.prototype,"hoverTime",2),X([h({type:Number})],Y.prototype,"liveTime",2),X([h({type:Boolean,reflect:!0})],Y.prototype,"embedded",2),X([h({type:Boolean,reflect:!0})],Y.prototype,"sparkline",2),X([h({type:Object})],Y.prototype,"channels",2),X([h({type:String})],Y.prototype,"selectedChannelId",2),X([h({attribute:!1})],Y.prototype,"channelSlotsMap",2),X([h({attribute:!1})],Y.prototype,"days",2),X([h({attribute:!1})],Y.prototype,"sunData",2),X([h({type:Array})],Y.prototype,"slots",2),X([b()],Y.prototype,"_days",2),X([b()],Y.prototype,"_sunData",2),X([b()],Y.prototype,"_loading",2),X([b()],Y.prototype,"_w",2),Y=X([H("twilight-sun-path-card")],Y);var Ks=Object.defineProperty,Zs=Object.getOwnPropertyDescriptor,Dt=(t,e,i,a)=>{for(var s=a>1?void 0:a?Zs(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&Ks(e,i,s),s};let vt=class extends L{constructor(){super(...arguments),this.hass=null,this.slots=[],this.noHeader=!1,this.entities=[],this.loading=!1,this.channels={},this.selectedChannelId=T,this.templateMode=!1,this.date=new Date().toISOString().slice(0,10),this.channelSlotsMap={},this._menuOpen=!1,this._dialog=new fe(this),this._clock=new Ue(this),this._handleWindowClick=t=>{if(!this._menuOpen)return;t.composedPath().some(a=>a instanceof HTMLElement&&a.classList.contains("kebab-container"))||(this._menuOpen=!1)}}connectedCallback(){super.connectedCallback(),window.addEventListener("click",this._handleWindowClick)}disconnectedCallback(){window.removeEventListener("click",this._handleWindowClick),super.disconnectedCallback()}_toggleMenu(t){t.stopPropagation(),this._menuOpen=!this._menuOpen}_orderedChannelIds(){const t=Object.keys(this.channels);return this.templateMode?t.filter(e=>e!==T).sort():t.sort((e,i)=>e===T?-1:i===T?1:0)}_selectChannel(t){this._menuOpen=!1,this.dispatchEvent(new CustomEvent("channel-selected",{detail:{channelId:t},bubbles:!0,composed:!0}))}async _addChannel(){this._menuOpen=!1;const t=await this._dialog.showPrompt("New Channel","","Name of the new channel");t===null||t.trim()===""||this.dispatchEvent(new CustomEvent("channel-added",{detail:{name:t.trim()},bubbles:!0,composed:!0}))}async _renameChannel(){var i;this._menuOpen=!1;const t=((i=this.channels[this.selectedChannelId])==null?void 0:i.name)??"",e=await this._dialog.showPrompt("Rename Channel",t,"New channel name");e===null||e.trim()===""||this.dispatchEvent(new CustomEvent("channel-renamed",{detail:{channelId:this.selectedChannelId,name:e.trim()},bubbles:!0,composed:!0}))}async _deleteChannel(){var i;if(this._menuOpen=!1,this.selectedChannelId===T)return;const t=((i=this.channels[this.selectedChannelId])==null?void 0:i.name)??this.selectedChannelId;await this._dialog.showConfirm("Delete Channel",`Delete channel "${t}"? Its lights will be turned off.`)&&this.dispatchEvent(new CustomEvent("channel-deleted",{detail:{channelId:this.selectedChannelId},bubbles:!0,composed:!0}))}_toggleChannelEnabled(){if(this._menuOpen=!1,this.selectedChannelId===T)return;const t=this.channels[this.selectedChannelId];t&&this.dispatchEvent(new CustomEvent("channel-enabled-toggled",{detail:{channelId:this.selectedChannelId,enabled:!t.enabled},bubbles:!0,composed:!0}))}_fireEditRequested(){this.dispatchEvent(new CustomEvent("edit-requested",{bubbles:!0,composed:!0}))}render(){const t=this._clock.liveMins,e=this.templateMode?-1:this.slots.findIndex(a=>ge(a,t)),i=e!==-1?[...this.slots.slice(e),...this.slots.slice(0,e)]:this.slots;return r`
      <div class="slot-card">
        ${this.noHeader?"":r`
          <div class="slot-card-header">
            <span class="devices-card-icon">🌅</span>
            <span class="slot-card-title">Timetable</span>
            <div class="kebab-container">
              <button class="edit-btn" @click=${this._toggleMenu}>⋮</button>
              ${this._menuOpen?r`
                <div class="dropdown-menu">
                  ${(()=>{var l;const a=this.selectedChannelId&&this.selectedChannelId!==T&&!!this.channels[this.selectedChannelId],s=this._orderedChannelIds(),n=(this.templateMode?s.length:s.filter(c=>c!==T).length)>=ys;return r`
                      <button class="dropdown-item" @click=${()=>{this._menuOpen=!1,this._fireEditRequested()}}>
                        📝 Edit Slots
                      </button>
                      <button class="dropdown-item" ?disabled=${n} @click=${this._addChannel}>
                        ➕ ${n?"Add channel (max reached)":"Add channel"}
                      </button>
                      ${a?r`
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
            ${this._orderedChannelIds().map(a=>{const s=this.channels[a],o=a===this.selectedChannelId,n=(s==null?void 0:s.enabled)===!1;return r`
                <button
                  class="channel-tab ${o?"active":""} ${n?"disabled":""}"
                  @click=${()=>this._selectChannel(a)}
                  title=${n?"Channel disabled":""}
                >${(s==null?void 0:s.name)||a}</button>
              `})}
          </div>
        `}
        ${!this.templateMode&&!this.loading?r`
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
          ${this.loading?r`<div class="entity-list-empty">Loading…</div>`:i.length>0?i.map(a=>{const s=!this.templateMode&&ge(a,t),o=this.templateMode?a.startType==="fixed"?a.fixedStartTime||"12:00":`${a.startEvent||"astral"}${a.startOffset?a.startOffset>0?` +${a.startOffset}m`:` ${a.startOffset}m`:""}`:`${ne(a.from)} → ${ne(a.to)}`;return r`
                    <div class="slot-summary-row ${s?"active":""}">
                      <div class="slot-color-dot" style="background:${a.color}; box-shadow:${s?`0 0 6px ${a.color}`:"none"}"></div>
                      <span class="slot-summary-label">${a.label}</span>
                      <span class="slot-summary-scene">
                        ${a.scene?mi(this.hass,a.scene):"—"}
                      </span>
                      <span class="slot-summary-time">${o}</span>
                    </div>
                  `}):r`<div class="entity-list-empty">${this.templateMode?"No custom channels in template. Click ⋮ → Add channel":"No slots configured."}</div>`}
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
    `}};vt.styles=z`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      font-family: var(--font-family, inherit);
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      overflow: hidden;
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

    .devices-card-icon {
      font-size: 18px;
      opacity: 0.7;
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
  `,Dt([h({attribute:!1})],vt.prototype,"hass",2),Dt([h({type:Array})],vt.prototype,"slots",2),Dt([h({type:Boolean})],vt.prototype,"noHeader",2),Dt([h({type:Array})],vt.prototype,"entities",2),Dt([h({type:Boolean})],vt.prototype,"loading",2),Dt([h({attribute:!1})],vt.prototype,"channels",2),Dt([h({type:String})],vt.prototype,"selectedChannelId",2),Dt([h({type:Boolean})],vt.prototype,"templateMode",2),Dt([h({type:String})],vt.prototype,"date",2),Dt([h({attribute:!1})],vt.prototype,"channelSlotsMap",2),Dt([b()],vt.prototype,"_menuOpen",2),vt=Dt([H("twilight-timetable-card")],vt);function Ca(t,e){var i;try{const a=e||document.body,s=document.createElement("div");s.style.color="var(--primary-text-color)",a.appendChild(s);const o=window.getComputedStyle(s).color;if(a.removeChild(s),o)return Js(o)}catch{}return((i=t==null?void 0:t.themes)==null?void 0:i.darkMode)!==void 0?!!t.themes.darkMode:!!(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)}function Js(t){const e=t.toLowerCase().trim();if(e==="white"||e.startsWith("#fff")||e.includes("255,255,255")||e.includes("255, 255, 255"))return!0;if(e==="black"||e==="#000"||e==="#000000"||e.includes("0,0,0")||e.includes("0, 0, 0"))return!1;if(e.startsWith("#")){const a=e.substring(1);let s=0,o=0,n=0;return a.length===3||a.length===4?(s=parseInt(a[0]+a[0],16),o=parseInt(a[1]+a[1],16),n=parseInt(a[2]+a[2],16)):a.length>=6&&(s=parseInt(a.substring(0,2),16),o=parseInt(a.substring(2,4),16),n=parseInt(a.substring(4,6),16)),(.299*s+.587*o+.114*n)/255>.5}const i=e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);if(i){const a=parseInt(i[1],10),s=parseInt(i[2],10),o=parseInt(i[3],10);return(.299*a+.587*s+.114*o)/255>.5}return!1}function Ei(t,e){if(!t)return r`<span>—</span>`;const i=s=>s?r`<div style="width:10px; height:10px; border-radius:3px; background:${s}; flex-shrink:0;"></div>`:"",a=(s,o,n)=>r`
    <div style="display:flex; justify-content:center; align-items:center; gap:6px;">
      ${i(o)}
      <span class=${n?`mismatch-badge ${e}`:""}>${s}</span>
    </div>`;return t.deviates?r`
    <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
      ${a(t.actual,t.actual_swatch,!1)}
      ${a(t.target,t.target_swatch,!0)}
    </div>`:a(t.actual,t.actual_swatch,!1)}var Qs=Object.defineProperty,to=Object.getOwnPropertyDescriptor,me=(t,e,i,a)=>{for(var s=a>1?void 0:a?to(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&Qs(e,i,s),s};let Zt=class extends L{constructor(){super(...arguments),this.open=!1,this.hass=null,this.entities=[],this.manualOnly=!1,this._pickerValue=""}updated(t){super.updated(t),t.has("open")&&this.open&&xi()}_closeDialog(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_toggleManualOnly(){const t=!this.manualOnly;this.dispatchEvent(new CustomEvent("mode-changed",{detail:{manualOnly:t},bubbles:!0,composed:!0}))}_toggleEntity(t){const e=this.entities.map(i=>i.entity_id===t?{...i,isManual:!i.isManual}:i);this._fireChange(e)}_addEntity(t){var a,s,o;if(!t)return;const e=this.entities.find(n=>n.entity_id===t);let i=[...this.entities];if(e)e.isManual||(i=this.entities.map(n=>n.entity_id===t?{...n,isManual:!0}:n));else{const n=((o=(s=(a=this.hass)==null?void 0:a.states[t])==null?void 0:s.attributes)==null?void 0:o.friendly_name)??t,l=t.split(".")[0];i=[...this.entities,{entity_id:t,name:n,domain:l,in_area:!1,isManual:!0,isExtracted:!1,checked:!0}]}this._fireChange(i),this._pickerValue=""}_fireChange(t){this.dispatchEvent(new CustomEvent("lights-changed",{detail:{entities:t},bubbles:!0,composed:!0}))}render(){if(!this.open)return r``;const t=this.entities.filter(s=>s.isExtracted&&(s.domain==="light"||s.domain==="switch")),e=this.entities.filter(s=>s.in_area&&!s.isExtracted&&(s.domain==="light"||s.domain==="switch")),i=this.entities.filter(s=>!s.in_area&&s.isManual&&(s.domain==="light"||s.domain==="switch")),a=this.entities.some(s=>s.isManual);return r`
      <div class="overlay" @click=${s=>{s.target===s.currentTarget&&this._closeDialog()}}>
        <div class="edit-panel" style="max-width: 1000px;">
          <div class="panel-header">
            <span class="panel-header-icon">💡</span>
            <span class="panel-header-title">Area Lights — Configuration</span>
            <button class="panel-close" @click=${this._closeDialog}>✕</button>
          </div>

          <div class="panel-body">
            ${t.length>0?r`
              <div class="list-section-label">Entities in Scene (Automatically Controlled)</div>
              <div class="grid-list">
                ${t.map(s=>r`
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
              ${e.map(s=>r`
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

            ${i.length>0?r`
              <div class="divider"></div>
              <div class="list-section-label">Additional Entities (Manually Added)</div>
              <div class="grid-list">
                ${i.map(s=>r`
                  <div class="picker-row" @click=${()=>this._toggleEntity(s.entity_id)}>
                    <div class="picker-checkbox checked"></div>
                    <div style="flex: 1; min-width: 0;">
                      <div style="display:flex; align-items:center; gap:8px;">
                        <span class="picker-label">${s.name}</span>
                        ${s.isExtracted?r`
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

            ${a?r`
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
    `}};Zt.styles=[jt,z`
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
    `],me([h({type:Boolean})],Zt.prototype,"open",2),me([h({attribute:!1})],Zt.prototype,"hass",2),me([h({type:Array})],Zt.prototype,"entities",2),me([h({type:Boolean})],Zt.prototype,"manualOnly",2),me([b()],Zt.prototype,"_pickerValue",2),Zt=me([H("twilight-area-lights-dialog")],Zt);var eo=Object.defineProperty,io=Object.getOwnPropertyDescriptor,Yt=(t,e,i,a)=>{for(var s=a>1?void 0:a?io(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&eo(e,i,s),s};let Mt=class extends L{constructor(){super(...arguments),this.hass=null,this.activeSceneName="No Scene Active",this.noHeader=!1,this.runState=null,this.entities=[],this.manualOnly=!1,this._editOpen=!1,this._isDark=!1}willUpdate(t){t.has("hass")&&(this._isDark=Ca(this.hass,this))}_toggleManualOnly(t){this.manualOnly=t.detail.manualOnly,this.dispatchEvent(new CustomEvent("mode-changed",{detail:{manualOnly:this.manualOnly},bubbles:!0,composed:!0}))}_onLightsChanged(t){this.entities=t.detail.entities,this.dispatchEvent(new CustomEvent("lights-changed",{detail:{entities:this.entities},bubbles:!0,composed:!0}))}render(){var n;const t=((n=this.runState)==null?void 0:n.light_states)??{},e=this._isDark?"dark":"light",i=Object.keys(t).length>0;let a=[],s=[];i?Object.keys(t).forEach(l=>{const c=t[l],u=this.entities.find(f=>f.entity_id===l),g=u?!!u.isExtracted:!0,p=u?!!u.isManual:!1,d={entity_id:l,name:c.name||(u==null?void 0:u.name)||l,actual_on:c.actual_on,on:c.on,brightness:c.brightness,color:c.color};g?a.push(d):p?s.push(d):a.push(d)}):this.entities.forEach(l=>{const c=!!l.isManual,u=!!l.isExtracted;if(!c&&!u)return;const g={entity_id:l.entity_id,name:l.name||l.entity_id,actual_on:!1,on:null,brightness:null,color:null};u?a.push(g):s.push(g)});const o=a.length+s.length;return this.manualOnly,r`
      <div class="devices-card">
        ${this.noHeader?"":r`
          <div class="devices-card-header">
            <span class="devices-card-icon">💡</span>
            <span class="devices-card-title">Area Lights</span>
            <div class="active-scene-wrap">
              <span class="active-scene-label">Active Scene:</span>
              <span class="active-scene-value">${this.activeSceneName}</span>
            </div>
            <button class="edit-btn" @click=${()=>{this._editOpen=!0}} title="Configure Lights">⋮</button>
          </div>
        `}

        <div class="table-container">
          ${o===0?r`<div style="padding: 12px 0; font-size: 13px; color: var(--secondary-text-color); font-style: italic;">No lights configured</div>`:r`
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
                    ${a.length>0?r`
                      <tr class="section-row">
                        <td colspan="4">Scene Lights (Extracted)</td>
                      </tr>
                      ${a.map(l=>this._renderTableRow(l,e))}
                    `:""}

                    ${s.length>0?r`
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

      <twilight-area-lights-dialog
        .open=${this._editOpen}
        .hass=${this.hass}
        .entities=${this.entities}
        .manualOnly=${this.manualOnly}
        @close=${()=>{this._editOpen=!1}}
        @mode-changed=${this._toggleManualOnly}
        @lights-changed=${this._onLightsChanged}
      ></twilight-area-lights-dialog>
    `}_renderTableRow(t,e){const i=t.actual_on?"var(--success-color, #4caf50)":"color-mix(in srgb, var(--primary-text-color) 15%, transparent)";return r`
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
        <td style="text-align: center; font-weight: 500; vertical-align: top; padding-top: 10px;">${Ei(t.on,e)}</td>
        <td style="text-align: center; font-weight: 500; vertical-align: top; padding-top: 10px;">${Ei(t.brightness,e)}</td>
        <td style="text-align: center; font-weight: 500; vertical-align: top; padding-top: 10px;">${Ei(t.color,e)}</td>
      </tr>
    `}};Mt.styles=z`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      font-family: var(--font-family, inherit);
      background: rgba(255, 255, 255, 0.03);
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

    .devices-card-icon {
      font-size: 18px;
      opacity: 0.7;
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
  `,Yt([h({attribute:!1})],Mt.prototype,"hass",2),Yt([h({type:String})],Mt.prototype,"activeSceneName",2),Yt([h({type:Boolean})],Mt.prototype,"noHeader",2),Yt([h({attribute:!1})],Mt.prototype,"runState",2),Yt([h({type:Array})],Mt.prototype,"entities",2),Yt([h({type:Boolean})],Mt.prototype,"manualOnly",2),Yt([b()],Mt.prototype,"_editOpen",2),Yt([b()],Mt.prototype,"_isDark",2),Mt=Yt([H("twilight-area-lights-card")],Mt);function Sa(t){switch(t){case"min":return"Minimum";case"max":return"Maximum";case"mean":return"Average";case"median":return"Median";default:return"Minimum"}}class Oi{constructor(e,i={}){this._prevOpen=!1,this.draft=null,this.draggedIndex=null,this._host=e,this._options=i,this._host.addController(this)}hostConnected(){}hostDisconnected(){}hostUpdate(){var e,i;this._host.open!==this._prevOpen&&(this._prevOpen=this._host.open,this._host.open?(this.draft=this._host.config?structuredClone(this._host.config):null,(i=(e=this._options).onOpen)==null||i.call(e),xi()):this.draft=null)}closeDiscard(){this._host.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}closeAndSave(e){this._host.dispatchEvent(e),this._host.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}onDragStart(e,i){this.draggedIndex=i,e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",String(i)))}onDragOver(e,i){if(e.preventDefault(),this.draggedIndex===null||this.draggedIndex===i||!Array.isArray(this.draft))return;const a=[...this.draft],s=a[this.draggedIndex];a.splice(this.draggedIndex,1),a.splice(i,0,s),this.draft=a,this.draggedIndex=i,this._host.requestUpdate()}onDragEnd(){this.draggedIndex=null}}const Da=!1,Aa="none";function Ii(t,e){const i=t.lux_threshold!==null&&t.lux_threshold!==void 0?t.lux_threshold:(e==null?void 0:e.lux_threshold)??30,a=t.lux_watch_window!==null&&t.lux_watch_window!==void 0?t.lux_watch_window:(e==null?void 0:e.lux_watch_window)??10,s=t.lux_ignore_active!==null&&t.lux_ignore_active!==void 0?t.lux_ignore_active:Da,o=t.lux_ignore_scope!==null&&t.lux_ignore_scope!==void 0?t.lux_ignore_scope:Aa;return{threshold:i,watch:a,ignoreActive:s,ignoreScope:o}}function qe(t){const e=`lux ≤ ${t.threshold} lx`+(t.watch?` (watch: ${t.watch}s)`:""),i=[t.ignoreActive?"ignore when active":"",t.ignoreScope==="twilight_slots"?"ignore twilight/night":"",t.ignoreScope==="all_slots"?"ignore lux (all slots)":""].filter(Boolean).join(", ");return`${e}${i?` · ${i}`:""}`}function zi(t,e){const i=t.entity_ids??[];if(i.length===0)return{friendlyName:"No entities configured",subText:"—"};const a=i.map(n=>{var l,c;return((c=(l=e==null?void 0:e.states[n])==null?void 0:l.attributes)==null?void 0:c.friendly_name)??n});let s=a.join(", ");s.length>35&&a.length>1&&(s=`${a[0]} + ${a.length-1} more`);let o=i.join(", ");if(o.length>50&&i.length>1&&(o=`${i[0]} + ${i.length-1} more`),t.type==="motion"){const n=t.retrigger??"every";o+=` [retrigger: ${n}]`}else if(i.length>=2&&t.type==="binary"){const n=t.aggregation??"any",l=n==="count"?`count:${t.aggregation_count??1}`:n;o+=` [combine: ${l}]`}return{friendlyName:s,subText:o}}function Ye(t,e){const a=e.filter(s=>s.type===t.type).indexOf(t)+1;return`${t.type}_${a}`}function Ta(t){const e=t.trim();if(e==="")return null;const i=e.split(":");if(i.length<1||i.length>3||!i.every(n=>/^\d+$/.test(n)))return null;const[a,s=0,o=0]=i.map(n=>parseInt(n,10));return a>23||s>59||o>59?null:[a,s,o]}function ao(t){const e=Ta(t);if(e===null)return null;const i=a=>String(a).padStart(2,"0");return`${i(e[0])}:${i(e[1])}:${i(e[2])}`}function Mi(t){return t.trim()===""||Ta(t)!==null}function so(t){return t.map(i=>i==="no_entity"?"No entity configured":i==="user"?"Disabled by user":i.startsWith("activity:")?`Suppressed by: ${i.substring(9)}`:i).join(", ")}var oo=Object.defineProperty,no=Object.getOwnPropertyDescriptor,Jt=(t,e,i,a)=>{for(var s=a>1?void 0:a?no(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&oo(e,i,s),s};let Ht=class extends L{constructor(){super(...arguments),this.open=!1,this.hass=null,this.config=[],this.templateMode=!1,this._subEditOpen=!1,this._subEditingIndex=null,this._editDraft=null,this._draftController=new Oi(this,{onOpen:()=>{this._subEditOpen=!1}})}_closeAndSave(){const t=this._draftController.draft??this.config;this._draftController.closeAndSave(new hi([...t]))}_openAddSensor(){this._subEditingIndex=null,this._editDraft={id:"",name:void 0,type:"illuminance",entity_ids:[],aggregation:void 0},this._subEditOpen=!0}_openEditSensor(t){const e=this._draftController.draft;if(!e)return;const i=e[t];this._subEditingIndex=t,this._editDraft={id:i.id??"",name:i.name??void 0,type:i.type,entity_ids:i.entity_ids??[],aggregation:i.aggregation??void 0},this._subEditOpen=!0}_removeSensor(t){if(!this._draftController.draft)return;const e=[...this._draftController.draft];e.splice(t,1),this._draftController.draft=e,this.requestUpdate()}_saveSubEdit(){if(!this._editDraft||!this._draftController.draft)return;const t=[...this._draftController.draft],e=this._subEditingIndex;e===null?t.push(this._editDraft):t[e]=this._editDraft,this._editDraft.name||(this._editDraft.name=Ye(this._editDraft,t)),this._draftController.draft=t,this._subEditOpen=!1,this._editDraft=null,this.requestUpdate()}render(){if(!this.open||!this._draftController.draft)return r``;const t=this._draftController.draft,e=t.some(i=>i.type==="illuminance");return r`
      <div class="overlay" @click=${i=>{i.target===i.currentTarget&&!this._subEditOpen&&this._draftController.closeDiscard()}}>
        <div class="edit-panel list-panel" style="${this._subEditOpen?"display: none;":""}">
          <div class="panel-header">
            <span class="panel-header-icon">📡</span>
            <span class="panel-header-title">Sensors — Configuration</span>
            <button class="panel-close" @click=${()=>this._draftController.closeDiscard()}>✕</button>
          </div>

          <div class="panel-body">
            <div class="list-section-label">Configured Sensors</div>
            <table class="sensor-table">
              <thead>
                <tr>
                  <th style="min-width: 150px;">Name</th>
                  <th style="min-width: 80px;">Type</th>
                  <th style="min-width: 220px;">Entities / Aggregation</th>
                  <th style="min-width: 100px; text-align: center;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${t.map((i,a)=>{const s=this.templateMode?(i.entity_ids||[]).join(", ")||"Template Sensor (No Entities)":(i.entity_ids||[]).map(n=>{var l,c,u;return((u=(c=(l=this.hass)==null?void 0:l.states[n])==null?void 0:c.attributes)==null?void 0:u.friendly_name)??n}).join(", ")||"—",o=Sa(i.aggregation);return r`
                    <tr class="sensor-row">
                      <td>
                        <div style="font-weight: 600;">${i.name||Ye(i,t)||i.id}</div>
                        ${i.name&&i.id?r`<div style="font-size: 10px; font-family: monospace; opacity: 0.5;">${i.id}</div>`:""}
                      </td>
                      <td>
                        <span class="type-badge ${i.type}">${i.type}</span>
                      </td>
                      <td>
                        <div style="font-weight: 500; word-break: break-word;">${s}</div>
                        <div style="font-size: 11px; color: var(--secondary-text-color); margin-top: 2px;">
                          Aggregation: <strong>${o}</strong>
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
                ${t.length===0?r`
                  <tr>
                    <td colspan="4" style="text-align: center; color: var(--secondary-text-color); font-style: italic; padding: 16px;">
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
              ${e?r`
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
        ${this._subEditOpen&&this._editDraft?r`
          <div class="edit-panel" @click=${i=>i.stopPropagation()}>
            <div class="panel-header">
              <span class="panel-header-icon">📡</span>
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
                  @input=${i=>{this._editDraft={...this._editDraft,name:i.target.value.trim()||void 0}}}
                />
              </div>

              <div class="form-field">
                <label class="form-label">Sensor Type</label>
                <select class="option-select" disabled>
                  <option value="illuminance">Illuminance</option>
                </select>
              </div>

              ${this.templateMode?"":r`
                <div class="form-field">
                  <label class="form-label">Entities</label>
                  <table class="entity-table">
                    <tbody>
                      ${(this._editDraft.entity_ids||[]).map((i,a)=>{var o,n,l;const s=this.templateMode?i:((l=(n=(o=this.hass)==null?void 0:o.states[i])==null?void 0:n.attributes)==null?void 0:l.friendly_name)??i;return r`
                          <tr class="entity-row">
                            <td style="padding: 6px 0;">
                              <div style="font-weight: 500;">${s}</div>
                              <div style="font-size: 11px; color: var(--secondary-text-color); font-family: monospace;">${i}</div>
                            </td>
                            <td style="text-align: right; width: 40px;">
                              <button class="entity-remove-btn" @click=${()=>{this._editDraft={...this._editDraft,entity_ids:(this._editDraft.entity_ids||[]).filter((c,u)=>u!==a)}}}>✕</button>
                            </td>
                          </tr>
                        `})}
                      ${(this._editDraft.entity_ids||[]).length===0?r`
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
    `}};Ht.styles=[jt,z`
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
        background: rgba(255, 193, 7, 0.18);
        border: 1px solid rgba(255, 193, 7, 0.4);
        color: #ffc107;
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
    `],Jt([h({type:Boolean})],Ht.prototype,"open",2),Jt([h({attribute:!1})],Ht.prototype,"hass",2),Jt([h({attribute:!1})],Ht.prototype,"config",2),Jt([h({type:Boolean})],Ht.prototype,"templateMode",2),Jt([b()],Ht.prototype,"_subEditOpen",2),Jt([b()],Ht.prototype,"_subEditingIndex",2),Jt([b()],Ht.prototype,"_editDraft",2),Ht=Jt([H("twilight-sensors-dialog")],Ht);var ro=Object.defineProperty,lo=Object.getOwnPropertyDescriptor,xe=(t,e,i,a)=>{for(var s=a>1?void 0:a?lo(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&ro(e,i,s),s};let Qt=class extends L{constructor(){super(...arguments),this.hass=null,this.config=[],this.noHeader=!1,this.templateMode=!1,this._editOpen=!1}_openEdit(){this._editOpen=!0}render(){return r`
      <div class="devices-card">
        ${this.noHeader?"":r`
          <div class="devices-card-header">
            <span class="devices-card-icon">📡</span>
            <span class="devices-card-title">Sensors</span>
            <button class="edit-btn" @click=${this._openEdit}>⋮</button>
          </div>
        `}
        <div class="entity-list">
          ${(this.config||[]).map((t,e)=>{const i=t.entity_ids||[],a=this.templateMode?i.length>0?i.join(", "):"Template Sensor (No Entities)":i.map(o=>{var n,l,c;return((c=(l=(n=this.hass)==null?void 0:n.states[o])==null?void 0:l.attributes)==null?void 0:c.friendly_name)??o}).join(", ")||"—",s=Sa(t.aggregation||"min");return r`
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
              ${e<this.config.length-1?r`<div class="divider"></div>`:""}
            `})}
          ${!this.config||this.config.length===0?r`
            <div class="empty-state">No sensors configured. Click edit to configure.</div>
          `:""}
        </div>
      </div>

      <twilight-sensors-dialog
        .open=${this._editOpen}
        .hass=${this.hass}
        .config=${this.config||[]}
        .templateMode=${this.templateMode}
        @close=${()=>{this._editOpen=!1}}
      ></twilight-sensors-dialog>
    `}};Qt.styles=z`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      font-family: var(--font-family, inherit);
      background: rgba(255, 255, 255, 0.03);
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

    .devices-card-icon {
      font-size: 18px;
      opacity: 0.7;
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
      background: rgba(255, 193, 7, 0.18);
      border: 1px solid rgba(255, 193, 7, 0.4);
      color: #ffc107;
    }

    .agg-badge {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      padding: 2px 8px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.06);
      color: var(--secondary-text-color);
      border: 1px solid rgba(255, 255, 255, 0.12);
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
  `,xe([h({attribute:!1})],Qt.prototype,"hass",2),xe([h({attribute:!1})],Qt.prototype,"config",2),xe([h({type:Boolean})],Qt.prototype,"noHeader",2),xe([h({type:Boolean})],Qt.prototype,"templateMode",2),xe([b()],Qt.prototype,"_editOpen",2),Qt=xe([H("twilight-sensors-card")],Qt);const co="respect_lux",Pi="slot",Ea="turn_off";function Ni(t){return{auto_expire:(t==null?void 0:t.auto_expire)??"03:00:00",transition_off_seconds:(t==null?void 0:t.transition_off_seconds)??0,expire_check_mode:co,action_type:Pi,release_action_type:Ea}}function Oa(t){const e=t.trim();if(e==="")return null;const i=e.split(":");if(i.length>3||!i.every(s=>/^\d+$/.test(s)))return null;const a=i.map(s=>parseInt(s,10));return a.length===1?a[0]:a.length===2?a[0]*60+a[1]:a[0]*3600+a[1]*60+a[2]}function po(t){const e=Math.floor(t/3600),i=Math.floor(t%3600/60),a=t%60,s=o=>String(o).padStart(2,"0");return`${s(e)}:${s(i)}:${s(a)}`}function ho(t){const e=Oa(t);return e===null?null:po(e)}function Li(t){return t.trim()===""||Oa(t)!==null}function Ia(t,e){const i=t??e;if(i==null)return"—";if(i==="00:00:00"||i===0||i==="0")return"none";if(typeof i=="number")return i>=60?`${i/60}h`:`${i}m`;const a=i.split(":");if(a.length===3){const s=parseInt(a[0],10),o=parseInt(a[1],10),n=parseInt(a[2],10);let l="";return s>0&&(l+=`${s}h `),o>0&&(l+=`${o}m `),n>0&&(l+=`${n}s`),l.trim()||"none"}return i}function za(t){var i;const e=(t==null?void 0:t.type)||Pi;return e==="slot"?"slot":e==="none"?"none":e==="reset"?"reset":e==="simulation"?"simulation":e==="entity"?`entity: ${((t==null?void 0:t.entity_id)||"").split(".")[1]||(t==null?void 0:t.entity_id)||"—"}`:e==="light"?`lights: ${((i=t==null?void 0:t.targets)==null?void 0:i.length)??0}`:e}function Ma(t){const e=(t==null?void 0:t.type)||Ea;return e==="turn_off"?"turn off":e==="slot"?"restore slot":e==="none"?"nothing":e}function Ve(t,e){var a;const i=e==null?void 0:e.find(s=>s.id===t);return(a=i==null?void 0:i.action)!=null&&a.type?i.action.type:Pi}function Pa(t){return!t||t.length===0?[{id:"sleep",suppress_inputs:[],auto_expire:null}]:t}var uo=Object.defineProperty,go=Object.getOwnPropertyDescriptor,Ut=(t,e,i,a)=>{for(var s=a>1?void 0:a?go(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&uo(e,i,s),s};let At=class extends L{constructor(){super(...arguments),this.open=!1,this.hass=null,this.input=null,this.editIndex=null,this.activities=[],this.placeholderDefaults=null,this.templateMode=!1,this.siblings=[],this._editDraft=null}willUpdate(t){(t.has("open")||t.has("input"))&&(this.open&&this.input?this._editDraft={...this.input}:this.open||(this._editDraft=null))}_cancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}_isSaveDisabled(t){const e=!this.templateMode&&t.type!=="timer"&&t.type!=="button"&&(!t.entity_ids||t.entity_ids.length===0),i=t.type==="timer"&&!Mi(t.trigger_time??"");return e||i||!t.activity}_save(){if(!this._editDraft||this._isSaveDisabled(this._editDraft))return;const t={...this._editDraft,enabled:this.templateMode?!0:this._editDraft.enabled};if(t.type==="timer"?(t.trigger_time=ao(t.trigger_time??"")??"00:00:00",delete t.entity_ids,delete t.aggregation,delete t.aggregation_count,delete t.retrigger,delete t.event_type,delete t.lux_threshold,delete t.lux_watch_window,delete t.lux_ignore_active,delete t.lux_ignore_scope,delete t.label,delete t.button_mode,delete t.create_entity):t.type==="button"?(delete t.entity_ids,delete t.aggregation,delete t.aggregation_count,delete t.retrigger,delete t.event_type,delete t.lux_threshold,delete t.lux_watch_window,delete t.lux_ignore_active,delete t.lux_ignore_scope):(delete t.trigger_time,delete t.label,delete t.button_mode,delete t.create_entity,t.type!=="event"&&delete t.event_type,t.type!=="motion"&&(delete t.lux_threshold,delete t.lux_watch_window,delete t.lux_ignore_active,delete t.lux_ignore_scope),t.type!=="motion"&&delete t.retrigger,t.type!=="binary"&&(delete t.aggregation,delete t.aggregation_count)),!t.name){const e=this.editIndex,i=e===null?[...this.siblings,t]:this.siblings.map((a,s)=>s===e?t:a);t.name=t.label||Ye(t,i)}this.dispatchEvent(new CustomEvent("save",{detail:t,bubbles:!0,composed:!0}))}_getIncludeDomains(t){return t==="binary"?["input_boolean","binary_sensor"]:t==="event"?["event"]:t==="motion"?["binary_sensor","device_tracker"]:[]}render(){var n,l,c,u,g,p;if(!this.open||!this._editDraft)return r``;const t=this._editDraft,e=this.editIndex!==null,i=this._isSaveDisabled(t),a=this._getIncludeDomains(t.type),s=((n=t.entity_ids)==null?void 0:n[0])||"",o=t.type==="event"&&s&&((u=(c=(l=this.hass)==null?void 0:l.states[s])==null?void 0:c.attributes)==null?void 0:u.event_types)||[];return r`
      <div class="overlay" style="z-index: 1100;" @click=${d=>{d.target===d.currentTarget&&this._cancel()}}>
        <div class="edit-panel" style="max-width: 560px; max-height: calc(100vh - 120px);">
          <div class="panel-header">
            <span class="panel-header-icon">🔌</span>
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
                  @input=${d=>{this._editDraft={...this._editDraft,name:d.target.value.trim()||void 0}}}
                />
              </div>

              ${this.templateMode?"":r`
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
                  <select class="option-select" .value=${t.type} @change=${d=>{this._editDraft={...this._editDraft,type:d.target.value,entity_ids:[],aggregation:void 0,aggregation_count:void 0,retrigger:void 0,event_type:void 0,lux_threshold:null,lux_watch_window:null,lux_ignore_active:null,lux_ignore_scope:null,trigger_time:"00:00:00",label:"",button_mode:"click"}}}>
                    <option value="binary">Binary</option>
                    <option value="button">Button</option>
                    <option value="event">Event</option>
                    <option value="motion">Motion</option>
                    <option value="timer">Timer</option>
                  </select>
                </div>

                <div class="form-field">
                  <span class="form-label">Target Activity</span>
                  <select class="option-select" @change=${d=>{this._editDraft={...this._editDraft,activity:d.target.value}}}>
                    ${this.activities.map(d=>r`
                      <option value="${d}" ?selected=${d===t.activity}>${d}</option>
                    `)}
                  </select>
                </div>
              </div>

              ${t.type==="timer"?r`
                <div class="form-field">
                  <span class="form-label">Trigger Time (HH:MM:SS)</span>
                  <input
                    type="text"
                    class="activity-input ${Mi(t.trigger_time??"")?"":"invalid"}"
                    .value=${t.trigger_time??"00:00:00"}
                    placeholder="22:00:00"
                    @input=${d=>{this._editDraft={...this._editDraft,trigger_time:d.target.value.trim()}}}
                  />
                  <span class="form-hint">Accepts <code>22</code>, <code>22:30</code> or <code>22:30:15</code> — saved as HH:MM:SS.</span>
                  ${Mi(t.trigger_time??"")?"":r`
                    <span class="form-error">Enter a time like 22, 22:30 or 22:30:15 (0–23h).</span>
                  `}
                </div>
              `:t.type==="button"?r`
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
                    <select class="option-select" .value=${t.button_mode??"click"} @change=${d=>{this._editDraft={...this._editDraft,button_mode:d.target.value}}}>
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
              `:this.templateMode?"":r`
                <div class="form-field">
                  <span class="form-label">Entities</span>
                  <table class="sensor-table">
                    <tbody>
                      ${(t.entity_ids||[]).map((d,f)=>{var w,k,v;const x=((v=(k=(w=this.hass)==null?void 0:w.states[d])==null?void 0:k.attributes)==null?void 0:v.friendly_name)??d;return r`
                          <tr class="sensor-row">
                            <td style="padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                              <div style="font-weight: 500; font-size: 13px;">${x}</div>
                              <div style="font-size: 11px; color: var(--secondary-text-color); font-family: monospace;">${d}</div>
                            </td>
                            <td style="text-align: center; width: 40px; padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                              <button class="sensor-remove-btn" title="Remove entity" @click=${()=>{this._editDraft={...this._editDraft,entity_ids:(this._editDraft.entity_ids||[]).filter((m,C)=>C!==f)}}}>✕</button>
                            </td>
                          </tr>
                        `})}
                      ${!t.entity_ids||t.entity_ids.length===0?r`
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
                    @value-changed=${d=>{const f=d.detail.value;if(f){const x=this._editDraft.entity_ids||[];x.includes(f)||(this._editDraft={...this._editDraft,entity_ids:[...x,f]});const w=d.target;w&&(w.value="")}}}
                  ></ha-entity-picker>
                </div>
              `}

              ${t.type==="motion"?r`
                <div class="form-field" style="margin-top: 4px;">
                  <span class="form-label">Re-trigger</span>
                  <select class="option-select" .value=${t.retrigger??"every"} @change=${d=>{this._editDraft={...this._editDraft,retrigger:d.target.value||void 0}}}>
                    <option value="every">Every motion re-triggers the activity</option>
                    <option value="first">Only the first motion triggers the activity</option>
                  </select>
                  <span class="form-hint">Whether every motion re-triggers the activity, or only the first activation does.</span>
                </div>
              `:""}

              ${t.type==="binary"?r`
                <div class="form-field" style="margin-top: 4px;">
                  <span class="form-label">Combine multiple sensors</span>
                  <select class="option-select" .value=${t.aggregation??"any"} @change=${d=>{const f=d.target.value||void 0;this._editDraft={...this._editDraft,aggregation:f,aggregation_count:f!=="count"?void 0:this._editDraft.aggregation_count}}}>
                    <option value="any">Any (active if at least one is active)</option>
                    <option value="all">All (active only if all are active)</option>
                    <option value="count">Count (active if N or more are active)</option>
                  </select>
                  <span class="form-hint">How the states of multiple sensors combine into one active signal.</span>
                </div>

                ${t.aggregation==="count"?r`
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

              ${t.type==="event"&&(t.entity_ids||[]).length>0?r`
                <div class="form-field">
                  <span class="form-label">Event Type (Optional)</span>
                  ${o.length>0?r`
                    <select class="option-select" @change=${d=>{this._editDraft={...this._editDraft,event_type:d.target.value||void 0}}}>
                      <option value="" ?selected=${!t.event_type}>All Events</option>
                      ${o.map(d=>r`
                        <option value="${d}" ?selected=${d===t.event_type}>${d}</option>
                      `)}
                    </select>
                  `:r`
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

              ${t.type==="motion"?r`
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                  <div class="form-field">
                    <span class="form-label">Lux Threshold (lx)</span>
                    <input
                      type="number"
                      class="activity-input"
                      .placeholder=${String(((g=this.placeholderDefaults)==null?void 0:g.lux_threshold)??30)}
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
                      .placeholder=${String(((p=this.placeholderDefaults)==null?void 0:p.lux_watch_window)??10)}
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
    `}};At.styles=[jt,z`
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
    `],Ut([h({type:Boolean})],At.prototype,"open",2),Ut([h({attribute:!1})],At.prototype,"hass",2),Ut([h({attribute:!1})],At.prototype,"input",2),Ut([h({type:Number})],At.prototype,"editIndex",2),Ut([h({type:Array})],At.prototype,"activities",2),Ut([h({attribute:!1})],At.prototype,"placeholderDefaults",2),Ut([h({type:Boolean})],At.prototype,"templateMode",2),Ut([h({attribute:!1})],At.prototype,"siblings",2),Ut([b()],At.prototype,"_editDraft",2),At=Ut([H("twilight-input-row-editor")],At);function fo(t){return{id:"",name:void 0,type:"binary",activity:t,enabled:!0,entity_ids:[],aggregation:void 0,aggregation_count:void 0,retrigger:void 0,trigger_time:"00:00:00",event_type:void 0,lux_threshold:null,lux_watch_window:null,lux_ignore_active:Da,lux_ignore_scope:Aa,label:"",button_mode:"click",create_entity:!1}}var vo=Object.defineProperty,bo=Object.getOwnPropertyDescriptor,wt=(t,e,i,a)=>{for(var s=a>1?void 0:a?bo(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&vo(e,i,s),s};let ut=class extends L{constructor(){super(...arguments),this.open=!1,this.hass=null,this.config=[],this.activities=[],this.activitiesConfig=[],this.placeholderDefaults=null,this.runState=null,this.templateMode=!1,this.areaId=null,this._subEditOpen=!1,this._subEditingIndex=null,this._subEditInput=null,this._dialog=new fe(this),this._draftController=new Oi(this,{onOpen:()=>{this._subEditOpen=!1}})}_closeDiscard(){this._draftController.closeDiscard()}_closeAndSave(){this._draftController.closeAndSave(new ui(this._draftController.draft||[]))}_openAddInput(){this._subEditingIndex=null,this._subEditInput=fo(this.activities[0]||""),this._subEditOpen=!0}_openEditInput(t){const e=this._draftController.draft;e&&(this._subEditingIndex=t,this._subEditInput={...e[t]},this._subEditOpen=!0)}_onSubEditSave(t){const e=this._draftController.draft;if(!e)return;const i=t.detail,a=this._subEditingIndex,s=a===null?[...e,i]:e.map((o,n)=>n===a?i:o);this._draftController.draft=s,this._subEditOpen=!1,this.requestUpdate()}_onSubEditCancel(){this._subEditOpen=!1}_onRemoveInput(t){const e=this._draftController.draft;e&&(this._draftController.draft=e.filter((i,a)=>a!==t),this.requestUpdate())}_getResolvedMotionInfo(t){return Ii(t,this.placeholderDefaults)}render(){if(!this.open||!this._draftController.draft)return r``;const t=this._draftController.draft;return r`
      <div class="overlay" @click=${e=>{e.target===e.currentTarget&&!this._subEditOpen&&this._closeDiscard()}}>
        <div class="edit-panel list-panel">
          <div class="panel-header">
            <span class="panel-header-icon">🔌</span>
            <span class="panel-header-title">Inputs — Configuration</span>
            <button class="panel-close" @click=${this._closeDiscard}>✕</button>
          </div>

          <div class="panel-body">
            <div class="list-section-label">Configured Inputs</div>
            <table class="input-table">
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
                ${t.map((e,i)=>{var p,d;let a=r`—`,s=r`—`;if(this.templateMode)if(e.type==="motion"){const f=this._getResolvedMotionInfo(e),x=qe(f);a=r`<div style="opacity: 0.7; font-size: 11px;">${x}</div>`}else e.type==="timer"?a=r`<div class="entity-id">Trigger Time: ${e.trigger_time??"00:00:00"}</div>`:e.type==="event"&&e.event_type?a=r`<div style="opacity: 0.7; font-size: 11px;">Event Type: ${e.event_type}</div>`:e.type==="button"&&(a=r`<div style="opacity: 0.7; font-size: 11px;">Mode: ${e.button_mode??"click"}</div>`);else if(e.type==="motion"){const{friendlyName:f,subText:x}=zi(e,this.hass??void 0);s=r`<div style="font-weight: 500; word-break: break-word;">${e.name||f}</div>`;const w=this._getResolvedMotionInfo(e),k=qe(w);a=r`
                        <div class="entity-id">${e.name?`${f} (${x})`:x}</div>
                        <div style="opacity: 0.7; font-size: 11px; margin-top: 2px;">${k}</div>
                      `}else if(e.type==="timer")s=r`<div style="font-weight: 500; word-break: break-word;">${e.name||"Daily Timer"}</div>`,a=r`<div class="entity-id">Trigger Time: ${e.trigger_time??"00:00:00"}</div>`;else if(e.type==="button")s=r`<div style="font-weight: 500; word-break: break-word;">${e.name||e.label||e.id}</div>`,a=r`<div style="opacity: 0.7; font-size: 11px;">Mode: ${e.button_mode??"click"}${e.create_entity?r` <ha-icon icon="mdi:home-assistant" style="--mdc-icon-size: 12px; vertical-align: middle;"></ha-icon>`:""}</div>`;else if(e.entity_ids&&e.entity_ids.length>0){const{friendlyName:f,subText:x}=zi(e,this.hass??void 0);s=r`<div style="font-weight: 500; word-break: break-word;">${e.name||f}</div>`;let w=x;e.type==="event"&&e.event_type&&(w+=` [event: ${e.event_type}]`),a=r`<div class="entity-id">${e.name?`${f} (${w})`:w}</div>`}const o=(d=(p=this.runState)==null?void 0:p.inputs)==null?void 0:d[e.id],n=(o==null?void 0:o.disabled_by)||[],l=!!(e.entity_ids&&e.entity_ids.length>0),c=new Set;!this.templateMode&&e.type!=="timer"&&e.type!=="button"&&!l&&c.add("no_entity"),e.enabled===!1&&c.add("user");for(const f of n)c.add(f);const u=Array.from(c),g=e.enabled===!1||!this.templateMode&&e.type!=="timer"&&e.type!=="button"&&!l||u.length>0;return r`
                    <tr
                      class="input-row ${this._draftController.draggedIndex===i?"dragging":""} ${g?"disabled":""}"
                      draggable="true"
                      @dragstart=${f=>this._draftController.onDragStart(f,i)}
                      @dragover=${f=>this._draftController.onDragOver(f,i)}
                      @dragend=${()=>this._draftController.onDragEnd()}
                    >
                      <td style="text-align: center; padding: 0 4px; vertical-align: middle;">
                        <div class="drag-handle" title="Drag to reorder">⋮⋮</div>
                      </td>
                      <td>
                        <div style="font-weight: 600;">${e.name||e.label||Ye(e,t)||e.id}</div>
                        ${(e.name||e.label)&&e.id?r`<div style="font-size: 10px; font-family: monospace; opacity: 0.5;">${e.id}</div>`:""}
                      </td>
                      <td>
                        <div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-start;">
                          <span class="type-badge ${e.type}">${e.type}</span>
                          ${u.map(f=>{let x="user",w="Disabled";return f==="no_entity"?(x="no_entity",w="No Entity"):f.startsWith("activity:")&&(x="activity",w=`Suppressed: ${f.substring(9)}`),r`
                              <span class="status-badge ${x}">${w}</span>
                            `})}
                        </div>
                      </td>
                      <td>
                        ${s}
                        ${a}
                      </td>
                      <td>
                        <span class="activity-badge ${Ve(e.activity,this.activitiesConfig)}">${e.activity}</span>
                      </td>
                      <td style="text-align: center;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                          <button class="row-action-btn edit" title="Edit input" @click=${()=>this._openEditInput(i)}>✏️</button>
                          <button class="row-action-btn remove" title="Remove input" @click=${()=>this._onRemoveInput(i)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  `})}
                ${t.length===0?r`
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
        .placeholderDefaults=${this.placeholderDefaults}
        .templateMode=${this.templateMode}
        .siblings=${this._draftController.draft??[]}
        @save=${this._onSubEditSave}
        @cancel=${this._onSubEditCancel}
      ></twilight-input-row-editor>

      <twilight-alert-dialog
        .open=${this._dialog.alertOpen}
        .dialogTitle=${this._dialog.alertTitle}
        .message=${this._dialog.alertMessage}
        @close=${this._dialog._onCloseAlert}
      ></twilight-alert-dialog>
    `}};ut.styles=[Ie,jt,z`
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
    `],wt([h({type:Boolean})],ut.prototype,"open",2),wt([h({attribute:!1})],ut.prototype,"hass",2),wt([h({attribute:!1})],ut.prototype,"config",2),wt([h({type:Array})],ut.prototype,"activities",2),wt([h({attribute:!1})],ut.prototype,"activitiesConfig",2),wt([h({attribute:!1})],ut.prototype,"placeholderDefaults",2),wt([h({attribute:!1})],ut.prototype,"runState",2),wt([h({type:Boolean})],ut.prototype,"templateMode",2),wt([h({type:String})],ut.prototype,"areaId",2),wt([b()],ut.prototype,"_subEditOpen",2),wt([b()],ut.prototype,"_subEditingIndex",2),wt([b()],ut.prototype,"_subEditInput",2),ut=wt([H("twilight-inputs-dialog")],ut);var mo=Object.defineProperty,xo=Object.getOwnPropertyDescriptor,Pt=(t,e,i,a)=>{for(var s=a>1?void 0:a?xo(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&mo(e,i,s),s};let $t=class extends L{constructor(){super(...arguments),this.hass=null,this.config=[],this.activities=[],this.activitiesConfig=[],this.noHeader=!1,this.placeholderDefaults=null,this.runState=null,this.templateMode=!1,this.areaId=null,this._editOpen=!1}_openEdit(){this._editOpen=!0}async _triggerButton(t,e){if(!this.hass||this._editOpen)return;const i=this.areaId;if(!i)return;const a={area_id:i,input_id:t.id};t.button_mode==="toggle"&&e!==void 0&&(a.active=e);try{await Ns(this.hass,a)}catch(s){console.error("[twilight] trigger_input failed",s)}}_renderManualTriggers(){const t=this.config.filter(e=>e.type==="button");return t.length===0?r``:r`
      <div style="padding: 10px 12px 4px; border-bottom: 1px solid rgba(255,255,255,0.08);">
        <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--secondary-text-color); margin-bottom: 8px;">Manual Triggers</div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; padding-bottom: 10px;">
          ${t.map(e=>{var l,c,u;const i=(c=(l=this.runState)==null?void 0:l.inputs)==null?void 0:c[e.id],a=(i==null?void 0:i.active)||!1,o=(((u=i==null?void 0:i.disabled_by)==null?void 0:u.filter(g=>g!=="no_entity"))||[]).length>0||!!this._editOpen,n=e.name||e.label||e.id;return e.button_mode==="toggle"?r`
                <button
                  class="manual-trigger-btn ${a?"active":""}"
                  ?disabled=${o}
                  title="${o?"Disabled":a?"Click to deactivate":"Click to activate"}"
                  @click=${()=>this._triggerButton(e,!a)}
                >
                  <span class="manual-trigger-icon">${"⏻"}</span>
                  ${n}
                  ${a?r`<span class="manual-trigger-dot"></span>`:""}
                </button>
              `:r`
              <button
                class="manual-trigger-btn"
                ?disabled=${o}
                title="${o?"Disabled":`Trigger ${n}`}"
                @click=${()=>this._triggerButton(e)}
              >
                <span class="manual-trigger-icon">▶</span>
                ${n}
              </button>
            `})}
        </div>
      </div>
    `}_getEntityDisplay(t){return zi(t,this.hass??void 0)}_getActivityActionType(t){return Ve(t,this.activitiesConfig)}render(){return r`
      <div class="devices-card">
        ${this.noHeader?"":r`
          <div class="devices-card-header">
            <span class="devices-card-icon">🔌</span>
            <span class="devices-card-title">Inputs</span>
            <button class="edit-btn" @click=${this._openEdit}>⋮</button>
          </div>
        `}

        ${this._renderManualTriggers()}

        <div class="entity-list">
          ${this.config.map((t,e)=>{var g,p;const i=(p=(g=this.runState)==null?void 0:g.inputs)==null?void 0:p[t.id],a=(i==null?void 0:i.disabled_by)||[],s=this.templateMode||t.type==="button"?a.filter(d=>d!=="no_entity"):a,o=s.length>0,n=(i==null?void 0:i.active)||!1;let l="user";s.includes("no_entity")?l="no_entity":s.some(d=>d.startsWith("activity:"))&&(l="activity");let c=r`—`,u=r`—`;if(this.templateMode)if(t.type==="motion"){c=r`<span class="entity-name">${t.name||"Motion Sensor"}</span>`;const d=Ii(t,this.placeholderDefaults),f=qe(d);u=r`<span class="entity-id" style="margin-top: 2px; font-family: inherit;">${f}</span>`}else t.type==="timer"?(c=r`<span class="entity-name">${t.name||"Daily Timer"}</span>`,u=r`<span class="entity-id">Trigger Time: ${t.trigger_time??"00:00:00"}</span>`):t.type==="event"?(c=r`<span class="entity-name">${t.name||"Event Input"}</span>`,t.event_type&&(u=r`<span class="entity-id">Event Type: ${t.event_type}</span>`)):t.type==="binary"?c=r`<span class="entity-name">${t.name||"Binary Input"}</span>`:t.type==="button"&&(c=r`<span class="entity-name">${t.name||t.label||"Button"}</span>`,u=r`<span class="entity-id">Mode: ${t.button_mode??"click"}</span>`);else if(t.type==="motion"){const{friendlyName:d,subText:f}=this._getEntityDisplay(t);c=r`<span class="entity-name">${t.name||d}</span>`;const x=Ii(t,this.placeholderDefaults),w=qe(x);u=r`
                  <span class="entity-id" style="font-family: monospace;">${t.name?`${d} (${f})`:f}</span>
                  <span class="entity-id" style="margin-top: 2px; font-family: inherit;">${w}</span>
                `}else if(t.type==="timer")c=r`<span class="entity-name">${t.name||"Daily Timer"}</span>`,u=r`
                  <span class="entity-id">Trigger Time: ${t.trigger_time??"00:00:00"}</span>
                `;else if(t.type==="button")c=r`<span class="entity-name">${t.name||t.label||"Button"}</span>`,u=r`<span class="entity-id">Mode: ${t.button_mode??"click"}${t.create_entity?r` <ha-icon icon="mdi:home-assistant" style="--mdc-icon-size: 12px; vertical-align: middle;"></ha-icon>`:""}</span>`;else{const{friendlyName:d,subText:f}=this._getEntityDisplay(t);c=r`<span class="entity-name">${t.name||d}</span>`;let x="";t.type==="event"&&t.event_type&&(x=` [event: ${t.event_type}]`),u=r`
                  <span class="entity-id">${t.name?`${d} (${f})`:f}${x}</span>
                `}return r`
              <div class="entity-row ${o?"disabled":""}">
                <span class="type-badge ${t.type}">${t.type}</span>
                <div class="entity-name-wrap">
                  ${c}
                  ${u}
                </div>
                ${n?r`<span class="active-indicator" title="Sensor active"></span>`:""}
                <span class="activity-badge ${this._getActivityActionType(t.activity)}">${t.activity}</span>
                ${o?r`
                  <div class="disabled-overlay">
                    <span class="disabler-badge ${l}">
                      ${so(s)}
                    </span>
                  </div>
                `:""}
              </div>
              ${e<this.config.length-1?r`<div class="divider"></div>`:""}
            `})}
          ${this.config.length===0?r`
            <div class="empty-state">No inputs configured. Click edit to configure.</div>
          `:""}
        </div>
      </div>

      <twilight-inputs-dialog
        .open=${this._editOpen}
        .hass=${this.hass}
        .config=${this.config}
        .activities=${this.activities}
        .activitiesConfig=${this.activitiesConfig}
        .placeholderDefaults=${this.placeholderDefaults}
        .runState=${this.runState}
        .templateMode=${this.templateMode}
        .areaId=${this.areaId}
        @close=${()=>{this._editOpen=!1}}
      ></twilight-inputs-dialog>
    `}};$t.styles=[Ie,z`
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        font-family: var(--font-family, inherit);
        background: rgba(255, 255, 255, 0.03);
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

      .devices-card-icon {
        font-size: 18px;
        opacity: 0.7;
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
        background: rgba(63, 81, 181, 0.28);
        border: 1px solid rgba(63, 81, 181, 0.55);
      }
      .type-badge.event {
        background: rgba(156, 39, 176, 0.28);
        border: 1px solid rgba(156, 39, 176, 0.55);
      }
      .type-badge.motion {
        background: rgba(76, 175, 80, 0.28);
        border: 1px solid rgba(76, 175, 80, 0.55);
      }
      .type-badge.timer {
        background: rgba(255, 152, 0, 0.28);
        border: 1px solid rgba(255, 152, 0, 0.55);
      }
      .type-badge.button {
        background: rgba(139, 92, 246, 0.28);
        border: 1px solid rgba(139, 92, 246, 0.55);
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
        background: rgba(244, 67, 54, 0.12);
        border: 1px solid rgba(244, 67, 54, 0.3);
        color: #ff5252;
      }

      .disabler-badge.user {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: var(--secondary-text-color);
      }

      .disabler-badge.activity {
        background: rgba(233, 30, 140, 0.12);
        border: 1px solid rgba(233, 30, 140, 0.3);
        color: var(--tp-accent, #e91e8c);
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
    `],Pt([h({attribute:!1})],$t.prototype,"hass",2),Pt([h({attribute:!1})],$t.prototype,"config",2),Pt([h({type:Array})],$t.prototype,"activities",2),Pt([h({attribute:!1})],$t.prototype,"activitiesConfig",2),Pt([h({type:Boolean})],$t.prototype,"noHeader",2),Pt([h({attribute:!1})],$t.prototype,"placeholderDefaults",2),Pt([h({attribute:!1})],$t.prototype,"runState",2),Pt([h({type:Boolean})],$t.prototype,"templateMode",2),Pt([h({type:String})],$t.prototype,"areaId",2),Pt([b()],$t.prototype,"_editOpen",2),$t=Pt([H("twilight-inputs-card")],$t);var _o=Object.defineProperty,yo=Object.getOwnPropertyDescriptor,Ge=(t,e,i,a)=>{for(var s=a>1?void 0:a?yo(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&_o(e,i,s),s};let _e=class extends L{constructor(){super(...arguments),this.channels={},this.excludedSlotIds={},this._expandedNodes={}}get _nodes(){return Object.keys(this.channels).sort((e,i)=>e===T?-1:i===T?1:0).map(e=>{var i,a;return{id:e,label:((i=this.channels[e])==null?void 0:i.name)||e,children:(((a=this.channels[e])==null?void 0:a.slots)??[]).map(s=>({id:s.id,label:s.name||s.id}))}})}_isExcluded(t,e){return(this.excludedSlotIds[t]??[]).includes(e)}_isChannelIndeterminate(t){if(t.children.length===0)return!1;const e=t.children.filter(i=>this._isExcluded(t.id,i.id)).length;return e>0&&e<t.children.length}_isChannelFullyExcluded(t){return t.children.length>0&&t.children.every(e=>this._isExcluded(t.id,e.id))}_setChannelExcluded(t,e,i){const a={...this.excludedSlotIds};a[t]=i?e:[],this._emit(a)}_setSlotExcluded(t,e,i){const a=new Set(this.excludedSlotIds[t]??[]);i?a.add(e):a.delete(e);const s={...this.excludedSlotIds,[t]:[...a]};this._emit(s)}_emit(t){this.excludedSlotIds=t,this.dispatchEvent(new CustomEvent("excluded-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_toggleExpanded(t){this._expandedNodes={...this._expandedNodes,[t]:!this._expandedNodes[t]}}render(){const t=this._nodes;return t.length===0?r``:r`
      <p class="hint">Unchecked channels/slots are excluded: while this activity is active and one of its excluded slots is current, that channel is turned off instead of following the schedule.</p>
      <div class="tree">
        ${t.map(e=>{const i=!!this._expandedNodes[e.id],a=this._isChannelFullyExcluded(e);return r`
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
                  @change=${s=>{const o=s.target.checked;this._setChannelExcluded(e.id,e.children.map(n=>n.id),!o)}}
                />
                <span>${e.label}</span>
              </div>

              ${i?r`
                <div class="tree-node-children">
                  ${e.children.map(s=>r`
                    <div class="tree-leaf">
                      <input
                        type="checkbox"
                        .checked=${!this._isExcluded(e.id,s.id)}
                        @change=${o=>{const n=o.target.checked;this._setSlotExcluded(e.id,s.id,!n)}}
                      />
                      <span>${s.label}</span>
                    </div>
                  `)}
                </div>
              `:""}
            </div>
          `})}
      </div>
    `}};_e.styles=z`
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
  `,Ge([h({attribute:!1})],_e.prototype,"channels",2),Ge([h({attribute:!1})],_e.prototype,"excludedSlotIds",2),Ge([b()],_e.prototype,"_expandedNodes",2),_e=Ge([H("twilight-slot-action-tree")],_e);var wo=Object.defineProperty,$o=Object.getOwnPropertyDescriptor,Bt=(t,e,i,a)=>{for(var s=a>1?void 0:a?$o(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&wo(e,i,s),s};const Na={input_boolean:[{value:"on",label:"On"},{value:"off",label:"Off"},{value:"toggle",label:"Toggle"}],switch:[{value:"on",label:"On"},{value:"off",label:"Off"},{value:"toggle",label:"Toggle"}],script:[{value:"activate",label:"Activate"}]};function ko(){return{id:"",suppress_inputs:[],auto_expire:null,expire_check_mode:null,action_type:"",action_entity_id:"",action_targets:[],action_target_picker_value:"",action_state:"on",action_brightness:255,action_color_temp:370,action_entity_targets:[],action_excluded_slot_ids:{},release_action_type:"",transition_off_seconds:null}}function Co(t){const e=t.action,i=t.release_action;return{id:t.id,suppress_inputs:[...t.suppress_inputs??[]],auto_expire:t.auto_expire??null,expire_check_mode:t.expire_check_mode??null,action_type:(e==null?void 0:e.type)??"",action_entity_id:(e==null?void 0:e.entity_id)??"",action_targets:(e==null?void 0:e.targets)??[],action_target_picker_value:"",action_state:(e==null?void 0:e.state)??"on",action_brightness:(e==null?void 0:e.brightness)??255,action_color_temp:(e==null?void 0:e.color_temp)??370,action_entity_targets:[...(e==null?void 0:e.entity_targets)??[]],action_excluded_slot_ids:{...(e==null?void 0:e.excluded_slot_ids)??{}},release_action_type:(i==null?void 0:i.type)??"",transition_off_seconds:t.transition_off_seconds??null}}let Tt=class extends L{constructor(){super(...arguments),this.open=!1,this.hass=null,this.activity=null,this.editIndex=null,this.inputs=[],this.placeholderDefaults=null,this.channels={},this.existingIds=[],this._editDraft=null}willUpdate(t){(t.has("open")||t.has("activity"))&&(this.open&&this.activity?this._editDraft=this.editIndex===null&&this.activity.id===""?ko():Co(this.activity):this.open||(this._editDraft=null))}_getFallbackActivityInfo(){return Ni(this.placeholderDefaults)}_cancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}_isSaveDisabled(t){const i=!(this.editIndex!==null)&&(!t.id.trim()||this.existingIds.includes(t.id.trim().toLowerCase())),a=t.auto_expire!==null&&!Li(t.auto_expire);return i||a}_save(){if(!this._editDraft)return;const t=this._editDraft.id.trim().toLowerCase();if(!t)return;const e=this._getFallbackActivityInfo(),i=this._editDraft.action_type===""?e.action_type:this._editDraft.action_type,a=this._editDraft.action_type===""?null:this._editDraft.action_type,s={type:a};a==="entity"?s.entity_id=this._editDraft.action_entity_id:a==="light"?(s.targets=this._editDraft.action_targets,s.state=this._editDraft.action_state,this._editDraft.action_state==="on"&&(s.brightness=this._editDraft.action_brightness,this._editDraft.action_color_temp>0&&(s.color_temp=this._editDraft.action_color_temp))):a==="reset"?this._editDraft.action_entity_targets.length>0&&(s.entity_targets=this._editDraft.action_entity_targets):i==="slot"&&Object.values(this._editDraft.action_excluded_slot_ids).some(u=>u.length>0)&&(s.excluded_slot_ids=this._editDraft.action_excluded_slot_ids);const n={type:i==="reset"?"none":this._editDraft.release_action_type===""?null:this._editDraft.release_action_type},l=this._editDraft.auto_expire===null?null:ho(this._editDraft.auto_expire),c={id:t,suppress_inputs:i==="reset"?[]:this._editDraft.suppress_inputs,auto_expire:i==="reset"?null:l,...i!=="reset"&&{expire_check_mode:this._editDraft.expire_check_mode??"respect_lux"},transition_off_seconds:this._editDraft.transition_off_seconds,action:s,release_action:n};this.dispatchEvent(new CustomEvent("save",{detail:c,bubbles:!0,composed:!0}))}render(){if(!this.open||!this._editDraft)return r``;const t=this._editDraft,e=this.editIndex!==null,i=this._isSaveDisabled(t),a=this._getFallbackActivityInfo(),s=t.action_type===""?a.action_type:t.action_type;return r`
      <div class="overlay" style="z-index: 1100;" @click=${o=>{o.target===o.currentTarget&&this._cancel()}}>
        <div class="edit-panel" style="max-width: 640px; max-height: calc(100vh - 120px);">
          <div class="panel-header">
            <span class="panel-header-icon">🎭</span>
            <span class="panel-header-title">${e?`Edit Activity: ${t.id}`:"Add Activity"}</span>
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
                    .value=${t.id}
                    placeholder="e.g. party"
                    ?disabled=${e}
                    @input=${o=>{this._editDraft={...this._editDraft,id:o.target.value}}}
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
                    <option value="none">None (Block Only)</option>
                    <option value="reset">Reset (Off + Clear)</option>
                  </select>
                </div>

                ${s==="slot"?r`
                  <div class="form-field">
                    <span class="form-label">Excluded Channels / Slots</span>
                    <twilight-slot-action-tree
                      .channels=${this.channels}
                      .excludedSlotIds=${t.action_excluded_slot_ids}
                      @excluded-changed=${o=>{this._editDraft={...this._editDraft,action_excluded_slot_ids:o.detail.value}}}
                    ></twilight-slot-action-tree>
                  </div>
                `:""}

                ${t.action_type==="entity"?r`
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

                ${t.action_type==="light"?r`
                  <div class="form-field">
                    <span class="form-label">Target Lights</span>
                    <ha-entity-picker
                      .hass=${this.hass}
                      .value=${t.action_target_picker_value}
                      .includeDomains=${["light"]}
                      allow-custom-entity
                      placeholder="Select light to add..."
                      @value-changed=${o=>{const n=o.detail.value,l=this._editDraft.action_targets,c=n&&!l.includes(n)?[...l,n]:l;this._editDraft={...this._editDraft,action_targets:c,action_target_picker_value:""}}}
                    ></ha-entity-picker>
                    <div class="checkbox-list" style="margin-top: 8px;">
                      ${t.action_targets.map(o=>r`
                        <div class="checkbox-item" style="justify-content: space-between;">
                          <span>${o}</span>
                          <button class="row-action-btn remove" style="padding: 2px 6px;" @click=${()=>{this._editDraft={...this._editDraft,action_targets:this._editDraft.action_targets.filter(n=>n!==o)}}}>✕</button>
                        </div>
                      `)}
                      ${t.action_targets.length===0?r`<div style="font-style: italic; opacity: 0.4; font-size: 11px;">No lights selected</div>`:""}
                    </div>
                  </div>

                  <div class="form-field">
                    <span class="form-label">State</span>
                    <select class="option-select" .value=${t.action_state} @change=${o=>{this._editDraft={...this._editDraft,action_state:o.target.value}}}>
                      <option value="on">On</option>
                      <option value="off">Off</option>
                    </select>
                  </div>

                  ${t.action_state==="on"?r`
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

                ${t.action_type==="reset"?r`
                  <div class="form-field">
                    <span class="form-label">Additional Entities</span>
                    <table class="sensor-table">
                      <tbody>
                        ${t.action_entity_targets.map((o,n)=>{var g,p,d;const l=o.entity_id.split(".")[0],c=Na[l]??[],u=((d=(p=(g=this.hass)==null?void 0:g.states[o.entity_id])==null?void 0:p.attributes)==null?void 0:d.friendly_name)??o.entity_id;return r`
                            <tr class="sensor-row">
                              <td style="padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                                <div style="font-weight: 500; font-size: 13px;">${u}</div>
                                <div style="font-size: 11px; color: var(--secondary-text-color); font-family: monospace;">${o.entity_id}</div>
                              </td>
                              <td style="text-align: right; width: 170px; padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                                <select
                                  class="option-select"
                                  style="width: 100%; min-width: 0;"
                                  @change=${f=>{const x=[...this._editDraft.action_entity_targets];x[n]={...o,action:f.target.value},this._editDraft={...this._editDraft,action_entity_targets:x}}}
                                >
                                  ${c.map(f=>r`<option value=${f.value} ?selected=${f.value===o.action}>${f.label}</option>`)}
                                </select>
                              </td>
                              <td style="text-align: center; width: 40px; padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                                <button class="sensor-remove-btn" title="Remove entity" @click=${()=>{this._editDraft={...this._editDraft,action_entity_targets:this._editDraft.action_entity_targets.filter((f,x)=>x!==n)}}}>✕</button>
                              </td>
                            </tr>
                          `})}
                        ${t.action_entity_targets.length===0?r`
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
                      @value-changed=${o=>{var l,c;const n=o.detail.value;if(n){const u=this._editDraft.action_entity_targets;if(!u.some(p=>p.entity_id===n)){const p=n.split(".")[0],d=((c=(l=Na[p])==null?void 0:l[0])==null?void 0:c.value)??"off";this._editDraft={...this._editDraft,action_entity_targets:[...u,{entity_id:n,action:d}]}}const g=o.target;g&&(g.value="")}}}
                    ></ha-entity-picker>
                  </div>
                `:""}

                ${s!=="none"&&s!=="reset"?r`
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

              ${s!=="reset"?r`
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  <div class="list-section-label">Timing & Window Extension</div>

                  <div class="form-field">
                    <span class="form-label">Auto-Expire Duration (HH:MM:SS, 0 = never expires)</span>
                    <input
                      type="text"
                      class="activity-input ${t.auto_expire!==null&&!Li(t.auto_expire)?"invalid":""}"
                      .value=${t.auto_expire??""}
                      .placeholder=${a.auto_expire}
                      @input=${o=>{this._editDraft={...this._editDraft,auto_expire:o.target.value.trim()||null}}}
                    />
                    <span class="form-hint">Accepts seconds (<code>90</code>), <code>M:SS</code> (<code>5:30</code>) or <code>H:MM:SS</code> — saved as HH:MM:SS.</span>
                    ${t.auto_expire!==null&&!Li(t.auto_expire)?r`
                      <span class="form-error">Enter a duration like 90, 5:30 or 1:02:03.</span>
                    `:""}
                  </div>

                  <div class="form-field">
                    <span class="form-label">Auto-Expire Motion Check</span>
                    <select class="option-select" .value=${t.expire_check_mode??"respect_lux"} @change=${o=>{this._editDraft={...this._editDraft,expire_check_mode:o.target.value}}}>
                      <option value="disabled">Disabled</option>
                      <option value="respect_lux">Enabled (respect lux)</option>
                      <option value="ignore_lux">Enabled (ignore lux)</option>
                    </select>
                  </div>

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
                      @input=${o=>{const n=o.target.value.trim();this._editDraft={...this._editDraft,transition_off_seconds:n===""?null:parseInt(n,10)||0}}}
                    />
                  </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 12px;">
                  <div class="list-section-label">Input Suppression</div>
                  <div class="form-field">
                    <span class="form-label">Check inputs to ignore while active</span>
                    <div class="checkbox-list">
                      ${this.inputs.map(o=>{const n=t.suppress_inputs.includes(o.id);return r`
                          <label class="checkbox-item">
                            <input
                              type="checkbox"
                              ?checked=${n}
                              @change=${l=>{const c=l.target.checked,u=this._editDraft.suppress_inputs,g=c?[...u,o.id]:u.filter(p=>p!==o.id);this._editDraft={...this._editDraft,suppress_inputs:g}}}
                            />
                            <span>${o.name||o.id} (${o.type})</span>
                          </label>
                        `})}
                      ${this.inputs.length===0?r`<div style="font-style: italic; opacity: 0.4; font-size: 11px;">No inputs configured</div>`:""}
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
    `}};Tt.styles=[Ie,jt,z`
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
    `],Bt([h({type:Boolean})],Tt.prototype,"open",2),Bt([h({attribute:!1})],Tt.prototype,"hass",2),Bt([h({attribute:!1})],Tt.prototype,"activity",2),Bt([h({type:Number})],Tt.prototype,"editIndex",2),Bt([h({attribute:!1})],Tt.prototype,"inputs",2),Bt([h({attribute:!1})],Tt.prototype,"placeholderDefaults",2),Bt([h({attribute:!1})],Tt.prototype,"channels",2),Bt([h({type:Array})],Tt.prototype,"existingIds",2),Bt([b()],Tt.prototype,"_editDraft",2),Tt=Bt([H("twilight-activity-row-editor")],Tt);var So=Object.defineProperty,Do=Object.getOwnPropertyDescriptor,Nt=(t,e,i,a)=>{for(var s=a>1?void 0:a?Do(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&So(e,i,s),s};let kt=class extends L{constructor(){super(...arguments),this.open=!1,this.hass=null,this.config=[],this.inputs=[],this.placeholderDefaults=null,this.templateMode=!1,this.channels={},this._subEditOpen=!1,this._subEditingIndex=null,this._subEditActivity=null,this._dialog=new fe(this),this._draftController=new Oi(this,{onOpen:()=>{this._subEditOpen=!1}})}_closeDiscard(){this._draftController.closeDiscard()}_closeAndSave(){this._draftController.closeAndSave(new gi({activities:this._draftController.draft||[]}))}_getFallbackActivityInfo(){return Ni(this.placeholderDefaults)}_openAddActivity(){this._subEditingIndex=null,this._subEditActivity={id:""},this._subEditOpen=!0}_openEditActivity(t){const e=this._draftController.draft;e&&(this._subEditingIndex=t,this._subEditActivity=e[t],this._subEditOpen=!0)}async _onSubEditSave(t){const e=this._draftController.draft;if(!e)return;const i=t.detail;if(this._subEditingIndex===null){const a=i.id;if(!/^[a-z0-9_-]+$/.test(a)){await this._dialog.showAlert("Invalid Name","Activity name must contain only lowercase letters, numbers, hyphens and underscores.");return}if(e.some(s=>s.id===a)){await this._dialog.showAlert("Duplicate Name","This activity name already exists!");return}this._draftController.draft=[...e,i]}else{const a=this._subEditingIndex,s=[...e];s[a]=i,this._draftController.draft=s}this._subEditOpen=!1,this.requestUpdate()}_onSubEditCancel(){this._subEditOpen=!1}_onRemoveActivity(t){const e=this._draftController.draft;e&&(this._draftController.draft=e.filter((i,a)=>a!==t),this.requestUpdate())}render(){if(!this.open||!this._draftController.draft)return r``;const t=this._draftController.draft;return r`
      <div class="overlay" @click=${e=>{e.target===e.currentTarget&&!this._subEditOpen&&this._closeDiscard()}}>
        <div class="edit-panel list-panel">
          <div class="panel-header">
            <span class="panel-header-icon">🎭</span>
            <span class="panel-header-title">Activities — Configuration</span>
            <button class="panel-close" @click=${this._closeDiscard}>✕</button>
          </div>

          <div class="panel-body">
            <div style="display: flex; flex-direction: column; gap: 20px;">
              <div class="list-section-label">Configured Activities</div>
              <table class="activity-table">
                <thead>
                  <tr>
                    <th style="min-width: 30px;"></th>
                    <th style="min-width: 140px;">Name</th>
                    <th style="min-width: 100px;">Action</th>
                    <th style="min-width: 100px;">Release</th>
                    <th style="min-width: 100px;">Suppresses</th>
                    <th style="min-width: 100px;">Auto-Expire</th>
                    <th style="min-width: 100px; text-align: center;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${t.map((e,i)=>{var n,l;const a=this._getFallbackActivityInfo(),o=(((n=e.action)==null?void 0:n.type)||a.action_type)==="reset";return r`
                      <tr
                        class="input-row ${this._draftController.draggedIndex===i?"dragging":""}"
                        draggable="true"
                        @dragstart=${c=>this._draftController.onDragStart(c,i)}
                        @dragover=${c=>this._draftController.onDragOver(c,i)}
                        @dragend=${()=>this._draftController.onDragEnd()}
                      >
                        <td style="text-align: center; padding: 0 4px; vertical-align: middle;">
                          <div class="drag-handle" title="Drag to reorder">⋮⋮</div>
                        </td>
                        <td>
                          <span class="activity-badge ${Ve(e.id,t)}">${e.id}</span>
                        </td>
                        <td style="color: var(--primary-text-color);">
                          ${za(e.action)}
                        </td>
                        <td style="color: var(--primary-text-color);">
                          ${o?"—":Ma(e.release_action)}
                        </td>
                        <td style="color: var(--primary-text-color);">
                          ${(l=e.suppress_inputs)!=null&&l.length?e.suppress_inputs.map(c=>{const u=this.inputs.find(g=>g.id===c);return u?u.name||u.label||u.id:c}).join(" · "):r`<span style="opacity:0.4">—</span>`}
                        </td>
                        <td style="color: var(--primary-text-color);">${o?"—":Ia(e.auto_expire,a.auto_expire)}</td>
                        <td style="text-align: center;">
                          <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <button class="row-action-btn edit" title="Edit activity" @click=${()=>this._openEditActivity(i)}>✏️</button>
                            <button class="row-action-btn remove" title="Remove activity" @click=${()=>this._onRemoveActivity(i)}>✕</button>
                          </div>
                        </td>
                      </tr>
                    `})}
                  ${t.length===0?r`
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
        @save=${this._onSubEditSave}
        @cancel=${this._onSubEditCancel}
      ></twilight-activity-row-editor>

      <twilight-alert-dialog
        .open=${this._dialog.alertOpen}
        .dialogTitle=${this._dialog.alertTitle}
        .message=${this._dialog.alertMessage}
        @close=${this._dialog._onCloseAlert}
      ></twilight-alert-dialog>
    `}};kt.styles=[Ie,jt,z`
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
    `],Nt([h({type:Boolean})],kt.prototype,"open",2),Nt([h({attribute:!1})],kt.prototype,"hass",2),Nt([h({attribute:!1})],kt.prototype,"config",2),Nt([h({attribute:!1})],kt.prototype,"inputs",2),Nt([h({attribute:!1})],kt.prototype,"placeholderDefaults",2),Nt([h({type:Boolean})],kt.prototype,"templateMode",2),Nt([h({attribute:!1})],kt.prototype,"channels",2),Nt([b()],kt.prototype,"_subEditOpen",2),Nt([b()],kt.prototype,"_subEditingIndex",2),Nt([b()],kt.prototype,"_subEditActivity",2),kt=Nt([H("twilight-activities-dialog")],kt);var Ao=Object.defineProperty,To=Object.getOwnPropertyDescriptor,Vt=(t,e,i,a)=>{for(var s=a>1?void 0:a?To(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&Ao(e,i,s),s};let Lt=class extends L{constructor(){super(...arguments),this.hass=null,this.config=[],this.inputs=[],this.noHeader=!1,this.placeholderDefaults=null,this.templateMode=!1,this.channels={},this._editOpen=!1}_openEdit(){this._editOpen=!0}render(){return r`
      <div class="devices-card">
        ${this.noHeader?"":r`
          <div class="devices-card-header">
            <span class="devices-card-icon">🎭</span>
            <span class="devices-card-title">Activities</span>
            <button class="edit-btn" @click=${this._openEdit}>⋮</button>
          </div>
        `}

        <div class="entity-list">
          ${this.config.map((t,e)=>{var g,p;const i=Ni(this.placeholderDefaults),s=(((g=t.action)==null?void 0:g.type)||i.action_type)==="reset",o=za(t.action),n=Ia(t.auto_expire,i.auto_expire),l=s?"—":Ma(t.release_action),c=(p=t.suppress_inputs)!=null&&p.length?t.suppress_inputs.map(d=>{const f=this.inputs.find(x=>x.id===d);return f?f.name||f.label||f.id:d}).join(", "):"none",u=s?"Reset":`Action: ${o} · Auto-expire: ${n} · Release: ${l} · Suppresses: ${c}`;return r`
              <div class="activity-row">
                <span class="activity-badge ${Ve(t.id,this.config)}">${t.id}</span>
                <div class="activity-desc">
                  <div style="font-weight: 600;">${t.id}</div>
                  <div style="font-size: 11px; color: var(--secondary-text-color); margin-top: 2px;">
                    ${u}
                  </div>
                </div>
              </div>
              ${e<this.config.length-1?r`<div class="divider"></div>`:""}
            `})}
          ${this.config.length===0?r`
            <div style="padding:20px; text-align:center; color: var(--secondary-text-color); font-style:italic;">
              No custom activities configured
            </div>
          `:""}
        </div>
      </div>

      <twilight-activities-dialog
        .open=${this._editOpen}
        .hass=${this.hass}
        .config=${this.config}
        .inputs=${this.inputs}
        .placeholderDefaults=${this.placeholderDefaults}
        .templateMode=${this.templateMode}
        .channels=${this.channels}
        @close=${()=>{this._editOpen=!1}}
      ></twilight-activities-dialog>
    `}};Lt.styles=[Ie,z`
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        font-family: var(--font-family, inherit);
        background: rgba(255, 255, 255, 0.03);
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

      .devices-card-icon {
        font-size: 18px;
        opacity: 0.7;
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
    `],Vt([h({attribute:!1})],Lt.prototype,"hass",2),Vt([h({attribute:!1})],Lt.prototype,"config",2),Vt([h({attribute:!1})],Lt.prototype,"inputs",2),Vt([h({type:Boolean})],Lt.prototype,"noHeader",2),Vt([h({attribute:!1})],Lt.prototype,"placeholderDefaults",2),Vt([h({type:Boolean})],Lt.prototype,"templateMode",2),Vt([h({attribute:!1})],Lt.prototype,"channels",2),Vt([b()],Lt.prototype,"_editOpen",2),Lt=Vt([H("twilight-activities-card")],Lt);var Eo=Object.defineProperty,Oo=Object.getOwnPropertyDescriptor,re=(t,e,i,a)=>{for(var s=a>1?void 0:a?Oo(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&Eo(e,i,s),s};let Gt=class extends L{constructor(){super(...arguments),this.open=!1,this.title="Reset Settings",this.description="",this.nodes=[],this._selectedNodes={},this._expandedNodes={}}willUpdate(t){if(t.has("open")&&this.open||t.has("nodes")){const e={},i={};this.nodes.forEach(a=>{e[a.id]=!0,i[a.id]=!0,a.children&&a.children.forEach(s=>{e[s.id]=!0})}),this._selectedNodes=e,this._expandedNodes=i}}_isNodeSelected(t){return!!this._selectedNodes[t]}_isNodeIndeterminate(t){if(!t.children||t.children.length===0)return!1;const e=t.children.filter(i=>this._selectedNodes[i.id]).length;return e>0&&e<t.children.length}_onCheckboxChange(t,e){const i={...this._selectedNodes};if(i[t.id]=e,t.children)t.children.forEach(a=>{i[a.id]=e});else{const a=this.nodes.find(s=>{var o;return(o=s.children)==null?void 0:o.some(n=>n.id===t.id)});if(a&&a.children){const s=a.children.every(o=>{const n=o.id;return n===t.id?e:!!i[n]});i[a.id]=s}}this._selectedNodes=i,this.requestUpdate()}_toggleExpanded(t){this._expandedNodes={...this._expandedNodes,[t]:!this._expandedNodes[t]},this.requestUpdate()}_onConfirm(){const t=Object.keys(this._selectedNodes).filter(e=>this._selectedNodes[e]);this.dispatchEvent(new CustomEvent("confirm",{detail:{selectedIds:t},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}render(){return this.open?r`
      <div class="modal-overlay" @click=${this._onCancel}>
        <div
          class="modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-dialog-title"
          @click=${t=>t.stopPropagation()}
        >
          <h3 class="modal-title" id="reset-dialog-title">${this.title}</h3>
          ${this.description?r`<p class="modal-desc">${this.description}</p>`:""}

          <div class="modal-tree">
            ${this.nodes.map(t=>{const e=t.children&&t.children.length>0,i=!!this._expandedNodes[t.id];return r`
                <div class="tree-node">
                  <div
                    class="tree-node-header"
                    @click=${a=>{a.target.tagName!=="INPUT"&&e&&this._toggleExpanded(t.id)}}
                  >
                    ${e?r`<span class="tree-node-chevron ${i?"expanded":""}">&#9656;</span>`:r`<span class="tree-node-chevron" style="visibility: hidden;">&#9656;</span>`}
                    <input
                      type="checkbox"
                      .checked=${this._isNodeSelected(t.id)}
                      .indeterminate=${this._isNodeIndeterminate(t)}
                      @change=${a=>this._onCheckboxChange(t,a.target.checked)}
                    />
                    <span>${t.label}</span>
                  </div>

                  ${e&&i?r`
                        <div class="tree-node-children">
                          ${t.children.map(a=>r`
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
    `:r``}};Gt.styles=z`
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
  `,re([h({type:Boolean})],Gt.prototype,"open",2),re([h({type:String})],Gt.prototype,"title",2),re([h({type:String})],Gt.prototype,"description",2),re([h({type:Array})],Gt.prototype,"nodes",2),re([b()],Gt.prototype,"_selectedNodes",2),re([b()],Gt.prototype,"_expandedNodes",2),Gt=re([H("twilight-reset-dialog")],Gt);var Io=Object.defineProperty,zo=Object.getOwnPropertyDescriptor,bt=(t,e,i,a)=>{for(var s=a>1?void 0:a?zo(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&Io(e,i,s),s};const La={astro_dawn:"Astro Dawn",nautical_dawn:"Nautical Dawn",civil_dawn:"Civil Dawn",gold_dawn:"Golden Dawn",day:"Day",gold_dusk:"Golden Dusk",civil_dusk:"Civil Dusk",nautical_dusk:"Nautical Dusk",astro_dusk:"Astro Dusk",night:"Night"};let rt=class extends L{constructor(){super(...arguments),this.hass=null,this.slots=[],this.entities=[],this.open=!1,this.highlightSlotId=null,this.areaId="",this.areaName="",this.isPrimaryChannel=!0,this.channelName="",this.transitionOnSeconds=null,this.placeholderDefaults=null,this._draft=null,this._draftTransitionOnSeconds=null,this._transitionDraftInitialized=!1}_isValidHHMM(t){if(!t)return!1;const e=/^(\d{1,2}):(\d{2})$/.exec(t);if(!e)return!1;const i=Number(e[1]),a=Number(e[2]);return i>=0&&i<=23&&a>=0&&a<=59}_hasInvalidSlot(){return(this._draft??this.slots).some(e=>e.startType==="fixed"&&!this._isValidHHMM(e.fixedStartTime))}_closeAndSave(){if(this._hasInvalidSlot())return;const t=this._draftTransitionOnSeconds!==this.transitionOnSeconds;if(this._draft!==null||t){const i=this._draft??this.slots;this.dispatchEvent(new fi(i,this._draftTransitionOnSeconds))}this._draft=null,this._transitionDraftInitialized=!1,this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_closeDiscard(){this._draft=null,this._transitionDraftInitialized=!1,this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_updateDraft(t){this._draft=t}_clampOffset(t,e,i){var g,p;const a=((g=this.placeholderDefaults)==null?void 0:g.max_offset_minutes)??180,s=((p=this.placeholderDefaults)==null?void 0:p.min_slot_distance_minutes)??oa;let o=Math.max(-a,Math.min(a,e));const n=["astro_dawn","nautical_dawn","civil_dawn","gold_dawn","day","gold_dusk","civil_dusk","nautical_dusk","astro_dusk","night"],l=i.find(d=>d.id===t);if(!l||(l.startType||"fixed")!=="astral")return o;const c=i.filter(d=>(d.startType||"fixed")==="astral").map(d=>{const f=d.startEvent||"civil_dawn",x=n.indexOf(f);return{slot:d,zoneIdx:x!==-1?x:99}}).sort((d,f)=>d.zoneIdx-f.zoneIdx),u=c.findIndex(d=>d.slot.id===t);if(u!==-1){if(u>0){const d=c[u-1].slot.startOffset||0;o<d-s&&(o=d-s)}if(u<c.length-1){const d=c[u+1].slot.startOffset||0;o>d+s&&(o=d+s)}}return o}_addCustomSlot(){const t=this._draft??this.slots;if(t.length>=pi)return;const e=t.filter(a=>a.isCustom).length+1,i={id:`draft_${Date.now()}_${e}`,label:`Custom Slot ${e}`,color:"#8e44ad",from:720,to:780,scene:null,isCustom:!0,startType:"fixed",fixedStartTime:"12:00"};this._updateDraft([...t,i])}_deleteSlot(t){this._updateDraft((this._draft??this.slots).filter(e=>e.id!==t))}_setSlotScene(t,e){this._updateDraft((this._draft??this.slots).map(i=>i.id===t?{...i,scene:e}:i))}willUpdate(t){t.has("open")&&(this.open?(this._draft===null&&(this._draft=this.slots.map(e=>({...e}))),this._transitionDraftInitialized||(this._draftTransitionOnSeconds=this.transitionOnSeconds,this._transitionDraftInitialized=!0),xi()):(this._draft=null,this._transitionDraftInitialized=!1))}render(){var u,g,p;if(!this.open)return r``;const t=this._draft;if(!t)return r``;const e=(this.areaId||"").toLowerCase(),i=(this.areaName||"").toLowerCase(),a=new Set;if(e&&(a.add(e),e==="badezimmer"&&a.add("bad"),e==="kuche"&&a.add("küche"),e==="buro"&&(a.add("büro"),a.add("office"))),i){a.add(i);const d=i.normalize("NFD").replace(/[\u0300-\u036f]/g,"");a.add(d),i==="bad"&&a.add("badezimmer"),i==="büro"&&a.add("office")}const s=(d,f)=>{const x=d.toLowerCase(),w=(f||"").toLowerCase();for(const k of a)if(x.includes(k)||w.includes(k))return!0;return!1},o=new Set(t.map(d=>d.scene).filter(d=>!!d)),n=!!(this.areaId&&this.entities&&this.entities.length>0),l=new Set(n?this.entities.filter(d=>d.domain!=="scene"&&d.domain!=="script"?!1:d.in_area||o.has(d.entity_id)||s(d.entity_id,d.name)).map(d=>d.entity_id):[]),c=t;return r`
      <div class="overlay" @click=${d=>{d.target===d.currentTarget&&this._closeDiscard()}}>
        <div class="edit-panel">
          <div class="panel-header">
            <span class="panel-header-icon">🌅</span>
            <span class="panel-header-title">
              Slots Configuration${this.channelName?r` · <span style="color:var(--secondary-text-color);font-weight:500">${this.channelName}</span>`:""}
            </span>
            <button class="panel-close" @click=${this._closeDiscard}>✕</button>
          </div>

          <div class="panel-body">
            <div class="slots-list">
              <div style="display:flex; align-items:center; justify-content:space-between; gap:16px; padding:12px 16px; background:var(--ha-card-background, var(--card-background-color, rgba(255, 255, 255, 0.02))); border:1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 8%, transparent)); border-radius:12px; margin-bottom:12px;">
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
                    placeholder=${String(((u=this.placeholderDefaults)==null?void 0:u.transition_on_seconds)??60)}
                    @input=${d=>{const f=d.target.value;this._draftTransitionOnSeconds=f.trim()===""?null:parseInt(f,10)}}
                  />
                </div>
              </div>
              <div class="slots-notice">
                <span>⏱️</span>
                <span>A minimum distance of ${((g=this.placeholderDefaults)==null?void 0:g.min_slot_distance_minutes)??oa} minutes between consecutive slots is maintained, with a maximum offset of ±${((p=this.placeholderDefaults)==null?void 0:p.max_offset_minutes)??180} minutes.</span>
              </div>
              <div class="slots-header">
                <div>Slot</div>
                <div>Start Type</div>
                <div>Value / Offset</div>
                <div>Time</div>
                <div>Scene / Script</div>
                <div></div>
              </div>

              ${c.map(d=>{const f=d.id===this.highlightSlotId,x=!this.isPrimaryChannel,w=d.startType==="fixed"&&!this._isValidHHMM(d.fixedStartTime);return r`
                  <div class="slot-edit-card ${f?"highlighted":""} ${w?"invalid":""}">
                    <!-- Col 1: Icon/Dot + Label/Input -->
                    <div style="display:flex; align-items:center; gap:8px; min-width: 0;">
                      <div class="slot-edit-dot" style="background:${d.color}"></div>
                      <div style="flex: 1; min-width: 0;">
                        ${x?r`
                            <input
                              type="text"
                              class="sensor-input"
                              .value=${d.label}
                              @input=${k=>{const v=k.target.value;this._updateDraft(t.map(m=>m.id===d.id?{...m,label:v}:m))}}
                              placeholder="Slot Name"
                            />
                          `:r`<div class="slot-edit-label" style="font-size:13px; font-weight:600">${d.label}</div>`}
                      </div>
                    </div>

                    <!-- Col 2: Start Type -->
                    <div>
                      <span class="mobile-label">Start Type</span>
                      ${x?r`
                          <select
                            class="sensor-input"
                            @change=${k=>{const v=k.target.value;this._updateDraft(t.map(m=>m.id===d.id?{...m,startType:v,startEvent:v==="astral"?"civil_dawn":void 0,fixedStartTime:v==="fixed"?"12:00":void 0,startOffset:v==="astral"?0:void 0}:m))}}
                          >
                            <option value="fixed" ?selected=${(d.startType||"fixed")==="fixed"}>Fixed Time</option>
                            <option value="astral" ?selected=${d.startType==="astral"}>Sun Event</option>
                          </select>
                        `:r`
                          <select class="sensor-input" disabled style="opacity:0.6">
                            <option>Sun Event</option>
                          </select>
                        `}
                    </div>

                    <!-- Col 3: Value / Offset -->
                    <div>
                      <span class="mobile-label">Value / Offset</span>
                      ${d.startType==="fixed"?r`
                          <input
                            type="time"
                            class="sensor-input"
                            .value=${d.fixedStartTime||"12:00"}
                            @change=${k=>{const v=k.target.value;this._updateDraft(t.map(m=>m.id===d.id?{...m,fixedStartTime:v}:m))}}
                          />
                        `:r`
                          <div style="display:flex; gap:6px;">
                            ${x?r`
                                <select
                                  class="sensor-input"
                                  style="flex:1"
                                  @change=${k=>{const v=k.target.value;this._updateDraft(t.map(m=>m.id===d.id?{...m,startEvent:v}:m))}}
                                >
                                  ${Object.entries(La).map(([k,v])=>r`
                                    <option value=${k} ?selected=${(d.startEvent||"civil_dawn")===k}>${v}</option>
                                  `)}
                                </select>
                              `:r`<input class="sensor-input" style="flex:1; opacity:0.6" disabled .value=${La[d.startEvent||""]||d.startEvent||""} />`}
                            <input
                              type="number"
                              class="sensor-input"
                              style="width:64px;"
                              .value=${String(d.startOffset||0)}
                              @input=${k=>{const v=k.target,m=Number(v.value),C=this._clampOffset(d.id,m,t);C!==m&&(v.value=String(C)),this._updateDraft(t.map(O=>O.id===d.id?{...O,startOffset:C}:O))}}
                              placeholder="Offset"
                            />
                          </div>
                        `}
                    </div>

                    <!-- Col 4: Time -->
                    <div>
                      <span class="mobile-label">Time</span>
                      <span class="slot-edit-time" style="font-size: 13px; font-family: monospace; font-weight: 500;">
                        ${ne(d.from)} → ${ne(d.to)}
                      </span>
                    </div>

                    <!-- Col 5: Scene / Script -->
                    <div>
                      <span class="mobile-label">Scene / Script</span>
                      <ha-entity-picker
                        .hass=${this.hass}
                        .value=${d.scene??""}
                        .includeDomains=${["scene","script"]}
                        .entityFilter=${n?k=>l.has(k.entity_id):void 0}
                        allow-custom-entity
                        @value-changed=${k=>{const v=k.detail.value||null;v!==d.scene&&this._setSlotScene(d.id,v)}}
                      ></ha-entity-picker>
                    </div>

                    <!-- Col 6: Delete action -->
                    <div style="display: flex; justify-content: flex-end;">
                      ${x?r`
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

              ${this.isPrimaryChannel?"":t.length>=pi?r`<button class="btn-add-slot" disabled>Max ${pi} slots reached</button>`:r`<button class="btn-add-slot" @click=${this._addCustomSlot}>➕ Add Slot</button>`}
            </div>
          </div>

          <div class="panel-footer">
            ${this._hasInvalidSlot()?r`
              <span style="flex:1; color:var(--error-color, #db4437); font-size:13px; align-self:center;">
                ⚠️ Fix invalid times (HH:MM) before saving
              </span>
            `:""}
            <button class="btn-done" ?disabled=${this._hasInvalidSlot()} @click=${this._closeAndSave}>Save</button>
          </div>
        </div>
      </div>
    `}};rt.styles=z`
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-family, inherit);
    }

    .edit-panel {
      background: var(--input-fill-color, var(--mdc-text-field-fill-color, var(--card-background-color, #2d2a3d)));
      border-radius: 16px;
      border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 10%, transparent));
      width: 90vw;
      max-width: 1000px;
      max-height: calc(100vh - 96px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5);
    }

    .panel-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 24px;
      background: var(--primary-background-color, #14141f);
      border-bottom: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 8%, transparent));
      flex-shrink: 0;
    }

    .panel-header-icon {
      font-size: 20px;
      opacity: 0.7;
    }

    .panel-header-title {
      flex: 1;
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color);
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
    }
    .panel-close:hover {
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      color: var(--primary-text-color);
    }

    .panel-body {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overflow-x: auto;
      padding: 16px 0;
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
      grid-template-columns: minmax(110px, 1.2fr) minmax(100px, 1fr) minmax(150px, 1.4fr) minmax(90px, 1fr) minmax(200px, 2.5fr) 30px;
      gap: 12px;
      padding: 0 16px 8px;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--secondary-text-color);
      letter-spacing: 0.5px;
      border-bottom: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 8%, transparent));
    }

    .slot-edit-card {
      display: grid;
      grid-template-columns: minmax(110px, 1.2fr) minmax(100px, 1fr) minmax(150px, 1.4fr) minmax(90px, 1fr) minmax(200px, 2.5fr) 30px;
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
      background: var(--ha-card-background, var(--card-background-color, rgba(255, 255, 255, 0.02)));
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
      background: color-mix(in srgb, var(--primary-text-color) 4%, var(--card-background-color, rgba(255, 255, 255, 0.02)));
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
        background: var(--ha-card-background, var(--card-background-color, rgba(255, 255, 255, 0.02)));
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
  `,bt([h({attribute:!1})],rt.prototype,"hass",2),bt([h({type:Array})],rt.prototype,"slots",2),bt([h({type:Array})],rt.prototype,"entities",2),bt([h({type:Boolean})],rt.prototype,"open",2),bt([h({type:String})],rt.prototype,"highlightSlotId",2),bt([h({type:String})],rt.prototype,"areaId",2),bt([h({type:String})],rt.prototype,"areaName",2),bt([h({type:Boolean})],rt.prototype,"isPrimaryChannel",2),bt([h({type:String})],rt.prototype,"channelName",2),bt([h({type:Number})],rt.prototype,"transitionOnSeconds",2),bt([h({attribute:!1})],rt.prototype,"placeholderDefaults",2),bt([b()],rt.prototype,"_draft",2),bt([b()],rt.prototype,"_draftTransitionOnSeconds",2),rt=bt([H("twilight-slot-editor")],rt);function gt(t){return t.channels||{}}function Ra(t){return Object.keys(gt(t)).sort((i,a)=>i===T?-1:a===T?1:0)}function le(t,e){var i;return((i=gt(t)[e])==null?void 0:i.slots)||[]}var Mo=Object.defineProperty,Po=Object.getOwnPropertyDescriptor,G=(t,e,i,a)=>{for(var s=a>1?void 0:a?Po(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&Mo(e,i,s),s};let W=class extends L{constructor(){super(...arguments),this.hass=null,this.areaId="",this.areaConfigs=[],this.areas=[],this.todayData=null,this.globalConfig={},this.placeholderDefaults=null,this.areasState={},this._areaPlaceholderDefaults=null,this._isNewArea=!1,this._selectedChannelId=T,this._areaEntities=[],this._extractedEntities={},this._slotEditOpen=!1,this._editingSlotId=null,this._hoveredTime=null,this._hoveredChannelId=T,this._tooltipX=0,this._tooltipY=0,this._resetDialogOpen=!1,this._globalDefaultsTemplate=null,this._resetNodes=[],this._slotTimes=null,this._dialog=new fe(this),this._clock=new Ue(this),this._lastLoadedKey="",this._draftController=new ua(this,{onSave:async t=>{if(!this.hass)return;const e=await Ss(this.hass,t),i=this.areaConfigs.findIndex(s=>s.area_id===e.area_id);let a;return i>=0?a=this.areaConfigs.map((s,o)=>o===i?e:s):a=[...this.areaConfigs,e],this._isNewArea=!1,this.dispatchEvent(new CustomEvent("areas-changed",{detail:a,bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent("engines-changed",{bubbles:!0,composed:!0})),e}})}get _effectivePlaceholderDefaults(){return this._areaPlaceholderDefaults??this.placeholderDefaults}async _saveOrUpdateDraft(){this._isNewArea?this.requestUpdate():await this._draftController.save()}connectedCallback(){super.connectedCallback(),this.hass&&this.areaId&&this._loadAreaDetails()}updated(t){if(super.updated(t),(t.has("areaId")||t.has("hass"))&&this.areaId&&this.hass){const e=t.get("areaId"),i=t.get("hass");(this.areaId!==e||this.hass!==i)&&this._loadAreaDetails()}}async _loadAreaDetails(){var s;const t=`${this.areaId}_${(s=this.hass)!=null&&s.states?"has_hass":"no_hass"}`;if(t===this._lastLoadedKey||(this._lastLoadedKey=t,!this.hass||!this.areaId))return;this._draftController.loading=!0,this.requestUpdate(),this._selectedChannelId=T;const e=this.areaConfigs.find(o=>o.area_id===this.areaId),i=this.areas.find(o=>o.area_id===this.areaId);let a;e?(this._isNewArea=!1,a=structuredClone(e)):(this._isNewArea=!0,a=await la(this.hass,this.areaId),i&&(a.name=i.name)),a.activities=Pa(a.activities),this._draftController.init(a);try{const[o,n]=await Promise.all([Ts(this.hass,this.areaId),As(this.hass,this.areaId).catch(l=>(console.warn("Backend extraction not available yet, using empty fallback",l),{}))]);this._extractedEntities=n||{},this._updateAreaEntities(this._draftController.draft,o),await this._fetchSlotTimes()}catch(o){console.error("Error fetching area entities",o)}finally{this._draftController.loading=!1,this.requestUpdate()}}async _fetchSlotTimes(){if(!(!this.hass||!this.areaId||this._isNewArea)){try{this._slotTimes=await ha(this.hass,{area_id:this.areaId})}catch(t){console.warn("Failed to fetch area slot times:",t)}try{this._areaPlaceholderDefaults=await vi(this.hass,this.areaId)}catch(t){console.warn("Failed to fetch area placeholder defaults:",t)}}}_activeChannelId(t){return Ra(t).includes(this._selectedChannelId)?this._selectedChannelId:T}_updateAreaEntities(t,e){const i=new Set;this._extractedEntities&&Object.values(this._extractedEntities).forEach(n=>{(Array.isArray(n)?n:(n==null?void 0:n.extracted)??[]).forEach(c=>i.add(c))});const a=new Set,s=this._activeChannelId(t);le(t,s).forEach(n=>{var l;(l=n.configured_entities)==null||l.forEach(c=>a.add(c))});const o=a.size>0;this._areaEntities=e.map(n=>{const l=i.has(n.entity_id),c=o&&a.has(n.entity_id);return{entity_id:n.entity_id,name:n.name,domain:n.domain,in_area:n.in_area,checked:c||l,isExtracted:l,isManual:c}})}_refreshExtractedEntities(){this._draftController.draft&&this._updateAreaEntities(this._draftController.draft,this._areaEntities)}async _confirmDiscardIfDirty(){return!this._isNewArea&&!this._draftController.isDirty?!0:this._dialog.showConfirm("Discard Changes","You have unsaved changes. Are you sure you want to discard them?")}async _backToOverview(){await this._confirmDiscardIfDirty()&&this.dispatchEvent(new CustomEvent("back",{bubbles:!0,composed:!0}))}_saveStatusText(){if(this._draftController.saving)return"Saving…";const t=this._draftController.saveError;return t?`Save failed: ${t&&typeof t=="object"&&"message"in t?String(t.message):String(t)}`:this._isNewArea?"New Area Setup":this._draftController.isDirty?"Unsaved changes":"All changes saved"}_onSunPathHover(t){this._hoveredTime=t.detail.hoverTime,t.detail.channelId&&(this._hoveredChannelId=t.detail.channelId)}async _onSensorsChanged(t){this._draftController.update({sensors:t.detail}),await this._saveOrUpdateDraft()}_availableActivities(t){const e=(t.activities??[]).map(i=>i.id);return e.length>0?e:["sleep"]}async _onInputsChanged(t){this._draftController.update({inputs:t.detail.inputs}),await this._saveOrUpdateDraft()}async _onActivitiesChanged(t){this._draftController.update({activities:t.detail.activities}),await this._saveOrUpdateDraft()}_onSunPathMove(t){this._tooltipX=t.clientX,this._tooltipY=t.clientY}_onSlotSelected(t){t.detail.channelId&&(this._selectedChannelId=t.detail.channelId),this._editingSlotId=t.detail.slotId,this._slotEditOpen=!0}_onChannelSelected(t){this._selectedChannelId=t.detail.channelId,this._refreshExtractedEntities()}async _onChannelAdded(t){const e=this._draftController.draft;if(!e)return;const i=t.detail.name.trim();if(!i)return;const a=i.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"");if(!a)return;const s={...gt(e)};if(s[a]){await this._dialog.showAlert("Channel already exists",`A channel named "${i}" already exists.`);return}s[a]={name:i,enabled:!0,slots:[]},this._draftController.update({channels:s}),this._selectedChannelId=a,await this._saveOrUpdateDraft()}async _onChannelRenamed(t){const e=this._draftController.draft;if(!e)return;const{channelId:i,name:a}=t.detail,s={...gt(e)},o=s[i];o&&(s[i]={...o,name:a},this._draftController.update({channels:s}),await this._saveOrUpdateDraft())}async _onChannelDeleted(t){const e=this._draftController.draft;if(!e||t.detail.channelId===T)return;const i={...gt(e)};delete i[t.detail.channelId],this._draftController.update({channels:i}),this._selectedChannelId===t.detail.channelId&&(this._selectedChannelId=T),await this._saveOrUpdateDraft()}async _onChannelToggled(t){const e=this._draftController.draft;if(!e||t.detail.channelId===T)return;const i={...gt(e)},a=i[t.detail.channelId];a&&(i[t.detail.channelId]={...a,enabled:t.detail.enabled},this._draftController.update({channels:i}),await this._saveOrUpdateDraft())}_withChannelSlots(t,e,i,a){const s={...gt(t)},o=s[e];return o&&(s[e]={...o,slots:i,...a!==void 0?{transition_on_seconds:a}:{}}),s}async _onSlotsChanged(t){const e=this._draftController.draft;if(!e)return;const i=this._activeChannelId(e),a=le(e,i),s=t.detail.slots.map(o=>{const n=a.find(c=>c.id===o.id),l=o.startType==="fixed";return{id:o.id,name:o.label,start_type:l?"fixed":"astral",zone:l?null:o.startEvent||(n==null?void 0:n.zone)||"civil_dawn",fixed_time:l?o.fixedStartTime||"00:00":null,offset_minutes:o.startOffset||0,scene_entity_id:o.scene,configured_entities:(n==null?void 0:n.configured_entities)||[]}});this._draftController.update({channels:this._withChannelSlots(e,i,s,t.detail.transitionOnSeconds)}),this._refreshExtractedEntities(),await this._saveOrUpdateDraft(),await this._fetchSlotTimes()}async _onLightsChanged(t){const e=this._draftController.draft;if(!e)return;this._areaEntities=t.detail.entities;const i=t.detail.entities.filter(o=>o.isManual).map(o=>o.entity_id),a=this._activeChannelId(e),s=le(e,a).map(o=>({...o,configured_entities:i}));this._draftController.update({channels:this._withChannelSlots(e,a,s)}),this._refreshExtractedEntities(),await this._saveOrUpdateDraft()}async _onLightsModeChanged(t){this._draftController.update({manual_only:t.detail.manualOnly}),await this._saveOrUpdateDraft()}async _onSelectAreaChanged(t){var s;const e=t.target,i=e.value,a=(s=this._draftController.draft)==null?void 0:s.area_id;if(i!==a){if(!await this._confirmDiscardIfDirty()){e.value=a??"";return}this.dispatchEvent(new CustomEvent("select-area",{detail:{areaId:i},bubbles:!0,composed:!0}))}}async _onAreaEnabledToggled(t){const e=t.target.checked;this._draftController.update({enabled:e}),await this._saveOrUpdateDraft()}async _deleteArea(){if(!(!this.areaId||!this.hass||!await this._dialog.showConfirm("Delete Configuration","Are you sure you want to delete the Twilight configuration for this area?")))try{await Ds(this.hass,this.areaId);const e=this.areaConfigs.filter(i=>i.area_id!==this.areaId);this.dispatchEvent(new CustomEvent("areas-changed",{detail:e,bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent("engines-changed",{bubbles:!0,composed:!0})),this._backToOverview()}catch(e){console.error("Error deleting area config",e)}}async _resetAreaToGlobalDefaults(){const t=this._draftController.draft;if(!(!t||!this.hass))try{const e=await la(this.hass,t.area_id);this._globalDefaultsTemplate=e;const i=[{id:"inherited",label:"Inherited Defaults (Lux Threshold, Extend Window, etc.)"},{id:"area_inputs",label:"Area Inputs",children:(e.inputs||[]).map(a=>({id:`area_inputs:${a.id}`,label:`${a.type} — ${a.activity}`}))},{id:"area_activities",label:"Area Activities",children:(e.activities||[]).map(a=>({id:`area_activities:${a.id}`,label:a.id}))},{id:"area_channels",label:"Area Custom Channels",children:Object.entries(e.channels||{}).filter(([a])=>a!==T).map(([a,s])=>({id:`area_channels:${a}`,label:s.name||a}))}];this._resetNodes=i,this._resetDialogOpen=!0,this.requestUpdate()}catch(e){console.error("Failed to load area global defaults template:",e)}}async _executeReset(t){if(!this._globalDefaultsTemplate||!this._draftController.draft)return;const e=new Set(t.detail.selectedIds),i=this._globalDefaultsTemplate;this._draftController.update(a=>{e.has("inherited")&&(a.lux_threshold=null,a.lux_watch_window=null);const s=e.has("area_inputs"),o=i.inputs||[];if(s)a.inputs=structuredClone(o);else{const g=[...a.inputs||[]];o.forEach(p=>{if(e.has(`area_inputs:${p.id}`)){const d=g.findIndex(f=>f.id===p.id);d>=0?g[d]=structuredClone(p):g.push(structuredClone(p))}}),a.inputs=g}const n=e.has("area_activities"),l=i.activities||[];if(n)a.activities=structuredClone(l);else{const g=[...a.activities||[]];l.forEach(p=>{if(e.has(`area_activities:${p.id}`)){const d=g.findIndex(f=>f.id===p.id);d>=0?g[d]=structuredClone(p):g.push(structuredClone(p))}}),a.activities=g}const c=e.has("area_channels"),u=i.channels||{};if(c){const g={...a.channels||{}};Object.keys(g).forEach(p=>{p!==T&&delete g[p]}),Object.entries(u).forEach(([p,d])=>{p!==T&&(g[p]=structuredClone(d))}),a.channels=g}else{const g={...a.channels||{}};Object.keys(u).forEach(p=>{p!==T&&e.has(`area_channels:${p}`)&&(g[p]=structuredClone(u[p]))}),a.channels=g}}),this._resetDialogOpen=!1,this.requestUpdate(),await this._saveOrUpdateDraft()}_renderTooltip(t,e){if(this._hoveredTime===null)return r``;const i=this._hoveredTime,s=(t[this._hoveredChannelId]??e).find(n=>ge(n,i));if(!s)return r``;const o=s.scene?mi(this.hass,s.scene):s.label;return r`
      <div class="slot-tooltip" style="left:${this._tooltipX+15}px; top:${this._tooltipY+15}px">
        <span class="slot-tooltip-badge" style="background:${s.color}; color:#fff; box-shadow:0 0 10px ${s.color}40">
          ${o} (${ne(i)})
        </span>
      </div>
    `}_areaToSlots(t,e){var s,o,n;const i=new Date().toISOString().slice(0,10),a=((n=(o=(s=this._slotTimes)==null?void 0:s.channels)==null?void 0:o[t])==null?void 0:n[i])||[];return He(a,e)}_activeSceneName(t){var o,n,l;const e=this.areasState[this.areaId]||null;if(e)return e.active_scene_name??"No Scene Active";const i=this._clock.liveMins,a=t.find(c=>ge(c,i)),s=(a==null?void 0:a.scene)??null;return s?((l=(n=(o=this.hass)==null?void 0:o.states[s])==null?void 0:n.attributes)==null?void 0:l.friendly_name)??s:"No Scene Active"}render(){var p,d;if(this._draftController.loading)return r`<div style="padding:24px;color:var(--secondary-text-color)">Loading Area Details…</div>`;const t=this._draftController.draft;if(!t)return r``;const e=this.areas.find(f=>f.area_id===t.area_id),i=t.name||(e==null?void 0:e.name)||t.area_id,a=new Date().toISOString().slice(0,10),s=this._activeChannelId(t),o=this._areaToSlots(s,le(t,s)),n=this._areaToSlots(T,le(t,T)),l=t.sensors||[],c=this._activeSceneName(o),u=this.areasState[t.area_id]||null,g={};for(const[f,x]of Object.entries(gt(t)))g[f]=this._areaToSlots(f,x.slots||[]);return r`
      <div class="view-header-container">
        <div class="view-header-grid detail-header">
          <div class="header-left">
            <button class="back-btn" @click=${()=>this._backToOverview()} title="Back to Areas">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            </button>
            <div class="group-select-wrap">
              <h2>${i}</h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--secondary-text-color)"><path d="M7 10l5 5 5-5H7z"/></svg>
              <select class="group-select"
                @change=${this._onSelectAreaChanged}>
                ${this.areaConfigs.map(f=>r`
                  <option value="${f.area_id}" ?selected=${f.area_id===t.area_id}>${f.name||f.area_id}</option>
                `)}
              </select>
            </div>
          </div>
          <div class="header-right">
            <span class="enabled-label">${t.enabled?"Enabled":"Disabled"}</span>
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
              .slots=${n}
              .channels=${gt(t)}
              .channelSlotsMap=${g}
              .sensorConfig=${l}
              .inputs=${t.inputs||[]}
              .entities=${this._areaEntities}
              .runState=${u}
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
              .channels=${gt(t)}
              .selectedChannelId=${s}
              .channelSlotsMap=${g}
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
              .runState=${u}
              .manualOnly=${t.manual_only??!1}
              @lights-changed=${this._onLightsChanged}
              @mode-changed=${this._onLightsModeChanged}
            ></twilight-area-lights-card>
          </div>
          <div class="span-6">
            <twilight-inputs-card
              .hass=${this.hass}
              .config=${t.inputs??[]}
              .activities=${this._availableActivities(t)}
              .activitiesConfig=${t.activities??[]}
              .placeholderDefaults=${this.placeholderDefaults}
              .runState=${u}
              .areaId=${t.area_id}
              @inputs-changed=${this._onInputsChanged}
            ></twilight-inputs-card>
          </div>
          <div class="span-6">
            <twilight-activities-card
              .hass=${this.hass}
              .config=${t.activities??[]}
              .inputs=${t.inputs??[]}
              .placeholderDefaults=${this.placeholderDefaults}
              .channels=${gt(t)}
              @activities-changed=${this._onActivitiesChanged}
            ></twilight-activities-card>
          </div>
          <div class="span-6">
            <twilight-sensors-card
              .hass=${this.hass}
              .config=${l}
              .noHeader=${!1}
              @sensors-changed=${this._onSensorsChanged}
            ></twilight-sensors-card>
          </div>
        </div>
      </div>
 
      <div class="detail-footer">
        <div>
          <button class="btn-cancel" @click=${this._resetAreaToGlobalDefaults}>Reset to Global Defaults</button>
          ${this.areaConfigs.some(f=>f.area_id===t.area_id)?r`
            <button class="btn-cancel" style="border-color: var(--error-color, #db4437); color: var(--error-color, #db4437); margin-left: 12px;" @click=${()=>this._deleteArea()}>
              Remove Area
            </button>
          `:""}
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span class="save-status ${this._draftController.saveError?"error":""}">${this._saveStatusText()}</span>
          ${this._isNewArea||this._draftController.isDirty&&!this._draftController.saving?r`
            ${this._isNewArea?r`
              <button class="btn-cancel" ?disabled=${this._draftController.saving} @click=${()=>this._backToOverview()}>Cancel</button>
            `:r`
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
        .isPrimaryChannel=${s===T}
        .channelName=${((p=gt(t)[s])==null?void 0:p.name)||""}
        .transitionOnSeconds=${((d=gt(t)[s])==null?void 0:d.transition_on_seconds)??null}
        @slots-changed=${this._onSlotsChanged}
        @close=${()=>{this._slotEditOpen=!1,this._editingSlotId=null}}
      ></twilight-slot-editor>

      ${this._renderTooltip(g,o)}

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

      <twilight-confirm-dialog
        .open=${this._dialog.confirmOpen}
        .dialogTitle=${this._dialog.confirmTitle}
        .message=${this._dialog.confirmMessage}
        @confirm=${this._dialog._onConfirm}
        @cancel=${this._dialog._onCancelConfirm}
      ></twilight-confirm-dialog>
    `}};W.styles=[yi,wi,ga,z`
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
        .span-6 { grid-column: span 12; }
      }

      .detail-header {
        display: flex !important;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
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

      .group-select-wrap {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
      }

      .group-select-wrap h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
        color: var(--primary-text-color);
        pointer-events: none;
        transition: color 0.2s;
      }

      .group-select-wrap:hover h2 {
        color: var(--tp-accent, var(--accent-color));
      }

      .group-select-wrap svg {
        pointer-events: none;
        flex-shrink: 0;
      }

      .group-select {
        position: absolute;
        inset: 0;
        opacity: 0;
        cursor: pointer;
        width: 100%;
        height: 100%;
        font-size: 14px;
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
    `],G([h({type:Object})],W.prototype,"hass",2),G([h({type:String})],W.prototype,"areaId",2),G([h({type:Array})],W.prototype,"areaConfigs",2),G([h({type:Array})],W.prototype,"areas",2),G([h({type:Object})],W.prototype,"todayData",2),G([h({type:Object})],W.prototype,"globalConfig",2),G([h({type:Object})],W.prototype,"placeholderDefaults",2),G([h({type:Object})],W.prototype,"areasState",2),G([b()],W.prototype,"_areaPlaceholderDefaults",2),G([b()],W.prototype,"_isNewArea",2),G([b()],W.prototype,"_selectedChannelId",2),G([b()],W.prototype,"_areaEntities",2),G([b()],W.prototype,"_extractedEntities",2),G([b()],W.prototype,"_slotEditOpen",2),G([b()],W.prototype,"_editingSlotId",2),G([b()],W.prototype,"_hoveredTime",2),G([b()],W.prototype,"_hoveredChannelId",2),G([b()],W.prototype,"_tooltipX",2),G([b()],W.prototype,"_tooltipY",2),G([b()],W.prototype,"_resetDialogOpen",2),G([b()],W.prototype,"_globalDefaultsTemplate",2),G([b()],W.prototype,"_resetNodes",2),G([b()],W.prototype,"_slotTimes",2),W=G([H("twilight-area-detail-view")],W);var No=Object.defineProperty,Lo=Object.getOwnPropertyDescriptor,mt=(t,e,i,a)=>{for(var s=a>1?void 0:a?Lo(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&No(e,i,s),s};let lt=class extends L{constructor(){super(...arguments),this.hass=null,this.globalConfigOverride=null,this._areaConfigs=[],this._areas=[],this._todayData=null,this._activeAreaId=null,this._view="overview",this._loading=!1,this._showAddAreaList=!1,this._areasState={},this._unsubAll=null,this._globalConfig={},this._placeholderDefaults=null,this._areaSlotTimesMap={},this._clock=new Ue(this)}firstUpdated(t){super.firstUpdated(t),this._loadData(),this.hass&&this._subscribeAll()}updated(t){super.updated(t),t.has("hass")&&this.hass&&!this._unsubAll&&this._subscribeAll(),t.has("globalConfigOverride")&&this.globalConfigOverride&&(this._globalConfig=this.globalConfigOverride)}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribeAll()}async _loadData(){this._loading=!0;try{if(this.hass){const[t,e,i,a,s]=await Promise.all([ra(this.hass),Cs(this.hass),je(this.hass),da(this.hass).catch(()=>({})),vi(this.hass).catch(()=>null)]);this._areaConfigs=t.map(l=>({...l,activities:Pa(l.activities)})),this._areas=e,this._todayData=i.day_data||null,this._globalConfig=a||{},this._placeholderDefaults=s;const o=new Date().toISOString().slice(0,10),n={};await Promise.all(this._areaConfigs.map(async l=>{try{const c=await ha(this.hass,{area_id:l.area_id,date:o});n[l.area_id]=c}catch{}})),this._areaSlotTimesMap=n}}finally{this._loading=!1}}_selectArea(t){this._activeAreaId=t,this._showAddAreaList=!1,this._view="config"}_subscribeAll(){this._unsubscribeAll(),this.hass&&this.hass.connection.subscribeMessage(t=>{this._areasState=t.full?t.areas||{}:{...this._areasState,...t.areas||{}}},{type:"twilight/subscribe_all"}).then(t=>{this._unsubAll=t},t=>{console.warn("Error subscribing to all areas",t)})}_unsubscribeAll(){this._unsubAll&&(this._unsubAll(),this._unsubAll=null),this._areasState={}}_backToOverview(){this._view="overview",this._activeAreaId=null}_overviewEngineInfo(t,e){if(!e.enabled)return{label:"Disabled",color:"#888",sub:"Engine inactive"};if(!t)return{label:"Standby",color:"var(--secondary-text-color)",sub:"Idle"};const i=t.active_activity;if(i)return{label:i.charAt(0).toUpperCase()+i.slice(1),color:"#9c27b0",sub:`Activity: ${i}`};const a=t.scene_activated_at!==null;return{label:a?"Scene Active":"Idle",color:a?"#4caf50":"#2196f3",sub:a?"Scene switched by engine":"Waiting for input"}}_emitAreasChanged(){this.dispatchEvent(new CustomEvent("areas-changed",{detail:this._areaConfigs,bubbles:!0,composed:!0}))}render(){return this._loading?r`<div style="padding:24px;color:var(--secondary-text-color)">Loading…</div>`:this._view==="config"&&this._activeAreaId?r`
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
      `:this._renderOverview()}_buildAreaCardData(t){var E,y,q,tt,Z;const e=this._areas.find(M=>M.area_id===t.area_id),i=(E=this._areasState)==null?void 0:E[t.area_id],a=this._todayData,s=this._clock.liveMins,o=new Date().toISOString().slice(0,10),n=this._areaSlotTimesMap[t.area_id],l=Ra(t),c=[];for(const M of l){const B=gt(t)[M],ct=((q=(y=n==null?void 0:n.channels)==null?void 0:y[M])==null?void 0:q[o])||[],D=He(ct,le(t,M)),N=Rs(D),nt=t.enabled&&(B==null?void 0:B.enabled)!==!1;c.push({id:M,name:(B==null?void 0:B.name)||(M===T?"Primary":M),slots:D,gradient:N,enabled:nt})}const u=((Z=(tt=n==null?void 0:n.channels)==null?void 0:tt[T])==null?void 0:Z[o])||[],p=He(u,le(t,T)).find(M=>ge(M,s)),d=t.enabled?(p==null?void 0:p.label)??"None":"Disabled",f=t.enabled?(p==null?void 0:p.color)??"rgba(255,255,255,0.15)":"#888",x=(p==null?void 0:p.id)==="day",w=t.enabled?x?"#141926":`color-mix(in srgb, ${f} 25%, #ffffff)`:"var(--secondary-text-color)",k=t.enabled?f:"rgba(255,255,255,0.05)",m=`--badge-border:${t.enabled?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.08)"};--badge-bg:${k};--badge-text:${w}`,C=this._overviewEngineInfo(i,t),O=(i==null?void 0:i.lights_on)??0,A=(i==null?void 0:i.lights_total)??0,U=(s/1440*100).toFixed(2),ot=i==null?void 0:i.active_scene_names,_=[];if(i&&i.scene_activated_at!==null&&ot)for(const M of l){const B=ot[M];if(B){const ct=gt(t)[M],D=(ct==null?void 0:ct.name)||(M===T?"Primary":M);_.push({channelName:D,sceneName:B})}}let I=9,V=9;c.length===1?(I=12,V=10):c.length===2?(I=11,V=10):c.length===3&&(I=10,V=9);const j=I/2,F=I+(I>=16?8:I>=12?6:5),dt=c.length===1?0:I/2,$=`--row-height:${F}px;--bar-height:${I}px;--bar-radius:${j}px;--label-font-size:${V}px;--row-gap:${dt}px;`;return{areaName:t.name||(e==null?void 0:e.name)||t.area_id,slotLabel:d,slotColor:f,badgeStyle:m,sparklineStyle:$,rows:c,liveLeft:U,engineInfo:C,lightsOn:O,lightsTotal:A,activeSceneItems:_,todayData:a}}_renderOverview(){const t=this._areaConfigs.length,e=this._areas.length,i=this._areas.filter(a=>!this._areaConfigs.some(s=>s.area_id===a.area_id));return r`
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
          ${this._areaConfigs.map(a=>{const s=this._buildAreaCardData(a);return r`
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
                  ${s.rows.length>0?r`
                    <div class="sparkline-wrapper">
                      ${s.rows.map(o=>r`
                        <div class="sparkline-row ${o.enabled?"":"disabled"}">
                          <span class="sparkline-label" title="${o.name}">${o.name}</span>
                          <div class="sparkline-bar-wrapper">
                            <div class="sparkline-bar" style="--bar-gradient:${o.gradient}"></div>
                          </div>
                        </div>
                      `)}
                      ${a.enabled&&s.todayData?r`
                        <div class="sparkline-indicator-line" style="left: calc(86px + (100% - 86px) * ${s.liveLeft} / 100)"></div>
                      `:""}
                    </div>
                  `:r`
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

                    ${(()=>{const o=s.lightsOn>0;return r`
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
                    ${s.activeSceneItems.length>0?r`
                      <div class="scenes-list">
                        ${s.activeSceneItems.map(o=>r`
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
                    `:r`
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

        ${this._showAddAreaList?r`
          <div class="add-area-list" style="margin-top:20px">
            <div class="add-area-list-header">
              <span>Select an area to configure:</span>
              <button class="close-add-btn" @click=${a=>{a.stopPropagation(),this._showAddAreaList=!1}}>×</button>
            </div>
            <div class="unconfigured-grid">
              ${i.map(a=>r`
                <div class="unconfigured-row" @click=${()=>this._selectArea(a.area_id)}>
                  <span class="unconfigured-name">${a.name}</span>
                  <span class="setup-badge">Setup</span>
                </div>
              `)}
              ${i.length===0?r`<div class="no-unconfigured">All areas are already configured!</div>`:""}
            </div>
          </div>
        `:""}
      </div>
    `}};lt.styles=[yi,wi,z`
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
    .area-id-sub { font-size: 11px; color: var(--secondary-text-color); font-family: monospace; opacity: 0.7; }

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
    `],mt([h({type:Object})],lt.prototype,"hass",2),mt([h({type:Object})],lt.prototype,"globalConfigOverride",2),mt([b()],lt.prototype,"_areaConfigs",2),mt([b()],lt.prototype,"_areas",2),mt([b()],lt.prototype,"_todayData",2),mt([b()],lt.prototype,"_activeAreaId",2),mt([b()],lt.prototype,"_view",2),mt([b()],lt.prototype,"_loading",2),mt([b()],lt.prototype,"_showAddAreaList",2),mt([b()],lt.prototype,"_areasState",2),mt([b()],lt.prototype,"_globalConfig",2),mt([b()],lt.prototype,"_placeholderDefaults",2),mt([b()],lt.prototype,"_areaSlotTimesMap",2),lt=mt([H("twilight-areas-view")],lt);var Ro=Object.defineProperty,jo=Object.getOwnPropertyDescriptor,Ft=(t,e,i,a)=>{for(var s=a>1?void 0:a?jo(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&Ro(e,i,s),s};const ye=60,ja=15,Ri=15,Ha=25,Ua={"1w":"1 Week","2w":"2 Weeks","1m":"1 Month","3m":"3 Months"},Ba={"1m":"1 Min","5m":"5 Min","10m":"10 Min","15m":"15 Min","30m":"30 Min"},Ho={"1m":{count:1440,duration:60},"5m":{count:288,duration:300},"10m":{count:144,duration:600},"15m":{count:96,duration:900},"30m":{count:48,duration:1800}},Fa={"1w":7,"2w":14,"1m":30,"3m":90},Wa=new Map;function Uo(t){let e=Wa.get(t);return e||(e=new Intl.DateTimeFormat("en-US",{timeZone:t,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1}),Wa.set(t,e)),e}function qa(t,e){const i=Object.fromEntries(Uo(e).formatToParts(t).map(o=>[o.type,o.value])),a=Number(i.hour)%24,s=Date.UTC(Number(i.year),Number(i.month)-1,Number(i.day),a,Number(i.minute),Number(i.second));return Math.round((s-t.getTime())/1e3)}function Ya(t,e){const i=qa(t,e),a=Math.floor(t.getTime()/1e3)+i,s=Math.floor(a/86400)*86400,o=qa(new Date(s*1e3),e);return s-o}let Et=class extends L{constructor(){super(...arguments),this.hass=null,this.activeAreaId=null,this._activeMode="motion",this._activeRange="1w",this._activeResolution="10m",this._loading=!1,this._motionData=[],this._lightData=[],this._w=0,this._ro=null}disconnectedCallback(){var t;(t=this._ro)==null||t.disconnect(),super.disconnectedCallback()}updated(t){var s;if(!this._ro){const o=(s=this.shadowRoot)==null?void 0:s.querySelector(".canvas-wrap");o&&(this._ro=new ResizeObserver(n=>{const l=n[0].contentRect.width;l>0&&l!==this._w&&(this._w=l,this._draw())}),this._ro.observe(o))}const e=t.has("hass")&&!t.get("hass")&&this.hass,i=t.has("activeAreaId")&&t.get("activeAreaId")!==this.activeAreaId,a=t.has("_activeRange");(e||i||a)&&this._load(),(t.has("_motionData")||t.has("_lightData")||t.has("_activeMode")||t.has("_activeResolution")||t.has("_w"))&&requestAnimationFrame(()=>this._draw())}async _load(){if(!(!this.hass||!this.activeAreaId)){this._loading=!0;try{const t=await Ps(this.hass,{area_id:this.activeAreaId,days:Fa[this._activeRange],binary_only:!0});this._motionData=t.motion??[],this._lightData=t.light_on??[]}catch(t){console.error("Twilight heatmap load error:",t)}finally{this._loading=!1}}}_setMode(t){this._activeMode=t}_setRange(t){this._activeRange=t}_setResolution(t){this._activeResolution=t}_getFillColorRGB(){const t=this._activeMode==="motion"?"--tw-chart-motion":"--tw-chart-light-on",e=this._activeMode==="motion"?"#00e5ff":"#ff9100",i=getComputedStyle(this).getPropertyValue(t).trim()||e;if(i.startsWith("#")){const s=parseInt(i.slice(1,3),16),o=parseInt(i.slice(3,5),16),n=parseInt(i.slice(5,7),16);return`${s}, ${o}, ${n}`}const a=i.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);return a?`${a[1]}, ${a[2]}, ${a[3]}`:this._activeMode==="motion"?"0, 176, 255":"255, 145, 0"}_getTextColor(){return getComputedStyle(this).getPropertyValue("--primary-text-color").trim()||"rgba(255,255,255,0.9)"}_getGridColor(){return getComputedStyle(this).getPropertyValue("--divider-color").trim()||"rgba(128,128,128,0.2)"}_getAxisFont(){return`400 11px ${getComputedStyle(this).getPropertyValue("--font-family").trim()||"system-ui, sans-serif"}`}_draw(){var F,dt;const t=(F=this.shadowRoot)==null?void 0:F.querySelector("canvas");if(!t||!this._w||!this.hass)return;const e=this._w,i=t.getBoundingClientRect().height;if(!i)return;const a=_i(t,e,i),s=e-ye-ja,n=(i-Ri-Ha)/7,l=this.hass.config.time_zone||"UTC",c=((dt=this.hass.locale)==null?void 0:dt.language)||navigator.language||"en-US",u=new Date,p=(u.getUTCDay()+6)%7,d=new Date(Date.UTC(u.getUTCFullYear(),u.getUTCMonth(),u.getUTCDate()-p)),f=Array.from({length:7},($,E)=>{const y=new Date(d.getTime()+E*24*60*60*1e3);return new Intl.DateTimeFormat(c,{weekday:"short",timeZone:l}).format(y)}),x=this._activeMode==="motion"?this._motionData:this._lightData;if(!(x&&x.length>0)){a.restore();return}const k=Fa[this._activeRange],v=new Date,{count:m,duration:C}=Ho[this._activeResolution],O=Array.from({length:7},()=>new Array(m).fill(0)),A=new Array(7).fill(0),U=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:l}),ot={Mon:0,Tue:1,Wed:2,Thu:3,Fri:4,Sat:5,Sun:6};for(let $=0;$<k;$++){const E=new Date(v.getTime()-$*24*60*60*1e3),y=Ya(E,l),q=Ya(new Date((y+25*3600)*1e3),l),tt=ot[U.format(new Date(y*1e3))]??0;let Z=0;for(const[D,N]of x)if(D<=y)Z=N;else break;const M=[];let B=y,ct=Z;for(const[D,N]of x)if(!(D<=y)){if(D>=q){M.push({start:B,end:q,val:ct}),B=q;break}M.push({start:B,end:D,val:ct}),B=D,ct=N}B<q&&M.push({start:B,end:q,val:ct});for(let D=0;D<m;D++){const N=y+D*C,nt=N+C;let xt=0;for(const St of M){const S=Math.max(St.start,N),P=Math.min(St.end,nt);S<P&&St.val===1&&(xt+=P-S)}const K=xt/C;O[tt][D]+=K}A[tt]++}const _=Array.from({length:7},()=>new Array(m).fill(0));for(let $=0;$<7;$++){const E=A[$];for(let y=0;y<m;y++)_[$][y]=E>0?O[$][y]/E:0}const I=this._getFillColorRGB(),V=this._getTextColor(),j=this._getGridColor();a.font=this._getAxisFont();for(let $=0;$<7;$++){const E=Ri+$*n;a.fillStyle=V,a.textAlign="right",a.fillText(f[$],ye-10,E+n/2+4),$>0&&(a.strokeStyle=j,a.beginPath(),a.moveTo(ye,E),a.lineTo(e-ja,E),a.stroke());for(let y=0;y<m;y++){const q=_[$][y];if(q>0){const tt=ye+y/m*s,Z=s/m+.5,M=n-2;let B=0;this._activeMode==="motion"?B=Math.min(1,Math.sqrt(q)*1.8):B=Math.min(1,q*1.2),a.fillStyle=`rgba(${I}, ${B})`,a.fillRect(tt,E+1,Z,M)}}}a.strokeStyle=j,a.lineWidth=1;for(let $=0;$<=24;$+=2){const E=ye+$/24*s;a.beginPath(),a.moveTo(E,Ri),a.lineTo(E,i-Ha),a.stroke()}a.fillStyle=V,a.textAlign="center";for(let $=0;$<=24;$+=4){const E=ye+$/24*s,y=`${$.toString().padStart(2,"0")}:00`;a.fillText(y,E,i-8)}a.restore()}render(){var e;const t=((e=this._activeMode==="motion"?this._motionData:this._lightData)==null?void 0:e.length)>0;return r`
      <div class="card-header">
        <div class="header-left">
          <span class="card-icon">⚡</span>
          <span class="card-title">Activity Profile (Heatmap)</span>
        </div>
        <div class="header-controls">
          <div class="toggle-group">
            <button
              class="toggle-btn ${this._activeMode==="motion"?"active":""}"
              @click=${()=>this._setMode("motion")}
            >
              Motion
            </button>
            <button
              class="toggle-btn ${this._activeMode==="light"?"active":""}"
              @click=${()=>this._setMode("light")}
            >
              Light
            </button>
          </div>
          <div class="toggle-group">
            ${Object.keys(Ba).map(i=>r`
              <button
                class="toggle-btn ${this._activeResolution===i?"active":""}"
                @click=${()=>this._setResolution(i)}
              >
                ${Ba[i]}
              </button>
            `)}
          </div>
          <div class="toggle-group">
            ${Object.keys(Ua).map(i=>r`
              <button
                class="toggle-btn ${this._activeRange===i?"active":""}"
                @click=${()=>this._setRange(i)}
              >
                ${Ua[i]}
              </button>
            `)}
          </div>
        </div>
      </div>
      <div class="canvas-wrap">
        ${!t&&!this._loading?r`<div class="no-data">No activity data available for the selected period</div>`:r`<canvas></canvas>`}
        ${this._loading?r`<div class="loading-overlay">Loading heatmap data…</div>`:""}
      </div>
    `}};Et.styles=z`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      overflow: hidden;
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
    .card-icon {
      font-size: 18px;
      opacity: 0.7;
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
  `,Ft([h({attribute:!1})],Et.prototype,"hass",2),Ft([h({type:String})],Et.prototype,"activeAreaId",2),Ft([b()],Et.prototype,"_activeMode",2),Ft([b()],Et.prototype,"_activeRange",2),Ft([b()],Et.prototype,"_activeResolution",2),Ft([b()],Et.prototype,"_loading",2),Ft([b()],Et.prototype,"_motionData",2),Ft([b()],Et.prototype,"_lightData",2),Ft([b()],Et.prototype,"_w",2),Et=Ft([H("twilight-heatmap-card")],Et);var Bo=Object.defineProperty,Fo=Object.getOwnPropertyDescriptor,Me=(t,e,i,a)=>{for(var s=a>1?void 0:a?Fo(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&Bo(e,i,s),s};let de=class extends L{constructor(){super(...arguments),this.hass=null,this._areaConfigs=[],this._activeAreaId=null,this._loading=!0}firstUpdated(t){super.firstUpdated(t),this._loadAreas()}updated(t){super.updated(t),t.has("hass")&&this.hass&&this._areaConfigs.length===0&&this._loadAreas()}async _loadAreas(){if(this.hass)try{const t=await ra(this.hass);this._areaConfigs=t,t.length>0&&!this._activeAreaId&&(this._activeAreaId=t[0].area_id)}catch(t){console.error("Failed to load areaConfigs for analytics",t)}finally{this._loading=!1}}render(){var t;return this._loading?r`<div class="loading-state" style="padding: 24px; color: var(--secondary-text-color);">Loading areaConfigs…</div>`:r`
      <!-- Header Grid (1 Row, 12 columns, max 6 items) -->
      <div class="view-header-container">
        <div class="view-header-grid">
          <div class="span-3" style="display: flex; align-items: center; gap: 8px;">
            ${this._areaConfigs.length>0?r`
              <div class="group-select-wrap">
                <h2>${((t=this._areaConfigs.find(e=>e.area_id===this._activeAreaId))==null?void 0:t.name)||this._activeAreaId}</h2>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--secondary-text-color)"><path d="M7 10l5 5 5-5H7z"/></svg>
                <select
                  class="group-select"
                  @change=${e=>this._activeAreaId=e.target.value}
                >
                  ${this._areaConfigs.map(e=>r`
                    <option value="${e.area_id}" ?selected=${this._activeAreaId===e.area_id}>${e.name||e.area_id}</option>
                  `)}
                </select>
              </div>
            `:r`<span style="color:var(--secondary-text-color);font-size:13px">No areaConfigs configured</span>`}
          </div>
          <div class="span-9" style="text-align: right; font-size: 13px; color: var(--secondary-text-color);">
            Area: <code>${this._activeAreaId||"none"}</code> · weekday presence density & lux history
          </div>
        </div>
      </div>

      <!-- Main Content Grid (12 columns) -->
      <div class="view-content-container">
        <div class="view-content-grid">
          ${this._areaConfigs.length===0?r`<div class="span-12 no-areaConfigs">No areaConfigs configured. Go to "Areas" tab to configure an area.</div>`:r`
              <div class="span-12">
                <twilight-heatmap-card
                  .hass=${this.hass}
                  .activeAreaId=${this._activeAreaId}
                ></twilight-heatmap-card>
              </div>
            `}
        </div>
      </div>
    `}};de.styles=z`
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

    .view-header-container {
      background: var(--primary-background-color);
      min-height: 64px;
      padding: 12px 24px;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.08));
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
      .span-2, .span-3, .span-4, .span-5, .span-6, .span-7, .span-8, .span-9 {
        grid-column: span 12;
      }
      .view-header-grid {
        gap: 8px;
        text-align: left;
      }
      .view-header-grid .span-9 {
        text-align: left !important;
      }
    }

    .group-select-wrap {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
    }
    .group-select-wrap h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      color: var(--primary-text-color);
      pointer-events: none;
      transition: color 0.2s;
    }
    .group-select-wrap:hover h2 { color: var(--tp-accent, var(--accent-color)); }
    .group-select-wrap svg { pointer-events: none; flex-shrink: 0; }
    .group-select {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
      width: 100%;
      height: 100%;
      font-size: 14px;
    }

    .no-areaConfigs {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px 0;
      color: var(--secondary-text-color);
      font-size: 14px;
    }
  `,Me([h({attribute:!1})],de.prototype,"hass",2),Me([b()],de.prototype,"_areaConfigs",2),Me([b()],de.prototype,"_activeAreaId",2),Me([b()],de.prototype,"_loading",2),de=Me([H("twilight-analytics-view")],de);var Wo=Object.defineProperty,qo=Object.getOwnPropertyDescriptor,at=(t,e,i,a)=>{for(var s=a>1?void 0:a?qo(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&Wo(e,i,s),s};const Xe=50,Ke=20,Va=0,Ga=30,ji=300;let Q=class extends L{constructor(){super(...arguments),this.hass=null,this.year=new Date().getFullYear(),this.selectedDate=new Date().toISOString().slice(0,10),this.clamped=!1,this.noHeader=!1,this.noAxisLabels=!1,this.showSlots=!1,this.noSolarNoonMidnight=!1,this.scatterMode=!1,this.sunData=null,this.hoverTime=null,this.hoverIdx=null,this.days=[],this.slotCurves=null,this.liveTime=null,this._loading=!1,this._w=0,this._ro=null,this._interval=null}connectedCallback(){super.connectedCallback(),this._interval=window.setInterval(()=>this._draw(),1e3)}disconnectedCallback(){var t;this._interval&&clearInterval(this._interval),(t=this._ro)==null||t.disconnect(),super.disconnectedCallback()}updated(t){var i;if(!this._ro){const a=(i=this.shadowRoot)==null?void 0:i.querySelector(".wrap");a&&(this._ro=new ResizeObserver(s=>{const o=s[0].contentRect.width;o>0&&o!==this._w&&(this._w=o,this._draw())}),this._ro.observe(a))}(t.has("hass")||t.has("year"))&&this.hass&&!this.days.length&&!this._loading&&this._load(),(t.has("days")||t.has("selectedDate")||t.has("clamped")||t.has("showSlots")||t.has("noSolarNoonMidnight")||t.has("scatterMode")||t.has("sunData")||t.has("hoverIdx")||t.has("liveTime"))&&requestAnimationFrame(()=>this._draw())}async _load(){if(this.hass){this._loading=!0;try{const t=await pa(this.hass,{year:this.year});this.days=t.days}catch(t){console.error("Year load failed",t)}finally{this._loading=!1}}}_getLiveTime(){const t=new Date;return t.getHours()*60+t.getMinutes()+t.getSeconds()/60}_todayIdx(){return this.days.findIndex(t=>t.date===new Date().toISOString().slice(0,10))}_interpolateEl(t){var e;return ba(((e=this.sunData)==null?void 0:e.points)??[],t)}_draw(){var ot;const t=(ot=this.shadowRoot)==null?void 0:ot.querySelector("canvas");if(!t)return;const e=this.days,i=e.length;if(!i||!this._w)return;const a=this._w,s=t.getBoundingClientRect().height||ji,o=_i(t,a,s),n=this.noAxisLabels?10:Xe,l=this.noAxisLabels?10:Ke,c=this.noAxisLabels?10:Va,u=this.noAxisLabels?10:Ga,g=a-n-l,p=s-c-u,d=c,f=c+p,x=n,w=n+g,k=1440,v=_=>d+p-Math.max(0,Math.min(k,_))/k*p;if(o.save(),o.shadowColor="rgba(0, 0, 0, 0.2)",o.shadowBlur=36,o.shadowOffsetX=0,o.shadowOffsetY=0,o.beginPath(),o.roundRect(x,d,g,p,8),o.fillStyle=yt,o.fill(),o.restore(),o.save(),o.beginPath(),o.roundRect(x,d,g,p,8),o.clip(),this.scatterMode){const _=(I,V,j)=>{const F=e.map(y=>y[V]),dt=e.map(y=>y[j]);o.strokeStyle=I,o.lineWidth=1;let $=[];const E=y=>{if(!y.length)return;o.beginPath();let q=!1,tt=0,Z=0,M=0;const B=(D,N)=>{o.moveTo(D,N),q=!0,tt=(N-d)/p*k|0,Z=D,M=N},ct=(D,N,nt,xt)=>{const K=Math.abs(nt-tt),St=P=>P>0&&P<i&&e[P].tz_offset!==e[P-1].tz_offset,S=St(xt)||St(xt-1)||St(xt+1);if(K>120)B(D,N);else if(S&&K>30){const P=(Z+D)/2;o.lineTo(P,M),o.moveTo(P,N),o.lineTo(D,N),tt=nt,Z=D,M=N}else o.lineTo(D,N),tt=nt,Z=D,M=N};for(const D of y){const N=F[D];if(N===null)continue;const nt=x+D/(i-1)*g,xt=(N%1440+1440)%1440,K=v(xt);q?ct(nt,K,xt,D):B(nt,K)}for(let D=y.length-1;D>=0;D--){const N=y[D],nt=dt[N];if(nt===null)continue;const xt=x+N/(i-1)*g,K=(nt%1440+1440)%1440,St=v(K);q?ct(xt,St,K,N):B(xt,St)}o.stroke()};for(let y=0;y<i;y++)F[y]!==null&&dt[y]!==null?$.push(y):$.length&&(E($),$=[]);$.length&&E($)};_(Ot,"astro_dawn","astro_dusk"),_(It,"nautical_dawn","nautical_dusk"),_(zt,"dawn","dusk"),_(qt,"sunrise","sunset")}else{const _=this.clamped;for(let I=0;I<i;I++){const V=e[I],j=I>0?e[I-1]:null,F=I===0?x:x+(I-.5)/(i-1)*g,$=(I===i-1?w:x+(I+.5)/(i-1)*g)-F+.5,E=_?Si(V):Ci(V);if(E.length===0){o.fillStyle=$i(V.midnight_el),o.fillRect(F,d,$,p);continue}const y=[...E];j&&Ai(y,j,V,_),y.sort((q,tt)=>q.t-tt.t),Ws(o,F,$,y,Di(j,V,_),v,k)}}const m=(_,I,V=1.5,j)=>{o.save(),o.strokeStyle=_,o.lineWidth=V,j&&(o.shadowColor=j,o.shadowBlur=8),o.beginPath();const F=$=>$===0?x:x+($-.5)/(i-1)*g,dt=$=>$===i-1?w:x+($+.5)/(i-1)*g;for(let $=0;$<i;$++){const E=I[$];if(E===null)continue;const y=v((E%k+k)%k);o.moveTo(F($),y),o.lineTo(dt($),y)}o.stroke(),o.restore()};if(this.noSolarNoonMidnight||(m("rgba(255,214,0,1)",e.map(_=>_.solar_noon),1.5,"rgba(255, 214, 0, 0.6)"),m("rgba(60,100,200,1)",e.map(_=>_.solar_midnight))),this.showSlots)if(this.slotCurves){const _=this.slotCurves;m("rgba(255,255,255,0.75)",_.civil_dusk??[]),m("rgba(255,255,255,0.60)",_.nautical_dusk??[]),m("rgba(255,255,255,0.45)",_.astro_dusk??[]),m("rgba(255,255,255,0.30)",_.night??[]),m("rgba(255,255,255,0.30)",_.astro_dawn??[]),m("rgba(255,255,255,0.45)",_.nautical_dawn??[]),m("rgba(255,255,255,0.60)",_.civil_dawn??[]),m("rgba(255,255,255,0.75)",_.gold_dawn??[]),m("rgba(255,255,255,0.75)",_.day??[]),m("rgba(255,255,255,0.75)",_.gold_dusk??[])}else m("rgba(255,255,255,0.75)",e.map(_=>_.slot_sunset)),m("rgba(255,255,255,0.60)",e.map(_=>_.slot_nautical_dusk)),m("rgba(255,255,255,0.45)",e.map(_=>_.slot_astro_dusk)),m("rgba(255,255,255,0.30)",e.map(_=>_.slot_night)),m("rgba(255,255,255,0.30)",e.map(_=>_.slot_astro_dawn)),m("rgba(255,255,255,0.45)",e.map(_=>_.slot_nautical_dawn)),m("rgba(255,255,255,0.60)",e.map(_=>_.slot_civil_dawn)),m("rgba(255,255,255,0.75)",e.map(_=>_.slot_sunrise)),m("rgba(255,255,255,0.75)",e.map(_=>_.slot_gold_dawn)),m("rgba(255,255,255,0.75)",e.map(_=>_.slot_day)),m("rgba(255,255,255,0.75)",e.map(_=>_.slot_gold_dusk));const C=this._todayIdx();if(C>=0){const _=x+C/(i-1)*g;o.save(),o.strokeStyle="rgba(255,255,255,0.55)",o.lineWidth=1.5,o.setLineDash([4,3]),o.beginPath(),o.moveTo(_,d),o.lineTo(_,f),o.stroke(),o.restore()}const O=this.days.findIndex(_=>_.date===this.selectedDate);if(O>=0&&O!==C){const _=x+O/(i-1)*g;o.save(),o.strokeStyle="rgba(255,255,255,0.4)",o.lineWidth=1,o.setLineDash([2,2]),o.beginPath(),o.moveTo(_,d),o.lineTo(_,f),o.stroke(),o.restore()}o.restore(),o.save(),o.beginPath(),o.roundRect(x,d,g,p,8),o.strokeStyle=va(this),o.lineWidth=1,o.stroke(),o.restore();const A=this.liveTime??this._getLiveTime();let U=O;if(U===-1&&(U=C),U>=0&&U<i){const _=x+U/(i-1)*g,I=v(A),V=this._interpolateEl(A);V>=0?ma(o,_,I):V>=-6?_a(o,_,I):xa(o,_,I)}o.restore()}_renderAxis(){var O;const t=this._w;if(!t)return _t``;const e=(O=this.shadowRoot)==null?void 0:O.querySelector("canvas"),i=e&&e.getBoundingClientRect().height||ji,a=this.noAxisLabels?10:Xe,s=this.noAxisLabels?10:Ke,o=this.noAxisLabels?10:Va,n=this.noAxisLabels?10:Ga,l=t-a-s,c=i-o-n,u=o,g=o+c,p=A=>u+c-A/1440*c,d=this.days.length||365,f=Array.from({length:13},(A,U)=>U*2).map(A=>{const U=p(A*60),ot=A%6===0&&A!==0&&A!==24,_=A!==0&&A!==24;return _t`
        ${ot&&!this.noAxisLabels?_t`<text x=${a-6} y=${U} text-anchor="end" dominant-baseline="middle" class="axis-label" style="font: ${Fe(this)}">${String(A).padStart(1,"0")}:00</text>`:_t``}
        ${_?_t`<line x1=${a} y1=${U} x2=${a+l} y2=${U} class="grid-line" stroke-width="0.5" clip-path="url(#rect-clip)"/>`:_t``}
      `}),x=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],w=[0,31,59,90,120,151,181,212,243,273,304,334],k=[15,45,74,105,135,166,196,227,258,288,319,349],v=x.map((A,U)=>{const ot=a+Math.min(w[U],d-1)/(d-1)*l,_=a+Math.min(k[U],d-1)/(d-1)*l;return _t`
        ${U>0?_t`<line x1=${ot} y1=${u} x2=${ot} y2=${g} class="grid-line" stroke-width="0.5" clip-path="url(#rect-clip)"/>`:_t``}
        ${this.noAxisLabels?_t``:_t`<text x=${_} y=${g+20} text-anchor="middle" class="axis-label" style="font: ${Fe(this)}">${A}</text>`}`}),m=this.hoverIdx!==null?this.days[this.hoverIdx]:null,C=m?a+this.hoverIdx/(d-1)*l:null;return _t`
      <svg class="overlay" width="100%" height="100%">
        <defs>
          <clipPath id="rect-clip">
            <rect x=${a} y=${u} width=${l} height=${c} rx="8" ry="8" />
          </clipPath>
        </defs>
        ${f}
        ${v}
        ${C!==null&&m?_t`
          <line x1=${C} y1=${u} x2=${C} y2=${g} stroke="rgba(255,255,255,0.28)" stroke-width="1" clip-path="url(#rect-clip)"/>
        `:""}
      </svg>
    `}_onMove(t){if(!this._w)return;const e=t.currentTarget.getBoundingClientRect(),i=this.noAxisLabels?10:Xe,a=this.noAxisLabels?10:Ke,s=this._w-i-a,o=t.clientX-e.left;this.hoverIdx=Math.round(Math.max(0,Math.min(1,(o-i)/s))*(this.days.length-1));const n=this.days[this.hoverIdx];this.dispatchEvent(new CustomEvent("year-hover-changed",{detail:{index:this.hoverIdx,date:n?n.date:null},bubbles:!0,composed:!0}))}_onLeave(){this.hoverIdx=null,this.dispatchEvent(new CustomEvent("year-hover-changed",{detail:{index:null,date:null},bubbles:!0,composed:!0}))}_onClick(){if(this.hoverIdx!==null&&this.days[this.hoverIdx]){const t=this.days[this.hoverIdx].date;this.dispatchEvent(new CustomEvent("date-selected",{detail:t,bubbles:!0,composed:!0}))}}_onTouchMove(t){if(!this._w)return;const e=t.touches[0],i=t.currentTarget.getBoundingClientRect(),a=this.noAxisLabels?10:Xe,s=this.noAxisLabels?10:Ke,o=this._w-a-s,n=e.clientX-i.left;this.hoverIdx=Math.round(Math.max(0,Math.min(1,(n-a)/o))*(this.days.length-1));const l=this.days[this.hoverIdx];this.dispatchEvent(new CustomEvent("year-hover-changed",{detail:{index:this.hoverIdx,date:l?l.date:null},bubbles:!0,composed:!0}))}_onTouchEnd(){this.hoverIdx=null,this.dispatchEvent(new CustomEvent("year-hover-changed",{detail:{index:null,date:null},bubbles:!0,composed:!0}))}render(){return r`
      ${this.noHeader?"":r`
        <div class="card-header">
          <span class="card-icon">☀️</span>
          <span class="card-title">Year overview</span>
        </div>
      `}
      <div class="wrap">
        ${this._loading?r`<div class="loading"><ha-circular-progress active size="small"></ha-circular-progress></div>`:r`
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
    `}};Q.styles=z`
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
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      overflow: hidden;
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px 12px;
    }
    .card-icon {
      font-size: 18px;
      opacity: 0.7;
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
  `,at([h({attribute:!1})],Q.prototype,"hass",2),at([h({type:Number})],Q.prototype,"year",2),at([h({type:String})],Q.prototype,"selectedDate",2),at([h({type:Boolean})],Q.prototype,"clamped",2),at([h({type:Boolean})],Q.prototype,"noHeader",2),at([h({type:Boolean})],Q.prototype,"noAxisLabels",2),at([h({type:Boolean})],Q.prototype,"showSlots",2),at([h({type:Boolean})],Q.prototype,"noSolarNoonMidnight",2),at([h({type:Boolean})],Q.prototype,"scatterMode",2),at([h({attribute:!1})],Q.prototype,"sunData",2),at([h({attribute:!1})],Q.prototype,"hoverTime",2),at([h({type:Number})],Q.prototype,"hoverIdx",2),at([h({attribute:!1})],Q.prototype,"days",2),at([h({attribute:!1})],Q.prototype,"slotCurves",2),at([h({type:Number})],Q.prototype,"liveTime",2),at([b()],Q.prototype,"_loading",2),at([b()],Q.prototype,"_w",2),Q=at([H("twilight-sun-year-card")],Q);var Yo=Object.defineProperty,Vo=Object.getOwnPropertyDescriptor,et=(t,e,i,a)=>{for(var s=a>1?void 0:a?Vo(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&Yo(e,i,s),s};const Hi=[{name:"North Pole",lat:90,lon:0,tz:"UTC"},{name:"Qaanaaq",lat:77.47,lon:-69.23,tz:"America/Thule"},{name:"Reykjavík",lat:64.13,lon:-21.9,tz:"Atlantic/Reykjavik"},{name:"Helsinki",lat:60.17,lon:24.94,tz:"Europe/Helsinki"},{name:"Hamburg",lat:53.55,lon:9.99,tz:"Europe/Berlin"},{name:"New York",lat:40.71,lon:-74.01,tz:"America/New_York"},{name:"Tokyo",lat:35.68,lon:139.69,tz:"Asia/Tokyo"},{name:"Cairo",lat:30.05,lon:31.24,tz:"Africa/Cairo"},{name:"Honolulu",lat:21.31,lon:-157.86,tz:"Pacific/Honolulu"},{name:"Equator",lat:0,lon:0,tz:"UTC"},{name:"Nairobi",lat:-1.29,lon:36.82,tz:"Africa/Nairobi"},{name:"Santiago",lat:-33.45,lon:-70.67,tz:"America/Santiago"},{name:"Cape Town",lat:-33.93,lon:18.42,tz:"Africa/Johannesburg"},{name:"Auckland",lat:-36.85,lon:174.76,tz:"Pacific/Auckland"},{name:"Ushuaia",lat:-54.8,lon:-68.3,tz:"America/Argentina/Ushuaia"},{name:"McMurdo Station",lat:-77.85,lon:166.67,tz:"Pacific/Auckland"},{name:"South Pole",lat:-90,lon:0,tz:"UTC"}],Xa=[10,25,50,100,250];let J=class extends L{constructor(){super(...arguments),this.hass=null,this._days=[],this._year=new Date().getFullYear(),this._loading=!1,this._error="",this._hoverIdx=null,this._selectedDate=new Date().toISOString().slice(0,10),this._sunData=null,this._hoverTime=null,this._scrubbing=!1,this._isDark=!1,this._demoLocationIdx=-1,this._demoPlaying=!1,this._demoDayIdx=0,this._demoSpeed=Xa[2]||50,this._clamped=!1,this._showSlots=!1,this._slotCurves=null,this._updateInterval=null,this._demoInterval=null,this._dayCache=new Map,this._lastLoadDayTime=0,this._loadDayTimeout=null}connectedCallback(){super.connectedCallback(),this._updateInterval=window.setInterval(()=>{this._scrubbing||this.requestUpdate()},1e3)}disconnectedCallback(){this._updateInterval&&clearInterval(this._updateInterval),this._stopDemo(),this._loadDayTimeout&&(clearTimeout(this._loadDayTimeout),this._loadDayTimeout=null),super.disconnectedCallback()}updated(t){if(t.has("hass")&&this.hass){const e=Ca(this.hass,this);e!==this._isDark&&(this._isDark=e,this.toggleAttribute("dark",e))}t.has("hass")&&this.hass&&!this._days.length&&!this._loading&&this._loadYear(),t.has("_selectedDate")&&this.hass&&this._selectedDate&&this._loadDay()}_locParams(){const t=Hi[this._demoLocationIdx];return t?{lat:t.lat,lon:t.lon,tz:t.tz}:{}}async _loadYear(){var t;if(this.hass){this._loading=!0,this._error="";try{const[e,i]=await Promise.all([pa(this.hass,{year:this._year,...this._locParams()}),Ms(this.hass,{year:this._year,...this._locParams()}).catch(()=>null)]);this._days=e.days,this._year=e.year,this._slotCurves=(i==null?void 0:i.curves)??null;const a=new Date().toISOString().slice(0,10);this._selectedDate=this._days.some(s=>s.date===a)?a:((t=this._days[0])==null?void 0:t.date)??a}catch(e){this._error=e instanceof Error?e.message:String(e)}finally{this._loading=!1}}}_loadDay(){this._loadDayTimeout&&(clearTimeout(this._loadDayTimeout),this._loadDayTimeout=null);const t=`${this._demoLocationIdx}_${this._selectedDate}`;if(this._demoPlaying&&this._dayCache.has(t)){this._sunData=this._dayCache.get(t);return}if(this._dayCache.has(t)){this._sunData=this._dayCache.get(t);return}const i=Date.now()-this._lastLoadDayTime,a=10;i>=a?this._executeLoadDay():this._loadDayTimeout=window.setTimeout(()=>{this._executeLoadDay()},a-i)}async _executeLoadDay(){if(!this.hass||!this._selectedDate)return;this._lastLoadDayTime=Date.now();const t=this._selectedDate,e=`${this._demoLocationIdx}_${t}`;try{const i=await je(this.hass,{date:t,...this._locParams()});this._dayCache.set(e,i),this._selectedDate===t&&(this._sunData=i)}catch{this._selectedDate===t&&(this._sunData=null)}}_stopDemo(){this._demoInterval&&(clearInterval(this._demoInterval),this._demoInterval=null),this._demoPlaying=!1}_toggleDemo(){if(this._demoPlaying){this._stopDemo();return}this._demoPlaying=!0,this._demoDayIdx=0,this._advanceDemoDay(),this._demoInterval=window.setInterval(()=>this._advanceDemoDay(),this._demoSpeed)}_changeDemoSpeed(t){this._demoSpeed=t,this._demoPlaying&&(this._demoInterval&&clearInterval(this._demoInterval),this._demoInterval=window.setInterval(()=>this._advanceDemoDay(),this._demoSpeed))}_advanceDemoDay(){if(!this._days.length)return;const t=Math.min(this._demoDayIdx,this._days.length-1);this._selectedDate=this._days[t].date,this._demoDayIdx++,this._demoDayIdx>=this._days.length&&this._stopDemo()}async _selectLocation(t){this._stopDemo(),this._demoLocationIdx=t,this._days=[],this._sunData=null,await this._loadYear(),await this._loadDay()}_toggleClamped(){this._clamped=!this._clamped}_toggleSlots(){this._showSlots=!this._showSlots}_fmt(t){if(t===null)return"—";const e=Math.round((t%1440+1440)%1440),i=Math.floor(e/60)%24,a=e%60;return`${String(i).padStart(2,"0")}:${String(a).padStart(2,"0")}`}_fmtDur(t){if(t===null||t<0)return"—";const e=Math.floor(t/60),i=Math.round(t%60);return e>0&&i>0?`${e}h ${i}min`:e>0?`${e}h`:`${i}min`}_todayIdx(){return this._days.findIndex(t=>t.date===new Date().toISOString().slice(0,10))}_getLiveTime(){var a,s,o;const t=Hi[this._demoLocationIdx],e=(t==null?void 0:t.tz)??void 0,i=new Date;if(e){const n=new Intl.DateTimeFormat("en-GB",{timeZone:e,hour:"numeric",minute:"numeric",second:"numeric",hour12:!1}).formatToParts(i),l=Number(((a=n.find(g=>g.type==="hour"))==null?void 0:a.value)??0),c=Number(((s=n.find(g=>g.type==="minute"))==null?void 0:s.value)??0),u=Number(((o=n.find(g=>g.type==="second"))==null?void 0:o.value)??0);return l*60+c+u/60}return i.getHours()*60+i.getMinutes()}_interpolateSun(t){var g;if(!((g=this._sunData)!=null&&g.points.length))return{elevation:0,azimuth:0};const e=this._sunData.points;let i=0,a=e.length-1;for(;i<a-1;){const p=i+a>>1;e[p].time<=t?i=p:a=p}const s=e[i],o=e[a];if(!s)return{elevation:0,azimuth:0};if(s===o||o.time===s.time)return{elevation:s.elevation,azimuth:s.azimuth};const n=(t-s.time)/(o.time-s.time),l=s.elevation+(o.elevation-s.elevation)*n;let c=s.azimuth,u=o.azimuth;return Math.abs(u-c)>180&&(u<c?u+=360:c+=360),{elevation:l,azimuth:(c+(u-c)*n)%360}}_phaseName(t){return t>=0?"Day":t>=-6?"Civil twilight":t>=-12?"Nautical twilight":t>=-18?"Astronomical twilight":"Night"}_phaseClass(t){return t>=0?"phase-day":t>=-6?"phase-civil":t>=-12?"phase-naut":t>=-18?"phase-astro":"phase-night"}render(){const t=new Date().toISOString().slice(0,10),e=this._hoverIdx!==null?this._days[this._hoverIdx]:null,i=this._days.findIndex(p=>p.date===this._selectedDate),a=i>=0?this._days[i]:this._days.length?this._days[0]:null,s=e??a,o=e?e.date:this._selectedDate,n=this._hoverTime??this._getLiveTime(),{elevation:l,azimuth:c}=this._interpolateSun(n),u=Math.round(n),g=`${String(Math.floor(u/60)%24).padStart(2,"0")}:${String(u%60).padStart(2,"0")}`;return r`
    <!-- Header Grid (1 Row, 12 columns, max 6 items) -->
    <div class="view-header-container">
      <div class="view-header-grid">
        <div class="span-3" style="display: flex; align-items: center; gap: 8px;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 500;">Twilight Timeline</h2>
          <span class="year-label">${this._year}</span>
        </div>
        <div class="span-9" style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
          <div class="zone-toggle" role="group" aria-label="Zone visualisation mode">
            <button class=${this._showSlots?"active":""}
              title="Toggle slot lines (on/off)"
              @click=${this._toggleSlots}>Slots</button>
            <button class=${this._clamped?"active":""}
              title="Toggle clamped mode (on/off)"
              @click=${this._toggleClamped}>Clamped</button>
          </div>

          <select class="demo-select" style="width: auto;"
            @change=${p=>this._selectLocation(Number(p.target.value))}>
            <option value="-1" ?selected=${this._demoLocationIdx===-1}>HA Home</option>
            ${Hi.map((p,d)=>r`
              <option value=${d} ?selected=${this._demoLocationIdx===d}>${p.name} (${p.lat>0?"+":""}${p.lat}°)</option>
            `)}
          </select>

          <button class="demo-play ${this._demoPlaying?"playing":""}" style="width: 36px; min-width: 36px;"
            title=${this._demoPlaying?"Stop":"Play year"}
            @click=${()=>this._toggleDemo()}>
            ${this._demoPlaying?"⏹":"▶"}
          </button>

          <select class="demo-select" style="width: 80px;"
            @change=${p=>this._changeDemoSpeed(Number(p.target.value))}>
            ${Xa.map(p=>r`
              <option value=${String(p)} ?selected=${this._demoSpeed===p}>${p} ms</option>
            `)}
          </select>
        </div>
        ${this._error?r`<div class="span-12 error">${this._error}</div>`:""}
      </div>
    </div>

    ${!this._loading&&this._days.length?r`
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
                .noSolarNoonMidnight=${!1}
                .days=${this._days}
                .sunData=${this._sunData}
                .hoverTime=${this._hoverTime}
                .liveTime=${this._getLiveTime()}
                .noHeader=${!1}
                .noAxisLabels=${!1}
                @time-hover-changed=${p=>{this._hoverTime=p.detail.hoverTime,this._scrubbing=p.detail.scrubbing}}
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
                @date-selected=${p=>this._selectedDate=p.detail}
                @year-hover-changed=${p=>this._hoverIdx=p.detail.index}
              ></twilight-sun-year-card>
            </div>
          </div>

          <!-- Right: info panel (span-3) -->
          ${s?r`
            <div class="span-3">
              <div class="info-panel">
                <div class="info-date">
                  ${o===t?"Today":e?"Browse":"Selected"}
                  <span>${o}</span>
                </div>

                ${this._sunData?r`
                  <div class="info-section">Live</div>
                  <div class="info-row">
                    <span class="info-label">Time</span>
                    <span class="info-value">${g}</span>
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
                ${(()=>{const p=w=>w!==null?(w%1440+1440)%1440:null,f=((w,k)=>{const v=p(w),m=p(k);if(v===null||m===null)return null;let C=m-v;return C<0&&(C+=1440),C})(s.sunrise,s.sunset),x=f!==null?1440-f:null;return r`
                  <div class="info-row"><span class="info-label">Day length</span>
                    <span class="info-value">${this._fmtDur(f)}</span></div>
                  <div class="info-row"><span class="info-label">Night length</span>
                    <span class="info-value" style="color:var(--secondary-text-color)">${this._fmtDur(x)}</span></div>`})()}

                <div class="info-section">Twilight</div>
                <div class="info-row"><span class="info-label">Day</span>
                  <span class="info-value">
                    ${(()=>{const p=s.slot_day??s.sunrise,d=s.slot_gold_dusk??s.sunset;return p!==null&&d!==null?`${this._fmt(p)}–${this._fmt(d)}`:"—"})()}
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
                ${[[yt,"Night"],[Ot,"Astronomical twilight"],[It,"Nautical twilight"],[zt,"Civil twilight"],[ze,"Golden hour"],[qt,"Daylight"]].map(([p,d])=>r`
                  <div class="legend-item">
                    <div class="legend-swatch" style="background:${p}"></div>
                    ${d}
                  </div>`)}
                ${[["#d2dce8","Civil dusk / Daylight"],["#aeb9c9","Nautical dusk / Civil dawn"],["#8792a2","Astro dusk / Nautical dawn"],["#5e6572","Night / Astro dawn"]].map(([p,d])=>r`
                  <div class="legend-item">
                    <div class="legend-swatch" style="background:${p}; height:5px; border-radius:1.5px; border:1px solid color-mix(in srgb, var(--primary-text-color, #fff) 15%, transparent); box-sizing:border-box;"></div>
                    ${d}
                  </div>`)}
              </div>
            </div>
          `:""}
        </div>
      </div>
    `:""}
    `}};J.styles=z`
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

    .view-header-container {
      background: var(--primary-background-color);
      min-height: 64px;
      padding: 12px 24px;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.08));
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
      overflow: hidden;
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
      background: var(--card-background-color, #1e1e2e);
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
  `,et([h({attribute:!1})],J.prototype,"hass",2),et([b()],J.prototype,"_days",2),et([b()],J.prototype,"_year",2),et([b()],J.prototype,"_loading",2),et([b()],J.prototype,"_error",2),et([b()],J.prototype,"_hoverIdx",2),et([b()],J.prototype,"_selectedDate",2),et([b()],J.prototype,"_sunData",2),et([b()],J.prototype,"_hoverTime",2),et([b()],J.prototype,"_scrubbing",2),et([b()],J.prototype,"_isDark",2),et([b()],J.prototype,"_demoLocationIdx",2),et([b()],J.prototype,"_demoPlaying",2),et([b()],J.prototype,"_demoDayIdx",2),et([b()],J.prototype,"_demoSpeed",2),et([b()],J.prototype,"_clamped",2),et([b()],J.prototype,"_showSlots",2),et([b()],J.prototype,"_slotCurves",2),J=et([H("twilight-timeline-view")],J);var Go=Object.defineProperty,Xo=Object.getOwnPropertyDescriptor,we=(t,e,i,a)=>{for(var s=a>1?void 0:a?Xo(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&Go(e,i,s),s};let te=class extends Be{constructor(){super(...arguments),this.open=!1,this.isDraftDirty=!1,this._loading=!1,this._error="",this.dialog=new fe(this),this._onClose=()=>{this._error="",this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))},this._onTriggerFileInput=()=>{var e;if(this.isDraftDirty){this.dialog.showAlert("Unsaved Changes","Please save or discard your unsaved settings changes before restoring from a backup.");return}const t=(e=this.shadowRoot)==null?void 0:e.querySelector("#restoreFileInput");t==null||t.click()}}async _onDownloadBackup(){if(this.hass)try{this._loading=!0,this._error="";const t=await Os(this.hass),e=new Date,i=`twilight-backup-${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}.json`,a=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),s=URL.createObjectURL(a),o=document.createElement("a");o.href=s,o.download=i,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(s)}catch(t){this._error=t instanceof Error?t.message:"Failed to export backup"}finally{this._loading=!1}}async _onFileSelected(t){var a;const e=t.target,i=(a=e.files)==null?void 0:a[0];if(!(!i||!this.hass)){e.value="";try{this._loading=!0,this._error="";const s=await i.text();let o;try{o=JSON.parse(s)}catch{await this.dialog.showAlert("Invalid Backup File","The selected file is not valid JSON.");return}if(!o||typeof o!="object"||!o.areas||typeof o.areas!="object"){await this.dialog.showAlert("Invalid Backup File","This file does not appear to be a valid Twilight backup structure.");return}const n=Object.keys(o.areas).length;if(!await this.dialog.showConfirm("Restore Backup",`This will replace ALL areas and global settings with the contents of this backup file (${n} area(s)). Areas not included in this file will be deleted. This action cannot be undone.

Are you sure you want to proceed?`))return;await ca(this.hass,o),await this.dialog.showAlert("Restore Complete","Backup restored successfully. The panel will now reload."),window.location.reload()}catch(s){this._error=s instanceof Error?s.message:"Failed to restore backup"}finally{this._loading=!1}}}async _onFactoryReset(){if(!this.hass)return;if(this.isDraftDirty){await this.dialog.showAlert("Unsaved Changes","Please save or discard your unsaved settings changes before performing a factory reset.");return}if(await this.dialog.showConfirm("Factory Reset Configuration",`⚠️ DANGER: This will delete ALL areas and reset all settings to system defaults.

This action cannot be undone. Are you sure you want to delete all areas and reset Twilight?`))try{this._loading=!0,this._error="",await ca(this.hass,{twilight_backup_version:1,areas:{},global:{}}),await this.dialog.showAlert("Factory Reset Complete","All areas and settings have been reset to factory defaults. The panel will now reload."),window.location.reload()}catch(e){this._error=e instanceof Error?e.message:"Failed to reset configuration"}finally{this._loading=!1}}render(){return this.open?r`
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

            ${this.isDraftDirty?r`
                  <div class="warning-banner">
                    ⚠️ You have unsaved settings changes. Please save or discard them before restoring or resetting.
                  </div>
                `:""}
            ${this._error?r`<div class="error-banner">❌ ${this._error}</div>`:""}

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
    `:r``}};te.styles=[jt,z`
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
    `],we([h({type:Object})],te.prototype,"hass",2),we([h({type:Boolean})],te.prototype,"open",2),we([h({type:Boolean})],te.prototype,"isDraftDirty",2),we([b()],te.prototype,"_loading",2),we([b()],te.prototype,"_error",2),te=we([H("twilight-backup-restore-dialog")],te);var Ko=Object.defineProperty,Zo=Object.getOwnPropertyDescriptor,Ct=(t,e,i,a)=>{for(var s=a>1?void 0:a?Zo(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=(a?n(e,i,s):n(s))||s);return a&&s&&Ko(e,i,s),s};let ft=class extends L{constructor(){super(...arguments),this.hass=null,this._hasLoaded=!1,this._todayData=null,this._selectedChannelId="",this._slotEditOpen=!1,this._editingSlotId=null,this._resetDialogOpen=!1,this._backupDialogOpen=!1,this._systemDefaults=null,this._placeholderDefaults=null,this._resetNodes=[],this._calculatedSlotTimes=[],this._slotTimesRequestId=0,this._dialog=new fe(this),this._draftController=new ua(this,{onSave:async t=>{this.hass&&(await Es(this.hass,t),this.dispatchEvent(new CustomEvent("global-changed",{detail:t,bubbles:!0,composed:!0})))}})}updated(t){t.has("hass")&&this.hass&&!this._hasLoaded&&(this._hasLoaded=!0,this._loadData())}async _loadData(){if(this.hass){this._draftController.loading=!0,this.requestUpdate();try{const[t,e,i]=await Promise.all([da(this.hass),je(this.hass).catch(()=>null),vi(this.hass).catch(()=>null)]);this._draftController.init(t||{}),this._todayData=(e==null?void 0:e.day_data)||null,this._placeholderDefaults=i,this._selectFirstChannel(),await this._loadCalculatedSlotTimes()}catch(t){console.error("Failed to load global config:",t)}finally{this._draftController.loading=!1,this.requestUpdate()}}}async _loadCalculatedSlotTimes(){var s,o;if(!this.hass)return;const e=(((o=(s=this._draftController.draft)==null?void 0:s.area_template)==null?void 0:o.custom_channels)||{})[this._selectedChannelId],i=(e==null?void 0:e.slots)||[];if(i.length===0){this._calculatedSlotTimes=[];return}const a=++this._slotTimesRequestId;try{const n=await zs(this.hass,{slots:i});if(a!==this._slotTimesRequestId)return;this._calculatedSlotTimes=n.slots}catch(n){console.warn("Failed to load slot time preview:",n),a===this._slotTimesRequestId&&(this._calculatedSlotTimes=[])}}_selectFirstChannel(){var i,a;const t=((a=(i=this._draftController.draft)==null?void 0:i.area_template)==null?void 0:a.custom_channels)||{},e=Object.keys(t).sort();e.length>0?(!this._selectedChannelId||!t[this._selectedChannelId])&&(this._selectedChannelId=e[0]):this._selectedChannelId=""}async _saveSettings(){await this._draftController.save()}_cancelChanges(){this._draftController.cancel()}async _resetToSystemDefaults(){var t,e,i;if(this.hass)try{const a=await Is(this.hass);this._systemDefaults=a;const s=[{id:"template_inputs",label:"Area Template: Inputs",children:(((t=a.area_template)==null?void 0:t.inputs)||[]).map(o=>({id:`template_inputs:${o.id}`,label:`${o.type} — ${o.activity}`}))},{id:"template_activities",label:"Area Template: Activities",children:(((e=a.area_template)==null?void 0:e.activities)||[]).map(o=>({id:`template_activities:${o.id}`,label:o.id}))},{id:"template_channels",label:"Area Template: Custom Channels",children:Object.entries(((i=a.area_template)==null?void 0:i.custom_channels)||{}).map(([o,n])=>({id:`template_channels:${o}`,label:n.name||o}))}];this._resetNodes=s,this._resetDialogOpen=!0,this.requestUpdate()}catch(a){console.error("Failed to load system defaults:",a)}}_executeReset(t){if(!this._systemDefaults||!this._draftController.draft)return;const e=new Set(t.detail.selectedIds),i=this._systemDefaults;this._draftController.update(a=>{var g,p,d,f,x,w,k;const s=e.has("template_inputs"),o=((g=i.area_template)==null?void 0:g.inputs)||[];if(s)a.area_template||(a.area_template={}),a.area_template.inputs=structuredClone(o);else{const v=[...((p=a.area_template)==null?void 0:p.inputs)||[]];o.forEach(m=>{if(e.has(`template_inputs:${m.id}`)){const C=v.findIndex(O=>O.id===m.id);C>=0?v[C]=structuredClone(m):v.push(structuredClone(m))}}),a.area_template||(a.area_template={}),a.area_template.inputs=v}const n=e.has("template_activities"),l=((d=i.area_template)==null?void 0:d.activities)||[];if(n)a.area_template||(a.area_template={}),a.area_template.activities=structuredClone(l);else{const v=[...((f=a.area_template)==null?void 0:f.activities)||[]];l.forEach(m=>{if(e.has(`template_activities:${m.id}`)){const C=v.findIndex(O=>O.id===m.id);C>=0?v[C]=structuredClone(m):v.push(structuredClone(m))}}),a.area_template||(a.area_template={}),a.area_template.activities=v}const c=e.has("template_channels"),u=((x=i.area_template)==null?void 0:x.custom_channels)||{};if(c){const v={...((w=a.area_template)==null?void 0:w.custom_channels)||{}};Object.keys(v).forEach(m=>{delete v[m]}),Object.entries(u).forEach(([m,C])=>{v[m]=structuredClone(C)}),a.area_template||(a.area_template={}),a.area_template.custom_channels=v}else{const v={...((k=a.area_template)==null?void 0:k.custom_channels)||{}};Object.keys(u).forEach(m=>{e.has(`template_channels:${m}`)&&(v[m]=structuredClone(u[m]))}),a.area_template||(a.area_template={}),a.area_template.custom_channels=v}}),this._resetDialogOpen=!1,this._selectFirstChannel(),this.requestUpdate()}_onTemplateInputsChanged(t){this._draftController.update(e=>{e.area_template||(e.area_template={}),e.area_template.inputs=t.detail.inputs})}_onTemplateActivitiesChanged(t){this._draftController.update(e=>{e.area_template||(e.area_template={}),e.area_template.activities=t.detail.activities})}_onTemplateSensorsChanged(t){this._draftController.update(e=>{e.area_template||(e.area_template={}),e.area_template.sensors=t.detail})}_onTemplateChannelSelected(t){this._selectedChannelId=t.detail.channelId,this._loadCalculatedSlotTimes()}async _onTemplateChannelAdded(t){var o;const e=this._draftController.draft;if(!e)return;const i=t.detail.name.trim();if(!i)return;const a=i.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"");if(!a)return;const s={...((o=e.area_template)==null?void 0:o.custom_channels)||{}};if(s[a]){await this._dialog.showAlert("Channel already exists",`A channel named "${i}" already exists.`);return}s[a]={name:i,enabled:!0,slots:[]},this._draftController.update(n=>{n.area_template||(n.area_template={}),n.area_template.custom_channels=s}),this._selectedChannelId=a,this._loadCalculatedSlotTimes()}_onTemplateChannelRenamed(t){var n;const e=this._draftController.draft;if(!e)return;const{channelId:i,name:a}=t.detail,s={...((n=e.area_template)==null?void 0:n.custom_channels)||{}},o=s[i];o&&(s[i]={...o,name:a},this._draftController.update(l=>{l.area_template||(l.area_template={}),l.area_template.custom_channels=s}))}_onTemplateChannelDeleted(t){var s;const e=this._draftController.draft;if(!e)return;const{channelId:i}=t.detail,a={...((s=e.area_template)==null?void 0:s.custom_channels)||{}};delete a[i],this._draftController.update(o=>{o.area_template||(o.area_template={}),o.area_template.custom_channels=a}),this._selectFirstChannel(),this._loadCalculatedSlotTimes()}_onTemplateChannelToggled(t){var n;const e=this._draftController.draft;if(!e)return;const{channelId:i,enabled:a}=t.detail,s={...((n=e.area_template)==null?void 0:n.custom_channels)||{}},o=s[i];o&&(s[i]={...o,enabled:a},this._draftController.update(l=>{l.area_template||(l.area_template={}),l.area_template.custom_channels=s}))}_onTemplateSlotsChanged(t){var l;const e=this._draftController.draft;if(!e)return;let i=this._selectedChannelId;const a={...((l=e.area_template)==null?void 0:l.custom_channels)||{}};if(!i||!a[i]){const c=Object.keys(a);c.length>0&&(i=c[0],this._selectedChannelId=i)}const s=a[i];if(!s)return;const o=s.slots||[],n=t.detail.slots.map(c=>{const u=o.find(p=>p.id===c.id),g=c.startType==="fixed";return{id:c.id,name:c.label,start_type:g?"fixed":"astral",zone:g?null:Ls(c),fixed_time:g?c.fixedStartTime||"00:00":null,offset_minutes:c.startOffset||0,scene_entity_id:c.scene,configured_entities:(u==null?void 0:u.configured_entities)||[]}});a[i]={...s,slots:n,...t.detail.transitionOnSeconds!==void 0?{transition_on_seconds:t.detail.transitionOnSeconds}:{}},this._draftController.update(c=>{c.area_template||(c.area_template={}),c.area_template.custom_channels=a}),this._loadCalculatedSlotTimes()}render(){var o,n,l,c,u,g,p,d,f,x,w,k;const t=((n=(o=this._draftController.draft)==null?void 0:o.area_template)==null?void 0:n.custom_channels)||{};let e=this._selectedChannelId;(!e||!t[e])&&Object.keys(t).length>0&&(e=Object.keys(t).sort()[0]);const i=t[e],a=(i==null?void 0:i.slots)||[],s=this._calculatedSlotTimes.length>0?He(this._calculatedSlotTimes,a).map(v=>({...v,color:"#8e44ad",isCustom:!0})):a.map(v=>{const m=v.start_type==="fixed";return{id:v.id,label:v.name||v.id,color:"#8e44ad",from:0,to:0,scene:v.scene_entity_id||null,isCustom:!0,startType:m?"fixed":"astral",startEvent:m?void 0:v.zone||void 0,startOffset:v.offset_minutes||0,fixedStartTime:m&&v.fixed_time||void 0}});return r`
      <div class="view-header-container">
        <div class="settings-header">
          <div class="header-left">
            <h2>Settings</h2>
          </div>
          <div class="header-right">
            Global Configuration
          </div>
        </div>
      </div>

      <div class="view-content-container">
        ${this._draftController.loading?r`
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 64px 0; gap: 16px; color: var(--secondary-text-color);">
            <div class="spinner"></div>
            <div>Loading settings…</div>
          </div>
        `:r`
          <div class="view-content-grid">
            <!-- Card 2: General Settings -->
            <div class="span-12">
              <div class="settings-group">
                <div class="group-title">General</div>
                <div class="form-desc" style="line-height:1.5; opacity:0.85;">
                  There are currently no global settings. Unlike Inputs, Activities,
                  Sensors, and Channels — which fall back to a system default when unset —
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
                .config=${((c=(l=this._draftController.draft)==null?void 0:l.area_template)==null?void 0:c.inputs)??[]}
                .activities=${(((g=(u=this._draftController.draft)==null?void 0:u.area_template)==null?void 0:g.activities)??[]).map(v=>v.id)}
                .placeholderDefaults=${this._placeholderDefaults}
                .templateMode=${!0}
                @inputs-changed=${this._onTemplateInputsChanged}
              ></twilight-inputs-card>
            </div>

            <!-- Template: Activities -->
            <div class="span-6">
              <twilight-activities-card
                .hass=${this.hass}
                .config=${((d=(p=this._draftController.draft)==null?void 0:p.area_template)==null?void 0:d.activities)??[]}
                .inputs=${((x=(f=this._draftController.draft)==null?void 0:f.area_template)==null?void 0:x.inputs)??[]}
                .placeholderDefaults=${this._placeholderDefaults}
                .templateMode=${!0}
                @activities-changed=${this._onTemplateActivitiesChanged}
              ></twilight-activities-card>
            </div>

            <!-- Template: Sensors -->
            <div class="span-6">
              <twilight-sensors-card
                .hass=${this.hass}
                .config=${((k=(w=this._draftController.draft)==null?void 0:w.area_template)==null?void 0:k.sensors)??[]}
                .templateMode=${!0}
                @sensors-changed=${this._onTemplateSensorsChanged}
              ></twilight-sensors-card>
            </div>

            <!-- Template: Custom Channels -->
            <div class="span-6">
              <twilight-timetable-card
                .hass=${this.hass}
                .slots=${s}
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
          <button class="btn-cancel" @click=${this._resetToSystemDefaults}>Reset to System Defaults</button>
          <button class="btn-cancel" @click=${()=>{this._backupDialogOpen=!0}}>Backup & Restore</button>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          ${this._draftController.isDirty?r`
            <button class="btn-cancel" @click=${this._cancelChanges}>Cancel</button>
            <span class="save-status">
              ${this._draftController.saving?"Saving…":"Unsaved changes"}
            </span>
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
        .slots=${s}
        .entities=${[]}
        .placeholderDefaults=${this._placeholderDefaults}
        .open=${this._slotEditOpen}
        .highlightSlotId=${this._editingSlotId}
        .areaId=${""}
        .areaName=${""}
        .isPrimaryChannel=${!1}
        .channelName=${(i==null?void 0:i.name)||""}
        .transitionOnSeconds=${(i==null?void 0:i.transition_on_seconds)??null}
        @slots-changed=${this._onTemplateSlotsChanged}
        @close=${()=>{this._slotEditOpen=!1,this._editingSlotId=null}}
      ></twilight-slot-editor>

      <twilight-reset-dialog
        .open=${this._resetDialogOpen}
        .title=${"Reset Settings"}
        .description=${"Select the sections or specific items you want to reset to system defaults."}
        .nodes=${this._resetNodes}
        @confirm=${this._executeReset}
        @cancel=${()=>{this._resetDialogOpen=!1}}
      ></twilight-reset-dialog>

      <twilight-backup-restore-dialog
        .hass=${this.hass||void 0}
        .open=${this._backupDialogOpen}
        .isDraftDirty=${this._draftController.isDirty}
        @close=${()=>{this._backupDialogOpen=!1}}
      ></twilight-backup-restore-dialog>

      <twilight-alert-dialog
        .open=${this._dialog.alertOpen}
        .dialogTitle=${this._dialog.alertTitle}
        .message=${this._dialog.alertMessage}
        @close=${this._dialog._onCloseAlert}
      ></twilight-alert-dialog>
    `}};ft.styles=[yi,wi,ga,z`
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
      .span-6 { grid-column: span 12; }
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
  `],Ct([h({attribute:!1})],ft.prototype,"hass",2),Ct([b()],ft.prototype,"_hasLoaded",2),Ct([b()],ft.prototype,"_todayData",2),Ct([b()],ft.prototype,"_selectedChannelId",2),Ct([b()],ft.prototype,"_slotEditOpen",2),Ct([b()],ft.prototype,"_editingSlotId",2),Ct([b()],ft.prototype,"_resetDialogOpen",2),Ct([b()],ft.prototype,"_backupDialogOpen",2),Ct([b()],ft.prototype,"_systemDefaults",2),Ct([b()],ft.prototype,"_placeholderDefaults",2),Ct([b()],ft.prototype,"_resetNodes",2),Ct([b()],ft.prototype,"_calculatedSlotTimes",2),ft=Ct([H("twilight-settings-view")],ft);var Jo=Object.getOwnPropertyDescriptor,Qo=(t,e,i,a)=>{for(var s=a>1?void 0:a?Jo(e,i):e,o=t.length-1,n;o>=0;o--)(n=t[o])&&(s=n(s)||s);return s};const tn=[{id:"areas",label:"Areas",icon:"⌂"},{id:"timeline",label:"Timeline",icon:"☀"},{id:"analytics",label:"Analytics",icon:"◈"},{id:"settings",label:"Settings",icon:"⚙"}];return $e.TwilightPanel=class extends oe{constructor(){super(),this.tabs=tn}},$e.TwilightPanel=Qo([H("twilight-panel")],$e.TwilightPanel),Object.defineProperty($e,Symbol.toStringTag,{value:"Module"}),$e}({});
