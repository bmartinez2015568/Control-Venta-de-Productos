'use strict'

var User = require('../models/user.model');
var ShoppingCart = require('../models/shoppingCart.model');
var Product = require('../models/product.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function saveUser(req, res){
    var user = new User();
    var params = req.body;

    if( params.name &&
        params.username &&
        params.email &&
        params.phone &&
        params.role &&
        params.password){
            User.findOne({$or:[{username: params.username}, {email: params.email}]}, (err, userFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general, intentelo mas tarde'})
                }else if(userFind){
                    res.send({message: 'usuario o correo ya utilizado'});
                }else{
                    user.name = params.name;
                    user.username = params.username;
                    user.email = params.email;
                    user.phone = params.phone;
                    user.role = params.role;

                    bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                        if(err){
                            res.status(500).send({message: 'Error al encriptar contraseña'});
                        }else if(passwordHash){
                            user.password = passwordHash;

                            user.save((err, userSaved)=>{
                                if(err){
                                    res.status(500).send({message: 'Error general al guardar usuario'});
                                }else if(userSaved){
                                    res.send({message: 'Usuario creado', user: userSaved});
                                }else{
                                    res.status(404).send({message: 'Usuario no guardado'});
                                }
                            });
                        }else{
                            res.status(418).send({message: 'Error inesperado'});
                        }
                    });
                }
            });
    }else{
        res.send({message: 'Ingresa todos los datos'});
    }
}

function login(req, res){
    var params = req.body;

    if(params.username || params.email){
        if(params.password){
            User.findOne({$or:[{username: params.username}, 
                {email: params.email}]}, (err, check)=>{
                    if(err){
                        res.status(500).send({message: 'Error general'});
                    }else if(check){
                        bcrypt.compare(params.password, check.password, (err, passworOk)=>{
                            if(err){
                                res.status(500).send({message: 'Error al comparar'});
                            }else if(passworOk){
                                if(params.gettoken = true){
                                    res.send({token: jwt.createToken(check)});
                                }else{
                                    res.send({message: 'Bienvenido',user:check});
                                }
                            }else{
                                res.send({message: 'Contraseña incorrecta'});
                            }
                        });
                    }else{
                        res.send({message: 'Datos de usuario incorrectos'});
                    }
                });
        }else{
           res.send({message: 'Ingresa tu contraseña'}); 
        }
    }else{
        res.send({message: 'Ingresa tu correo o tu username'});
    }
}

// FUNCIONES DE ADMINISTRADOR
function updateClient(req, res){
    var adminId = req.params.idA;
    var clientId = req.params.idC;
    var update = req.body;

    if(adminId != req.user.sub){
        res.status(403).send({message: 'No puedes realizar esta acción'});
    }else{
        User.findById(clientId, (err, clientFound)=>{
            if(err){
                res.status(500).send({message: 'Error', err});
            }else if(clientFound){
                if(clientFound.role == 'ADMIN'){
                    res.status(403).send({message: 'No puede modificar un usuario con role ADMIN'});
                }else{
                    User.findByIdAndUpdate(clientId, update, {new: true}, (err, clientUpdated)=>{
                        if(err){
                            res.status(500).send({message: 'Error', err});
                        }else if(clientUpdated){
                            res.send({message: 'Actualizacion correcta', client: clientUpdated});
                        }else{
                            res.status(418).send({message: 'Actualizacion fallida'});
                        }
                    })
                }
            }else{
                res.status(404).send({message: 'El Usuario no existe'});
            }
        })
    }
}

function removeClient(req, res){
    var adminId = req.params.idA;
    var clientId = req.params.idC;

    if(adminId != req.user.sub){
        res.status(403).send({message: 'No puede realizar esta acción'});
    }else{
        User.findById(clientId, (err, clientFound)=>{
            if(err){
                res.status(500).send({message: 'Error', err});
            }else if(clientFound){
                if(clientFound.role == 'ADMIN'){
                    res.status(403).send({message: 'No puede eliminar un usuario con role ADMIN'});
                }else{
                    User.findByIdAndRemove(clientId, (err, clientRemoved)=>{
                        if(err){
                            res.status(500).send({message: 'Error', err});
                        }else if(clientRemoved){
                            res.send({message: 'Eliminacion correcta', client: clientRemoved});
                        }else{
                            res.status(418).send({message: 'Eliminacion fallida'});
                        }
                    })
                }
            }else{
                res.status(404).send({message: 'El Usuario no existe'});
            }
        })
    }
}

