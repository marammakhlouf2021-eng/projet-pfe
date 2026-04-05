const mongoose = require('mongoose');

const MatiereSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  coefficient: { type: Number, default: 1 },
  classe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classe'
  },
  professeur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professeur'
  },
  profsAutorises: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professeur'
  }]
});

module.exports = mongoose.model('Matiere', MatiereSchema);