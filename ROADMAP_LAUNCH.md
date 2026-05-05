# 🚀 Roadmap de Lancement : Capsule Manufacturing

Ce document récapitule les étapes techniques et fonctionnelles nécessaires pour transformer le site vitrine en une plateforme de gestion industrielle (Operating System) pour l'usine.

---

## 🛠 1. Persistance & Leads (Priorité Haute)

*Objectif : Ne perdre aucune demande de devis et commencer à construire la base de données client.*

- [ ] **API Devis** : Créer une route API (`/api/quote`) pour enregistrer les données du formulaire 6 étapes dans Prisma.
- [ ] **Validation Email** : Mettre en place un système d'envoi d'email automatique :
  - Au client : "Nous avons bien reçu votre dossier technique".
  - À l'admin : "Nouveau devis à chiffrer".
- [ ] **Gestion des Fichiers** : Configurer un stockage (ex: Uploadthing ou local) pour les Tech Packs et Patrons envoyés via le formulaire.

## 📦 2. Espace Client (Dashboard V1)

*Objectif : Offrir une expérience "Tech-First" aux marques de vêtements.*

- [ ] **Authentification** : Configurer Next-Auth pour permettre aux clients de se connecter.
- [ ] **Tracking de Production** : Page permettant de voir le statut de ses projets en cours :
  - `QUOTE_PENDING` -> `VALIDATED` -> `RAW_MATERIAL_WAITING` -> `CUTTING` -> `SEWING` -> `QC` -> `SHIPPING`.
- [ ] **Historique** : Accès aux anciens devis et factures.

## 🧵 3. Logistique & Matières Premières

*Objectif : Fluidifier l'arrivée des tissus et fournitures à l'usine.*

- [ ] **Déclaration d'Envoi** : Formulaire permettant au client d'annoncer l'envoi de matière (métrage, couleur, type).
- [ ] **Générateur de Bon de Réception** : Bouton pour générer un PDF (Bon de Livraison) que le client imprime et colle sur ses cartons.
- [ ] **Inventaire Client** : Vue pour le client de ses stocks de tissus restants à l'usine.

## 🏭 4. Interface Admin Factory (Back-Office)

*Objectif : Pilotage de l'usine par Merwan et son équipe.*

- [ ] **Gestionnaire de Devis** : Interface pour voir les devis entrants, modifier les prix finaux et les valider.
- [ ] **Pilotage de Production** : Tableau de bord pour changer le statut des projets d'un clic (déclenche une notification client).
- [ ] **Vue Expéditions** : Préparation des bons d'envoi vers les clients finaux.

## 🌍 5. Finitions & Marketing

*Objectif : Professionnalisme et visibilité.*

- [ ] **SEO & Meta-tags** : Optimiser chaque page pour les mots-clés "Confection Tunisie", "Atelier Textile Premium", etc.
- [ ] **Analytics** : Installation de Google Analytics ou Plausible pour suivre le trafic.
- [ ] **Page "Notre Atelier"** : Section détaillée sur les machines et l'équipe pour rassurer sur la capacité technique.

---

> [!TIP]
> **Prochaine étape suggérée** : Commencer par l'**API Devis** pour rendre le formulaire fonctionnel immédiatement et commencer à stocker des données réelles dans `prisma/schema.prisma`.
