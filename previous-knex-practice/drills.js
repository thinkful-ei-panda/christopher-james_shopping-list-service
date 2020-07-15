/* eslint-disable no-console */
/* eslint-disable strict */

//DON'T FORGET YOUR REQUIREMENTS!!!!!!//
require('dotenv').config();
const knex = require('knex');

const database = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});


/****************************************************************/
//1. Get all items that contain text// >>>>>>>>>>>>>>>>>>>>>>>>>>> WORKS!!!
/****************************************************************/
function searchTermInName(searchTerm) {
  database
    .select('*')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log('items that contain', searchTerm);
      console.log(result);
    });
}
searchTermInName('eitan');


/****************************************************************/
//2. Get all items paginated// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> WORKS!!!
/****************************************************************/
function paginateItems(page) {
  const limit = 6;
  const offset = limit * (page - 1);
  database
    .select('*')
    .from('shopping_list')
    .limit(limit)
    .offset(offset)
    .then(result => {
      console.log('items paginated', page, 'pages');
      console.log(result);
    });
}
paginateItems(2);


/****************************************************************/
//3. Get all items added after date// >>>>>>>>>>>>>>>>>>>>>>>>>>>> WORKS!!!
/****************************************************************/
function productsAddedDaysAgo(daysAgo) {
  database
    .select('id', 'name', 'price', 'date_added', 'checked', 'category')
    .from('shopping_list')
    .where(
      'date_added',
      '>',
      database.raw('now() - \'?? days\':: INTERVAL', daysAgo) 
    )
    .then(results => {
      console.log('items added',daysAgo, 'days ago');
      console.log(results);
    });
}
productsAddedDaysAgo(3);


/****************************************************************/
//4. Get the total cost for each category// >>>>>>>>>>>>>>>>>>>>>> WORKS!!!
/****************************************************************/
function totalCostPerCategory() {
  database
    .select('category')
    .sum('price as total')
    .from('shopping_list')
    .groupBy('category')
    .then(result => {
      console.log('total cost for each category');
      console.log(result);
    });
}
totalCostPerCategory();