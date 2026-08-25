import { Box, Grid, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import Chart from "react-apexcharts";
import { MdOutlineTableChart, MdChat, MdMemory, MdSpeed } from "react-icons/md";
import Card from "../components/card/Card";
import MiniStatistics from "../components/card/MiniStatistics";

// Sample data until the backend exposes an analytics endpoint.
const queriesPerDay = [12, 18, 9, 24, 31, 22, 28];
const queryDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const documentStatusBreakdown = { indexed: 18, processing: 3, failed: 1 };

export default function Dashboard() {
  const lineOptions = {
    chart: { toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { curve: "smooth" as const, width: 3 },
    colors: ["#4318FF"],
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0, stops: [0, 100] },
    },
    grid: { borderColor: "#E0E5F2", strokeDashArray: 4 },
    xaxis: {
      categories: queryDays,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#A3AED0" } },
    },
    yaxis: { labels: { style: { colors: "#A3AED0" } } },
    dataLabels: { enabled: false },
  };

  const lineSeries = [{ name: "Queries", data: queriesPerDay }];

  const donutOptions = {
    labels: ["Indexed", "Processing", "Failed"],
    colors: ["#4318FF", "#FFB547", "#EE5D50"],
    legend: { position: "bottom" as const, labels: { colors: "#707EAE" } },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: { donut: { size: "70%" } },
    },
  };

  const donutSeries = [
    documentStatusBreakdown.indexed,
    documentStatusBreakdown.processing,
    documentStatusBreakdown.failed,
  ];

  const totalDocuments =
    documentStatusBreakdown.indexed +
    documentStatusBreakdown.processing +
    documentStatusBreakdown.failed;

  return (
    <Box>
      <Heading size="md" mb="6">
        Overview
      </Heading>

      <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} spacing="20px" mb="20px">
        <MiniStatistics name="Documents" value={String(totalDocuments)} icon={MdOutlineTableChart} />
        <MiniStatistics name="Queries Today" value="28" icon={MdChat} />
        <MiniStatistics name="Indexed Chunks" value="1,204" icon={MdMemory} />
        <MiniStatistics name="Avg. Latency" value="820 ms" icon={MdSpeed} />
      </SimpleGrid>

      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap="20px">
        <Card>
          <Text fontSize="lg" fontWeight="700" color="navy.700" mb="4">
            Queries this week
          </Text>
          <Chart options={lineOptions} series={lineSeries} type="area" height={280} />
        </Card>

        <Card>
          <Text fontSize="lg" fontWeight="700" color="navy.700" mb="4">
            Document status
          </Text>
          <Chart options={donutOptions} series={donutSeries} type="donut" height={280} />
        </Card>
      </Grid>
    </Box>
  );
}
