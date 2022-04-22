import { Container } from "@mui/material";
import style from "./home-page.module.scss";

export const HomePage = (): JSX.Element => {
  return (
    <Container
      maxWidth="xl"
      className={style["heroContainer"]}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <h1>NFT Marketplace</h1>
    </Container>
  );
};

export default HomePage;
