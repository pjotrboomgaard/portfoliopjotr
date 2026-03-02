export interface ProjectLink {
  label: string;
  labelEn?: string;
  url: string;
}

export interface ProjectTranslation {
  subtitle?: string;
  descriptions?: string[];
  cvInfo?: string;
}

export interface Project {
  id: string;
  title: string;
  year: string;
  subtitle?: string;
  wip?: boolean;
  hidden?: boolean;
  thumbnail?: string;
  image?: string;
  secondaryImage?: string;
  videoUrl?: string;
  embedUrl?: string;
  descriptions: string[];
  cvInfo?: string;
  links?: ProjectLink[];
  en?: ProjectTranslation;
}

export const projects: Project[] = [
  {
    id: "voice",
    title: "Een nieuwe stem",
    year: "2026",
    subtitle: "Hybride documentaire",
    wip: true,
    thumbnail: "/eenNieuweStemStill.png",
    image: "/eenNieuweStemStill.png",
    descriptions: [
      "Wat als een AI de regie over liefde overneemt? In deze hybride documentaire neemt een AI-assistent de rollen aan van datingcoach, filmregisseur en spiegel. Via een slimme bril navigeren verschillende mensen door het moderne daten, begeleid door een stem in hun hoofd.",
      "Een portret van hoe we verbinding maken en wat er gebeurt als we technologie de leiding geven. De film verkent verschillende relatievormen — van monogamie tot polyamorie — gemengd met een stem die leefstijladvies geeft.",
      "Het centrale element is een AI-vriend in je hoofd. De AI neemt de rol aan van datingcoach, filmregisseur, psycholoog en dubbelganger van zowel mij als mijn dates.",
    ],
    cvInfo:
      "Een verkenning van menselijke verbinding via AI-bemiddeld daten. Verschillende mensen dragen een slimme bril die filmt, luistert en in realtime advies geeft. Het project combineert documentairefilm met interactieve AI-technologie.",
    en: {
      subtitle: "Hybrid Documentary",
      descriptions: [
        "What if AI could direct love? In this hybrid documentary, an AI assistant takes on the roles of date coach, film director and mirror. Through smart glasses, different people navigate modern dating while being guided, watched and reflected by a voice in their head.",
        "A portrait of how we connect and what happens when we let technology take the lead. The film explores different forms of relating, from monogamy to polyamory, mixed with a voice that gives lifestyle advice.",
        "The central element is an AI friend in your head. AI takes on the role of date coach, film director, psychologist, and stand-in for both me and my dates.",
      ],
      cvInfo:
        "An exploration of human connection through AI-mediated dating. Multiple people wear smart glasses that film, listen and advise in real time. The project combines documentary filmmaking with interactive AI technology.",
    },
  },
  {
    id: "saiid",
    title: "Saiid",
    year: "2025",
    subtitle: "Documentaire",
    wip: true,
    thumbnail: "/Saiid.png",
    image: "/Saiid.png",
    descriptions: [
      "Mijn huisgenoot en vriend Saiid is een cocktail van ongewone achtergronden en overtuigingen. Met een Oeigoerse moeder en Palestijnse vader, op jonge leeftijd gevlucht uit China om de Oeigoerse kampen te ontkomen, vroeg zijn vader verloren, en opgegroeid in talloze asielzoekerscentra.",
      "Dit alles heeft Saiids kijk op de wereld gevormd. Samen bezoeken we plekken uit zijn verleden. Een documentaire over ontheemd zijn, veerkracht en de betekenis van thuis.",
    ],
    en: {
      subtitle: "Documentary",
      descriptions: [
        "My roommate and friend Saiid is a cocktail of unusual backgrounds and convictions. With a Uyghur mother and Palestinian father, having fled from China to escape the Uyghur camps at a young age, having lost his father early, and having grown up in countless refugee centers.",
        "All of this has shaped Saiid's view of the world. Together we revisit places from his past. A documentary about displacement, resilience and the meaning of home.",
      ],
    },
  },
  {
    id: "tobor",
    title: "Tobor",
    year: "2024",
    subtitle: "Documentaire",
    wip: true,
    thumbnail: "/Tobor.png",
    image: "/still-tobor.png",
    videoUrl: "https://www.youtube.com/embed/TzMmpr1S1xA",
    descriptions: [
      "Tobor was de naam van de robot die mijn moeder als twaalfjarig meisje samen met haar vader bouwde. Nu bouwen wij hem samen opnieuw, uitgerust met artificiële intelligentie. De film is een portret van mijn moeder, onze familie en onze relaties.",
      "Via het herbouwproces onderzoekt de film intergenerationele patronen en een familietaal waarin liefde wordt uitgedrukt door samen te bouwen in plaats van te praten.",
      "Voorlopige versies van de film zijn onder andere vertoond bij Filmhuis Cavia.",
    ],
    cvInfo:
      "Regisseur en maker. Concept en verhaallijn ontwikkeld.",
    links: [
      {
        label: "Bekijk Tobor (work in progress)",
        labelEn: "Watch Tobor (work in progress)",
        url: "https://youtu.be/TzMmpr1S1xA",
      },
      {
        label: "GitHub (Tobor AI)",
        url: "https://github.com/pjotrboomgaard",
      },
    ],
    en: {
      subtitle: "Documentary",
      descriptions: [
        "Tobor was the name of the robot my mother built together with my grandfather when she was 12 years old. Together we are rebuilding the robot, now equipped with artificial intelligence. The film is a portrait of my mother, our family and our relationships.",
        "Through the rebuilding process the film investigates intergenerational patterns and a family language in which love is expressed by building together rather than talking.",
        "Preliminary versions of the film have been screened at Filmhuis Cavia among other places.",
      ],
      cvInfo:
        "Director and maker. Developed the film concept and storyline.",
    },
  },
  {
    id: "robo-ritueel",
    title: "Robo Ritueel",
    year: "2026",
    subtitle: "Performance",
    thumbnail: "/still-robo-ritueel.png",
    image: "/still-robo-ritueel.png",
    secondaryImage: "/flyer-robo-ritueel.jpeg",
    videoUrl: "https://www.youtube.com/embed/GEwRqDgO1tY",
    descriptions: [
      "Een terugkerend buurtgericht performanceformat bij Supermercator. Een AI-gestuurde, mensgrote robot begeleidt het publiek in hypnose, meditatie, dans en live dialoog.",
      "Het project ontstond vanuit de documentaire Tobor en fungeert als publieke uitbreiding en experimentele testomgeving voor het AI-systeem.",
    ],
    cvInfo:
      "Initiatiefnemer en organisator. Artistiek concept en publieksopzet ontwikkeld. Technische realisatie en doorontwikkeling van de robot en het AI-systeem voor live interactie. Interactieve sessies gefaciliteerd waarbij bezoekers actieve deelnemers worden.",
    links: [
      {
        label: "@supermercator",
        url: "https://www.instagram.com/supermercator/",
      },
      {
        label: "Robo Ritueel op Instagram",
        labelEn: "Robo Ritueel on Instagram",
        url: "https://www.instagram.com/p/DUCxi5CjPie/",
      },
    ],
    en: {
      subtitle: "Performance",
      descriptions: [
        "A recurring neighborhood performance format at Supermercator. An AI-driven, human-sized robot guides the audience through hypnosis, meditation, dance and live dialogue.",
        "The project emerged from the documentary Tobor and functions as a public extension and experimental testing ground for the AI system.",
      ],
      cvInfo:
        "Initiator and organizer. Developed the artistic concept and audience setup. Technical realization and further development of the robot and AI system for live interaction. Facilitated interactive sessions where visitors become active participants.",
    },
  },
  {
    id: "tobor-ai",
    title: "Tobor AI",
    year: "2025",
    subtitle: "Robot & AI-systeem",
    thumbnail: "/toborhead3.png",
    image: "/toborhead3.png",
    descriptions: [
      "Tobor AI is het AI-systeem en de mensgrote robot die ik samen met mijn moeder heb herbouwd — dezelfde robot die zij als kind samen met haar vader maakte. Voor haar was Tobor destijds een metgezel en een manier om verbinding te vinden. Veertig jaar later bouwen we hem opnieuw, nu uitgerust met artificiële intelligentie: de robot kan spreken, luisteren, bewegen en reageren.",
      "Ik ontwikkelde het AI-systeem zelf en ben verantwoordelijk voor de technische integratie en doorontwikkeling voor live publieksinteractie. De robot fungeert als spiegel van onze familiedynamiek en onderzoekt wat er gebeurt wanneer een machine emotionele ruimte inneemt die mensen moeilijk kunnen dragen.",
      "Tobor is samen met mijn moeder gebouwd: zij als beeldend kunstenaar en mede-bouwer, ik als maker van de film en het AI-systeem. Het herbouwen doen we ook met mijn opa en oma; het wordt een poging om ons emotioneel in dezelfde ruimte te brengen.",
      "De robot draagt persoonlijkheden van mijn opa, oma, mijn moeder en mij. Die zijn gevoed met vragenlijsten en geüploade informatie uit dagboeken, zodat Tobor niet alleen technisch maar ook relationeel een verbindend element is binnen onze familiegeschiedenis.",
    ],
    cvInfo:
      "Technische realisatie en doorontwikkeling van de robot en het AI-systeem. Ontwikkeling van het geïntegreerde AI-systeem in het robotlichaam. Artistiek concept en live interactie.",
    links: [
      {
        label: "GitHub (TOBOR-AI)",
        labelEn: "GitHub (TOBOR-AI)",
        url: "https://github.com/pjotrboomgaard/TOBOR-AI",
      },
    ],
    en: {
      subtitle: "Robot & AI system",
      descriptions: [
        "Tobor AI is the AI system and human-sized robot I rebuilt together with my mother — the same robot she built with her father as a child. For her, Tobor was then a companion and a way to find connection. Forty years later we rebuild him, now equipped with artificial intelligence: the robot can speak, listen, move and respond.",
        "I developed the AI system myself and am responsible for technical integration and further development for live audience interaction. The robot acts as a mirror of our family dynamics and explores what happens when a machine takes up emotional space that people find hard to carry.",
        "Tobor was built together with my mother: she as visual artist and co-builder, I as maker of the film and the AI system. We also rebuild Tobor with my grandfather and grandmother; it becomes an attempt to bring us emotionally into the same space.",
        "The robot carries personalities of my grandfather, grandmother, my mother and me. These have been fed with questionnaires and uploaded information from diaries, so that Tobor is not only technically but also relationally a connecting element within our family history.",
      ],
      cvInfo:
        "Technical realization and further development of the robot and AI system. Development of the integrated AI system in the robot body. Artistic concept and live interaction.",
    },
  },
  {
    id: "alien",
    title: "Once An Alien",
    year: "2023",
    subtitle: "Film",
    thumbnail: "/onceanalienstill.png",
    image: "/onceanalienstill.png",
    descriptions: [
      "Een documentaire over mijn grootvader, gemaakt door mijn tante Sema Bekirovic. Een verhaal over migratie, identiteit en thuishoren over generaties heen. Ik maakte de promo voor de film en werkte als postproductie-assistent.",
    ],
    links: [
      {
        label: "Bekijk promo op YouTube",
        labelEn: "Watch promo on YouTube",
        url: "https://www.youtube.com/watch?v=r9oi9AhULlc",
      },
      {
        label: "Bekijk op NPO",
        labelEn: "Watch on NPO",
        url: "https://www.npostart.nl/once-an-alien/VPWON_1348082",
      },
    ],
    en: {
      descriptions: [
        "A documentary about my grandfather, made by my aunt Sema Bekirovic. A story of migration, identity and belonging across generations. I made the promo for the film and worked as post-production assistant.",
      ],
    },
  },
  {
    id: "zanne",
    title: "Zanne",
    year: "2017",
    subtitle: "Korte documentaire",
    thumbnail: "/Zanne.png",
    image: "/still-zanne.png",
    videoUrl: "https://www.youtube.com/embed/lZ8IH9YnqAE",
    descriptions: [
      "Een korte documentaire over mijn jonge moeder, gefilmd vanuit mijn perspectief toen ik twintig was. Een verkenning van jong moederschap en onze onderlinge relatie.",
      "Dit was mijn eerste documentaireproject en het startpunt van wat later de Tobor-film zou worden. Door mijn moeder door de camera te bekijken leerde ik dingen te zien die ik nog niet eerder wist.",
    ],
    en: {
      subtitle: "Short Documentary",
      descriptions: [
        "A short documentary about my young mother, filmed from my perspective when I was 20 years old. Exploring the themes of young motherhood and our relationship.",
        "This was my first documentary project, and the starting point for what would later become the Tobor film. Looking at my mother through the camera taught me to see things I had never noticed before.",
      ],
    },
  },
  {
    id: "den-helder",
    title: "(Non) Humans of Den Helder",
    year: "2022",
    subtitle: "Documentair onderzoek",
    thumbnail: "/still-non-humans-2.png",
    image: "/still-non-humans-2.png",
    secondaryImage: "/still-non-humans-3.png",
    videoUrl: "https://www.youtube.com/embed/nzlE3gPM9vQ",
    descriptions: [
      "Voor mijn afstudeeronderzoek voerde ik een reeks interviews met bewoners van Den Helder over hun relatie tot niet-menselijke entiteiten: dieren, natuur en objecten.",
      "Het project onderzocht hoe mensen betekenis geven aan hun omgeving en hoe menselijke en niet-menselijke werelden zich tot elkaar verhouden. Ik sprak met een duivenverzorger, een trotse tuinbezitter en leden van een zwemclub.",
      "Het videomateriaal is gebruikt door de Gemeente Den Helder in het kader van hun ruimtelijke en maatschappelijke projecten.",
    ],
    cvInfo:
      "Regie, camera en montage. Concept en onderzoeksvraag ontwikkeld. Onderdeel van afstudeerproject aan de TU Delft, MSc Landscape Architecture.",
    links: [
      {
        label: "Bekijk op YouTube",
        labelEn: "Watch on YouTube",
        url: "https://www.youtube.com/watch?v=nzlE3gPM9vQ",
      },
    ],
    en: {
      subtitle: "Documentary Research",
      descriptions: [
        "For my graduation research I conducted a series of interviews with residents of Den Helder about their relationship with non-human entities: animals, nature and objects.",
        "The project investigated how people give meaning to their environment and how human and non-human worlds relate to each other. I spoke to a dove caretaker, a proud garden owner and members of a swimming club.",
        "The video material was used by the Municipality of Den Helder in the context of their spatial and social projects.",
      ],
      cvInfo:
        "Direction, camera and editing. Development of concept and research question. Part of graduation project at TU Delft, MSc Landscape Architecture.",
    },
  },
  {
    id: "meetingmemo",
    title: "MeetingMemo",
    year: "2024",
    subtitle: "AI-tool",
    thumbnail: "/meetingmemo-ascii.png",
    embedUrl: "https://meetingmemo.ai",
    descriptions: [
      "Een digitale notulist ontwikkeld in samenwerking met Nitai Nijholt bij ConsultAI. MeetingMemo transcribeert vergaderingen automatisch en genereert gestructureerde notulen.",
      "Gebouwd als een React-applicatie met OpenAI Whisper-integratie. Functies omvatten automatische transcriptie, downloadbare bestanden, notulensjablonen en meer.",
    ],
    cvInfo:
      "Hoofdontwikkelaar. Opzetten van een React-applicatie voor automatische transcriptie en notulen. Integratie met OpenAI Whisper.",
    links: [{ label: "meetingmemo.ai", url: "https://meetingmemo.ai" }],
    en: {
      subtitle: "AI Tool",
      descriptions: [
        "A digital note-taker developed in collaboration with Nitai Nijholt at ConsultAI. MeetingMemo automatically transcribes meetings and generates structured minutes.",
        "Built as a React application with OpenAI Whisper integration. Features include automatic transcription, downloadable files, minute templates and more.",
      ],
      cvInfo:
        "Lead developer. Setting up a React application for automatic transcription and minutes. Integration with OpenAI Whisper.",
    },
  },
  {
    id: "landscape",
    title: "Gerealiseerde architectonische projecten",
    year: "2023",
    subtitle: "Ontwerp",
    thumbnail: "/tuinontwerp-1.png",
    image: "/tuinontwerp-1.png",
    secondaryImage: "/tuinontwerp-2.png",
    descriptions: [
      "Tuinontwerp voor een woning in de duinen (2023, gerealiseerd 2025). Van concept tot definitief plan, inclusief beplantingsselectie, technische tekeningen en uitvoeringsdetails.",
      "Speeltuin Spoorwegmuseum Utrecht (2023). Tijdens mijn stage bij OKRA Landschapsarchitecten was ik medeverantwoordelijk voor het schetsontwerp en voorontwerp van de speeltuin bij het Spoorwegmuseum in Utrecht.",
    ],
    cvInfo:
      "Freelance tuinarchitect (2023). Stage OKRA Landschapsarchitecten Utrecht (2023) — projecten o.a. Spoorwegmuseum Utrecht, Gemeente Leuven, Barakkenbos Katwijk. Stage Gemeente Amsterdam (2020). MSc Landscape Architecture, TU Delft (2024).",
    en: {
      subtitle: "Design",
      descriptions: [
        "Garden design for a house in the dunes (2023, realized 2025). From concept to final plan, including planting selection, technical drawings and execution details.",
        "Playground Spoorwegmuseum Utrecht (2023). During my internship at OKRA Landschapsarchitecten I was co-responsible for the sketch design and preliminary design of the playground at the Spoorwegmuseum in Utrecht.",
      ],
      cvInfo:
        "Freelance garden architect (2023). Internship OKRA Landschapsarchitecten Utrecht (2023) — projects include Spoorwegmuseum Utrecht, Gemeente Leuven, Barakkenbos Katwijk. Internship Gemeente Amsterdam (2020). MSc Landscape Architecture, TU Delft (2024).",
    },
  },
  {
    id: "huidhonger",
    title: "Huidhonger",
    year: "2021",
    subtitle: "Korte film",
    thumbnail: "/huidhonger.png",
    image: "/huidhonger.png",
    descriptions: [
      "Een korte film gemaakt met vrienden over een bijzondere nachtelijke reis. Regie, camera en montage.",
    ],
    en: {
      subtitle: "Short Film",
      descriptions: [
        "A short film made with friends about a special nocturnal journey. Directing, filming and editing.",
      ],
    },
  },
  {
    id: "neverwanna",
    title: "Never Wanna Be In Love",
    year: "2024",
    subtitle: "Muziekvideo",
    hidden: true,
    thumbnail: "/PreviewNeverWannaBe.png",
    image: "/videoclip.png",
    descriptions: [
      "Een muziekvideo voor de band LONA. Een visuele verkenning van romantische rusteloosheid en het verlangen om onaangeraakt te blijven door liefde.",
    ],
    en: {
      subtitle: "Music Video",
      descriptions: [
        "A music video for the band LONA. A visual exploration of romantic restlessness and the desire to stay untouched by love.",
      ],
    },
  },
];

export const aboutText = `Ik ben een Nederlandse filmmaker en architect gevestigd in Amsterdam. Ik studeerde af aan de TU Delft met een MSc Landscape Architecture (2024) en een BSc Architecture and the Built Environment (2021). Mijn werk combineert documentairefilm met technologie, ruimtelijk denken en persoonlijk verhaalvertellen. Ik ga projecten hands-on aan, bouw vaak zelf de tools en opstellingen waarmee ik film, en ik word in het bijzonder aangetrokken door de spanning tussen AI en menselijke kwetsbaarheid: waar die twee overlappen, en waar ze elkaar missen.`;

export const aboutTextEn = `I am a Dutch filmmaker and architect based in Amsterdam. I graduated from TU Delft with an MSc in Landscape Architecture (2024) and a BSc in Architecture and the Built Environment (2021). My work combines documentary filmmaking with technology, spatial thinking, and personal storytelling. I approach projects in a hands-on way, often building the tools and setups I film with, and I am especially drawn to the friction between AI and human vulnerability: where those two overlap, and where they fail to meet.`;
