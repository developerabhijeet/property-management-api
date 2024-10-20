const pool = require('../config/db');
const { buildSelectQuery, buildInsertQuery, buildUpdateQuery, buildDeleteQuery } = require('../utils/propertyDataQueryBuilder.js');
const { buildAddColumnQuery, buildRenameColumnQuery, buildDeleteColumnQuery, buildGetColumnsQuery } = require('../utils/columnQueryBuilder.js');

// Fetch all rows from the table
exports.fetchAllProperties = async () => {
  const { query, values } = buildSelectQuery('property_data');
  const result = await pool.query(query, values);
  return result.rows;
};

// Fetch a specific property by ID
exports.fetchPropertyById = async (id) => {
  const { query, values } = buildSelectQuery('property_data', { id });
  const result = await pool.query(query, values);
  return result.rows[0];
};


/**
 * Inserts a new property with dynamic columns.
 * First, it fetches the valid columns from the table schema.
 * The incoming data (`newProperty`) is filtered to include only those keys that match valid table columns.
 * If no valid columns are present in the incoming data, an error is thrown.
 * A dynamic insert query is generated using the query builder, ensuring the query is constructed based on the valid columns.
 * Finally, the query is executed, and the newly inserted property is returned.
 * 
 * @param {Object} newProperty - The property data to insert.
 * @returns {Object} - The newly inserted property record.
 */
exports.insertProperty = async (newProperty) => {
  const tableColumns = await exports.getTableColumnsNames();

  const propertyData = {};
  Object.keys(newProperty).forEach(key => {
    if (tableColumns.includes(key)) {
      propertyData[key] = newProperty[key];
    }
  });

  if (Object.keys(propertyData).length === 0) {
    throw new Error('No valid columns found to insert');
  }

  const { query, values } = buildInsertQuery('property_data', propertyData);
  
  const result = await pool.query(query, values);
  return result.rows[0]; // Return the newly inserted property
};

/**
 * Updates an existing property with dynamic columns.
 * Fetches the current table schema to determine valid columns.
 * The incoming `updates` object is filtered to ensure only valid columns are updated.
 * If no valid columns are found in the incoming update data, an error is thrown.
 * A dynamic update query is constructed using the query builder based on the valid update fields.
 * Executes the update query and returns the updated property.
 * 
 * @param {number} id - The ID of the property to update.
 * @param {Object} updates - The fields and values to update.
 * @returns {Object} - The updated property record.
 */
exports.updateProperty = async (id, updates) => {
  const tableColumns = await exports.getTableColumnsNames();

  const updateData = {};
  Object.keys(updates).forEach(key => {
    if (tableColumns.includes(key)) {
      updateData[key] = updates[key];
    }
  });
  if (Object.keys(updateData).length === 0) {
    throw new Error('No valid columns found to update');
  }
  const { query, values } = buildUpdateQuery('property_data', updateData, { id });
  
  const result = await pool.query(query, values);
  return result.rows[0]; // Return the updated property
};


// Delete a row by ID
exports.deleteProperty = async (id) => {
  const { query, values } = buildDeleteQuery('property_data', { id });
  await pool.query(query, values);
};

/**
  * Column operations
*/

// Add a new column to the table
exports.addColumn = async (columnName, columnType) => {
  const existingColumns = await exports.getTableColumnsNames();

  // Check if the column already exists
  if (existingColumns.includes(columnName)) {
    throw new Error(`Column '${columnName}' already exists in the property_data table.`);
  }
  
  const query = buildAddColumnQuery(columnName, columnType);
  await pool.query(query);
};

// Rename an existing column
exports.renameColumn = async (oldColumnName, newColumnName) => {
  const query = buildRenameColumnQuery(oldColumnName, newColumnName);
  await pool.query(query);
};

// Delete a column
exports.deleteColumn = async (columnName) => {
  const query = buildDeleteColumnQuery(columnName);
  await pool.query(query);
};

// Fetch all current columns from the property_data table
exports.getTableColumns = async () => {
  const query = buildGetColumnsQuery('property_data');
  const result = await pool.query(query);
  
  return result.rows; 
};

// Fetch all current columns from the property_data table
exports.getTableColumnsNames = async () => {
  const query = `
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'property_data';
  `;
  const result = await pool.query(query);
  return result.rows.map(row => row.column_name);
};