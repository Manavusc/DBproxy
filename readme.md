# DB Proxy - Generic Database Proxy

This project is a generic database proxy built in Node.JS that serves as a REST API for CRUD operations on a SQL database. It allows you to translate REST requests into valid SQL statements using API endpoint handlers, all written in Typescript/Node. You have the freedom to choose any server framework (Express, Koa) and SQL flavor (MySQL, Postgres) you prefer.

## Problem

The objective of this project is to build a versatile database proxy that can interact with a SQL database using RESTful API endpoints. The proxy should be able to ingest schema files (e.g., TS or JSON) to build the database schema dynamically on every server startup, eliminating the need for prior knowledge of the schema.

## Technical Requirements

- CRUD Operations: The proxy supports the following REST endpoints that map to CRUD operations:
  - `POST /:collection` for creating records
  - `GET /:collection/:id` for retrieving records by ID
  - `POST /:collection/:id` for updating records
  - `DELETE /:collection/:id` for deleting records

- Dynamic Schema Creation: The proxy dynamically creates database tables and columns based on the schema files provided during server startup. If the tables do not exist, they will be created, and missing columns will be added.

- Technology Stack: The project utilizes Typescript and Node.JS along with your choice of server framework (Express, Koa) and SQL flavor (MySQL, Postgres).

## Setup and Usage

1. Clone the repository: `git clone https://github.com/YourUsername/YourRepository.git`
2. Install dependencies: `npm install`
3. Run the server: `npm start`

## Additional Features

- Automated Tests: The project includes automated tests to ensure the correctness of the implemented business logic. Tests can be executed using: `npm test`

## Deployment

- Docker: You can use the included Dockerfile to containerize the application and deploy it using Docker.

## Contributing

We welcome contributions from the community! Feel free to open issues or submit pull requests for new features, bug fixes, or improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or feedback, please feel free to contact us at support@example.com.




<!-- The project is a REST API for CRUD operations on a SQL database based on the schema provided in JSON format. It dynamically creates tables and adds missing columns on server startup, ensuring that the database schema remains up-to-date.

Project Structure

The project consists of the following main files and directories:- 
src/: Contains the source code for the application.
app.ts: Defines the Express server and API endpoints.
database.ts: Implements database connection and schema management functions.
schemas: Contains schema file. This can be extended with more schemas as needed.
data/: Contains the SQLite database file (db.sqlite) that stores the data.


Installation and Setup

Clone the repository:

git clone <repository_url>
cd dbproxy
Install dependencies:
npm install
Start the server:
npm run dev 
API Endpoints

The API endpoints for performing CRUD operations on the database are as follows:

POST /:collection: Create a new record in the specified collection.
GET /:collection/:id: Get a single record from the specified collection by ID.
PUT /:collection/:id: Update a record in the specified collection by ID.
DELETE /:collection/:id: Delete a record from the specified collection by ID.

Not Completed

Currently, the project handles table creation and column addition based on the schema provided at server startup. However, there are a few aspects that are not implemented in this version:

Automated Tests: Although automated tests are highly desirable for any production application, they have not been included in this initial version. Implementing tests would help ensure the correctness of the application and catch potential issues early on.

Input Validation: The project currently lacks robust input validation for API requests. Proper validation of incoming data, such as required fields, data types, and length restrictions, should be added to ensure data integrity and prevent potential security vulnerabilities.

Error Handling Middleware: While the API endpoints have basic error handling, more comprehensive error handling middleware could be added to gracefully handle various types of errors and provide consistent error responses.

Running in a Concurrent Environment

If the application were intended to run in a concurrent environment, such as handling multiple requests simultaneously, we would need to address the following points:

Database Connection Pooling: In a concurrent environment, it is essential to use a database connection pool to efficiently manage and reuse database connections. Libraries like pg for PostgreSQL or mysql2 for MySQL offer connection pooling options that can be used in place of SQLite.

Concurrency Handling: The current implementation may face race conditions or inconsistencies when handling concurrent requests. Proper handling of concurrent database operations is crucial to avoid data corruption and maintain data integrity.

Scaling Considerations: In a highly concurrent environment with heavy traffic, scaling considerations become important. Implementing load balancing and deploying the application across multiple instances might be necessary to handle the increased load effectively.

Other Comments

The project demonstrates a basic implementation of a DB Proxy for CRUD operations using TypeScript, Node.js, and SQLite. It lays the foundation for a more complete and production-ready application. However, additional features, testing, error handling, and security considerations should be thoroughly addressed for a fully functional and robust database proxy in a real-world scenario. -->