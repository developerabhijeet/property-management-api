const pool = require('./db');

// Columns you want to ensure are present in the table
const requiredColumns = [
  { column_name: 'property_name', data_type: 'VARCHAR' },
  { column_name: 'address', data_type: 'VARCHAR' },
  { column_name: 'total_area_in_sqft', data_type: 'NUMERIC' },
  { column_name: 'price_in_cr', data_type: 'NUMERIC' },
  { column_name: 'listed_date', data_type: 'DATE' },
  { column_name: 'status', data_type: 'VARCHAR' },
  { column_name: 'total_earnings', data_type: 'NUMERIC' }
];

// Function to ensure the table exists, and create it if it doesn't
async function ensureTableSchema() {
  try {
    // First, check if the property_data table exists
    const tableCheckQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'property_data'
      );
    `;
    const tableCheckResult = await pool.query(tableCheckQuery);

    if (!tableCheckResult.rows[0].exists) {
      // If the table doesn't exist, create it
      console.log('Table property_data does not exist. Creating table...');
      const createTableQuery = `
        CREATE TABLE property_data (
          id SERIAL PRIMARY KEY,
          property_name VARCHAR,
          address VARCHAR,
          total_area_in_sqft NUMERIC,
          price_in_cr NUMERIC,
          listed_date DATE,
          status VARCHAR,
          total_earnings NUMERIC
        );
      `;
      await pool.query(createTableQuery);
      console.log('Table property_data created successfully.');
    } else {
      console.log('Table property_data already exists.');
    }

    // ensure that the required columns are present
    await ensureColumns();
    
  } catch (error) {
    console.error('Error ensuring table schema:', error);
  }
}

// Function to ensure all required columns are present
async function ensureColumns() {
  const existingColumns = await getTableColumns();

  for (let column of requiredColumns) {
    if (!existingColumns.includes(column.column_name)) {
      await addColumn(column);
    }
  }
}

// Function to get the current columns of the table
async function getTableColumns() {
  const query = `
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'property_data';
  `;
  const result = await pool.query(query);
  return result.rows.map(row => row.column_name);
}

// Function to add a missing column
async function addColumn(column) {
  try {
    const query = `ALTER TABLE property_data ADD COLUMN ${column.column_name} ${column.data_type};`;
    await pool.query(query);
    console.log(`Column '${column.column_name}' added successfully.`);
  } catch (error) {
    console.error(`Error adding column ${column.column_name}:`, error.message);
  }
}

module.exports = ensureTableSchema;
