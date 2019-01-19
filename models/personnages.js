var mongoose = require('mongoose');

var PersonnageSchema = new mongoose.Schema({
   name: String,
   race: String,
   subRace: String,
   classe: String,
   subClasse: String,
   pv: Number,
   ca: Number,
   caracteristiques: {
      dexterite: String,
      force: String,
      constitution: String,
      intelligence: String,
      sagesse: String,
      charisme: String
   },
   competences: Array,
   armes: Array,
   armures: Array,
   description: String,
   descriptionCara: String
});

var Personnage = mongoose.model('personnages', PersonnageSchema);

module.exports = Personnage;