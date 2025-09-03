import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import SearchBar from "./components/SearchBar";
import RecipeCard from "./components/RecipeCard";
import RecipeDetailScreen from "./components/RecipeDetailScreen";
import FavouritesScreen from "./components/FavouritesScreen";
import { recipes } from "./data/recipes";

export default function App() {

  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const [showFavourites, setShowFavourites] = useState(false);
  const [favourites, setFavourites] = useState([]);

  const handleShow = (recipe) => {
    setSelectedRecipe(recipe);
    setShowDetail(true);
  };
  
  const handleSearch = (ingredients) => {
  const results = recipes.filter(r =>
      r.ingredients.some(i => ingredients.includes(i.name))
    );
    setFilteredRecipes(results);
  };

  const handleSaveRecipe = (recipe) => {
  const newRecipe = { ...recipe, savedAt: new Date().toISOString() };
    setFavourites(prev => [newRecipe, ...prev]);
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
          <RecipeDetailScreen recipe={selectedRecipe} onSaveRecipe={() => handleSaveRecipe(selectedRecipe)} onClose={() => setShowDetail(false)} />
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
