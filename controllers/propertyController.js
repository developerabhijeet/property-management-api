const propertyModel = require('../models/propertyModel');

/**
 * Retrieves all properties from the database.
 * Executes a query to fetch all records from the 'property_data' table.
 * Sends the data as a JSON response with a 200 status code upon success.
 * Returns a 500 status code with an error message if the operation fails.
 */
exports.getAllProperties = async (req, res) => {
  try {
    const data = await propertyModel.fetchAllProperties();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Fetches a single property based on the provided ID.
 * Queries the 'property_data' table for a matching record.
 * If found, responds with the property data and a 200 status code.
 * Returns a 404 status code if the property does not exist.
 * Handles any unexpected errors with a 500 status code and error details.
 */
exports.getPropertyById = async (req, res) => {
  const id = req.params.id;
  try {
    const property = await propertyModel.fetchPropertyById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Inserts a new property into the 'property_data' table.
 * Accepts property details from the request body, allowing for dynamic fields.
 * Delegates the insertion logic to the model layer.
 * On success, responds with the newly created property and a 201 status code.
 * If an error occurs, returns a 500 status code with the error message.
 */
exports.addProperty = async (req, res) => {
  try {
    const newProperty = req.body;
    const result = await propertyModel.insertProperty(newProperty);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Updates an existing property identified by its ID.
 * Receives update fields from the request body, supporting dynamic columns.
 * Invokes the model to apply updates to the 'property_data' table.
 * Responds with the updated property and a 200 status code upon success.
 * Handles errors by returning a 500 status code and the error details.
 */
exports.updateProperty = async (req, res) => {
  const id = req.params.id;
  try {
    const updates = req.body;
    const result = await propertyModel.updateProperty(id, updates);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Deletes a property from the database using its ID.
 * Calls the model to remove the property from the 'property_data' table.
 * On successful deletion, responds with a 200 status code and confirmation message.
 * If an error occurs, returns a 500 status code with the error information.
 */
exports.deleteProperty = async (req, res) => {
  const id = req.params.id;
  try {
    await propertyModel.deleteProperty(id);
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
 * Column operations
 */

/**
 * Adds a new column to the 'property_data' table dynamically.
 * Expects 'columnName' and 'columnType' in the request body.
 * Utilizes the model to execute the column addition.
 * Responds with a 201 status code and a success message upon completion.
 * Returns a 500 status code with error details if the operation fails.
 */
exports.addColumn = async (req, res) => {
  const { columnName, columnType } = req.body;

  try {
    await propertyModel.addColumn(columnName, columnType);
    res.status(201).json({ message: `Column '${columnName}' added successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Renames an existing column in the 'property_data' table.
 * Receives the current column name as a URL parameter and the new name in the request body.
 * Delegates the renaming process to the model layer.
 * On success, responds with a 200 status code and a message indicating the change.
 * Handles errors by returning a 500 status code and the associated error message.
 */
exports.renameColumn = async (req, res) => {
  const { column_name: oldColumnName } = req.params;
  const { newName } = req.body;

  try {
    await propertyModel.renameColumn(oldColumnName, newName);
    res.status(200).json({ message: `Column '${oldColumnName}' renamed to '${newName}'` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Deletes a column from the 'property_data' table.
 * Accepts the name of the column to delete as a URL parameter.
 * Calls upon the model to perform the deletion operation.
 * If successful, responds with a 200 status code and a confirmation message.
 * If an error occurs during the process, returns a 500 status code with error details.
 */
exports.deleteColumn = async (req, res) => {
  const { column_name: columnName } = req.params;

  try {
    await propertyModel.deleteColumn(columnName);
    res.status(200).json({ message: `Column '${columnName}' deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Fetches the current columns of the 'property_data' table.
 * Queries the 'information_schema.columns' table to get the list of columns and their types.
 * Responds with a 200 status code and the list of columns in JSON format.
 * Handles errors by returning a 500 status code with error details.
 */
exports.getColumns = async (req, res) => {
  try {
    const columns = await propertyModel.getTableColumns();
    res.status(200).json(columns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
