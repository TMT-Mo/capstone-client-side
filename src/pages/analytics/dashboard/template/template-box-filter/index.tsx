import {
  Autocomplete,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "hooks";
import { Department } from "models/system";
import { useTranslation } from "react-i18next";
import { DoughnutChart } from "components/Chart/doughnut";
import { ChartDataset } from "chart.js";
import { StatisticsTemplate } from "models/statistics";
import { helpers } from "utils";
import { DeviceWidth } from "utils/constants";

const { handlePercentageValue } = helpers;

export const TemplateBoxWithFilter = () => {
  const { t } = useTranslation();
  const [selectedDepartment, setSelectedDepartment] = useState<Department>();
  const { userInfo } = useSelector((state) => state.auth);
  const { isGetDepartmentsLoading, departmentList } = useSelector(
    (state) => state.system
  );
  const { isGetStatisticsTemplateListLoading, statisticsTemplateList } =
    useSelector((state) => state.statistics);
  const [selectedStatistics, setSelectedStatistics] =
    useState<StatisticsTemplate>();

  const labels = [t("Rejected"), t("Processing"), t("Approved")];
  const datasets: ChartDataset<"doughnut">[] = [
    {
      label: t("Value"),
      data: [
        selectedStatistics?.rejected || 0,
        selectedStatistics?.processing || 0,
        selectedStatistics?.approved || 0,
      ],
      backgroundColor: ["#FF6384", "#35A2EB", "#22CFCF"],
      borderColor: ["#FF6384", "#35A2EB", "#22CFCF"],
    },
  ];

  const onChangeSelectedDepartment = (value: Department | null) => {
    if (!value) {
      return;
    }
    setSelectedDepartment(value);
    setSelectedStatistics(
      statisticsTemplateList.find(
        (statistics) => statistics.departmentId === value.id
      )
    );
  };

  useEffect(() => {
    if (!statisticsTemplateList) return;
    const defaultSelectedStatistics = statisticsTemplateList.find(
      (statistics) => statistics.departmentName === userInfo?.departmentName
    );
    setSelectedStatistics(defaultSelectedStatistics);
    setSelectedDepartment({
      departmentName: defaultSelectedStatistics?.departmentName!,
      id: defaultSelectedStatistics?.departmentId!,
    });
  }, [statisticsTemplateList, userInfo?.departmentName]);

  // useEffect(() => {
  //   if(!departmentList) return
  //   if(!selectedDepartment) return
  //   const currentDepartment = departmentList.find(d => d.departmentName === userInfo?.departmentName)
  //   setSelectedDepartment(currentDepartment) 
  // }, [departmentList, selectedDepartment, userInfo?.departmentName]);

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        width: `${window.innerWidth < DeviceWidth.IPAD_WIDTH ? "100%" : "600px"}`,
      }}
      elevation={3}
    >
      <Stack spacing={2} direction="column">
        {selectedStatistics && <Stack direction="row" justifyContent="space-between" alignItems="end">
          <Autocomplete
            id="asynchronous-demo"
            sx={{
              width: `${window.innerWidth < DeviceWidth.MOBILE_WIDTH ? "100%" : "250px"}`,
            }}
            onChange={(e, value) => onChangeSelectedDepartment(value)}
            isOptionEqualToValue={(option, value) =>
              option.departmentName === value.departmentName
            }
            disableClearable
            getOptionLabel={(option) => option.departmentName}
            options={departmentList.filter(
              (department) => department.departmentName !== "All"
            )}
            loading={isGetDepartmentsLoading}
            value={selectedDepartment}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                sx={{ borderBottom: "none" }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {isGetDepartmentsLoading ? (
                        <CircularProgress color="primary" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        </Stack>}
        {isGetStatisticsTemplateListLoading && (
          <Stack minHeight={300} justifyContent="center" alignItems="center">
            <CircularProgress />
          </Stack>
        )}
        {selectedStatistics && !isGetStatisticsTemplateListLoading && (
          <Stack spacing={2}>
            <Typography
              variant="h4"
              component="h1"
              style={{ paddingBottom: "10px" }}
              fontWeight="600"
            >
              {t("Total")}: {selectedStatistics.total}
            </Typography>

            <DoughnutChart labels={labels} datasets={datasets} />

            <Stack spacing={4}>
              <Divider />
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6" component="h1" fontWeight="semiBold">
                    {t("Processing")}
                  </Typography>
                  <Typography variant="h6" component="h1" fontWeight="semiBold">
                    {selectedStatistics.processing}{" "}
                    {handlePercentageValue(
                      selectedStatistics.processing,
                      selectedStatistics.total
                    )}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6" component="h1" fontWeight="semiBold">
                    {t("Approved")}
                  </Typography>
                  <Typography variant="h6" component="h1" fontWeight="semiBold">
                    {selectedStatistics.approved}{" "}
                    {handlePercentageValue(
                      selectedStatistics.approved,
                      selectedStatistics.total
                    )}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6" component="h1" fontWeight="semiBold">
                    {t("Rejected")}
                  </Typography>
                  <Typography variant="h6" component="h1" fontWeight="semiBold">
                    {selectedStatistics.rejected}{" "}
                    {handlePercentageValue(
                      selectedStatistics.rejected,
                      selectedStatistics.total
                    )}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};
