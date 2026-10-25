# Bundesmuseen-Card – suivi des salles

Petite application web (utilisable sur téléphone, même hors-ligne) pour
cocher les salles déjà vues dans les musées inclus dans la
**Bundesmuseen-Card** (Vienne, 99 €/an).

## Fonctionnalités

- Un plan schématique interactif par étage pour chaque musée : touchez une
  salle pour la cocher comme **vue**, retouchez pour la décocher. Le bouton ✎
  dans la liste permet d'ajouter une note ou de changer la date.
- Boutons pour cocher d'un coup toute une partie (ex. Kunstkammer), tout un
  étage ou tout le musée, avec « Annuler ».
- **Guide de visite** : présentation de chaque musée, textes par partie et par
  salle avec les œuvres à voir. Le bouton *i* d'une salle ouvre sa fiche ; un
  point bleu sur le plan signale les salles qui ont un texte. Tous les textes
  viennent uniquement des sites officiels des musées, cités sous chaque texte
  (`js/guides.js`).
- Liste des salles avec filtre « À voir » pour préparer la prochaine visite.
- Progression par étage, par musée et globale.
- Bouton pour agrandir le plan sur petit écran.
- Ajout de vos propres salles à n'importe quel étage.
- Export / import de la progression (fichier JSON) pour changer d'appareil.
- Installable sur l'écran d'accueil (PWA) et utilisable sans réseau.

La progression est stockée dans le navigateur de l'appareil (`localStorage`).
Pensez à l'exporter de temps en temps.

## Sites inclus

| Institution | Sites |
|---|---|
| KHM-Museumsverband | Kunsthistorisches Museum, Kaiserliche Schatzkammer, Weltmuseum Wien, Neue Burg (Ephesos, Hofjagd- und Rüstkammer, instruments anciens), Theatermuseum, Kaiserliche Wagenburg, Schloss Ambras Innsbruck |
| Naturhistorisches Museum | NHM, Narrenturm |
| Albertina | Albertina, Albertina Modern, Albertina Klosterneuburg |
| Belvedere | Oberes Belvedere, Unteres Belvedere & Orangerie, Belvedere 21 |
| MAK | MAK, Geymüllerschlössel |
| mumok | mumok |
| Österreichische Nationalbibliothek | Prunksaal, Papyrus-/Globen-/Esperanto-/Literaturmuseum, Haus der Geschichte Österreich |
| Technisches Museum Wien | TMW |

**Les plans sont schématiques.** La forme générale des bâtiments et la
numérotation des grandes salles (KHM, NHM, Schatzkammer…) suivent le principe
de la signalétique sur place, mais la position exacte et les thèmes sont
indicatifs. Pour corriger : éditez `js/data.js` (sans changer les `id` déjà
utilisés, sinon la progression de ces salles est perdue), ou ajoutez des
salles directement dans l'appli.

## Utilisation

### Sur le téléphone (recommandé)

1. Le dépôt doit être **public** (GitHub Pages gratuit).
2. Sur GitHub : **Settings → Pages → Build and deployment**
   - Source : **Deploy from a branch**
   - Branch : **main**, dossier **/ (root)** → **Save**
3. Après une minute environ, l'appli est sur
   https://mehdi-kha.github.io/Bundesmuseencard-tracker/
4. Ouvrez l'adresse sur le téléphone, puis « Ajouter à l'écran d'accueil »
   (Safari : bouton Partager ; Chrome : menu ⋮).

Chaque push sur `main` met le site à jour automatiquement.

### En local

Aucune compilation. Servez le dossier, par exemple :

```sh
python3 -m http.server 8000
```

puis ouvrez http://localhost:8000.

## Structure

- `index.html`, `styles.css` – page et style (thème clair/sombre automatique)
- `js/data.js` – musées, étages, salles et coordonnées des plans
- `js/guides.js` – textes du guide, avec leurs sources officielles
- `js/app.js` – interface, plans SVG, sauvegarde
- `sw.js`, `manifest.webmanifest`, icônes – fonctionnement hors-ligne / installation
