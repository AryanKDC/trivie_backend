import { ReactElement, Suspense, useState } from 'react';
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  Skeleton,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import loginBanner from 'assets/authentication-banners/login.png';
import IconifyIcon from 'components/base/IconifyIcon';
import logo from 'assets/logo/elegant-logo.png';
import Image from 'components/base/Image';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = (): ReactElement => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    try {
      setError('');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:2000/api/v1'}/auth/signin`,
        {
          user_name: username,
          password: password,
        },
      );

      if (response.data.status) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.result));
        navigate('/');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred during login');
    }
  };

  return (
    <Stack
      direction="row"
      bgcolor="background.paper"
      boxShadow={(theme) => theme.shadows[3]}
      height={560}
      width={{ md: 960 }}
    >
      <Stack width={{ md: 0.5 }} m={2.5} gap={10}>
        <Link href="/" width="fit-content">
          <Image src={logo} width={82.6} />
        </Link>
        <Stack alignItems="center" gap={2.5} width={330} mx="auto">
          <Typography variant="h3">Login</Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <FormControl variant="standard" fullWidth>
            <InputLabel shrink htmlFor="username">
              Username
            </InputLabel>
            <TextField
              variant="filled"
              placeholder="Enter your username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconifyIcon icon="ic:baseline-person" />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <FormControl variant="standard" fullWidth>
            <InputLabel shrink htmlFor="password">
              Password
            </InputLabel>
            <TextField
              variant="filled"
              placeholder="********"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
                      {showPassword ? (
                        <IconifyIcon icon="ic:baseline-key-off" />
                      ) : (
                        <IconifyIcon icon="ic:baseline-key" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <Typography
            variant="body1"
            sx={{
              alignSelf: 'flex-end',
            }}
          >
            <Link href="/authentication/forgot-password" underline="hover">
              Forget password
            </Link>
          </Typography>
          <Button variant="contained" fullWidth onClick={handleLogin}>
            Log in
          </Button>
        </Stack>
      </Stack>
      <Suspense
        fallback={
          <Skeleton variant="rectangular" height={1} width={1} sx={{ bgcolor: 'primary.main' }} />
        }
      >
        <Image
          alt="Login banner"
          src={loginBanner}
          sx={{
            width: 0.5,
            display: { xs: 'none', md: 'block' },
          }}
        />
      </Suspense>
    </Stack>
  );
};

export default Login;
