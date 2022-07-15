import { MqttClient, connect, OnMessageCallback, OnConnectCallback } from 'mqtt'

export class Mosquitto{
    private readonly client: MqttClient;
    private callbackList: { [topic: string]: OnMessageCallback[] } = {};

    constructor(host: string, onConnected: OnConnectCallback, username: string | undefined = undefined, password: string | undefined = undefined) {
        if (username !== undefined && password !== undefined) {
            this.client = connect(host, { username, password })
        } else {
            this.client = connect(host)
        }

        this.client.on('connect', packet => {
            console.log('Mqtt connected');
            onConnected(packet);
        })

        this.client.on('message', (topic, payload, packet) => {
            if (this.callbackList[topic] == undefined) return;
            this.callbackList[topic].forEach(value => {
                value(topic, payload, packet);
            })
        });
    }

    public subscribe(topic: string, callback: OnMessageCallback) {
        if (this.callbackList[topic] == undefined) {
            this.client.subscribe(topic);
            this.callbackList[topic] = []
        }

        this.callbackList[topic].push(callback);
    }
}