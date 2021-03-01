import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
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
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Box from "@material-ui/core/Box";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { useAuth } from "../hooks/useAuth";
import Logo from "../components/Logo";
import Copyright from "../components/Copyright";
import appConfig from "../config/app";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  appName: {
    flexGrow: 1,
  },
  logo: {
    margin: theme.spacing(4),
  },
}));

const { name, menuItems } = appConfig;

export default function Layout({ children }) {
  const classes = useStyles();
  const theme = useTheme();

  const router = useRouter();

  const { isManager, signOut } = useAuth();

  let breadcrumbs;
  breadcrumbs = router.pathname?.replace("/[id]", "");
  breadcrumbs = breadcrumbs.split("/");
  breadcrumbs = [appConfig.name, ...breadcrumbs];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOut();
    router.push("/login");
  };

  const drawer = (
    <div>
      <div className={classes.toolbar}>
        <div className={classes.logo}>
          <Logo />
        </div>
      </div>
      <Divider />
      <List>
        {menuItems.map((menu) => {
          if (!menu.manager || isManager) {
            return (
              <Link href={menu.link} passHref key={menu.name}>
                <ListItem button component="a">
                  <ListItemIcon>
                    <ArrowRight />
                  </ListItemIcon>
                  <ListItemText primary={menu.name} />
                </ListItem>
              </Link>
            );
          }
        })}
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
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
              <MenuItem onClick={handleLogout}>Log out</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
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
