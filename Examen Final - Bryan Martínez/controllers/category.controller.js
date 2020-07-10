'use strict'

var Category = require('../models/category.model');
var Product = require('../models/product.model');

function saveCategory(req, res){
    var userId = req.params.idU;
    var params = req.body;
    var category = new Category();

    if(userId != req.user.sub){
        res.status(500).send({message: 'No puede crear una categoria'});
    }else{
        if(params.name){
            Category.findOne({name: params.name}, (err, CategoryFound)=>{
                if(err){
                    res.status(500).send({message: 'Error', err});
                }else if(CategoryFound){
                    res.send({message: 'Categoria ya registrada'});
                }else{
                    category.name = params.name;
    
                    category.save((err, categorySaved)=>{
                        if(err){
                            res.status(500).send({message: 'Error', err});
                        }else if(categorySaved){
                            res.send({message: 'Creacion Exitosa', category: categorySaved});
                        }else{
                            res.status(418).send({message: 'Creacion fallida'});
                        }
                    })
                }
            })
        }else{
            res.status(418).send({message: 'Datos insuficientes para crear una categoria'});
        }
    }
}

function listCategories(req, res){
    var params = req.body;
    var userId = req.params.idU;

    if(userId != req.user.sub){
        res.status(403).send({message: 'No tiene permisos para esta accion'});
    }else{
        if(params.category){
            Category.findOne({_id: params.category}, (err, category)=>{
                if(err){
                    res.status(500).send({message: 'Error', err});
                }else if(category){
                    Product.find({category: category._id}, (err, products)=>{
                        if(err){
                            res.status(500).send({message: 'Error', err});
                        }else if(products){
                            res.send({category: category, products: products});
                        }else{
                            res.status(404).send({message: 'Sin datos que mostrar'});
                        }
                    })
                }else{
                    res.status(404).send({message: 'Sin datos que mostrar'});
                }
            })
        }else{
            Category.find((err, categoriesFound)=>{
                if(err){
                    res.status(500).send({message: 'Error', err});
                }else if(categoriesFound){
                    res.send({categories: categoriesFound});
                }else{
                    res.status(404).send({message: 'Sin datos que mostrar vacias'});
                }
            });
        }
    }
}

function updateCategory(req, res){
    var userId = req.params.idU;
    var categoryId = req.params.idC;
    var update = req.body;

    if(userId != req.user.sub){
        res.status(403).send({message: 'No tiene permisos para esta accion'});
    }else{
        Category.findByIdAndUpdate(categoryId, update, {new: true}, (err, categoryUpdated)=>{
            if(err){
                res.status(500).send({message: 'Error', err});
            }else if(categoryUpdated){
                res.send({message: 'Actualizacion correcta', category: categoryUpdated});
            }else{
                res.status(418).send({message: 'Actualizacion fallida'});
            }
        });
    }
}

function removeCategory(req, res){
    var userId = req.params.idU;
    var categoryId = req.params.idC;

    if(userId != req.user.sub){
        res.status(403).send({message: 'No tiene permisos para esta accion'});
    }else{
        Category.findByIdAndRemove(categoryId, (err, categoryRemoved)=>{
            if(err){
                res.status(500).send({message: 'Error', err});
            }else if(categoryRemoved){
                Product.find({category: categoryId}).count((err, count)=>{
                    if(err){
                        res.status(500).send({message: 'Error', err});
                    }else if(count){
                        for(var i=0;i<count;i++){
                            Product.findOneAndUpdate({category: categoryId}, {category: '5e642e1bdb119b1d10ba3276'}, (err, Products)=>{
                            })
                            }res.send({message: 'Eliminacion correcta', category: categoryRemoved});
                    }else{
                        res.status(404).send({message: 'Sin datos que mostrar'});
                    }
                })
            }else{
                res.status(418).send({message: 'Eliminacion Fallida'});
            }
        })
    }
}

module.exports = {
    saveCategory,
    listCategories,
    updateCategory,
    removeCategory
}