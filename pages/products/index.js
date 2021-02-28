import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import useProducts from "../../src/hooks/useProducts";
import Layout from "../../src/components/Layout";

const useStyles = makeStyles((theme) => ({
  title: {
    margin: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  root: {
    width: "100%",
  },
  container: {
    width: "100%",
  },
  skeleton: {
    width: "100%",
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
  const classes = useStyles();

  const { products, isLoading, isError } = useProducts();

  return (
    <Layout>
      <Typography className={classes.title} variant="h4" gutterBottom>
        Products list
      </Typography>

      {isError ? (
        <Typography variant="h6" gutterBottom>
          Something went wrong, try again later
        </Typography>
      ) : (
        <>
          {!isLoading ? (
            <Paper className={classes.root}>
              <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell key={column.label} align={column.align}>
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((row) => {
                      return (
                        <TableRow hover key={row.name}>
                          {columns.map((column) => {
                            const value = Array.isArray(column.name)
                              ? row[column.name[0]][column.name[1]]
                              : row[column.name];
                            return (
                              <TableCell key={column.name} align={column.align}>
                                {column.format ? column.format(value) : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ) : (
            <div className={classes.skeleton}>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
