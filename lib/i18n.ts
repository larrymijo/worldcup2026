// Lightweight client-side i18n. Spanish is the default; English is used when the
// visitor's browser language is English (or when manually toggled).

export type Locale = "en" | "es";
export const LOCALES: Locale[] = ["es", "en"];
export const LANG_STORAGE_KEY = "wc2026-lang";

type Dict = Record<string, string>;

const en: Dict = {
  // nav / brand
  "nav.matches": "Matches",
  "nav.predict": "Predict",
  "nav.ecuador": "Ecuador",
  "brand.tagline": "Match Center",
  "lang.switch": "Switch language",

  // sponsor
  "sponsor.poweredBy": "Powered by",
  "sponsor.officialSponsor": "Official sponsor",
  "sponsor.championBy": "Champion brought to you by",
  "sponsor.sponsoredBy": "Sponsored by",
  "sponsor.broughtBy": "Brought to you by",
  "sponsor.presentedBy": "Presented by",
  "sponsor.supportsPre": "Organisk LM proudly supports the ",
  "sponsor.supportsPost": " national team",
  "sponsor.laTri": "Official sponsor of La Tri · organisklm.com",

  // footer
  "footer.kickoff": "Kick-off times shown in your local timezone.",
  "footer.disclaimer": "Unofficial fan project · Schedule data: FIFA World Cup 2026.",

  // home
  "home.dates": "June 11 – July 19, 2026",
  "home.titlePre": "FIFA World Cup ",
  "home.titleLine2": "in your local time.",
  "home.subtitle":
    "The complete fixture list for the first 48-team World Cup, hosted across the USA, Canada & Mexico — every kick-off automatically converted to your own timezone.",
  "home.followEc": "Follow Ecuador",
  "home.browse": "Browse all fixtures",
  "stats.teams": "Teams",
  "stats.matches": "Matches",
  "stats.cities": "Host cities",
  "stats.nations": "Nations",

  // up next
  "upnext.title": "Up next",
  "upnext.desc": "· the next two kickoffs, in your time",
  "upnext.in": "in",

  // generic
  vs: "vs",
  at: "@",

  // status
  "status.live": "Live",
  "status.ft": "Full time",
  "status.upcoming": "Upcoming",
  "status.ht": "HT",

  // stages
  "stage.group": "Group",
  "stage.r32": "Round of 32",
  "stage.r16": "Round of 16",
  "stage.qf": "Quarter-final",
  "stage.sf": "Semi-final",
  "stage.third": "Third-place",
  "stage.final": "Final",

  // filters
  "filters.search": "Search team, city or stadium…",
  "filters.all": "All",
  "filters.groups": "Groups",
  "filters.knockouts": "Knockouts",
  "filters.allGroups": "All groups",
  "filters.upcomingOnly": "Upcoming only",
  "filters.loading": "Loading fixtures…",
  "filters.countOne": "{n} match",
  "filters.countOther": "{n} matches",
  "filters.yourTime": "Your local time",
  "scores.live": "Live scores",
  "scores.demo": "Demo scores",
  "scores.demoHint": "Simulated results for preview — add a data feed for real scores.",
  "empty.title": "No matches found",
  "empty.desc": "Try clearing the search or filters.",
  "error.schedule": "Couldn't load the schedule: {error}",
  "filters.allTeams": "All teams",

  // match detail
  "detail.open": "View match details",
  "detail.close": "Close",
  "detail.info": "Match info",
  "detail.scorers": "Goals",
  "detail.stats": "Match stats",
  "detail.possession": "Possession",
  "detail.shots": "Shots",
  "detail.shotsOnTarget": "On target",
  "detail.fouls": "Fouls",
  "detail.corners": "Corners",
  "detail.attendance": "Attendance",
  "detail.venue": "Venue",
  "detail.broadcast": "Watch on",
  "detail.recap": "Recap",
  "detail.noStats": "Stats appear once the match kicks off.",
  "detail.notStarted": "Not started yet",
  "detail.pen": "P",
  "detail.og": "OG",

  // team spotlight
  "team.form": "Recent form",
  "team.played": "Played",
  "team.w": "W",
  "team.d": "D",
  "team.l": "L",
  "team.gf": "GF",
  "team.ga": "GA",

  // ecuador
  "ec.badge": "Group E · La Tri",
  "ec.titleLine2": "at World Cup 2026",
  "ec.subtitle":
    "Follow every Ecuador fixture — kick-off times shown in your own timezone. Counting down to the next match below.",
  "ec.fixtures": "La Tri's fixtures",
  "ec.glance": "Group E at a glance",
  "ec.next": "Next match",
  "ec.last": "Last match",
  "ec.playing": "Playing now",
  "ec.inProgress": "⚽ Match in progress",
  "ec.loading": "Loading Ecuador's schedule…",
  "ec.unavailable": "Schedule unavailable.",

  // countdown
  "cd.days": "Days",
  "cd.hrs": "Hrs",
  "cd.min": "Min",
  "cd.sec": "Sec",
  "cd.kickoff": "Kick-off!",

  // predict
  "pr.badge": "Bracket Challenge",
  "pr.titlePre": "Predict the ",
  "pr.titleHl": "bracket",
  "pr.subtitle":
    "Call the group winners, pick your wildcard underdogs, then click your way through every knockout round to crown a champion. Your picks save automatically in this browser.",
  "pr.groups": "Groups",
  "pr.wildcards": "Wildcards",
  "pr.champion": "Champion",
  "pr.reset": "Reset",
  "pr.yourChampion": "Your predicted champion",
  "pr.step1": "Group stage",
  "pr.step1hint": "Tap two teams in each group to set 1st & 2nd place.",
  "pr.step2": "Wildcard third-place teams",
  "pr.step2hint":
    "Choose 8 of the best third-placed teams (max one per group) to complete the 32.",
  "pr.step3": "Knockout bracket",
  "pr.step3hint":
    "Tap the team you think advances in each match — winners flow to the next round.",
  "pr.set": "set",
  "pr.pickMore": "pick {n} more",
  "pr.thirdPlace": "3rd place",
  "pr.wildcardsHint":
    "Set the group winners above first — then the third-place contenders appear here.",
  "pr.locked": "Bracket locked",
  "pr.lockedDesc": "Finish the setup to unlock the knockout rounds:",
  "pr.swipe": "← swipe to explore the bracket →",
};

