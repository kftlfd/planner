import {
  FC,
  FormEventHandler,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { isSameDay } from "date-fns";

import ChatIcon from "@mui/icons-material/Chat";
import Close from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Card,
  CircularProgress,
  Fade,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import { useActions } from "~/context/ActionsContext";
import { Sidebar, SidebarBody, SidebarHeader } from "~/layout/Sidebar";
import { Chat, selectProjectChat } from "~/store/chatSlice";
import { selectUserById, selectUserId } from "~/store/usersSlice";

const getIsSamePrevUser = (chat: Chat, i: number) => {
  const curMsg = chat.messages[i];
  const prevMsg = chat.messages[i - 1];
  return curMsg && prevMsg ? curMsg.user === prevMsg.user : false;
};

export const ProjectChat: FC = () => {
  const { projectId: projectIdParam } = useParams<{ projectId: string }>();
  const projectId = Number(projectIdParam);
  const projectChat = useSelector(selectProjectChat(projectId));
  const actions = useActions();

  const [state, setState] = useState({
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
  const newMessageChange = (v: string) => {
    setState((prev) => ({ ...prev, newMessage: v }));
  };

  //
  // Scroll to bottom of chatbox on receiving message and on load
  //
  const chatboxBottom = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!projectChat?.unread) return;
    if (!state.chatOpen) {
      chatboxBottom.current?.scrollIntoView(true);
    } else {
      chatboxBottom.current?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    }
  }, [projectChat, state.chatOpen]);

  //
  // Reset unread on closing chat
  //
  useEffect(() => {
    if (state.chatOpen) {
      setState((prev) => ({ ...prev, viewingNow: true }));
    } else if (state.viewingNow) {
      setState((prev) => ({ ...prev, viewingNow: false }));
      if (projectChat?.unreadIndex !== null)
        actions.chat.resetUnread(projectId);
    }
  }, [
    actions.chat,
    projectChat?.unreadIndex,
    projectId,
    state.chatOpen,
    state.viewingNow,
  ]);

  //
  // Load chat messages
  //
  useEffect(() => {
    async function loadChat() {
      try {
        await actions.chat.load(projectId);
      } catch (error) {
        console.error("Failed to load chat: ", error);
        setState((prev) => ({ ...prev, loadError: true }));
      }
    }

    if (!projectChat || !projectChat.loaded) {
      void loadChat();
    }
  }, [actions.chat, projectChat, projectId]);

  //
  // Send new message
  //
  const sendDisabled = state.loadError
    ? true
    : !state.newMessage
      ? true
      : state.sendLoading || state.sendError;

  const sendMessage = async () => {
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
  };

  const onSend: FormEventHandler = (e) => {
    e.preventDefault();
    void sendMessage();
  };

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

      <Sidebar open={state.chatOpen} toggle={chatToggle}>
        <SidebarHeader title={"Chat"} toggle={chatToggle} />

        <SidebarBody
          sx={{
            flexGrow: 1,
            padding: 0,
            overflowX: "hidden",
            overflowY: "scroll",
            backgroundColor: "chat.bg",
            paddingTop: "3rem",
          }}
        >
          {state.loadError ? (
            <Typography
              variant="h5"
              component="div"
              align="center"
              sx={{ fontWeight: "light" }}
            >
              Failed to load messages
            </Typography>
          ) : projectChat?.loaded ? (
            <>
              {projectChat.messages.map((msg, index) => (
                <Message
                  key={msg.id}
                  message={msg}
                  samePrevUser={getIsSamePrevUser(projectChat, index)}
                  sameNextUser={getIsSamePrevUser(projectChat, index + 1)}
                  unread={index === projectChat.unreadIndex}
                />
              ))}
              <Box ref={chatboxBottom} sx={{ height: "1rem" }} />
            </>
          ) : (
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress />
            </Box>
          )}
        </SidebarBody>

        <AppBar
          color={"background" as "default"}
          sx={{
            position: "relative",
            padding: "0.5rem 1.5rem",
            transform: "rotate(180deg)",
          }}
        >
          <form
            onSubmit={onSend}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transform: "rotate(180deg)",
            }}
          >
            <TextField
              value={state.newMessage}
              onChange={(e) => {
                newMessageChange(e.target.value);
              }}
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
};

function Message(props: {
  message: { user: number; text: string; time: string };
  samePrevUser: boolean;
  sameNextUser: boolean;
  unread: boolean;
}) {
  const { message, samePrevUser, sameNextUser, unread } = props;
  const user = useSelector(selectUserById(message.user));
  const selfId = useSelector(selectUserId);
  const self = message.user === selfId;

  function parseTime(s: string) {
    const today = new Date();
    const d = new Date(s);
    const formatted = d.toLocaleString(undefined, {
      ...(!isSameDay(today, d) && { month: "short", day: "numeric" }),
      hour12: false,
      hour: "numeric",
      minute: "2-digit",
    });
    return formatted;
  }

  return (
    <>
      {unread && (
        <Typography
          variant="body1"
          component="div"
          align="center"
          sx={{
            alignSelf: "stretch",
            marginBlock: "0.4rem",
            backgroundColor: "action.focus",
          }}
        >
          New messages
        </Typography>
      )}

      <Fade in={true}>
        <Box
          sx={{
            marginTop: unread ? 0 : samePrevUser ? "0.2rem" : "0.4rem",
            display: "flex",
            flexDirection: self ? "row-reverse" : "row",
            alignItems: "flex-start",
            gap: "0.5rem",
            paddingLeft: self ? "20%" : "2%",
            paddingRight: self ? "2%" : "20%",
          }}
        >
          {!self && (
            <Box sx={{ width: "40px", flexShrink: 0 }}>
              {(!samePrevUser || unread) && (
                <Avatar>{user?.username[0] || ""}</Avatar>
              )}
            </Box>
          )}

          <Card
            sx={{
              backgroundColor: "chat.msg",
              padding: "0.5rem 1rem",
              borderRadius: "1rem",
              ...(self && {
                borderTopRightRadius: "0.5rem",
                paddingLeft: "1rem",
              }),
              ...(self &&
                sameNextUser && { borderBottomRightRadius: "0.5rem" }),
              ...(!self && {
                borderTopLeftRadius: "0.5rem",
                paddingRight: "1rem",
              }),
              ...(!self &&
                sameNextUser && { borderBottomLeftRadius: "0.5rem" }),
            }}
          >
            {(!samePrevUser || unread) && (
              <Box
                sx={{
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  color: "primary.dark",
                  marginBottom: "0.2rem",
                  textAlign: self ? "right" : "left",
                }}
              >
                {user?.username || "[deleted]"}
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                flexWrap: "wrap",
                rowGap: "0.2rem",
                columnGap: "0.5rem",
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  textAlign: "left",
                }}
              >
                {message.text}
              </Box>

              <Box
                sx={{
                  alignSelf: "flex-end",
                  fontSize: "0.7rem",
                  color: "text.secondary",
                }}
              >
                {parseTime(message.time)}
              </Box>
            </Box>
          </Card>
        </Box>
      </Fade>
    </>
  );
}
