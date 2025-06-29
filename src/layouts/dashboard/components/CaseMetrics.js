import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Grid,
  useTheme,
} from "@mui/material";
import { caseOperations } from "services/databaseService";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function CaseMetrics() {
  const [metrics, setMetrics] = useState({
    totalCases: 0,
    stages: {},
    monthlyData: [],
  });
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const cases = await caseOperations.getAllCases();
        
        // Calculate total cases
        const totalCases = cases.length;

        // Calculate cases by stage
        const stages = cases.reduce((acc, case_) => {
          const stage = case_.stage || "Not Set";
          acc[stage] = (acc[stage] || 0) + 1;
          return acc;
        }, {});

        // Calculate monthly data
        const monthlyData = cases.reduce((acc, case_) => {
          const date = new Date(case_.created_at);
          const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
          acc[monthYear] = (acc[monthYear] || 0) + 1;
          return acc;
        }, {});

        setMetrics({
          totalCases,
          stages,
          monthlyData: Object.entries(monthlyData).map(([month, count]) => ({
            month,
            count,
          })),
        });
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const chartData = {
    labels: metrics.monthlyData.map((data) => data.month),
    datasets: [
      {
        label: "Cases Created",
        data: metrics.monthlyData.map((data) => data.count),
        borderColor: theme.palette.primary.main,
        tension: 0.1,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Cases Created Over Time",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (loading) {
    return <Typography>Loading metrics...</Typography>;
  }

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader 
        title="Case Metrics" 
        sx={{ 
          background: `linear-gradient(45deg, ${theme.palette.warning.light} 30%, ${theme.palette.warning.main} 90%)`,
          color: theme.palette.warning.contrastText,
          '& .MuiTypography-root': {
            color: theme.palette.warning.contrastText
          }
        }}
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Total Cases: {metrics.totalCases}
              </Typography>
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Stage</TableCell>
                    <TableCell align="right">Number of Cases</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(metrics.stages).map(([stage, count]) => (
                    <TableRow key={stage}>
                      <TableCell component="th" scope="row">
                        {stage}
                      </TableCell>
                      <TableCell align="right">{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ height: 300 }}>
              <Line data={chartData} options={chartOptions} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default CaseMetrics; 