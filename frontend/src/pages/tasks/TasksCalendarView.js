import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getDaysInMonth,
  addMonths,
  addDays,
  startOfMonth,
  lastDayOfMonth,
  isSameDay,
  isBefore,
} from "date-fns";

import { selectSelectedCalDate } from "../../store/projectsSlice";
import { selectAllTasks } from "../../store/tasksSlice";
import { useActions } from "../../context/ActionsContext";
import { TaskCard, CardSkeleton } from "./TaskCard";
import { CreateTaskWithDate } from "./TaskCreateForm";

import {
  Container,
  Card,
  Box,
  Typography,
  IconButton,
  Skeleton,
} from "@mui/material";
import WestIcon from "@mui/icons-material/West";
import TodayIcon from "@mui/icons-material/Today";

const format = [{}, { dateStyle: "short" }];

const weekend = { backgroundColor: "action.hover" };
const weekendColor = {
  "&:nth-of-type(7n - 1)": weekend,
  "&:nth-of-type(7n)": weekend,
};

export function TasksCalendarView(props) {
  const { setSelectedTask, taskDetailsToggle, tasksLoaded } = props;
  const actions = useActions();
  const { projectId } = useParams();
  const selectedDate =
    useSelector(selectSelectedCalDate(projectId)) || new Date();
  const allTasks = useSelector(selectAllTasks);
  const tasks = Object.keys(allTasks)
    .filter((taskId) => allTasks[taskId].project === Number(projectId))
    .map((taskId) => allTasks[taskId]);

  const tasksByDate = {};
  tasks.forEach((task) => {
    if (!task.due) return;
    const d = new Date(task.due).toLocaleString(...format);
    if (!tasksByDate[d]) tasksByDate[d] = [];
    tasksByDate[d].push(task);
  });
  Object.keys(tasksByDate).forEach((d) =>
    tasksByDate[d].sort((a, b) => a.due > b.due)
  );

  function goToPrevMonth() {
    let newSelect = addMonths(selectedDate, -1);
    actions.project.selectCalDate(projectId, newSelect);
  }

  function goToNextMonth() {
    let newSelect = addMonths(selectedDate, 1);
    actions.project.selectCalDate(projectId, newSelect);
  }

  function goToToday() {
    actions.project.selectCalDate(projectId, new Date());
  }

  function selectDate(day) {
    actions.project.selectCalDate(projectId, day);
  }

  function MonthDays(props) {
    const { firstDay, nDays, isPrevMonth, isCurrMonth } = props;

    let days = [...Array(nDays).keys()].map((i) => {
      let day = addDays(firstDay, isPrevMonth ? -i : i);
      let tasks = tasksByDate[day.toLocaleString(...format)] || [];
      let doneCount = tasks.filter((task) => task.done === true).length;
      let notDoneCount = tasks.length - doneCount;
      return (
        <Day
          key={`${day.toISOString()}`}
          day={day}
          isSelected={isSameDay(day, selectedDate)}
          onClick={() => selectDate(day)}
          notCurrentMonth={!isCurrMonth}
          doneCount={doneCount}
          notDoneCount={notDoneCount}
          tasksLoaded={tasksLoaded}
        />
      );
    });

    if (isPrevMonth) {
      return days.reverse();
    } else {
      return days;
    }
  }

  return (
    <>
      <Container maxWidth="md">
        <Box
          sx={{
            marginBlock: "1rem",
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ flexBasis: "40px", flexShrink: 10 }} />

          <IconButton onClick={() => goToPrevMonth()}>
            <WestIcon />
          </IconButton>

          <Typography
            variant="h6"
            align="center"
            sx={{ flexBasis: "15rem", color: "text.primary" }}
          >
            {selectedDate.toLocaleString(
              {},
              { month: "long", year: "numeric" }
            )}
          </Typography>

          <IconButton onClick={() => goToNextMonth()}>
            <WestIcon sx={{ transform: "rotate(180deg)" }} />
          </IconButton>

          <IconButton onClick={goToToday}>
            <TodayIcon />
          </IconButton>
        </Box>

        <Card>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
            }}
          >
            {/* Weekdays */}
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <Box
                key={"weekday" + day}
                sx={{
                  paddingBlock: "0.8rem",
                  textAlign: "center",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  ...weekendColor,
                }}
              >
                {day}
              </Box>
            ))}

            {/* Previous Month */}
            {(() => {
              let firstDayOfCurrMonth = startOfMonth(selectedDate);
              return (
                <MonthDays
                  firstDay={addDays(firstDayOfCurrMonth, -1)}
                  nDays={(firstDayOfCurrMonth.getDay() + 6) % 7}
                  isPrevMonth={true}
                  isCurrMonth={false}
                />
              );
            })()}

            {/* This Month */}
            {(() => {
              let firstDayOfCurrMonth = startOfMonth(selectedDate);
              return (
                <MonthDays
                  firstDay={firstDayOfCurrMonth}
                  nDays={getDaysInMonth(firstDayOfCurrMonth)}
                  isPrevMonth={false}
                  isCurrMonth={true}
                />
              );
            })()}

            {/* Next Month */}
            {(() => {
              let lastDayOfCurrMonth = lastDayOfMonth(selectedDate);
              return (
                <MonthDays
                  firstDay={addDays(lastDayOfCurrMonth, 1)}
                  nDays={(7 - lastDayOfCurrMonth.getDay()) % 7}
                  isPrevMonth={false}
                  isCurrMonth={false}
                />
              );
            })()}
          </Box>
        </Card>
      </Container>

      <Container
        maxWidth="md"
        sx={{ marginTop: "1.5rem", marginBottom: "3rem" }}
      >
        {tasksLoaded ? (
          <>
            {(() => {
              let tasks =
                tasksByDate[selectedDate.toLocaleString(...format)] || [];

              return tasks.map((task) => (
                <TaskCard
                  key={"caltask" + task.id}
                  taskId={task.id}
                  openDetails={() => {
                    setSelectedTask(task.id);
                    taskDetailsToggle();
                  }}
                />
              ));
            })()}

            <CreateTaskWithDate projectId={projectId} due={selectedDate} />
          </>
        ) : (
          <CardSkeleton />
        )}
      </Container>
    </>
  );
}

