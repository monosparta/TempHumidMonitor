import { Config } from "./Core/Config";

export class Core {
    private _config = new Config();

    constructor() {

    }

    public get config() {
        return this._config;
    }

}

new Core();