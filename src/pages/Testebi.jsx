import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import "./Testebi.css";

export default function Testebi() {
  const { noteId } = useParams();
  const navigate = useNavigate();

  const [activeTest, setActiveTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    const fetchTestData = async () => {
      if (!noteId) return;

      setLoading(true);
      setSelectedAnswers({});

      try {
        const docRef = doc(db, "notes", noteId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setActiveTest({ id: docSnap.id, ...docSnap.data() });
        }

        const q = query(
          collection(db, "notes"),
          where("category", "==", "testebi"),
          where("parentId", "==", noteId)
        );
        const snap = await getDocs(q);
        const fetchedQuestions = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        setQuestions(fetchedQuestions);
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [noteId]);

  const handleOptionClick = (questionId, optionIndex) => {
    if (selectedAnswers[questionId] !== undefined) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <h1 className="quiz-title">კითხვები იტვირთება...</h1>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-questions-view">
        <button className="quiz-back-btn" onClick={() => navigate("/category/testebi")}>
          ← ტესტებში დაბრუნება
        </button>

        <h1 className="quiz-title">{activeTest?.title || "ტესტი"}</h1>

        {questions.length === 0 ? (
          <p className="no-questions">ამ ტესტში კითხვები ჯერ არ არის დამატებული.</p>
        ) : (
          <div className="quiz-list">
            {questions.map((q, qIndex) => {
              const selected = selectedAnswers[q.id];
              const isAnswered = selected !== undefined;

              return (
                <div key={q.id} className="quiz-card">
                  <h3 className="quiz-question">
                    {qIndex + 1}. {q.question}
                  </h3>

                  <div className="options-grid">
                    {q.options?.map((option, idx) => {
                      let statusClass = "";

                      if (isAnswered) {
                        if (idx === q.correctIndex) {
                          statusClass = "correct";
                        } else if (idx === selected) {
                          statusClass = "incorrect";
                        } else {
                          statusClass = "disabled";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          className={`option-btn ${statusClass}`}
                          onClick={() => handleOptionClick(q.id, idx)}
                          disabled={isAnswered}
                        >
                          <span className="option-text">{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}