import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import managerMiddleware from "../../src/middlewares/manager";
import useUsers from "../../src/hooks/useUsers";
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
  { name: "email", label: "Email", align: "left" },
  { name: ["role", "name"], label: "Role", align: "left" },
];

export default function List() {
  const router = useRouter();

  const classes = useStyles();

  const { query } = router;

  const { users, page, total, limit, isLoading, isError } = useUsers(query);

  return (
    <Layout>
      <Typography className={classes.title} variant="h4" gutterBottom>
        Users list
      </Typography>
      <CustomTable
        columns={columns}
        rows={users}
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

export async function getServerSideProps(context) {
  return managerMiddleware(async (context) => {
    return {
      props: {},
    };
  })(context);
}
