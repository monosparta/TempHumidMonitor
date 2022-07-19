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

    /**
     * Socket.io Server
     * @param core App Core Instance
     */
    constructor(core: Core) {
        this.io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(core.server.server);
        // On client connected to server via websocket
        this.io.on('connection', socket => {
            socket.on('disconnect', () => { });

            // Send mqtt message to websocket
            core.mqtt.subscribe(core.config.mqtt.topic, (_, payload) => {
                const data = JSON.parse(payload.toString());
                socket.emit("update", { temp: data.Temperature, humid: data.Humidity, time: data.Time });
            })
        })
    }
}
