import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // Update the import path as per your setup

const DraggableButton = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (event: React.MouseEvent) => {
        setIsDragging(true);

        // Calculate the offset between the button's position and mouse pointer
        setOffset({
            x: event.clientX - position.x,
            y: event.clientY - position.y,
        });

        event.preventDefault(); // Prevent text selection during drag
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        if (!isDragging) return;

        // Update position based on mouse movement
        setPosition({
            x: event.clientX - offset.x,
            y: event.clientY - offset.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div
            style={{
                height: "100vh",
                width: "100vw",
                position: "relative",
                overflow: "hidden",
                background: "#f9fafb", // Tailwind's default light gray
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <Button
                onMouseDown={handleMouseDown}
                style={{
                    position: "absolute",
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    cursor: isDragging ? "grabbing" : "grab",
                }}
            >
                Drag Me
            </Button>
        </div>
    );
};

export default DraggableButton;
