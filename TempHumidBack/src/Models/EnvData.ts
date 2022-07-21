import { table, id, field } from 'sqlite3orm';

@table({ name: 'ENVDATA' })
export class EnvData {
    @id({ name: 'id', dbtype: 'INTEGER NOT NULL' })
    id!: number;

    @field({ name: 'temp', dbtype: 'NUM NOT NULL' })
    temp!: number;

    @field({ name: 'humid', dbtype: 'NUM NOT NULL' })
    humid!: number;

    @field({ name: 'time', dbtype: 'TEXT NOT NULL' })
    time!: Date;
}