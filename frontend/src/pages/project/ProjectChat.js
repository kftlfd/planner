import React from "react";

import { Sidebar, SidebarHeader, SidebarBody } from "../../layout/Sidebar";

import {
  Typography,
  IconButton,
  Box,
  AppBar,
  TextField,
  CircularProgress,
  Card,
  Avatar,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import Close from "@mui/icons-material/Close";

export function ProjectChat(props) {
  const [state, setState] = React.useState({
    chatOpen: false,
    messagesLoaded: false,
    messagesError: false,
    newMessage: "",
    loading: false,
    error: false,
  });
  const chatToggle = () =>
    setState((prev) => ({ ...prev, chatOpen: !prev.chatOpen }));
  const newMessageChange = (e) =>
    setState((prev) => ({ ...prev, newMessage: e.target.value }));

  // useSelector( projectMessges )
  const [projectMessages, setProjectMessages] = React.useState([]);

  const msgBox = React.useRef();
  function scrollToBottom() {
    msgBox.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }
  React.useEffect(scrollToBottom, [projectMessages]);

  React.useEffect(() => {
    if (state.chatOpen && !state.messagesLoaded) {
      // actual logic
      //
      // try {
      //   actions.loadMessages
      //   setState(messagesLoaded true)
      // } catch (error) {
      //   setState(messagesError true)
      // }

      //
      // Placeholder
      //
      setTimeout(() => {
        setProjectMessages(
          [...Array(16).keys()].map((index) => ({
            id: index,
            text: `Message ${index}`,
            user: "some rando",
            time: "previously",
          }))
        );
        setState((prev) => ({
          ...prev,
          messagesLoaded: true,
        }));
        setInterval(() => {
          setProjectMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              text: `New message ${prev.length + 1}`,
              user: "New user",
              time: "Recent",
            },
          ]);
        }, 10000);
      }, 2000);
    }
  }, [state.chatOpen, state.messagesLoaded]);

  const sendDisabled = state.messagesError
    ? true
    : !state.newMessage
    ? true
    : state.loading || state.error;

  async function sendMessage(e) {
    e.preventDefault();
    if (sendDisabled) return;

    // actual logic
    //
    // setState(loading true)
    // try {
    //   actions.sendMessage
    //   setState(loading false)
    // } catch (error) {
    //   setState(loading false, error true)
    //   setTimeout( setState(error false) )
    // }

    //
    // Placeholder
    //
    setState((prev) => ({
      ...prev,
      loading: true,
    }));

    setTimeout(() => {
      setProjectMessages((prev) => [
        ...prev,
        {
          id: projectMessages.length + 1,
          text: state.newMessage,
          user: "owner",
          time: "now",
        },
      ]);

      setState((prev) => ({
        ...prev,
        loading: false,
        newMessage: "",
      }));
    }, 1000);
  }

  return (
    <>
      <IconButton onClick={chatToggle}>
        <ChatIcon />
      </IconButton>

      <Sidebar open={state.chatOpen} toggle={chatToggle}>
        <SidebarHeader title={"Chat"} toggle={chatToggle} />

        <SidebarBody
          sx={{
            flexGrow: 1,
            padding: 0,
            overflow: "scroll",
            backgroundColor: "chat.bg",
          }}
        >
          {state.messagesError ? (
            <Typography
              variant="h5"
              component="div"
              align="center"
              sx={{ fontWeight: "light", paddingTop: "3rem" }}
            >
              Failed to load messages
            </Typography>
          ) : state.messagesLoaded ? (
            <Box ref={msgBox} sx={{ padding: "0 1.5rem 1rem" }}>
              {projectMessages.map((msg, index) => (
                <Message
                  key={msg.id}
                  message={msg}
                  samePrevUser={
                    projectMessages[index - 1] &&
                    projectMessages[index - 1].user ===
                      projectMessages[index].user
                  }
                  sameNextUser={
                    projectMessages[index + 1] &&
                    projectMessages[index + 1].user ===
                      projectMessages[index].user
                  }
                />
              ))}
            </Box>
          ) : (
            <Box sx={{ paddingTop: "3rem", textAlign: "center" }}>
              <CircularProgress />
            </Box>
          )}
        </SidebarBody>

        <AppBar
          color="background"
          sx={{
            position: "relative",
            padding: "0.5rem 1.5rem",
            transform: "rotate(180deg)",
          }}
        >
          <form
            onSubmit={sendMessage}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transform: "rotate(180deg)",
            }}
          >
            <TextField
              value={state.newMessage}
              onChange={newMessageChange}
              size="small"
              placeholder="Write a message"
              InputProps={{
                sx: { borderRadius: "2rem", backgroundColor: "action.hover" },
              }}
              fullWidth
            />
            <IconButton type="submit" disabled={sendDisabled}>
              {state.loading ? (
                <CircularProgress size={"100%"} />
              ) : state.error ? (
                <Close color="error" />
              ) : (
                <SendIcon />
              )}
            </IconButton>
          </form>
        </AppBar>
      </Sidebar>
    </>
  );
}

function Message(props) {
  const { message, samePrevUser, sameNextUser } = props;
  const user = message.user;

  // useSelector( userById(user) )
  // useSelector( currentUser )

  const self = user === "owner";

  function parseTime(s) {
    // t = new Date(s)
    // t.date, t.month, t.hour, t.minute
    return s;
  }

  return (
    <Box
      sx={{
        marginTop: samePrevUser ? "0.2rem" : "1rem",
        display: "flex",
        justifyContent: self ? "end" : "start",
      }}
    >
      <Box
        sx={{
          display: "flex",
          maxWidth: "80%",
          gap: "0.5rem",
          ...(self && {
            flexDirection: "row-reverse",
            justifyContent: "start",
          }),
        }}
      >
        {!self && (
          <Box sx={{ width: "40px" }}>
            {!samePrevUser && <Avatar>{message.user[0] || "?"}</Avatar>}
          </Box>
        )}
        <Card
          sx={{
            backgroundColor: "chat.msg",
            padding: "0.4rem 1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: self ? "flex-end" : "flex-start",
            gap: "0.15rem",
            borderRadius: "0.8rem",
            ...(self && { borderTopRightRadius: "0.25rem" }),
            ...(self && sameNextUser && { borderBottomRightRadius: "0.25rem" }),
            ...(!self && { borderTopLeftRadius: "0.25rem" }),
            ...(!self && sameNextUser && { borderBottomLeftRadius: "0.25rem" }),
          }}
        >
          <Box
            sx={{
              fontSize: "0.85rem",
              fontWeight: "bold",
              color: "primary.dark",
            }}
          >
            {user}
          </Box>
          <Box
            sx={{
              ...(!self && { alignSelf: "start" }),
            }}
          >
            {message.text}
          </Box>
          <Box
            sx={{
              alignSelf: "end",
              fontSize: "0.8rem",
              color: "text.secondary",
            }}
          >
            {parseTime(message.time)}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
