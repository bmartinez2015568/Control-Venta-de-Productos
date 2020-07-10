'use strict'

var Bill = require('../models/bill.model');
var ShoppingCart = require('../models/shoppingCart.model');
var Product = require('../models/product.model');
var User = require('../models/user.model');

function saveBill(req, res){
    var adminId = req.params.idA;
    var params = req.body;
    var bill = new Bill()
    var product = new ShoppingCart();

    if(adminId != req.user.sub){
        res.status(403).send({message: 'No puede realizar esta accion'});
    }else{
        if(params.product && params.quantity){
            Bill.findOne({client: adminId, "products._id": params.product}, (err, productFind)=>{
                if(err){
                    res.status(500).send({message: 'Error', err});
                }else if(productFind){
                    res.send({message: 'producto ya registrado'});
                }else{
                    Product.findOne({_id: params.product}, (err, productOk)=>{
                        if(err){
                            res.status(500).send({message: 'Error', err});
                        }else if(productOk){
                            if(productOk.stock >= params.quantity){
                                var stockF = productOk.stock - params.quantity;
                                var soldF = productOk.sold + 1;

                                Product.findOneAndUpdate({_id: params.product}, {stock: stockF, sold: soldF}, {new:true}, (err, updated)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error', err});
                                    }else if(updated){
                                        bill.client = adminId;
                                        bill.date = params.date;
                                        product._id = updated._id;
                                        product.name = updated.name;
                                        product.stock = params.quantity;
                                        product.price = updated.price;
                                        product.subTotal = params.quantity * updated.price;
                                        bill.total = product.subTotal;
                                        
                                        bill.save((err, billSaved)=>{
                                            if(err){
                                                res.status(500).send({message: 'Error', err});
                                            }else if(billSaved){
                                                Bill.findByIdAndUpdate(billSaved._id, {$push:{products: product}}, (err, billUpdated)=>{
                                                    if(err){
                                                        res.status({message: 'Error', err});
                                                    }else if(billUpdated){

                                                        Bill.findById(billSaved._id, (err, bill)=>{
                                                            if(err){
                                                                res.status(500).send({message: 'Error'});
                                                            }else if(bill){
                                                                res.send({message: 'Creacion exitosa', bill: bill});
                                                            }else{
                                                                res.status(404).send({message: 'Creacion fallida'})
                                                            }
                                                        }).populate('client')
                                                    }else{
                                                        res.status(418).send({message: 'Creacion fallida'});
                                                    }
                                                })
                                            }else{
                                                res.status(418).send({message :'Creacion Fallida'});
                                            }
                                        })
                                    }else{
                                        res.status(418).send({message: 'Error inesperado'});
                                    }
                                })
                            }else{
                                res.send({message: 'Producto insuficiente'});
                            }
                        }else{
                            res.status(404).send({message: 'Producto no encontrado'});
                        }
                    })
                }
            })
        }else{
            res.send({message: 'datos insuficientes'});
        }
    }
}

function listBills(req, res){
    var adminId = req.params.idA;
    var params = req.body;

    if(adminId != req.user.sub){
        res.status(403).send({message: 'No puede realizar esta accion'});
    }else{
        if(params.bill){
           var search = {_id: params.bill}
        }else{
            var search = null;
        }

        Bill.find(search, (err, bills)=>{
            if(err){
                res.status(500).send({message: 'Error', err});
            }else if(bills){
                res.send({message: 'Facturas', bills: bills});
            }else{
                res.status(404).send({message: 'Sin datos que mostrar'});
            }
        }).populate('client');
    }
}

function createBillClient(req, res){
    var clientId = req.params.idC;
    var params = req.body;
    var bill = new Bill()
    var product = new ShoppingCart();

    if(clientId != req.user.sub){
        res.status(403).send({message: 'No puede realizar esta accion'});
    }else{
            Bill.findOne({client: clientId, "products._id": params.product}, (err, productFind)=>{
                if(err){
                    res.status(500).send({message: 'Error', err});
                }else if(productFind){
                    res.send({message: 'producto ya registrado'});
                }else{
                    User.findOne({_id: clientId}, (err, client)=>{
                        if(err){
                            res.status({message: 'Error', err});
                        }else if(client){
                            var noproducts = client.shoppingCart.lenght();

                            for(var i=0;i<noproducts;i++){
                                
                            }
                            
                            Product.findOne({_id: client.shoppingCart[0]}, (err, productOk)=>{
                                if(err){
                                    res.status(500).send({message: 'Error', err});
                                }else if(productOk){
        
                                        Product.findOneAndUpdate({_id: client.shoppingCart[0]}, {stock: productOk.stock - client.shoppingCart[0].stock, sold: productOk.sold + 1}, {new:true}, (err, updated)=>{
                                            if(err){
                                                res.status(500).send({message: 'Error 1', err});
                                            }else if(updated){
                                                User.findOne({_id: clientId}, (err, client)=>{
                                                    if(err){
                                                        res.status(500).send({message: 'Error', err});
                                                    }else if(client){


                                                        bill.client = clientId;
                                                        bill.date = new Date();
                                                        product._id = client.shoppingCart[0];
                                                        product.name = client.shoppingCart[0].name;
                                                        product.stock = client.shoppingCart[0].stock;
                                                        product.price = client.shoppingCart[0].price;
                                                        product.subTotal = client.shoppingCart[0].stock * client.shoppingCart[0].price;
                                                        bill.total = product.subTotal;
                                                        
                                                        bill.save((err, billSaved)=>{
                                                            if(err){
                                                                res.status(500).send({message: 'Error', err});
                                                            }else if(billSaved){
                                                                Bill.findByIdAndUpdate(billSaved._id, {$push:{products: product}}, (err, billUpdated)=>{
                                                                    if(err){
                                                                        res.status({message: 'Error', err});
                                                                    }else if(billUpdated){
                                                                        User.findByIdAndUpdate(clientId, {$pull:{shoppingCart:{}}}, (err, updated2)=>{
                                                                            if(err){
                                                                                res.status(500).send({message: 'Error', err})
                                                                            }else if(updated2){
                                                                                Bill.findById(billSaved._id, (err, bill)=>{
                                                                                    if(err){
                                                                                        res.status(500).send({message: 'Error'});
                                                                                    }else if(bill){
                                                                                        res.send({message: 'Creacion exitosa', bill: bill});
                                                                                    }else{
                                                                                        res.status(404).send({message: 'Creacion fallida'})
                                                                                    }
                                                                                }).populate('client')
                                                                            }else{
                                                                                res.status(418).send({message: 'Creacion fallida'});
                                                                            }
                                                                        })
                                                                            }else{
                                                                                res.status(418).send({message: 'Error al limpiar el carrito'})
                                                                            }
                                                                        })
                                                            }else{
                                                                res.status(418).send({message :'Creacion Fallida'});
                                                            }
                                                        })
                                                    }else{
                                                        res.status({message: 'Cliente no encontrado'});
                                                    }
                                                })
                                            }else{
                                                res.status(418).send({message: 'Error inesperado'});
                                            }
                                        })
                                }else{
                                    res.status(404).send({message: 'Producto no encontrado'});
                                }
                            })
                        }
                    });
                }
            })
        }
    }


module.exports = {
    saveBill,
    listBills,
    createBillClient
}