function listUsers(req, res){
    var adminId = req.params.idA;
    
    if(adminId != req.user.sub){
        res.status(403).send({message: 'No puede realizar esta accion'});
    }else{
        User.find((err, users)=>{
            if(err){
                res.status(500).send({message: 'Error', err});
            }else if(users){
                res.send({users: users});
            }else{
                res.status(404).send({message: 'Sin datos que mostrar'});
            }
        });
    }
}

//FUNCIONES DE CLIENTE
function RegisterClient(req, res){
    var user = new User();
    var params = req.body;

    if( params.name &&
        params.username &&
        params.email &&
        params.phone &&
        params.password){
            User.findOne({$or:[{username: params.username}, {email: params.email}]}, (err, clientFind)=>{
                if(err){
                    res.status(500).send({message: 'Error', err})
                }else if(clientFind){
                    res.send({message: 'usuario o correo ya utilizado'});
                }else{
                    user.name = params.name;
                    user.username = params.username;
                    user.email = params.email;
                    user.phone = params.phone;
                    user.role = 'CLIENTE';

                    bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                        if(err){
                            res.status(500).send({message: 'Error al encriptar contraseña'});
                        }else if(passwordHash){
                            user.password = passwordHash;

                            user.save((err, clientSaved)=>{
                                if(err){
                                    res.status(500).send({message: 'Error general al guardar usuario'});
                                }else if(clientSaved){
                                    res.send({message: 'Cliente creado', user: clientSaved});
                                }else{
                                    res.status(404).send({message: 'Cliente no guardado'});
                                }
                            });
                        }else{
                            res.status(418).send({message: 'Error inesperado'});
                        }
                    });
                }
            });
    }else{
        res.send({message: 'Ingresa todos los datos'});
    }
}

function updateUser(req, res){
    var clientId = req.params.idC;
    var update = req.body;

    if(clientId != req.user.sub){
        res.status(403).send({message: 'No puede realizar esta accion'});
    }else{
        if(update.role){
            res.status(403).send({message: 'No puede actualizar el role'});
        }else{
            User.findByIdAndUpdate(clientId, update, {new: true}, (err, userFound)=>{
                if(err){
                    res.status(500).send({message: 'Error', err});
                }else if(userFound){
                    res.send({message: 'Actualizacion correcta', user: userFound});
                }else{
                    res.status(418).send({message: 'Actualizacion fallida'});
                }
            })
        }
    }
}

function removeUser(req, res){
    var clientId = req.params.idC;
    
    if(clientId != req.user.sub){
        res.status(403).send({message: 'No puede realizar esta accion'});
    }else{
        User.findByIdAndRemove(clientId, (err, userRemoved)=>{
            if(err){
                res.status(500).send({message: 'Error', err});
            }else if(userRemoved){
                res.send({message: 'Eliminacion correcta', userRemoved});
            }else{
                res.status(418).send({message: 'Eliminacion fallida'});
            }
        })
    }
}

function setProduct(req, res){
    var clientId = req.params.idC;
    var params = req.body;
    var shoppingCart = new ShoppingCart();

    if(clientId != req.user.sub){
        res.status(403).send({message: 'No puede realizar esta acción'});
    }else{
        if(params.product && params.stock){
            User.findOne({"shoppingCart._id": params.product}, (err, productFind)=>{
                if(err){
                    res.status(500).send({message: 'Error', err});
                }else if(productFind){
                    res.send({message: 'Producto ya registrado'});
                }else{
                    Product.findOne({_id: params.product}, (err, productOk)=>{
                        if(err){
                            res.status(500).send({message: 'Error', err});
                        }else if(productOk){
                            if(productOk.stock >= params.stock){
                
                                    shoppingCart._id = productOk._id;
                                    shoppingCart.name = productOk.name;
                                    shoppingCart.stock = params.stock;
                                    shoppingCart.price = productOk.price;
                                    shoppingCart.subTotal = params.stock * productOk.price;

                                    User.findByIdAndUpdate(clientId, {$push:{shoppingCart: shoppingCart}}, {new: true}, (err, userUpdated)=>{
                                        if(err){
                                            res.status(500).send({message: 'Error', err});
                                        }else if(shoppingCart){
                                            res.send({user: userUpdated})
                                        }else{
                                            res.status(418).send({message: 'Error inesperado'});
                                        }
                                    })
                        }else{
                            res.send({message: 'Producto insuficiente'})
                        }
                        }else{
                            res.status(404).send({message: 'Producto inexistente'});
                        }
                    })
                }
            })
        }else{
            res.send({message: 'Datos insuficientes'});
        }
    }
}

module.exports = {
    saveUser,
    login,
    updateClient,
    removeClient,
    listUsers,
    RegisterClient,
    updateUser,
    removeUser,
    setProduct
}