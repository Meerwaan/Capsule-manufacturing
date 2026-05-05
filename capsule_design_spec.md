# Spécifications du Projet : Capsule Manufacturing (V1)

Ce document détaille la conception de la plateforme "Capsule", un service de confection textile premium basé en Tunisie, spécialisé dans les petites séries (MOQ 50) pour marques indépendantes.

## 1. Vision et Identité
*   **Nom du projet** : Capsule
*   **Positionnement** : "Atelier Moderne" — Premium, sérieux, agile.
*   **Promesse client** : Qualité atelier, prix usine, livraison record (proximité Tunisie/Europe), agilité digitale.
*   **Direction Artistique** : Design minimaliste, typographie élégante, animations fluides (GSAP), tons blanc cassé et anthracite.

## 2. Parcours Utilisateur (User Flow)
1.  **Visiteur** : Arrive sur une Landing Page narrative mettant en avant les atouts logistiques de la Tunisie.
2.  **Estimation** : Utilise un configurateur (T-shirt, Hoodie, Veste) pour obtenir un prix estimatif instantané.
3.  **Contact** : Valide l'estimation par une demande de rappel ou un appel direct pour validation humaine.
4.  **Client (Dashboard)** : 
    *   Crée une notification d'envoi de matière première.
    *   Génère un **Bon de Réception (PDF)** à coller sur ses colis.
    *   Suit les étapes de production : Stock Matière -> Coupe -> Confection -> Contrôle Qualité -> Expédition.
    *   Gère le **Fulfillment** (envoi vers ses clients finaux ou son entrepôt).

## 3. Architecture Technique
*   **Framework** : Next.js 14+ (App Router).
*   **Styling** : Vanilla CSS + GSAP (Animations).
*   **Base de Données** : MySQL (via Prisma ORM).
*   **Fonctionnalités Clés** :
    *   Générateur de PDF (pour les bons de livraison).
    *   Système d'import CSV (pour les listes d'expédition fulfillment).
    *   Dashboard temps-réel pour le suivi de production.

## 4. Structure de la Base de Données (Prévisionnelle)
*   **Users** : Admin (Usine) et Clients (Marques).
*   **Quotes** : Historique des estimations faites par les clients.
*   **Projects** : Commandes validées en cours de production.
*   **Materials** : Suivi des stocks de tissus envoyés par les clients.
*   **Shipments** : Suivi des expéditions de produits finis.

## 5. Prochaines Étapes
1.  Mise en place de l'architecture Next.js.
2.  Développement de la Landing Page "Atelier Moderne".
3.  Création du configurateur de devis dynamique.
4.  Mise en place du dashboard logistique.
