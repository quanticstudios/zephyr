import type {
  Bus,
  Device,
  Group,
  MasterChannel,
  Project,
  Track,
} from "./types";

/* The "Midnight" demo session — mirrors the Aria design fixtures verbatim:
   F min, 140 BPM, 4/4, section "Chorus", engine libardour (48 kHz / 24-bit). */

let uid = 0;
const id = (p: string) => `${p}-${uid++}`;

function leadVocalDevices(): Device[] {
  return [
    {
      id: id("dev"),
      name: "Channel EQ",
      kind: "eq",
      preset: "Custom",
      enabled: true,
      aiEdited: true,
      graph: "eq",
      params: [
        { id: id("p"), label: "Lo", value: 0.42, display: "−2.8 dB", aiEdited: true },
        { id: id("p"), label: "Mid", value: 0.55, display: "+1.2 dB" },
        { id: id("p"), label: "Hi", value: 0.6, display: "+2.0 dB" },
      ],
    },
    {
      id: id("dev"),
      name: "Compressor",
      kind: "dynamics",
      preset: "Custom",
      enabled: true,
      aiEdited: true,
      graph: "comp",
      params: [
        { id: id("p"), label: "Thr", value: 0.38, display: "−21 dB", aiEdited: true },
        { id: id("p"), label: "Ratio", value: 0.5, display: "4:1" },
        { id: id("p"), label: "Gain", value: 0.55, display: "+3 dB" },
      ],
    },
    {
      id: id("dev"),
      name: "DeEsser",
      kind: "dynamics",
      preset: "Vocal",
      enabled: true,
      params: [
        { id: id("p"), label: "Freq", value: 0.7, display: "7.2 kHz" },
        { id: id("p"), label: "Range", value: 0.4, display: "−4 dB" },
        { id: id("p"), label: "Gain", value: 0.5, display: "0 dB" },
      ],
    },
    {
      id: id("dev"),
      name: "ChromaGlow",
      kind: "saturation",
      preset: "Custom",
      enabled: true,
      params: [
        { id: id("p"), label: "Drive", value: 0.45, display: "32%" },
        { id: id("p"), label: "Mix", value: 0.3, display: "28%" },
      ],
    },
    {
      id: id("dev"),
      name: "Pitch",
      kind: "fx",
      preset: "Subtle",
      enabled: true,
      params: [
        { id: id("p"), label: "Cor", value: 0.5, display: "50%" },
        { id: id("p"), label: "Mix", value: 0.6, display: "60%" },
      ],
    },
  ];
}

function ins(name: string, ai = false) {
  return { id: id("ins"), name, enabled: true, aiEdited: ai };
}
function snd(name: string, amount: number, ai = false) {
  return { id: id("snd"), name, amount, aiEdited: ai };
}

function makeTrack(t: Partial<Track> & Pick<Track, "name" | "short" | "color" | "kind">): Track {
  return {
    id: id("trk"),
    muted: false,
    soloed: false,
    recordArmed: false,
    volumeDb: -3,
    pan: 0,
    inserts: [],
    sends: [],
    devices: [],
    clips: [],
    meterL: 0.4,
    meterR: 0.4,
    ...t,
  };
}

const drums = makeTrack({
  name: "Drums",
  short: "Dr",
  color: "drums",
  kind: "audio",
  busId: "bus-drum",
  volumeDb: -1.5,
  inserts: [ins("Transient"), ins("EQ Comp")],
  sends: [snd("Drum Verb", 8)],
  meterL: 0.72,
  meterR: 0.7,
  clips: [
    { id: id("clip"), type: "audio", name: "Drums", startBar: 9, lengthBars: 8, color: "drums", seed: 7 },
    { id: id("clip"), type: "audio", name: "Drums", startBar: 17, lengthBars: 6, color: "drums", seed: 11 },
  ],
});

const bass = makeTrack({
  name: "808 Bass",
  short: "808",
  color: "bass",
  kind: "instrument",
  busId: "bus-drum",
  volumeDb: -2.0,
  inserts: [ins("Sub EQ"), ins("Saturn")],
  sends: [snd("Drum Verb", 12)],
  meterL: 0.62,
  meterR: 0.6,
  clips: [
    { id: id("clip"), type: "audio", name: "808 Bass", startBar: 9, lengthBars: 8, color: "bass", seed: 3 },
    { id: id("clip"), type: "audio", name: "808 Bass", startBar: 17, lengthBars: 6, color: "bass", seed: 5 },
  ],
});

