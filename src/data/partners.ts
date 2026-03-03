/**
 * Samenwerkingspartners – portfolio en track record voor subsidie- en projectaanvragen.
 */

export interface PartnerLink {
  label: string;
  labelEn?: string;
  url: string;
}

export interface PartnerTrackSection {
  title: string;
  titleEn?: string;
  items: string[];
  itemsEn?: string[];
}

export interface Partner {
  id: string;
  name: string;
  role: string;
  roleEn?: string;
  artistStatement: string;
  artistStatementEn?: string;
  trackRecord: PartnerTrackSection[];
  links: PartnerLink[];
}

export const partners: Partner[] = [
  {
    id: "zanne-bekirovic",
    name: "Zanne Bekirovic",
    role: "Beeldend kunstenaar en mede-ontwikkelaar van Tobor; artistieke en inhoudelijke co-ontwikkeling van het AI-systeem en de fysieke robot.",
    roleEn:
      "Visual artist and co-developer of Tobor; artistic and conceptual co-development of the AI system and the physical robot.",
    artistStatement:
      "Mijn praktijk bevindt zich al twintig jaar op het snijvlak van technologie en menselijke kwetsbaarheid. Van avant-garde opera's op podia als Lowlands tot VR-installaties op de Dutch Design Week; mijn werk draait om het vermenselijken van technologie. Met mijn projecten breng ik technische expertise in AI en robotica samen met een diepgewortelde artistieke visie op interactie.",
    artistStatementEn:
      "My practice has been at the intersection of technology and human vulnerability for twenty years. From avant-garde opera on stages like Lowlands to VR installations at Dutch Design Week, my work is about humanising technology. I bring technical expertise in AI and robotics together with a deeply rooted artistic vision of interaction.",
    trackRecord: [
      {
        title: "Multimediale opera & theater",
        titleEn: "Multimedia opera & theatre",
        items: [
          "2010 (of 2007) | De Evolutie (Opera) — Partner: Huba de Graaff. Première: Korzo Theater, Den Haag. Rol: Video-ontwerp en interactieve visuals.",
          "2004–2005 | Witches and Bitches (Opera/Theatraal concert) — Partner: Chiel Meijering. Rol: Visuele vormgeving en video-content. Credits o.a. Wild Ride, Beat Michael, Dreamcastle.",
          "2004 | Generic City (Interactieve opera) — Partners: Huba de Graaff, Ensemble ELECTRA, Cappella Amsterdam. Korzo muziekproducties. Hoofdprogramma Lowlands Festival (22 aug 2004) en nationale theaters. Rol: Interactieve animaties en digitale scenografie.",
          "2004–2005 | Lois Lane Theater Tour — Rol: Video Producer, visuele identiteit en alle video-content van de landelijke tournee.",
        ],
      },
      {
        title: "VR-installaties & immersive storytelling (Dutch Design Week)",
        titleEn: "VR installations & immersive storytelling (Dutch Design Week)",
        items: [
          "2017 | Sofia (Remastered) / Virtual Intimacy — VR-installatie rondom AI-interactie en digitale empathie (Veemgebouw Eindhoven). Partner: Manifestations.",
          "2017 | Neoptera Transition Chip — Stereoscopic 360° VR (Manifestations 2017).",
          "2016 | Entropy — Abstracte VR over thermodynamica en informatieverval (Veemgebouw).",
          "2016 | The Journey (Refugee VR) — Empathische VR-ervaring vluchtelingenproblematiek (Veemgebouw).",
          "2016 | Mayhem — VR-project, vermeld op programmapagina Manifestations 2016.",
          "2015 | VR Intimacy — Onderzoek fysieke nabijheid en ethiek (De Witte Dame). Expositie: Will the Future Love Me?",
          "2011 | OpenUP Festival — Interactieve installaties: Laundry Game en LOKET.",
        ],
      },
      {
        title: "VJ-carrière & visuele regie (2005–2017)",
        titleEn: "VJ career & visual direction (2005–2017)",
        items: [
          "2007–2011 | Supperclub Amsterdam — Resident VJ.",
          "2005–2008 | Sugarfactory Amsterdam — Resident VJ (pionier live video-art). Optredens o.a. Vreemd @ Sugar Factory (feb 2009).",
          "2013–2017 | Club Lite Amsterdam — VJ & technische dienst.",
          "2006–2009 | Dirty Dutch / DJ Chuckie — Video-performances grootschalige dance-events.",
          "Optredens (archief): Sugar Factory, Melkweg, Paradiso, Club Lite, Nataraj.",
        ],
      },
      {
        title: "Media, awards & internationale erkenning",
        titleEn: "Media, awards & international recognition",
        items: [
          "2007 | #18 Best VJ in the World — DJ Mag (wereldwijde ranking).",
          "2007 | Elle Magazine (dec 2007) — VJ Kunst Interview.",
          "2006 | Interview & profiel — Elle Magazine (dec 2006).",
          "2009 | Special Mention — International Videofestival Bochum.",
          "2009 | Kasseler Dokfest — Programmaboek Archief (bijdrage VJ-cultuur, zanne.nl).",
          "2008 | Nominatie Beste VJ — Gouden Kabouter (Vision Impossible Trofee).",
          "2007 | Paradiso — Finalist VJ-contest Visual Sensations (27 jan 2007).",
          "2006 | Landelijk finalist — Visual Sensations.",
          "2004 | Speciale vermelding — Rocket Clip Competition Amsterdam.",
          "Academisch: Dancing Images (Marina Turco) — publicatie over VJ-cultuur met analyse van mijn rol in het veld.",
        ],
      },
      {
        title: "Innovatie & subsidie",
        titleEn: "Innovation & grants",
        items: [
          "2021–2022 | Project Daynotes (Interactieve AI-app) — Subsidie Gemeente Amsterdam €23.961,10 (SBA-032764) voor onderzoek en ontwikkeling van interactieve media. Projectleider & developer, AI-chatbot neurodiversiteit.",
        ],
      },
      {
        title: "Huidig werk: Tobor / Robo Ritueel (2025–2026)",
        titleEn: "Current work: Tobor / Robo Ritueel (2025–2026)",
        items: [
          "Focus: AI-installaties en interactieve robotica die maatschappelijke interactie spiegelen. Locaties: Supermercator (Amsterdam), Filmhuis Cavia.",
        ],
      },
    ],
    links: [],
  },
];
