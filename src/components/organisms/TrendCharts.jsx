import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReactApexChart from "react-apexcharts";
import cycleService from "@/services/api/cycleService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const TrendCharts = () => {
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTrends();
  }, []);

  const loadTrends = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cycleService.getSymptomTrends(90);
      setTrendData(data);
    } catch (err) {
      setError("Failed to load symptom trends");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading variant="card" />;
  if (error) return <Error message={error} onRetry={loadTrends} />;
  if (!trendData || trendData.series.length === 0) {
    return (
      <Empty
        icon="TrendingUp"
        title="No trend data yet"
        message="Keep logging your symptoms to see patterns emerge over time"
      />
    );
  }

  const chartOptions = {
    chart: {
      id: "symptom-trends",
      type: "line",
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      zoom: {
        enabled: true,
        type: "x",
        autoScaleYaxis: true,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    colors: ["#9B6B9E", "#FF6B9D", "#D4A5D4", "#B88BBB", "#7BC67E", "#FFB366"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    grid: {
      borderColor: "#f1f1f1",
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      categories: trendData.dates,
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
          fontFamily: "Inter, system-ui, sans-serif",
        },
        rotate: -45,
        rotateAlways: false,
        hideOverlappingLabels: true,
        trim: true,
      },
      axisBorder: {
        show: true,
        color: "#e2e8f0",
      },
      axisTicks: {
        show: true,
        color: "#e2e8f0",
      },
    },
    yaxis: {
      title: {
        text: "Intensity Level",
        style: {
          color: "#64748b",
          fontSize: "14px",
          fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
          fontWeight: 600,
        },
      },
      min: 0,
      max: 5,
      tickAmount: 5,
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
          fontFamily: "Inter, system-ui, sans-serif",
        },
        formatter: (value) => Math.round(value),
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: "light",
      style: {
        fontSize: "14px",
        fontFamily: "Inter, system-ui, sans-serif",
      },
      x: {
        format: "MMM dd, yyyy",
      },
      y: {
        formatter: (value) => {
          if (!value) return "No data";
          const intensity = Math.round(value);
          const levels = ["None", "Minimal", "Mild", "Moderate", "Severe", "Very Severe"];
          return `${levels[intensity]} (${intensity})`;
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontSize: "14px",
      fontFamily: "Inter, system-ui, sans-serif",
      labels: {
        colors: "#64748b",
      },
      markers: {
        width: 12,
        height: 12,
        radius: 6,
      },
      itemMargin: {
        horizontal: 16,
        vertical: 8,
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center",
          },
          xaxis: {
            labels: {
              rotate: -90,
              trim: true,
              maxHeight: 100,
            },
          },
        },
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl shadow-sm p-6"
    >
      <ReactApexChart
        options={chartOptions}
        series={trendData.series}
        type="line"
        height={350}
      />
    </motion.div>
  );
};

export default TrendCharts;