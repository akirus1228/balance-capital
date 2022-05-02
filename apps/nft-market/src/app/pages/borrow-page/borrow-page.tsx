import { Container } from "@mui/material";
import AssetList from "../../components/asset-list/asset-list";
import style from "./borrow-page.module.scss";

export const BorrowPage = (): JSX.Element => {
  return (
    <Container className={style["borrowPageContainer"]} maxWidth={`xl`}>
      <h1>Choose an asset to collateralize</h1>
      <AssetList sx={{ mt: "2em" }} />
    </Container>
  );
};

export default BorrowPage;
