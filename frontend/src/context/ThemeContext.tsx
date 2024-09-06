import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import { PaletteMode, TypeBackground } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useTheme as useMUITheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { selectTheme, setTheme } from "~/store/settingsSlice";

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

const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: "light",
});

export const useColorMode = () => useContext(ColorModeContext);

export const useTheme = useMUITheme;

const ProvideTheme: FC<{ children?: ReactNode }> = ({ children }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const localStorageTheme = useSelector(selectTheme);
  const dispatch = useDispatch();

  const initialColorMode: PaletteMode = localStorageTheme
    ? localStorageTheme
    : prefersDarkMode
      ? "dark"
      : "light";

  const [mode, setMode] = useState(initialColorMode);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        const newTheme = mode === "light" ? "dark" : "light";
        setMode(newTheme);
        dispatch(setTheme(newTheme));
      },
      mode,
    }),
    [dispatch, mode],
  );

  const theme = useMemo(() => {
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
};

export default ProvideTheme;
