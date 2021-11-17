'use strict';
// catController

// Controller

'use strict';
const { validationResult } = require('express-validator');
const { getAllCats, getCat, addCat, modifyCat, deleteCat } = require('../models/catModel');
const { httpError } = require('../utils/errors');

//const cats = catModel.cats;

const cat_list_get = async (req, res, next) => {
  try {
    const cats = await getAllCats(next);
    if(cats.length > 0){
      res.json(cats);
    }
    else {
      next('No cats found', 404);
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
  console.log('cat_post', req.body, req.file, req.user);
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    console.log('cat_post validation', errors.array());
    next(httpError('invalid data', 400));
    return;
  }
  if (!req.file){
    const err = httpError('file not valid', 400);
    next(err);
    return;
    }
  try {
      const { name, birthdate, weight } = req.body;
      const tulos = await addCat(
        name,
        weight,
        req.user.user_id,
        req.file.filename, 
        birthdate,
        next);
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
    console.log('cat_post error', error.message);
    next(httpError('internal server error', 500));
  }
};

const cat_put = async (req, res, next) => {
  console.log('cat_put', req.body, req.params);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('cat_put validation', errors.array());
    next(httpError('invalid data', 400));
    return;
  }
  // pvm VVVV-KK-PP esim 2010-05-28
  try {
    const { name, birthdate, weight } = req.body;
    /*let owner = req.user.user_id;
    if (req.user.role === 0) {
      owner = req.body.owner;
    }*/

    const owner = req.user.role === 0 ? req.body.owner : req.user.user_id;

    const tulos = await modifyCat(
      name,
      weight,
      owner,
      birthdate,
      req.params.id,
      req.user.role,
      next
    );
    if (tulos.affectedRows > 0) {
      res.json({
        message: 'cat modified',
        cat_id: tulos.insertId,
      });
    } else {
      next(httpError('No cat modified', 400));
    }
  } catch (e) {
    console.log('cat_put error', e.message);
    next(httpError('internal server error', 500));
  }
};

const cat_delete = async (req, res, next) => {
  try {
    const vastaus = await deleteCat(req.params.id, req.user.user_id, req.user.role, next);
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
