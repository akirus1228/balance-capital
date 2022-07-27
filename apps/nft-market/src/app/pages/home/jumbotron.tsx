import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import BackgroundImage from "../../../assets/images/homepage-bg.png";
import ArrowRightDown from "../../../assets/icons/arrow-right-down.svg";
import ArrowRightUp from "../../../assets/icons/arrow-right-up.svg";

export const Jumbotron = (): JSX.Element => {
  return (
    <Container maxWidth="xl" sx={{ pt: { xs: "100px", md: "200px" } }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6} sx={{ position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box sx={{ mb: "30px" }}>
              <Typography variant="h4">
                Unlock the liquidity you need with the NFTs you already own
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                mb: "100px",
              }}
            >
              <Link to="/borrow">
                <Button variant="contained" sx={{ mr: "10px" }}>
                  Borrow
                </Button>
              </Link>
              <Link to="/lend">
                <Button variant="outlined">Lend</Button>
              </Link>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                borderTop: "2px solid #7E9AA936",
                position: { xs: "unset", md: "absolute" },
                bottom: "0",
              }}
            >
              <Grid container>
                <Grid item xs={6} sx={{ borderRight: "2px solid #7E9AA936" }}>
                  <Box sx={{ p: "40px" }}>
                    <Box sx={{ mb: "20px" }}>
                      <img src={ArrowRightDown} alt="Borrow" />
                    </Box>
                    <Box>
                      <Typography variant="h6">
                        Borrow against the value of your NFTs
                      </Typography>
                      <Typography variant="h6" style={{ fontWeight: "bolder" }}>
                        without selling them.
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: "40px" }}>
                    <Box sx={{ mb: "20px" }}>
                      <img src={ArrowRightUp} alt="Lend" />
                    </Box>
                    <Box>
                      <Typography variant="h6">
                        Lend with USDB and earn a passive yield,
                      </Typography>
                      <Typography variant="h6" style={{ fontWeight: "bolder" }}>
                        on your own terms.
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", justifyContent: "center", px: "15px" }}>
            <img
              src={BackgroundImage}
              alt="Colorful rectangles with rounded corners stacked"
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Jumbotron;
