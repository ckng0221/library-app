import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { createCustomer, getCustomers } from '../api/customer-api';
import { CircularProgress } from '@mui/material';
import { IAlertProps } from '../components/Alert';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth-api';
import { CookieSetOptions } from 'universal-cookie';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

interface IProps {
  alertCompProps: IAlertProps;
  setCookie: (
    name: 'usertoken',
    value: any,
    options?: CookieSetOptions,
  ) => void;
}

export default function SignUp({ alertCompProps, setCookie }: IProps) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const validPassword = validatePassword();
    const validEmail = await validateEmail();

    console.log(data);
    if (!validPassword || !validEmail) return;

    console.log({
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
      address: data.get('address'),
    });

    // Create User
    try {
      setLoading(true);

      await createCustomer({
        name: data.get('name').toString(),
        email: data.get('email').toString(),
        password: data.get('password').toString(),
        address: data.get('address').toString(),
      });

      const res = await login({
        email: data.get('email').toString(),
        password: data.get('password').toString(),
      });
      console.log(res);

      const token = res?.data?.access_token;

      console.log(token);
      setCookie('usertoken', token);

      navigate('/');
      alertCompProps.setSeverity('success');
      alertCompProps.setAlertMessage('Sign up successful!');
      alertCompProps.setSnackOpen(true);
    } catch (err: any) {
      console.error(err);
      alertCompProps.setAutoHideDuration(100000);
      alertCompProps.setSeverity('error');
      const errMsg = JSON.stringify(err?.response?.data);
      alertCompProps.setAlertMessage(errMsg);
      alertCompProps.setSnackOpen(true);
    } finally {
      setLoading(false);
    }
  };
  // password
  const [passwordErr, setPasswordErr] = React.useState(false);
  const [passwordErrText, setPasswordErrText] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [password2, setPassword2] = React.useState('');

  // Email
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrText, setEmailErrText] = React.useState('');
  const [email, setEmail] = React.useState('');

  // loding
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  function validatePassword() {
    setPasswordErr(false);
    setPasswordErrText('');
    if (password !== password2) {
      setPasswordErr(true);
      setPasswordErrText('Password must be the same');
      return false;
    }
    return true;
  }
  async function validateEmail() {
    setEmailError(false);
    setEmailErrText('');
    const users = await getCustomers({ email });
    if (users.data?.length > 0) {
      setEmailError(true);
      setEmailErrText('Email is already in use');
      return false;
    }
    return true;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar> */}
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  error={emailError}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  helperText={emailErrText}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={passwordErr}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password2"
                  label="Confirm password"
                  type="password"
                  id="password2"
                  autoComplete="new-password"
                  error={passwordErr}
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  helperText={passwordErrText}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="address"
                  name="address"
                  fullWidth
                  id="address"
                  label="Address (optional)"
                  autoFocus
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      value="allowExtraEmails"
                      color="primary"
                      required
                    />
                  }
                  label="I agree with the Terms & Conditions"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? (
                <CircularProgress color="inherit" size={30} />
              ) : (
                'Sign Up'
              )}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <span>
                  Already have an account? &nbsp;
                  <Link to="/login" variant="body2" component={RouterLink}>
                    Sign in
                  </Link>
                </span>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
