import React from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const ColorModeContext = React.createContext();

export function useColorMode() {
  return React.useContext(ColorModeContext);
}

export default function ProvideTheme({ children }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const localStorageTheme = window.localStorage.getItem("theme");

  const initialColorMode = localStorageTheme
    ? localStorageTheme
    : prefersDarkMode
    ? "dark"
    : "light";

  const [mode, setMode] = React.useState(initialColorMode);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
        window.localStorage.setItem(
          "theme",
          mode === "light" ? "dark" : "light"
        );
      },
      mode: mode,
    }),
    [mode]
  );

  const theme = React.useMemo(() => {
    const defaultTheme = createTheme({
      palette: { mode },
    });

    return createTheme({
      palette: {
        mode,
        background: {
          light: "aliceblue",
        },
        chat: {
          bg: mode === "light" ? "aliceblue" : "rgba(0,0,0,0.6)",
          msg: mode === "light" ? "white" : defaultTheme.palette.action.hover,
        },
      },
    });
  }, [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}
