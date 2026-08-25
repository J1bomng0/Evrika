import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import "./Testebi.css";

export default function Testebi() {
  const [testCards, setTestCards] = useState([]);
  const [activeTest, setActiveTest] = useState(null); // Selected card (e.g. N1)
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // 1. Fetch Test Cards on initial load
  useEffect(() => {
    const fetchTestCards = async () => {
      try {
        const q = query(
          collection(db, "notes"),
          where("category", "==", "testebi")
        );
        const snap = await getDocs(q);
        const cards = snap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((item) => !item.parentId) // Only top-level test cards
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        setTestCards(cards);
      } catch (err) {
        console.error("Error fetching test cards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestCards();
  }, []);

  // 2. When student selects a test card, fetch its questions
  const handleSelectTest = async (testCard) => {
    setActiveTest(testCard);
    setQuestionsLoading(true);
    setSelectedAnswers({});

    try {
      const q = query(
        collection(db, "notes"),
        where("category", "==", "testebi"),
        where("parentId", "==", testCard.id)
      );
      const snap = await getDocs(q);
      const fetchedQuestions = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      setQuestions(fetchedQuestions);
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setQuestionsLoading(false);
    }
  };

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
        <h1 className="quiz-title">იტვირთება ტესტები...</h1>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {/* View 1: Test Cards Grid */}
      {!activeTest ? (
        <>
          <h1 className="quiz-title">ტესტები</h1>
          <div className="test-cards-grid">
            {testCards.map((card) => (
              <div
                key={card.id}
                className="test-card-box"
                onClick={() => handleSelectTest(card)}
              >
                <h2>{card.title}</h2>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* View 2: Questions inside selected test */
        <div className="quiz-questions-view">
          <button className="quiz-back-btn" onClick={() => setActiveTest(null)}>
            ← ტესტებში დაბრუნება
          </button>

          <h1 className="quiz-title">{activeTest.title}</h1>

          {questionsLoading ? (
            <p>კითხვები იტვირთება...</p>
          ) : questions.length === 0 ? (
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
      )}
    </div>
  );
}