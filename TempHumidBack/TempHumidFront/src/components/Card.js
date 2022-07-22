import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";

export default function BasicCard(props) {
  return (
    <Card sx={{ display: "flex", p: 5, m: 10 }}>
      <CardContent sx={{ width: "100%" }}>
        <Grid container direction="row" spacing={1}>
          <Grid item xs={6}>
            <Grid
              item
              md={3}
              style={{ width: "100%", height: "100%" }}
              fontSize={"min(20vw, 5rem)"}
            >
              {props.msg}
            </Grid>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "right" }}>
            <img
              src={props.img}
              style={{ maxHeight: "100px", maxWidth: "100%" }}
              alt="Card Icon"
            ></img>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
