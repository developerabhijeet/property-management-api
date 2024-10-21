# Property Management API

**Property Management API** is a backend service developed using **Node.js** and **Express** for managing property records. It supports CRUD operations on properties and also allows dynamic column management in the PostgreSQL database.

## Features

- **Property CRUD operations**:
  - Add, update, delete, and fetch properties.
  - Supports dynamic property fields, ensuring flexibility in schema.
- **Dynamic Column Management**:
  - Add, rename, and delete columns in the `property_data` table dynamically.
- **PostgreSQL Integration**: Efficient interaction with PostgreSQL for data storage and retrieval.

## Tech Stack

- **Node.js** with **Express.js**
- **PostgreSQL** as the database
- **Jest** for testing
- **Supertest** for HTTP assertions in tests
- **Sinon** for mocking and spying in tests
- **Yarn** for dependency management
- **ESLint** and **Prettier** for code linting and formatting
- **dotenv** for environment variable management
- **express-validator** for validating inputs in API requests

## Prerequisites

- **Node.js** (version 16+ recommended)
- **Yarn** package manager
- **PostgreSQL** (ensure a running instance)

## Installation and Set-up

1. **Clone the repository:**

  ```bash
   git clone https://github.com/developerabhijeet/property-management-api.git
   cd property-management-api
```

2. **Install Dependencies:**

  ```bash
    nvm use v20
  ```

  ```bash
    npm install
  ```

3. **Configure Environment Variables:**

  ```bash
    DB_HOST=db_host
    DB_USER=db_user
    DB_PASSWORD=db_password
    DB_NAME=property_db
    DB_PORT=5432
    PORT=3030
  ```

4. **Run the Development Server:**

   ```bash
    npm run dev  
   ```

5. **Run the Production Server:**

   ```bash
    npm start
   ```

6. **Run Unit Test Cases:**

   ```bash
    npm test
   ```

7. **Run lint Fix:**

   ```bash
    npm lint:fix
   ```
