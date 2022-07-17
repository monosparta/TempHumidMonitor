import { existsSync, readFileSync, writeFileSync } from 'fs';

export class Config{
    private _mqtt: { host: string, topic: string, username: string | undefined, password: string | undefined };
    private _web: { port: number };
    private _db: { file: string };

    /**
     * Config Core
     */
    constructor() {
        console.log('Reading config...');

        const mqttDefault = { host: 'mqtt://localhost:1883', topic: 'THP/DATA', username: '', password: '' };
        const webDefault = { port: 80 };
        const dbDefault = { file: 'data.sqlite' };

        if (existsSync('./config.json')) {
            const config = JSON.parse(readFileSync('config.json', { encoding: 'utf-8' }));

            // load from config file or default config
            if (!config.mqtt) config.mqtt = {};
            this._mqtt = {
                host: (config.mqtt.host) ? config.mqtt.host : mqttDefault.host,
                topic: (config.mqtt.topic) ? config.mqtt.topic : mqttDefault.topic,
                username: (config.mqtt.username) ? config.mqtt.username : mqttDefault.username,
                password: (config.mqtt.password) ? config.mqtt.password : mqttDefault.password
            }

            if (!config.web) config.web = {};
            this._web = {
                port: (config.web.port) ? config.web.port : webDefault.port
            }

            if (!config.db) config.db = {};
            this._db = {
                file: (config.db.file) ? config.db.file : dbDefault.file
            }

            // sync config file
            this.write();
        } else {
            this._mqtt = mqttDefault;
            this._web = webDefault;
            this.write();
            console.log('Empty config.json generated. Fill your config and try again.');
            process.exit(1);
        }
    }

    /**
     * Write to Config File
     */
    private write() {
        const json = JSON.stringify({
            mqtt: this._mqtt,
            web: this._web
        }, null, 4);
        writeFileSync('./config.json', json, 'utf8');
    }

    /**
     * MQTT Config
     */
    public get mqtt() {
        return this._mqtt;
    }

    /**
     * Web Config
     */
    public get web() {
        return this._web;
    }

    /**
     * Database Config
     */
    public get db() {
        return this._db;
    }
}
