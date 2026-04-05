const mongoose = require('mongoose');

const ClasseSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  niveau: {
    type: String,
    required: true
  },
  creePar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
});

module.exports = mongoose.model('Classe', ClasseSchema);