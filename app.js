const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const personnages = require('./models/personnages');

// Connexion à la base de données
var mongoDB = "mongodb://127.0.0.1/masterDungeon";
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', (err) => {
   console.log("Erreur lors de la connexion à la base de données");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view-engine', 'ejs');
app.use(express.static('public'));


app.get('/', (req, res) => {
   personnages.find({}, (err, datas) => {
      // if (err) return console.log(err);
      var listPersonnages = {};
      datas.forEach((data) => {
         listPersonnages[data._id] = data.name;
      });
      res.render('index.ejs', { datas: listPersonnages })
   });
});

// Affiche la fiche de personnage de l'élement possedant l'id passé en parametre

app.get('/fiche/:_id', (req, res) => {
   var id = req.params._id;
   personnages.findById(id, (err, datas) => {
      if (err) { res.redirect('/'); };

      var infoPerso = datas;
      if (infoPerso == undefined) {
         res.redirect('/');
      }
      res.render('fiches.ejs', { data: infoPerso });
   });
})


// Affiche la page d'ajout d'un personnage

app.get('/add', (req, res) => {
   res.render('add.ejs')
});

// Affiche la page de modification d'un personnage

app.get('/edit/:_id?', (req, res) => {
   var id = req.params._id;
   personnages.findById(id, (err, datas) => {
      if (err) { res.redirect('/'); };

      var infoPerso = datas;
      if (infoPerso == undefined) {
         res.redirect('/');
      }
      res.render('modif.ejs', { data: infoPerso });
   });
});


// Ajoute un personnage à la base de données

app.post('/add', (req, res) => {
   var Name = req.body.characterName;
   var Pv = req.body.characterPv;
   var Ca = req.body.characterCa;
   var Race = req.body.characterRace;
   var SubRace = req.body.characterSubRace;
   var Classe = req.body.characterClasse;
   var SubClasse = req.body.characterSubClasse;
   var Dex = req.body.characterDex;
   var For = req.body.characterFor;
   var Con = req.body.characterCon;
   var Int = req.body.characterInt;
   var Sag = req.body.characterSag;
   var Cha = req.body.characterCha;
   var Competence = req.body.characterCompetence;
   var Armes = req.body.characterArmes;
   var Armures = req.body.characterArmures;
   var Armes = Armes.split(',');
   var Armures = Armures.split(',');
   var Description = req.body.characterDescri;
   var DescriptionCara = req.body.characterDescriCara;
   
   var perso = new personnages({
      name: Name,
      race: Race,
      subRace: SubRace,
      classe: Classe,
      subClasse: SubClasse,
      pv: Pv,
      ca: Ca,
      caracteristiques: {
         dexterite: Dex,
         force: For,
         constitution: Con,
         intelligence: Int,
         sagesse: Sag,
         charisme: Cha
      },
      competences: Competence,
      armes: Armes,
      armures: Armures,
      description: Description,
      descriptionCara: DescriptionCara
   });
   perso.save((err, data) => {
      if (err) return console.error(err);
      console.log(perso.name + " ajouté à la base de données !");
      res.redirect('/');
   });
});

// Modifie un personnage

app.post('/edit/:_id?', (req, res) => {
   var id = req.params._id;

   // Récupère les données modifiées
   var Pv = req.body.characterPv;
   var Ca = req.body.characterCa;
   var Dex = req.body.characterDex;
   var For = req.body.characterFor;
   var Con = req.body.characterCon;
   var Int = req.body.characterInt;
   var Sag = req.body.characterSag;
   var Cha = req.body.characterCha;
   var Armes = req.body.characterArmes;
   var Armures = req.body.characterArmures;
   var Armes = Armes.split(',');
   var Armures = Armures.split(',');
   var Description = req.body.characterDescri;
   var DescriptionCara = req.body.characterDescriCara;


   personnages.findByIdAndUpdate(id, {
      pv: Pv,
      ca: Ca,
      caracteristiques: {
         dexterite: Dex,
         force: For,
         constitution: Con,
         intelligence: Int,
         sagesse: Sag,
         charisme: Cha
      },
      armes: Armes,
      armures: Armures,
      description: Description,
      descriptionCara: DescriptionCara
   },(err) => {
      if (err) { res.redirect('/'); };
      res.redirect('/');
   });
});

// Supprime le personnages dont l'id est passé en paramètre

app.get('/delete/:_id', (req, res) => {
   var id = req.params._id;
   personnages.deleteOne({ _id: id }, (err) => {
      if (err) return console.log(err);
      console.log("Le personnage a bien été supprimé de la base de données");
   });
   res.redirect('/');
});
app.listen(3000);