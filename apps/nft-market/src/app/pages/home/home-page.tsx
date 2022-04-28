import { Box, Button, Container, Typography } from "@mui/material";
import style from "./home-page.module.scss";
import BgImg from "../../../assets/images/temp-homepage-bg.png";

export const HomePage = (): JSX.Element => {
  return (
    <Container
      maxWidth="xl"
      className={style["heroContainer"]}
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          marginLeft: "auto",
          maxWidth: "40vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: "50px",
        }}
      >
        <Box sx={{ maxWidth: "450px" }}>
          <h1>Unlock the liquidity you need with the NFTs you already own</h1>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            mb: "8em",
          }}
        >
          <Button variant="contained" sx={{ mr: "10px" }}>
            Borrow
          </Button>
          <Button variant="outlined">Lend</Button>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
          <Box
            sx={{
              borderTop: "1px solid #f2f3f3",
              borderRight: "1px solid #f2f3f3",
              padding: "50px",
            }}
          >
            <Typography>
              Borrow against the value of your NFTs without selling them.
            </Typography>
          </Box>
          <Box sx={{ borderTop: "1px solid #f2f3f3", padding: "50px" }}>
            <Typography>
              Lend with USDB and earn a passive yield, on your own terms.
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          marginRight: "auto",
          maxWidth: "40vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#f2f3f3",
          pl: "50px",
          pr: "150px",
          position: "relative",
          top: "-116px",
          zIndex: "-1",
        }}
      >
        <img
          src={BgImg}
          style={{ marginTop: "250px" }}
          alt="Coloful rectangles with rounded corners stacked"
        />
      </Box>
    </Container>
  );
};

export default HomePage;
