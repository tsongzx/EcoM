import React, { useState } from "react";
import { fetchCompanies } from "../helper";
import { AsyncPaginate } from "react-select-async-paginate";

//takes in a function that retuns which company id was send
const CompanySearch = ({ handleSelectedCompanyId, props }) => {
  const [selected, setSelected] = useState(null);

  const handleOnSubmit = (selectedOption) => {
    setSelected(null);
    handleSelectedCompanyId(selectedOption.value, selectedOption.label);
  }
  return (
    <AsyncPaginate
      id='companyfilter'
      placeholder="Select Company"
      maxMenuHeight={100}
      loadOptions={fetchCompanies}
      cacheOptions
      value={selected}
      styles={{
        control: (provided) => ({
          ...provided,
          ...props,
        }),
        menu: (provided) => ({
          ...provided,
          ...props
        }),
      }}
      onChange={(selectedOption) => handleOnSubmit(selectedOption)}
      additional={{
        page: 1,
      }}></AsyncPaginate>
  );
}

export default CompanySearch;