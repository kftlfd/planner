import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getDaysInMonth,
  addMonths,
  addDays,
  startOfMonth,
  lastDayOfMonth,
} from "date-fns";

import { selectAllTasks } from "../../store/tasksSlice";

import { Container, Card, Box, Typography, IconButton } from "@mui/material";
import WestIcon from "@mui/icons-material/West";

export function TasksCalendarView(props) {
  const { projectId } = useParams();
  const allTasks = useSelector(selectAllTasks);
  const tasks = Object.keys(allTasks)
    .filter((taskId) => allTasks[taskId].project === Number(projectId))
    .map((taskId) => allTasks[taskId]);

  const tasksByDate = {};
  tasks.forEach((task) => {
    const d = new Date(task.modified).toLocaleString(...format);
    if (!tasksByDate[d]) tasksByDate[d] = [];
    tasksByDate[d].push(task);
  });

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

  const format = [{}, { dateStyle: "short" }];

  return (
    <>
      <Container maxWidth="lg">
        <Box
          sx={{
            marginBlock: "1rem",
            display: "flex",
            gap: "2rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton onClick={() => goToPrevMonth()}>
            <WestIcon />
          </IconButton>
          <Typography variant="h6" align="center" sx={{ flexBasis: "15rem" }}>
            {state.selectedDate.toLocaleString(
              {},
              { month: "long", year: "numeric" }
            )}
          </Typography>
          <IconButton onClick={() => goToNextMonth()}>
            <WestIcon sx={{ transform: "rotate(180deg)" }} />
          </IconButton>
        </Box>
        <Card>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, auto)",
            }}
          >
            {/* Weekdays */}
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <Box
                key={"weekday" + day}
                sx={{
                  paddingBlock: "0.5rem",
                  textAlign: "center",
                  borderBottom: "1px solid gray",
                  "&:not(:nth-child(7n))": { borderRight: "1px solid gray" },
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
                    <div key={`${day.toISOString()}`}>
                      {day.toLocaleString(...format)}
                    </div>
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

                return (
                  <div key={`${day.toISOString()}`}>
                    {day.toLocaleString(...format)}
                  </div>
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
                  <div key={`${day.toISOString()}`}>
                    {day.toLocaleString(...format)}
                  </div>
                );
              });
            })()}
          </Box>
        </Card>
      </Container>

      <Container maxWidth="md">
        <h3>Selected day</h3>
      </Container>

      <pre>{JSON.stringify(state, null, 4)}</pre>
      <pre>{JSON.stringify(tasks, null, 4)}</pre>
    </>
  );
}
