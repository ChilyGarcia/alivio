import React, { useState, useEffect } from "react";

const CitySearchComponent = ({ apiUrl }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [justSelected, setJustSelected] = useState(false);

  const handleInputChange = async (event) => {
    const value = event.target.value;
    setInputValue(value);
    setJustSelected(false); // Permite que se muestren sugerencias cuando el usuario escribe

    if (value.length > 2) {
      try {
        const response = await fetch(`${apiUrl}/cities?cities=${value}`, {
          headers: { Accept: "application/json" },
        });
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectCity = (city) => {
    setInputValue(city.name);
    setSuggestions([]);
    setShowSuggestions(false);
    setJustSelected(true);

    // Resetear justSelected después de un pequeño retraso para que onFocus no vuelva a abrir la lista
    setTimeout(() => {
      setJustSelected(false);
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".city-search-container")) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative city-search-container">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="w-full px-4 py-2 bg-white border border-primary text-primary font-bold text-sm rounded-2xl hover:bg-gray-100 transition-colors"
        placeholder="Buscar ciudad..."
        onFocus={() => {
          if (!justSelected && inputValue.length > 2) {
            setShowSuggestions(true);
          }
        }}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Cierra la lista cuando el usuario hace clic fuera
      />
      {showSuggestions && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 shadow-md">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onMouseDown={() => handleSelectCity(suggestion)}
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CitySearchComponent;
