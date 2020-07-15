/* eslint-disable strict */
/*DONT FORGET YOUR REQUIREMENTS!!!!*/
require('dotenv').config();

const { expect } = require('chai');
const supertest = require('supertest');

global.expect = expect;
global.supertest = supertest;