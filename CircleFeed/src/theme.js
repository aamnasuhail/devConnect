import { createMuiTheme } from "@material-ui/core/styles";
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#6366f1",
      light: "#8285f4",
    },
    tertiary: {
      main: "grey",
    },
    common: {
      blackish: "#010210",
      whitish: "#f9f9f9",
      lightWhite: "#c2b6b626",
    },
  },
});

export default theme;
