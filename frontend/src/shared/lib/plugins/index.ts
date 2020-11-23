import { get, writable, Writable } from 'svelte/store'

import API from '../api';

import {
    Box,
    Button,
    Illustration,
    Link,
    Logo,
    Text
} from '../../components';

import {
    Box as BoxSchema,
    Button as ButtonSchema,
    Illustration as IllustrationSchema,
    Link as LinkSchema,
    Logo as LogoSchema,
    Text as TextSchema
} from '../plugins/schemas';

/**
 * Supported schemas
 */
const schemas = {
    box: BoxSchema,
    button: ButtonSchema,
    illustration: IllustrationSchema,
    link: LinkSchema,
    logo: LogoSchema,
    text: TextSchema
};

/**
 * Supported components
 */
const components = {
    box: Box,
    button: Button,
    illustration: Illustration,
    link: Link,
    logo: Logo,
    text: Text,
};

/**
 * Allowed events
 */
type AllowedEvents = 'click'

/**
 * Single module event
 */
type ModuleEvent = {
    [key in AllowedEvents]: {
        call: string;
        assignTo: string;
        parameters?: string;
    }
};

/**
 * Module event props
 */
type ModuleEvents = {
    [key: string]: ModuleEvent;
};

/**
 * Plugin module interface
 */
interface PluginModule {
    id: string;
    schemaRef: string;
    content?: string;
    children?: PluginModule[];
};

/**
 * Plugin interface
 */
interface IPlugin {
    version: string;
    modules: PluginModule[];
};

export default class Plugin implements IPlugin {
    /** Plugin version */
    public version: string;

    /** Plugin modules */
    public modules: PluginModule[];

    /** Plugin state */
    public state: Writable<Object>;

    /** Plugin events (click, change etc) */
    public events: ModuleEvents;

    constructor(plugin: IPlugin) {
        // Validate plugin semantics
        this.validate(plugin);

        // Initialise plugin state
        this.state = writable({});

        // Extract and set events
        plugin.modules.forEach((module: PluginModule) => {
            this.setEvents(module);
            this.setState(module);
        });


        this.version = plugin.version;
        this.modules = plugin.modules.map((item: PluginModule) => this.mapModule(item));
    }

    /**
     * @method setEvents
     * 
     * @param {PluginModule} module
     * 
     * @returns {void} 
     */
    private setEvents(module: PluginModule): void {
        const moduleDefinedProperties = schemas[module.schemaRef].properties;

        const supportedEvents = Object.keys(moduleDefinedProperties)
            .filter((prop: string) => moduleDefinedProperties[prop].type === 'event');

        if (supportedEvents.length) {
            supportedEvents.forEach((event: string) => {
                // Check if event is present in plugin json
                if (event in module) {
                    this.events = Object.assign({}, this.events, {
                        [module.id]: {
                            [event as AllowedEvents]: module[event]
                        }
                    })
                }
            });
        }

        if (module.children) {
            module.children.forEach((child: PluginModule) => this.setEvents(child));
        }
    }

    /**
     * Sets up module state
     * 
     * @method setState
     * 
     * @param {PluginModule} plugin
     * 
     * @returns {Writable<Object>} 
     */
    private setState(module: PluginModule) {
        if (module.id in this.events) {
            const eventsForThisModule = this.events[module.id];

            Object.keys(eventsForThisModule).forEach((event) => {
                if (eventsForThisModule[event].parameters) {
                    const regex = new RegExp(/[^{\}]+(?=})/g);

                    const params = eventsForThisModule[event].parameters.match(regex).map((param) => param.trim());

                    params.forEach((param) => {
                        this.state.update((state) => {
                            return Object.assign({}, state, {
                                [module.id]: {
                                    [eventsForThisModule[event].call]: {
                                        [param]: null
                                    }
                                }
                            });
                        });
                    });
                }
            })
        }

        if (module.children) {
            module.children.forEach((child: PluginModule) => this.setState(child));
        }
    }

    /**
     * Validates plugin semantics
     * 
     * @method validate
     * 
     * @param {IPlugin} plugin 
     * 
     * @returns {void}
     */
    private validate(plugin: IPlugin) {
        // TODO(laumair): Also, validate schema enums
        // plugin.modules.forEach((module: PluginModule) => {
        //     const requiredProperties: string[] = schemas[module.id].required;

        //     const providedProperties: string[] = Object.keys(module);

        //     if (!requiredProperties.every((prop: string) => providedProperties.includes(prop))) {
        //         throw new Error(`Missing properties for component ${module.component}`);
        //     }
        // });

    }

    /**
     * @method mapModule
     * 
     * @param {PluginModule} module 
     */
    private mapModule(module: PluginModule) {
        if (!(module.schemaRef in components)) {
            throw new Error(`Plugin ${module.id}: unknown component ${module.schemaRef}`)
        }

        const events = {}

        if (module.id in this.events) {
            const eventsForThisModule = this.events[module.id];

            for (const event in eventsForThisModule) {
                const { call, assignTo } = eventsForThisModule[event];

                events[event] = () => {
                    const state = get(this.state);
                    const params = module.id in state ? state[module.id][call] : []

                    API[call](module.id, params).then((result) => {
                        if (assignTo) {
                            this.state.update(s => ({
                                ...s,
                                [assignTo]: result
                            }))
                        }
                    });
                };
            }
        }

        return {
            ...module,
            component: components[module.schemaRef],
            children: module.children ? module.children.map((child) => this.mapModule(child)) : [],
            events
        }
    }
}
