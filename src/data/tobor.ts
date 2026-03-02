/**
 * Tobor – hardware overview and narrative about what the robot can do.
 * Image paths are placeholders: add your images in public/tobor/ as needed.
 */

export interface ToborItem {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  /** Placeholder path for image, e.g. /tobor/hardware/eyes.jpg */
  image?: string;
}

/** Onderdelen in de robot (kort en niet-technisch). */
export const toborHardware: ToborItem[] = [
  {
    id: "raspberry-pi",
    title: "Computer",
    titleEn: "Computer",
    description: "Het brein van de robot: spraak, gesprekken en aansturing.",
    descriptionEn: "The robot's brain: speech, conversation and control.",
    image: "/tobor/hardware/raspberry-pi.jpg",
  },
  {
    id: "hoverboard-wheels",
    title: "Wielen",
    titleEn: "Wheels",
    description: "Tobor kan rijden, draaien en meebewegen tijdens sessies.",
    descriptionEn: "Tobor can drive, turn and move during sessions.",
    image: "/tobor/hardware/wheels.jpg",
  },
  {
    id: "siren",
    title: "Sirene",
    titleEn: "Siren",
    description: "Licht en geluid tijdens geleide hypnose.",
    descriptionEn: "Light and sound during guided hypnosis.",
    image: "/tobor/hardware/siren.jpg",
  },
  {
    id: "eyes-led",
    title: "Ogen",
    titleEn: "Eyes",
    description: "Lampjes in de ogen.",
    descriptionEn: "Lights in the eyes.",
    image: "/tobor/hardware/eyes.jpg",
  },
  {
    id: "mouth-led",
    title: "Mond",
    titleEn: "Mouth",
    description: "Lampjes in de mond, vaak in sync met praten.",
    descriptionEn: "Lights in the mouth, often in sync with speech.",
    image: "/tobor/hardware/mouth.jpg",
  },
  {
    id: "nose-led",
    title: "Neus",
    titleEn: "Nose",
    description: "Lampje op de neus, o.a. wanneer hij luistert.",
    descriptionEn: "Light on the nose, e.g. when listening.",
    image: "/tobor/hardware/nose.jpg",
  },
  {
    id: "cheeks-matrix",
    title: "Wangen",
    titleEn: "Cheeks",
    description: "Schermpjes op de wangen met emoties: blij, verdrietig, hypnose-patronen.",
    descriptionEn: "Screens on the cheeks showing emotions: happy, sad, hypnosis patterns.",
    image: "/tobor/hardware/cheeks.jpg",
  },
  {
    id: "batteries",
    title: "Batterijen",
    titleEn: "Batteries",
    description: "Accu's voor uren gebruik, ook voor lange sessies.",
    descriptionEn: "Batteries for hours of use, including long sessions.",
    image: "/tobor/hardware/batteries.jpg",
  },
  {
    id: "microphone",
    title: "Microfoon",
    titleEn: "Microphone",
    description: "Om te horen en te reageren op wat je zegt.",
    descriptionEn: "To hear and respond to what you say.",
    image: "/tobor/hardware/microphone.jpg",
  },
  {
    id: "camera",
    title: "Camera",
    titleEn: "Camera",
    description: "Om te kijken; o.a. tijdens hypnose en gesprekken.",
    descriptionEn: "To see; e.g. during hypnosis and conversations.",
    image: "/tobor/hardware/camera.jpg",
  },
  {
    id: "controller",
    title: "Afstandsbediening",
    titleEn: "Remote control",
    description: "Handbediening om Tobor te laten rijden en draaien.",
    descriptionEn: "Manual control to make Tobor drive and turn.",
    image: "/tobor/hardware/controller.jpg",
  },
];

/** Verhaal: wat de robot kan. Aansluitend op de AFK-aanvraag. */
export const toborNarrative: { nl: string[]; en: string[] } = {
  nl: [
    "Tobor kan spreken en luisteren. Hij reageert op wat je zegt, kan in gesprek gaan en neemt de rol aan van een geduldig, aandachtig familielid. In de film en tijdens de robotavonden fungeert hij als spiegel van onze familiedynamiek: liefde die via maken werd uitgedrukt, krijgt in hem een stem.",
    "Tijdens sessies kan hij begeleiden in meditatie en geleide hypnose. Hij beweegt mee op de wielen, gebruikt licht en geluid op vaste momenten en spreekt in verschillende stemmen. Die stemmen zijn gevoed met vragenlijsten en dagboekfragmenten van mijn opa, oma, mijn moeder en mij — zodat Tobor niet alleen technisch, maar ook relationeel een verbindend element is.",
    "Hij kan dansen, emoties tonen op zijn wangen en met het publiek in dialoog. De vraag die onder alles ligt: wat gebeurt er wanneer een machine emotionele ruimte inneemt die mensen moeilijk kunnen dragen? Kan hij een brug slaan waar menselijke communicatie stokt? Tobor is uiteindelijk een verhaal over of we elkaar werkelijk kunnen bereiken, en wat er gebeurt wanneer een machine ons daarbij helpt of confronteert.",
  ],
  en: [
    "Tobor can speak and listen. He responds to what you say, can hold a conversation and takes on the role of a patient, attentive family member. In the film and during the robot evenings he acts as a mirror of our family dynamics: love that was expressed through making now finds a voice in him.",
    "During sessions he can guide meditation and guided hypnosis. He moves along on his wheels, uses light and sound at set moments and speaks in different voices. Those voices are fed with questionnaires and diary fragments from my grandfather, grandmother, my mother and me — so that Tobor is not only technically but also relationally a connecting element.",
    "He can dance, show emotions on his cheeks and engage in dialogue with the audience. The question underneath it all: what happens when a machine takes up emotional space that people find hard to carry? Can he build a bridge where human communication stalls? In the end Tobor is a story about whether we can truly reach each other, and what happens when a machine helps or confronts us in that.",
  ],
};

/** Single concept / technical drawing image for Tobor (one hero image; you add the file). */
export const toborConceptImage = "/tobor/concept-tekening.jpg";
