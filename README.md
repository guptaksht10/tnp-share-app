- username: admin 
- password: admin

## Overview
This is a frontend application built for the Training & Placement Department's secure data sharing system. It allows administrators to generate token-based shareable links that display selected student data in a public, read-only view.

## Area	Strategy / Tool
Auth (admin only)	-> localStorage, signIn() 
Share via token	-> Secure token-based link generation
Dynamic public view	-> /share/[token] route using params.token
UI Toolkit -> MUI + Tailwind for hybrid UI flexibility
PDF Export ->	jspdf
API interaction -> Abstracted functions in /lib/api.ts
Feedback / Alerts	-> Error state, conditional rendering
State & Effect Handling	-> React Hooks (useState, useEffect)

## 🛠️ Tech Stack
Next.js (App Router)
React + TypeScript
Tailwind CSS + Material UI
Custom REST API integration
PDF Export via jspdf
