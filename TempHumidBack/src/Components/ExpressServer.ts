import express from 'express';
import cors from 'cors';
import { Core } from '..';
import { createServer } from 'http'

export class ExpressServer
{
    private app = express();
    private _server = createServer(this.app)

    /**
     * Express.js Server
     * @param core App Core Instance
     */
    constructor(core: Core) {
        const allowedOrigins = ['http://localhost:3000/', 'http://192.168.168.113', 'http://mono202207-temp-humid.herokuapp.com/']
        this.app.use(cors({
            origin: function (origin, callback) {
                // allow requests with no origin 
                // (like mobile apps or curl requests)
                if (!origin) return callback(null, true);
                if (allowedOrigins.indexOf(origin) === -1) {
                    const msg = 'The CORS policy for this site does not ' +
                        'allow access from the specified Origin.';
                    return callback(new Error(msg), false);
                }
                return callback(null, true);
            }
        }))
        
        // Get data from last 24 hours and average by hour
        this.app.get('/api/getLast24Hours', (req, res) => {
            const now = new Date();
            core.db.getHourAvgDataFromTime(
                new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, now.getHours() + 1, 0, 0),
            ).then(value => {
                res.json(value);
            });
        })

        // Start listening
        this.server.listen(core.config.web.port, () => {
            console.log(`Listening on port ${core.config.web.port}`);
        })
    }

    /**
     * http server
     */
    public get server() {
        return this._server;
    }
}