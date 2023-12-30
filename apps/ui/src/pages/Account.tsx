import {
  Breadcrumbs,
  Card,
  CardContent,
  Link,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ICustomer } from '../interfaces/customer';
interface IProps {
  customer: ICustomer;
}

export default function Account(props: IProps) {
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" to="/" component={RouterLink}>
          Home
        </Link>
        <Typography color="text.primary">Account</Typography>
      </Breadcrumbs>
      <br />
      <Typography color="text.secondary">
        (POC only, using the default customer)
      </Typography>
      <br />
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <br />
          <Typography>Name: {props.customer.name}</Typography>
          <Typography>Email: {props.customer.email}</Typography>
          <Typography>Address: {props.customer.address}</Typography>
        </CardContent>
      </Card>
    </>
  );
}
