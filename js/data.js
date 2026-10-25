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

  // Range des salles dans une partie du musée (pour « tout marquer vu »).
  function sec(name, rooms) {
    rooms.forEach((r) => { r.section = name; });
    return rooms;
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
    sec("Égypte et Proche-Orient", left.slice(0, 8));
    sec("Antiquités grecques et romaines", left.slice(8));
    const [lt, lr, lb, ll] = split(left, 6, 3, 6, 3);
    const kk = sec("Kunstkammer", series("hp-", 20, 37, "roman", (n, s) => `Saal ${s} – Kunstkammer`));
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
        ...sec("Espaces centraux", [
          ...row([R("hp-treppe", "Escalier", "Escalier d'honneur (Thésée de Canova, peintures de Klimt)")], 62, 4, 16, 72),
        ]),
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
    sec("Italie, Espagne, France", [...kabW, ...saeleW]);
    sec("Flandres, Pays-Bas, Allemagne", [...kabE, ...saeleE]);
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
        ...sec("Espaces centraux", [
          ...row([R("og-kuppel", "Coupole", "Kuppelhalle (salle de la coupole)")], 62, 4, 16, 40),
          ...row([R("og-treppe", "Escalier", "Galerie de l'escalier d'honneur (Klimt)")], 62, 44, 16, 32),
        ]),
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
          ...row(series("mk-", 1, 3, "roman", (n, s) => [
            "Saal I – Médailles et décorations",
            "Saal II – Monnaies et papier-monnaie",
            "Saal III – Expositions temporaires",
          ][n - 1]), 4, 4, 60, 32),
        ],
      },
    ],
  };

  // ---------------------------------------------------------------------
  // Naturhistorisches Museum (bâtiment jumeau du KHM)
  // Numérotation et thèmes des salles : nhm.at (Dauerausstellung).
  // ---------------------------------------------------------------------
  function nhmTitle(n) {
    if (n <= 4) return `Saal ${n} – Minéraux, pierres précieuses, roches`;
    if (n === 5) return "Saal 5 – Météorites";
    if (n <= 9) return `Saal ${n} – Histoire de la Terre, fossiles`;
    if (n === 10) return "Saal 10 – Dinosaures";
    if (n <= 13) return `Saal ${n} – Préhistoire`;
    if (n <= 15) return `Saal ${n} – Anthropologie`;
    if (n === 16) return "Saal 16 – Enfants de l'ère glaciaire";
    if (n === 21) return "Saal 21 – Nouvelles perspectives";
    if (n <= 23) return `Saal ${n} – Unicellulaires, coraux, mollusques`;
    if (n === 24) return "Saal 24 – Crustacés, arachnides, insectes";
    if (n <= 26) return `Saal ${n} – Poissons`;
    if (n <= 28) return `Saal ${n} – Amphibiens et reptiles`;
    if (n <= 32) return `Saal ${n} – Oiseaux`;
    return `Saal ${n} – Mammifères`;
  }
  function nhmSection(n) {
    if (n <= 5) return "Minéraux et météorites";
    if (n <= 10) return "Histoire de la Terre et dinosaures";
    if (n <= 16) return "Préhistoire et anthropologie";
    if (n <= 24) return "Invertébrés";
    if (n <= 28) return "Poissons, amphibiens, reptiles";
    if (n <= 32) return "Oiseaux";
    return "Mammifères";
  }
  const nhmHp = series("s", 1, 16, "arabic", (n) => nhmTitle(n));
  const nhmOg = series("s", 21, 39, "arabic", (n) => nhmTitle(n));
  [...nhmHp, ...nhmOg].forEach((r) => { r.section = nhmSection(Number(r.label)); });
  const [nhL_t, nhL_r, nhL_b, nhL_l] = split(nhmHp.slice(0, 8), 3, 1, 3, 1);
  const [nhR_t, nhR_r, nhR_b] = split(nhmHp.slice(8), 3, 2, 3);
  const [noL_t, noL_r, noL_b, noL_l] = split(nhmOg.slice(0, 10), 4, 1, 4, 1);
  const [noR_t, noR_r, noR_b] = split(nhmOg.slice(10), 4, 1, 4);

  const nhm = {
    id: "nhm", group: "Naturhistorisches Museum",
    name: "Naturhistorisches Museum", short: "NHM",
    address: "Maria-Theresien-Platz, 1010 Wien", color: "#4e7a3a",
    floors: [
      {
        id: "hp", name: "Hochparterre – Minéraux, fossiles, préhistoire", w: 140, h: 88,
        decor: [outline(4, 4, 132, 72), court(18, 18, 30, 44), court(92, 18, 30, 44), label(70, 84, "▲ Entrée")],
        rooms: [
          ...ring({ top: nhL_t, right: nhL_r, bottom: nhL_b, left: nhL_l }, 4, 4, 58, 72, 14),
          ...ring({ top: nhR_t, right: nhR_r, bottom: nhR_b }, 78, 4, 58, 72, 14),
        ],
      },
      {
        id: "1og", name: "1er étage – Zoologie", w: 140, h: 80,
        decor: [outline(4, 4, 132, 72), court(18, 18, 30, 44), court(92, 18, 30, 44)],
        rooms: [
          ...ring({ top: noL_t, right: noL_r, bottom: noL_b, left: noL_l }, 4, 4, 58, 72, 14),
          ...ring({ top: noR_t, right: noR_r, bottom: noR_b }, 78, 4, 58, 72, 14),
        ],
      },
    ],
  };

  const narrenturm = {
    id: "narrenturm", group: "Naturhistorisches Museum",
    name: "Narrenturm", short: "Narrenturm",
    address: "Campus de l'Altes AKH, 1090 Wien", color: "#4e7a3a",
    note: "Collection pathologique et anatomique du NHM. Contient des préparations humaines.",
    floors: [
      { id: "eg", name: "Rez-de-chaussée", rooms: [R("eg-a", "Exposition", "Exposition permanente (19 salles)")] },
    ],
  };

  // ---------------------------------------------------------------------
  // Autres sites du KHM-Museumsverband
  // ---------------------------------------------------------------------
  const schatzkammer = {
    id: "schatzkammer", group: "KHM-Museumsverband",
    name: "Kaiserliche Schatzkammer", short: "Schatzkammer",
    address: "Hofburg, Schweizerhof, 1010 Wien", color: "#9b5d2e",
    floors: [
      {
        id: "weltlich", name: "Trésor profane (Weltliche Schatzkammer)", rooms: sec("Trésor profane", [
          R("w-reich", "Saint-Empire", "Insignes du Saint-Empire (couronne impériale)"),
          R("w-rudolf", "Couronne Rodolphe II", "Couronne de Rodolphe II (couronne de l'empire d'Autriche)"),
          R("w-erbstuecke", "Ainkhürn", "« Ainkhürn » et coupe en agate"),
          R("w-burgund", "Bourgogne", "Trésor de Bourgogne et Toison d'or"),
        ]),
      },
      {
        id: "geistlich", name: "Trésor ecclésiastique (Geistliche Schatzkammer)",
        rooms: sec("Trésor ecclésiastique", [R("g-1", "Trésor eccl.", "Trésor ecclésiastique")]),
      },
    ],
  };

  const weltmuseum = {
    id: "weltmuseum", group: "KHM-Museumsverband",
    name: "Weltmuseum Wien", short: "Weltmuseum",
    address: "Neue Burg, Heldenplatz, 1010 Wien", color: "#2f6f8f",
    note: "Certaines salles peuvent être fermées : voir le plan interactif du musée.",
    floors: [
      {
        id: "hp", name: "Mezzanine – Collection permanente (13 salles)", w: 120, h: 50,
        rooms: [
          ...row(series("s", 1, 7, "arabic", (n) => `Salle ${n} – Collection permanente`), 4, 4, 112, 18),
          ...row(series("s", 8, 13, "arabic", (n) => `Salle ${n} – Collection permanente`), 4, 28, 96, 18),
        ],
      },
      { id: "sonder", name: "Expositions temporaires", rooms: [R("sonder", "Temporaire", "Expositions temporaires")] },
    ],
  };

  const neueBurg = {
    id: "neueburg", group: "KHM-Museumsverband",
    name: "Neue Burg – collections du KHM", short: "Neue Burg",
    address: "Neue Burg, Heldenplatz, 1010 Wien", color: "#9b5d2e",
    floors: [
      {
        id: "neueburg", name: "Collections de la Neue Burg", rooms: [
          R("eph", "Ephesos", "Ephesos Museum"),
          R("hjrk", "Armures", "Hofjagd- und Rüstkammer (armes et armures)"),
          R("sam", "Instruments", "Sammlung alter Musikinstrumente (instruments anciens)"),
        ],
      },
    ],
  };

  const theatermuseum = {
    id: "theatermuseum", group: "KHM-Museumsverband",
    name: "Theatermuseum", short: "Theatermuseum",
    address: "Palais Lobkowitz, Lobkowitzplatz 2, 1010 Wien", color: "#9b5d2e",
    note: "Fermé pour travaux d'août 2025 à l'automne 2026 : vérifiez la réouverture.",
    floors: [
      {
        id: "palais", name: "Palais Lobkowitz", rooms: [
          R("eroica", "Eroica-Saal", "Eroica-Saal"),
          R("sonder", "Exposition", "Expositions"),
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
        id: "eg", name: "Collection de carrosses", rooms: [
          R("halle", "Carrosses", "Carrosses de la cour impériale"),
          R("kroenung", "Imperialwagen", "Grand carrosse du couronnement (« Imperialwagen »)"),
          R("sisi", "Sisi", "Parcours Sisi (Sisi-Pfad)"),
          R("trauer", "Corbillard", "Corbillard noir"),
        ],
      },
    ],
  };

  const ambras = {
    id: "ambras", group: "KHM-Museumsverband",
    name: "Schloss Ambras Innsbruck", short: "Ambras",
    address: "Schlossstraße 20, 6020 Innsbruck", color: "#9b5d2e",
    note: "Fermé en novembre. Galerie de portraits ouverte d'avril à octobre.",
    floors: [
      {
        id: "unter", name: "Château bas (Unterschloss)", rooms: [
          R("ruest", "Armures", "Chambres d'armures (Rüstkammern)"),
          R("kunst", "Wunderkammer", "Chambre d'art et de merveilles (Kunst- und Wunderkammer)"),
        ],
      },
      {
        id: "hoch", name: "Château haut (Hochschloss)", rooms: [
          R("portrait", "Portraits", "Galerie de portraits des Habsbourg"),
        ],
      },
      {
        id: "autres", name: "Autres lieux du château", rooms: [
          R("spanisch", "Saal Esp.", "Salle espagnole (Spanischer Saal)"),
          R("bad", "Bain", "Bain de Philippine Welser"),
        ],
      },
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
        id: "prunk", name: "Salles d'apparat des Habsbourg (Prunkräume)", rooms: [
          R("p-musen", "Muses", "Salle des Muses (Musensaal)"),
          R("p-gold", "Cab. doré", "Cabinet doré (Goldkabinett)"),
          R("p-wedgwood", "Wedgwood", "Cabinet Wedgwood"),
          R("p-autres", "Autres salles", "Autres salles d'apparat"),
        ],
      },
      {
        id: "samm", name: "Collection permanente & expositions", rooms: [
          R("batliner", "Collection Batliner", "Collection Batliner (« Monet bis Picasso » / « Monet to Chagall »)"),
          R("sonder", "Temporaires", "Expositions temporaires"),
        ],
      },
    ],
  };

  const albertinaModern = {
    id: "albertina-modern", group: "Albertina",
    name: "Albertina Modern", short: "Albertina Modern",
    address: "Künstlerhaus, Karlsplatz 5, 1010 Wien", color: "#7a3b6e",
    floors: [
      { id: "ausst", name: "Expositions", rooms: [R("ausst", "Expositions", "Expositions en cours")] },
    ],
  };

  const albertinaKlosterneuburg = {
    id: "albertina-klosterneuburg", group: "Albertina",
    name: "Albertina Klosterneuburg", short: "Klosterneuburg",
    address: "An der Donau-Au 1, 3400 Klosterneuburg", color: "#7a3b6e",
    note: "Horaires restreints, vérifiez avant d'y aller.",
    floors: [
      { id: "depot", name: "Bâtiment", rooms: [R("depot", "Dépôt", "Dépôt visitable"), R("ausst", "Expositions", "Expositions en cours")] },
    ],
  };

  // ---------------------------------------------------------------------
  // Belvedere
  // ---------------------------------------------------------------------
  const oberesBelvedere = {
    id: "oberes-belvedere", group: "Belvedere",
    name: "Oberes Belvedere", short: "Haut Belvédère",
    address: "Prinz-Eugen-Straße 27, 1030 Wien", color: "#b08d2c",
    note: "Découpage par aile indicatif : l'accrochage de la collection change.",
    floors: [
      {
        id: "eg", name: "Rez-de-chaussée", w: 130, h: 40,
        decor: [label(65, 38, "▲ Entrée")],
        rooms: [
          ...row([R("eg-mittel1", "Aile ouest", "Rez-de-chaussée – aile ouest")], 4, 4, 44, 28),
          ...row([R("eg-sala", "Sala terrena", "Sala terrena"), R("eg-carlone", "Carlone", "Carlone-Saal")], 48, 4, 34, 28, true),
          ...row([R("eg-temp1", "Aile est", "Rez-de-chaussée – aile est")], 82, 4, 44, 28),
        ],
      },
      {
        id: "1og", name: "1er étage", w: 130, h: 40,
        rooms: [
          ...row([R("1-barock", "Aile ouest", "1er étage – aile ouest")], 4, 4, 44, 32),
          ...row([R("1-marmor", "Marmorsaal", "Salle de marbre (Marmorsaal)")], 48, 4, 34, 32),
          ...row([R("1-klimt", "Aile est", "1er étage – aile est")], 82, 4, 44, 32),
        ],
      },
      {
        id: "2og", name: "2e étage", w: 130, h: 40,
        rooms: [
          ...row([R("2-biedermeier", "Aile ouest", "2e étage – aile ouest")], 4, 4, 60, 32),
          ...row([R("2-realismus", "Aile est", "2e étage – aile est")], 66, 4, 60, 32),
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
        id: "eg", name: "Palais", w: 130, h: 30,
        rooms: row([
          R("groteske", "Grotesques", "Salle des grotesques (Groteskensaal)"),
          R("marmorgalerie", "Galerie", "Galerie de marbre (Marmorgalerie)"),
          R("gold", "Cab. doré", "Cabinet doré (Goldkabinett)"),
          R("temp", "Temporaire", "Expositions temporaires"),
        ], 4, 4, 122, 22),
      },
      {
        id: "neben", name: "Bâtiments annexes", rooms: [
          R("orangerie", "Orangerie", "Orangerie"),
          R("prunkstall", "Écuries", "Écuries d'apparat (Prunkstall) – art médiéval"),
        ],
      },
    ],
  };

  const belvedere21 = {
    id: "belvedere21", group: "Belvedere",
    name: "Belvedere 21", short: "Belvedere 21",
    address: "Arsenalstraße 1, 1030 Wien", color: "#b08d2c",
    floors: [
      {
        id: "eg", name: "Pavillon et jardin", rooms: [
          R("halle", "Expositions", "Expositions du pavillon"),
          R("relief", "Relief", "Grand relief de Fritz Wotruba (devant la façade)"),
          R("garten", "Sculptures", "Jardin de sculptures"),
          R("kino", "Kino", "Blickle Kino"),
        ],
      },
      { id: "ug", name: "Niveau inférieur", rooms: [R("wotruba", "Wotruba", "Dépôt et salle d'étude Fritz Wotruba")] },
    ],
  };

  // ---------------------------------------------------------------------
  // MAK
  // ---------------------------------------------------------------------
  const mak = {
    id: "mak", group: "MAK",
    name: "MAK – Musée des arts appliqués", short: "MAK",
    address: "Stubenring 5, 1010 Wien", color: "#c0392b",
    note: "Salles de la collection permanente d'après mak.at ; étage non indiqué.",
    floors: [
      {
        id: "schau", name: "Collection permanente", rooms: [
          R("eg-rom", "Renaissance", "Renaissance Barock Rokoko"),
          R("eg-barock", "Baroque", "Barock Rokoko Klassizismus"),
          R("eg-empire", "Empire", "Empire Biedermeier"),
          R("eg-histor", "Historicisme", "Historismus Jugendstil"),
          R("1-wien1900", "Vienne 1900", "Wien 1900"),
          R("eg-teppiche", "Tapis", "Textiles et tapis"),
          R("eg-asien", "Asie", "Asien"),
          R("ug-design", "Design Labor", "MAK Design Labor"),
        ],
      },
      { id: "sonder", name: "Expositions temporaires", rooms: [R("eg-sonder", "Temporaires", "Expositions temporaires")] },
    ],
  };

  const geymueller = {
    id: "geymueller", group: "MAK",
    name: "MAK Geymüllerschlössel", short: "Geymüllerschlössel",
    address: "Pötzleinsdorfer Straße 102, 1180 Wien", color: "#c0392b",
    note: "Ouvert de mai à novembre, le week-end.",
    floors: [
      {
        id: "haus", name: "Villa", rooms: [
          R("biedermeier", "Mobilier", "Mobilier Empire et Biedermeier"),
          R("uhren", "Horloges", "Horloges de la collection Sobek"),
          R("garten", "Parc", "Parc et sculptures contemporaines"),
        ],
      },
    ],
  };

  // ---------------------------------------------------------------------
  // mumok
  // ---------------------------------------------------------------------
  const mumokLevels = [
    ["l4", "Niveau 4"], ["l3", "Niveau 3"], ["l2", "Niveau 2"], ["l1", "Niveau 1"],
    ["l0", "Niveau 0"], ["lm1", "Niveau -1"], ["lm2", "Niveau -2"], ["lm3", "Niveau -3"],
  ];
  const mumok = {
    id: "mumok", group: "mumok",
    name: "mumok – Musée d'art moderne", short: "mumok",
    address: "MuseumsQuartier, Museumsplatz 1, 1070 Wien", color: "#555",
    note: "Huit niveaux reliés par des ascenseurs vitrés ; les expositions changent régulièrement.",
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
          ...row([R("krieg", "Partie gauche", "Partie gauche de la salle")], 4, 8, 45, 24),
          ...row([R("oval", "Ovale", "Ovale central (coupole, statue de Charles VI)")], 49, 4, 32, 32),
          ...row([R("frieden", "Partie droite", "Partie droite de la salle")], 81, 8, 45, 24),
        ],
      },
    ],
  };

  const oenbMuseen = {
    id: "oenb-museen", group: "Österreichische Nationalbibliothek",
    name: "Musées de la Nationalbibliothek", short: "Musées ÖNB",
    address: "Neue Burg · Herrengasse 9 · Grillparzerhaus, 1010 Wien", color: "#1f5f8b",
    floors: [
      { id: "papyrus", name: "Papyrusmuseum (Neue Burg)", rooms: [R("papyrus", "Papyrus", "Papyrusmuseum")] },
      {
        id: "mollard", name: "Palais Mollard (Herrengasse 9)", rooms: [
          R("globen", "Globes", "Globenmuseum"),
          R("esperanto", "Esperanto", "Esperantomuseum"),
        ],
      },
      { id: "literatur", name: "Literaturmuseum (Grillparzerhaus)", rooms: [R("lit-1", "Littérature", "Literaturmuseum")] },
    ],
  };

  const hdgoe = {
    id: "hdgoe", group: "Österreichische Nationalbibliothek",
    name: "Haus der Geschichte Österreich", short: "hdgö",
    address: "Neue Burg, Heldenplatz, 1010 Wien", color: "#1f5f8b",
    floors: [
      { id: "mezz", name: "Mezzanine", rooms: [R("haupt", "Neue Zeiten", "Exposition principale « Neue Zeiten. Österreich seit 1918 »")] },
      { id: "1og", name: "1er étage", rooms: [R("sonder", "Temporaire", "Expositions temporaires")] },
    ],
  };

  // ---------------------------------------------------------------------
  // Technisches Museum Wien
  // ---------------------------------------------------------------------
  const tmw = {
    id: "tmw", group: "Technisches Museum Wien",
    name: "Technisches Museum Wien", short: "TMW",
    address: "Mariahilfer Straße 212, 1140 Wien", color: "#d35400",
    note: "Expositions permanentes d'après technischesmuseum.at ; étage non indiqué.",
    floors: [
      {
        id: "dauer", name: "Expositions permanentes", rooms: [
          R("material", "Materialwelten", "Materialwelten (mondes des matériaux)"),
          R("alltag", "Alltag", "Alltag (la technique au quotidien)"),
          R("mobil", "Mobilität", "Mobilität (mobilité)"),
          R("arbeit", "In Arbeit", "In Arbeit (le travail)"),
          R("wissenschaft", "Wissenschaft", "Wissenschaft im Wandel (la science en mutation)"),
          R("klima", "Klima", "Klima. Wissen. Handeln! (climat)"),
          R("lok", "LOK.erlebnis", "LOK.erlebnis (collection ferroviaire)"),
          R("minix", "miniXplore", "miniXplore (enfants de 3 à 8 ans)"),
        ],
      },
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
