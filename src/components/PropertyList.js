import React, { useState } from "react";
import "./PropertyList.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css"; // Ensure you import the styles

const PropertyList = ({ properties, onAddFavorite, onDragStart }) => {
  const [selectedProperty, setSelectedProperty] = useState(null); // For storing the selected property for details view
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // For storing the selected image index
  const [showFloorPlan, setShowFloorPlan] = useState(false); // To toggle the floor plan view

  const handleImageClick = (property, index) => {
    setSelectedProperty(property);
    setSelectedImageIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedProperty(null);
    setSelectedImageIndex(0);
    setShowFloorPlan(false);
  };

  const handleFloorPlanToggle = () => {
    setShowFloorPlan(!showFloorPlan); // Toggle floor plan visibility
  };

  return (
    <div>
      {/* All Properties View */}
      <div className="property-list-horizontal">
        {properties.map((property) => (
          <div
            key={property.id}
            className="property-card-horizontal"
            draggable
            onDragStart={(e) => onDragStart(e, property)}
          >
            <img
              src={property.images[0]}
              alt={property.descriptionOne}
              onClick={() => handleImageClick(property, 0)} // Display property details when image is clicked
            />
            <div className="property-details-horizontal">
              <p className="property-description">{property.descriptionOne}</p> {/* Description One */}
              <p>Price: ${property.price}</p>
              <p>Type: {property.type}</p>
              <p>Bedrooms: {property.bedrooms}</p>
              <button onClick={() => onAddFavorite(property)}>
                Add to Favorites
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for showing property details */}
      {selectedProperty && (
        <div className="property-modal">
          <div className="property-modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>
              {selectedProperty.type} - ${selectedProperty.price}
            </h2>

            {/* React Tabs for Description, Floor Plan, and Google Map */}
            <Tabs>
              <TabList>
                <Tab>Description</Tab>
                <Tab>Floor Plan</Tab>
                <Tab>Google Map</Tab>
              </TabList>

              <TabPanel>
                <h3>{selectedProperty.type} - ${selectedProperty.price}</h3>
                <p>{selectedProperty.descriptionTwo}</p> {/* Description Two */}
              </TabPanel>

              <TabPanel>
                <h3>Floor Plan</h3>
                {selectedProperty.floorPlan ? (
                  <img
                    src={selectedProperty.floorPlan}
                    alt="Floor Plan"
                    style={{ width: "100%", marginTop: "10px" }}
                  />
                ) : (
                  <p>No floor plan available</p>
                )}
              </TabPanel>

              <TabPanel>
                <h3>Location</h3>
                <iframe
                  title="Google Maps"
                  src={`https://www.google.com/maps?q=${selectedProperty.location.latitude},${selectedProperty.location.longitude}&output=embed`}
                  style={{ width: "100%", height: "300px", border: 0 }}
                  allowFullScreen=""
                ></iframe>
              </TabPanel>
            </Tabs>

            {/* Property Image Gallery */}
            <div className="property-images">
              <img
                src={selectedProperty.images[selectedImageIndex]}
                alt={selectedProperty.descriptionTwo}
                style={{ width: "100%" }}
              />
              <p className="image-description">
                {selectedProperty.imageDescriptions &&
                  selectedProperty.imageDescriptions[selectedImageIndex]}
              </p>
              <div className="image-thumbnails">
                {selectedProperty.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index}`}
                    onClick={() => setSelectedImageIndex(index)}
                    className={selectedImageIndex === index ? "active" : ""}
                    style={{
                      width: "60px",
                      marginRight: "5px",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Additional Property Details */}
            <p>
              <strong>Bedrooms:</strong> {selectedProperty.bedrooms}
            </p>
            <p>
              <strong>Postcode:</strong> {selectedProperty.postcode}
            </p>
            <button onClick={() => onAddFavorite(selectedProperty)}>
              Add to Favorites
            </button>

            {/* Floor Plan Toggle Button */}
            <button className="floor-plan-button" onClick={handleFloorPlanToggle}>
              {showFloorPlan ? "Hide Floor Plan" : "Look Floor Plans"}
            </button>

            {/* Show Floor Plan if toggled */}
            {showFloorPlan && (
              <div className="floor-plan">
                <h3>Floor Plan:</h3>
                {selectedProperty.floorPlan ? (
                  <img
                    src={selectedProperty.floorPlan}
                    alt="Floor Plan"
                    style={{ width: "100%", marginTop: "10px" }}
                  />
                ) : (
                  <p>No floor plan available</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyList;
