import { get, writable, Writable } from 'svelte/store'

import API from '../api';

import Button from '../../ui/components/Button.svelte';
import Text from '../../ui/components/Text.svelte';

import ButtonSchema from './schemas/button.json';
import TextSchema from './schemas/text.json';

/**
 * Supported schemas
 */
const schemas = {
    button: ButtonSchema,
    text: TextSchema
};

/**
 * Supported components
 */
const components = {
    Button,
    Text,
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
        parameters: string;
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
    component: string;
    content: string;
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
    public version: string;
    public modules: PluginModule[];
    public state: Writable<Object>;
    public events: ModuleEvents;

    constructor(plugin: IPlugin) {
        // Validate plugin semantics
        this.validate(plugin);

        // Extract and set events
        this.events = this.setEvents(plugin);

        // Initialise plugin state
        this.state = this.setState(plugin);

        this.version = plugin.version;
        this.modules = plugin.modules.map((item: PluginModule) => this.mapModule(item));
    }

    /**
     * @method setEvents
     * 
     * @param {IPlugin} plugin
     * 
     * @returns {void} 
     */
    private setEvents(plugin: IPlugin): ModuleEvents {
        const events: ModuleEvents = {};

        plugin.modules.forEach((module: PluginModule) => {
            const moduleDefinedProperties = schemas[module.id].properties;

            const supportedEvents = Object.keys(moduleDefinedProperties)
                .filter((prop: string) => moduleDefinedProperties[prop].type === 'event');

            if (supportedEvents.length) {
                supportedEvents.forEach((event: string) => {
                    // Check if event is present in plugin json
                    if (event in module) {
                        events[module.id] = {
                            [event as AllowedEvents]: module[event]
                        }
                    }
                });
            }
        });

        return events;
    }

    /**
     * Sets up module state
     * 
     * @method setState
     * 
     * @param {IPlugin} plugin
     * 
     * @returns {Writable<Object>} 
     */
    private setState(plugin: IPlugin): Writable<Object> {
        const state = plugin.modules.reduce((acc, module: PluginModule): any => {
            if (module.id in this.events) {
                const eventsForThisModule = this.events[module.id];

                Object.keys(eventsForThisModule).forEach((event) => {
                    if (eventsForThisModule[event].parameters) {
                        const regex = new RegExp(/[^{\}]+(?=})/g);

                        const params = eventsForThisModule[event].parameters.match(regex).map((param) => param.trim());

                        params.forEach((param) => {
                            acc = Object.assign({}, acc, {
                                [module.id]: {
                                    [eventsForThisModule[event].call]: {
                                        [param]: null
                                    }
                                }
                            });
                        });


                    }
                })
            }

            return acc;
        }, {});

        return writable(state);
    }

    /**
     * @param {IPlugin} plugin 
     */
    private validate(plugin: IPlugin) {
        // TODO(laumair): Also, validate schema enums
        plugin.modules.forEach((module: PluginModule) => {
            const requiredProperties: string[] = schemas[module.id].required;

            const providedProperties: string[] = Object.keys(module);

            if (!requiredProperties.every((prop: string) => providedProperties.includes(prop))) {
                throw new Error(`Missing properties for component ${module.component}`);
            }
        });

    }

    /**
     * @method mapModule
     * 
     * @param {PluginModule} module 
     */
    private mapModule(module: PluginModule) {
        if (!(module.component in components)) {
            throw new Error(`Plugin ${module.id}: unknown component ${module.component}`)
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
            component: components[module.component],
            children: module.children ? module.children.map((child) => this.mapModule(child)) : [],
            events
        }
    }
}
