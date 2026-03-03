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

/** Verhaal: wat de robot kan, met functionele en technische uitleg. Aansluitend op de AFK-aanvraag. */
export const toborNarrative: { nl: string[]; en: string[] } = {
  nl: [
    "Tobor kan spreken en luisteren. Spraakherkenning en AI zorgen dat hij reageert op wat je zegt en in gesprek kan gaan; tekst-naar-spraak geeft hem een stem. Zo neemt hij de rol aan van een geduldig, aandachtig familielid. In de film en tijdens de robotavonden fungeert hij als spiegel van onze familiedynamiek: liefde die via maken werd uitgedrukt, krijgt in hem een stem.",
    "Tijdens sessies kan hij begeleiden in meditatie en geleide hypnose. Onder de motorkap rijdt hij op een gehackt hoverboard — de wielen sturen hem vooruit, achteruit en in rondjes, synchroon met de sessie. LEDs in ogen, mond en neus en een sirene geven op vaste momenten licht en geluid; hij spreekt in verschillende stemmen (TTS en voice cloning), gevoed met vragenlijsten en dagboekfragmenten van mijn opa, oma, mijn moeder en mij. Zo is Tobor niet alleen technisch, maar ook relationeel een verbindend element.",
    "Hij kan dansen dankzij datzelfde hoverboard, emoties tonen op de LED-panelen in zijn wangen (blij, verdrietig, hypnose-patronen en meer) en met het publiek in dialoog gaan. De vraag die onder alles ligt: wat gebeurt er wanneer een machine emotionele ruimte inneemt die mensen moeilijk kunnen dragen? Kan hij een brug slaan waar menselijke communicatie stokt? Tobor is uiteindelijk een verhaal over of we elkaar werkelijk kunnen bereiken, en wat er gebeurt wanneer een machine ons daarbij helpt of confronteert.",
  ],
  en: [
    "Tobor can speak and listen. Speech recognition and AI let him respond to what you say and hold a conversation; text-to-speech gives him a voice. In that way he takes on the role of a patient, attentive family member. In the film and during the robot evenings he acts as a mirror of our family dynamics: love that was expressed through making now finds a voice in him.",
    "During sessions he can guide meditation and guided hypnosis. Under the hood he runs on a hacked hoverboard — the wheels drive him forward, backward and in circles, in sync with the session. LEDs in his eyes, mouth and nose plus a siren provide light and sound at set moments; he speaks in different voices (TTS and voice cloning), fed with questionnaires and diary fragments from my grandfather, grandmother, my mother and me. So Tobor is not only technically but also relationally a connecting element.",
    "He can dance thanks to that same hoverboard, show emotions on the LED panels in his cheeks (happy, sad, hypnosis patterns and more) and engage in dialogue with the audience. The question underneath it all: what happens when a machine takes up emotional space that people find hard to carry? Can he build a bridge where human communication stalls? In the end Tobor is a story about whether we can truly reach each other, and what happens when a machine helps or confronts us in that.",
  ],
};

/** Zone-id's voor de klikbare lichaamsdelen. */
export type ToborZoneId =
  | "nek"
  | "hoofd"
  | "sirene"
  | "romp"
  | "benen"
  | "hoverboard";

/** Per zone: foto + onderschrift + beschrijving (nl/en). */
export const toborZoneContent: Record<
  ToborZoneId,
  { image: string; captionNl: string; captionEn: string; nl: string; en: string }
