import { Server } from "socket.io";
import { Core } from "..";

// Declared in https://socket.io/docs/v4/typescript/
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
    private readonly io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();

    constructor(core: Core) {
        this.io.on('connection', socket => {
            socket.on('disconnect', () => { });

            // mqtt to ws
            core.mqtt.subscribe(core.config.mqtt.topic, (_, payload) => {
                const data = JSON.parse(payload.toString());
                socket.emit("update", { temp: data.Temperature, humid: data.Humidity, time: data.Time });
            })
        })
    }
}
