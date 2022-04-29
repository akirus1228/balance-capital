import { Box, Button, Container, Typography } from "@mui/material";
import style from "./home-page.module.scss";
import BgImg from "../../../assets/images/temp-homepage-bg.png";

export const HomePage = (): JSX.Element => {
  return (
    <Container
      maxWidth="lg"
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
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          pr: 4,
        }}
      >
        <Box>
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
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#f2f3f3",
          pl: "50px",
          position: "relative",
          top: "-176px",
          zIndex: "-1",
        }}
      >
        <img
          src={BgImg}
          style={{ marginTop: "250px" }}
          alt="Coloful rectangles with rounded corners stacked"
        />
        <Box
          sx={{
            position: "fixed",
            zIndex: "-2",
            height: "100vh",
            top: "-176",
            right: "0",
            width: "50vw",
            background: "#f2f3f3",
          }}
        >
          &nbsp;
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
