const express = require('express');
const cors = require('cors');
const Admin = require('./models/admin');
const Professeur = require('./models/professeur');
const Administration = require('./models/administration');
const Etudiant = require('./models/etudiant');
const Classe = require('./models/classe');
const Matiere = require('./models/matiere');
const EmploiDuTemps = require('./models/emploidutemps');
const Note = require('./models/note');
const Absence = require('./models/absence');
const mongoose = require('mongoose');
const DemandeCompte = require('./models/demandecompte');




require('./config/connect');

const app = express();

app.use(cors()); 
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Connexion OK' });
});

// CLASSES
app.post('/add-classe', (req, res) => {
  const cls = new Classe(req.body);
  cls.save()
    .then((saved) => res.status(200).send(saved))
    .catch((err) => res.status(400).send(err));
});

app.get('/get-classes', (req, res) => {
  Classe.find()
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send(err));
});

app.put('/update-classe/:id', (req, res) => {
  Classe.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updated) => res.status(200).send(updated))
    .catch((err) => res.status(400).send(err));
});

app.delete('/delete-classe/:id', (req, res) => {
  Classe.findByIdAndDelete(req.params.id)
    .then((deleted) => res.status(200).send(deleted))
    .catch((err) => res.status(400).send(err));
});

//  MATIERES 
app.post('/add-matiere', (req, res) => {
  const matiere = new Matiere(req.body);
  matiere.save()
    .then((saved) => res.status(200).send(saved))
    .catch((err) => res.status(400).send(err));
});

app.get('/get-matieres', (req, res) => {
  Matiere.find().populate('classe').populate('professeur')
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send(err));
});

app.get('/get-matieres-by-classe/:classeId', (req, res) => {
  Matiere.find({ classe: req.params.classeId })
    .populate('professeur')
    .populate('profsAutorises')
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send(err));
});

app.put('/update-matiere/:id', async (req, res) => {
  try {
    const matiereId = req.params.id;
    const matiere = await Matiere.findByIdAndUpdate(matiereId, req.body, { new: true });
    
    if (req.body.professeur) {
      const result = await EmploiDuTemps.updateMany(
        { matiere: matiereId },
        { $set: { professeur: req.body.professeur } }
      );
      console.log('updateMany result:', result);
    }
    
    res.status(200).send(matiere);
  } catch (err) {
    console.log('erreur update-matiere:', err);
    res.status(400).send(err);
  }
});
app.delete('/delete-matiere/:id', (req, res) => {
  Matiere.findByIdAndDelete(req.params.id)
    .then((deleted) => res.status(200).send(deleted))
    .catch((err) => res.status(400).send(err));
});

