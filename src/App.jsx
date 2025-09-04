import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import SearchBar from "./components/SearchBar";
import RecipeCard from "./components/RecipeCard";
import RecipeDetailScreen from "./components/RecipeDetailScreen";
import FavouritesScreen from "./components/FavouritesScreen";

import { db, auth, provider } from "./firebase.config";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export default function App() {

  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const [showFavourites, setShowFavourites] = useState(false);
  const [favourites, setFavourites] = useState([]);

  const [user, setUser] = useState(null);

  //Login/Logout with Google
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  
  const handleSearch = (ingredients) => {
  const results = recipes.filter(r =>
      r.ingredients.some(i => ingredients.includes(i.name))
    );
    setFilteredRecipes(results);
  };

  const handleSaveRecipe = (recipe) => {
  const newRecipe = { ...recipe, savedAt: new Date().toISOString() };
  setFavourites(prev => {
    if (prev.find(r => r.id === recipe.id)) return prev;
    return [newRecipe, ...prev];
  });
};

  
  return (
    <>
      <Header
        onShowFavourites={() => setShowFavourites(true)}
      />
      <HeroSection />
      <SearchBar onSearch={handleSearch} />
      <div className="container d-flex flex-wrap gap-3 justify-content-center">
         {filteredRecipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} onShow={handleShow} />
        ))}
      </div>

      <AnimatePresence>
        {showDetail && (
          <RecipeDetailScreen
            recipe={selectedRecipe}
            onSaveRecipe={() => handleSaveRecipe(selectedRecipe)}
            onClose={() => setShowDetail(false)}
          />
        )}
   
        {showFavourites && (
          <FavouritesScreen
            favourites={favourites}
            onClose={() => setShowFavourites(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
