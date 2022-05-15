import { Box, Grid } from "@mui/material";

import Jumbotron from "./jumbotron";
import Borrowers from "./borrowers";
import Lenders from "./lenders";

export const HomePage = (): JSX.Element => {
  return (
    <Box
      sx={{
        width: "100%",
        mt: { xs: "-80px", md: "-145px" },
      }}
    >
      <Grid
        container
        sx={{
          display: { xs: "none", md: "flex" },
          width: "100%",
          height: "100%",
          zIndex: "-1",
          position: "absolute",
        }}
      >
        <Grid item xs={12} md={6}></Grid>
        <Grid item xs={12} md={6} sx={{ background: "#F5F5F5" }}></Grid>
      </Grid>
      <Jumbotron />
      <Borrowers />
      <Lenders />
    </Box>
  );
};

export default HomePage;
