import { useEffect, useState } from "react";
import { Button, Card, Alert } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";

import { db } from "../firebase.config";
import { collection, getDocs, doc, getDoc, deleteDoc, orderBy, query } from "firebase/firestore";

export default function FavouritesScreen({ user, onClose }) {
  const [favourites, setFavourites] = useState([]);

  const fetchFavourites = async () => {
    if (!user) return;
    const favRef = collection(db, "users", user.uid, "favourites");
    const q = query(favRef, orderBy("savedAt", "desc"));
    const snapshot = await getDocs(q);

    const favData = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const { recipeId } = docSnap.data();
        const recipeRef = doc(db, "recipes", recipeId);
        const recipeSnap = await getDoc(recipeRef);
        return recipeSnap.exists() ? { id: docSnap.id, ...recipeSnap.data() } : null;
      })
    );

    setFavourites(favData.filter(Boolean));
  };

  const handleRemoveRecipe = async (recipeId) => {
    try {
      if (!user) {
        alert("Please log in to remove recipes.");
        return;
      }
      const favDocRef = doc(db, "users", user.uid, "favourites", recipeId);

      await deleteDoc(favDocRef);
      alert("Recipe removed successfully!");
      fetchFavourites();

    } catch (error) {
      console.error("Error removing recipe:", error);
      alert("Failed to remove recipe.");
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, [user]);

  if (!user) {
    return (
      <motion.div className="favourites-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="container text-center">
          <Alert variant="light">
            <Alert.Heading>Log in first!</Alert.Heading>
            <p>After login ypu will see your recipes :)</p>
          </Alert>
          <Button variant="success" className="mt-4" onClick={onClose}>Go back</Button>
        </div>
      </motion.div>
    );
  }

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
          <Alert variant="light">
            <Alert.Heading>No favourite recipes yet!</Alert.Heading>
            <p>Add your first recipe by clicking button bellow :)</p>
          </Alert>
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

        <div className="d-flex flex-wrap justify-content-start">
          <AnimatePresence>
            {favourites.map(recipe => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <Card style={{ width: "15rem" }} className="col-md-4 mb-4 shadow-sm h-90 m-3">
                  <Card.Img variant="top" src={recipe.image} alt={recipe.title} />
                  <Button variant="danger" className="mt-4 position-absolute top-0 start-100 translate-middle badge bg-danger p-2" onClick={() => handleRemoveRecipe(recipe.id)}>X</Button>
                  <Card.Body>
                    <Card.Title>{recipe.title}</Card.Title>
                    <Card.Text>⏱ {recipe.time} | {recipe.difficulty}</Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
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