const tasksCountStyle = {
  fontSize: "0.7rem",
  height: "100%",
  aspectRatio: "1/1",
  display: "grid",
  placeContent: "center",
  borderRadius: "50%",
  backgroundColor: "primary.light",
  color: "primary.contrastText",
};

function Day(props) {
  const {
    day,
    notCurrentMonth,
    isSelected,
    onClick,
    doneCount,
    notDoneCount,
    tasksLoaded,
  } = props;

  const today = new Date().setHours(0, 0, 0, 0);

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: "pointer",
        ...(!isSelected && weekendColor),
        ...(isSelected && {
          backgroundColor: "primary.main",
          color: "primary.contrastText",
        }),
      }}
    >
      <Box
        sx={{
          paddingBlock: "0.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          "&:hover": { backgroundColor: "action.focus" },
          ...(notCurrentMonth && { opacity: "0.4" }),
        }}
      >
        {day.getDate()}
        {tasksLoaded ? (
          <Box
            sx={{
              alignSelf: "stretch",
              height: "1.25rem",
              display: "flex",
              justifyContent: "center",
              paddingInline: "3px",
            }}
          >
            {doneCount > 0 && (
              <Box
                sx={{
                  ...tasksCountStyle,
                  backgroundColor: "action.disabledBackground",
                }}
              >
                {doneCount}
              </Box>
            )}
            {doneCount > 0 && notDoneCount > 0 && (
              <Box
                sx={{
                  flexBasis: "0.5rem",
                  flexShrink: 1,
                }}
              />
            )}
            {notDoneCount > 0 && (
              <Box
                sx={{
                  ...tasksCountStyle,
                  ...(isBefore(day, today) && {
                    backgroundColor: "error.main",
                    color: "error.contrastText",
                  }),
                }}
              >
                {notDoneCount}
              </Box>
            )}
          </Box>
        ) : (
          <Skeleton height={"1.25rem"} width={"50%"} />
        )}
      </Box>
    </Box>
  );
}
