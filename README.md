## Project Overview

This project is a simple Node.js server built with Express.js that allows players to create and join gaming sessions. It provides a set of RESTful API endpoints to manage sessions, players, and their selected operators (attackers and defenders). The server uses in-memory storage for simplicity, making it suitable for small-scale applications or as a starting point for more complex projects.

The objective of this Project is to support any session based system I might need to use.

## Features

-   Create new game sessions
-   Join existing sessions
-   Change player names within a session
-   Retrieve session details
-   Update session operators (attackers and defenders)

## Prerequisites

-   [Node.js](https://nodejs.org/) v12 or higher
-   [npm](https://www.npmjs.com/get-npm) (usually comes with Node.js)

## Installation

1.  **Clone the repository:**
    
    bash
    
    `git clone https://github.com/joelstephen97/sessions-node-api.git
    cd sessions-node-api` 
    
2.  **Install dependencies:**
    
    bash
    
    `npm install` 
    

## Usage

1.  **Start the server:**
    
    bash
    
    `npm start` 
    
2.  **Server will run on:**
    
    arduino
    
    `http://localhost:3001` 
    
    You can change the default port by setting the `PORT` environment variable.
    

## API Endpoints

### 1. Create a Session

-   **URL:** `/create-session`
    
-   **Method:** `POST`
    
-   **Headers:** `Content-Type: application/json`
    
-   **Body Parameters:**
    
    json
    
    `{
      "playerName": "Player1"
    }` 
    
-   **Success Response:**
    
    -   **Status Code:** `200 OK`
        
    -   **Body:**
        
        json
        
        `{
          "sessionId": "session-uuid",
          "playerId": "player-uuid"
        }` 
        

### 2. Join a Session

-   **URL:** `/join-session`
    
-   **Method:** `POST`
    
-   **Headers:** `Content-Type: application/json`
    
-   **Body Parameters:**
    
    json
    
    `{
      "sessionId": "session-uuid",
      "playerName": "Player2"
    }` 
    
-   **Success Response:**
    
    -   **Status Code:** `200 OK`
        
    -   **Body:**
        
        json
        
        `{
          "session": { /* session object */ },
          "playerId": "player-uuid"
        }` 
        

### 3. Change Player Name

-   **URL:** `/change-player-name`
    
-   **Method:** `POST`
    
-   **Headers:** `Content-Type: application/json`
    
-   **Body Parameters:**
    
    json
    
    `{
      "sessionId": "session-uuid",
      "playerId": "player-uuid",
      "newPlayerName": "NewName"
    }` 
    
-   **Success Response:**
    
    -   **Status Code:** `200 OK`
        
    -   **Body:**
        
        json
        
        `{
          "message": "Player name updated",
          "session": { /* session object */ }
        }` 
        

### 4. Get Session Details

-   **URL:** `/session/:sessionId`
    
-   **Method:** `GET`
    
-   **Success Response:**
    
    -   **Status Code:** `200 OK`
        
    -   **Body:**
        
        json
        
        `{
          "players": [ /* array of players */ ],
          "attackers": [ /* array of attackers */ ],
          "defenders": [ /* array of defenders */ ]
        }` 
        

### 5. Update Session Operators

-   **URL:** `/session/:sessionId/update-operators`
    
-   **Method:** `POST`
    
-   **Headers:** `Content-Type: application/json`
    
-   **Body Parameters:**
    
    json
    
    `{
      "playerId": "player-uuid",
      "attackers": [ /* array of attackers */ ],
      "defenders": [ /* array of defenders */ ]
    }` 
    
-   **Success Response:**
    
    -   **Status Code:** `200 OK`
        
    -   **Body:**
        
        json
        
        `{
          "message": "Operators updated"
        }` 
        

## Error Handling

The API uses standard HTTP status codes to indicate success or failure. Error responses include a JSON body with an `error` message.

-   **Examples:**
    
    -   `400 Bad Request` – Missing required parameters.
    -   `403 Forbidden` – Player not in session.
    -   `404 Not Found` – Session or player not found.

## CORS Support

The server includes CORS support to allow cross-origin requests. If you need to restrict origins, you can configure the CORS options in the `app.use(cors())` middleware.

## TO DO 

> Make it more generic and flexible
> Ensure safety and tests
> Ensure all best practises are covered
> Maybe check alternative implementations

## License

This project is licensed under the MIT License.