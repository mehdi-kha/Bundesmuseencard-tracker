(function () {
  "use strict";

  const STORAGE_KEY = "bmc-tracker-v1";
  const MUSEUMS = window.MUSEUMS;
  const SVG_NS = "http://www.w3.org/2000/svg";

  // Statuts : 0 = pas vu, 1 = en partie, 2 = vu.
  const STATUS = [
    { key: "none", label: "Pas vu" },
    { key: "partial", label: "En partie" },
    { key: "seen", label: "Vu" },
  ];

  // ---------------------------------------------------------------------
  // État persistant
  // ---------------------------------------------------------------------
  function emptyState() {
    return { rooms: {}, custom: {}, prefs: { quick: false, zoom: false } };
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
  const getStatus = (museum, room) => (state.rooms[key(museum, room)] || {}).s || 0;

  function setStatus(museum, room, s) {
    const k = key(museum, room);
    const entry = { ...(state.rooms[k] || {}) };
    entry.s = s;
    if (s > 0 && !entry.d) entry.d = today();
    if (s === 0) delete entry.d;
    if (!entry.s && !entry.n) delete state.rooms[k];
    else state.rooms[k] = entry;
    save();
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

  // Une salle "en partie" compte pour moitié.
  function progress(museum, rooms) {
    rooms = rooms || allRooms(museum);
    let seen = 0, partial = 0;
    for (const r of rooms) {
      const s = getStatus(museum, r);
      if (s === 2) seen++;
      else if (s === 1) partial++;
    }
    const total = rooms.length;
    const pct = total ? Math.round(((seen + partial / 2) / total) * 100) : 0;
    return { seen, partial, total, pct };
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
    const seenW = p.total ? (p.seen / p.total) * 100 : 0;
    const partW = p.total ? (p.partial / p.total) * 100 : 0;
    bar.append(
      h("span", { class: "bar-seen", style: `width:${seenW}%` }),
      h("span", { class: "bar-partial", style: `width:${partW}%` }),
    );
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
    const tot = all.reduce((a, p) => ({ seen: a.seen + p.seen, partial: a.partial + p.partial, total: a.total + p.total }), { seen: 0, partial: 0, total: 0 });
    tot.pct = tot.total ? Math.round(((tot.seen + tot.partial / 2) / tot.total) * 100) : 0;
    const started = all.filter((p) => p.seen + p.partial > 0).length;

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
          h("span", null, ` · ${tot.seen} salle${tot.seen > 1 ? "s" : ""} vue${tot.seen > 1 ? "s" : ""}${tot.partial ? `, ${tot.partial} en partie` : ""} sur ${tot.total}`),
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
                h("div", { class: "card-meta" }, `${p.seen}/${p.total} salles vues${p.partial ? ` · ${p.partial} en partie` : ""}`),
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

    const filtered = rooms.filter((r) => {
      const st = getStatus(museum, r);
      if (listFilter === "todo") return st < 2;
      if (listFilter === "seen") return st > 0;
      return true;
    });

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
          h("span", null, ` · ${p.seen}/${p.total} salles vues${p.partial ? `, ${p.partial} en partie` : ""}`),
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
          h("div", { class: "legend" },
            h("span", null, h("i", { class: "sw sw-none" }), "Pas vu"),
            h("span", null, h("i", { class: "sw sw-partial" }), "En partie"),
            h("span", null, h("i", { class: "sw sw-seen" }), "Vu"),
          ),
          h("p", { class: "hint" }, state.prefs.quick
            ? "Touchez une salle pour la marquer vue / pas vue."
            : "Touchez une salle pour changer son statut ou ajouter une note."),
          h("div", { class: "floor-actions" },
            h("button", { class: "btn small", onclick: () => markFloor(museum, floor, rooms, 2) }, "Tout l'étage vu"),
            h("button", { class: "btn small ghost", onclick: () => markFloor(museum, floor, rooms, 0) }, "Tout réinitialiser"),
          ),
        ),
        h("section", { class: "list" },
          h("div", { class: "list-head" },
            h("h2", null, "Salles"),
            h("div", { class: "seg", role: "group", "aria-label": "Filtrer" },
              [["all", "Toutes"], ["todo", "À voir"], ["seen", "Vues"]].map(([k, l]) =>
                h("button", { class: listFilter === k ? "on" : "", "aria-pressed": String(listFilter === k), onclick: () => { listFilter = k; rerender(); } }, l)),
            ),
          ),
          filtered.length
            ? h("ul", { class: "rooms" }, filtered.map((r) => roomRow(museum, floor, r)))
            : h("p", { class: "empty" }, listFilter === "todo" ? "Tout est vu à cet étage 🎉" : "Aucune salle."),
          h("button", { class: "btn ghost add", onclick: () => addCustomRoom(museum, floor) }, "+ Ajouter une salle à cet étage"),
        ),
      ),
    );
  }

  function roomRow(museum, floor, room) {
    const st = getStatus(museum, room);
    const entry = state.rooms[key(museum, room)] || {};
    return h("li", { class: `room st-${STATUS[st].key}` },
      h("button", {
        class: "check",
        "aria-label": `${room.title} : ${STATUS[st].label}. Marquer ${st === 2 ? "pas vue" : "vue"}`,
        onclick: () => toggle(museum, room),
      }, st === 2 ? "✓" : st === 1 ? "½" : ""),
      h("button", { class: "room-main", onclick: () => openRoom(museum, floor, room) },
        h("span", { class: "room-title" }, room.title, room.custom ? h("em", null, " (perso)") : null),
        entry.d || entry.n
          ? h("span", { class: "room-meta" }, [entry.d ? `${st === 1 ? "Commencée" : "Vue"} le ${formatDate(entry.d)}` : null, entry.n].filter(Boolean).join(" · "))
          : null,
      ),
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
      const st = getStatus(museum, it.r);
      const pad = 0.5;
      const g = s("g", {
        class: `cell st-${STATUS[st].key}`,
        tabindex: 0,
        role: "button",
        "aria-label": `${it.r.title} : ${STATUS[st].label}`,
      });
      const activate = (e) => {
        e.preventDefault();
        if (state.prefs.quick) toggle(museum, it.r);
        else openRoom(museum, floor, it.r);
      };
      g.addEventListener("click", activate);
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") activate(e); });
      g.append(s("title", null, it.r.title));
      g.append(s("rect", { x: it.x + pad, y: it.y + pad, width: Math.max(it.w - 2 * pad, 0.5), height: Math.max(it.h - 2 * pad, 0.5), rx: 1.2 }));

      const text = it.r.label || it.r.title;
      const fs = Math.min(5, it.h * 0.42, (it.w * 1.7) / Math.max(text.length, 2));
      const t = s("text", { x: it.x + it.w / 2, y: it.y + it.h / 2, "font-size": fs.toFixed(2) }, text);
      g.append(t);
      if (st === 2 && it.h > 9) {
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

  // ---------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------
  function toggle(museum, room) {
    const prev = getStatus(museum, room);
    const next = prev === 2 ? 0 : 2;
    const prevEntry = state.rooms[key(museum, room)] ? { ...state.rooms[key(museum, room)] } : null;
    setStatus(museum, room, next);
    rerender();
    toast(`${room.label || room.title} : ${STATUS[next].label.toLowerCase()}`, {
      label: "Annuler",
      fn: () => {
        if (prevEntry) state.rooms[key(museum, room)] = prevEntry;
        else delete state.rooms[key(museum, room)];
        save();
        rerender();
      },
    });
  }

  function markFloor(museum, floor, rooms, st) {
    const msg = st === 2 ? `Marquer les ${rooms.length} salles de « ${floor.name} » comme vues ?` : `Remettre toutes les salles de « ${floor.name} » à « pas vu » ? (les notes sont conservées)`;
    if (!confirm(msg)) return;
    const backup = {};
    for (const r of rooms) {
      const k = key(museum, r);
      backup[k] = state.rooms[k] ? { ...state.rooms[k] } : null;
      setStatus(museum, r, st);
    }
    rerender();
    toast("Étage mis à jour", {
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

  function addCustomRoom(museum, floor) {
    const title = prompt("Nom de la salle (ex. « Saal 12 – Rubens ») :");
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
    const st = entry.s || 0;

    const note = h("textarea", { id: "room-note", rows: 3, placeholder: "Note (ex. vu rapidement, à refaire avec audioguide…)" });
    note.value = entry.n || "";
    const date = h("input", { type: "date", id: "room-date", value: entry.d || "" });

    const close = () => dlg.close();
    const commit = (newStatus) => {
      const e = { ...(state.rooms[k] || {}) };
      const n = note.value.trim();
      if (n) e.n = n; else delete e.n;
      e.s = newStatus;
      if (newStatus > 0) e.d = date.value || e.d || today();
      else delete e.d;
      if (!e.s && !e.n) delete state.rooms[k]; else state.rooms[k] = e;
      save();
      close();
      rerender();
    };

    dlg.replaceChildren(
      h("form", { method: "dialog", class: "sheet-body", onsubmit: (e) => { e.preventDefault(); commit(getStatus(museum, room)); } },
        h("div", { class: "sheet-grip" }),
        h("p", { class: "sheet-kicker" }, `${museum.short} · ${floor.name}`),
        h("h3", null, room.title),
        h("div", { class: "status-btns" },
          STATUS.map((x, i) => h("button", {
            type: "button",
            class: `status-btn st-${x.key}` + (i === st ? " current" : ""),
            "aria-pressed": String(i === st),
            onclick: () => commit(i),
          }, i === 2 ? "✓ Vu" : i === 1 ? "½ En partie" : "Pas vu")),
        ),
        h("label", { class: "field" }, h("span", null, "Date de visite"), date),
        h("label", { class: "field" }, h("span", null, "Note"), note),
        h("div", { class: "sheet-actions" },
          room.custom ? h("button", { type: "button", class: "btn ghost danger", onclick: () => {
            if (!confirm(`Supprimer la salle « ${room.title} » ?`)) return;
            const fk = floorKey(museum, floor);
            state.custom[fk] = (state.custom[fk] || []).filter((c) => c.id !== room.id);
            if (!state.custom[fk].length) delete state.custom[fk];
            delete state.rooms[k];
            save(); close(); rerender();
          } }, "Supprimer") : null,
          h("button", { type: "button", class: "btn ghost", onclick: close }, "Annuler"),
          h("button", { type: "submit", class: "btn" }, "Enregistrer"),
        ),
      ),
    );
    dlg.showModal();
  }

  // ---------------------------------------------------------------------
  // Réglages : mode rapide, sauvegarde, import, remise à zéro
  // ---------------------------------------------------------------------
  function openSettings() {
    const dlg = document.getElementById("sheet");
    const quick = h("input", { type: "checkbox", id: "quick" });
    quick.checked = !!state.prefs.quick;
    quick.addEventListener("change", () => { state.prefs.quick = quick.checked; save(); rerender(); });

    const file = h("input", { type: "file", accept: "application/json,.json", hidden: true });
    file.addEventListener("change", async () => {
      const f = file.files[0];
      if (!f) return;
      try {
        const data = JSON.parse(await f.text());
        if (!data || typeof data.rooms !== "object") throw new Error("format");
        if (!confirm("Remplacer votre progression actuelle par celle du fichier ?")) return;
        state = { ...emptyState(), ...data, prefs: { ...emptyState().prefs, ...(data.prefs || {}) } };
        save();
        dlg.close();
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
        h("label", { class: "switch" }, quick, h("span", null, "Mode rapide : toucher une salle sur le plan la marque directement comme vue")),
        h("p", { class: "small" },
          "Votre progression est enregistrée sur cet appareil, dans ce navigateur. " +
          "Exportez-la de temps en temps pour ne rien perdre ou pour la transférer sur un autre appareil."),
        h("div", { class: "settings-btns" },
          h("button", { class: "btn", onclick: exportData }, "Exporter ma progression"),
          h("button", { class: "btn ghost", onclick: () => file.click() }, "Importer une sauvegarde"),
          file,
          h("button", { class: "btn ghost danger", onclick: () => {
            if (!confirm("Effacer toute la progression, les notes et les salles ajoutées ?")) return;
            state = { ...emptyState(), prefs: state.prefs };
            save(); dlg.close(); rerender();
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
