export interface ManufacturerConfig {
  id: string;
  name: string;
  models: ModelConfig[];
}

export interface ModelConfig {
  id: string;
  name: string;
}

const manufacturers: ManufacturerConfig[] = [
  {
    id: "netzsch-nemo",
    name: "Netzsch Nemo",
    models: [
      { id: "nm-015", name: "NM 015" },
      { id: "nm-031", name: "NM 031" },
      { id: "nm-045", name: "NM 045" },
      { id: "nm-063", name: "NM 063" },
      { id: "nm-076", name: "NM 076" },
    ],
  },
  {
    id: "seepex",
    name: "Seepex",
    models: [
      { id: "bw-10-6l", name: "BW 10-6L" },
      { id: "bw-17-6l", name: "BW 17-6L" },
      { id: "bw-25-6l", name: "BW 25-6L" },
      { id: "md-012-12", name: "MD 012-12" },
      { id: "md-017-12", name: "MD 017-12" },
    ],
  },
];

export default manufacturers;
