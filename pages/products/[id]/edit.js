import { useState } from "react";
import { useRouter } from "next/router";
import filesize from "filesize";
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
import Layout from "../../../src/components/Layout";
import ReactHookFormSelect from "../../../src/components/ReactHookFormSelect";
import CustomDialog from "../../../src/components/CustomDialog";
import api from "../../../src/services/api";
import { getAPIValidationError } from "../../../src/utils/validation";
import { toSerializable } from "../../../src/utils/json";
import { toFormData } from "../../../src/utils/form";

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
  legend: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  imageContainer: {
    textAlign: "center",
    marginBottom: theme.spacing(1),
  },
  image: {
    maxWidth: "100%",
  },
  upload: {
    margin: theme.spacing(0, 1),
  },
}));

const schema = yup.object().shape({
  name: yup.string().required("Required field"),
  description: yup.string(),
  quantity: yup
    .number()
    .required("Required field")
    .typeError("Must be a number"),
  price: yup.number().required("Required field").typeError("Must be a number"),
  categoryId: yup.number().required("Required field"),
});

export default function Edit({ product, categories }) {
  const router = useRouter();

  const classes = useStyles();

  const [isLoading, setLoading] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { watch, register, control, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: product.name,
      description: product.description,
      quantity: product.quantity,
      price: product.price,
      categoryId: product.categoryId,
    },
  });

  const { image } = watch();

  const onSubmit = async (data) => {
    if (isLoading) return;

    try {
      setLoading(true);
      setAlertOpen(false);

      delete data.image;

      await api.put(`/products/${product.id}`, data);

      setAlertSeverity("success");
      setAlertMessage("Product successfully updated");
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

  const handleImageUpdate = async () => {
    if (isLoading) return;

    try {
      setLoading(true);
      setAlertOpen(false);

      const formData = toFormData({ image });

      await api.put(`/products/${product.id}/file`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      router.reload();
    } catch (e) {
      setLoading(false);

      const error = getAPIValidationError(e.response);
      setAlertSeverity("error");
      setAlertMessage(error);
      setAlertOpen(true);
    }
  };

  const handleDialogOpen = () => {
    if (isLoading) return;

    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    if (isLoading) return;

    setDialogOpen(false);
  };

  const handleAlertClose = (event, reason) => {
    if (reason !== "clickaway") {
      setAlertOpen(false);
    }
  };

  return (
    <Layout>
      <Typography className={classes.title} variant="h4" gutterBottom>
        Update product
      </Typography>

      {!!product.image && (
        <Grid
          className={classes.imageContainer}
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={6} sm={4}>
            <img
              className={classes.image}
              src={product.image.imageUrl}
              alt={"Product image"}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              {filesize(product.image.imageSize)}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {product.image.imageType}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              color="primary"
              variant="contained"
              component="label"
              onClick={handleDialogOpen}
            >
              Update image
            </Button>
          </Grid>
        </Grid>
      )}

      <form
        className={classes.form}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <ReactHookFormSelect
              id="categoryId"
              name="categoryId"
              label="Category"
              fullWidth
              margin="normal"
              variant="outlined"
              required
              control={control}
              error={!!errors.categoryId?.message}
            >
              <MenuItem value="">Category</MenuItem>
              {categories.map((category) => (
                <MenuItem value={category.id} key={category.id}>
                  {category.name}
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
              id="description"
              name="description"
              label="Description"
              fullWidth
              margin="normal"
              variant="outlined"
              inputRef={register}
              error={!!errors.description?.message}
              helperText={errors.description?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="quantity"
              name="quantity"
              label="Quantity"
              type="number"
              fullWidth
              margin="normal"
              variant="outlined"
              required
              inputRef={register}
              error={!!errors.quantity?.message}
              helperText={errors.quantity?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="price"
              name="price"
              label="Price"
              type="number"
              fullWidth
              margin="normal"
              variant="outlined"
              required
              inputRef={register}
              error={!!errors.price?.message}
              helperText={errors.price?.message}
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

      <CustomDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        title={"Update image"}
        actionTitle={"Update"}
        handleAction={handleImageUpdate}
        isLoading={isLoading}
      >
        <Button
          className={classes.upload}
          variant="contained"
          component="label"
        >
          Upload image
          <input
            accept="image/*"
            id="image"
            name="image"
            type="file"
            ref={register}
            hidden
          />
        </Button>

        {!!image && (
          <Typography variant="caption" display="inline" gutterBottom>
            {image?.[0]?.name}
          </Typography>
        )}
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
  const { id } = context.params;

  const productResponse = await api.get(`/products/${id}`);
  const product = productResponse.data;
  if (!product) {
    return {
      notFound: true,
    };
  }

  const categoriesResponse = await api.get("/categories");
  const categories = categoriesResponse.data;

  return {
    props: {
      product: toSerializable(product),
      categories: toSerializable(categories),
    },
  };
}
