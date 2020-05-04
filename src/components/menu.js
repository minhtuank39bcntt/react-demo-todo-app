import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import SimpleTable from "./table";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from 'uuid';


import { REG_NUMBER_PHONE } from './../consts/'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  cusButton: {},
  tabPanel: {
    textAlign: "left"
  }
}));

export default function SimpleTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState([]);

    // Change componentDidmount
  useEffect(() => {
    let lst = localStorage.getItem('lst');
    if(!lst){
      setData([])
      return;
    }
    lst = JSON.parse(lst);
    setData(lst.data);
  }, []);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClose = e => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const onSubmit = value => {
    value.id = uuidv4();
    let data = [];
    let lstStore = localStorage.getItem('lst'); 
    if(!lstStore){
      data.push(value)
      setData(data);
      localStorage.setItem('lst', JSON.stringify({data}));
      handleClose();
    }
    lstStore = JSON.parse(lstStore);
    data = lstStore.data;
    data.push(value)
    setData(data);
    localStorage.setItem('lst', JSON.stringify({data}));
    handleClose();
  
  }
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Home" {...a11yProps(0)} />
          <Tab label="Insert" {...a11yProps(1)} />
          <Tab label="Contact" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel className={classes.tabPanel} value={value} index={0}>
        <Button
          className={classes.cusButton}
          variant="contained"
          color="primary"
          href="#contained-buttons"
          onClick={handleClickOpen}
        >
          <AddIcon />
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
          <Formik
            initialValues={{ fname: "", fnumber: ""}}
            onSubmit={onSubmit}
            validationSchema={Yup.object().shape({
              fname: Yup.string()
                .min(5, 'Too Short!')
                .max(50, 'Too Long!')
                .required("Required Name ")
                .trim(),
              fnumber: Yup.string()
                .required("Required Number")
                .matches(REG_NUMBER_PHONE, 'Phone number is not valid'),
            })}
          >
            {
              (props) => {
                const {
                  values,
                  touched,
                  errors,
                  isSubmitting,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                } = props;
                return (
                  <form onSubmit={handleSubmit}>
                    <DialogContent>
                      <TextField
                        error={errors.fname && touched.fname}
                        autoFocus
                        margin="dense"
                        id="fname"
                        label="Name"
                        name = "fname"
                        fullWidth
                        value={values.fname}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errorText = {errors.fname}
                        helperText={(errors.fname && touched.fname) && errors.fname}
                      />
                      <TextField
                        margin="dense"
                        id="fnumber"
                        label="Number Phone"
                        name = "fnumber"
                        fullWidth
                        value={values.fnumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={(errors.fnumber && touched.fnumber) && errors.fnumber}
                        error={errors.fnumber && touched.fnumber}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose} color="primary">
                        Cancel
                     </Button>
                      <Button 
                      type="submit" 
                      // onClick={handleClose} 
                      color="primary"
                      disabled={isSubmitting}

                      >
                        Subscribe
                      </Button>
                    </DialogActions>
                  </form>
                )
              } }
            {/* </form>
          </Formik> */}
          </Formik>
        </Dialog>
        <SimpleTable lst={data ? data :[]} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        {/* <SimpleTable lst={lst} /> */}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {/* <SimpleTable /> */}
      </TabPanel>
    </div>
  );
}
