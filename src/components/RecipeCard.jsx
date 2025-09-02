import { Card, Button } from "react-bootstrap";

export default function RecipeCard({ recipe, onShow }) {
  return (
    <Card style={{ width: "18rem" }} className="mb-4 shadow-sm">
      <Card.Img variant="top" src={recipe.image} />
      <Card.Body>
        <Card.Title>{recipe.title}</Card.Title>
        <Card.Text>⏱ {recipe.time} | ⚡ {recipe.difficulty}</Card.Text>
        <Button variant="outline-success" onClick={() => onShow(recipe)}>Lets cook!</Button>
      </Card.Body>
    </Card>
  );
}
