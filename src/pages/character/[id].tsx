import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { characters } from "../data/characters";

export default function CharacterPage() {
  const router = useRouter();
  const { id } = router.query;
  const character = characters.find(c => c.id === Number(id));

  return (
    <div style={{ padding: "2rem", background: "#0a0a0a", minHeight: "100vh" }}>
      {character && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            background: "#111",
            padding: "2rem",
            borderRadius: "8px",
            border: "1px solid #333"
          }}
        >
          <motion.img 
            src={character.image} 
            alt={character.name}
            style={{ 
              width: "100%", 
              borderRadius: "8px",
              marginBottom: "1rem"
            }}
          />
          <h1 style={{ color: "#00ee88", marginBottom: "0.5rem" }}>
            {character.name}
          </h1>
          <p style={{ color: "#ccc", marginBottom: "2rem" }}>
            {character.description}
          </p>
          <motion.button
            style={{
              background: "#00ee88",
              color: "#111",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              fontWeight: "600",
              cursor: "pointer"
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
          >
            Voltar
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}