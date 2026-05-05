# 🚀 Roadmap de Lancement : Capsule Manufacturing (Avancement: 85%)

Ce document récapitule les étapes techniques et fonctionnelles accomplies et celles restantes pour finaliser la plateforme de gestion industrielle (ERP) et l'espace client.

---

## ✅ 1. Moteur de Chiffrage & Vitrine (100%)

*Objectif : Offrir un outil de devis public automatisé et une image premium.*

- [x] **Design & UI** : Charte graphique Or & Carbone, Glassmorphism, animations fluides.
- [x] **Devis Dynamique** : Formulaire en 6 étapes calculant le prix selon le produit, grammage, quantité, marquage et finitions.
- [x] **Gestion des Fichiers** : Upload sécurisé des Tech Packs et Patrons via le formulaire.
- [x] **Persistance (Base de données)** : Enregistrement complet des devis dans Prisma.

## ✅ 2. Espace Client (Les Marques) (90%)

*Objectif : Offrir une expérience "Tech-First" et transparente aux marques.*

- [x] **Authentification** : Connexion via Next-Auth (Magic Links).
- [x] **Tableau de Bord** : Liste des devis et productions en cours.
- [x] **Paiement & Validation** : Possibilité de valider un devis et de saisir son adresse de livraison (formulaire structuré premium).
- [x] **Tracking Temps Réel** : Timeline animée permettant de suivre l'avancement exact de la production (Coupe, Couture, QC, etc.).
- [ ] **Historique / Facturation** : Génération et téléchargement des factures (Optionnel pour V1).

## ✅ 3. Interface Admin Factory (L'Usine) (95%)

*Objectif : Pilotage centralisé de la production par l'équipe Capsule.*

- [x] **Authentification Admin** : Accès restreint.
- [x] **Gestionnaire de Devis** : Consultation des demandes, téléchargement des Tech Packs, ajustement du prix final et validation.
- [x] **Pilotage de Production** : Transformation des devis payés en "Projets". Modification des statuts de production en 1 clic.
- [x] **Logistique Sortante** : Affichage des adresses de livraison des clients.
- [x] **Générateur de Bordereaux** : Création automatique d'un Bon de Livraison A4 en PDF, prêt à être imprimé.

## ⏳ 4. Communications & Emails (Priorité Absolue)

*Objectif : Remplacer la simulation actuelle par de vrais envois d'emails.*

- [ ] **Configuration Provider** : Brancher Resend ou un serveur SMTP.
- [ ] **Emails Transactionnels** :
  - Envoi du Magic Link de connexion.
  - Alerte Admin : "Nouveau devis reçu".
  - Alerte Client : "Votre devis a été validé par l'atelier".
  - Alerte Client : "Votre production avance (changement de statut)".

## 📦 5. Logistique Entrante & Matières (Optionnel V1)

*Objectif : Fluidifier l'arrivée des tissus fournis par les clients à l'usine.*

- [ ] **Déclaration d'Envoi (Client)** : Formulaire permettant au client d'annoncer l'envoi de matière (métrage, couleur, tracking DHL).
- [ ] **Inventaire Client** : Vue des stocks de tissus restants à l'usine.

## 🌍 6. Mise en Production (Launch)

*Objectif : Déploiement et finalisation business.*

- [ ] **Paiement Stripe** : Remplacer le bouton de paiement simulé par la vraie API Stripe (si encaissement en ligne souhaité).
- [ ] **SEO & Meta-tags** : Optimiser les balises pour le référencement naturel ("Usine Confection Vêtement Tunisie", etc.).
- [ ] **Déploiement** : Hébergement sur Vercel avec le nom de domaine final.

---

> [!IMPORTANT]
> **Prochaine étape immédiate** : Implémenter le système de **Mailing (Resend)** (Section 4) pour assurer le fonctionnement réel des connexions et des notifications.
