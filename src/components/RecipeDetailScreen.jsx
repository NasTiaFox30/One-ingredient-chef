import { useState } from "react";
import { Button } from "react-bootstrap";
import { motion } from "framer-motion";

export default function RecipeDetailScreen({ recipe, onClose, onSaveRecipe }) {
  const [portion, setPortion] = useState(1);

  if (!recipe) return null;

  const handleSaveRecipe = async () => {
    if (!user) {
      alert("Please login to save recipes!");
      return;
    }
    await addDoc(collection(db, "favourites"), {
      userId: user.uid,
      recipeId: recipe.id,
      title: recipe.title,
      image: recipe.image,
      time: recipe.time,
      difficulty: recipe.difficulty,
      savedAt: serverTimestamp()
    });
    alert("Recipe saved to favourites! ❤️");
  };

  return (
    <motion.div
      className="recipe-detail-overlay"
      initial={{ opacity: 0, y: 90 }}     
      animate={{ opacity: 1, y: 0 }}      
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.4, ease: "easeInOut" }} 
    >
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>{recipe.title}</h2>
          <Button variant="outline-secondary" onClick={onClose}>✖</Button>
        </div>
        
        <p className="text-muted">{recipe.description}</p>

        <div className="recipe-image mb-4">
          <img src={recipe.image} className="img-fluid rounded shadow" alt={recipe.title}/>
        </div>

        <div className="mb-4"><strong>Cookig Time:</strong> ⏱ {recipe.time}</div>

        <div className="mb-4">
          <strong>Yield:</strong>
          <div className="d-flex gap-2 mt-2">
            {[0.5, 1, 2].map(val => (
              <Button
                key={val}
                variant={portion === val ? "success" : "outline-success"}
                onClick={() => setPortion(val)}
              >
                {val === 1 ? "1x" : val === 0.5 ? "½x" : "2x"}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4>Ingredients:</h4>
          <div className="d-flex flex-wrap gap-2">
            {recipe.ingredients.map((i, idx) => (
              <div key={idx} className="ingredient-card">
                {i.icon}{i.name} – {i.qty}
                {i.canReplace && (
                  <Button variant="outline-warning" size="sm" className="ms-2">🔄 Change product</Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4>Step by step:</h4>
          <ol>
            {recipe.steps.map((step, idx) => (
              <li key={idx} className="mb-2">{step}</li>
            ))}
          </ol>
        </div>

        <div className="d-flex gap-3 mb-4">
          <Button variant="primary" onClick={handleSaveRecipe}>⭐ Save</Button>
          <Button variant="info">📤 Share</Button>
        </div>
      </div>
    </motion.div>
  );
}
