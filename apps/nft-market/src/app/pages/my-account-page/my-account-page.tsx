import style from "./my-account-page.module.scss";
import MyAccountActiveLoansTable from "./my-account-active-loans-table";
import { Box, Container, Tab, Tabs, Typography } from "@mui/material";
import { useWeb3Context } from "@fantohm/shared-web3";
import { useGetLoansQuery } from "../../api/backend-api";
import { LoanStatus } from "../../types/backend-types";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { AccountProfile } from "./account-profile/account-profile";
import { ReactNode, SyntheticEvent, useState } from "react";
import MyAccountLoans from "./my-account-loans/my-account-loans";
import MyAccountDetails from "./my-account-details/my-account-details";
import MyAccountOffers from "./my-account-offers/my-account-offers";
import MyAccountAssets from "./my-account-assets/my-account-assets";
import MyAccountActivity from "./my-account-activity/my-account-activity";

export function shorten(str: string) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

type TabPanelProps = {
  children?: ReactNode;
  index: number;
  value: number;
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export const MyAccountPage = (): JSX.Element => {
  const { user } = useSelector((state: RootState) => state.backend);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container>
      <AccountProfile user={user} />
      <Box sx={{ borderBottom: 2, borderColor: "divider" }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Details" {...a11yProps(0)} />
          <Tab label="Loans" {...a11yProps(1)} />
          <Tab label="Offers" {...a11yProps(2)} />
          <Tab label="Assets" {...a11yProps(3)} />
          <Tab label="Activity" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <TabPanel value={activeTab} index={0}>
        <MyAccountDetails />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <MyAccountLoans />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <MyAccountOffers />
      </TabPanel>
      <TabPanel value={activeTab} index={3}>
        <MyAccountAssets />
      </TabPanel>
      <TabPanel value={activeTab} index={4}>
        <MyAccountActivity />
      </TabPanel>
    </Container>
  );
};

export default MyAccountPage;
