# Google Form Extractor & Mapper

A Next.js tool that parses raw HTML from Google Forms and converts it into a clean, developer-friendly JSON format. It allows you to select specific fields, rename keys (mapping), and export the result for use in databases or APIs.

## What It Does

1.  **Parses HTML:** You paste the source code of a filled Google Form.
2.  **Extracts Data:** It finds questions (labels) and answers (inputs, checkboxes, radio buttons) using server-side parsing.
3.  **Maps Keys:** Provides an interface to rename long questions (e.g., "What is your name?") into clean keys (e.g., `fullName`).
4.  **Exports JSON:** Generates a final JSON object ready for your application.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Parser:** Cheerio (Server Actions)

## Installation

1.  **Clone or create the project:**

    ```bash
    npx create-next-app@latest form-extractor
    # Select: TypeScript, Tailwind, App Router
    cd form-extractor
    ```

2.  **Install dependencies:**

    ```bash
    npm install cheerio
    ```

3.  **Run locally:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1.  **Get Form HTML:**
    - Open your Google Form (the "View Response" or live form page).
    - Right-click anywhere on the page -> **View Page Source** (Do not use "Inspect Element").
    - Select All (`Ctrl + A`) -> Copy (`Ctrl + C`).
2.  **Analyze:** Paste the HTML into the extractor and click **Analyze HTML**.
3.  **Map:**
    - Uncheck fields you don't need.
    - Rename the "Target Key Name" to whatever you want your JSON key to be.
    - Use **Auto CamelCase** for quick formatting.
4.  **Export:** Copy the final JSON from the result block.

## Hosting for Free (Vercel) (If you don't want to use from here You can host the project yourself. Feel free to use it)

This project uses **Next.js Server Actions**, so it requires a server runtime. The best free host is **Vercel**.

### Option A: Deploy via GitHub (Recommended)

1.  Push your code to a new GitHub repository.
2.  Go to [Vercel.com](https://vercel.com/signup) and sign up/login.
3.  Click **"Add New..."** -> **"Project"**.
4.  Select your repository and click **Deploy**.

### Option B: Deploy via CLI

1.  Install Vercel CLI: `npm i -g vercel`
2.  Run `vercel` in your project folder.
3.  Follow the prompts to deploy instantly.
