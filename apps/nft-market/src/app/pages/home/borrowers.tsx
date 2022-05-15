import { Box, Button, Container, Grid, Typography } from "@mui/material";

import ArrowRightUp from "../../../assets/icons/arrow-right-up.svg";

export const Borrowers = (): JSX.Element => {
  const steps = [
    {
      backgroundImage: "",
      title: "Connect your wallet",
      description: "We’ll scan your wallet to find eligible NFTs to borrow against",
    },
    {
      backgroundImage: "",
      title: "Choose an NFT to collateralise",
      description: "Pick your NFT, set your terms and wait for the offers to roll in",
    },
    {
      backgroundImage: "",
      title: "Accept the best offer and receive the funds immediately",
      description: "Funds can be accessed immediately",
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: "100px", md: "150px" } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: { xs: "start", md: "space-between" },
          alignItems: { xs: "end", md: "center" },
        }}
      >
        <Box>
          <Typography variant="subtitle2" style={{ color: "#384BFF" }}>
            For borrowers
          </Typography>
          <Box sx={{ mt: "20px", maxWidth: "500px" }}>
            <Typography variant="h4">Unleash the value of your NFTs</Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex" }}>
          <Typography variant="h5" style={{ textAlign: "right" }}>
            get <br />
            started
          </Typography>
          <Box sx={{ mt: "5px", ml: "20px" }}>
            <img src={ArrowRightUp} alt="Lend" />
          </Box>
        </Box>
      </Box>
      <Grid container spacing={4} sx={{ mt: "50px" }}>
        {steps.map((step: any, index: number) => {
          return (
            <Grid item xs={12} md={4} key={`borrower_steps_${index}`}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "end",
                  height: "300px",
                  background: "red",
                  borderRadius: "30px",
                  p: "40px",
                }}
              >
                <Typography variant="h6">{step.title}</Typography>
                <Box sx={{ mt: "10px" }}>
                  <Typography variant="body1">{step.description}</Typography>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Borrowers;
