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
        const allowedOrigins = ['http://localhost:3000', 'http://192.168.168.113', 'http://mono202207-temp-humid.herokuapp.com']
        this.app.use(cors(function (req, callback) {
            const origin = req.header('Origin') || ''
            let corsOptions;
            if (allowedOrigins.indexOf(origin) !== -1) {
                corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
            } else {
                corsOptions = { origin: false } // disable CORS for this request
            }
            callback(null, corsOptions) // callback expects two parameters: error and options
        }));
        
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