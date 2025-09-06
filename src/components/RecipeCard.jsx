import { Card, Button } from "react-bootstrap";
import { motion } from "framer-motion";

export default function RecipeCard({ recipe, onShow }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Card style={{ width: "18rem" }} className="mb-4 shadow-sm">
        <Card.Img variant="top" src={recipe.image} />
        <Card.Body>
          <Card.Title>{recipe.title}</Card.Title>
          <Card.Text>⏱ {recipe.time} | ⚡ {recipe.difficulty}</Card.Text>
          <Button variant="outline-success" onClick={() => onShow(recipe)}>Lets cook!</Button>
        </Card.Body>
      </Card>
    </motion.div>
  );
}
