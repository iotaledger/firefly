import { get, writable, Writable } from 'svelte/store'

import API from '../api';

import Button from '../../ui/components/Button.svelte';

/**
 * Supported components
 */
const components = {
    Button,
};

/**
 * Allowed events
 */
type AllowedEvents = 'click'

/**
 * Plugin event props
 */
type PluginEvent = {
    [key in AllowedEvents]: {
        call: string;
        assignTo: string;
        parameters: string;
    }
};

/**
 * Plugin module interface
 */
interface PluginModule {
    id: string;
    component: string;
    content: string;
    events?: PluginEvent;
    children?: PluginModule[];
    props?: any;
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

    public events: Object;

    constructor(plugin: IPlugin) {
        // Validate plugin semantics
        this.validate(plugin);

        // Initialise plugin state
        this.state = this.setState(plugin);

        this.version = plugin.version;
        this.modules = plugin.modules.map((item: PluginModule) => this.mapModule(item));
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
        const state = plugin.modules.reduce((acc, item: PluginModule): any => {
            if (item.events) {
                Object.keys(item.events).forEach((event) => {
                    if (item.events[event].parameters) {
                        const regex = new RegExp(/[^{\}]+(?=})/g);

                        const params = item.events[event].parameters.match(regex).map((param) => param.trim());

                        params.forEach((param) => {
                            acc = Object.assign({}, acc, {
                                [item.id]: {
                                    [item.events[event].call]: {
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
    private validate(plugin: IPlugin) { }

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

        if (module.events) {
            for (const event in module.events) {
                const { call, assignTo } = module.events[event];

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
            children: module.children && module.children.map(this.mapModule),
            events
        }
    }
}
