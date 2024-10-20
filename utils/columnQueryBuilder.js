/**
 * Validates if the given column type is a valid PostgreSQL data type.
 * @param {string} columnType - The type of the column to be added (e.g., 'VARCHAR', 'NUMERIC').
 * @returns {boolean} - Returns true if the column type is valid.
 */
const validateColumnType = (columnType) => {
  const validTypes = ['VARCHAR', 'TEXT', 'NUMERIC', 'INTEGER', 'BOOLEAN', 'DATE', 'TIMESTAMP'];
  return validTypes.includes(columnType.toUpperCase());
};

/**
 * Builds a query to add a new column to the table.
 * @param {string} columnName - The name of the column to be added.
 * @param {string} columnType - The type of the column (validated by validateColumnType).
 * @returns {string} - Returns the SQL query string.
 */
const buildAddColumnQuery = (columnName, columnType) => {
  if (!validateColumnType(columnType)) {
    throw new Error('Invalid column type');
  }
  return `ALTER TABLE property_data ADD COLUMN ${columnName} ${columnType.toUpperCase()};`;
};

/**
 * Builds a query to rename an existing column in the table.
 * @param {string} oldColumnName - The name of the column to be renamed.
 * @param {string} newColumnName - The new name for the column.
 * @returns {string} - Returns the SQL query string.
 */
const buildRenameColumnQuery = (oldColumnName, newColumnName) => {
  return `ALTER TABLE property_data RENAME COLUMN ${oldColumnName} TO ${newColumnName};`;
};

/**
 * Builds a query to delete a column from the table.
 * @param {string} columnName - The name of the column to be deleted.
 * @returns {string} - Returns the SQL query string.
 */
const buildDeleteColumnQuery = (columnName) => {
  return `ALTER TABLE property_data DROP COLUMN ${columnName};`;
};

/**
 * Builds a query to fetch the current columns from the table.
 * This query retrieves column names and data types from the PostgreSQL information schema.
 * @param {string} table - The table name.
 * @returns {string} - The SQL query string.
 */
const buildGetColumnsQuery = (table) => {
  return `
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = '${table}'
  `;
};

module.exports = {
  validateColumnType,
  buildAddColumnQuery,
  buildRenameColumnQuery,
  buildDeleteColumnQuery,
  buildGetColumnsQuery,
};
