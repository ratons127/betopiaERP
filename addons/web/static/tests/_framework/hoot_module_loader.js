// @betopiaerp-module ignore
// ! WARNING: this module must be loaded after `module_loader` but cannot have dependencies !

(function (betopiaerp) {
    "use strict";

    if (betopiaerp.define.name.endsWith("(hoot)")) {
        return;
    }

    const name = `${betopiaerp.define.name} (hoot)`;
    betopiaerp.define = {
        [name](name, dependencies, factory) {
            return betopiaerp.loader.define(name, dependencies, factory, !name.endsWith(".hoot"));
        },
    }[name];
})(globalThis.betopiaerp);
