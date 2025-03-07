import React, { useState, useEffect } from "react";
import PropertyList from "./components/PropertyList";
import FavoritesList from "./components/FavoritesList";
import SearchForm from "./components/SearchForm";
import "./App.css";

const App = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites"));
    return savedFavorites || [];
  });
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentProperty, setCurrentProperty] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [draggedProperty, setDraggedProperty] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Fetch properties.json from the public folder
  useEffect(() => {
    fetch("/properties.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load properties JSON.");
        }
        return response.json();
      })
      .then((data) => {
        setProperties(data);
        setFilteredProperties(data); // Show all properties initially
      })
      .catch((error) => console.error("Error loading properties:", error));
  }, []);

  const addFavorite = (property) => {
    if (!favorites.some((fav) => fav.id === property.id)) {
      const updatedFavorites = [...favorites, property];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  const removeFavorite = (propertyId) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== propertyId);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const clearAllFavorites = () => {
    setFavorites([]); // Clear favorites in state
    localStorage.setItem("favorites", JSON.stringify([])); // Clear favorites in localStorage
  };

  const searchProperties = (criteria) => {
    let results = properties;
    if (criteria.type) results = results.filter((property) => property.type === criteria.type);
    if (criteria.minPrice) results = results.filter((property) => property.price >= criteria.minPrice);
    if (criteria.maxPrice) results = results.filter((property) => property.price <= criteria.maxPrice);
    if (criteria.minBedrooms) results = results.filter((property) => property.bedrooms >= criteria.minBedrooms);
    if (criteria.maxBedrooms) results = results.filter((property) => property.bedrooms <= criteria.maxBedrooms);
    if (criteria.postcode) results = results.filter((property) => property.postcode.startsWith(criteria.postcode));
    if (criteria.dateAdded) {
      results = results.filter((property) => new Date(property.dateAdded) >= new Date(criteria.dateAdded));
    }
    setFilteredProperties(results);
  };

  const filterPropertiesByCategory = (category) => {
    if (category === "all") {
      setFilteredProperties(properties);
    } else {
      setFilteredProperties(properties.filter((property) => property.listingType === category));
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    setFilteredProperties(
      properties.filter((property) =>
        property.type.toLowerCase().includes(query) || // Match property type
        property.postcode.toLowerCase().includes(query) || // Match postcode
        property.location.city.toLowerCase().includes(query) // Match location (new feature)
      )
    );
  };

  const openImagePopup = (property, index) => {
    setCurrentProperty(property);
    setCurrentImageIndex(index);
  };

  const closeImagePopup = () => {
    setCurrentProperty(null);
  };

  const handleNextImage = () => {
    if (currentProperty) {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % currentProperty.images.length
      );
    }
  };

  const handlePreviousImage = () => {
    if (currentProperty) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? currentProperty.images.length - 1 : prevIndex - 1
      );
    }
  };

  const handleDragStart = (event, property, index) => {
    setDraggedProperty(property);
    setDraggedIndex(index);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (event, targetList, targetIndex) => {
    event.preventDefault();

    if (targetList === "favorites") {
      if (!favorites.some((fav) => fav.id === draggedProperty.id)) {
        addFavorite(draggedProperty);
      }
    } else if (targetList === "reorder") {
      const updatedFavorites = [...favorites];
      updatedFavorites.splice(draggedIndex, 1);
      updatedFavorites.splice(targetIndex, 0, draggedProperty);
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } else {
      removeFavorite(draggedProperty.id);
    }

    setDraggedProperty(null);
    setDraggedIndex(null);
  };

  const handleDragOverFavorite = (event, index) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  return (
    <div className="app">
      <section className="hero">
        <div className="hero-content">
          <h1>
            <span className="highlight">Ceylon Property Finder</span> - Your Gateway to Homes in Sri Lanka<br />
          </h1>
          <div className="search-box">
            <input
              type="text"
              placeholder="e.g., House, Apartment, London"
              value={searchQuery}
              onChange={handleSearch}
            />
            <button className="btn-primary" onClick={() => filterPropertiesByCategory("forSale")}>
              For Sale
            </button>
            <button className="btn-secondary" onClick={() => filterPropertiesByCategory("forRent")}>
              To Rent
            </button>
            <button className="btn-tertiary" onClick={() => filterPropertiesByCategory("all")}>
              Show All
            </button>
          </div>
        </div>
      </section>

      <div className="advanced-search-toggle">
        <button
          className="btn-toggle"
          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
        >
          {showAdvancedSearch ? "Hide Advanced Search" : "Show Advanced Search"}
        </button>
      </div>

      {showAdvancedSearch && <SearchForm onSearch={searchProperties} />}

      <div className="main-content">
        <div
          className="property-area"
          onDragOver={(event) => event.preventDefault()} // Allow drop
          onDrop={(event) => handleDrop(event, "mainContent")}
        >
          <PropertyList
            properties={filteredProperties}
            onAddFavorite={addFavorite}
            onImageClick={openImagePopup}
            onDragStart={handleDragStart}
          />
        </div>
        <FavoritesList
          favorites={favorites}
          onRemoveFavorite={removeFavorite}
          onImageClick={openImagePopup}
          onClearFavorites={clearAllFavorites} // Pass the function to clear favorites
          onDragStart={handleDragStart}
          onDropFavorite={handleDrop}
          onDragOverFavorite={handleDragOverFavorite}
        />
      </div>

      {currentProperty && (
        <div className="image-popup">
          <div className="popup-content">
            <span className="close-button" onClick={closeImagePopup}>
              &times;
            </span>
            <button className="prev-button" onClick={handlePreviousImage}>
              &#8592;
            </button>
            <img
              src={currentProperty.images[currentImageIndex]}
              alt={`Property ${currentProperty.id}`}
            />
            <button className="next-button" onClick={handleNextImage}>
              &#8594;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
