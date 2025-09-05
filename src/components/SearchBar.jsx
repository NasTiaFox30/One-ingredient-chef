import {useEffect, useState } from "react";
import { db } from "../firebase.config";
import { collection, getDocs } from "firebase/firestore";

export default function SearchBar({ onSearch }) {
  const [ingredients, setIngredients] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);

  // Fetch ingredients from Firestore 
  useEffect(() => {
    fetchIngredients(); 
  }, []);

  const fetchIngredients = async () => {
    const querySnapshot = await getDocs(collection(db, "ingredients"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setIngredients(data);
  };

  const filtered = ingredients.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const toggleSelect = (ingredient) => {
    let newSelected = selected.includes(ingredient) ?
      selected.filter(i => i !== ingredient) : [...selected, ingredient];

    onSearch(newSelected);
    setSelected(newSelected);
  };

  return (
    <div className="text-center mb-4 px-4">
      <input
        type="text"
        placeholder="Search ingredient..."
        className="form-control w-50 mx-auto mb-3"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
        {filtered.map((item) => (
          <span
            key={item.id}
            className={`badge p-2 ${selected.includes(item.name) ? "bg-success" : "bg-secondary"}`}
            style={{ cursor: "pointer", fontSize: "1rem" }}
            onClick={() => toggleSelect(item.name)}
          >
            {item.icon} {item.name} {selected.includes(item.name) && "✔️"}
          </span>
        ))}
      </div>
  
    </div>
  );
}
