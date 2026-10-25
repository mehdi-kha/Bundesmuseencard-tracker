/*
 * Guide de visite.
 *
 * Tous les textes sont rédigés uniquement à partir des sites officiels des
 * musées, cités dans `src` pour chaque entrée. Rien n'est ajouté au-delà de
 * ce que disent ces sources. Pour ajouter une entrée, citez toujours la page
 * officielle utilisée.
 *
 * Structure par musée :
 *   intro    : présentation générale du site
 *   sections : textes par partie (clé = nom de la partie dans data.js)
 *   rooms    : textes par salle (clé = id de la salle dans data.js)
 * Chaque entrée : { text, see?: [œuvres à voir], src: [urls] }
 */
(function () {
  "use strict";

  window.GUIDES = {
    // -------------------------------------------------------------------
    khm: {
      intro: {
        text: "Bâtiment construit de 1871 à 1891 par Gottfried Semper et Carl von Hasenauer. " +
          "L'escalier d'honneur et la Kuppelhalle comptent selon le musée parmi les intérieurs les plus précieux de l'architecture muséale européenne. " +
          "L'appli KHM propose un parcours court de dix œuvres de la collection égyptienne.",
        src: [
          "https://www.khm.at/ausstellungen/gemaeldegalerie",
          "https://www.khm.at/en/exhibitions/the-kunsthistorisches-museum-gesamtkunstwerk",
          "https://www.khm.at/programm/angebote/khm-app",
        ],
      },
      sections: {
        "Égypte et Proche-Orient": {
          text: "Environ 18 500 objets d'Égypte ancienne et du Proche-Orient, exposés en permanence au Hochparterre. " +
            "Les salles I à VI ont un décor égyptisant de la fin du XIXe siècle. " +
            "Trois colonnes monolithes en granit rose de plus de six mètres, trouvées à Alexandrie et offertes à François-Joseph en 1869, portent le plafond.",
          src: [
            "https://www.khm.at/ausstellungen/aegyptisch-orientalische-sammlung",
            "https://www.khm.at/digital/videos/drei-altaegyptische-papyrusbuendelsaeulen-in-wien",
          ],
        },
        "Antiquités grecques et romaines": {
          text: "La collection d'antiquités grecques et romaines occupe les salles qui suivent la collection égyptienne au Hochparterre.",
          src: ["https://www.khm.at/ausstellungen/antikensammlung"],
        },
        "Kunstkammer": {
          text: "Environ 2 200 objets de la fin du Moyen Âge au baroque, répartis en 20 salles thématiques. " +
            "Pièces phares : la Saliera de Cellini, la Madone de Krumau, les horloges et automates.",
          src: ["https://www.khm.at/ausstellungen/kunstkammer-wien", "https://www.khm.at/besuch/only-in-vienna"],
        },
        "Italie, Espagne, France": {
          text: "La Gemäldegalerie occupe tout le 1er étage, avec plus de 770 œuvres sur quatre siècles. " +
            "Elle compte l'une des plus grandes collections de peinture vénitienne, ainsi que des œuvres espagnoles (Velázquez) et françaises des XVIIe et XVIIIe siècles.",
          src: ["https://www.khm.at/ausstellungen/gemaeldegalerie", "https://booking.khm.at/fileadmin/downloads/khm_gruppenplaner_de.pdf"],
        },
        "Flandres, Pays-Bas, Allemagne": {
          text: "Peinture flamande, néerlandaise et allemande. Le musée possède douze tableaux de Pieter Bruegel l'Ancien, la plus grande collection au monde. " +
            "La Malkunst de Vermeer est aussi exposée dans la Gemäldegalerie.",
          src: [
            "https://www.khm.at/ausstellungen/gemaeldegalerie/the-best-of-bruegel-only-in-vienna",
            "https://www.khm.at/ausstellungen/gemaeldegalerie",
          ],
        },
      },
      rooms: {
        "hp-1": {
          text: "Décor égyptisant d'origine ; les murs portent des reproductions de peintures d'une tombe de Beni Hassan, réalisées par Ernst Weidenbach lors de l'expédition prussienne de Richard Lepsius. " +
            "On y voit notamment un sarcophage momiforme provenant de Gamhud (IIe–Ier siècle av. J.-C.).",
          see: ["Sarcophage momiforme de Gamhud"],
          src: ["https://www.khm.at/ausstellungen/aegyptisch-orientalische-sammlung", "https://www.khm.at/kunstwerke/mumienfoermiger-sarg-mit-resten-einer-mumie-316926"],
        },
        "hp-2": {
          text: "Chapelle funéraire du fonctionnaire Ka-ni-nisut (Gizeh, début de la Ve dynastie, vers 2500 av. J.-C.), découverte en 1913 par une équipe autrichienne. " +
            "Ses murs montrent le rituel d'offrandes. La plupart des fiches du musée la placent dans cette salle. " +
            "Les murs portent aussi les reproductions de Beni Hassan.",
          see: ["Kultkammer des Ka-ni-nisut"],
          src: ["https://www.khm.at/en/artworks/chapel-of-ka-ni-nisut-317061", "https://khm.at/objektdb/detail/317061"],
        },
        "hp-5": {
          text: "Reproductions de peintures de la tombe de Beni Hassan, en place depuis l'ouverture du musée en 1891. " +
            "On y voit l'hippopotame en faïence (vers 2000 av. J.-C.) : au Moyen Empire, ces figurines accompagnaient les défunts, l'hippopotame symbolisant la régénération dans l'au-delà.",
          see: ["Hippopotame en faïence"],
          src: ["https://www.khm.at/ausstellungen/aegyptisch-orientalische-sammlung", "https://www.khm.at/kunstwerke/nilpferd-323860"],
        },
        "hp-10": {
          text: "Un fragment de la frise du Parthénon et le couvercle d'un sarcophage anthropoïde phénicien.",
          see: ["Fragment de la frise du Parthénon"],
          src: ["https://www.khm.at/kunstwerke/deckel-eines-anthropoiden-sarkophages-50183"],
        },
        "hp-11": {
          text: "La plus grande salle de la collection. La mosaïque de Thésée, trouvée en 1815 à Loig près de Salzbourg, est intégrée à son sol de marbre. " +
            "On y voit aussi le sarcophage des Amazones, en marbre pentélique, venu de Soloi à Chypre (seconde moitié du IVe siècle av. J.-C.).",
          see: ["Mosaïque de Thésée", "Sarcophage des Amazones"],
          src: ["https://www.khm.at/en/artworks/theseusmosaik-52079", "https://www.khm.at/en/artworks/amazonensarkophag-50832-1"],
        },
        "hp-14": {
          text: "Vases et pierres gravées sur le thème de Thésée.",
          src: ["https://www.khm.at/en/artworks/theseusmosaik-52079"],
        },
        "hp-16": {
          text: "Gemma Augustea : camée en onyx à deux couches (9–12 apr. J.-C.), 19 × 23 cm, célébrant Auguste et son successeur Tibère.",
          see: ["Gemma Augustea"],
          src: ["https://www.khm.at/kunstwerke/gemma-augustea-59171"],
        },
        "hp-22": {
          text: "Œuvres de lapidaires : un bassin et une aiguière de Dionysio Miseroni (1652), et une double coupe avec Pomone.",
          see: ["Bassin de Dionysio Miseroni (1652)"],
          src: ["https://www.khm.at/kunstwerke/doppelpokal-mit-pomona-87974"],
        },
        "hp-23": {
          text: "Une Immaculée Conception de Gérard van Opstal (XVIIe siècle) et une horloge de table de Nikolaus Planckh (avant 1631).",
          src: ["https://www.khm.at/kunstwerke/maria-immaculata-mit-jesus-und-johannesknaben-93209", "https://www.khm.at/kunstwerke/tischuhr-92887"],
        },
        "hp-27": {
          text: "Horloges et automates, dont la nef automate de Hans Schlottheim (1585) qui avance sur la table pendant que l'équipage bouge en musique.",
          see: ["Nef automate de Hans Schlottheim", "Horloges de Jobst Bürgi"],
          src: ["https://www.khm.at/forschung/sammlungen/kunstkammer-wien", "https://www.khm.at/kunstwerke/wanduhr-87036"],
        },
        "hp-29": {
          text: "La Saliera de Benvenuto Cellini (1540–1543), seule œuvre d'orfèvrerie en or conservée de l'artiste : or, émail, ébène et ivoire.",
          see: ["Saliera"],
          src: ["https://www.khm.at/en/artworks/saliera-87080-1"],
        },
        "hp-32": {
          text: "On y voit un automate, la « Cisterspielerin ».",
          src: ["https://www.khm.at/forschung/sammlungen/kunstkammer-wien"],
        },
        "hp-33": {
          text: "Bustes d'empereurs romains, dont Jules César et Galba.",
          see: ["Jules César", "Galba"],
          src: ["https://www.khm.at/kunstwerke/julius-caesar-93677", "https://www.khm.at/kunstwerke/kaiser-galba-93645"],
        },
        "hp-34": {
          text: "Vierge à l'Enfant avec deux anges musiciens de Donatello (vers 1460).",
          see: ["Donatello – Madone aux anges musiciens"],
          src: ["https://www.khm.at/kunstwerke/madonna-mit-kind-und-zwei-musizierenden-engeln-95118"],
        },
        "hp-35": {
          text: "Un calice et une Vierge en majesté entourée d'anges et de saints.",
          src: ["https://www.khm.at/kunstwerke/kelch-94809", "https://www.khm.at/kunstwerke/thronende-madonna-mit-heiligen-93726"],
        },
        "hp-36": {
          text: "Madone de Krumau (vers 1390/1400), associée à l'art de cour de Prague.",
          see: ["Krumauer Madonna"],
          src: ["https://www.khm.at/en/artworks/virgin-and-child-so-called-krumau-madonna-96174"],
        },
        "hp-treppe": {
          text: "Le groupe de Thésée de Canova (1805–1819) se trouve sur le palier. " +
            "Les peintures des écoinçons ont été commandées en 1890 à Franz Matsch et aux frères Ernst et Gustav Klimt.",
          src: ["https://www.khm.at/en/exhibitions/the-kunsthistorisches-museum-gesamtkunstwerk"],
        },
        "og-treppe": {
          text: "Écoinçons peints par Gustav Klimt en 1891, avec Franz Matsch et Ernst Klimt.",
          src: ["https://www.khm.at/en/exhibitions/the-kunsthistorisches-museum-gesamtkunstwerk"],
        },
        "og-kuppel": {
          text: "La Kuppelhalle, au sommet de l'escalier d'honneur, est décorée de peintures de Munkácsy, Makart et Klimt.",
          src: ["https://www.khm.at/en/exhibitions/the-kunsthistorisches-museum-gesamtkunstwerk"],
        },
        "gg-s1": {
          text: "Raphaël, La Madone au pré (Madonna im Grünen), 1505/1506.",
          see: ["Raphaël – Madonna im Grünen"],
          src: ["https://www.khm.at/kunstwerke/madonna-im-gruenen-1502"],
        },
        "gg-s2": {
          text: "Salle de Titien : Nymphe et berger (vers 1570/75, sujet toujours pas élucidé), Mars, Vénus et Amour, Lucrèce et son époux, et le portrait d'Isabelle d'Este.",
          see: ["Titien – Nymphe et berger", "Titien – Mars, Vénus et Amour", "Titien – Isabelle d'Este"],
          src: ["https://www.khm.at/kunstwerke/nymphe-und-schaefer-1950", "https://www.khm.at/kunstwerke/judith-mit-dem-haupt-des-holofernes-1108"],
        },
        "gg-s5": {
          text: "Salle du Caravage : La Madone du Rosaire (vers 1601 selon la page allemande, vers 1603 selon la page anglaise) et David avec la tête de Goliath (vers 1600/01).",
          see: ["Caravage – Rosenkranzmadonna", "Caravage – David et Goliath"],
          src: ["https://www.khm.at/kunstwerke/rosenkranzmadonna-425", "https://www.khm.at/kunstwerke/david-mit-dem-haupt-des-goliath-426"],
        },
        "gg-k3": {
          text: "Parmesan, Autoportrait au miroir convexe (vers 1523/24), jeu entre miroir et tableau sur la peinture comme illusion ; et Corrège, Jupiter et Io (vers 1530).",
          see: ["Parmesan – Autoportrait au miroir convexe", "Corrège – Jupiter et Io"],
          src: ["https://www.khm.at/kunstwerke/selbstbildnis-im-konvexspiegel-1407", "https://www.khm.at/kunstwerke/jupiter-und-io-40"],
        },
        "gg-k8": {
          text: "Les têtes composées d'Arcimboldo : L'Été et L'Hiver (1563). L'Été provient de la Kunstkammer de Rodolphe II.",
          see: ["Arcimboldo – L'Été", "Arcimboldo – L'Hiver"],
          src: ["https://www.khm.at/kunstwerke/sommer-71", "https://www.khm.at/en/artworks/water-74"],
        },
        "gg-k10": {
          text: "Les portraits des infantes de Velázquez, dont l'infante Marguerite en robe bleue.",
          see: ["Velázquez – Infantin Margarita in blauem Kleid", "Velázquez – Infantin María Teresa"],
          src: ["https://www.khm.at/kunstwerke/infantin-margarita-1651-1673-in-blauem-kleid-2027", "https://www.khm.at/en/object/2024/"],
        },
        "gg-s10": {
          text: "La salle Bruegel. Le musée possède douze tableaux de Pieter Bruegel l'Ancien.",
          see: ["Chasseurs dans la neige", "Jeux d'enfants (1560)", "Le Portement de croix (1564)", "Le Repas de noces", "La Conversion de saint Paul (1567)", "Le Retour du troupeau (1565)", "La Danse des paysans"],
          src: [
            "https://www.khm.at/kunstwerke/jaeger-im-schnee-winter-327",
            "https://www.khm.at/ausstellungen/gemaeldegalerie/the-best-of-bruegel-only-in-vienna",
          ],
        },
        "gg-s11": {
          text: "Peinture allemande de la Renaissance : le Retable de tous les saints de Dürer (« Landauer Altar », 1511) et son portrait de l'empereur Maximilien Ier (1519), Jane Seymour de Holbein (vers 1536/37) et Judith de Cranach (vers 1530).",
          see: ["Dürer – Allerheiligenbild", "Dürer – Maximilien Ier", "Holbein – Jane Seymour", "Cranach – Judith"],
          src: ["https://khm.at/de/objektdb/detail/615", "https://www.khm.at/en/exhibitions/picture-gallery"],
        },
        "gg-s12": {
          text: "Rembrandt, Grand autoportrait (1652). Selon sa fiche, L'Art de la peinture de Vermeer (vers 1666/68), allégorie de la peinture dont le modèle pose en Clio, est aussi exposée ici ; une autre page du musée indique le Kabinett 16.",
          see: ["Rembrandt – Grand autoportrait", "Vermeer – L'Art de la peinture"],
          src: ["https://www.khm.at/kunstwerke/grosses-selbstbildnis-1516", "https://www.khm.at/kunstwerke/die-malkunst-2574"],
        },
        "gg-k20": {
          text: "Rubens, Hélène Fourment dite « La Petite Pelisse » (vers 1636/38).",
          see: ["Rubens – Das Pelzchen"],
          src: ["https://www.khm.at/kunstwerke/helena-fourment-das-pelzchen-1637"],
        },
        "mk-1": {
          text: "Histoire de la médaille, de l'Italie vers 1400 au XXe siècle, et décorations autrichiennes et européennes.",
          src: ["https://www.khm.at/besuchen/sammlungen/muenzkabinett/"],
        },
        "mk-2": {
          text: "Monnaies et papier-monnaie, des moyens de paiement prémonétaires à nos jours.",
          src: ["https://www.khm.at/besuchen/sammlungen/muenzkabinett/"],
        },
        "mk-3": {
          text: "Salle réservée aux expositions temporaires.",
          src: ["https://www.khm.at/besuchen/sammlungen/muenzkabinett/"],
        },
      },
    },

    // -------------------------------------------------------------------
    schatzkammer: {
      intro: {
        text: "Couronnes et insignes qui ont représenté le pouvoir des Habsbourg depuis le Moyen Âge, autour de la couronne impériale du Saint-Empire, vieille de plus de 1 000 ans.",
        src: ["https://www.kaiserliche-schatzkammer.at/en/visit/habsburg-splendour/"],
      },
      sections: {
        "Trésor ecclésiastique": {
          text: "Vases liturgiques, trésors de reliques et vêtements sacerdotaux, témoins de la piété des Habsbourg.",
          src: ["https://www.kaiserliche-schatzkammer.at/en/visit/collections/secular-treasury/selected-masterpieces/"],
        },
      },
      rooms: {
        "w-reich": {
          text: "Les insignes et reliques du Saint-Empire romain germanique, le plus important trésor de sacre du Moyen Âge : la couronne impériale, vieille de plus de 1 000 ans, et la Sainte Lance. " +
            "On y voit aussi le globe impérial (vers 1200, 522 g) et le manteau du sacre (1133/34, ateliers royaux de Palerme), en soie rouge brodée d'or et de milliers de perles.",
          see: ["Couronne impériale", "Sainte Lance", "Globe impérial", "Manteau du sacre"],
          src: [
            "https://www.kaiserliche-schatzkammer.at/besuchen/sammlungen/weltliche-schatzkammer/",
            "https://www.khm.at/kunstwerke/der-reichsapfel-100444",
            "https://www.khm.at/objektdb/detail/100435/",
          ],
        },
        "w-rudolf": {
          text: "Couronne privée réalisée en 1602 à Prague pour Rodolphe II par l'orfèvre Jan Vermeyer. Contrairement à la plupart des couronnes privées, elle n'a pas été démontée à la mort de l'empereur ; elle est devenue la couronne de l'empire d'Autriche.",
          src: ["https://www.khm.at/kunstwerke/die-krone-kaiser-rudolfs-ii-spaeter-krone-des-kaisertums-oesterreichs-100360"],
        },
        "w-erbstuecke": {
          text: "La « corne de licorne » (Ainkhürn) est une défense de narval de 243 cm. La coupe en agate, taillée dans un seul bloc, est la plus grande œuvre de lapidaire antique conservée ; un motif évoquant les lettres « XRISTO » l'a fait identifier au Saint-Graal. Les héritiers de Ferdinand Ier les ont déclarées biens inaliénables de la maison d'Autriche.",
          see: ["Ainkhürn", "Achatschale"],
          src: ["https://www.khm.at/en/artworks/das-ainkhuern-einhorn-100590", "https://www.khm.at/objektdb/detail/100474/"],
        },
        "w-burgund": {
          text: "Restes du trésor des ducs de Bourgogne (XVe siècle) et trésor de l'ordre de la Toison d'or.",
          src: ["https://www.kaiserliche-schatzkammer.at/en/visit/collections/secular-treasury/selected-masterpieces/"],
        },
      },
    },

    // -------------------------------------------------------------------
    weltmuseum: {
      intro: {
        text: "La collection permanente se trouve à la mezzanine : 13 salles qui s'enchaînent « comme un collier d'histoires ». " +
          "Le plan interactif du musée liste tous les objets exposés et signale les salles fermées. " +
          "La coiffe de plumes de quetzal dite « Penacho » (vers 1515) est exposée dans la salle consacrée à la Mésoamérique.",
        see: ["Penacho (coiffe de plumes)"],
        src: [
          "https://www.weltmuseumwien.at/ausstellungen/schausammlung",
          "https://www.weltmuseumwien.at/saalplan",
          "https://www.weltmuseumwien.at/en/objects/quetzal-feathered-headdress-531234",
        ],
      },
    },

    // -------------------------------------------------------------------
    neueburg: {
      intro: {
        text: "Trois collections du Kunsthistorisches Museum se trouvent dans la Neue Hofburg.",
        src: ["https://www.khm.at/museum"],
      },
      rooms: {
        eph: {
          text: "Découvertes de l'ancienne Éphèse, « perle de l'Asie Mineure » : temples, thermes, théâtre et maisons illustrent l'architecture romaine.",
          src: ["https://www.khm.at/museum"],
        },
        hjrk: {
          text: "Armures, armes d'apparat, armes de chasse et de sport. Selon le musée, l'une des collections les mieux documentées du monde occidental.",
          src: ["https://www.khm.at/museum"],
        },
        sam: {
          text: "Instruments de la Renaissance et du baroque d'importance mondiale ; certains sont encore joués à des occasions particulières.",
          src: ["https://www.khm.at/museum"],
        },
      },
    },

    // -------------------------------------------------------------------
    theatermuseum: {
      intro: {
        text: "Les expositions sont suspendues de mi-août 2025 à octobre 2026 pour la transformation du Palais Lobkowitz, qui doit rouvrir agrandi à l'automne 2026.",
        src: ["https://www.khm.at/museum/presse"],
      },
      rooms: {
        eroica: {
          text: "La salle des fêtes du palais porte le nom de la 3e symphonie de Beethoven (« Eroica »), dédiée au prince Lobkowitz.",
          src: ["https://www.theatermuseum.at/vor-dem-vorhang/das-palais/"],
        },
      },
    },

    // -------------------------------------------------------------------
    wagenburg: {
      intro: {
        text: "Collection de carrosses de la cour impériale, à Schönbrunn. Le parcours Sisi, permanent depuis 2008, suit la vie de l'impératrice Élisabeth à travers ses véhicules et des objets personnels.",
        src: ["https://www.kaiserliche-wagenburg.at/besuchen/ausstellungen/sisi-pfad-durch-die-wagenburg/"],
      },
      rooms: {
        kroenung: {
          text: "Pièce centrale de la collection : un grand carrosse aux huit vitres de verre vénitien, probablement construit vers 1735/40 pour Charles VI puis plusieurs fois modifié.",
          src: ["https://www.khm.at/de/object/ada932da66/"],
        },
        sisi: {
          text: "On y voit le carrosse de mariage d'Élisabeth, l'Imperialwagen doré de son couronnement à Budapest et la voiture qu'elle utilisa juste avant son assassinat à Genève.",
          src: ["https://www.kaiserliche-wagenburg.at/besuchen/ausstellungen/sisi-pfad-durch-die-wagenburg/"],
        },
        trauer: {
          text: "Corbillard néo-baroque construit en 1876/77 pour les funérailles des membres régnants de la famille impériale ; dernière étape du parcours Sisi.",
          src: ["https://www.khm.at/kunstwerke/schwarzer-leichenwagen-497617"],
        },
      },
    },

    // -------------------------------------------------------------------
    ambras: {
      intro: {
        text: "L'archiduc Ferdinand II (1529–1595) fit transformer le château médiéval en château Renaissance pour son épouse Philippine Welser. Ouvert tous les jours de 10 h à 17 h, fermé en novembre.",
        src: ["https://www.schlossambras-innsbruck.at/fileadmin/user_upload/PT_SchlossAmbrasInnsbruck_DE_28-02-2025.pdf", "https://www.schlossambras-innsbruck.at/besuch"],
      },
      rooms: {
        kunst: {
          text: "Seule chambre d'art de la Renaissance conservée à son emplacement d'origine. Ferdinand II fit construire le château bas comme « Musaeum » pour l'abriter.",
          src: ["https://www.schlossambras-innsbruck.at/fileadmin/user_upload/PT_SchlossAmbrasInnsbruck_DE_28-02-2025.pdf"],
        },
        ruest: {
          text: "Harnais et armes, avec aussi peintures, instruments scientifiques et instruments de musique.",
          src: ["https://www.schlossambras-innsbruck.at/fileadmin/user_upload/PT_SchlossAmbrasInnsbruck_DE_28-02-2025.pdf"],
        },
        portrait: {
          text: "Sur trois étages du château haut, plus de 200 portraits racontent l'histoire des grandes dynasties européennes. Ouverte du 1er avril au 31 octobre.",
          src: ["https://www.schlossambras-innsbruck.at/das-schloss-entdecken/orte-im-schloss/hochschloss", "https://www.schlossambras-innsbruck.at/fileadmin/user_upload/PT_SchlossAmbrasInnsbruck_DE_28-02-2025.pdf"],
        },
        spanisch: {
          text: "Construite vers 1570, l'une des plus somptueuses salles de la Renaissance, avec un cycle de 27 portraits des princes du Tyrol.",
          src: ["https://www.schlossambras-innsbruck.at/fileadmin/user_upload/PT_SchlossAmbrasInnsbruck_DE_28-02-2025.pdf"],
        },
        bad: {
          text: "Seule installation de bains du XVIe siècle entièrement conservée : étuve, salle de bain et immense baignoire.",
          src: ["https://www.schlossambras-innsbruck.at/fileadmin/user_upload/PT_SchlossAmbrasInnsbruck_DE_28-02-2025.pdf"],
        },
      },
    },

    // -------------------------------------------------------------------
    nhm: {
      intro: {
        text: "Les salles du Hochparterre présentent minéraux, météorites, histoire de la Terre, dinosaures, préhistoire et anthropologie ; le 1er étage est consacré à la zoologie (salles 21 à 39).",
        src: ["https://www.nhm.at/ausstellung/dauerausstellung_schausammlung"],
      },
      sections: {
        "Minéraux et météorites": {
          text: "Salles 1 à 4 : minéraux classés de façon systématique (classification de Strunz), pierres précieuses et roches ; les pièces les plus précieuses sont dans des vitrines-coffres.",
          src: ["https://www.nhm.at/ausstellung/dauerausstellung__schausammlung/hochparterre/mineralien_gesteine_saal_1-4"],
        },
        "Histoire de la Terre et dinosaures": {
          text: "Salles 6 à 9 : les étapes de l'évolution, des unicellulaires aux mammifères et à l'homme moderne.",
          src: ["https://www.nhm.at/ausstellung/dauerausstellung__schausammlung/hochparterre/erdgeschichte_fossilienbrsaal_6-9"],
        },
        "Préhistoire et anthropologie": {
          text: "Salles 11 et 13 : préhistoire, présentée chronologiquement. Un « Venuskabinett » présente la Vénus de Willendorf ; les deux figures de Vénus sont les seuls objets de cette pièce. Salles 14–15 : anthropologie ; salle 16 : enfants de l'ère glaciaire.",
          see: ["Vénus de Willendorf"],
          src: ["https://www.nhm.at/ausstellung/dauerausstellung__schausammlung/hochparterre/urgeschichtebrsaal_11-13"],
        },
        "Poissons, amphibiens, reptiles": {
          text: "La collection de poissons compte environ un million de spécimens, dont seulement un pour mille est exposé. " +
            "Salles 27–28 : environ 1 000 espèces d'amphibiens et de reptiles, dont toutes les espèces d'Autriche (21 amphibiens et 15 reptiles).",
          src: [
            "https://www.nhm.at/ausstellung/dauerausstellung__schausammlung/erster_stock/fische_saal_25-26",
            "https://www.nhm.at/ausstellung/dauerausstellung_schausammlung/amphibien_reptilien",
          ],
        },
        "Oiseaux": {
          text: "Les salles 29 à 32 étaient fermées pour travaux ; le musée annonçait une nouvelle présentation des salles 29 et 30 pour le 29 septembre 2026. Environ 2 500 objets, près d'un quart des espèces d'oiseaux connues.",
          src: ["https://www.nhm.at/ausstellung/dauerausstellung__schausammlung/erster_stock/voegel_saal_29-32"],
        },
        "Mammifères": {
          text: "Présentés par ordre systématique : spécimens sur socle, en vitrines et en dioramas.",
          src: ["https://www.nhm.at/ausstellung/dauerausstellung__schausammlung/erster_stock/saeugetierebrsaal_33-39"],
        },
      },
      rooms: {
        s1: {
          text: "Systématique des éléments et sulfures, et formation des minéraux. Vitrine « Welt der Kristalle » (2023).",
          src: ["https://www.nhm.at/ausstellung/dauerausstellung__schausammlung/hochparterre/mineralien_gesteine_saal_1-4"],
        },
        s2: {
          text: "Sulfures, halogénures, oxydes et carbonates ; exposition « Minerale Österreichs ».",
          src: ["https://www.nhm.at/ausstellung/dauerausstellung__schausammlung/hochparterre/mineralien_gesteine_saal_1-4"],
        },
        s3: {
          text: "Carbonates, borates, sulfates et phosphates.",
          src: ["https://www.nhm.at/en/exhibitions/permanent_exhibitions/mezzanine_level/hall_1-4_minerals_gemstones"],
        },
        s4: {
          text: "Phosphates, arséniates et silicates, collection de pierres précieuses (dont le bouquet de pierres précieuses) et collection de roches.",
          see: ["Edelsteinstrauß (bouquet de pierres précieuses)"],
          src: ["https://www.nhm.at/en/exhibitions/permanent_exhibitions/mezzanine_level/hall_1-4_minerals_gemstones"],
        },
        s5: {
          text: "La plus grande exposition de météorites au monde : 1 100 météorites, salle entièrement rénovée en 2012.",
          src: ["https://www.nhm.at/ausstellung/dauerausstellung__schausammlung/hochparterre/meteoriten_saal_5"],
        },
        s10: {
          text: "Sur un podium central, les grands squelettes de Diplodocus, Allosaurus et Iguanodon ; au-dessus, un Pteranodon grandeur nature de 7 m d'envergure.",
          see: ["Diplodocus", "Allosaurus", "Iguanodon", "Pteranodon"],
          src: ["https://www.nhm.at/alte_meister_-_dinosaurier_und_meteorite"],
        },
        s12: {
          text: "Salle thématique entièrement consacrée au site de Hallstatt : la vallée du sel et la mine préhistorique. L'âge du fer ancien porte le nom des découvertes de la nécropole de Hallstatt.",
          src: ["https://www.nhm.at/ausstellung/dauerausstellung__schausammlung/hochparterre/urgeschichtebrsaal_11-13"],
        },
        s14: {
          text: "L'évolution des hominidés jusqu'au néolithique, avec un accent sur la bipédie et l'évolution du cerveau. Six stations à toucher, dont un modèle tactile des jumeaux du Wachtberg ; découvertes récentes comme les Dénisoviens et Homo floresiensis.",
          src: ["https://www.nhm.at/ausstellung/dauerausstellung__schausammlung/hochparterre/anthropologie_brsaal_14-15"],
        },
        s16: {
          text: "Salle pour enfants réaménagée en 2025 : l'ère glaciaire vue par les enfants, avec squelettes d'animaux, stations sur l'habitat, la chasse et l'alimentation, et une grotte. " +
            "À voir : le rhinocéros de Hundsheim et un mammouth en argile de Pavlov, parmi les plus anciens objets en céramique.",
          see: ["Rhinocéros de Hundsheim", "Mammouth en argile de Pavlov"],
          src: ["https://www.nhm.at/presse/ausstellungen_2025/kindereiszeitsaal"],
        },
        s21: {
          text: "Salle d'expositions temporaires.",
          src: ["https://www.nhm.at/ausstellung/dauerausstellung__schausammlung/erster_stock/neue_perspektiven_21"],
        },
        s22: {
          text: "Unicellulaires, éponges, cnidaires, « vers », escargots, moules, céphalopodes, échinodermes.",
          src: ["https://www.nhm.at/ausstellung/dauerausstellung__schausammlung/erster_stock/einzeller_korallen_weichtierebrsaal_22-23"],
        },
        s24: {
          text: "La diversité des insectes, avec crustacés, arachnides et mille-pattes dans les vitrines murales.",
          src: ["https://www.nhm.at/ausstellung/dauerausstellung_schausammlung/erster_stock/krebse_spinnentiere_insekten"],
        },
        s25: {
          text: "Une grande vitrine de requins, raies et chimères.",
          src: ["https://www.nhm.at/ausstellung/dauerausstellung__schausammlung/erster_stock/fische_saal_25-26"],
        },
        s26: {
          text: "Le poisson-lune et le cœlacanthe.",
          see: ["Poisson-lune", "Cœlacanthe"],
          src: ["https://www.nhm.at/ausstellung/dauerausstellung__schausammlung/erster_stock/fische_saal_25-26"],
        },
        s27: {
          text: "Parmi les espèces exposées, l'historique caméléon joyau.",
          src: ["https://www.nhm.at/ausstellung/dauerausstellung_schausammlung/amphibien_reptilien"],
        },
        s33: {
          text: "Le loup de Tasmanie (thylacine).",
          see: ["Beutelwolf"],
          src: ["https://www.nhm.at/ausstellung/dauerausstellung__schausammlung/erster_stock/saeugetierebrsaal_33-39"],
        },
        s34: {
          text: "L'éléphant de mer austral.",
          see: ["Südlicher See-Elefant"],
          src: ["https://www.nhm.at/ausstellung/dauerausstellung__schausammlung/erster_stock/saeugetierebrsaal_33-39"],
        },
        s35: {
          text: "Le rhinocéros de Java.",
          see: ["Java-Nashorn"],
          src: ["https://www.nhm.at/ausstellung/dauerausstellung__schausammlung/erster_stock/saeugetierebrsaal_33-39"],
        },
      },
    },

    // -------------------------------------------------------------------
    narrenturm: {
      intro: {
        text: "Bâtiment circulaire construit en 1784 par Josef Gerl sur ordre de Joseph II : premier hôpital d'Europe réservé aux malades mentaux. " +
          "La collection pathologique, fondée en 1796, s'y trouve depuis 1971 et fait partie du NHM depuis 2012. " +
          "L'exposition permanente du rez-de-chaussée compte 19 salles classées par catégories de maladies.",
        src: [
          "https://www.nhm.at/narrenturm",
          "https://www.nhm.at/jart/prj3/nhm-resp/data/uploads/Pressemappe_path.anat.Schausammlung_Narrenturm_2021-09-07_0709837.pdf",
        ],
      },
    },

    // -------------------------------------------------------------------
    albertina: {
      intro: {
        text: "Le bâtiment a été pendant une centaine d'années la résidence d'archiducs et d'archiduchesses. Les salles d'apparat comptent 20 pièces de style classique, restaurées.",
        src: ["https://www.albertina.at/en/exhibitions/state-rooms/"],
      },
      rooms: {
        "p-musen": {
          text: "Pièce maîtresse des salles d'apparat, nommée d'après le cycle de statues d'Apollon et des neuf Muses. Ses grandes portes ouvrent une perspective sur toutes les salles.",
          src: ["https://www.albertina.at/en/rent-a-museum/venue/hall-of-the-muses/"],
        },
        "p-gold": {
          text: "Témoigne de la qualité et de la richesse de l'aménagement sous le duc Albert de Saxe-Teschen.",
          src: ["https://albertina.at/vermietung/die-prunkraeume/"],
        },
        "p-wedgwood": {
          text: "Nommé d'après Josiah Wedgwood ; quatre grands panneaux de bois peints représentent les quatre éléments : terre, eau, feu et air.",
          src: ["https://albertina.at/vermietung/die-prunkraeume/"],
        },
        batliner: {
          text: "Cœur de la présentation permanente : environ 500 œuvres, de l'impressionnisme français à nos jours, dont 40 œuvres de Picasso. En prêt depuis 2007 de Rita et Herbert Batliner.",
          src: ["https://www.albertina.at/site/assets/files/1178/pressrelease_monet_bis_picasso.pdf", "https://www.albertina.at/en/exhibitions/monet-to-picasso/"],
        },
      },
    },

    "albertina-modern": {
      intro: {
        text: "Musée d'art moderne et contemporain dans l'ancien Künstlerhaus, rénové et agrandi de 2017 à 2020 : plus de 2 000 m² d'exposition. Fonds : chefs-d'œuvre de la collection Essl, confiée à l'Albertina depuis 2017.",
        src: ["https://www.albertina.at/en/albertina-modern/about/albertina-modern/"],
      },
    },

    "albertina-klosterneuburg": {
      intro: {
        text: "Dépôt visitable qui montre une partie des fonds d'art contemporain, dans le musée construit par les Essl et ouvert en 1999.",
        src: ["https://www.albertina.at/albertina-klosterneuburg/ueber-uns/geschichte-des-hauses/"],
      },
    },

    // -------------------------------------------------------------------
    "oberes-belvedere": {
      intro: {
        text: "Chefs-d'œuvre du Moyen Âge à nos jours, dont Le Baiser de Klimt (vers 1907–1909, 180 × 180 cm). Le musée possède aussi 16 « têtes de caractère » originales de Franz Xaver Messerschmidt, la plus grande collection au monde. " +
          "Le plan du musée répartit la collection en baroque, classicisme, romantisme et Biedermeier, réalisme et impressionnisme, et Vienne vers 1900.",
        see: ["Klimt – Le Baiser", "Messerschmidt – Charakterköpfe"],
        src: ["https://www.belvedere.at/en/permanent-collection", "https://sammlung.belvedere.at/objects/6678", "https://www.belvedere.at/en/messerschmidt", "https://www.belvedere.at/sites/default/files/media-directories/OB_Location_Map.pdf"],
      },
      rooms: {
        "1-marmor": {
          text: "La salle de marbre, où a été signé le traité d'État autrichien.",
          src: ["https://www.belvedere.at/en/visit/upper-belvedere"],
        },
        "eg-carlone": {
          text: "Salle baroque qui accueille tous les six mois une exposition d'art contemporain dialoguant avec son programme mythologique.",
          src: ["https://www.belvedere.at/en/permanent-collection"],
        },
      },
    },

    "unteres-belvedere": {
      rooms: {
        groteske: {
          text: "Plafond peint par Jonas Drentwett : les quatre saisons, et les quatre éléments dans les angles ; les murs sans fenêtres montrent la forge de Vulcain et les trois Grâces. Peintures en grande partie d'origine.",
          src: ["https://tickets.belvedere.at/das-museum/architektur-unteres-belvedere"],
        },
        marmorgalerie: {
          text: "Donne directement sur le jardin privé ; probablement conçue pour les statues antiques des « Herculanaises », vendues à Dresde en 1736.",
          src: ["https://tickets.belvedere.at/das-museum/architektur-unteres-belvedere"],
        },
        gold: {
          text: "Transformé sous Marie-Thérèse en cabinet doré avec miroirs et porcelaines ; la plupart des éléments viennent du palais d'hiver du prince Eugène.",
          src: ["https://tickets.belvedere.at/das-museum/architektur-unteres-belvedere"],
        },
        orangerie: {
          text: "À l'origine un jardin d'hiver chauffé pour les orangers ; après la mort du prince Eugène, les plantes partirent à Schönbrunn et le bâtiment servit d'écurie.",
          src: ["https://tickets.belvedere.at/das-museum/architektur-unteres-belvedere"],
        },
        prunkstall: {
          text: "Ancienne écurie des chevaux du prince Eugène ; on y présente aujourd'hui des œuvres de la collection médiévale.",
          src: ["https://tickets.belvedere.at/das-museum/architektur-unteres-belvedere"],
        },
      },
    },

    belvedere21: {
      intro: {
        text: "Ancien pavillon autrichien de l'Exposition universelle de Bruxelles 1958, conçu par Karl Schwanzer et remonté à Vienne. Ouvert en 1962 comme Musée du XXe siècle, il porte le nom de Belvedere 21 depuis 2018.",
        src: ["https://tickets.belvedere.at/en/museum/history-belvedere-21"],
      },
      rooms: {
        relief: {
          text: "Relief monumental en sept parties créé par Fritz Wotruba pour le pavillon de 1958, de retour devant la façade.",
          src: ["https://sammlung.belvedere.at/objects/66335/groes-figurenrelief-fur-den-osterreichpavillon-der-weltaus"],
        },
        kino: {
          text: "Dernière salle de cinéma de son époque conservée à Vienne dans son état d'origine.",
          src: ["https://www.belvedere.at/en/belvedere/blickle-cinema"],
        },
        wotruba: {
          text: "Dépôt et salle d'étude consacrés au sculpteur Fritz Wotruba, au niveau inférieur.",
          src: ["https://www.belvedere.at/en/museum/wotruba-depot"],
        },
      },
    },

    // -------------------------------------------------------------------
    mak: {
      intro: {
        text: "La collection permanente comprend les salles Asie, MAK Design Labor, Renaissance Barock Rokoko, Historismus Jugendstil, Empire Biedermeier, Barock Rokoko Klassizismus, Wien 1900, et textiles et tapis.",
        src: ["https://www.mak.at/", "https://www.mak.at/sammlung"],
      },
      rooms: {
        "eg-rom": {
          text: "Salle conçue par l'artiste autrichien Franz Graf : verre vénitien et d'Europe du Nord, dentelles des XVe au XVIIe siècles.",
          src: ["https://www.mak.at/ausstellung/renaissancebarockrokoko"],
        },
        "ug-design": {
          text: "Une rénovation du Design Labor était annoncée, avec l'ouverture des archives Helmut Lang.",
          src: ["https://www.mak.at/"],
        },
      },
    },

    geymueller: {
      intro: {
        text: "Mobilier Empire et Biedermeier, horloges anciennes viennoises de la collection Franz Sobek et interventions d'artistes contemporains. Saison 2026 : du 9 mai au 1er novembre, samedi et dimanche de 10 h à 18 h ; visite guidée le dimanche à 14 h 30.",
        src: ["https://www.mak.at/artikel/mak_geymuellerschloessel", "https://www.mak.at/weiterestandorte"],
      },
    },

    // -------------------------------------------------------------------
    mumok: {
      intro: {
        text: "Bâtiment monolithe en basalte gris anthracite. L'entrée est à mi-hauteur, avec trois étages d'exposition au-dessus et trois en dessous ; des ascenseurs vitrés relient les huit niveaux. " +
          "La collection couvre le modernisme classique, le pop art, Fluxus, l'art conceptuel et l'actionnisme viennois, jusqu'aux films et médias contemporains.",
        src: ["https://www.mumok.at/en/architecture", "https://www.mumok.at/en/about-mumok"],
      },
    },

    // -------------------------------------------------------------------
    prunksaal: {
      intro: {
        text: "Construit de 1723 à 1726 pour la bibliothèque de la cour de Charles VI, d'après les plans de Johann Bernhard Fischer von Erlach, par son fils Joseph Emanuel. " +
          "Fresques de Daniel Gran (1726–1730). Environ 200 000 livres de 1501 à 1850.",
        src: ["https://www.onb.ac.at/museen/prunksaal/ueber-den-prunksaal"],
      },
      rooms: {
        oval: {
          text: "Au centre, statue de marbre de Charles VI en « Hercule des Muses », attribuée à Antonio Corradini (1735). La fresque de la coupole, à 30 m de haut, montre l'apothéose de l'empereur. " +
            "Ici se trouve la bibliothèque du prince Eugène : 15 000 volumes reliés en maroquin rouge, bleu et jaune.",
          src: ["https://www.onb.ac.at/museen/prunksaal/ueber-den-prunksaal/die-statuen", "https://www.onb.ac.at/museen/prunksaal/ueber-den-prunksaal"],
        },
      },
    },

    "oenb-museen": {
      rooms: {
        papyrus: {
          text: "Environ 400 objets couvrant 3 000 ans de culture égyptienne. Pièce phare : le Livre des morts de Sésostris, l'objet le plus ancien de la Bibliothèque nationale.",
          src: ["https://www.onb.ac.at/museen"],
        },
        globen: {
          text: "Seul musée de ce type au monde : plus de 250 pièces (globes terrestres et célestes, globes lunaires et planétaires, instruments astronomiques), dont le plus ancien globe d'Autriche, de Gemma Frisius (1536).",
          src: ["https://www.onb.ac.at/museen/globenmuseum", "https://www.onb.ac.at/museen"],
        },
        esperanto: {
          text: "Histoire de l'espéranto, du premier manuel de 1887 à sa répression sous le national-socialisme et à son usage actuel, et autres langues construites (ido, interlingua, klingon).",
          src: ["https://www.onb.ac.at/en/museums/esperanto-museum", "https://www.onb.ac.at/museen"],
        },
        "lit-1": {
          text: "Littérature autrichienne de la fin du XVIIIe siècle à nos jours, dans le Grillparzerhaus.",
          src: ["https://www.onb.ac.at/museen"],
        },
      },
    },

    hdgoe: {
      intro: {
        text: "Premier musée fédéral d'histoire contemporaine, dans la Neue Burg depuis 2018. On accède à l'exposition principale par l'escalier d'apparat. Le balcon (Altan) n'est pas accessible au public.",
        src: ["https://hdgoe.at/standort_neue_burg", "https://hdgoe.at/faqs"],
      },
      rooms: {
        haupt: {
          text: "Commence avec la fondation de la République en 1918 et traite des bouleversements sociaux et des fractures politiques.",
          src: ["https://hdgoe.at/neue_zeiten"],
        },
      },
    },

    // -------------------------------------------------------------------
    tmw: {
      rooms: {
        material: {
          text: "13 îlots thématiques sur environ 3 000 m² : les matériaux, de leur production à leur usage, et leurs effets sur l'environnement. Ouverte en 2025.",
          src: ["https://www.technischesmuseum.at/ausstellung/materialwelten"],
        },
        alltag: {
          text: "Environ 2 300 m² sur la technique au quotidien : corps, maison, ville et environnement, surtout aux XIXe et XXe siècles.",
          src: ["https://www.technischesmuseum.at/ausstellung/alltag"],
        },
        mobil: {
          text: "Environ 3 000 m² et quelque 800 objets : transports sur terre, sur l'eau et dans les airs. " +
            "À voir : la voiture électrique Lohner-Porsche (médaille d'or à Paris en 1900), la voiture de Siegfried Marcus, longtemps considérée comme la première automobile, la Mercedes W196 « Flèche d'argent » et un planeur de Lilienthal, dont il ne reste que cinq exemplaires au monde.",
          see: ["Lohner-Porsche", "Voiture de Siegfried Marcus", "Mercedes W196", "Planeur de Lilienthal"],
          src: ["https://www.technischesmuseum.at/ausstellung/mobilitaet"],
        },
        arbeit: {
          text: "Le monde du travail depuis l'industrialisation.",
          src: ["https://www.technischesmuseum.at/museum/ausstellungen"],
        },
        wissenschaft: {
          text: "800 m² et neuf thèmes, de la physique quantique à la recherche sur le cerveau. Ouverte en 2026.",
          src: ["https://www.technischesmuseum.at/museum/ausstellungen"],
        },
        klima: {
          text: "Exposition permanente sur le climat et la durabilité, introduite par un film de Nikolaus Geyrhalter.",
          src: ["https://www.technischesmuseum.at/museum/ausstellungen"],
        },
        lok: {
          text: "Collection ferroviaire de plus de 60 grands objets ; les originaux les plus précieux, dont le wagon-salon de l'impératrice Élisabeth, sont dans l'espace découverte. Quatre véhicules sont au niveau 2, et la locomotive à vapeur 12.10 est intégrée à « Materialwelten ».",
          see: ["Wagon-salon de l'impératrice Élisabeth", "Locomotive 12.10"],
          src: ["https://www.technischesmuseum.at/ausstellung/lokerlebnis"],
        },
        minix: {
          text: "Exposition à manipuler pour les enfants de 3 à 8 ans.",
          src: ["https://www.technischesmuseum.at/museum/ausstellungen"],
        },
      },
    },
  };
})();
