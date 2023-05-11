// inclure les dépendances et middlewares
const mysql = require('mysql2')
const express = require('express')
const ejs = require('ejs')
var bodyParser = require('body-parser')
const iniparser = require('iniparser')

// activer les dépendances
let configDB = iniparser.parseSync('./DB.ini')
let app = express()
app.set('view engine', 'ejs')
app.use(express.static('views'))
app.use(express.static('public'))
let mysqlconnexion = mysql.createConnection({
    host: configDB['dev']['host'],
    user: configDB['dev']['user'],
    password: configDB['dev']['password'],
    database: configDB['dev']['dbname']
})
mysqlconnexion.connect((err) => {
    if (!err) console.log('BDD connectée.')
    else console.log('BDD connexion échouée \n Erreur: ' + JSON.stringify(err))
})

// activer le middleware et lancer l'application sur le port 3000
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//app.use(bodyParser.urlencoded({ extended: true })) // pour les formulaires encodés
app.listen(3000, () => console.log('le serveur Livre d\'Or est prêt.'))

// utiliser les routesrs
app.get('/', (req, res) => {
    res.send('Livre d\'Or est actif')
})

// voir tous les messages
app.get('/LivreOr', (req, res) => {
    mysqlconnexion.query('SELECT * FROM tlivre', (err, lignes, champs) => {
        if (!err) {
            console.log(lignes)
            res.render("affichage", { LivreOr: lignes })
        }
    })
})

// chercher les messages contenant ElementSearch dans le champ message (query)
app.get('/search/', (req, res) => {
    let critere = '%' + req.query.msgSearch + '%' //query. Exemple : %you%
    console.log("Find this : " + critere)
    mysqlconnexion.query('SELECT * FROM tlivre WHERE message LIKE ?', [critere],
        (err, lignes, champs) => {
            if (!err) {
                console.log(lignes)
                res.send(lignes)
            }
        })
})

// afficher le formulaire
app.get('/formulaire', (req, res) => {
    res.render('./formulaire')
})

// effacer un message choisi par ID (parameters)
app.delete('/LivreOr/:id', (req, res) => {
    let critere = req.params.id
    console.log("ID = " + critere)
    mysqlconnexion.query('DELETE FROM tlivre WHERE id = ?;', [critere], (err, lignes,
        champs) => {
        if (!err) {
            console.log("Effacement terminé")
            res.send("Effacement terminé")
        } else {
            console.log("Erreur lors de l'effacement")
            res.send("Erreur effacement : " + JSON.stringify(err))
        }
    })
})

// ajouter un message (query)
app.post('/LivreOr', (req, res) => {
    let msgID = req.body.id
    let msgName = req.body.name
    let msgMsg = req.body.msg
    let msgNote = req.body.note
	console.log(req.body);
	console.log("coucou");
    
    console.log(`Ajout msg ID ${msgID} de ${msgName} contenant ${msgMsg} et noté ${msgNote}`)
    let requeteSQL = "INSERT INTO tlivre (id, name, message, evaluation) VALUES"
    requeteSQL = requeteSQL + ' (' + msgID + ',"' + msgName + '","' + msgMsg + '",' + msgNote + ')'
    console.log("Requete : " + requeteSQL)
    mysqlconnexion.query(requeteSQL, (err, lignes, champs) => {
        if (!err) {
            console.log("Insertion terminé");
            res.redirect("/LivreOr");
        } else {
            console.log("Erreur lors de l'enregistrment")
            res.send("Erreur ajout : " + JSON.stringify(err))
        }
    })
})

// voir un message choisi par ID (parameters)
app.get('/LivreOr/:id', (req, res) => {
    let critere = req.params.id
    console.log("ID = " + critere)
    mysqlconnexion.query('SELECT * FROM tlivre WHERE id = ?', [critere], (err,
        lignes, champs) => {
        if (!err) {
            console.log(lignes)
            res.send(lignes)
        }
    })
})

// effacer un message choisi par ID (parameters)
app.delete('/LivreOr/:id', (req, res) => {
    let critere = req.params.id
    console.log("ID = " + critere)
    mysqlconnexion.query('DELETE FROM tlivre WHERE id = ?', [critere], (err, lignes,
        champs) => {
        if (!err) {
            console.log("Effacement terminé")
            res.send("Effacement terminé")
        } else {
            console.log("Erreur lors de l'effacement")
            res.send("Erreur effacement : " + JSON.stringify(err))
        }
    })
})
