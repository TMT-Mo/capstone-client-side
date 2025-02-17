import styled from "@emotion/styled";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "hooks";
import { DummyPermissions } from "utils/dummy-data";
import { WhiteBtn } from "components/CustomStyled";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField/TextField";
import CloseIcon from "@mui/icons-material/Close";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { DeviceWidth } from "utils/constants";
const CustomBox = styled(Box)({
  padding: "20px 40px",
  backgroundColor: "#fff",
  width: "100%",
  borderRadius: "15px",
  lineHeight: "50px",
  filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06))'
});

export const PermissionSystem = () => {
  const { t } = useTranslation();
  const { isGetPermissionLoading, permissionList } = useSelector(
    (state) => state.system
  );
  const [isOpenPermissionDialog, setIsOpenPermissionDialog] = useState(false);
  return (
    <>
      <CustomBox >
        <Typography
          variant="h6"
          component="h2"
          style={{ paddingBottom: "10px" }}
          fontWeight="bold"
        >
          {t('Permission')}
        </Typography>
        {isGetPermissionLoading && <CircularProgress />}
        <Stack
          direction="row"
          // spacing={25}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h2" component="h1">
            {DummyPermissions.length}
          </Typography>
          <Stack spacing={1}>
            <IconButton
              onClick={() =>
                setIsOpenPermissionDialog((prevState) => !prevState)
              }
              type="button"
              sx={{ p: "10px" }}
              aria-label="search"
            >
              <ListAltIcon sx={{ fill: "#0984e3" }} />
            </IconButton>
          </Stack>
        </Stack>
      </CustomBox>
      <Dialog open={isOpenPermissionDialog}>
        <DialogContent>
          <Box sx={{minWidth: window.innerWidth > DeviceWidth.IPAD_WIDTH ? "500px" : ''}}>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h5" component="h1" alignSelf="center">
                  {t('Permission List')}
                </Typography>
                <IconButton onClick={() => setIsOpenPermissionDialog(false)}>
                  <CloseIcon />
                </IconButton>
              </Stack>
              {DummyPermissions.map((permission) => (
                <TextField
                  key={permission.id}
                  value={permission.permissionName}
                  disabled
                />
              ))}
              <DialogActions>
                <WhiteBtn
                  onClick={() => setIsOpenPermissionDialog(false)}
                  size="small"
                >
                  {t("Cancel")}
                </WhiteBtn>
              </DialogActions>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
