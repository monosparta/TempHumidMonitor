import express from 'express';
import { Core } from '..';

export class ExpressServer
{
    private app = express();

    constructor(core: Core) {
        this.app.get('/api/getLast24Hours', (req, res) => {
            core.db.getHourAvgDataFromTime(new Date(Date.now() - 24 * 60 * 60 * 1000), (err, row) => {
                res.json(row);
            })
        })

        this.app.listen(core.config.web.port, () => {
            console.log(`Listening on port ${core.config.web.port}`);
        })
    }
}