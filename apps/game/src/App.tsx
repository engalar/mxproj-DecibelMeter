import { useRef, useEffect } from "react";
import { Game } from "./Game";
import "./App.css";

function App() {
    const containerRef = useRef(null);
    useEffect(() => {
        const game = new Game(containerRef.current!);
        return () => {
            game.destroy();
        };
    }, []);
    return <div ref={containerRef}></div>;
}

export default App;
