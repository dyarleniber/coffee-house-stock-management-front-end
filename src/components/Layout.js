import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ArrowRight from "@material-ui/icons/ArrowRight";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Box from "@material-ui/core/Box";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Logo from "../components/Logo";
import Copyright from "../components/Copyright";
import appConfig from "../config/app";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  appName: {
    flexGrow: 1,
  },
  logo: {
    margin: theme.spacing(4),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

const { name, menuItems } = appConfig;

export default function Layout({ children }) {
  const classes = useStyles();

  const router = useRouter();

  const routerBreadcrumbs = router.pathname?.split("/");
  const breadcrumbs = [appConfig.name, ...routerBreadcrumbs];

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography className={classes.appName} variant="h6" noWrap>
            {name}
          </Typography>
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Log out</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar}>
          <div className={classes.logo}>
            <Logo />
          </div>
        </div>
        <Divider />
        <List>
          {menuItems.map((menu) => (
            <Link href={menu.link} passHref key={menu.name}>
              <ListItem button component="a">
                <ListItemIcon>
                  <ArrowRight />
                </ListItemIcon>
                <ListItemText primary={menu.name} />
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {!!breadcrumbs?.length && (
          <Breadcrumbs aria-label="breadcrumb">
            {breadcrumbs.map((breadcrumb) => {
              if (breadcrumb) {
                return (
                  <Typography color="inherit" key={breadcrumb}>
                    {breadcrumb}
                  </Typography>
                );
              }
            })}
          </Breadcrumbs>
        )}
        {children}
        <Box mt={8}>
          <Copyright />
        </Box>
      </main>
    </div>
  );
}
