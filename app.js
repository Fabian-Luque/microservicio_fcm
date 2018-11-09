var express = require('express');
var bodyParser = require('body-parser');
var admin = require('firebase-admin');
var cors = require('cors');

var serviceAccount = require('./gofeels-pms-firebase-adminsdk-4jspc-5e91c11ac9.json');

// Inicializar variables 
var app = express();

const adminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore(adminApp);
firestore.settings({ timestampsInSnapshots: true });

app.use(bodyParser.urlencoded( {extended: false}))
app.use(bodyParser.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Importar rutas
var appRoutes = require('./routes/app');

// Rutas 
app.use('/notificacion', appRoutes);

// Escuchar peticiones
app.listen(3003, () => {
    console.log('Express server corriendo en el puerto 3003: \x1b[32m%s\x1b[0m', ' online');
});
