import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';


// Function to open the SQLite database
export async function openDatabase(config :{filename:string}): Promise<Database> {
    const dbConnection = await open({
      ...config, // Path to the SQLite database file
      driver: sqlite3.Database,
    });
    return dbConnection;
  }

export async function createTablesFromSchemas(db: Database , schemas:any){
    try {
        
        for (const schema of schemas) {
        console.log(schema);
          const tableName = schema.collectionName;
          const fields = schema.fields.map((field: any) => `${field.name} ${field.type}`).join(',');
          const primaryKeyField = schema.fields.find((field: any) => field.primary === true);
          const primaryKey = primaryKeyField ? primaryKeyField.name : 'id';
          const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${primaryKey} INTEGER PRIMARY KEY, ${fields})`;

          await db.run(query);

          await addMissingColumns(db, tableName, schema.fields);
        }
      } catch (err:any) {
        console.error('Error creating tables:', err);
        throw err;
      }
}

// Add column to table not detected in schema

async function addMissingColumns(db: Database, tableName: string, fields: any[]) {
    const query = `PRAGMA table_info(${tableName})`;
    try {
        const existingColumns = await db.all(query);
        const existingColumnNames = existingColumns.map((column) => column.name);

        for (const field of fields) {
          const columnName = field.name;
      
          // Check if the column already exists in the table
          if (!existingColumnNames.includes(columnName)) {
            const columnType = field.type;
      
            const alterQuery = `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`;
            await db.run(alterQuery);
            console.log(`Column '${columnName}' added to table '${tableName}'.`);
          }
        }
      } catch (error) {
        console.error('Error fetching existing columns:', error);
      }
  }
  

