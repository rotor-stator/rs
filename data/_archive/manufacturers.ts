export interface ModelConfig {
  id: string;
  name: string;
}

export interface SeriesConfig {
  id: string;
  name: string;
  models: ModelConfig[];
}

export interface ManufacturerConfig {
  id: string;
  name: string;
  series: SeriesConfig[];
}

const manufacturers: ManufacturerConfig[] = [
  {
    id: "netzsch-nemo",
    name: "Netzsch Nemo",
    series: [
      {
        id: "by",
        name: "BY Series",
        models: [
          { id: "nm-015", name: "NM 015 BY" },
          { id: "nm-031", name: "NM 031 BY" },
          { id: "nm-045", name: "NM 045 BY" },
        ],
      },
      {
        id: "by-max",
        name: "BY Max Series",
        models: [
          { id: "nm-063", name: "NM 063 BY Max" },
          { id: "nm-076", name: "NM 076 BY Max" },
          { id: "nm-090", name: "NM 090 BY Max" },
        ],
      },
    ],
  },
  {
    id: "seepex",
    name: "Seepex",
    series: [
      {
        id: "bw",
        name: "BW Series",
        models: [
          { id: "bw-10-6l", name: "BW 10-6L" },
          { id: "bw-17-6l", name: "BW 17-6L" },
          { id: "bw-25-6l", name: "BW 25-6L" },
        ],
      },
      {
        id: "md",
        name: "MD Series",
        models: [
          { id: "md-012-12", name: "MD 012-12" },
          { id: "md-017-12", name: "MD 017-12" },
          { id: "md-024-12", name: "MD 024-12" },
        ],
      },
    ],
  },
  {
    id: "mono",
    name: "Mono Pumps",
    series: [
      {
        id: "compact",
        name: "Compact Series",
        models: [
          { id: "c-cd020", name: "CD020" },
          { id: "c-cd025", name: "CD025" },
          { id: "c-cd032", name: "CD032" },
        ],
      },
      {
        id: "e-range",
        name: "E Range",
        models: [
          { id: "e-e040", name: "E040" },
          { id: "e-e050", name: "E050" },
        ],
      },
    ],
  },
];

export default manufacturers;
