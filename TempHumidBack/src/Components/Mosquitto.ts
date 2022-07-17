import { MqttClient, connect, OnMessageCallback, OnConnectCallback } from 'mqtt'

export class Mosquitto{
    private readonly client: MqttClient;
    private callbackList: { [topic: string]: OnMessageCallback[] } = {};

    /**
     * Setup MQTT client
     * @param host Broker host
     * @param onConnected Called when the MQTT Broker is connected
     * @param username [Optional] MQTT Broker username
     * @param password [Optional] MQTT Broker password
     */
    constructor(host: string, onConnected: OnConnectCallback, username: string | undefined = undefined, password: string | undefined = undefined) {
        // mqtt connect broker
        if (username !== undefined && password !== undefined) {
            this.client = connect(host, { username, password })
        } else {
            this.client = connect(host)
        }

        // mqtt connected
        this.client.on('connect', packet => {
            console.log('Mqtt connected');
            onConnected(packet);
        })

        // emit subscribed functions
        this.client.on('message', (topic, payload, packet) => {
            if (this.callbackList[topic] == undefined) return;

            this.callbackList[topic].forEach(value => {
                value(topic, payload, packet);
            })
        });
    }

    /**
     * Subscribe and register functions
     * @param topic Topic
     * @param callback Called when message sent to topic
     */
    public subscribe(topic: string, callback: OnMessageCallback) {
        if (this.callbackList[topic] == undefined) {
            this.client.subscribe(topic);
            this.callbackList[topic] = []
        }

        this.callbackList[topic].push(callback);
    }
}