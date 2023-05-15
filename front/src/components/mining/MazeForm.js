import React, { useState, useEffect } from 'react'
import { Container, Card } from 'react-bootstrap'
import '../../styles/MazeForm.css'

const generateRandomMaze = (rows, cols) => {
    const maze = []

    // Create an empty maze
    for (let i = 0; i < rows; i++) {
        const row = Array(cols).fill(0)
        maze.push(row)
    }

    // Generate walls randomly
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (Math.random() < 0.3) {
                maze[i][j] = 1
            }
        }
    }

    return maze
}

function MazeForm() {
    // ...

    // Define the size of the maze
    const mazeRows = 6
    const mazeCols = 6

    // Generate a random maze
    const [maze, setMaze] = useState(generateRandomMaze(mazeRows, mazeCols))

    // Define the initial player position
    const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 })

    // Define the positions of the coins
    const [coinPositions, setCoinPositions] = useState([])

    useEffect(() => {
        // Generate random coin positions within the maze
        const generateCoinPositions = () => {
            const coins = []
            for (let i = 0; i < mazeRows; i++) {
                for (let j = 0; j < mazeCols; j++) {
                    if (maze[i][j] === 0 && Math.random() < 0.1) {
                        coins.push({ x: j, y: i })
                    }
                }
            }
            return coins
        }

        // Set the initial coin positions
        setCoinPositions(generateCoinPositions())
    }, [maze])

    const handleKeyDown = (event) => {
        const { key } = event
        let dx = 0
        let dy = 0

        // Update player position based on arrow key input
        if (key === 'ArrowUp') dy = -1
        else if (key === 'ArrowDown') dy = 1
        else if (key === 'ArrowLeft') dx = -1
        else if (key === 'ArrowRight') dx = 1

        const newPosition = {
            x: playerPosition.x + dx,
            y: playerPosition.y + dy,
        }

        // Check if the new position is valid (not a wall)
        if (maze[newPosition.y][newPosition.x] !== 1) {
            // Check if the new position has a coin
            if (maze[newPosition.y][newPosition.x] === 2) {
                // Collect the coin
                const updatedMaze = [...maze]
                updatedMaze[newPosition.y][newPosition.x] = 0
                setMaze(updatedMaze)

                // Update the coin positions
                const updatedCoinPositions = coinPositions.filter(
                    (coin) =>
                        !(coin.x === newPosition.x && coin.y === newPosition.y)
                )
                setCoinPositions(updatedCoinPositions)
            }

            // Update the player's position
            setPlayerPosition(newPosition)
        }
    }

    return (
        <Container
            className="d-flex align-items-center justify-content-center vh-100"
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            <Card style={{ width: '360px' }} className="text-center">
                <Card.Body>
                    <div className="maze-container">
                        {maze.map((row, y) => (
                            <div key={y} className="maze-row">
                                {row.map((cell, x) => (
                                    <div
                                        key={x}
                                        className={`maze-cell ${
                                            x === playerPosition.x &&
                                            y === playerPosition.y
                                                ? 'player'
                                                : ''
                                        }`}
                                    >
                                        {/* Render different elements based on cell value */}
                                        {cell === 0 && (
                                            <>
                                                {/* Check if there is a coin at the current position */}
                                                {coinPositions.some(
                                                    (coin) =>
                                                        coin.x === x &&
                                                        coin.y === y
                                                ) ? (
                                                    <span className="coin">
                                                        ●
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                        {cell === 1 && (
                                            <span className="wall">■</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    {/* ...existing code... */}
                </Card.Body>
            </Card>
        </Container>
    )
}

export default MazeForm
