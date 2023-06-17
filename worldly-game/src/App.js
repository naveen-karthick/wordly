import "./App.css";
import { Worldly } from "./Wordly/Worldly";
function App() {
  return (
    <>
      <div className="image-container">
        <img src="./wordle.png" />
      </div>
      <div className="App">
        <Worldly />
      </div>
    </>
  );
}

export default App;
