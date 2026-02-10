interface BetopiaERPModuleErrors {
    cycle?: string | null;
    failed?: Set<string>;
    missing?: Set<string>;
    unloaded?: Set<string>;
}

interface BetopiaERPModuleFactory {
    deps: string[];
    fn: BetopiaERPModuleFactoryFn;
    ignoreMissingDeps: boolean;
}

class BetopiaERPModuleLoader {
    bus: EventTarget;
    checkErrorProm: Promise<void> | null;
    debug: boolean;
    /**
     * Mapping [name => factory]
     */
    factories: Map<string, BetopiaERPModuleFactory>;
    /**
     * Names of failed modules
     */
    failed: Set<string>;
    /**
     * Names of modules waiting to be started
     */
    jobs: Set<string>;
    /**
     * Mapping [name => module]
     */
    modules: Map<string, BetopiaERPModule>;

    constructor(root?: HTMLElement);

    addJob: (name: string) => void;

    define: (
        name: string,
        deps: string[],
        factory: BetopiaERPModuleFactoryFn,
        lazy?: boolean
    ) => BetopiaERPModule;

    findErrors: (jobs?: Iterable<string>) => BetopiaERPModuleErrors;

    findJob: () => string | null;

    reportErrors: (errors: BetopiaERPModuleErrors) => Promise<void>;

    sortFactories: () => void;

    startModule: (name: string) => BetopiaERPModule;

    startModules: () => void;
}

type BetopiaERPModule = Record<string, any>;

type BetopiaERPModuleFactoryFn = (require: (dependency: string) => BetopiaERPModule) => BetopiaERPModule;

declare const betopiaerp: {
    csrf_token: string;
    debug: string;
    define: BetopiaERPModuleLoader["define"];
    loader: BetopiaERPModuleLoader;
};
