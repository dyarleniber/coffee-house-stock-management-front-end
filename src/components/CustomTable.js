import { useState } from "react";
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
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Collapse from "@material-ui/core/Collapse";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    width: "100%",
    maxHeight: 400,
  },
  skeleton: {
    width: "100%",
  },
  action: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
}));

function Row({ row, columns, actions }) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow hover>
        {!!actions && (
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        {columns.map((column, index) => {
          const value = Array.isArray(column.name)
            ? row[column.name[0]][column.name[1]]
            : row[column.name];
          return (
            <TableCell key={`${column.name}-${index}`} align={column.align}>
              {column.format ? column.format(value) : value}
            </TableCell>
          );
        })}
      </TableRow>
      {!!actions && (
        <TableRow>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={columns.length + 1}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Grid container>
                <Grid item>
                  {actions.map((action) => (
                    <Button
                      key={action.label}
                      className={classes.action}
                      variant="contained"
                      color={action.color || "primary"}
                      size="small"
                      onClick={() => action.handle(row)}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Grid>
              </Grid>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default function CustomTable({
  columns,
  rows,
  isLoading,
  isError,
  pagination,
  page,
  total,
  limit,
  actions,
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
                      {!!actions && <TableCell />}
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
                        <TableCell
                          colSpan={
                            actions ? columns.length + 1 : columns.length
                          }
                          align={"center"}
                        >
                          No records found
                        </TableCell>
                      </TableRow>
                    )}
                    {rows.map((row, index) => {
                      return (
                        <Row
                          row={row}
                          columns={columns}
                          actions={actions}
                          key={`${row.name}-${index}`}
                        />
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
