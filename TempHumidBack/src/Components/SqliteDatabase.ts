import { SqlDatabase, BaseDAO } from 'sqlite3orm';
import { EnvData } from '../Models/EnvData';

export class SqliteDatabase{
    private readonly db: SqlDatabase;
    private dataDAO :BaseDAO<EnvData> | undefined = undefined;

    /**
     * Setup SQLite3 client
     * @param file Database file
     */
    constructor(file: string) { 
        this.db = new SqlDatabase();
        this.db.open(file).then(() => {
            this.dataDAO = new BaseDAO(EnvData, this.db);

            this.dataDAO.createTable();
        })
    }

    /**
     * Insert data to database
     * @param temp Temperature
     * @param humid Humidity
     * @param time Time, formatted with 'YYYY-MM-DD HH:MM:SS.SSS'
     */
    public async insert(temp: number, humid: number, time: string) {
        if (this.dataDAO === undefined) throw new Error("Database not initialized");

        const data = new EnvData();
        data.temp = temp;
        data.humid = humid;
        data.time = new Date(Date.parse(time));

        await this.dataDAO.insert(data);
    }

    /**
     * Get data from provided time and average by hour
     * @param time From Date
     * @param callback Data callback
     */
    public async getHourAvgDataFromTime(time: Date) {
        if (this.dataDAO === undefined) throw new Error("Database not initialized");

        const timeString = time.toISOString();

        const rawData = await this.dataDAO.selectAll({
            select: { temp: true, humid: true, time: true },
            where: "where datetime(time) >= datetime($0)"
        }, { '$0': timeString })
        
        return this.getAverageData(rawData);
    }


    /**
     * Group and calculate average by hour
     * @param data Rawdata got from dao
     */
    private getAverageData(data: EnvData[]) {
        const dataGroup: { [key: string]: EnvData[] } = {};
        for (const x of data) {
            const key = `${x.time.getFullYear()}-${x.time.getMonth()}-${x.time.getDate()}-${x.time.getHours()}`;
            if (dataGroup[key] === undefined) {
                dataGroup[key] = [x]
            } else {
                dataGroup[key].push(x)
            }
        }
        const calculatedGroup: { temp: number, humid: number, hour: number, day: number }[] = [];

        for (const x of Object.keys(dataGroup)) {
            if (dataGroup[x] === undefined) continue;
            
            // Calculate average for each group
            calculatedGroup.push({
                temp: dataGroup[x].map(x => x.temp).reduce((a, b) => a + b) / dataGroup[x].length,
                humid: dataGroup[x].map(x => x.humid).reduce((a, b) => a + b) / dataGroup[x].length,
                day: dataGroup[x][0].time.getDate(),
                hour: dataGroup[x][0].time.getHours()
            })
        }

        return calculatedGroup.sort((a, b) => a.day - b.day || a.hour - b.hour);
    }
}
