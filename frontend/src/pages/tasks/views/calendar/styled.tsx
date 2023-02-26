import { Box, Card, styled, Typography } from "@mui/material";

export const CalendarCard = styled(Card)({
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  marginBottom: "1.5rem",
});

export const CalendarNavigation = styled(Box)({
  marginBlock: "1rem",
  display: "flex",
  gap: "1rem",
  justifyContent: "center",
  alignItems: "center",
});

export const CalendarMonthTitle = styled(Typography)(({ theme }) => ({
  flexBasis: "15rem",
  color: theme.palette.text.primary,
}));

export const CalendarTile = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  "&:nth-of-type(7n - 1)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:nth-of-type(7n)": {
    backgroundColor: theme.palette.action.hover,
  },
  ...(isSelected && {
    "&&": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  }),
}));

export const CalendarHeadingTile = styled(CalendarTile)({
  paddingBlock: "0.8rem",
  textAlign: "center",
  fontSize: "1.1rem",
  fontWeight: "bold",
});

export const CalendarBodyTile = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isCurrMonth",
})<{ isCurrMonth?: boolean }>(({ theme, isCurrMonth }) => ({
  paddingBlock: "0.5rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.5rem",
  cursor: "pointer",
  "&:hover": { backgroundColor: theme.palette.action.focus },
  ...(!isCurrMonth && { opacity: "0.4" }),
}));

export const TaskCountIndicatorsContainer = styled(Box)({
  alignSelf: "stretch",
  height: "1.25rem",
  display: "flex",
  justifyContent: "center",
  paddingInline: "3px",
});

type CountIndicatorProps = { isDone?: boolean; isOverdue?: boolean };
const countIndicatorPropKeys: PropertyKey[] = ["isDone", "isOverdue"];
export const CountIndicator = styled(Box, {
  shouldForwardProp: (prop) => !countIndicatorPropKeys.includes(prop),
})<CountIndicatorProps>(({ theme, isDone, isOverdue }) => ({
  fontSize: "0.7rem",
  height: "100%",
  aspectRatio: "1/1",
  display: "grid",
  placeContent: "center",
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  ...(isDone && { backgroundColor: theme.palette.action.disabledBackground }),
  ...(isOverdue && {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  }),
}));

export const CountIndicatorsSpacer = styled(Box)({
  flexBasis: "0.5rem",
  flexShrink: 1,
});

export const DayTasks = styled(Box)({
  marginBottom: "3rem",
});
