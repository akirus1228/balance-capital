import {
  Box,
  Button,
  Grid,
  Icon,
  Input,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Headline from "../../components/headline/headline";
import Logo from "../../components/logo/logo";
import style from "./balance-about-page.module.scss";
import {
  TeammateProfile,
  Teammate,
} from "../../components/teammate-profile/teammate-profile";
import {
  AboutBridge,
  AboutDivider,
  AboutFHM,
  AboutFinancialNFT,
  AboutLiquidity,
  AboutUSDB,
  AboutUSDBBank,
  AboutBalanceEcosystem,
  AboutNFTMarketplace,
  BalanceHeroImage,
} from "@fantohm/shared/images";
import BalanceAboutTile from "./balance-about-tile";
import Head from "../../components/template/head";
import { useDispatch } from "react-redux";
import { error, info } from "@fantohm/shared-web3";

export const BalanceAboutPage = (): JSX.Element => {
  // mailchimp integration
  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src =
  //     "https://chimpstatic.com/mcjs-connected/js/users/30ce909d3542b1d245b54e5b8/8e00ffff339710be3d1981967.js%22";
  //   script.async = true;
  //   document.body.appendChild(script);
  // }, []);
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  async function createContact() {
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key":
          "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",
      },
      body: JSON.stringify({ updateEnabled: true, email: email }),
    };

    await fetch("https://api.sendinblue.com/v3/contacts", options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  }
  const onSubmitEmail = async () => {
    if (!email.includes("@") && !email.includes(".")) {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a valid email!"));
    }
    // await createContact();
    // const options = {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //     "api-key":
    //       "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",
    //   },
    //   body: JSON.stringify({ emails: [email] }),
    // };

    // await fetch("https://api.sendinblue.com/v3/contacts/lists/2/contacts/add", options)
    //   .then((response) => response.json())
    //   .then((response) => console.log(response))
    //   .catch((err) => console.error(err));

    const xhr = new XMLHttpRequest();
    const url =
      "https://api.hsforms.com/submissions/v3/integration/submit/26031699/1ef63c14-2b97-4210-ae89-0d37a540dd13";
    const data = {
      fields: [
        {
          name: "email",
          value: email,
        },
      ],
    };

    const final_data = JSON.stringify(data);
    xhr.open("POST", url);
    // Sets the value of the 'Content-Type' HTTP request headers to 'application/json'
    xhr.setRequestHeader("Content-Type", "application/json");

    // xhr.onreadystatechange = function () {
    //   if (xhr.readyState == 4 && xhr.status == 200) {
    //     alert(xhr.responseText); // Returns a 200 response if the submission is successful.
    //   } else if (xhr.readyState == 4 && xhr.status == 400) {
    //     alert(xhr.responseText); // Returns a 400 error the submission is rejected.
    //   } else if (xhr.readyState == 4 && xhr.status == 403) {
    //     alert(xhr.responseText); // Returns a 403 error if the portal isn't allowed to post submissions.
    //   } else if (xhr.readyState == 4 && xhr.status == 404) {
    //     alert(xhr.responseText); //Returns a 404 error if the formGuid isn't found
    //   }
    // };

    // Sends the request
    xhr.send(final_data);

    setEmail("");
    dispatch(info("Success!"));
    return;
  };
  return (
    <>
      {Head(
        "About",
        "Balance ecosystem is an economy of conjoined banking and commerce initiatives. USDB stablecoin, FHM, DEX, Bridges, Liquidity Solutions, USDB Bank & Liqdnft are some key products."
      )}
      <Box style={{ textAlign: "center", paddingTop: "50px" }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "60px", md: "60px" },
            fontWeight: "500",
          }}
          className={style["title"]}
        >
          About Us
        </Typography>
      </Box>
      <Grid
        container
        rowSpacing={6}
        className={style["productGrid"]}
        style={{ marginTop: "50px", paddingRight: "30px" }}
      >
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: { sm: "0%", md: "5%" },
            paddingRight: { sm: "0%", md: "5%" },
            width: { sm: "300px", md: "100%" },
          }}
        >
          <img
            src={AboutBalanceEcosystem as string}
            style={{ width: "100%" }}
            className={style["image"]}
            alt="BalanceEcosystem"
          />
        </Grid>
        <Grid
          item
          sm={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
            paddingTop: "30px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
            className={style["iconLinkContainer"]}
          >
            <Grid item xs={10} md={12}>
              <h2 className={style["title"]}>The Balance Ecosystem</h2>
            </Grid>

            <Grid item xs={10} md={12}>
              <h3 className={style["text"]}>
                The Balance Ecosystem is an open-source economy of conjoined banking and
                commerce initiatives formed in March of 2022 with the unveiling of
                investment opportunities derived solely from the technical application,
                maintenance, and consumer use of USDB.
              </h3>
            </Grid>
            <Grid item xs={10} md={12}>
              <h3 className={style["text"]}>
                The Balance Ecosystem depends on the administration of the Balance
                Organisation to produce and refine the collected systems of FHM & USDB’s
                use cases until such a time as they might be further decentralised.
                Through a continuing dialogue between the Balance Organisation and the FHM
                Stakeholders’ DAO via governance throughout the development and
                implementation of these systems, the Balance Ecosystem aims to produce the
                first, ever, decentralised reserve currency.
              </h3>
            </Grid>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "30px",
          }}
        >
          <img src={AboutDivider as string} alt="divider" style={{ width: "100%" }} />
        </Grid>
      </Grid>
      <BalanceAboutTile
        icon={AboutUSDB}
        itemid="usdb"
        title="USDB Stablecoin"
        text="USDB is the Swiss Army Knife of stable coins, combining the benefits of algorithmic supply backing, protocol owned liquidity, traditional banking, and decentralized finance. There are 5 strategies to be employed in maintaining its peg. Over this next epoch of adoption, as USDB gains more use cases, each of these strategies will be deployed or refined as necessary."
        link="https://www.usdbalance.com/"
        docsLink="https://fantohm.gitbook.io/documentation/usdb/introduction"
      />
      <BalanceAboutTile
        icon={AboutFHM}
        itemid="fhm"
        title="FHM Protocol"
        text="FHM is a Reserve & Rewards Protocol inspired by the Protocol Owned Liquidity software developments of OHM. FHM features compounding, single disbursement bonds as the safest possible bonding mechanism to ensure the longevity of exchange liquidity in relation to neighbouring protocols with similar principles."
        link="https://fantohm.com/"
        docsLink="https://fantohm.gitbook.io/documentation/"
        learnMore="/fhm"
      />
      <BalanceAboutTile
        icon={AboutBridge}
        itemid="bridge"
        title="DEX & Bridge"
        text="Bridge & swap thousands of assets across multiple chains with the lowest fees. Through a partnership with Rango Exchange, transactions are intuitively routed through several aggregators to ensure you always get the cheapest fees."
        link="https://app.fantohm.com/#/dex"
      />
      <BalanceAboutTile
        icon={AboutLiquidity}
        itemid="liquidity"
        title="Liquidity Solution"
        text="We understand that managing token liquidity is tough. We’ve built the perfect solution to help projects maximise the liquidity they can unlock. Making sure deep liquidity is available for your ecosystem. Helping you achieve your long-term mission and short-term needs."
        link="https://beets.fi/#/pool/0xd5e946b5619fff054c40d38c976f1d06c1e2fa820002000000000000000003ac"
        learnMore="./../../../assets/USDB_Liquiduty_Solution.pdf"
      />
      <BalanceAboutTile
        icon={AboutUSDBBank}
        itemid="usdbbank"
        title="USDB Bank"
        text="We are building a lending and borrowing structure that will fall under our USDBank which you may have already seen teased in the usdbalance.com site ui."
      />
      <BalanceAboutTile
        icon={AboutNFTMarketplace}
        itemid="marketplace"
        title="NFT Marketplace"
        text="Liqd is an non-fungible token (NFT) marketplace built to enable the lending and borrowing of blue chip NFTs. The platform enables individuals who hold blue chip NFT assets to unlock liquidity by borrowing against the value of their asset(s).
        In turn, Liqd unlocks a peer-to-peer lending opportunity for crypto holding individuals to lend capital for a set interest rate, backed by the value of the underlying NFT asset."
      />
      <BalanceAboutTile
        icon={AboutFinancialNFT}
        itemid="financialnft"
        title="Financial NFTs"
        text="We are building a financial NFTs that will act as a receipt for a new game-changing financial product."
      />
      <Grid
        item
        className="email-div"
        md={12}
        order={{ lg: 1 }}
        style={{ marginBottom: "100px", marginTop: "100px" }}
        sx={{
          width: { xs: "90%", md: "90%" },
          marginLeft: { xs: "5%", md: "5%" },
          marginRight: { xs: "5%", md: "5%" },
          marginBottom: "20px",
        }}
      >
        <Paper
          style={{
            width: "100%",
            borderRadius: "80px",
            backgroundImage: `url(${BalanceHeroImage})`,
            backgroundSize: "100% auto",
            backgroundPosition: "center right",
            backgroundRepeat: "no-repeat",
          }}
          className={style["emailBox"]}
        >
          <Grid
            container
            style={{ width: "100%", height: "100%" }}
            columnSpacing={2}
            rowSpacing={{ sm: 0, md: 4 }}
          >
            <Grid item sm={12} lg={6} order={{ lg: 1 }} className={style["iconsElement"]}>
              <Typography style={{ fontSize: "20px", color: "#000000" }}>
                Receive email updates
              </Typography>
              <Grid
                container
                style={{ width: "100%", height: "100%" }}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "start",
                  alignItems: "start",
                  paddingTop: "10px",
                }}
              >
                <Grid
                  item
                  sm={12}
                  md={8}
                  order={{ lg: 1 }}
                  className={style["iconsElement"]}
                >
                  <OutlinedInput
                    className={`${style["styledInput"]}`}
                    placeholder="Enter your email address"
                    value={email}
                    style={{ color: "#000000", borderColor: "#000000" }}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </Grid>
                <Grid
                  item
                  sm={12}
                  md={4}
                  order={{ lg: 1 }}
                  className={style["iconsElement"]}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ px: "3em", display: { md: "flex" } }}
                    className={style["link"]}
                    onClick={onSubmitEmail}
                  >
                    Subscribe
                  </Button>
                </Grid>
              </Grid>
              <Typography style={{ color: "#000000" }}>
                No spam. Never shared. Opt out at any time.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </>
  );
};

export default BalanceAboutPage;