const leadVocal = makeTrack({
  name: "Lead Vocal",
  short: "LV",
  color: "vocal",
  kind: "audio",
  busId: "bus-vocal",
  volumeDb: -2.8,
  pan: 0,
  aiEdited: true,
  inserts: [ins("Channel EQ", true), ins("Compressor", true)],
  sends: [snd("Plate", 30, true), snd("Slap", 18)],
  devices: leadVocalDevices(),
  meterL: 0.66,
  meterR: 0.64,
  clips: [
    { id: id("clip"), type: "audio", name: "Lead Vocal", startBar: 9, lengthBars: 4, color: "vocal", seed: 21 },
    { id: id("clip"), type: "audio", name: "Lead Vocal", startBar: 13, lengthBars: 4, color: "vocal", seed: 22 },
    { id: id("clip"), type: "audio", name: "Lead Vocal", startBar: 17, lengthBars: 6, color: "vocal", seed: 23, selected: true },
  ],
});

const vocalDbl = makeTrack({
  name: "Vocal Dbl",
  short: "VD",
  color: "vocaldbl",
  kind: "audio",
  busId: "bus-vocal",
  volumeDb: -6.0,
  pan: 0.28,
  inserts: [ins("Doubler"), ins("Plate Rev")],
  sends: [snd("Plate", 22), snd("Slap", 10)],
  meterL: 0.48,
  meterR: 0.5,
  clips: [
    { id: id("clip"), type: "audio", name: "Vocal Dbl", startBar: 9, lengthBars: 8, color: "vocaldbl", seed: 31 },
    { id: id("clip"), type: "audio", name: "Vocal Dbl", startBar: 17, lengthBars: 6, color: "vocaldbl", seed: 33 },
  ],
});

const piano = makeTrack({
  name: "Piano",
  short: "Pn",
  color: "piano",
  kind: "midi",
  busId: "bus-music",
  volumeDb: -4.5,
  inserts: [ins("EQ"), ins("Comp")],
  sends: [snd("Hall", 25)],
  meterL: 0.44,
  meterR: 0.46,
  clips: [
    {
      id: id("clip"),
      type: "midi",
      name: "Piano",
      startBar: 9,
      lengthBars: 8,
      color: "piano",
      notes: Array.from({ length: 24 }, (_, i) => ({
        bar: i % 8,
        beat: (i * 1.5) % 4,
        pitch: 48 + ((i * 5) % 14),
        length: 0.75,
      })),
    },
  ],
});

const pads = makeTrack({
  name: "Pads",
  short: "Pd",
  color: "pads",
  kind: "instrument",
  busId: "bus-music",
  volumeDb: -8.0,
  inserts: [ins("EQ"), ins("Chorus")],
  sends: [snd("Hall", 52)],
  meterL: 0.3,
  meterR: 0.32,
  clips: [
    {
      id: id("clip"),
      type: "midi",
      name: "Pads",
      startBar: 9,
      lengthBars: 14,
      color: "pads",
      notes: Array.from({ length: 10 }, (_, i) => ({
        bar: i * 1.4,
        beat: 0,
        pitch: 52 + ((i * 3) % 10),
        length: 3.5,
      })),
    },
  ],
});

const guitars = makeTrack({
  name: "Guitars",
  short: "Gt",
  color: "guitars",
  kind: "audio",
  busId: "bus-music",
  volumeDb: -3.0,
  aiEdited: true,
  inserts: [ins("Amp Sim"), ins("Channel EQ")],
  sends: [snd("Plate", 22)],
  meterL: 0.5,
  meterR: 0.52,
  clips: [
    { id: id("clip"), type: "audio", name: "Guitars", startBar: 17, lengthBars: 6, color: "guitars", seed: 41, selected: false },
  ],
});

const fx = makeTrack({
  name: "FX",
  short: "FX",
  color: "fx",
  kind: "audio",
  busId: "bus-fx",
  volumeDb: -12.0,
  inserts: [ins("Filter"), ins("Reverb")],
  sends: [],
  meterL: 0.2,
  meterR: 0.22,
  clips: [
    { id: id("clip"), type: "audio", name: "Riser", startBar: 15, lengthBars: 2, color: "fx", seed: 51 },
  ],
});

const tracks = [drums, bass, leadVocal, vocalDbl, piano, pads, guitars, fx];

