import express from 'express';
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
        // Get data from last 24 hours and average by hour
        this.app.get('/api/getLast24Hours', (req, res) => {
            core.db.getHourAvgDataFromTime(new Date(Date.now() - 24 * 60 * 60 * 1000), (err, row) => {
                res.json(row.map((value) => {
                    return { day: parseInt(value.day), hour: parseInt(value.hour), temp: value.temp, humid: value.humid }
                }));
            })
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