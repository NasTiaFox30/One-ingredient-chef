import { useState } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import SearchBar from "./components/SearchBar";
import RecipeCard from "./components/RecipeCard";
import RecipeDetailScreen from "./components/RecipeDetailScreen";
import { recipes } from "./data/recipes";

export default function App() {

  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  return (
    <>
      <Header />
      <HeroSection />
      <SearchBar onSearch={handleSearch} />
      <div className="container d-flex flex-wrap gap-3 justify-content-center">
        
      </div>
    </>
  );
}
