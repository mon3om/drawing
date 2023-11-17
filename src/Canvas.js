import React, { Fragment, useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import CanvasDraw from "react-canvas-draw";
const defaultProps = {
  brushRadius: 2,
  lazyRadius: 0,
  brushColor: "#444",
  hideGrid: false,
  hideInterface: false,
};

const Canvas = () => {
  const [canvasProps, setCanvasProps] = useState(defaultProps);
  const canvasRef = useRef(null);

  useEffect(() => {
    setCanvasProps({
      ...defaultProps,
      canvasHeight: "60%",
      canvasWidth: "90%",
    });
  }, []);

  const [isDrawing, setIsDrawing] = useState(false);
  const [startX, setStartX] = useState(null);
  const [startY, setStartY] = useState(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (isDrawing) {
        const endX = event.clientX;
        const endY = event.clientY;
        const distanceTraveled = calculateDistance(startX, startY, endX, endY);
        setDistance((prevDistance) => prevDistance + distanceTraveled);
        setStartX(endX);
        setStartY(endY);
      }
    };

    document.addEventListener("pointermove", handleMouseMove);

    return () => {
      document.removeEventListener("pointermove", handleMouseMove);
    };
  }, [isDrawing, startX, startY]);

  const handleMouseDown = (event) => {
    setStartX(event.clientX);
    setStartY(event.clientY);
    setIsDrawing(true);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const calculateDistance = (x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };

  return (
    <div className="canvas-container">
      <p>{"Drawn pixels: " + Math.ceil(distance)}</p>
      {canvasRef && (
        <button
          onClick={() => {
            setDistance(0);
            canvasRef.current.clear();
          }}
        >
          clear
        </button>
      )}

      <div
        style={{ display: "contents" }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onPointerDown={handleMouseDown}
        onPointerUp={handleMouseUp}
      >
        <CanvasDraw ref={canvasRef} {...canvasProps} />
      </div>

      {distance >= 300 && <button className="button">Submit</button>}
    </div>
  );
};

export default Canvas;
