const { JSDOM } = require('jsdom');
const dotenv = require('dotenv');

dotenv.config();

// Configuration
const NOTIFICATION_ENDPOINT = process.env.SLACK_WEBHOOK_URL;

const URLS = JSON.parse(process.env.URLS);

// Function to check a single URL for course availability
async function checkUrl(url) {
  console.log(`Checking URL: ${url}`);
  
  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Check if the #add_to_cart button exists and if its parent doesn't have the "unvisible" class
    const addToCartButton = document.querySelector('#add_to_cart');
    const isAvailable = addToCartButton && 
      addToCartButton.parentElement && 
      !addToCartButton.parentElement.classList.contains('unvisible');
    
    return { url, isAvailable };
  } catch (error) {
    console.error(`Error checking URL ${url}:`, error);
    return { url, isAvailable: false, error: error.message };
  }
}

// Function to send notification when a course becomes available
async function sendNotification(availableCourses) {
  try {
    const response = await fetch(NOTIFICATION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        availableCourses
      })
    });
    const data = await response.json();
    console.log('Notification sent successfully:', data);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

// Main function to check all URLs
async function checkAllUrls() {
  console.log(`Starting check at ${new Date().toISOString()}`);
  
  const results = [];
  for (const url of URLS) {
    const result = await checkUrl(url);
    results.push(result);
  }
  
  const availableCourses = results.filter(result => result.isAvailable).map(result => result.url);
  
  if (availableCourses.length > 0) {
    console.log('Found available courses:', availableCourses);
    await sendNotification(availableCourses);
  } else {
    console.log('No available courses found.');
  }
}

// Start the initial check
(async () => {
  await checkAllUrls();
})(); 