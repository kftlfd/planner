import { FC } from "react";
import { useSelector } from "react-redux";

import { Avatar, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import { selectUserById } from "~/store/usersSlice";

import { formatTime } from "./format-time.util";

const Container = styled(Box)({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "1rem",
});

const User = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

const UserAvatar = styled(Avatar)({
  width: "2rem",
  height: "2rem",
});

export const LastModified: FC<{
  timestamp: string;
  userId: number;
  showUser: boolean;
}> = ({ timestamp, userId, showUser }) => {
  const user = useSelector(selectUserById(userId));

  return (
    <Container>
      <Box>Last modified</Box>
      <Box>{formatTime(timestamp)}</Box>
      {showUser && user && (
        <User>
          <UserAvatar>{user.username[0]}</UserAvatar> {user.username}
        </User>
      )}
    </Container>
  );
};
