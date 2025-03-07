import React, { useState } from "react";

const SearchForm = ({ onSearch }) => {
  const [searchCriteria, setSearchCriteria] = useState({
    type: "",
    minPrice: "",
    maxPrice: "",
    minBedrooms: "",
    maxBedrooms: "",
    postcode: "",
    location: "", // Added location field
    dateAdded: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({
      ...searchCriteria,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchCriteria);
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <h3>Advanced Search</h3>

      <div className="form-group">
        <label htmlFor="type">Property Type:</label>
        <input
          type="text"
          id="type"
          name="type"
          value={searchCriteria.type}
          onChange={handleInputChange}
          placeholder="e.g., House, Apartment"
        />
      </div>

      <div className="form-group">
        <label htmlFor="minPrice">Minimum Price (£):</label>
        <input
          type="number"
          id="minPrice"
          name="minPrice"
          value={searchCriteria.minPrice}
          onChange={handleInputChange}
          placeholder="e.g., 100000"
        />
      </div>

      <div className="form-group">
        <label htmlFor="maxPrice">Maximum Price (£):</label>
        <input
          type="number"
          id="maxPrice"
          name="maxPrice"
          value={searchCriteria.maxPrice}
          onChange={handleInputChange}
          placeholder="e.g., 500000"
        />
      </div>

      <div className="form-group">
        <label htmlFor="minBedrooms">Minimum Bedrooms:</label>
        <input
          type="number"
          id="minBedrooms"
          name="minBedrooms"
          value={searchCriteria.minBedrooms}
          onChange={handleInputChange}
          placeholder="e.g., 1"
        />
      </div>

      <div className="form-group">
        <label htmlFor="maxBedrooms">Maximum Bedrooms:</label>
        <input
          type="number"
          id="maxBedrooms"
          name="maxBedrooms"
          value={searchCriteria.maxBedrooms}
          onChange={handleInputChange}
          placeholder="e.g., 5"
        />
      </div>

      <div className="form-group">
        <label htmlFor="postcode">Postcode:</label>
        <input
          type="text"
          id="postcode"
          name="postcode"
          value={searchCriteria.postcode}
          onChange={handleInputChange}
          placeholder="e.g., SW1A"
        />
      </div>

      <div className="form-group">
        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          name="location"
          value={searchCriteria.location}
          onChange={handleInputChange}
          placeholder="e.g., London, Colombo"
        />
      </div>

      <div className="form-group">
        <label htmlFor="dateAdded">Date Added (After):</label>
        <input
          type="date"
          id="dateAdded"
          name="dateAdded"
          value={searchCriteria.dateAdded}
          onChange={handleInputChange}
        />
      </div>

      <button type="submit" className="btn-primary">
        Search
      </button>
    </form>
  );
};

export default SearchForm;
