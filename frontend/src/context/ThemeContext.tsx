import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { selectTheme, setTheme } from "../store/settingsSlice";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PaletteMode, TypeBackground } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    chat: {
      bg: string;
      msg: string;
    };
  }

  interface PaletteOptions {
    chat?: {
      bg: string;
      msg: string;
    };
  }
}

const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
  mode: "light",
});

export function useColorMode() {
  return React.useContext(ColorModeContext);
}

export default function ProvideTheme({
  children,
}: {
  children?: React.ReactNode;
}) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const localStorageTheme = useSelector(selectTheme);
  const dispatch = useDispatch();

  const initialColorMode: PaletteMode = localStorageTheme
    ? localStorageTheme
    : prefersDarkMode
      ? "dark"
      : "light";

  const [mode, setMode] = React.useState(initialColorMode);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        const newTheme = mode === "light" ? "dark" : "light";
        setMode(newTheme);
        dispatch(setTheme(newTheme));
      },
      mode: mode,
    }),
    [mode],
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
        } as Partial<TypeBackground>,
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