const buses: Bus[] = [
  {
    id: "bus-drum",
    name: "Drum Bus",
    color: "drums",
    routeLabel: "Drum Bus → Master",
    output: "Master",
    memberCount: 2,
    volumeDb: -3.8,
    pan: 0,
    inserts: [ins("Glue Comp"), ins("Tape")],
    sends: [snd("Drum Verb", 0)],
    meterL: 0.68,
    meterR: 0.66,
  },
  {
    id: "bus-vocal",
    name: "Vocal Bus",
    color: "vocal",
    routeLabel: "Vocal Bus → Master",
    output: "Master",
    memberCount: 2,
    volumeDb: -3.0,
    pan: 0,
    aiEdited: true,
    inserts: [ins("Bus Comp"), ins("Plate Rev", true)],
    sends: [],
    meterL: 0.6,
    meterR: 0.58,
  },
  {
    id: "bus-music",
    name: "Music Bus",
    color: "piano",
    routeLabel: "Music Bus → Master",
    output: "Master",
    memberCount: 3,
    volumeDb: -4.0,
    pan: 0,
    inserts: [ins("Bus Comp"), ins("Channel EQ")],
    sends: [snd("Hall", 0)],
    meterL: 0.5,
    meterR: 0.5,
  },
  {
    id: "bus-fx",
    name: "FX Bus",
    color: "fx",
    routeLabel: "FX Bus → Master",
    output: "Master",
    memberCount: 1,
    volumeDb: -8.0,
    pan: 0,
    inserts: [ins("Bus Comp")],
    sends: [],
    meterL: 0.24,
    meterR: 0.24,
  },
];

const groups: Group[] = [
  { id: id("grp"), name: "Drums", color: "drums", busId: "bus-drum", trackIds: [drums.id, bass.id] },
  { id: id("grp"), name: "Vocals", color: "vocal", busId: "bus-vocal", trackIds: [leadVocal.id, vocalDbl.id] },
  { id: id("grp"), name: "Music", color: "piano", busId: "bus-music", trackIds: [piano.id, pads.id, guitars.id] },
  { id: id("grp"), name: "FX", color: "fx", busId: "bus-fx", trackIds: [fx.id] },
];

const master: MasterChannel = {
  name: "Master",
  lufsIntegrated: -9.4,
  truePeak: -1.0,
  gainReduction: -2.1,
  inserts: [ins("Master EQ"), ins("Pro-L 2 Limiter"), ins("Loudness")],
  volumeDb: 0,
  meterL: 0.74,
  meterR: 0.72,
};

export const project: Project = {
  name: "Midnight",
  section: "Chorus",
  key: "F min",
  bpm: 140,
  timeSig: "4/4",
  sampleRate: "48 kHz / 24-bit",
  engine: "libardour",
  totalBars: 14,
  startBar: 9,
  sections: [
    { id: id("sec"), name: "Verse", startBar: 9, lengthBars: 8 },
    { id: id("sec"), name: "Chorus", startBar: 17, lengthBars: 6, highlight: true },
  ],
  tracks,
  buses,
  groups,
  master,
  chat: [
    { id: id("msg"), role: "user", text: "Clean up the vocal chain but keep it natural." },
    {
      id: id("msg"),
      role: "assistant",
      text: "Balanced the lead and tightened the chorus without changing its character. Here's the diff — preview before you commit.",
    },
  ],
  diff: {
    title: "4 changes",
    section: "Chorus",
    changes: [
      { id: id("ch"), trackName: "Lead Vocal", color: "vocal", description: "Channel EQ · 250 Hz dip", delta: "−2.8 dB", direction: "down" },
      { id: id("ch"), trackName: "Lead Vocal", color: "vocal", description: "Compressor threshold", delta: "−18 → −21 dB", direction: "down" },
      { id: id("ch"), trackName: "Vocal Bus", color: "vocal", description: "Plate Reverb send", delta: "+8%", direction: "up" },
      { id: id("ch"), trackName: "Chorus Guitars", color: "guitars", description: "Stereo width", delta: "+12%", direction: "up" },
    ],
  },
  aiHistory: [
    { id: id("h"), text: "Cleaned up the vocal chain", time: "2m" },
    { id: id("h"), text: "Widened the chorus +15%", time: "9m" },
    { id: id("h"), text: "Drum bus glue compression", time: "21m" },
  ],
  browserInstruments: [
    { id: id("b"), name: "Analog Bass", tag: "Synth", color: "bass" },
    { id: id("b"), name: "Warm Pad", tag: "Synth", color: "pads" },
    { id: id("b"), name: "Grand Piano", tag: "Keys", color: "piano" },
    { id: id("b"), name: "Vocal Chain", tag: "FX", color: "vocal" },
  ],
};

export const suggestionChips = [
  "Make the chorus wider",
  "Glue the drum bus",
  "Humanize the hats",
];
