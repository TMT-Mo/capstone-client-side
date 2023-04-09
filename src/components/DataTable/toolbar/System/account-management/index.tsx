import { Stack, Paper, IconButton, InputBase } from "@mui/material";
import { GridToolbarFilterButton } from "@mui/x-data-grid";
import { StyledAddBtn } from "components/CustomStyled";
import { RequiredPermission } from "components/RequiredPermission";
import { useDispatch } from "hooks";
import { useTranslation } from "react-i18next";
import { setLocation } from "slices/location";
import {
  LocationIndex,
  Permissions,
} from "utils/constants";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { searchAccount } from "slices/system";

const { ADD_TEMPLATE } = Permissions;


export const AccountManagementToolBar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  return (
    <Stack justifyContent="space-between" padding={3} direction="row">
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: 300,
        }}
        variant="outlined"
      >
        <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={t("Search Account")}
          inputProps={{ "aria-label": "search google maps" }}
          onChange={(e) => dispatch(searchAccount({ value: e.target.value }))}
        />
      </Paper>
      <Stack direction="row" spacing={3} alignItems="center">
        <GridToolbarFilterButton />
        <RequiredPermission permission={ADD_TEMPLATE}>
            <StyledAddBtn
              variant="outlined"
              size="small"
              onClick={() =>
                dispatch(
                  setLocation({
                    locationIndex: LocationIndex.ADD_ACCOUNT,
                  })
                )
              }
            >
              <AddIcon className="md:mr-2" />
              {t("Add")}
            </StyledAddBtn>
        </RequiredPermission>
      </Stack>
    </Stack>
  );
};
