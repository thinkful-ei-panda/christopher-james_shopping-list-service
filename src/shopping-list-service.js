/* eslint-disable strict */
/* use CRUD methods (get, insert, update, delete) */

const ShoppingListService = {

  //GET all items//
  getAllItems(knex) {
    return knex
      .select('*')
      .from('shopping_list');
  },


  //INSERT new item//
  insertItem(knex, newItem) {
    return knex
      .insert(newItem)
      .into('shopping_list')
      .returning('*')
      .then(rows => rows[0]);
  },


  //GET item by id//
  getById(knex, id) {
    return knex
      .from('shopping_list')
      .select('*')
      .where('id', id)
      .first();
  },


  //DELETE item//
  deleteItem(knex, id) {
    return knex('shopping_list')
      .where({ id })
      .delete();
  },


  //UPDATE item//
  updateItem(knex, id, newItemFields) {
    return knex('shopping_list')
      .where({ id })
      .update(newItemFields);
  },

};
  
module.exports = ShoppingListService;