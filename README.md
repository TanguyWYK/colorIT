BATTLE ALGO SFEIR 2022 color-IT
---
### 1) Utilisation de l'algo

- Ouvrir fichier index.html

- **Appuyer sur F12 pour éviter la popup du temps de calcul du navigateur**

- Importer le fichier d'input au format csv dans la boite de dialogue

- Le resultat sous format csv se télécharge à la fin du calcul


### 2) Explication de l'algo

- Les cases sont regroupées par groupe de couleurs identiques.
- Un arbre de décision est construit composé de branches
- Une branche correspond à un groupe de couleur adjacentes (un id leur est attribué).
- Chaque branche contient un tableau des id des branches adjacentes (enfants)
- Pour déterminer quelle couleur va être sélectionnée, on regarde dans les enfants si une couleur est en double, triple, etc
- Un score est attribué à chaque enfant en regardant également les enfants de niveau 2 et 3
- Le score est pondéré selon la profondeur d'exploration
- On choisi la couleur selon le meilleur score
- Ensuite les branches sont fusionnées et les enfants mis à jour, il n'y a pas de recalcul de l'état de la grille à chaque tour.

Afin d'obtenir de meilleurs résultats l'algorithme complet est exécuté trois fois avec des formules de scoring différentes.
Le meilleur résultat est alors choisi.
Afin de ne pas dépasser le temps de calcul de 2min autorisé, la pronfondeur d'exploration est réduite selon le nombre de cases.
L'algo n'est exécuté qu'avec la première formule si le temps ne permet pas une autre exécution.

***Tanguy Westelynck - SFEIR Strasbourg***