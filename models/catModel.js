'use strict';


const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

const getAllCats = async (next) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM wop_cat'
      );
    return rows;
  } catch (e) {
    console.error('error', e.message);
    next(httpError('Database error', 500));
  }
};


const getCat = async (id, next) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM wop_cat WHERE cat_id = ?', 
      [id]
      );
    return rows;
  } catch (e) {
    console.error('getCat error', e.message);
    next(httpError('Database error', 500));
  }
};

const addCat = async (name, weight, owner, filename, birthdate, next) => {
  try {
    const [rows] = await promisePool.execute(
      'INSERT INTO wop_user (name, weight, owner, filename, birthdate) VALUES (?, ?, ?, ?, ?)', 
      [name, weight, owner, filename, birthdate]
      );
    return rows;
  } catch (e) {
    console.error('addCat error', e.message);
    next(httpError('Database error', 500));
  }
};

const modifyCat = async (name, weight, owner, birthdate, cat_id, next) => {
  try {
    const [rows] = await promisePool.execute(
      "UPDATE wop_cat SET name = ?, weight = ?, owner = ?, birthdate = ? WHERE wop_cat.cat_id = ?;", 
      [name, weight, owner, birthdate, cat_id]
      );
    return rows;
  } catch (e) {
    console.error('modifyCat error', e.message);
    next(httpError('Database error', 500));
  }
};

const deleteCat = async (id, next) => {
  try {
    const [rows] = await promisePool.execute(
      'DELETE FROM wop_cat WHERE cat_id = ?', 
      [id]
      );
    return rows;
  } catch (e) {
    console.error('getCat error', e.message);
    next(httpError('Database error', 500));
  }
};

module.exports = {
  getAllCats,
  getCat,
  addCat,
  modifyCat,
  deleteCat,
};
