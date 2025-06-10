const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
  { text: "You learn more from failure than from success. Don't let it stop you. Failure builds character.", author: "Unknown" }
];

const quoteElement = document.getElementById('quote');
const authorElement = document.getElementById('author');
const newQuoteBtn = document.getElementById('newQuoteBtn');

let currentQuoteIndex = -1;

function displayQuote() {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * quotes.length);
  } while (randomIndex === currentQuoteIndex && quotes.length > 1);
  
  currentQuoteIndex = randomIndex;
  const quote = quotes[randomIndex];
  
  quoteElement.classList.remove('show');
  authorElement.classList.remove('show');
  
  setTimeout(() => {
    quoteElement.textContent = quote.text;
    authorElement.textContent = quote.author;
    quoteElement.classList.add('show');
    authorElement.classList.add('show');
  }, 200);
}

newQuoteBtn.addEventListener('click', displayQuote);
