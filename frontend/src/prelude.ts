// Guard against double-registration when this bundle is (re-)injected (HMR,
// panel re-load) — scoped to Twilight's own elements only, so a genuine
// collision from an unrelated card/integration still throws natively.
const originalDefine = customElements.define;
customElements.define = function (name, constructor, options) {
  if (name.startsWith('twilight-') && customElements.get(name)) {
    console.warn(`[Twilight] Custom element ${name} is already defined.`);
    return;
  }
  originalDefine.call(customElements, name, constructor, options);
};
