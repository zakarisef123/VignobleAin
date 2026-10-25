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
- Intro vidéo plein écran (images réelles), jouée une fois par session ; le titre apparaît sur le dernier plan, puis la vérification d'âge. Bouton « Passer l'intro ». Désactivée si le visiteur préfère réduire les animations ou économise ses données.
- Effet « lever de rideau » sur les photos au défilement.

## Remplacer la vidéo d'intro
Fichiers dans `assets/video/` :
- `intro.mp4` + `intro.webm` + `intro.jpg` (image d'attente) : format horizontal 16:9, 1280×720 ou 1920×1080 ;
- `intro-mobile.mp4` + `intro-mobile.webm` + `intro-mobile.jpg` : format vertical 9:16, 720×1280.

Conseils : 6 à 9 secondes, sans son, sans texte incrusté (le nom du domaine s'affiche par-dessus le dernier plan), moins de 3 Mo par fichier. Le dernier plan doit laisser de la place en bas de l'image pour le titre.

Conversion avec ffmpeg :
```
ffmpeg -i source.mov -an -vf "scale=1280:-2,fps=25" -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart intro.mp4
ffmpeg -i intro.mp4 -an -c:v libvpx-vp9 -b:v 0 -crf 36 intro.webm
ffmpeg -ss 0.5 -i intro.mp4 -frames:v 1 -q:v 4 intro.jpg
```

## Logo
- `assets/logo.svg` — logo complet
- `assets/logo-mark.svg` — symbole seul (couleur héritée via `currentColor`)
- `assets/favicon.svg`
