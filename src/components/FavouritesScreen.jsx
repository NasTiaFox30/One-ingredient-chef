import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { motion } from "framer-motion";

export default function FavouritesScreen({ favourites, onClose }) {

  if (!favourites || favourites.length === 0) {
    return (
      <motion.div
        className="favourites-overlay"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <div className="container text-center">
          <h2>No favourite recipes yet!</h2>
          <Button variant="success" className="mt-4" onClick={onClose}>
            ➕ Add more recipes to your collection!
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="favourites-overlay"
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Your Favourite Recipes ❤️</h2>
          <Button variant="outline-secondary" onClick={onClose}>✖</Button>
        </div>

        <div className="row">
          {sortedFavourites.map((recipe, idx) => (
            <div key={idx} className="col-md-4 mb-4">
              <Card className="shadow-sm h-100">
                <Card.Img variant="top" src={recipe.image} alt={recipe.title} />
                <Card.Body>
                  <Card.Title>{recipe.title}</Card.Title>
                  <Card.Text>⏱ {recipe.time} | {recipe.difficulty}</Card.Text>
                  <Button variant="primary" onClick={() => alert("TODO: Open details")}>
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center my-4">
          <Button variant="success" size="lg" onClick={onClose}>
            ➕ Add more recipes!
          </Button>
        </div>
      </div>
    </motion.div>
  );
}