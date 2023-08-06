import { Database,open } from 'sqlite';
import { openDatabase , createTablesFromSchemas } from '../src/database';
import request from 'supertest';
import app from '../src/app';
import sqlite3 from 'sqlite3';


// Mock the 'sqlite' module to use an in-memory database for testing
jest.mock('sqlite', () => ({
  open: jest.fn(() => Promise.resolve({ run: jest.fn(), all: jest.fn() })),
}));

// Mock the schema data for testing
const schemas = [
  {
    collectionName: 'users',
    fields: [
      { name: 'name', type: 'text' },
      { name: 'email', type: 'text' },
    ],
  },
];

describe('DB Proxy Tests', () => {
  let db:Database;

  // beforeAll(async () => {
  //   const folderPath = './test_data/';
  //   if (!fs.existsSync(folderPath)) {
  //     fs.mkdirSync(folderPath);
  //   }
  
  //   try {
  //     db = await open({
  //       filename: path.join(folderPath, 'testdb.sqlite'),
  //       driver: Database,
  //     });
  //     console.log('Database opened successfully.');
  //     console.log(db);
  //     console.log(process.cwd())
  //   } catch (error) {
  //     console.error('Error during setup:', error);
  //   }
  // });



  // beforeAll(async () => {
  //   // Before running the tests, open the mock database
  //   // const { open } = await import('sqlite');
  //   db = await open({
  //     filename: 'data/testdb.sqlite', // Path to the SQLite database file
  //     driver: Database,
  //   });
  //   console.log('database');
  // });
  beforeAll(async () => {
    // Before running the tests, open the mock database
    // const { open } = await import('sqlite');
    // db = await open({ filename: ':memory:', driver: Database });
    // db = await open({ filename: './data/test-db.sqlite', driver: sqlite3.Database });

    await openDatabase({ filename: './data/test-db.sqlite' });
  });

  beforeEach(async () => {
    // Before each test, create the tables and columns based on the mock schema
    await createTablesFromSchemas(db, schemas);
  });

  afterEach(async () => {
    // After each test, reset the tables
    const tableNames = schemas.map((schema) => schema.collectionName);
    for (const tableName of tableNames) {
      await db.run(`DELETE FROM ${tableName}`);
    }
  });

  afterAll(async () => {
    // After all tests, close the database connection
    await db.close();
  });


  test('CRUD', async () => {

    console.log("Testing Create a new user");
    const createUserResponse = await request(app)
    .post('/users')
    .send({ name: 'Pradeep Jain', email: 'pradeepjain933@rediffmail.com' });
    expect(createUserResponse.status).toBe(201);
    expect(createUserResponse.body.message).toBe('User record created successfully.');
    let userId = createUserResponse.body.userId;

    console.log("Testing retrieving a new user");
    const getUserResponse = await request(app).get(`/users/${userId}`);
    expect(getUserResponse.status).toBe(200);

    console.log("Updating user");
    const updateUserResponse = await request(app)
    .post(`/users/${userId}`)
    .send({ name: 'Pradeep Kumar Jain', email: 'pradeepjain0197gmail.com' });
    expect(updateUserResponse.status).toBe(201);
    expect(updateUserResponse.body.message).toBe('Record updated successfully');
    
    
    console.log("Deleting user");
    const deleteUserResponse = await request(app).delete(`/users/${userId}`);
    expect(deleteUserResponse.status).toBe(200);
    expect(deleteUserResponse.body.message).toBe('User record deleted successfully.');


  });

//   test('Create User', async () => {

//     const createUserResponse = await request(app)
//     .post('/users')
//     .send({ name: 'Pradeep Jain', email: 'pradeepjain933@rediffmail.com' });
//     expect(createUserResponse.status).toBe(201);
//     expect(createUserResponse.body.message).toBe('User record created successfully.');
//     let userId = createUserResponse.body.userId;
//   });


//   test('Retrieve User', async () => {

//     // const userId:number =  1;
//     const getUserResponse = await request(app).get(`/users/${userId}`);
//     expect(getUserResponse.status).toBe(200);

//   });


//   test('Update User', async () => {
//     const userId:number =  1;
//     const updateUserResponse = await request(app)
//     .post(`/users/${userId}`)
//     .send({ name: 'Pradeep Jain', email: 'pradeepjain0197gmail.com' });
//     expect(updateUserResponse.status).toBe(201);
//     expect(updateUserResponse.body.message).toBe('Record updated successfully');
//   });


//   test('Delete User', async () => {
//     const userId:number =  1;
//     const deleteUserResponse = await request(app).delete(`/users/${userId}`);
//     expect(deleteUserResponse.status).toBe(200);
//     expect(deleteUserResponse.body.message).toBe('User record deleted successfully.');
//   });





  // Add more test cases for updating, deleting records, handling errors, etc.
});
