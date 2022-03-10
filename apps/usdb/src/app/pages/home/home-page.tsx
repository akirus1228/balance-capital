import { Box, Button } from "@mui/material";
import style from "./home-page.module.scss";

export function HomePage({ title }: { title: string }) {
  return (
    <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '300px'
      }}
      className={style['hero']}
    >
      <h1 className={style['heroH1']}>Take your investing to the next level</h1>
      <h2>The safest way to earn up to 32.5% on your stables.</h2>
      <h2>No risk. No surprises.</h2>
      <Button>Get Started</Button>
    </Box>
  );
}

export default HomePage;
