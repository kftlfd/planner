import React from "react";
import { useSelector } from "react-redux";
import { Box, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";

import { selectUserById } from "app/store/usersSlice";
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

type LastModifiedProps = {
  timestamp: string;
  userId: number;
  showUser: boolean;
};

export const LastModified: React.FC<LastModifiedProps> = ({
  timestamp,
  userId,
  showUser,
}) => {
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
