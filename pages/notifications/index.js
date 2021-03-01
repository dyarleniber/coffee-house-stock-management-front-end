import { useState } from "react";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import useNotifications from "../../src/hooks/useNotifications";
import authMiddleware from "../../src/middlewares/auth";
import Layout from "../../src/components/Layout";
import CustomTable from "../../src/components/CustomTable";
import api from "../../src/services/api";
import { getAPIValidationError } from "../../src/utils/validation";

const useStyles = makeStyles((theme) => ({
  title: {
    margin: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
}));

export default function List() {
  const router = useRouter();

  const classes = useStyles();

  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);

  const { query } = router;

  const {
    notifications,
    page,
    total,
    limit,
    isLoading,
    isError,
    mutate,
  } = useNotifications(query);

  const handleDelete = async ({ id }) => {
    try {
      setAlertOpen(false);
      await api.delete(`/notifications/${id}`);
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
    { name: "description", label: "Description", align: "left" },
  ];

  const actions = [
    {
      label: "Delete",
      color: "error",
      handle: handleDelete,
    },
  ];

  return (
    <Layout>
      <Typography className={classes.title} variant="h4" gutterBottom>
        Notifications
      </Typography>

      <CustomTable
        columns={columns}
        rows={notifications}
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
  return authMiddleware(async () => {
    return {
      props: {},
    };
  })(context);
}
