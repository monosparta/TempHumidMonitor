import { Server } from "socket.io";
import { Core } from "..";

// Type Declared in https://socket.io/docs/v4/typescript/
interface ServerToClientEvents {
    update: any;
}

interface ClientToServerEvents {
    message: (data: any) => void;
}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    name: string;
    age: number;
}

export class Socket {
    private readonly io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
    private lastData: { temp: number, humid: number, time: string } = {
        temp: 0,
        humid: 0,
        time: ""
    };
    /**
     * Socket.io Server
     * @param core App Core Instance
     */
    constructor(core: Core) {
        this.io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(core.server.server);

        // Store last data
        core.mqtt.subscribe(core.config.mqtt.topic, (_, payload) => {
            const data = JSON.parse(payload.toString());
            this.lastData = { temp: data.Temperature, humid: data.Humidity, time: data.Time }
        })

        // On client connected to server via websocket
        this.io.on('connection', socket => {
            socket.on('disconnect', () => { });

            // Send last data to client
            socket.emit("update", this.lastData);

            // Send mqtt message to websocket
            core.mqtt.subscribe(core.config.mqtt.topic, (_, payload) => {
                const data = JSON.parse(payload.toString());
                socket.emit("update", { temp: data.Temperature, humid: data.Humidity, time: data.Time });
            })
        })
    }
}
