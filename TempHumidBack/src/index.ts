import { SqliteDatabase } from "./Components/SqliteDatabase";
import { Mosquitto } from "./Components/Mosquitto";
import { OnMessageCallback } from "mqtt";
import { Config } from "./Core/Config";
import { Socket } from "./Components/Socket";
import { ExpressServer } from "./Components/ExpressServer";

export class Core {
    private _db: SqliteDatabase;
    private _mqtt: Mosquitto;
    private _config = new Config();

    /**
     * App Core
     */
    constructor() {
        // init database
        this._db = new SqliteDatabase(this.config.db.file);

        // save to database
        const onMqttMessage: OnMessageCallback = (_, payload) => {
            const data = JSON.parse(payload.toString());
            this.db.insert(data.Temperature, data.Humidity, data.Time);
        }

        // mqtt connected
        const onMqttConnected = () => {
            this.mqtt.subscribe(this.config.mqtt.topic, onMqttMessage);
        }

        // set up mqtt
        this._mqtt = new Mosquitto(this.config.mqtt.host, onMqttConnected, this.config.mqtt.username, this.config.mqtt.password);

        // set up websocket
        new Socket(this);

        // set up express
        new ExpressServer(this);
    }

    /**
     * MQTT Client
     */
    public get mqtt() {
        return this._mqtt;
    }

    /**
     * App CConfig
     */
    public get config() {
        return this._config;
    }

    /**
     * SQLite3 Client
     */
    public get db() {
        return this._db;
    }
}

new Core();