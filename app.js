var express = require('express');
var bodyParser = require('body-parser');
var admin = require('firebase-admin');


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

// Importar rutas
var appRoutes = require('./routes/app');

// Rutas 
app.use('/notificacion', appRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', ' online');
});
