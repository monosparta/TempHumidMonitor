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
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", ['http://localhost/', 'http://192.168.168.113', 'http://mono202207-temp-humid.herokuapp.com/']); // update to match the domain you will make the request from
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        
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