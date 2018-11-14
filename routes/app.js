var express = require('express');
var admin = require('firebase-admin');
var app = express();
var async = require('async');


// Instancia de Base de datos
const db = admin.firestore();

// Rutas
app.post('/reserva', (req, res) => {

    var body = req.body;
    var tokenSend = new Array;


    var docRef = db.collection('notifications').doc();

    var setData = docRef.set({
        tipo: 'reserva',
        reserva_id : parseInt(body.reserva_id),
        propiedad_id : parseInt(body.propiedad_id),
        date: new Date()
    });

    db.collection('devices').get()
        .then((snapshot) => {

            snapshot.forEach((doc) => {
                
                let data = doc.data();

                if (body.propiedad_id == data.propiedad_id) {
                    tokenSend.push(data.token);
                }

                async.each(tokenSend, function(token, callback){
                    let message = {
                        data: {
                            body : "Reserva motor",
                            reserva_id : body.reserva_id
                        },
                        token: token
                    };
            
                    admin.messaging().send(message)
                        .then((response) => {
                            console.log('Notificacion enviada :', response);
                        })
                        .catch((error) => {
                            console.log('Error sending message:', error);
                        });
            
                });
            });
            
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });

});

app.get('/notificaciones/:propiedad_id', (req, res) => {

    var propiedad_id = req.params.propiedad_id;
    var datos = new Array;
    db.collection('notifications').get()
        .then((snapshot) => {

            snapshot.forEach((doc) => {
                
                let data = doc.data();
                if (data.propiedad_id == propiedad_id) {
                    // console.log(data);
                    // data.date = new Date(data.date._seconds * 1000);
                    // data.date = data.date.toGMTString();
                    datos.push(data);
                }
            });

            res.status(200).json({
                ok: true,
                notificaciones: datos
            });
            
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });

});

app.delete('/:id', (req, res)=>{
    
    var id = req.params.id;
    id = parseInt(id);
    
    var notificacion_ref = db.collection('notifications');

    var queryRef = notificacion_ref.where('reserva_id', '==', id);
   

    queryRef.get().then(function(querySnapshot){
        
        if (!querySnapshot.docs.length) {
            res.status(200).json({
                ok: false,
                message: `Error, no se ha encontrado documento con el id : ${id}`
            });
        }

        querySnapshot.forEach(function(doc){
            console.log('entra 2');
            
            doc.ref.delete().then(() => {
                res.status(200).json({
                    ok: true,
                    message: "Documento borrado con exito"
                });
            }).catch(function(error) {
                res.status(200).json({
                    ok: false,
                    message: `Error: ${error}`
                });
            });
        });
    })
    .catch(function(error) {
        res.status(200).json({
            ok: false,
            message: `Error: ${error}`
        });
    });
    

});

module.exports = app;