> = {
  nek: {
    image: "/tobor/onderdelen/nek.png",
    captionNl: "Nek",
    captionEn: "Neck",
    nl: "De nek is een fruitmand. De mand was kapot gegaan, dus moesten we hem weer aan elkaar knopen. Er zit een PS Eye in die Tobor laat zien en horen. De camera vormt samen met de microfoon de zintuigen voor spraakherkenning en beeld.",
    en: "The neck is a fruit basket. The basket had broken, so we had to tie it back together. It contains a PS Eye that lets Tobor see and hear. The camera works with the microphone as the senses for speech recognition and vision.",
  },
  hoofd: {
    image: "/tobor/onderdelen/hoofd.png",
    captionNl: "Hoofd",
    captionEn: "Head",
    nl: "In het hoofd zitten de Raspberry Pi (het brein), meerdere batterijen en de LEDs in ogen, mond en neus. Op de wangen zitten de LED-matrixschermpjes die emoties en patronen tonen (blij, verdrietig, hypnose-spiralen). Het hoofd is gemaakt van een haardroger. Vroeger kon hij bij het hoofd geluid opnemen en terugspelen met robotstem; nu is hij echt slim met de Raspberry Pi: spraakherkenning, AI-gesprekken en aansturing. Hier wordt gesproken en geluisterd.",
    en: "The head contains the Raspberry Pi (the brain), multiple batteries and the LEDs in the eyes, mouth and nose. The LED matrix screens on the cheeks show emotions and patterns (happy, sad, hypnosis spirals). The head is made from a hairdryer. It used to record and play back sound with a robot voice; now it's truly smart with the Raspberry Pi: speech recognition, AI conversation and control. This is where speaking and listening happen.",
  },
  sirene: {
    image: "/tobor/onderdelen/sirene.png",
    captionNl: "Sirene",
    captionEn: "Siren",
    nl: "Een oude sirene van veertig jaar oud. We hebben de lamp vervangen voor een nieuwe. De sirene geeft licht en geluid tijdens geleide hypnose en op vaste momenten in sessies. Met de sirene kan Tobor mensen waarschuwen en aangeven als hij boos wordt.",
    en: "An old siren, forty years old. We replaced the lamp with a new one. The siren provides light and sound during guided hypnosis and at set moments in sessions. With the siren Tobor can warn people and show when he gets angry.",
  },
  romp: {
    image: "/tobor/onderdelen/romp.png",
    captionNl: "Romp",
    captionEn: "Torso",
    nl: "De romp is een rubberen wasmand. De armen bestaan uit ventilatiepijp. Hier zitten een speaker en een lamp in. Samen met de romp vormen ze het expressieve deel; Tobor kan hiermee emoties tonen en tijdens sessies reageren.",
    en: "The torso is a rubber wash basin. The arms are made of ventilation pipe. It holds a speaker and a lamp. Together with the torso they form the expressive part; Tobor can show emotions and respond during sessions.",
  },
  benen: {
    image: "/tobor/onderdelen/benen.png",
    captionNl: "Benen",
    captionEn: "Legs",
    nl: "De benen zijn een vuilnisbak. Hier zit een enorme accu in die verbonden is met het hoverboard. De accu's zorgen voor uren gebruik, ook tijdens lange sessies.",
    en: "The legs are a trash can. It holds a large battery connected to the hoverboard. The batteries allow hours of use, including during long sessions.",
  },
  hoverboard: {
    image: "/tobor/onderdelen/hoverboard.png",
    captionNl: "Hoverboard",
    captionEn: "Hoverboard",
    nl: "De voeten zijn het hoverboard, ondersteund door twee extra wieltjes. We hebben het hoverboard uit elkaar gehaald, eraan gesleuteld en het beveiligde systeem gehackt: een lang proces om signalen en beveiliging te omzeilen zodat Tobor zélf de controle kreeg. We stuurden het aan met extra controllers (o.a. een 8BitDo-controller als handbediening) zodat we tijdens avonden kunnen ingrijpen, testen en finetunen. Hiermee kan hij vooruit, achteruit en in rondjes bewegen, meebewegen tijdens sessies en dansen.",
    en: "The feet are the hoverboard, supported by two extra wheels. We took the hoverboard apart, tinkered with it, and hacked its secured system: a long process of bypassing signals and security so Tobor could take control. We added extra controllers (including an 8BitDo controller as a manual remote) so we can intervene, test, and fine-tune during public evenings. With it he can move forward, backward and in circles, move during sessions and dance.",
  },
};
