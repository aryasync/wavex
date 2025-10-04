import { useState } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");

  const fetchItems = async () => {
    const res = await fetch("http://localhost:5000/api/items");
    const data = await res.json();
    setItems(data);
  };

  const addItem = async () => {
    await fetch("http://localhost:5000/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, expiry: "2025-10-10" }),
    });
    setName("");
    fetchItems();
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h1>🧊 Fridge Tracker</h1>
      <input
        placeholder="Add item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={addItem}>Add</button>
      <button onClick={fetchItems}>Refresh</button>

      <ul>
        {items.map((i, idx) => (
          <li key={idx}>
            {i.name} - {i.expiry}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
