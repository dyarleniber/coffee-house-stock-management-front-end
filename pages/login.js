import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Copyright from "../src/components/Copyright";
import Logo from "../src/components/Logo";
import api from "../src/services/api";
import { getAPIValidationError } from "../src/utils/validation";

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
  const router = useRouter();

  const classes = useStyles();

  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const handleErrorClose = (event, reason) => {
    if (reason !== "clickaway") {
      setErrorOpen(false);
    }
  };

  const onSubmit = async (data) => {
    if (isLoading) return;
    const { email, password } = data;
    try {
      setLoading(true);
      setErrorMessage("");
      setErrorOpen(false);
      const response = await api.post("/login", { email, password });
      console.log(response.data);
      router.push("/products");
    } catch (e) {
      setLoading(false);
      const message = "Incorrect email or password";
      const error = getAPIValidationError(e.response, message);
      setErrorMessage(error);
      setErrorOpen(true);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <div className={classes.logo}>
          <Logo />
        </div>

        <Snackbar
          open={errorOpen}
          autoHideDuration={6000}
          onClose={handleErrorClose}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleErrorClose}
            severity="error"
          >
            {errorMessage}
          </MuiAlert>
        </Snackbar>

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
            disabled={isLoading}
          >
            {isLoading ? "Loading…" : "Log In"}
          </Button>
        </form>
      </div>

      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
