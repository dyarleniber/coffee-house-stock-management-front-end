import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    width: "100%",
    maxHeight: 440,
  },
  skeleton: {
    width: "100%",
  },
}));

export default function CustomTable({
  columns,
  rows,
  isLoading,
  isError,
  pagination,
  page,
  total,
  limit,
}) {
  const router = useRouter();

  const classes = useStyles();

  const { pathname, query } = router;

  const handleChangePage = (event, newPage) => {
    const url = {
      pathname,
      query: { ...query, page: newPage + 1 },
    };
    const as = undefined;
    const options = { shallow: true };
    router.push(url, as, options);
  };

  return (
    <>
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
                    {!rows?.length && (
                      <TableRow hover>
                        <TableCell colSpan={columns.length} align={"center"}>
                          No records found
                        </TableCell>
                      </TableRow>
                    )}
                    {rows.map((row, index) => {
                      return (
                        <TableRow hover key={`${row.name}-${index}`}>
                          {columns.map((column) => {
                            const value = Array.isArray(column.name)
                              ? row[column.name[0]][column.name[1]]
                              : row[column.name];
                            return (
                              <TableCell
                                key={`${column.name}-${index}`}
                                align={column.align}
                              >
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
              {pagination && (
                <TablePagination
                  component="div"
                  count={total}
                  rowsPerPage={limit}
                  rowsPerPageOptions={[limit]}
                  page={page - 1}
                  onChangePage={handleChangePage}
                />
              )}
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
    </>
  );
}
