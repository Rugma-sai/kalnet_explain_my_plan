# Explain My Plan — AI Clarity & Structuring Tool

## Project Overview

This project is an AI-based web application that helps users convert vague and unstructured ideas into clear, actionable plans. It takes natural language input and transforms it into a structured format with defined goals, steps, and guidance.

The objective of this project is to improve clarity in thinking and support better decision-making.

---

## Problem Understanding

Many users have ideas but struggle to organize them properly. These ideas often lack clarity, defined steps, or a proper timeline, which makes execution difficult.

This project addresses that problem by structuring user input and identifying missing elements in the plan.

---

## Approach

The system follows a simple flow:

1. User enters an idea in the frontend  
2. The input is sent to the backend  
3. A structured prompt is used with an AI model  
4. The AI generates a JSON response  
5. The frontend displays the structured output  

The focus was to keep the system simple, clear, and reliable.

---

## Key Features

- Accepts free-form user input  
- Converts input into:
  - Goal  
  - Method / Approach  
  - Steps  
  - Timeline  
- Detects missing elements:
  - Goal clarity  
  - Execution steps  
  - Resources  
  - Timeline  
- Provides a simplified version of the plan  
- Generates actionable next steps  
- Assigns a clarity score (0–100)  
- Allows users to modify input and re-run analysis  

---

## Clarity Score Logic

The clarity score is calculated based on four factors:

- Goal clarity  
- Defined steps  
- Timeline presence  
- Overall completeness  

Each factor contributes equally to the final score out of 100.

---

## Prompt Design

A structured prompt was used to ensure consistent and reliable output. The prompt:

- Defines a fixed JSON format  
- Includes clear instructions for each section  
- Handles missing values explicitly  
- Enforces output consistency using rules  

This helps in generating structured and usable responses.

---

## Technology Stack

Frontend:
- React.js  

Backend:
- Node.js with Express  

AI Integration:
- OpenRouter (LLM API)  

Database:
- Supabase (PostgreSQL)  

Deployment:
- Frontend: Vercel  
- Backend: Render  

---

## Challenges Faced

One of the main challenges was ensuring that the AI consistently returns valid and structured JSON output. Initially, responses were sometimes inconsistent. This was handled by designing a strict prompt and adding parsing logic in the backend.

Another challenge was deployment and connecting the frontend with the backend, which was resolved by properly configuring API endpoints and environment variables.

---

## Setup Instructions

1. Clone the repository  
2. Install dependencies for both frontend and backend  
3. Add environment variables:
   - OpenRouter API Key  
   - Supabase URL and Key  
4. Start the backend server  
5. Start the frontend application  

---

## Future Improvements

- Integration of RAG for more context-aware outputs  
- Adding history of previous user inputs  
- Improving UI and user experience  
- Export or share functionality  

---

## Submission

Live Application: https://kalnet-explain-my-plan.vercel.app  
GitHub Repository: https://github.com/Rugma-sai/kalnet_explain_my_plan  

This project was developed as part of the KALNET assignment.