const es: Dict = {
  "nav.matches": "Partidos",
  "nav.predict": "Predicción",
  "nav.ecuador": "Ecuador",
  "brand.tagline": "Centro de Partidos",
  "lang.switch": "Cambiar idioma",

  "sponsor.poweredBy": "Con el apoyo de",
  "sponsor.officialSponsor": "Patrocinador oficial",
  "sponsor.championBy": "Campeón presentado por",
  "sponsor.sponsoredBy": "Patrocinado por",
  "sponsor.broughtBy": "Presentado por",
  "sponsor.presentedBy": "Presentado por",
  "sponsor.supportsPre": "Organisk LM apoya con orgullo a la selección nacional de ",
  "sponsor.supportsPost": "",
  "sponsor.laTri": "Patrocinador oficial de La Tri · organisklm.com",

  "footer.kickoff": "Horarios mostrados en tu zona horaria local.",
  "footer.disclaimer":
    "Proyecto no oficial de aficionados · Calendario: Copa Mundial 2026.",

  "home.dates": "11 jun – 19 jul, 2026",
  "home.titlePre": "Copa Mundial ",
  "home.titleLine2": "en tu hora local.",
  "home.subtitle":
    "El calendario completo del primer Mundial de 48 selecciones, organizado entre Estados Unidos, Canadá y México — cada partido convertido automáticamente a tu zona horaria.",
  "home.followEc": "Sigue a Ecuador",
  "home.browse": "Ver todos los partidos",
  "stats.teams": "Equipos",
  "stats.matches": "Partidos",
  "stats.cities": "Sedes",
  "stats.nations": "Países",

  "upnext.title": "Próximos",
  "upnext.desc": "· los dos próximos partidos, en tu hora",
  "upnext.in": "en",

  vs: "vs",
  at: "@",

  "status.live": "En vivo",
  "status.ft": "Finalizado",
  "status.upcoming": "Próximo",
  "status.ht": "DESC",

  "stage.group": "Grupo",
  "stage.r32": "Dieciseisavos",
  "stage.r16": "Octavos de final",
  "stage.qf": "Cuartos de final",
  "stage.sf": "Semifinal",
  "stage.third": "Tercer puesto",
  "stage.final": "Final",

  "filters.search": "Busca equipo, ciudad o estadio…",
  "filters.all": "Todos",
  "filters.groups": "Grupos",
  "filters.knockouts": "Eliminatorias",
  "filters.allGroups": "Todos los grupos",
  "filters.upcomingOnly": "Solo próximos",
  "filters.loading": "Cargando partidos…",
  "filters.countOne": "{n} partido",
  "filters.countOther": "{n} partidos",
  "filters.yourTime": "Tu hora local",
  "scores.live": "Marcadores en vivo",
  "scores.demo": "Resultados demo",
  "scores.demoHint": "Resultados simulados para vista previa — configura un proveedor para datos reales.",
  "empty.title": "No se encontraron partidos",
  "empty.desc": "Prueba a borrar la búsqueda o los filtros.",
  "error.schedule": "No se pudo cargar el calendario: {error}",
  "filters.allTeams": "Todos los equipos",

  // match detail
  "detail.open": "Ver detalles del partido",
  "detail.close": "Cerrar",
  "detail.info": "Info del partido",
  "detail.scorers": "Goles",
  "detail.stats": "Estadísticas",
  "detail.possession": "Posesión",
  "detail.shots": "Tiros",
  "detail.shotsOnTarget": "Al arco",
  "detail.fouls": "Faltas",
  "detail.corners": "Córners",
  "detail.attendance": "Asistencia",
  "detail.venue": "Estadio",
  "detail.broadcast": "Ver en",
  "detail.recap": "Resumen",
  "detail.noStats": "Las estadísticas aparecen cuando empieza el partido.",
  "detail.notStarted": "Aún no comienza",
  "detail.pen": "P",
  "detail.og": "AG",

  // team spotlight
  "team.form": "Forma reciente",
  "team.played": "Jugados",
  "team.w": "G",
  "team.d": "E",
  "team.l": "P",
  "team.gf": "GF",
  "team.ga": "GC",

  "ec.badge": "Grupo E · La Tri",
  "ec.titleLine2": "en la Copa Mundial 2026",
  "ec.subtitle":
    "Sigue todos los partidos de Ecuador — horarios mostrados en tu zona horaria. Cuenta atrás para el próximo partido abajo.",
  "ec.fixtures": "Partidos de La Tri",
  "ec.glance": "Grupo E de un vistazo",
  "ec.next": "Próximo partido",
  "ec.last": "Último partido",
  "ec.playing": "Jugando ahora",
  "ec.inProgress": "⚽ Partido en curso",
  "ec.loading": "Cargando el calendario de Ecuador…",
  "ec.unavailable": "Calendario no disponible.",

  "cd.days": "Días",
  "cd.hrs": "Hrs",
  "cd.min": "Min",
  "cd.sec": "Seg",
  "cd.kickoff": "¡A jugar!",

  "pr.badge": "Reto de Predicción",
  "pr.titlePre": "Predice el ",
  "pr.titleHl": "cuadro",
  "pr.subtitle":
    "Elige los ganadores de grupo, escoge a tus comodines sorpresa y avanza por cada ronda eliminatoria hasta coronar a un campeón. Tus elecciones se guardan automáticamente en este navegador.",
  "pr.groups": "Grupos",
  "pr.wildcards": "Comodines",
  "pr.champion": "Campeón",
  "pr.reset": "Reiniciar",
  "pr.yourChampion": "Tu campeón pronosticado",
  "pr.step1": "Fase de grupos",
  "pr.step1hint": "Toca dos equipos en cada grupo para elegir 1º y 2º.",
  "pr.step2": "Mejores terceros (comodines)",
  "pr.step2hint":
    "Elige 8 de los mejores terceros (máx. uno por grupo) para completar los 32.",
  "pr.step3": "Cuadro de eliminatorias",
  "pr.step3hint":
    "Toca el equipo que crees que avanza en cada partido — los ganadores pasan a la siguiente ronda.",
  "pr.set": "listo",
  "pr.pickMore": "elige {n} más",
  "pr.thirdPlace": "3er puesto",
  "pr.wildcardsHint":
    "Primero elige los ganadores de grupo arriba — luego aparecerán aquí los candidatos a tercero.",
  "pr.locked": "Cuadro bloqueado",
  "pr.lockedDesc": "Completa la configuración para desbloquear las eliminatorias:",
  "pr.swipe": "← desliza para explorar el cuadro →",
};

export const DICTS: Record<Locale, Dict> = { en, es };

export type TFunc = (key: string, vars?: Record<string, string | number>) => string;

export function makeT(locale: Locale): TFunc {
  return (key, vars) => {
    const s = DICTS[locale][key] ?? DICTS.en[key] ?? key;
    if (!vars) return s;
    return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
  };
}

export function detectLocale(): Locale {
  if (typeof navigator !== "undefined") {
    const l = (navigator.language || "").toLowerCase();
    if (l.startsWith("en")) return "en";
  }
  return "es"; // Spanish is the default
}

const STAGE_KEYS: Record<string, string> = {
  Group: "stage.group",
  "Round of 32": "stage.r32",
  "Round of 16": "stage.r16",
  "Quarter-final": "stage.qf",
  "Semi-final": "stage.sf",
  "Third-place": "stage.third",
  Final: "stage.final",
};

/** Localized stage/round name. For groups pass the letter to get "Group A" / "Grupo A". */
export function stageLabel(t: TFunc, stage: string, group?: string): string {
  if (stage === "Group" && group) return `${t("stage.group")} ${group}`;
  return t(STAGE_KEYS[stage] ?? stage);
}
