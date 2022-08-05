import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectProjectChat } from "../../store/chatSlice";
import { selectUserById, selectUserId } from "../../store/usersSlice";
import { useActions } from "../../context/ActionsContext";
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
  Fade,
  Badge,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import Close from "@mui/icons-material/Close";

export function ProjectChat(props) {
  const { projectId } = useParams();
  const projectChat = useSelector(selectProjectChat(projectId));
  const actions = useActions();

  const [state, setState] = React.useState({
    chatOpen: projectChat?.open || false,
    viewingNow: false,
    loadError: false,
    newMessage: "",
    sendLoading: false,
    sendError: false,
  });
  const chatToggle = () => {
    setState((prev) => ({ ...prev, chatOpen: !prev.chatOpen }));
    actions.chat.toggleChatOpen(projectId); // in store if marked open, don't update unread count
  };
  const newMessageChange = (e) =>
    setState((prev) => ({ ...prev, newMessage: e.target.value }));

  //
  // Scroll to bottom of chatbox on receiving message and on load
  //
  const chatboxBottom = React.useRef();
  React.useLayoutEffect(() => {
    if (!state.chatOpen) {
      chatboxBottom.current?.scrollIntoView(true);
    } else {
      chatboxBottom.current?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    }
  }, [projectChat]);

  //
  // Reset unread on closing chat
  //
  React.useEffect(() => {
    if (state.chatOpen) {
      setState((prev) => ({ ...prev, viewingNow: true }));
    } else if (state.viewingNow) {
      setState((prev) => ({ ...prev, viewingNow: false }));
      if (projectChat?.unreadIndex) actions.chat.resetUnread(projectId);
    }
  }, [state.chatOpen]);

  //
  // Load chat messages
  //
  async function loadChat() {
    try {
      await actions.chat.load(projectId);
    } catch (error) {
      console.error("Failed to load chat: ", error);
      setState((prev) => ({ ...prev, loadError: true }));
    }
  }
  React.useEffect(() => {
    if (!projectChat || !projectChat.loaded) loadChat();
  }, [projectChat]);

  //
  // Send new message
  //
  const sendDisabled = state.loadError
    ? true
    : !state.newMessage
    ? true
    : state.sendLoading || state.sendError;
  async function sendMessage(e) {
    e.preventDefault();
    if (sendDisabled) return;
    setState((prev) => ({ ...prev, sendLoading: true }));
    try {
      await actions.chat.newMessage(projectId, state.newMessage);
      setState((prev) => ({ ...prev, sendLoading: false, newMessage: "" }));
    } catch (error) {
      console.error("Failed to send message: ", error);
      setState((prev) => ({ ...prev, sendLoading: false, sendError: true }));
      setTimeout(() => {
        setState((prev) => ({ ...prev, sendError: false }));
      }, 5000);
    }
  }

  return (
    <>
      <IconButton onClick={chatToggle}>
        <Badge
          badgeContent={projectChat?.unread}
          invisible={projectChat?.unread === 0}
          color="primary"
        >
          <ChatIcon />
        </Badge>
      </IconButton>

      <Sidebar
        open={state.chatOpen}
        toggle={chatToggle}
        sx={{ overflow: "hidden" }}
      >
        <SidebarHeader title={"Chat"} toggle={chatToggle} />

        <SidebarBody
          sx={{
            flexGrow: 1,
            padding: 0,
            overflow: "scroll",
            backgroundColor: "chat.bg",
            padding: "0 1.5rem",
          }}
        >
          {state.loadError ? (
            <Typography
              variant="h5"
              component="div"
              align="center"
              sx={{ fontWeight: "light", paddingTop: "3rem" }}
            >
              Failed to load messages
            </Typography>
          ) : projectChat?.loaded ? (
            <>
              {projectChat?.messages.map((msg, index) => (
                <Message
                  key={msg.id}
                  message={msg}
                  samePrevUser={
                    projectChat.messages[index - 1] &&
                    projectChat.messages[index - 1].user ===
                      projectChat.messages[index].user
                  }
                  sameNextUser={
                    projectChat.messages[index + 1] &&
                    projectChat.messages[index + 1].user ===
                      projectChat.messages[index].user
                  }
                  unread={index === projectChat.unreadIndex}
                />
              ))}
              <Box ref={chatboxBottom} sx={{ height: "1rem" }} />
            </>
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
              {state.sendLoading ? (
                <CircularProgress size={"100%"} />
              ) : state.sendError ? (
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
  const { message, samePrevUser, sameNextUser, unread } = props;
  const user = useSelector(selectUserById(message.user)) || {
    username: "[deleted]",
  };
  const selfId = useSelector(selectUserId);
  const self = message.user === selfId;

  function parseTime(s) {
    let d = new Date(s);
    let formatted = d.toLocaleString(
      {},
      {
        month: "short",
        day: "numeric",
        hour12: false,
        hour: "numeric",
        minute: "2-digit",
      }
    );
    return formatted;
  }

  return (
    <Fade in={true}>
      <Box
        sx={{
          marginTop: unread ? 0 : samePrevUser ? "0.2rem" : "1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: self ? "flex-end" : "flex-start",
        }}
      >
        {unread && (
          <Typography
            variant="body1"
            component="div"
            align="center"
            sx={{
              alignSelf: "stretch",
              marginBlock: "1rem",
              backgroundColor: "action.focus",
              marginInline: "-1.5rem",
            }}
          >
            New messages
          </Typography>
        )}

        <Box
          sx={{
            maxWidth: "80%",
            display: "flex",
            gap: "0.5rem",
            ...(self && {
              flexDirection: "row-reverse",
              justifyContent: "start",
            }),
          }}
        >
          {!self && (
            <Box sx={{ width: "40px" }}>
              {(!samePrevUser || unread) && (
                <Avatar>{user.username[0] || ""}</Avatar>
              )}
            </Box>
          )}

          <Card
            sx={{
              backgroundColor: "chat.msg",
              padding: "0.4rem",
              display: "flex",
              flexDirection: "column",
              alignItems: self ? "flex-end" : "flex-start",
              borderRadius: "0.8rem",
              ...(self && {
                borderTopRightRadius: "0.25rem",
                paddingLeft: "0.8rem",
              }),
              ...(self &&
                sameNextUser && { borderBottomRightRadius: "0.25rem" }),
              ...(!self && {
                borderTopLeftRadius: "0.25rem",
                paddingRight: "0.8rem",
              }),
              ...(!self &&
                sameNextUser && { borderBottomLeftRadius: "0.25rem" }),
            }}
          >
            {(!samePrevUser || unread) && (
              <Box
                sx={{
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  color: "primary.dark",
                  marginBottom: "0.2rem",
                }}
              >
                {user.username}
              </Box>
            )}

            <Box>{message.text}</Box>

            <Box
              sx={{
                marginTop: "0.5rem",
                alignSelf: "flex-end",
                fontSize: "0.8rem",
                color: "text.secondary",
              }}
            >
              {parseTime(message.time)}
            </Box>
          </Card>
        </Box>
      </Box>
    </Fade>
  );
}
