# DB Proxy - Generic Database Proxy

This project is a generic database proxy built in Node.JS that serves as a REST API for CRUD operations on a SQL database. It allows you to translate REST requests into valid SQL statements using API endpoint handlers, all written in Typescript/Node.

## Problem

The objective of this project is to build a versatile database proxy that can interact with a SQL database using RESTful API endpoints. The proxy should be able to ingest schema files (e.g., TS or JSON) to build the database schema dynamically on every server startup, eliminating the need for prior knowledge of the schema.

## Technical Requirements

- CRUD Operations: The proxy supports the following REST endpoints that map to CRUD operations:
  - `POST /:collection` for creating records
  - `GET /:collection/:id` for retrieving records by ID
  - `POST /:collection/:id` for updating records
  - `DELETE /:collection/:id` for deleting records

- Dynamic Schema Creation: The proxy dynamically creates database tables and columns based on the schema files provided during server startup. If the tables do not exist, they will be created, and missing columns will be added.

- Technology Stack: The project utilizes Typescript and Node.JS along with Express, Sqlite.

## Setup and Usage

1. Clone the repository: `git clone https://github.com/Manavusc/DBproxy.git`
2. Install dependencies: `npm install`
3. Run the server: `npm run dev`


## Manual testing 

- Tested for both PostMan and Curl.View output folder. 

## Additional Features

- Automated Tests: The project includes automated tests to ensure the correctness of the implemented business logic. Tests can be executed using: `npm test`. Don't use this having a small bug.

## NOT Completed

- Automated Tests:  I implemented it but it consist of a small bug, but automated test are very important to enusre correctness.

- Input Validation: The project currently lacks robust input validation for API requests. Proper validation of incoming data, such as required fields, data types, and length restrictions, should be added to ensure data integrity and prevent potential security vulnerabilities.

- Error Handling Middleware: While the API endpoints have basic error handling, more comprehensive error handling middleware could be added to gracefully handle various types of errors and provide consistent error responses.


## Running in a Concurrent Environment

- If the application were intended to run in a concurrent environment, such as handling multiple requests simultaneously, we would need to address the following points:

- Database Connection Pooling: In a concurrent environment, it is essential to use a database connection pool to efficiently manage and reuse database connections. Libraries like pg for PostgreSQL or mysql2 for MySQL offer connection pooling options that can be used in place of SQLite.

- Concurrency Handling: The current implementation may face race conditions or inconsistencies when handling concurrent requests. Proper handling of concurrent database operations is crucial to avoid data corruption and maintain data integrity.

- Scaling Considerations: In a highly concurrent environment with heavy traffic, scaling considerations become important. Implementing load balancing and deploying the application across multiple instances might be necessary to handle the increased load effectively.

## Other Comments

The project demonstrates a basic implementation of a DB Proxy for CRUD operations using TypeScript, Node.js, and SQLite. It lays the foundation for a more complete and production-ready application. However, additional features, testing, error handling, and security considerations should be thoroughly addressed for a fully functional and robust database proxy in a real-world scenario.

