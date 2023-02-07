// Importar nuestras dependencias
const express = require('express')
const session = require('express-session')
const fileStore = require('session-file-store')(session)

// Instanciar nuestras dependencias
const app = express();
app.use(express.urlencoded({extended: false}));
app.use(session({
    store: new fileStore({path:'./sesiones', ttl:300, retries: 0 }),
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false, maxAge: 60 * 1000} // un minuto de duración de la sesión
}));

// Definir la ruta raiz
app.get('/', (req, res) => {
    const { name } = req.query;
    let {visits} = req.session;

    // Si no inicio una sesión, inicializa visitas
    if(!visits){
        visits = 0;
    }

    // Si no se almaceno un nombre, guarda el nombre ingresado
    if(!req.session.name && name){
        req.session.name = name;
    }

    visits += 1;
    req.session.visits = visits;

    // Devuelva el mensaje apropiado según el número de visitas
    let message;
    if(visits === 1){
        message = `Te damos la bienvenida ${name ?`, ${name}` : ''}`;
    } else {
        message = `${name || 'Visitante'} visitaste la página ${visits} veces`;
    }

    res.send(message)
})

// Definir la ruta "olvidar"

app.get('/olvidar', (req, res) => {
    req.session.destroy(error => {
        if(error){
            res.send({error: error.message});
            return;
        }

        /*const { name } = req.session.name;
        res.send(`Hasta luego ${name || 'Visitante'}`);*/
        res.send('¡Hasta luego!')
    });
});

// Configurar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor ejecutandose en puerto ${port}`);
});