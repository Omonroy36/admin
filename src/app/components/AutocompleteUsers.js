// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import React from "react";
import { TextField, CircularProgress, Button } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import useDebounce from "../hooks/useDebounce";
import axios from "../../axios";

export  function AutocompleteUsers({ buttonLabel,addTo, cohort_id, setState, button_label,size, width, ...rest }) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [select, setSelect] = React.useState("");
  const [value, setValue] = React.useState(null);
  // Searching status (whether there is pending API request)
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  const searchUsers = (searchTerm) => {
    setLoading(true)
    axios.get(`${process.env.REACT_APP_API_HOST}/v1/auth/user?like=${searchTerm}`)
      .then(({ data }) => {
        setLoading(false);
        setOptions(data);
        console.log(data)
      })
      .catch(error => console.log(error))
  }

  React.useEffect(() => {
    if (debouncedSearchTerm) {
      searchUsers(debouncedSearchTerm);
    } else {
      setOptions([]);
    }

  }, [debouncedSearchTerm]);


  return (
    <>
      <Autocomplete
        {...rest}
        id="asynchronous-demo"
        style={{ width: width }}
        open={open}
        size={size}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        value={value}
        onChange={(e, newValue) => {
            setValue(newValue);
            setState(newValue);
        }}
        getOptionLabel={option => `${option.first_name} ${option.last_name}, (${option.email})`}
        options={options}
        loading={loading}
        renderInput={params => (
          <TextField
            {...params}
            label="Search users"
            fullWidth
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              )
            }}
          />
        )}
      />
      {buttonLabel ? <Button className="ml-3 px-7 font-medium text-primary bg-light-primary whitespace-pre" onClick={() => addTo(select)}>
          {buttonLabel}
        </Button> : ""}
    </>
  );
}
