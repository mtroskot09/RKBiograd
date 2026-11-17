import type { HistoryContent, InsertHistoryEvent } from "@shared/schema";

// Initial content of the history page, written to the database the first time the page is
// requested. Afterwards everything is edited in Admin → History.
// Facts were checked against public sources (Croatian Wikipedia, the Biograd town timeline,
// the court/association register, Novi list / Zadarski list reports and HRS league tables).

export const HISTORY_SEED_CONTENT: HistoryContent = {
  intro:
    "Od osnutka 1963. godine RK Biograd okuplja generacije rukometaša Biograda na Moru. " +
    "Najveći uspjeh kluba je naslov prvaka 2. HRL u sezoni 2010./11. i ulazak u 1. HRL.",
  mission:
    "RK Biograd nije samo rukometni klub – mi smo zajednica koja njeguje vrijednosti sporta, " +
    "timskog duha i predanosti. Naš cilj je razvijati mlade talente, dostizati vrhunske rezultate " +
    "i predstavljati Biograd na Moru s ponosom i dignitetom. Svaki igrač, trener i navijač dio je " +
    "naše velike obitelji.",
  stats: [
    { value: "1963.", label: "Godina osnutka" },
    { value: "2010./11.", label: "Prvaci 2. HRL – ulazak u 1. HRL" },
    { value: "500", label: "Mjesta u Sportskoj dvorani Biograd" },
  ],
};

export const HISTORY_SEED_EVENTS: InsertHistoryEvent[] = [
  {
    year: "1963.",
    title: "Osnovan RK Biograd",
    description: "U Biogradu na Moru osnovan je Rukometni klub Biograd.",
    imageSrc: null,
  },
  {
    year: "1998.",
    title: "Upis u registar udruga",
    description: "Klub je 26. listopada 1998. upisan u registar udruga kao RK „Biograd”.",
    imageSrc: null,
  },
  {
    year: "1999.",
    title: "Izgrađena Sportska dvorana Biograd",
    description: "Izgrađena je sportska dvorana s oko 500 mjesta – dom kluba do danas.",
    imageSrc: null,
  },
  {
    year: "2010./11.",
    title: "Prvaci 2. HRL i ulazak u 1. HRL",
    description: "Najveći uspjeh u povijesti kluba: osvajanjem 2. HRL Biograd je izborio nastup u 1. HRL.",
    imageSrc: null,
  },
  {
    year: "2011. – 2019.",
    title: "Prvoligaške sezone",
    description: "Nakon promocije Biograd je nastupao u 1. HRL, a u sezoni 2018./19. u 1. HRL Jug.",
    imageSrc: null,
  },
  {
    year: "2013.",
    title: "50. obljetnica kluba",
    description:
      "Godinu 50. obljetnice obilježile su financijske teškoće i prijetnja gašenjem, no klub je opstao.",
    imageSrc: null,
  },
  {
    year: "2022./23.",
    title: "2. mjesto u 2. HRL Jug",
    description: "19 pobjeda, 1 neriješeno i 2 poraza (gol razlika 682:523) – 39 bodova, odmah iza Splita.",
    imageSrc: null,
  },
  {
    year: "2023./24.",
    title: "3. mjesto u 2. HRL Jug",
    description: "30 bodova, jednako kao drugoplasirani Opuzen.",
    imageSrc: null,
  },
  {
    year: "2024./25.",
    title: "Niz od 12 pobjeda",
    description:
      "Jesen na vrhu ljestvice i 12 uzastopnih prvenstvenih pobjeda (uključujući derbi s Opuzenom 28:27). " +
      "Sezona je završena na 4. mjestu s 38 bodova.",
    imageSrc: null,
  },
];
