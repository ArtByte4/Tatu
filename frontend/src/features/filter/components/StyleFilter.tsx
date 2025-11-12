import { useEffect } from "react";
import { getTattooStyles, TattooStyle } from "@/features/posts/api/postApi";
import "../styles/StyleFilter.css";
import { useState } from "react";

interface StyleFilterProps {
  selectedStyle: number | null;
  onStyleChange: (styleId: number | null) => void;
}

function StyleFilter({ selectedStyle, onStyleChange }: StyleFilterProps) {
  const [styles, setStyles] = useState<TattooStyle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadStyles = async () => {
      setLoading(true);
      try {
        const data = await getTattooStyles();
        setStyles(data);
      } catch (err) {
        console.error("Error al obtener estilos:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStyles();
  }, []);

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const styleId = value === "" ? null : parseInt(value, 10);
    onStyleChange(styleId);
  };

  return (
    <div className="style-filter-container">
      <label htmlFor="style-filter" className="style-filter-label">
        Filtrar por estilo:
      </label>
      <select
        id="style-filter"
        className="style-filter-select"
        value={selectedStyle || ""}
        onChange={handleStyleChange}
        disabled={loading}
      >
        <option value="">Todos los estilos</option>
        {styles.map((style) => (
          <option key={style.tattoo_styles_id} value={style.tattoo_styles_id}>
            {style.tattoo_styles_name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default StyleFilter;

