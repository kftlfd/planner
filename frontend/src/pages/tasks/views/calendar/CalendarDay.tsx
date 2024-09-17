import { FC } from "react";
import { isBefore } from "date-fns";

import { Skeleton } from "@mui/material";

import {
  CalendarBodyTile,
  CalendarTile,
  CountIndicator,
  CountIndicatorsSpacer,
  TaskCountIndicatorsContainer,
} from "./styled";

export const CalendarDay: FC<{
  day: Date;
  notCurrentMonth: boolean;
  isSelected: boolean;
  onClick: () => void;
  doneCount: number;
  notDoneCount: number;
  tasksLoaded: boolean;
}> = ({
  day,
  notCurrentMonth,
  isSelected,
  onClick,
  doneCount,
  notDoneCount,
  tasksLoaded,
}) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const isOverdue = isBefore(day, today);
  const needSpacer = doneCount > 0 && notDoneCount > 0;

  return (
    <CalendarTile onClick={onClick} isSelected={isSelected}>
      <CalendarBodyTile isCurrMonth={!notCurrentMonth}>
        {day.getDate()}
        {tasksLoaded ? (
          <TaskCountIndicatorsContainer>
            {doneCount > 0 && (
              <CountIndicator isDone>{doneCount}</CountIndicator>
            )}
            {needSpacer && <CountIndicatorsSpacer />}
            {notDoneCount > 0 && (
              <CountIndicator isOverdue={isOverdue}>
                {notDoneCount}
              </CountIndicator>
            )}
          </TaskCountIndicatorsContainer>
        ) : (
          <Skeleton height={"1.25rem"} width={"50%"} />
        )}
      </CalendarBodyTile>
    </CalendarTile>
  );
};
