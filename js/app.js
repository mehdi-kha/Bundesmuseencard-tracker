(function () {
  "use strict";

  const STORAGE_KEY = "bmc-tracker-v1";
  const MUSEUMS = window.MUSEUMS;
  const SVG_NS = "http://www.w3.org/2000/svg";

  // ---------------------------------------------------------------------
  // État persistant
  // ---------------------------------------------------------------------
  function emptyState() {
    return { rooms: {}, custom: {}, prefs: { zoom: false } };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyState();
      const s = JSON.parse(raw);
      return { ...emptyState(), ...s, prefs: { ...emptyState().prefs, ...(s.prefs || {}) } };
    } catch (e) {
      return emptyState();
    }
  }

  let state = loadState();

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      toast("Impossible d'enregistrer (stockage du navigateur indisponible).");
    }
  }

  const key = (museum, room) => museum.id + "/" + room.id;
  const floorKey = (museum, floor) => museum.id + "/" + floor.id;
  // Une salle est vue ou pas vue. (Les anciennes salles « en partie »
  // des premières versions comptent comme vues.)
  const isSeen = (museum, room) => !!(state.rooms[key(museum, room)] || {}).s;

  function setSeen(museum, room, seen) {
    const k = key(museum, room);
    const entry = { ...(state.rooms[k] || {}) };
    if (seen) {
      entry.s = 2;
      if (!entry.d) entry.d = today();
    } else {
      delete entry.s;
      delete entry.d;
    }
    if (!entry.s && !entry.n) delete state.rooms[k];
    else state.rooms[k] = entry;
  }

  function today() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function formatDate(iso) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  }

  // Salles d'un étage, y compris celles ajoutées par l'utilisateur.
  function floorRooms(museum, floor) {
    const custom = (state.custom[floorKey(museum, floor)] || []).map((c) => ({ ...c, custom: true }));
    return [...floor.rooms, ...custom];
  }

  function allRooms(museum) {
    return museum.floors.flatMap((f) => floorRooms(museum, f));
  }

  function progress(museum, rooms) {
    rooms = rooms || allRooms(museum);
    const seen = rooms.filter((r) => isSeen(museum, r)).length;
    const total = rooms.length;
    return { seen, total, pct: total ? Math.round((seen / total) * 100) : 0 };
  }

  // Regroupe les salles d'un étage par partie (champ `section` des données).
  function sections(rooms) {
    const groups = [];
    for (const r of rooms) {
      const name = r.custom ? "Salles ajoutées" : r.section || "";
      let g = groups.find((x) => x.name === name);
      if (!g) groups.push((g = { name, rooms: [] }));
      g.rooms.push(r);
    }
    return groups;
  }

  // ---------------------------------------------------------------------
  // Utilitaires DOM
  // ---------------------------------------------------------------------
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const c of children.flat()) {
      if (c == null || c === false) continue;
      el.append(c instanceof Node ? c : document.createTextNode(c));
    }
    return el;
  }

  function s(tag, attrs, ...children) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null) continue;
      if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v);
    }
    for (const c of children) el.append(c instanceof Node ? c : document.createTextNode(c));
    return el;
  }

  function progressBar(p) {
    const bar = h("div", { class: "bar", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": p.pct });
    bar.append(h("span", { class: "bar-seen", style: `width:${p.pct}%` }));
    return bar;
  }

  let toastTimer;
  function toast(msg, action) {
    const el = document.getElementById("toast");
    el.replaceChildren(h("span", null, msg));
    if (action) {
      el.append(h("button", { class: "toast-action", onclick: () => { action.fn(); el.hidden = true; } }, action.label));
    }
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 4000);
  }

  // ---------------------------------------------------------------------
  // Routage (#/ et #/m/<musée>/<étage>)
  // ---------------------------------------------------------------------
  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    const app = document.getElementById("app");
    if (parts[0] === "m") {
      const museum = MUSEUMS.find((m) => m.id === parts[1]);
      if (museum) {
        const floor = museum.floors.find((f) => f.id === parts[2]) || museum.floors[0];
        renderMuseum(app, museum, floor);
        return;
      }
    }
    renderHome(app);
  }

  // Re-rendu en gardant la position de défilement.
  function rerender() {
    const y = window.scrollY;
    route();
    window.scrollTo(0, y);
  }

  // ---------------------------------------------------------------------
  // Accueil
  // ---------------------------------------------------------------------
  function renderHome(app) {
    document.title = "Bundesmuseen-Card – Suivi";
    const all = MUSEUMS.map((m) => progress(m));
    const tot = all.reduce((a, p) => ({ seen: a.seen + p.seen, total: a.total + p.total }), { seen: 0, total: 0 });
    tot.pct = tot.total ? Math.round((tot.seen / tot.total) * 100) : 0;
    const started = all.filter((p) => p.seen > 0).length;

    const groups = [];
    for (const m of MUSEUMS) {
      let g = groups.find((x) => x.name === m.group);
      if (!g) groups.push((g = { name: m.group, museums: [] }));
      g.museums.push(m);
    }

    app.replaceChildren(
      h("header", { class: "top" },
        h("div", { class: "top-row" },
          h("h1", null, "Mes musées"),
          h("button", { class: "icon-btn", "aria-label": "Réglages", onclick: openSettings }, "⚙︎"),
        ),
        h("p", { class: "sub" }, `Bundesmuseen-Card · ${started}/${MUSEUMS.length} sites commencés`),
        h("div", { class: "summary" },
          h("strong", null, `${tot.pct} %`),
          h("span", null, ` · ${tot.seen} salle${tot.seen > 1 ? "s" : ""} vue${tot.seen > 1 ? "s" : ""} sur ${tot.total}`),
        ),
        progressBar(tot),
      ),
      h("main", { class: "home" },
        groups.map((g) =>
          h("section", { class: "group" },
            h("h2", null, g.name),
            g.museums.map((m) => {
              const p = progress(m);
              return h("a", { class: "card", href: `#/m/${m.id}`, style: `--accent:${m.color}` },
                h("div", { class: "card-head" },
                  h("span", { class: "card-title" }, m.name),
                  h("span", { class: "card-pct" + (p.pct === 100 ? " done" : "") }, p.pct === 100 ? "✓ 100 %" : `${p.pct} %`),
                ),
                h("div", { class: "card-meta" }, `${p.seen}/${p.total} salles vues`),
                progressBar(p),
              );
            }),
          ),
        ),
        h("p", { class: "disclaimer" },
          "Plans schématiques : la disposition et la numérotation des salles sont indicatives. " +
          "Vous pouvez ajouter vos propres salles dans chaque étage."),
      ),
    );
  }

  // ---------------------------------------------------------------------
  // Page musée
  // ---------------------------------------------------------------------
  let listFilter = "all";

  function renderMuseum(app, museum, floor) {
    document.title = `${museum.short} – Suivi`;
    const p = progress(museum);
    const rooms = floorRooms(museum, floor);
    const fp = progress(museum, rooms);

    const tabs = museum.floors.length > 1
      ? h("nav", { class: "tabs", "aria-label": "Étages" },
          museum.floors.map((f) => {
            const tp = progress(museum, floorRooms(museum, f));
            return h("a", {
              class: "tab" + (f === floor ? " active" : ""),
              href: `#/m/${museum.id}/${f.id}`,
              "aria-current": f === floor ? "page" : null,
            }, h("span", null, f.name), h("small", null, `${tp.pct} %`));
          }))
      : null;

    const visible = (r) => listFilter === "todo" ? !isSeen(museum, r) : listFilter === "seen" ? isSeen(museum, r) : true;
    const groups = sections(rooms).map((g) => ({ ...g, shown: g.rooms.filter(visible) })).filter((g) => g.shown.length);
    const allMuseum = allRooms(museum);

    app.replaceChildren(
      h("header", { class: "top", style: `--accent:${museum.color}` },
        h("div", { class: "top-row" },
          h("a", { class: "icon-btn", href: "#/", "aria-label": "Retour à la liste" }, "‹"),
          h("h1", null, museum.name),
          h("button", { class: "icon-btn", "aria-label": "Réglages", onclick: openSettings }, "⚙︎"),
        ),
        h("p", { class: "sub" }, museum.address),
        museum.note ? h("p", { class: "note" }, museum.note) : null,
        h("div", { class: "summary" },
          h("strong", null, `${p.pct} %`),
          h("span", null, ` · ${p.seen}/${p.total} salles vues`),
        ),
        progressBar(p),
      ),
      tabs,
      h("main", { class: "museum" },
        h("section", { class: "floor" },
          h("div", { class: "floor-head" },
            h("h2", null, floor.name),
            h("span", { class: "floor-pct" }, `${fp.seen}/${fp.total}`),
          ),
          renderMap(museum, floor, rooms),
          h("p", { class: "hint" }, "Touchez une salle pour la cocher comme vue, retouchez pour la décocher."),
          bulkButton(museum, rooms, "l'étage", "btn"),
        ),
        h("section", { class: "list" },
          h("div", { class: "list-head" },
            h("h2", null, "Salles"),
            h("div", { class: "seg", role: "group", "aria-label": "Filtrer" },
              [["all", "Toutes"], ["todo", "À voir"], ["seen", "Vues"]].map(([k, l]) =>
                h("button", { class: listFilter === k ? "on" : "", "aria-pressed": String(listFilter === k), onclick: () => { listFilter = k; rerender(); } }, l)),
            ),
          ),
          groups.length
            ? groups.map((g) => h("div", { class: "section" },
                g.name ? h("div", { class: "section-head" },
                  h("h3", null, g.name, h("small", null, ` ${progress(museum, g.rooms).seen}/${g.rooms.length}`)),
                  bulkButton(museum, g.rooms, "la partie", "btn small ghost"),
                ) : null,
                h("ul", { class: "rooms" }, g.shown.map((r) => roomRow(museum, floor, r, shortTitle(r, g)))),
              ))
            : h("p", { class: "empty" }, listFilter === "todo" ? "Tout est vu à cet étage 🎉" : "Aucune salle."),
          h("button", { class: "btn ghost add", onclick: () => addCustomRoom(museum, floor) }, "+ Ajouter une salle à cet étage"),
        ),
        h("section", { class: "museum-actions" },
          bulkButton(museum, allMuseum, "tout le musée", "btn ghost wide"),
        ),
      ),
    );
  }

  // Bouton « tout cocher » / « tout décocher » pour un ensemble de salles.
  function bulkButton(museum, rooms, what, cls) {
    const all = rooms.length > 0 && rooms.every((r) => isSeen(museum, r));
    return h("button", {
      class: cls + (all ? " ghost" : ""),
      onclick: () => markAll(museum, rooms, !all, what),
    }, all ? `Décocher ${what}` : `✓ Marquer ${what} comme vu${what.startsWith("la") ? "e" : ""}`);
  }

  // Dans une partie, retire le thème répété partout (« Saal I – Kunstkammer »
  // devient « Saal I ») mais garde les thèmes particuliers (« Saal X – Bruegel »).
  function shortTitle(room, group) {
    if (!group.name || room.custom) return room.title;
    if (!group.common) {
      const counts = {};
      for (const r of group.rooms) {
        const suffix = r.title.split(" – ")[1];
        if (suffix) counts[suffix] = (counts[suffix] || 0) + 1;
      }
      const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      group.common = best && best[1] > 1 ? best[0] : "-";
    }
    const [head, suffix] = room.title.split(" – ");
    return suffix === group.common ? head : room.title;
  }

  function roomRow(museum, floor, room, title) {
    const seen = isSeen(museum, room);
    const entry = state.rooms[key(museum, room)] || {};
    const meta = [seen && entry.d ? `Vue le ${formatDate(entry.d)}` : null, entry.n].filter(Boolean).join(" · ");
    return h("li", { class: "room" + (seen ? " seen" : "") },
      h("button", {
        class: "room-toggle",
        role: "checkbox",
        "aria-checked": String(seen),
        onclick: () => toggle(museum, room),
      },
        h("span", { class: "check", "aria-hidden": "true" }, seen ? "✓" : ""),
        h("span", { class: "room-text" },
          h("span", { class: "room-title" }, title || room.title, room.custom ? h("em", null, " (perso)") : null),
          meta ? h("span", { class: "room-meta" }, meta) : null,
        ),
      ),
      h("button", { class: "room-edit", "aria-label": `Note et date : ${room.title}`, onclick: () => openRoom(museum, floor, room) }, "✎"),
    );
  }

  // Dispose en grille les salles sans coordonnées.
  function layout(floor, rooms) {
    const placed = rooms.filter((r) => r.x != null);
    const loose = rooms.filter((r) => r.x == null);
    if (!placed.length) {
      const n = loose.length;
      const cols = n <= 2 ? Math.max(n, 1) : n <= 4 ? 2 : 3;
      const cw = 40, ch = 22, gap = 3;
      const rowsN = Math.ceil(n / cols);
      return {
        w: cols * cw + (cols + 1) * gap,
        h: rowsN * ch + (rowsN + 1) * gap,
        items: loose.map((r, i) => ({ r, x: gap + (i % cols) * (cw + gap), y: gap + Math.floor(i / cols) * (ch + gap), w: cw, h: ch })),
        decor: [],
      };
    }
    const W = floor.w, H = floor.h;
    const items = placed.map((r) => ({ r, x: r.x, y: r.y, w: r.w, h: r.h }));
    let extraH = 0;
    if (loose.length) {
      // Salles ajoutées par l'utilisateur : rangée sous le plan.
      const cols = Math.min(loose.length, 4);
      const cw = (W - 8) / cols, ch = 14;
      loose.forEach((r, i) => items.push({ r, x: 4 + (i % cols) * cw, y: H + 4 + Math.floor(i / cols) * (ch + 2), w: cw, h: ch }));
      extraH = 6 + Math.ceil(loose.length / cols) * (ch + 2);
    }
    return { w: W, h: H + extraH, items, decor: floor.decor || [] };
  }

  function renderMap(museum, floor, rooms) {
    const L = layout(floor, rooms);
    const svg = s("svg", { viewBox: `0 0 ${L.w} ${L.h}`, class: "map", role: "group", "aria-label": `Plan : ${floor.name}` });

    for (const d of L.decor) {
      if (d.type === "outline") {
        svg.append(s("rect", { x: d.x, y: d.y, width: d.w, height: d.h, class: "outline", rx: 1 }));
      } else if (d.type === "court") {
        svg.append(s("rect", { x: d.x + 1.5, y: d.y + 1.5, width: d.w - 3, height: d.h - 3, class: "court", rx: 1.5 }));
        svg.append(s("text", { x: d.x + d.w / 2, y: d.y + d.h / 2, class: "court-label" }, d.label));
      } else if (d.type === "label") {
        svg.append(s("text", { x: d.x, y: d.y, class: "map-label" }, d.text));
      }
    }

    for (const it of L.items) {
      const seen = isSeen(museum, it.r);
      const pad = 0.5;
      const g = s("g", {
        class: "cell" + (seen ? " seen" : ""),
        tabindex: 0,
        role: "checkbox",
        "aria-checked": String(seen),
        "aria-label": it.r.title,
      });
      const activate = (e) => {
        e.preventDefault();
        toggle(museum, it.r);
      };
      g.addEventListener("click", activate);
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") activate(e); });
      g.append(s("title", null, it.r.title));
      g.append(s("rect", { x: it.x + pad, y: it.y + pad, width: Math.max(it.w - 2 * pad, 0.5), height: Math.max(it.h - 2 * pad, 0.5), rx: 1.2 }));

      const text = it.r.label || it.r.title;
      const fs = Math.min(5, it.h * 0.42, (it.w * 1.7) / Math.max(text.length, 2));
      const t = s("text", { x: it.x + it.w / 2, y: it.y + it.h / 2, "font-size": fs.toFixed(2) }, text);
      g.append(t);
      if (seen && it.h > 9) {
        g.append(s("text", { x: it.x + it.w - 2, y: it.y + 3.2, class: "tick", "font-size": 3 }, "✓"));
      }
      svg.append(g);
    }
    const zoomable = L.w >= 100;
    return h("div", { class: "map-wrap" + (zoomable && state.prefs.zoom ? " zoomed" : "") },
      zoomable ? h("button", {
        class: "zoom-btn",
        "aria-label": state.prefs.zoom ? "Réduire le plan" : "Agrandir le plan",
        onclick: () => { state.prefs.zoom = !state.prefs.zoom; save(); rerender(); },
      }, state.prefs.zoom ? "－" : "＋") : null,
      h("div", { class: "map-scroll" }, svg));
  }

  // Boîtes de dialogue intégrées (remplacent confirm() / prompt()).
  function ask(message, opts) {
    opts = opts || {};
    const dlg = document.getElementById("sheet");
    return new Promise((resolve) => {
      let input = null;
      if (opts.input) {
        input = h("input", { type: "text", id: "ask-input", placeholder: opts.placeholder || "" });
      }
      const done = (val) => { dlg.removeEventListener("close", onClose); dlg.close(); resolve(val); };
      const onClose = () => resolve(opts.input ? null : false);
      dlg.addEventListener("close", onClose);
      dlg.replaceChildren(
        h("form", { class: "sheet-body", onsubmit: (e) => {
          e.preventDefault();
          if (input) { const v = input.value.trim(); if (v) done(v); } else done(true);
        } },
          h("div", { class: "sheet-grip" }),
          h("h3", null, message),
          input ? h("label", { class: "field" }, input) : null,
          h("div", { class: "sheet-actions" },
            h("button", { type: "button", class: "btn ghost", onclick: () => done(opts.input ? null : false) }, "Annuler"),
            h("button", { type: "submit", class: "btn" + (opts.danger ? " danger-fill" : "") }, opts.ok || "OK"),
          ),
        ),
      );
      if (!dlg.open) dlg.showModal();
      if (input) input.focus();
    });
  }

  // ---------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------
  function toggle(museum, room) {
    setSeen(museum, room, !isSeen(museum, room));
    save();
    if (navigator.vibrate) { try { navigator.vibrate(12); } catch (e) { /* ignoré */ } }
    rerender();
  }

  // Coche ou décoche un ensemble de salles, avec possibilité d'annuler.
  function markAll(museum, rooms, seen, what) {
    const backup = {};
    for (const r of rooms) {
      const k = key(museum, r);
      backup[k] = state.rooms[k] ? { ...state.rooms[k] } : null;
      setSeen(museum, r, seen);
    }
    save();
    rerender();
    toast(seen ? `${what[0].toUpperCase() + what.slice(1)} : ${rooms.length} salles vues` : `${what[0].toUpperCase() + what.slice(1)} : décoché`, {
      label: "Annuler",
      fn: () => {
        for (const [k, v] of Object.entries(backup)) {
          if (v) state.rooms[k] = v; else delete state.rooms[k];
        }
        save();
        rerender();
      },
    });
  }

  async function addCustomRoom(museum, floor) {
    const title = await ask(`Ajouter une salle à « ${floor.name} »`, { input: true, placeholder: "ex. Saal 12 – Rubens", ok: "Ajouter" });
    if (!title || !title.trim()) return;
    const fk = floorKey(museum, floor);
    const list = state.custom[fk] || (state.custom[fk] = []);
    const id = "perso-" + Date.now().toString(36);
    const short = title.trim().length > 14 ? title.trim().slice(0, 13) + "…" : title.trim();
    list.push({ id, label: short, title: title.trim() });
    save();
    rerender();
  }

  // ---------------------------------------------------------------------
  // Fiche d'une salle (bottom sheet)
  // ---------------------------------------------------------------------
  function openRoom(museum, floor, room) {
    const dlg = document.getElementById("sheet");
    const k = key(museum, room);
    const entry = state.rooms[k] || {};
    const seen = !!entry.s;

    const note = h("textarea", { id: "room-note", rows: 3, placeholder: "Note (ex. à refaire avec l'audioguide…)" });
    note.value = entry.n || "";
    const date = h("input", { type: "date", id: "room-date", value: entry.d || "" });

    const close = () => dlg.close();
    const commit = () => {
      const e = { ...(state.rooms[k] || {}) };
      const n = note.value.trim();
      if (n) e.n = n; else delete e.n;
      if (e.s && date.value) e.d = date.value;
      if (!e.s && !e.n) delete state.rooms[k]; else state.rooms[k] = e;
      save();
      close();
      rerender();
    };

    dlg.replaceChildren(
      h("form", { class: "sheet-body", onsubmit: (e) => { e.preventDefault(); commit(); } },
        h("div", { class: "sheet-grip" }),
        h("p", { class: "sheet-kicker" }, `${museum.short} · ${floor.name} · ${seen ? "vue" : "pas vue"}`),
        h("h3", null, room.title),
        seen ? h("label", { class: "field" }, h("span", null, "Date de visite"), date) : null,
        h("label", { class: "field" }, h("span", null, "Note"), note),
        h("div", { class: "sheet-actions" },
          room.custom ? h("button", { type: "button", class: "btn ghost danger", onclick: async () => {
            if (!(await ask(`Supprimer la salle « ${room.title} » ?`, { ok: "Supprimer", danger: true }))) return;
            const fk = floorKey(museum, floor);
            state.custom[fk] = (state.custom[fk] || []).filter((c) => c.id !== room.id);
            if (!state.custom[fk].length) delete state.custom[fk];
            delete state.rooms[k];
            save(); rerender();
          } }, "Supprimer") : null,
          h("button", { type: "button", class: "btn ghost", onclick: close }, "Annuler"),
          h("button", { type: "submit", class: "btn" }, "Enregistrer"),
        ),
      ),
    );
    dlg.showModal();
  }

  // ---------------------------------------------------------------------
  // Réglages : sauvegarde, import, remise à zéro
  // ---------------------------------------------------------------------
  function openSettings() {
    const dlg = document.getElementById("sheet");
    const file = h("input", { type: "file", accept: "application/json,.json", hidden: true });
    file.addEventListener("change", async () => {
      const f = file.files[0];
      if (!f) return;
      try {
        const data = JSON.parse(await f.text());
        if (!data || typeof data.rooms !== "object") throw new Error("format");
        if (!(await ask("Remplacer votre progression actuelle par celle du fichier ?", { ok: "Remplacer", danger: true }))) return;
        state = { ...emptyState(), ...data, prefs: { ...emptyState().prefs, ...(data.prefs || {}) } };
        save();
        rerender();
        toast("Sauvegarde importée");
      } catch (e) {
        toast("Fichier invalide.");
      }
    });

    dlg.replaceChildren(
      h("div", { class: "sheet-body" },
        h("div", { class: "sheet-grip" }),
        h("h3", null, "Réglages"),
        h("p", { class: "small" },
          "Votre progression est enregistrée sur cet appareil, dans ce navigateur. " +
          "Exportez-la de temps en temps pour ne rien perdre ou pour la transférer sur un autre appareil."),
        h("div", { class: "settings-btns" },
          h("button", { class: "btn", onclick: exportData }, "Exporter ma progression"),
          h("button", { class: "btn ghost", onclick: () => file.click() }, "Importer une sauvegarde"),
          file,
          h("button", { class: "btn ghost danger", onclick: async () => {
            if (!(await ask("Effacer toute la progression, les notes et les salles ajoutées ?", { ok: "Tout effacer", danger: true }))) return;
            state = { ...emptyState(), prefs: state.prefs };
            save(); rerender();
          } }, "Tout effacer"),
        ),
        h("div", { class: "sheet-actions" }, h("button", { class: "btn ghost", onclick: () => dlg.close() }, "Fermer")),
      ),
    );
    dlg.showModal();
  }

  async function exportData() {
    const json = JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2);
    const name = `bundesmuseen-progression-${today()}.json`;
    const blob = new Blob([json], { type: "application/json" });
    // Sur téléphone, la feuille de partage est plus pratique qu'un téléchargement.
    try {
      const fileObj = new File([blob], name, { type: "application/json" });
      if (navigator.canShare && navigator.canShare({ files: [fileObj] })) {
        await navigator.share({ files: [fileObj], title: "Progression Bundesmuseen-Card" });
        return;
      }
    } catch (e) {
      if (e && e.name === "AbortError") return;
    }
    const a = h("a", { href: URL.createObjectURL(blob), download: name });
    document.body.append(a);
    a.click();
    a.remove();
  }

  // ---------------------------------------------------------------------
  // Démarrage
  // ---------------------------------------------------------------------
  const sheet = document.getElementById("sheet");
  // Fermer la fiche en touchant le fond.
  sheet.addEventListener("click", (e) => { if (e.target === sheet) sheet.close(); });

  window.addEventListener("hashchange", () => { route(); window.scrollTo(0, 0); });
  window.addEventListener("storage", (e) => { if (e.key === STORAGE_KEY) { state = loadState(); rerender(); } });
  route();

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
