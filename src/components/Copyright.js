import Typography from "@material-ui/core/Typography";
import appConfig from "../config/app";

export default function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      {appConfig.name} {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
