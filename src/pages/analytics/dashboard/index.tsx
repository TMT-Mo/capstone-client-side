import { Container, Paper, Stack } from "@mui/material";
import CustomizedProgressBars from "components/Statistics";
import { useDispatch } from "hooks";
import { Account } from "pages/analytics/dashboard/account-management";
import { ChartBar } from "pages/analytics/dashboard/chart-bar";
import { DocumentBox } from "pages/analytics/dashboard/document-box";
import { TemplateBox } from "pages/analytics/dashboard/template-box";
import React, { useEffect } from "react";
import { getDepartmentList, getRoleList } from "slices/system";

export const AnalyticsDashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getDepartment = dispatch(getDepartmentList());
    const getRole = dispatch(getRoleList());

    // const getPermission = dispatch(getPermissionList());

    getDepartment.unwrap();
    getRole.unwrap();
    // getPermission.unwrap();

    return () => {
      getDepartment.abort();
      getRole.abort();
      // getPermission.abort();
    };
  }, [dispatch]);

  return (
    <Container sx={{ paddingY: "50px", mx: 0 }} maxWidth="xl">
      <Stack spacing={5}>
      <Paper sx={{p:5, maxHeight: '400px', borderRadius: 3}} elevation={3}>
      <ChartBar/>
      </Paper>
      <Stack direction="row" spacing={10}>
        <TemplateBox />
        <DocumentBox />
      </Stack>
      <Account />
      </Stack>
    </Container>
  );
};
