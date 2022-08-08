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
} from "date-fns";

import { selectAllTasks } from "../../store/tasksSlice";
import { TaskCard } from "./TaskCard";

import { Container, Card, Box, Typography, IconButton } from "@mui/material";
import WestIcon from "@mui/icons-material/West";
import TodayIcon from "@mui/icons-material/Today";

const format = [{}, { dateStyle: "short" }];

const weekend = { backgroundColor: "action.hover" };
const weekendColor = {
  "&:nth-of-type(7n - 1)": weekend,
  "&:nth-of-type(7n)": weekend,
};

export function TasksCalendarView(props) {
  const { setSelectedTask, taskDetailsToggle } = props;
  const { projectId } = useParams();
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

  const [state, setState] = React.useState({
    today: new Date(),
    selectedDate: new Date(),
    tasksByDate,
  });

  function goToPrevMonth() {
    let newSelect = addMonths(state.selectedDate, -1);
    setState((prev) => ({ ...prev, selectedDate: newSelect }));
  }

  function goToNextMonth() {
    let newSelect = addMonths(state.selectedDate, 1);
    setState((prev) => ({ ...prev, selectedDate: newSelect }));
  }

  function goToToday() {
    setState((prev) => ({ ...prev, selectedDate: prev.today }));
  }

  function selectDate(day) {
    setState((prev) => ({ ...prev, selectedDate: day }));
  }

  return (
    <>
      <Container maxWidth="lg">
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
            {state.selectedDate.toLocaleString(
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
              let thisStart = startOfMonth(state.selectedDate);
              let lastDay = addDays(thisStart, -1);
              let days = (thisStart.getDay() + 6) % 7;

              return [...Array(days).keys()]
                .map((i) => {
                  let day = addDays(lastDay, -i);

                  return (
                    <Day
                      key={`${day.toISOString()}`}
                      day={day}
                      notCurrentMonth={true}
                      onClick={() => selectDate(day)}
                    />
                  );
                })
                .reverse();
            })()}

            {/* This Month */}
            {(() => {
              let firstDay = startOfMonth(state.selectedDate);
              let days = getDaysInMonth(firstDay);

              return [...Array(days).keys()].map((i) => {
                let day = addDays(firstDay, i);
                let tasks = tasksByDate[day.toLocaleString(...format)] || [];
                let doneCount = tasks.filter(
                  (task) => task.done === true
                ).length;
                let notDoneCount = tasks.length - doneCount;

                return (
                  <Day
                    key={`${day.toISOString()}`}
                    day={day}
                    isSelected={isSameDay(day, state.selectedDate)}
                    onClick={() => selectDate(day)}
                    doneCount={doneCount}
                    notDoneCount={notDoneCount}
                  />
                );
              });
            })()}

            {/* Next Month */}
            {(() => {
              let lastDay = lastDayOfMonth(state.selectedDate);
              let days = 7 - lastDay.getDay();

              return [...Array(days).keys()].map((i) => {
                let day = addDays(lastDay, 1 + i);

                return (
                  <Day
                    key={`${day.toISOString()}`}
                    day={day}
                    notCurrentMonth={true}
                    onClick={() => selectDate(day)}
                  />
                );
              });
            })()}
          </Box>
        </Card>
      </Container>

      <Container
        maxWidth="md"
        sx={{ marginTop: "1.5rem", marginBottom: "3rem" }}
      >
        {(() => {
          let tasks =
            tasksByDate[state.selectedDate.toLocaleString(...format)] || [];

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
  const { day, notCurrentMonth, isSelected, onClick, doneCount, notDoneCount } =
    props;

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
        <Box sx={{ height: "1.25rem", display: "flex", gap: "0.5rem" }}>
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
          {notDoneCount > 0 && (
            <Box
              sx={{
                ...tasksCountStyle,
              }}
            >
              {notDoneCount}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
