import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    axios
      .get("http://localhost:5000")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch(() => {
        setMessage("Could not connect to backend");
      });
  }, []);

  return (
    <div>
      <h1>SkillSync</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;