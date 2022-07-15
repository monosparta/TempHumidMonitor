import { Database } from 'sqlite3';


export class SqliteDatabase{
    private readonly db: Database;

    constructor(file: string) {
        this.db = new Database(file);

        // create table
        this.db.exec('create table if not exists ENVDATA(id integer PRIMARY KEY, temp num, humid num, time TEXT)');
    }

    public insert(temp: number, humid: number, time: string) {
        this.db.get('select max(id) from ENVDATA', (err, row) => {
            if (err) {
                console.error(`Error: ${err.message}`);
                return;
            }

            const id = row.id +1;
            
            this.db.run('insert into ENVDATA values(?, ?, ?, ?)', [id, temp, humid, time]);
        });
    }

    // get data from provided time and average by hour
    public getHourAvgDataFromTime(time: Date, callback: (err: Error | null, row: any[]) => void ) {
        const sqlString = "select avg(temp) as temp, avg(humid) as humid, strftime('%d', time) as day, strftime('%H', time) as hour from ENVDATA where datetime(time) >= datetime(?) group by strftime('%H', time)";
        const timeString = time.toISOString().
            replace(/T/, ' ').    // replace T with a space
            replace(/\..+/, '')   // delete the dot and everything after
        this.db.all(sqlString, [timeString], callback);
    }

    // getAllData
    public getAll(callback: (err: Error | null, row: any[]) => void) {
        this.db.all('select * from ENVDATA', callback );
    }
}
