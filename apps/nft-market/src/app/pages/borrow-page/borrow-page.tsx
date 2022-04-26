import AssetList from "../../components/asset-list/asset-list";
import style from "./borrow-page.module.scss";

export const BorrowPage = (): JSX.Element => {
  return (
    <div>
      <h1>Welcome to BorrowPage!</h1>
      <AssetList />
    </div>
  );
};

export default BorrowPage;
