import { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import managerMiddleware from "../../../src/middlewares/manager";
import Layout from "../../../src/components/Layout";
import ReactHookFormSelect from "../../../src/components/ReactHookFormSelect";
import api from "../../../src/services/api";
import { getAPIValidationError } from "../../../src/utils/validation";
import { toSerializable } from "../../../src/utils/json";
import { ROLES, ROLES_LABEL } from "../../../src/constants/role";

const useStyles = makeStyles((theme) => ({
  title: {
    margin: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  form: {
    width: "100%",
  },
  formControl: {
    width: "100%",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const schema = yup.object().shape({
  name: yup.string().required("Required field"),
  email: yup.string().required("Required field").email(),
  password: yup.string(),
  roleId: yup.number().required("Required field").oneOf(ROLES),
});

export default function Edit({ user }) {
  const classes = useStyles();

  const [isLoading, setLoading] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);

  const { register, control, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user.name,
      email: user.email,
      roleId: user.roleId,
    },
  });

  const onSubmit = async (data) => {
    if (isLoading) return;

    try {
      setLoading(true);
      setAlertOpen(false);

      if (!data.password) {
        delete data.password;
      }

      await api.put(`/users/${user.id}`, data);

      setAlertSeverity("success");
      setAlertMessage("User successfully updated");
      setAlertOpen(true);

      setLoading(false);
    } catch (e) {
      setLoading(false);

      const error = getAPIValidationError(e.response);
      setAlertSeverity("error");
      setAlertMessage(error);
      setAlertOpen(true);
    }
  };

  const handleAlertClose = (event, reason) => {
    if (reason !== "clickaway") {
      setAlertOpen(false);
    }
  };

  return (
    <Layout>
      <Typography className={classes.title} variant="h4" gutterBottom>
        Update user
      </Typography>

      <form
        className={classes.form}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <ReactHookFormSelect
              id="roleId"
              name="roleId"
              label="Role"
              fullWidth
              margin="normal"
              variant="outlined"
              defaultValue={""}
              required
              control={control}
              error={!!errors.roleId?.message}
            >
              <MenuItem value="">Role</MenuItem>
              {ROLES.map((role) => (
                <MenuItem value={role} key={role}>
                  {ROLES_LABEL[role - 1]}
                </MenuItem>
              ))}
            </ReactHookFormSelect>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="name"
              name="name"
              label="Name"
              fullWidth
              margin="normal"
              variant="outlined"
              required
              inputRef={register}
              error={!!errors.name?.message}
              helperText={errors.name?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="email"
              name="email"
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              variant="outlined"
              required
              inputRef={register}
              error={!!errors.email?.message}
              helperText={errors.email?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="password"
              name="password"
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
              inputRef={register}
              error={!!errors.password?.message}
              helperText={errors.password?.message}
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          fullWidth
          color="primary"
          variant="contained"
          className={classes.submit}
          disabled={isLoading}
        >
          {isLoading ? "Loading…" : "Update"}
        </Button>
      </form>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleAlertClose}
          severity={alertSeverity}
        >
          {alertMessage}
        </MuiAlert>
      </Snackbar>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  return managerMiddleware(async (context) => {
    const { id } = context.params;

    const userResponse = await api.get(`/users/${id}`);
    const user = userResponse.data;
    if (!user) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        user: toSerializable(user),
      },
    };
  })(context);
}
