import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import managerMiddleware from "../../src/middlewares/manager";
import useRoles from "../../src/hooks/useRoles";
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
];

export default function List() {
  const classes = useStyles();

  const { roles, isLoading, isError } = useRoles();

  return (
    <Layout>
      <Typography className={classes.title} variant="h4" gutterBottom>
        Roles list
      </Typography>
      <CustomTable
        columns={columns}
        rows={roles}
        isLoading={isLoading}
        isError={isError}
      />
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
