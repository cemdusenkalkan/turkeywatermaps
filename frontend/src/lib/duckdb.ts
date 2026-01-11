import * as duckdb from '@duckdb/duckdb-wasm';
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import duckdb_wasm_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import duckdb_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
import duckdb_worker_eh from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';

const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
    mvp: {
        mainModule: duckdb_wasm,
        mainWorker: duckdb_worker,
    },
    eh: {
        mainModule: duckdb_wasm_eh,
        mainWorker: duckdb_worker_eh,
    },
};

let db: duckdb.AsyncDuckDB | null = null;
let conn: duckdb.AsyncDuckDBConnection | null = null;

export async function initDuckDB() {
    if (db) return db;

    // Select bundle based on browser support
    const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
    
    // Instantiate worker
    const worker = new Worker(bundle.mainWorker!);
    const logger = new duckdb.ConsoleLogger();
    db = new duckdb.AsyncDuckDB(logger, worker);
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

    return db;
}

export async function getConnection() {
    if (!db) await initDuckDB();
    if (!conn) conn = await db!.connect();
    return conn;
}

export async function loadParquetFile(url: string, tableName: string) {
    const c = await getConnection();
    if (!c) throw new Error("Could not connect to DuckDB");

    // Register file URL
    await db!.registerFileURL(tableName + '.parquet', url, duckdb.DuckDBDataProtocol.HTTP, false);
    
    // Create table from parquet
    await c.query(`CREATE OR REPLACE TABLE ${tableName} AS SELECT * FROM read_parquet('${tableName}.parquet')`);
    
    return c;
}

export async function query(sql: string) {
    const c = await getConnection();
    if (!c) throw new Error("Could not connect to DuckDB");
    return c.query(sql);
}
