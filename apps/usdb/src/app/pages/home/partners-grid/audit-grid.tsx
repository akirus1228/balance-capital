import { Box, Grid, Typography } from "@mui/material";
import style from "./partners-grid.module.scss";
import { HackenIcon, SpadetechIcon, TechrateIcon } from "@fantohm/shared/images";

export const AuditGrid = (): JSX.Element => {
  return (
    <Box
      style={{ alignContent: "center", justifyContent: "center", marginTop: "150px" }}
      className={style["productGrid"]}
    >
      <Grid
        container
        rowSpacing={6}
        style={{
          width: "60%",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "20%",
        }}
        className={style["productGrid"]}
      >
        <Grid item md={12} xs={6}>
          <Typography
            style={{
              textAlign: "center",
              fontSize: "36px",
              fontWeight: "400",
              marginBottom: "50px",
            }}
            className="auditTitle"
          >
            Empowered & Audited As Necessary
          </Typography>{" "}
        </Grid>
        <Grid item md={3} sm={3}>
          <img src={TechrateIcon} alt="USDB logo" className={style["auditIcon"]} />
        </Grid>
        <Grid item md={3} sm={3}>
          <img src={HackenIcon} alt="USDB logo" className={style["auditIcon"]} />
        </Grid>
        <Grid item md={3} sm={3}>
          <img src={SpadetechIcon} alt="USDB logo" className={style["auditIcon"]} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuditGrid;
