/**
 * Generates a secure SELECT query.
 * @param {string} table - The table name.
 * @param {Object} conditions - The conditions for the WHERE clause.
 * @param {Array} columns - Optional: The columns to select.
 * @returns {Object} { query: string, values: Array }
 */
const buildSelectQuery = (table, conditions = {}, columns = ['*']) => {
  const keys = Object.keys(conditions);
  const whereClause = keys.length ? ' WHERE ' + keys.map((key, i) => `${key} = $${i + 1}`).join(' AND ') : '';
  const values = Object.values(conditions);

  const query = `SELECT ${columns.join(', ')} FROM ${table}${whereClause}`;
  return { query, values };
};

/**
 * Generates a secure INSERT query.
 * @param {string} table - The table name.
 * @param {Object} data - The data to insert.
 * @returns {Object} { query: string, values: Array }
 */
const buildInsertQuery = (table, data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

  const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
  return { query, values };
};

/**
 * Generates a secure UPDATE query.
 * @param {string} table - The table name.
 * @param {Object} data - The data to update.
 * @param {Object} conditions - The conditions for the WHERE clause.
 * @returns {Object} { query: string, values: Array }
 */
const buildUpdateQuery = (table, data, conditions) => {
  const dataKeys = Object.keys(data);
  const conditionKeys = Object.keys(conditions);

  const setClause = dataKeys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  const whereClause = conditionKeys.map((key, i) => `${key} = $${dataKeys.length + i + 1}`).join(' AND ');
  const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause} RETURNING *`;

  const values = [...Object.values(data), ...Object.values(conditions)];
  return { query, values };
};

/**
 * Generates a secure DELETE query.
 * @param {string} table - The table name.
 * @param {Object} conditions - The conditions for the WHERE clause.
 * @returns {Object} { query: string, values: Array }
 */
const buildDeleteQuery = (table, conditions) => {
  const keys = Object.keys(conditions);
  const whereClause = keys.map((key, i) => `${key} = $${i + 1}`).join(' AND ');
  const query = `DELETE FROM ${table} WHERE ${whereClause}`;

  const values = Object.values(conditions);
  return { query, values };
};

module.exports = {
  buildSelectQuery,
  buildInsertQuery,
  buildUpdateQuery,
  buildDeleteQuery
};
