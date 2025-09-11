import React, { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import "./Dashboard.css";

const categories = [
  { id: 1, name: "კონსპექტები", slug: "konspektebi" },
  { id: 2, name: "რუკები", slug: "rukebi" },
  { id: 3, name: "ილუსტრაციები", slug: "ilustraciebi" },
  { id: 4, name: "ქრონოლოგია", slug: "kronologia" },
  { id: 5, name: "ბრძოლები, აჯანყებები", slug: "brdzolebi_ajankebebi" },
  { id: 6, name: "მსოფლიო ისტორიის მნიშვნელოვანი მოვლენები", slug: "movlenebi" },
  { id: 7, name: "კითხვა-პასუხი", slug: "pasuxi" },
  { id: 8, name: "ზავები,ედიქტები...", slug: "zavebi" },
  { id: 9, name: "დროშები", slug: "tema9" },  
  { id: 10, name: "რა არის ისტორია? ", slug: "istoria" },
];

function Dashboard() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [category, setCategory] = useState(categories[0].slug);
  const [sources, setSources] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddNote = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "notes"), {
        title,
        text,
        category,
        sources,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setText("");
      setCategory(categories[0].slug);
      setSources("");
      alert("ყოჩაღ ირა! ქართველების კიდევ ერთი გამარჯვება ✅");
    } catch (err) {
      console.error("Error adding note: ", err);
      alert("ავატყოფი ერია, არ აიტვირთა ❌");
    }

    setLoading(false);
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <form onSubmit={handleAddNote} className="dashboard-form">
        
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          required
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Sources (links separated by commas)"
          value={sources}
          onChange={(e) => setSources(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Note"}
        </button>
      </form>
    </div>
  );
}

export default Dashboard;