//  PROFESSEURS 
app.post('/add-professeur', async (req, res) => {
  try {
    const prof = new Professeur(req.body);
    const savedProf = await prof.save();
    res.status(200).send(savedProf);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/get-professeurs', async (req, res) => {
  try {
    const professeurs = await Professeur.find().populate('matieresAutorisees');
    const profsAvecMatieres = await Promise.all(
      professeurs.map(async (prof) => {
        const matieres = await Matiere.find({ professeur: prof._id }).populate('classe');
        return {
          _id: prof._id,
          nom: prof.nom,
          prenom: prof.prenom,
          email: prof.email,
          telephone: prof.telephone,
          matieresAutorisees: prof.matieresAutorisees,
          matieres: matieres
        };
      })
    );
    res.status(200).json(profsAvecMatieres);
  } catch (err) {
    res.status(400).send(err);
  }
});
app.put('/update-matieres-autorisees/:id', async (req, res) => {
  try {
    const updated = await Professeur.findByIdAndUpdate(
      req.params.id,
      { matieresAutorisees: req.body.matieresAutorisees },
      { new: true }
    );
    res.status(200).send(updated);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete('/delete-professeur/:id', (req, res) => {
  Professeur.findByIdAndDelete(req.params.id)
    .then((deleted) => res.status(200).send(deleted))
    .catch((err) => res.status(400).send(err));
});

app.put('/affecter-matieres-prof/:id', (req, res) => {
  Professeur.findByIdAndUpdate(req.params.id, { matieres: req.body.matieres }, { new: true })
    .then((updated) => res.status(200).send(updated))
    .catch((err) => res.status(400).send(err));
});

// ADMINISTRATION 
app.post('/add-administration', (req, res) => {
  const admi = new Administration(req.body);
  admi.save()
    .then((saved) => res.status(200).send(saved))
    .catch((err) => res.status(400).send(err));
});

app.get('/get-administrations', (req, res) => {
  Administration.find()
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send(err));
});

app.put('/update-administration/:id', (req, res) => {
  Administration.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updated) => res.status(200).send(updated))
    .catch((err) => res.status(400).send(err));
});

app.delete('/delete-administration/:id', (req, res) => {
  Administration.findByIdAndDelete(req.params.id)
    .then((deleted) => res.status(200).send(deleted))
    .catch((err) => res.status(400).send(err));
});
// Login administration
app.post('/login-administration', async (req, res) => {
  const { email, password } = req.body;
  console.log('email reçu:', email);
  console.log('password reçu:', password);
  try {
    const adm = await Administration.findOne({ email });
    console.log('administration trouvée:', adm);
    if (!adm) return res.status(401).json({ message: "Utilisateur introuvable" });
    if (adm.password !== password) return res.status(401).json({ message: "Mot de passe incorrect" });
    res.status(200).json({ message: "Connexion réussie", administration: adm });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
});
// Mot de passe oublié administration
app.post('/forgot-password-administration', async (req, res) => {
  const { email } = req.body;
  try {
    const adm = await Administration.findOne({ email });
    if (!adm) return res.status(404).json({ message: "Email introuvable" });
    await transporter.sendMail({
      from: 'ton.email@gmail.com',
      to: email,
      subject: 'Mot de passe - Espace Administration',
      html: `
        <h2>Bonjour ${adm.nom} ${adm.prenom}</h2>
        <p>Votre mot de passe est : <strong>${adm.password}</strong></p>
        <p>Connectez-vous sur votre espace administration.</p>
      `
    });
    res.status(200).json({ message: "Mot de passe envoyé par email !" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ETUDIANTS 
app.post('/add-etudiant', (req, res) => {
  const etu = new Etudiant(req.body);
  etu.save()
    .then((saved) => res.status(200).send(saved))
    .catch((err) => res.status(400).send(err));
});

app.get('/get-etudiants', (req, res) => {
  Etudiant.find().populate('classe')
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send(err));
});

app.put('/update-etudiant/:id', (req, res) => {
  Etudiant.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updated) => res.status(200).send(updated))
    .catch((err) => res.status(400).send(err));
});

app.delete('/delete-etudiant/:id', (req, res) => {
  Etudiant.findByIdAndDelete(req.params.id)
    .then((deleted) => res.status(200).send(deleted))
    .catch((err) => res.status(400).send(err));
});

app.put('/affecter-etudiant-classe/:id', (req, res) => {
  Etudiant.findByIdAndUpdate(req.params.id, { classe: req.body.classe }, { new: true })
    .then((updated) => res.status(200).send(updated))
    .catch((err) => res.status(400).send(err));
});

// Login étudiant
app.post('/login-etudiant', async (req, res) => {
  const { email, password } = req.body;
  try {
    const etudiant = await Etudiant.findOne({ email }).populate('classe');
    if (!etudiant) return res.status(401).json({ message: "Étudiant introuvable" });
    if (etudiant.password !== password) return res.status(401).json({ message: "Mot de passe incorrect" });
    res.status(200).json({ message: "Connexion réussie", etudiant });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
});

// Notes par étudiant
app.get('/get-notes-by-etudiant/:etudiantId', async (req, res) => {
  try {
    const notes = await Note.find({ etudiant: req.params.etudiantId })
      .populate('matiere');
    res.status(200).send(notes);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Absences par étudiant
app.get('/get-absences-by-etudiant/:etudiantId', async (req, res) => {
  try {
    const absences = await Absence.find({ etudiant: req.params.etudiantId })
      .populate('matiere');
    res.status(200).send(absences);
  } catch (err) {
    res.status(400).send(err);
  }
});






// ADMIN 
app.post('/add-admin', (req, res) => {
  const adm = new Admin(req.body);
  adm.save()
    .then((savedAdmin) => res.status(200).send(savedAdmin))
    .catch((err) => res.status(400).send(err));
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Admin.findOne({ email: email });
    if (!user) return res.status(401).json({ message: "Utilisateur introuvable" });
    if (user.password !== password) return res.status(401).json({ message: "Mot de passe incorrect" });
    res.status(200).json({ message: "Connexion réussie", user });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
});






// verifie que un classe a une seance deja dans cet heure
app.post('/add-emploi', async (req, res) => {
  try {
    const { classe, professeur, jour, heureDebut } = req.body;

    const conflitClasse = await EmploiDuTemps.findOne({ classe, jour, heureDebut });
    if (conflitClasse) {
      return res.status(400).json({ 
        message: ` Cette classe a déjà une séance le ${jour} à ${heureDebut}` 
      });
    }
// verifie que un prof a une seance deja dans cet heure
    const conflitProf = await EmploiDuTemps.findOne({ professeur, jour, heureDebut });
    if (conflitProf) {
      return res.status(400).json({ 
        message: ` Ce professeur a déjà une séance le ${jour} à ${heureDebut}` 
      });
    }

    const emploi = new EmploiDuTemps(req.body);
    const saved = await emploi.save();
    res.status(200).send(saved);
  } catch (err) {
    res.status(400).send(err);
  }
});


app.get('/get-emploi-by-classe/:classeId', async (req, res) => {
  try {
    const emplois = await EmploiDuTemps.find({ classe: req.params.classeId })
      .populate('matiere')
      .populate('professeur');
    res.status(200).send(emplois);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete('/delete-emploi/:id', async (req, res) => {
  try {
    const deleted = await EmploiDuTemps.findByIdAndDelete(req.params.id);
    res.status(200).send(deleted);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/get-emploi-by-professeur/:profId', async (req, res) => {
  try {
    const emplois = await EmploiDuTemps.find({ professeur: req.params.profId })
      .populate('matiere')
      .populate('classe');
    res.status(200).json(emplois);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
});





app.post('/login-professeur', async (req, res) => {
  const { email, password } = req.body;
  try {
    const prof = await Professeur.findOne({ email });
    if (!prof) return res.status(401).json({ message: "Professeur introuvable" });
    if (prof.password !== password) return res.status(401).json({ message: "Mot de passe incorrect" });
    res.status(200).json({ message: "Connexion réussie", professeur: prof });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
});






// NOTES
app.post('/add-note', async (req, res) => {
  try {
    const note = new Note(req.body);
    const saved = await note.save();
    res.status(200).send(saved);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/get-notes-by-matiere/:matiereId', async (req, res) => {
  try {
    const notes = await Note.find({ matiere: req.params.matiereId })
      .populate('etudiant');
    res.status(200).send(notes);
  } catch (err) {
    res.status(400).send(err);
  }
});

// ABSENCES
app.post('/add-absence', async (req, res) => {
  try {
    console.log('data reçu:', req.body);
    
    // Vérifier si une absence existe déjà pour cet étudiant, cette matière et cette date
    const existante = await Absence.findOne({
      etudiant: req.body.etudiant,
      matiere: req.body.matiere,
      date: {
        $gte: new Date(req.body.date),
        $lt: new Date(new Date(req.body.date).getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (existante) {
      // Mettre à jour l'existante
      const updated = await Absence.findByIdAndUpdate(existante._id, req.body, { new: true });
      return res.status(200).send(updated);
    }

    const absence = new Absence(req.body);
    const saved = await absence.save();
    res.status(200).send(saved);
  } catch (err) {
    console.log('erreur absence:', err.message);
    res.status(400).send(err);
  }
});

app.get('/get-absences-by-matiere/:matiereId', async (req, res) => {
  try {
    const absences = await Absence.find({ matiere: req.params.matiereId })
      .populate('etudiant');
    res.status(200).send(absences);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/get-absences-by-seance/:matiereId/:date', async (req, res) => {
  try {
    const absences = await Absence.find({
      matiere: req.params.matiereId,
      date: {
        $gte: new Date(req.params.date),
        $lt: new Date(new Date(req.params.date).getTime() + 24 * 60 * 60 * 1000)
      }
    }).populate('etudiant');
    res.status(200).send(absences);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.put('/update-absence/:id', async (req, res) => {
  try {
    const updated = await Absence.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(updated);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete('/delete-absence/:id', async (req, res) => {
  try {
    const deleted = await Absence.findByIdAndDelete(req.params.id);
    res.status(200).send(deleted);
  } catch (err) {
    res.status(400).send(err);
  }
});



app.get('/get-absences-by-classe/:classeId/:date', async (req, res) => {
  try {
    // D'abord trouver les étudiants de cette classe
    const etudiants = await Etudiant.find({ classe: req.params.classeId });
    const etudiantIds = etudiants.map(e => e._id);

    // Puis trouver les absences de ces étudiants à cette date
    const absences = await Absence.find({
      etudiant: { $in: etudiantIds },
      date: {
        $gte: new Date(req.params.date),
        $lt: new Date(new Date(req.params.date).getTime() + 24 * 60 * 60 * 1000)
      }
    })
    .populate('etudiant')
    .populate('matiere');

    res.status(200).send(absences);
  } catch (err) {
    console.log('erreur:', err);
    res.status(400).send(err);
  }
});


app.get('/get-matieres-sans-classe', async (req, res) => {
  try {
    const matieres = await Matiere.find({ classe: null })
      .populate('professeur')
      .populate('profsAutorises');
    res.status(200).send(matieres);
  } catch (err) {
    res.status(400).send(err);
  }
});



const nodemailer = require('nodemailer');

// Configuration email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'marammakhlouf2004@gmail.com',  
    pass: 'bbgxliropgrdllto'  
  }
});

// Mot de passe oublié professeur
app.post('/forgot-password-professeur', async (req, res) => {
  const { email } = req.body;
  try {
    const prof = await Professeur.findOne({ email });
    if (!prof) return res.status(404).json({ message: "Email introuvable" });

    await transporter.sendMail({
      from: 'votre.email@gmail.com',
      to: email,
      subject: 'Mot de passe - Espace Professeur',
      html: `
        <h2>Bonjour ${prof.nom} ${prof.prenom}</h2>
        <p>Votre mot de passe est : <strong>${prof.password}</strong></p>
        <p>Connectez-vous sur votre espace professeur.</p>
      `
    });

    res.status(200).json({ message: "Mot de passe envoyé par email !" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Mot de passe oublié étudiant
app.post('/forgot-password-etudiant', async (req, res) => {
  const { email } = req.body;
  try {
    const etu = await Etudiant.findOne({ email });
    if (!etu) return res.status(404).json({ message: "Email introuvable" });

    await transporter.sendMail({
      from: 'votre.email@gmail.com',
      to: email,
      subject: 'Mot de passe - Espace Étudiant',
      html: `
        <h2>Bonjour ${etu.nom} ${etu.prenom}</h2>
        <p>Votre mot de passe est : <strong>${etu.password}</strong></p>
        <p>Connectez-vous sur votre espace étudiant.</p>
      `
    });

    res.status(200).json({ message: "Mot de passe envoyé par email !" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});




app.post('/add-demande', async (req, res) => {
  try {
    const demande = new DemandeCompte(req.body);
    const saved = await demande.save();
    res.status(200).send(saved);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Demandes de comptes
app.post('/add-demande', async (req, res) => {
  try {
    const demande = new DemandeCompte(req.body);
    const saved = await demande.save();
    res.status(200).send(saved);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

app.get('/get-demandes', async (req, res) => {
  try {
    const demandes = await DemandeCompte.find({ statut: 'en_attente' });
    res.status(200).send(demandes);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.put('/accepter-demande/:id', async (req, res) => {
  try {
    const demande = await DemandeCompte.findById(req.params.id);
    if (!demande) return res.status(404).json({ message: "Demande introuvable" });

    if (demande.role === 'Professeur') {
      await new Professeur({
        nom: demande.nom, prenom: demande.prenom,
        email: demande.email, telephone: demande.telephone,
        password: demande.password
      }).save();
    } else if (demande.role === 'Administration') {
      await new Administration({
        nom: demande.nom, prenom: demande.prenom,
        email: demande.email, telephone: demande.telephone,
        password: demande.password
      }).save();
    } else if (demande.role === 'Etudiant') {
      await new Etudiant({
        nom: demande.nom, prenom: demande.prenom,
        email: demande.email, telephone: demande.telephone,
        password: demande.password,
        classe: null
      }).save();
    }

    await DemandeCompte.findByIdAndUpdate(req.params.id, { statut: 'accepte' });
    res.status(200).json({ message: "Compte créé avec succès" });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

app.put('/refuser-demande/:id', async (req, res) => {
  try {
    await DemandeCompte.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Demande refusée et supprimée" });
  } catch (err) {
    res.status(400).send(err);
  }
});


















app.listen(3000, () => {
  console.log('Serveur Node lancé sur port 3000');
});
app.put('/update-profs-autorises/:id', async (req, res) => {
  try {
    const updated = await Matiere.findByIdAndUpdate(
      req.params.id,
      { profsAutorises: req.body.profsAutorises },
      { new: true }
    );
    res.status(200).send(updated);
  } catch (err) {
    res.status(400).send(err);
  }
});

