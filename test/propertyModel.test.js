const sinon = require('sinon');
const pool = require('../config/db');
const propertyModel = require('../models/propertyModel');

describe('Property Model', () => {
  let queryStub;

  beforeEach(() => {
    // Stub the pool.query method
    queryStub = sinon.stub(pool, 'query');
  });

  afterEach(() => {
    // Restore the stub after each test
    sinon.restore();
  });

  describe('fetchAllProperties', () => {
    it('should fetch all properties', async () => {
      const mockResult = {
        rows: [
          { id: 1, property_name: 'Test Property 1' },
          { id: 2, property_name: 'Test Property 2' }
        ]
      };

      // Simulate the pool.query method returning the mock result
      queryStub.resolves(mockResult);

      const result = await propertyModel.fetchAllProperties();
      expect(result).toEqual(mockResult.rows);
      expect(queryStub.calledOnce).toBe(true);
    });
  });

  describe('fetchPropertyById', () => {
    it('should fetch a property by ID', async () => {
      const mockResult = {
        rows: [{ id: 1, property_name: 'Test Property 1' }]
      };

      // Simulate the pool.query method returning the mock result
      queryStub.resolves(mockResult);

      const result = await propertyModel.fetchPropertyById(1);
      expect(result).toEqual(mockResult.rows[0]);
      expect(queryStub.calledOnce).toBe(true);
    });

    it('should return undefined if property not found', async () => {
      const mockResult = { rows: [] };

      queryStub.resolves(mockResult);

      const result = await propertyModel.fetchPropertyById(999);
      expect(result).toBeUndefined();
      expect(queryStub.calledOnce).toBe(true);
    });
  });

  describe('insertProperty', () => {
    it('should insert a new property', async () => {
      const newProperty = { property_name: 'New Property', address: 'New Address' };
      const mockResult = {
        rows: [{ id: 1, ...newProperty }]
      };

      sinon.stub(propertyModel, 'getTableColumnsNames').resolves(['property_name', 'address']);
      queryStub.resolves(mockResult);

      const result = await propertyModel.insertProperty(newProperty);
      expect(result).toEqual(mockResult.rows[0]);
      expect(queryStub.calledOnce).toBe(true);
    });

    it('should throw an error if no valid columns are found', async () => {
      const newProperty = { invalid_field: 'Invalid' };

      sinon.stub(propertyModel, 'getTableColumnsNames').resolves(['property_name', 'address']);

      await expect(propertyModel.insertProperty(newProperty)).rejects.toThrow(
        'No valid columns found to insert'
      );
      expect(queryStub.notCalled).toBe(true);
    });
  });

  describe('updateProperty', () => {
    it('should update an existing property', async () => {
      const updates = { property_name: 'Updated Property' };
      const mockResult = {
        rows: [{ id: 1, property_name: 'Updated Property' }]
      };

      sinon.stub(propertyModel, 'getTableColumnsNames').resolves(['property_name']);
      queryStub.resolves(mockResult);

      const result = await propertyModel.updateProperty(1, updates);
      expect(result).toEqual(mockResult.rows[0]);
      expect(queryStub.calledOnce).toBe(true);
    });

    it('should throw an error if no valid columns are found to update', async () => {
      const updates = { invalid_field: 'Invalid' };

      sinon.stub(propertyModel, 'getTableColumnsNames').resolves(['property_name']);

      await expect(propertyModel.updateProperty(1, updates)).rejects.toThrow(
        'No valid columns found to update'
      );
      expect(queryStub.notCalled).toBe(true);
    });
  });

  describe('deleteProperty', () => {
    it('should delete a property by ID', async () => {
      queryStub.resolves();

      await propertyModel.deleteProperty(1);
      expect(queryStub.calledOnce).toBe(true);
    });
  });

  describe('addColumn', () => {
    it('should add a new column', async () => {
      sinon.stub(propertyModel, 'getTableColumnsNames').resolves(['property_name']);

      queryStub.resolves();
      await propertyModel.addColumn('new_column', 'VARCHAR');
      expect(queryStub.calledOnce).toBe(true);
    });

    it('should throw an error if the column already exists', async () => {
      sinon.stub(propertyModel, 'getTableColumnsNames').resolves(['new_column']);

      await expect(propertyModel.addColumn('new_column', 'VARCHAR')).rejects.toThrow(
        "Column 'new_column' already exists in the property_data table."
      );
      expect(queryStub.notCalled).toBe(true);
    });
  });
});
