var TwilightPanel=(function(ze){"use strict";var hs;const vs=customElements.define;customElements.define=function(t,e,i){if(customElements.get(t)){console.warn(`[Twilight] Custom element ${t} is already defined.`);return}vs.call(customElements,t,e,i)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const M=t=>(e,i)=>{i!==void 0?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ve=globalThis,gi=Ve.ShadowRoot&&(Ve.ShadyCSS===void 0||Ve.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,fi=Symbol(),ea=new WeakMap;let ia=class{constructor(e,i,s){if(this._$cssResult$=!0,s!==fi)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=i}get styleSheet(){let e=this.o;const i=this.t;if(gi&&e===void 0){const s=i!==void 0&&i.length===1;s&&(e=ea.get(i)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&ea.set(i,e))}return e}toString(){return this.cssText}};const bs=t=>new ia(typeof t=="string"?t:t+"",void 0,fi),I=(t,...e)=>{const i=t.length===1?t[0]:e.reduce((s,a,o)=>s+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+t[o+1],t[0]);return new ia(i,t,fi)},ms=(t,e)=>{if(gi)t.adoptedStyleSheets=e.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(const i of e){const s=document.createElement("style"),a=Ve.litNonce;a!==void 0&&s.setAttribute("nonce",a),s.textContent=i.cssText,t.appendChild(s)}},aa=gi?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let i="";for(const s of e.cssRules)i+=s.cssText;return bs(i)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:xs,defineProperty:_s,getOwnPropertyDescriptor:ys,getOwnPropertyNames:ws,getOwnPropertySymbols:$s,getPrototypeOf:ks}=Object,ie=globalThis,sa=ie.trustedTypes,Cs=sa?sa.emptyScript:"",vi=ie.reactiveElementPolyfillSupport,Me=(t,e)=>t,Ye={toAttribute(t,e){switch(e){case Boolean:t=t?Cs:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=t!==null;break;case Number:i=t===null?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch{i=null}}return i}},bi=(t,e)=>!xs(t,e),oa={attribute:!0,type:String,converter:Ye,reflect:!1,useDefault:!1,hasChanged:bi};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ie.litPropertyMetadata??(ie.litPropertyMetadata=new WeakMap);let ye=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,i=oa){if(i.state&&(i.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((i=Object.create(i)).wrapped=!0),this.elementProperties.set(e,i),!i.noAccessor){const s=Symbol(),a=this.getPropertyDescriptor(e,s,i);a!==void 0&&_s(this.prototype,e,a)}}static getPropertyDescriptor(e,i,s){const{get:a,set:o}=ys(this.prototype,e)??{get(){return this[i]},set(r){this[i]=r}};return{get:a,set(r){const l=a==null?void 0:a.call(this);o==null||o.call(this,r),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??oa}static _$Ei(){if(this.hasOwnProperty(Me("elementProperties")))return;const e=ks(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Me("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Me("properties"))){const i=this.properties,s=[...ws(i),...$s(i)];for(const a of s)this.createProperty(a,i[a])}const e=this[Symbol.metadata];if(e!==null){const i=litPropertyMetadata.get(e);if(i!==void 0)for(const[s,a]of i)this.elementProperties.set(s,a)}this._$Eh=new Map;for(const[i,s]of this.elementProperties){const a=this._$Eu(i,s);a!==void 0&&this._$Eh.set(a,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const i=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const a of s)i.unshift(aa(a))}else e!==void 0&&i.push(aa(e));return i}static _$Eu(e,i){const s=i.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(i=>i(this))}addController(e){var i;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((i=e.hostConnected)==null||i.call(e))}removeController(e){var i;(i=this._$EO)==null||i.delete(e)}_$E_(){const e=new Map,i=this.constructor.elementProperties;for(const s of i.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ms(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostConnected)==null?void 0:s.call(i)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostDisconnected)==null?void 0:s.call(i)})}attributeChangedCallback(e,i,s){this._$AK(e,s)}_$ET(e,i){var o;const s=this.constructor.elementProperties.get(e),a=this.constructor._$Eu(e,s);if(a!==void 0&&s.reflect===!0){const r=(((o=s.converter)==null?void 0:o.toAttribute)!==void 0?s.converter:Ye).toAttribute(i,s.type);this._$Em=e,r==null?this.removeAttribute(a):this.setAttribute(a,r),this._$Em=null}}_$AK(e,i){var o,r;const s=this.constructor,a=s._$Eh.get(e);if(a!==void 0&&this._$Em!==a){const l=s.getPropertyOptions(a),c=typeof l.converter=="function"?{fromAttribute:l.converter}:((o=l.converter)==null?void 0:o.fromAttribute)!==void 0?l.converter:Ye;this._$Em=a;const f=c.fromAttribute(i,l.type);this[a]=f??((r=this._$Ej)==null?void 0:r.get(a))??f,this._$Em=null}}requestUpdate(e,i,s,a=!1,o){var r;if(e!==void 0){const l=this.constructor;if(a===!1&&(o=this[e]),s??(s=l.getPropertyOptions(e)),!((s.hasChanged??bi)(o,i)||s.useDefault&&s.reflect&&o===((r=this._$Ej)==null?void 0:r.get(e))&&!this.hasAttribute(l._$Eu(e,s))))return;this.C(e,i,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,i,{useDefault:s,reflect:a,wrapped:o},r){s&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,r??i??this[e]),o!==!0||r!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(i=void 0),this._$AL.set(e,i)),a===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,r]of this._$Ep)this[o]=r;this._$Ep=void 0}const a=this.constructor.elementProperties;if(a.size>0)for(const[o,r]of a){const{wrapped:l}=r,c=this[o];l!==!0||this._$AL.has(o)||c===void 0||this.C(o,void 0,r,c)}}let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),(s=this._$EO)==null||s.forEach(a=>{var o;return(o=a.hostUpdate)==null?void 0:o.call(a)}),this.update(i)):this._$EM()}catch(a){throw e=!1,this._$EM(),a}e&&this._$AE(i)}willUpdate(e){}_$AE(e){var i;(i=this._$EO)==null||i.forEach(s=>{var a;return(a=s.hostUpdated)==null?void 0:a.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(i=>this._$ET(i,this[i]))),this._$EM()}updated(e){}firstUpdated(e){}};ye.elementStyles=[],ye.shadowRootOptions={mode:"open"},ye[Me("elementProperties")]=new Map,ye[Me("finalized")]=new Map,vi==null||vi({ReactiveElement:ye}),(ie.reactiveElementVersions??(ie.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ss={attribute:!0,type:String,converter:Ye,reflect:!1,hasChanged:bi},Ds=(t=Ss,e,i)=>{const{kind:s,metadata:a}=i;let o=globalThis.litPropertyMetadata.get(a);if(o===void 0&&globalThis.litPropertyMetadata.set(a,o=new Map),s==="setter"&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),s==="accessor"){const{name:r}=i;return{set(l){const c=e.get.call(this);e.set.call(this,l),this.requestUpdate(r,c,t,!0,l)},init(l){return l!==void 0&&this.C(r,void 0,t,l),l}}}if(s==="setter"){const{name:r}=i;return function(l){const c=this[r];e.call(this,l),this.requestUpdate(r,c,t,!0,l)}}throw Error("Unsupported decorator location: "+s)};function p(t){return(e,i)=>typeof i=="object"?Ds(t,e,i):((s,a,o)=>{const r=a.hasOwnProperty(o);return a.constructor.createProperty(o,s),r?Object.getOwnPropertyDescriptor(a,o):void 0})(t,e,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function b(t){return p({...t,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pe=globalThis,ra=t=>t,Ge=Pe.trustedTypes,na=Ge?Ge.createPolicy("lit-html",{createHTML:t=>t}):void 0,la="$lit$",ae=`lit$${Math.random().toFixed(9).slice(2)}$`,da="?"+ae,As=`<${da}>`,pe=document,Ne=()=>pe.createComment(""),Re=t=>t===null||typeof t!="object"&&typeof t!="function",mi=Array.isArray,Ts=t=>mi(t)||typeof(t==null?void 0:t[Symbol.iterator])=="function",xi=`[ 	
\f\r]`,Le=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ca=/-->/g,pa=/>/g,he=RegExp(`>|${xi}(?:([^\\s"'>=/]+)(${xi}*=${xi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ha=/'/g,ua=/"/g,ga=/^(?:script|style|textarea|title)$/i,fa=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),n=fa(1),kt=fa(2),we=Symbol.for("lit-noChange"),Q=Symbol.for("lit-nothing"),va=new WeakMap,ue=pe.createTreeWalker(pe,129);function ba(t,e){if(!mi(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return na!==void 0?na.createHTML(e):e}const Es=(t,e)=>{const i=t.length-1,s=[];let a,o=e===2?"<svg>":e===3?"<math>":"",r=Le;for(let l=0;l<i;l++){const c=t[l];let f,h,g=-1,d=0;for(;d<c.length&&(r.lastIndex=d,h=r.exec(c),h!==null);)d=r.lastIndex,r===Le?h[1]==="!--"?r=ca:h[1]!==void 0?r=pa:h[2]!==void 0?(ga.test(h[2])&&(a=RegExp("</"+h[2],"g")),r=he):h[3]!==void 0&&(r=he):r===he?h[0]===">"?(r=a??Le,g=-1):h[1]===void 0?g=-2:(g=r.lastIndex-h[2].length,f=h[1],r=h[3]===void 0?he:h[3]==='"'?ua:ha):r===ua||r===ha?r=he:r===ca||r===pa?r=Le:(r=he,a=void 0);const u=r===he&&t[l+1].startsWith("/>")?" ":"";o+=r===Le?c+As:g>=0?(s.push(f),c.slice(0,g)+la+c.slice(g)+ae+u):c+ae+(g===-2?l:u)}return[ba(t,o+(t[i]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]};class je{constructor({strings:e,_$litType$:i},s){let a;this.parts=[];let o=0,r=0;const l=e.length-1,c=this.parts,[f,h]=Es(e,i);if(this.el=je.createElement(f,s),ue.currentNode=this.el.content,i===2||i===3){const g=this.el.content.firstChild;g.replaceWith(...g.childNodes)}for(;(a=ue.nextNode())!==null&&c.length<l;){if(a.nodeType===1){if(a.hasAttributes())for(const g of a.getAttributeNames())if(g.endsWith(la)){const d=h[r++],u=a.getAttribute(g).split(ae),v=/([.?@])?(.*)/.exec(d);c.push({type:1,index:o,name:v[2],strings:u,ctor:v[1]==="."?Is:v[1]==="?"?zs:v[1]==="@"?Ms:Xe}),a.removeAttribute(g)}else g.startsWith(ae)&&(c.push({type:6,index:o}),a.removeAttribute(g));if(ga.test(a.tagName)){const g=a.textContent.split(ae),d=g.length-1;if(d>0){a.textContent=Ge?Ge.emptyScript:"";for(let u=0;u<d;u++)a.append(g[u],Ne()),ue.nextNode(),c.push({type:2,index:++o});a.append(g[d],Ne())}}}else if(a.nodeType===8)if(a.data===da)c.push({type:2,index:o});else{let g=-1;for(;(g=a.data.indexOf(ae,g+1))!==-1;)c.push({type:7,index:o}),g+=ae.length-1}o++}}static createElement(e,i){const s=pe.createElement("template");return s.innerHTML=e,s}}function $e(t,e,i=t,s){var r,l;if(e===we)return e;let a=s!==void 0?(r=i._$Co)==null?void 0:r[s]:i._$Cl;const o=Re(e)?void 0:e._$litDirective$;return(a==null?void 0:a.constructor)!==o&&((l=a==null?void 0:a._$AO)==null||l.call(a,!1),o===void 0?a=void 0:(a=new o(t),a._$AT(t,i,s)),s!==void 0?(i._$Co??(i._$Co=[]))[s]=a:i._$Cl=a),a!==void 0&&(e=$e(t,a._$AS(t,e.values),a,s)),e}class Os{constructor(e,i){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:i},parts:s}=this._$AD,a=((e==null?void 0:e.creationScope)??pe).importNode(i,!0);ue.currentNode=a;let o=ue.nextNode(),r=0,l=0,c=s[0];for(;c!==void 0;){if(r===c.index){let f;c.type===2?f=new He(o,o.nextSibling,this,e):c.type===1?f=new c.ctor(o,c.name,c.strings,this,e):c.type===6&&(f=new Ps(o,this,e)),this._$AV.push(f),c=s[++l]}r!==(c==null?void 0:c.index)&&(o=ue.nextNode(),r++)}return ue.currentNode=pe,a}p(e){let i=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,i),i+=s.strings.length-2):s._$AI(e[i])),i++}}class He{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,i,s,a){this.type=2,this._$AH=Q,this._$AN=void 0,this._$AA=e,this._$AB=i,this._$AM=s,this.options=a,this._$Cv=(a==null?void 0:a.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=i.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,i=this){e=$e(this,e,i),Re(e)?e===Q||e==null||e===""?(this._$AH!==Q&&this._$AR(),this._$AH=Q):e!==this._$AH&&e!==we&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ts(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==Q&&Re(this._$AH)?this._$AA.nextSibling.data=e:this.T(pe.createTextNode(e)),this._$AH=e}$(e){var o;const{values:i,_$litType$:s}=e,a=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=je.createElement(ba(s.h,s.h[0]),this.options)),s);if(((o=this._$AH)==null?void 0:o._$AD)===a)this._$AH.p(i);else{const r=new Os(a,this),l=r.u(this.options);r.p(i),this.T(l),this._$AH=r}}_$AC(e){let i=va.get(e.strings);return i===void 0&&va.set(e.strings,i=new je(e)),i}k(e){mi(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,a=0;for(const o of e)a===i.length?i.push(s=new He(this.O(Ne()),this.O(Ne()),this,this.options)):s=i[a],s._$AI(o),a++;a<i.length&&(this._$AR(s&&s._$AB.nextSibling,a),i.length=a)}_$AR(e=this._$AA.nextSibling,i){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,i);e!==this._$AB;){const a=ra(e).nextSibling;ra(e).remove(),e=a}}setConnected(e){var i;this._$AM===void 0&&(this._$Cv=e,(i=this._$AP)==null||i.call(this,e))}}class Xe{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,i,s,a,o){this.type=1,this._$AH=Q,this._$AN=void 0,this.element=e,this.name=i,this._$AM=a,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=Q}_$AI(e,i=this,s,a){const o=this.strings;let r=!1;if(o===void 0)e=$e(this,e,i,0),r=!Re(e)||e!==this._$AH&&e!==we,r&&(this._$AH=e);else{const l=e;let c,f;for(e=o[0],c=0;c<o.length-1;c++)f=$e(this,l[s+c],i,c),f===we&&(f=this._$AH[c]),r||(r=!Re(f)||f!==this._$AH[c]),f===Q?e=Q:e!==Q&&(e+=(f??"")+o[c+1]),this._$AH[c]=f}r&&!a&&this.j(e)}j(e){e===Q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Is extends Xe{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===Q?void 0:e}}class zs extends Xe{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==Q)}}class Ms extends Xe{constructor(e,i,s,a,o){super(e,i,s,a,o),this.type=5}_$AI(e,i=this){if((e=$e(this,e,i,0)??Q)===we)return;const s=this._$AH,a=e===Q&&s!==Q||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==Q&&(s===Q||a);a&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var i;typeof this._$AH=="function"?this._$AH.call(((i=this.options)==null?void 0:i.host)??this.element,e):this._$AH.handleEvent(e)}}class Ps{constructor(e,i,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){$e(this,e)}}const _i=Pe.litHtmlPolyfillSupport;_i==null||_i(je,He),(Pe.litHtmlVersions??(Pe.litHtmlVersions=[])).push("3.3.2");const Ns=(t,e,i)=>{const s=(i==null?void 0:i.renderBefore)??e;let a=s._$litPart$;if(a===void 0){const o=(i==null?void 0:i.renderBefore)??null;s._$litPart$=a=new He(e.insertBefore(Ne(),o),o,void 0,i??{})}return a._$AI(t),a};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ge=globalThis;class L extends ye{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var i;const e=super.createRenderRoot();return(i=this.renderOptions).renderBefore??(i.renderBefore=e.firstChild),e}update(e){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ns(i,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return we}}L._$litElement$=!0,L.finalized=!0,(hs=ge.litElementHydrateSupport)==null||hs.call(ge,{LitElement:L});const yi=ge.litElementPolyfillSupport;yi==null||yi({LitElement:L}),(ge.litElementVersions??(ge.litElementVersions=[])).push("4.2.2");var Rs=Object.defineProperty,Ls=Object.getOwnPropertyDescriptor,wi=(t,e,i,s)=>{for(var a=s>1?void 0:s?Ls(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&Rs(e,i,a),a};let Ue=class extends L{constructor(){super(...arguments),this.activeTab="analytics",this.tabs=[]}connectedCallback(){super.connectedCallback(),this.setAttribute("role","tablist")}render(){return this.tabs.map(t=>n`
        <button
          class="tab-btn ${t.id===this.activeTab?"active":""}"
          role="tab"
          aria-selected=${t.id===this.activeTab?"true":"false"}
          @click=${()=>this._handleTabClick(t.id)}
        >
          <span class="tab-icon">${t.icon}</span>
          <span class="tab-label">${t.label}</span>
        </button>
      `)}_handleTabClick(t){this.dispatchEvent(new CustomEvent("tab-changed",{detail:t,bubbles:!0,composed:!0}))}};Ue.styles=I`
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
  `,wi([p({type:String})],Ue.prototype,"activeTab",2),wi([p({type:Array})],Ue.prototype,"tabs",2),Ue=wi([M("twilight-tab-bar")],Ue);const O="primary",js=3,$i=10,ma=10,xa={night:"#141926",astro:"#1e2e45",nautical:"#2c4268",civil:"#3d5c8a",gold:"#bfb39b",day:"#8ab0cd"},Hs=["astro_dawn","nautical_dawn","civil_dawn","gold_dawn","day","gold_dusk","civil_dusk","nautical_dusk","astro_dusk","night"],Us={astro_dawn:"Astronomical dawn",nautical_dawn:"Nautical dawn",civil_dawn:"Civil dawn",gold_dawn:"Golden dawn",day:"Day",gold_dusk:"Golden dusk",civil_dusk:"Civil dusk",nautical_dusk:"Nautical dusk",astro_dusk:"Astronomical dusk",night:"Night"},li=class li extends CustomEvent{constructor(e){super(li.eventName,{detail:e,bubbles:!0,composed:!0})}};li.eventName="sensors-changed";let ki=li;const di=class di extends CustomEvent{constructor(e){super(di.eventName,{detail:{inputs:e},bubbles:!0,composed:!0})}};di.eventName="inputs-changed";let Ci=di;const ci=class ci extends CustomEvent{constructor(e){super(ci.eventName,{detail:e,bubbles:!0,composed:!0})}};ci.eventName="activities-changed";let Si=ci;const pi=class pi extends CustomEvent{constructor(e){super(pi.eventName,{detail:e,bubbles:!0,composed:!0})}};pi.eventName="rules-changed";let Di=pi;const hi=class hi extends CustomEvent{constructor(e,i){super(hi.eventName,{detail:{slots:e,transitionOnSeconds:i},bubbles:!0,composed:!0})}};hi.eventName="slots-changed";let Ai=hi;function Bs(t,e){return e.simCritical?{label:"Critical Alarm",color:"#d32f2f",class:"fast-blink-glow",sub:"Simulation: Smoke / Panic Alarm"}:e.simError?{label:"System Error",color:"var(--error-color, #f44336)",class:"blink-glow",sub:"Simulation: Device Offline"}:e.simSensorOffline?{label:"Sensor Offline",color:"#ff5722",class:"fast-pulse-glow",sub:"Simulation: Ambient Sensor Failure"}:e.simWarning?{label:"System Warning",color:"var(--warning-color, #ff9800)",class:"pulse-glow",sub:"Simulation: Low Illuminance"}:(t==null?void 0:t.active_activity)==="sleep"?{label:"Sleeping",color:"#3f51b5",class:"static-glow",sub:"Sleep Mode Active"}:{label:"Running / Auto",color:"var(--success-color, #4caf50)",class:"static-glow",sub:"Automatic Mode"}}function fe(t){const e=(Math.round(t)%1440+1440)%1440;return`${String(Math.floor(e/60)).padStart(2,"0")}:${String(e%60).padStart(2,"0")}`}function Fs(t){return t.startType==="fixed"?t.fixedStartTime||"12:00":t.startEvent||"civil_dawn"}function Ti(t){const e=t.to-t.from;return e>=1440?1440:e<=0?e+1440:e}function ke(t,e){const i=s=>(s%1440+1440)%1440;return i(e-i(t.from))<Ti(t)}function Ei(t,e){var s;const i=(s=t==null?void 0:t.states[e])==null?void 0:s.attributes;return(i==null?void 0:i.friendly_name)??(i==null?void 0:i.name)??e}function Be(t,e){if(!t||t.length===0)return[];const i=[],s=t.length;for(let a=0;a<s;a++){const o=t[a],r=s===1?o.start+1440:a<s-1?t[a+1].start:t[0].start+1440,l=e==null?void 0:e.find(d=>d.id===o.id),c=(l==null?void 0:l.start_type)==="fixed",f=(l==null?void 0:l.zone)||o.id;let h=f;["civil_dawn","civil_dusk"].includes(h)?h="civil":["nautical_dawn","nautical_dusk"].includes(h)?h="nautical":["astro_dawn","astro_dusk"].includes(h)?h="astro":["gold_dawn","gold_dusk"].includes(h)&&(h="gold");const g=xa[h]||xa.day;i.push({id:o.id,label:(l==null?void 0:l.name)||Us[o.id]||o.id,color:g,from:o.start,to:r,scene:(l==null?void 0:l.scene_entity_id)||null,isCustom:!Hs.includes(o.id),startType:c?"fixed":"astral",startEvent:c?void 0:f,startOffset:(l==null?void 0:l.offset_minutes)||0,fixedStartTime:c&&(l==null?void 0:l.fixed_time)||void 0})}return i}function Ws(t){if(t.length===0)return"var(--divider-color)";const e=a=>(a%1440+1440)%1440,i=[...t].sort((a,o)=>e(a.from)-e(o.from)),s=[];e(i[0].from)>0&&s.push(`${i[i.length-1].color} 0%`);for(const a of i){const o=(e(a.from)/1440*100).toFixed(1),r=(e(a.to)/1440*100).toFixed(1);s.push(`${a.color} ${o}%`),s.push(`${a.color} ${e(a.from)>e(a.to)?"100":r}%`)}return`linear-gradient(to right, ${s.join(", ")})`}async function Ke(){if(!customElements.get("ha-entity-picker"))try{if(window.loadCardHelpers){const t=await window.loadCardHelpers();if(t){if(t.createCardElement){const e=await t.createCardElement({type:"entities",entities:[]});e&&e.getConfigElement&&await e.getConfigElement()}if(!customElements.get("ha-entity-picker")&&t.createRowElement){const e=await t.createRowElement({type:"attribute"});e&&e.getConfigElement&&await e.getConfigElement()}}}if(!customElements.get("ha-entity-picker")){const t=customElements.get("hui-glance-card");t&&t.getConfigElement&&await t.getConfigElement()}}catch(t){console.warn("[Twilight] Failed to preload HA entity picker:",t)}}function Oi(t,e,i){const s=window.devicePixelRatio||1,a=Math.round(e*s),o=Math.round(i*s);(t.width!==a||t.height!==o)&&(t.width=a,t.height=o);const r=t.getContext("2d");return r.clearRect(0,0,a,o),r.save(),r.scale(s,s),r}var qs=Object.defineProperty,Ce=(t,e,i,s)=>{for(var a=void 0,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=r(e,i,a)||a);return a&&qs(e,i,a),a};class ve extends L{constructor(){super(...arguments),this.narrow=!1,this.tabs=[],this.panel=null,this._activeTab="areas",this._hass=null,this._globalConfigOverride=null}connectedCallback(){super.connectedCallback(),Ke()}createRenderRoot(){return this}get hass(){return this._hass}set hass(e){this._hass=e}render(){var e;return n`
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
    `}_isTabAvailable(e){return this.tabs.some(i=>i.id===e)}_onGlobalChanged(e){this._globalConfigOverride=e.detail}}Ce([p({type:Boolean})],ve.prototype,"narrow"),Ce([p({type:Array})],ve.prototype,"tabs"),Ce([p({type:Object})],ve.prototype,"panel"),Ce([b()],ve.prototype,"_activeTab"),Ce([b()],ve.prototype,"_hass"),Ce([b()],ve.prototype,"_globalConfigOverride");function Ze(t){return t.callWS({type:"twilight/areas/list"})}function Vs(t){return t.callWS({type:"twilight/area_registry/list"})}function _a(t,e){return t.callWS({type:"twilight/areas/new_draft",area_id:e})}function Ys(t,e){return t.callWS({type:"twilight/area/save",...e})}function Gs(t,e){return t.callWS({type:"twilight/area/delete",area_id:e})}function Xs(t,e){const i={type:"twilight/area/extracted"};return e&&(i.area_id=e),t.callWS(i)}function Ks(t,e){return t.callWS({type:"twilight/lab/area_entities",area_id:e})}function ya(t){return t.callWS({type:"twilight/global/get"})}function Zs(t,e){return t.callWS({type:"twilight/global/save",config:e})}function Js(t){return t.callWS({type:"twilight/global/export"})}function wa(t,e){return t.callWS({type:"twilight/global/import",payload:e})}function Qs(t){return t.callWS({type:"twilight/global/defaults"})}function Ii(t,e){return t.callWS({type:"twilight/placeholder_defaults",...e?{area_id:e}:{}})}function Je(t,e){return t.callWS({type:"twilight/sun/day",...e})}function $a(t,e){return t.callWS({type:"twilight/sun/year",...e})}function ka(t,e){return t.callWS({type:"twilight/area/slot_times",...e})}function zi(t,e){return t.callWS({type:"twilight/slot_times/preview",...e})}function to(t,e){return t.callWS({type:"twilight/timeline/slot_times",...e})}function eo(t,e){return t.callWS({type:"twilight/analytics/get",...e})}function io(t,e){return t.callWS({type:"twilight/trigger_input",...e})}function Ca(t,e){return t.callWS({type:"twilight/heatmap/profile/save",...e})}function ao(t,e){return t.callWS({type:"twilight/heatmap/profile/delete",...e})}class Sa{constructor(e,i={}){this.original=null,this.draft=null,this.saving=!1,this.loading=!1,this.saveError=null,this.isDirty=!1,this._host=e,this._options=i,this._host.addController(this)}hostConnected(){}hostDisconnected(){}init(e){this.original=structuredClone(e),this.draft=structuredClone(e),this.isDirty=!1,this._host.requestUpdate()}update(e){this.draft&&(typeof e=="function"?e(this.draft):this.draft={...this.draft,...e},this.isDirty=!0,this._host.requestUpdate())}async save(){if(!(!this.draft||this.saving)){this.saving=!0,this.saveError=null,this._host.requestUpdate();try{if(this._options.onSave){const e=await this._options.onSave(this.draft);e!==void 0&&(this.draft=e)}this.original=structuredClone(this.draft),this.isDirty=!1}catch(e){console.error("Error saving draft",e),this.saveError=e}finally{this.saving=!1,this._host.requestUpdate()}}}cancel(){this.original&&(this.draft=structuredClone(this.original),this.isDirty=!1,this._host.requestUpdate())}reset(){this.original=null,this.draft=null,this.saving=!1,this.loading=!1,this.saveError=null,this.isDirty=!1,this._host.requestUpdate()}}class Qe{constructor(e){this._ticker=null,this.liveMins=0,this.host=e,e.addController(this),this._updateTime()}hostConnected(){this._ticker=setInterval(()=>{this._updateTime(),this.host.requestUpdate()},15e3)}hostDisconnected(){this._ticker&&(clearInterval(this._ticker),this._ticker=null)}_updateTime(){const e=new Date;this.liveMins=e.getHours()*60+e.getMinutes()}}var so=Object.defineProperty,oo=Object.getOwnPropertyDescriptor,dt=(t,e,i,s)=>{for(var a=s>1?void 0:s?oo(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&so(e,i,a),a};let at=class extends L{constructor(){super(...arguments),this._clock=new Qe(this),this.hass=null,this.slots=[],this.inputs=[],this.noHeader=!1,this.runState=null,this.areaEnabled=!0,this.channels={},this.channelSlotsMap={},this.simCritical=!1,this.simError=!1,this.simSensorOffline=!1,this.simWarning=!1,this.entities=[]}_activityCountdown(t){if(!t.activity_expires_at)return null;const e=new Date(t.activity_expires_at).getTime()-Date.now();if(e<=0)return null;const i=Math.ceil(e/1e3),s=Math.floor(i/60),a=i%60;return s>0?`${s}m ${a}s`:`${a}s`}_runStateEngineInfo(t){const e=t.scene_activated_at!==null,i=t.active_activity;if(i){const s=i.charAt(0).toUpperCase()+i.slice(1),a=t.activity_trigger,o=a!=null&&a.input_id?this.inputs.find(c=>c.id===a.input_id):void 0,r=o?o.name||o.label||o.id:a==null?void 0:a.input_id,l=a!=null&&a.input_id?`via ${r}${a.entity_id?` (${a.entity_id})`:""}`:"";return{label:s,color:"#9c27b0",class:"pulse-glow",sub:l}}return{label:e?"Scene Active":"Idle",color:e?"#4caf50":"#2196f3",class:"entity-indicator",sub:e?"Scene switched by engine":"Waiting for input"}}render(){if(!this.sensorConfig)return n``;const t=this._clock.liveMins,e=this.runState,i=Object.keys(this.channels||{}).sort((r,l)=>r===O?-1:l===O?1:0),s=i.length>0?i:[O],a={simCritical:this.simCritical,simError:this.simError,simSensorOffline:this.simSensorOffline,simWarning:this.simWarning},o=this.areaEnabled?e?this._runStateEngineInfo(e):Bs(this.runState,a):{label:"Disabled",color:"#888888",class:"entity-indicator",sub:"Engine inactive"};return n`
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
              ${s.map(r=>{var x,_,C,D;const l=(x=this.channels)==null?void 0:x[r],c=l?l.enabled!==!1:!0,f=(l==null?void 0:l.name)||(r===O?"Twilight":r);if(!c)return n`
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 13px; opacity: 0.5;">
                      <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
                        <div class="slot-color-dot" style="background: #888; flex-shrink: 0;"></div>
                        <span style="font-weight: 600; color: var(--secondary-text-color); font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;">${f}:</span>
                        <span style="color: var(--secondary-text-color); text-decoration: line-through;">Disabled</span>
                      </div>
                      <span style="font-size: 11px; color: var(--secondary-text-color);">—</span>
                    </div>
                  `;const h=((_=this.channelSlotsMap)==null?void 0:_[r])||(r===O?this.slots:[])||[],g=((C=e==null?void 0:e.active_slots)==null?void 0:C[r])||null,d=g?h.find($=>$.id===g):h.find($=>ke($,t));if(!d)return n`
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 13px; opacity: 0.7;">
                      <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
                        <div class="slot-color-dot" style="background: #888; flex-shrink: 0;"></div>
                        <span style="font-weight: 600; color: var(--secondary-text-color); font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;">${f}:</span>
                        <span style="color: var(--secondary-text-color); font-style: italic;">No active slot</span>
                      </div>
                      <span style="font-size: 11px; color: var(--secondary-text-color);">—</span>
                    </div>
                  `;const u=d.color||"var(--secondary-text-color)",v=d.label,y=`${fe(d.from)} - ${fe(d.to)}`,k=((D=e==null?void 0:e.active_scene_names)==null?void 0:D[r])||(d.scene?Ei(this.hass,d.scene):"No Scene");return n`
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 13px;">
                    <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
                      <div class="slot-color-dot" style="background:${u}; box-shadow: 0 0 6px ${u}; flex-shrink: 0;"></div>
                      <span style="font-weight: 600; color: var(--secondary-text-color); font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;">${f}:</span>
                      <span style="color: var(--primary-text-color); font-weight: 500; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${v}</span>
                      <span style="color: var(--secondary-text-color); font-size: 11px; font-style: italic; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">(${k})</span>
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
    `}};at.styles=I`
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

    .card-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--dot-color, #06b6d4);
      box-shadow: 0 0 6px var(--dot-color, #06b6d4);
      flex-shrink: 0;
      display: inline-block;
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
  `,dt([p({attribute:!1})],at.prototype,"hass",2),dt([p({type:Array})],at.prototype,"slots",2),dt([p({attribute:!1})],at.prototype,"sensorConfig",2),dt([p({type:Array})],at.prototype,"inputs",2),dt([p({type:Boolean})],at.prototype,"noHeader",2),dt([p({attribute:!1})],at.prototype,"runState",2),dt([p({type:Boolean})],at.prototype,"areaEnabled",2),dt([p({attribute:!1})],at.prototype,"channels",2),dt([p({attribute:!1})],at.prototype,"channelSlotsMap",2),dt([p({type:Boolean})],at.prototype,"simCritical",2),dt([p({type:Boolean})],at.prototype,"simError",2),dt([p({type:Boolean})],at.prototype,"simSensorOffline",2),dt([p({type:Boolean})],at.prototype,"simWarning",2),dt([p({type:Array})],at.prototype,"entities",2),at=dt([M("twilight-status-card")],at);class be{constructor(e){this.host=e,this.confirmOpen=!1,this.confirmTitle="",this.confirmMessage="",this._confirmResolve=null,this.alertOpen=!1,this.alertTitle="",this.alertMessage="",this._alertResolve=null,this.promptOpen=!1,this.promptTitle="",this.promptMessage="",this.promptPlaceholder="",this.promptValue="",this._promptResolve=null,this._onConfirm=()=>{this.confirmOpen=!1,this._confirmResolve&&(this._confirmResolve(!0),this._confirmResolve=null),this.host.requestUpdate()},this._onCancelConfirm=()=>{this.confirmOpen=!1,this._confirmResolve&&(this._confirmResolve(!1),this._confirmResolve=null),this.host.requestUpdate()},this._onCloseAlert=()=>{this.alertOpen=!1,this._alertResolve&&(this._alertResolve(),this._alertResolve=null),this.host.requestUpdate()},this._onSubmitPrompt=i=>{this.promptOpen=!1,this._promptResolve&&(this._promptResolve(i.detail.value),this._promptResolve=null),this.host.requestUpdate()},this._onCancelPrompt=()=>{this.promptOpen=!1,this._promptResolve&&(this._promptResolve(null),this._promptResolve=null),this.host.requestUpdate()},this.host.addController(this)}hostConnected(){}hostDisconnected(){this._confirmResolve&&(this._confirmResolve(!1),this._confirmResolve=null),this._alertResolve&&(this._alertResolve(),this._alertResolve=null),this._promptResolve&&(this._promptResolve(null),this._promptResolve=null),this.confirmOpen=!1,this.alertOpen=!1,this.promptOpen=!1}showConfirm(e,i){return this._confirmResolve&&(this._confirmResolve(!1),this._confirmResolve=null),new Promise(s=>{this.confirmTitle=e,this.confirmMessage=i,this.confirmOpen=!0,this._confirmResolve=s,this.host.requestUpdate()})}showAlert(e,i){return this._alertResolve&&(this._alertResolve(),this._alertResolve=null),new Promise(s=>{this.alertTitle=e,this.alertMessage=i,this.alertOpen=!0,this._alertResolve=s,this.host.requestUpdate()})}showPrompt(e,i="",s="",a=""){return this._promptResolve&&(this._promptResolve(null),this._promptResolve=null),new Promise(o=>{this.promptTitle=e,this.promptMessage=a,this.promptPlaceholder=s,this.promptValue=i,this.promptOpen=!0,this._promptResolve=o,this.host.requestUpdate()})}}const se=I`
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
  .activity-badge.rule {
    background: rgba(255, 193, 7, 0.18);
    border: 1px solid rgba(255, 193, 7, 0.5);
    color: #ffe082;
    border-radius: 4px;
  }
  .activity-badge.simulation {
    background: rgba(38, 166, 154, 0.18);
    border: 1px solid rgba(38, 166, 154, 0.45);
    color: #26c6a4;
  }
`,Mi=I`
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
`,Pi=I`
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
`,Da=I`
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
`,Tt=I`
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
    background: var(--primary-background-color, #14141f);
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
`;var ro=Object.defineProperty,no=Object.getOwnPropertyDescriptor,ct=(t,e,i,s)=>{for(var a=s>1?void 0:s?no(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&ro(e,i,a),a};class oe extends L{}let Se=class extends oe{constructor(){super(...arguments),this.open=!1,this.dialogTitle="Alert",this.message=""}render(){return this.open?n`
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
    `:n``}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}};Se.styles=[Tt,I`
      /* Above the sub-edit overlays (z-index 1100) — validation alerts fire
         from inside the sub-modals and must stay visible on top. */
      .overlay { z-index: 1200; }
      .modal-card {
        max-width: 450px;
      }
    `],ct([p({type:Boolean})],Se.prototype,"open",2),ct([p({type:String})],Se.prototype,"dialogTitle",2),ct([p({type:String})],Se.prototype,"message",2),Se=ct([M("twilight-alert-dialog")],Se);let De=class extends oe{constructor(){super(...arguments),this.open=!1,this.dialogTitle="Confirm",this.message=""}render(){return this.open?n`
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
    `:n``}_onConfirm(){this.dispatchEvent(new CustomEvent("confirm",{bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}};De.styles=[Tt,I`
      .overlay { z-index: 1200; }
      .modal-card {
        max-width: 450px;
      }
    `],ct([p({type:Boolean})],De.prototype,"open",2),ct([p({type:String})],De.prototype,"dialogTitle",2),ct([p({type:String})],De.prototype,"message",2),De=ct([M("twilight-confirm-dialog")],De);let Kt=class extends oe{constructor(){super(...arguments),this.open=!1,this.dialogTitle="Prompt",this.message="",this.placeholder="",this.value="",this._currentValue=""}willUpdate(t){t.has("open")&&this.open&&(this._currentValue=this.value||"")}render(){return this.open?n`
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
    `:n``}_onInput(t){this._currentValue=t.target.value}_onKeyDown(t){t.key==="Enter"?this._onConfirm():t.key==="Escape"&&this._onCancel()}_onConfirm(){this.dispatchEvent(new CustomEvent("submit",{detail:{value:this._currentValue},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}};Kt.styles=[Tt,I`
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
    `],ct([p({type:Boolean})],Kt.prototype,"open",2),ct([p({type:String})],Kt.prototype,"dialogTitle",2),ct([p({type:String})],Kt.prototype,"message",2),ct([p({type:String})],Kt.prototype,"placeholder",2),ct([p({type:String})],Kt.prototype,"value",2),ct([b()],Kt.prototype,"_currentValue",2),Kt=ct([M("twilight-prompt-dialog")],Kt);const gt="#141926",Rt="#1e2e45",Lt="#2c4268",jt="#3d5c8a",Fe="#bfb39b",Zt="#8ab0cd",Aa="rgba(255,255,255,0.15)",Ni=t=>t>=-.833?Zt:t>=-6?jt:t>=-12?Lt:t>=-18?Rt:gt;function ti(t){return`200 14px ${getComputedStyle(t).getPropertyValue("--font-family").trim()||"system-ui, sans-serif"}`}function Ri(t){return getComputedStyle(t).getPropertyValue("--primary-text-color").trim()||"rgba(255,255,255,0.90)"}function Ta(t){return getComputedStyle(t).getPropertyValue("--divider-color").trim()||"rgba(255, 255, 255, 0.08)"}function Ea(t,e){var i;for(let s=0;s<t.length-1;s++)if(t[s].time<=e&&t[s+1].time>e){const a=(e-t[s].time)/(t[s+1].time-t[s].time);return t[s].elevation+(t[s+1].elevation-t[s].elevation)*a}return((i=t[t.length-1])==null?void 0:i.elevation)??0}function Oa(t,e,i){t.save(),t.beginPath(),t.arc(e,i,11,0,Math.PI*2),t.fillStyle="rgba(249,217,118,0.28)",t.shadowColor="#f9d976",t.shadowBlur=12,t.fill(),t.beginPath(),t.arc(e,i,7.5,0,Math.PI*2),t.strokeStyle="rgba(10, 15, 25, 0.65)",t.lineWidth=1.5,t.stroke(),t.beginPath(),t.arc(e,i,7,0,Math.PI*2),t.fillStyle="#f9d976",t.fill(),t.restore()}function Ia(t,e,i){t.save(),t.shadowColor="#a4c5f0",t.shadowBlur=10,t.beginPath(),t.arc(e,i,7,0,Math.PI*2),t.fillStyle="#c8dff5",t.fill(),t.beginPath(),t.arc(e+3.15,i-.7,5.46,0,Math.PI*2),t.fillStyle=gt,t.fill(),t.restore()}function za(t,e,i){t.save(),t.shadowColor="#c8c8f0",t.shadowBlur=10,t.beginPath(),t.arc(e,i,7,Math.PI/2,-Math.PI/2),t.lineTo(e,i-7),t.fillStyle="#f9d976",t.fill(),t.beginPath(),t.arc(e,i,7,-Math.PI/2,Math.PI/2),t.lineTo(e,i+7),t.fillStyle="#c8dff5",t.fill(),t.beginPath(),t.moveTo(e,i-7),t.lineTo(e,i+7),t.strokeStyle="rgba(0,0,0,0.3)",t.lineWidth=.5,t.stroke(),t.restore()}const N=t=>Math.round(t*1e3)/1e3;function Li(t){const i=[],s=t.sunrise!==null?N(t.sunrise):null,a=t.sunset!==null?N(t.sunset):null,o=t.astro_dawn!==null&&(s===null||N(t.astro_dawn)<s)?N(t.astro_dawn):null,r=t.nautical_dawn!==null&&(s===null||N(t.nautical_dawn)<s)?N(t.nautical_dawn):null,l=t.dawn!==null&&(s===null||N(t.dawn)<s)?N(t.dawn):null,c=t.dusk!==null&&t.dusk<=1440&&(a===null||N(t.dusk)>a)?N(t.dusk):null,f=t.nautical_dusk!==null&&t.nautical_dusk<=1440&&(a===null||N(t.nautical_dusk)>a)?N(t.nautical_dusk):null,h=t.astro_dusk!==null&&t.astro_dusk<=1440&&(a===null||N(t.astro_dusk)>a)?N(t.astro_dusk):null,g=t.slot_gold_dawn!==null&&t.slot_gold_dawn!==void 0;return o!==null&&i.push({t:o,c:Rt}),r!==null&&i.push({t:r,c:Lt}),l!==null&&i.push({t:l,c:jt}),s!==null&&i.push({t:s,c:g?Fe:Zt}),g&&t.slot_day!==null&&t.slot_day!==void 0&&i.push({t:N(t.slot_day),c:Zt}),g&&t.slot_gold_dusk!==null&&t.slot_gold_dusk!==void 0&&t.slot_gold_dusk<=1440&&i.push({t:N(t.slot_gold_dusk),c:Fe}),a!==null&&a<=1440&&i.push({t:a,c:jt}),c!==null&&i.push({t:c,c:Lt}),f!==null&&i.push({t:f,c:Rt}),h!==null&&i.push({t:h,c:gt}),i}function ji(t){const i=[],s=t.slot_sunrise!==null?N(t.slot_sunrise):null,a=t.slot_astro_dawn!==null&&(s===null||N(t.slot_astro_dawn)<s)?N(t.slot_astro_dawn):null,o=t.slot_nautical_dawn!==null&&(s===null||N(t.slot_nautical_dawn)<s)?N(t.slot_nautical_dawn):null,r=t.slot_civil_dawn!==null&&(s===null||N(t.slot_civil_dawn)<s)?N(t.slot_civil_dawn):null,l=t.slot_civil_dusk!==null&&t.slot_civil_dusk<=1440?N(t.slot_civil_dusk):null,c=t.slot_nautical_dusk!==null&&t.slot_nautical_dusk<=1440?N(t.slot_nautical_dusk):null,f=t.slot_astro_dusk!==null&&t.slot_astro_dusk<=1440?N(t.slot_astro_dusk):null,h=t.slot_night!==null&&t.slot_night<=1440?N(t.slot_night):null,g=t.slot_gold_dawn!==null&&t.slot_gold_dawn!==void 0;return a!==null&&i.push({t:a,c:Rt}),o!==null&&i.push({t:o,c:Lt}),r!==null&&i.push({t:r,c:jt}),s!==null&&i.push({t:s,c:g?Fe:Zt}),g&&t.slot_day!==null&&t.slot_day!==void 0&&i.push({t:N(t.slot_day),c:Zt}),g&&t.slot_gold_dusk!==null&&t.slot_gold_dusk!==void 0&&t.slot_gold_dusk<=1440&&i.push({t:N(t.slot_gold_dusk),c:Fe}),l!==null&&i.push({t:l,c:jt}),c!==null&&i.push({t:c,c:Lt}),f!==null&&i.push({t:f,c:Rt}),h!==null&&i.push({t:h,c:gt}),i}function Hi(t,e,i){if(!t)return Ni(e.midnight_el);const s=1440;if(i){if(t.slot_civil_dusk!==null)return t.slot_night!==null&&t.slot_night<=s?gt:t.slot_astro_dusk!==null&&t.slot_astro_dusk<=s?Rt:t.slot_nautical_dusk!==null&&t.slot_nautical_dusk<=s?Lt:t.slot_civil_dusk!==null&&t.slot_civil_dusk<=s?jt:Zt}else if(t.sunset!==null)return t.astro_dusk!==null&&t.astro_dusk<=s?gt:t.nautical_dusk!==null&&t.nautical_dusk<=s?Rt:t.dusk!==null&&t.dusk<=s?Lt:t.sunset!==null&&t.sunset<=s?jt:Zt;return Ni(t.midnight_el)}function Ui(t,e,i,s){const o=(r,l,c,f)=>{if(r===null||r<=1440||f===null)return;const h=N(r-1440);c!==null&&h>=c||t.push({t:h,c:l})};s?(o(e.slot_civil_dusk,jt,i.slot_sunrise,i.slot_sunrise),o(e.slot_nautical_dusk,Lt,i.slot_civil_dawn,i.slot_civil_dawn),o(e.slot_astro_dusk,Rt,i.slot_nautical_dawn,i.slot_nautical_dawn),o(e.slot_night,gt,i.slot_astro_dawn,i.slot_astro_dawn)):(o(e.sunset,jt,i.sunrise,i.sunrise),o(e.dusk,Lt,i.dawn,i.dawn),o(e.nautical_dusk,Rt,i.nautical_dawn,i.nautical_dawn),o(e.astro_dusk,gt,i.astro_dawn,i.astro_dawn))}function Ma(t,e,i,s,a,o,r,l,c){let f=r,h=e;for(const g of o){const d=l(Math.max(0,Math.min(c,g.t)));d>h&&(t.fillStyle=f,t.fillRect(h,i,d-h,s)),f=g.c,h=d}t.fillStyle=f,t.fillRect(h,i,a-h,s)}function lo(t,e,i,s,a,o,r){let l=a,c=0;for(const f of s)f.t>c&&f.t<=r&&(t.fillStyle=l,t.fillRect(e,o(f.t),i,o(c)-o(f.t))),l=f.c,c=Math.max(c,f.t);c<r&&(t.fillStyle=l,t.fillRect(e,o(r),i,o(c)-o(r)))}var co=Object.defineProperty,po=Object.getOwnPropertyDescriptor,q=(t,e,i,s)=>{for(var a=s>1?void 0:s?po(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&co(e,i,a),a};const Pa=[210,145,35,280,190,330,15],Na=50,Ra=20,ho=0,uo=30,Bi=72,La=12,go=2,ei=20;let U=class extends L{constructor(){super(...arguments),this.hass=null,this.date=new Date().toISOString().slice(0,10),this.clamped=!1,this.noHeader=!1,this.noAxisLabels=!1,this.noYAxis=!1,this.showSlots=!1,this.primaryOnly=!1,this.noSolarNoonMidnight=!1,this.hoverTime=null,this.liveTime=null,this.embedded=!1,this.sparkline=!1,this.channels={},this.selectedChannelId="primary",this.channelSlotsMap={},this.days=[],this.sunData=null,this.slots=[],this._days=[],this._sunData=null,this._loading=!1,this._w=0,this._scrubbing=!1,this._geom=null,this._ro=null}connectedCallback(){super.connectedCallback()}disconnectedCallback(){var t;(t=this._ro)==null||t.disconnect(),super.disconnectedCallback()}updated(t){var i;if(!this._ro){const s=(i=this.shadowRoot)==null?void 0:i.querySelector(".canvas-wrap");s&&(this._ro=new ResizeObserver(a=>{const o=a[0].contentRect.width;o>0&&o!==this._w&&(this._w=o,this._draw())}),this._ro.observe(s))}t.has("days")&&this.days.length&&(this._days=this.days),t.has("sunData")&&this.sunData&&(this._sunData=this.sunData),(t.has("hass")||t.has("date"))&&this.hass&&!this.days.length&&this._load(),(t.has("_sunData")||t.has("_days")||t.has("clamped")||t.has("showSlots")||t.has("primaryOnly")||t.has("noSolarNoonMidnight")||t.has("noYAxis")||t.has("hoverTime")||t.has("liveTime")||t.has("channels")||t.has("selectedChannelId"))&&requestAnimationFrame(()=>this._draw())}async _load(){if(this.hass){this._loading=!0;try{const t=await Je(this.hass,{date:this.date});this._sunData=t;const e=[];t.prev_day_data&&e.push(t.prev_day_data),t.day_data&&e.push(t.day_data),this._days=e}finally{this._loading=!1}}}_getLiveTime(){const t=new Date;return t.getHours()*60+t.getMinutes()+t.getSeconds()/60}_interpolateEl(t){var e;return Ea(((e=this._sunData)==null?void 0:e.points)??[],t)}_draw(){var ui,Xt,us,gs,fs;const t=(ui=this.shadowRoot)==null?void 0:ui.querySelector("canvas"),e=this._sunData??this.sunData;if(!t||!e||!this._w)return;const{points:i}=e;if(!i.length)return;const s=this._w,a=t.getBoundingClientRect().height;if(!a)return;const o=Oi(t,s,a),r=this.noAxisLabels?10:this.noYAxis?ei+Bi:Na,l=this.noAxisLabels?10:this.noYAxis?ei:Ra,c=this.noAxisLabels?10:ho,f=this.noAxisLabels?10:uo,h=s-r-l,g=a-c-f,d=this.primaryOnly?[]:Object.keys(this.channels||{}).filter(A=>A!=="primary"),v=1+d.length,y=g/v,k=g,x=c,_=c+k,C=r,D=r+h,$=x+g/2,w=1440;this._geom={plotT:x,stripeH:y,numStripes:v};const S=e.lat??50,m=Math.abs(S),E=m<=23.44?90:113.44-m,H=Math.max(E,...i.map(A=>Math.abs(A.elevation)))+10,z=A=>C+A/w*h,F=A=>$-A/H*(k/2);o.save(),o.shadowColor="rgba(0, 0, 0, 0.2)",o.shadowBlur=36,o.shadowOffsetX=0,o.shadowOffsetY=0,o.beginPath(),o.roundRect(C,x,h,g,8),o.fillStyle=gt,o.fill(),o.restore(),o.save(),o.beginPath(),o.roundRect(C,x,h,g,8),o.clip();const et=y;o.save(),o.beginPath(),o.rect(C,x,h,et),o.clip();const P=this._days.length?this._days:this.days,it=P.findIndex(A=>A.date===this.date),T=it>=0?P[it]:null,ht=it>0?P[it-1]:null,ut=((Xt=this.channelSlotsMap)==null?void 0:Xt[O])??((us=this.slots)!=null&&us.length?this.slots:null);if(ut&&ut.length>0){const A=Wt=>(Wt%1440+1440)%1440,j=[...ut].sort((Wt,ta)=>A(Wt.from)-A(ta.from)),At=j.map(Wt=>({t:A(Wt.from),c:Wt.color})),qe=j.length>0?j[j.length-1].color:gt;Ma(o,C,x,et,D,At,qe,z,w)}else if(T){const A=this.clamped,At=[...A?ji(T):Li(T)];ht&&Ui(At,ht,T,A),At.sort((Wt,ta)=>Wt.t-ta.t);const qe=Hi(ht,T,A);Ma(o,C,x,et,D,At,qe,z,w)}else o.fillStyle=gt,o.fillRect(C,x,h,et);o.restore(),this._drawCustomStripes(o,d,T,ht,e,C,x,D,h,y,z),o.save(),o.beginPath(),o.rect(C,x,h,g),o.clip(),o.save(),o.beginPath(),o.moveTo(C,$);for(const A of i)o.lineTo(z(A.time),F(A.elevation));o.lineTo(D,$),o.closePath();const $t=o.createLinearGradient(0,x,0,$);$t.addColorStop(0,"rgba(249,217,118,0.11)"),$t.addColorStop(1,"rgba(249,217,118,0.01)"),o.fillStyle=$t,o.fill(),o.restore(),o.save(),o.strokeStyle="rgba(255,255,255,0.35)",o.lineWidth=1.5,o.setLineDash([4,4]),o.beginPath(),o.moveTo(C,$),o.lineTo(D,$),o.stroke(),o.restore();const R=o.createLinearGradient(0,x,0,_);R.addColorStop(0,"#f9d976"),R.addColorStop(.47,"#e8a020"),R.addColorStop(.53,"#34507a"),R.addColorStop(1,"#1b233a"),o.save(),o.beginPath();let lt=!0;for(const A of i){const j=z(A.time),At=F(A.elevation);lt?(o.moveTo(j,At),lt=!1):o.lineTo(j,At)}o.strokeStyle=R,o.lineWidth=2,o.stroke(),o.restore(),o.save(),o.strokeStyle=R,o.lineWidth=2,o.shadowColor="rgba(249, 217, 118, 0.55)",o.shadowBlur=8,o.beginPath();let Nt=!1;for(const A of i){const j=z(A.time),At=F(A.elevation);A.elevation>=0?Nt?o.lineTo(j,At):(o.moveTo(j,At),Nt=!0):Nt=!1}if(o.stroke(),o.restore(),!this.noYAxis)for(const A of[-18,-12,-6,0,30,60]){const j=F(A);j<x-2||j>_+2||[-18,-12,-6,0].includes(A)&&(o.save(),o.strokeStyle=Aa,o.lineWidth=.5,o.setLineDash([3,4]),o.beginPath(),o.moveTo(C,j),o.lineTo(D,j),o.stroke(),o.restore())}o.restore();const W=this.liveTime??this._getLiveTime(),G=this._interpolateEl(W),st=z(W),Dt=F(G),Gt=x+y,Z=(A,j,At=[],qe=Gt)=>{if(A===null)return;const Wt=z((A%w+w)%w);o.save(),o.strokeStyle=j,o.lineWidth=1.5,o.setLineDash(At),o.beginPath(),o.moveTo(Wt,x),o.lineTo(Wt,qe),o.stroke(),o.restore()};if(this.noSolarNoonMidnight||(Z((T==null?void 0:T.solar_noon)??null,"rgba(255,214,0,0.7)",[],x+g),Z((T==null?void 0:T.solar_midnight)??null,"rgba(60,100,200,0.7)",[],x+g)),this.showSlots){const A=((gs=this.channelSlotsMap)==null?void 0:gs[O])??((fs=this.slots)!=null&&fs.length?this.slots:null);if(A&&A.length>0)for(const j of A)Z(j.from,"rgba(255,255,255,0.65)");else T&&(Z(T.slot_sunset,"rgba(255,255,255,0.75)"),Z(T.slot_nautical_dusk,"rgba(255,255,255,0.60)"),Z(T.slot_astro_dusk,"rgba(255,255,255,0.45)"),Z(T.slot_night,"rgba(255,255,255,0.30)"),Z(T.slot_astro_dawn,"rgba(255,255,255,0.30)"),Z(T.slot_nautical_dawn,"rgba(255,255,255,0.45)"),Z(T.slot_civil_dawn,"rgba(255,255,255,0.60)"),Z(T.slot_sunrise,"rgba(255,255,255,0.75)"),Z(T.slot_day,"rgba(255,255,255,0.65)"),Z(T.slot_gold_dusk,"rgba(255,255,255,0.65)"))}for(const A of[0,360,720,1080,1440]){const j=z(A);o.save(),o.strokeStyle=Aa,o.lineWidth=.5,o.beginPath(),o.moveTo(j,x),o.lineTo(j,x+g),o.stroke(),o.restore()}if(o.save(),o.strokeStyle="rgba(255,255,255,0.25)",o.lineWidth=1,o.setLineDash([3,3]),o.beginPath(),o.moveTo(st,x),o.lineTo(st,x+g),o.stroke(),o.restore(),this.hoverTime!==null){const A=z(this.hoverTime);o.save(),o.strokeStyle="rgba(255,255,255,0.35)",o.lineWidth=1,o.setLineDash([3,3]),o.beginPath(),o.moveTo(A,x),o.lineTo(A,x+g),o.stroke(),o.restore()}if(o.restore(),o.save(),o.beginPath(),o.roundRect(C,x,h,g,8),o.strokeStyle=Ta(this),o.lineWidth=1,o.stroke(),o.restore(),G>=0?Oa(o,st,Dt):G>=-6?za(o,st,Dt):Ia(o,st,Dt),!this.noAxisLabels){o.fillStyle=Ri(this),o.font=ti(this),o.textAlign="center";for(const A of[0,360,720,1080,1440]){const j=z(A);A!==0&&A!==1440&&o.fillText(`${String(A/60|0).padStart(2,"0")}:00`,j,x+g+20)}}if(!this.noAxisLabels&&!this.noYAxis){o.font=ti(this),o.textAlign="end";for(const A of[-18,-12,-6,0,30,60]){const j=F(A);j<x-2||j>_+2||[0,30,60,-18].includes(A)&&(o.fillStyle=Ri(this),o.fillText(`${A}°`,C-6,j+4))}}this.noYAxis&&!this.noAxisLabels&&this._drawChannelAxisLabels(o,["primary",...d],C,x,y),o.restore()}_elevationToLightRatio(t){return Math.max(0,Math.min(1,(t- -18)/48))}_drawCustomStripes(t,e,i,s,a,o,r,l,c,f,h){const g=i||s||a.day_data;if(e.length===0||!g)return;const d=u=>(u%1440+1440)%1440;e.forEach((u,v)=>{var m,E,H;const y=r+(v+1)*f,k=y+f,x=((m=this.channelSlotsMap)==null?void 0:m[u])??[],_=((H=(E=this.channels)==null?void 0:E[u])==null?void 0:H.enabled)!==!1,C=Pa[v%Pa.length],D=_?35:0,$=_?12:6,w=_?42:14;t.fillStyle=gt,t.fillRect(o,y,c,f);const S=c/1440;if(x.forEach(z=>{const F=Ti(z);if(F<=0)return;const et=d(z.from),P=o+et*S,it=d(z.from+F/2),T=this._interpolateEl(it),ht=this._elevationToLightRatio(T),ut=$+ht*(w-$);t.fillStyle=`hsl(${C}, ${D}%, ${ut}%)`;const $t=F*S,R=P+$t-l;R<=0?t.fillRect(P,y,$t,f):(t.fillRect(P,y,l-P,f),t.fillRect(o,y,R,f))}),this.showSlots){t.strokeStyle="rgba(255, 255, 255, 0.35)",t.lineWidth=1.5;for(const z of x){const F=h(d(z.from));t.beginPath(),t.moveTo(F,y),t.lineTo(F,k),t.stroke()}}t.strokeStyle="rgba(255, 255, 255, 0.08)",t.lineWidth=.5,t.beginPath(),t.moveTo(o,y),t.lineTo(l,y),t.stroke()})}_drawChannelAxisLabels(t,e,i,s,a){const l=Bi-La-go,c=i-La;t.save(),t.font="600 11px system-ui, sans-serif",t.textAlign="end",t.textBaseline="middle",e.forEach((f,h)=>{var _,C,D,$;const g=((C=(_=this.channels)==null?void 0:_[f])==null?void 0:C.enabled)!==!1,d=((($=(D=this.channels)==null?void 0:D[f])==null?void 0:$.name)||f).toUpperCase(),u=s+h*a,v=Math.max(1,Math.floor((a-8)/13)),y=this._wrapText(t,d,l,v);t.fillStyle=g?Ri(this):"rgba(255,255,255,0.35)";const k=y.length*13;let x=u+(a-k)/2+13/2;for(const w of y)t.fillText(w,c,x),x+=13}),t.restore()}_wrapText(t,e,i,s){const a=g=>t.measureText(g).width<=i,o=e.split(/\s+/).filter(Boolean),r=[];let l="";const c=g=>{for(const d of g)l&&!a(l+d)&&(r.push(l),l=""),l+=d};for(const g of o){const d=l?`${l} ${g}`:g;if(a(d)){l=d;continue}l&&(r.push(l),l=""),a(g)?l=g:c(g)}if(l&&r.push(l),r.length<=s)return r;const f=r.slice(0,s);let h=f[s-1];for(;h.length>0&&!a(`${h}…`);)h=h.slice(0,-1);return f[s-1]=`${h}…`,f}get _padLeft(){return this.noAxisLabels?10:this.noYAxis?ei+Bi:Na}get _padRight(){return this.noAxisLabels?10:this.noYAxis?ei:Ra}_channelAtY(t,e){const i=this._geom;if(!i||i.numStripes<=1)return this.selectedChannelId;const s=t-e,a=Math.max(0,Math.min(i.numStripes-1,Math.floor((s-i.plotT)/i.stripeH)));return a===0?"primary":Object.keys(this.channels||{}).filter(r=>r!=="primary")[a-1]??"primary"}_timeAtX(t,e){const i=this._w-this._padLeft-this._padRight,s=t-e;return Math.round(Math.max(0,Math.min(1,(s-this._padLeft)/i))*1440)}_getSlotAtTimeIn(t,e){const i=a=>(a%1440+1440)%1440,s=i(e);for(const a of t){const o=Ti(a);if(!(o<=0)&&i(s-i(a.from))<o)return a}return null}_slotsForChannel(t){var i;const e=(i=this.channelSlotsMap)==null?void 0:i[t];return e&&e.length?e:this.slots}_onCanvasClick(t){if(!this._w)return;const e=t.currentTarget.getBoundingClientRect(),i=this._timeAtX(t.clientX,e.left),s=this._channelAtY(t.clientY,e.top),a=this._getSlotAtTimeIn(this._slotsForChannel(s),i);a&&this.dispatchEvent(new CustomEvent("slot-selected",{detail:{slotId:a.id,channelId:s},bubbles:!0,composed:!0}))}_onMouseMove(t){if(!this._w)return;const e=t.currentTarget.getBoundingClientRect();this.hoverTime=this._timeAtX(t.clientX,e.left);const i=this._channelAtY(t.clientY,e.top);this._scrubbing=!0,this.dispatchEvent(new CustomEvent("time-hover-changed",{detail:{hoverTime:this.hoverTime,channelId:i,scrubbing:!0},bubbles:!0,composed:!0})),this._draw()}_onMouseLeave(){this.hoverTime=null,this._scrubbing=!1,this.dispatchEvent(new CustomEvent("time-hover-changed",{detail:{hoverTime:null,scrubbing:!1},bubbles:!0,composed:!0})),this._draw()}_onTouchMove(t){if(!this._w)return;const e=t.touches[0],i=t.currentTarget.getBoundingClientRect();this.hoverTime=this._timeAtX(e.clientX,i.left);const s=this._channelAtY(e.clientY,i.top);this._scrubbing=!0,this.dispatchEvent(new CustomEvent("time-hover-changed",{detail:{hoverTime:this.hoverTime,channelId:s,scrubbing:!0},bubbles:!0,composed:!0})),this._draw()}_onTouchEnd(){this.hoverTime=null,this._scrubbing=!1,this.dispatchEvent(new CustomEvent("time-hover-changed",{detail:{hoverTime:null,scrubbing:!1},bubbles:!0,composed:!0})),this._draw()}_getSparklineGradient(){const t=this._days.length?this._days:this.days,e=t.findIndex(g=>g.date===this.date),i=e>=0?t[e]:null,s=e>0?t[e-1]:null;if(!i)return"var(--divider-color)";const a=this.clamped,r=[...a?ji(i):Li(i)];s&&Ui(r,s,i,a),r.sort((g,d)=>g.t-d.t);const l=Hi(s,i,a),c=[],f=1440;let h=l;c.push(`${h} 0%`);for(const g of r){const u=(Math.max(0,Math.min(f,g.t))/f*100).toFixed(1);c.push(`${h} ${u}%`),h=g.c,c.push(`${h} ${u}%`)}return c.push(`${h} 100%`),`linear-gradient(to right, ${c.join(", ")})`}render(){if(this.sparkline){const t=this._getSparklineGradient(),i=(this.liveTime??this._getLiveTime())/1440*100;return n`
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
    `}};U.styles=I`
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
    .card-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--dot-color, #f59e0b);
      box-shadow: 0 0 6px var(--dot-color, #f59e0b);
      flex-shrink: 0;
      display: inline-block;
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
  `,q([p({attribute:!1})],U.prototype,"hass",2),q([p({type:String})],U.prototype,"date",2),q([p({type:Boolean})],U.prototype,"clamped",2),q([p({type:Boolean})],U.prototype,"noHeader",2),q([p({type:Boolean})],U.prototype,"noAxisLabels",2),q([p({type:Boolean,reflect:!0})],U.prototype,"noYAxis",2),q([p({type:Boolean})],U.prototype,"showSlots",2),q([p({type:Boolean})],U.prototype,"primaryOnly",2),q([p({type:Boolean})],U.prototype,"noSolarNoonMidnight",2),q([p({type:Number})],U.prototype,"hoverTime",2),q([p({type:Number})],U.prototype,"liveTime",2),q([p({type:Boolean,reflect:!0})],U.prototype,"embedded",2),q([p({type:Boolean,reflect:!0})],U.prototype,"sparkline",2),q([p({type:Object})],U.prototype,"channels",2),q([p({type:String})],U.prototype,"selectedChannelId",2),q([p({attribute:!1})],U.prototype,"channelSlotsMap",2),q([p({attribute:!1})],U.prototype,"days",2),q([p({attribute:!1})],U.prototype,"sunData",2),q([p({type:Array})],U.prototype,"slots",2),q([b()],U.prototype,"_days",2),q([b()],U.prototype,"_sunData",2),q([b()],U.prototype,"_loading",2),q([b()],U.prototype,"_w",2),U=q([M("twilight-sun-path-card")],U);var fo=Object.defineProperty,vo=Object.getOwnPropertyDescriptor,Et=(t,e,i,s)=>{for(var a=s>1?void 0:s?vo(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&fo(e,i,a),a};let ft=class extends L{constructor(){super(...arguments),this.hass=null,this.slots=[],this.noHeader=!1,this.entities=[],this.loading=!1,this.channels={},this.selectedChannelId=O,this.templateMode=!1,this.date=new Date().toISOString().slice(0,10),this.channelSlotsMap={},this._menuOpen=!1,this._dialog=new be(this),this._clock=new Qe(this),this._handleWindowClick=t=>{if(!this._menuOpen)return;t.composedPath().some(s=>s instanceof HTMLElement&&s.classList.contains("kebab-container"))||(this._menuOpen=!1)}}connectedCallback(){super.connectedCallback(),window.addEventListener("click",this._handleWindowClick)}disconnectedCallback(){window.removeEventListener("click",this._handleWindowClick),super.disconnectedCallback()}_toggleMenu(t){t.stopPropagation(),this._menuOpen=!this._menuOpen}_orderedChannelIds(){const t=Object.keys(this.channels);return this.templateMode?t.filter(e=>e!==O).sort():t.sort((e,i)=>e===O?-1:i===O?1:0)}_selectChannel(t){this._menuOpen=!1,this.dispatchEvent(new CustomEvent("channel-selected",{detail:{channelId:t},bubbles:!0,composed:!0}))}async _addChannel(){this._menuOpen=!1;const t=await this._dialog.showPrompt("New Channel","","Name of the new channel");t===null||t.trim()===""||this.dispatchEvent(new CustomEvent("channel-added",{detail:{name:t.trim()},bubbles:!0,composed:!0}))}async _renameChannel(){var i;this._menuOpen=!1;const t=((i=this.channels[this.selectedChannelId])==null?void 0:i.name)??"",e=await this._dialog.showPrompt("Rename Channel",t,"New channel name");e===null||e.trim()===""||this.dispatchEvent(new CustomEvent("channel-renamed",{detail:{channelId:this.selectedChannelId,name:e.trim()},bubbles:!0,composed:!0}))}async _deleteChannel(){var i;if(this._menuOpen=!1,this.selectedChannelId===O)return;const t=((i=this.channels[this.selectedChannelId])==null?void 0:i.name)??this.selectedChannelId;await this._dialog.showConfirm("Delete Channel",`Delete channel "${t}"? Its lights will be turned off.`)&&this.dispatchEvent(new CustomEvent("channel-deleted",{detail:{channelId:this.selectedChannelId},bubbles:!0,composed:!0}))}_toggleChannelEnabled(){if(this._menuOpen=!1,this.selectedChannelId===O)return;const t=this.channels[this.selectedChannelId];t&&this.dispatchEvent(new CustomEvent("channel-enabled-toggled",{detail:{channelId:this.selectedChannelId,enabled:!t.enabled},bubbles:!0,composed:!0}))}_fireEditRequested(){this.dispatchEvent(new CustomEvent("edit-requested",{bubbles:!0,composed:!0}))}render(){const t=this._clock.liveMins,e=this.templateMode?-1:this.slots.findIndex(s=>ke(s,t)),i=e!==-1?[...this.slots.slice(e),...this.slots.slice(0,e)]:this.slots;return n`
      <div class="slot-card">
        ${this.noHeader?"":n`
          <div class="slot-card-header">
            <span class="card-dot" style="--dot-color: #f97316;"></span>
            <span class="slot-card-title">Timetable</span>
            <div class="kebab-container">
              <button class="edit-btn" @click=${this._toggleMenu}>⋮</button>
              ${this._menuOpen?n`
                <div class="dropdown-menu">
                  ${(()=>{var l;const s=this.selectedChannelId&&this.selectedChannelId!==O&&!!this.channels[this.selectedChannelId],a=this._orderedChannelIds(),r=(this.templateMode?a.length:a.filter(c=>c!==O).length)>=js;return n`
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
            ${this._orderedChannelIds().map(s=>{const a=this.channels[s],o=s===this.selectedChannelId,r=(a==null?void 0:a.enabled)===!1;return n`
                <button
                  class="channel-tab ${o?"active":""} ${r?"disabled":""}"
                  @click=${()=>this._selectChannel(s)}
                  title=${r?"Channel disabled":""}
                >${(a==null?void 0:a.name)||s}</button>
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
          ${this.loading?n`<div class="entity-list-empty">Loading…</div>`:i.length>0?i.map(s=>{const a=!this.templateMode&&ke(s,t),o=this.templateMode?s.startType==="fixed"?s.fixedStartTime||"12:00":`${s.startEvent||"astral"}${s.startOffset?s.startOffset>0?` +${s.startOffset}m`:` ${s.startOffset}m`:""}`:`${fe(s.from)} → ${fe(s.to)}`;return n`
                    <div class="slot-summary-row ${a?"active":""}">
                      <div class="slot-color-dot" style="background:${s.color}; box-shadow:${a?`0 0 6px ${s.color}`:"none"}"></div>
                      <span class="slot-summary-label">${s.label}</span>
                      <span class="slot-summary-scene">
                        ${s.scene?Ei(this.hass,s.scene):"—"}
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
    `}};ft.styles=I`
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

    .card-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--dot-color, #f97316);
      box-shadow: 0 0 6px var(--dot-color, #f97316);
      flex-shrink: 0;
      display: inline-block;
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
  `,Et([p({attribute:!1})],ft.prototype,"hass",2),Et([p({type:Array})],ft.prototype,"slots",2),Et([p({type:Boolean})],ft.prototype,"noHeader",2),Et([p({type:Array})],ft.prototype,"entities",2),Et([p({type:Boolean})],ft.prototype,"loading",2),Et([p({attribute:!1})],ft.prototype,"channels",2),Et([p({type:String})],ft.prototype,"selectedChannelId",2),Et([p({type:Boolean})],ft.prototype,"templateMode",2),Et([p({type:String})],ft.prototype,"date",2),Et([p({attribute:!1})],ft.prototype,"channelSlotsMap",2),Et([b()],ft.prototype,"_menuOpen",2),ft=Et([M("twilight-timetable-card")],ft);function ja(t,e){var i;try{const s=e||document.body,a=window.getComputedStyle(s),o=a.getPropertyValue("--primary-text-color").trim()||a.color;if(o)return bo(o)}catch{}return((i=t==null?void 0:t.themes)==null?void 0:i.darkMode)!==void 0?!!t.themes.darkMode:!!(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)}function bo(t){const e=t.toLowerCase().trim();if(e==="white"||e.startsWith("#fff")||e.includes("255,255,255")||e.includes("255, 255, 255"))return!0;if(e==="black"||e==="#000"||e==="#000000"||e.includes("0,0,0")||e.includes("0, 0, 0"))return!1;if(e.startsWith("#")){const s=e.substring(1);let a=0,o=0,r=0;return s.length===3||s.length===4?(a=parseInt(s[0]+s[0],16),o=parseInt(s[1]+s[1],16),r=parseInt(s[2]+s[2],16)):s.length>=6&&(a=parseInt(s.substring(0,2),16),o=parseInt(s.substring(2,4),16),r=parseInt(s.substring(4,6),16)),(.299*a+.587*o+.114*r)/255>.5}const i=e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);if(i){const s=parseInt(i[1],10),a=parseInt(i[2],10),o=parseInt(i[3],10);return(.299*s+.587*a+.114*o)/255>.5}return!1}function Fi(t,e){if(!t)return n`<span>—</span>`;const i=a=>a?n`<div style="width:10px; height:10px; border-radius:3px; background:${a}; flex-shrink:0;"></div>`:"",s=(a,o,r)=>n`
    <div style="display:flex; justify-content:center; align-items:center; gap:6px;">
      ${i(o)}
      <span class=${r?`mismatch-badge ${e}`:""}>${a}</span>
    </div>`;return t.deviates?n`
    <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
      ${s(t.actual,t.actual_swatch,!1)}
      ${s(t.target,t.target_swatch,!0)}
    </div>`:s(t.actual,t.actual_swatch,!1)}var mo=Object.defineProperty,xo=Object.getOwnPropertyDescriptor,Ae=(t,e,i,s)=>{for(var a=s>1?void 0:s?xo(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&mo(e,i,a),a};let re=class extends oe{constructor(){super(...arguments),this.open=!1,this.hass=null,this.entities=[],this.manualOnly=!1,this._pickerValue=""}updated(t){super.updated(t),t.has("open")&&this.open&&Ke()}_closeDialog(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_toggleManualOnly(){const t=!this.manualOnly;this.dispatchEvent(new CustomEvent("mode-changed",{detail:{manualOnly:t},bubbles:!0,composed:!0}))}_toggleEntity(t){const e=this.entities.map(i=>i.entity_id===t?{...i,isManual:!i.isManual}:i);this._fireChange(e)}_addEntity(t){var s,a,o;if(!t)return;const e=this.entities.find(r=>r.entity_id===t);let i=[...this.entities];if(e)e.isManual||(i=this.entities.map(r=>r.entity_id===t?{...r,isManual:!0}:r));else{const r=((o=(a=(s=this.hass)==null?void 0:s.states[t])==null?void 0:a.attributes)==null?void 0:o.friendly_name)??t,l=t.split(".")[0];i=[...this.entities,{entity_id:t,name:r,domain:l,in_area:!1,isManual:!0,isExtracted:!1,checked:!0}]}this._fireChange(i),this._pickerValue=""}_fireChange(t){this.dispatchEvent(new CustomEvent("lights-changed",{detail:{entities:t},bubbles:!0,composed:!0}))}render(){if(!this.open)return n``;const t=this.entities.filter(a=>a.isExtracted&&(a.domain==="light"||a.domain==="switch")),e=this.entities.filter(a=>a.in_area&&!a.isExtracted&&(a.domain==="light"||a.domain==="switch")),i=this.entities.filter(a=>!a.in_area&&a.isManual&&(a.domain==="light"||a.domain==="switch")),s=this.entities.some(a=>a.isManual);return n`
      <div class="overlay" @click=${a=>{a.target===a.currentTarget&&this._closeDialog()}}>
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
                ${t.map(a=>n`
                  <div class="picker-row static">
                    <div style="font-size: 14px; color: var(--secondary-text-color); margin-right: 4px; display: flex; align-items: center;">🎬</div>
                    <div style="flex: 1; min-width: 0;">
                      <div style="display:flex; align-items:center; gap:8px;">
                        <span class="picker-label">${a.name}</span>
                        <span style="font-size: 9px; opacity: 0.5; text-transform: uppercase; font-weight: bold;">(${a.domain})</span>
                      </div>
                      <div class="picker-sublabel">${a.entity_id}</div>
                    </div>
                  </div>
                `)}
              </div>
              <div class="divider"></div>
            `:""}

            <div class="list-section-label">Entities in this Area (Additional Turn-Off Control)</div>
            <div class="grid-list">
              ${e.map(a=>n`
                <div class="picker-row" @click=${()=>this._toggleEntity(a.entity_id)}>
                  <div class="picker-checkbox ${a.isManual?"checked":""}"></div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="display:flex; align-items:center; gap:8px;">
                      <span class="picker-label">${a.name}</span>
                      <span style="font-size: 9px; opacity: 0.5; text-transform: uppercase; font-weight: bold;">(${a.domain})</span>
                    </div>
                    <div class="picker-sublabel">${a.entity_id}</div>
                  </div>
                </div>
              `)}
            </div>

            ${i.length>0?n`
              <div class="divider"></div>
              <div class="list-section-label">Additional Entities (Manually Added)</div>
              <div class="grid-list">
                ${i.map(a=>n`
                  <div class="picker-row" @click=${()=>this._toggleEntity(a.entity_id)}>
                    <div class="picker-checkbox checked"></div>
                    <div style="flex: 1; min-width: 0;">
                      <div style="display:flex; align-items:center; gap:8px;">
                        <span class="picker-label">${a.name}</span>
                        ${a.isExtracted?n`
                          <span class="entity-badge" style="background: color-mix(in srgb, var(--info-color, #2196f3) 20%, transparent); color: var(--info-color, #2196f3); border: 1px solid color-mix(in srgb, var(--info-color, #2196f3) 40%, transparent); font-size: 8px; padding: 1px 4px; border-radius: 3px; font-weight: bold; text-transform: uppercase;">
                            in scene
                          </span>
                        `:""}
                        <span style="font-size: 9px; opacity: 0.5; text-transform: uppercase; font-weight: bold;">(${a.domain})</span>
                      </div>
                      <div class="picker-sublabel">${a.entity_id}</div>
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
                @value-changed=${a=>{a.detail.value&&this._addEntity(a.detail.value)}}
              ></ha-entity-picker>
            </div>

            ${s?n`
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
    `}};re.styles=[Tt,I`
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
    `],Ae([p({type:Boolean})],re.prototype,"open",2),Ae([p({attribute:!1})],re.prototype,"hass",2),Ae([p({type:Array})],re.prototype,"entities",2),Ae([p({type:Boolean})],re.prototype,"manualOnly",2),Ae([b()],re.prototype,"_pickerValue",2),re=Ae([M("twilight-area-lights-dialog")],re);var _o=Object.defineProperty,yo=Object.getOwnPropertyDescriptor,Jt=(t,e,i,s)=>{for(var a=s>1?void 0:s?yo(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&_o(e,i,a),a};let Ht=class extends L{constructor(){super(...arguments),this.hass=null,this.activeSceneName="No Scene Active",this.noHeader=!1,this.runState=null,this.entities=[],this.manualOnly=!1,this._editOpen=!1,this._isDark=!1}willUpdate(t){t.has("hass")&&(this._isDark=ja(this.hass,this))}_toggleManualOnly(t){this.manualOnly=t.detail.manualOnly,this.dispatchEvent(new CustomEvent("mode-changed",{detail:{manualOnly:this.manualOnly},bubbles:!0,composed:!0}))}_onLightsChanged(t){this.entities=t.detail.entities,this.dispatchEvent(new CustomEvent("lights-changed",{detail:{entities:this.entities},bubbles:!0,composed:!0}))}render(){var r;const t=((r=this.runState)==null?void 0:r.light_states)??{},e=this._isDark?"dark":"light",i=Object.keys(t).length>0;let s=[],a=[];i?Object.keys(t).forEach(l=>{const c=t[l],f=this.entities.find(u=>u.entity_id===l),h=f?!!f.isExtracted:!0,g=f?!!f.isManual:!1,d={entity_id:l,name:c.name||(f==null?void 0:f.name)||l,actual_on:c.actual_on,on:c.on,brightness:c.brightness,color:c.color};h?s.push(d):g?a.push(d):s.push(d)}):this.entities.forEach(l=>{const c=!!l.isManual,f=!!l.isExtracted;if(!c&&!f)return;const h={entity_id:l.entity_id,name:l.name||l.entity_id,actual_on:!1,on:null,brightness:null,color:null};f?s.push(h):a.push(h)});const o=s.length+a.length;return this.manualOnly,n`
      <div class="devices-card">
        ${this.noHeader?"":n`
          <div class="devices-card-header">
            <span class="card-dot" style="--dot-color: #eab308;"></span>
            <span class="devices-card-title">Area Lights</span>
            <div class="active-scene-wrap">
              <span class="active-scene-label">Active Scene:</span>
              <span class="active-scene-value">${this.activeSceneName}</span>
            </div>
            <button class="edit-btn" @click=${()=>{this._editOpen=!0}} title="Configure Lights">⋮</button>
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
                    ${s.length>0?n`
                      <tr class="section-row">
                        <td colspan="4">Scene Lights (Extracted)</td>
                      </tr>
                      ${s.map(l=>this._renderTableRow(l,e))}
                    `:""}

                    ${a.length>0?n`
                      <tr class="section-row">
                        <td colspan="4">Additional Entities (Manually Configured)</td>
                      </tr>
                      ${a.map(l=>this._renderTableRow(l,e))}
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
        <td style="text-align: center; font-weight: 500; vertical-align: top; padding-top: 10px;">${Fi(t.on,e)}</td>
        <td style="text-align: center; font-weight: 500; vertical-align: top; padding-top: 10px;">${Fi(t.brightness,e)}</td>
        <td style="text-align: center; font-weight: 500; vertical-align: top; padding-top: 10px;">${Fi(t.color,e)}</td>
      </tr>
    `}};Ht.styles=I`
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

    .card-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--dot-color, #eab308);
      box-shadow: 0 0 6px var(--dot-color, #eab308);
      flex-shrink: 0;
      display: inline-block;
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
  `,Jt([p({attribute:!1})],Ht.prototype,"hass",2),Jt([p({type:String})],Ht.prototype,"activeSceneName",2),Jt([p({type:Boolean})],Ht.prototype,"noHeader",2),Jt([p({attribute:!1})],Ht.prototype,"runState",2),Jt([p({type:Array})],Ht.prototype,"entities",2),Jt([p({type:Boolean})],Ht.prototype,"manualOnly",2),Jt([b()],Ht.prototype,"_editOpen",2),Jt([b()],Ht.prototype,"_isDark",2),Ht=Jt([M("twilight-area-lights-card")],Ht);function Ha(t){switch(t){case"min":return"Minimum";case"max":return"Maximum";case"mean":return"Average";case"median":return"Median";default:return"Minimum"}}class ii{constructor(e,i={}){this._prevOpen=!1,this.draft=null,this.draggedIndex=null,this._host=e,this._options=i,this._host.addController(this)}hostConnected(){}hostDisconnected(){}hostUpdate(){var e,i;this._host.open!==this._prevOpen&&(this._prevOpen=this._host.open,this._host.open?(this.draft=this._host.config?structuredClone(this._host.config):null,(i=(e=this._options).onOpen)==null||i.call(e),Ke()):this.draft=null)}closeDiscard(){this._host.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}closeAndSave(e){this._host.dispatchEvent(e),this._host.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}onDragStart(e,i){this.draggedIndex=i,e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",String(i)))}onDragOver(e,i){if(e.preventDefault(),this.draggedIndex===null||this.draggedIndex===i||!Array.isArray(this.draft))return;const s=[...this.draft],a=s[this.draggedIndex];s.splice(this.draggedIndex,1),s.splice(i,0,a),this.draft=s,this.draggedIndex=i,this._host.requestUpdate()}onDragEnd(){this.draggedIndex=null}}const Ua=!1,Ba="none";function Wi(t,e){const i=t.lux_threshold!==null&&t.lux_threshold!==void 0?t.lux_threshold:(e==null?void 0:e.lux_threshold)??30,s=t.lux_watch_window!==null&&t.lux_watch_window!==void 0?t.lux_watch_window:(e==null?void 0:e.lux_watch_window)??10,a=t.lux_ignore_active!==null&&t.lux_ignore_active!==void 0?t.lux_ignore_active:Ua,o=t.lux_ignore_scope!==null&&t.lux_ignore_scope!==void 0?t.lux_ignore_scope:Ba;return{threshold:i,watch:s,ignoreActive:a,ignoreScope:o}}function ai(t){const e=`lux ≤ ${t.threshold} lx`+(t.watch?` (watch: ${t.watch}s)`:""),i=[t.ignoreActive?"ignore when active":"",t.ignoreScope==="twilight_slots"?"ignore twilight/night":"",t.ignoreScope==="all_slots"?"ignore lux (all slots)":""].filter(Boolean).join(", ");return`${e}${i?` · ${i}`:""}`}function qi(t,e){const i=t.entity_ids??[];if(i.length===0)return{friendlyName:"No entities configured",subText:"—"};const s=i.map(r=>{var l,c;return((c=(l=e==null?void 0:e.states[r])==null?void 0:l.attributes)==null?void 0:c.friendly_name)??r});let a=s.join(", ");a.length>35&&s.length>1&&(a=`${s[0]} + ${s.length-1} more`);let o=i.join(", ");if(o.length>50&&i.length>1&&(o=`${i[0]} + ${i.length-1} more`),t.type==="motion"){const r=t.retrigger??"every";o+=` [retrigger: ${r}]`}else if(i.length>=2&&t.type==="binary"){const r=t.aggregation??"any",l=r==="count"?`count:${t.aggregation_count??1}`:r;o+=` [combine: ${l}]`}return{friendlyName:a,subText:o}}function si(t,e){const s=e.filter(a=>a.type===t.type).indexOf(t)+1;return`${t.type}_${s}`}function Fa(t){const e=t.trim();if(e==="")return null;const i=e.split(":");if(i.length<1||i.length>3||!i.every(r=>/^\d+$/.test(r)))return null;const[s,a=0,o=0]=i.map(r=>parseInt(r,10));return s>23||a>59||o>59?null:[s,a,o]}function wo(t){const e=Fa(t);if(e===null)return null;const i=s=>String(s).padStart(2,"0");return`${i(e[0])}:${i(e[1])}:${i(e[2])}`}function Vi(t){return t.trim()===""||Fa(t)!==null}function $o(t){return t.map(i=>i==="no_entity"?"No entity configured":i==="user"?"Disabled by user":i.startsWith("activity:")?`Suppressed by: ${i.substring(9)}`:i).join(", ")}var ko=Object.defineProperty,Co=Object.getOwnPropertyDescriptor,ne=(t,e,i,s)=>{for(var a=s>1?void 0:s?Co(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&ko(e,i,a),a};let qt=class extends oe{constructor(){super(...arguments),this.open=!1,this.hass=null,this.config=[],this.templateMode=!1,this._subEditOpen=!1,this._subEditingIndex=null,this._editDraft=null,this._draftController=new ii(this,{onOpen:()=>{this._subEditOpen=!1}})}_closeAndSave(){const t=this._draftController.draft??this.config;this._draftController.closeAndSave(new ki([...t]))}_openAddSensor(){this._subEditingIndex=null,this._editDraft={id:"",name:void 0,type:"illuminance",entity_ids:[],aggregation:void 0},this._subEditOpen=!0}_openEditSensor(t){const e=this._draftController.draft;if(!e)return;const i=e[t];this._subEditingIndex=t,this._editDraft={id:i.id??"",name:i.name??void 0,type:i.type,entity_ids:i.entity_ids??[],aggregation:i.aggregation??void 0},this._subEditOpen=!0}_removeSensor(t){if(!this._draftController.draft)return;const e=[...this._draftController.draft];e.splice(t,1),this._draftController.draft=e,this.requestUpdate()}_saveSubEdit(){if(!this._editDraft||!this._draftController.draft)return;const t=[...this._draftController.draft],e=this._subEditingIndex;e===null?t.push(this._editDraft):t[e]=this._editDraft,this._editDraft.name||(this._editDraft.name=si(this._editDraft,t)),this._draftController.draft=t,this._subEditOpen=!1,this._editDraft=null,this.requestUpdate()}render(){if(!this.open||!this._draftController.draft)return n``;const t=this._draftController.draft,e=t.some(i=>i.type==="illuminance");return n`
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
                ${t.map((i,s)=>{const a=i.entity_ids||[],o=Ha(i.aggregation);return n`
                    <tr
                      class="sensor-row ${this._draftController.draggedIndex===s?"dragging":""}"
                      draggable="true"
                      @dragstart=${r=>this._draftController.onDragStart(r,s)}
                      @dragover=${r=>this._draftController.onDragOver(r,s)}
                      @dragend=${()=>this._draftController.onDragEnd()}
                    >
                      <td style="text-align: center; padding: 0 4px; vertical-align: middle;">
                        <div class="drag-handle" title="Drag to reorder">⋮⋮</div>
                      </td>
                      <td>
                        <div style="font-weight: 600;">${i.name||si(i,t)||i.id}</div>
                        ${i.name&&i.id?n`<div style="font-size: 10px; font-family: monospace; opacity: 0.5;">${i.id}</div>`:""}
                      </td>
                      <td>
                        <span class="type-badge ${i.type}">${i.type}</span>
                      </td>
                      <td>
                        <div style="display: flex; flex-wrap: wrap; gap: 4px; align-items: center;">
                          ${a.length>0?a.map(r=>{var c,f,h;const l=this.templateMode?r:((h=(f=(c=this.hass)==null?void 0:c.states[r])==null?void 0:f.attributes)==null?void 0:h.friendly_name)??r;return n`<span class="pill">${l}</span>`}):n`<span style="opacity: 0.4;">—</span>`}
                          <span class="pill" style="opacity: 0.8;" title="Aggregation mode">Agg: ${o}</span>
                        </div>
                      </td>
                      <td style="text-align: center;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                          <button class="row-action-btn edit" title="Edit sensor" @click=${()=>this._openEditSensor(s)}>✏️</button>
                          <button class="row-action-btn remove" title="Remove sensor" @click=${()=>this._removeSensor(s)}>✕</button>
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
                  @input=${i=>{this._editDraft={...this._editDraft,name:i.target.value.trim()||void 0}}}
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
                      ${(this._editDraft.entity_ids||[]).map((i,s)=>{var o,r,l;const a=this.templateMode?i:((l=(r=(o=this.hass)==null?void 0:o.states[i])==null?void 0:r.attributes)==null?void 0:l.friendly_name)??i;return n`
                          <tr class="entity-row">
                            <td style="padding: 6px 0;">
                              <div style="font-weight: 500;">${a}</div>
                              <div style="font-size: 11px; color: var(--secondary-text-color); font-family: monospace;">${i}</div>
                            </td>
                            <td style="text-align: right; width: 40px;">
                              <button class="entity-remove-btn" @click=${()=>{this._editDraft={...this._editDraft,entity_ids:(this._editDraft.entity_ids||[]).filter((c,f)=>f!==s)}}}>✕</button>
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
                    @value-changed=${i=>{const s=i.detail.value;if(s){const a=this._editDraft.entity_ids||[];a.includes(s)||(this._editDraft={...this._editDraft,entity_ids:[...a,s]}),i.target.value=""}}}
                  ></ha-entity-picker>
                </div>
              `}

              <div class="form-field">
                <label class="form-label">Aggregation</label>
                <div style="font-size: 11px; color: var(--secondary-text-color); margin-bottom: 4px;">
                  How values are combined if multiple entities are added.
                </div>
                <select class="option-select" .value=${this._editDraft.aggregation||"min"} @change=${i=>{const s=i.target.value;this._editDraft={...this._editDraft,aggregation:s}}}>
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
    `}};qt.styles=[Tt,I`
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
    `],ne([p({type:Boolean})],qt.prototype,"open",2),ne([p({attribute:!1})],qt.prototype,"hass",2),ne([p({attribute:!1})],qt.prototype,"config",2),ne([p({type:Boolean})],qt.prototype,"templateMode",2),ne([b()],qt.prototype,"_subEditOpen",2),ne([b()],qt.prototype,"_subEditingIndex",2),ne([b()],qt.prototype,"_editDraft",2),qt=ne([M("twilight-sensors-dialog")],qt);var So=Object.defineProperty,Do=Object.getOwnPropertyDescriptor,Te=(t,e,i,s)=>{for(var a=s>1?void 0:s?Do(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&So(e,i,a),a};let le=class extends L{constructor(){super(...arguments),this.hass=null,this.config=[],this.noHeader=!1,this.templateMode=!1,this._editOpen=!1}_openEdit(){this._editOpen=!0}render(){return n`
      <div class="devices-card">
        ${this.noHeader?"":n`
          <div class="devices-card-header">
            <span class="card-dot" style="--dot-color: #3b82f6;"></span>
            <span class="devices-card-title">Sensors</span>
            <button class="edit-btn" @click=${this._openEdit}>⋮</button>
          </div>
        `}
        <div class="entity-list">
          ${(this.config||[]).map((t,e)=>{const i=t.entity_ids||[],s=this.templateMode?i.length>0?i.join(", "):"Template Sensor (No Entities)":i.map(o=>{var r,l,c;return((c=(l=(r=this.hass)==null?void 0:r.states[o])==null?void 0:l.attributes)==null?void 0:c.friendly_name)??o}).join(", ")||"—",a=Ha(t.aggregation||"min");return n`
              <div class="entity-row">
                <span class="type-badge ${t.type}">${t.type}</span>
                <div class="entity-name-wrap">
                  <span class="entity-name">${t.name||"Illuminance Sensors"}</span>
                  <span class="entity-id">${s}</span>
                </div>
                <span class="agg-badge" title="Aggregation Method">
                  ${a}
                </span>
              </div>
              ${e<this.config.length-1?n`<div class="divider"></div>`:""}
            `})}
          ${!this.config||this.config.length===0?n`
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
    `}};le.styles=I`
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

    .card-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--dot-color, #3b82f6);
      box-shadow: 0 0 6px var(--dot-color, #3b82f6);
      flex-shrink: 0;
      display: inline-block;
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
  `,Te([p({attribute:!1})],le.prototype,"hass",2),Te([p({attribute:!1})],le.prototype,"config",2),Te([p({type:Boolean})],le.prototype,"noHeader",2),Te([p({type:Boolean})],le.prototype,"templateMode",2),Te([b()],le.prototype,"_editOpen",2),le=Te([M("twilight-sensors-card")],le);const Ao="respect_lux",Yi="slot",Wa="turn_off";function Gi(t){return{auto_expire:(t==null?void 0:t.auto_expire)??"03:00:00",transition_off_seconds:(t==null?void 0:t.transition_off_seconds)??0,expire_check_mode:Ao,action_type:Yi,release_action_type:Wa}}function qa(t){const e=t.trim();if(e==="")return null;const i=e.split(":");if(i.length>3||!i.every(a=>/^\d+$/.test(a)))return null;const s=i.map(a=>parseInt(a,10));return s.length===1?s[0]:s.length===2?s[0]*60+s[1]:s[0]*3600+s[1]*60+s[2]}function To(t){const e=Math.floor(t/3600),i=Math.floor(t%3600/60),s=t%60,a=o=>String(o).padStart(2,"0");return`${a(e)}:${a(i)}:${a(s)}`}function Eo(t){const e=qa(t);return e===null?null:To(e)}function Xi(t){return t.trim()===""||qa(t)!==null}function Va(t,e){const i=t??e;if(i==null)return"—";if(i==="00:00:00"||i===0||i==="0")return"none";if(typeof i=="number"){if(i<=0)return"none";const a=Math.floor(i/3600),o=Math.floor(i%3600/60),r=Math.floor(i%60);let l="";return a>0&&(l+=`${a}h `),o>0&&(l+=`${o}m `),r>0&&(l+=`${r}s`),l.trim()||"none"}const s=i.split(":");if(s.length===3){const a=parseInt(s[0],10),o=parseInt(s[1],10),r=parseInt(s[2],10);let l="";return a>0&&(l+=`${a}h `),o>0&&(l+=`${o}m `),r>0&&(l+=`${r}s`),l.trim()||"none"}return i}function Ya(t){var i;const e=(t==null?void 0:t.type)||Yi;return e==="slot"?"slot":e==="none"?"none":e==="reset"?"reset":e==="simulation"?"simulation":e==="entity"?`entity: ${((t==null?void 0:t.entity_id)||"").split(".")[1]||(t==null?void 0:t.entity_id)||"—"}`:e==="light"?`lights: ${((i=t==null?void 0:t.targets)==null?void 0:i.length)??0}`:e}function Ga(t){const e=(t==null?void 0:t.type)||Wa;return e==="turn_off"?"turn off":e==="slot"?"restore slot":e==="none"?"nothing":e}function Xa(t,e){var s;const i=e==null?void 0:e.find(a=>a.id===t);return(s=i==null?void 0:i.action)!=null&&s.type?i.action.type:Yi}function Ka(t){return!t||t.length===0?[{id:"sleep",suppress_inputs:[],auto_expire:null}]:t}var Oo=Object.defineProperty,Io=Object.getOwnPropertyDescriptor,Ut=(t,e,i,s)=>{for(var a=s>1?void 0:s?Io(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&Oo(e,i,a),a};let Ct=class extends L{constructor(){super(...arguments),this.open=!1,this.hass=null,this.input=null,this.editIndex=null,this.activities=[],this.rules=[],this.placeholderDefaults=null,this.templateMode=!1,this.siblings=[],this._editDraft=null}willUpdate(t){(t.has("open")||t.has("input"))&&(this.open&&this.input?this._editDraft={...this.input}:this.open||(this._editDraft=null))}_cancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}_canTargetRule(t){return t.type==="binary"||t.type==="button"&&t.button_mode==="toggle"}_isSaveDisabled(t){const e=!this.templateMode&&t.type!=="timer"&&t.type!=="button"&&(!t.entity_ids||t.entity_ids.length===0),i=t.type==="timer"&&!Vi(t.trigger_time??""),s=!t.activity&&!t.rule,a=!!t.rule&&!this._canTargetRule(t);return e||i||s||a}_save(){if(!this._editDraft||this._isSaveDisabled(this._editDraft))return;const t={...this._editDraft,enabled:this.templateMode?!0:this._editDraft.enabled};if(t.type==="timer"?(t.trigger_time=wo(t.trigger_time??"")??"00:00:00",delete t.entity_ids,delete t.aggregation,delete t.aggregation_count,delete t.retrigger,delete t.event_type,delete t.lux_threshold,delete t.lux_watch_window,delete t.lux_ignore_active,delete t.lux_ignore_scope,delete t.label,delete t.button_mode,delete t.create_entity):t.type==="button"?(delete t.entity_ids,delete t.aggregation,delete t.aggregation_count,delete t.retrigger,delete t.event_type,delete t.lux_threshold,delete t.lux_watch_window,delete t.lux_ignore_active,delete t.lux_ignore_scope):(delete t.trigger_time,delete t.label,delete t.button_mode,delete t.create_entity,t.type!=="event"&&delete t.event_type,t.type!=="motion"&&(delete t.lux_threshold,delete t.lux_watch_window,delete t.lux_ignore_active,delete t.lux_ignore_scope),t.type!=="motion"&&delete t.retrigger,t.type!=="binary"&&(delete t.aggregation,delete t.aggregation_count)),!t.name){const e=this.editIndex,i=e===null?[...this.siblings,t]:this.siblings.map((s,a)=>a===e?t:s);t.name=t.label||si(t,i)}this.dispatchEvent(new CustomEvent("save",{detail:t,bubbles:!0,composed:!0}))}_getIncludeDomains(t){return t==="binary"?["input_boolean","binary_sensor","switch","sensor"]:t==="event"?["event"]:t==="motion"?["binary_sensor","device_tracker","sensor","input_boolean","switch"]:[]}render(){var r,l,c,f,h,g;if(!this.open||!this._editDraft)return n``;const t=this._editDraft,e=this.editIndex!==null,i=this._isSaveDisabled(t),s=this._getIncludeDomains(t.type),a=((r=t.entity_ids)==null?void 0:r[0])||"",o=t.type==="event"&&a&&((f=(c=(l=this.hass)==null?void 0:l.states[a])==null?void 0:c.attributes)==null?void 0:f.event_types)||[];return n`
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
                  @input=${d=>{this._editDraft={...this._editDraft,name:d.target.value.trim()||void 0}}}
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
                  <select class="option-select" .value=${t.type} @change=${d=>{var y;const u=d.target.value,v=u==="binary";this._editDraft={...this._editDraft,type:u,entity_ids:[],aggregation:void 0,aggregation_count:void 0,retrigger:void 0,event_type:void 0,lux_threshold:null,lux_watch_window:null,lux_ignore_active:null,lux_ignore_scope:null,trigger_time:"00:00:00",label:"",button_mode:"click",...(y=this._editDraft)!=null&&y.rule&&!v?{rule:null,activity:this.activities[0]??null}:{}}}}>
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
                        ${this.activities.map(d=>n`
                          <option value="${d}" ?selected=${d===t.activity}>${d}</option>
                        `)}
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
                    class="activity-input ${Vi(t.trigger_time??"")?"":"invalid"}"
                    .value=${t.trigger_time??"00:00:00"}
                    placeholder="22:00:00"
                    @input=${d=>{this._editDraft={...this._editDraft,trigger_time:d.target.value.trim()}}}
                  />
                  <span class="form-hint">Accepts <code>22</code>, <code>22:30</code> or <code>22:30:15</code> — saved as HH:MM:SS.</span>
                  ${Vi(t.trigger_time??"")?"":n`
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
                    <select class="option-select" .value=${t.button_mode??"click"} @change=${d=>{var v;const u=d.target.value;this._editDraft={...this._editDraft,button_mode:u,...(v=this._editDraft)!=null&&v.rule&&u==="click"?{rule:null,activity:this.activities[0]??null}:{}}}}>
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
                      ${(t.entity_ids||[]).map((d,u)=>{var y,k,x;const v=((x=(k=(y=this.hass)==null?void 0:y.states[d])==null?void 0:k.attributes)==null?void 0:x.friendly_name)??d;return n`
                          <tr class="sensor-row">
                            <td style="padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                              <div style="font-weight: 500; font-size: 13px;">${v}</div>
                              <div style="font-size: 11px; color: var(--secondary-text-color); font-family: monospace;">${d}</div>
                            </td>
                            <td style="text-align: center; width: 40px; padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                              <button class="sensor-remove-btn" title="Remove entity" @click=${()=>{this._editDraft={...this._editDraft,entity_ids:(this._editDraft.entity_ids||[]).filter((_,C)=>C!==u)}}}>✕</button>
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
                    .includeDomains=${s}
                    allow-custom-entity
                    label="Add input entity"
                    @value-changed=${d=>{const u=d.detail.value;if(u){const v=this._editDraft.entity_ids||[];v.includes(u)||(this._editDraft={...this._editDraft,entity_ids:[...v,u]});const y=d.target;y&&(y.value="")}}}
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
                  <select class="option-select" .value=${t.aggregation??"any"} @change=${d=>{const u=d.target.value||void 0;this._editDraft={...this._editDraft,aggregation:u,aggregation_count:u!=="count"?void 0:this._editDraft.aggregation_count}}}>
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
                      @input=${d=>{const u=d.target.value;this._editDraft={...this._editDraft,aggregation_count:u!==""?Number(u):1}}}
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
                      .placeholder=${String(((h=this.placeholderDefaults)==null?void 0:h.lux_threshold)??30)}
                      .value=${t.lux_threshold!==null?String(t.lux_threshold):""}
                      @input=${d=>{const u=d.target.value;this._editDraft={...this._editDraft,lux_threshold:u!==""?Number(u):null}}}
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
                      @input=${d=>{const u=d.target.value;this._editDraft={...this._editDraft,lux_watch_window:u!==""?Number(u):null}}}
                      min="0"
                    />
                  </div>
                </div>

                <div class="form-field" style="margin-top: 4px;">
                  <span class="form-label">Ignore lux when scene active</span>
                  <select class="option-select" .value=${String(t.lux_ignore_active)} @change=${d=>{const u=d.target.value;this._editDraft={...this._editDraft,lux_ignore_active:u==="true"}}}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div class="form-field" style="margin-top: 4px;">
                  <span class="form-label">Ignore lux during</span>
                  <select class="option-select" .value=${t.lux_ignore_scope??"none"} @change=${d=>{const u=d.target.value;this._editDraft={...this._editDraft,lux_ignore_scope:u}}}>
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
    `}};Ct.styles=[Tt,I`
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
    `],Ut([p({type:Boolean})],Ct.prototype,"open",2),Ut([p({attribute:!1})],Ct.prototype,"hass",2),Ut([p({attribute:!1})],Ct.prototype,"input",2),Ut([p({type:Number})],Ct.prototype,"editIndex",2),Ut([p({type:Array})],Ct.prototype,"activities",2),Ut([p({attribute:!1})],Ct.prototype,"rules",2),Ut([p({attribute:!1})],Ct.prototype,"placeholderDefaults",2),Ut([p({type:Boolean})],Ct.prototype,"templateMode",2),Ut([p({attribute:!1})],Ct.prototype,"siblings",2),Ut([b()],Ct.prototype,"_editDraft",2),Ct=Ut([M("twilight-input-row-editor")],Ct);function zo(t){return{id:"",name:void 0,type:"binary",activity:t,enabled:!0,entity_ids:[],aggregation:void 0,aggregation_count:void 0,retrigger:void 0,trigger_time:"00:00:00",event_type:void 0,lux_threshold:null,lux_watch_window:null,lux_ignore_active:Ua,lux_ignore_scope:Ba,label:"",button_mode:"click",create_entity:!1}}var Mo=Object.defineProperty,Po=Object.getOwnPropertyDescriptor,vt=(t,e,i,s)=>{for(var a=s>1?void 0:s?Po(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&Mo(e,i,a),a};let ot=class extends oe{constructor(){super(...arguments),this.open=!1,this.hass=null,this.config=[],this.activities=[],this.activitiesConfig=[],this.rulesConfig=[],this.placeholderDefaults=null,this.runState=null,this.templateMode=!1,this.areaId=null,this._subEditOpen=!1,this._subEditingIndex=null,this._subEditInput=null,this._dialog=new be(this),this._draftController=new ii(this,{onOpen:()=>{this._subEditOpen=!1}})}_closeDiscard(){this._draftController.closeDiscard()}_getRuleName(t){if(!t)return"None";const e=(this.rulesConfig||[]).find(i=>i.id===t);return(e==null?void 0:e.name)||(e==null?void 0:e.id)||t}_closeAndSave(){this._draftController.closeAndSave(new Ci(this._draftController.draft||[]))}_openAddInput(){this._subEditingIndex=null,this._subEditInput=zo(this.activities[0]||""),this._subEditOpen=!0}_openEditInput(t){const e=this._draftController.draft;e&&(this._subEditingIndex=t,this._subEditInput={...e[t]},this._subEditOpen=!0)}_onSubEditSave(t){const e=this._draftController.draft;if(!e)return;const i=t.detail,s=this._subEditingIndex,a=s===null?[...e,i]:e.map((o,r)=>r===s?i:o);this._draftController.draft=a,this._subEditOpen=!1,this.requestUpdate()}_onSubEditCancel(){this._subEditOpen=!1}_onRemoveInput(t){const e=this._draftController.draft;e&&(this._draftController.draft=e.filter((i,s)=>s!==t),this.requestUpdate())}_getResolvedMotionInfo(t){return Wi(t,this.placeholderDefaults)}render(){if(!this.open||!this._draftController.draft)return n``;const t=this._draftController.draft;return n`
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
                ${t.map((e,i)=>{var g,d;let s=n`—`,a=n`—`;if(this.templateMode)if(e.type==="motion"){const u=this._getResolvedMotionInfo(e),v=ai(u);s=n`<div style="opacity: 0.7; font-size: 11px;">${v}</div>`}else e.type==="timer"?s=n`<div class="entity-id">Trigger Time: ${e.trigger_time??"00:00:00"}</div>`:e.type==="event"&&e.event_type?s=n`<div style="opacity: 0.7; font-size: 11px;">Event Type: ${e.event_type}</div>`:e.type==="button"&&(s=n`<div style="opacity: 0.7; font-size: 11px;">Mode: ${e.button_mode??"click"}</div>`);else if(e.type==="motion"){const{friendlyName:u,subText:v}=qi(e,this.hass??void 0);a=n`<div style="font-weight: 500; word-break: break-word;">${e.name||u}</div>`;const y=this._getResolvedMotionInfo(e),k=ai(y);s=n`
                        <div class="entity-id">${e.name?`${u} (${v})`:v}</div>
                        <div style="opacity: 0.7; font-size: 11px; margin-top: 2px;">${k}</div>
                      `}else if(e.type==="timer")a=n`<div style="font-weight: 500; word-break: break-word;">${e.name||"Daily Timer"}</div>`,s=n`<div class="entity-id">Trigger Time: ${e.trigger_time??"00:00:00"}</div>`;else if(e.type==="button")a=n`<div style="font-weight: 500; word-break: break-word;">${e.name||e.label||e.id}</div>`,s=n`<div style="opacity: 0.7; font-size: 11px;">Mode: ${e.button_mode??"click"}${e.create_entity?n` <ha-icon icon="mdi:home-assistant" style="--mdc-icon-size: 12px; vertical-align: middle;"></ha-icon>`:""}</div>`;else if(e.entity_ids&&e.entity_ids.length>0){const{friendlyName:u,subText:v}=qi(e,this.hass??void 0);a=n`<div style="font-weight: 500; word-break: break-word;">${e.name||u}</div>`;let y=v;e.type==="event"&&e.event_type&&(y+=` [event: ${e.event_type}]`),s=n`<div class="entity-id">${e.name?`${u} (${y})`:y}</div>`}const o=(d=(g=this.runState)==null?void 0:g.inputs)==null?void 0:d[e.id],r=(o==null?void 0:o.disabled_by)||[],l=!!(e.entity_ids&&e.entity_ids.length>0),c=new Set;!this.templateMode&&e.type!=="timer"&&e.type!=="button"&&!l&&c.add("no_entity"),e.enabled===!1&&c.add("user");for(const u of r)c.add(u);const f=Array.from(c),h=e.enabled===!1||!this.templateMode&&e.type!=="timer"&&e.type!=="button"&&!l||f.length>0;return n`
                    <tr
                      class="input-row ${this._draftController.draggedIndex===i?"dragging":""} ${h?"disabled":""}"
                      draggable="true"
                      @dragstart=${u=>this._draftController.onDragStart(u,i)}
                      @dragover=${u=>this._draftController.onDragOver(u,i)}
                      @dragend=${()=>this._draftController.onDragEnd()}
                    >
                      <td style="text-align: center; padding: 0 4px; vertical-align: middle;">
                        <div class="drag-handle" title="Drag to reorder">⋮⋮</div>
                      </td>
                      <td>
                        <div style="font-weight: 600;">${e.name||e.label||si(e,t)||e.id}</div>
                        ${(e.name||e.label)&&e.id?n`<div style="font-size: 10px; font-family: monospace; opacity: 0.5;">${e.id}</div>`:""}
                      </td>
                      <td>
                        <div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-start;">
                          <span class="type-badge ${e.type}">${e.type}</span>
                          ${f.map(u=>{let v="user",y="Disabled";return u==="no_entity"?(v="no_entity",y="No Entity"):u.startsWith("activity:")&&(v="activity",y=`Suppressed: ${u.substring(9)}`),n`
                              <span class="status-badge ${v}">${y}</span>
                            `})}
                        </div>
                      </td>
                      <td>
                        ${a}
                        ${s}
                      </td>
                      <td>
                        ${e.rule?n`
                          <span class="pill" title="Targets Rule">${this._getRuleName(e.rule)}</span>
                        `:n`
                          <span class="pill">${e.activity||"None"}</span>
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
        .rules=${this.rulesConfig}
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
    `}};ot.styles=[se,Tt,I`
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
    `],vt([p({type:Boolean})],ot.prototype,"open",2),vt([p({attribute:!1})],ot.prototype,"hass",2),vt([p({attribute:!1})],ot.prototype,"config",2),vt([p({type:Array})],ot.prototype,"activities",2),vt([p({attribute:!1})],ot.prototype,"activitiesConfig",2),vt([p({attribute:!1})],ot.prototype,"rulesConfig",2),vt([p({attribute:!1})],ot.prototype,"placeholderDefaults",2),vt([p({attribute:!1})],ot.prototype,"runState",2),vt([p({type:Boolean})],ot.prototype,"templateMode",2),vt([p({type:String})],ot.prototype,"areaId",2),vt([b()],ot.prototype,"_subEditOpen",2),vt([b()],ot.prototype,"_subEditingIndex",2),vt([b()],ot.prototype,"_subEditInput",2),ot=vt([M("twilight-inputs-dialog")],ot);var No=Object.defineProperty,Ro=Object.getOwnPropertyDescriptor,Ot=(t,e,i,s)=>{for(var a=s>1?void 0:s?Ro(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&No(e,i,a),a};let bt=class extends L{constructor(){super(...arguments),this.hass=null,this.config=[],this.activities=[],this.activitiesConfig=[],this.rulesConfig=[],this.noHeader=!1,this.placeholderDefaults=null,this.runState=null,this.templateMode=!1,this.areaId=null,this._editOpen=!1}_openEdit(){this._editOpen=!0}async _triggerButton(t,e){if(!this.hass||this._editOpen)return;const i=this.areaId;if(!i)return;const s={area_id:i,input_id:t.id};t.button_mode==="toggle"&&e!==void 0&&(s.active=e);try{await io(this.hass,s)}catch(a){console.error("[twilight] trigger_input failed",a)}}_renderManualTriggers(){const t=this.config.filter(e=>e.type==="button");return t.length===0?n``:n`
      <div style="padding: 10px 12px 4px; border-bottom: 1px solid rgba(255,255,255,0.08);">
        <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--secondary-text-color); margin-bottom: 8px;">Manual Triggers</div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; padding-bottom: 10px;">
          ${t.map(e=>{var l,c,f;const i=(c=(l=this.runState)==null?void 0:l.inputs)==null?void 0:c[e.id],s=(i==null?void 0:i.active)||!1,o=(((f=i==null?void 0:i.disabled_by)==null?void 0:f.filter(h=>h!=="no_entity"))||[]).length>0||!!this._editOpen,r=e.name||e.label||e.id;return e.button_mode==="toggle"?n`
                <button
                  class="manual-trigger-btn ${s?"active":""}"
                  ?disabled=${o}
                  title="${o?"Disabled":s?"Click to deactivate":"Click to activate"}"
                  @click=${()=>this._triggerButton(e,!s)}
                >
                  <span class="manual-trigger-icon">${"⏻"}</span>
                  ${r}
                  ${s?n`<span class="manual-trigger-dot"></span>`:""}
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
    `}_getEntityDisplay(t){return qi(t,this.hass??void 0)}_getActivityActionType(t){return t?Xa(t,this.activitiesConfig):"none"}_getRuleName(t){const e=(this.rulesConfig||[]).find(i=>i.id===t);return(e==null?void 0:e.name)||t}render(){return n`
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
          ${this.config.map((t,e)=>{var h,g;const i=(g=(h=this.runState)==null?void 0:h.inputs)==null?void 0:g[t.id],s=(i==null?void 0:i.disabled_by)||[],a=this.templateMode||t.type==="button"?s.filter(d=>d!=="no_entity"):s,o=a.length>0,r=(i==null?void 0:i.active)||!1;let l="user";a.includes("no_entity")?l="no_entity":a.some(d=>d.startsWith("activity:"))&&(l="activity");let c=n`—`,f=n`—`;if(this.templateMode)if(t.type==="motion"){c=n`<span class="entity-name">${t.name||"Motion Sensor"}</span>`;const d=Wi(t,this.placeholderDefaults),u=ai(d);f=n`<span class="entity-id" style="margin-top: 2px; font-family: inherit;">${u}</span>`}else t.type==="timer"?(c=n`<span class="entity-name">${t.name||"Daily Timer"}</span>`,f=n`<span class="entity-id">Trigger Time: ${t.trigger_time??"00:00:00"}</span>`):t.type==="event"?(c=n`<span class="entity-name">${t.name||"Event Input"}</span>`,t.event_type&&(f=n`<span class="entity-id">Event Type: ${t.event_type}</span>`)):t.type==="binary"?c=n`<span class="entity-name">${t.name||"Binary Input"}</span>`:t.type==="button"&&(c=n`<span class="entity-name">${t.name||t.label||"Button"}</span>`,f=n`<span class="entity-id">Mode: ${t.button_mode??"click"}</span>`);else if(t.type==="motion"){const{friendlyName:d,subText:u}=this._getEntityDisplay(t);c=n`<span class="entity-name">${t.name||d}</span>`;const v=Wi(t,this.placeholderDefaults),y=ai(v);f=n`
                  <span class="entity-id" style="font-family: monospace;">${t.name?`${d} (${u})`:u}</span>
                  <span class="entity-id" style="margin-top: 2px; font-family: inherit;">${y}</span>
                `}else if(t.type==="timer")c=n`<span class="entity-name">${t.name||"Daily Timer"}</span>`,f=n`
                  <span class="entity-id">Trigger Time: ${t.trigger_time??"00:00:00"}</span>
                `;else if(t.type==="button")c=n`<span class="entity-name">${t.name||t.label||"Button"}</span>`,f=n`<span class="entity-id">Mode: ${t.button_mode??"click"}${t.create_entity?n` <ha-icon icon="mdi:home-assistant" style="--mdc-icon-size: 12px; vertical-align: middle;"></ha-icon>`:""}</span>`;else{const{friendlyName:d,subText:u}=this._getEntityDisplay(t);c=n`<span class="entity-name">${t.name||d}</span>`;let v="";t.type==="event"&&t.event_type&&(v=` [event: ${t.event_type}]`),f=n`
                  <span class="entity-id">${t.name?`${d} (${u})`:u}${v}</span>
                `}return n`
              <div class="entity-row ${o?"disabled":""}">
                <span class="type-badge ${t.type}">${t.type}</span>
                <div class="entity-name-wrap">
                  ${c}
                  ${f}
                </div>
                ${r?n`<span class="active-indicator" title="Sensor active"></span>`:""}
                ${t.rule?n`
                  <span class="activity-badge rule" title="Targets Rule">${this._getRuleName(t.rule)}</span>
                `:t.activity?n`
                  <span class="activity-badge ${this._getActivityActionType(t.activity)}">${t.activity}</span>
                `:n`
                  <span class="activity-badge none">None</span>
                `}
                ${o?n`
                  <div class="disabled-overlay">
                    <span class="disabler-badge ${l}">
                      ${$o(a)}
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

      <twilight-inputs-dialog
        .open=${this._editOpen}
        .hass=${this.hass}
        .config=${this.config}
        .activities=${this.activities}
        .activitiesConfig=${this.activitiesConfig}
        .rulesConfig=${this.rulesConfig}
        .placeholderDefaults=${this.placeholderDefaults}
        .runState=${this.runState}
        .templateMode=${this.templateMode}
        .areaId=${this.areaId}
        @close=${()=>{this._editOpen=!1}}
      ></twilight-inputs-dialog>
    `}};bt.styles=[se,I`
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

      .card-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--dot-color, #10b981);
        box-shadow: 0 0 6px var(--dot-color, #10b981);
        flex-shrink: 0;
        display: inline-block;
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
    `],Ot([p({attribute:!1})],bt.prototype,"hass",2),Ot([p({attribute:!1})],bt.prototype,"config",2),Ot([p({type:Array})],bt.prototype,"activities",2),Ot([p({attribute:!1})],bt.prototype,"activitiesConfig",2),Ot([p({attribute:!1})],bt.prototype,"rulesConfig",2),Ot([p({type:Boolean})],bt.prototype,"noHeader",2),Ot([p({attribute:!1})],bt.prototype,"placeholderDefaults",2),Ot([p({attribute:!1})],bt.prototype,"runState",2),Ot([p({type:Boolean})],bt.prototype,"templateMode",2),Ot([p({type:String})],bt.prototype,"areaId",2),Ot([b()],bt.prototype,"_editOpen",2),bt=Ot([M("twilight-inputs-card")],bt);var Lo=Object.defineProperty,jo=Object.getOwnPropertyDescriptor,oi=(t,e,i,s)=>{for(var a=s>1?void 0:s?jo(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&Lo(e,i,a),a};let Ee=class extends L{constructor(){super(...arguments),this.channels={},this.excludedSlotIds={},this._expandedNodes={}}get _nodes(){return Object.keys(this.channels).sort((e,i)=>e===O?-1:i===O?1:0).map(e=>{var i,s;return{id:e,label:((i=this.channels[e])==null?void 0:i.name)||e,children:(((s=this.channels[e])==null?void 0:s.slots)??[]).map(a=>({id:a.id,label:a.name||a.id}))}})}_isExcluded(t,e){return(this.excludedSlotIds[t]??[]).includes(e)}_isChannelIndeterminate(t){if(t.children.length===0)return!1;const e=t.children.filter(i=>this._isExcluded(t.id,i.id)).length;return e>0&&e<t.children.length}_isChannelFullyExcluded(t){return t.children.length>0&&t.children.every(e=>this._isExcluded(t.id,e.id))}_setChannelExcluded(t,e,i){const s={...this.excludedSlotIds};s[t]=i?e:[],this._emit(s)}_setSlotExcluded(t,e,i){const s=new Set(this.excludedSlotIds[t]??[]);i?s.add(e):s.delete(e);const a={...this.excludedSlotIds,[t]:[...s]};this._emit(a)}_emit(t){this.excludedSlotIds=t,this.dispatchEvent(new CustomEvent("excluded-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_toggleExpanded(t){this._expandedNodes={...this._expandedNodes,[t]:!this._expandedNodes[t]}}render(){const t=this._nodes;return t.length===0?n``:n`
      <p class="hint">Unchecked channels/slots are excluded: while this activity is active and one of its excluded slots is current, that channel is turned off instead of following the schedule.</p>
      <div class="tree">
        ${t.map(e=>{const i=!!this._expandedNodes[e.id],s=this._isChannelFullyExcluded(e);return n`
            <div class="tree-node">
              <div
                class="tree-node-header"
                @click=${a=>{a.target.tagName!=="INPUT"&&this._toggleExpanded(e.id)}}
              >
                <span class="tree-node-chevron ${i?"expanded":""}">&#9656;</span>
                <input
                  type="checkbox"
                  .checked=${!s}
                  .indeterminate=${this._isChannelIndeterminate(e)}
                  @change=${a=>{const o=a.target.checked;this._setChannelExcluded(e.id,e.children.map(r=>r.id),!o)}}
                />
                <span>${e.label}</span>
              </div>

              ${i?n`
                <div class="tree-node-children">
                  ${e.children.map(a=>n`
                    <div class="tree-leaf">
                      <input
                        type="checkbox"
                        .checked=${!this._isExcluded(e.id,a.id)}
                        @change=${o=>{const r=o.target.checked;this._setSlotExcluded(e.id,a.id,!r)}}
                      />
                      <span>${a.label}</span>
                    </div>
                  `)}
                </div>
              `:""}
            </div>
          `})}
      </div>
    `}};Ee.styles=I`
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
  `,oi([p({attribute:!1})],Ee.prototype,"channels",2),oi([p({attribute:!1})],Ee.prototype,"excludedSlotIds",2),oi([b()],Ee.prototype,"_expandedNodes",2),Ee=oi([M("twilight-slot-action-tree")],Ee);var Ho=Object.defineProperty,Uo=Object.getOwnPropertyDescriptor,It=(t,e,i,s)=>{for(var a=s>1?void 0:s?Uo(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&Ho(e,i,a),a};const Za={input_boolean:[{value:"on",label:"On"},{value:"off",label:"Off"},{value:"toggle",label:"Toggle"}],switch:[{value:"on",label:"On"},{value:"off",label:"Off"},{value:"toggle",label:"Toggle"}],script:[{value:"activate",label:"Activate"}]};function Bo(){return{id:"",name:"",suppress_inputs:[],auto_expire:null,expire_check_mode:null,action_type:"",action_entity_id:"",action_targets:[],action_target_picker_value:"",action_state:"on",action_brightness:255,action_color_temp:370,action_entity_targets:[],action_excluded_slot_ids:{},action_sim_template_activity:"",action_sim_lux_mode:"dusk_dawn",action_sim_heatmap_profile_id:"",release_action_type:"",transition_off_seconds:null}}function Fo(t){const e=t.action,i=t.release_action;return{id:t.id,name:t.name??"",suppress_inputs:[...t.suppress_inputs??[]],auto_expire:t.auto_expire??null,expire_check_mode:t.expire_check_mode??null,action_type:(e==null?void 0:e.type)??"",action_entity_id:(e==null?void 0:e.entity_id)??"",action_targets:(e==null?void 0:e.targets)??[],action_target_picker_value:"",action_state:(e==null?void 0:e.state)??"on",action_brightness:(e==null?void 0:e.brightness)??255,action_color_temp:(e==null?void 0:e.color_temp)??370,action_entity_targets:[...(e==null?void 0:e.entity_targets)??[]],action_excluded_slot_ids:{...(e==null?void 0:e.excluded_slot_ids)??{}},action_sim_template_activity:(e==null?void 0:e.template_activity)??"",action_sim_lux_mode:(e==null?void 0:e.lux_mode)??"dusk_dawn",action_sim_heatmap_profile_id:(e==null?void 0:e.heatmap_profile_id)??"",release_action_type:(i==null?void 0:i.type)??"",transition_off_seconds:t.transition_off_seconds??null}}let mt=class extends L{constructor(){super(...arguments),this.open=!1,this.hass=null,this.activity=null,this.editIndex=null,this.inputs=[],this.placeholderDefaults=null,this.channels={},this.existingIds=[],this.allActivities=[],this.heatmapProfiles=[],this._editDraft=null}willUpdate(t){(t.has("open")||t.has("activity"))&&(this.open&&this.activity?this._editDraft=this.editIndex===null&&this.activity.id===""?Bo():Fo(this.activity):this.open||(this._editDraft=null))}_getFallbackActivityInfo(){return Gi(this.placeholderDefaults)}_eligibleTemplateActivities(){var e;const t=(e=this._editDraft)==null?void 0:e.id.trim().toLowerCase();return this.allActivities.filter(i=>{var a;if(i.id===t)return!1;const s=((a=i.action)==null?void 0:a.type)??"slot";return s==="slot"||s==="entity"||s==="light"})}_cancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}_isSaveDisabled(t){const e=!!(t.name.trim()||t.id.trim()),i=t.auto_expire!==null&&!Xi(t.auto_expire);return!e||i}_save(){if(!this._editDraft)return;let t=this._editDraft.id.trim().toLowerCase();const e=this._editDraft.name.trim()||t||"Activity";t||(t=`activity_${Array.from({length:8},()=>Math.floor(Math.random()*16).toString(16)).join("")}`);const i=this._getFallbackActivityInfo(),s=this._editDraft.action_type===""?i.action_type:this._editDraft.action_type,a=this._editDraft.action_type===""?null:this._editDraft.action_type,o={type:a};a==="entity"?o.entity_id=this._editDraft.action_entity_id:a==="light"?(o.targets=this._editDraft.action_targets,o.state=this._editDraft.action_state,this._editDraft.action_state==="on"&&(o.brightness=this._editDraft.action_brightness,this._editDraft.action_color_temp>0&&(o.color_temp=this._editDraft.action_color_temp))):a==="reset"?this._editDraft.action_entity_targets.length>0&&(o.entity_targets=this._editDraft.action_entity_targets):a==="simulation"?(o.mode="presence_heatmap",o.template_activity=this._editDraft.action_sim_template_activity,o.lux_mode=this._editDraft.action_sim_lux_mode,this._editDraft.action_sim_heatmap_profile_id&&(o.heatmap_profile_id=this._editDraft.action_sim_heatmap_profile_id)):s==="slot"&&Object.values(this._editDraft.action_excluded_slot_ids).some(h=>h.length>0)&&(o.excluded_slot_ids=this._editDraft.action_excluded_slot_ids);const l={type:s==="reset"?"none":this._editDraft.release_action_type===""?null:this._editDraft.release_action_type},c=this._editDraft.auto_expire===null?null:Eo(this._editDraft.auto_expire),f={id:t,name:e,suppress_inputs:s==="reset"?[]:this._editDraft.suppress_inputs,auto_expire:s==="reset"?null:c,...s!=="reset"&&{expire_check_mode:this._editDraft.expire_check_mode??"respect_lux"},transition_off_seconds:this._editDraft.transition_off_seconds,action:o,release_action:l};this.dispatchEvent(new CustomEvent("save",{detail:f,bubbles:!0,composed:!0}))}render(){if(!this.open||!this._editDraft)return n``;const t=this._editDraft,e=this.editIndex!==null,i=this._isSaveDisabled(t),s=this._getFallbackActivityInfo(),a=t.action_type===""?s.action_type:t.action_type;return n`
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
                    .value=${t.action_type||s.action_type}
                    @change=${o=>{this._editDraft={...this._editDraft,action_type:o.target.value}}}
                  >
                    <option value="slot">Slot</option>
                    <option value="entity">Scene / Script</option>
                    <option value="light">Direct Lights</option>
                    <option value="none">None (Block Only)</option>
                    <option value="reset">Reset (Off + Clear)</option>
                    <option value="simulation">Presence Simulation</option>
                  </select>
                </div>

                ${a==="slot"?n`
                  <div class="form-field">
                    <span class="form-label">Excluded Channels / Slots</span>
                    <twilight-slot-action-tree
                      .channels=${this.channels}
                      .excludedSlotIds=${t.action_excluded_slot_ids}
                      @excluded-changed=${o=>{this._editDraft={...this._editDraft,action_excluded_slot_ids:o.detail.value}}}
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
                        ${t.action_entity_targets.map((o,r)=>{var h,g,d;const l=o.entity_id.split(".")[0],c=Za[l]??[],f=((d=(g=(h=this.hass)==null?void 0:h.states[o.entity_id])==null?void 0:g.attributes)==null?void 0:d.friendly_name)??o.entity_id;return n`
                            <tr class="sensor-row">
                              <td style="padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                                <div style="font-weight: 500; font-size: 13px;">${f}</div>
                                <div style="font-size: 11px; color: var(--secondary-text-color); font-family: monospace;">${o.entity_id}</div>
                              </td>
                              <td style="text-align: right; width: 170px; padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                                <select
                                  class="option-select"
                                  style="width: 100%; min-width: 0;"
                                  @change=${u=>{const v=[...this._editDraft.action_entity_targets];v[r]={...o,action:u.target.value},this._editDraft={...this._editDraft,action_entity_targets:v}}}
                                >
                                  ${c.map(u=>n`<option value=${u.value} ?selected=${u.value===o.action}>${u.label}</option>`)}
                                </select>
                              </td>
                              <td style="text-align: center; width: 40px; padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;">
                                <button class="sensor-remove-btn" title="Remove entity" @click=${()=>{this._editDraft={...this._editDraft,action_entity_targets:this._editDraft.action_entity_targets.filter((u,v)=>v!==r)}}}>✕</button>
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
                      @value-changed=${o=>{var l,c;const r=o.detail.value;if(r){const f=this._editDraft.action_entity_targets;if(!f.some(g=>g.entity_id===r)){const g=r.split(".")[0],d=((c=(l=Za[g])==null?void 0:l[0])==null?void 0:c.value)??"off";this._editDraft={...this._editDraft,action_entity_targets:[...f,{entity_id:r,action:d}]}}const h=o.target;h&&(h.value="")}}}
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

                ${a!=="none"&&a!=="reset"?n`
                  <div class="form-field">
                    <span class="form-label">Release Action</span>
                    <select
                      class="option-select"
                      .value=${t.release_action_type||s.release_action_type}
                      @change=${o=>{this._editDraft={...this._editDraft,release_action_type:o.target.value}}}
                    >
                      <option value="turn_off">Turn Off</option>
                      <option value="slot">Restore Slot</option>
                      <option value="none">Nothing</option>
                    </select>
                  </div>
                `:""}
              </div>

              ${a!=="reset"?n`
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  <div class="list-section-label">Timing & Window Extension</div>

                  <div class="form-field">
                    <span class="form-label">Auto-Expire Duration (HH:MM:SS, 0 = never expires)</span>
                    <input
                      type="text"
                      class="activity-input ${t.auto_expire!==null&&!Xi(t.auto_expire)?"invalid":""}"
                      .value=${t.auto_expire??""}
                      .placeholder=${s.auto_expire}
                      @input=${o=>{this._editDraft={...this._editDraft,auto_expire:o.target.value.trim()||null}}}
                    />
                    <span class="form-hint">Accepts seconds (<code>90</code>), <code>M:SS</code> (<code>5:30</code>) or <code>H:MM:SS</code> — saved as HH:MM:SS.</span>
                    ${t.auto_expire!==null&&!Xi(t.auto_expire)?n`
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
                      .placeholder=${String(s.transition_off_seconds)}
                      .value=${t.transition_off_seconds!=null?String(t.transition_off_seconds):""}
                      @input=${o=>{const r=o.target.value.trim();this._editDraft={...this._editDraft,transition_off_seconds:r===""?null:parseInt(r,10)||0}}}
                    />
                  </div>
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
                              @change=${l=>{const c=l.target.checked,f=this._editDraft.suppress_inputs,h=c?[...f,o.id]:f.filter(g=>g!==o.id);this._editDraft={...this._editDraft,suppress_inputs:h}}}
                            />
                            <span>${o.name||o.id} (${o.type})</span>
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
    `}};mt.styles=[se,Tt,I`
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
    `],It([p({type:Boolean})],mt.prototype,"open",2),It([p({attribute:!1})],mt.prototype,"hass",2),It([p({attribute:!1})],mt.prototype,"activity",2),It([p({type:Number})],mt.prototype,"editIndex",2),It([p({attribute:!1})],mt.prototype,"inputs",2),It([p({attribute:!1})],mt.prototype,"placeholderDefaults",2),It([p({attribute:!1})],mt.prototype,"channels",2),It([p({type:Array})],mt.prototype,"existingIds",2),It([p({attribute:!1})],mt.prototype,"allActivities",2),It([p({attribute:!1})],mt.prototype,"heatmapProfiles",2),It([b()],mt.prototype,"_editDraft",2),mt=It([M("twilight-activity-row-editor")],mt);var Wo=Object.defineProperty,qo=Object.getOwnPropertyDescriptor,zt=(t,e,i,s)=>{for(var a=s>1?void 0:s?qo(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&Wo(e,i,a),a};let xt=class extends oe{constructor(){super(...arguments),this.open=!1,this.hass=null,this.config=[],this.inputs=[],this.placeholderDefaults=null,this.templateMode=!1,this.channels={},this.heatmapProfiles=[],this._subEditOpen=!1,this._subEditingIndex=null,this._subEditActivity=null,this._dialog=new be(this),this._draftController=new ii(this,{onOpen:()=>{this._subEditOpen=!1}})}_closeDiscard(){this._draftController.closeDiscard()}_closeAndSave(){this._draftController.closeAndSave(new Si({activities:this._draftController.draft||[]}))}_getFallbackActivityInfo(){return Gi(this.placeholderDefaults)}_openAddActivity(){this._subEditingIndex=null,this._subEditActivity={id:""},this._subEditOpen=!0}_openEditActivity(t){const e=this._draftController.draft;e&&(this._subEditingIndex=t,this._subEditActivity=e[t],this._subEditOpen=!0)}async _onSubEditSave(t){const e=this._draftController.draft;if(!e)return;const i=t.detail;if(this._subEditingIndex===null){const s=i.id;if(!/^[a-z0-9_-]+$/.test(s)){await this._dialog.showAlert("Invalid Name","Activity name must contain only lowercase letters, numbers, hyphens and underscores.");return}if(e.some(a=>a.id===s)){await this._dialog.showAlert("Duplicate Name","This activity name already exists!");return}this._draftController.draft=[...e,i]}else{const s=this._subEditingIndex,a=[...e];a[s]=i,this._draftController.draft=a}this._subEditOpen=!1,this.requestUpdate()}_onSubEditCancel(){this._subEditOpen=!1}_onRemoveActivity(t){const e=this._draftController.draft;e&&(this._draftController.draft=e.filter((i,s)=>s!==t),this.requestUpdate())}render(){if(!this.open||!this._draftController.draft)return n``;const t=this._draftController.draft;return n`
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
                  ${t.map((e,i)=>{var c,f;const s=this._getFallbackActivityInfo(),o=(((c=e.action)==null?void 0:c.type)||s.action_type)==="reset",l=(this.inputs||[]).filter(h=>h.activity===e.id).map(h=>h.name||h.label||h.id);return n`
                      <tr
                        class="input-row ${this._draftController.draggedIndex===i?"dragging":""}"
                        draggable="true"
                        @dragstart=${h=>this._draftController.onDragStart(h,i)}
                        @dragover=${h=>this._draftController.onDragOver(h,i)}
                        @dragend=${()=>this._draftController.onDragEnd()}
                      >
                        <td style="text-align: center; padding: 0 4px; vertical-align: middle;">
                          <div class="drag-handle" title="Drag to reorder">⋮⋮</div>
                        </td>
                        <td>
                          <div style="font-weight: 600;">${e.name||e.id}</div>
                          <div style="font-size: 10px; font-family: monospace; opacity: 0.5;">${e.id}</div>
                        </td>
                        <td style="color: var(--primary-text-color);">
                          ${l.length>0?l.map(h=>n`<span class="pill" style="margin-right: 4px;">${h}</span>`):n`<span style="opacity:0.4">—</span>`}
                        </td>
                        <td style="color: var(--primary-text-color);">
                          ${Ya(e.action)}
                        </td>
                        <td style="color: var(--primary-text-color);">
                          ${o?"—":Ga(e.release_action)}
                        </td>
                        <td style="color: var(--primary-text-color);">
                          ${(f=e.suppress_inputs)!=null&&f.length?e.suppress_inputs.map(h=>{const g=this.inputs.find(d=>d.id===h);return g?g.name||g.label||g.id:h}).join(" · "):n`<span style="opacity:0.4">—</span>`}
                        </td>
                        <td style="color: var(--primary-text-color);">${o?"—":Va(e.auto_expire,s.auto_expire)}</td>
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
    `}};xt.styles=[se,Tt,I`
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
    `],zt([p({type:Boolean})],xt.prototype,"open",2),zt([p({attribute:!1})],xt.prototype,"hass",2),zt([p({attribute:!1})],xt.prototype,"config",2),zt([p({attribute:!1})],xt.prototype,"inputs",2),zt([p({attribute:!1})],xt.prototype,"placeholderDefaults",2),zt([p({type:Boolean})],xt.prototype,"templateMode",2),zt([p({attribute:!1})],xt.prototype,"channels",2),zt([p({attribute:!1})],xt.prototype,"heatmapProfiles",2),zt([b()],xt.prototype,"_subEditOpen",2),zt([b()],xt.prototype,"_subEditingIndex",2),zt([b()],xt.prototype,"_subEditActivity",2),xt=zt([M("twilight-activities-dialog")],xt);var Vo=Object.defineProperty,Yo=Object.getOwnPropertyDescriptor,Vt=(t,e,i,s)=>{for(var a=s>1?void 0:s?Yo(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&Vo(e,i,a),a};let Mt=class extends L{constructor(){super(...arguments),this.hass=null,this.config=[],this.inputs=[],this.noHeader=!1,this.placeholderDefaults=null,this.templateMode=!1,this.channels={},this.heatmapProfiles=[],this._editOpen=!1}_openEdit(){this._editOpen=!0}render(){return n`
      <div class="devices-card">
        ${this.noHeader?"":n`
          <div class="devices-card-header">
            <span class="card-dot" style="--dot-color: #a855f7;"></span>
            <span class="devices-card-title">Activities</span>
            <button class="edit-btn" @click=${this._openEdit}>⋮</button>
          </div>
        `}

        <div class="entity-list">
          ${this.config.map((t,e)=>{var d,u;const i=Gi(this.placeholderDefaults),a=(((d=t.action)==null?void 0:d.type)||i.action_type)==="reset",o=Ya(t.action),r=Va(t.auto_expire,i.auto_expire),l=a?"—":Ga(t.release_action),c=(u=t.suppress_inputs)!=null&&u.length?t.suppress_inputs.map(v=>{const y=this.inputs.find(k=>k.id===v);return y?y.name||y.label||y.id:v}).join(", "):"none",f=(this.inputs||[]).filter(v=>v.activity===t.id),h=f.length>0?f.map(v=>v.name||v.label||v.id).join(", "):"none",g=a?`Reset · Triggers: ${h}`:`Triggers: ${h} · Action: ${o} · Auto-expire: ${r} · Release: ${l} · Suppresses: ${c}`;return n`
              <div class="activity-row">
                <span class="activity-badge ${Xa(t.id,this.config)}">${t.id}</span>
                <div class="activity-desc">
                  <div style="font-weight: 600; display: flex; align-items: center; gap: 6px;">
                    <span>${t.name||t.id}</span>
                    ${t.name&&t.name.toLowerCase()!==t.id.toLowerCase()?n`<span style="font-size: 10px; font-family: monospace; opacity: 0.5; font-weight: normal;">${t.id}</span>`:""}
                  </div>
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

      <twilight-activities-dialog
        .open=${this._editOpen}
        .hass=${this.hass}
        .config=${this.config}
        .inputs=${this.inputs}
        .placeholderDefaults=${this.placeholderDefaults}
        .templateMode=${this.templateMode}
        .channels=${this.channels}
        .heatmapProfiles=${this.heatmapProfiles}
        @close=${()=>{this._editOpen=!1}}
      ></twilight-activities-dialog>
    `}};Mt.styles=[se,I`
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

      .card-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--dot-color, #a855f7);
        box-shadow: 0 0 6px var(--dot-color, #a855f7);
        flex-shrink: 0;
        display: inline-block;
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
    `],Vt([p({attribute:!1})],Mt.prototype,"hass",2),Vt([p({attribute:!1})],Mt.prototype,"config",2),Vt([p({attribute:!1})],Mt.prototype,"inputs",2),Vt([p({type:Boolean})],Mt.prototype,"noHeader",2),Vt([p({attribute:!1})],Mt.prototype,"placeholderDefaults",2),Vt([p({type:Boolean})],Mt.prototype,"templateMode",2),Vt([p({attribute:!1})],Mt.prototype,"channels",2),Vt([p({attribute:!1})],Mt.prototype,"heatmapProfiles",2),Vt([b()],Mt.prototype,"_editOpen",2),Mt=Vt([M("twilight-activities-card")],Mt);var Go=Object.defineProperty,Xo=Object.getOwnPropertyDescriptor,de=(t,e,i,s)=>{for(var a=s>1?void 0:s?Xo(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&Go(e,i,a),a};let Yt=class extends L{constructor(){super(...arguments),this.open=!1,this.rule=null,this.editIndex=null,this.activitiesConfig=[],this.channels={},this.siblings=[],this._editDraft=null}updated(t){if(t.has("open")||t.has("rule"))if(this.open&&this.rule){this._editDraft=structuredClone(this.rule);const i=(this.activitiesConfig||[]).map(s=>s.id)[0]||"motion";(!this._editDraft.applied_activities||this._editDraft.applied_activities.length===0)&&(this._editDraft.applied_activities=[i])}else this.open||(this._editDraft=null)}_onSlotOverridesChanged(t,e){this._editDraft&&(this._editDraft={...this._editDraft,applied_activities:[t],slot_overrides:{...this._editDraft.slot_overrides||{},[t]:e}},this.requestUpdate())}_cancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}_save(){if(!this._editDraft)return;const t=(this.activitiesConfig||[]).map(s=>s.id),e=this._editDraft.applied_activities&&this._editDraft.applied_activities.length>0?this._editDraft.applied_activities[0]:t[0]||"motion";let i={...this._editDraft,applied_activities:[e]};if(!i.id){const s=new Set((this.siblings||[]).map(o=>o.id));let a=`rule_${Array.from({length:8},()=>Math.floor(Math.random()*16).toString(16)).join("")}`;for(;s.has(a);)a=`rule_${Array.from({length:8},()=>Math.floor(Math.random()*16).toString(16)).join("")}`;i.id=a}this.dispatchEvent(new CustomEvent("save",{detail:i,bubbles:!0,composed:!0}))}render(){var o,r;if(!this.open||!this._editDraft)return n``;const t=this._editDraft,e=this.editIndex!==null,i=!((o=t.name)!=null&&o.trim()),s=(this.activitiesConfig||[]).map(l=>l.id),a=t.applied_activities&&t.applied_activities.length>0?t.applied_activities[0]:s[0]||"motion";return n`
      <div class="overlay" @click=${l=>{l.target===l.currentTarget&&this._cancel()}}>
        <div class="edit-panel" style="max-width: 650px;" @click=${l=>l.stopPropagation()}>
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
                @input=${l=>{this._editDraft={...this._editDraft,name:l.target.value}}}
              />
            </div>

            <div class="form-field">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input
                  type="checkbox"
                  ?checked=${t.enabled??!0}
                  @change=${l=>{this._editDraft={...this._editDraft,enabled:l.target.checked}}}
                />
                <span class="form-label" style="margin: 0;">Enable Rule</span>
              </label>
            </div>

            <div class="form-field">
              <div class="list-section-label">Target Activity & Excluded Slots</div>
              <span class="form-label">Target Activity</span>
              <select class="option-select" .value=${a} @change=${l=>{const c=l.target.value;this._editDraft={...this._editDraft,applied_activities:[c]}}}>
                ${s.map(l=>n`
                  <option value="${l}" ?selected=${l===a}>${l}</option>
                `)}
              </select>
              <span class="form-hint">Select the single activity whose channel/slot schedule this rule overrides when active.</span>
            </div>

            <div class="form-field">
              <span class="form-label">Excluded Channels / Slots</span>
              <twilight-slot-action-tree
                .channels=${this.channels}
                .excludedSlotIds=${((r=t.slot_overrides)==null?void 0:r[a])||{}}
                @excluded-changed=${l=>this._onSlotOverridesChanged(a,l.detail.value)}
              ></twilight-slot-action-tree>
            </div>
          </div>

          <div class="panel-footer">
            <button class="btn-cancel-dialog" @click=${this._cancel}>Cancel</button>
            <button class="btn-save-dialog" ?disabled=${i} @click=${this._save}>${e?"Save":"Add"}</button>
          </div>
        </div>
      </div>
    `}};Yt.styles=[se,Tt,I`
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
    `],de([p({type:Boolean})],Yt.prototype,"open",2),de([p({attribute:!1})],Yt.prototype,"rule",2),de([p({type:Number})],Yt.prototype,"editIndex",2),de([p({attribute:!1})],Yt.prototype,"activitiesConfig",2),de([p({attribute:!1})],Yt.prototype,"channels",2),de([p({attribute:!1})],Yt.prototype,"siblings",2),de([b()],Yt.prototype,"_editDraft",2),Yt=de([M("twilight-rule-row-editor")],Yt);function Ko(){return{id:"",name:"",enabled:!0,applied_activities:[],slot_overrides:{}}}var Zo=Object.defineProperty,Jo=Object.getOwnPropertyDescriptor,Qt=(t,e,i,s)=>{for(var a=s>1?void 0:s?Jo(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&Zo(e,i,a),a};let Bt=class extends L{constructor(){super(...arguments),this.open=!1,this.config=[],this.inputsConfig=[],this.activitiesConfig=[],this.channels={},this._subEditOpen=!1,this._subEditingIndex=null,this._subEditRule=null,this._draftController=new ii(this,{onOpen:()=>{this._subEditOpen=!1}})}_closeDiscard(){this._draftController.closeDiscard()}_closeAndSave(){this._draftController.closeAndSave(new Di(this._draftController.draft||[]))}_openAddRule(){this._subEditingIndex=null,this._subEditRule=Ko(),this._subEditOpen=!0}_openEditRule(t){const e=this._draftController.draft;e&&(this._subEditingIndex=t,this._subEditRule=structuredClone(e[t]),this._subEditOpen=!0)}_closeSubEdit(){this._subEditOpen=!1,this._subEditingIndex=null,this._subEditRule=null}_handleSubEditSave(t){const e=this._draftController.draft;if(!e)return;const i=t.detail,s=[...e];this._subEditingIndex===null?s.push(i):s[this._subEditingIndex]=i,this._draftController.draft=s,this.requestUpdate(),this._closeSubEdit()}_removeRule(t){const e=this._draftController.draft;if(!e)return;const i=[...e];i.splice(t,1),this._draftController.draft=i,this.requestUpdate()}render(){if(!this.open)return n``;const t=this._draftController.draft||[];return n`
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
                ${t.map((e,i)=>{const a=(this.inputsConfig||[]).filter(o=>o.rule===e.id).map(o=>o.name||o.label||o.id);return n`
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
                        ${a.length>0?a.map(o=>n`<span class="pill">${o}</span>`):n`<span style="opacity: 0.4;">—</span>`}
                      </td>
                      <td>
                        ${(e.applied_activities||[]).length>0?(e.applied_activities||[]).map(o=>n`<span class="pill">${o}</span>`):n`<span class="pill" style="opacity: 0.8;">All</span>`}
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
    `}};Bt.styles=[se,Tt,I`
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
    `],Qt([p({type:Boolean})],Bt.prototype,"open",2),Qt([p({attribute:!1})],Bt.prototype,"config",2),Qt([p({attribute:!1})],Bt.prototype,"inputsConfig",2),Qt([p({attribute:!1})],Bt.prototype,"activitiesConfig",2),Qt([p({attribute:!1})],Bt.prototype,"channels",2),Qt([b()],Bt.prototype,"_subEditOpen",2),Qt([b()],Bt.prototype,"_subEditingIndex",2),Qt([b()],Bt.prototype,"_subEditRule",2),Bt=Qt([M("twilight-rules-dialog")],Bt);var Qo=Object.defineProperty,tr=Object.getOwnPropertyDescriptor,te=(t,e,i,s)=>{for(var a=s>1?void 0:s?tr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&Qo(e,i,a),a};let Ft=class extends L{constructor(){super(...arguments),this.hass=null,this.rules=[],this.inputsConfig=[],this.activitiesConfig=[],this.runState=null,this.channels={},this.noHeader=!1,this._editOpen=!1}_openEdit(){this._editOpen=!0}render(){var e;const t=((e=this.runState)==null?void 0:e.active_rules)||{};return n`
      <div class="devices-card">
        ${this.noHeader?"":n`
          <div class="devices-card-header">
            <span class="card-dot" style="--dot-color: #ef4444;"></span>
            <span class="devices-card-title">Rules</span>
            <button class="edit-btn" @click=${this._openEdit}>⋮</button>
          </div>
        `}

        <div class="entity-list">
          ${this.rules.map((i,s)=>{const a=!!t[i.id],o=!i.enabled,r=(this.inputsConfig||[]).filter(h=>h.rule===i.id),l=r.length>0?r.map(h=>h.name||h.label||h.id).join(", "):"none",f=`Target: ${(i.applied_activities||[]).length>0?i.applied_activities.join(", "):"All"} · Triggers: ${l} · Status: ${i.enabled?"Enabled":"Disabled"}`;return n`
              <div class="activity-row ${o?"disabled":""}">
                <span class="status-indicator ${a?"active":""}" title="${a?"Rule active":o?"Rule disabled":"Rule inactive"}"></span>
                <span class="activity-badge rule">${i.name||i.id}</span>
                <div class="activity-desc">
                  <div style="font-weight: 600;">${i.name||i.id}</div>
                  <div style="font-size: 11px; color: var(--secondary-text-color); margin-top: 2px;">
                    ${f}
                  </div>
                </div>
              </div>
              ${s<this.rules.length-1?n`<div class="divider"></div>`:""}
            `})}

          ${this.rules.length===0?n`
            <div class="empty-state">No rules configured. Click edit to configure.</div>
          `:""}
        </div>
      </div>

      <twilight-rules-dialog
        .open=${this._editOpen}
        .config=${this.rules}
        .inputsConfig=${this.inputsConfig}
        .activitiesConfig=${this.activitiesConfig}
        .channels=${this.channels}
        @close=${()=>{this._editOpen=!1}}
      ></twilight-rules-dialog>
    `}};Ft.styles=[se,I`
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

      .card-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--dot-color, #ef4444);
        box-shadow: 0 0 6px var(--dot-color, #ef4444);
        flex-shrink: 0;
        display: inline-block;
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
    `],te([p({attribute:!1})],Ft.prototype,"hass",2),te([p({attribute:!1})],Ft.prototype,"rules",2),te([p({attribute:!1})],Ft.prototype,"inputsConfig",2),te([p({attribute:!1})],Ft.prototype,"activitiesConfig",2),te([p({attribute:!1})],Ft.prototype,"runState",2),te([p({attribute:!1})],Ft.prototype,"channels",2),te([p({type:Boolean})],Ft.prototype,"noHeader",2),te([b()],Ft.prototype,"_editOpen",2),Ft=te([M("twilight-rules-card")],Ft);var er=Object.defineProperty,ir=Object.getOwnPropertyDescriptor,me=(t,e,i,s)=>{for(var a=s>1?void 0:s?ir(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&er(e,i,a),a};let ee=class extends L{constructor(){super(...arguments),this.open=!1,this.title="Reset Settings",this.description="",this.nodes=[],this._selectedNodes={},this._expandedNodes={}}willUpdate(t){if(t.has("open")&&this.open||t.has("nodes")){const e={},i={};this.nodes.forEach(s=>{e[s.id]=!0,i[s.id]=!0,s.children&&s.children.forEach(a=>{e[a.id]=!0})}),this._selectedNodes=e,this._expandedNodes=i}}_isNodeSelected(t){return!!this._selectedNodes[t]}_isNodeIndeterminate(t){if(!t.children||t.children.length===0)return!1;const e=t.children.filter(i=>this._selectedNodes[i.id]).length;return e>0&&e<t.children.length}_onCheckboxChange(t,e){const i={...this._selectedNodes};if(i[t.id]=e,t.children)t.children.forEach(s=>{i[s.id]=e});else{const s=this.nodes.find(a=>{var o;return(o=a.children)==null?void 0:o.some(r=>r.id===t.id)});if(s&&s.children){const a=s.children.every(o=>{const r=o.id;return r===t.id?e:!!i[r]});i[s.id]=a}}this._selectedNodes=i,this.requestUpdate()}_toggleExpanded(t){this._expandedNodes={...this._expandedNodes,[t]:!this._expandedNodes[t]},this.requestUpdate()}_onConfirm(){const t=Object.keys(this._selectedNodes).filter(e=>this._selectedNodes[e]);this.dispatchEvent(new CustomEvent("confirm",{detail:{selectedIds:t},bubbles:!0,composed:!0}))}_onCancel(){this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}render(){return this.open?n`
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
                    @click=${s=>{s.target.tagName!=="INPUT"&&e&&this._toggleExpanded(t.id)}}
                  >
                    ${e?n`<span class="tree-node-chevron ${i?"expanded":""}">&#9656;</span>`:n`<span class="tree-node-chevron" style="visibility: hidden;">&#9656;</span>`}
                    <input
                      type="checkbox"
                      .checked=${this._isNodeSelected(t.id)}
                      .indeterminate=${this._isNodeIndeterminate(t)}
                      @change=${s=>this._onCheckboxChange(t,s.target.checked)}
                    />
                    <span>${t.label}</span>
                  </div>

                  ${e&&i?n`
                        <div class="tree-node-children">
                          ${t.children.map(s=>n`
                            <div class="tree-leaf">
                              <input
                                type="checkbox"
                                .checked=${this._isNodeSelected(s.id)}
                                @change=${a=>{const o={id:s.id};this._onCheckboxChange(o,a.target.checked)}}
                              />
                              <span>${s.label}</span>
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
    `:n``}};ee.styles=I`
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
  `,me([p({type:Boolean})],ee.prototype,"open",2),me([p({type:String})],ee.prototype,"title",2),me([p({type:String})],ee.prototype,"description",2),me([p({type:Array})],ee.prototype,"nodes",2),me([b()],ee.prototype,"_selectedNodes",2),me([b()],ee.prototype,"_expandedNodes",2),ee=me([M("twilight-reset-dialog")],ee);var ar=Object.defineProperty,sr=Object.getOwnPropertyDescriptor,_t=(t,e,i,s)=>{for(var a=s>1?void 0:s?sr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&ar(e,i,a),a};const Ja={astro_dawn:"Astro Dawn",nautical_dawn:"Nautical Dawn",civil_dawn:"Civil Dawn",gold_dawn:"Golden Dawn",day:"Day",gold_dusk:"Golden Dusk",civil_dusk:"Civil Dusk",nautical_dusk:"Nautical Dusk",astro_dusk:"Astro Dusk",night:"Night"};let rt=class extends L{constructor(){super(...arguments),this.hass=null,this.slots=[],this.entities=[],this.open=!1,this.highlightSlotId=null,this.areaId="",this.areaName="",this.isPrimaryChannel=!0,this.channelName="",this.transitionOnSeconds=null,this.placeholderDefaults=null,this._draft=null,this._draftTransitionOnSeconds=null,this._transitionDraftInitialized=!1}_isValidHHMM(t){if(!t)return!1;const e=/^(\d{1,2}):(\d{2})$/.exec(t);if(!e)return!1;const i=Number(e[1]),s=Number(e[2]);return i>=0&&i<=23&&s>=0&&s<=59}_hasInvalidSlot(){return(this._draft??this.slots).some(e=>e.startType==="fixed"&&!this._isValidHHMM(e.fixedStartTime))}_closeAndSave(){if(this._hasInvalidSlot())return;const t=this._draftTransitionOnSeconds!==this.transitionOnSeconds;if(this._draft!==null||t){const i=this._draft??this.slots;this.dispatchEvent(new Ai(i,this._draftTransitionOnSeconds))}this._draft=null,this._transitionDraftInitialized=!1,this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_closeDiscard(){this._draft=null,this._transitionDraftInitialized=!1,this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_updateDraft(t){this._draft=t}_clampOffset(t,e,i){var h,g;const s=((h=this.placeholderDefaults)==null?void 0:h.max_offset_minutes)??180,a=((g=this.placeholderDefaults)==null?void 0:g.min_slot_distance_minutes)??ma;let o=Math.max(-s,Math.min(s,e));const r=["astro_dawn","nautical_dawn","civil_dawn","gold_dawn","day","gold_dusk","civil_dusk","nautical_dusk","astro_dusk","night"],l=i.find(d=>d.id===t);if(!l||(l.startType||"fixed")!=="astral")return o;const c=i.filter(d=>(d.startType||"fixed")==="astral").map(d=>{const u=d.startEvent||"civil_dawn",v=r.indexOf(u);return{slot:d,zoneIdx:v!==-1?v:99}}).sort((d,u)=>d.zoneIdx-u.zoneIdx),f=c.findIndex(d=>d.slot.id===t);if(f!==-1){if(f>0){const d=c[f-1].slot.startOffset||0;o<d-a&&(o=d-a)}if(f<c.length-1){const d=c[f+1].slot.startOffset||0;o>d+a&&(o=d+a)}}return o}_addCustomSlot(){const t=this._draft??this.slots;if(t.length>=$i)return;const e=t.filter(s=>s.isCustom).length+1,i={id:`draft_${Date.now()}_${e}`,label:`Custom Slot ${e}`,color:"#8e44ad",from:720,to:780,scene:null,isCustom:!0,startType:"fixed",fixedStartTime:"12:00"};this._updateDraft([...t,i])}_deleteSlot(t){this._updateDraft((this._draft??this.slots).filter(e=>e.id!==t))}_setSlotScene(t,e){this._updateDraft((this._draft??this.slots).map(i=>i.id===t?{...i,scene:e}:i))}willUpdate(t){t.has("open")&&(this.open?(this._draft===null&&(this._draft=this.slots.map(e=>({...e}))),this._transitionDraftInitialized||(this._draftTransitionOnSeconds=this.transitionOnSeconds,this._transitionDraftInitialized=!0),Ke()):(this._draft=null,this._transitionDraftInitialized=!1))}render(){var f,h,g;if(!this.open)return n``;const t=this._draft;if(!t)return n``;const e=(this.areaId||"").toLowerCase(),i=(this.areaName||"").toLowerCase(),s=new Set;if(e&&(s.add(e),e==="badezimmer"&&s.add("bad"),e==="kuche"&&s.add("küche"),e==="buro"&&(s.add("büro"),s.add("office"))),i){s.add(i);const d=i.normalize("NFD").replace(/[\u0300-\u036f]/g,"");s.add(d),i==="bad"&&s.add("badezimmer"),i==="büro"&&s.add("office")}const a=(d,u)=>{const v=d.toLowerCase(),y=(u||"").toLowerCase();for(const k of s)if(v.includes(k)||y.includes(k))return!0;return!1},o=new Set(t.map(d=>d.scene).filter(d=>!!d)),r=!!(this.areaId&&this.entities&&this.entities.length>0),l=new Set(r?this.entities.filter(d=>d.domain!=="scene"&&d.domain!=="script"?!1:d.in_area||o.has(d.entity_id)||a(d.entity_id,d.name)).map(d=>d.entity_id):[]),c=t;return n`
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
                    placeholder=${String(((f=this.placeholderDefaults)==null?void 0:f.transition_on_seconds)??60)}
                    @input=${d=>{const u=d.target.value.trim();if(u==="")this._draftTransitionOnSeconds=null;else{const v=parseInt(u,10);this._draftTransitionOnSeconds=isNaN(v)?null:v}}}
                  />
                </div>
              </div>
              <div class="slots-notice">
                <span>⏱️</span>
                <span>A minimum distance of ${((h=this.placeholderDefaults)==null?void 0:h.min_slot_distance_minutes)??ma} minutes between consecutive slots is maintained, with a maximum offset of ±${((g=this.placeholderDefaults)==null?void 0:g.max_offset_minutes)??180} minutes.</span>
              </div>
              <div class="slots-header">
                <div>Slot</div>
                <div>Start Type</div>
                <div>Value / Offset</div>
                <div>Time</div>
                <div>Scene / Script</div>
                <div></div>
              </div>

              ${c.map(d=>{const u=d.id===this.highlightSlotId,v=!this.isPrimaryChannel,y=d.startType==="fixed"&&!this._isValidHHMM(d.fixedStartTime);return n`
                  <div class="slot-edit-card ${u?"highlighted":""} ${y?"invalid":""}">
                    <!-- Col 1: Icon/Dot + Label/Input -->
                    <div style="display:flex; align-items:center; gap:8px; min-width: 0;">
                      <div class="slot-edit-dot" style="background:${d.color}"></div>
                      <div style="flex: 1; min-width: 0;">
                        ${v?n`
                            <input
                              type="text"
                              class="sensor-input"
                              .value=${d.label}
                              @input=${k=>{const x=k.target.value;this._updateDraft(t.map(_=>_.id===d.id?{..._,label:x}:_))}}
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
                            @change=${k=>{const x=k.target.value;this._updateDraft(t.map(_=>_.id===d.id?{..._,startType:x,startEvent:x==="astral"?"civil_dawn":void 0,fixedStartTime:x==="fixed"?"12:00":void 0,startOffset:x==="astral"?0:void 0}:_))}}
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
                            @change=${k=>{const x=k.target.value;this._updateDraft(t.map(_=>_.id===d.id?{..._,fixedStartTime:x}:_))}}
                          />
                        `:n`
                          <div style="display:flex; gap:6px;">
                            ${v?n`
                                <select
                                  class="sensor-input"
                                  style="flex:1"
                                  @change=${k=>{const x=k.target.value;this._updateDraft(t.map(_=>_.id===d.id?{..._,startEvent:x}:_))}}
                                >
                                  ${Object.entries(Ja).map(([k,x])=>n`
                                    <option value=${k} ?selected=${(d.startEvent||"civil_dawn")===k}>${x}</option>
                                  `)}
                                </select>
                              `:n`<input class="sensor-input" style="flex:1; opacity:0.6" disabled .value=${Ja[d.startEvent||""]||d.startEvent||""} />`}
                            <input
                              type="number"
                              class="sensor-input"
                              style="width:64px;"
                              .value=${String(d.startOffset||0)}
                              @input=${k=>{const x=k.target,_=Number(x.value),C=this._clampOffset(d.id,_,t);C!==_&&(x.value=String(C)),this._updateDraft(t.map(D=>D.id===d.id?{...D,startOffset:C}:D))}}
                              placeholder="Offset"
                            />
                          </div>
                        `}
                    </div>

                    <!-- Col 4: Time -->
                    <div>
                      <span class="mobile-label">Time</span>
                      <span class="slot-edit-time" style="font-size: 13px; font-family: monospace; font-weight: 500;">
                        ${fe(d.from)} → ${fe(d.to)}
                      </span>
                    </div>

                    <!-- Col 5: Scene / Script -->
                    <div>
                      <span class="mobile-label">Scene / Script</span>
                      <ha-entity-picker
                        .hass=${this.hass}
                        .value=${d.scene??""}
                        .includeDomains=${["scene","script"]}
                        .entityFilter=${r?k=>l.has(k.entity_id):void 0}
                        allow-custom-entity
                        @value-changed=${k=>{const x=k.detail.value||null;x!==d.scene&&this._setSlotScene(d.id,x)}}
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

              ${this.isPrimaryChannel?"":t.length>=$i?n`<button class="btn-add-slot" disabled>Max ${$i} slots reached</button>`:n`<button class="btn-add-slot" @click=${this._addCustomSlot}>➕ Add Slot</button>`}
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
    `}};rt.styles=I`
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
      width: 95vw;
      max-width: 1150px;
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
  `,_t([p({attribute:!1})],rt.prototype,"hass",2),_t([p({type:Array})],rt.prototype,"slots",2),_t([p({type:Array})],rt.prototype,"entities",2),_t([p({type:Boolean})],rt.prototype,"open",2),_t([p({type:String})],rt.prototype,"highlightSlotId",2),_t([p({type:String})],rt.prototype,"areaId",2),_t([p({type:String})],rt.prototype,"areaName",2),_t([p({type:Boolean})],rt.prototype,"isPrimaryChannel",2),_t([p({type:String})],rt.prototype,"channelName",2),_t([p({type:Number})],rt.prototype,"transitionOnSeconds",2),_t([p({attribute:!1})],rt.prototype,"placeholderDefaults",2),_t([b()],rt.prototype,"_draft",2),_t([b()],rt.prototype,"_draftTransitionOnSeconds",2),rt=_t([M("twilight-slot-editor")],rt);function J(t){return t.channels||{}}function Qa(t){return Object.keys(J(t)).sort((i,s)=>i===O?-1:s===O?1:0)}function xe(t,e){var i;return((i=J(t)[e])==null?void 0:i.slots)||[]}var or=Object.defineProperty,rr=Object.getOwnPropertyDescriptor,V=(t,e,i,s)=>{for(var a=s>1?void 0:s?rr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&or(e,i,a),a};let B=class extends L{constructor(){super(...arguments),this.hass=null,this.areaId="",this.areaConfigs=[],this.areas=[],this.todayData=null,this.globalConfig={},this.placeholderDefaults=null,this.areasState={},this._areaPlaceholderDefaults=null,this._isNewArea=!1,this._selectedChannelId=O,this._areaEntities=[],this._extractedEntities={},this._slotEditOpen=!1,this._editingSlotId=null,this._hoveredTime=null,this._hoveredChannelId=O,this._tooltipX=0,this._tooltipY=0,this._resetDialogOpen=!1,this._globalDefaultsTemplate=null,this._resetNodes=[],this._slotTimes=null,this._dialog=new be(this),this._clock=new Qe(this),this._lastLoadedKey="",this._draftController=new Sa(this,{onSave:async t=>{if(!this.hass)return;const e=await Ys(this.hass,t),i=this.areaConfigs.findIndex(a=>a.area_id===e.area_id);let s;return i>=0?s=this.areaConfigs.map((a,o)=>o===i?e:a):s=[...this.areaConfigs,e],this._isNewArea=!1,this.dispatchEvent(new CustomEvent("areas-changed",{detail:s,bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent("engines-changed",{bubbles:!0,composed:!0})),e}})}get _effectivePlaceholderDefaults(){return this._areaPlaceholderDefaults??this.placeholderDefaults}async _saveOrUpdateDraft(){this._isNewArea?this.requestUpdate():await this._draftController.save()}connectedCallback(){super.connectedCallback(),this.hass&&this.areaId&&this._loadAreaDetails()}updated(t){if(super.updated(t),(t.has("areaId")||t.has("hass"))&&this.areaId&&this.hass){const e=t.get("areaId"),i=t.get("hass");(this.areaId!==e||this.hass!==i)&&this._loadAreaDetails()}}async _loadAreaDetails(){var a;const t=`${this.areaId}_${(a=this.hass)!=null&&a.states?"has_hass":"no_hass"}`;if(t===this._lastLoadedKey||(this._lastLoadedKey=t,!this.hass||!this.areaId))return;this._draftController.loading=!0,this.requestUpdate(),this._selectedChannelId=O;const e=this.areaConfigs.find(o=>o.area_id===this.areaId),i=this.areas.find(o=>o.area_id===this.areaId);let s;e?(this._isNewArea=!1,s=structuredClone(e)):(this._isNewArea=!0,s=await _a(this.hass,this.areaId),i&&(s.name=i.name)),s.activities=Ka(s.activities),this._draftController.init(s);try{const[o,r]=await Promise.all([Ks(this.hass,this.areaId),Xs(this.hass,this.areaId).catch(l=>(console.warn("Backend extraction not available yet, using empty fallback",l),{}))]);this._extractedEntities=r||{},this._updateAreaEntities(this._draftController.draft,o),await this._fetchSlotTimes()}catch(o){console.error("Error fetching area entities",o)}finally{this._draftController.loading=!1,this.requestUpdate()}}async _fetchSlotTimes(){if(!(!this.hass||!this.areaId)){try{this._isNewArea?this._slotTimes=await this._fetchDraftSlotTimes():this._slotTimes=await ka(this.hass,{area_id:this.areaId})}catch(t){console.warn("Failed to fetch area slot times:",t)}if(!this._isNewArea)try{this._areaPlaceholderDefaults=await Ii(this.hass,this.areaId)}catch(t){console.warn("Failed to fetch area placeholder defaults:",t)}}}async _fetchDraftSlotTimes(){const t=this._draftController.draft,e=new Date().toISOString().slice(0,10),i={};if(this.hass&&t){const s=Object.entries(J(t)),a=await Promise.all(s.map(([,o])=>zi(this.hass,{slots:o.slots||[]})));s.forEach(([o],r)=>{i[o]={[e]:a[r].slots}})}return{area_id:this.areaId,dates:[e],channels:i}}_activeChannelId(t){return Qa(t).includes(this._selectedChannelId)?this._selectedChannelId:O}_updateAreaEntities(t,e){const i=new Set;this._extractedEntities&&Object.values(this._extractedEntities).forEach(r=>{(Array.isArray(r)?r:(r==null?void 0:r.extracted)??[]).forEach(c=>i.add(c))});const s=new Set,a=this._activeChannelId(t);xe(t,a).forEach(r=>{var l;(l=r.configured_entities)==null||l.forEach(c=>s.add(c))});const o=s.size>0;this._areaEntities=e.map(r=>{const l=i.has(r.entity_id),c=o&&s.has(r.entity_id);return{entity_id:r.entity_id,name:r.name,domain:r.domain,in_area:r.in_area,checked:c||l,isExtracted:l,isManual:c}})}_refreshExtractedEntities(){this._draftController.draft&&this._updateAreaEntities(this._draftController.draft,this._areaEntities)}async _confirmDiscardIfDirty(){return!this._isNewArea&&!this._draftController.isDirty?!0:this._dialog.showConfirm("Discard Changes","You have unsaved changes. Are you sure you want to discard them?")}async _backToOverview(){await this._confirmDiscardIfDirty()&&this.dispatchEvent(new CustomEvent("back",{bubbles:!0,composed:!0}))}_saveStatusText(){if(this._draftController.saving)return"Saving…";const t=this._draftController.saveError;return t?`Save failed: ${t&&typeof t=="object"&&"message"in t?String(t.message):String(t)}`:this._isNewArea?"New Area Setup":this._draftController.isDirty?"Unsaved changes":"All changes saved"}_onSunPathHover(t){this._hoveredTime=t.detail.hoverTime,t.detail.channelId&&(this._hoveredChannelId=t.detail.channelId)}async _onSensorsChanged(t){this._draftController.update({sensors:t.detail}),await this._saveOrUpdateDraft()}_availableActivities(t){const e=(t.activities??[]).map(i=>i.id);return e.length>0?e:["sleep"]}async _onInputsChanged(t){this._draftController.update({inputs:t.detail.inputs}),await this._saveOrUpdateDraft()}async _onActivitiesChanged(t){this._draftController.update({activities:t.detail.activities}),await this._saveOrUpdateDraft()}async _onRulesChanged(t){this._draftController.update({rules:t.detail}),await this._saveOrUpdateDraft()}_onSunPathMove(t){this._tooltipX=t.clientX,this._tooltipY=t.clientY}_onSlotSelected(t){t.detail.channelId&&(this._selectedChannelId=t.detail.channelId),this._editingSlotId=t.detail.slotId,this._slotEditOpen=!0}_onChannelSelected(t){this._selectedChannelId=t.detail.channelId,this._refreshExtractedEntities()}async _onChannelAdded(t){const e=this._draftController.draft;if(!e)return;const i=t.detail.name.trim();if(!i)return;const s=i.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"");if(!s)return;const a={...J(e)};if(a[s]){await this._dialog.showAlert("Channel already exists",`A channel named "${i}" already exists.`);return}a[s]={name:i,enabled:!0,slots:[]},this._draftController.update({channels:a}),this._selectedChannelId=s,await this._saveOrUpdateDraft()}async _onChannelRenamed(t){const e=this._draftController.draft;if(!e)return;const{channelId:i,name:s}=t.detail,a={...J(e)},o=a[i];o&&(a[i]={...o,name:s},this._draftController.update({channels:a}),await this._saveOrUpdateDraft())}async _onChannelDeleted(t){const e=this._draftController.draft;if(!e||t.detail.channelId===O)return;const i={...J(e)};delete i[t.detail.channelId],this._draftController.update({channels:i}),this._selectedChannelId===t.detail.channelId&&(this._selectedChannelId=O),await this._saveOrUpdateDraft()}async _onChannelToggled(t){const e=this._draftController.draft;if(!e||t.detail.channelId===O)return;const i={...J(e)},s=i[t.detail.channelId];s&&(i[t.detail.channelId]={...s,enabled:t.detail.enabled},this._draftController.update({channels:i}),await this._saveOrUpdateDraft())}_withChannelSlots(t,e,i,s){const a={...J(t)},o=a[e];return o&&(a[e]={...o,slots:i,...s!==void 0?{transition_on_seconds:s}:{}}),a}async _onSlotsChanged(t){const e=this._draftController.draft;if(!e)return;const i=this._activeChannelId(e),s=xe(e,i),a=t.detail.slots.map(o=>{const r=s.find(c=>c.id===o.id),l=o.startType==="fixed";return{id:o.id,name:o.label,start_type:l?"fixed":"astral",zone:l?null:o.startEvent||(r==null?void 0:r.zone)||"civil_dawn",fixed_time:l?o.fixedStartTime||"00:00":null,offset_minutes:o.startOffset||0,scene_entity_id:o.scene,configured_entities:(r==null?void 0:r.configured_entities)||[]}});this._draftController.update({channels:this._withChannelSlots(e,i,a,t.detail.transitionOnSeconds)}),this._refreshExtractedEntities(),await this._saveOrUpdateDraft(),await this._fetchSlotTimes()}async _onLightsChanged(t){const e=this._draftController.draft;if(!e)return;this._areaEntities=t.detail.entities;const i=t.detail.entities.filter(o=>o.isManual).map(o=>o.entity_id),s=this._activeChannelId(e),a=xe(e,s).map(o=>({...o,configured_entities:i}));this._draftController.update({channels:this._withChannelSlots(e,s,a)}),this._refreshExtractedEntities(),await this._saveOrUpdateDraft()}async _onLightsModeChanged(t){this._draftController.update({manual_only:t.detail.manualOnly}),await this._saveOrUpdateDraft()}async _onSelectAreaChanged(t){var a;const e=t.target,i=e.value,s=(a=this._draftController.draft)==null?void 0:a.area_id;if(i!==s){if(!await this._confirmDiscardIfDirty()){e.value=s??"";return}this.dispatchEvent(new CustomEvent("select-area",{detail:{areaId:i},bubbles:!0,composed:!0}))}}async _onAreaEnabledToggled(t){const e=t.target.checked;this._draftController.update({enabled:e}),await this._saveOrUpdateDraft()}async _deleteArea(){if(!(!this.areaId||!this.hass||!await this._dialog.showConfirm("Delete Configuration","Are you sure you want to delete the Twilight configuration for this area?")))try{await Gs(this.hass,this.areaId);const e=this.areaConfigs.filter(i=>i.area_id!==this.areaId);this.dispatchEvent(new CustomEvent("areas-changed",{detail:e,bubbles:!0,composed:!0})),this.dispatchEvent(new CustomEvent("engines-changed",{bubbles:!0,composed:!0})),this._backToOverview()}catch(e){console.error("Error deleting area config",e)}}async _resetAreaToGlobalDefaults(){const t=this._draftController.draft;if(!(!t||!this.hass))try{const e=await _a(this.hass,t.area_id);this._globalDefaultsTemplate=e;const i=[{id:"inherited",label:"Inherited Defaults (Lux Threshold, Extend Window, etc.)"},{id:"area_inputs",label:"Area Inputs",children:(e.inputs||[]).map(s=>({id:`area_inputs:${s.id}`,label:`${s.type} — ${s.activity}`}))},{id:"area_activities",label:"Area Activities",children:(e.activities||[]).map(s=>({id:`area_activities:${s.id}`,label:s.id}))},{id:"area_channels",label:"Area Custom Channels",children:Object.entries(e.channels||{}).filter(([s])=>s!==O).map(([s,a])=>({id:`area_channels:${s}`,label:a.name||s}))}];this._resetNodes=i,this._resetDialogOpen=!0,this.requestUpdate()}catch(e){console.error("Failed to load area global defaults template:",e)}}async _executeReset(t){if(!this._globalDefaultsTemplate||!this._draftController.draft)return;const e=new Set(t.detail.selectedIds),i=this._globalDefaultsTemplate;this._draftController.update(s=>{e.has("inherited")&&(s.lux_threshold=null,s.lux_watch_window=null);const a=e.has("area_inputs"),o=i.inputs||[];if(a)s.inputs=structuredClone(o);else{const h=[...s.inputs||[]];o.forEach(g=>{if(e.has(`area_inputs:${g.id}`)){const d=h.findIndex(u=>u.id===g.id);d>=0?h[d]=structuredClone(g):h.push(structuredClone(g))}}),s.inputs=h}const r=e.has("area_activities"),l=i.activities||[];if(r)s.activities=structuredClone(l);else{const h=[...s.activities||[]];l.forEach(g=>{if(e.has(`area_activities:${g.id}`)){const d=h.findIndex(u=>u.id===g.id);d>=0?h[d]=structuredClone(g):h.push(structuredClone(g))}}),s.activities=h}const c=e.has("area_channels"),f=i.channels||{};if(c){const h={...s.channels||{}};Object.keys(h).forEach(g=>{g!==O&&delete h[g]}),Object.entries(f).forEach(([g,d])=>{g!==O&&(h[g]=structuredClone(d))}),s.channels=h}else{const h={...s.channels||{}};Object.keys(f).forEach(g=>{g!==O&&e.has(`area_channels:${g}`)&&(h[g]=structuredClone(f[g]))}),s.channels=h}}),this._resetDialogOpen=!1,this.requestUpdate(),await this._saveOrUpdateDraft()}_renderTooltip(t,e){if(this._hoveredTime===null)return n``;const i=this._hoveredTime,a=(t[this._hoveredChannelId]??e).find(r=>ke(r,i));if(!a)return n``;const o=a.scene?Ei(this.hass,a.scene):a.label;return n`
      <div class="slot-tooltip" style="left:${this._tooltipX+15}px; top:${this._tooltipY+15}px">
        <span class="slot-tooltip-badge" style="background:${a.color}; color:#fff; box-shadow:0 0 10px ${a.color}40">
          ${o} (${fe(i)})
        </span>
      </div>
    `}_areaToSlots(t,e){var a,o,r;const i=new Date().toISOString().slice(0,10),s=((r=(o=(a=this._slotTimes)==null?void 0:a.channels)==null?void 0:o[t])==null?void 0:r[i])||[];return Be(s,e)}_activeSceneName(t){var o,r,l;const e=this.areasState[this.areaId]||null;if(e)return e.active_scene_name??"No Scene Active";const i=this._clock.liveMins,s=t.find(c=>ke(c,i)),a=(s==null?void 0:s.scene)??null;return a?((l=(r=(o=this.hass)==null?void 0:o.states[a])==null?void 0:r.attributes)==null?void 0:l.friendly_name)??a:"No Scene Active"}render(){var g,d;if(this._draftController.loading)return n`<div style="padding:24px;color:var(--secondary-text-color)">Loading Area Details…</div>`;const t=this._draftController.draft;if(!t)return n``;const e=this.areas.find(u=>u.area_id===t.area_id),i=t.name||(e==null?void 0:e.name)||t.area_id,s=new Date().toISOString().slice(0,10),a=this._activeChannelId(t),o=this._areaToSlots(a,xe(t,a)),r=this._areaToSlots(O,xe(t,O)),l=t.sensors||[],c=this._activeSceneName(o),f=this.areasState[t.area_id]||null,h={};for(const[u,v]of Object.entries(J(t)))h[u]=this._areaToSlots(u,v.slots||[]);return n`
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
              ${this.areaConfigs.map(u=>n`
                <option value="${u.area_id}" ?selected=${u.area_id===t.area_id}>${u.name||u.area_id}</option>
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
              .channels=${J(t)}
              .channelSlotsMap=${h}
              .sensorConfig=${l}
              .inputs=${t.inputs||[]}
              .entities=${this._areaEntities}
              .runState=${f}
              .areaEnabled=${t.enabled}
            ></twilight-status-card>
          </div>
          <div class="span-6">
            <twilight-timetable-card
              .hass=${this.hass}
              .date=${s}
              .slots=${o}
              .entities=${this._areaEntities}
              .loading=${!1}
              .noHeader=${!1}
              .channels=${J(t)}
              .selectedChannelId=${a}
              .channelSlotsMap=${h}
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
              .runState=${f}
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
              .rulesConfig=${t.rules??[]}
              .placeholderDefaults=${this.placeholderDefaults}
              .runState=${f}
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
              .channels=${J(t)}
              .heatmapProfiles=${t.heatmap_profiles??[]}
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
          <div class="span-6">
            <twilight-rules-card
              .hass=${this.hass}
              .rules=${t.rules??[]}
              .inputsConfig=${t.inputs??[]}
              .activitiesConfig=${t.activities??[]}
              .channels=${J(t)}
              .runState=${f}
              @rules-changed=${this._onRulesChanged}
            ></twilight-rules-card>
          </div>
        </div>
      </div>
 
      <div class="detail-footer">
        <div>
          <button class="btn-cancel" @click=${this._resetAreaToGlobalDefaults}>Reset to Global Defaults</button>
          ${this.areaConfigs.some(u=>u.area_id===t.area_id)?n`
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
        .isPrimaryChannel=${a===O}
        .channelName=${((g=J(t)[a])==null?void 0:g.name)||""}
        .transitionOnSeconds=${((d=J(t)[a])==null?void 0:d.transition_on_seconds)??null}
        @slots-changed=${this._onSlotsChanged}
        @close=${()=>{this._slotEditOpen=!1,this._editingSlotId=null}}
      ></twilight-slot-editor>

      ${this._renderTooltip(h,o)}

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
    `}};B.styles=[Mi,Pi,Da,I`
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

      .header-left h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .area-select {
        background: var(--card-background-color, #1e1e2e);
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
    `],V([p({type:Object})],B.prototype,"hass",2),V([p({type:String})],B.prototype,"areaId",2),V([p({type:Array})],B.prototype,"areaConfigs",2),V([p({type:Array})],B.prototype,"areas",2),V([p({type:Object})],B.prototype,"todayData",2),V([p({type:Object})],B.prototype,"globalConfig",2),V([p({type:Object})],B.prototype,"placeholderDefaults",2),V([p({type:Object})],B.prototype,"areasState",2),V([b()],B.prototype,"_areaPlaceholderDefaults",2),V([b()],B.prototype,"_isNewArea",2),V([b()],B.prototype,"_selectedChannelId",2),V([b()],B.prototype,"_areaEntities",2),V([b()],B.prototype,"_extractedEntities",2),V([b()],B.prototype,"_slotEditOpen",2),V([b()],B.prototype,"_editingSlotId",2),V([b()],B.prototype,"_hoveredTime",2),V([b()],B.prototype,"_hoveredChannelId",2),V([b()],B.prototype,"_tooltipX",2),V([b()],B.prototype,"_tooltipY",2),V([b()],B.prototype,"_resetDialogOpen",2),V([b()],B.prototype,"_globalDefaultsTemplate",2),V([b()],B.prototype,"_resetNodes",2),V([b()],B.prototype,"_slotTimes",2),B=V([M("twilight-area-detail-view")],B);var nr=Object.defineProperty,lr=Object.getOwnPropertyDescriptor,yt=(t,e,i,s)=>{for(var a=s>1?void 0:s?lr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&nr(e,i,a),a};let nt=class extends L{constructor(){super(...arguments),this.hass=null,this.globalConfigOverride=null,this._areaConfigs=[],this._areas=[],this._todayData=null,this._activeAreaId=null,this._view="overview",this._loading=!1,this._showAddAreaList=!1,this._areasState={},this._unsubAll=null,this._globalConfig={},this._placeholderDefaults=null,this._areaSlotTimesMap={},this._subscribedConnection=null,this._clock=new Qe(this)}firstUpdated(t){super.firstUpdated(t),this._loadData(),this.hass&&this._subscribeAll()}updated(t){super.updated(t),t.has("hass")&&this.hass&&this.hass.connection!==this._subscribedConnection&&this._subscribeAll(),t.has("globalConfigOverride")&&this.globalConfigOverride&&(this._globalConfig=this.globalConfigOverride)}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribeAll(),this._areasState={}}async _loadData(){this._loading=!0;try{if(this.hass){const[t,e,i,s,a]=await Promise.all([Ze(this.hass),Vs(this.hass),Je(this.hass),ya(this.hass).catch(()=>({})),Ii(this.hass).catch(()=>null)]);this._areaConfigs=t.map(l=>({...l,activities:Ka(l.activities)})),this._areas=e,this._todayData=i.day_data||null,this._globalConfig=s||{},this._placeholderDefaults=a;const o=new Date().toISOString().slice(0,10),r={};await Promise.all(this._areaConfigs.map(async l=>{try{const c=await ka(this.hass,{area_id:l.area_id,date:o});r[l.area_id]=c}catch{}})),this._areaSlotTimesMap=r}}finally{this._loading=!1}}_selectArea(t){this._activeAreaId=t,this._showAddAreaList=!1,this._view="config"}_subscribeAll(){this._unsubscribeAll(),this.hass&&(this._subscribedConnection=this.hass.connection,this.hass.connection.subscribeMessage(t=>{this._areasState=t.full?t.areas||{}:{...this._areasState,...t.areas||{}}},{type:"twilight/subscribe_all"}).then(t=>{this._unsubAll=t},t=>{console.warn("Error subscribing to all areas",t)}))}_unsubscribeAll(){this._subscribedConnection=null,this._unsubAll&&(this._unsubAll(),this._unsubAll=null)}_backToOverview(){this._view="overview",this._activeAreaId=null}_overviewEngineInfo(t,e){if(!e.enabled)return{label:"Disabled",color:"#888",sub:"Engine inactive"};if(!t)return{label:"Standby",color:"var(--secondary-text-color)",sub:"Idle"};const i=t.active_activity;if(i)return{label:i.charAt(0).toUpperCase()+i.slice(1),color:"#9c27b0",sub:`Activity: ${i}`};const s=t.scene_activated_at!==null;return{label:s?"Scene Active":"Idle",color:s?"#4caf50":"#2196f3",sub:s?"Scene switched by engine":"Waiting for input"}}_emitAreasChanged(){this.dispatchEvent(new CustomEvent("areas-changed",{detail:this._areaConfigs,bubbles:!0,composed:!0}))}render(){return this._loading?n`<div style="padding:24px;color:var(--secondary-text-color)">Loading…</div>`:this._view==="config"&&this._activeAreaId?n`
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
      `:this._renderOverview()}_buildAreaCardData(t){var it,T,ht,ut,$t;const e=this._areas.find(R=>R.area_id===t.area_id),i=(it=this._areasState)==null?void 0:it[t.area_id],s=this._todayData,a=this._clock.liveMins,o=new Date().toISOString().slice(0,10),r=this._areaSlotTimesMap[t.area_id],l=Qa(t),c=[];for(const R of l){const lt=J(t)[R],Nt=((ht=(T=r==null?void 0:r.channels)==null?void 0:T[R])==null?void 0:ht[o])||[],W=Be(Nt,xe(t,R)),G=Ws(W),st=t.enabled&&(lt==null?void 0:lt.enabled)!==!1;c.push({id:R,name:(lt==null?void 0:lt.name)||(R===O?"Primary":R),slots:W,gradient:G,enabled:st})}const f=(($t=(ut=r==null?void 0:r.channels)==null?void 0:ut[O])==null?void 0:$t[o])||[],g=Be(f,xe(t,O)).find(R=>ke(R,a)),d=t.enabled?(g==null?void 0:g.label)??"None":"Disabled",u=t.enabled?(g==null?void 0:g.color)??"rgba(255,255,255,0.15)":"#888",v=(g==null?void 0:g.id)==="day",y=t.enabled?v?"#141926":`color-mix(in srgb, ${u} 25%, #ffffff)`:"var(--secondary-text-color)",k=t.enabled?u:"rgba(255,255,255,0.05)",_=`--badge-border:${t.enabled?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.08)"};--badge-bg:${k};--badge-text:${y}`,C=this._overviewEngineInfo(i,t),D=(i==null?void 0:i.lights_on)??0,$=(i==null?void 0:i.lights_total)??0,w=(a/1440*100).toFixed(2),S=i==null?void 0:i.active_scene_names,m=[];if(i&&i.scene_activated_at!==null&&S)for(const R of l){const lt=S[R];if(lt){const Nt=J(t)[R],W=(Nt==null?void 0:Nt.name)||(R===O?"Primary":R);m.push({channelName:W,sceneName:lt})}}let E=9,H=9;c.length===1?(E=12,H=10):c.length===2?(E=11,H=10):c.length===3&&(E=10,H=9);const z=E/2,F=E+(E>=16?8:E>=12?6:5),et=c.length===1?0:E/2,P=`--row-height:${F}px;--bar-height:${E}px;--bar-radius:${z}px;--label-font-size:${H}px;--row-gap:${et}px;`;return{areaName:t.name||(e==null?void 0:e.name)||t.area_id,slotLabel:d,slotColor:u,badgeStyle:_,sparklineStyle:P,rows:c,liveLeft:w,engineInfo:C,lightsOn:D,lightsTotal:$,activeSceneItems:m,todayData:s}}_renderOverview(){const t=this._areaConfigs.length,e=this._areas.length,i=this._areas.filter(s=>!this._areaConfigs.some(a=>a.area_id===s.area_id));return n`
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
          ${this._areaConfigs.map(s=>{const a=this._buildAreaCardData(s);return n`
              <div class="area-card ${s.enabled?"enabled":""}"
                   style="--shadow-color:${a.slotColor}"
                   @click=${()=>this._selectArea(s.area_id)}>
                <div class="card-header">
                  <div class="title-group">
                    <div class="area-name">${a.areaName}</div>
                    <div class="area-id-sub">${s.area_id}</div>
                  </div>
                  <div class="slot-badge" style=${a.badgeStyle}>
                    ${a.slotLabel}
                  </div>
                </div>

                <div class="sparkline-container" style=${a.sparklineStyle}>
                  ${a.rows.length>0?n`
                    <div class="sparkline-wrapper">
                      ${a.rows.map(o=>n`
                        <div class="sparkline-row ${o.enabled?"":"disabled"}">
                          <span class="sparkline-label" title="${o.name}">${o.name}</span>
                          <div class="sparkline-bar-wrapper">
                            <div class="sparkline-bar" style="--bar-gradient:${o.gradient}"></div>
                          </div>
                        </div>
                      `)}
                      ${s.enabled&&a.todayData?n`
                        <div class="sparkline-indicator-line" style="left: calc(86px + (100% - 86px) * ${a.liveLeft} / 100)"></div>
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
                      <span class="detail-icon" style="background: color-mix(in srgb, ${a.engineInfo.color} 10%, transparent)">
                        <div class="engine-dot" style="background: ${a.engineInfo.color}; box-shadow: 0 0 6px ${a.engineInfo.color}"></div>
                      </span>
                      <div class="detail-content">
                        <span class="detail-label">
                          Engine
                        </span>
                        <span class="detail-value" style="color: ${a.engineInfo.color}">
                          ${a.engineInfo.label}
                        </span>
                      </div>
                    </div>

                    ${(()=>{const o=a.lightsOn>0;return n`
                        <div class="detail-row">
                          <span class="detail-icon" style="color: ${o?"#fdd835":"var(--secondary-text-color)"}; background: ${o?"rgba(253, 216, 53, 0.1)":"rgba(255, 255, 255, 0.04)"}; font-size: 10px;">
                            💡
                          </span>
                          <div class="detail-content">
                            <span class="detail-label">
                              Lights
                            </span>
                            <span class="detail-value" style="color: ${o?"#fdd835":"var(--primary-text-color)"}">
                              ${a.lightsTotal>0?`${a.lightsOn}/${a.lightsTotal} On`:"No lights"}
                            </span>
                          </div>
                        </div>
                      `})()}
                  </div>

                  <div class="details-column scenes-col">
                    <div class="scenes-title" style="margin-bottom: 2px;">
                      Active Scenes
                    </div>
                    ${a.activeSceneItems.length>0?n`
                      <div class="scenes-list">
                        ${a.activeSceneItems.map(o=>n`
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
              <button class="close-add-btn" @click=${s=>{s.stopPropagation(),this._showAddAreaList=!1}}>×</button>
            </div>
            <div class="unconfigured-grid">
              ${i.map(s=>n`
                <div class="unconfigured-row" @click=${()=>this._selectArea(s.area_id)}>
                  <span class="unconfigured-name">${s.name}</span>
                  <span class="setup-badge">Setup</span>
                </div>
              `)}
              ${i.length===0?n`<div class="no-unconfigured">All areas are already configured!</div>`:""}
            </div>
          </div>
        `:""}
      </div>
    `}};nt.styles=[Mi,Pi,I`
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
    `],yt([p({type:Object})],nt.prototype,"hass",2),yt([p({type:Object})],nt.prototype,"globalConfigOverride",2),yt([b()],nt.prototype,"_areaConfigs",2),yt([b()],nt.prototype,"_areas",2),yt([b()],nt.prototype,"_todayData",2),yt([b()],nt.prototype,"_activeAreaId",2),yt([b()],nt.prototype,"_view",2),yt([b()],nt.prototype,"_loading",2),yt([b()],nt.prototype,"_showAddAreaList",2),yt([b()],nt.prototype,"_areasState",2),yt([b()],nt.prototype,"_globalConfig",2),yt([b()],nt.prototype,"_placeholderDefaults",2),yt([b()],nt.prototype,"_areaSlotTimesMap",2),nt=yt([M("twilight-areas-view")],nt);var dr=Object.defineProperty,cr=Object.getOwnPropertyDescriptor,Pt=(t,e,i,s)=>{for(var a=s>1?void 0:s?cr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&dr(e,i,a),a};const Oe=60,ts=15,Ki=15,es=25,is={"1w":"1 Week","2w":"2 Weeks","1m":"1 Month","3m":"3 Months","6m":"6 Months"},as={"1m":"1 Min","5m":"5 Min","10m":"10 Min","15m":"15 Min","30m":"30 Min","60m":"60 Min"},ss={"1m":{count:1440,duration:60},"5m":{count:288,duration:300},"10m":{count:144,duration:600},"15m":{count:96,duration:900},"30m":{count:48,duration:1800},"60m":{count:24,duration:3600}},os={"1w":7,"2w":14,"1m":30,"3m":90,"6m":180},Zi=5,rs=new Map;function pr(t){let e=rs.get(t);return e||(e=new Intl.DateTimeFormat("en-US",{timeZone:t,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1}),rs.set(t,e)),e}function ns(t,e){const i=Object.fromEntries(pr(e).formatToParts(t).map(o=>[o.type,o.value])),s=Number(i.hour)%24,a=Date.UTC(Number(i.year),Number(i.month)-1,Number(i.day),s,Number(i.minute),Number(i.second));return Math.round((a-t.getTime())/1e3)}function ls(t,e){const i=ns(t,e),s=Math.floor(t.getTime()/1e3)+i,a=Math.floor(s/86400)*86400,o=ns(new Date(a*1e3),e);return a-o}let wt=class extends L{constructor(){super(...arguments),this.hass=null,this.activeAreaId=null,this._activeMode="motion",this._activeRange="1w",this._activeResolution="10m",this._loading=!1,this._motionData=[],this._lightData=[],this._profiles=[],this._activeSource="live",this._w=0,this._dialogs=new be(this),this._ro=null}get _activeProfile(){return this._activeSource==="live"?null:this._profiles.find(t=>t.id===this._activeSource)??null}disconnectedCallback(){var t;(t=this._ro)==null||t.disconnect(),super.disconnectedCallback()}updated(t){var a;if(!this._ro){const o=(a=this.shadowRoot)==null?void 0:a.querySelector(".canvas-wrap");o&&(this._ro=new ResizeObserver(r=>{const l=r[0].contentRect.width;l>0&&l!==this._w&&(this._w=l,this._draw())}),this._ro.observe(o))}const e=t.has("hass")&&!t.get("hass")&&this.hass,i=t.has("activeAreaId")&&t.get("activeAreaId")!==this.activeAreaId,s=t.has("_activeRange");(e||i||s)&&this._load(),(t.has("_motionData")||t.has("_lightData")||t.has("_activeMode")||t.has("_activeResolution")||t.has("_activeSource")||t.has("_profiles")||t.has("_w"))&&requestAnimationFrame(()=>this._draw())}async _loadProfiles(){if(!(!this.hass||!this.activeAreaId))try{const e=(await Ze(this.hass)).find(i=>i.area_id===this.activeAreaId);this._profiles=(e==null?void 0:e.heatmap_profiles)??[]}catch(t){console.error("Twilight heatmap profiles load error:",t)}}async _load(){if(!(!this.hass||!this.activeAreaId)){this._loading=!0;try{const[t]=await Promise.all([eo(this.hass,{area_id:this.activeAreaId,days:os[this._activeRange],binary_only:!0}),this._loadProfiles()]);this._motionData=t.motion??[],this._lightData=t.light_on??[]}catch(t){console.error("Twilight heatmap load error:",t)}finally{this._loading=!1}}}async _saveCurrentProfile(){if(!this.hass||!this.activeAreaId)return;if(this._profiles.length>=Zi){await this._dialogs.showAlert("Limit Reached",`Maximum ${Zi} saved heatmap profiles allowed per area.`);return}const t=this._activeResolution==="1m"?"5m":this._activeResolution,e=await this._dialogs.showPrompt("Save Heatmap Profile","Workweek Profile","Profile Name");if(e)try{await Ca(this.hass,{area_id:this.activeAreaId,name:e,resolution:t,range:this._activeRange}),await this._loadProfiles()}catch(i){await this._dialogs.showAlert("Error",`Failed to save profile: ${i.message}`)}}async _updateProfile(t){if(!(!this.hass||!this.activeAreaId))try{await Ca(this.hass,{area_id:this.activeAreaId,name:t.name,resolution:t.resolution,range:t.range,profile_id:t.id}),await this._loadProfiles(),await this._dialogs.showAlert("Updated",`Profile "${t.name}" recalculated from current recorder history.`)}catch(e){await this._dialogs.showAlert("Error",`Failed to update profile: ${e.message}`)}}async _deleteProfile(t){if(!(!this.hass||!this.activeAreaId||!await this._dialogs.showConfirm("Delete Profile",`Delete profile "${t.name}"?`)))try{await ao(this.hass,{area_id:this.activeAreaId,profile_id:t.id}),this._activeSource===t.id&&this._setSource("live"),await this._loadProfiles()}catch(i){await this._dialogs.showAlert("Error",`Failed to delete profile: ${i.message}`)}}_setSource(t){this._activeSource=t;const e=t==="live"?null:this._profiles.find(i=>i.id===t);e&&(this._activeMode="motion",this._activeResolution=e.resolution,this._activeRange=e.range)}_setMode(t){this._activeProfile||(this._activeMode=t)}_setRange(t){this._activeProfile||(this._activeRange=t)}_setResolution(t){this._activeProfile||(this._activeResolution=t)}_getFillColorRGB(){const t=this._activeMode==="motion"?"--tw-chart-motion":"--tw-chart-light-on",e=this._activeMode==="motion"?"#00e5ff":"#ff9100",i=getComputedStyle(this).getPropertyValue(t).trim()||e;if(i.startsWith("#")){const a=parseInt(i.slice(1,3),16),o=parseInt(i.slice(3,5),16),r=parseInt(i.slice(5,7),16);return`${a}, ${o}, ${r}`}const s=i.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);return s?`${s[1]}, ${s[2]}, ${s[3]}`:this._activeMode==="motion"?"0, 176, 255":"255, 145, 0"}_getTextColor(){return getComputedStyle(this).getPropertyValue("--primary-text-color").trim()||"rgba(255,255,255,0.9)"}_getGridColor(){return getComputedStyle(this).getPropertyValue("--divider-color").trim()||"rgba(128,128,128,0.2)"}_getAxisFont(){return`400 11px ${getComputedStyle(this).getPropertyValue("--font-family").trim()||"system-ui, sans-serif"}`}_profileDensities(t,e){return Array.from({length:7},(i,s)=>{const a=t.motion_buckets[String(s)]??[];return Array.from({length:e},(o,r)=>a[r]??0)})}_computeLiveDensities(t,e,i){const s=os[this._activeRange],a=new Date,{duration:o}=ss[this._activeResolution],r=Array.from({length:7},()=>new Array(i).fill(0)),l=new Array(7).fill(0),c=new Intl.DateTimeFormat("en-US",{weekday:"short",timeZone:e}),f={Mon:0,Tue:1,Wed:2,Thu:3,Fri:4,Sat:5,Sun:6};for(let g=0;g<s;g++){const d=new Date(a.getTime()-g*24*60*60*1e3),u=ls(d,e),v=ls(new Date((u+25*3600)*1e3),e),y=f[c.format(new Date(u*1e3))]??0;let k=0;for(const[D,$]of t)if(D<=u)k=$;else break;const x=[];let _=u,C=k;for(const[D,$]of t)if(!(D<=u)){if(D>=v){x.push({start:_,end:v,val:C}),_=v;break}x.push({start:_,end:D,val:C}),_=D,C=$}_<v&&x.push({start:_,end:v,val:C});for(let D=0;D<i;D++){const $=u+D*o,w=$+o;let S=0;for(const E of x){const H=Math.max(E.start,$),z=Math.min(E.end,w);H<z&&E.val===1&&(S+=z-H)}const m=S/o;r[y][D]+=m}l[y]++}const h=Array.from({length:7},()=>new Array(i).fill(0));for(let g=0;g<7;g++){const d=l[g];for(let u=0;u<i;u++)h[g][u]=d>0?r[g][u]/d:0}return h}_draw(){var D,$;const t=(D=this.shadowRoot)==null?void 0:D.querySelector("canvas");if(!t||!this._w||!this.hass)return;const e=this._w,i=t.getBoundingClientRect().height;if(!i)return;const s=Oi(t,e,i),a=e-Oe-ts,r=(i-Ki-es)/7,l=this.hass.config.time_zone||"UTC",c=(($=this.hass.locale)==null?void 0:$.language)||navigator.language||"en-US",f=new Date,g=(f.getUTCDay()+6)%7,d=new Date(Date.UTC(f.getUTCFullYear(),f.getUTCMonth(),f.getUTCDate()-g)),u=Array.from({length:7},(w,S)=>{const m=new Date(d.getTime()+S*24*60*60*1e3);return new Intl.DateTimeFormat(c,{weekday:"short",timeZone:l}).format(m)}),v=this._activeProfile,{count:y}=ss[this._activeResolution];let k;if(v)k=this._profileDensities(v,y);else{const w=this._activeMode==="motion"?this._motionData:this._lightData;if(!w||w.length===0){s.restore();return}k=this._computeLiveDensities(w,l,y)}if(!k){s.restore();return}const x=this._getFillColorRGB(),_=this._getTextColor(),C=this._getGridColor();s.font=this._getAxisFont();for(let w=0;w<7;w++){const S=Ki+w*r;s.fillStyle=_,s.textAlign="right",s.fillText(u[w],Oe-10,S+r/2+4),w>0&&(s.strokeStyle=C,s.beginPath(),s.moveTo(Oe,S),s.lineTo(e-ts,S),s.stroke());for(let m=0;m<y;m++){const E=k[w][m];if(E>0){const H=Oe+m/y*a,z=a/y+.5,F=r-2;let et=0;this._activeMode==="motion"?et=Math.min(1,Math.sqrt(E)*1.8):et=Math.min(1,E*1.2),s.fillStyle=`rgba(${x}, ${et})`,s.fillRect(H,S+1,z,F)}}}s.strokeStyle=C,s.lineWidth=1;for(let w=0;w<=24;w+=2){const S=Oe+w/24*a;s.beginPath(),s.moveTo(S,Ki),s.lineTo(S,i-es),s.stroke()}s.fillStyle=_,s.textAlign="center";for(let w=0;w<=24;w+=4){const S=Oe+w/24*a,m=`${w.toString().padStart(2,"0")}:00`;s.fillText(m,S,i-8)}s.restore()}render(){var s;const t=this._activeProfile,e=t!==null,i=e?Object.keys(t.motion_buckets).length>0:((s=this._activeMode==="motion"?this._motionData:this._lightData)==null?void 0:s.length)>0;return n`
      <div class="card-header">
        <div class="header-left">
          <span class="card-dot" style="--dot-color: #8b5cf6;"></span>
          <span class="card-title">Activity Profile (Heatmap)</span>
        </div>
        <div class="header-controls">
          <select
            class="source-select"
            .value=${this._activeSource}
            @change=${a=>this._setSource(a.target.value)}
            title="Data source"
          >
            <option value="live" ?selected=${this._activeSource==="live"}>Live (Recorder)</option>
            ${this._profiles.map(a=>n`
              <option value=${a.id} ?selected=${a.id===this._activeSource}>${a.name}</option>
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
            ${Object.keys(as).map(a=>n`
              <button
                class="toggle-btn ${this._activeResolution===a?"active":""}"
                ?disabled=${e}
                @click=${()=>this._setResolution(a)}
              >
                ${as[a]}
              </button>
            `)}
          </div>
          <div class="toggle-group">
            ${Object.keys(is).map(a=>n`
              <button
                class="toggle-btn ${this._activeRange===a?"active":""}"
                ?disabled=${e}
                @click=${()=>this._setRange(a)}
              >
                ${is[a]}
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
          ${this._profiles.map(a=>n`
              <div class="profile-chip ${this._activeSource===a.id?"active":""}">
                <span style="cursor:pointer" @click=${()=>this._setSource(a.id)} title="Click to view this profile">
                  ${a.name}
                </span>
                <span class="badge">${a.resolution} / ${a.range}</span>
                <button
                  class="chip-action"
                  title="Update profile from current recorder data"
                  @click=${()=>this._updateProfile(a)}
                >
                  🔄
                </button>
                <button
                  class="chip-action"
                  title="Delete profile"
                  @click=${()=>this._deleteProfile(a)}
                >
                  ✕
                </button>
              </div>
            `)}
          ${this._profiles.length<Zi?n`
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
    `}};wt.styles=I`
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
    .card-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--dot-color, #8b5cf6);
      box-shadow: 0 0 6px var(--dot-color, #8b5cf6);
      flex-shrink: 0;
      display: inline-block;
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
  `,Pt([p({attribute:!1})],wt.prototype,"hass",2),Pt([p({type:String})],wt.prototype,"activeAreaId",2),Pt([b()],wt.prototype,"_activeMode",2),Pt([b()],wt.prototype,"_activeRange",2),Pt([b()],wt.prototype,"_activeResolution",2),Pt([b()],wt.prototype,"_loading",2),Pt([b()],wt.prototype,"_motionData",2),Pt([b()],wt.prototype,"_lightData",2),Pt([b()],wt.prototype,"_profiles",2),Pt([b()],wt.prototype,"_activeSource",2),Pt([b()],wt.prototype,"_w",2),wt=Pt([M("twilight-heatmap-card")],wt);var hr=Object.defineProperty,ur=Object.getOwnPropertyDescriptor,We=(t,e,i,s)=>{for(var a=s>1?void 0:s?ur(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&hr(e,i,a),a};let _e=class extends L{constructor(){super(...arguments),this.hass=null,this._areaConfigs=[],this._activeAreaId=null,this._loading=!0}firstUpdated(t){super.firstUpdated(t),this._loadAreas()}updated(t){super.updated(t),t.has("hass")&&this.hass&&this._areaConfigs.length===0&&this._loadAreas()}async _loadAreas(){if(this.hass)try{const t=await Ze(this.hass);this._areaConfigs=t,t.length>0&&!this._activeAreaId&&(this._activeAreaId=t[0].area_id)}catch(t){console.error("Failed to load areaConfigs for analytics",t)}finally{this._loading=!1}}render(){return this._loading?n`<div class="loading-state" style="padding: 24px; color: var(--secondary-text-color);">Loading areaConfigs…</div>`:n`
      <!-- Header Grid (1 Row, 12 columns, max 6 items) -->
      <div class="view-header-container">
        <div class="view-header-grid">
          <div class="span-3" style="display: flex; align-items: center; gap: 8px;">
            <h2 style="margin:0; font-size:20px; font-weight:500; color:var(--primary-text-color);">Analytics</h2>
          </div>
          <div class="span-9" style="display: flex; align-items: center; justify-content: flex-end; gap: 12px;">
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
            <span style="font-size: 13px; color: var(--secondary-text-color);">
              weekday presence density & lux history
            </span>
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
    `}};_e.styles=I`
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

    .area-select {
      background: var(--card-background-color, #1e1e2e);
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
  `,We([p({attribute:!1})],_e.prototype,"hass",2),We([b()],_e.prototype,"_areaConfigs",2),We([b()],_e.prototype,"_activeAreaId",2),We([b()],_e.prototype,"_loading",2),_e=We([M("twilight-analytics-view")],_e);var gr=Object.defineProperty,fr=Object.getOwnPropertyDescriptor,tt=(t,e,i,s)=>{for(var a=s>1?void 0:s?fr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&gr(e,i,a),a};const ri=50,ni=20,ds=0,cs=30,Ji=300;let K=class extends L{constructor(){super(...arguments),this.hass=null,this.year=new Date().getFullYear(),this.selectedDate=new Date().toISOString().slice(0,10),this.clamped=!1,this.noHeader=!1,this.noAxisLabels=!1,this.showSlots=!1,this.noSolarNoonMidnight=!1,this.scatterMode=!1,this.sunData=null,this.hoverTime=null,this.hoverIdx=null,this.days=[],this.slotCurves=null,this.liveTime=null,this._loading=!1,this._w=0,this._ro=null}connectedCallback(){super.connectedCallback()}disconnectedCallback(){var t;(t=this._ro)==null||t.disconnect(),super.disconnectedCallback()}updated(t){var i;if(!this._ro){const s=(i=this.shadowRoot)==null?void 0:i.querySelector(".wrap");s&&(this._ro=new ResizeObserver(a=>{const o=a[0].contentRect.width;o>0&&o!==this._w&&(this._w=o,this._draw())}),this._ro.observe(s))}(t.has("hass")||t.has("year"))&&this.hass&&!this.days.length&&!this._loading&&this._load(),(t.has("days")||t.has("selectedDate")||t.has("clamped")||t.has("showSlots")||t.has("noSolarNoonMidnight")||t.has("scatterMode")||t.has("sunData")||t.has("hoverIdx")||t.has("liveTime"))&&requestAnimationFrame(()=>this._draw())}async _load(){if(this.hass){this._loading=!0;try{const t=await $a(this.hass,{year:this.year});this.days=t.days}catch(t){console.error("Year load failed",t)}finally{this._loading=!1}}}_getLiveTime(){const t=new Date;return t.getHours()*60+t.getMinutes()+t.getSeconds()/60}_todayIdx(){return this.days.findIndex(t=>t.date===new Date().toISOString().slice(0,10))}_interpolateEl(t){var e;return Ea(((e=this.sunData)==null?void 0:e.points)??[],t)}_draw(){var S;const t=(S=this.shadowRoot)==null?void 0:S.querySelector("canvas");if(!t)return;const e=this.days,i=e.length;if(!i||!this._w)return;const s=this._w,a=t.getBoundingClientRect().height||Ji,o=Oi(t,s,a),r=this.noAxisLabels?10:ri,l=this.noAxisLabels?10:ni,c=this.noAxisLabels?10:ds,f=this.noAxisLabels?10:cs,h=s-r-l,g=a-c-f,d=c,u=c+g,v=r,y=r+h,k=1440,x=m=>d+g-Math.max(0,Math.min(k,m))/k*g;if(o.save(),o.shadowColor="rgba(0, 0, 0, 0.2)",o.shadowBlur=36,o.shadowOffsetX=0,o.shadowOffsetY=0,o.beginPath(),o.roundRect(v,d,h,g,8),o.fillStyle=gt,o.fill(),o.restore(),o.save(),o.beginPath(),o.roundRect(v,d,h,g,8),o.clip(),this.scatterMode){const m=(E,H,z)=>{const F=e.map(T=>T[H]),et=e.map(T=>T[z]);o.strokeStyle=E,o.lineWidth=1;let P=[];const it=T=>{if(!T.length)return;o.beginPath();let ht=!1,ut=0,$t=0,R=0;const lt=(W,G)=>{o.moveTo(W,G),ht=!0,ut=(G-d)/g*k|0,$t=W,R=G},Nt=(W,G,st,Dt)=>{const Gt=Math.abs(st-ut),Z=Xt=>Xt>0&&Xt<i&&e[Xt].tz_offset!==e[Xt-1].tz_offset,ui=Z(Dt)||Z(Dt-1)||Z(Dt+1);if(Gt>120)lt(W,G);else if(ui&&Gt>30){const Xt=($t+W)/2;o.lineTo(Xt,R),o.moveTo(Xt,G),o.lineTo(W,G),ut=st,$t=W,R=G}else o.lineTo(W,G),ut=st,$t=W,R=G};for(const W of T){const G=F[W];if(G===null)continue;const st=v+W/(i-1)*h,Dt=(G%1440+1440)%1440,Gt=x(Dt);ht?Nt(st,Gt,Dt,W):lt(st,Gt)}for(let W=T.length-1;W>=0;W--){const G=T[W],st=et[G];if(st===null)continue;const Dt=v+G/(i-1)*h,Gt=(st%1440+1440)%1440,Z=x(Gt);ht?Nt(Dt,Z,Gt,G):lt(Dt,Z)}o.stroke()};for(let T=0;T<i;T++)F[T]!==null&&et[T]!==null?P.push(T):P.length&&(it(P),P=[]);P.length&&it(P)};m(Rt,"astro_dawn","astro_dusk"),m(Lt,"nautical_dawn","nautical_dusk"),m(jt,"dawn","dusk"),m(Zt,"sunrise","sunset")}else{const m=this.clamped;for(let E=0;E<i;E++){const H=e[E],z=E>0?e[E-1]:null,F=E===0?v:v+(E-.5)/(i-1)*h,P=(E===i-1?y:v+(E+.5)/(i-1)*h)-F+.5,it=m?ji(H):Li(H);if(it.length===0){o.fillStyle=Ni(H.midnight_el),o.fillRect(F,d,P,g);continue}const T=[...it];z&&Ui(T,z,H,m),T.sort((ht,ut)=>ht.t-ut.t),lo(o,F,P,T,Hi(z,H,m),x,k)}}const _=(m,E,H=1.5,z)=>{o.save(),o.strokeStyle=m,o.lineWidth=H,z&&(o.shadowColor=z,o.shadowBlur=8),o.beginPath();const F=P=>P===0?v:v+(P-.5)/(i-1)*h,et=P=>P===i-1?y:v+(P+.5)/(i-1)*h;for(let P=0;P<i;P++){const it=E[P];if(it===null)continue;const T=x((it%k+k)%k);o.moveTo(F(P),T),o.lineTo(et(P),T)}o.stroke(),o.restore()};if(this.noSolarNoonMidnight||(_("rgba(255,214,0,1)",e.map(m=>m.solar_noon),1.5,"rgba(255, 214, 0, 0.6)"),_("rgba(60,100,200,1)",e.map(m=>m.solar_midnight))),this.showSlots)if(this.slotCurves){const m=this.slotCurves;_("rgba(255,255,255,0.75)",m.civil_dusk??[]),_("rgba(255,255,255,0.60)",m.nautical_dusk??[]),_("rgba(255,255,255,0.45)",m.astro_dusk??[]),_("rgba(255,255,255,0.30)",m.night??[]),_("rgba(255,255,255,0.30)",m.astro_dawn??[]),_("rgba(255,255,255,0.45)",m.nautical_dawn??[]),_("rgba(255,255,255,0.60)",m.civil_dawn??[]),_("rgba(255,255,255,0.75)",m.gold_dawn??[]),_("rgba(255,255,255,0.75)",m.day??[]),_("rgba(255,255,255,0.75)",m.gold_dusk??[])}else _("rgba(255,255,255,0.75)",e.map(m=>m.slot_sunset)),_("rgba(255,255,255,0.60)",e.map(m=>m.slot_nautical_dusk)),_("rgba(255,255,255,0.45)",e.map(m=>m.slot_astro_dusk)),_("rgba(255,255,255,0.30)",e.map(m=>m.slot_night)),_("rgba(255,255,255,0.30)",e.map(m=>m.slot_astro_dawn)),_("rgba(255,255,255,0.45)",e.map(m=>m.slot_nautical_dawn)),_("rgba(255,255,255,0.60)",e.map(m=>m.slot_civil_dawn)),_("rgba(255,255,255,0.75)",e.map(m=>m.slot_sunrise)),_("rgba(255,255,255,0.75)",e.map(m=>m.slot_gold_dawn)),_("rgba(255,255,255,0.75)",e.map(m=>m.slot_day)),_("rgba(255,255,255,0.75)",e.map(m=>m.slot_gold_dusk));const C=this._todayIdx();if(C>=0){const m=v+C/(i-1)*h;o.save(),o.strokeStyle="rgba(255,255,255,0.55)",o.lineWidth=1.5,o.setLineDash([4,3]),o.beginPath(),o.moveTo(m,d),o.lineTo(m,u),o.stroke(),o.restore()}const D=this.days.findIndex(m=>m.date===this.selectedDate);if(D>=0&&D!==C){const m=v+D/(i-1)*h;o.save(),o.strokeStyle="rgba(255,255,255,0.4)",o.lineWidth=1,o.setLineDash([2,2]),o.beginPath(),o.moveTo(m,d),o.lineTo(m,u),o.stroke(),o.restore()}o.restore(),o.save(),o.beginPath(),o.roundRect(v,d,h,g,8),o.strokeStyle=Ta(this),o.lineWidth=1,o.stroke(),o.restore();const $=this.liveTime??this._getLiveTime();let w=D;if(w===-1&&(w=C),w>=0&&w<i){const m=v+w/(i-1)*h,E=x($),H=this._interpolateEl($);H>=0?Oa(o,m,E):H>=-6?za(o,m,E):Ia(o,m,E)}o.restore()}_renderAxis(){var D;const t=this._w;if(!t)return kt``;const e=(D=this.shadowRoot)==null?void 0:D.querySelector("canvas"),i=e&&e.getBoundingClientRect().height||Ji,s=this.noAxisLabels?10:ri,a=this.noAxisLabels?10:ni,o=this.noAxisLabels?10:ds,r=this.noAxisLabels?10:cs,l=t-s-a,c=i-o-r,f=o,h=o+c,g=$=>f+c-$/1440*c,d=this.days.length||365,u=Array.from({length:13},($,w)=>w*2).map($=>{const w=g($*60),S=$%6===0&&$!==0&&$!==24,m=$!==0&&$!==24;return kt`
        ${S&&!this.noAxisLabels?kt`<text x=${s-6} y=${w} text-anchor="end" dominant-baseline="middle" class="axis-label" style="font: ${ti(this)}">${String($).padStart(1,"0")}:00</text>`:kt``}
        ${m?kt`<line x1=${s} y1=${w} x2=${s+l} y2=${w} class="grid-line" stroke-width="0.5" clip-path="url(#rect-clip)"/>`:kt``}
      `}),v=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],y=[0,31,59,90,120,151,181,212,243,273,304,334],k=[15,45,74,105,135,166,196,227,258,288,319,349],x=v.map(($,w)=>{const S=s+Math.min(y[w],d-1)/(d-1)*l,m=s+Math.min(k[w],d-1)/(d-1)*l;return kt`
        ${w>0?kt`<line x1=${S} y1=${f} x2=${S} y2=${h} class="grid-line" stroke-width="0.5" clip-path="url(#rect-clip)"/>`:kt``}
        ${this.noAxisLabels?kt``:kt`<text x=${m} y=${h+20} text-anchor="middle" class="axis-label" style="font: ${ti(this)}">${$}</text>`}`}),_=this.hoverIdx!==null?this.days[this.hoverIdx]:null,C=_?s+this.hoverIdx/(d-1)*l:null;return kt`
      <svg class="overlay" width="100%" height="100%">
        <defs>
          <clipPath id="rect-clip">
            <rect x=${s} y=${f} width=${l} height=${c} rx="8" ry="8" />
          </clipPath>
        </defs>
        ${u}
        ${x}
        ${C!==null&&_?kt`
          <line x1=${C} y1=${f} x2=${C} y2=${h} stroke="rgba(255,255,255,0.28)" stroke-width="1" clip-path="url(#rect-clip)"/>
        `:""}
      </svg>
    `}_onMove(t){if(!this._w)return;const e=t.currentTarget.getBoundingClientRect(),i=this.noAxisLabels?10:ri,s=this.noAxisLabels?10:ni,a=this._w-i-s,o=t.clientX-e.left;this.hoverIdx=Math.round(Math.max(0,Math.min(1,(o-i)/a))*(this.days.length-1));const r=this.days[this.hoverIdx];this.dispatchEvent(new CustomEvent("year-hover-changed",{detail:{index:this.hoverIdx,date:r?r.date:null},bubbles:!0,composed:!0}))}_onLeave(){this.hoverIdx=null,this.dispatchEvent(new CustomEvent("year-hover-changed",{detail:{index:null,date:null},bubbles:!0,composed:!0}))}_onClick(){if(this.hoverIdx!==null&&this.days[this.hoverIdx]){const t=this.days[this.hoverIdx].date;this.dispatchEvent(new CustomEvent("date-selected",{detail:t,bubbles:!0,composed:!0}))}}_onTouchMove(t){if(!this._w)return;const e=t.touches[0],i=t.currentTarget.getBoundingClientRect(),s=this.noAxisLabels?10:ri,a=this.noAxisLabels?10:ni,o=this._w-s-a,r=e.clientX-i.left;this.hoverIdx=Math.round(Math.max(0,Math.min(1,(r-s)/o))*(this.days.length-1));const l=this.days[this.hoverIdx];this.dispatchEvent(new CustomEvent("year-hover-changed",{detail:{index:this.hoverIdx,date:l?l.date:null},bubbles:!0,composed:!0}))}_onTouchEnd(){this.hoverIdx=null,this.dispatchEvent(new CustomEvent("year-hover-changed",{detail:{index:null,date:null},bubbles:!0,composed:!0}))}render(){return n`
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
    `}};K.styles=I`
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
    .card-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--dot-color, #f59e0b);
      box-shadow: 0 0 6px var(--dot-color, #f59e0b);
      flex-shrink: 0;
      display: inline-block;
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
  `,tt([p({attribute:!1})],K.prototype,"hass",2),tt([p({type:Number})],K.prototype,"year",2),tt([p({type:String})],K.prototype,"selectedDate",2),tt([p({type:Boolean})],K.prototype,"clamped",2),tt([p({type:Boolean})],K.prototype,"noHeader",2),tt([p({type:Boolean})],K.prototype,"noAxisLabels",2),tt([p({type:Boolean})],K.prototype,"showSlots",2),tt([p({type:Boolean})],K.prototype,"noSolarNoonMidnight",2),tt([p({type:Boolean})],K.prototype,"scatterMode",2),tt([p({attribute:!1})],K.prototype,"sunData",2),tt([p({attribute:!1})],K.prototype,"hoverTime",2),tt([p({type:Number})],K.prototype,"hoverIdx",2),tt([p({attribute:!1})],K.prototype,"days",2),tt([p({attribute:!1})],K.prototype,"slotCurves",2),tt([p({type:Number})],K.prototype,"liveTime",2),tt([b()],K.prototype,"_loading",2),tt([b()],K.prototype,"_w",2),K=tt([M("twilight-sun-year-card")],K);var vr=Object.defineProperty,br=Object.getOwnPropertyDescriptor,X=(t,e,i,s)=>{for(var a=s>1?void 0:s?br(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&vr(e,i,a),a};const Qi=[{name:"North Pole",lat:90,lon:0,tz:"UTC"},{name:"Qaanaaq",lat:77.47,lon:-69.23,tz:"America/Thule"},{name:"Reykjavík",lat:64.13,lon:-21.9,tz:"Atlantic/Reykjavik"},{name:"Helsinki",lat:60.17,lon:24.94,tz:"Europe/Helsinki"},{name:"Hamburg",lat:53.55,lon:9.99,tz:"Europe/Berlin"},{name:"Paris",lat:48.85,lon:2.35,tz:"Europe/Paris"},{name:"New York",lat:40.71,lon:-74.01,tz:"America/New_York"},{name:"Tokyo",lat:35.68,lon:139.69,tz:"Asia/Tokyo"},{name:"Cairo",lat:30.05,lon:31.24,tz:"Africa/Cairo"},{name:"Honolulu",lat:21.31,lon:-157.86,tz:"Pacific/Honolulu"},{name:"Equator",lat:0,lon:0,tz:"UTC"},{name:"Nairobi",lat:-1.29,lon:36.82,tz:"Africa/Nairobi"},{name:"Santiago",lat:-33.45,lon:-70.67,tz:"America/Santiago"},{name:"Cape Town",lat:-33.93,lon:18.42,tz:"Africa/Johannesburg"},{name:"Auckland",lat:-36.85,lon:174.76,tz:"Pacific/Auckland"},{name:"Ushuaia",lat:-54.8,lon:-68.3,tz:"America/Argentina/Ushuaia"},{name:"McMurdo Station",lat:-77.85,lon:166.67,tz:"Pacific/Auckland"},{name:"South Pole",lat:-90,lon:0,tz:"UTC"}],ps=[10,25,50,100,250];let Y=class extends L{constructor(){super(...arguments),this.hass=null,this._days=[],this._year=new Date().getFullYear(),this._loading=!1,this._error="",this._hoverIdx=null,this._selectedDate=new Date().toISOString().slice(0,10),this._sunData=null,this._hoverTime=null,this._scrubbing=!1,this._isDark=!1,this._demoLocationIdx=-1,this._demoPlaying=!1,this._demoDayIdx=0,this._demoSpeed=ps[2]||50,this._clamped=!1,this._showSlots=!1,this._slotCurves=null,this._areas=[],this._selectedAreaId=null,this._channelSlotsMap=void 0,this._updateInterval=null,this._demoInterval=null,this._dayCache=new Map,this._channelSlotsCache=new Map,this._lastLoadDayTime=0,this._loadDayTimeout=null}connectedCallback(){super.connectedCallback(),this._updateInterval=window.setInterval(()=>{this._scrubbing||this.requestUpdate()},1e3)}disconnectedCallback(){this._updateInterval&&clearInterval(this._updateInterval),this._stopDemo(),this._loadDayTimeout&&(clearTimeout(this._loadDayTimeout),this._loadDayTimeout=null),super.disconnectedCallback()}updated(t){if(t.has("hass")&&this.hass){const e=ja(this.hass,this);e!==this._isDark&&(this._isDark=e,this.toggleAttribute("dark",e))}t.has("hass")&&this.hass&&!this._areas.length&&this._loadAreas(),t.has("hass")&&this.hass&&!this._days.length&&!this._loading&&this._loadYear(),t.has("_selectedDate")&&this.hass&&this._selectedDate&&this._loadDay()}async _loadAreas(){if(this.hass)try{this._areas=await Ze(this.hass)}catch(t){console.error("Failed to load areas for timeline view",t)}}_locParams(){const t=Qi[this._demoLocationIdx];return t?{lat:t.lat,lon:t.lon,tz:t.tz}:{}}async _loadYear(){var t;if(this.hass){this._loading=!0,this._error="";try{const[e,i]=await Promise.all([$a(this.hass,{year:this._year,...this._locParams()}),to(this.hass,{year:this._year,...this._locParams(),area_id:this._selectedAreaId??void 0}).catch(()=>null)]);this._days=e.days,this._year=e.year,this._slotCurves=(i==null?void 0:i.curves)??null;const s=new Date().toISOString().slice(0,10);this._selectedDate=this._days.some(a=>a.date===s)?s:((t=this._days[0])==null?void 0:t.date)??s}catch(e){this._error=e instanceof Error?e.message:String(e)}finally{this._loading=!1}}}_loadDay(){this._loadDayTimeout&&(clearTimeout(this._loadDayTimeout),this._loadDayTimeout=null);const t=`${this._demoLocationIdx}_${this._selectedAreaId}_${this._selectedDate}`;if(this._demoPlaying&&this._dayCache.has(t)){this._sunData=this._dayCache.get(t),this._channelSlotsMap=this._channelSlotsCache.get(t);return}if(this._dayCache.has(t)){this._sunData=this._dayCache.get(t),this._channelSlotsMap=this._channelSlotsCache.get(t);return}const i=Date.now()-this._lastLoadDayTime,s=10;i>=s?this._executeLoadDay():this._loadDayTimeout=window.setTimeout(()=>{this._executeLoadDay()},s-i)}async _executeLoadDay(){if(!this.hass||!this._selectedDate)return;this._lastLoadDayTime=Date.now();const t=this._selectedDate,e=`${this._demoLocationIdx}_${this._selectedAreaId}_${t}`;try{const i=await Je(this.hass,{date:t,...this._locParams()});this._dayCache.set(e,i),this._selectedDate===t&&(this._sunData=i)}catch{this._selectedDate===t&&(this._sunData=null)}await this._loadChannelSlots(t)}async _loadChannelSlots(t){if(!this.hass||!this._selectedAreaId){this._channelSlotsMap=void 0;return}const e=this._areas.find(a=>a.area_id===this._selectedAreaId);if(!e){this._channelSlotsMap=void 0;return}const i=`${this._demoLocationIdx}_${this._selectedAreaId}_${t}`,s=Object.entries(J(e));try{const a=await Promise.all(s.map(([,r])=>zi(this.hass,{slots:r.slots||[],date:t}))),o={};s.forEach(([r,l],c)=>{o[r]=Be(a[c].slots,l.slots||[])}),this._channelSlotsCache.set(i,o),this._selectedDate===t&&(this._channelSlotsMap=o)}catch(a){console.error("Failed to load channel slots for timeline area selection",a),this._selectedDate===t&&(this._channelSlotsMap=void 0)}}_stopDemo(){this._demoInterval&&(clearInterval(this._demoInterval),this._demoInterval=null),this._demoPlaying=!1}_toggleDemo(){if(this._demoPlaying){this._stopDemo();return}this._demoPlaying=!0,this._demoDayIdx=0,this._advanceDemoDay(),this._demoInterval=window.setInterval(()=>this._advanceDemoDay(),this._demoSpeed)}_changeDemoSpeed(t){this._demoSpeed=t,this._demoPlaying&&(this._demoInterval&&clearInterval(this._demoInterval),this._demoInterval=window.setInterval(()=>this._advanceDemoDay(),this._demoSpeed))}_advanceDemoDay(){if(!this._days.length)return;const t=Math.min(this._demoDayIdx,this._days.length-1);this._selectedDate=this._days[t].date,this._demoDayIdx++,this._demoDayIdx>=this._days.length&&this._stopDemo()}async _selectLocation(t){this._stopDemo(),this._demoLocationIdx=t,t!==-1&&(this._selectedAreaId=null),this._days=[],this._sunData=null,await this._loadYear(),await this._loadDay()}async _selectArea(t){this._stopDemo(),this._selectedAreaId=t,t!==null&&(this._demoLocationIdx=-1),this._days=[],this._sunData=null,await this._loadYear(),await this._loadDay()}_toggleClamped(){this._clamped=!this._clamped}_toggleSlots(){this._showSlots=!this._showSlots}_fmt(t){if(t===null)return"—";const e=Math.round((t%1440+1440)%1440),i=Math.floor(e/60)%24,s=e%60;return`${String(i).padStart(2,"0")}:${String(s).padStart(2,"0")}`}_fmtDur(t){if(t===null||t<0)return"—";const e=Math.floor(t/60),i=Math.round(t%60);return e>0&&i>0?`${e}h ${i}min`:e>0?`${e}h`:`${i}min`}_todayIdx(){return this._days.findIndex(t=>t.date===new Date().toISOString().slice(0,10))}_getLiveTime(){var s,a,o;const t=Qi[this._demoLocationIdx],e=(t==null?void 0:t.tz)??void 0,i=new Date;if(e){const r=new Intl.DateTimeFormat("en-GB",{timeZone:e,hour:"numeric",minute:"numeric",second:"numeric",hour12:!1}).formatToParts(i),l=Number(((s=r.find(h=>h.type==="hour"))==null?void 0:s.value)??0),c=Number(((a=r.find(h=>h.type==="minute"))==null?void 0:a.value)??0),f=Number(((o=r.find(h=>h.type==="second"))==null?void 0:o.value)??0);return l*60+c+f/60}return i.getHours()*60+i.getMinutes()}_interpolateSun(t){var h;if(!((h=this._sunData)!=null&&h.points.length))return{elevation:0,azimuth:0};const e=this._sunData.points;let i=0,s=e.length-1;for(;i<s-1;){const g=i+s>>1;e[g].time<=t?i=g:s=g}const a=e[i],o=e[s];if(!a)return{elevation:0,azimuth:0};if(a===o||o.time===a.time)return{elevation:a.elevation,azimuth:a.azimuth};const r=(t-a.time)/(o.time-a.time),l=a.elevation+(o.elevation-a.elevation)*r;let c=a.azimuth,f=o.azimuth;return Math.abs(f-c)>180&&(f<c?f+=360:c+=360),{elevation:l,azimuth:(c+(f-c)*r)%360}}_phaseName(t){return t>=0?"Day":t>=-6?"Civil twilight":t>=-12?"Nautical twilight":t>=-18?"Astronomical twilight":"Night"}_phaseClass(t){return t>=0?"phase-day":t>=-6?"phase-civil":t>=-12?"phase-naut":t>=-18?"phase-astro":"phase-night"}render(){const t=new Date().toISOString().slice(0,10),e=this._hoverIdx!==null?this._days[this._hoverIdx]:null,i=this._days.findIndex(u=>u.date===this._selectedDate),s=i>=0?this._days[i]:this._days.length?this._days[0]:null,a=e??s,o=e?e.date:this._selectedDate,r=this._hoverTime??this._getLiveTime(),{elevation:l,azimuth:c}=this._interpolateSun(r),f=Math.round(r),h=`${String(Math.floor(f/60)%24).padStart(2,"0")}:${String(f%60).padStart(2,"0")}`,g=this._selectedAreaId?this._areas.find(u=>u.area_id===this._selectedAreaId):null,d=g?this._channelSlotsMap:void 0;return n`
    <!-- Header Grid (1 Row, 12 columns, max 6 items) -->
    <div class="view-header-container">
      <div class="view-header-grid">
        <div class="span-3" style="display: flex; align-items: center; gap: 8px;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 500;">Twilight Timeline</h2>
          <span class="year-label">${this._year}</span>
        </div>
        <div class="span-9" style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
          <select class="demo-select" style="width: auto;"
            ?disabled=${this._demoLocationIdx!==-1}
            @change=${u=>{const v=u.target.value;this._selectArea(v===""?null:v)}}>
            <option value="" ?selected=${this._selectedAreaId===null}>Standard (Global)</option>
            ${this._areas.map(u=>n`
              <option value=${u.area_id} ?selected=${this._selectedAreaId===u.area_id}>${u.name||u.area_id}</option>
            `)}
          </select>

          <div class="zone-toggle" style="margin-right: 8px;" role="group" aria-label="Zone visualisation mode">
            <button class=${this._showSlots?"active":""}
              title="Toggle slot lines (on/off)"
              @click=${this._toggleSlots}>Slots</button>
            <button class=${this._clamped?"active":""}
              title="Toggle clamped mode (on/off)"
              @click=${this._toggleClamped}>Clamped</button>
          </div>

          <select class="demo-select" style="width: auto;"
            ?disabled=${this._selectedAreaId!==null}
            @change=${u=>this._selectLocation(Number(u.target.value))}>
            <option value="-1" ?selected=${this._demoLocationIdx===-1}>HA Home</option>
            ${Qi.map((u,v)=>n`
              <option value=${v} ?selected=${this._demoLocationIdx===v}>${u.name} (${u.lat>0?"+":""}${u.lat}°)</option>
            `)}
          </select>

          <button class="demo-play ${this._demoPlaying?"playing":""}" style="width: 36px; min-width: 36px;"
            title=${this._demoPlaying?"Stop":"Play year"}
            @click=${()=>this._toggleDemo()}>
            ${this._demoPlaying?"⏹":"▶"}
          </button>

          <select class="demo-select" style="width: 80px;"
            @change=${u=>this._changeDemoSpeed(Number(u.target.value))}>
            ${ps.map(u=>n`
              <option value=${String(u)} ?selected=${this._demoSpeed===u}>${u} ms</option>
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
                .channels=${g?J(g):{}}
                .hoverTime=${this._hoverTime}
                .liveTime=${this._getLiveTime()}
                .noHeader=${!1}
                .noAxisLabels=${!1}
                @time-hover-changed=${u=>{this._hoverTime=u.detail.hoverTime,this._scrubbing=u.detail.scrubbing}}
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
                @date-selected=${u=>this._selectedDate=u.detail}
                @year-hover-changed=${u=>this._hoverIdx=u.detail.index}
              ></twilight-sun-year-card>
            </div>
          </div>

          <!-- Right: info panel (span-3) -->
          ${a?n`
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
                    <span class="info-value">${h}</span>
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
                  <span class="info-value noon">${this._fmt(a.solar_noon)}</span></div>
                <div class="info-row"><span class="info-label">Solar Midnight</span>
                  <span class="info-value midnight">${this._fmt(a.solar_midnight)}</span></div>
                <div class="info-row"><span class="info-label">Sunrise / Sunset</span>
                  <span class="info-value">${this._fmt(a.sunrise)} / ${this._fmt(a.sunset)}</span></div>
                ${(()=>{const u=x=>x!==null?(x%1440+1440)%1440:null,y=((x,_)=>{const C=u(x),D=u(_);if(C===null||D===null)return null;let $=D-C;return $<0&&($+=1440),$})(a.sunrise,a.sunset),k=y!==null?1440-y:null;return n`
                  <div class="info-row"><span class="info-label">Day length</span>
                    <span class="info-value">${this._fmtDur(y)}</span></div>
                  <div class="info-row"><span class="info-label">Night length</span>
                    <span class="info-value" style="color:var(--secondary-text-color)">${this._fmtDur(k)}</span></div>`})()}

                <div class="info-section">Twilight</div>
                <div class="info-row"><span class="info-label">Day</span>
                  <span class="info-value">
                    ${(()=>{const u=a.slot_day??a.sunrise,v=a.slot_gold_dusk??a.sunset;return u!==null&&v!==null?`${this._fmt(u)}–${this._fmt(v)}`:"—"})()}
                  </span></div>
                <div class="info-row"><span class="info-label">Civil</span>
                  <span class="info-value">${this._fmt(a.sunrise)} / ${this._fmt(a.sunset)}</span></div>
                <div class="info-row"><span class="info-label">Nautical</span>
                  <span class="info-value">${this._fmt(a.dawn)} / ${this._fmt(a.dusk)}</span></div>
                <div class="info-row"><span class="info-label">Astronomical</span>
                  <span class="info-value">${this._fmt(a.nautical_dawn)} / ${this._fmt(a.nautical_dusk)}</span></div>
                <div class="info-row"><span class="info-label">Night</span>
                  <span class="info-value">${this._fmt(a.astro_dusk)} / ${this._fmt(a.astro_dawn)}</span></div>
                <div class="info-row"><span class="info-label">Golden hour</span>
                  <span class="info-value">${this._fmt(a.slot_gold_dawn)} / ${this._fmt(a.slot_gold_dusk)}</span></div>

                <div class="info-section legend-section">Legend</div>
                ${[[gt,"Night"],[Rt,"Astronomical twilight"],[Lt,"Nautical twilight"],[jt,"Civil twilight"],[Fe,"Golden hour"],[Zt,"Daylight"]].map(([u,v])=>n`
                  <div class="legend-item">
                    <div class="legend-swatch" style="background:${u}"></div>
                    ${v}
                  </div>`)}
                ${[["#d2dce8","Civil dusk / Daylight"],["#aeb9c9","Nautical dusk / Civil dawn"],["#8792a2","Astro dusk / Nautical dawn"],["#5e6572","Night / Astro dawn"]].map(([u,v])=>n`
                  <div class="legend-item">
                    <div class="legend-swatch" style="background:${u}; height:5px; border-radius:1.5px; border:1px solid color-mix(in srgb, var(--primary-text-color, #fff) 15%, transparent); box-sizing:border-box;"></div>
                    ${v}
                  </div>`)}
              </div>
            </div>
          `:""}
        </div>
      </div>
    `:""}
    `}};Y.styles=I`
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
  `,X([p({attribute:!1})],Y.prototype,"hass",2),X([b()],Y.prototype,"_days",2),X([b()],Y.prototype,"_year",2),X([b()],Y.prototype,"_loading",2),X([b()],Y.prototype,"_error",2),X([b()],Y.prototype,"_hoverIdx",2),X([b()],Y.prototype,"_selectedDate",2),X([b()],Y.prototype,"_sunData",2),X([b()],Y.prototype,"_hoverTime",2),X([b()],Y.prototype,"_scrubbing",2),X([b()],Y.prototype,"_isDark",2),X([b()],Y.prototype,"_demoLocationIdx",2),X([b()],Y.prototype,"_demoPlaying",2),X([b()],Y.prototype,"_demoDayIdx",2),X([b()],Y.prototype,"_demoSpeed",2),X([b()],Y.prototype,"_clamped",2),X([b()],Y.prototype,"_showSlots",2),X([b()],Y.prototype,"_slotCurves",2),X([b()],Y.prototype,"_areas",2),X([b()],Y.prototype,"_selectedAreaId",2),X([b()],Y.prototype,"_channelSlotsMap",2),Y=X([M("twilight-timeline-view")],Y);var mr=Object.defineProperty,xr=Object.getOwnPropertyDescriptor,Ie=(t,e,i,s)=>{for(var a=s>1?void 0:s?xr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&mr(e,i,a),a};let ce=class extends oe{constructor(){super(...arguments),this.open=!1,this.isDraftDirty=!1,this._loading=!1,this._error="",this.dialog=new be(this),this._onClose=()=>{this._error="",this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))},this._onTriggerFileInput=()=>{var e;if(this.isDraftDirty){this.dialog.showAlert("Unsaved Changes","Please save or discard your unsaved settings changes before restoring from a backup.");return}const t=(e=this.shadowRoot)==null?void 0:e.querySelector("#restoreFileInput");t==null||t.click()}}async _onDownloadBackup(){if(this.hass)try{this._loading=!0,this._error="";const t=await Js(this.hass),e=new Date,i=`twilight-backup-${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}.json`,s=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),a=URL.createObjectURL(s),o=document.createElement("a");o.href=a,o.download=i,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(a)}catch(t){this._error=t instanceof Error?t.message:"Failed to export backup"}finally{this._loading=!1}}async _onFileSelected(t){var s;const e=t.target,i=(s=e.files)==null?void 0:s[0];if(!(!i||!this.hass)){e.value="";try{this._loading=!0,this._error="";const a=await i.text();let o;try{o=JSON.parse(a)}catch{await this.dialog.showAlert("Invalid Backup File","The selected file is not valid JSON.");return}if(!o||typeof o!="object"||!o.areas||typeof o.areas!="object"){await this.dialog.showAlert("Invalid Backup File","This file does not appear to be a valid Twilight backup structure.");return}const r=Object.keys(o.areas).length;if(!await this.dialog.showConfirm("Restore Backup",`This will replace ALL areas and global settings with the contents of this backup file (${r} area(s)). Areas not included in this file will be deleted. This action cannot be undone.

Are you sure you want to proceed?`))return;await wa(this.hass,o),await this.dialog.showAlert("Restore Complete","Backup restored successfully. The panel will now reload."),window.location.reload()}catch(a){this._error=a instanceof Error?a.message:"Failed to restore backup"}finally{this._loading=!1}}}async _onFactoryReset(){if(!this.hass)return;if(this.isDraftDirty){await this.dialog.showAlert("Unsaved Changes","Please save or discard your unsaved settings changes before performing a factory reset.");return}if(await this.dialog.showConfirm("Factory Reset Configuration",`⚠️ DANGER: This will delete ALL areas and reset all settings to system defaults.

This action cannot be undone. Are you sure you want to delete all areas and reset Twilight?`))try{this._loading=!0,this._error="",await wa(this.hass,{twilight_backup_version:1,areas:{},global:{}}),await this.dialog.showAlert("Factory Reset Complete","All areas and settings have been reset to factory defaults. The panel will now reload."),window.location.reload()}catch(e){this._error=e instanceof Error?e.message:"Failed to reset configuration"}finally{this._loading=!1}}render(){return this.open?n`
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
    `:n``}};ce.styles=[Tt,I`
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
    `],Ie([p({type:Object})],ce.prototype,"hass",2),Ie([p({type:Boolean})],ce.prototype,"open",2),Ie([p({type:Boolean})],ce.prototype,"isDraftDirty",2),Ie([b()],ce.prototype,"_loading",2),Ie([b()],ce.prototype,"_error",2),ce=Ie([M("twilight-backup-restore-dialog")],ce);var _r=Object.defineProperty,yr=Object.getOwnPropertyDescriptor,St=(t,e,i,s)=>{for(var a=s>1?void 0:s?yr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=(s?r(e,i,a):r(a))||a);return s&&a&&_r(e,i,a),a};let pt=class extends L{constructor(){super(...arguments),this.hass=null,this._hasLoaded=!1,this._todayData=null,this._selectedChannelId="",this._slotEditOpen=!1,this._editingSlotId=null,this._resetDialogOpen=!1,this._backupDialogOpen=!1,this._systemDefaults=null,this._placeholderDefaults=null,this._resetNodes=[],this._calculatedSlotTimes=[],this._slotTimesRequestId=0,this._dialog=new be(this),this._draftController=new Sa(this,{onSave:async t=>{this.hass&&(await Zs(this.hass,t),this.dispatchEvent(new CustomEvent("global-changed",{detail:t,bubbles:!0,composed:!0})))}})}updated(t){t.has("hass")&&this.hass&&!this._hasLoaded&&(this._hasLoaded=!0,this._loadData())}async _loadData(){if(this.hass){this._draftController.loading=!0,this.requestUpdate();try{const[t,e,i]=await Promise.all([ya(this.hass),Je(this.hass).catch(()=>null),Ii(this.hass).catch(()=>null)]);this._draftController.init(t||{}),this._todayData=(e==null?void 0:e.day_data)||null,this._placeholderDefaults=i,this._selectFirstChannel(),await this._loadCalculatedSlotTimes()}catch(t){console.error("Failed to load global config:",t)}finally{this._draftController.loading=!1,this.requestUpdate()}}}async _loadCalculatedSlotTimes(){var a,o;if(!this.hass)return;const e=(((o=(a=this._draftController.draft)==null?void 0:a.area_template)==null?void 0:o.custom_channels)||{})[this._selectedChannelId],i=(e==null?void 0:e.slots)||[];if(i.length===0){this._calculatedSlotTimes=[];return}const s=++this._slotTimesRequestId;try{const r=await zi(this.hass,{slots:i});if(s!==this._slotTimesRequestId)return;this._calculatedSlotTimes=r.slots}catch(r){console.warn("Failed to load slot time preview:",r),s===this._slotTimesRequestId&&(this._calculatedSlotTimes=[])}}_selectFirstChannel(){var i,s;const t=((s=(i=this._draftController.draft)==null?void 0:i.area_template)==null?void 0:s.custom_channels)||{},e=Object.keys(t).sort();e.length>0?(!this._selectedChannelId||!t[this._selectedChannelId])&&(this._selectedChannelId=e[0]):this._selectedChannelId=""}async _saveSettings(){await this._draftController.save()}_cancelChanges(){this._draftController.cancel()}async _resetToSystemDefaults(){var t,e,i,s;if(this.hass)try{const a=await Qs(this.hass);this._systemDefaults=a;const o=[{id:"template_inputs",label:"Area Template: Inputs",children:(((t=a.area_template)==null?void 0:t.inputs)||[]).map(r=>({id:`template_inputs:${r.id}`,label:`${r.type} — ${r.activity}`}))},{id:"template_activities",label:"Area Template: Activities",children:(((e=a.area_template)==null?void 0:e.activities)||[]).map(r=>({id:`template_activities:${r.id}`,label:r.id}))},{id:"template_channels",label:"Area Template: Custom Channels",children:Object.entries(((i=a.area_template)==null?void 0:i.custom_channels)||{}).map(([r,l])=>({id:`template_channels:${r}`,label:l.name||r}))},{id:"template_rules",label:"Area Template: Rules",children:(((s=a.area_template)==null?void 0:s.rules)||[]).map(r=>({id:`template_rules:${r.id}`,label:r.name||r.id}))}];this._resetNodes=o,this._resetDialogOpen=!0,this.requestUpdate()}catch(a){console.error("Failed to load system defaults:",a)}}_executeReset(t){if(!this._systemDefaults||!this._draftController.draft)return;const e=new Set(t.detail.selectedIds),i=this._systemDefaults;this._draftController.update(s=>{var d,u,v,y,k,x,_,C,D;const a=e.has("template_inputs"),o=((d=i.area_template)==null?void 0:d.inputs)||[];if(a)s.area_template||(s.area_template={}),s.area_template.inputs=structuredClone(o);else{const $=[...((u=s.area_template)==null?void 0:u.inputs)||[]];o.forEach(w=>{if(e.has(`template_inputs:${w.id}`)){const S=$.findIndex(m=>m.id===w.id);S>=0?$[S]=structuredClone(w):$.push(structuredClone(w))}}),s.area_template||(s.area_template={}),s.area_template.inputs=$}const r=e.has("template_activities"),l=((v=i.area_template)==null?void 0:v.activities)||[];if(r)s.area_template||(s.area_template={}),s.area_template.activities=structuredClone(l);else{const $=[...((y=s.area_template)==null?void 0:y.activities)||[]];l.forEach(w=>{if(e.has(`template_activities:${w.id}`)){const S=$.findIndex(m=>m.id===w.id);S>=0?$[S]=structuredClone(w):$.push(structuredClone(w))}}),s.area_template||(s.area_template={}),s.area_template.activities=$}const c=e.has("template_channels"),f=((k=i.area_template)==null?void 0:k.custom_channels)||{};if(c){const $={...((x=s.area_template)==null?void 0:x.custom_channels)||{}};Object.keys($).forEach(w=>{delete $[w]}),Object.entries(f).forEach(([w,S])=>{$[w]=structuredClone(S)}),s.area_template||(s.area_template={}),s.area_template.custom_channels=$}else{const $={...((_=s.area_template)==null?void 0:_.custom_channels)||{}};Object.keys(f).forEach(w=>{e.has(`template_channels:${w}`)&&($[w]=structuredClone(f[w]))}),s.area_template||(s.area_template={}),s.area_template.custom_channels=$}const h=e.has("template_rules"),g=((C=i.area_template)==null?void 0:C.rules)||[];if(h)s.area_template||(s.area_template={}),s.area_template.rules=structuredClone(g);else{const $=[...((D=s.area_template)==null?void 0:D.rules)||[]];g.forEach(w=>{if(e.has(`template_rules:${w.id}`)){const S=$.findIndex(m=>m.id===w.id);S>=0?$[S]=structuredClone(w):$.push(structuredClone(w))}}),s.area_template||(s.area_template={}),s.area_template.rules=$}}),this._resetDialogOpen=!1,this._selectFirstChannel(),this.requestUpdate()}_onTemplateInputsChanged(t){this._draftController.update(e=>{e.area_template||(e.area_template={}),e.area_template.inputs=t.detail.inputs})}_onTemplateActivitiesChanged(t){this._draftController.update(e=>{e.area_template||(e.area_template={}),e.area_template.activities=t.detail.activities})}_onTemplateSensorsChanged(t){this._draftController.update(e=>{e.area_template||(e.area_template={}),e.area_template.sensors=t.detail})}_onTemplateRulesChanged(t){this._draftController.update(e=>{e.area_template||(e.area_template={}),e.area_template.rules=t.detail})}_onTemplateChannelSelected(t){this._selectedChannelId=t.detail.channelId,this._loadCalculatedSlotTimes()}async _onTemplateChannelAdded(t){var o;const e=this._draftController.draft;if(!e)return;const i=t.detail.name.trim();if(!i)return;const s=i.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"");if(!s)return;const a={...((o=e.area_template)==null?void 0:o.custom_channels)||{}};if(a[s]){await this._dialog.showAlert("Channel already exists",`A channel named "${i}" already exists.`);return}a[s]={name:i,enabled:!0,slots:[]},this._draftController.update(r=>{r.area_template||(r.area_template={}),r.area_template.custom_channels=a}),this._selectedChannelId=s,this._loadCalculatedSlotTimes()}_onTemplateChannelRenamed(t){var r;const e=this._draftController.draft;if(!e)return;const{channelId:i,name:s}=t.detail,a={...((r=e.area_template)==null?void 0:r.custom_channels)||{}},o=a[i];o&&(a[i]={...o,name:s},this._draftController.update(l=>{l.area_template||(l.area_template={}),l.area_template.custom_channels=a}))}_onTemplateChannelDeleted(t){var a;const e=this._draftController.draft;if(!e)return;const{channelId:i}=t.detail,s={...((a=e.area_template)==null?void 0:a.custom_channels)||{}};delete s[i],this._draftController.update(o=>{o.area_template||(o.area_template={}),o.area_template.custom_channels=s}),this._selectFirstChannel(),this._loadCalculatedSlotTimes()}_onTemplateChannelToggled(t){var r;const e=this._draftController.draft;if(!e)return;const{channelId:i,enabled:s}=t.detail,a={...((r=e.area_template)==null?void 0:r.custom_channels)||{}},o=a[i];o&&(a[i]={...o,enabled:s},this._draftController.update(l=>{l.area_template||(l.area_template={}),l.area_template.custom_channels=a}))}_onTemplateSlotsChanged(t){var l;const e=this._draftController.draft;if(!e)return;let i=this._selectedChannelId;const s={...((l=e.area_template)==null?void 0:l.custom_channels)||{}};if(!i||!s[i]){const c=Object.keys(s);c.length>0&&(i=c[0],this._selectedChannelId=i)}const a=s[i];if(!a)return;const o=a.slots||[],r=t.detail.slots.map(c=>{const f=o.find(g=>g.id===c.id),h=c.startType==="fixed";return{id:c.id,name:c.label,start_type:h?"fixed":"astral",zone:h?null:Fs(c),fixed_time:h?c.fixedStartTime||"00:00":null,offset_minutes:c.startOffset||0,scene_entity_id:c.scene,configured_entities:(f==null?void 0:f.configured_entities)||[]}});s[i]={...a,slots:r,...t.detail.transitionOnSeconds!==void 0?{transition_on_seconds:t.detail.transitionOnSeconds}:{}},this._draftController.update(c=>{c.area_template||(c.area_template={}),c.area_template.custom_channels=s}),this._loadCalculatedSlotTimes()}render(){var o,r,l,c,f,h,g,d,u,v,y,k,x,_,C,D,$,w;const t=((r=(o=this._draftController.draft)==null?void 0:o.area_template)==null?void 0:r.custom_channels)||{};let e=this._selectedChannelId;(!e||!t[e])&&Object.keys(t).length>0&&(e=Object.keys(t).sort()[0]);const i=t[e],s=(i==null?void 0:i.slots)||[],a=this._calculatedSlotTimes.length>0?Be(this._calculatedSlotTimes,s).map(S=>({...S,color:"#8e44ad",isCustom:!0})):s.map(S=>{const m=S.start_type==="fixed";return{id:S.id,label:S.name||S.id,color:"#8e44ad",from:0,to:0,scene:S.scene_entity_id||null,isCustom:!0,startType:m?"fixed":"astral",startEvent:m?void 0:S.zone||void 0,startOffset:S.offset_minutes||0,fixedStartTime:m&&S.fixed_time||void 0}});return n`
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
                .activities=${(((h=(f=this._draftController.draft)==null?void 0:f.area_template)==null?void 0:h.activities)??[]).map(S=>S.id)}
                .placeholderDefaults=${this._placeholderDefaults}
                .templateMode=${!0}
                @inputs-changed=${this._onTemplateInputsChanged}
              ></twilight-inputs-card>
            </div>

            <!-- Template: Activities -->
            <div class="span-6">
              <twilight-activities-card
                .hass=${this.hass}
                .config=${((d=(g=this._draftController.draft)==null?void 0:g.area_template)==null?void 0:d.activities)??[]}
                .inputs=${((v=(u=this._draftController.draft)==null?void 0:u.area_template)==null?void 0:v.inputs)??[]}
                .placeholderDefaults=${this._placeholderDefaults}
                .templateMode=${!0}
                @activities-changed=${this._onTemplateActivitiesChanged}
              ></twilight-activities-card>
            </div>

            <!-- Left Column: Sensors & Rules stacked -->
            <div class="span-6" style="display: flex; flex-direction: column; gap: 16px;">
              <twilight-sensors-card
                .hass=${this.hass}
                .config=${((k=(y=this._draftController.draft)==null?void 0:y.area_template)==null?void 0:k.sensors)??[]}
                .templateMode=${!0}
                @sensors-changed=${this._onTemplateSensorsChanged}
              ></twilight-sensors-card>

              <twilight-rules-card
                .hass=${this.hass}
                .rules=${((_=(x=this._draftController.draft)==null?void 0:x.area_template)==null?void 0:_.rules)??[]}
                .inputsConfig=${((D=(C=this._draftController.draft)==null?void 0:C.area_template)==null?void 0:D.inputs)??[]}
                .activitiesConfig=${((w=($=this._draftController.draft)==null?void 0:$.area_template)==null?void 0:w.activities)??[]}
                .channels=${t}
                .placeholderDefaults=${this._placeholderDefaults}
                .templateMode=${!0}
                @rules-changed=${this._onTemplateRulesChanged}
              ></twilight-rules-card>
            </div>

            <!-- Right Column: Timetable spanning full height -->
            <div class="span-6">
              <twilight-timetable-card
                .hass=${this.hass}
                .slots=${a}
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
          ${this._draftController.isDirty?n`
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
        .slots=${a}
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
    `}};pt.styles=[Mi,Pi,Da,I`
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
  `],St([p({attribute:!1})],pt.prototype,"hass",2),St([b()],pt.prototype,"_hasLoaded",2),St([b()],pt.prototype,"_todayData",2),St([b()],pt.prototype,"_selectedChannelId",2),St([b()],pt.prototype,"_slotEditOpen",2),St([b()],pt.prototype,"_editingSlotId",2),St([b()],pt.prototype,"_resetDialogOpen",2),St([b()],pt.prototype,"_backupDialogOpen",2),St([b()],pt.prototype,"_systemDefaults",2),St([b()],pt.prototype,"_placeholderDefaults",2),St([b()],pt.prototype,"_resetNodes",2),St([b()],pt.prototype,"_calculatedSlotTimes",2),pt=St([M("twilight-settings-view")],pt);var wr=Object.getOwnPropertyDescriptor,$r=(t,e,i,s)=>{for(var a=s>1?void 0:s?wr(e,i):e,o=t.length-1,r;o>=0;o--)(r=t[o])&&(a=r(a)||a);return a};const kr=[{id:"areas",label:"Areas",icon:"⌂"},{id:"timeline",label:"Timeline",icon:"☀"},{id:"analytics",label:"Analytics",icon:"◈"},{id:"settings",label:"Settings",icon:"⚙"}];return ze.TwilightPanel=class extends ve{constructor(){super(),this.tabs=kr}},ze.TwilightPanel=$r([M("twilight-panel")],ze.TwilightPanel),Object.defineProperty(ze,Symbol.toStringTag,{value:"Module"}),ze})({});
