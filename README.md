# Course Availability Checker

This script checks for course availability on inscriptioncgm.mg by monitoring if the registration button becomes visible.

## Features

- Checks multiple course URLs defined in the script
- Sends notifications to a Slack webhook when courses become available
- Uses Puppeteer for browser automation
- Runs headless for efficient checking
- Automatically runs every 15 minutes via GitHub Actions

## Requirements

- Node.js (v14 or higher recommended)
- npm or yarn

## Installation

1. Clone this repository or download the files
2. Install dependencies:

```bash
npm install
```

## Configuration

Before running the script, make sure to:

1. Create a `.env` file with your Slack webhook URL:
   ```
   SLACK_WEBHOOK_URL=your_slack_webhook_url
   ```

2. Modify the `URLS` array in `course_checker.js` if you want to check different courses

3. If using GitHub Actions, add your `SLACK_WEBHOOK_URL` as a repository secret

## Usage

Start the script with:

```bash
npm start
```

Or directly with Node:

```bash
node course_checker.js
```

## How It Works

1. The script reads URLs from the `URLS` array in the code
2. For each URL, it opens a headless browser and checks if the registration button is visible
3. If any course becomes available, it sends a notification to the configured Slack webhook
4. The browser is closed after each check
5. The script runs once when started locally
6. When deployed, GitHub Actions automatically runs the script every 15 minutes between 6:00 AM and 11:59 PM EAT

## Project Structure

- `course_checker.js` - Main script file containing the checking logic
- `.env` - Environment variables file (contains the Slack webhook URL)
- `package.json` - Project dependencies and scripts
- `.github/workflows/check-courses.yml` - GitHub Actions workflow configuration

## Dependencies

- `puppeteer` - For browser automation
- `axios` - For sending HTTP requests to the notification endpoint
- `dotenv` - For loading environment variables

## GitHub Actions Workflow

The repository includes a GitHub Actions workflow that:
- Runs the script every 15 minutes between 6:00 AM and 11:59 PM EAT
- Uses Ubuntu as the runner environment
- Sets up Node.js v20
- Installs dependencies using `npm ci`
- Runs the script with the Slack webhook URL from repository secrets

## Logs

The script logs its activity to the console, including:
- When checks start and finish
- Which URLs are being checked
- When courses become available
- Any errors that occur during the process 