import { useState } from "react";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import useUsers from "../../src/hooks/useUsers";
import managerMiddleware from "../../src/middlewares/manager";
import Layout from "../../src/components/Layout";
import CustomTable from "../../src/components/CustomTable";
import api from "../../src/services/api";
import { getAPIValidationError } from "../../src/utils/validation";

const useStyles = makeStyles((theme) => ({
  title: {
    margin: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  button: {
    marginBottom: theme.spacing(1),
  },
}));

export default function List() {
  const router = useRouter();

  const classes = useStyles();

  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);

  const { query } = router;

  const { users, page, total, limit, isLoading, isError, mutate } = useUsers(
    query
  );

  const handleNew = () => {
    router.push(`/users/create`);
  };

  const handleEdit = ({ id }) => {
    router.push(`/users/${id}/edit`);
  };

  const handleDelete = async ({ id }) => {
    try {
      setAlertOpen(false);
      await api.delete(`/users/${id}`);
      mutate();
    } catch (e) {
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

  const columns = [
    { name: "id", label: "ID", align: "left" },
    { name: "name", label: "Name", align: "left" },
    { name: "email", label: "Email", align: "left" },
    { name: ["role", "name"], label: "Role", align: "left" },
  ];

  const actions = [
    {
      label: "Edit",
      color: "primary",
      handle: handleEdit,
    },
    {
      label: "Delete",
      color: "error",
      handle: handleDelete,
    },
  ];

  return (
    <Layout>
      <Typography className={classes.title} variant="h4" gutterBottom>
        Users list
      </Typography>

      <Button
        variant="contained"
        color="primary"
        size="small"
        className={classes.button}
        startIcon={<CloudUploadIcon />}
        onClick={handleNew}
      >
        New user
      </Button>

      <CustomTable
        columns={columns}
        rows={users}
        isLoading={isLoading}
        isError={isError}
        pagination={true}
        page={page}
        total={total}
        limit={limit}
        actions={actions}
      />

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
  return managerMiddleware(async () => {
    return {
      props: {},
    };
  })(context);
}
