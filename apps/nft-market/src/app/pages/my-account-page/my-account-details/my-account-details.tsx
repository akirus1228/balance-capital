import { Container } from "@mui/material";
import { useSelector } from "react-redux";
import OwnerInfo from "../../../components/owner-info/owner-info";
import { RootState } from "../../../store";
import "./my-account-details.module.scss";

/* eslint-disable-next-line */
export interface MyAccountDetailsProps {}

export function MyAccountDetails(props: MyAccountDetailsProps) {
  const { user } = useSelector((state: RootState) => state.backend);

  return (
    <Container maxWidth="lg">
      <OwnerInfo owner={user} />
    </Container>
  );
}

export default MyAccountDetails;
