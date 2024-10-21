const request = require('supertest');
const sinon = require('sinon');
const { app, server } = require('../index');
const propertyModel = require('../models/propertyModel.js'); 

describe('Property Controller', () => {
  beforeEach(() => {
    // Reset stubs before each test
    sinon.restore();
  });
  afterAll((done) => {
    if (server && server.close) {
      server.close(done);
    } else {
      done();
    }
  });

  describe('GET api/property/fetch', () => {
    it('should return all properties', async () => {
      const mockProperties = [
        { id: 1, property_name: 'Test Property 1' },
        { id: 2, property_name: 'Test Property 2' }
      ];

      sinon.stub(propertyModel, 'fetchAllProperties').resolves(mockProperties);

      const response = await request(app).get('/api/property/fetch');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProperties);
    });

    it('should return 500 on error', async () => {
      sinon.stub(propertyModel, 'fetchAllProperties').rejects(new Error('Database error'));

      const response = await request(app).get('/api/property/fetch');
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('GET api/property/fetch/:id', () => {
    it('should return a single property by ID', async () => {
      const mockProperty = { id: 1, property_name: 'Test Property 1' };
      sinon.stub(propertyModel, 'fetchPropertyById').resolves(mockProperty);

      const response = await request(app).get('/api/property/fetch/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProperty);
    });

    it('should return 404 if property not found', async () => {
      sinon.stub(propertyModel, 'fetchPropertyById').resolves(null);

      const response = await request(app).get('/api/property/fetch/999');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Property not found');
    });

    it('should return 500 on error', async () => {
      sinon.stub(propertyModel, 'fetchPropertyById').rejects(new Error('Database error'));

      const response = await request(app).get('/api/property/fetch/1');
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('POST api/property/create', () => {
    it('should insert a new property', async () => {
      const newProperty = { property_name: 'New Property', address: 'New Address' };
      const mockInsertedProperty = { id: 1, ...newProperty };

      sinon.stub(propertyModel, 'insertProperty').resolves(mockInsertedProperty);

      const response = await request(app).post('/api/property/create').send(newProperty);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockInsertedProperty);
    });

    it('should return 500 on insert error', async () => {
      sinon.stub(propertyModel, 'insertProperty').rejects(new Error('Insert error'));

      const response = await request(app).post('/api/property/create').send({ property_name: 'New Property' });
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Insert error');
    });
  });

  describe('PUT /update/:id', () => {
    it('should update an existing property', async () => {
      const updates = { property_name: 'Updated Property' };
      const mockUpdatedProperty = { id: 1, ...updates };

      sinon.stub(propertyModel, 'updateProperty').resolves(mockUpdatedProperty);

      const response = await request(app).put('/api/property/update/1').send(updates);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedProperty);
    });

    it('should return 500 on update error', async () => {
      sinon.stub(propertyModel, 'updateProperty').rejects(new Error('Update error'));

      const response = await request(app).put('/api/property/update/1').send({ property_name: 'Updated Property' });
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Update error');
    });
  });

  describe('DELETE /delete/:id', () => {
    it('should delete a property by ID', async () => {
      sinon.stub(propertyModel, 'deleteProperty').resolves();

      const response = await request(app).delete('/api/property/delete/1');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Property deleted successfully');
    });

    it('should return 500 on delete error', async () => {
      sinon.stub(propertyModel, 'deleteProperty').rejects(new Error('Delete error'));

      const response = await request(app).delete('/api/property/delete/1');
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Delete error');
    });
  });

  describe('Column operations', () => {
    describe('POST /columns/add', () => {
      it('should add a new column', async () => {
        sinon.stub(propertyModel, 'addColumn').resolves();

        const response = await request(app)
          .post('/api/property/columns/add')
          .send({ columnName: 'new_column', columnType: 'VARCHAR' });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Column 'new_column' added successfully");
      });

      it('should return 500 on add column error', async () => {
        sinon.stub(propertyModel, 'addColumn').rejects(new Error('Add column error'));

        const response = await request(app)
          .post('/api/property/columns/add')
          .send({ columnName: 'new_column', columnType: 'VARCHAR' });
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Add column error');
      });
    });

    describe('PUT /columns/rename/:column_name', () => {
      it('should rename an existing column', async () => {
        sinon.stub(propertyModel, 'renameColumn').resolves();

        const response = await request(app)
          .put('/api/property/columns/rename/existing_column')
          .send({ newName: 'renamed_column' });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Column 'existing_column' renamed to 'renamed_column'");
      });

      it('should return 500 on rename column error', async () => {
        sinon.stub(propertyModel, 'renameColumn').rejects(new Error('Rename column error'));

        const response = await request(app)
          .put('/api/property/columns/rename/existing_column')
          .send({ newName: 'renamed_column' });
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Rename column error');
      });
    });

    describe('DELETE /columns/delete/:column_name', () => {
      it('should delete a column', async () => {
        sinon.stub(propertyModel, 'deleteColumn').resolves();

        const response = await request(app).delete('/api/property/columns/delete/existing_column');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Column 'existing_column' deleted successfully");
      });

      it('should return 500 on delete column error', async () => {
        sinon.stub(propertyModel, 'deleteColumn').rejects(new Error('Delete column error'));

        const response = await request(app).delete('/api/property/columns/delete/existing_column');
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Delete column error');
      });
    });

    describe('GET /columns/fetch', () => {
      it('should fetch all columns', async () => {
        const mockColumns = [
          { column_name: 'property_name', data_type: 'VARCHAR' },
          { column_name: 'address', data_type: 'VARCHAR' }
        ];

        sinon.stub(propertyModel, 'getTableColumns').resolves(mockColumns);

        const response = await request(app).get('/api/property/columns/fetch');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockColumns);
      });

      it('should return 500 on error fetching columns', async () => {
        sinon.stub(propertyModel, 'getTableColumns').rejects(new Error('Fetch columns error'));

        const response = await request(app).get('/api/property/columns/fetch');
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Fetch columns error');
      });
    });
  });
});
