import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    rouletteRed: "#E6392F",
    tealTreat: "#009B9B",
    limeZest: "#B6CD00",
    hawkerOrange: "#F28C28",
    kopiBrown: "#4A2E29",
    soyMilk: "#FFF8F0",
  },
  fonts: {
    heading: "Poppins, sans-serif",
    body: "Inter, sans-serif",
    cta: "Poppins, sans-serif",
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
});

export default theme;
