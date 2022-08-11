import React from "react";
import { useSelector } from "react-redux";

import { useColorMode } from "../context/ThemeContext";
import { useActions } from "../context/ActionsContext";
import {
  selectHideDoneTasks,
  selectBoardColumnWidth,
} from "../store/settingsSlice";
import { selectUser } from "../store/usersSlice";
import { MainHeader, MainBody } from "../layout/Main";
import { SimpleModal } from "../layout/Modal";

import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Collapse,
  Checkbox,
  Switch,
  Slider,
} from "@mui/material";

export function Settings(props) {
  return (
    <>
      <MainHeader title="Settings" />

      <MainBody>
        <Container maxWidth="sm">
          <AccountSettings />
          <InterfaceSettings />
          <DeleteAccount />
        </Container>
      </MainBody>
    </>
  );
}

function SettingWrapper(props) {
  return (
    <Box
      sx={{
        color: "text.primary",
        paddingBlock: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        "&:not(:first-of-type)": {
          borderTop: "1px solid",
          borderColor: "text.disabled",
        },
      }}
    >
      <Typography variant="h5">{props.header}</Typography>
      {props.children}
    </Box>
  );
}

function AccountSettings(props) {
  const user = useSelector(selectUser);
  const actions = useActions();

  const [state, setState] = React.useState({
    username: user.username,
    usernameError: null,
    usernameChangeSuccess: false,

    showPasswordForm: false,
    oldPassword: "",
    oldPasswordError: null,
    newPassword: "",
    newPassword2: "",
    newPasswordError: null,
    confirmPasswordError: false,
    showPasswords: false,
    passwordChangeSuccess: false,
  });

  async function handleUsernameUpdate() {
    try {
      await actions.user.update({ username: state.username });
      setState((prev) => ({
        ...prev,
        usernameError: null,
        usernameChangeSuccess: true,
      }));
    } catch (error) {
      console.error("Failed to update user: ", error);
      try {
        const parsedError = JSON.parse(error.message);
        setState((prev) => ({
          ...prev,
          usernameError: parsedError.username ? parsedError.username : "Error",
          usernameChangeSuccess: false,
        }));
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function handlePasswordUpdate() {
    try {
      await actions.user.changePassword({
        oldPassword: state.oldPassword,
        newPassword: state.newPassword,
      });
      setState((prev) => ({
        ...prev,
        oldPassword: "",
        oldPasswordError: null,
        newPassword: "",
        newPassword2: "",
        newPasswordError: null,
        passwordChangeSuccess: true,
      }));
    } catch (error) {
      console.error("Password change error: ", error);
      try {
        const parsedError = JSON.parse(error.message);
        setState((prev) => ({
          ...prev,
          ...(parsedError.oldPassword && {
            oldPasswordError: parsedError.oldPassword,
          }),
          ...(parsedError.newPassword && {
            newPasswordError: parsedError.newPassword,
          }),
          passwordChangeSuccess: false,
        }));
      } catch (err) {
        console.error(err);
      }
    }
  }

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "max-content auto",
    rowGap: "1rem",
    columnGap: "1.5rem",
  };

  const labelStyle = { display: "grid", alignItems: "center", height: "40px" };

  const flexEndWrap = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.5rem",
    flexWrap: "wrap",
  };

  const successMsg = { paddingTop: "0.5rem", color: "success.main" };

  return (
    <SettingWrapper header="Account">
      <Box sx={gridStyle}>
        <Box sx={labelStyle}>Username</Box>
        <Box>
          <Box sx={flexEndWrap}>
            <TextField
              value={state.username}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  username: e.target.value,
                  usernameError: null,
                  usernameChangeSuccess: false,
                }))
              }
              error={state.usernameError !== null}
              helperText={state.usernameError}
              size={"small"}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="contained"
              onClick={handleUsernameUpdate}
              disabled={!state.username || state.username === user.username}
            >
              Change
            </Button>
          </Box>
          <Collapse in={state.usernameChangeSuccess}>
            <Box sx={successMsg}>Username changed!</Box>
          </Collapse>
        </Box>

        <Box sx={labelStyle}>Password</Box>
        <Box>
          <Box
            sx={{
              display: "inline-grid",
              placeContent: "center",
              height: "40px",
            }}
          >
            <Button
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  showPasswordForm: !prev.showPasswordForm,
                }))
              }
            >
              Change
            </Button>
          </Box>
          <Collapse in={state.showPasswordForm}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                paddingTop: "0.5rem",
              }}
            >
              <TextField
                size={"small"}
                type={state.showPasswords ? "text" : "password"}
                placeholder={"Current password"}
                value={state.oldPassword}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    oldPassword: e.target.value,
                    oldPasswordError: null,
                    passwordChangeSuccess: false,
                  }))
                }
                error={state.oldPasswordError !== null}
                helperText={state.oldPasswordError}
              />
              <TextField
                size={"small"}
                type={state.showPasswords ? "text" : "password"}
                placeholder={"New password"}
                value={state.newPassword}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                    newPasswordError: null,
                    passwordChangeSuccess: false,
                    confirmPasswordError: e.target.value !== prev.newPassword2,
                  }))
                }
                error={state.newPasswordError !== null}
              />
              <TextField
                size={"small"}
                type={state.showPasswords ? "text" : "password"}
                placeholder={"Repeat new password"}
                value={state.newPassword2}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    newPassword2: e.target.value,
                    newPasswordError: null,
                    passwordChangeSuccess: false,
                    confirmPasswordError: e.target.value !== prev.newPassword,
                  }))
                }
                color={state.confirmPasswordError ? "warning" : "primary"}
                error={state.newPasswordError !== null}
                helperText={
                  state.confirmPasswordError
                    ? "Passwords don't match"
                    : state.newPasswordError
                }
              />
              <Box sx={flexEndWrap}>
                <Button
                  startIcon={
                    <Checkbox
                      checked={state.showPasswords}
                      sx={{ padding: 0 }}
                    />
                  }
                  size="small"
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      showPasswords: !prev.showPasswords,
                    }))
                  }
                >
                  Show passwords
                </Button>
                <Button
                  variant="contained"
                  sx={{ alignSelf: "flex-end" }}
                  disabled={
                    state.confirmPasswordError ||
                    !state.oldPassword ||
                    !state.newPassword ||
                    !state.newPassword2
                  }
                  onClick={handlePasswordUpdate}
                >
                  Change password
                </Button>
              </Box>
            </Box>
          </Collapse>
          <Collapse in={state.passwordChangeSuccess}>
            <Box sx={successMsg}>Password changed!</Box>
          </Collapse>
        </Box>
      </Box>
    </SettingWrapper>
  );
}

