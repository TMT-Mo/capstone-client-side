import { IconButton } from "@mui/material";
import { TouchRippleActions } from "@mui/material/ButtonBase/TouchRipple";
import { GridRenderCellParams } from "@mui/x-data-grid";
import React from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Link } from "react-router-dom";
import { setViewerLocation } from "slices/location";
import { getTemplateDetail } from "slices/template";
import { ViewerLocationIndex } from "utils/constants";
import { useDispatch } from "hooks";

const {
  VIEW_TEMPLATE_HISTORY_INDEX,
} = ViewerLocationIndex;

export const TemplateHistoryActionCell = (props: GridRenderCellParams<Date>) => {
  const { hasFocus, row } = props;
  const buttonElement = React.useRef<HTMLButtonElement | null>(null);
  const rippleRef = React.useRef<TouchRippleActions | null>(null);
  const dispatch = useDispatch();
  
  React.useLayoutEffect(() => {
    if (hasFocus) {
      const input = buttonElement.current?.querySelector("input");
      input?.focus();
    } else if (rippleRef.current) {
      // Only available in @mui/material v5.4.1 or later
      rippleRef.current.stop({} as any);
    }
  }, [hasFocus]);

  return (
    <div>
      <IconButton
        aria-label="delete"
        onClick={() => {
          dispatch(getTemplateDetail({ template: row }))
          dispatch(setViewerLocation({viewerLocationIndex: VIEW_TEMPLATE_HISTORY_INDEX}))
        }}
      >
        <Link to="/viewer" >
          <BorderColorIcon fontSize="small" />
        </Link>
      </IconButton>
    </div>
  );
};
