import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Copyright from "../src/components/Copyright";
import Logo from "../src/components/Logo";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logo: {
    margin: theme.spacing(1),
    width: "220px",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const schema = yup.object().shape({
  email: yup.string().required("Required field").email("Invalid email"),
  password: yup.string().required("Required field"),
});

export default function Login() {
  const classes = useStyles();

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => console.log(data);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div className={classes.logo}>
          <Logo />
        </div>
        <form
          className={classes.form}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            id="email"
            name="email"
            label="Email address"
            fullWidth
            margin="normal"
            variant="outlined"
            autoFocus
            required
            inputRef={register}
            error={!!errors.email?.message}
            helperText={errors.email?.message}
          />
          <TextField
            id="password"
            name="password"
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            autoFocus
            required
            inputRef={register}
            error={!!errors.password?.message}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            fullWidth
            color="primary"
            variant="contained"
            className={classes.submit}
          >
            Log In
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
