var TwilightPanel=(function(Re){"use strict";var Ea;const Ta=customElements.define;customElements.define=function(t,e,i){if(customElements.get(t)){console.warn(`[Twilight] Custom element ${t} is already defined.`);return}Ta.call(customElements,t,e,i)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const L=t=>(e,i)=>{i!==void 0?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ei=globalThis,$i=ei.ShadowRoot&&(ei.ShadyCSS===void 0||ei.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ci=Symbol(),us=new WeakMap;let fs=class{constructor(e,i,a){if(this._$cssResult$=!0,a!==Ci)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=i}get styleSheet(){let e=this.o;const i=this.t;if($i&&e===void 0){const a=i!==void 0&&i.length===1;a&&(e=us.get(i)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),a&&us.set(i,e))}return e}toString(){return this.cssText}};const Oa=t=>new fs(typeof t=="string"?t:t+"",void 0,Ci),P=(t,...e)=>{const i=t.length===1?t[0]:e.reduce((a,s,o)=>a+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new fs(i,t,Ci)},Ia=(t,e)=>{if($i)t.adoptedStyleSheets=e.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(const i of e){const a=document.createElement("style"),s=ei.litNonce;s!==void 0&&a.setAttribute("nonce",s),a.textContent=i.cssText,t.appendChild(a)}},gs=$i?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let i="";for(const a of e.cssRules)i+=a.cssText;return Oa(i)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:za,defineProperty:Ma,getOwnPropertyDescriptor:Pa,getOwnPropertyNames:Na,getOwnPropertySymbols:Ra,getPrototypeOf:La}=Object,ne=globalThis,vs=ne.trustedTypes,ja=vs?vs.emptyScript:"",ki=ne.reactiveElementPolyfillSupport,Le=(t,e)=>t,ii={toAttribute(t,e){switch(e){case Boolean:t=t?ja:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=t!==null;break;case Number:i=t===null?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch{i=null}}return i}},Si=(t,e)=>!za(t,e),bs={attribute:!0,type:String,converter:ii,reflect:!1,useDefault:!1,hasChanged:Si};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ne.litPropertyMetadata??(ne.litPropertyMetadata=new WeakMap);let De=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,i=bs){if(i.state&&(i.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((i=Object.create(i)).wrapped=!0),this.elementProperties.set(e,i),!i.noAccessor){const a=Symbol(),s=this.getPropertyDescriptor(e,a,i);s!==void 0&&Ma(this.prototype,e,s)}}static getPropertyDescriptor(e,i,a){const{get:s,set:o}=Pa(this.prototype,e)??{get(){return this[i]},set(r){this[i]=r}};return{get:s,set(r){const n=s==null?void 0:s.call(this);o==null||o.call(this,r),this.requestUpdate(e,n,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??bs}static _$Ei(){if(this.hasOwnProperty(Le("elementProperties")))return;const e=La(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Le("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Le("properties"))){const i=this.properties,a=[...Na(i),...Ra(i)];for(const s of a)this.createProperty(s,i[s])}const e=this[Symbol.metadata];if(e!==null){const i=litPropertyMetadata.get(e);if(i!==void 0)for(const[a,s]of i)this.elementProperties.set(a,s)}this._$Eh=new Map;for(const[i,a]of this.elementProperties){const s=this._$Eu(i,a);s!==void 0&&this._$Eh.set(s,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const i=[];if(Array.isArray(e)){const a=new Set(e.flat(1/0).reverse());for(const s of a)i.unshift(gs(s))}else e!==void 0&&i.push(gs(e));return i}static _$Eu(e,i){const a=i.attribute;return a===!1?void 0:typeof a=="string"?a:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(i=>i(this))}addController(e){var i;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((i=e.hostConnected)==null||i.call(e))}removeController(e){var i;(i=this._$EO)==null||i.delete(e)}_$E_(){const e=new Map,i=this.constructor.elementProperties;for(const a of i.keys())this.hasOwnProperty(a)&&(e.set(a,this[a]),delete this[a]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ia(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(i=>{var a;return(a=i.hostConnected)==null?void 0:a.call(i)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(i=>{var a;return(a=i.hostDisconnected)==null?void 0:a.call(i)})}attributeChangedCallback(e,i,a){this._$AK(e,a)}_$ET(e,i){var o;const a=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,a);if(s!==void 0&&a.reflect===!0){const r=(((o=a.converter)==null?void 0:o.toAttribute)!==void 0?a.converter:ii).toAttribute(i,a.type);this._$Em=e,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,i){var o,r;const a=this.constructor,s=a._$Eh.get(e);if(s!==void 0&&this._$Em!==s){const n=a.getPropertyOptions(s),c=typeof n.converter=="function"?{fromAttribute:n.converter}:((o=n.converter)==null?void 0:o.fromAttribute)!==void 0?n.converter:ii;this._$Em=s;const u=c.fromAttribute(i,n.type);this[s]=u??((r=this._$Ej)==null?void 0:r.get(s))??u,this._$Em=null}}requestUpdate(e,i,a,s=!1,o){var r;if(e!==void 0){const n=this.constructor;if(s===!1&&(o=this[e]),a??(a=n.getPropertyOptions(e)),!((a.hasChanged??Si)(o,i)||a.useDefault&&a.reflect&&o===((r=this._$Ej)==null?void 0:r.get(e))&&!this.hasAttribute(n._$Eu(e,a))))return;this.C(e,i,a)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,i,{useDefault:a,reflect:s,wrapped:o},r){a&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,r??i??this[e]),o!==!0||r!==void 0)||(this._$AL.has(e)||(this.hasUpdated||a||(i=void 0),this._$AL.set(e,i)),s===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var a;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,r]of this._$Ep)this[o]=r;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[o,r]of s){const{wrapped:n}=r,c=this[o];n!==!0||this._$AL.has(o)||c===void 0||this.C(o,void 0,r,c)}}let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),(a=this._$EO)==null||a.forEach(s=>{var o;return(o=s.hostUpdate)==null?void 0:o.call(s)}),this.update(i)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(i)}willUpdate(e){}_$AE(e){var i;(i=this._$EO)==null||i.forEach(a=>{var s;return(s=a.hostUpdated)==null?void 0:s.call(a)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(i=>this._$ET(i,this[i]))),this._$EM()}updated(e){}firstUpdated(e){}};De.elementStyles=[],De.shadowRootOptions={mode:"open"},De[Le("elementProperties")]=new Map,De[Le("finalized")]=new Map,ki==null||ki({ReactiveElement:De}),(ne.reactiveElementVersions??(ne.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ha={attribute:!0,type:String,converter:ii,reflect:!1,hasChanged:Si},Ua=(t=Ha,e,i)=>{const{kind:a,metadata:s}=i;let o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),a==="setter"&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),a==="accessor"){const{name:r}=i;return{set(n){const c=e.get.call(this);e.set.call(this,n),this.requestUpdate(r,c,t,!0,n)},init(n){return n!==void 0&&this.C(r,void 0,t,n),n}}}if(a==="setter"){const{name:r}=i;return function(n){const c=this[r];e.call(this,n),this.requestUpdate(r,c,t,!0,n)}}throw Error("Unsupported decorator location: "+a)};function p(t){return(e,i)=>typeof i=="object"?Ua(t,e,i):((a,s,o)=>{const r=s.hasOwnProperty(o);return s.constructor.createProperty(o,a),r?Object.getOwnPropertyDescriptor(s,o):void 0})(t,e,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function m(t){return p({...t,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const je=globalThis,ms=t=>t,si=je.trustedTypes,_s=si?si.createPolicy("lit-html",{createHTML:t=>t}):void 0,xs="$lit$",le=`lit$${Math.random().toFixed(9).slice(2)}$`,ys="?"+le,Ba=`<${ys}>`,ge=document,He=()=>ge.createComment(""),Ue=t=>t===null||typeof t!="object"&&typeof t!="function",Di=Array.isArray,Fa=t=>Di(t)||typeof(t==null?void 0:t[Symbol.iterator])=="function",Ai=`[ 	
\f\r]`,Be=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ws=/-->/g,$s=/>/g,ve=RegExp(`>|${Ai}(?:([^\\s"'>=/]+)(${Ai}*=${Ai}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Cs=/'/g,ks=/"/g,Ss=/^(?:script|style|textarea|title)$/i,Ds=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),l=Ds(1),Dt=Ds(2),Ae=Symbol.for("lit-noChange"),rt=Symbol.for("lit-nothing"),As=new WeakMap,be=ge.createTreeWalker(ge,129);function Es(t,e){if(!Di(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return _s!==void 0?_s.createHTML(e):e}const Wa=(t,e)=>{const i=t.length-1,a=[];let s,o=e===2?"<svg>":e===3?"<math>":"",r=Be;for(let n=0;n<i;n++){const c=t[n];let u,g,f=-1,d=0;for(;d<c.length&&(r.lastIndex=d,g=r.exec(c),g!==null);)d=r.lastIndex,r===Be?g[1]==="!--"?r=ws:g[1]!==void 0?r=$s:g[2]!==void 0?(Ss.test(g[2])&&(s=RegExp("</"+g[2],"g")),r=ve):g[3]!==void 0&&(r=ve):r===ve?g[0]===">"?(r=s??Be,f=-1):g[1]===void 0?f=-2:(f=r.lastIndex-g[2].length,u=g[1],r=g[3]===void 0?ve:g[3]==='"'?ks:Cs):r===ks||r===Cs?r=ve:r===ws||r===$s?r=Be:(r=ve,s=void 0);const h=r===ve&&t[n+1].startsWith("/>")?" ":"";o+=r===Be?c+Ba:f>=0?(a.push(u),c.slice(0,f)+xs+c.slice(f)+le+h):c+le+(f===-2?n:h)}return[Es(t,o+(t[i]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),a]};class Fe{constructor({strings:e,_$litType$:i},a){let s;this.parts=[];let o=0,r=0;const n=e.length-1,c=this.parts,[u,g]=Wa(e,i);if(this.el=Fe.createElement(u,a),be.currentNode=this.el.content,i===2||i===3){const f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(s=be.nextNode())!==null&&c.length<n;){if(s.nodeType===1){if(s.hasAttributes())for(const f of s.getAttributeNames())if(f.endsWith(xs)){const d=g[r++],h=s.getAttribute(f).split(le),b=/([.?@])?(.*)/.exec(d);c.push({type:1,index:o,name:b[2],strings:h,ctor:b[1]==="."?Ga:b[1]==="?"?Va:b[1]==="@"?Ya:ai}),s.removeAttribute(f)}else f.startsWith(le)&&(c.push({type:6,index:o}),s.removeAttribute(f));if(Ss.test(s.tagName)){const f=s.textContent.split(le),d=f.length-1;if(d>0){s.textContent=si?si.emptyScript:"";for(let h=0;h<d;h++)s.append(f[h],He()),be.nextNode(),c.push({type:2,index:++o});s.append(f[d],He())}}}else if(s.nodeType===8)if(s.data===ys)c.push({type:2,index:o});else{let f=-1;for(;(f=s.data.indexOf(le,f+1))!==-1;)c.push({type:7,index:o}),f+=le.length-1}o++}}static createElement(e,i){const a=ge.createElement("template");return a.innerHTML=e,a}}function Ee(t,e,i=t,a){var r,n;if(e===Ae)return e;let s=a!==void 0?(r=i._$Co)==null?void 0:r[a]:i._$Cl;const o=Ue(e)?void 0:e._$litDirective$;return(s==null?void 0:s.constructor)!==o&&((n=s==null?void 0:s._$AO)==null||n.call(s,!1),o===void 0?s=void 0:(s=new o(t),s._$AT(t,i,a)),a!==void 0?(i._$Co??(i._$Co=[]))[a]=s:i._$Cl=s),s!==void 0&&(e=Ee(t,s._$AS(t,e.values),s,a)),e}class qa{constructor(e,i){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:i},parts:a}=this._$AD,s=((e==null?void 0:e.creationScope)??ge).importNode(i,!0);be.currentNode=s;let o=be.nextNode(),r=0,n=0,c=a[0];for(;c!==void 0;){if(r===c.index){let u;c.type===2?u=new We(o,o.nextSibling,this,e):c.type===1?u=new c.ctor(o,c.name,c.strings,this,e):c.type===6&&(u=new Xa(o,this,e)),this._$AV.push(u),c=a[++n]}r!==(c==null?void 0:c.index)&&(o=be.nextNode(),r++)}return be.currentNode=ge,s}p(e){let i=0;for(const a of this._$AV)a!==void 0&&(a.strings!==void 0?(a._$AI(e,a,i),i+=a.strings.length-2):a._$AI(e[i])),i++}}class We{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,i,a,s){this.type=2,this._$AH=rt,this._$AN=void 0,this._$AA=e,this._$AB=i,this._$AM=a,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=i.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,i=this){e=Ee(this,e,i),Ue(e)?e===rt||e==null||e===""?(this._$AH!==rt&&this._$AR(),this._$AH=rt):e!==this._$AH&&e!==Ae&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Fa(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==rt&&Ue(this._$AH)?this._$AA.nextSibling.data=e:this.T(ge.createTextNode(e)),this._$AH=e}$(e){var o;const{values:i,_$litType$:a}=e,s=typeof a=="number"?this._$AC(e):(a.el===void 0&&(a.el=Fe.createElement(Es(a.h,a.h[0]),this.options)),a);if(((o=this._$AH)==null?void 0:o._$AD)===s)this._$AH.p(i);else{const r=new qa(s,this),n=r.u(this.options);r.p(i),this.T(n),this._$AH=r}}_$AC(e){let i=As.get(e.strings);return i===void 0&&As.set(e.strings,i=new Fe(e)),i}k(e){Di(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let a,s=0;for(const o of e)s===i.length?i.push(a=new We(this.O(He()),this.O(He()),this,this.options)):a=i[s],a._$AI(o),s++;s<i.length&&(this._$AR(a&&a._$AB.nextSibling,s),i.length=s)}_$AR(e=this._$AA.nextSibling,i){var a;for((a=this._$AP)==null?void 0:a.call(this,!1,!0,i);e!==this._$AB;){const s=ms(e).nextSibling;ms(e).remove(),e=s}}setConnected(e){var i;this._$AM===void 0&&(this._$Cv=e,(i=this._$AP)==null||i.call(this,e))}}class ai{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,i,a,s,o){this.type=1,this._$AH=rt,this._$AN=void 0,this.element=e,this.name=i,this._$AM=s,this.options=o,a.length>2||a[0]!==""||a[1]!==""?(this._$AH=Array(a.length-1).fill(new String),this.strings=a):this._$AH=rt}_$AI(e,i=this,a,s){const o=this.strings;let r=!1;if(o===void 0)e=Ee(this,e,i,0),r=!Ue(e)||e!==this._$AH&&e!==Ae,r&&(this._$AH=e);else{const n=e;let c,u;for(e=o[0],c=0;c<o.length-1;c++)u=Ee(this,n[a+c],i,c),u===Ae&&(u=this._$AH[c]),r||(r=!Ue(u)||u!==this._$AH[c]),u===rt?e=rt:e!==rt&&(e+=(u??"")+o[c+1]),this._$AH[c]=u}r&&!s&&this.j(e)}j(e){e===rt?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Ga extends ai{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===rt?void 0:e}}class Va extends ai{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==rt)}}class Ya extends ai{constructor(e,i,a,s,o){super(e,i,a,s,o),this.type=5}_$AI(e,i=this){if((e=Ee(this,e,i,0)??rt)===Ae)return;const a=this._$AH,s=e===rt&&a!==rt||e.capture!==a.capture||e.once!==a.once||e.passive!==a.passive,o=e!==rt&&(a===rt||s);s&&this.element.removeEventListener(this.name,this,a),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var i;typeof this._$AH=="function"?this._$AH.call(((i=this.options)==null?void 0:i.host)??this.element,e):this._$AH.handleEvent(e)}}class Xa{constructor(e,i,a){this.element=e,this.type=6,this._$AN=void 0,this._$AM=i,this.options=a}get _$AU(){return this._$AM._$AU}_$AI(e){Ee(this,e)}}const Ei=je.litHtmlPolyfillSupport;Ei==null||Ei(Fe,We),(je.litHtmlVersions??(je.litHtmlVersions=[])).push("3.3.2");const Ka=(t,e,i)=>{const a=(i==null?void 0:i.renderBefore)??e;let s=a._$litPart$;if(s===void 0){const o=(i==null?void 0:i.renderBefore)??null;a._$litPart$=s=new We(e.insertBefore(He(),o),o,void 0,i??{})}return s._$AI(t),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const me=globalThis;class B extends De{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var i;const e=super.createRenderRoot();return(i=this.renderOptions).renderBefore??(i.renderBefore=e.firstChild),e}update(e){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ka(i,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return Ae}}B._$litElement$=!0,B.finalized=!0,(Ea=me.litElementHydrateSupport)==null||Ea.call(me,{LitElement:B});const Ti=me.litElementPolyfillSupport;Ti==null||Ti({LitElement:B}),(me.litElementVersions??(me.litElementVersions=[])).push("4.2.2");var Za=Object.defineProperty,Ja=Object.getOwnPropertyDescriptor,Oi=(t,e,i,a)=>{for(var s=a>1?void 0:a?Ja(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Za(e,i,s),s};let qe=class extends B{constructor(){super(...arguments),this.activeTab="analytics",this.tabs=[]}connectedCallback(){super.connectedCallback(),this.setAttribute("role","tablist")}render(){return this.tabs.map(t=>l`
        <button
          class="tab-btn ${t.id===this.activeTab?"active":""}"
          role="tab"
          aria-selected=${t.id===this.activeTab?"true":"false"}
          @click=${()=>this._handleTabClick(t.id)}
        >
          <span class="tab-label">${t.label}</span>
        </button>
      `)}_handleTabClick(t){this.dispatchEvent(new CustomEvent("tab-changed",{detail:t,bubbles:!0,composed:!0}))}};qe.styles=P`
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
  `,Oi([p({type:String})],qe.prototype,"activeTab",2),Oi([p({type:Array})],qe.prototype,"tabs",2),qe=Oi([L("twilight-tab-bar")],qe);const T="primary",Qa=3,Ii=10,Ts=10,Os={night:"#141926",astro:"#1e2e45",nautical:"#2c4268",civil:"#3d5c8a",gold:"#bfb39b",day:"#8ab0cd"},zi=["astro_dawn","nautical_dawn","civil_dawn","gold_dawn","day","gold_dusk","civil_dusk","nautical_dusk","astro_dusk","night"],Mi={astro_dawn:"Astronomical dawn",nautical_dawn:"Nautical dawn",civil_dawn:"Civil dawn",gold_dawn:"Golden dawn",day:"Day",gold_dusk:"Golden dusk",civil_dusk:"Civil dusk",nautical_dusk:"Nautical dusk",astro_dusk:"Astronomical dusk",night:"Night"},mi=class mi extends CustomEvent{constructor(e){super(mi.eventName,{detail:e,bubbles:!0,composed:!0})}};mi.eventName="sensors-changed";let Pi=mi;const _i=class _i extends CustomEvent{constructor(e){super(_i.eventName,{detail:{inputs:e},bubbles:!0,composed:!0})}};_i.eventName="inputs-changed";let Ni=_i;const xi=class xi extends CustomEvent{constructor(e){super(xi.eventName,{detail:e,bubbles:!0,composed:!0})}};xi.eventName="activities-changed";let Ri=xi;const yi=class yi extends CustomEvent{constructor(e){super(yi.eventName,{detail:e,bubbles:!0,composed:!0})}};yi.eventName="rules-changed";let Li=yi;const wi=class wi extends CustomEvent{constructor(e,i){super(wi.eventName,{detail:{slots:e,transitionOnSeconds:i},bubbles:!0,composed:!0})}};wi.eventName="slots-changed";let ji=wi;function to(t,e){return e.simCritical?{label:"Critical Alarm",color:"#d32f2f",class:"fast-blink-glow",sub:"Simulation: Smoke / Panic Alarm"}:e.simError?{label:"System Error",color:"var(--error-color, #f44336)",class:"blink-glow",sub:"Simulation: Device Offline"}:e.simSensorOffline?{label:"Sensor Offline",color:"#ff5722",class:"fast-pulse-glow",sub:"Simulation: Ambient Sensor Failure"}:e.simWarning?{label:"System Warning",color:"var(--warning-color, #ff9800)",class:"pulse-glow",sub:"Simulation: Low Illuminance"}:(t==null?void 0:t.active_activity)==="sleep"?{label:"Sleeping",color:"#3f51b5",class:"static-glow",sub:"Sleep Mode Active"}:{label:"Running / Auto",color:"var(--success-color, #4caf50)",class:"static-glow",sub:"Automatic Mode"}}function Pt(t=new Date){const e=t.getFullYear(),i=String(t.getMonth()+1).padStart(2,"0"),a=String(t.getDate()).padStart(2,"0");return`${e}-${i}-${a}`}function _e(t){const e=(Math.round(t)%1440+1440)%1440;return`${String(Math.floor(e/60)).padStart(2,"0")}:${String(e%60).padStart(2,"0")}`}function eo(t){return t.startType==="fixed"?t.fixedStartTime||"12:00":t.startEvent||"civil_dawn"}function Hi(t){const e=t.to-t.from;return e>=1440?1440:e<=0?e+1440:e}function Te(t,e){const i=a=>(a%1440+1440)%1440;return i(e-i(t.from))<Hi(t)}function Ui(t,e){var a;const i=(a=t==null?void 0:t.states[e])==null?void 0:a.attributes;return(i==null?void 0:i.friendly_name)??(i==null?void 0:i.name)??e}const io={civil_dawn:"civil",civil_dusk:"civil",nautical_dawn:"nautical",nautical_dusk:"nautical",astro_dawn:"astro",astro_dusk:"astro",gold_dawn:"gold",gold_dusk:"gold"};function Is(t){return Os[io[t]??t]||Os.day}function Ge(t,e){if(!t||t.length===0)return[];const i=[],a=t.length;for(let s=0;s<a;s++){const o=t[s],r=a===1?o.start+1440:s<a-1?t[s+1].start:t[0].start+1440,n=e==null?void 0:e.find(f=>f.id===o.id),c=(n==null?void 0:n.start_type)==="fixed",u=(n==null?void 0:n.zone)||o.id,g=Is(u);i.push({id:o.id,label:(n==null?void 0:n.name)||Mi[o.id]||o.id,color:g,from:o.start,to:r,scene:(n==null?void 0:n.scene_entity_id)||null,isCustom:!zi.includes(o.id),startType:c?"fixed":"astral",startEvent:c?void 0:u,startOffset:(n==null?void 0:n.offset_minutes)||0,fixedStartTime:c&&(n==null?void 0:n.fixed_time)||void 0,hue_activate_dynamic:(n==null?void 0:n.hue_activate_dynamic)||!1,hue_dynamic_speed:(n==null?void 0:n.hue_dynamic_speed)??null})}return i}function so(t){if(t.length===0)return"var(--divider-color)";const e=s=>(s%1440+1440)%1440,i=[...t].sort((s,o)=>e(s.from)-e(o.from)),a=[];e(i[0].from)>0&&a.push(`${i[i.length-1].color} 0%`);for(const s of i){const o=(e(s.from)/1440*100).toFixed(1),r=(e(s.to)/1440*100).toFixed(1);a.push(`${s.color} ${o}%`),a.push(`${s.color} ${e(s.from)>e(s.to)?"100":r}%`)}return`linear-gradient(to right, ${a.join(", ")})`}async function oi(){if(!customElements.get("ha-entity-picker"))try{if(window.loadCardHelpers){const t=await window.loadCardHelpers();if(t){if(t.createCardElement){const e=await t.createCardElement({type:"entities",entities:[]});e&&e.getConfigElement&&await e.getConfigElement()}if(!customElements.get("ha-entity-picker")&&t.createRowElement){const e=await t.createRowElement({type:"attribute"});e&&e.getConfigElement&&await e.getConfigElement()}}}if(!customElements.get("ha-entity-picker")){const t=customElements.get("hui-glance-card");t&&t.getConfigElement&&await t.getConfigElement()}}catch(t){console.warn("[Twilight] Failed to preload HA entity picker:",t)}}function Bi(t,e,i){const a=window.devicePixelRatio||1,s=Math.round(e*a),o=Math.round(i*a);(t.width!==s||t.height!==o)&&(t.width=s,t.height=o);const r=t.getContext("2d");return r.clearRect(0,0,s,o),r.save(),r.scale(a,a),r}var ao=Object.defineProperty,Oe=(t,e,i,a)=>{for(var s=void 0,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=r(e,i,s)||s);return s&&ao(e,i,s),s};class xe extends B{constructor(){super(...arguments),this.narrow=!1,this.tabs=[],this.panel=null,this._activeTab="areas",this._hass=null,this._globalConfigOverride=null}connectedCallback(){super.connectedCallback(),oi()}createRenderRoot(){return this}get hass(){return this._hass}set hass(e){this._hass=e}render(){var e;return l`
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
          ${this.narrow?l`<div class="tp-menu-btn-wrap"><ha-menu-button .hass=${this._hass} .narrow=${this.narrow}></ha-menu-button></div>`:l`
          <div class="tp-title">
            <img class="tp-title-icon" src="/twilight/logo.png" alt="Twilight">
            <span>Twilight</span>
            ${((e=this.panel)==null?void 0:e.url_path)==="twilight_dev"?l`<span class="tp-badge">dev</span>`:l`<span class="tp-badge">beta</span>`}
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
    `}_renderViews(){const e=this._activeTab;return l`
      ${e==="areas"&&this._isTabAvailable("areas")?l`
        <twilight-areas-view
          class="view-container active"
          .hass=${this._hass}
          .globalConfigOverride=${this._globalConfigOverride}
        ></twilight-areas-view>
      `:""}
      ${e==="analytics"&&this._isTabAvailable("analytics")?l`
        <twilight-analytics-view
          class="view-container active"
          .hass=${this._hass}
        ></twilight-analytics-view>
      `:""}
      ${e==="timeline"&&this._isTabAvailable("timeline")?l`
        <twilight-timeline-view
          class="view-container active"
          .hass=${this._hass}
        ></twilight-timeline-view>
      `:""}
      ${e==="settings"&&this._isTabAvailable("settings")?l`
        <twilight-settings-view
          class="view-container active"
          .hass=${this._hass}
          @global-changed=${this._onGlobalChanged}
        ></twilight-settings-view>
      `:""}
      ${e==="lab"&&this._isTabAvailable("lab")?l`
        <twilight-lab-view
          class="view-container active"
          .hass=${this._hass}
        ></twilight-lab-view>
      `:""}
      ${e==="lab-two"&&this._isTabAvailable("lab-two")?l`
        <twilight-lab-two-view
          class="view-container active"
          .hass=${this._hass}
        ></twilight-lab-two-view>
      `:""}
    `}_isTabAvailable(e){return this.tabs.some(i=>i.id===e)}_onGlobalChanged(e){this._globalConfigOverride=e.detail}}Oe([p({type:Boolean})],xe.prototype,"narrow"),Oe([p({type:Array})],xe.prototype,"tabs"),Oe([p({type:Object})],xe.prototype,"panel"),Oe([m()],xe.prototype,"_activeTab"),Oe([m()],xe.prototype,"_hass"),Oe([m()],xe.prototype,"_globalConfigOverride");function ri(t){return t.callWS({type:"twilight/areas/list"})}function oo(t){return t.callWS({type:"twilight/area_registry/list"})}function zs(t,e){return t.callWS({type:"twilight/areas/new_draft",area_id:e})}function ro(t,e){return t.callWS({type:"twilight/area/save",...e})}function no(t,e){return t.callWS({type:"twilight/area/delete",area_id:e})}function lo(t,e){const i={type:"twilight/area/extracted"};return e&&(i.area_id=e),t.callWS(i)}function co(t,e){return t.callWS({type:"twilight/lab/area_entities",area_id:e})}function Ms(t){return t.callWS({type:"twilight/global/get"})}function Ps(t,e){return t.callWS({type:"twilight/global/save",config:e})}function po(t){return t.callWS({type:"twilight/global/export"})}function Ns(t,e){return t.callWS({type:"twilight/global/import",payload:e})}function ho(t){return t.callWS({type:"twilight/global/defaults"})}function Fi(t,e){return t.callWS({type:"twilight/placeholder_defaults",...e?{area_id:e}:{}})}function Wi(t,e){return t.callWS({type:"twilight/sun/day",...e})}function Rs(t,e){return t.callWS({type:"twilight/sun/year",...e})}function Ls(t,e){return t.callWS({type:"twilight/area/slot_times",...e})}function qi(t,e){return t.callWS({type:"twilight/slot_times/preview",...e})}function uo(t,e){return t.callWS({type:"twilight/timeline/slot_times",...e})}function fo(t,e){return t.callWS({type:"twilight/analytics/get",...e})}function go(t,e){return t.callWS({type:"twilight/trigger_input",...e})}function js(t,e){return t.callWS({type:"twilight/heatmap/profile/save",...e})}function vo(t,e){return t.callWS({type:"twilight/heatmap/profile/delete",...e})}class Hs{constructor(e,i={}){this.original=null,this.draft=null,this.saving=!1,this.loading=!1,this.saveError=null,this.isDirty=!1,this._host=e,this._options=i,this._host.addController(this)}hostConnected(){}hostDisconnected(){}init(e){this.original=structuredClone(e),this.draft=structuredClone(e),this.isDirty=!1,this._host.requestUpdate()}update(e){if(this.draft){if(typeof e=="function"){const i={...this.draft};e(i),this.draft=i}else this.draft={...this.draft,...e};this.isDirty=!0,this._host.requestUpdate()}}async save(){if(!this.draft||this.saving)return;this.saving=!0,this.saveError=null,this._host.requestUpdate();const e=this.draft;try{let i=!0;if(this._options.onSave){const a=await this._options.onSave(e);i=e===this.draft,a!==void 0&&i&&(this.draft=a)}i&&(this.original=structuredClone(this.draft),this.isDirty=!1)}catch(i){console.error("Error saving draft",i),this.saveError=i}finally{this.saving=!1,this._host.requestUpdate()}}cancel(){this.original&&(this.draft=structuredClone(this.original),this.isDirty=!1,this._host.requestUpdate())}reset(){this.original=null,this.draft=null,this.saving=!1,this.loading=!1,this.saveError=null,this.isDirty=!1,this._host.requestUpdate()}}class ni{constructor(){this._seq=0}begin(){const e=++this._seq;return{isCurrent:()=>e===this._seq}}cancel(){this._seq++}}function Q(t){return t.channels||{}}function bo(t,e){return t===T?-1:e===T?1:0}function li(t){return Object.keys(t||{}).sort(bo)}function Us(t){return li(Q(t))}function ye(t,e){var i;return((i=Q(t)[e])==null?void 0:i.slots)||[]}class di{constructor(e){this._ticker=null,this.liveMins=0,this.host=e,e.addController(this),this._updateTime()}hostConnected(){this._ticker=setInterval(()=>{this._updateTime(),this.host.requestUpdate()},15e3)}hostDisconnected(){this._ticker&&(clearInterval(this._ticker),this._ticker=null)}_updateTime(){const e=new Date;this.liveMins=e.getHours()*60+e.getMinutes()}}const Bs=!1,Fs="none";function Gi(t,e){const i=t.lux_threshold!==null&&t.lux_threshold!==void 0?t.lux_threshold:(e==null?void 0:e.lux_threshold)??30,a=t.lux_watch_window!==null&&t.lux_watch_window!==void 0?t.lux_watch_window:(e==null?void 0:e.lux_watch_window)??10,s=t.lux_ignore_active!==null&&t.lux_ignore_active!==void 0?t.lux_ignore_active:Bs,o=t.lux_ignore_scope!==null&&t.lux_ignore_scope!==void 0?t.lux_ignore_scope:Fs;return{threshold:i,watch:a,ignoreActive:s,ignoreScope:o}}function ci(t){const e=`lux ≤ ${t.threshold} lx`+(t.watch?` (watch: ${t.watch}s)`:""),i=[t.ignoreActive?"ignore when active":"",t.ignoreScope==="twilight_slots"?"ignore twilight/night":"",t.ignoreScope==="all_slots"?"ignore lux (all slots)":""].filter(Boolean).join(", ");return`${e}${i?` · ${i}`:""}`}function pi(t,e){const i=t.entity_ids??[];if(i.length===0)return{friendlyName:"No entities configured",subText:"—"};const a=i.map(r=>{var n,c;return((c=(n=e==null?void 0:e.states[r])==null?void 0:n.attributes)==null?void 0:c.friendly_name)??r});let s=a.join(", ");s.length>35&&a.length>1&&(s=`${a[0]} + ${a.length-1} more`);let o=i.join(", ");if(o.length>50&&i.length>1&&(o=`${i[0]} + ${i.length-1} more`),t.type==="motion"){const r=t.retrigger??"every";o+=` [retrigger: ${r}]`}else if(i.length>=2&&t.type==="binary"){const r=t.aggregation??"any",n=r==="count"?`count:${t.aggregation_count??1}`:r;o+=` [combine: ${n}]`}return{friendlyName:s,subText:o}}function At(t,e){if(t.label&&t.label.trim())return t.label.trim();if(t.name&&t.name.trim())return t.name.trim();if(t.entity_ids&&t.entity_ids.length>0&&e){const{friendlyName:i}=pi(t,e);if(i&&i!=="No entities configured")return i}return t.type==="motion"?"Motion Sensor":t.type==="event"?"Event Input":t.type==="binary"?"Binary Input":t.type==="button"?"Button":t.type==="timer"?"Daily Timer":t.id}function Ws(t){const e=t.trim();if(e==="")return null;const i=e.split(":");if(i.length<1||i.length>3||!i.every(r=>/^\d+$/.test(r)))return null;const[a,s=0,o=0]=i.map(r=>parseInt(r,10));return a>23||s>59||o>59?null:[a,s,o]}function mo(t){const e=Ws(t);if(e===null)return null;const i=a=>String(a).padStart(2,"0");return`${i(e[0])}:${i(e[1])}:${i(e[2])}`}function Vi(t){return t.trim()===""||Ws(t)!==null}function _o(t,e,i){return t.map(s=>{if(s==="no_entity")return"No entity configured";if(s==="user")return"Disabled by user";if(s.startsWith("activity:")){const o=s.substring(9),r=i==null?void 0:i.find(n=>n.id===o);return`Disabled by Activity: ${(r==null?void 0:r.name)||(r==null?void 0:r.id)||o}`}if(s.startsWith("rule:")){const o=s.substring(5),r=e==null?void 0:e.find(n=>n.id===o);return`Disabled by Rule: ${(r==null?void 0:r.name)||(r==null?void 0:r.id)||o}`}return s}).join(", ")}const de=P`
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
`,Kt=P`
  .card-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--dot-color, var(--accent-color, #3b82f6));
    box-shadow: 0 0 6px var(--dot-color, var(--accent-color, #3b82f6));
    flex-shrink: 0;
    display: inline-block;
  }
`,Yi=P`
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
`,qs=P`
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
`;var xo=Object.defineProperty,yo=Object.getOwnPropertyDescriptor,ut=(t,e,i,a)=>{for(var s=a>1?void 0:a?yo(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&xo(e,i,s),s};let lt=class extends B{constructor(){super(...arguments),this._clock=new di(this),this.hass=null,this.slots=[],this.inputs=[],this.activitiesConfig=[],this.noHeader=!1,this.runState=null,this.areaEnabled=!0,this.channels={},this.channelSlotsMap={},this.simCritical=!1,this.simError=!1,this.simSensorOffline=!1,this.simWarning=!1}_activityCountdown(t){if(t.activity_expire_frozen_seconds!==void 0&&t.activity_expire_frozen_seconds!==null){const r=Math.round(t.activity_expire_frozen_seconds),n=Math.floor(r/60),c=r%60;return`Paused (${n>0?`${n}m ${c}s`:`${c}s`})`}if(!t.activity_expires_at)return null;const e=new Date(t.activity_expires_at).getTime()-Date.now();if(e<=0)return null;const i=Math.ceil(e/1e3),a=Math.floor(i/60),s=i%60,o=a>0?`${a}m ${s}s`:`${s}s`;return t.activity_expire_source==="rule"?`Rule Auto-Expire (${o})`:o}_runStateEngineInfo(t){const e=t.scene_activated_at!==null,i=t.active_activity;if(i){const a=(this.activitiesConfig||[]).find(u=>u.id===i),s=(a==null?void 0:a.name)||i.charAt(0).toUpperCase()+i.slice(1),o=t.activity_trigger,r=o!=null&&o.input_id?this.inputs.find(u=>u.id===o.input_id):void 0,n=r?At(r,this.hass):o==null?void 0:o.input_id,c=o!=null&&o.input_id?`via ${n}${o.entity_id?` (${o.entity_id})`:""}`:"";return{label:s,color:"#9c27b0",class:"pulse-glow",sub:c}}return{label:e?"Scene Active":"Idle",color:e?"#4caf50":"#2196f3",class:"entity-indicator",sub:e?"Scene switched by engine":"Waiting for input"}}render(){if(!this.sensorConfig)return l``;const t=this._clock.liveMins,e=this.runState,i=li(this.channels),a=i.length>0?i:[T],s={simCritical:this.simCritical,simError:this.simError,simSensorOffline:this.simSensorOffline,simWarning:this.simWarning},o=this.areaEnabled?e?this._runStateEngineInfo(e):to(this.runState,s):{label:"Disabled",color:"#888888",class:"entity-indicator",sub:"Engine inactive"};return l`
      <div class="status-card">
        ${this.noHeader?"":l`
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
              ${a.map(r=>{var v,_,C,S;const n=(v=this.channels)==null?void 0:v[r],c=n?n.enabled!==!1:!0,u=(n==null?void 0:n.name)||(r===T?"Twilight":r);if(!c)return l`
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 13px; opacity: 0.5;">
                      <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
                        <div class="slot-color-dot" style="background: #888; flex-shrink: 0;"></div>
                        <span style="font-weight: 600; color: var(--secondary-text-color); font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;">${u}:</span>
                        <span style="color: var(--secondary-text-color); text-decoration: line-through;">Disabled</span>
                      </div>
                      <span style="font-size: 11px; color: var(--secondary-text-color);">—</span>
                    </div>
                  `;const g=((_=this.channelSlotsMap)==null?void 0:_[r])||(r===T?this.slots:[])||[],f=((C=e==null?void 0:e.active_slots)==null?void 0:C[r])||null,d=f?g.find(A=>A.id===f):g.find(A=>Te(A,t));if(!d)return l`
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 13px; opacity: 0.7;">
                      <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
                        <div class="slot-color-dot" style="background: #888; flex-shrink: 0;"></div>
                        <span style="font-weight: 600; color: var(--secondary-text-color); font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;">${u}:</span>
                        <span style="color: var(--secondary-text-color); font-style: italic;">No active slot</span>
                      </div>
                      <span style="font-size: 11px; color: var(--secondary-text-color);">—</span>
                    </div>
                  `;const h=d.color||"var(--secondary-text-color)",b=d.label,w=`${_e(d.from)} - ${_e(d.to)}`,y=((S=e==null?void 0:e.active_scene_names)==null?void 0:S[r])||(d.scene?Ui(this.hass,d.scene):"No Scene");return l`
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 13px;">
                    <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
                      <div class="slot-color-dot" style="background:${h}; box-shadow: 0 0 6px ${h}; flex-shrink: 0;"></div>
                      <span style="font-weight: 600; color: var(--secondary-text-color); font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;">${u}:</span>
                      <span style="color: var(--primary-text-color); font-weight: 500; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${b}</span>
                      <span style="color: var(--secondary-text-color); font-size: 11px; font-style: italic; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">(${y})</span>
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
              ${e&&this._activityCountdown(e)?l`
                <div style="font-family: monospace; font-size: 11px; color: var(--secondary-text-color);">
                  ends in ${this._activityCountdown(e)}
                </div>
              `:""}
            </div>
          </div>
        </div>
      </div>
    `}};lt.styles=[Kt,P`
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
  `],ut([p({attribute:!1})],lt.prototype,"hass",2),ut([p({type:Array})],lt.prototype,"slots",2),ut([p({attribute:!1})],lt.prototype,"sensorConfig",2),ut([p({type:Array})],lt.prototype,"inputs",2),ut([p({attribute:!1})],lt.prototype,"activitiesConfig",2),ut([p({type:Boolean})],lt.prototype,"noHeader",2),ut([p({attribute:!1})],lt.prototype,"runState",2),ut([p({type:Boolean})],lt.prototype,"areaEnabled",2),ut([p({attribute:!1})],lt.prototype,"channels",2),ut([p({attribute:!1})],lt.prototype,"channelSlotsMap",2),ut([p({type:Boolean})],lt.prototype,"simCritical",2),ut([p({type:Boolean})],lt.prototype,"simError",2),ut([p({type:Boolean})],lt.prototype,"simSensorOffline",2),ut([p({type:Boolean})],lt.prototype,"simWarning",2),lt=ut([L("twilight-status-card")],lt);class we{constructor(e){this.host=e,this.confirmOpen=!1,this.confirmTitle="",this.confirmMessage="",this._confirmResolve=null,this.alertOpen=!1,this.alertTitle="",this.alertMessage="",this._alertResolve=null,this.promptOpen=!1,this.promptTitle="",this.promptMessage="",this.promptPlaceholder="",this.promptValue="",this._promptResolve=null,this._onConfirm=()=>{this.confirmOpen=!1,this._confirmResolve&&(this._confirmResolve(!0),this._confirmResolve=null),this.host.requestUpdate()},this._onCancelConfirm=()=>{this.confirmOpen=!1,this._confirmResolve&&(this._confirmResolve(!1),this._confirmResolve=null),this.host.requestUpdate()},this._onCloseAlert=()=>{this.alertOpen=!1,this._alertResolve&&(this._alertResolve(),this._alertResolve=null),this.host.requestUpdate()},this._onSubmitPrompt=i=>{this.promptOpen=!1,this._promptResolve&&(this._promptResolve(i.detail.value),this._promptResolve=null),this.host.requestUpdate()},this._onCancelPrompt=()=>{this.promptOpen=!1,this._promptResolve&&(this._promptResolve(null),this._promptResolve=null),this.host.requestUpdate()},this.host.addController(this)}hostConnected(){}hostDisconnected(){this._confirmResolve&&(this._confirmResolve(!1),this._confirmResolve=null),this._alertResolve&&(this._alertResolve(),this._alertResolve=null),this._promptResolve&&(this._promptResolve(null),this._promptResolve=null),this.confirmOpen=!1,this.alertOpen=!1,this.promptOpen=!1}showConfirm(e,i){return this._confirmResolve&&(this._confirmResolve(!1),this._confirmResolve=null),new Promise(a=>{this.confirmTitle=e,this.confirmMessage=i,this.confirmOpen=!0,this._confirmResolve=a,this.host.requestUpdate()})}showAlert(e,i){return this._alertResolve&&(this._alertResolve(),this._alertResolve=null),new Promise(a=>{this.alertTitle=e,this.alertMessage=i,this.alertOpen=!0,this._alertResolve=a,this.host.requestUpdate()})}showPrompt(e,i="",a="",s=""){return this._promptResolve&&(this._promptResolve(null),this._promptResolve=null),new Promise(o=>{this.promptTitle=e,this.promptMessage=s,this.promptPlaceholder=a,this.promptValue=i,this.promptOpen=!0,this._promptResolve=o,this.host.requestUpdate()})}}var wo=Object.defineProperty,$o=Object.getOwnPropertyDescriptor,ft=(t,e,i,a)=>{for(var s=a>1?void 0:a?$o(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&wo(e,i,s),s};class ce extends B{}let Ie=class extends ce{constructor(){super(...arguments),this.open=!1,this.dialogTitle="Alert",this.message=""}render(){return this.open?l`
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
    `:l``}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}};Ie.styles=[Et,P`
      /* Above the sub-edit overlays (z-index 1100) — validation alerts fire
         from inside the sub-modals and must stay visible on top. */
      .overlay { z-index: 1200; }
      .modal-card {
        max-width: 450px;
      }
    `],ft([p({type:Boolean})],Ie.prototype,"open",2),ft([p({type:String})],Ie.prototype,"dialogTitle",2),ft([p({type:String})],Ie.prototype,"message",2),Ie=ft([L("twilight-alert-dialog")],Ie);let ze=class extends ce{constructor(){super(...arguments),this.open=!1,this.dialogTitle="Confirm",this.message=""}render(){return this.open?l`
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
    `:l``}_onConfirm(){this.dispatchEvent(new CustomEvent("confirm",{bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}};ze.styles=[Et,P`
      .overlay { z-index: 1200; }
      .modal-card {
        max-width: 450px;
      }
    `],ft([p({type:Boolean})],ze.prototype,"open",2),ft([p({type:String})],ze.prototype,"dialogTitle",2),ft([p({type:String})],ze.prototype,"message",2),ze=ft([L("twilight-confirm-dialog")],ze);let te=class extends ce{constructor(){super(...arguments),this.open=!1,this.dialogTitle="Prompt",this.message="",this.placeholder="",this.value="",this._currentValue=""}willUpdate(t){t.has("open")&&this.open&&(this._currentValue=this.value||"")}render(){return this.open?l`
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
            ${this.message?l`<p style="margin: 0; font-size: 13px; color: var(--secondary-text-color);">${this.message}</p>`:""}
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
    `:l``}_onInput(t){this._currentValue=t.target.value}_onKeyDown(t){t.key==="Enter"?this._onConfirm():t.key==="Escape"&&this._onCancel()}_onConfirm(){this.dispatchEvent(new CustomEvent("submit",{detail:{value:this._currentValue},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}};te.styles=[Et,P`
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
    `],ft([p({type:Boolean})],te.prototype,"open",2),ft([p({type:String})],te.prototype,"dialogTitle",2),ft([p({type:String})],te.prototype,"message",2),ft([p({type:String})],te.prototype,"placeholder",2),ft([p({type:String})],te.prototype,"value",2),ft([m()],te.prototype,"_currentValue",2),te=ft([L("twilight-prompt-dialog")],te);const _t="#141926",Ut="#1e2e45",Bt="#2c4268",Ft="#3d5c8a",Ye="#bfb39b",ee="#8ab0cd",Gs="rgba(255,255,255,0.15)",Xi=t=>t>=-.833?ee:t>=-6?Ft:t>=-12?Bt:t>=-18?Ut:_t;function hi(t){return`200 14px ${getComputedStyle(t).getPropertyValue("--font-family").trim()||"system-ui, sans-serif"}`}function Ki(t){return getComputedStyle(t).getPropertyValue("--primary-text-color").trim()||"rgba(255,255,255,0.90)"}function Vs(t){return getComputedStyle(t).getPropertyValue("--divider-color").trim()||"rgba(255, 255, 255, 0.08)"}function Ys(t,e){var i;for(let a=0;a<t.length-1;a++)if(t[a].time<=e&&t[a+1].time>e){const s=(e-t[a].time)/(t[a+1].time-t[a].time);return t[a].elevation+(t[a+1].elevation-t[a].elevation)*s}return((i=t[t.length-1])==null?void 0:i.elevation)??0}function Xs(t,e,i){t.save(),t.beginPath(),t.arc(e,i,11,0,Math.PI*2),t.fillStyle="rgba(249,217,118,0.28)",t.shadowColor="#f9d976",t.shadowBlur=12,t.fill(),t.beginPath(),t.arc(e,i,7.5,0,Math.PI*2),t.strokeStyle="rgba(10, 15, 25, 0.65)",t.lineWidth=1.5,t.stroke(),t.beginPath(),t.arc(e,i,7,0,Math.PI*2),t.fillStyle="#f9d976",t.fill(),t.restore()}function Ks(t,e,i){t.save(),t.shadowColor="#a4c5f0",t.shadowBlur=10,t.beginPath(),t.arc(e,i,7,0,Math.PI*2),t.fillStyle="#c8dff5",t.fill(),t.beginPath(),t.arc(e+3.15,i-.7,5.46,0,Math.PI*2),t.fillStyle=_t,t.fill(),t.restore()}function Zs(t,e,i){t.save(),t.shadowColor="#c8c8f0",t.shadowBlur=10,t.beginPath(),t.arc(e,i,7,Math.PI/2,-Math.PI/2),t.lineTo(e,i-7),t.fillStyle="#f9d976",t.fill(),t.beginPath(),t.arc(e,i,7,-Math.PI/2,Math.PI/2),t.lineTo(e,i+7),t.fillStyle="#c8dff5",t.fill(),t.beginPath(),t.moveTo(e,i-7),t.lineTo(e,i+7),t.strokeStyle="rgba(0,0,0,0.3)",t.lineWidth=.5,t.stroke(),t.restore()}const U=t=>Math.round(t*1e3)/1e3;function Zi(t){const i=[],a=t.sunrise!==null?U(t.sunrise):null,s=t.sunset!==null?U(t.sunset):null,o=t.astro_dawn!==null&&(a===null||U(t.astro_dawn)<a)?U(t.astro_dawn):null,r=t.nautical_dawn!==null&&(a===null||U(t.nautical_dawn)<a)?U(t.nautical_dawn):null,n=t.dawn!==null&&(a===null||U(t.dawn)<a)?U(t.dawn):null,c=t.dusk!==null&&t.dusk<=1440&&(s===null||U(t.dusk)>s)?U(t.dusk):null,u=t.nautical_dusk!==null&&t.nautical_dusk<=1440&&(s===null||U(t.nautical_dusk)>s)?U(t.nautical_dusk):null,g=t.astro_dusk!==null&&t.astro_dusk<=1440&&(s===null||U(t.astro_dusk)>s)?U(t.astro_dusk):null,f=t.slot_gold_dawn!==null&&t.slot_gold_dawn!==void 0;return o!==null&&i.push({t:o,c:Ut}),r!==null&&i.push({t:r,c:Bt}),n!==null&&i.push({t:n,c:Ft}),a!==null&&i.push({t:a,c:f?Ye:ee}),f&&t.slot_day!==null&&t.slot_day!==void 0&&i.push({t:U(t.slot_day),c:ee}),f&&t.slot_gold_dusk!==null&&t.slot_gold_dusk!==void 0&&t.slot_gold_dusk<=1440&&i.push({t:U(t.slot_gold_dusk),c:Ye}),s!==null&&s<=1440&&i.push({t:s,c:Ft}),c!==null&&i.push({t:c,c:Bt}),u!==null&&i.push({t:u,c:Ut}),g!==null&&i.push({t:g,c:_t}),i}function Ji(t){const i=[],a=t.slot_sunrise!==null?U(t.slot_sunrise):null,s=t.slot_astro_dawn!==null&&(a===null||U(t.slot_astro_dawn)<a)?U(t.slot_astro_dawn):null,o=t.slot_nautical_dawn!==null&&(a===null||U(t.slot_nautical_dawn)<a)?U(t.slot_nautical_dawn):null,r=t.slot_civil_dawn!==null&&(a===null||U(t.slot_civil_dawn)<a)?U(t.slot_civil_dawn):null,n=t.slot_civil_dusk!==null&&t.slot_civil_dusk<=1440?U(t.slot_civil_dusk):null,c=t.slot_nautical_dusk!==null&&t.slot_nautical_dusk<=1440?U(t.slot_nautical_dusk):null,u=t.slot_astro_dusk!==null&&t.slot_astro_dusk<=1440?U(t.slot_astro_dusk):null,g=t.slot_night!==null&&t.slot_night<=1440?U(t.slot_night):null,f=t.slot_gold_dawn!==null&&t.slot_gold_dawn!==void 0;return s!==null&&i.push({t:s,c:Ut}),o!==null&&i.push({t:o,c:Bt}),r!==null&&i.push({t:r,c:Ft}),a!==null&&i.push({t:a,c:f?Ye:ee}),f&&t.slot_day!==null&&t.slot_day!==void 0&&i.push({t:U(t.slot_day),c:ee}),f&&t.slot_gold_dusk!==null&&t.slot_gold_dusk!==void 0&&t.slot_gold_dusk<=1440&&i.push({t:U(t.slot_gold_dusk),c:Ye}),n!==null&&i.push({t:n,c:Ft}),c!==null&&i.push({t:c,c:Bt}),u!==null&&i.push({t:u,c:Ut}),g!==null&&i.push({t:g,c:_t}),i}function Co(t,e,i){const a=s=>{const o=e[s];if(!o||i<0||i>=o.length)return null;const r=o[i];return r==null||!Number.isFinite(r)?null:r};return{...t,slot_astro_dawn:a("astro_dawn"),slot_nautical_dawn:a("nautical_dawn"),slot_civil_dawn:a("civil_dawn"),slot_gold_dawn:a("gold_dawn"),slot_day:a("day"),slot_gold_dusk:a("gold_dusk"),slot_civil_dusk:a("civil_dusk"),slot_nautical_dusk:a("nautical_dusk"),slot_astro_dusk:a("astro_dusk"),slot_night:a("night"),slot_sunrise:a("gold_dawn")??a("day")}}function Qi(t,e,i){if(!t)return Xi(e.midnight_el);const a=1440;if(i){if(t.slot_civil_dusk!==null)return t.slot_night!==null&&t.slot_night<=a?_t:t.slot_astro_dusk!==null&&t.slot_astro_dusk<=a?Ut:t.slot_nautical_dusk!==null&&t.slot_nautical_dusk<=a?Bt:t.slot_civil_dusk!==null&&t.slot_civil_dusk<=a?Ft:ee}else if(t.sunset!==null)return t.astro_dusk!==null&&t.astro_dusk<=a?_t:t.nautical_dusk!==null&&t.nautical_dusk<=a?Ut:t.dusk!==null&&t.dusk<=a?Bt:t.sunset!==null&&t.sunset<=a?Ft:ee;return Xi(t.midnight_el)}function ts(t,e,i,a){const o=(r,n,c,u)=>{if(r===null||r<=1440||u===null)return;const g=U(r-1440);c!==null&&g>=c||t.push({t:g,c:n})};a?(o(e.slot_civil_dusk,Ft,i.slot_sunrise,i.slot_sunrise),o(e.slot_nautical_dusk,Bt,i.slot_civil_dawn,i.slot_civil_dawn),o(e.slot_astro_dusk,Ut,i.slot_nautical_dawn,i.slot_nautical_dawn),o(e.slot_night,_t,i.slot_astro_dawn,i.slot_astro_dawn)):(o(e.sunset,Ft,i.sunrise,i.sunrise),o(e.dusk,Bt,i.dawn,i.dawn),o(e.nautical_dusk,Ut,i.nautical_dawn,i.nautical_dawn),o(e.astro_dusk,_t,i.astro_dawn,i.astro_dawn))}function Js(t,e,i,a,s,o,r,n,c){let u=r,g=e;for(const f of o){const d=n(Math.max(0,Math.min(c,f.t)));d>g&&(t.fillStyle=u,t.fillRect(g,i,d-g,a)),u=f.c,g=d}t.fillStyle=u,t.fillRect(g,i,s-g,a)}function ko(t,e,i,a,s,o,r){let n=s,c=0;for(const u of a)u.t>c&&u.t<=r&&(t.fillStyle=n,t.fillRect(e,o(u.t),i,o(c)-o(u.t))),n=u.c,c=Math.max(c,u.t);c<r&&(t.fillStyle=n,t.fillRect(e,o(r),i,o(c)-o(r)))}var So=Object.defineProperty,Do=Object.getOwnPropertyDescriptor,Y=(t,e,i,a)=>{for(var s=a>1?void 0:a?Do(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&So(e,i,s),s};const Qs=[210,145,35,280,190,330,15],ta=50,ea=20,Ao=0,Eo=30,es=72,ia=12,To=2,ui=20;let q=class extends B{constructor(){super(...arguments),this.hass=null,this.date=Pt(),this.clamped=!1,this.noHeader=!1,this.noAxisLabels=!1,this.noYAxis=!1,this.showSlots=!1,this.primaryOnly=!1,this.noSolarNoonMidnight=!1,this.hoverTime=null,this.liveTime=null,this.embedded=!1,this.sparkline=!1,this.channels={},this.selectedChannelId="primary",this.channelSlotsMap={},this.days=[],this.sunData=null,this.slots=[],this._days=[],this._sunData=null,this._loading=!1,this._loadGuard=new ni,this._w=0,this._geom=null,this._ro=null}connectedCallback(){super.connectedCallback()}disconnectedCallback(){var t;(t=this._ro)==null||t.disconnect(),super.disconnectedCallback()}updated(t){var i;if(!this._ro){const a=(i=this.shadowRoot)==null?void 0:i.querySelector(".canvas-wrap");a&&(this._ro=new ResizeObserver(s=>{const o=s[0].contentRect.width;o>0&&o!==this._w&&(this._w=o,this._draw())}),this._ro.observe(a))}t.has("days")&&this.days.length&&(this._days=this.days),t.has("sunData")&&this.sunData&&(this._sunData=this.sunData),(t.has("hass")||t.has("date"))&&this.hass&&!this.days.length&&this._load(),(t.has("_sunData")||t.has("_days")||t.has("clamped")||t.has("showSlots")||t.has("primaryOnly")||t.has("noSolarNoonMidnight")||t.has("noYAxis")||t.has("hoverTime")||t.has("liveTime")||t.has("channels")||t.has("selectedChannelId")||t.has("channelSlotsMap"))&&requestAnimationFrame(()=>this._draw())}async _load(){if(!this.hass)return;this._loading=!0;const t=this._loadGuard.begin();try{const e=await Wi(this.hass,{date:this.date});if(!t.isCurrent())return;this._sunData=e;const i=[];e.prev_day_data&&i.push(e.prev_day_data),e.day_data&&i.push(e.day_data),this._days=i}finally{t.isCurrent()&&(this._loading=!1)}}_getLiveTime(){const t=new Date;return t.getHours()*60+t.getMinutes()+t.getSeconds()/60}_interpolateEl(t){var e;return Ys(((e=this._sunData)==null?void 0:e.points)??[],t)}_draw(){var Se,Mt,Ze,Je,Qe;const t=(Se=this.shadowRoot)==null?void 0:Se.querySelector("canvas"),e=this._sunData??this.sunData;if(!t||!e||!this._w)return;const{points:i}=e;if(!i.length)return;const a=this._w,s=t.getBoundingClientRect().height;if(!s)return;const o=Bi(t,a,s),r=this.noAxisLabels?10:this.noYAxis?ui+es:ta,n=this.noAxisLabels?10:this.noYAxis?ui:ea,c=this.noAxisLabels?10:Ao,u=this.noAxisLabels?10:Eo,g=a-r-n,f=s-c-u,d=this.primaryOnly?[]:Object.keys(this.channels||{}).filter($=>$!=="primary"),b=1+d.length,w=f/b,y=f,v=c,_=c+y,C=r,S=r+g,A=v+f/2,k=1440;this._geom={plotT:v,stripeH:w,numStripes:b};const I=e.lat??50,x=Math.abs(I),O=x<=23.44?90:113.44-x,j=Math.max(O,...i.map($=>Math.abs($.elevation)))+10,E=$=>C+$/k*g,M=$=>A-$/j*(y/2);o.save(),o.beginPath(),o.roundRect(C,v,g,f,8),o.fillStyle=_t,o.fill(),o.restore(),o.save(),o.beginPath(),o.roundRect(C,v,g,f,8),o.clip();const G=w;o.save(),o.beginPath(),o.rect(C,v,g,G),o.clip();const z=this._days.length?this._days:this.days,J=z.findIndex($=>$.date===this.date),D=J>=0?z[J]:null,st=J>0?z[J-1]:null,et=((Mt=this.channelSlotsMap)==null?void 0:Mt[T])??((Ze=this.slots)!=null&&Ze.length?this.slots:null);if(et&&et.length>0){const $=Xt=>(Xt%1440+1440)%1440,R=[...et].sort((Xt,hs)=>$(Xt.from)-$(hs.from)),mt=R.map(Xt=>({t:$(Xt.from),c:Xt.color})),ti=R.length>0?R[R.length-1].color:_t;Js(o,C,v,G,S,mt,ti,E,k)}else if(D){const $=this.clamped,mt=[...$?Ji(D):Zi(D)];st&&ts(mt,st,D,$),mt.sort((Xt,hs)=>Xt.t-hs.t);const ti=Qi(st,D,$);Js(o,C,v,G,S,mt,ti,E,k)}else o.fillStyle=_t,o.fillRect(C,v,g,G);o.restore(),this._drawCustomStripes(o,d,D,st,e,C,v,S,g,w,E),o.save(),o.beginPath(),o.rect(C,v,g,f),o.clip(),o.save(),o.beginPath(),o.moveTo(C,A);for(const $ of i)o.lineTo(E($.time),M($.elevation));o.lineTo(S,A),o.closePath();const at=o.createLinearGradient(0,v,0,A);at.addColorStop(0,"rgba(249,217,118,0.11)"),at.addColorStop(1,"rgba(249,217,118,0.01)"),o.fillStyle=at,o.fill(),o.restore(),o.save(),o.strokeStyle="rgba(255,255,255,0.35)",o.lineWidth=1.5,o.setLineDash([4,4]),o.beginPath(),o.moveTo(C,A),o.lineTo(S,A),o.stroke(),o.restore();const N=o.createLinearGradient(0,v,0,_);N.addColorStop(0,"#f9d976"),N.addColorStop(.47,"#e8a020"),N.addColorStop(.53,"#34507a"),N.addColorStop(1,"#1b233a"),o.save(),o.beginPath();let ot=!0;for(const $ of i){const R=E($.time),mt=M($.elevation);ot?(o.moveTo(R,mt),ot=!1):o.lineTo(R,mt)}o.strokeStyle=N,o.lineWidth=2,o.stroke(),o.restore(),o.save(),o.strokeStyle=N,o.lineWidth=2,o.shadowColor="rgba(249, 217, 118, 0.55)",o.shadowBlur=8,o.beginPath();let bt=!1;for(const $ of i){const R=E($.time),mt=M($.elevation);$.elevation>=0?bt?o.lineTo(R,mt):(o.moveTo(R,mt),bt=!0):bt=!1}if(o.stroke(),o.restore(),!this.noYAxis)for(const $ of[-18,-12,-6,0,30,60]){const R=M($);R<v-2||R>_+2||[-18,-12,-6,0].includes($)&&(o.save(),o.strokeStyle=Gs,o.lineWidth=.5,o.setLineDash([3,4]),o.beginPath(),o.moveTo(C,R),o.lineTo(S,R),o.stroke(),o.restore())}o.restore();const W=this.liveTime??this._getLiveTime(),V=this._interpolateEl(W),it=E(W),ht=M(V),zt=v+w,K=($,R,mt=[],ti=zt)=>{if($===null)return;const Xt=E(($%k+k)%k);o.save(),o.strokeStyle=R,o.lineWidth=1.5,o.setLineDash(mt),o.beginPath(),o.moveTo(Xt,v),o.lineTo(Xt,ti),o.stroke(),o.restore()};if(this.noSolarNoonMidnight||(K((D==null?void 0:D.solar_noon)??null,"rgba(255,214,0,0.7)",[],v+f),K((D==null?void 0:D.solar_midnight)??null,"rgba(60,100,200,0.7)",[],v+f)),this.showSlots){const $=((Je=this.channelSlotsMap)==null?void 0:Je[T])??((Qe=this.slots)!=null&&Qe.length?this.slots:null);if($&&$.length>0)for(const R of $)K(R.from,"rgba(255,255,255,0.65)");else D&&(K(D.slot_sunset,"rgba(255,255,255,0.75)"),K(D.slot_nautical_dusk,"rgba(255,255,255,0.60)"),K(D.slot_astro_dusk,"rgba(255,255,255,0.45)"),K(D.slot_night,"rgba(255,255,255,0.30)"),K(D.slot_astro_dawn,"rgba(255,255,255,0.30)"),K(D.slot_nautical_dawn,"rgba(255,255,255,0.45)"),K(D.slot_civil_dawn,"rgba(255,255,255,0.60)"),K(D.slot_sunrise,"rgba(255,255,255,0.75)"),K(D.slot_day,"rgba(255,255,255,0.65)"),K(D.slot_gold_dusk,"rgba(255,255,255,0.65)"))}for(const $ of[0,360,720,1080,1440]){const R=E($);o.save(),o.strokeStyle=Gs,o.lineWidth=.5,o.beginPath(),o.moveTo(R,v),o.lineTo(R,v+f),o.stroke(),o.restore()}if(o.save(),o.strokeStyle="rgba(255,255,255,0.25)",o.lineWidth=1,o.setLineDash([3,3]),o.beginPath(),o.moveTo(it,v),o.lineTo(it,v+f),o.stroke(),o.restore(),this.hoverTime!==null){const $=E(this.hoverTime);o.save(),o.strokeStyle="rgba(255,255,255,0.35)",o.lineWidth=1,o.setLineDash([3,3]),o.beginPath(),o.moveTo($,v),o.lineTo($,v+f),o.stroke(),o.restore()}if(o.restore(),o.save(),o.beginPath(),o.roundRect(C,v,g,f,8),o.strokeStyle=Vs(this),o.lineWidth=1,o.stroke(),o.restore(),V>=0?Xs(o,it,ht):V>=-6?Zs(o,it,ht):Ks(o,it,ht),!this.noAxisLabels){o.fillStyle=Ki(this),o.font=hi(this);for(const $ of[0,360,720,1080,1440]){const R=E($);o.textAlign=$===0?"start":$===1440?"end":"center",o.fillText(`${String($/60|0).padStart(2,"0")}:00`,R,v+f+20)}}if(!this.noAxisLabels&&!this.noYAxis){o.font=hi(this),o.textAlign="end";for(const $ of[-18,-12,-6,0,30,60]){const R=M($);if(R<v-10||R>_+10)continue;const mt=Math.min(Math.max(R,v+10),_-6);[0,30,60,-18].includes($)&&(o.fillStyle=Ki(this),o.fillText(`${$}°`,C-6,mt+4))}}this.noYAxis&&!this.noAxisLabels&&this._drawChannelAxisLabels(o,["primary",...d],C,v,w),o.restore()}_elevationToLightRatio(t){return Math.max(0,Math.min(1,(t- -18)/48))}_drawCustomStripes(t,e,i,a,s,o,r,n,c,u,g){const f=i||a||s.day_data;if(e.length===0||!f)return;const d=h=>(h%1440+1440)%1440;e.forEach((h,b)=>{var x,O,j;const w=r+(b+1)*u,y=w+u,v=((x=this.channelSlotsMap)==null?void 0:x[h])??[],_=((j=(O=this.channels)==null?void 0:O[h])==null?void 0:j.enabled)!==!1,C=Qs[b%Qs.length],S=_?35:0,A=_?12:6,k=_?42:14;t.fillStyle=_t,t.fillRect(o,w,c,u);const I=c/1440;if(v.forEach(E=>{const M=Hi(E);if(M<=0)return;const G=d(E.from),z=o+G*I,J=d(E.from+M/2),D=this._interpolateEl(J),st=this._elevationToLightRatio(D),et=A+st*(k-A);t.fillStyle=`hsl(${C}, ${S}%, ${et}%)`;const at=M*I,N=z+at-n;N<=0?t.fillRect(z,w,at,u):(t.fillRect(z,w,n-z,u),t.fillRect(o,w,N,u))}),this.showSlots){t.strokeStyle="rgba(255, 255, 255, 0.35)",t.lineWidth=1.5;for(const E of v){const M=g(d(E.from));t.beginPath(),t.moveTo(M,w),t.lineTo(M,y),t.stroke()}}t.strokeStyle="rgba(255, 255, 255, 0.08)",t.lineWidth=.5,t.beginPath(),t.moveTo(o,w),t.lineTo(n,w),t.stroke()})}_drawChannelAxisLabels(t,e,i,a,s){const n=es-ia-To,c=i-ia;t.save(),t.font="600 11px system-ui, sans-serif",t.textAlign="end",t.textBaseline="middle",e.forEach((u,g)=>{var _,C,S,A;const f=((C=(_=this.channels)==null?void 0:_[u])==null?void 0:C.enabled)!==!1,d=(((A=(S=this.channels)==null?void 0:S[u])==null?void 0:A.name)||u).toUpperCase(),h=a+g*s,b=Math.max(1,Math.floor((s-8)/13)),w=this._wrapText(t,d,n,b);t.fillStyle=f?Ki(this):"rgba(255,255,255,0.35)";const y=w.length*13;let v=h+(s-y)/2+13/2;for(const k of w)t.fillText(k,c,v),v+=13}),t.restore()}_wrapText(t,e,i,a){const s=f=>t.measureText(f).width<=i,o=e.split(/\s+/).filter(Boolean),r=[];let n="";const c=f=>{for(const d of f)n&&!s(n+d)&&(r.push(n),n=""),n+=d};for(const f of o){const d=n?`${n} ${f}`:f;if(s(d)){n=d;continue}n&&(r.push(n),n=""),s(f)?n=f:c(f)}if(n&&r.push(n),r.length<=a)return r;const u=r.slice(0,a);let g=u[a-1];for(;g.length>0&&!s(`${g}…`);)g=g.slice(0,-1);return u[a-1]=`${g}…`,u}get _padLeft(){return this.noAxisLabels?10:this.noYAxis?ui+es:ta}get _padRight(){return this.noAxisLabels?10:this.noYAxis?ui:ea}_channelAtY(t,e){const i=this._geom;if(!i||i.numStripes<=1)return this.selectedChannelId;const a=t-e,s=Math.max(0,Math.min(i.numStripes-1,Math.floor((a-i.plotT)/i.stripeH)));return s===0?"primary":Object.keys(this.channels||{}).filter(r=>r!=="primary")[s-1]??"primary"}_timeAtX(t,e){const i=this._w-this._padLeft-this._padRight,a=t-e;return Math.round(Math.max(0,Math.min(1,(a-this._padLeft)/i))*1440)}_getSlotAtTimeIn(t,e){const i=s=>(s%1440+1440)%1440,a=i(e);for(const s of t){const o=Hi(s);if(!(o<=0)&&i(a-i(s.from))<o)return s}return null}_slotsForChannel(t){var i;const e=(i=this.channelSlotsMap)==null?void 0:i[t];return e&&e.length?e:this.slots}_onCanvasClick(t){if(!this._w)return;const e=t.currentTarget.getBoundingClientRect(),i=this._timeAtX(t.clientX,e.left),a=this._channelAtY(t.clientY,e.top),s=this._getSlotAtTimeIn(this._slotsForChannel(a),i);s&&this.dispatchEvent(new CustomEvent("slot-selected",{detail:{slotId:s.id,channelId:a},bubbles:!0,composed:!0}))}_onMouseMove(t){if(!this._w)return;const e=t.currentTarget.getBoundingClientRect();this.hoverTime=this._timeAtX(t.clientX,e.left);const i=this._channelAtY(t.clientY,e.top);this.dispatchEvent(new CustomEvent("time-hover-changed",{detail:{hoverTime:this.hoverTime,channelId:i,scrubbing:!0},bubbles:!0,composed:!0})),this._draw()}_onMouseLeave(){this.hoverTime=null,this.dispatchEvent(new CustomEvent("time-hover-changed",{detail:{hoverTime:null,scrubbing:!1},bubbles:!0,composed:!0})),this._draw()}_onTouchMove(t){if(!this._w)return;const e=t.touches[0],i=t.currentTarget.getBoundingClientRect();this.hoverTime=this._timeAtX(e.clientX,i.left);const a=this._channelAtY(e.clientY,i.top);this.dispatchEvent(new CustomEvent("time-hover-changed",{detail:{hoverTime:this.hoverTime,channelId:a,scrubbing:!0},bubbles:!0,composed:!0})),this._draw()}_onTouchEnd(){this.hoverTime=null,this.dispatchEvent(new CustomEvent("time-hover-changed",{detail:{hoverTime:null,scrubbing:!1},bubbles:!0,composed:!0})),this._draw()}_getSparklineGradient(){const t=this._days.length?this._days:this.days,e=t.findIndex(f=>f.date===this.date),i=e>=0?t[e]:null,a=e>0?t[e-1]:null;if(!i)return"var(--divider-color)";const s=this.clamped,r=[...s?Ji(i):Zi(i)];a&&ts(r,a,i,s),r.sort((f,d)=>f.t-d.t);const n=Qi(a,i,s),c=[],u=1440;let g=n;c.push(`${g} 0%`);for(const f of r){const h=(Math.max(0,Math.min(u,f.t))/u*100).toFixed(1);c.push(`${g} ${h}%`),g=f.c,c.push(`${g} ${h}%`)}return c.push(`${g} 100%`),`linear-gradient(to right, ${c.join(", ")})`}render(){if(this.sparkline){const t=this._getSparklineGradient(),i=(this.liveTime??this._getLiveTime())/1440*100;return l`
        <div class="sparkline-container">
          <div class="sparkline-bar" style="--bar-gradient: ${t}">
            <div class="sparkline-pointer" style="left: calc(${i}% - 3px)"></div>
          </div>
        </div>
        ${this.noAxisLabels?"":l`
          <div class="sparkline-labels">
            <span>00:00</span>
            <span>12:00</span>
            <span>24:00</span>
          </div>
        `}
      `}return l`
      ${this.noHeader?"":l`
        <div class="card-header">
          <span class="card-dot" style="--dot-color: #f59e0b;"></span>
          <span class="card-title">Sun path</span>
        </div>
      `}
      <div class="canvas-wrap">
        ${this._loading&&!this._sunData&&!this.sunData?l`<div class="loading"><ha-circular-progress active size="small"></ha-circular-progress></div>`:l`<canvas
              @click=${this._onCanvasClick}
              @mousemove=${this._onMouseMove}
              @mouseleave=${this._onMouseLeave}
              @touchstart=${this._onTouchMove}
              @touchmove=${this._onTouchMove}
              @touchend=${this._onTouchEnd}
            ></canvas>`}
      </div>
    `}};q.styles=[Kt,P`
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
  `],Y([p({attribute:!1})],q.prototype,"hass",2),Y([p({type:String})],q.prototype,"date",2),Y([p({type:Boolean})],q.prototype,"clamped",2),Y([p({type:Boolean})],q.prototype,"noHeader",2),Y([p({type:Boolean})],q.prototype,"noAxisLabels",2),Y([p({type:Boolean,reflect:!0})],q.prototype,"noYAxis",2),Y([p({type:Boolean})],q.prototype,"showSlots",2),Y([p({type:Boolean})],q.prototype,"primaryOnly",2),Y([p({type:Boolean})],q.prototype,"noSolarNoonMidnight",2),Y([p({type:Number})],q.prototype,"hoverTime",2),Y([p({type:Number})],q.prototype,"liveTime",2),Y([p({type:Boolean,reflect:!0})],q.prototype,"embedded",2),Y([p({type:Boolean,reflect:!0})],q.prototype,"sparkline",2),Y([p({type:Object})],q.prototype,"channels",2),Y([p({type:String})],q.prototype,"selectedChannelId",2),Y([p({attribute:!1})],q.prototype,"channelSlotsMap",2),Y([p({attribute:!1})],q.prototype,"days",2),Y([p({attribute:!1})],q.prototype,"sunData",2),Y([p({type:Array})],q.prototype,"slots",2),Y([m()],q.prototype,"_days",2),Y([m()],q.prototype,"_sunData",2),Y([m()],q.prototype,"_loading",2),Y([m()],q.prototype,"_w",2),q=Y([L("twilight-sun-path-card")],q);var Oo=Object.defineProperty,Io=Object.getOwnPropertyDescriptor,Nt=(t,e,i,a)=>{for(var s=a>1?void 0:a?Io(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Oo(e,i,s),s};let xt=class extends B{constructor(){super(...arguments),this.hass=null,this.slots=[],this.noHeader=!1,this.entities=[],this.loading=!1,this.channels={},this.selectedChannelId=T,this.templateMode=!1,this.date=Pt(),this.channelSlotsMap={},this._menuOpen=!1,this._dialog=new we(this),this._clock=new di(this),this._handleWindowClick=t=>{if(!this._menuOpen)return;t.composedPath().some(a=>a instanceof HTMLElement&&a.classList.contains("kebab-container"))||(this._menuOpen=!1)}}connectedCallback(){super.connectedCallback(),window.addEventListener("click",this._handleWindowClick)}disconnectedCallback(){window.removeEventListener("click",this._handleWindowClick),super.disconnectedCallback()}_toggleMenu(t){t.stopPropagation(),this._menuOpen=!this._menuOpen}_orderedChannelIds(){const t=Object.keys(this.channels);if(this.templateMode){const e=t.filter(i=>i!==T).sort();return[T,...e]}return li(this.channels)}_selectChannel(t){this._menuOpen=!1,this.dispatchEvent(new CustomEvent("channel-selected",{detail:{channelId:t},bubbles:!0,composed:!0}))}async _addChannel(){this._menuOpen=!1;const t=await this._dialog.showPrompt("New Channel","","Name of the new channel");t===null||t.trim()===""||this.dispatchEvent(new CustomEvent("channel-added",{detail:{name:t.trim()},bubbles:!0,composed:!0}))}async _renameChannel(){var i;this._menuOpen=!1;const t=((i=this.channels[this.selectedChannelId])==null?void 0:i.name)??"",e=await this._dialog.showPrompt("Rename Channel",t,"New channel name");e===null||e.trim()===""||this.dispatchEvent(new CustomEvent("channel-renamed",{detail:{channelId:this.selectedChannelId,name:e.trim()},bubbles:!0,composed:!0}))}async _deleteChannel(){var i;if(this._menuOpen=!1,this.selectedChannelId===T)return;const t=((i=this.channels[this.selectedChannelId])==null?void 0:i.name)??this.selectedChannelId;await this._dialog.showConfirm("Delete Channel",`Delete channel "${t}"? Its lights will be turned off.`)&&this.dispatchEvent(new CustomEvent("channel-deleted",{detail:{channelId:this.selectedChannelId},bubbles:!0,composed:!0}))}_toggleChannelEnabled(){if(this._menuOpen=!1,this.selectedChannelId===T)return;const t=this.channels[this.selectedChannelId];t&&this.dispatchEvent(new CustomEvent("channel-enabled-toggled",{detail:{channelId:this.selectedChannelId,enabled:!t.enabled},bubbles:!0,composed:!0}))}_fireEditRequested(){this.dispatchEvent(new CustomEvent("edit-requested",{bubbles:!0,composed:!0}))}render(){const t=this._clock.liveMins,e=this.templateMode?-1:this.slots.findIndex(a=>Te(a,t)),i=e!==-1?[...this.slots.slice(e),...this.slots.slice(0,e)]:this.slots;return l`
      <div class="slot-card">
        ${this.noHeader?"":l`
          <div class="slot-card-header">
            <span class="card-dot" style="--dot-color: #f97316;"></span>
            <span class="slot-card-title">Timetable</span>
            <div class="kebab-container">
              <button class="edit-btn" @click=${this._toggleMenu}>⋮</button>
              ${this._menuOpen?l`
                <div class="dropdown-menu">
                  ${(()=>{var n;const a=this.selectedChannelId===T,s=this.selectedChannelId&&!a&&!!this.channels[this.selectedChannelId],r=Object.keys(this.channels).filter(c=>c!==T).length>=Qa;return l`
                      <button class="dropdown-item" @click=${()=>{this._menuOpen=!1,this._fireEditRequested()}}>
                        📝 Edit Slots
                      </button>
                      <button class="dropdown-item" ?disabled=${r} @click=${this._addChannel}>
                        ➕ ${r?"Add channel (max reached)":"Add channel"}
                      </button>
                      ${s?l`
                        <button class="dropdown-item" @click=${this._renameChannel}>
                          ✏️ Rename channel
                        </button>
                        <button class="dropdown-item" @click=${this._toggleChannelEnabled}>
                          ${((n=this.channels[this.selectedChannelId])==null?void 0:n.enabled)===!1?"Enable channel":"Disable channel"}
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
            ${this._orderedChannelIds().map(a=>{const s=a===T,o=this.channels[a],r=a===this.selectedChannelId,n=(o==null?void 0:o.enabled)===!1;return l`
                <button
                  class="channel-tab ${r?"active":""} ${n?"disabled":""}"
                  @click=${()=>this._selectChannel(a)}
                  title=${n?"Channel disabled":""}
                >${s?"Primary":(o==null?void 0:o.name)||a}</button>
              `})}
          </div>
        `}
        ${!this.templateMode&&!this.loading?l`
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
          ${this.loading?l`<div class="entity-list-empty">Loading…</div>`:i.length>0?i.map(a=>{const s=!this.templateMode&&Te(a,t),o=this.templateMode?a.startType==="fixed"?a.fixedStartTime||"12:00":`${a.startEvent||"astral"}${a.startOffset?a.startOffset>0?` +${a.startOffset}m`:` ${a.startOffset}m`:""}`:`${_e(a.from)} → ${_e(a.to)}`;return l`
                    <div class="slot-summary-row ${s?"active":""}" style="cursor: pointer;" @click=${()=>this._fireEditRequested()}>
                      <div class="slot-color-dot" style="background:${a.color}; box-shadow:${s?`0 0 6px ${a.color}`:"none"}"></div>
                      <span class="slot-summary-label">${a.label}</span>
                      <span class="slot-summary-scene">
                        ${a.scene?Ui(this.hass,a.scene):"—"}
                      </span>
                      <span class="slot-summary-time">${o}</span>
                    </div>
                  `}):l`<div class="entity-list-empty">${this.templateMode?"No custom channels in template. Click ⋮ → Add channel":"No slots configured."}</div>`}
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
    `}};xt.styles=[Kt,P`
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
  `],Nt([p({attribute:!1})],xt.prototype,"hass",2),Nt([p({type:Array})],xt.prototype,"slots",2),Nt([p({type:Boolean})],xt.prototype,"noHeader",2),Nt([p({type:Array})],xt.prototype,"entities",2),Nt([p({type:Boolean})],xt.prototype,"loading",2),Nt([p({attribute:!1})],xt.prototype,"channels",2),Nt([p({type:String})],xt.prototype,"selectedChannelId",2),Nt([p({type:Boolean})],xt.prototype,"templateMode",2),Nt([p({type:String})],xt.prototype,"date",2),Nt([p({attribute:!1})],xt.prototype,"channelSlotsMap",2),Nt([m()],xt.prototype,"_menuOpen",2),xt=Nt([L("twilight-timetable-card")],xt);function sa(t,e){var i;try{const a=e||document.body,s=window.getComputedStyle(a),o=s.getPropertyValue("--primary-text-color").trim()||s.color;if(o)return zo(o)}catch{}return((i=t==null?void 0:t.themes)==null?void 0:i.darkMode)!==void 0?!!t.themes.darkMode:!!(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)}function zo(t){const e=t.toLowerCase().trim();if(e==="white"||e.startsWith("#fff")||e.includes("255,255,255")||e.includes("255, 255, 255"))return!0;if(e==="black"||e==="#000"||e==="#000000"||e.includes("0,0,0")||e.includes("0, 0, 0"))return!1;if(e.startsWith("#")){const a=e.substring(1);let s=0,o=0,r=0;return a.length===3||a.length===4?(s=parseInt(a[0]+a[0],16),o=parseInt(a[1]+a[1],16),r=parseInt(a[2]+a[2],16)):a.length>=6&&(s=parseInt(a.substring(0,2),16),o=parseInt(a.substring(2,4),16),r=parseInt(a.substring(4,6),16)),(.299*s+.587*o+.114*r)/255>.5}const i=e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);if(i){const a=parseInt(i[1],10),s=parseInt(i[2],10),o=parseInt(i[3],10);return(.299*a+.587*s+.114*o)/255>.5}return!1}function is(t,e){if(!t)return l`<span>—</span>`;const i=s=>s?l`<div style="width:10px; height:10px; border-radius:3px; background:${s}; flex-shrink:0;"></div>`:"",a=(s,o,r)=>l`
    <div style="display:flex; justify-content:center; align-items:center; gap:6px;">
      ${i(o)}
      <span class=${r?`mismatch-badge ${e}`:""}>${s}</span>
    </div>`;return t.deviates?l`
    <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
      ${a(t.actual,t.actual_swatch,!1)}
      ${a(t.target,t.target_swatch,!0)}
    </div>`:a(t.actual,t.actual_swatch,!1)}var Mo=Object.defineProperty,Po=Object.getOwnPropertyDescriptor,Me=(t,e,i,a)=>{for(var s=a>1?void 0:a?Po(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Mo(e,i,s),s};let pe=class extends ce{constructor(){super(...arguments),this.open=!1,this.hass=null,this.entities=[],this.manualOnly=!1,this._pickerValue=""}updated(t){super.updated(t),t.has("open")&&this.open&&oi()}_closeDialog(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_toggleManualOnly(){const t=!this.manualOnly;this.dispatchEvent(new CustomEvent("mode-changed",{detail:{manualOnly:t},bubbles:!0,composed:!0}))}_toggleEntity(t){const e=this.entities.map(i=>i.entity_id===t?{...i,isManual:!i.isManual}:i);this._fireChange(e)}_addEntity(t){var a,s,o;if(!t)return;const e=this.entities.find(r=>r.entity_id===t);let i=[...this.entities];if(e)e.isManual||(i=this.entities.map(r=>r.entity_id===t?{...r,isManual:!0}:r));else{const r=((o=(s=(a=this.hass)==null?void 0:a.states[t])==null?void 0:s.attributes)==null?void 0:o.friendly_name)??t,n=t.split(".")[0];i=[...this.entities,{entity_id:t,name:r,domain:n,in_area:!1,isManual:!0,isExtracted:!1,checked:!0}]}this._fireChange(i),this._pickerValue=""}_fireChange(t){this.dispatchEvent(new CustomEvent("lights-changed",{detail:{entities:t},bubbles:!0,composed:!0}))}render(){if(!this.open)return l``;const t=this.entities.filter(s=>s.isExtracted&&(s.domain==="light"||s.domain==="switch")),e=this.entities.filter(s=>s.in_area&&!s.isExtracted&&(s.domain==="light"||s.domain==="switch")),i=this.entities.filter(s=>!s.in_area&&s.isManual&&(s.domain==="light"||s.domain==="switch")),a=this.entities.some(s=>s.isManual);return l`
      <div class="overlay" @click=${s=>{s.target===s.currentTarget&&this._closeDialog()}}>
        <div class="edit-panel" style="max-width: 1000px;">
          <div class="panel-header">
            <span class="card-dot" style="--dot-color: #eab308;"></span>
            <span class="panel-header-title">Area Lights — Configuration</span>
            <button class="panel-close" @click=${this._closeDialog}>✕</button>
          </div>

          <div class="panel-body">
            ${t.length>0?l`
              <div class="list-section-label">Entities in Scene (Automatically Controlled)</div>
              <div class="grid-list">
                ${t.map(s=>l`
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
              ${e.map(s=>l`
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

            ${i.length>0?l`
              <div class="divider"></div>
              <div class="list-section-label">Additional Entities (Manually Added)</div>
              <div class="grid-list">
                ${i.map(s=>l`
                  <div class="picker-row" @click=${()=>this._toggleEntity(s.entity_id)}>
                    <div class="picker-checkbox checked"></div>
                    <div style="flex: 1; min-width: 0;">
                      <div style="display:flex; align-items:center; gap:8px;">
                        <span class="picker-label">${s.name}</span>
                        ${s.isExtracted?l`
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

            ${a?l`
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
    `],Me([p({type:Boolean})],pe.prototype,"open",2),Me([p({attribute:!1})],pe.prototype,"hass",2),Me([p({type:Array})],pe.prototype,"entities",2),Me([p({type:Boolean})],pe.prototype,"manualOnly",2),Me([m()],pe.prototype,"_pickerValue",2),pe=Me([L("twilight-area-lights-dialog")],pe);var No=Object.defineProperty,Ro=Object.getOwnPropertyDescriptor,he=(t,e,i,a)=>{for(var s=a>1?void 0:a?Ro(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&No(e,i,s),s};let Zt=class extends B{constructor(){super(...arguments),this.hass=null,this.activeSceneName="No Scene Active",this.noHeader=!1,this.runState=null,this.entities=[],this.manualOnly=!1,this._isDark=!1}willUpdate(t){t.has("hass")&&(this._isDark=sa(this.hass,this))}_toggleManualOnly(t){this.manualOnly=t.detail.manualOnly,this.dispatchEvent(new CustomEvent("mode-changed",{detail:{manualOnly:this.manualOnly},bubbles:!0,composed:!0}))}_onLightsChanged(t){this.entities=t.detail.entities,this.dispatchEvent(new CustomEvent("lights-changed",{detail:{entities:this.entities},bubbles:!0,composed:!0}))}render(){var r;const t=((r=this.runState)==null?void 0:r.light_states)??{},e=this._isDark?"dark":"light",i=Object.keys(t).length>0;let a=[],s=[];i?Object.keys(t).forEach(n=>{const c=t[n],u=this.entities.find(h=>h.entity_id===n),g=u?!!u.isExtracted:!0,f=u?!!u.isManual:!1,d={entity_id:n,name:c.name||(u==null?void 0:u.name)||n,actual_on:c.actual_on,on:c.on,brightness:c.brightness,color:c.color};g?a.push(d):f?s.push(d):a.push(d)}):this.entities.forEach(n=>{const c=!!n.isManual,u=!!n.isExtracted;if(!c&&!u)return;const g={entity_id:n.entity_id,name:n.name||n.entity_id,actual_on:!1,on:null,brightness:null,color:null};u?a.push(g):s.push(g)});const o=a.length+s.length;return l`
      <div class="devices-card">
        ${this.noHeader?"":l`
          <div class="devices-card-header">
            <span class="card-dot" style="--dot-color: #eab308;"></span>
            <span class="devices-card-title">Area Lights</span>
            <div class="active-scene-wrap">
              <span class="active-scene-label">Active Scene:</span>
              <span class="active-scene-value">${this.activeSceneName}</span>
            </div>
            <button class="edit-btn" @click=${()=>{this.dispatchEvent(new CustomEvent("open-edit",{bubbles:!0,composed:!0}))}} title="Configure Lights">⋮</button>
          </div>
        `}

        <div class="table-container">
          ${o===0?l`<div style="padding: 12px 0; font-size: 13px; color: var(--secondary-text-color); font-style: italic;">No lights configured</div>`:l`
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
                    ${a.length>0?l`
                      <tr class="section-row">
                        <td colspan="4">Scene Lights (Extracted)</td>
                      </tr>
                      ${a.map(n=>this._renderTableRow(n,e))}
                    `:""}

                    ${s.length>0?l`
                      <tr class="section-row">
                        <td colspan="4">Additional Entities (Manually Configured)</td>
                      </tr>
                      ${s.map(n=>this._renderTableRow(n,e))}
                    `:""}
                  </tbody>
                </table>
              `}
        </div>
      </div>
    `}_renderTableRow(t,e){const i=t.actual_on?"var(--success-color, #4caf50)":"color-mix(in srgb, var(--primary-text-color) 15%, transparent)";return l`
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
        <td style="text-align: center; font-weight: 500; vertical-align: top; padding-top: 10px;">${is(t.on,e)}</td>
        <td style="text-align: center; font-weight: 500; vertical-align: top; padding-top: 10px;">${is(t.brightness,e)}</td>
        <td style="text-align: center; font-weight: 500; vertical-align: top; padding-top: 10px;">${is(t.color,e)}</td>
      </tr>
    `}};Zt.styles=[Kt,P`
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
  `],he([p({attribute:!1})],Zt.prototype,"hass",2),he([p({type:String})],Zt.prototype,"activeSceneName",2),he([p({type:Boolean})],Zt.prototype,"noHeader",2),he([p({attribute:!1})],Zt.prototype,"runState",2),he([p({type:Array})],Zt.prototype,"entities",2),he([p({type:Boolean})],Zt.prototype,"manualOnly",2),he([m()],Zt.prototype,"_isDark",2),Zt=he([L("twilight-area-lights-card")],Zt);function aa(t,e){if(t.name&&t.name.trim())return t.name.trim();const i=t.entity_ids??[];if(i.length>0&&e){const a=i.map(o=>{var r,n;return((n=(r=e.states[o])==null?void 0:r.attributes)==null?void 0:n.friendly_name)??o});let s=a.join(", ");return s.length>35&&a.length>1&&(s=`${a[0]} + ${a.length-1} more`),s}return t.type==="illuminance"?"Illuminance Sensor":t.id}function oa(t){switch(t){case"min":return"Minimum";case"max":return"Maximum";case"mean":return"Average";case"median":return"Median";default:return"Minimum"}}class fi{constructor(e,i={}){this._prevOpen=!1,this.draft=null,this.draggedIndex=null,this._host=e,this._options=i,this._host.addController(this)}hostConnected(){}hostDisconnected(){}hostUpdate(){var e,i;this._host.open!==this._prevOpen&&(this._prevOpen=this._host.open,this._host.open?(this.draft=this._host.config?structuredClone(this._host.config):null,(i=(e=this._options).onOpen)==null||i.call(e),oi()):this.draft=null)}closeDiscard(){this._host.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}closeAndSave(e){this._host.dispatchEvent(e),this._host.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}onDragStart(e,i){this.draggedIndex=i,e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",String(i)))}onDragOver(e,i){if(e.preventDefault(),this.draggedIndex===null||this.draggedIndex===i||!Array.isArray(this.draft))return;const a=[...this.draft],s=a[this.draggedIndex];a.splice(this.draggedIndex,1),a.splice(i,0,s),this.draft=a,this.draggedIndex=i,this._host.requestUpdate()}onDragEnd(){this.draggedIndex=null}}var Lo=Object.defineProperty,jo=Object.getOwnPropertyDescriptor,ue=(t,e,i,a)=>{for(var s=a>1?void 0:a?jo(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Lo(e,i,s),s};let Jt=class extends ce{constructor(){super(...arguments),this.open=!1,this.hass=null,this.config=[],this.templateMode=!1,this._subEditOpen=!1,this._subEditingIndex=null,this._editDraft=null,this._draftController=new fi(this,{onOpen:()=>{this._subEditOpen=!1}})}_closeAndSave(){const t=this._draftController.draft??this.config;this._draftController.closeAndSave(new Pi([...t]))}_openAddSensor(){this._subEditingIndex=null,this._editDraft={id:"",name:void 0,type:"illuminance",entity_ids:[],aggregation:void 0},this._subEditOpen=!0}_openEditSensor(t){const e=this._draftController.draft;if(!e)return;const i=e[t];this._subEditingIndex=t,this._editDraft={id:i.id??"",name:i.name??void 0,type:i.type,entity_ids:i.entity_ids??[],aggregation:i.aggregation??void 0},this._subEditOpen=!0}_removeSensor(t){if(!this._draftController.draft)return;const e=[...this._draftController.draft];e.splice(t,1),this._draftController.draft=e,this.requestUpdate()}_saveSubEdit(){if(!this._editDraft||!this._draftController.draft)return;const t=[...this._draftController.draft],e=this._subEditingIndex;e===null?t.push(this._editDraft):t[e]=this._editDraft,this._draftController.draft=t,this._subEditOpen=!1,this._editDraft=null,this.requestUpdate()}render(){if(!this.open||!this._draftController.draft)return l``;const t=this._draftController.draft,e=t.some(i=>i.type==="illuminance");return l`
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
                ${t.map((i,a)=>{const s=i.entity_ids||[],o=oa(i.aggregation);return l`
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
                        <div style="font-weight: 600;">${aa(i,this.hass)}</div>
                        ${i.name&&i.id?l`<div style="font-size: 10px; font-family: monospace; opacity: 0.5;">${i.id}</div>`:""}
                      </td>
                      <td>
                        <span class="type-badge ${i.type}">${i.type}</span>
                      </td>
                      <td>
                        <div style="display: flex; flex-wrap: wrap; gap: 4px; align-items: center;">
                          ${s.length>0?s.map(r=>{var c,u,g;const n=this.templateMode?r:((g=(u=(c=this.hass)==null?void 0:c.states[r])==null?void 0:u.attributes)==null?void 0:g.friendly_name)??r;return l`<span class="pill">${n}</span>`}):l`<span style="opacity: 0.4;">—</span>`}
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
                ${t.length===0?l`
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
              ${e?l`
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
        ${this._subEditOpen&&this._editDraft?l`
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

              ${this.templateMode?"":l`
                <div class="form-field">
                  <label class="form-label">Entities</label>
                  <table class="entity-table">
                    <tbody>
                      ${(this._editDraft.entity_ids||[]).map((i,a)=>{var o,r,n;const s=this.templateMode?i:((n=(r=(o=this.hass)==null?void 0:o.states[i])==null?void 0:r.attributes)==null?void 0:n.friendly_name)??i;return l`
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
                      ${(this._editDraft.entity_ids||[]).length===0?l`
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
    `],ue([p({type:Boolean})],Jt.prototype,"open",2),ue([p({attribute:!1})],Jt.prototype,"hass",2),ue([p({attribute:!1})],Jt.prototype,"config",2),ue([p({type:Boolean})],Jt.prototype,"templateMode",2),ue([m()],Jt.prototype,"_subEditOpen",2),ue([m()],Jt.prototype,"_subEditingIndex",2),ue([m()],Jt.prototype,"_editDraft",2),Jt=ue([L("twilight-sensors-dialog")],Jt);var Ho=Object.defineProperty,Uo=Object.getOwnPropertyDescriptor,Xe=(t,e,i,a)=>{for(var s=a>1?void 0:a?Uo(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Ho(e,i,s),s};let $e=class extends B{constructor(){super(...arguments),this.hass=null,this.config=[],this.noHeader=!1,this.templateMode=!1}_openEdit(){this.dispatchEvent(new CustomEvent("open-edit",{bubbles:!0,composed:!0}))}render(){return l`
      <div class="devices-card">
        ${this.noHeader?"":l`
          <div class="devices-card-header">
            <span class="card-dot" style="--dot-color: #3b82f6;"></span>
            <span class="devices-card-title">Sensors</span>
            <button class="edit-btn" @click=${this._openEdit}>⋮</button>
          </div>
        `}
        <div class="entity-list">
          ${(this.config||[]).map((t,e)=>{const i=t.entity_ids||[],a=this.templateMode?i.length>0?i.join(", "):"Template Sensor (No Entities)":i.map(o=>{var r,n,c;return((c=(n=(r=this.hass)==null?void 0:r.states[o])==null?void 0:n.attributes)==null?void 0:c.friendly_name)??o}).join(", ")||"—",s=oa(t.aggregation||"min");return l`
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
              ${e<this.config.length-1?l`<div class="divider"></div>`:""}
            `})}
          ${!this.config||this.config.length===0?l`
            <div class="empty-state">No sensors configured. Click edit to configure.</div>
          `:""}
        </div>
      </div>
    `}};$e.styles=[Kt,P`
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
  `],Xe([p({attribute:!1})],$e.prototype,"hass",2),Xe([p({attribute:!1})],$e.prototype,"config",2),Xe([p({type:Boolean})],$e.prototype,"noHeader",2),Xe([p({type:Boolean})],$e.prototype,"templateMode",2),$e=Xe([L("twilight-sensors-card")],$e);function ss(t){return{auto_expire:(t==null?void 0:t.auto_expire)??"03:00:00",transition_off_seconds:(t==null?void 0:t.transition_off_seconds)??0}}function ra(t){const e=t.trim();if(e==="")return null;const i=e.split(":");if(i.length>3||!i.every(s=>/^\d+$/.test(s)))return null;const a=i.map(s=>parseInt(s,10));return a.length===1?a[0]:a.length===2?a[0]*60+a[1]:a[0]*3600+a[1]*60+a[2]}function Bo(t){const e=Math.floor(t/3600),i=Math.floor(t%3600/60),a=t%60,s=o=>String(o).padStart(2,"0");return`${s(e)}:${s(i)}:${s(a)}`}function Fo(t){const e=ra(t);return e===null?null:Bo(e)}function as(t){return t.trim()===""||ra(t)!==null}function na(t,e){const i=t??e;if(i==null)return"—";if(i==="00:00:00"||i===0||i==="0")return"0s";if(typeof i=="number"){if(i<0)return"0s";const s=Math.floor(i/3600),o=Math.floor(i%3600/60),r=Math.floor(i%60);let n="";return s>0&&(n+=`${s}h `),o>0&&(n+=`${o}m `),r>0&&(n+=`${r}s`),n.trim()||"0s"}const a=i.split(":");if(a.length===3){const s=parseInt(a[0],10),o=parseInt(a[1],10),r=parseInt(a[2],10);let n="";return s>0&&(n+=`${s}h `),o>0&&(n+=`${o}m `),r>0&&(n+=`${r}s`),n.trim()||"0s"}return i}function la(t){var i;const e=t==null?void 0:t.type;return e?e==="slot"?"slot":e==="block"?"block":e==="reset"?"reset":e==="simulation"?"simulation":e==="entity"?`entity: ${((t==null?void 0:t.entity_id)||"").split(".")[1]||(t==null?void 0:t.entity_id)||"—"}`:e==="light"?`lights: ${((i=t==null?void 0:t.targets)==null?void 0:i.length)??0}`:e:"—"}function da(t){const e=t==null?void 0:t.type;return e?e==="turn_off"?"turn off":e==="slot"?"restore slot":e==="none"?"nothing":e:"—"}function ca(t,e){var a;const i=e==null?void 0:e.find(s=>s.id===t);return((a=i==null?void 0:i.action)==null?void 0:a.type)??null}function pa(t){return!t||t.length===0?[{id:"sleep",suppress_inputs:[],auto_expire:null}]:t}function ha(t){var e;return t?((e=t.action)==null?void 0:e.type)==="slot":!1}function os(t){var e;return!t||((e=t.action)==null?void 0:e.type)==="reset"?!1:t.auto_expire_enabled!==!1}function rs(t){var e;return!t||((e=t.action)==null?void 0:e.type)==="reset"?!1:t.auto_expire_enabled===!1}function ua(t){var e;return t?((e=t.action)==null?void 0:e.type)!=="reset":!1}function ns(t){return t?ha(t)||os(t)||rs(t)||ua(t):!1}function fa(t,e){return!t.enabled&&t.auto_disabled_reason==="mismatch"}var Wo=Object.defineProperty,qo=Object.getOwnPropertyDescriptor,Wt=(t,e,i,a)=>{for(var s=a>1?void 0:a?qo(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Wo(e,i,s),s};let Tt=class extends B{constructor(){super(...arguments),this.open=!1,this.hass=null,this.input=null,this.editIndex=null,this.activities=[],this.activitiesConfig=[],this.rules=[],this.placeholderDefaults=null,this.templateMode=!1,this._editDraft=null}willUpdate(t){(t.has("open")||t.has("input"))&&(this.open&&this.input?this._editDraft={...this.input}:this.open||(this._editDraft=null))}_cancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}_canTargetRule(t){return t.type==="binary"||t.type==="button"&&t.button_mode==="toggle"}_isSaveDisabled(t){const e=!this.templateMode&&t.type!=="timer"&&t.type!=="button"&&(!t.entity_ids||t.entity_ids.length===0),i=t.type==="timer"&&!Vi(t.trigger_time??""),a=!t.activity&&!t.rule,s=!!t.rule&&!this._canTargetRule(t);return e||i||a||s}_save(){if(!this._editDraft||this._isSaveDisabled(this._editDraft))return;const t={...this._editDraft,enabled:this.templateMode?!0:this._editDraft.enabled};t.type==="timer"?(t.trigger_time=mo(t.trigger_time??"")??"00:00:00",delete t.entity_ids,delete t.aggregation,delete t.aggregation_count,delete t.retrigger,delete t.event_type,delete t.lux_threshold,delete t.lux_watch_window,delete t.lux_ignore_active,delete t.lux_ignore_scope,delete t.label,delete t.button_mode,delete t.create_entity):t.type==="button"?(delete t.entity_ids,delete t.aggregation,delete t.aggregation_count,delete t.retrigger,delete t.event_type,delete t.lux_threshold,delete t.lux_watch_window,delete t.lux_ignore_active,delete t.lux_ignore_scope):(delete t.trigger_time,delete t.label,delete t.button_mode,delete t.create_entity,t.type!=="event"&&delete t.event_type,t.type!=="motion"&&(delete t.lux_threshold,delete t.lux_watch_window,delete t.lux_ignore_active,delete t.lux_ignore_scope),t.type!=="motion"&&delete t.retrigger,t.type!=="binary"&&(delete t.aggregation,delete t.aggregation_count)),!t.name||!t.name.trim()?delete t.name:t.name=t.name.trim(),this.dispatchEvent(new CustomEvent("save",{detail:t,bubbles:!0,composed:!0}))}_getIncludeDomains(t){return t==="binary"?["input_boolean","binary_sensor","switch","sensor"]:t==="event"?["event"]:t==="motion"?["binary_sensor","device_tracker","sensor","input_boolean","switch"]:[]}render(){var r,n,c,u,g,f;if(!this.open||!this._editDraft)return l``;const t=this._editDraft,e=this.editIndex!==null,i=this._isSaveDisabled(t),a=this._getIncludeDomains(t.type),s=((r=t.entity_ids)==null?void 0:r[0])||"",o=t.type==="event"&&s&&((u=(c=(n=this.hass)==null?void 0:n.states[s])==null?void 0:c.attributes)==null?void 0:u.event_types)||[];return l`
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
                  @input=${d=>{const h=d.target.value;this._editDraft={...this._editDraft,name:h||void 0}}}
                />
              </div>

              ${this.templateMode?"":l`
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
                  <select class="option-select" .value=${t.type} @change=${d=>{var w;const h=d.target.value,b=h==="binary";this._editDraft={...this._editDraft,type:h,entity_ids:[],aggregation:void 0,aggregation_count:void 0,retrigger:void 0,event_type:void 0,lux_threshold:null,lux_watch_window:null,lux_ignore_active:null,lux_ignore_scope:null,trigger_time:"00:00:00",label:"",button_mode:"click",...(w=this._editDraft)!=null&&w.rule&&!b?{rule:null,activity:this.activities[0]??null}:{}}}}>
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
                    <select class="option-select" .value=${t.rule?"rule":"activity"} @change=${d=>{var b;if(d.target.value==="rule"){const w=((b=this.rules[0])==null?void 0:b.id)??"";this._editDraft={...this._editDraft,rule:w,activity:null}}else{const w=this.activities[0]??"";this._editDraft={...this._editDraft,activity:w,rule:null}}}}>
                      <option value="activity">Activity</option>
                      ${this._canTargetRule(t)?l`
                        <option value="rule" ?disabled=${(this.rules||[]).length===0}>Rule${(this.rules||[]).length===0?" (No rules)":""}</option>
                      `:""}
                    </select>
                  </div>

                  ${t.rule?l`
                    <div class="form-field">
                      <span class="form-label">Target Rule</span>
                      <select class="option-select" .value=${t.rule??""} @change=${d=>{this._editDraft={...this._editDraft,rule:d.target.value,activity:null}}}>
                        ${(this.rules||[]).map(d=>l`
                          <option value="${d.id}" ?selected=${d.id===t.rule}>${d.name||d.id}</option>
                        `)}
                      </select>
                    </div>
                  `:l`
                    <div class="form-field">
                      <span class="form-label">Target Activity</span>
                      <select class="option-select" @change=${d=>{this._editDraft={...this._editDraft,activity:d.target.value,rule:null}}}>
                        ${this.activities.map(d=>{const h=(this.activitiesConfig||[]).find(b=>b.id===d);return l`<option value="${d}" ?selected=${d===t.activity}>${(h==null?void 0:h.name)||(h==null?void 0:h.id)||d}</option>`})}
                      </select>
                    </div>
                  `}
                </div>
              </div>

              ${t.type==="timer"?l`
                <div class="form-field">
                  <span class="form-label">Trigger Time (HH:MM:SS)</span>
                  <input
                    type="text"
                    class="activity-input ${Vi(t.trigger_time??"")?"":"invalid"}"
                    .value=${t.trigger_time??"00:00:00"}
                    placeholder="22:00:00"
                    @input=${d=>{this._editDraft={...this._editDraft,trigger_time:d.target.value.trim()}}}
                  />
                  <span class="form-hint">Accepts <code>22</code>, <code>22:30</code> or <code>22:30:15</code> — saved as HH:MM:SS.</span>
                  ${Vi(t.trigger_time??"")?"":l`
                    <span class="form-error">Enter a time like 22, 22:30 or 22:30:15 (0–23h).</span>
                  `}
                </div>
              `:t.type==="button"?l`
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
                    <select class="option-select" .value=${t.button_mode??"click"} @change=${d=>{var b;const h=d.target.value;this._editDraft={...this._editDraft,button_mode:h,...(b=this._editDraft)!=null&&b.rule&&h==="click"?{rule:null,activity:this.activities[0]??null}:{}}}}>
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
              `:this.templateMode?"":l`
                <div class="form-field">
                  <span class="form-label">Entities</span>
                  <table class="sensor-table">
                    <tbody>
                      ${(t.entity_ids||[]).map((d,h)=>{var w,y,v;const b=((v=(y=(w=this.hass)==null?void 0:w.states[d])==null?void 0:y.attributes)==null?void 0:v.friendly_name)??d;return l`
                          <tr class="sensor-row">
                            <td style="padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                              <div style="font-weight: 500; font-size: 13px;">${b}</div>
                              <div style="font-size: 11px; color: var(--secondary-text-color); font-family: monospace;">${d}</div>
                            </td>
                            <td style="text-align: center; width: 40px; padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                              <button class="sensor-remove-btn" title="Remove entity" @click=${()=>{this._editDraft={...this._editDraft,entity_ids:(this._editDraft.entity_ids||[]).filter((_,C)=>C!==h)}}}>✕</button>
                            </td>
                          </tr>
                        `})}
                      ${!t.entity_ids||t.entity_ids.length===0?l`
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
                    @value-changed=${d=>{const h=d.detail.value;if(h){const b=this._editDraft.entity_ids||[];b.includes(h)||(this._editDraft={...this._editDraft,entity_ids:[...b,h]});const w=d.target;w&&(w.value="")}}}
                  ></ha-entity-picker>
                </div>
              `}

              ${t.type==="motion"?l`
                <div class="form-field" style="margin-top: 4px;">
                  <span class="form-label">Re-trigger</span>
                  <select class="option-select" .value=${t.retrigger??"every"} @change=${d=>{this._editDraft={...this._editDraft,retrigger:d.target.value||void 0}}}>
                    <option value="every">Every motion re-triggers the activity</option>
                    <option value="first">Only the first motion triggers the activity</option>
                  </select>
                  <span class="form-hint">Whether every motion re-triggers the activity, or only the first activation does.</span>
                </div>
              `:""}

              ${t.type==="binary"?l`
                <div class="form-field" style="margin-top: 4px;">
                  <span class="form-label">Combine multiple sensors</span>
                  <select class="option-select" .value=${t.aggregation??"any"} @change=${d=>{const h=d.target.value||void 0;this._editDraft={...this._editDraft,aggregation:h,aggregation_count:h!=="count"?void 0:this._editDraft.aggregation_count}}}>
                    <option value="any">Any (active if at least one is active)</option>
                    <option value="all">All (active only if all are active)</option>
                    <option value="count">Count (active if N or more are active)</option>
                  </select>
                  <span class="form-hint">How the states of multiple sensors combine into one active signal.</span>
                </div>

                ${t.aggregation==="count"?l`
                  <div class="form-field" style="margin-top: 4px;">
                    <span class="form-label">Required Active Entities (N)</span>
                    <input
                      type="number"
                      class="activity-input"
                      min="1"
                      .max=${String(Math.max(1,(t.entity_ids||[]).length))}
                      .value=${t.aggregation_count!=null?String(t.aggregation_count):"1"}
                      @input=${d=>{const h=d.target.value;this._editDraft={...this._editDraft,aggregation_count:h!==""?Number(h):1}}}
                    />
                  </div>
                `:""}
              `:""}

              ${t.type==="event"&&(t.entity_ids||[]).length>0?l`
                <div class="form-field">
                  <span class="form-label">Event Type (Optional)</span>
                  ${o.length>0?l`
                    <select class="option-select" @change=${d=>{this._editDraft={...this._editDraft,event_type:d.target.value||void 0}}}>
                      <option value="" ?selected=${!t.event_type}>All Events</option>
                      ${o.map(d=>l`
                        <option value="${d}" ?selected=${d===t.event_type}>${d}</option>
                      `)}
                    </select>
                  `:l`
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

              ${t.type==="motion"?l`
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                  <div class="form-field">
                    <span class="form-label">Lux Threshold (lx)</span>
                    <input
                      type="number"
                      class="activity-input"
                      .placeholder=${String(((g=this.placeholderDefaults)==null?void 0:g.lux_threshold)??30)}
                      .value=${t.lux_threshold!==null?String(t.lux_threshold):""}
                      @input=${d=>{const h=d.target.value;this._editDraft={...this._editDraft,lux_threshold:h!==""?Number(h):null}}}
                      min="0"
                    />
                  </div>

                  <div class="form-field">
                    <span class="form-label">Lux Watch (sec)</span>
                    <input
                      type="number"
                      class="activity-input"
                      .placeholder=${String(((f=this.placeholderDefaults)==null?void 0:f.lux_watch_window)??10)}
                      .value=${t.lux_watch_window!==null?String(t.lux_watch_window):""}
                      @input=${d=>{const h=d.target.value;this._editDraft={...this._editDraft,lux_watch_window:h!==""?Number(h):null}}}
                      min="0"
                    />
                  </div>
                </div>

                <div class="form-field" style="margin-top: 4px;">
                  <span class="form-label">Ignore lux when scene active</span>
                  <select class="option-select" .value=${String(t.lux_ignore_active)} @change=${d=>{const h=d.target.value;this._editDraft={...this._editDraft,lux_ignore_active:h==="true"}}}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div class="form-field" style="margin-top: 4px;">
                  <span class="form-label">Ignore lux during</span>
                  <select class="option-select" .value=${t.lux_ignore_scope??"none"} @change=${d=>{const h=d.target.value;this._editDraft={...this._editDraft,lux_ignore_scope:h}}}>
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
    `],Wt([p({type:Boolean})],Tt.prototype,"open",2),Wt([p({attribute:!1})],Tt.prototype,"hass",2),Wt([p({attribute:!1})],Tt.prototype,"input",2),Wt([p({type:Number})],Tt.prototype,"editIndex",2),Wt([p({type:Array})],Tt.prototype,"activities",2),Wt([p({attribute:!1})],Tt.prototype,"activitiesConfig",2),Wt([p({attribute:!1})],Tt.prototype,"rules",2),Wt([p({attribute:!1})],Tt.prototype,"placeholderDefaults",2),Wt([p({type:Boolean})],Tt.prototype,"templateMode",2),Wt([m()],Tt.prototype,"_editDraft",2),Tt=Wt([L("twilight-input-row-editor")],Tt);function Go(t){return{id:"",name:void 0,type:"binary",activity:t,enabled:!0,entity_ids:[],aggregation:void 0,aggregation_count:void 0,retrigger:void 0,trigger_time:"00:00:00",event_type:void 0,lux_threshold:null,lux_watch_window:null,lux_ignore_active:Bs,lux_ignore_scope:Fs,label:"",button_mode:"click",create_entity:!1}}var Vo=Object.defineProperty,Yo=Object.getOwnPropertyDescriptor,yt=(t,e,i,a)=>{for(var s=a>1?void 0:a?Yo(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Vo(e,i,s),s};let ct=class extends ce{constructor(){super(...arguments),this.open=!1,this.hass=null,this.config=[],this.activities=[],this.activitiesConfig=[],this.rulesConfig=[],this.placeholderDefaults=null,this.runState=null,this.templateMode=!1,this.areaId=null,this._subEditOpen=!1,this._subEditingIndex=null,this._subEditInput=null,this._dialog=new we(this),this._draftController=new fi(this,{onOpen:()=>{this._subEditOpen=!1}})}_closeDiscard(){this._draftController.closeDiscard()}_getRuleName(t){if(!t)return"None";const e=(this.rulesConfig||[]).find(i=>i.id===t);return(e==null?void 0:e.name)||(e==null?void 0:e.id)||t}_getActivityName(t){if(!t)return"None";const e=(this.activitiesConfig||[]).find(i=>i.id===t);return(e==null?void 0:e.name)||(e==null?void 0:e.id)||t}_closeAndSave(){this._draftController.closeAndSave(new Ni(this._draftController.draft||[]))}_openAddInput(){this._subEditingIndex=null,this._subEditInput=Go(this.activities[0]||""),this._subEditOpen=!0}_openEditInput(t){const e=this._draftController.draft;e&&(this._subEditingIndex=t,this._subEditInput={...e[t]},this._subEditOpen=!0)}_onSubEditSave(t){const e=this._draftController.draft;if(!e)return;const i=t.detail,a=this._subEditingIndex,s=a===null?[...e,i]:e.map((o,r)=>r===a?i:o);this._draftController.draft=s,this._subEditOpen=!1,this.requestUpdate()}_onSubEditCancel(){this._subEditOpen=!1}_onRemoveInput(t){const e=this._draftController.draft;e&&(this._draftController.draft=e.filter((i,a)=>a!==t),this.requestUpdate())}_getResolvedMotionInfo(t){return Gi(t,this.placeholderDefaults)}render(){if(!this.open||!this._draftController.draft)return l``;const t=this._draftController.draft;return l`
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
                ${t.map((e,i)=>{var f,d;let a=l`—`,s=l`—`;if(this.templateMode)if(e.type==="motion"){const h=this._getResolvedMotionInfo(e),b=ci(h);a=l`<div style="opacity: 0.7; font-size: 11px;">${b}</div>`}else e.type==="timer"?a=l`<div class="entity-id">Trigger Time: ${e.trigger_time??"00:00:00"}</div>`:e.type==="event"&&e.event_type?a=l`<div style="opacity: 0.7; font-size: 11px;">Event Type: ${e.event_type}</div>`:e.type==="button"&&(a=l`<div style="opacity: 0.7; font-size: 11px;">Mode: ${e.button_mode??"click"}</div>`);else if(e.type==="motion"){const{friendlyName:h,subText:b}=pi(e,this.hass??void 0);s=l`<div style="font-weight: 500; word-break: break-word;">${e.name||h}</div>`;const w=this._getResolvedMotionInfo(e),y=ci(w);a=l`
                        <div class="entity-id">${e.name?`${h} (${b})`:b}</div>
                        <div style="opacity: 0.7; font-size: 11px; margin-top: 2px;">${y}</div>
                      `}else if(e.type==="timer")s=l`<div style="font-weight: 500; word-break: break-word;">${e.name||"Daily Timer"}</div>`,a=l`<div class="entity-id">Trigger Time: ${e.trigger_time??"00:00:00"}</div>`;else if(e.type==="button")s=l`<div style="font-weight: 500; word-break: break-word;">${e.label||e.name||e.id}</div>`,a=l`<div style="opacity: 0.7; font-size: 11px;">Mode: ${e.button_mode??"click"}${e.create_entity?l` <ha-icon icon="mdi:home-assistant" style="--mdc-icon-size: 12px; vertical-align: middle;"></ha-icon>`:""}</div>`;else if(e.entity_ids&&e.entity_ids.length>0){const{friendlyName:h,subText:b}=pi(e,this.hass??void 0);s=l`<div style="font-weight: 500; word-break: break-word;">${e.name||h}</div>`;let w=b;e.type==="event"&&e.event_type&&(w+=` [event: ${e.event_type}]`),a=l`<div class="entity-id">${e.name?`${h} (${w})`:w}</div>`}const o=(d=(f=this.runState)==null?void 0:f.inputs)==null?void 0:d[e.id],r=(o==null?void 0:o.disabled_by)||[],n=!!(e.entity_ids&&e.entity_ids.length>0),c=new Set;!this.templateMode&&e.type!=="timer"&&e.type!=="button"&&!n&&c.add("no_entity"),e.enabled===!1&&c.add("user");for(const h of r)c.add(h);const u=Array.from(c),g=e.enabled===!1||!this.templateMode&&e.type!=="timer"&&e.type!=="button"&&!n||u.length>0;return l`
                    <tr
                      class="input-row ${this._draftController.draggedIndex===i?"dragging":""} ${g?"disabled":""}"
                      draggable="true"
                      @dragstart=${h=>this._draftController.onDragStart(h,i)}
                      @dragover=${h=>this._draftController.onDragOver(h,i)}
                      @dragend=${()=>this._draftController.onDragEnd()}
                    >
                      <td style="text-align: center; padding: 0 4px; vertical-align: middle;">
                        <div class="drag-handle" title="Drag to reorder">⋮⋮</div>
                      </td>
                      <td>
                        <div style="font-weight: 600;">${At(e,this.hass)}</div>
                        ${(e.name||e.label)&&e.id?l`<div style="font-size: 10px; font-family: monospace; opacity: 0.5;">${e.id}</div>`:""}
                      </td>
                      <td>
                        <div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-start;">
                          <span class="type-badge ${e.type}">${e.type}</span>
                          ${u.map(h=>{let b="user",w="Disabled";return h==="no_entity"?(b="no_entity",w="No Entity"):h.startsWith("activity:")&&(b="activity",w=`Suppressed: ${h.substring(9)}`),l`
                              <span class="status-badge ${b}">${w}</span>
                            `})}
                        </div>
                      </td>
                      <td>
                        ${s}
                        ${a}
                      </td>
                      <td>
                        ${e.rule?l`
                          <span class="pill" title="Targets Rule">${this._getRuleName(e.rule)}</span>
                        `:l`
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
                ${t.length===0?l`
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
    `}};ct.styles=[de,Et,P`
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
    `],yt([p({type:Boolean})],ct.prototype,"open",2),yt([p({attribute:!1})],ct.prototype,"hass",2),yt([p({attribute:!1})],ct.prototype,"config",2),yt([p({type:Array})],ct.prototype,"activities",2),yt([p({attribute:!1})],ct.prototype,"activitiesConfig",2),yt([p({attribute:!1})],ct.prototype,"rulesConfig",2),yt([p({attribute:!1})],ct.prototype,"placeholderDefaults",2),yt([p({attribute:!1})],ct.prototype,"runState",2),yt([p({type:Boolean})],ct.prototype,"templateMode",2),yt([p({type:String})],ct.prototype,"areaId",2),yt([m()],ct.prototype,"_subEditOpen",2),yt([m()],ct.prototype,"_subEditingIndex",2),yt([m()],ct.prototype,"_subEditInput",2),ct=yt([L("twilight-inputs-dialog")],ct);var Xo=Object.defineProperty,Ko=Object.getOwnPropertyDescriptor,Rt=(t,e,i,a)=>{for(var s=a>1?void 0:a?Ko(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Xo(e,i,s),s};let wt=class extends B{constructor(){super(...arguments),this.hass=null,this.config=[],this.activities=[],this.activitiesConfig=[],this.rulesConfig=[],this.noHeader=!1,this.placeholderDefaults=null,this.runState=null,this.templateMode=!1,this.areaId=null,this.editOpen=!1}_openEdit(){this.dispatchEvent(new CustomEvent("open-edit",{bubbles:!0,composed:!0}))}async _triggerButton(t,e){if(!this.hass||this.editOpen)return;const i=this.areaId;if(!i)return;const a={area_id:i,input_id:t.id};t.button_mode==="toggle"&&e!==void 0&&(a.active=e);try{await go(this.hass,a)}catch(s){console.error("[twilight] trigger_input failed",s)}}_renderManualTriggers(){const t=this.config.filter(e=>e.type==="button");return t.length===0?l``:l`
      <div style="padding: 10px 12px 4px; border-bottom: 1px solid rgba(255,255,255,0.08);">
        <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--secondary-text-color); margin-bottom: 8px;">Manual Triggers</div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; padding-bottom: 10px;">
          ${t.map(e=>{var n,c,u;const i=(c=(n=this.runState)==null?void 0:n.inputs)==null?void 0:c[e.id],a=(i==null?void 0:i.active)||!1,o=(((u=i==null?void 0:i.disabled_by)==null?void 0:u.filter(g=>g!=="no_entity"))||[]).length>0||this.editOpen,r=e.label||e.name||e.id;return e.button_mode==="toggle"?l`
                <button
                  class="manual-trigger-btn ${a?"active":""}"
                  ?disabled=${o}
                  title="${o?"Disabled":a?"Click to deactivate":"Click to activate"}"
                  @click=${()=>this._triggerButton(e,!a)}
                >
                  <span class="manual-trigger-icon">${"⏻"}</span>
                  ${r}
                  ${a?l`<span class="manual-trigger-dot"></span>`:""}
                </button>
              `:l`
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
    `}_getEntityDisplay(t){return pi(t,this.hass??void 0)}_getActivityActionType(t){return t?ca(t,this.activitiesConfig)??"none":"none"}_getActivityName(t){if(!t)return"";const e=(this.activitiesConfig||[]).find(i=>i.id===t);return(e==null?void 0:e.name)||(e==null?void 0:e.id)||t}_getRuleName(t){const e=(this.rulesConfig||[]).find(i=>i.id===t);return(e==null?void 0:e.name)||t}render(){return l`
      <div class="devices-card">
        ${this.noHeader?"":l`
          <div class="devices-card-header">
            <span class="card-dot" style="--dot-color: #10b981;"></span>
            <span class="devices-card-title">Inputs</span>
            <button class="edit-btn" @click=${this._openEdit}>⋮</button>
          </div>
        `}

        ${this._renderManualTriggers()}

        <div class="entity-list">
          ${this.config.map((t,e)=>{var g,f;const i=(f=(g=this.runState)==null?void 0:g.inputs)==null?void 0:f[t.id],a=(i==null?void 0:i.disabled_by)||[],s=this.templateMode||t.type==="button"?a.filter(d=>d!=="no_entity"):a,o=s.length>0,r=(i==null?void 0:i.active)||!1;let n="user";s.includes("no_entity")?n="no_entity":s.some(d=>d.startsWith("activity:"))?n="activity":s.some(d=>d.startsWith("rule:"))&&(n="rule");let c=l`—`,u=l`—`;if(this.templateMode){const d=At(t,this.hass);if(c=l`<span class="entity-name">${d}</span>`,t.type==="motion"){const h=Gi(t,this.placeholderDefaults),b=ci(h);u=l`<span class="entity-id" style="margin-top: 2px; font-family: inherit;">${b}</span>`}else t.type==="timer"?u=l`<span class="entity-id">Trigger Time: ${t.trigger_time??"00:00:00"}</span>`:t.type==="event"?t.event_type&&(u=l`<span class="entity-id">Event Type: ${t.event_type}</span>`):t.type==="button"&&(u=l`<span class="entity-id">Mode: ${t.button_mode??"click"}</span>`)}else if(t.type==="motion"){const{friendlyName:d,subText:h}=this._getEntityDisplay(t);c=l`<span class="entity-name">${t.name||d}</span>`;const b=Gi(t,this.placeholderDefaults),w=ci(b);u=l`
                  <span class="entity-id" style="font-family: monospace;">${t.name?`${d} (${h})`:h}</span>
                  <span class="entity-id" style="margin-top: 2px; font-family: inherit;">${w}</span>
                `}else if(t.type==="timer")c=l`<span class="entity-name">${t.name||"Daily Timer"}</span>`,u=l`
                  <span class="entity-id">Trigger Time: ${t.trigger_time??"00:00:00"}</span>
                `;else if(t.type==="button")c=l`<span class="entity-name">${t.name||t.label||"Button"}</span>`,u=l`<span class="entity-id">Mode: ${t.button_mode??"click"}${t.create_entity?l` <ha-icon icon="mdi:home-assistant" style="--mdc-icon-size: 12px; vertical-align: middle;"></ha-icon>`:""}</span>`;else{const{friendlyName:d,subText:h}=this._getEntityDisplay(t);c=l`<span class="entity-name">${t.name||d}</span>`;let b="";t.type==="event"&&t.event_type&&(b=` [event: ${t.event_type}]`),u=l`
                  <span class="entity-id">${t.name?`${d} (${h})`:h}${b}</span>
                `}return l`
              <div class="entity-row ${o?"disabled":""}">
                <span class="type-badge ${t.type}">${t.type}</span>
                <div class="entity-name-wrap">
                  ${c}
                  ${u}
                </div>
                ${r?l`<span class="active-indicator" title="Sensor active"></span>`:""}
                ${t.rule?l`
                  <span class="activity-badge rule" title="Targets Rule">${this._getRuleName(t.rule)}</span>
                `:t.activity?l`
                  <span class="activity-badge ${this._getActivityActionType(t.activity)}">${this._getActivityName(t.activity)}</span>
                `:l`
                  <span class="activity-badge none">None</span>
                `}
                ${o?l`
                  <div class="disabled-overlay">
                    <span class="disabler-badge ${n}">
                      ${_o(s,this.rulesConfig,this.activitiesConfig)}
                    </span>
                  </div>
                `:""}
              </div>
              ${e<this.config.length-1?l`<div class="divider"></div>`:""}
            `})}
          ${this.config.length===0?l`
            <div class="empty-state">No inputs configured. Click edit to configure.</div>
          `:""}
        </div>
      </div>
    `}};wt.styles=[de,Kt,P`
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
    `],Rt([p({attribute:!1})],wt.prototype,"hass",2),Rt([p({attribute:!1})],wt.prototype,"config",2),Rt([p({type:Array})],wt.prototype,"activities",2),Rt([p({attribute:!1})],wt.prototype,"activitiesConfig",2),Rt([p({attribute:!1})],wt.prototype,"rulesConfig",2),Rt([p({type:Boolean})],wt.prototype,"noHeader",2),Rt([p({attribute:!1})],wt.prototype,"placeholderDefaults",2),Rt([p({attribute:!1})],wt.prototype,"runState",2),Rt([p({type:Boolean})],wt.prototype,"templateMode",2),Rt([p({type:String})],wt.prototype,"areaId",2),Rt([p({type:Boolean})],wt.prototype,"editOpen",2),wt=Rt([L("twilight-inputs-card")],wt);var Zo=Object.defineProperty,Jo=Object.getOwnPropertyDescriptor,gi=(t,e,i,a)=>{for(var s=a>1?void 0:a?Jo(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Zo(e,i,s),s};let Pe=class extends B{constructor(){super(...arguments),this.channels={},this.excludedSlotIds={},this._expandedNodes={}}get _nodes(){return li(this.channels).map(e=>{var i,a;return{id:e,label:((i=this.channels[e])==null?void 0:i.name)||e,children:(((a=this.channels[e])==null?void 0:a.slots)??[]).map(s=>({id:s.id,label:s.name||s.id}))}})}_isExcluded(t,e){return(this.excludedSlotIds[t]??[]).includes(e)}_isChannelIndeterminate(t){if(t.children.length===0)return!1;const e=t.children.filter(i=>this._isExcluded(t.id,i.id)).length;return e>0&&e<t.children.length}_isChannelFullyExcluded(t){return t.children.length>0&&t.children.every(e=>this._isExcluded(t.id,e.id))}_setChannelExcluded(t,e,i){const a={...this.excludedSlotIds};a[t]=i?e:[],this._emit(a)}_setSlotExcluded(t,e,i){const a=new Set(this.excludedSlotIds[t]??[]);i?a.add(e):a.delete(e);const s={...this.excludedSlotIds,[t]:[...a]};this._emit(s)}_emit(t){this.excludedSlotIds=t,this.dispatchEvent(new CustomEvent("excluded-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_toggleExpanded(t){this._expandedNodes={...this._expandedNodes,[t]:!this._expandedNodes[t]}}render(){const t=this._nodes;return t.length===0?l``:l`
      <p class="hint">Unchecked channels/slots are excluded: while this activity is active and one of its excluded slots is current, that channel is turned off instead of following the schedule.</p>
      <div class="tree">
        ${t.map(e=>{const i=!!this._expandedNodes[e.id],a=this._isChannelFullyExcluded(e);return l`
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

              ${i?l`
                <div class="tree-node-children">
                  ${e.children.map(s=>l`
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
    `}};Pe.styles=P`
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
      width: 20px;
      height: 20px;
      font-size: 18px;
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
  `,gi([p({attribute:!1})],Pe.prototype,"channels",2),gi([p({attribute:!1})],Pe.prototype,"excludedSlotIds",2),gi([m()],Pe.prototype,"_expandedNodes",2),Pe=gi([L("twilight-slot-action-tree")],Pe);var Qo=Object.defineProperty,tr=Object.getOwnPropertyDescriptor,Lt=(t,e,i,a)=>{for(var s=a>1?void 0:a?tr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Qo(e,i,s),s};function ie(t,e){return t===e}const ga={input_boolean:[{value:"on",label:"On"},{value:"off",label:"Off"},{value:"toggle",label:"Toggle"}],switch:[{value:"on",label:"On"},{value:"off",label:"Off"},{value:"toggle",label:"Toggle"}],script:[{value:"activate",label:"Activate"}]};function er(){return{id:"",name:"",suppress_inputs:[],auto_expire_enabled:!0,auto_expire:null,action_type:"slot",action_entity_id:"",action_targets:[],action_target_picker_value:"",action_state:"on",action_brightness:255,action_color_temp:370,action_entity_targets:[],action_excluded_slots:{},action_sim_template_activity:"",action_sim_lux_mode:"dusk_dawn",action_sim_frequency_mode:"normal",action_sim_heatmap_profile_id:"",release_action_type:"",transition_off_seconds:null}}function ir(t){const e=t.action,i=t.release_action;return{id:t.id,name:t.name??"",suppress_inputs:[...t.suppress_inputs??[]],auto_expire_enabled:t.auto_expire_enabled!==!1,auto_expire:t.auto_expire??null,action_type:(e==null?void 0:e.type)??"",action_entity_id:(e==null?void 0:e.entity_id)??"",action_targets:(e==null?void 0:e.targets)??[],action_target_picker_value:"",action_state:(e==null?void 0:e.state)??"on",action_brightness:(e==null?void 0:e.brightness)??255,action_color_temp:(e==null?void 0:e.color_temp)??370,action_entity_targets:[...(e==null?void 0:e.entity_targets)??[]],action_excluded_slots:{...(e==null?void 0:e.excluded_slots)??{}},action_sim_template_activity:(e==null?void 0:e.template_activity)??"",action_sim_lux_mode:(e==null?void 0:e.lux_mode)??"dusk_dawn",action_sim_frequency_mode:(e==null?void 0:e.frequency_mode)??"normal",action_sim_heatmap_profile_id:(e==null?void 0:e.heatmap_profile_id)??"",release_action_type:(i==null?void 0:i.type)??"",transition_off_seconds:t.transition_off_seconds??null}}let $t=class extends B{constructor(){super(...arguments),this.open=!1,this.hass=null,this.activity=null,this.editIndex=null,this.inputs=[],this.placeholderDefaults=null,this.channels={},this.existingIds=[],this.allActivities=[],this.heatmapProfiles=[],this._editDraft=null}willUpdate(t){(t.has("open")||t.has("activity"))&&(this.open&&this.activity?this._editDraft=this.editIndex===null&&this.activity.id===""?er():ir(this.activity):this.open||(this._editDraft=null))}_getFallbackActivityInfo(){return ss(this.placeholderDefaults)}_eligibleTemplateActivities(){var e;const t=(e=this._editDraft)==null?void 0:e.id.trim().toLowerCase();return this.allActivities.filter(i=>{var s;if(i.id===t)return!1;const a=((s=i.action)==null?void 0:s.type)??"slot";return a==="slot"||a==="entity"||a==="light"})}_cancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}_isSaveDisabled(t){const e=!!(t.name.trim()||t.id.trim()),i=t.auto_expire_enabled&&t.auto_expire!==null&&!as(t.auto_expire);return!e||i}_save(){if(!this._editDraft)return;let t=this._editDraft.id.trim().toLowerCase();const e=this._editDraft.name.trim()||void 0;t||(t=`activity_${Array.from({length:8},()=>Math.floor(Math.random()*16).toString(16)).join("")}`);const i=this._editDraft.action_type===""?null:this._editDraft.action_type,a={type:i};i==="entity"?a.entity_id=this._editDraft.action_entity_id:i==="light"?(a.targets=this._editDraft.action_targets,a.state=this._editDraft.action_state,this._editDraft.action_state==="on"&&(a.brightness=this._editDraft.action_brightness,this._editDraft.action_color_temp>0&&(a.color_temp=this._editDraft.action_color_temp))):i==="reset"?this._editDraft.action_entity_targets.length>0&&(a.entity_targets=this._editDraft.action_entity_targets):i==="simulation"?(a.mode="presence_heatmap",a.template_activity=this._editDraft.action_sim_template_activity,a.lux_mode=this._editDraft.action_sim_lux_mode,a.frequency_mode=this._editDraft.action_sim_frequency_mode||"normal",this._editDraft.action_sim_heatmap_profile_id&&(a.heatmap_profile_id=this._editDraft.action_sim_heatmap_profile_id)):i==="slot"&&Object.values(this._editDraft.action_excluded_slots).some(c=>c.length>0)&&(a.excluded_slots=this._editDraft.action_excluded_slots);const o={type:i==="reset"?"none":this._editDraft.release_action_type===""?null:this._editDraft.release_action_type},r=this._editDraft.auto_expire===null?null:Fo(this._editDraft.auto_expire),n={id:t,name:e,suppress_inputs:i==="reset"?[]:this._editDraft.suppress_inputs,auto_expire_enabled:i==="reset"?!1:this._editDraft.auto_expire_enabled,auto_expire:i==="reset"?null:r,transition_off_seconds:i==="block"||i==="reset"?null:this._editDraft.transition_off_seconds,action:a,release_action:o};this.dispatchEvent(new CustomEvent("save",{detail:n,bubbles:!0,composed:!0}))}render(){if(!this.open||!this._editDraft)return l``;const t=this._editDraft,e=this.editIndex!==null,i=this._isSaveDisabled(t),a=this._getFallbackActivityInfo(),s=String(t.action_type);return l`
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
                    .value=${t.action_type||"slot"}
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

                ${ie(s,"slot")?l`
                  <div class="form-field">
                    <span class="form-label">Channels / Slots</span>
                    <twilight-slot-action-tree
                      .channels=${this.channels}
                      .excludedSlotIds=${t.action_excluded_slots}
                      @excluded-changed=${o=>{this._editDraft={...this._editDraft,action_excluded_slots:o.detail.value}}}
                    ></twilight-slot-action-tree>
                  </div>
                `:""}

                ${ie(s,"entity")?l`
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

                ${ie(s,"light")?l`
                  <div class="form-field">
                    <span class="form-label">Target Lights</span>
                    <ha-entity-picker
                      .hass=${this.hass}
                      .value=${t.action_target_picker_value}
                      .includeDomains=${["light"]}
                      allow-custom-entity
                      placeholder="Select light to add..."
                      @value-changed=${o=>{const r=o.detail.value,n=this._editDraft.action_targets,c=r&&!n.includes(r)?[...n,r]:n;this._editDraft={...this._editDraft,action_targets:c,action_target_picker_value:""}}}
                    ></ha-entity-picker>
                    <div class="checkbox-list" style="margin-top: 8px;">
                      ${t.action_targets.map(o=>l`
                        <div class="checkbox-item" style="justify-content: space-between;">
                          <span>${o}</span>
                          <button class="row-action-btn remove" style="padding: 2px 6px;" @click=${()=>{this._editDraft={...this._editDraft,action_targets:this._editDraft.action_targets.filter(r=>r!==o)}}}>✕</button>
                        </div>
                      `)}
                      ${t.action_targets.length===0?l`<div style="font-style: italic; opacity: 0.4; font-size: 11px;">No lights selected</div>`:""}
                    </div>
                  </div>

                  <div class="form-field">
                    <span class="form-label">State</span>
                    <select class="option-select" .value=${t.action_state} @change=${o=>{this._editDraft={...this._editDraft,action_state:o.target.value}}}>
                      <option value="on">On</option>
                      <option value="off">Off</option>
                    </select>
                  </div>

                  ${t.action_state==="on"?l`
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

                ${ie(s,"reset")?l`
                  <div class="form-field">
                    <span class="form-label">Additional Entities</span>
                    <table class="sensor-table">
                      <tbody>
                        ${t.action_entity_targets.map((o,r)=>{var g,f,d;const n=o.entity_id.split(".")[0],c=ga[n]??[],u=((d=(f=(g=this.hass)==null?void 0:g.states[o.entity_id])==null?void 0:f.attributes)==null?void 0:d.friendly_name)??o.entity_id;return l`
                            <tr class="sensor-row">
                              <td style="padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                                <div style="font-weight: 500; font-size: 13px;">${u}</div>
                                <div style="font-size: 11px; color: var(--secondary-text-color); font-family: monospace;">${o.entity_id}</div>
                              </td>
                              <td style="text-align: right; width: 170px; padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                                <select
                                  class="option-select"
                                  style="width: 100%; min-width: 0;"
                                  @change=${h=>{const b=[...this._editDraft.action_entity_targets];b[r]={...o,action:h.target.value},this._editDraft={...this._editDraft,action_entity_targets:b}}}
                                >
                                  ${c.map(h=>l`<option value=${h.value} ?selected=${h.value===o.action}>${h.label}</option>`)}
                                </select>
                              </td>
                              <td style="text-align: center; width: 40px; padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                                <button class="sensor-remove-btn" title="Remove entity" @click=${()=>{this._editDraft={...this._editDraft,action_entity_targets:this._editDraft.action_entity_targets.filter((h,b)=>b!==r)}}}>✕</button>
                              </td>
                            </tr>
                          `})}
                        ${t.action_entity_targets.length===0?l`
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
                      @value-changed=${o=>{var n,c;const r=o.detail.value;if(r){const u=this._editDraft.action_entity_targets;if(!u.some(f=>f.entity_id===r)){const f=r.split(".")[0],d=((c=(n=ga[f])==null?void 0:n[0])==null?void 0:c.value)??"off";this._editDraft={...this._editDraft,action_entity_targets:[...u,{entity_id:r,action:d}]}}const g=o.target;g&&(g.value="")}}}
                    ></ha-entity-picker>
                  </div>
                `:""}

                ${ie(s,"simulation")?l`
                  <div class="form-field">
                    <span class="form-label">Template Activity</span>
                    <select
                      class="option-select"
                      .value=${t.action_sim_template_activity}
                      @change=${o=>{this._editDraft={...this._editDraft,action_sim_template_activity:o.target.value}}}
                    >
                      <option value="">Select activity…</option>
                      ${this._eligibleTemplateActivities().map(o=>l`
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
                      ${this.heatmapProfiles.map(o=>l`
                        <option value=${o.id} ?selected=${o.id===t.action_sim_heatmap_profile_id}>${o.name}</option>
                      `)}
                    </select>
                  </div>

                  <div class="form-field">
                    <span class="form-label">Simulation Intensity</span>
                    <select
                      class="option-select"
                      .value=${t.action_sim_frequency_mode||"normal"}
                      @change=${o=>{this._editDraft={...this._editDraft,action_sim_frequency_mode:o.target.value}}}
                    >
                      <option value="very_low">Very Subtle (25% of history)</option>
                      <option value="low">Subtle (50% of history)</option>
                      <option value="normal">Normal (100% of history)</option>
                      <option value="high">Active (200% of history)</option>
                      <option value="very_high">Very Active (400% of history)</option>
                    </select>
                    <span class="form-hint">Scales the simulated light activation probability relative to historical motion density.</span>
                  </div>

                  <div class="form-field">
                    <span class="form-label">Lux Mode</span>
                    <select
                      class="option-select"
                      .value=${t.action_sim_lux_mode}
                      @change=${o=>{this._editDraft={...this._editDraft,action_sim_lux_mode:o.target.value}}}
                    >
                      <option value="threshold">Lux threshold</option>
                      <option value="dusk_dawn">Only dusk–dawn</option>
                      <option value="always">Always</option>
                    </select>
                  </div>
                `:""}

                ${ie(s,"reset")?"":l`
                  <div class="form-field">
                    <span class="form-label">Release Action</span>
                    <select
                      class="option-select"
                      .value=${t.release_action_type||"none"}
                      @change=${o=>{this._editDraft={...this._editDraft,release_action_type:o.target.value}}}
                    >
                      <option value="turn_off">Turn Off</option>
                      <option value="slot">Restore Slot</option>
                      <option value="none">Nothing</option>
                    </select>
                  </div>
                `}
              </div>

              ${ie(s,"reset")?"":l`
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  <div class="list-section-label">Timing</div>

                  <div class="form-field">
                    <label class="checkbox-item">
                      <input
                        type="checkbox"
                        ?checked=${t.auto_expire_enabled}
                        @change=${o=>{const r=o.target.checked;this._editDraft={...this._editDraft,auto_expire_enabled:r,...r?{}:{auto_expire:null}}}}
                      />
                      <span>Enable Auto-Expire</span>
                    </label>
                  </div>

                  <div class="form-field">
                    <span class="form-label">Auto-Expire Duration (HH:MM:SS)</span>
                    <input
                      type="text"
                      class="activity-input ${t.auto_expire!==null&&!as(t.auto_expire)?"invalid":""}"
                      ?disabled=${!t.auto_expire_enabled}
                      .value=${t.auto_expire??""}
                      .placeholder=${a.auto_expire}
                      @input=${o=>{this._editDraft={...this._editDraft,auto_expire:o.target.value.trim()||null}}}
                    />
                    <span class="form-hint">Accepts seconds (<code>90</code>), <code>M:SS</code> (<code>5:30</code>) or <code>H:MM:SS</code> — saved as HH:MM:SS.</span>
                    ${t.auto_expire!==null&&!as(t.auto_expire)?l`
                      <span class="form-error">Enter a duration like 90, 5:30 or 1:02:03.</span>
                    `:""}
                  </div>

                  ${!ie(s,"block")&&!ie(s,"reset")?l`
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
                      ${this.inputs.map(o=>{const r=t.suppress_inputs.includes(o.id);return l`
                          <label class="checkbox-item">
                            <input
                              type="checkbox"
                              ?checked=${r}
                              @change=${n=>{const c=n.target.checked,u=this._editDraft.suppress_inputs,g=c?[...u,o.id]:u.filter(f=>f!==o.id);this._editDraft={...this._editDraft,suppress_inputs:g}}}
                            />
                            <span>${At(o,this.hass)} (${o.type})</span>
                          </label>
                        `})}
                      ${this.inputs.length===0?l`<div style="font-style: italic; opacity: 0.4; font-size: 11px;">No inputs configured</div>`:""}
                    </div>
                  </div>
                </div>
              `}
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
    `],Lt([p({type:Boolean})],$t.prototype,"open",2),Lt([p({attribute:!1})],$t.prototype,"hass",2),Lt([p({attribute:!1})],$t.prototype,"activity",2),Lt([p({type:Number})],$t.prototype,"editIndex",2),Lt([p({attribute:!1})],$t.prototype,"inputs",2),Lt([p({attribute:!1})],$t.prototype,"placeholderDefaults",2),Lt([p({attribute:!1})],$t.prototype,"channels",2),Lt([p({type:Array})],$t.prototype,"existingIds",2),Lt([p({attribute:!1})],$t.prototype,"allActivities",2),Lt([p({attribute:!1})],$t.prototype,"heatmapProfiles",2),Lt([m()],$t.prototype,"_editDraft",2),$t=Lt([L("twilight-activity-row-editor")],$t);var sr=Object.defineProperty,ar=Object.getOwnPropertyDescriptor,jt=(t,e,i,a)=>{for(var s=a>1?void 0:a?ar(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&sr(e,i,s),s};let Ct=class extends ce{constructor(){super(...arguments),this.open=!1,this.hass=null,this.config=[],this.inputs=[],this.placeholderDefaults=null,this.templateMode=!1,this.channels={},this.heatmapProfiles=[],this._subEditOpen=!1,this._subEditingIndex=null,this._subEditActivity=null,this._dialog=new we(this),this._draftController=new fi(this,{onOpen:()=>{this._subEditOpen=!1}})}_closeDiscard(){this._draftController.closeDiscard()}_closeAndSave(){this._draftController.closeAndSave(new Ri({activities:this._draftController.draft||[]}))}_getFallbackActivityInfo(){return ss(this.placeholderDefaults)}_openAddActivity(){this._subEditingIndex=null,this._subEditActivity={id:""},this._subEditOpen=!0}_openEditActivity(t){const e=this._draftController.draft;e&&(this._subEditingIndex=t,this._subEditActivity=e[t],this._subEditOpen=!0)}async _onSubEditSave(t){const e=this._draftController.draft;if(!e)return;const i=t.detail;if(this._subEditingIndex===null){const a=i.id;if(!/^[a-z0-9_-]+$/.test(a)){await this._dialog.showAlert("Invalid Name","Activity name must contain only lowercase letters, numbers, hyphens and underscores.");return}if(e.some(s=>s.id===a)){await this._dialog.showAlert("Duplicate Name","This activity name already exists!");return}this._draftController.draft=[...e,i]}else{const a=this._subEditingIndex,s=[...e];s[a]=i,this._draftController.draft=s}this._subEditOpen=!1,this.requestUpdate()}_onSubEditCancel(){this._subEditOpen=!1}_onRemoveActivity(t){const e=this._draftController.draft;e&&(this._draftController.draft=e.filter((i,a)=>a!==t),this.requestUpdate())}render(){if(!this.open||!this._draftController.draft)return l``;const t=this._draftController.draft;return l`
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
                  ${t.map((e,i)=>{var n,c;const a=this._getFallbackActivityInfo(),s=((n=e.action)==null?void 0:n.type)==="reset",r=(this.inputs||[]).filter(u=>u.activity===e.id).map(u=>At(u,this.hass));return l`
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
                          ${e.name&&e.id?l`<div style="font-size: 10px; font-family: monospace; opacity: 0.5;">${e.id}</div>`:""}
                        </td>
                        <td style="color: var(--primary-text-color);">
                          ${r.length>0?r.map(u=>l`<span class="pill" style="margin-right: 4px;">${u}</span>`):l`<span style="opacity:0.4">—</span>`}
                        </td>
                        <td style="color: var(--primary-text-color);">
                          ${la(e.action)}
                        </td>
                        <td style="color: var(--primary-text-color);">
                          ${s?"—":da(e.release_action)}
                        </td>
                        <td style="color: var(--primary-text-color);">
                          ${(c=e.suppress_inputs)!=null&&c.length?e.suppress_inputs.map(u=>{const g=this.inputs.find(f=>f.id===u);return l`<span class="pill" style="margin-right: 4px;">${g?At(g,this.hass):u}</span>`}):l`<span style="opacity:0.4">—</span>`}
                        </td>
                        <td style="color: var(--primary-text-color);">${s?"—":e.auto_expire_enabled===!1?"none":na(e.auto_expire,a.auto_expire)}</td>
                        <td style="text-align: center;">
                          <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <button class="row-action-btn edit" title="Edit activity" @click=${()=>this._openEditActivity(i)}>✏️</button>
                            <button class="row-action-btn remove" title="Remove activity" @click=${()=>this._onRemoveActivity(i)}>✕</button>
                          </div>
                        </td>
                      </tr>
                    `})}
                  ${t.length===0?l`
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
    `],jt([p({type:Boolean})],Ct.prototype,"open",2),jt([p({attribute:!1})],Ct.prototype,"hass",2),jt([p({attribute:!1})],Ct.prototype,"config",2),jt([p({attribute:!1})],Ct.prototype,"inputs",2),jt([p({attribute:!1})],Ct.prototype,"placeholderDefaults",2),jt([p({type:Boolean})],Ct.prototype,"templateMode",2),jt([p({attribute:!1})],Ct.prototype,"channels",2),jt([p({attribute:!1})],Ct.prototype,"heatmapProfiles",2),jt([m()],Ct.prototype,"_subEditOpen",2),jt([m()],Ct.prototype,"_subEditingIndex",2),jt([m()],Ct.prototype,"_subEditActivity",2),Ct=jt([L("twilight-activities-dialog")],Ct);var or=Object.defineProperty,rr=Object.getOwnPropertyDescriptor,se=(t,e,i,a)=>{for(var s=a>1?void 0:a?rr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&or(e,i,s),s};let qt=class extends B{constructor(){super(...arguments),this.hass=null,this.config=[],this.inputs=[],this.noHeader=!1,this.placeholderDefaults=null,this.templateMode=!1,this.channels={},this.heatmapProfiles=[]}_openEdit(){this.dispatchEvent(new CustomEvent("open-edit",{bubbles:!0,composed:!0}))}render(){return l`
      <div class="devices-card">
        ${this.noHeader?"":l`
          <div class="devices-card-header">
            <span class="card-dot" style="--dot-color: #a855f7;"></span>
            <span class="devices-card-title">Activities</span>
            <button class="edit-btn" @click=${this._openEdit}>⋮</button>
          </div>
        `}

        <div class="entity-list">
          ${this.config.map((t,e)=>{var f,d;const i=ss(this.placeholderDefaults),a=((f=t.action)==null?void 0:f.type)==="reset",s=la(t.action),o=t.auto_expire_enabled===!1?"none":na(t.auto_expire,i.auto_expire),r=a?"—":da(t.release_action),n=(d=t.suppress_inputs)!=null&&d.length?t.suppress_inputs.map(h=>{const b=this.inputs.find(w=>w.id===h);return b?At(b,this.hass):h}).join(", "):"none",c=(this.inputs||[]).filter(h=>h.activity===t.id),u=c.length>0?c.map(h=>At(h,this.hass)).join(", "):"none",g=a?`Triggers: ${u} · Action: ${s}`:`Triggers: ${u} · Action: ${s} · Auto-expire: ${o} · Release: ${r} · Suppresses: ${n}`;return l`
              <div class="activity-row">
                <span class="activity-badge ${ca(t.id,this.config)??"none"}">${t.name||t.id}</span>
                <div class="activity-desc">
                  <div style="font-weight: 600;">${t.name||t.id}</div>
                  <div style="font-size: 11px; color: var(--secondary-text-color); margin-top: 2px;">
                    ${g}
                  </div>
                </div>
              </div>
              ${e<this.config.length-1?l`<div class="divider"></div>`:""}
            `})}
          ${this.config.length===0?l`
            <div style="padding:20px; text-align:center; color: var(--secondary-text-color); font-style:italic;">
              No custom activities configured
            </div>
          `:""}
        </div>
      </div>
    `}};qt.styles=[de,Kt,P`
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
    `],se([p({attribute:!1})],qt.prototype,"hass",2),se([p({attribute:!1})],qt.prototype,"config",2),se([p({attribute:!1})],qt.prototype,"inputs",2),se([p({type:Boolean})],qt.prototype,"noHeader",2),se([p({attribute:!1})],qt.prototype,"placeholderDefaults",2),se([p({type:Boolean})],qt.prototype,"templateMode",2),se([p({attribute:!1})],qt.prototype,"channels",2),se([p({attribute:!1})],qt.prototype,"heatmapProfiles",2),qt=se([L("twilight-activities-card")],qt);var nr=Object.defineProperty,lr=Object.getOwnPropertyDescriptor,fe=(t,e,i,a)=>{for(var s=a>1?void 0:a?lr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&nr(e,i,s),s};let Qt=class extends B{constructor(){super(...arguments),this.hass=null,this.rules=[],this.inputsConfig=[],this.activitiesConfig=[],this.runState=null,this.channels={},this.noHeader=!1}_openEdit(){this.dispatchEvent(new CustomEvent("open-edit",{bubbles:!0,composed:!0}))}render(){var e;const t=((e=this.runState)==null?void 0:e.active_rules)||{};return l`
      <div class="devices-card">
        ${this.noHeader?"":l`
          <div class="devices-card-header">
            <span class="card-dot" style="--dot-color: #ef4444;"></span>
            <span class="devices-card-title">Rules</span>
            <button class="edit-btn" @click=${this._openEdit}>⋮</button>
          </div>
        `}

        <div class="entity-list">
          ${this.rules.map((i,a)=>{const s=!!t[i.id],o=!i.enabled,r=fa(i,this.activitiesConfig||[]),n=(this.inputsConfig||[]).filter(f=>f.rule===i.id),c=n.length>0?n.map(f=>At(f,this.hass)).join(", "):"none",g=`Target: ${(i.applied_activities||[]).length>0?i.applied_activities.map(f=>{const d=(this.activitiesConfig||[]).find(h=>h.id===f);return(d==null?void 0:d.name)||(d==null?void 0:d.id)||f}).join(", "):"All"} · Triggers: ${c} · Status: ${i.enabled?"Enabled":"Disabled"}`;return l`
              <div class="activity-row ${o?"disabled":""}">
                <span class="status-indicator ${s?"active":""}" title="${s?"Rule active":o?"Rule disabled":"Rule inactive"}"></span>
                <span class="activity-badge rule">${i.name||i.id}</span>
                <div class="activity-desc">
                  <div style="font-weight: 600;">${i.name||i.id}</div>
                  <div style="font-size: 11px; color: var(--secondary-text-color); margin-top: 2px;">
                    ${g}
                  </div>
                  ${r?l`
                    <div class="mismatch-hint">
                      ⚠️ Automatically disabled — no longer matches the target activity's configuration
                    </div>
                  `:""}
                </div>
              </div>
              ${a<this.rules.length-1?l`<div class="divider"></div>`:""}
            `})}

          ${this.rules.length===0?l`
            <div class="empty-state">No rules configured. Click edit to configure.</div>
          `:""}
        </div>
      </div>
    `}};Qt.styles=[de,Kt,P`
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

      .mismatch-hint {
        font-size: 11px;
        color: var(--warning-color, #f59e0b);
        margin-top: 2px;
        opacity: 1;
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
    `],fe([p({attribute:!1})],Qt.prototype,"hass",2),fe([p({attribute:!1})],Qt.prototype,"rules",2),fe([p({attribute:!1})],Qt.prototype,"inputsConfig",2),fe([p({attribute:!1})],Qt.prototype,"activitiesConfig",2),fe([p({attribute:!1})],Qt.prototype,"runState",2),fe([p({attribute:!1})],Qt.prototype,"channels",2),fe([p({type:Boolean})],Qt.prototype,"noHeader",2),Qt=fe([L("twilight-rules-card")],Qt);var dr=Object.defineProperty,cr=Object.getOwnPropertyDescriptor,Ce=(t,e,i,a)=>{for(var s=a>1?void 0:a?cr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&dr(e,i,s),s};let ae=class extends B{constructor(){super(...arguments),this.open=!1,this.title="Reset Settings",this.description="",this.nodes=[],this._selectedNodes={},this._expandedNodes={}}willUpdate(t){if(t.has("open")&&this.open||t.has("nodes")){const e={},i={};this.nodes.forEach(a=>{e[a.id]=!0,i[a.id]=!0,a.children&&a.children.forEach(s=>{e[s.id]=!0})}),this._selectedNodes=e,this._expandedNodes=i}}_isNodeSelected(t){return!!this._selectedNodes[t]}_isNodeIndeterminate(t){if(!t.children||t.children.length===0)return!1;const e=t.children.filter(i=>this._selectedNodes[i.id]).length;return e>0&&e<t.children.length}_onCheckboxChange(t,e){const i={...this._selectedNodes};if(i[t.id]=e,t.children)t.children.forEach(a=>{i[a.id]=e});else{const a=this.nodes.find(s=>{var o;return(o=s.children)==null?void 0:o.some(r=>r.id===t.id)});if(a&&a.children){const s=a.children.every(o=>{const r=o.id;return r===t.id?e:!!i[r]});i[a.id]=s}}this._selectedNodes=i,this.requestUpdate()}_toggleExpanded(t){this._expandedNodes={...this._expandedNodes,[t]:!this._expandedNodes[t]},this.requestUpdate()}_onConfirm(){const t=Object.keys(this._selectedNodes).filter(e=>this._selectedNodes[e]);this.dispatchEvent(new CustomEvent("confirm",{detail:{selectedIds:t},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}render(){return this.open?l`
      <div class="modal-overlay" @click=${this._onCancel}>
        <div
          class="modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-dialog-title"
          @click=${t=>t.stopPropagation()}
        >
          <h3 class="modal-title" id="reset-dialog-title">${this.title}</h3>
          ${this.description?l`<p class="modal-desc">${this.description}</p>`:""}

          <div class="modal-tree">
            ${this.nodes.map(t=>{const e=t.children&&t.children.length>0,i=!!this._expandedNodes[t.id];return l`
                <div class="tree-node">
                  <div
                    class="tree-node-header"
                    @click=${a=>{a.target.tagName!=="INPUT"&&e&&this._toggleExpanded(t.id)}}
                  >
                    ${e?l`<span class="tree-node-chevron ${i?"expanded":""}">&#9656;</span>`:l`<span class="tree-node-chevron" style="visibility: hidden;">&#9656;</span>`}
                    <input
                      type="checkbox"
                      .checked=${this._isNodeSelected(t.id)}
                      .indeterminate=${this._isNodeIndeterminate(t)}
                      @change=${a=>this._onCheckboxChange(t,a.target.checked)}
                    />
                    <span>${t.label}</span>
                  </div>

                  ${e&&i?l`
                        <div class="tree-node-children">
                          ${t.children.map(a=>l`
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
    `:l``}};ae.styles=P`
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
      width: 20px;
      height: 20px;
      font-size: 18px;
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
  `,Ce([p({type:Boolean})],ae.prototype,"open",2),Ce([p({type:String})],ae.prototype,"title",2),Ce([p({type:String})],ae.prototype,"description",2),Ce([p({type:Array})],ae.prototype,"nodes",2),Ce([m()],ae.prototype,"_selectedNodes",2),Ce([m()],ae.prototype,"_expandedNodes",2),ae=Ce([L("twilight-reset-dialog")],ae);var pr=Object.defineProperty,hr=Object.getOwnPropertyDescriptor,gt=(t,e,i,a)=>{for(var s=a>1?void 0:a?hr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&pr(e,i,s),s};const va={astro_dawn:"Astro Dawn",nautical_dawn:"Nautical Dawn",civil_dawn:"Civil Dawn",gold_dawn:"Golden Dawn",day:"Day",gold_dusk:"Golden Dusk",civil_dusk:"Civil Dusk",nautical_dusk:"Nautical Dusk",astro_dusk:"Astro Dusk",night:"Night"};let dt=class extends B{constructor(){super(...arguments),this.hass=null,this.slots=[],this.entities=[],this.open=!1,this.highlightSlotId=null,this.areaId="",this.areaName="",this.isPrimaryChannel=!0,this.templateMode=!1,this.channelName="",this.transitionOnSeconds=null,this.placeholderDefaults=null,this._draft=null,this._draftTransitionOnSeconds=null,this._transitionDraftInitialized=!1}_isValidHHMM(t){if(!t)return!1;const e=/^(\d{1,2}):(\d{2})$/.exec(t);if(!e)return!1;const i=Number(e[1]),a=Number(e[2]);return i>=0&&i<=23&&a>=0&&a<=59}_hasInvalidSlot(){return(this._draft??this.slots).some(e=>e.startType==="fixed"&&!this._isValidHHMM(e.fixedStartTime))}_closeAndSave(){if(this._hasInvalidSlot())return;const t=this._draftTransitionOnSeconds!==this.transitionOnSeconds;if(this._draft!==null||t){const i=this._draft??this.slots;this.dispatchEvent(new ji(i,this._draftTransitionOnSeconds))}this._draft=null,this._transitionDraftInitialized=!1,this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_closeDiscard(){this._draft=null,this._transitionDraftInitialized=!1,this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_updateDraft(t){this._draft=t}_clampOffset(t,e,i){var g,f;const a=((g=this.placeholderDefaults)==null?void 0:g.max_offset_minutes)??180,s=((f=this.placeholderDefaults)==null?void 0:f.min_slot_distance_minutes)??Ts;let o=Math.max(-a,Math.min(a,e));const r=["astro_dawn","nautical_dawn","civil_dawn","gold_dawn","day","gold_dusk","civil_dusk","nautical_dusk","astro_dusk","night"],n=i.find(d=>d.id===t);if(!n||(n.startType||"fixed")!=="astral")return o;const c=i.filter(d=>(d.startType||"fixed")==="astral").map(d=>{const h=d.startEvent||"civil_dawn",b=r.indexOf(h);return{slot:d,zoneIdx:b!==-1?b:99}}).sort((d,h)=>d.zoneIdx-h.zoneIdx),u=c.findIndex(d=>d.slot.id===t);if(u!==-1){if(u>0){const d=c[u-1].slot.startOffset||0;o<d-s&&(o=d-s)}if(u<c.length-1){const d=c[u+1].slot.startOffset||0;o>d+s&&(o=d+s)}}return o}_addCustomSlot(){const t=this._draft??this.slots;if(t.length>=Ii)return;const e=t.filter(a=>a.isCustom).length+1,i={id:`draft_${Date.now()}_${e}`,label:`Custom Slot ${e}`,color:"#8e44ad",from:720,to:780,scene:null,isCustom:!0,startType:"fixed",fixedStartTime:"12:00"};this._updateDraft([...t,i])}_deleteSlot(t){this._updateDraft((this._draft??this.slots).filter(e=>e.id!==t))}_setSlotScene(t,e){this._updateDraft((this._draft??this.slots).map(i=>i.id===t?{...i,scene:e}:i))}willUpdate(t){t.has("open")&&(this.open?(this._draft===null&&(this._draft=this.slots.map(e=>({...e}))),this._transitionDraftInitialized||(this._draftTransitionOnSeconds=this.transitionOnSeconds,this._transitionDraftInitialized=!0),oi()):(this._draft=null,this._transitionDraftInitialized=!1))}render(){var u,g,f;if(!this.open)return l``;const t=this._draft;if(!t)return l``;const e=(this.areaId||"").toLowerCase(),i=(this.areaName||"").toLowerCase(),a=new Set;if(e&&(a.add(e),e==="badezimmer"&&a.add("bad"),e==="kuche"&&a.add("küche"),e==="buro"&&(a.add("büro"),a.add("office"))),i){a.add(i);const d=i.normalize("NFD").replace(/[\u0300-\u036f]/g,"");a.add(d),i==="bad"&&a.add("badezimmer"),i==="büro"&&a.add("office")}const s=(d,h)=>{const b=d.toLowerCase(),w=(h||"").toLowerCase();for(const y of a)if(b.includes(y)||w.includes(y))return!0;return!1},o=new Set(t.map(d=>d.scene).filter(d=>!!d)),r=!!(this.areaId&&this.entities&&this.entities.length>0),n=new Set(r?this.entities.filter(d=>d.domain!=="scene"&&d.domain!=="script"||d.scene_type==="HUE_SMART_SCENE"?!1:d.in_area||o.has(d.entity_id)||s(d.entity_id,d.name)).map(d=>d.entity_id):[]),c=t;return l`
      <div class="overlay" @click=${d=>{d.target===d.currentTarget&&this._closeDiscard()}}>
        <div class="edit-panel">
          <div class="panel-header">
            <span class="card-dot" style="--dot-color: #f97316;"></span>
            <span class="panel-header-title">
              Slots Configuration${this.channelName?l` · <span style="color:var(--secondary-text-color);font-weight:500">${this.channelName}</span>`:""}
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
                    placeholder=${String(((u=this.placeholderDefaults)==null?void 0:u.transition_on_seconds)??60)}
                    @input=${d=>{const h=d.target.value.trim();if(h==="")this._draftTransitionOnSeconds=null;else{const b=parseInt(h,10);this._draftTransitionOnSeconds=isNaN(b)?null:b}}}
                  />
                </div>
              </div>
              <div class="slots-notice">
                <span>⏱️</span>
                <span>A minimum distance of ${((g=this.placeholderDefaults)==null?void 0:g.min_slot_distance_minutes)??Ts} minutes between consecutive slots is maintained, with a maximum offset of ±${((f=this.placeholderDefaults)==null?void 0:f.max_offset_minutes)??180} minutes.</span>
              </div>
              <div class="slots-header ${this.templateMode?"slots-header--no-time":""}">
                <div>Slot</div>
                <div>Start Type</div>
                <div>Value / Offset</div>
                ${this.templateMode?"":l`<div>Time</div>`}
                <div>Scene / Script</div>
                <div>Dynamic</div>
                <div></div>
              </div>

              ${c.map(d=>{const h=d.id===this.highlightSlotId,b=!this.isPrimaryChannel,w=d.startType==="fixed"&&!this._isValidHHMM(d.fixedStartTime);return l`
                  <div class="slot-edit-card ${h?"highlighted":""} ${w?"invalid":""} ${this.templateMode?"slot-edit-card--no-time":""}">
                    <!-- Col 1: Icon/Dot + Label/Input -->
                    <div style="display:flex; align-items:center; gap:8px; min-width: 0;">
                      <div class="slot-edit-dot" style="background:${d.color}"></div>
                      <div style="flex: 1; min-width: 0;">
                        ${b?l`
                            <input
                              type="text"
                              class="sensor-input"
                              .value=${d.label}
                              @input=${y=>{const v=y.target.value;this._updateDraft(t.map(_=>_.id===d.id?{..._,label:v}:_))}}
                              placeholder="Slot Name"
                            />
                          `:l`<div class="slot-edit-label" style="font-size:13px; font-weight:600">${d.label}</div>`}
                      </div>
                    </div>

                    <!-- Col 2: Start Type -->
                    <div>
                      <span class="mobile-label">Start Type</span>
                      ${b?l`
                          <select
                            class="sensor-input"
                            @change=${y=>{const v=y.target.value;this._updateDraft(t.map(_=>_.id===d.id?{..._,startType:v,startEvent:v==="astral"?"civil_dawn":void 0,fixedStartTime:v==="fixed"?"12:00":void 0,startOffset:v==="astral"?0:void 0}:_))}}
                          >
                            <option value="fixed" ?selected=${(d.startType||"fixed")==="fixed"}>Fixed Time</option>
                            <option value="astral" ?selected=${d.startType==="astral"}>Sun Event</option>
                          </select>
                        `:l`
                          <select class="sensor-input" disabled style="opacity:0.6">
                            <option>Sun Event</option>
                          </select>
                        `}
                    </div>

                    <!-- Col 3: Value / Offset -->
                    <div>
                      <span class="mobile-label">Value / Offset</span>
                      ${d.startType==="fixed"?l`
                          <input
                            type="time"
                            class="sensor-input"
                            .value=${d.fixedStartTime||"12:00"}
                            @change=${y=>{const v=y.target.value;this._updateDraft(t.map(_=>_.id===d.id?{..._,fixedStartTime:v}:_))}}
                          />
                        `:l`
                          <div style="display:flex; gap:6px;">
                            ${b?l`
                                <select
                                  class="sensor-input"
                                  style="flex:1"
                                  @change=${y=>{const v=y.target.value;this._updateDraft(t.map(_=>_.id===d.id?{..._,startEvent:v}:_))}}
                                >
                                  ${Object.entries(va).map(([y,v])=>l`
                                    <option value=${y} ?selected=${(d.startEvent||"civil_dawn")===y}>${v}</option>
                                  `)}
                                </select>
                              `:l`<input class="sensor-input" style="flex:1; opacity:0.6" disabled .value=${va[d.startEvent||""]||d.startEvent||""} />`}
                            <input
                              type="number"
                              class="sensor-input"
                              style="width:64px;"
                              .value=${String(d.startOffset||0)}
                              @input=${y=>{const v=y.target,_=Number(v.value),C=this._clampOffset(d.id,_,t);C!==_&&(v.value=String(C)),this._updateDraft(t.map(S=>S.id===d.id?{...S,startOffset:C}:S))}}
                              placeholder="Offset"
                            />
                          </div>
                        `}
                    </div>

                    ${this.templateMode?"":l`
                      <!-- Col 4: Time -->
                      <div>
                        <span class="mobile-label">Time</span>
                        <span class="slot-edit-time" style="font-size: 13px; font-family: monospace; font-weight: 500;">
                          ${_e(d.from)} → ${_e(d.to)}
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
                        .entityFilter=${y=>{var _,C;const v=(_=this.entities)==null?void 0:_.find(S=>S.entity_id===y.entity_id);return(v==null?void 0:v.scene_type)==="HUE_SMART_SCENE"?!1:o.has(y.entity_id)?!0:v?r?n.has(y.entity_id):!0:((C=y.entity_id)==null?void 0:C.startsWith("script."))??!1}}
                        allow-custom-entity
                        @value-changed=${y=>{const v=y.detail.value||null;v!==d.scene&&this._setSlotScene(d.id,v)}}
                      ></ha-entity-picker>
                    </div>

                    <!-- Col 6: Dynamic (Hue scenes with a palette only) -->
                    <div>
                      ${(()=>{var v;if(!d.scene||!d.scene.startsWith("scene."))return"";const y=(v=this.entities)==null?void 0:v.find(_=>_.entity_id===d.scene);return y!=null&&y.supports_dynamic?l`
                          <span class="mobile-label">Dynamic</span>
                          <div style="display: flex; align-items: center; gap: 8px; font-size: 13px;">
                            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; color: var(--secondary-text-color);">
                              <input
                                type="checkbox"
                                style="width: 16px; height: 16px; cursor: pointer;"
                                .checked=${!!d.hue_activate_dynamic}
                                @change=${_=>{const C=_.target.checked;this._updateDraft(t.map(S=>S.id===d.id?{...S,hue_activate_dynamic:C}:S))}}
                              />
                              On
                            </label>
                            <input
                              type="number"
                              class="sensor-input"
                              style="width: 64px;"
                              min="0"
                              max="100"
                              ?disabled=${!d.hue_activate_dynamic}
                              placeholder=${y.scene_speed!=null?String(y.scene_speed):"Speed"}
                              .value=${d.hue_dynamic_speed!==void 0&&d.hue_dynamic_speed!==null?String(d.hue_dynamic_speed):""}
                              @input=${_=>{const C=_.target.value.trim(),S=C===""?null:Math.min(100,Math.max(0,parseInt(C,10)||0));this._updateDraft(t.map(A=>A.id===d.id?{...A,hue_dynamic_speed:S}:A))}}
                              title=${y.scene_speed!=null?`Speed of dynamic palette (0-100) — scene default: ${y.scene_speed}`:"Speed of dynamic palette (0-100)"}
                            />
                          </div>
                        `:""})()}
                    </div>

                    <!-- Col 7: Delete action -->
                    <div style="display: flex; justify-content: flex-end;">
                      ${b?l`
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

              ${this.isPrimaryChannel?"":t.length>=Ii?l`<button class="btn-add-slot" disabled>Max ${Ii} slots reached</button>`:l`<button class="btn-add-slot" @click=${this._addCustomSlot}>➕ Add Slot</button>`}
            </div>
          </div>

          <div class="panel-footer">
            ${this._hasInvalidSlot()?l`
              <span style="flex:1; color:var(--error-color, #db4437); font-size:13px; align-self:center;">
                ⚠️ Fix invalid times (HH:MM) before saving
              </span>
            `:""}
            <button class="btn-done" ?disabled=${this._hasInvalidSlot()} @click=${this._closeAndSave}>Done</button>
          </div>
        </div>
      </div>
    `}};dt.styles=[Et,P`
      /* Wider than the shared dialog default: this panel carries a full slot
         table incl. the Dynamic column, so it needs the extra room. */
      .edit-panel {
        max-width: 1400px;
      }

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
      grid-template-columns: minmax(110px, 1.1fr) minmax(110px, 1fr) minmax(180px, 1.6fr) minmax(100px, 1fr) minmax(220px, 2.5fr) minmax(150px, 0.9fr) 30px;
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
      grid-template-columns: minmax(110px, 1.1fr) minmax(110px, 1fr) minmax(180px, 1.6fr) minmax(220px, 2.5fr) minmax(150px, 0.9fr) 30px;
    }

    .slot-edit-card {
      display: grid;
      grid-template-columns: minmax(110px, 1.1fr) minmax(110px, 1fr) minmax(180px, 1.6fr) minmax(100px, 1fr) minmax(220px, 2.5fr) minmax(150px, 0.9fr) 30px;
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
      grid-template-columns: minmax(110px, 1.1fr) minmax(110px, 1fr) minmax(180px, 1.6fr) minmax(220px, 2.5fr) minmax(150px, 0.9fr) 30px;
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
    .sensor-input:disabled {
      opacity: 0.45;
      cursor: not-allowed;
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
  `],gt([p({attribute:!1})],dt.prototype,"hass",2),gt([p({type:Array})],dt.prototype,"slots",2),gt([p({type:Array})],dt.prototype,"entities",2),gt([p({type:Boolean})],dt.prototype,"open",2),gt([p({type:String})],dt.prototype,"highlightSlotId",2),gt([p({type:String})],dt.prototype,"areaId",2),gt([p({type:String})],dt.prototype,"areaName",2),gt([p({type:Boolean})],dt.prototype,"isPrimaryChannel",2),gt([p({type:Boolean})],dt.prototype,"templateMode",2),gt([p({type:String})],dt.prototype,"channelName",2),gt([p({type:Number})],dt.prototype,"transitionOnSeconds",2),gt([p({attribute:!1})],dt.prototype,"placeholderDefaults",2),gt([m()],dt.prototype,"_draft",2),gt([m()],dt.prototype,"_draftTransitionOnSeconds",2),dt=gt([L("twilight-slot-editor")],dt);var ur=Object.defineProperty,fr=Object.getOwnPropertyDescriptor,oe=(t,e,i,a)=>{for(var s=a>1?void 0:a?fr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&ur(e,i,s),s};let Gt=class extends B{constructor(){super(...arguments),this.open=!1,this.rule=null,this.editIndex=null,this.inputsConfig=[],this.activitiesConfig=[],this.channels={},this.siblings=[],this._editDraft=null}updated(t){var e;if(t.has("open")||t.has("rule"))if(this.open&&this.rule){this._editDraft=structuredClone(this.rule);const i=(this.activitiesConfig||[]).filter(ns),a=(this.activitiesConfig||[]).map(o=>o.id),s=((e=i[0])==null?void 0:e.id)||a[0]||"motion";(!this._editDraft.applied_activities||this._editDraft.applied_activities.length===0)&&(this._editDraft.applied_activities=[s]),this._editDraft.suppressed_inputs_override||(this._editDraft.suppressed_inputs_override=[])}else this.open||(this._editDraft=null)}_onSlotOverridesChanged(t,e){this._editDraft&&(this._editDraft={...this._editDraft,applied_activities:[t],excluded_slots_override:{...this._editDraft.excluded_slots_override||{},[t]:e}},this.requestUpdate())}_cancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}_save(){var n;if(!this._editDraft)return;const t=(this.activitiesConfig||[]).filter(ns),e=(this.activitiesConfig||[]).map(c=>c.id),i=this._editDraft.applied_activities&&this._editDraft.applied_activities.length>0?this._editDraft.applied_activities[0]:((n=t[0])==null?void 0:n.id)||e[0]||"motion",a=(this.activitiesConfig||[]).find(c=>c.id===i),s=os(a),o=rs(a);let r={...this._editDraft,applied_activities:[i],suppressed_inputs_override:this._editDraft.suppressed_inputs_override||[],auto_disabled_reason:null};if(s?(r.auto_expire_enabled=null,r.auto_expire=null):o?r.auto_expire_mode="none":(r.auto_expire_mode="none",r.auto_expire_enabled=null,r.auto_expire=null),!r.id){const c=new Set((this.siblings||[]).map(g=>g.id));let u=`rule_${Array.from({length:8},()=>Math.floor(Math.random()*16).toString(16)).join("")}`;for(;c.has(u);)u=`rule_${Array.from({length:8},()=>Math.floor(Math.random()*16).toString(16)).join("")}`;r.id=u}this.dispatchEvent(new CustomEvent("save",{detail:r,bubbles:!0,composed:!0}))}render(){var b,w,y;if(!this.open||!this._editDraft)return l``;const t=this._editDraft,e=this.editIndex!==null,i=!((b=t.name)!=null&&b.trim()),a=(this.activitiesConfig||[]).filter(ns),s=(this.activitiesConfig||[]).map(v=>v.id),o=t.applied_activities&&t.applied_activities.length>0?t.applied_activities[0]:((w=a[0])==null?void 0:w.id)||s[0]||"motion",r=(this.activitiesConfig||[]).find(v=>v.id===o),n=os(r),c=rs(r),u=ua(r),g=ha(r),f=[...a];r&&!f.some(v=>v.id===o)&&f.push(r);const d=t.suppressed_inputs_override||[],h=(this.inputsConfig||[]).filter(v=>!t.id||v.rule!==t.id);return l`
      <div class="overlay" @click=${v=>{v.target===v.currentTarget&&this._cancel()}}>
        <div class="edit-panel" style="max-width: 650px;" @click=${v=>v.stopPropagation()}>
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
                @input=${v=>{this._editDraft={...this._editDraft,name:v.target.value}}}
              />
            </div>

            <div class="form-field">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input
                  type="checkbox"
                  ?checked=${t.enabled??!0}
                  @change=${v=>{this._editDraft={...this._editDraft,enabled:v.target.checked}}}
                />
                <span class="form-label" style="margin: 0;">Enable Rule</span>
              </label>
            </div>

            <div class="form-field">
              <div class="list-section-label">Target Activity & Excluded Slots</div>
              <span class="form-label">Target Activity</span>
              <select class="option-select" .value=${o} @change=${v=>{const _=v.target.value;this._editDraft={...this._editDraft,applied_activities:[_]}}}>
                ${f.map(v=>l`<option value="${v.id}" ?selected=${v.id===o}>${v.name||v.id}</option>`)}
              </select>
              <span class="form-hint">Select the single activity whose behavior or slot schedule this rule overrides when active.</span>
            </div>

            ${n?l`
              <div class="form-field">
                <span class="form-label">Auto-Expire Behavior</span>
                <select class="option-select" .value=${t.auto_expire_mode||"none"} @change=${v=>{const _=v.target.value;this._editDraft={...this._editDraft,auto_expire_mode:_}}}>
                  <option value="none" ?selected=${(t.auto_expire_mode||"none")==="none"}>None</option>
                  <option value="pause" ?selected=${t.auto_expire_mode==="pause"}>Pause</option>
                  <option value="suspend" ?selected=${t.auto_expire_mode==="suspend"}>Suspend</option>
                  <option value="restart" ?selected=${t.auto_expire_mode==="restart"}>Restart</option>
                </select>
                <span class="form-hint">Controls what happens to the target activity's auto-expire timer while this rule is active. Pause: freeze the remaining time. Suspend: freeze at zero, so the activity expires as soon as the rule ends. Restart: resume with the full duration once the rule ends.</span>
              </div>
            `:""}

            ${c?l`
              <div class="form-field">
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                  <input
                    type="checkbox"
                    ?checked=${t.auto_expire_enabled===!0}
                    @change=${v=>{var C;const _=v.target.checked;this._editDraft={...this._editDraft,auto_expire_enabled:_,auto_expire:_?((C=this._editDraft)==null?void 0:C.auto_expire)||"":null}}}
                  />
                  <span class="form-label" style="margin: 0;">Enable Auto-Expire</span>
                </label>
                <span class="form-hint">Temporarily assign an auto-expire duration to this timeless activity while this rule is active.</span>
              </div>

              <div class="form-field">
                <span class="form-label">Auto-Expire Duration (HH:MM:SS)</span>
                <input
                  type="text"
                  class="activity-input"
                  placeholder="00:05:00"
                  ?disabled=${t.auto_expire_enabled!==!0}
                  .value=${t.auto_expire||""}
                  @input=${v=>{this._editDraft={...this._editDraft,auto_expire:v.target.value}}}
                />
              </div>
            `:""}

            ${g?l`
              <div class="form-field">
                <span class="form-label">Channels / Slots</span>
                <twilight-slot-action-tree
                  .channels=${this.channels}
                  .excludedSlotIds=${((y=t.excluded_slots_override)==null?void 0:y[o])||{}}
                  @excluded-changed=${v=>this._onSlotOverridesChanged(o,v.detail.value)}
                ></twilight-slot-action-tree>
              </div>
            `:""}

            ${u?l`
              <div class="form-field">
                <div class="list-section-label">Input Suppression</div>
                <span class="form-label">Suppressed Inputs</span>
                <div class="checkbox-list">
                  ${h.map(v=>{const _=d.includes(v.id);return l`
                      <label class="checkbox-item">
                        <input
                          type="checkbox"
                          ?checked=${_}
                          @change=${C=>{const S=C.target.checked,A=this._editDraft.suppressed_inputs_override||[],k=S?[...A,v.id]:A.filter(I=>I!==v.id);this._editDraft={...this._editDraft,suppressed_inputs_override:k}}}
                        />
                        <span>${At(v,null)} (${v.type})</span>
                      </label>
                    `})}
                  ${h.length===0?l`<div style="font-style: italic; opacity: 0.4; font-size: 11px;">No eligible inputs configured</div>`:""}
                </div>
                <span class="form-hint">Check inputs that should be suppressed/ignored while this rule is active.</span>
              </div>
            `:""}

          </div>

          <div class="panel-footer">
            <button class="btn-cancel-dialog" @click=${this._cancel}>Cancel</button>
            <button class="btn-save-dialog" ?disabled=${i} @click=${this._save}>${e?"Save":"Add"}</button>
          </div>
        </div>
      </div>
    `}};Gt.styles=[de,Et,P`
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
    `],oe([p({type:Boolean})],Gt.prototype,"open",2),oe([p({attribute:!1})],Gt.prototype,"rule",2),oe([p({type:Number})],Gt.prototype,"editIndex",2),oe([p({attribute:!1})],Gt.prototype,"inputsConfig",2),oe([p({attribute:!1})],Gt.prototype,"activitiesConfig",2),oe([p({attribute:!1})],Gt.prototype,"channels",2),oe([p({attribute:!1})],Gt.prototype,"siblings",2),oe([m()],Gt.prototype,"_editDraft",2),Gt=oe([L("twilight-rule-row-editor")],Gt);function gr(){return{id:"",name:"",enabled:!0,applied_activities:[],excluded_slots_override:{},auto_expire_mode:"none",auto_expire_enabled:null,auto_expire:null,suppressed_inputs_override:[]}}var vr=Object.defineProperty,br=Object.getOwnPropertyDescriptor,Vt=(t,e,i,a)=>{for(var s=a>1?void 0:a?br(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&vr(e,i,s),s};let Ot=class extends B{constructor(){super(...arguments),this.open=!1,this.hass=null,this.config=[],this.inputsConfig=[],this.activitiesConfig=[],this.channels={},this._subEditOpen=!1,this._subEditingIndex=null,this._subEditRule=null,this._draftController=new fi(this,{onOpen:()=>{this._subEditOpen=!1}})}set rules(t){this.config=t||[]}get rules(){return this.config}_closeDiscard(){this._draftController.closeDiscard()}_closeAndSave(){this._draftController.closeAndSave(new Li(this._draftController.draft||[]))}_openAddRule(){this._subEditingIndex=null,this._subEditRule=gr(),this._subEditOpen=!0}_openEditRule(t){const e=this._draftController.draft;e&&(this._subEditingIndex=t,this._subEditRule=structuredClone(e[t]),this._subEditOpen=!0)}_closeSubEdit(){this._subEditOpen=!1,this._subEditingIndex=null,this._subEditRule=null}_handleSubEditSave(t){const e=this._draftController.draft;if(!e)return;const i=t.detail,a=new Set((this.inputsConfig||[]).filter(n=>n.rule===i.id).map(n=>n.id)),s=(i.suppressed_inputs_override||[]).filter(n=>!a.has(n)),o={...i,suppressed_inputs_override:s},r=[...e];this._subEditingIndex===null?r.push(o):r[this._subEditingIndex]=o,this._draftController.draft=r,this.requestUpdate(),this._closeSubEdit()}_removeRule(t){const e=this._draftController.draft;if(!e)return;const i=[...e];i.splice(t,1),this._draftController.draft=i,this.requestUpdate()}render(){if(!this.open)return l``;const t=this._draftController.draft||[];return l`
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
                ${t.map((e,i)=>{const s=(this.inputsConfig||[]).filter(r=>r.rule===e.id).map(r=>At(r,this.hass)),o=fa(e,this.activitiesConfig||[]);return l`
                    <tr
                      class="input-row ${this._draftController.draggedIndex===i?"dragging":""} ${e.enabled?"":"row-disabled"}"
                      draggable="true"
                      @dragstart=${r=>this._draftController.onDragStart(r,i)}
                      @dragover=${r=>this._draftController.onDragOver(r,i)}
                      @dragend=${()=>this._draftController.onDragEnd()}
                    >
                      <td style="text-align: center; padding: 0 4px; vertical-align: middle;">
                        <div class="drag-handle" title="Drag to reorder">⋮⋮</div>
                      </td>
                      <td>
                        <div style="font-weight: 600;">${e.name||e.id}</div>
                        ${e.name&&e.id?l`<div style="font-size: 10px; font-family: monospace; opacity: 0.5;">${e.id}</div>`:""}
                        ${o?l`
                          <div class="mismatch-hint">
                            ⚠️ Automatically disabled — no longer matches the target activity's configuration
                          </div>
                        `:""}
                      </td>
                      <td>
                        ${s.length>0?s.map(r=>l`<span class="pill">${r}</span>`):l`<span style="opacity: 0.4;">—</span>`}
                      </td>
                      <td>
                        ${(e.applied_activities||[]).length>0?(e.applied_activities||[]).map(r=>{const n=(this.activitiesConfig||[]).find(c=>c.id===r);return(n==null?void 0:n.name)||(n==null?void 0:n.id)||r}).map(r=>l`<span class="pill">${r}</span>`):l`<span class="pill" style="opacity: 0.8;">All</span>`}
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
                ${t.length===0?l`
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

      .input-row.row-disabled {
        opacity: 0.45;
      }

      .mismatch-hint {
        font-size: 11px;
        color: var(--warning-color, #f59e0b);
        margin-top: 2px;
        opacity: 1;
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
    `],Vt([p({type:Boolean})],Ot.prototype,"open",2),Vt([p({attribute:!1})],Ot.prototype,"hass",2),Vt([p({attribute:!1})],Ot.prototype,"config",2),Vt([p({attribute:!1})],Ot.prototype,"rules",1),Vt([p({attribute:!1})],Ot.prototype,"inputsConfig",2),Vt([p({attribute:!1})],Ot.prototype,"activitiesConfig",2),Vt([p({attribute:!1})],Ot.prototype,"channels",2),Vt([m()],Ot.prototype,"_subEditOpen",2),Vt([m()],Ot.prototype,"_subEditingIndex",2),Vt([m()],Ot.prototype,"_subEditRule",2),Ot=Vt([L("twilight-rules-dialog")],Ot);var mr=Object.defineProperty,_r=Object.getOwnPropertyDescriptor,F=(t,e,i,a)=>{for(var s=a>1?void 0:a?_r(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&mr(e,i,s),s};let H=class extends B{constructor(){super(...arguments),this.hass=null,this.areaId="",this.areaConfigs=[],this.areas=[],this.todayData=null,this.globalConfig={},this.placeholderDefaults=null,this.areasState={},this._areaPlaceholderDefaults=null,this._isNewArea=!1,this._selectedChannelId=T,this._areaEntities=[],this._extractedEntities={},this._slotEditOpen=!1,this._inputsEditOpen=!1,this._activitiesEditOpen=!1,this._sensorsEditOpen=!1,this._areaLightsEditOpen=!1,this._rulesEditOpen=!1,this._editingSlotId=null,this._hoveredTime=null,this._hoveredChannelId=T,this._tooltipX=0,this._tooltipY=0,this._resetDialogOpen=!1,this._globalDefaultsTemplate=null,this._resetNodes=[],this._slotTimes=null,this._dialog=new we(this),this._clock=new di(this),this._lastLoadedKey="",this._loadGuard=new ni,this._draftController=new Hs(this,{onSave:async t=>{if(!this.hass)return;const{disabled_rule_ids:e,...i}=await ro(this.hass,t);if(e&&e.length>0){const o=(i.rules||[]).filter(n=>e.includes(n.id)).map(n=>n.name||n.id).join(", "),r=o?`The following rule(s) were automatically disabled because they no longer match target activity capabilities: ${o}`:"One or more rules were automatically disabled due to capability mismatches.";await this._dialog.showAlert("Rules Automatically Disabled",r)}const a=this.areaConfigs.findIndex(o=>o.area_id===i.area_id);let s;return a>=0?s=this.areaConfigs.map((o,r)=>r===a?i:o):s=[...this.areaConfigs,i],this._isNewArea=!1,this.dispatchEvent(new CustomEvent("areas-changed",{detail:s,bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent("engines-changed",{bubbles:!0,composed:!0})),await this._fetchSlotTimes(),i}})}get _effectivePlaceholderDefaults(){return this._areaPlaceholderDefaults??this.placeholderDefaults}async _saveOrUpdateDraft(){this._isNewArea?this.requestUpdate():await this._draftController.save()}connectedCallback(){super.connectedCallback(),this.hass&&this.areaId&&this._loadAreaDetails()}updated(t){if(super.updated(t),(t.has("areaId")||t.has("hass"))&&this.areaId&&this.hass){const e=t.get("areaId"),i=t.get("hass");(this.areaId!==e||this.hass!==i)&&this._loadAreaDetails()}}async _loadAreaDetails(){var s;const t=`${this.areaId}_${(s=this.hass)!=null&&s.states?"has_hass":"no_hass"}`;if(t===this._lastLoadedKey||(this._lastLoadedKey=t,!this.hass||!this.areaId))return;this._draftController.loading=!0,this.requestUpdate(),this._selectedChannelId=T;const e=this.areaConfigs.find(o=>o.area_id===this.areaId),i=this.areas.find(o=>o.area_id===this.areaId),a=this._loadGuard.begin();try{let o;if(e)this._isNewArea=!1,o=structuredClone(e);else{if(this._isNewArea=!0,o=await zs(this.hass,this.areaId),!a.isCurrent())return;i&&(o.name=i.name)}o.activities=pa(o.activities),this._draftController.init(o);const[r,n]=await Promise.all([co(this.hass,this.areaId),lo(this.hass,this.areaId).catch(c=>(console.warn("Backend extraction not available yet, using empty fallback",c),{}))]);if(!a.isCurrent())return;this._extractedEntities=n||{},this._updateAreaEntities(this._draftController.draft,r),await this._fetchSlotTimes(a)}catch(o){console.error("Error fetching area entities",o)}finally{a.isCurrent()&&(this._draftController.loading=!1,this.requestUpdate())}}async _fetchSlotTimes(t){if(!this.hass||!this.areaId)return;const e=()=>!t||t.isCurrent();try{if(this._isNewArea){const i=await this._fetchDraftSlotTimes();if(!e())return;this._slotTimes=i}else{const i=await Ls(this.hass,{area_id:this.areaId});if(!e())return;this._slotTimes=i}}catch(i){console.warn("Failed to fetch area slot times:",i)}if(!this._isNewArea)try{const i=await Fi(this.hass,this.areaId);if(!e())return;this._areaPlaceholderDefaults=i}catch(i){console.warn("Failed to fetch area placeholder defaults:",i)}}async _fetchDraftSlotTimes(){const t=this._draftController.draft,e=Pt(),i={};if(this.hass&&t){const a=Object.entries(Q(t)),s=await Promise.all(a.map(([,o])=>qi(this.hass,{slots:o.slots||[]})));a.forEach(([o],r)=>{i[o]={[e]:s[r].slots}})}return{area_id:this.areaId,dates:[e],channels:i}}_activeChannelId(t){return Us(t).includes(this._selectedChannelId)?this._selectedChannelId:T}_updateAreaEntities(t,e){const i=new Set;this._extractedEntities&&Object.values(this._extractedEntities).forEach(r=>{(Array.isArray(r)?r:(r==null?void 0:r.extracted)??[]).forEach(c=>i.add(c))});const a=new Set,s=this._activeChannelId(t);ye(t,s).forEach(r=>{var n;(n=r.configured_entities)==null||n.forEach(c=>a.add(c))});const o=a.size>0;this._areaEntities=e.map(r=>{const n=i.has(r.entity_id),c=o&&a.has(r.entity_id);return{entity_id:r.entity_id,name:r.name,domain:r.domain,in_area:r.in_area,scene_type:r.scene_type,supports_dynamic:r.supports_dynamic,scene_speed:r.scene_speed,checked:c||n,isExtracted:n,isManual:c}}).sort((r,n)=>(r.name||r.entity_id).localeCompare(n.name||n.entity_id))}_refreshExtractedEntities(){this._draftController.draft&&this._updateAreaEntities(this._draftController.draft,this._areaEntities)}async _confirmDiscardIfDirty(){return!this._isNewArea&&!this._draftController.isDirty?!0:this._dialog.showConfirm("Discard Changes","You have unsaved changes. Are you sure you want to discard them?")}async _backToOverview(){await this._confirmDiscardIfDirty()&&this.dispatchEvent(new CustomEvent("back",{bubbles:!0,composed:!0}))}_saveStatusText(){if(this._draftController.saving)return"Saving…";const t=this._draftController.saveError;return t?`Save failed: ${t&&typeof t=="object"&&"message"in t?String(t.message):String(t)}`:this._isNewArea?"New Area Setup":this._draftController.isDirty?"Unsaved changes":"All changes saved"}_onSunPathHover(t){this._hoveredTime=t.detail.hoverTime,t.detail.channelId&&(this._hoveredChannelId=t.detail.channelId)}async _onSensorsChanged(t){this._draftController.update({sensors:t.detail}),await this._saveOrUpdateDraft()}_availableActivities(t){const e=(t.activities??[]).map(i=>i.id);return e.length>0?e:["sleep"]}async _onInputsChanged(t){this._draftController.update({inputs:t.detail.inputs}),await this._saveOrUpdateDraft()}async _onActivitiesChanged(t){this._draftController.update({activities:t.detail.activities}),await this._saveOrUpdateDraft()}async _onRulesChanged(t){this._draftController.update({rules:t.detail}),await this._saveOrUpdateDraft()}_onSunPathMove(t){this._tooltipX=t.clientX,this._tooltipY=t.clientY}_onSlotSelected(t){t.detail.channelId&&(this._selectedChannelId=t.detail.channelId),this._editingSlotId=t.detail.slotId,this._slotEditOpen=!0}_onChannelSelected(t){this._selectedChannelId=t.detail.channelId,this._refreshExtractedEntities()}async _onChannelAdded(t){const e=this._draftController.draft;if(!e)return;const i=t.detail.name.trim();if(!i)return;const a=i.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"");if(!a)return;const s={...Q(e)};if(s[a]){await this._dialog.showAlert("Channel already exists",`A channel named "${i}" already exists.`);return}s[a]={name:i,enabled:!0,slots:[]},this._draftController.update({channels:s}),this._selectedChannelId=a,await this._saveOrUpdateDraft()}async _onChannelRenamed(t){const e=this._draftController.draft;if(!e)return;const{channelId:i,name:a}=t.detail,s={...Q(e)},o=s[i];o&&(s[i]={...o,name:a},this._draftController.update({channels:s}),await this._saveOrUpdateDraft())}async _onChannelDeleted(t){const e=this._draftController.draft;if(!e||t.detail.channelId===T)return;const i={...Q(e)};delete i[t.detail.channelId],this._draftController.update({channels:i}),this._selectedChannelId===t.detail.channelId&&(this._selectedChannelId=T),await this._saveOrUpdateDraft()}async _onChannelToggled(t){const e=this._draftController.draft;if(!e||t.detail.channelId===T)return;const i={...Q(e)},a=i[t.detail.channelId];a&&(i[t.detail.channelId]={...a,enabled:t.detail.enabled},this._draftController.update({channels:i}),await this._saveOrUpdateDraft())}_withChannelSlots(t,e,i,a){const s={...Q(t)},o=s[e];return o&&(s[e]={...o,slots:i,...a!==void 0?{transition_on_seconds:a}:{}}),s}async _onSlotsChanged(t){const e=this._draftController.draft;if(!e)return;const i=this._activeChannelId(e),a=ye(e,i),s=t.detail.slots.map(o=>{const r=a.find(c=>c.id===o.id),n=o.startType==="fixed";return{id:o.id,name:o.label,start_type:n?"fixed":"astral",zone:n?null:o.startEvent||(r==null?void 0:r.zone)||"civil_dawn",fixed_time:n?o.fixedStartTime||"00:00":null,offset_minutes:o.startOffset||0,scene_entity_id:o.scene,configured_entities:(r==null?void 0:r.configured_entities)||[],hue_activate_dynamic:o.hue_activate_dynamic||!1,hue_dynamic_speed:o.hue_dynamic_speed??null}});this._draftController.update({channels:this._withChannelSlots(e,i,s,t.detail.transitionOnSeconds)}),this._refreshExtractedEntities(),await this._saveOrUpdateDraft(),await this._fetchSlotTimes()}async _onLightsChanged(t){const e=this._draftController.draft;if(!e)return;this._areaEntities=t.detail.entities;const i=t.detail.entities.filter(o=>o.isManual).map(o=>o.entity_id),a=this._activeChannelId(e),s=ye(e,a).map(o=>({...o,configured_entities:i}));this._draftController.update({channels:this._withChannelSlots(e,a,s)}),this._refreshExtractedEntities(),await this._saveOrUpdateDraft()}async _onLightsModeChanged(t){this._draftController.update({manual_only:t.detail.manualOnly}),await this._saveOrUpdateDraft()}async _onSelectAreaChanged(t){var s;const e=t.target,i=e.value,a=(s=this._draftController.draft)==null?void 0:s.area_id;if(i!==a){if(!await this._confirmDiscardIfDirty()){e.value=a??"";return}this.dispatchEvent(new CustomEvent("select-area",{detail:{areaId:i},bubbles:!0,composed:!0}))}}async _onAreaEnabledToggled(t){const e=t.target.checked;this._draftController.update({enabled:e}),await this._saveOrUpdateDraft()}async _deleteArea(){if(!(!this.areaId||!this.hass||!await this._dialog.showConfirm("Delete Configuration","Are you sure you want to delete the Twilight configuration for this area?")))try{await no(this.hass,this.areaId);const e=this.areaConfigs.filter(i=>i.area_id!==this.areaId);this.dispatchEvent(new CustomEvent("areas-changed",{detail:e,bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent("engines-changed",{bubbles:!0,composed:!0})),this._backToOverview()}catch(e){console.error("Error deleting area config",e)}}async _resetAreaToGlobalDefaults(){const t=this._draftController.draft;if(!(!t||!this.hass))try{const e=await zs(this.hass,t.area_id);this._globalDefaultsTemplate=e;const i=[{id:"inherited",label:"Inherited Defaults (Lux Threshold, Transition Time, etc.)"},{id:"area_inputs",label:"Area Inputs",children:(e.inputs||[]).map(a=>{const s=(e.activities||[]).find(o=>o.id===a.activity);return{id:`area_inputs:${a.id}`,label:`${At(a,this.hass)} — ${(s==null?void 0:s.name)||(s==null?void 0:s.id)||a.activity}`}})},{id:"area_activities",label:"Area Activities",children:(e.activities||[]).map(a=>({id:`area_activities:${a.id}`,label:a.name||a.id}))},{id:"area_channels",label:"Area Custom Channels",children:Object.entries(e.channels||{}).filter(([a])=>a!==T).map(([a,s])=>({id:`area_channels:${a}`,label:s.name||a}))}];this._resetNodes=i,this._resetDialogOpen=!0,this.requestUpdate()}catch(e){console.error("Failed to load area global defaults template:",e)}}async _executeReset(t){if(!this._globalDefaultsTemplate||!this._draftController.draft)return;const e=new Set(t.detail.selectedIds),i=this._globalDefaultsTemplate;this._draftController.update(a=>{e.has("inherited")&&(a.lux_threshold=null,a.lux_watch_window=null);const s=e.has("area_inputs"),o=i.inputs||[];if(s)a.inputs=structuredClone(o);else{const g=[...a.inputs||[]];o.forEach(f=>{if(e.has(`area_inputs:${f.id}`)){const d=g.findIndex(h=>h.id===f.id);d>=0?g[d]=structuredClone(f):g.push(structuredClone(f))}}),a.inputs=g}const r=e.has("area_activities"),n=i.activities||[];if(r)a.activities=structuredClone(n);else{const g=[...a.activities||[]];n.forEach(f=>{if(e.has(`area_activities:${f.id}`)){const d=g.findIndex(h=>h.id===f.id);d>=0?g[d]=structuredClone(f):g.push(structuredClone(f))}}),a.activities=g}const c=e.has("area_channels"),u=i.channels||{};if(c){const g={...a.channels||{}};Object.keys(g).forEach(f=>{f!==T&&delete g[f]}),Object.entries(u).forEach(([f,d])=>{f!==T&&(g[f]=structuredClone(d))}),a.channels=g}else{const g={...a.channels||{}};Object.keys(u).forEach(f=>{f!==T&&e.has(`area_channels:${f}`)&&(g[f]=structuredClone(u[f]))}),a.channels=g}}),this._resetDialogOpen=!1,this.requestUpdate(),await this._saveOrUpdateDraft()}_renderTooltip(t,e){if(this._hoveredTime===null)return l``;const i=this._hoveredTime,s=(t[this._hoveredChannelId]??e).find(r=>Te(r,i));if(!s)return l``;const o=s.scene?Ui(this.hass,s.scene):s.label;return l`
      <div class="slot-tooltip" style="left:${this._tooltipX+15}px; top:${this._tooltipY+15}px">
        <span class="slot-tooltip-badge" style="background:${s.color}; color:#fff; box-shadow:0 0 10px ${s.color}40">
          ${o} (${_e(i)})
        </span>
      </div>
    `}_areaToSlots(t,e){var s,o,r;const i=Pt(),a=((r=(o=(s=this._slotTimes)==null?void 0:s.channels)==null?void 0:o[t])==null?void 0:r[i])||[];return Ge(a,e)}_activeSceneName(t){var o,r,n;const e=this.areasState[this.areaId]||null;if(e)return e.active_scene_name??"No Scene Active";const i=this._clock.liveMins,a=t.find(c=>Te(c,i)),s=(a==null?void 0:a.scene)??null;return s?((n=(r=(o=this.hass)==null?void 0:o.states[s])==null?void 0:r.attributes)==null?void 0:n.friendly_name)??s:"No Scene Active"}render(){var f,d;if(this._draftController.loading)return l`<div style="padding:24px;color:var(--secondary-text-color)">Loading Area Details…</div>`;const t=this._draftController.draft;if(!t)return l``;const e=this.areas.find(h=>h.area_id===t.area_id),i=t.name||(e==null?void 0:e.name)||t.area_id,a=Pt(),s=this._activeChannelId(t),o=this._areaToSlots(s,ye(t,s)),r=this._areaToSlots(T,ye(t,T)),n=t.sensors||[],c=this._activeSceneName(o),u=this.areasState[t.area_id]||null,g={};for(const[h,b]of Object.entries(Q(t)))g[h]=this._areaToSlots(h,b.slots||[]);return l`
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
              ${this.areaConfigs.map(h=>l`
                <option value="${h.area_id}" ?selected=${h.area_id===t.area_id}>${h.name||h.area_id}</option>
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
              .channelSlotsMap=${g}
              .sensorConfig=${n}
              .inputs=${t.inputs||[]}
              .activitiesConfig=${t.activities||[]}
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
              .channels=${Q(t)}
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
              .runState=${u}
              .areaId=${t.area_id}
              .editOpen=${this._inputsEditOpen}
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
              .config=${n}
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
              .runState=${u}
              @rules-changed=${this._onRulesChanged}
              @open-edit=${()=>{this._rulesEditOpen=!0}}
            ></twilight-rules-card>
          </div>
        </div>
      </div>
 
      <div class="detail-footer">
        <div>
          <button class="btn-cancel" @click=${this._resetAreaToGlobalDefaults}>Reset to Global Defaults</button>
          ${this.areaConfigs.some(h=>h.area_id===t.area_id)?l`
            <button class="btn-cancel" style="border-color: var(--error-color, #db4437); color: var(--error-color, #db4437); margin-left: 12px;" @click=${()=>this._deleteArea()}>
              Remove Area
            </button>
          `:""}
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span class="save-status ${this._draftController.saveError?"error":""}">${this._saveStatusText()}</span>
          ${this._isNewArea||this._draftController.isDirty&&!this._draftController.saving?l`
            ${this._isNewArea?l`
              <button class="btn-cancel" ?disabled=${this._draftController.saving} @click=${()=>this._backToOverview()}>Cancel</button>
            `:l`
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
        .channelName=${((f=Q(t)[s])==null?void 0:f.name)||""}
        .transitionOnSeconds=${((d=Q(t)[s])==null?void 0:d.transition_on_seconds)??null}
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

      <twilight-area-lights-dialog
        .open=${this._areaLightsEditOpen}
        .hass=${this.hass}
        .entities=${this._areaEntities}
        .activeSceneName=${c}
        .runState=${u}
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
        .runState=${u}
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
        .config=${n}
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
        .runState=${u}
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
    `}};H.styles=[Yi,Ve,qs,P`
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
    `],F([p({type:Object})],H.prototype,"hass",2),F([p({type:String})],H.prototype,"areaId",2),F([p({type:Array})],H.prototype,"areaConfigs",2),F([p({type:Array})],H.prototype,"areas",2),F([p({type:Object})],H.prototype,"todayData",2),F([p({type:Object})],H.prototype,"globalConfig",2),F([p({type:Object})],H.prototype,"placeholderDefaults",2),F([p({type:Object})],H.prototype,"areasState",2),F([m()],H.prototype,"_areaPlaceholderDefaults",2),F([m()],H.prototype,"_isNewArea",2),F([m()],H.prototype,"_selectedChannelId",2),F([m()],H.prototype,"_areaEntities",2),F([m()],H.prototype,"_extractedEntities",2),F([m()],H.prototype,"_slotEditOpen",2),F([m()],H.prototype,"_inputsEditOpen",2),F([m()],H.prototype,"_activitiesEditOpen",2),F([m()],H.prototype,"_sensorsEditOpen",2),F([m()],H.prototype,"_areaLightsEditOpen",2),F([m()],H.prototype,"_rulesEditOpen",2),F([m()],H.prototype,"_editingSlotId",2),F([m()],H.prototype,"_hoveredTime",2),F([m()],H.prototype,"_hoveredChannelId",2),F([m()],H.prototype,"_tooltipX",2),F([m()],H.prototype,"_tooltipY",2),F([m()],H.prototype,"_resetDialogOpen",2),F([m()],H.prototype,"_globalDefaultsTemplate",2),F([m()],H.prototype,"_resetNodes",2),F([m()],H.prototype,"_slotTimes",2),H=F([L("twilight-area-detail-view")],H);var xr=Object.defineProperty,yr=Object.getOwnPropertyDescriptor,kt=(t,e,i,a)=>{for(var s=a>1?void 0:a?yr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&xr(e,i,s),s};function wr(t,e,i){var s;const a=(s=e==null?void 0:e.active_slots)==null?void 0:s[T];if(a)return t.find(o=>o.id===a);if(!e)return t.find(o=>Te(o,i))}let pt=class extends B{constructor(){super(...arguments),this.hass=null,this.globalConfigOverride=null,this._areaConfigs=[],this._areas=[],this._todayData=null,this._activeAreaId=null,this._view="overview",this._loading=!1,this._showAddAreaList=!1,this._areasState={},this._unsubAll=null,this._subscribeGeneration=0,this._globalConfig={},this._placeholderDefaults=null,this._areaSlotTimesMap={},this._subscribedConnection=null,this._clock=new di(this)}firstUpdated(t){super.firstUpdated(t),this._loadData(),this.hass&&this._subscribeAll()}updated(t){super.updated(t),t.has("hass")&&this.hass&&!this._areaConfigs.length&&!this._loading&&this._loadData(),t.has("hass")&&this.hass&&this.hass.connection!==this._subscribedConnection&&this._subscribeAll(),t.has("globalConfigOverride")&&this.globalConfigOverride&&(this._globalConfig=this.globalConfigOverride)}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribeAll(),this._areasState={}}async _loadData(){this._loading=!0;try{if(this.hass){const[t,e,i,a,s]=await Promise.all([ri(this.hass),oo(this.hass),Wi(this.hass),Ms(this.hass).catch(()=>({})),Fi(this.hass).catch(()=>null)]);this._areaConfigs=t.map(n=>({...n,activities:pa(n.activities)})),this._areas=e,this._todayData=i.day_data||null,this._globalConfig=a||{},this._placeholderDefaults=s;const o=Pt(),r={};await Promise.all(this._areaConfigs.map(async n=>{try{const c=await Ls(this.hass,{area_id:n.area_id,date:o});r[n.area_id]=c}catch{}})),this._areaSlotTimesMap=r}}finally{this._loading=!1}}_selectArea(t){this._activeAreaId=t,this._showAddAreaList=!1,this._view="config"}_subscribeAll(){if(this._unsubscribeAll(),!this.hass)return;this._subscribedConnection=this.hass.connection;const t=++this._subscribeGeneration;this.hass.connection.subscribeMessage(e=>{t===this._subscribeGeneration&&(this._areasState=e.full?e.areas||{}:{...this._areasState,...e.areas||{}})},{type:"twilight/subscribe_all"}).then(e=>{if(t!==this._subscribeGeneration){e();return}this._unsubAll=e},e=>{console.warn("Error subscribing to all areas",e)})}_unsubscribeAll(){this._subscribeGeneration++,this._subscribedConnection=null,this._unsubAll&&(this._unsubAll(),this._unsubAll=null)}_backToOverview(){this._view="overview",this._activeAreaId=null}_overviewEngineInfo(t,e){if(!e.enabled)return{label:"Disabled",color:"#888",sub:"Engine inactive"};if(!t)return{label:"Standby",color:"var(--secondary-text-color)",sub:"Idle"};const i=t.active_activity;if(i)return{label:i.charAt(0).toUpperCase()+i.slice(1),color:"#9c27b0",sub:`Activity: ${i}`};const a=t.scene_activated_at!==null;return{label:a?"Scene Active":"Idle",color:a?"#4caf50":"#2196f3",sub:a?"Scene switched by engine":"Waiting for input"}}_emitAreasChanged(){this.dispatchEvent(new CustomEvent("areas-changed",{detail:this._areaConfigs,bubbles:!0,composed:!0}))}render(){return this._loading?l`<div style="padding:24px;color:var(--secondary-text-color)">Loading…</div>`:this._view==="config"&&this._activeAreaId?l`
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
      `:this._renderOverview()}_buildAreaCardData(t){var J,D,st,et,at;const e=this._areas.find(N=>N.area_id===t.area_id),i=(J=this._areasState)==null?void 0:J[t.area_id],a=this._todayData,s=this._clock.liveMins,o=Pt(),r=this._areaSlotTimesMap[t.area_id],n=Us(t),c=[];for(const N of n){const ot=Q(t)[N],bt=((st=(D=r==null?void 0:r.channels)==null?void 0:D[N])==null?void 0:st[o])||[],W=Ge(bt,ye(t,N)),V=so(W),it=t.enabled&&(ot==null?void 0:ot.enabled)!==!1;c.push({id:N,name:(ot==null?void 0:ot.name)||(N===T?"Primary":N),slots:W,gradient:V,enabled:it})}const u=((at=(et=r==null?void 0:r.channels)==null?void 0:et[T])==null?void 0:at[o])||[],g=Ge(u,ye(t,T)),f=wr(g,i,s),d=t.enabled?(f==null?void 0:f.label)??"None":"Disabled",h=t.enabled?(f==null?void 0:f.color)??"rgba(255,255,255,0.15)":"#888",b=(f==null?void 0:f.id)==="day",w=t.enabled?b?"#141926":`color-mix(in srgb, ${h} 25%, #ffffff)`:"var(--secondary-text-color)",y=t.enabled?h:"rgba(255,255,255,0.05)",_=`--badge-border:${t.enabled?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.08)"};--badge-bg:${y};--badge-text:${w}`,C=this._overviewEngineInfo(i,t),S=(i==null?void 0:i.lights_on)??0,A=(i==null?void 0:i.lights_total)??0,k=(s/1440*100).toFixed(2),I=i==null?void 0:i.active_scene_names,x=[];if(i&&i.scene_activated_at!==null&&I)for(const N of n){const ot=I[N];if(ot){const bt=Q(t)[N],W=(bt==null?void 0:bt.name)||(N===T?"Primary":N);x.push({channelName:W,sceneName:ot})}}let O=9,j=9;c.length===1?(O=12,j=10):c.length===2?(O=11,j=10):c.length===3&&(O=10,j=9);const E=O/2,M=O+(O>=16?8:O>=12?6:5),G=c.length===1?0:O/2,z=`--row-height:${M}px;--bar-height:${O}px;--bar-radius:${E}px;--label-font-size:${j}px;--row-gap:${G}px;`;return{areaName:t.name||(e==null?void 0:e.name)||t.area_id,slotLabel:d,slotColor:h,badgeStyle:_,sparklineStyle:z,rows:c,liveLeft:k,engineInfo:C,lightsOn:S,lightsTotal:A,activeSceneItems:x,todayData:a}}_renderOverview(){const t=this._areaConfigs.length,e=this._areas.length,i=this._areas.filter(a=>!this._areaConfigs.some(s=>s.area_id===a.area_id));return l`
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
          ${this._areaConfigs.map(a=>{const s=this._buildAreaCardData(a);return l`
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
                  ${s.rows.length>0?l`
                    <div class="sparkline-wrapper">
                      ${s.rows.map(o=>l`
                        <div class="sparkline-row ${o.enabled?"":"disabled"}">
                          <span class="sparkline-label" title="${o.name}">${o.name}</span>
                          <div class="sparkline-bar-wrapper">
                            <div class="sparkline-bar" style="--bar-gradient:${o.gradient}"></div>
                          </div>
                        </div>
                      `)}
                      ${a.enabled&&s.todayData?l`
                        <div class="sparkline-indicator-line" style="left: calc(86px + (100% - 86px) * ${s.liveLeft} / 100)"></div>
                      `:""}
                    </div>
                  `:l`
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

                    ${(()=>{const o=s.lightsOn>0;return l`
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
                    ${s.activeSceneItems.length>0?l`
                      <div class="scenes-list">
                        ${s.activeSceneItems.map(o=>l`
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
                    `:l`
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

        ${this._showAddAreaList?l`
          <div class="add-area-list" style="margin-top:20px">
            <div class="add-area-list-header">
              <span>Select an area to configure:</span>
              <button class="close-add-btn" @click=${a=>{a.stopPropagation(),this._showAddAreaList=!1}}>×</button>
            </div>
            <div class="unconfigured-grid">
              ${i.map(a=>l`
                <div class="unconfigured-row" @click=${()=>this._selectArea(a.area_id)}>
                  <span class="unconfigured-name">${a.name}</span>
                  <span class="setup-badge">Setup</span>
                </div>
              `)}
              ${i.length===0?l`<div class="no-unconfigured">All areas are already configured!</div>`:""}
            </div>
          </div>
        `:""}
      </div>
    `}};pt.styles=[Yi,Ve,P`
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
    `],kt([p({type:Object})],pt.prototype,"hass",2),kt([p({type:Object})],pt.prototype,"globalConfigOverride",2),kt([m()],pt.prototype,"_areaConfigs",2),kt([m()],pt.prototype,"_areas",2),kt([m()],pt.prototype,"_todayData",2),kt([m()],pt.prototype,"_activeAreaId",2),kt([m()],pt.prototype,"_view",2),kt([m()],pt.prototype,"_loading",2),kt([m()],pt.prototype,"_showAddAreaList",2),kt([m()],pt.prototype,"_areasState",2),kt([m()],pt.prototype,"_globalConfig",2),kt([m()],pt.prototype,"_placeholderDefaults",2),kt([m()],pt.prototype,"_areaSlotTimesMap",2),pt=kt([L("twilight-areas-view")],pt);var $r=Object.defineProperty,Cr=Object.getOwnPropertyDescriptor,Ht=(t,e,i,a)=>{for(var s=a>1?void 0:a?Cr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&$r(e,i,s),s};const Ne=60,ba=15,ls=15,ma=25,_a={"1w":"1 Week","2w":"2 Weeks","1m":"1 Month","3m":"3 Months","6m":"6 Months"},xa={"1m":"1 Min","5m":"5 Min","10m":"10 Min","15m":"15 Min","30m":"30 Min","60m":"60 Min"},ya={"1m":{count:1440,duration:60},"5m":{count:288,duration:300},"10m":{count:144,duration:600},"15m":{count:96,duration:900},"30m":{count:48,duration:1800},"60m":{count:24,duration:3600}},wa={"1w":7,"2w":14,"1m":30,"3m":90,"6m":180},ds=5,$a=new Map;function kr(t){let e=$a.get(t);return e||(e=new Intl.DateTimeFormat("en-US",{timeZone:t,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1}),$a.set(t,e)),e}function Ca(t,e){const i=Object.fromEntries(kr(e).formatToParts(t).map(o=>[o.type,o.value])),a=Number(i.hour)%24,s=Date.UTC(Number(i.year),Number(i.month)-1,Number(i.day),a,Number(i.minute),Number(i.second));return Math.round((s-t.getTime())/1e3)}function ka(t,e){const i=Ca(t,e),a=Math.floor(t.getTime()/1e3)+i,s=Math.floor(a/86400)*86400,o=Ca(new Date(s*1e3),e);return s-o}function Sr(t,e,i,a,s=new Date){const o=Math.floor(s.getTime()/1e3),{duration:r,count:n}=ya[a],c=Array.from({length:7},()=>new Array(n).fill(0)),u=new Array(7).fill(0),g=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:e}),f={Mon:0,Tue:1,Wed:2,Thu:3,Fri:4,Sat:5,Sun:6},d=[];let h=[],b=-1;for(const y of t)y[0]<b&&(h.length>0&&d.push(h),h=[]),h.push(y),b=y[0];if(h.length>0&&d.push(h),d.length===0)return Array.from({length:7},()=>new Array(n).fill(0));for(let y=0;y<i;y++){const v=new Date(s.getTime()-y*24*60*60*1e3),_=ka(v,e),C=ka(new Date((_+25*3600)*1e3),e),S=Math.min(C,o);if(_>=S)continue;const A=f[g.format(new Date(_*1e3))]??0,k=[];for(const I of d){let x=0;for(const[E,M]of I)if(E<=_)x=M;else break;let O=_,j=x;for(const[E,M]of I)if(!(E<=_)){if(E>=S){k.push({start:O,end:S,val:j}),O=S;break}k.push({start:O,end:E,val:j}),O=E,j=M}O<S&&k.push({start:O,end:S,val:j})}for(let I=0;I<n;I++){const x=_+I*r,O=x+r;if(x>=S)continue;const j=Math.min(O,S),E=j-x;if(E<=0)continue;let M=0;for(const z of k){const J=Math.max(z.start,x),D=Math.min(z.end,j);J<D&&z.val===1&&(M+=D-J)}const G=Math.min(1,M/E);c[A][I]+=G}u[A]++}const w=Array.from({length:7},()=>new Array(n).fill(0));for(let y=0;y<7;y++){const v=u[y];for(let _=0;_<n;_++)w[y][_]=v>0?c[y][_]/v:0}return w}let St=class extends B{constructor(){super(...arguments),this.hass=null,this.activeAreaId=null,this._activeMode="motion",this._activeRange="1w",this._activeResolution="10m",this._loading=!1,this._motionData=[],this._lightData=[],this._profiles=[],this._activeSource="live",this._w=0,this._dialogs=new we(this),this._ro=null,this._loadGuard=new ni}get _activeProfile(){return this._activeSource==="live"?null:this._profiles.find(t=>t.id===this._activeSource)??null}disconnectedCallback(){var t;(t=this._ro)==null||t.disconnect(),this._ro=null,super.disconnectedCallback()}updated(t){var s;if(!this._ro){const o=(s=this.shadowRoot)==null?void 0:s.querySelector(".canvas-wrap");o&&(this._ro=new ResizeObserver(r=>{const n=r[0].contentRect.width;n>0&&n!==this._w&&(this._w=n,this._draw())}),this._ro.observe(o))}const e=t.has("hass")&&!t.get("hass")&&this.hass,i=t.has("activeAreaId")&&t.get("activeAreaId")!==this.activeAreaId,a=t.has("_activeRange");(e||i||a)&&this._load(),(t.has("_motionData")||t.has("_lightData")||t.has("_activeMode")||t.has("_activeResolution")||t.has("_activeSource")||t.has("_profiles")||t.has("_w"))&&requestAnimationFrame(()=>this._draw())}async _loadProfiles(t){if(!(!this.hass||!this.activeAreaId))try{const e=await ri(this.hass);if(t&&!t.isCurrent())return;const i=e.find(a=>a.area_id===this.activeAreaId);this._profiles=(i==null?void 0:i.heatmap_profiles)??[]}catch(e){console.error("Twilight heatmap profiles load error:",e)}}async _load(){if(!this.hass||!this.activeAreaId)return;this._loading=!0;const t=this._loadGuard.begin();try{const[e]=await Promise.all([fo(this.hass,{area_id:this.activeAreaId,days:wa[this._activeRange],binary_only:!0}),this._loadProfiles(t)]);if(!t.isCurrent())return;this._motionData=e.motion??[],this._lightData=e.light_on??[]}catch(e){console.error("Twilight heatmap load error:",e)}finally{t.isCurrent()&&(this._loading=!1)}}async _saveCurrentProfile(){if(!this.hass||!this.activeAreaId)return;if(this._profiles.length>=ds){await this._dialogs.showAlert("Limit Reached",`Maximum ${ds} saved heatmap profiles allowed per area.`);return}const t=this._activeResolution==="1m"?"5m":this._activeResolution,e=await this._dialogs.showPrompt("Save Heatmap Profile","Workweek Profile","Profile Name");if(e)try{await js(this.hass,{area_id:this.activeAreaId,name:e,resolution:t,range:this._activeRange}),await this._loadProfiles()}catch(i){await this._dialogs.showAlert("Error",`Failed to save profile: ${i.message}`)}}async _updateProfile(t){if(!(!this.hass||!this.activeAreaId))try{await js(this.hass,{area_id:this.activeAreaId,name:t.name,resolution:t.resolution,range:t.range,profile_id:t.id}),await this._loadProfiles(),await this._dialogs.showAlert("Updated",`Profile "${t.name}" recalculated from current recorder history.`)}catch(e){await this._dialogs.showAlert("Error",`Failed to update profile: ${e.message}`)}}async _deleteProfile(t){if(!(!this.hass||!this.activeAreaId||!await this._dialogs.showConfirm("Delete Profile",`Delete profile "${t.name}"?`)))try{await vo(this.hass,{area_id:this.activeAreaId,profile_id:t.id}),this._activeSource===t.id&&this._setSource("live"),await this._loadProfiles()}catch(i){await this._dialogs.showAlert("Error",`Failed to delete profile: ${i.message}`)}}_setSource(t){this._activeSource=t;const e=t==="live"?null:this._profiles.find(i=>i.id===t);e&&(this._activeMode="motion",this._activeResolution=e.resolution,this._activeRange=e.range)}_setMode(t){this._activeProfile||(this._activeMode=t)}_setRange(t){this._activeProfile||(this._activeRange=t)}_setResolution(t){this._activeProfile||(this._activeResolution=t)}_getFillColorRGB(){const t=this._activeMode==="motion"?"--tw-chart-motion":"--tw-chart-light-on",e=this._activeMode==="motion"?"#00e5ff":"#ff9100",i=getComputedStyle(this).getPropertyValue(t).trim()||e;if(i.startsWith("#")){const s=parseInt(i.slice(1,3),16),o=parseInt(i.slice(3,5),16),r=parseInt(i.slice(5,7),16);return`${s}, ${o}, ${r}`}const a=i.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);return a?`${a[1]}, ${a[2]}, ${a[3]}`:this._activeMode==="motion"?"0, 176, 255":"255, 145, 0"}_getTextColor(){return getComputedStyle(this).getPropertyValue("--primary-text-color").trim()||"rgba(255,255,255,0.9)"}_getGridColor(){return getComputedStyle(this).getPropertyValue("--divider-color").trim()||"rgba(128,128,128,0.2)"}_getAxisFont(){return`400 11px ${getComputedStyle(this).getPropertyValue("--font-family").trim()||"system-ui, sans-serif"}`}_profileDensities(t,e){return Array.from({length:7},(i,a)=>{const s=t.motion_buckets[String(a)]??[];return Array.from({length:e},(o,r)=>s[r]??0)})}_draw(){var S,A;const t=(S=this.shadowRoot)==null?void 0:S.querySelector("canvas");if(!t||!this._w||!this.hass)return;const e=this._w,i=t.getBoundingClientRect().height;if(!i)return;const a=Bi(t,e,i),s=e-Ne-ba,r=(i-ls-ma)/7,n=this.hass.config.time_zone||"UTC",c=((A=this.hass.locale)==null?void 0:A.language)||navigator.language||"en-US",u=new Date,f=(u.getUTCDay()+6)%7,d=new Date(Date.UTC(u.getUTCFullYear(),u.getUTCMonth(),u.getUTCDate()-f)),h=Array.from({length:7},(k,I)=>{const x=new Date(d.getTime()+I*24*60*60*1e3);return new Intl.DateTimeFormat(c,{weekday:"short",timeZone:n}).format(x)}),b=this._activeProfile,{count:w}=ya[this._activeResolution];let y;if(b)y=this._profileDensities(b,w);else{const k=this._activeMode==="motion"?this._motionData:this._lightData;if(!k||k.length===0){a.restore();return}y=Sr(k,n,wa[this._activeRange],this._activeResolution)}if(!y){a.restore();return}const v=this._getFillColorRGB(),_=this._getTextColor(),C=this._getGridColor();a.font=this._getAxisFont();for(let k=0;k<7;k++){const I=ls+k*r;a.fillStyle=_,a.textAlign="right",a.fillText(h[k],Ne-10,I+r/2+4),k>0&&(a.strokeStyle=C,a.beginPath(),a.moveTo(Ne,I),a.lineTo(e-ba,I),a.stroke());for(let x=0;x<w;x++){const O=y[k][x];if(O>0){const j=Ne+x/w*s,E=s/w+.5,M=r-2;let G=0;this._activeMode==="motion"?G=Math.min(1,Math.sqrt(O)*1.8):G=Math.min(1,O*1.2),a.fillStyle=`rgba(${v}, ${G})`,a.fillRect(j,I+1,E,M)}}}a.strokeStyle=C,a.lineWidth=1;for(let k=0;k<=24;k+=2){const I=Ne+k/24*s;a.beginPath(),a.moveTo(I,ls),a.lineTo(I,i-ma),a.stroke()}a.fillStyle=_;for(let k=0;k<=24;k+=4){const I=Ne+k/24*s,x=`${k.toString().padStart(2,"0")}:00`;a.textAlign=k===0?"start":k===24?"end":"center",a.fillText(x,I,i-8)}a.restore()}render(){var a;const t=this._activeProfile,e=t!==null,i=e?Object.keys(t.motion_buckets).length>0:((a=this._activeMode==="motion"?this._motionData:this._lightData)==null?void 0:a.length)>0;return l`
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
            ${this._profiles.map(s=>l`
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
            ${Object.keys(xa).map(s=>l`
              <button
                class="toggle-btn ${this._activeResolution===s?"active":""}"
                ?disabled=${e}
                @click=${()=>this._setResolution(s)}
              >
                ${xa[s]}
              </button>
            `)}
          </div>
          <div class="toggle-group">
            ${Object.keys(_a).map(s=>l`
              <button
                class="toggle-btn ${this._activeRange===s?"active":""}"
                ?disabled=${e}
                @click=${()=>this._setRange(s)}
              >
                ${_a[s]}
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
          ${this._profiles.map(s=>l`
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
          ${this._profiles.length<ds?l`
                <button class="save-profile-btn" @click=${this._saveCurrentProfile}>
                  + Save Profile
                </button>
              `:""}
        </div>
      </div>

      <div class="canvas-wrap">
        ${!i&&!this._loading?l`<div class="no-data">No activity data available for the selected period</div>`:l`<canvas></canvas>`}
        ${this._loading?l`<div class="loading-overlay">Loading heatmap data…</div>`:""}
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
    `}};St.styles=[Kt,P`
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
  `],Ht([p({attribute:!1})],St.prototype,"hass",2),Ht([p({type:String})],St.prototype,"activeAreaId",2),Ht([m()],St.prototype,"_activeMode",2),Ht([m()],St.prototype,"_activeRange",2),Ht([m()],St.prototype,"_activeResolution",2),Ht([m()],St.prototype,"_loading",2),Ht([m()],St.prototype,"_motionData",2),Ht([m()],St.prototype,"_lightData",2),Ht([m()],St.prototype,"_profiles",2),Ht([m()],St.prototype,"_activeSource",2),Ht([m()],St.prototype,"_w",2),St=Ht([L("twilight-heatmap-card")],St);var Dr=Object.defineProperty,Ar=Object.getOwnPropertyDescriptor,Ke=(t,e,i,a)=>{for(var s=a>1?void 0:a?Ar(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Dr(e,i,s),s};let ke=class extends B{constructor(){super(...arguments),this.hass=null,this._areaConfigs=[],this._activeAreaId=null,this._loading=!0}firstUpdated(t){super.firstUpdated(t),this._loadAreas()}updated(t){super.updated(t),t.has("hass")&&this.hass&&this._areaConfigs.length===0&&this._loadAreas()}async _loadAreas(){if(this.hass)try{const t=await ri(this.hass);this._areaConfigs=t,t.length>0&&!this._activeAreaId&&(this._activeAreaId=t[0].area_id)}catch(t){console.error("Failed to load areaConfigs for analytics",t)}finally{this._loading=!1}}render(){return this._loading?l`<div class="loading-state" style="padding: 24px; color: var(--secondary-text-color);">Loading areaConfigs…</div>`:l`
      <!-- Header Grid (1 Row, 12 columns, max 6 items) -->
      <div class="view-header-container">
        <div class="view-header-grid analytics-header">
          <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
            <h2 style="margin:0; font-size:20px; font-weight:500; color:var(--primary-text-color);">Analytics</h2>
          </div>
          <div style="display: flex; align-items: center; justify-content: flex-end; gap: 12px; flex-shrink: 0;">
            ${this._areaConfigs.length>0?l`
              <select
                class="area-select"
                @change=${t=>this._activeAreaId=t.target.value}
              >
                ${this._areaConfigs.map(t=>l`
                  <option value="${t.area_id}" ?selected=${this._activeAreaId===t.area_id}>${t.name||t.area_id}</option>
                `)}
              </select>
            `:l`<span style="color:var(--secondary-text-color);font-size:13px">No areas configured</span>`}
          </div>
        </div>
      </div>

      <!-- Main Content Grid (12 columns) -->
      <div class="view-content-container">
        <div class="view-content-grid">
          ${this._areaConfigs.length===0?l`<div class="span-12 no-areaConfigs">No areaConfigs configured. Go to "Areas" tab to configure an area.</div>`:l`
              <div class="span-12">
                <twilight-heatmap-card
                  .hass=${this.hass}
                  .activeAreaId=${this._activeAreaId}
                ></twilight-heatmap-card>
              </div>
            `}
        </div>
      </div>
    `}};ke.styles=[Ve,P`
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

    .analytics-header {
      display: flex !important;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      width: 100%;
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
  `],Ke([p({attribute:!1})],ke.prototype,"hass",2),Ke([m()],ke.prototype,"_areaConfigs",2),Ke([m()],ke.prototype,"_activeAreaId",2),Ke([m()],ke.prototype,"_loading",2),ke=Ke([L("twilight-analytics-view")],ke);var Er=Object.defineProperty,Tr=Object.getOwnPropertyDescriptor,nt=(t,e,i,a)=>{for(var s=a>1?void 0:a?Tr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Er(e,i,s),s};const vi=50,bi=20,Sa=0,Da=30,cs=300;let tt=class extends B{constructor(){super(...arguments),this.hass=null,this.year=new Date().getFullYear(),this.selectedDate=Pt(),this.clamped=!1,this.noHeader=!1,this.noAxisLabels=!1,this.showSlots=!1,this.noSolarNoonMidnight=!1,this.scatterMode=!1,this.sunData=null,this.hoverTime=null,this.hoverIdx=null,this.days=[],this.slotCurves=null,this.liveTime=null,this._loading=!1,this._w=0,this._ro=null}connectedCallback(){super.connectedCallback()}disconnectedCallback(){var t;(t=this._ro)==null||t.disconnect(),super.disconnectedCallback()}updated(t){var i;if(!this._ro){const a=(i=this.shadowRoot)==null?void 0:i.querySelector(".wrap");a&&(this._ro=new ResizeObserver(s=>{const o=s[0].contentRect.width;o>0&&o!==this._w&&(this._w=o,this._draw())}),this._ro.observe(a))}(t.has("hass")||t.has("year"))&&this.hass&&!this.days.length&&!this._loading&&this._load(),(t.has("days")||t.has("selectedDate")||t.has("clamped")||t.has("showSlots")||t.has("noSolarNoonMidnight")||t.has("scatterMode")||t.has("sunData")||t.has("hoverIdx")||t.has("liveTime")||t.has("slotCurves"))&&requestAnimationFrame(()=>this._draw())}async _load(){if(this.hass){this._loading=!0;try{const t=await Rs(this.hass,{year:this.year});this.days=t.days}catch(t){console.error("Year load failed",t)}finally{this._loading=!1}}}_getLiveTime(){const t=new Date;return t.getHours()*60+t.getMinutes()+t.getSeconds()/60}_todayIdx(){return this.days.findIndex(t=>t.date===Pt())}_interpolateEl(t){var e;return Ys(((e=this.sunData)==null?void 0:e.points)??[],t)}_draw(){var I;const t=(I=this.shadowRoot)==null?void 0:I.querySelector("canvas");if(!t)return;const e=this.days,i=e.length;if(!i||!this._w)return;const a=this._w,s=t.getBoundingClientRect().height||cs,o=Bi(t,a,s),r=this.noAxisLabels?10:vi,n=this.noAxisLabels?10:bi,c=this.noAxisLabels?10:Sa,u=this.noAxisLabels?10:Da,g=a-r-n,f=s-c-u,d=c,h=c+f,b=r,w=r+g,y=1440,v=x=>d+f-Math.max(0,Math.min(y,x))/y*f;if(o.save(),o.beginPath(),o.roundRect(b,d,g,f,8),o.fillStyle=_t,o.fill(),o.restore(),o.save(),o.beginPath(),o.roundRect(b,d,g,f,8),o.clip(),this.scatterMode){const x=(O,j,E)=>{const M=e.map(D=>D[j]),G=e.map(D=>D[E]);o.strokeStyle=O,o.lineWidth=1;let z=[];const J=D=>{if(!D.length)return;o.beginPath();let st=!1,et=0,at=0,N=0;const ot=(W,V)=>{o.moveTo(W,V),st=!0,et=(V-d)/f*y|0,at=W,N=V},bt=(W,V,it,ht)=>{const zt=Math.abs(it-et),K=Mt=>Mt>0&&Mt<i&&e[Mt].tz_offset!==e[Mt-1].tz_offset,Se=K(ht)||K(ht-1)||K(ht+1);if(zt>120)ot(W,V);else if(Se&&zt>30){const Mt=(at+W)/2;o.lineTo(Mt,N),o.moveTo(Mt,V),o.lineTo(W,V),et=it,at=W,N=V}else o.lineTo(W,V),et=it,at=W,N=V};for(const W of D){const V=M[W];if(V===null)continue;const it=b+W/(i-1)*g,ht=(V%1440+1440)%1440,zt=v(ht);st?bt(it,zt,ht,W):ot(it,zt)}for(let W=D.length-1;W>=0;W--){const V=D[W],it=G[V];if(it===null)continue;const ht=b+V/(i-1)*g,zt=(it%1440+1440)%1440,K=v(zt);st?bt(ht,K,zt,V):ot(ht,K)}o.stroke()};for(let D=0;D<i;D++)M[D]!==null&&G[D]!==null?z.push(D):z.length&&(J(z),z=[]);z.length&&J(z)};x(Ut,"astro_dawn","astro_dusk"),x(Bt,"nautical_dawn","nautical_dusk"),x(Ft,"dawn","dusk"),x(ee,"sunrise","sunset")}else{const x=this.clamped,O=this.slotCurves,j=E=>x&&O?Co(e[E],O,E):e[E];for(let E=0;E<i;E++){const M=j(E),G=E>0?j(E-1):null,z=E===0?b:b+(E-.5)/(i-1)*g,D=(E===i-1?w:b+(E+.5)/(i-1)*g)-z+.5,st=x?Ji(M):Zi(M);if(st.length===0){o.fillStyle=Xi(M.midnight_el),o.fillRect(z,d,D,f);continue}const et=[...st];G&&ts(et,G,M,x),et.sort((at,N)=>at.t-N.t),ko(o,z,D,et,Qi(G,M,x),v,y)}}const _=(x,O,j=1.5,E)=>{o.save(),o.strokeStyle=x,o.lineWidth=j,E&&(o.shadowColor=E,o.shadowBlur=8),o.beginPath();const M=z=>z===0?b:b+(z-.5)/(i-1)*g,G=z=>z===i-1?w:b+(z+.5)/(i-1)*g;for(let z=0;z<i;z++){const J=O[z];if(J===null)continue;const D=v((J%y+y)%y);o.moveTo(M(z),D),o.lineTo(G(z),D)}o.stroke(),o.restore()};if(this.noSolarNoonMidnight||(_("rgba(255,214,0,1)",e.map(x=>x.solar_noon),1.5,"rgba(255, 214, 0, 0.6)"),_("rgba(60,100,200,1)",e.map(x=>x.solar_midnight))),this.showSlots)if(this.slotCurves){const x=this.slotCurves;_("rgba(255,255,255,0.75)",x.civil_dusk??[]),_("rgba(255,255,255,0.60)",x.nautical_dusk??[]),_("rgba(255,255,255,0.45)",x.astro_dusk??[]),_("rgba(255,255,255,0.30)",x.night??[]),_("rgba(255,255,255,0.30)",x.astro_dawn??[]),_("rgba(255,255,255,0.45)",x.nautical_dawn??[]),_("rgba(255,255,255,0.60)",x.civil_dawn??[]),_("rgba(255,255,255,0.75)",x.gold_dawn??[]),_("rgba(255,255,255,0.75)",x.day??[]),_("rgba(255,255,255,0.75)",x.gold_dusk??[])}else _("rgba(255,255,255,0.75)",e.map(x=>x.slot_sunset)),_("rgba(255,255,255,0.60)",e.map(x=>x.slot_nautical_dusk)),_("rgba(255,255,255,0.45)",e.map(x=>x.slot_astro_dusk)),_("rgba(255,255,255,0.30)",e.map(x=>x.slot_night)),_("rgba(255,255,255,0.30)",e.map(x=>x.slot_astro_dawn)),_("rgba(255,255,255,0.45)",e.map(x=>x.slot_nautical_dawn)),_("rgba(255,255,255,0.60)",e.map(x=>x.slot_civil_dawn)),_("rgba(255,255,255,0.75)",e.map(x=>x.slot_sunrise)),_("rgba(255,255,255,0.75)",e.map(x=>x.slot_gold_dawn)),_("rgba(255,255,255,0.75)",e.map(x=>x.slot_day)),_("rgba(255,255,255,0.75)",e.map(x=>x.slot_gold_dusk));const C=this._todayIdx();if(C>=0){const x=b+C/(i-1)*g;o.save(),o.strokeStyle="rgba(255,255,255,0.55)",o.lineWidth=1.5,o.setLineDash([4,3]),o.beginPath(),o.moveTo(x,d),o.lineTo(x,h),o.stroke(),o.restore()}const S=this.days.findIndex(x=>x.date===this.selectedDate);if(S>=0&&S!==C){const x=b+S/(i-1)*g;o.save(),o.strokeStyle="rgba(255,255,255,0.4)",o.lineWidth=1,o.setLineDash([2,2]),o.beginPath(),o.moveTo(x,d),o.lineTo(x,h),o.stroke(),o.restore()}o.restore(),o.save(),o.beginPath(),o.roundRect(b,d,g,f,8),o.strokeStyle=Vs(this),o.lineWidth=1,o.stroke(),o.restore();const A=this.liveTime??this._getLiveTime();let k=S;if(k===-1&&(k=C),k>=0&&k<i){const x=b+k/(i-1)*g,O=v(A),j=this._interpolateEl(A);j>=0?Xs(o,x,O):j>=-6?Zs(o,x,O):Ks(o,x,O)}o.restore()}_renderAxis(){var S;const t=this._w;if(!t)return Dt``;const e=(S=this.shadowRoot)==null?void 0:S.querySelector("canvas"),i=e&&e.getBoundingClientRect().height||cs,a=this.noAxisLabels?10:vi,s=this.noAxisLabels?10:bi,o=this.noAxisLabels?10:Sa,r=this.noAxisLabels?10:Da,n=t-a-s,c=i-o-r,u=o,g=o+c,f=A=>u+c-A/1440*c,d=this.days.length||365,h=Array.from({length:13},(A,k)=>k*2).map(A=>{const k=f(A*60),I=A%6===0&&A!==0&&A!==24,x=A!==0&&A!==24;return Dt`
        ${I&&!this.noAxisLabels?Dt`<text x=${a-6} y=${k} text-anchor="end" dominant-baseline="middle" class="axis-label" style="font: ${hi(this)}">${String(A).padStart(1,"0")}:00</text>`:Dt``}
        ${x?Dt`<line x1=${a} y1=${k} x2=${a+n} y2=${k} class="grid-line" stroke-width="0.5" clip-path="url(#rect-clip)"/>`:Dt``}
      `}),b=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],w=[0,31,59,90,120,151,181,212,243,273,304,334],y=[15,45,74,105,135,166,196,227,258,288,319,349],v=b.map((A,k)=>{const I=a+Math.min(w[k],d-1)/(d-1)*n,x=a+Math.min(y[k],d-1)/(d-1)*n;return Dt`
        ${k>0?Dt`<line x1=${I} y1=${u} x2=${I} y2=${g} class="grid-line" stroke-width="0.5" clip-path="url(#rect-clip)"/>`:Dt``}
        ${this.noAxisLabels?Dt``:Dt`<text x=${x} y=${g+20} text-anchor="middle" class="axis-label" style="font: ${hi(this)}">${A}</text>`}`}),_=this.hoverIdx!==null?this.days[this.hoverIdx]:null,C=_?a+this.hoverIdx/(d-1)*n:null;return Dt`
      <svg class="overlay" width="100%" height="100%">
        <defs>
          <clipPath id="rect-clip">
            <rect x=${a} y=${u} width=${n} height=${c} rx="8" ry="8" />
          </clipPath>
        </defs>
        ${h}
        ${v}
        ${C!==null&&_?Dt`
          <line x1=${C} y1=${u} x2=${C} y2=${g} stroke="rgba(255,255,255,0.28)" stroke-width="1" stroke-dasharray="3 3" clip-path="url(#rect-clip)"/>
        `:""}
      </svg>
    `}_onMove(t){if(!this._w)return;const e=t.currentTarget.getBoundingClientRect(),i=this.noAxisLabels?10:vi,a=this.noAxisLabels?10:bi,s=this._w-i-a,o=t.clientX-e.left;this.hoverIdx=Math.round(Math.max(0,Math.min(1,(o-i)/s))*(this.days.length-1));const r=this.days[this.hoverIdx];this.dispatchEvent(new CustomEvent("year-hover-changed",{detail:{index:this.hoverIdx,date:r?r.date:null},bubbles:!0,composed:!0}))}_onLeave(){this.hoverIdx=null,this.dispatchEvent(new CustomEvent("year-hover-changed",{detail:{index:null,date:null},bubbles:!0,composed:!0}))}_onClick(){if(this.hoverIdx!==null&&this.days[this.hoverIdx]){const t=this.days[this.hoverIdx].date;this.dispatchEvent(new CustomEvent("date-selected",{detail:t,bubbles:!0,composed:!0}))}}_onTouchMove(t){if(!this._w)return;const e=t.touches[0],i=t.currentTarget.getBoundingClientRect(),a=this.noAxisLabels?10:vi,s=this.noAxisLabels?10:bi,o=this._w-a-s,r=e.clientX-i.left;this.hoverIdx=Math.round(Math.max(0,Math.min(1,(r-a)/o))*(this.days.length-1));const n=this.days[this.hoverIdx];this.dispatchEvent(new CustomEvent("year-hover-changed",{detail:{index:this.hoverIdx,date:n?n.date:null},bubbles:!0,composed:!0}))}_onTouchEnd(){this.hoverIdx=null,this.dispatchEvent(new CustomEvent("year-hover-changed",{detail:{index:null,date:null},bubbles:!0,composed:!0}))}render(){return l`
      ${this.noHeader?"":l`
        <div class="card-header">
          <span class="card-dot" style="--dot-color: #f59e0b;"></span>
          <span class="card-title">Year overview</span>
        </div>
      `}
      <div class="wrap">
        ${this._loading?l`<div class="loading"><ha-circular-progress active size="small"></ha-circular-progress></div>`:l`
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
    `}};tt.styles=[Kt,P`
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
  `],nt([p({attribute:!1})],tt.prototype,"hass",2),nt([p({type:Number})],tt.prototype,"year",2),nt([p({type:String})],tt.prototype,"selectedDate",2),nt([p({type:Boolean})],tt.prototype,"clamped",2),nt([p({type:Boolean})],tt.prototype,"noHeader",2),nt([p({type:Boolean})],tt.prototype,"noAxisLabels",2),nt([p({type:Boolean})],tt.prototype,"showSlots",2),nt([p({type:Boolean})],tt.prototype,"noSolarNoonMidnight",2),nt([p({type:Boolean})],tt.prototype,"scatterMode",2),nt([p({attribute:!1})],tt.prototype,"sunData",2),nt([p({attribute:!1})],tt.prototype,"hoverTime",2),nt([p({type:Number})],tt.prototype,"hoverIdx",2),nt([p({attribute:!1})],tt.prototype,"days",2),nt([p({attribute:!1})],tt.prototype,"slotCurves",2),nt([p({type:Number})],tt.prototype,"liveTime",2),nt([m()],tt.prototype,"_loading",2),nt([m()],tt.prototype,"_w",2),tt=nt([L("twilight-sun-year-card")],tt);var Or=Object.defineProperty,Ir=Object.getOwnPropertyDescriptor,Z=(t,e,i,a)=>{for(var s=a>1?void 0:a?Ir(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Or(e,i,s),s};const ps=[{name:"North Pole",lat:90,lon:0,tz:"UTC"},{name:"Qaanaaq",lat:77.47,lon:-69.23,tz:"America/Thule"},{name:"Reykjavík",lat:64.13,lon:-21.9,tz:"Atlantic/Reykjavik"},{name:"Helsinki",lat:60.17,lon:24.94,tz:"Europe/Helsinki"},{name:"Hamburg",lat:53.55,lon:9.99,tz:"Europe/Berlin"},{name:"Paris",lat:48.85,lon:2.35,tz:"Europe/Paris"},{name:"New York",lat:40.71,lon:-74.01,tz:"America/New_York"},{name:"Tokyo",lat:35.68,lon:139.69,tz:"Asia/Tokyo"},{name:"Cairo",lat:30.05,lon:31.24,tz:"Africa/Cairo"},{name:"Honolulu",lat:21.31,lon:-157.86,tz:"Pacific/Honolulu"},{name:"Equator",lat:0,lon:0,tz:"UTC"},{name:"Nairobi",lat:-1.29,lon:36.82,tz:"Africa/Nairobi"},{name:"Santiago",lat:-33.45,lon:-70.67,tz:"America/Santiago"},{name:"Cape Town",lat:-33.93,lon:18.42,tz:"Africa/Johannesburg"},{name:"Auckland",lat:-36.85,lon:174.76,tz:"Pacific/Auckland"},{name:"Ushuaia",lat:-54.8,lon:-68.3,tz:"America/Argentina/Ushuaia"},{name:"McMurdo Station",lat:-77.85,lon:166.67,tz:"Pacific/Auckland"},{name:"South Pole",lat:-90,lon:0,tz:"UTC"}],Aa=[10,25,50,100,250];let X=class extends B{constructor(){super(...arguments),this.hass=null,this._days=[],this._year=new Date().getFullYear(),this._loading=!1,this._error="",this._hoverIdx=null,this._selectedDate=Pt(),this._sunData=null,this._hoverTime=null,this._scrubbing=!1,this._isDark=!1,this._demoLocationIdx=-1,this._demoPlaying=!1,this._demoDayIdx=0,this._demoSpeed=Aa[2]||50,this._clamped=!1,this._showSlots=!1,this._slotCurves=null,this._areas=[],this._selectedAreaId=null,this._channelSlotsMap=void 0,this._updateInterval=null,this._demoInterval=null,this._dayCache=new Map,this._channelSlotsCache=new Map,this._lastLoadDayTime=0,this._loadDayTimeout=null,this._yearGuard=new ni}connectedCallback(){super.connectedCallback(),this._updateInterval=window.setInterval(()=>{this._scrubbing||this.requestUpdate()},1e3)}disconnectedCallback(){this._updateInterval&&clearInterval(this._updateInterval),this._stopDemo(),this._loadDayTimeout&&(clearTimeout(this._loadDayTimeout),this._loadDayTimeout=null),super.disconnectedCallback()}updated(t){if(t.has("hass")&&this.hass){const e=sa(this.hass,this);e!==this._isDark&&(this._isDark=e,this.toggleAttribute("dark",e))}t.has("hass")&&this.hass&&!this._areas.length&&this._loadAreas(),t.has("hass")&&this.hass&&!this._days.length&&!this._loading&&this._loadYear(),t.has("_selectedDate")&&this.hass&&this._selectedDate&&this._loadDay()}async _loadAreas(){if(this.hass)try{this._areas=await ri(this.hass)}catch(t){console.error("Failed to load areas for timeline view",t)}}_locParams(){const t=ps[this._demoLocationIdx];return t?{lat:t.lat,lon:t.lon,tz:t.tz}:{}}async _loadYear(){var e;if(!this.hass)return;this._loading=!0,this._error="";const t=this._yearGuard.begin();try{const[i,a]=await Promise.all([Rs(this.hass,{year:this._year,...this._locParams()}),uo(this.hass,{year:this._year,...this._locParams(),area_id:this._selectedAreaId??void 0}).catch(()=>null)]);if(!t.isCurrent())return;this._days=i.days,this._year=i.year,this._slotCurves=(a==null?void 0:a.curves)??null;const s=Pt();this._selectedDate=this._days.some(o=>o.date===s)?s:((e=this._days[0])==null?void 0:e.date)??s}catch(i){t.isCurrent()&&(this._error=i instanceof Error?i.message:String(i))}finally{t.isCurrent()&&(this._loading=!1)}}_loadDay(){this._loadDayTimeout&&(clearTimeout(this._loadDayTimeout),this._loadDayTimeout=null);const t=`${this._demoLocationIdx}_${this._selectedAreaId}_${this._selectedDate}`;if(this._demoPlaying&&this._dayCache.has(t)){this._sunData=this._dayCache.get(t),this._channelSlotsMap=this._channelSlotsCache.get(t);return}if(this._dayCache.has(t)){this._sunData=this._dayCache.get(t),this._channelSlotsMap=this._channelSlotsCache.get(t);return}const i=Date.now()-this._lastLoadDayTime,a=10;i>=a?this._executeLoadDay():this._loadDayTimeout=window.setTimeout(()=>{this._executeLoadDay()},a-i)}async _executeLoadDay(){if(!this.hass||!this._selectedDate)return;this._lastLoadDayTime=Date.now();const t=this._selectedDate,e=`${this._demoLocationIdx}_${this._selectedAreaId}_${t}`;try{const i=await Wi(this.hass,{date:t,...this._locParams()});this._dayCache.set(e,i),this._selectedDate===t&&(this._sunData=i)}catch{this._selectedDate===t&&(this._sunData=null)}await this._loadChannelSlots(t)}async _loadChannelSlots(t){if(!this.hass||!this._selectedAreaId){this._channelSlotsMap=void 0;return}const e=this._areas.find(s=>s.area_id===this._selectedAreaId);if(!e){this._channelSlotsMap=void 0;return}const i=`${this._demoLocationIdx}_${this._selectedAreaId}_${t}`,a=Object.entries(Q(e));try{const s=await Promise.all(a.map(([,r])=>qi(this.hass,{slots:r.slots||[],date:t}))),o={};a.forEach(([r,n],c)=>{o[r]=Ge(s[c].slots,n.slots||[])}),this._channelSlotsCache.set(i,o),this._selectedDate===t&&(this._channelSlotsMap=o)}catch(s){console.error("Failed to load channel slots for timeline area selection",s),this._selectedDate===t&&(this._channelSlotsMap=void 0)}}_stopDemo(){this._demoInterval&&(clearInterval(this._demoInterval),this._demoInterval=null),this._demoPlaying=!1}_toggleDemo(){if(this._demoPlaying){this._stopDemo();return}this._demoPlaying=!0,this._demoDayIdx=0,this._advanceDemoDay(),this._demoInterval=window.setInterval(()=>this._advanceDemoDay(),this._demoSpeed)}_changeDemoSpeed(t){this._demoSpeed=t,this._demoPlaying&&(this._demoInterval&&clearInterval(this._demoInterval),this._demoInterval=window.setInterval(()=>this._advanceDemoDay(),this._demoSpeed))}_advanceDemoDay(){if(!this._days.length)return;const t=Math.min(this._demoDayIdx,this._days.length-1);this._selectedDate=this._days[t].date,this._demoDayIdx++,this._demoDayIdx>=this._days.length&&this._stopDemo()}async _selectLocation(t){this._stopDemo(),this._demoLocationIdx=t,t!==-1&&(this._selectedAreaId=null),this._days=[],this._sunData=null,await this._loadYear(),await this._loadDay()}async _selectArea(t){this._stopDemo(),this._selectedAreaId=t,t!==null&&(this._demoLocationIdx=-1),this._days=[],this._sunData=null,await this._loadYear(),await this._loadDay()}_toggleClamped(){this._clamped=!this._clamped}_toggleSlots(){this._showSlots=!this._showSlots}_fmt(t){if(t===null)return"—";const e=Math.round((t%1440+1440)%1440),i=Math.floor(e/60)%24,a=e%60;return`${String(i).padStart(2,"0")}:${String(a).padStart(2,"0")}`}_fmtDur(t){if(t===null||t<0)return"—";const e=Math.floor(t/60),i=Math.round(t%60);return e>0&&i>0?`${e}h ${i}min`:e>0?`${e}h`:`${i}min`}_getLiveTime(){var a,s,o;const t=ps[this._demoLocationIdx],e=(t==null?void 0:t.tz)??void 0,i=new Date;if(e){const r=new Intl.DateTimeFormat("en-GB",{timeZone:e,hour:"numeric",minute:"numeric",second:"numeric",hour12:!1}).formatToParts(i),n=Number(((a=r.find(g=>g.type==="hour"))==null?void 0:a.value)??0),c=Number(((s=r.find(g=>g.type==="minute"))==null?void 0:s.value)??0),u=Number(((o=r.find(g=>g.type==="second"))==null?void 0:o.value)??0);return n*60+c+u/60}return i.getHours()*60+i.getMinutes()}_interpolateSun(t){var g;if(!((g=this._sunData)!=null&&g.points.length))return{elevation:0,azimuth:0};const e=this._sunData.points;let i=0,a=e.length-1;for(;i<a-1;){const f=i+a>>1;e[f].time<=t?i=f:a=f}const s=e[i],o=e[a];if(!s)return{elevation:0,azimuth:0};if(s===o||o.time===s.time)return{elevation:s.elevation,azimuth:s.azimuth};const r=(t-s.time)/(o.time-s.time),n=s.elevation+(o.elevation-s.elevation)*r;let c=s.azimuth,u=o.azimuth;return Math.abs(u-c)>180&&(u<c?u+=360:c+=360),{elevation:n,azimuth:(c+(u-c)*r)%360}}_phaseName(t){return t>=0?"Day":t>=-6?"Civil twilight":t>=-12?"Nautical twilight":t>=-18?"Astronomical twilight":"Night"}_phaseClass(t){return t>=0?"phase-day":t>=-6?"phase-civil":t>=-12?"phase-naut":t>=-18?"phase-astro":"phase-night"}render(){const t=Pt(),e=this._hoverIdx!==null?this._days[this._hoverIdx]:null,i=this._days.findIndex(h=>h.date===this._selectedDate),a=i>=0?this._days[i]:this._days.length?this._days[0]:null,s=e??a,o=e?e.date:this._selectedDate,r=this._hoverTime??this._getLiveTime(),{elevation:n,azimuth:c}=this._interpolateSun(r),u=Math.round(r),g=`${String(Math.floor(u/60)%24).padStart(2,"0")}:${String(u%60).padStart(2,"0")}`,f=this._selectedAreaId?this._areas.find(h=>h.area_id===this._selectedAreaId):null,d=f?this._channelSlotsMap:void 0;return l`
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
            @change=${h=>{const b=h.target.value;this._selectArea(b===""?null:b)}}>
            <option value="" ?selected=${this._selectedAreaId===null}>Area Default</option>
            ${this._areas.map(h=>l`
              <option value=${h.area_id} ?selected=${this._selectedAreaId===h.area_id}>${h.name||h.area_id}</option>
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
            @change=${h=>this._selectLocation(Number(h.target.value))}>
            <option value="-1" ?selected=${this._demoLocationIdx===-1}>HA Home</option>
            ${ps.map((h,b)=>l`
              <option value=${b} ?selected=${this._demoLocationIdx===b}>${h.name} (${h.lat>0?"+":""}${h.lat}°)</option>
            `)}
          </select>

          <button class="demo-play ${this._demoPlaying?"playing":""}" style="width: 36px; min-width: 36px;"
            title=${this._demoPlaying?"Stop":"Play year"}
            @click=${()=>this._toggleDemo()}>
            ${this._demoPlaying?"⏹":"▶"}
          </button>

          <select class="demo-select" style="width: 80px;"
            @change=${h=>this._changeDemoSpeed(Number(h.target.value))}>
            ${Aa.map(h=>l`
              <option value=${String(h)} ?selected=${this._demoSpeed===h}>${h} ms</option>
            `)}
          </select>
        </div>
        ${this._error?l`<div class="span-12 error">${this._error}</div>`:""}
      </div>
    </div>

    ${!this._loading&&this._days.length?l`
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
                .channels=${f?Q(f):{}}
                .hoverTime=${this._hoverTime}
                .liveTime=${this._getLiveTime()}
                .noHeader=${!1}
                .noAxisLabels=${!1}
                @time-hover-changed=${h=>{this._hoverTime=h.detail.hoverTime,this._scrubbing=h.detail.scrubbing}}
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
                @date-selected=${h=>this._selectedDate=h.detail}
                @year-hover-changed=${h=>this._hoverIdx=h.detail.index}
              ></twilight-sun-year-card>
            </div>
          </div>

          <!-- Right: info panel (span-3) -->
          ${s?l`
            <div class="span-3">
              <div class="info-panel">
                <div class="info-date">
                  ${o===t?"Today":e?"Browse":"Selected"}
                  <span>${o}</span>
                </div>

                ${this._sunData?l`
                  <div class="info-section">Live</div>
                  <div class="info-row">
                    <span class="info-label">Time</span>
                    <span class="info-value">${g}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Phase</span>
                    <span class="info-value"><span class="phase-badge ${this._phaseClass(n)}">${this._phaseName(n)}</span></span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Elevation</span>
                    <span class="info-value">${n.toFixed(1)}°</span>
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
                ${(()=>{const h=v=>v!==null?(v%1440+1440)%1440:null,w=((v,_)=>{const C=h(v),S=h(_);if(C===null||S===null)return null;let A=S-C;return A<0&&(A+=1440),A})(s.sunrise,s.sunset),y=w!==null?1440-w:null;return l`
                  <div class="info-row"><span class="info-label">Day length</span>
                    <span class="info-value">${this._fmtDur(w)}</span></div>
                  <div class="info-row"><span class="info-label">Night length</span>
                    <span class="info-value" style="color:var(--secondary-text-color)">${this._fmtDur(y)}</span></div>`})()}

                <div class="info-section">Twilight</div>
                <div class="info-row"><span class="info-label">Day</span>
                  <span class="info-value">
                    ${(()=>{const h=s.slot_day??s.sunrise,b=s.slot_gold_dusk??s.sunset;return h!==null&&b!==null?`${this._fmt(h)}–${this._fmt(b)}`:"—"})()}
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
                ${[[_t,"Night"],[Ut,"Astronomical twilight"],[Bt,"Nautical twilight"],[Ft,"Civil twilight"],[Ye,"Golden hour"],[ee,"Daylight"]].map(([h,b])=>l`
                  <div class="legend-item">
                    <div class="legend-swatch" style="background:${h}"></div>
                    ${b}
                  </div>`)}
                ${[["#d2dce8","Civil dusk / Daylight"],["#aeb9c9","Nautical dusk / Civil dawn"],["#8792a2","Astro dusk / Nautical dawn"],["#5e6572","Night / Astro dawn"]].map(([h,b])=>l`
                  <div class="legend-item">
                    <div class="legend-swatch" style="background:${h}; height:5px; border-radius:1.5px; border:1px solid color-mix(in srgb, var(--primary-text-color, #fff) 15%, transparent); box-sizing:border-box;"></div>
                    ${b}
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
  `],Z([p({attribute:!1})],X.prototype,"hass",2),Z([m()],X.prototype,"_days",2),Z([m()],X.prototype,"_year",2),Z([m()],X.prototype,"_loading",2),Z([m()],X.prototype,"_error",2),Z([m()],X.prototype,"_hoverIdx",2),Z([m()],X.prototype,"_selectedDate",2),Z([m()],X.prototype,"_sunData",2),Z([m()],X.prototype,"_hoverTime",2),Z([m()],X.prototype,"_scrubbing",2),Z([m()],X.prototype,"_isDark",2),Z([m()],X.prototype,"_demoLocationIdx",2),Z([m()],X.prototype,"_demoPlaying",2),Z([m()],X.prototype,"_demoDayIdx",2),Z([m()],X.prototype,"_demoSpeed",2),Z([m()],X.prototype,"_clamped",2),Z([m()],X.prototype,"_showSlots",2),Z([m()],X.prototype,"_slotCurves",2),Z([m()],X.prototype,"_areas",2),Z([m()],X.prototype,"_selectedAreaId",2),Z([m()],X.prototype,"_channelSlotsMap",2),X=Z([L("twilight-timeline-view")],X);var zr=Object.defineProperty,Mr=Object.getOwnPropertyDescriptor,re=(t,e,i,a)=>{for(var s=a>1?void 0:a?Mr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&zr(e,i,s),s};let Yt=class extends ce{constructor(){super(...arguments),this.open=!1,this.isDraftDirty=!1,this._loading=!1,this._error="",this._resetDialogOpen=!1,this._resetNodes=[],this._resetDefaults=null,this.dialog=new we(this),this._onClose=()=>{this._error="",this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))},this._onTriggerFileInput=()=>{var e;if(this.isDraftDirty){this.dialog.showAlert("Unsaved Changes","Please save or discard your unsaved settings changes before restoring from a backup.");return}const t=(e=this.shadowRoot)==null?void 0:e.querySelector("#restoreFileInput");t==null||t.click()}}async _onDownloadBackup(){if(this.hass)try{this._loading=!0,this._error="";const t=await po(this.hass),e=new Date,i=`twilight-backup-${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}.json`,a=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),s=URL.createObjectURL(a),o=document.createElement("a");o.href=s,o.download=i,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(s)}catch(t){this._error=t instanceof Error?t.message:"Failed to export backup"}finally{this._loading=!1}}async _onFileSelected(t){var a;const e=t.target,i=(a=e.files)==null?void 0:a[0];if(!(!i||!this.hass)){e.value="";try{this._loading=!0,this._error="";const s=await i.text();let o;try{o=JSON.parse(s)}catch{await this.dialog.showAlert("Invalid Backup File","The selected file is not valid JSON.");return}if(!o||typeof o!="object"||!o.areas||typeof o.areas!="object"){await this.dialog.showAlert("Invalid Backup File","This file does not appear to be a valid Twilight backup structure.");return}const r=Object.keys(o.areas).length;if(!await this.dialog.showConfirm("Restore Backup",`This will replace ALL areas and global settings with the contents of this backup file (${r} area(s)). Areas not included in this file will be deleted. This action cannot be undone.

Are you sure you want to proceed?`))return;await Ns(this.hass,o),await this.dialog.showAlert("Restore Complete","Backup restored successfully. The panel will now reload."),window.location.reload()}catch(s){this._error=s instanceof Error?s.message:"Failed to restore backup"}finally{this._loading=!1}}}async _onResetSettings(){if(this.hass){if(this.isDraftDirty){await this.dialog.showAlert("Unsaved Changes","Please save or discard your unsaved settings changes before resetting settings.");return}try{this._loading=!0,this._error="";const t=await ho(this.hass);this._resetDefaults=t;const e=t.area_template||{};this._resetNodes=[{id:"template_inputs",label:"Area Template: Inputs",children:(e.inputs||[]).map(i=>{const a=(e.activities||[]).find(s=>s.id===i.activity);return{id:`template_inputs:${i.id}`,label:`${At(i,this.hass)} — ${(a==null?void 0:a.name)||(a==null?void 0:a.id)||i.activity}`}})},{id:"template_activities",label:"Area Template: Activities",children:(e.activities||[]).map(i=>({id:`template_activities:${i.id}`,label:i.name||i.id}))},{id:"template_channels",label:"Area Template: Custom Channels",children:Object.entries(e.custom_channels||{}).map(([i,a])=>({id:`template_channels:${i}`,label:a.name||i}))},{id:"template_sensors",label:"Area Template: Sensors",children:(e.sensors||[]).map(i=>({id:`template_sensors:${i.id}`,label:aa(i,this.hass)}))},{id:"template_primary",label:"Area Template: Primary Channel"},{id:"template_rules",label:"Area Template: Rules",children:(e.rules||[]).map(i=>({id:`template_rules:${i.id}`,label:i.name||i.id}))}],this._resetDialogOpen=!0}catch(t){this._error=t instanceof Error?t.message:"Failed to load system defaults"}finally{this._loading=!1}}}async _executeResetSettings(t){if(!this.hass||!this._resetDefaults)return;const e=new Set(t.detail.selectedIds),i=this._resetDefaults.area_template||{},a={primary_slots:e.has("template_primary")?structuredClone(i.primary_slots||{}):{},inputs:e.has("template_inputs")?structuredClone(i.inputs||[]):(i.inputs||[]).filter(s=>e.has(`template_inputs:${s.id}`)).map(s=>structuredClone(s)),activities:e.has("template_activities")?structuredClone(i.activities||[]):(i.activities||[]).filter(s=>e.has(`template_activities:${s.id}`)).map(s=>structuredClone(s)),custom_channels:e.has("template_channels")?structuredClone(i.custom_channels||{}):Object.fromEntries(Object.entries(i.custom_channels||{}).filter(([s])=>e.has(`template_channels:${s}`)).map(([s,o])=>[s,structuredClone(o)])),sensors:e.has("template_sensors")?structuredClone(i.sensors||[]):(i.sensors||[]).filter(s=>e.has(`template_sensors:${s.id}`)).map(s=>structuredClone(s)),rules:e.has("template_rules")?structuredClone(i.rules||[]):(i.rules||[]).filter(s=>e.has(`template_rules:${s.id}`)).map(s=>structuredClone(s))};this._resetDialogOpen=!1;try{this._loading=!0,this._error="",await Ps(this.hass,{area_template:a}),await this.dialog.showAlert("Reset Complete","Settings have been reset. The panel will now reload."),window.location.reload()}catch(s){this._error=s instanceof Error?s.message:"Failed to reset settings"}finally{this._loading=!1}}async _onFactoryReset(){if(!this.hass)return;if(this.isDraftDirty){await this.dialog.showAlert("Unsaved Changes","Please save or discard your unsaved settings changes before performing a factory reset.");return}if(await this.dialog.showConfirm("Factory Reset Configuration",`⚠️ DANGER: This will delete ALL areas and reset all settings to system defaults.

This action cannot be undone. Are you sure you want to delete all areas and reset Twilight?`))try{this._loading=!0,this._error="",await Ns(this.hass,{twilight_backup_version:1,areas:{},global:{}}),await this.dialog.showAlert("Factory Reset Complete","All areas and settings have been reset to factory defaults. The panel will now reload."),window.location.reload()}catch(e){this._error=e instanceof Error?e.message:"Failed to reset configuration"}finally{this._loading=!1}}render(){return this.open?l`
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

            ${this.isDraftDirty?l`
                  <div class="warning-banner">
                    ⚠️ You have unsaved settings changes. Please save or discard them before restoring or resetting.
                  </div>
                `:""}
            ${this._error?l`<div class="error-banner">❌ ${this._error}</div>`:""}

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
    `:l``}};Yt.styles=[Et,P`
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
    `],re([p({type:Object})],Yt.prototype,"hass",2),re([p({type:Boolean})],Yt.prototype,"open",2),re([p({type:Boolean})],Yt.prototype,"isDraftDirty",2),re([m()],Yt.prototype,"_loading",2),re([m()],Yt.prototype,"_error",2),re([m()],Yt.prototype,"_resetDialogOpen",2),re([m()],Yt.prototype,"_resetNodes",2),re([m()],Yt.prototype,"_resetDefaults",2),Yt=re([L("twilight-backup-restore-dialog")],Yt);var Pr=Object.defineProperty,Nr=Object.getOwnPropertyDescriptor,It=(t,e,i,a)=>{for(var s=a>1?void 0:a?Nr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=(a?r(e,i,s):r(s))||s);return a&&s&&Pr(e,i,s),s};let vt=class extends B{constructor(){super(...arguments),this.hass=null,this._hasLoaded=!1,this._selectedChannelId="",this._slotEditOpen=!1,this._editingSlotId=null,this._templateInputsEditOpen=!1,this._templateActivitiesEditOpen=!1,this._templateSensorsEditOpen=!1,this._templateRulesEditOpen=!1,this._backupDialogOpen=!1,this._placeholderDefaults=null,this._calculatedSlotTimes=[],this._slotTimesRequestId=0,this._dialog=new we(this),this._draftController=new Hs(this,{onSave:async t=>{this.hass&&(await Ps(this.hass,t),this.dispatchEvent(new CustomEvent("global-changed",{detail:t,bubbles:!0,composed:!0})))}})}updated(t){t.has("hass")&&this.hass&&!this._hasLoaded&&(this._hasLoaded=!0,this._loadData())}async _loadData(){if(this.hass){this._draftController.loading=!0,this.requestUpdate();try{const[t,e]=await Promise.all([Ms(this.hass),Fi(this.hass).catch(()=>null)]);this._draftController.init(t||{}),this._placeholderDefaults=e,this._selectFirstChannel(),await this._loadCalculatedSlotTimes()}catch(t){console.error("Failed to load global config:",t)}finally{this._draftController.loading=!1,this.requestUpdate()}}}async _loadCalculatedSlotTimes(){var s,o;if(!this.hass)return;const e=(((o=(s=this._draftController.draft)==null?void 0:s.area_template)==null?void 0:o.custom_channels)||{})[this._selectedChannelId],i=(e==null?void 0:e.slots)||[];if(i.length===0){this._calculatedSlotTimes=[];return}const a=++this._slotTimesRequestId;try{const r=await qi(this.hass,{slots:i});if(a!==this._slotTimesRequestId)return;this._calculatedSlotTimes=r.slots}catch(r){console.warn("Failed to load slot time preview:",r),a===this._slotTimesRequestId&&(this._calculatedSlotTimes=[])}}_selectFirstChannel(){var e,i;if(this._selectedChannelId===T)return;const t=((i=(e=this._draftController.draft)==null?void 0:e.area_template)==null?void 0:i.custom_channels)||{};(!this._selectedChannelId||!t[this._selectedChannelId])&&(this._selectedChannelId=T)}async _saveSettings(){await this._draftController.save()}_cancelChanges(){this._draftController.cancel()}_saveStatusText(){if(this._draftController.saving)return"Saving…";const t=this._draftController.saveError;return t?`Save failed: ${t&&typeof t=="object"&&"message"in t?String(t.message):String(t)}`:this._draftController.isDirty?"Unsaved changes":"All changes saved"}async _onTemplateInputsChanged(t){this._draftController.update(e=>{e.area_template||(e.area_template={}),e.area_template.inputs=t.detail.inputs}),await this._draftController.save()}async _onTemplateActivitiesChanged(t){this._draftController.update(e=>{e.area_template||(e.area_template={}),e.area_template.activities=t.detail.activities}),await this._draftController.save()}async _onTemplateSensorsChanged(t){this._draftController.update(e=>{e.area_template||(e.area_template={}),e.area_template.sensors=t.detail}),await this._draftController.save()}async _onTemplateRulesChanged(t){this._draftController.update(e=>{e.area_template||(e.area_template={}),e.area_template.rules=t.detail}),await this._draftController.save()}_onTemplateChannelSelected(t){this._selectedChannelId=t.detail.channelId,this._loadCalculatedSlotTimes()}async _onTemplateChannelAdded(t){var o;const e=this._draftController.draft;if(!e)return;const i=t.detail.name.trim();if(!i)return;const a=i.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"");if(!a)return;const s={...((o=e.area_template)==null?void 0:o.custom_channels)||{}};if(s[a]){await this._dialog.showAlert("Channel already exists",`A channel named "${i}" already exists.`);return}s[a]={name:i,enabled:!0,slots:[]},this._draftController.update(r=>{r.area_template||(r.area_template={}),r.area_template.custom_channels=s}),await this._draftController.save(),this._selectedChannelId=a,this._loadCalculatedSlotTimes()}async _onTemplateChannelRenamed(t){var r;const e=this._draftController.draft;if(!e)return;const{channelId:i,name:a}=t.detail,s={...((r=e.area_template)==null?void 0:r.custom_channels)||{}},o=s[i];o&&(s[i]={...o,name:a},this._draftController.update(n=>{n.area_template||(n.area_template={}),n.area_template.custom_channels=s}),await this._draftController.save())}async _onTemplateChannelDeleted(t){var s;const e=this._draftController.draft;if(!e)return;const{channelId:i}=t.detail,a={...((s=e.area_template)==null?void 0:s.custom_channels)||{}};delete a[i],this._draftController.update(o=>{o.area_template||(o.area_template={}),o.area_template.custom_channels=a}),await this._draftController.save(),this._selectFirstChannel(),this._loadCalculatedSlotTimes()}async _onTemplateChannelToggled(t){var r;const e=this._draftController.draft;if(!e)return;const{channelId:i,enabled:a}=t.detail,s={...((r=e.area_template)==null?void 0:r.custom_channels)||{}},o=s[i];o&&(s[i]={...o,enabled:a},this._draftController.update(n=>{n.area_template||(n.area_template={}),n.area_template.custom_channels=s}),await this._draftController.save())}async _onTemplateSlotsChanged(t){var n;const e=this._draftController.draft;if(!e)return;let i=this._selectedChannelId;const a={...((n=e.area_template)==null?void 0:n.custom_channels)||{}};if(!i||!a[i]){const c=Object.keys(a);c.length>0&&(i=c[0],this._selectedChannelId=i)}const s=a[i];if(!s)return;const o=s.slots||[],r=t.detail.slots.map(c=>{const u=o.find(f=>f.id===c.id),g=c.startType==="fixed";return{id:c.id,name:c.label,start_type:g?"fixed":"astral",zone:g?null:eo(c),fixed_time:g?c.fixedStartTime||"00:00":null,offset_minutes:c.startOffset||0,scene_entity_id:c.scene,configured_entities:(u==null?void 0:u.configured_entities)||[],hue_activate_dynamic:c.hue_activate_dynamic||!1,hue_dynamic_speed:c.hue_dynamic_speed??null}});a[i]={...s,slots:r,...t.detail.transitionOnSeconds!==void 0?{transition_on_seconds:t.detail.transitionOnSeconds}:{}},this._draftController.update(c=>{c.area_template||(c.area_template={}),c.area_template.custom_channels=a}),await this._draftController.save(),this._loadCalculatedSlotTimes()}async _onTemplatePrimarySlotsChanged(t){const e={};for(const i of t.detail.slots){const a=i.id,s={};i.startOffset&&(s.offset_minutes=i.startOffset),i.scene&&(s.scene_entity_id=i.scene),Object.keys(s).length>0&&(e[a]=s)}this._draftController.update(i=>{i.area_template||(i.area_template={}),i.area_template.primary_slots=e}),await this._draftController.save()}_primaryChannelForTemplate(){var i,a;const t=((a=(i=this._draftController.draft)==null?void 0:i.area_template)==null?void 0:a.primary_slots)||{};return{name:"Primary",enabled:!0,slots:zi.map(s=>{const o=t[s]||{};return{id:s,name:Mi[s]||s,start_type:"astral",zone:s,offset_minutes:o.offset_minutes??0,scene_entity_id:o.scene_entity_id??null,configured_entities:o.configured_entities??[]}})}}_primaryDisplaySlots(){var e,i;const t=((i=(e=this._draftController.draft)==null?void 0:e.area_template)==null?void 0:i.primary_slots)||{};return zi.map(a=>{const s=t[a]||{};return{id:a,label:Mi[a]||a,color:Is(a),from:0,to:0,scene:s.scene_entity_id||null,isCustom:!1,startType:"astral",startEvent:a,startOffset:s.offset_minutes||0}})}render(){var r,n,c,u,g,f,d,h,b,w,y,v,_,C,S,A,k,I,x,O,j,E,M,G,z,J,D,st,et,at,N,ot,bt,W,V,it,ht,zt,K,Se,Mt,Ze,Je,Qe;const t=((n=(r=this._draftController.draft)==null?void 0:r.area_template)==null?void 0:n.custom_channels)||{};let e=this._selectedChannelId||T;e!==T&&!t[e]&&Object.keys(t).length>0&&(e=Object.keys(t).sort()[0]);const i=e===T,a=t[e],s=(a==null?void 0:a.slots)||[],o=i?this._primaryDisplaySlots():this._calculatedSlotTimes.length>0?Ge(this._calculatedSlotTimes,s).map($=>({...$,color:"#8e44ad",isCustom:!0})):s.map($=>{const R=$.start_type==="fixed";return{id:$.id,label:$.name||$.id,color:"#8e44ad",from:0,to:0,scene:$.scene_entity_id||null,isCustom:!0,startType:R?"fixed":"astral",startEvent:R?void 0:$.zone||"civil_dawn",fixedStartTime:R?$.fixed_time||"12:00":void 0,startOffset:$.offset_minutes||0}});return l`
      <div class="view-header-container">
        <div class="settings-header">
          <div class="header-left">
            <h2>Settings</h2>
          </div>
        </div>
      </div>

      <div class="view-content-container">
        ${this._draftController.loading?l`
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 64px 0; gap: 16px; color: var(--secondary-text-color);">
            <div class="spinner"></div>
            <div>Loading settings…</div>
          </div>
        `:l`
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
                .config=${((u=(c=this._draftController.draft)==null?void 0:c.area_template)==null?void 0:u.inputs)??[]}
                .activities=${(((f=(g=this._draftController.draft)==null?void 0:g.area_template)==null?void 0:f.activities)??[]).map($=>$.id)}
                .activitiesConfig=${((h=(d=this._draftController.draft)==null?void 0:d.area_template)==null?void 0:h.activities)??[]}
                .rulesConfig=${((w=(b=this._draftController.draft)==null?void 0:b.area_template)==null?void 0:w.rules)??[]}
                .placeholderDefaults=${this._placeholderDefaults}
                .templateMode=${!0}
                .editOpen=${this._templateInputsEditOpen}
                @inputs-changed=${this._onTemplateInputsChanged}
                @open-edit=${()=>{this._templateInputsEditOpen=!0}}
              ></twilight-inputs-card>
            </div>

            <!-- Template: Activities -->
            <div class="span-6">
              <twilight-activities-card
                .hass=${this.hass}
                .config=${((v=(y=this._draftController.draft)==null?void 0:y.area_template)==null?void 0:v.activities)??[]}
                .inputs=${((C=(_=this._draftController.draft)==null?void 0:_.area_template)==null?void 0:C.inputs)??[]}
                .placeholderDefaults=${this._placeholderDefaults}
                .channels=${{[T]:this._primaryChannelForTemplate(),...t}}
                .templateMode=${!0}
                @activities-changed=${this._onTemplateActivitiesChanged}
                @open-edit=${()=>{this._templateActivitiesEditOpen=!0}}
              ></twilight-activities-card>
            </div>

            <!-- Left Column: Sensors & Rules stacked -->
            <div class="span-6" style="display: flex; flex-direction: column; gap: 16px;">
              <twilight-sensors-card
                .hass=${this.hass}
                .config=${((A=(S=this._draftController.draft)==null?void 0:S.area_template)==null?void 0:A.sensors)??[]}
                .templateMode=${!0}
                @sensors-changed=${this._onTemplateSensorsChanged}
                @open-edit=${()=>{this._templateSensorsEditOpen=!0}}
              ></twilight-sensors-card>

              <twilight-rules-card
                .hass=${this.hass}
                .rules=${((I=(k=this._draftController.draft)==null?void 0:k.area_template)==null?void 0:I.rules)??[]}
                .inputsConfig=${((O=(x=this._draftController.draft)==null?void 0:x.area_template)==null?void 0:O.inputs)??[]}
                .activitiesConfig=${((E=(j=this._draftController.draft)==null?void 0:j.area_template)==null?void 0:E.activities)??[]}
                .channels=${{[T]:this._primaryChannelForTemplate(),...t}}
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
          ${this._draftController.isDirty&&!this._draftController.saving?l`
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
        .config=${((G=(M=this._draftController.draft)==null?void 0:M.area_template)==null?void 0:G.inputs)??[]}
        .activities=${(((J=(z=this._draftController.draft)==null?void 0:z.area_template)==null?void 0:J.activities)??[]).map($=>$.id)}
        .activitiesConfig=${((st=(D=this._draftController.draft)==null?void 0:D.area_template)==null?void 0:st.activities)??[]}
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
        .channels=${{[T]:this._primaryChannelForTemplate(),...t}}
        .templateMode=${!0}
        @activities-changed=${this._onTemplateActivitiesChanged}
        @close=${()=>{this._templateActivitiesEditOpen=!1}}
      ></twilight-activities-dialog>

      <twilight-sensors-dialog
        .open=${this._templateSensorsEditOpen}
        .hass=${this.hass}
        .config=${((it=(V=this._draftController.draft)==null?void 0:V.area_template)==null?void 0:it.sensors)??[]}
        .templateMode=${!0}
        @sensors-changed=${this._onTemplateSensorsChanged}
        @close=${()=>{this._templateSensorsEditOpen=!1}}
      ></twilight-sensors-dialog>

      <twilight-rules-dialog
        .open=${this._templateRulesEditOpen}
        .hass=${this.hass}
        .config=${((zt=(ht=this._draftController.draft)==null?void 0:ht.area_template)==null?void 0:zt.rules)??[]}
        .rules=${((Se=(K=this._draftController.draft)==null?void 0:K.area_template)==null?void 0:Se.rules)??[]}
        .inputsConfig=${((Ze=(Mt=this._draftController.draft)==null?void 0:Mt.area_template)==null?void 0:Ze.inputs)??[]}
        .activitiesConfig=${((Qe=(Je=this._draftController.draft)==null?void 0:Je.area_template)==null?void 0:Qe.activities)??[]}
        .channels=${{[T]:this._primaryChannelForTemplate(),...t}}
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
    `}};vt.styles=[Yi,Ve,qs,P`
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
  `],It([p({attribute:!1})],vt.prototype,"hass",2),It([m()],vt.prototype,"_hasLoaded",2),It([m()],vt.prototype,"_selectedChannelId",2),It([m()],vt.prototype,"_slotEditOpen",2),It([m()],vt.prototype,"_editingSlotId",2),It([m()],vt.prototype,"_templateInputsEditOpen",2),It([m()],vt.prototype,"_templateActivitiesEditOpen",2),It([m()],vt.prototype,"_templateSensorsEditOpen",2),It([m()],vt.prototype,"_templateRulesEditOpen",2),It([m()],vt.prototype,"_backupDialogOpen",2),It([m()],vt.prototype,"_placeholderDefaults",2),It([m()],vt.prototype,"_calculatedSlotTimes",2),vt=It([L("twilight-settings-view")],vt);var Rr=Object.getOwnPropertyDescriptor,Lr=(t,e,i,a)=>{for(var s=a>1?void 0:a?Rr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(s=r(s)||s);return s};const jr=[{id:"areas",label:"Areas"},{id:"timeline",label:"Timeline"},{id:"analytics",label:"Analytics"},{id:"settings",label:"Settings"}];return Re.TwilightPanel=class extends xe{constructor(){super(),this.tabs=jr}},Re.TwilightPanel=Lr([L("twilight-panel")],Re.TwilightPanel),Object.defineProperty(Re,Symbol.toStringTag,{value:"Module"}),Re})({});
