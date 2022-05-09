import style from "./my-account-page.module.scss";
import MyAccountActiveLoansTable from "./my-account-active-loans-table";

export const MyAccountPage = (): JSX.Element => {
  return (
    <div>
      <h1>Welcome to MyAccountPage!</h1>
      <MyAccountActiveLoansTable listings={[]} />
    </div>
  );
};

export default MyAccountPage;
