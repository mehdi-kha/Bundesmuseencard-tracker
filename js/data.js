/*
 * Données des musées inclus dans la Bundesmuseen-Card.
 *
 * Les plans sont SCHÉMATIQUES : ils reprennent la structure générale des
 * bâtiments (ailes, cours, étages) et la numérotation des salles telle
 * qu'affichée sur place quand elle est connue. Pour les sites dont la
 * numérotation change souvent (expositions temporaires, petits sites),
 * les "salles" sont des zones / parcours.
 *
 * Pour corriger ou compléter : modifiez ce fichier. Chaque salle a un `id`
 * unique dans son musée — ne le changez pas une fois utilisé, sinon la
 * progression enregistrée pour cette salle sera perdue. Dans l'appli, vous
 * pouvez aussi ajouter vos propres salles à n'importe quel étage.
 *
 * Coordonnées : si une salle a x/y/w/h, elle est dessinée à cette position
 * dans le viewBox de l'étage (w × h). Sinon, l'étage est mis en grille.
 */
(function () {
  "use strict";

  const ROMAN = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
    [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  function roman(n) {
    let out = "";
    for (const [v, s] of ROMAN) while (n >= v) { out += s; n -= v; }
    return out;
  }

  // Une salle. `label` = texte court sur le plan, `title` = nom complet.
  function R(id, label, title) {
    return { id, label, title: title || label };
  }

  // Suite de salles numérotées. fmt: "roman" | "arabic".
  function series(prefix, from, to, fmt, titleFn) {
    const out = [];
    for (let n = from; n <= to; n++) {
      const num = fmt === "roman" ? roman(n) : String(n);
      out.push(R(prefix + n, num, titleFn(n, num)));
    }
    return out;
  }

  // Place des salles côte à côte dans un rectangle.
  function row(rooms, x, y, w, h, vertical) {
    const n = rooms.length;
    rooms.forEach((r, i) => {
      if (vertical) Object.assign(r, { x, y: y + (h / n) * i, w, h: h / n });
      else Object.assign(r, { x: x + (w / n) * i, y, w: w / n, h });
    });
    return rooms;
  }

  // Place des salles en anneau autour d'une cour, dans le sens horaire :
  // haut (g→d), droite (h→b), bas (d→g), gauche (b→h).
  // Les coins appartiennent aux rangées du haut et du bas.
  function ring(sides, x, y, w, h, t) {
    const top = sides.top || [], right = sides.right || [];
    const bottom = sides.bottom || [], left = sides.left || [];
    row(top, x, y, w, t);
    row(right, x + w - t, y + t, t, h - 2 * t, true);
    row(bottom.slice().reverse(), x, y + h - t, w, t);
    row(left.slice().reverse(), x, y + t, t, h - 2 * t, true);
    return [...top, ...right, ...bottom, ...left];
  }

  // Découpe un tableau en morceaux de tailles données.
  function split(arr, ...sizes) {
    const out = [];
    let i = 0;
    for (const s of sizes) { out.push(arr.slice(i, i + s)); i += s; }
    return out;
  }

  const court = (x, y, w, h, label) => ({ type: "court", x, y, w, h, label: label || "Cour" });
  const label = (x, y, text) => ({ type: "label", x, y, text });
  const outline = (x, y, w, h) => ({ type: "outline", x, y, w, h });

  // ---------------------------------------------------------------------
  // Kunsthistorisches Museum
  // ---------------------------------------------------------------------
  function khmHochparterre() {
    const left = series("hp-", 1, 18, "roman", (n, s) =>
      n <= 8 ? `Saal ${s} – Collection égyptienne et orientale`
             : `Saal ${s} – Collection d'antiquités (Grèce, Rome)`);
    const [lt, lr, lb, ll] = split(left, 6, 3, 6, 3);
    const kk = series("hp-", 20, 37, "roman", (n, s) => `Saal ${s} – Kunstkammer`);
    const [rt, rr, rb, rl] = split(kk, 6, 3, 6, 3);
    return {
      id: "hp", name: "Rez-de-chaussée surélevé (Hochparterre)", w: 140, h: 88,
      decor: [
        outline(4, 4, 132, 72),
        court(18, 18, 30, 44), court(92, 18, 30, 44),
        label(33, 84, "Égypte · Antiquités"), label(107, 84, "Kunstkammer"),
        label(70, 84, "▲ Entrée"),
      ],
      rooms: [
        ...ring({ top: lt, right: lr, bottom: lb, left: ll }, 4, 4, 58, 72, 14),
        ...ring({ top: rt, right: rr, bottom: rb, left: rl }, 78, 4, 58, 72, 14),
        ...row([R("hp-centre", "Centre", "Salle sous la coupole")], 62, 4, 16, 22),
        ...row([R("hp-treppe", "Escalier", "Escalier d'honneur (Theseus de Canova, peintures de Klimt)")], 62, 26, 16, 30),
        ...row([R("hp-vestibuel", "Vestib.", "Vestibule / Entrée")], 62, 56, 16, 20),
      ],
    };
  }

  function khmErsterStock() {
    const westTitle = (s) => `Saal ${s} – Peinture italienne, espagnole, française`;
    const eastTitle = (s) => s === "X" ? "Saal X – Bruegel" : `Saal ${s} – Peinture flamande, hollandaise, allemande`;
    const saeleW = series("gg-s", 1, 7, "roman", (n, s) => westTitle(s));
    const saeleE = series("gg-s", 8, 15, "roman", (n, s) => eastTitle(s));
    const kabW = series("gg-k", 1, 13, "arabic", (n, s) => `Kabinett ${s} – Peinture italienne, espagnole, française`);
    const kabE = series("gg-k", 14, 24, "arabic", (n, s) => `Kabinett ${s} – Peinture flamande, hollandaise, allemande`);
    const [swT, swR, swB, swL] = split(saeleW, 2, 1, 2, 2);
    const [seT, seR, seB] = split(saeleE, 3, 2, 3);
    const [kwT, kwB, kwL] = split(kabW, 5, 5, 3);
    const [keT, keR, keB] = split(kabE, 4, 3, 4);
    return {
      id: "1og", name: "1er étage – Gemäldegalerie", w: 140, h: 88,
      decor: [
        outline(4, 4, 132, 72),
        court(22, 22, 29, 36), court(89, 22, 29, 36),
        label(33, 84, "Italie · Espagne · France"), label(107, 84, "Flandres · Pays-Bas · Allemagne"),
      ],
      rooms: [
        ...ring({ top: kwT, bottom: kwB, left: kwL }, 4, 4, 58, 72, 7),
        ...ring({ top: swT, right: swR, bottom: swB, left: swL }, 11, 11, 51, 58, 11),
        ...ring({ top: keT, right: keR, bottom: keB }, 78, 4, 58, 72, 7),
        ...ring({ top: seT, right: seR, bottom: seB }, 78, 11, 51, 58, 11),
        ...row([R("og-kuppel", "Coupole", "Kuppelhalle (café sous la coupole)")], 62, 4, 16, 40),
        ...row([R("og-treppe", "Escalier", "Galerie de l'escalier d'honneur (Klimt)")], 62, 44, 16, 32),
      ],
    };
  }

  const khm = {
    id: "khm", group: "KHM-Museumsverband",
    name: "Kunsthistorisches Museum", short: "KHM",
    address: "Maria-Theresien-Platz, 1010 Wien", color: "#9b5d2e",
    floors: [
      khmHochparterre(),
      khmErsterStock(),
      {
        id: "2og", name: "2e étage – Münzkabinett", w: 140, h: 40,
        decor: [outline(4, 4, 132, 32), label(100, 22, "Cabinet des médailles")],
        rooms: [
          ...row(series("mk-", 1, 3, "roman", (n, s) => `Saal ${s} – Münzkabinett (monnaies & médailles)`), 4, 4, 60, 32),
        ],
      },
    ],
  };

  // ---------------------------------------------------------------------
  // Naturhistorisches Museum (bâtiment jumeau du KHM)
  // ---------------------------------------------------------------------
  function nhmTitle(n) {
    if (n <= 4) return `Saal ${n} – Minéraux et pierres précieuses`;
    if (n === 5) return "Saal 5 – Météorites";
    if (n === 6) return "Saal 6 – Géologie, la Terre";
    if (n <= 9) return `Saal ${n} – Paléontologie`;
    if (n === 10) return "Saal 10 – Dinosaures";
    if (n === 11) return "Saal 11 – Préhistoire (Vénus de Willendorf)";
    if (n <= 13) return `Saal ${n} – Préhistoire`;
    if (n <= 15) return `Saal ${n} – Anthropologie, évolution humaine`;
    if (n <= 27) return `Saal ${n} – Zoologie : invertébrés`;
    if (n <= 29) return `Saal ${n} – Zoologie : poissons, amphibiens, reptiles`;
    if (n <= 32) return `Saal ${n} – Zoologie : oiseaux`;
    return `Saal ${n} – Zoologie : mammifères`;
  }

  const nhmHp = series("s", 1, 15, "arabic", (n) => nhmTitle(n));
  const nhmOg = series("s", 21, 39, "arabic", (n) => nhmTitle(n));
  const [nhL_t, nhL_r, nhL_b, nhL_l] = split(nhmHp.slice(0, 8), 3, 1, 3, 1);
  const [nhR_t, nhR_r, nhR_b] = split(nhmHp.slice(8), 3, 1, 3);
  const [noL_t, noL_r, noL_b, noL_l] = split(nhmOg.slice(0, 10), 4, 1, 4, 1);
  const [noR_t, noR_r, noR_b] = split(nhmOg.slice(10), 4, 1, 4);

  const nhm = {
    id: "nhm", group: "Naturhistorisches Museum",
    name: "Naturhistorisches Museum", short: "NHM",
    address: "Maria-Theresien-Platz, 1010 Wien", color: "#4e7a3a",
    floors: [
      {
        id: "hp", name: "Rez-de-chaussée surélevé – Minéraux, fossiles, préhistoire", w: 140, h: 88,
        decor: [outline(4, 4, 132, 72), court(18, 18, 30, 44), court(92, 18, 30, 44), label(70, 84, "▲ Entrée")],
        rooms: [
          ...ring({ top: nhL_t, right: nhL_r, bottom: nhL_b, left: nhL_l }, 4, 4, 58, 72, 14),
          ...ring({ top: nhR_t, right: nhR_r, bottom: nhR_b }, 78, 4, 58, 72, 14),
          ...row([R("hp-kuppel", "Coupole", "Salle de la coupole"), R("hp-treppe", "Escalier", "Escalier d'honneur")], 62, 4, 16, 52, true),
          ...row([R("hp-planetarium", "Planét.", "Planétarium numérique (séances)")], 62, 56, 16, 20),
        ],
      },
      {
        id: "1og", name: "1er étage – Zoologie", w: 140, h: 80,
        decor: [outline(4, 4, 132, 72), court(18, 18, 30, 44), court(92, 18, 30, 44)],
        rooms: [
          ...ring({ top: noL_t, right: noL_r, bottom: noL_b, left: noL_l }, 4, 4, 58, 72, 14),
          ...ring({ top: noR_t, right: noR_r, bottom: noR_b }, 78, 4, 58, 72, 14),
          ...row([R("og-kuppel", "Coupole", "Galerie de la coupole / café")], 62, 4, 16, 72),
        ],
      },
    ],
  };

  const narrenturm = {
    id: "narrenturm", group: "Naturhistorisches Museum",
    name: "Narrenturm", short: "Narrenturm",
    address: "Spitalgasse 2, 1090 Wien (campus de l'Altes AKH)", color: "#4e7a3a",
    note: "Collection pathologique et anatomique du NHM, dans l'ancienne tour circulaire.",
    floors: [
      { id: "eg", name: "Rez-de-chaussée", rooms: [R("eg-a", "Exposition", "Exposition permanente (rez-de-chaussée)"), R("eg-b", "Histoire", "Histoire du Narrenturm")] },
      { id: "1og", name: "1er étage", rooms: [R("1og-a", "Collection", "Collection pathologique – 1er étage")] },
      { id: "2og", name: "2e étage", rooms: [R("2og-a", "Collection", "Collection pathologique – 2e étage")] },
    ],
  };

  // ---------------------------------------------------------------------
  // Autres sites du KHM-Museumsverband
  // ---------------------------------------------------------------------
  const weltlich = series("w", 1, 16, "arabic", (n) =>
    n === 11 ? "Saal 11 – Couronne du Saint-Empire"
      : n <= 8 ? `Saal ${n} – Trésor profane (Habsbourg)`
      : n <= 12 ? `Saal ${n} – Insignes du Saint-Empire`
      : `Saal ${n} – Trésor de Bourgogne / Toison d'or`);
  const geistlich = series("g", 1, 5, "roman", (n, s) => `Saal ${s} – Trésor ecclésiastique`);
  geistlich.forEach((r) => { r.label = "G " + r.label; });
  const [wt, wr, wb] = split(weltlich, 6, 4, 6);

  const schatzkammer = {
    id: "schatzkammer", group: "KHM-Museumsverband",
    name: "Kaiserliche Schatzkammer", short: "Schatzkammer",
    address: "Hofburg, Schweizerhof, 1010 Wien", color: "#9b5d2e",
    floors: [
      {
        id: "eg", name: "Trésor impérial", w: 120, h: 80,
        decor: [label(54, 44, "Schweizerhof")],
        rooms: [
          ...ring({ top: wt, right: wr, bottom: wb }, 4, 4, 112, 56, 12),
          ...row(geistlich, 4, 64, 112, 12),
        ],
      },
    ],
  };

  const weltmuseum = {
    id: "weltmuseum", group: "KHM-Museumsverband",
    name: "Weltmuseum Wien", short: "Weltmuseum",
    address: "Neue Burg, Heldenplatz, 1010 Wien", color: "#2f6f8f",
    note: "Exposition permanente en 14 salles (Hochparterre) — numérotation à vérifier sur place.",
    floors: [
      {
        id: "eg", name: "Hall et rez-de-chaussée", rooms: [
          R("saeulenhalle", "Säulenhalle", "Säulenhalle (hall à colonnes)"),
          R("sonder", "Temporaire", "Expositions temporaires"),
        ],
      },
      {
        id: "hp", name: "Exposition permanente", w: 120, h: 50,
        decor: [label(60, 26, "Corso / Halle")],
        rooms: [
          ...row(series("s", 1, 7, "arabic", (n) => `Saal ${n} – Exposition permanente`), 4, 4, 112, 16),
          ...row(series("s", 8, 14, "arabic", (n) => `Saal ${n} – Exposition permanente`), 4, 32, 112, 16),
        ],
      },
    ],
  };

  const neueBurg = {
    id: "neueburg", group: "KHM-Museumsverband",
    name: "Neue Burg – collections du KHM", short: "Neue Burg",
    address: "Neue Burg, Heldenplatz, 1010 Wien", color: "#9b5d2e",
    note: "Hofjagd- und Rüstkammer, Sammlung alter Musikinstrumente et Ephesos Museum.",
    floors: [
      {
        id: "eph", name: "Ephesos Museum", rooms: [
          R("eph-1", "Frise", "Frise des Parthes (autel d'Éphèse)"),
          R("eph-2", "Éphèse", "Fouilles d'Éphèse"),
          R("eph-3", "Samothrace", "Samothrace"),
        ],
      },
      {
        id: "hjrk", name: "Hofjagd- und Rüstkammer (armes & armures)", w: 120, h: 30,
        rooms: row(series("hj", 1, 8, "roman", (n, s) => `Saal ${s} – Hofjagd- und Rüstkammer`), 4, 4, 112, 22),
      },
      {
        id: "sam", name: "Sammlung alter Musikinstrumente", w: 120, h: 30,
        rooms: row(series("mi", 1, 8, "roman", (n, s) => `Saal ${s} – Instruments de musique anciens`), 4, 4, 112, 22),
      },
    ],
  };

  const theatermuseum = {
    id: "theatermuseum", group: "KHM-Museumsverband",
    name: "Theatermuseum", short: "Theatermuseum",
    address: "Palais Lobkowitz, Lobkowitzplatz 2, 1010 Wien", color: "#9b5d2e",
    note: "Vérifiez l'ouverture avant d'y aller (rénovations).",
    floors: [
      {
        id: "1og", name: "Palais Lobkowitz", rooms: [
          R("eroica", "Eroica-Saal", "Eroica-Saal"),
          R("sonder", "Exposition", "Exposition temporaire"),
          R("puppen", "Marionnettes", "Marionnettes et théâtre de figures"),
        ],
      },
    ],
  };

  const wagenburg = {
    id: "wagenburg", group: "KHM-Museumsverband",
    name: "Kaiserliche Wagenburg", short: "Wagenburg",
    address: "Schloss Schönbrunn, 1130 Wien", color: "#9b5d2e",
    floors: [
      {
        id: "eg", name: "Hall des carrosses", rooms: [
          R("halle", "Grand hall", "Grand hall – carrosses impériaux"),
          R("kroenung", "Couronne.", "Carrosse du couronnement"),
          R("sisi", "Sisi", "Parcours Sisi"),
          R("trauer", "Deuil", "Corbillard impérial"),
          R("kinder", "Enfants", "Voitures d'enfants"),
          R("galerie", "Galerie", "Galerie (selleries, livrées)"),
        ],
      },
    ],
  };

  const ambras = {
    id: "ambras", group: "KHM-Museumsverband",
    name: "Schloss Ambras Innsbruck", short: "Ambras",
    address: "Schlossstraße 20, 6020 Innsbruck", color: "#9b5d2e",
    floors: [
      {
        id: "unter", name: "Château bas (Unterschloss)", rooms: [
          R("ruest", "Armures", "Chambres d'armures"),
          R("kunst", "Wunderkammer", "Chambre d'art et de merveilles"),
          R("spanisch", "Saal Esp.", "Salle espagnole (Spanischer Saal)"),
        ],
      },
      {
        id: "hoch", name: "Château haut (Hochschloss)", rooms: [
          R("portrait", "Portraits", "Galerie de portraits des Habsbourg"),
          R("bad", "Bain", "Bain de Philippine Welser"),
          R("wohn", "Appart.", "Appartements Renaissance"),
        ],
      },
      { id: "park", name: "Extérieur", rooms: [R("park", "Parc", "Parc du château")] },
    ],
  };

  // ---------------------------------------------------------------------
  // Albertina
  // ---------------------------------------------------------------------
  const albertina = {
    id: "albertina", group: "Albertina",
    name: "Albertina", short: "Albertina",
    address: "Albertinaplatz 1, 1010 Wien", color: "#7a3b6e",
    floors: [
      {
        id: "prunk", name: "Salles d'apparat des Habsbourg (Prunkräume)", w: 120, h: 50,
        rooms: [
          ...row([
            R("p-stiege", "Escalier", "Escalier d'honneur"),
            R("p-vor", "Antich.", "Antichambre"),
            R("p-audienz", "Audience", "Salle d'audience"),
            R("p-musen", "Muses", "Salle des Muses (Musensaal)"),
            R("p-spiegel", "Miroirs", "Salle des miroirs (Spiegelsaal)"),
          ], 4, 4, 112, 20),
          ...row([
            R("p-wedgwood", "Wedgwood", "Cabinet Wedgwood"),
            R("p-gold", "Or", "Cabinet doré (Goldkabinett)"),
            R("p-mc", "M.-Christine", "Appartements de Marie-Christine"),
            R("p-albert", "Albert", "Cabinet de travail du duc Albert"),
            R("p-salon", "Salons", "Salons de l'appartement espagnol"),
          ], 4, 26, 112, 20),
        ],
      },
      {
        id: "samm", name: "Collection permanente & expositions", rooms: [
          R("batliner", "Monet→Picasso", "De Monet à Picasso (collection Batliner)"),
          R("pfeiler", "Pfeilerhalle", "Pfeilerhalle"),
          R("bastei", "Basteihalle", "Basteihalle"),
          R("propter", "Propter Homines", "Propter Homines Halle"),
          R("tietze", "Tietze", "Tietze Galleries"),
          R("foto", "Photo", "Galerie photographique"),
        ],
      },
    ],
  };

  const albertinaModern = {
    id: "albertina-modern", group: "Albertina",
    name: "Albertina Modern", short: "Albertina Modern",
    address: "Künstlerhaus, Karlsplatz 5, 1010 Wien", color: "#7a3b6e",
    floors: [
      { id: "eg", name: "Rez-de-chaussée", rooms: [R("eg-1", "Salle 1", "Halles du rez-de-chaussée – aile gauche"), R("eg-2", "Salle 2", "Halles du rez-de-chaussée – aile droite")] },
      { id: "ug", name: "Sous-sol", rooms: [R("ug-1", "Sous-sol", "Halles du sous-sol")] },
    ],
  };

  const albertinaKlosterneuburg = {
    id: "albertina-klosterneuburg", group: "Albertina",
    name: "Albertina Klosterneuburg", short: "Klosterneuburg",
    address: "An der Donau-Au 1, 3400 Klosterneuburg", color: "#7a3b6e",
    note: "Ouvert de façon saisonnière, vérifiez les dates.",
    floors: [
      { id: "eg", name: "Bâtiment", rooms: [R("halle", "Grande halle", "Grande halle d'exposition"), R("depot", "Dépôt", "Dépôt visitable"), R("og", "Étage", "Salles de l'étage")] },
    ],
  };

  // ---------------------------------------------------------------------
  // Belvedere
  // ---------------------------------------------------------------------
  const oberesBelvedere = {
    id: "oberes-belvedere", group: "Belvedere",
    name: "Oberes Belvedere", short: "Haut Belvédère",
    address: "Prinz-Eugen-Straße 27, 1030 Wien", color: "#b08d2c",
    note: "Les salles sont regroupées par thème ; l'accrochage change de temps en temps.",
    floors: [
      {
        id: "eg", name: "Rez-de-chaussée", w: 130, h: 40,
        decor: [label(65, 38, "▲ Entrée (côté jardin)")],
        rooms: [
          ...row([
            R("eg-mittel1", "Moyen Âge", "Art médiéval"),
            R("eg-mittel2", "Gothique", "Gothique tardif"),
          ], 4, 4, 44, 28),
          ...row([R("eg-sala", "Sala terrena", "Sala terrena"), R("eg-carlone", "Carlone", "Carlone-Saal")], 48, 4, 34, 28, true),
          ...row([
            R("eg-temp1", "Temporaire", "Exposition temporaire"),
            R("eg-temp2", "Temporaire 2", "Exposition temporaire (2)"),
          ], 82, 4, 44, 28),
        ],
      },
      {
        id: "1og", name: "1er étage – Vienne 1900", w: 130, h: 40,
        rooms: [
          ...row([
            R("1-barock", "Baroque", "Baroque autrichien"),
            R("1-kapelle", "Chapelle", "Chapelle du château"),
            R("1-paris", "Paris", "Impressionnisme"),
          ], 4, 4, 44, 32),
          ...row([R("1-marmor", "Marmorsaal", "Salle de marbre (Marmorsaal)")], 48, 4, 34, 32),
          ...row([
            R("1-klimt", "Klimt", "Klimt (Le Baiser)"),
            R("1-schiele", "Schiele", "Schiele, Kokoschka, Gerstl"),
            R("1-1900", "Vienne 1900", "Art viennois autour de 1900"),
          ], 82, 4, 44, 32),
        ],
      },
      {
        id: "2og", name: "2e étage – XIXe et XXe siècles", w: 130, h: 40,
        rooms: [
          ...row([
            R("2-biedermeier", "Biedermeier", "Biedermeier (Waldmüller)"),
            R("2-romantik", "Romantisme", "Classicisme et romantisme"),
          ], 4, 4, 60, 32),
          ...row([
            R("2-realismus", "Réalisme", "Réalisme, historicisme (Makart)"),
            R("2-zwischen", "Entre-2-g.", "Entre-deux-guerres"),
          ], 66, 4, 60, 32),
        ],
      },
    ],
  };

  const unteresBelvedere = {
    id: "unteres-belvedere", group: "Belvedere",
    name: "Unteres Belvedere & Orangerie", short: "Bas Belvédère",
    address: "Rennweg 6, 1030 Wien", color: "#b08d2c",
    floors: [
      {
        id: "eg", name: "Appartements du prince Eugène", w: 130, h: 30,
        rooms: row([
          R("groteske", "Grotesques", "Salle des grotesques"),
          R("marmorgalerie", "Galerie", "Galerie de marbre"),
          R("marmorsaal", "Marmorsaal", "Salle de marbre"),
          R("gold", "Cab. doré", "Cabinet doré"),
          R("schlaf", "Chambre", "Chambre d'apparat"),
        ], 4, 4, 122, 22),
      },
      {
        id: "neben", name: "Bâtiments annexes", rooms: [
          R("temp", "Temporaire", "Expositions temporaires (Unteres Belvedere)"),
          R("orangerie", "Orangerie", "Orangerie"),
          R("prunkstall", "Écuries", "Écuries d'apparat (Prunkstall)"),
        ],
      },
    ],
  };

  const belvedere21 = {
    id: "belvedere21", group: "Belvedere",
    name: "Belvedere 21", short: "Belvedere 21",
    address: "Arsenalstraße 1, 1030 Wien", color: "#b08d2c",
    floors: [
      { id: "eg", name: "Rez-de-chaussée", rooms: [R("halle", "Grande halle", "Grande halle vitrée"), R("garten", "Sculptures", "Jardin de sculptures")] },
      { id: "og", name: "Étage", rooms: [R("og", "Étage", "Galerie de l'étage"), R("wotruba", "Wotruba", "Fritz Wotruba")] },
      { id: "ug", name: "Sous-sol", rooms: [R("ug", "Sous-sol", "Salles du sous-sol"), R("kino", "Kino", "Salle de cinéma / Blickle Kino")] },
    ],
  };

  // ---------------------------------------------------------------------
  // MAK
  // ---------------------------------------------------------------------
  const mak = {
    id: "mak", group: "MAK",
    name: "MAK – Musée des arts appliqués", short: "MAK",
    address: "Stubenring 5, 1010 Wien", color: "#c0392b",
    floors: [
      {
        id: "eg", name: "Rez-de-chaussée – Collection permanente", w: 130, h: 70,
        decor: [label(65, 68, "▲ Entrée Stubenring")],
        rooms: [
          ...row([
            R("eg-rom", "Moyen Âge", "Roman, gothique, Renaissance"),
            R("eg-barock", "Baroque", "Baroque, rococo, classicisme"),
            R("eg-porzellan", "Porcelaine", "Porcelaine et verre"),
            R("eg-empire", "Empire", "Empire, Biedermeier"),
          ], 4, 4, 122, 18),
          ...row([R("eg-saeulenhalle", "Säulenhalle", "Säulenhalle (cour à colonnes)")], 34, 24, 62, 24),
          ...row([R("eg-teppiche", "Tapis", "Tapis")], 4, 24, 28, 24),
          ...row([R("eg-histor", "Historicisme", "Historicisme, Art nouveau")], 98, 24, 28, 24),
          ...row([
            R("eg-asien", "Asie", "Asie"),
            R("eg-sonder", "Temporaire", "Expositions temporaires"),
          ], 4, 50, 122, 14),
        ],
      },
      {
        id: "1og", name: "1er étage", rooms: [
          R("1-wien1900", "Vienne 1900", "Vienne 1900 – design, Wiener Werkstätte"),
          R("1-sonder", "Temporaire", "Expositions temporaires"),
        ],
      },
      {
        id: "ug", name: "Sous-sol", rooms: [
          R("ug-design", "Design Labor", "MAK Design Labor (cuisine de Francfort…)"),
          R("ug-gegenwart", "Contemporain", "Art contemporain"),
          R("ug-studien", "Collection d'étude", "Collection d'étude"),
        ],
      },
    ],
  };

  const geymueller = {
    id: "geymueller", group: "MAK",
    name: "MAK Geymüllerschlössel", short: "Geymüllerschlössel",
    address: "Khevenhüllerstraße 2, 1180 Wien", color: "#c0392b",
    note: "Ouvert de mai à novembre, généralement le week-end.",
    floors: [
      {
        id: "haus", name: "Villa", rooms: [
          R("biedermeier", "Biedermeier", "Intérieurs Biedermeier"),
          R("uhren", "Horloges", "Collection d'horloges Sobek"),
          R("garten", "Jardin", "Jardin"),
        ],
      },
    ],
  };

  // ---------------------------------------------------------------------
  // mumok
  // ---------------------------------------------------------------------
  const mumokLevels = [
    ["l4", "Niveau 4"], ["l3", "Niveau 3"], ["l2", "Niveau 2"], ["l1", "Niveau 1"],
    ["l0", "Niveau 0 – Entrée"], ["lm1", "Niveau -1"], ["lm2", "Niveau -2"], ["lm3", "Niveau -3"],
  ];
  const mumok = {
    id: "mumok", group: "mumok",
    name: "mumok – Musée d'art moderne", short: "mumok",
    address: "MuseumsQuartier, Museumsplatz 1, 1070 Wien", color: "#555",
    note: "Le mumok s'organise en niveaux ; les expositions changent régulièrement.",
    floors: [
      {
        id: "coupe", name: "Coupe du bâtiment (niveaux)", w: 100, h: 8 * 11 + 6,
        rooms: row(mumokLevels.map(([id, name]) => R(id, name, name)), 20, 3, 60, 8 * 11, true),
      },
    ],
  };

  // ---------------------------------------------------------------------
  // Österreichische Nationalbibliothek
  // ---------------------------------------------------------------------
  const prunksaal = {
    id: "prunksaal", group: "Österreichische Nationalbibliothek",
    name: "Prunksaal (salle d'apparat)", short: "Prunksaal",
    address: "Josefsplatz 1, 1010 Wien", color: "#1f5f8b",
    floors: [
      {
        id: "saal", name: "Prunksaal", w: 130, h: 40,
        rooms: [
          ...row([R("krieg", "Aile Guerre", "Aile de la Guerre (Kriegsflügel)")], 4, 8, 45, 24),
          ...row([R("oval", "Coupole", "Ovale central (coupole, statue de Charles VI)")], 49, 4, 32, 32),
          ...row([R("frieden", "Aile Paix", "Aile de la Paix (Friedensflügel)")], 81, 8, 45, 24),
        ],
      },
    ],
  };

  const oenbMuseen = {
    id: "oenb-museen", group: "Österreichische Nationalbibliothek",
    name: "Musées de la Nationalbibliothek", short: "Musées ÖNB",
    address: "Herrengasse 9 / Johannesgasse 6 / Heldenplatz, 1010 Wien", color: "#1f5f8b",
    floors: [
      { id: "papyrus", name: "Papyrusmuseum (Neue Burg)", rooms: [R("papyrus", "Papyrus", "Papyrusmuseum")] },
      {
        id: "mollard", name: "Palais Mollard (Herrengasse 9)", rooms: [
          R("globen", "Globes", "Globenmuseum"),
          R("esperanto", "Esperanto", "Esperantomuseum et langues construites"),
        ],
      },
      {
        id: "literatur", name: "Literaturmuseum (Grillparzerhaus)", rooms: [
          R("lit-1", "Étage 1", "Literaturmuseum – 1er niveau"),
          R("lit-2", "Étage 2", "Literaturmuseum – 2e niveau"),
          R("lit-3", "Étage 3", "Literaturmuseum – 3e niveau"),
        ],
      },
    ],
  };

  const hdgoe = {
    id: "hdgoe", group: "Österreichische Nationalbibliothek",
    name: "Haus der Geschichte Österreich", short: "hdgö",
    address: "Neue Burg, Heldenplatz, 1010 Wien", color: "#1f5f8b",
    floors: [
      {
        id: "ausst", name: "Exposition (Neue Burg)", rooms: [
          R("altan", "Balcon", "Hitler-Balkon / Altan (vue)"),
          R("haupt", "Permanente", "Exposition principale – histoire depuis 1918"),
          R("sonder", "Temporaire", "Exposition temporaire"),
        ],
      },
    ],
  };

  // ---------------------------------------------------------------------
  // Technisches Museum Wien
  // ---------------------------------------------------------------------
  const tmw = {
    id: "tmw", group: "Technisches Museum Wien",
    name: "Technisches Museum Wien", short: "TMW",
    address: "Mariahilfer Straße 212, 1140 Wien", color: "#d35400",
    note: "Grand hall central sur plusieurs niveaux ; noms d'expositions indicatifs.",
    floors: [
      {
        id: "eg", name: "Rez-de-chaussée", w: 130, h: 50,
        rooms: [
          ...row([R("eg-natur", "Nature & connaissance", "Natur und Erkenntnis")], 4, 4, 36, 42),
          ...row([R("eg-halle", "Grand hall", "Grand hall central")], 40, 4, 50, 42),
          ...row([R("eg-schwer", "Industrie lourde", "Schwerindustrie"), R("eg-energie", "Énergie", "Energie")], 90, 4, 36, 42, true),
        ],
      },
      {
        id: "1og", name: "1er étage", rooms: [
          R("1-alltag", "Quotidien", "Alltag – eine Gebrauchsanweisung"),
          R("1-mobil", "Mobilité", "Mobilität"),
          R("1-arbeit", "Travail", "In Arbeit"),
        ],
      },
      {
        id: "2og", name: "2e étage", rooms: [
          R("2-medien", "Médias", "medien.welten"),
          R("2-musik", "Musique", "Instruments de musique"),
          R("2-weiter", "Futur", "weiter_gedacht_ (le futur)"),
        ],
      },
      { id: "kinder", name: "Pour les enfants", rooms: [R("mini", "das mini", "das mini (0–6 ans)")] },
    ],
  };

  window.MUSEUMS = [
    khm, schatzkammer, weltmuseum, neueBurg, theatermuseum, wagenburg, ambras,
    nhm, narrenturm,
    albertina, albertinaModern, albertinaKlosterneuburg,
    oberesBelvedere, unteresBelvedere, belvedere21,
    mak, geymueller,
    mumok,
    prunksaal, oenbMuseen, hdgoe,
    tmw,
  ];
})();
