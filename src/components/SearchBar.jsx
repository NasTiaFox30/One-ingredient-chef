import { useState } from "react";
import { ingredients } from "../data/ingredients";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);

  const filtered = ingredients.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
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
            key={item}
            className={`badge p-2 ${selected.includes(item) ? "bg-success" : "bg-secondary"}`}
            style={{ cursor: "pointer" }}
            onClick={() => toggleSelect(item)}
          >
            {item} {selected.includes(item) && "✔️"}
          </span>
        ))}
      </div>
  
    </div>
  );
}
