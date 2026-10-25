# Site du domaine viticole — site vitrine

Site statique multipage (HTML/CSS/JS, sans dépendance ni build). Ouvrir `index.html` dans un navigateur, ou déployer le dossier tel quel (Netlify, GitHub Pages, OVH…).

## Pages
- `index.html` — Accueil
- `domaine.html` — Histoire, terroir, engagements
- `vins.html` — Gamme (filtrable)
- `activites.html` — Visites, dégustations, catalogue de 31 activités (filtrable), calendrier des saisons, bon cadeau, FAQ
- `actualites.html` — Actualités
- `galerie.html` — Galerie avec visionneuse
- `contact.html` — Coordonnées, formulaire, carte
- `mentions-legales.html` — Mentions légales & RGPD
- `marque.html` — Proposition d'identité (logo, couleurs, typos)

## À compléter
- **Nom du domaine** : provisoire, « Nom du Domaine » / « NOM DU DOMAINE » partout (pages, `assets/logo.svg`, étiquettes). Remplacer par le nom définitif.
- Adresse exacte (commune du Mâconnais), téléphone, e-mail, SIRET, hébergeur (valeurs provisoires `Mâconnais, Saône-et-Loire (71)`, `06 00 00 00 00`, `contact@nomdudomaine.fr`). Recentrer aussi la carte de `contact.html` sur la commune.
- Noms, cépages et prix des cuvées (`vins.html`) : exemples à remplacer.
- Liens Facebook / Instagram (pied de page).
- Photos : `assets/img/` contient les photos du domaine reprises de l'ancien site (recadrées, sans texte ni logo). Les illustrations SVG restantes (marque, mentions légales) et la galerie peuvent être complétées avec de nouvelles photos.

## Style & animations
- Style « Terroir vivant » aux couleurs du Mâconnais : palette définie dans `:root` de `css/style.css` (tuile romane, vert vigne, or chardonnay, pierre de Solutré). Polices : Fraunces, Inter, Caveat.
- Animation d'ouverture (tonneau → bouteille → verre), jouée une fois par session ; la vérification d'âge apparaît à la fin de l'intro. Désactivée si le visiteur préfère réduire les animations.
- Effet « lever de rideau » sur les photos au défilement.

## Logo
- `assets/logo.svg` — logo complet
- `assets/logo-mark.svg` — symbole seul (couleur héritée via `currentColor`)
- `assets/favicon.svg`
