/* eslint-disable no-unused-vars */
/* eslint-disable strict */

/* tests for CRUD methods (get, insert, update, delete) */

const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');
const { expect } = require('chai');

describe(`Shopping List Service object`, function() {
  let db;
  let testItems = [
    {
      id: 1,
      name: 'First ITEM',
      date_added: new Date('2050-01-22T16:28:32.615Z'),
      price: '100.00',
      category: 'Main'
    },
    {
      id: 2,
      name: 'Second ITEM',
      date_added: new Date('2200-05-22T16:28:32.615Z'),
      price: '50.00',
      category: 'Snack'
    },
    {
      id: 3,
      name: 'Third ITEM',
      date_added: new Date('1999-12-22T16:28:32.615Z'),
      price: '1.50',
      category: 'Lunch'
    },
    {
      id: 4,
      name: 'Fourth ITEM',
      date_added: new Date('1999-12-22T16:28:32.615Z'),
      price: '0.75',
      category: 'Breakfast'
    },
  ];


// use MOCHA methods (HOOKs): before, after, beforeEach, afterEach //
  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  });

/* Clear the table for a fresh start every time we run the tests */
  before(() => db('shopping_list').truncate());

/* Remove all of the data after each test to prevent "test leak" */
  afterEach(() => db('shopping_list').truncate());

/* Disconnect from database at the end of all tests to end the script */ 
  after(() => db.destroy());



////////////////////////////////////////////////////////////////////////////////
//////////  SHOPPING LIST HAS DATA  ////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
  context(`Given 'shopping_list' has data`, () => {
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testItems);
    });


// TEST : GET ALL ITEMS //
    it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
      const expectedItems = testItems.map(item => ({
        ...item,
        checked: false,
      }));
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql(expectedItems);
        });
    });



// TEST : GET ITEM BY ID //
    it(`getById() resolves an item by id from 'shopping_list' table`, () => {
      const idToGet = 3;
      const thirdItem = testItems[idToGet - 1];
      return ShoppingListService.getById(db, idToGet)
        .then(actual => {
          expect(actual).to.eql({
            id: idToGet,
            name: thirdItem.name,
            date_added: thirdItem.date_added,
            price: thirdItem.price,
            category: thirdItem.category,
            checked: false,
          });
        });
    });



// TEST : DELETE ITEM BY ID //
    it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
      const idToDelete = 3;
      return ShoppingListService.deleteItem(db, idToDelete)
        .then(() => ShoppingListService.getAllItems(db))
        .then(allItems => {
          // copy the test items array without the removed item
          const expected = testItems
            .filter(item => item.id !== idToDelete)
            .map(item => ({
              ...item,
              checked: false,
            }));
          expect(allItems).to.eql(expected);
        });
    });



// TEST : UPDATE ITEM //
    it(`updateItem() updates an item in the 'shopping_list' table`, () => {
      const idOfItemToUpdate = 3;
      const newItemData = {
        name: 'updated title',
        price: '99.99',
        date_added: new Date(),
        checked: true,
      };
      const originalItem = testItems[idOfItemToUpdate - 1];
      return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
        .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
        .then(item => {
          expect(item).to.eql({
            id: idOfItemToUpdate,
            ...originalItem,
            ...newItemData,
          });
        });
    });
  });




////////////////////////////////////////////////////////////////////////////////
//////////  SHOPPING LIST HAS NO DATA  /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
  context(`Given 'shopping_list' has no data`, () => {

// TEST : GET ALL ITEMS EMPTY ARRAY //
    it(`getAllItems() resolves an empty array`, () => {
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql([]);
        });
    });


// TEST : INSERT NEW ITEM //
    it(`insertItem() inserts an item and resolves it with an 'id'`, () => {
      const newItem = {
        name: 'Test new name name',
        price: '5.05',
        date_added: new Date('2020-01-01T00:00:00.000Z'),
        checked: true,
        category: 'Lunch',
      };
      return ShoppingListService.insertItem(db, newItem)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            name: newItem.name,
            price: newItem.price,
            date_added: newItem.date_added,
            checked: newItem.checked,
            category: newItem.category,
          });
        });
    });
  });
});