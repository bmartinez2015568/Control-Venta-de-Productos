'use strict'

var Product = require('../models/product.model');


function saveProduct(req, res){
    var product = new Product();
    var userId = req.params.idU;
    var params = req.body;

    if(userId != req.user.sub){
        res.status(403).send({message: 'No tiene permisos para esta ruta'});
    }else{
        if(params.name && params.stock && params.price){
            Product.findOne({name: params.name},  (err, productOk)=>{
                if(err){
                    res.status(500).send({message: 'Error general', err});
                }else if(productOk){
                    res.send({message: 'producto ya registrado'});
                }else{
                    product.name = params.name;
                    product.stock = params.stock;
                    product.price = params.price;
                    product.category = params.category;
                    product.sold = 0;
    
                    product.save((err, productSaved)=>{
                        if(err){
                            res.status(500).send({message: 'Error', err});
                        }else if(productSaved){
                            res.send({message: 'Creación de producto éxitoso', product: productSaved})
                        }else{
                            res.status(418).send({message: 'Creación de producto fallida'});
                        }
                    })
                }
            })
        }else{
            res.send({message: 'Datos insuficientes'})
        }
    }
}

function updateProduct(req, res){
    var userId = req.params.idU;
    var productId = req.params.idP;
    var update = req.body;

    if(userId != req.user.sub){
        res.status(403).send({message: 'No puede modificar el producto'});
    }else{
        Product.findByIdAndUpdate(productId, update, {new:true}, (err, productUpdated)=>{
            if(err){
                res.status(500).send({message: 'Error', err});
            }else if(productUpdated){
                res.send({message: 'Actualizacion correcta', product: productUpdated})
            }else{
                res.status(418).send({message: 'Actualizacion fallida'});
            }
        })
    }
}

function removeProduct(req, res){
    var userId = req.params.idU;
    var productId = req.params.idP;
    
    if(userId != req.user.sub){
        res.status(403).send({message: 'No puede eliminar el producto'});
    }else{
        Product.findByIdAndRemove(productId, (err, productRemoved)=>{
            if(err){
                res.status(500).send({message: 'Error', err});
            }else if(productRemoved){
                res.send({message: 'Eliminacion correcta', product: productRemoved});
            }else{
                res.status(418).send({message: 'Eliminacion Fallida'});
            }
        })
    }
}

function listProducts(req, res){
    var userId = req.params.idU;

    if(userId != req.user.sub){
        res.status(403).send({message: 'No puede realizar esta accion'});
    }else{
        Product.find((err, ProductsFound)=>{
            if(err){
                res.status(500).send({message: 'Error', err});
            }else if(ProductsFound){
                res.send({products: ProductsFound});
            }else{
                res.status(404).send({message: 'Sin Productos que mostrar'});
            }
        }).populate('category')
    }
}

function productsSoldOut(req, res){
    var adminId = req.params.idA;

    if(adminId != req.user.sub){
        res.status(403).send({message: 'No puede realizar esta accion'});
    }else{
        Product.find({stock: 0}, (err, productsFound)=>{
            if(err){
                res.status(500).send({message: 'Error', err});
            }else if(productsFound){
                res.send({message: 'Productos Agotados', products: productsFound});
            }else{
                res.status({message: 'Sin datos que mostrar'});
            }
        })
    }
}

function productSold(req, res){
    var userId = req.params.idU;

    if(userId != req.user.sub){
        res.status(403).send({message: 'No puede realizar esta accion'});
    }else{
        Product.find((err, products)=>{
            if(err){
                res.status(500).send({message: 'Error', err});
            }else if(products){
                res.send({products: products});
            }else{
                res.status(404).send({message: 'Sin datos que mostrar'});
            }
        }).sort({sold: -1}).limit(3)
    }
}

function searchProductName(req, res){
    var clientId = req.params.idC;
    var params = req.body;

    if(clientId != req.user.sub){
        res.status(500).send({message: 'Error', err});
    }else{
        Product.find({name: params.search}, (err, products)=>{
            if(err){
                res.status(500).send({message: 'Error', err});
            }else if(products){
                res.send({message: 'Busqueda correcta', product: products});
            }else{
                res.status(404).send({message: 'Sin datos que mostrar'});
            }
        })
    }
}

module.exports = {
    saveProduct,
    updateProduct,
    removeProduct,
    listProducts,
    productsSoldOut,
    productSold,
    searchProductName
}