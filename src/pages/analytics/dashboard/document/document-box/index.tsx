import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import {
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "hooks";
import { useTranslation } from "react-i18next";
import { DoughnutChart } from "components/Chart/doughnut";
import { ChartDataset } from "chart.js";
import { getStatisticsDocument } from "slices/statistics";
import { DeviceWidth, StatisticsColor } from "utils/constants";
import { helpers } from "utils";

const { APPROVED_COLOR, PROCESSING_COLOR, REJECTED_COLOR } = StatisticsColor;

const {  handlePercentageValue } = helpers;
interface DefaultDate {
  fromDate: Dayjs;
  toDate: Dayjs;
}
const defaultDate: DefaultDate = {
  fromDate: dayjs(
    new Date("Tue Oct 11 2022 00:00:00 GMT+0700 (Indochina Time)")
  ),
  toDate: dayjs(new Date()),
};
export const DocumentBoxNoneFilter = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState<Dayjs>(defaultDate.fromDate);
  const [endDate, setEndDate] = useState<Dayjs>(defaultDate.toDate);
  const { userInfo } = useSelector((state) => state.auth);
  const { departmentList } = useSelector((state) => state.system);
  const { isGetStatisticsDocumentLoading, statisticsDocument } = useSelector(
    (state) => state.statistics
  );

  const labels = [ t("Rejected"),t("Processing"), t("Approved")];
  const datasets: ChartDataset<"doughnut">[] = [
    {
      label: t("Value"),
      data: [
        statisticsDocument?.rejected || 0,
        statisticsDocument?.processing || 0,
        statisticsDocument?.approved || 0,
      ],
      backgroundColor: [ REJECTED_COLOR,PROCESSING_COLOR, APPROVED_COLOR],
      borderColor: [ REJECTED_COLOR,PROCESSING_COLOR, APPROVED_COLOR],
    },
  ];

  const handleChangeStartDate = (value: Dayjs) => {
    setStartDate(value.subtract(1, "day"));
  };

  const handleChangeEndDate = (value: Dayjs) => {
    setEndDate(value.subtract(2, "day"));
  };

  useEffect(() => {
    const getDepartment = departmentList.find(
      (d) => d.departmentName === userInfo?.departmentName
    );
    const onGetStatisticsDocument = dispatch(
      getStatisticsDocument({
        departmentId: getDepartment?.id,
        fromDate: new Date(startDate.add(1,'day').toISOString().replace('T17', 'T00')),
        toDate: endDate.toDate(),
      })
    );

    onGetStatisticsDocument.unwrap();
  }, [departmentList, dispatch, endDate, startDate, userInfo?.departmentName]);

  return (
    <Stack spacing={3} width='100%'>
      <h2>{t("Document Statistics")}</h2>
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          minHeight: 500,
        }}
        elevation={3}
      >
        <Stack spacing={2} direction="column">
          <Stack
            direction={`${window.innerWidth < DeviceWidth.MOBILE_WIDTH ? "column" : "row"}`}
            justifyContent="space-between"
            alignItems={`${window.innerWidth < DeviceWidth.MOBILE_WIDTH ? "start" : "end"}`}
          >
            <Typography variant="h5" component="h1" fontWeight="600">
              {userInfo?.departmentName}
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack direction={`${window.innerWidth < DeviceWidth.MOBILE_WIDTH ? "column" : "row"}`} spacing={3}>
                <DesktopDatePicker
                  label={t("From")}
                  inputFormat="DD/MM/YYYY"
                  value={startDate}
                  onChange={(newValue: Dayjs | null) =>
                    handleChangeStartDate(newValue!.add(1, "day"))
                  }
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      variant="standard"
                      disabled
                      sx={{ width: "130px" }}
                      // value={null}
                    />
                  )}
                  disableFuture
                  maxDate={endDate ?? undefined}
                />
                <DesktopDatePicker
                  label={t("To")}
                  inputFormat="DD/MM/YYYY"
                  value={endDate}
                  onChange={(newValue: Dayjs | null) =>
                    handleChangeEndDate(newValue!.add(2, "day"))
                  }
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      sx={{ width: "130px" }}
                      variant="standard"
                      disabled
                    />
                  )}
                  disableFuture
                  minDate={startDate ?? undefined}
                />
              </Stack>
            </LocalizationProvider>
          </Stack>

          {isGetStatisticsDocumentLoading && (
            <Stack
              width="100%"
              minHeight={300}
              justifyContent="center"
              alignItems="center"
            >
              <CircularProgress />
            </Stack>
          )}

          {statisticsDocument && !isGetStatisticsDocumentLoading && (
            <Stack spacing={2}>
              <Typography
                variant="h4"
                component="h1"
                style={{ paddingBottom: "10px" }}
                fontWeight="600"
              >
                {t("Total")}: {statisticsDocument?.total}
              </Typography>
              <DoughnutChart labels={labels} datasets={datasets} />
              <Divider />
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6" component="h1" fontWeight="semiBold">
                    {t("Processing")}
                  </Typography>
                  <Typography variant="h6" component="h1" fontWeight="semiBold">
                    {statisticsDocument?.processing}{" "}
                    {handlePercentageValue(
                      statisticsDocument?.processing,
                      statisticsDocument?.total
                    )}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6" component="h1" fontWeight="semiBold">
                    {t("Approved")}
                  </Typography>
                  <Typography variant="h6" component="h1" fontWeight="semiBold">
                    {statisticsDocument?.approved}{" "}
                    {handlePercentageValue(
                      statisticsDocument?.approved,
                      statisticsDocument?.total
                    )}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6" component="h1" fontWeight="semiBold">
                    {t("Rejected")}
                  </Typography>
                  <Typography variant="h6" component="h1" fontWeight="semiBold">
                    {statisticsDocument?.rejected}{" "}
                    {handlePercentageValue(
                      statisticsDocument?.rejected,
                      statisticsDocument?.total
                    )}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
};
