import { Database } from 'sqlite3';


export class SqliteDatabase{
    private readonly db: Database;

    /**
     * Setup SQLite3 client
     * @param file Database file
     */
    constructor(file: string) {
        this.db = new Database(file);

        // create table
        this.db.exec('create table if not exists ENVDATA(id integer PRIMARY KEY, temp num, humid num, time TEXT)');
    }

    /**
     * Insert data to database
     * @param temp Temperature
     * @param humid Humidity
     * @param time Time, formatted with 'YYYY-MM-DD HH:MM:SS.SSS'
     */
    public insert(temp: number, humid: number, time: string) {
        // get last record
        this.db.get('select max(id) from ENVDATA', (err, row) => {
            if (err) {
                console.error(`Error: ${err.message}`);
                return;
            }

            const id = row.id +1;
            
            // insert data
            this.db.run('insert into ENVDATA values(?, ?, ?, ?)', [id, temp, humid, time]);
        });
    }

    /**
     * Get data from provided time and average by hour
     * @param time From Date
     * @param callback Data callback
     */
    public getHourAvgDataFromTime(time: Date, callback: (err: Error | null, row: any[]) => void ) {
        const sqlString = "select avg(temp) as temp, avg(humid) as humid, strftime('%d', time) as day, strftime('%H', time) as hour from ENVDATA where datetime(time) >= datetime(?) group by strftime('%Y %m %d %H', time) order by day, hour";
        const timeString = new Date(time.valueOf() - time.getTimezoneOffset() * 60 * 1000).toISOString().
            replace(/T/, ' ').    // replace T with a space
            replace(/\..+/, '')   // delete the dot and everything after

        this.db.all(sqlString, [timeString], callback);
    }

    /**
     * Get all data
     * @param callback Data callback
     */
    public getAll(callback: (err: Error | null, row: any[]) => void) {
        this.db.all('select * from ENVDATA', callback);
    }
}