function InterfaceSettings(props) {
  const colorMode = useColorMode();
  const actions = useActions();
  const hideDoneTasks = useSelector(selectHideDoneTasks);
  const boardColumnWidth = useSelector(selectBoardColumnWidth);

  const [sliderValue, setSliderValue] = React.useState(boardColumnWidth);

  const wrapper = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexWrap: "wrap",
    rowGap: "0.5rem",
  };

  return (
    <SettingWrapper header="Interface">
      <Box sx={wrapper}>
        <Box sx={{ flexGrow: 1 }}>Use Dark theme</Box>
        <Switch
          checked={colorMode.mode === "dark"}
          onClick={colorMode.toggleColorMode}
        />
      </Box>
      <Box sx={wrapper}>
        <Box sx={{ flexGrow: 1 }}>Hide done Tasks</Box>
        <Switch
          checked={hideDoneTasks}
          onClick={actions.settings.toggleHideDoneTasks}
        />
      </Box>
      <Box sx={wrapper}>
        <Box sx={{ flexGrow: 1 }}>Board columns width</Box>
        <Box
          sx={{
            paddingInline: "1rem",
            flexBasis: "40%",
            flexShrink: 0,
            flexGrow: 1,
            maxWidth: "100%",
            display: "grid",
            alignItems: "center",
          }}
        >
          <Slider
            defaultValue={boardColumnWidth}
            value={sliderValue}
            min={180}
            max={320}
            step={35}
            marks
            onChange={(e) => setSliderValue(e.target.value)}
            onChangeCommitted={() =>
              actions.settings.setBoardColumnWidth(sliderValue)
            }
          />
        </Box>
      </Box>
    </SettingWrapper>
  );
}

function DeleteAccount(props) {
  const actions = useActions();

  const [state, setState] = React.useState({
    modalOpen: false,
  });

  function handleDeleteAccount() {
    actions.user.deleteAccount();
  }

  return (
    <SettingWrapper header="Delete Account">
      <Box>
        <Button
          color="error"
          variant="contained"
          onClick={() => setState((prev) => ({ ...prev, modalOpen: true }))}
        >
          Delete
        </Button>
      </Box>

      <SimpleModal
        open={state.modalOpen}
        onConfirm={handleDeleteAccount}
        onClose={() => setState((prev) => ({ ...prev, modalOpen: false }))}
        title={"Delete account?"}
        content={
          "Can't restore, projects deleted, content in shared projects will remain"
        }
        action={"Delete"}
      />
    </SettingWrapper>
  );
}
