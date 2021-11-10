'use strict';
// catController

// Controller

'use strict';
const { getAllCats, getCat, addCat, modifyCat } = require('../models/catModel');
const { httpError } = require('../utils/errors');

//const cats = catModel.cats;

const cat_list_get = async (req, res, next) => {
  try {
    const cats = await getAllCats(next);
    if(cats.length > 0){
      res.json(cats);
    }
    else {
      next(httpError('No cats found', 404));
    }
  }
  catch (e) {
    console.log('cat_list_get error', e.message);
    next(httpError('internal server error', 500));
  }
};

const cat_get = async (req, res, next) => {
  try {
    const vastaus = await getCat(req.params.id, next);
    if(vastaus.length > 0){
      res.json(vastaus.pop());
    }
    else {
      next(httpError('No cats found', 404));
    }
  }
  catch (e) {
    console.log('cat_get error', e.message);
    next(httpError('internal server error', 500));
  }
};

const cat_post = async (req, res, next) => {
  // päivämäärä VVVV-KK-PP esim 2015-05-15
  try {
      const { name, birthdate, weight, owner, filename } = req.body;
      const tulos = await addCat(name, weight, owner, birthdate, req.file.filename, next);
      if(tulos.affectedRows > 0){
        res.json({
            message: "cat added",
            cat_id: tulos.insertId,
        });
      }
      else {
        next(httpError('No cat inserted', 400));
      }
  } catch (error) {
    console.log('cat_post error', e.message);
    next(httpError('internal server error', 500));
  }
};

const cat_put = async (req, res, next) => {
  try {
      const { name, birthdate, weight, owner, id } = req.body;
      const tulos = await modifyCat(name, weight, owner, birthdate, id, next);
      if(tulos.affectedRows > 0){
        res.json({
            message: "cat modified",
            cat_id: tulos.insertId,
        });
      }
      else {
        next(httpError('No cat modified', 400));
      }
  } catch (error) {
    console.log('cat_put error', e.message);
    next(httpError('internal server error', 500));
  }
};

const cat_delete = async (req, res, next) => {
  try {
    const vastaus = await deleteCat(req.params.id, next);
    if(vastaus.affectedRows > 0){
      res.json({
      message: 'cat deleted',
      cat_id: vastaus.insertId
    });
    }
    else {
      next(httpError('No cats found', 404));
    }
  }
  catch (e) {
    console.log('cat_delete error', e.message);
    next(httpError('internal server error', 500));
  }
};

module.exports = {
  cat_list_get,
  cat_get,
  cat_post,
  cat_put,
  cat_delete,
};
