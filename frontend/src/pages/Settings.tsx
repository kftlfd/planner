import { FC, ReactNode, useState } from "react";
import { useSelector } from "react-redux";

import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Container,
  Slider,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import { useActions } from "~/context/ActionsContext";
import { useColorMode } from "~/context/ThemeContext";
import { MainBody, MainHeader } from "~/layout/Main";
import { SimpleModal } from "~/layout/Modal";
import {
  selectBoardColumnWidth,
  selectHideDoneTasks,
} from "~/store/settingsSlice";
import { selectUser } from "~/store/usersSlice";

const Settings: FC = () => {
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
};

export default Settings;

const SettingWrapper: FC<{
  header: string;
  children?: ReactNode;
}> = ({ header, children }) => {
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
      <Typography variant="h5">{header}</Typography>
      {children}
    </Box>
  );
};

type UserState = {
  username: string | null;
  usernameError: string | null;
  usernameChangeSuccess: boolean;

  showPasswordForm: boolean;
  oldPassword: string;
  oldPasswordError: string | null;
  newPassword: string;
  newPassword2: string;
  newPasswordError: string | null;
  confirmPasswordError: boolean;
  showPasswords: boolean;
  passwordChangeSuccess: boolean;
};

const AccountSettings: FC = () => {
  const user = useSelector(selectUser);
  const actions = useActions();

  const [state, setState] = useState<UserState>({
    username: user?.username ?? null,
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

  const handleUsernameUpdate = async () => {
    try {
      if (!state.username) return;
      await actions.user.update({ username: state.username });
      setState((prev) => ({
        ...prev,
        usernameError: null,
        usernameChangeSuccess: true,
      }));
    } catch (error) {
      console.error("Failed to update user: ", error);
      try {
        const parsedError = JSON.parse((error as Error).message) as {
          username?: string;
        };
        setState((prev) => ({
          ...prev,
          usernameError: parsedError.username ? parsedError.username : "Error",
          usernameChangeSuccess: false,
        }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePasswordUpdate = async () => {
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
        const parsedError = JSON.parse((error as Error).message) as {
          oldPassword?: string;
          newPassword?: string;
        };
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
  };

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
              onChange={(e) => {
                setState((prev) => ({
                  ...prev,
                  username: e.target.value,
                  usernameError: null,
                  usernameChangeSuccess: false,
                }));
              }}
              error={state.usernameError !== null}
              helperText={state.usernameError}
              size={"small"}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="contained"
              onClick={() => void handleUsernameUpdate()}
              disabled={!state.username || state.username === user?.username}
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
              onClick={() => {
                setState((prev) => ({
                  ...prev,
                  showPasswordForm: !prev.showPasswordForm,
                }));
              }}
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
                onChange={(e) => {
                  setState((prev) => ({
                    ...prev,
                    oldPassword: e.target.value,
                    oldPasswordError: null,
                    passwordChangeSuccess: false,
                  }));
                }}
                error={state.oldPasswordError !== null}
                helperText={state.oldPasswordError}
              />
              <TextField
                size={"small"}
                type={state.showPasswords ? "text" : "password"}
                placeholder={"New password"}
                value={state.newPassword}
                onChange={(e) => {
                  setState((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                    newPasswordError: null,
                    passwordChangeSuccess: false,
                    confirmPasswordError: e.target.value !== prev.newPassword2,
                  }));
                }}
                error={state.newPasswordError !== null}
              />
              <TextField
                size={"small"}
                type={state.showPasswords ? "text" : "password"}
                placeholder={"Repeat new password"}
                value={state.newPassword2}
                onChange={(e) => {
                  setState((prev) => ({
                    ...prev,
                    newPassword2: e.target.value,
                    newPasswordError: null,
                    passwordChangeSuccess: false,
                    confirmPasswordError: e.target.value !== prev.newPassword,
                  }));
                }}
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
                  onClick={() => {
                    setState((prev) => ({
                      ...prev,
                      showPasswords: !prev.showPasswords,
                    }));
                  }}
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
                  onClick={() => void handlePasswordUpdate()}
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
};

const InterfaceSettings: FC = () => {
  const colorMode = useColorMode();
  const actions = useActions();
  const hideDoneTasks = useSelector(selectHideDoneTasks);
  const boardColumnWidth = useSelector(selectBoardColumnWidth);

  const [sliderValue, setSliderValue] = useState(boardColumnWidth);

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
          onClick={() => {
            actions.settings.toggleHideDoneTasks();
          }}
        />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <Box>Board columns width</Box>
        <Box
          sx={{
            height: "0.5rem",
            width: `${sliderValue}px`,
            borderRadius: "0.25rem",
            backgroundColor: "text.disabled",
          }}
        />
        <Slider
          defaultValue={boardColumnWidth}
          value={sliderValue}
          min={150}
          max={350}
          step={25}
          marks
          onChange={(_, val) => {
            const newValue = Array.isArray(val) ? val[0] : val;
            if (newValue !== undefined) {
              setSliderValue(newValue);
            }
          }}
          onChangeCommitted={() => {
            actions.settings.setBoardColumnWidth(sliderValue);
          }}
        />
      </Box>
    </SettingWrapper>
  );
};

const DeleteAccount: FC = () => {
  const actions = useActions();

  const [state, setState] = useState({
    modalOpen: false,
  });

  const handleDeleteAccount = () => {
    actions.user.deleteAccount().catch((err: unknown) => {
      console.error(err);
    });
  };

  return (
    <SettingWrapper header="Delete Account">
      <Box>
        <Button
          color="error"
          variant="contained"
          onClick={() => {
            setState((prev) => ({ ...prev, modalOpen: true }));
          }}
        >
          Delete
        </Button>
      </Box>

      <SimpleModal
        open={state.modalOpen}
        onConfirm={handleDeleteAccount}
        onClose={() => {
          setState((prev) => ({ ...prev, modalOpen: false }));
        }}
        title={"Delete account?"}
        content={
          "Can't restore, projects deleted, content in shared projects will remain"
        }
        action={"Delete"}
      />
    </SettingWrapper>
  );
};
