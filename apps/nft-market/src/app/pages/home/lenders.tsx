import { Box, Button, Container, Grid, Typography } from "@mui/material";

import BlueLongArrowRight from "../../../assets/icons/blue-long-arrow-right.svg";
import BlackLongArrowRight from "../../../assets/icons/black-long-arrow-right.svg";
import BlueChip from "../../../assets/icons/blue-chip.svg";
import BoredApeYachtClub from "../../../assets/images/bored-ape-yacht-club.png";
import CryptoPunks from "../../../assets/images/crypto-punks.png";
import Doodles from "../../../assets/images/doodles.png";

export const Lenders = (): JSX.Element => {
  const collections = [
    {
      title: "BoredApeYachtClub",
      image: BoredApeYachtClub,
    },
    {
      title: "Crypto Punks",
      image: CryptoPunks,
    },
    {
      title: "Doodles",
      image: Doodles,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: "100px", md: "150px" } }}>
      <Box>
        <Typography variant="subtitle2" style={{ color: "#384BFF" }}>
          For lenders
        </Typography>
        <Box sx={{ mt: "20px", maxWidth: "500px" }}>
          <Typography variant="h4">Earn a juicy yield or get a bluechip NFT</Typography>
        </Box>
      </Box>
      <Grid container spacing={2} sx={{ mt: "50px" }}>
        <Grid item xs={12} md={4}>
          <Box
            sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}
          >
            <Typography variant="subtitle2" style={{ color: "#384BFF" }}>
              BlueChips only
            </Typography>
            <Box sx={{ my: "20px" }}>
              <Typography variant="h4">Verified Collections</Typography>
            </Box>
            <Typography variant="subtitle2">
              To minimize risk and ensure we are providing a secure service, we are
              starting with some of the most recognizable blue-chip NFT collections – with
              more sets to be added soon.
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                ml: "20px",
                mt: "50px",
                cursor: "pointer",
              }}
            >
              <Typography variant="subtitle2" style={{ color: "#384BFF" }}>
                Explore collections
              </Typography>
              <Box sx={{ ml: "5px" }}>
                <img
                  style={{ width: "16px" }}
                  src={BlueLongArrowRight}
                  alt="Explore collections"
                />
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container spacing={1}>
            {collections.map((collection: any, index: number) => {
              return (
                <Grid item xs={12} md={4} key={`lender_collection_${index}`}>
                  <Box
                    sx={{
                      borderRadius: "15px",
                      p: "10px",
                    }}
                  >
                    <Box sx={{ width: "100%" }}>
                      <img style={{ width: "100%" }} src={collection.image} />
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "center", width: "100%" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "calc(100% - 40px)",
                          borderRadius: "25px",
                          mt: "-25px",
                          boxShadow: "0px 3px 30px #70707086",
                          backDropFilter: "blur(30px)",
                          background: "#FFFFFF 0% 0% no-repeat padding-box",
                        }}
                      >
                        <Typography style={{ color: "#384BFF", fontSize: "12px" }}>
                          {collection.title}
                        </Typography>
                        <Box sx={{ ml: "5px", mt: "3px" }}>
                          <img style={{ width: "14px" }} src={BlueChip} />
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: "30px",
                        mb: "10px",
                      }}
                    >
                      <Typography variant="subtitle2">Explore listings</Typography>
                      <Box sx={{ ml: "5px" }}>
                        <img
                          style={{ width: "16px" }}
                          src={BlackLongArrowRight}
                          alt="Explore listings"
                        />
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Lenders;
