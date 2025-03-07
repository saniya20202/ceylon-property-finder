import React from "react";
import './FavoritesList.css';

const FavoritesList = ({
  favorites = [],
  onRemoveFavorite = () => {},
  onImageClick = () => {},
  onClearFavorites = () => {},
  onDragStart = () => {},
  onDropFavorite = () => {},
  onDragOverFavorite = () => {},
}) => {
  return (
    <div
      className="favorites-list"
      onDragOver={(event) => event.preventDefault()} // Allow drop
      onDrop={(event) => onDropFavorite(event, "favorites")}
    >
      <h2>Favorites</h2>
      {favorites.length === 0 ? (
        <p>No favorites added yet!</p>
      ) : (
        <>
          <button className="clear-all-btn" onClick={onClearFavorites}>
            Clear All Favorites
          </button>
          {favorites.map((property, index) => (
            <div
              key={property.id}
              className="property-card"
              draggable
              onDragStart={(event) => onDragStart(event, property, index)}
              onDragOver={(event) => onDragOverFavorite(event, index)}
              onDrop={(event) => onDropFavorite(event, "reorder", index)}
            >
              <div className="property-image">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0]}
                    alt={property.type}
                    onClick={() => onImageClick(property, 0)}
                  />
                ) : (
                  <p>No image available</p>
                )}
              </div>
              <div className="property-details">
                <h3>{property.type}</h3>
                <p>Price: £{property.price}</p>
                <button onClick={() => onRemoveFavorite(property.id)}>
                  Remove from Favorites
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FavoritesList;
