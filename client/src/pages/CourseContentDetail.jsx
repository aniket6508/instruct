import React, { useState } from 'react';
import './CourseContentDetail.css';

const chapters = [
  { title: "Vector", emoji: "➡️" },
  { title: "Units and Measurements", emoji: "📏" },
  { title: "Motion in a Straight Line", emoji: "⬆️" },
  { title: "Motion in a Plane", emoji: "↗️" },
  { title: "Newton's Laws of Motion", emoji: "🏃" },
  { title: "Work, Energy & Power", emoji: "⚡" },
  { title: "Centre of Mass & System of Particles", emoji: "🎯" },
  { title: "Rotational Motion", emoji: "🎡" },
  { title: "Gravitation", emoji: "🌍" },
  { title: "Mechanical Properties of Solids", emoji: "🧱" },
  { title: "Mechanical Properties of Fluids", emoji: "💧" },
  { title: "Thermal Properties of Matter", emoji: "🌡️" },
  { title: "Kinetic Theory of Gases", emoji: "💨" },
  { title: "Thermodynamics", emoji: "🔥" },
  { title: "Oscillations", emoji: "↕️" },
  { title: "Waves", emoji: "〰️" },
  { title: "Electric Charges and Fields", emoji: "⚡" },
  { title: "Electrostatic Potential", emoji: "🔋" },
  { title: "Current Electricity", emoji: "💡" },
  { title: "Moving Charges and Magnetism", emoji: "🧲" },
  { title: "Magnetism and Matter", emoji: "🧲" },
  { title: "Electromagnetic Induction", emoji: "⚡" },
  { title: "Alternating Current", emoji: "↔️" },
  { title: "Electromagnetic Waves", emoji: "📻" },
  { title: "Ray Optics and Optical Instruments", emoji: "🔭" },
  { title: "Wave Optics", emoji: "🔦" },
  { title: "Dual Nature of Radiation and Matter", emoji: "🎭" },
  { title: "Atoms", emoji: "⚛️" },
  { title: "Nuclei", emoji: "☢️" },
  { title: "Semiconductor Electronics", emoji: "🗄️" },
];

const nestedDropdowns = [
  { title: "Videos", badge: 3, items: ["Video 1", "Video 2", "Video 3"] },
  { title: "Tests", badge: 2, items: ["Test 1", "Test 2"] },
  { title: "Audio Books", badge: 1, items: ["Audio Book 1"] },
];

function CourseContentDetail() {
  // Store which card is open (only one open at a time)
  const [activeCard, setActiveCard] = useState(null);
  // Store the active nested dropdown for each card (one per card)
  const [activeNested, setActiveNested] = useState({});
  // Search query for filtering chapters
  const [searchQuery, setSearchQuery] = useState("");

  const handleCardToggle = (index) => {
    // Toggle the selected card and close any nested dropdowns
    if (activeCard === index) {
      setActiveCard(null);
      setActiveNested((prev) => ({ ...prev, [index]: null }));
    } else {
      setActiveCard(index);
      setActiveNested((prev) => ({ ...prev, [index]: null }));
    }
  };

  const handleNestedToggle = (cardIndex, nestedIndex, event) => {
    // Prevent the card from toggling when clicking a nested header
    event.stopPropagation();
    setActiveNested((prev) => ({
      ...prev,
      [cardIndex]:
        prev[cardIndex] === nestedIndex ? null : nestedIndex,
    }));
  };

  // Filter chapters based on the search query
  const filteredChapters = chapters.filter((chapter) =>
    chapter.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <div className="header">
        <button className="back-button" onClick={() => window.history.back()}>
          ← Back
        </button>
        <h1>Physics Chapters</h1>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search chapters..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid">
        {filteredChapters.map((chapter, index) => (
          <div className="card-wrapper" key={index}>
            <div
              className={`card ${activeCard === index ? "active" : ""}`}
              data-title={chapter.title}
            >
              <div
                className="card-header"
                onClick={() => handleCardToggle(index)}
              >
                <div className="icon">{chapter.emoji}</div>
                <h3 className="title">{chapter.title}</h3>
              </div>
              <div className="card-content">
                {nestedDropdowns.map((dropdown, dIndex) => (
                  <div
                    className={`nested-dropdown ${
                      activeNested[index] === dIndex ? "active" : ""
                    }`}
                    key={dIndex}
                  >
                    <div
                      className="nested-header"
                      onClick={(e) =>
                        handleNestedToggle(index, dIndex, e)
                      }
                    >
                      {dropdown.title}{" "}
                      <span className="badge">{dropdown.badge}</span>
                    </div>
                    <div className="nested-content">
                      {dropdown.items.map((item, i) => (
                        <div className="nested-item" key={i}>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseContentDetail;