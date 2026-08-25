import React, { useState } from "react";
import { db } from "../firebase"; // adjust your firebase config path
import { collection, addDoc } from "firebase/firestore";

export default function AdminQuizUpload() {
  const [topicName, setTopicName] = useState("ტესტი №1");
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctIndex, setCorrectIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUploadSingle = async (e) => {
    e.preventDefault();
    if (!question || !optionA || !optionB) {
      alert("გთხოვთ შეავსოთ კითხვა და მინიმუმ 2 სავარაუდო პასუხი");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await addDoc(collection(db, "quizzes"), {
        quizTitle: topicName,
        question: question.trim(),
        options: [
          `ა) ${optionA.trim()}`,
          `ბ) ${optionB.trim()}`,
          `გ) ${optionC.trim()}`,
          `დ) ${optionD.trim()}`
        ].filter(opt => opt.length > 3),
        correctIndex: Number(correctIndex),
        createdAt: new Date()
      });

      setMessage("კითხვა წარმატებით აიტვირთა!");
      setQuestion("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setOptionD("");
      setCorrectIndex(0);
    } catch (err) {
      console.error(err);
      setMessage("შეცდომა ატვირთვისას");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", background: "#fff", borderRadius: "12px" }}>
      <h2>ტესტის კითხვების დამატება</h2>
      {message && <p style={{ color: message.includes("შეცდომა") ? "red" : "green" }}>{message}</p>}

      <form onSubmit={handleUploadSingle} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <label>ტესტის სათაური / კატეგორია:</label>
        <input 
          type="text" 
          value={topicName} 
          onChange={(e) => setTopicName(e.target.value)} 
          required 
        />

        <label>კითხვა:</label>
        <textarea 
          rows="3" 
          value={question} 
          onChange={(e) => setQuestion(e.target.value)} 
          placeholder="მაგ: რომელი რიტუალური სცენაა ასახული ილუსტრაციაზე?" 
          required 
        />

        <label>პასუხი ა:</label>
        <input type="text" value={optionA} onChange={(e) => setOptionA(e.target.value)} required />

        <label>პასუხი ბ:</label>
        <input type="text" value={optionB} onChange={(e) => setOptionB(e.target.value)} required />

        <label>პასუხი გ:</label>
        <input type="text" value={optionC} onChange={(e) => setOptionC(e.target.value)} />

        <label>პასუხი დ:</label>
        <input type="text" value={optionD} onChange={(e) => setOptionD(e.target.value)} />

        <label>სწორი პასუხი:</label>
        <select value={correctIndex} onChange={(e) => setCorrectIndex(e.target.value)}>
          <option value={0}>ა</option>
          <option value={1}>ბ</option>
          <option value={2}>გ</option>
          <option value={3}>დ</option>
        </select>

        <button type="submit" disabled={loading} style={{ padding: "12px", background: "#542E1E", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>
          {loading ? "იტვირთება..." : "კითხვის დამატება"}
        </button>
      </form>
    </div>
  );
}