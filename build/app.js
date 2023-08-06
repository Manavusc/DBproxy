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
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const database_1 = require("./database");
const fs_1 = require("fs");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3001;
app.use(express_1.default.json());
exports.default = app;
const isTestMode = process.env.NODE_ENV === 'test';
const isDevelopmentMode = process.env.NODE_ENV == 'development';
const isProductionMode = process.env.NODE_ENV == 'production';
app.get('/', (req, res, next) => {
    res.send('Hello world!');
});
// app.use((req: Request, res: Response, next: NextFunction): void => {
//     next(new createHttpError.NotFound())
// });
// const errorHandler: ErrorRequestHandler =(err,req,res,next) => {
//     res.status(err.status  || 500 )
//     res.send({
//         status : err.status || 500,
//         message: err.message
//     })
// }
// app.use(errorHandler);
//Create Records
app.post('/:collection', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collectionName = req.params.collection;
        const data = req.body;
        const dbConfig = isTestMode
            ? { filename: './data/test-db.sqlite' }
            : isDevelopmentMode
                ? { filename: './data/dev-db.sqlite' }
                : { filename: './data/db.sqlite' };
        const db = yield (0, database_1.openDatabase)(dbConfig);
        console.log(db);
        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = new Array(values.length).fill('?').join(',');
        const query = `INSERT INTO ${collectionName} (${columns.join(',')}) VALUES (${placeholders})`;
        const result = yield db.run(query, values);
        console.log(result);
        res.status(201).json({ id: result.lastID });
    }
    catch (err) {
        console.error('Error creating record:', err);
        res.status(500).json({ error: 'Failed to create record', message: err.message });
    }
}));
// Read user record with particular id 
app.get('/:collection/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collectionName = req.params.collection;
        const id = req.params.id;
        //   const db = await openDatabase();
        const dbConfig = isTestMode
            ? { filename: './data/test-db.sqlite' }
            : isDevelopmentMode
                ? { filename: './data/dev-db.sqlite' }
                : { filename: './data/db.sqlite' };
        const db = yield (0, database_1.openDatabase)(dbConfig);
        const query = `SELECT * FROM ${collectionName} WHERE id = ?`;
        const row = yield db.get(query, id);
        if (!row) {
            res.status(404).json({ error: 'Record not found' });
        }
        else {
            res.status(200).json(row);
        }
    }
    catch (err) {
        console.error('Error retrieving record:', err);
        res.status(500).json({ error: 'Failed to retrieve record', message: err.message });
    }
}));
// Update a particular record
app.post('/:collection/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collectionName = req.params.collection;
        const id = req.params.id;
        const data = req.body;
        //   const db = await openDatabase();
        const dbConfig = isTestMode
            ? { filename: './data/test-db.sqlite' }
            : isDevelopmentMode
                ? { filename: './data/dev-db.sqlite' }
                : { filename: './data/db.sqlite' };
        const db = yield (0, database_1.openDatabase)(dbConfig);
        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = columns.map((col) => `${col} = ?`).join(',');
        const query = `UPDATE ${collectionName} SET ${placeholders} WHERE id = ?`;
        const result = yield db.run(query, [...values, id]);
        if (result.changes === 0) {
            res.status(404).json({ error: 'Record not found' });
        }
        else {
            res.status(200).json({ message: 'Record updated successfully' });
        }
    }
    catch (err) {
        console.error('Error updating record:', err);
        res.status(500).json({ error: 'Failed to update record', message: err.message });
    }
}));
// Delete a particular record
app.delete('/:collection/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collectionName = req.params.collection;
        const id = req.params.id;
        const dbConfig = isTestMode
            ? { filename: './data/test-db.sqlite' }
            : isDevelopmentMode
                ? { filename: './data/dev-db.sqlite' }
                : { filename: './data/db.sqlite' };
        const db = yield (0, database_1.openDatabase)(dbConfig);
        //   const db = await openDatabase();
        const query = `DELETE FROM ${collectionName} WHERE id = ?`;
        const result = yield db.run(query, id);
        if (result.changes === 0) {
            res.status(404).json({ error: 'Record not found' });
        }
        else {
            res.status(200).json({ message: 'Record deleted successfully' });
        }
    }
    catch (err) {
        console.error('Error deleting record:', err);
        res.status(500).json({ error: 'Failed to delete record', message: err.message });
    }
}));
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('SERVER IS UP ON PORT:', PORT);
    if (isDevelopmentMode || isProductionMode) {
        const dbConfig = isDevelopmentMode
            ? { filename: './data/dev-db.sqlite' }
            : { filename: './data/db.sqlite' };
        const db = yield (0, database_1.openDatabase)(dbConfig);
        const schemas = loadSchemas();
        console.log(schemas);
        yield (0, database_1.createTablesFromSchemas)(db, schemas);
        console.log('Database schema has been created.');
    }
}));
function loadSchemas() {
    try {
        const schemaFiles = (0, fs_1.readFileSync)('./src/schemas/user.json', { encoding: 'utf-8' });
        return JSON.parse(schemaFiles);
    }
    catch (err) {
        console.error('Error loading schemas:', err);
        return [];
    }
}
