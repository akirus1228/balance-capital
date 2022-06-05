//import style from "./my-account-page.module.scss";
import { Box, Container, Tab, Tabs } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { AccountProfile } from "./account-profile/account-profile";
import { ReactNode, SyntheticEvent, useMemo, useState } from "react";
import MyAccountLoans from "./my-account-loans/my-account-loans";
import MyAccountDetails from "./my-account-details/my-account-details";
import MyAccountOffers from "./my-account-offers/my-account-offers";
import MyAccountAssets from "./my-account-assets/my-account-assets";
import MyAccountActivity from "./my-account-activity/my-account-activity";
import { useLocation, useNavigate } from "react-router-dom";

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
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export const MyAccountPage = (): JSX.Element => {
  const { user } = useSelector((state: RootState) => state.backend);
  const [activeTab, setActiveTab] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useMemo(() => {
    setActiveTab(+location.hash.substring(1));
  }, [location]);

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    navigate(`/my-account#${newValue.toString()}`);
    //setActiveTab(newValue);
  };

  return (
    <Box>
      <Container>
        <AccountProfile user={user} />
      </Container>
      <Box sx={{ borderBottom: 2, borderColor: "divider" }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
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
    </Box>
  );
};

export default MyAccountPage;
