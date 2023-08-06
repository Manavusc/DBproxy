"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTablesFromSchemas = exports.openDatabase = void 0;
const sqlite_1 = require("sqlite");
const sqlite3_1 = __importDefault(require("sqlite3"));
// Function to open the SQLite database
function openDatabase(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const dbConnection = yield (0, sqlite_1.open)(Object.assign(Object.assign({}, config), { driver: sqlite3_1.default.Database }));
        return dbConnection;
    });
}
exports.openDatabase = openDatabase;
function createTablesFromSchemas(db, schemas) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (const schema of schemas) {
                console.log(schema);
                const tableName = schema.collectionName;
                const fields = schema.fields.map((field) => `${field.name} ${field.type}`).join(',');
                const primaryKeyField = schema.fields.find((field) => field.primary === true);
                const primaryKey = primaryKeyField ? primaryKeyField.name : 'id';
                const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${primaryKey} INTEGER PRIMARY KEY, ${fields})`;
                console.log('Query:', query);
                yield db.run(query);
                //   await addMissingColumns(db, tableName, schema.fields);
            }
        }
        catch (err) {
            console.error('Error creating tables:', err);
            throw err;
        }
    });
}
exports.createTablesFromSchemas = createTablesFromSchemas;
// Add column to table not detected in schema
function addMissingColumns(db, tableName, fields) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `PRAGMA table_info(${tableName})`;
        try {
            const existingColumns = yield db.all(query);
            console.log(existingColumns);
            const existingColumnNames = existingColumns.map((column) => column.name);
            for (const field of fields) {
                const columnName = field.name;
                // Check if the column already exists in the table
                if (!existingColumnNames.includes(columnName)) {
                    const columnType = field.type;
                    const alterQuery = `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`;
                    yield db.run(alterQuery);
                    console.log(`Column '${columnName}' added to table '${tableName}'.`);
                }
            }
        }
        catch (error) {
            console.error('Error fetching existing columns:', error);
        }
    });
}
