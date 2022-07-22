import React, { useEffect } from "react";

import {
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function App() {
  const [data, setData] = React.useState([]);
  //連接api 抓資料
  function interval() {
    var dataUrl = "api/getLast24Hours";
    fetch(dataUrl, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    interval();
    setInterval(() => {
      interval();
    }, 3600000);
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        width={1000}
        height={500}
        data={data}
        margin={{
          top: 80,
          right: 30,
          bottom: 10,
          left: 40,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="hour"
          interval={4}
          label={{
            value: "time",
            position: "insideBottomRight",
            offset: -15,
            fontSize: "20px",
          }}
        />
        <YAxis dataKey="humid" orientation="right" yAxisId={"right"} unit="%" />
        <YAxis dataKey="temp" orientation="left" yAxisId={"left"} unit="℃" />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="temp"
          unit={"℃"}
          stroke="#82ca9d"
          strokeWidth={3}
          yAxisId={"left"}
        />
        <Bar
          type="monotone"
          dataKey="humid"
          unit={"%"}
          strokeWidth={3}
          fill="#6E8AB6"
          yAxisId={"right"}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
