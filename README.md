# Course Availability Checker

This script checks for course availability on inscriptioncgm.mg by monitoring if the registration button becomes visible.

## Features

- Checks multiple course URLs from a JSON file
- Runs checks every 15 minutes
- Sends notifications when courses become available
- Automatically reopens the browser for each check

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

1. Update the `NOTIFICATION_ENDPOINT` in `course_checker.js` with your actual notification endpoint URL
2. Verify the URLs in `urls.json` are correct
3. Adjust the `CHECK_INTERVAL_MINUTES` if needed (default is 15 minutes)

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

1. The script reads URLs from `urls.json`
2. For each URL, it opens a browser and checks if the registration button is visible
3. If any course becomes available, it sends a notification to the configured endpoint
4. The browser is closed after each check and reopened for the next check
5. The process repeats every 15 minutes

## Logs

The script logs its activity to the console, including:
- When checks start and finish
- Which URLs are being checked
- When courses become available
- Any errors that occur during the process 