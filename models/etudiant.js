const mongoose = require('mongoose');

const EtudiantSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  telephone: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  classe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classe',
    required: true
  },
  ajoutePar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Administration'
  }
});

module.exports = mongoose.model('Etudiant', EtudiantSchema);