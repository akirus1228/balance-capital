import { Modal, Box, Typography, Fade, Paper, Grid, Button } from "@mui/material";
import { memo } from "react";
import style from "../amps.module.scss";

export const StakeModal = ({
  open,
  closeModal,
  onCancel,
}: {
  open: boolean;
  closeModal: () => void;
  onCancel: () => void;
}): JSX.Element => {
  return (
    <Modal open={open}>
      <Fade in={open}>
        <Paper
          className={style["modal"]}
          sx={{ py: "2rem", px: "3rem", borderRadius: "0.5rem" }}
        >
          <Box display="flex" alignItems="center">
            <Typography variant="h6" color="primary" className="font-weight-bold">
              Choose NFT(s) to stake
            </Typography>
          </Box>

          <Grid container marginTop={3} className={style["nftItemContainer"]}>
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <Grid item xs={4} className={style["nftItem"]} key={`${index}`}>
                <Box className={style["nftImage"]} />
                <Typography
                  variant="subtitle1"
                  color="primary"
                  className={style["nftTitle"]}
                >
                  NFT #1234
                </Typography>
              </Grid>
            ))}
          </Grid>
          <Box display="flex" mt="20px" width="80%">
            <Button
              variant="contained"
              id="bond-btn"
              className="paperButton transaction-button"
              onClick={onCancel}
              style={{ marginRight: "10px" }}
            >
              Stake
            </Button>

            <Button
              variant="contained"
              color="primary"
              id="bond-btn"
              className="paperButton transaction-button"
              onClick={closeModal}
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default memo(StakeModal);
