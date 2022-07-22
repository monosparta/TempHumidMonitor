import "./App.css";
import Card from "../components/Card";
import Stack from "@mui/material/Stack";
import { Grid } from "@mui/material";
import { Container } from "@mui/system";
import Chart from "../components/Chart";
import Sun from "../assets/sun.png";
import Rain from "../assets/rain.png";
import webSocket from "socket.io-client";
import React, { useState, useEffect } from "react";

function App() {
  const [realtimeData, setRealtimeData] = useState({ temp: 0, humid: 0 });
  //Websocket
  const [ws, setWs] = useState(null);
  useEffect(() => {
    if (ws) {
      console.log("success connect!");
      initWebSocket();
    }
  }, [ws]);

  const initWebSocket = () => {
    ws.on("update", (data) => {
      setRealtimeData(data);
    });
  };

  useEffect(() => {
    console.log(window.location.hostname);
    setWs(
      webSocket(`http://${window.location.hostname}`, {
        transports: ["websocket"],
      })
    );
  }, []);

  return (
    <div className="App">
      <Container maxWidth="xl">
        <header className="App-header">
          <Grid container direction="row" spacing={2}>
            <Grid item xs={12} sm={4}>
              <Stack direction="column" spacing={2}>
                <div align="left" style={{ color: "black" }}>
                  溫度
                </div>
                <Card img={Sun} msg={realtimeData.temp + "℃"}></Card>
                <div align="left" style={{ color: "black" }}>
                  濕度
                </div>
                <Card img={Rain} msg={realtimeData.humid + "%"}></Card>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Chart></Chart>
            </Grid>
          </Grid>
        </header>
      </Container>
    </div>
  );
}

export default App;
