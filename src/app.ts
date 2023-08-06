import express, { Application, NextFunction, Request, Response, ErrorRequestHandler} from 'express';
import createHttpError from 'http-errors';
import {config} from 'dotenv';
import { openDatabase, createTablesFromSchemas } from './database';
import { readFileSync } from 'fs';

config()

const app: Application = express();

const PORT: number =  Number(process.env.PORT) || 3001;

app.use(express.json());
export default app;

const isTestMode = process.env.NODE_ENV === 'test';
const isDevelopmentMode = process.env.NODE_ENV == 'development';
const isProductionMode = process.env.NODE_ENV == 'production'

app.get('/', (req: Request, res: Response, next:NextFunction): void => {
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
app.post('/:collection', async (req: Request, res: Response) => {
    try {
      const collectionName = req.params.collection;
      const data = req.body; 
      const dbConfig = isTestMode
      ? { filename: './data/test-db.sqlite'  }
      : isDevelopmentMode
      ? { filename: './data/dev-db.sqlite' }
      : { filename: './data/db.sqlite' };
      const db = await openDatabase(dbConfig);
      const columns = Object.keys(data);
      const values = Object.values(data);
      const placeholders = new Array(values.length).fill('?').join(',');
      const query = `INSERT INTO ${collectionName} (${columns.join(',')}) VALUES (${placeholders})`;
      const result = await db.run(query, values);
      console.log(result);
      res.status(201).json({ id: result.lastID });
    } catch (err: any) {
      console.error('Error creating record:', err);
      res.status(500).json({ error: 'Failed to create record', message : err.message });
    }
  });

// Read user record with particular id 
app.get('/:collection/:id', async (req: Request, res: Response) => {
    try {
      const collectionName = req.params.collection;
      const id = req.params.id;

    //   const db = await openDatabase();
    const dbConfig = isTestMode
    ? { filename:'./data/test-db.sqlite' }
    : isDevelopmentMode
    ? { filename: './data/dev-db.sqlite' }
    : { filename: './data/db.sqlite' };
    const db = await openDatabase(dbConfig);
      const query = `SELECT * FROM ${collectionName} WHERE id = ?`;
      const row = await db.get(query, id);
      if (!row) {
        res.status(404).json({ error: 'Record not found' });
      } else {
        res.status(200).json(row);
      }
    } catch (err:any) {
      console.error('Error retrieving record:', err);
      res.status(500).json({ error: 'Failed to retrieve record', message : err.message });
    }
  });

// Update a particular record
app.post('/:collection/:id', async (req: Request, res: Response) => {
    try {
      const collectionName = req.params.collection;
      const id = req.params.id;
      const data = req.body; 
    //   const db = await openDatabase();
    const dbConfig = isTestMode
    ? { filename: './data/test-db.sqlite'  }
    : isDevelopmentMode
    ? { filename: './data/dev-db.sqlite' }
    : { filename: './data/db.sqlite' };
    const db = await openDatabase(dbConfig);
      const columns = Object.keys(data);
      const values = Object.values(data);
      const placeholders = columns.map((col) => `${col} = ?`).join(',');
      const query = `UPDATE ${collectionName} SET ${placeholders} WHERE id = ?`;
      const result = await db.run(query, [...values, id]);
      if (result.changes === 0) {
        res.status(404).json({ error: 'Record not found' });
      } else {
        res.status(200).json({ message: 'Record updated successfully' });
      }
    } catch (err:any) {
      console.error('Error updating record:', err);
      res.status(500).json({ error: 'Failed to update record', message : err.message });
    }
  });

// Delete a particular record
app.delete('/:collection/:id', async (req: Request, res: Response) => {
    try {
      const collectionName = req.params.collection;
      const id = req.params.id;
      const dbConfig = isTestMode
      ? { filename: './data/test-db.sqlite' }
      : isDevelopmentMode
      ? { filename: './data/dev-db.sqlite' }
      : { filename: './data/db.sqlite' };
      const db = await openDatabase(dbConfig);
    //   const db = await openDatabase();
      const query = `DELETE FROM ${collectionName} WHERE id = ?`;
      const result = await db.run(query, id);
      if (result.changes === 0) {
        res.status(404).json({ error: 'Record not found' });
      } else {
        res.status(200).json({ message: 'Record deleted successfully' });
      }
    } catch (err:any) {
      console.error('Error deleting record:', err);
      res.status(500).json({ error: 'Failed to delete record', message : err.message});
    }
  });

app.listen(PORT, async (): Promise<void>=> {
    console.log('SERVER IS UP ON PORT:', PORT);

    if (isDevelopmentMode || isProductionMode){
        const dbConfig = isDevelopmentMode
    ? { filename: './data/dev-db.sqlite' }
    : { filename: './data/db.sqlite' };
    const db= await openDatabase(dbConfig);
    const schemas= loadSchemas();
    console.log(schemas);
    await createTablesFromSchemas(db, schemas);
    console.log('Database schema has been created.');
    }
});
function loadSchemas() {
    try {
      const schemaFiles = readFileSync('./src/schemas/user.json', { encoding: 'utf-8' });
      return JSON.parse(schemaFiles);
    } catch (err) {
      console.error('Error loading schemas:', err);
      return [];
    }
  }

