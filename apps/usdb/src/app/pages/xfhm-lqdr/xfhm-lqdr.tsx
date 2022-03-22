import { Box, Tab, Tabs } from "@mui/material";
import { a11yProps } from "@fantohm/shared-helpers";
import { memo, SyntheticEvent, useEffect, useState } from "react";

import { XfhmPage } from "./xfhm";
import { LqdrPage } from "./lqdr";
import { calcAllAssetTokenDetails, calcXfhmDetails, NetworkId, useWeb3Context } from "@fantohm/shared-web3";
import { useDispatch } from "react-redux";

export const XfhmLqdrPage = (): JSX.Element => {

  const { chainId, address } = useWeb3Context();
  const dispatch = useDispatch();
  const [xfhmView, setXfhmView] = useState<number>(0);

  const changeXfhmView = (event: SyntheticEvent, newView: number) => {
    setXfhmView(newView);
  };

  useEffect(() => {
    if (!address) {
      return;
    }
    dispatch(calcXfhmDetails({ address, networkId: chainId as NetworkId }));
    dispatch(calcAllAssetTokenDetails({ address, networkId: chainId as NetworkId }));
  }, [address, xfhmView]);

  return (
    <Box mt="50px" className="flexCenterCol">
      <Tabs
        key="xfhm-tabs"
        centered
        value={xfhmView}
        textColor="primary"
        indicatorColor="primary"
        className="stake-tab-buttons"
        onChange={changeXfhmView}
        aria-label="xfhm-tabs"
      >
        <Tab label="xFHM" {...a11yProps(0)} />
        <Tab label="Add Liquidity" {...a11yProps(1)} />
      </Tabs>
      <Box className="w-full" maxWidth="500px" bgcolor="#fff" mt="30px" py="30px" px="20px" borderRadius="1.5rem">
        {
          xfhmView === 0 ? (<XfhmPage />) : (<LqdrPage />)
        }
      </Box>
    </Box>
  );
};

export default memo(XfhmLqdrPage);
