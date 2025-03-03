const puppeteer = require('puppeteer');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// Configuration
const NOTIFICATION_ENDPOINT = process.env.SLACK_WEBHOOK_URL;

const URLS = [
	"https://inscriptioncgm.mg/a1/75-cours-de-preparation-a-lexamen-start-deutsch-1-b.html",
	"https://inscriptioncgm.mg/a1/307-preparation-de-lexamen-start-deutsch-1.html",
	"https://inscriptioncgm.mg/a1/311-preparation-de-lexamen-start-deutsch-1.html",
	"https://inscriptioncgm.mg/a1/131-preparation-de-lexamen-start-deutsch-1.html"
]

// Function to check a single URL for course availability
async function checkUrl(browser, url) {
  console.log(`Checking URL: ${url}`);
  
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Check if the #add_to_cart button exists and if its parent doesn't have the "unvisible" class
    const isAvailable = await page.evaluate(() => {
      const addToCartButton = document.querySelector('#add_to_cart');
      if (!addToCartButton) return false;
      
      const parentElement = addToCartButton.parentElement;
      return parentElement && !parentElement.classList.contains('unvisible');
    });
    
    await page.close();
    return { url, isAvailable };
  } catch (error) {
    console.error(`Error checking URL ${url}:`, error);
    return { url, isAvailable: false, error: error.message };
  }
}

// Function to send notification when a course becomes available
async function sendNotification(availableCourses) {
  try {
    const response = await axios.post(NOTIFICATION_ENDPOINT, {
      availableCourses,
      timestamp: new Date().toISOString()
    });
    console.log('Notification sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

// Main function to check all URLs
async function checkAllUrls() {
  console.log(`Starting check at ${new Date().toISOString()}`);
  
  let browser;
  
  try {
    browser = await puppeteer.launch({ headless: true });
    
    const results = [];
    for (const url of URLS) {
      const result = await checkUrl(browser, url);
      results.push(result);
    }
    
    const availableCourses = results.filter(result => result.isAvailable);
    
    if (availableCourses.length > 0) {
      console.log('Found available courses:', availableCourses);
      await sendNotification(availableCourses);
    } else {
      console.log('No available courses found.');
    }
  } catch (error) {
    console.error('Error during check:', error);
  } finally {
    if (browser) {
      await browser.close();
      console.log('Browser closed.');
    }
  }
}

// Start the initial check
(async () => {
  await checkAllUrls();
})(); 