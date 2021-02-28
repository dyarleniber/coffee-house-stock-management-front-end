import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import useProducts from "../../src/hooks/useProducts";
import Layout from "../../src/components/Layout";
import CustomTable from "../../src/components/CustomTable";

const useStyles = makeStyles((theme) => ({
  title: {
    margin: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
}));

const columns = [
  { name: "id", label: "ID", align: "left" },
  { name: "name", label: "Name", align: "left" },
  { name: "description", label: "Description", align: "left" },
  { name: "quantity", label: "Quantity", align: "left" },
  { name: "price", label: "Price", align: "left" },
  { name: ["category", "name"], label: "Category", align: "left" },
];

export default function List() {
  const router = useRouter();

  const classes = useStyles();

  const { query } = router;

  const { products, page, total, limit, isLoading, isError } = useProducts(
    query
  );

  return (
    <Layout>
      <Typography className={classes.title} variant="h4" gutterBottom>
        Products list
      </Typography>
      <CustomTable
        columns={columns}
        rows={products}
        isLoading={isLoading}
        isError={isError}
        pagination={true}
        page={page}
        total={total}
        limit={limit}
      />
    </Layout>
  );
}
