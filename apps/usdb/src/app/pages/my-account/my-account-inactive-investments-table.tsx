import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { format } from 'date-fns';
import style from './my-account.module.scss';
import { styled } from '@mui/material/styles';
import Info from '../../../assets/icons/info.svg';
import Investment from './my-account-investments';
import { useSelector } from 'react-redux';

export const currencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#1A1A1A',
    color: '#E3E2EA',
    border: 'none',
  },
  border: 'none',
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border: 'none',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  border: 'none',
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export const MyAccountInactiveInvestmentsTable = ({ investments }: { investments: Investment[] }): JSX.Element => {
  const themeType = useSelector((state: any) => state.app.theme);
  const backgroundColor = themeType === 'light' ? '#f7f7ff' : '#0E0F10';

  return (
    <Paper
      elevation={0}
      sx={{ marginTop: '10px' }}
      className={style['rowCard']}
      style={{ backgroundColor: `${backgroundColor}` }}
    >
      <TableContainer sx={{ marginTop: '10px' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#000', color: '#FFF' }}>
              <StyledTableCell className={style['leftEdge']}>
                Amount{' '}
                <img src={Info} alt="info" className={style['infoIcon']} />{' '}
              </StyledTableCell>
              <StyledTableCell>
                Rewards{' '}
                <img src={Info} alt="info" className={style['infoIcon']} />{' '}
              </StyledTableCell>
              <StyledTableCell>
                Investment{' '}
                <img src={Info} alt="info" className={style['infoIcon']} />{' '}
              </StyledTableCell>
              <StyledTableCell>
                ROI{' '}
                <img src={Info} alt="info" className={style['infoIcon']} />{' '}
              </StyledTableCell>
              <StyledTableCell className={style['rightEdge']}>
                Lock up period{' '}
                <img src={Info} alt="info" className={style['infoIcon']} />{' '}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {investments.map((investment) => (
              <StyledTableRow
                key={investment.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <StyledTableCell
                  component="th"
                  scope="row"
                  className={style['leftEdge']}
                >
                  {currencyFormat.format(investment.amount)}
                </StyledTableCell>
                <StyledTableCell>
                  {currencyFormat.format(investment.rewards)}{' '}
                  {investment.rewardToken}
                </StyledTableCell>
                <StyledTableCell>{investment.displayName}</StyledTableCell>
                <StyledTableCell>{investment.roi}%</StyledTableCell>
                <StyledTableCell className={style['rightEdge']}>
                  Completed {format(new Date(), 'MM/dd/yyyy')}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};



export default MyAccountInactiveInvestmentsTable;
