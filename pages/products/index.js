import { useState } from "react";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useAuth } from "../../src/hooks/useAuth";
import useProducts from "../../src/hooks/useProducts";
import authMiddleware from "../../src/middlewares/auth";
import Layout from "../../src/components/Layout";
import CustomTable from "../../src/components/CustomTable";
import CustomDialog from "../../src/components/CustomDialog";
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

  const { isManager } = useAuth();

  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDialogLoading, setDialogLoading] = useState(false);
  const [product, setProduct] = useState();

  const { query } = router;

  const {
    products,
    page,
    total,
    limit,
    isLoading,
    isError,
    mutate,
  } = useProducts(query);

  const handleNew = () => {
    router.push(`/products/create`);
  };

  const handleEdit = ({ id }) => {
    router.push(`/products/${id}/edit`);
  };

  const handleDelete = async ({ id }) => {
    try {
      setAlertOpen(false);
      await api.delete(`/products/${id}`);
      mutate();
    } catch (e) {
      const error = getAPIValidationError(e.response);
      setAlertSeverity("error");
      setAlertMessage(error);
      setAlertOpen(true);
    }
  };

  const handleQuantityUpdateAction = (row) => {
    setProduct(row);
    setDialogOpen(true);
  };

  const handleQuantityUpdate = async () => {
    if (isDialogLoading) return;

    if (!product) {
      setAlertSeverity("error");
      setAlertMessage("Product not selected");
      setAlertOpen(true);
    }

    try {
      setDialogLoading(true);
      setAlertOpen(false);

      await api.put(`/products/${product?.id}/quantity`, {
        quantity: product?.quantity,
      });

      mutate();

      setAlertSeverity("success");
      setAlertMessage("Product successfully updated");
      setAlertOpen(true);

      setDialogLoading(false);
      setDialogOpen(false);
    } catch (e) {
      setDialogLoading(false);

      const error = getAPIValidationError(e.response);
      setAlertSeverity("error");
      setAlertMessage(error);
      setAlertOpen(true);
    }
  };

  const handleDialogClose = () => {
    if (isDialogLoading) return;

    setDialogOpen(false);
  };

  const handleProductQuantityChange = (e) => {
    setProduct((prevState) => ({ ...prevState, quantity: e.target.value }));
  };

  const handleAlertClose = (event, reason) => {
    if (reason !== "clickaway") {
      setAlertOpen(false);
    }
  };

  const columns = [
    { name: "id", label: "ID", align: "left" },
    { name: "name", label: "Name", align: "left" },
    { name: "description", label: "Description", align: "left" },
    { name: "quantity", label: "Quantity", align: "left" },
    { name: "price", label: "Price", align: "left" },
    { name: ["category", "name"], label: "Category", align: "left" },
  ];

  const actions = [
    {
      label: "Update quantity",
      color: "primary",
      handle: handleQuantityUpdateAction,
    },
  ];

  if (isManager) {
    actions.push({
      label: "Edit",
      color: "primary",
      handle: handleEdit,
    });

    actions.push({
      label: "Delete",
      color: "error",
      handle: handleDelete,
    });
  }

  return (
    <Layout>
      <Typography className={classes.title} variant="h4" gutterBottom>
        Products list
      </Typography>

      {isManager && (
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.button}
          startIcon={<CloudUploadIcon />}
          onClick={handleNew}
        >
          New product
        </Button>
      )}

      <CustomTable
        columns={columns}
        rows={products}
        isLoading={isLoading}
        isError={isError}
        pagination={true}
        page={page}
        total={total}
        limit={limit}
        actions={actions}
      />

      <CustomDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        title={"Update quantity"}
        actionTitle={"Update"}
        handleAction={handleQuantityUpdate}
        isLoading={isDialogLoading}
      >
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {product?.name}
        </Typography>
        <TextField
          id="quantity"
          name="quantity"
          label="Quantity"
          type="number"
          fullWidth
          margin="normal"
          variant="outlined"
          required
          value={product?.quantity}
          onChange={handleProductQuantityChange}
        />
      </CustomDialog>

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
  return authMiddleware(async (context) => {
    return {
      props: {},
    };
  })(context);
}
