// Функция для получения параметров из URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Получаем id книги из URL
const bookId = getQueryParam('id');

// Проверяем, что id существует и корректно
if (!bookId || isNaN(bookId)) {
  alert('Некорректный идентификатор книги!');
  throw new Error('Invalid book ID');
}

// Динамически формируем путь к PDF-файлу
const pdfUrl = `books/book${bookId}.pdf`;

const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

let pdfDoc = null,
  currentPage = 1,
  totalPages = 0,
  isRendering = false;

// Настройка отображения размера листа pdf на экране
// const scale = 1.35;

// Function to determine scale based on screen width
function getScale() {
  if (window.innerWidth <= 480) {
      return 0.8; // For small screens (mobile)
  } else if (window.innerWidth <= 768) {
      return 1.1; // For tablets
  } else if (window.innerWidth <= 820) {
      return 1.25; // For tablets
  } else if (window.innerWidth <= 1024) {
      return 1.5; // For tablets
  } else if (window.innerWidth <= 1920) {
      return 1.1; 
  } else {
      return 1.35; // For desktops
  }
}

const leftCanvas = document.getElementById('left-page');
const rightCanvas = document.getElementById('right-page');
const leftCtx = leftCanvas.getContext('2d');
const rightCtx = rightCanvas.getContext('2d');

const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

/**
 * Updates the reading progress.
 * Calculates the percentage of the document read based on the current page,
 * then updates the progress bar's width and displays the progress text.
 */
function updateProgress() {
  const progress = (currentPage / totalPages) * 100; // Calculate the progress percentage
  progressBar.style.width = `${progress}%`; // Adjust the progress bar width
  progressText.textContent = `${Math.round(progress)}%`; // Display the progress percentage as text
}

/**
 * Renders a specific page of the PDF onto the specified canvas.
 * @param {number} pageNumber - The page number to render.
 * @param {HTMLCanvasElement} canvas - The canvas to render the page on.
 * @param {CanvasRenderingContext2D} context - The context of the canvas.
 */
function renderPage(pageNumber, canvas, context) {
  const scale = getScale(); // Dynamically determine the scale
  return pdfDoc.getPage(pageNumber).then((page) => {
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    return page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;
  });
}

/**
 * Handles the rendering of the book layout (two pages side by side on larger screens).
 * For smaller screens, only one page is rendered.
 */
function renderBook() {
  if (currentPage > totalPages) return;

  isRendering = true;

  const leftPage = currentPage; // Left page is always the current page
  const rightPage = window.innerWidth <= 1024 ? null : currentPage + 1; // Right page is only shown for larger screens

  renderPage(leftPage, leftCanvas, leftCtx).then(() => {
    if (rightPage && rightPage <= totalPages) {
      return renderPage(rightPage, rightCanvas, rightCtx);
    } else {
        rightCtx.clearRect(0, 0, rightCanvas.width, rightCanvas.height); // Clear right canvas if no page
    }
  }).then(() => {
      isRendering = false;
      updateProgress();
  });

  document.getElementById('current-page').textContent = leftPage;
}

// Add flip animation for pages
const bookContainer = document.getElementById('pdf-container');

function flipPage(direction) {
    const leftPageWrapper = leftCanvas.parentElement;
    const rightPageWrapper = rightCanvas.parentElement;

    if (direction === 'next') {
        leftPageWrapper.classList.add('flip-forward');
        rightPageWrapper.classList.add('flip-forward');

        setTimeout(() => {
            leftPageWrapper.classList.remove('flip-forward');
            rightPageWrapper.classList.remove('flip-forward');
        }, 600);
    } else if (direction === 'prev') {
        leftPageWrapper.classList.add('flip-backward');
        rightPageWrapper.classList.add('flip-backward');

        setTimeout(() => {
            leftPageWrapper.classList.remove('flip-backward');
            rightPageWrapper.classList.remove('flip-backward');
        }, 600);
    }
}

// Load the PDF document
pdfjsLib.getDocument(pdfUrl).promise.then((doc) => {
  pdfDoc = doc;
  totalPages = pdfDoc.numPages;
  document.getElementById('total-pages').textContent = totalPages;

  renderBook();
});

// Event listener for the "Previous" button
document.getElementById('prev-page').addEventListener('click', () => {
  if (currentPage <= 1) return;
  currentPage -= window.innerWidth <= 768 ? 1 : 2; // Adjust current page based on screen size
  flipPage('prev');
  if (currentPage < 1) currentPage = 1;
  renderBook();
});

// Event listener for the "Next" button
document.getElementById('next-page').addEventListener('click', () => {
  if (currentPage >= totalPages) return;
  currentPage += window.innerWidth <= 768 ? 1 : 2; // Adjust current page based on screen size
  flipPage('next');
  renderBook();
});

// Event listener for "Jump to page" input
document.getElementById('jump-to-page').addEventListener('change', (e) => {
  const page = parseInt(e.target.value);
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    renderBook();
  } else {
      alert('Invalid page number');
  }
});

// Re-render book on window resize to apply new scale
window.addEventListener('resize', () => {
  renderBook();
});


// Key and mouse navigation
window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === ' ') { // Next page
    event.preventDefault(); // Prevent scrolling
    if (currentPage < totalPages) {
      currentPage += window.innerWidth <= 768 ? 1 : 2;
      flipPage('next');
      renderBook();
    }
  } else if (event.key === 'ArrowLeft') { // Previous page
    event.preventDefault(); // Prevent scrolling
    if (currentPage > 1) {
      currentPage -= window.innerWidth <= 768 ? 1 : 2;
      flipPage('prev');
      renderBook();
    }
  }
});

// Mouse click navigation
bookContainer.addEventListener('click', (event) => {
  const rect = bookContainer.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const containerCenter = rect.width / 2;

  if (clickX < containerCenter) { // Click on left side
    if (currentPage > 1) {
      currentPage -= window.innerWidth <= 768 ? 1 : 2;
      flipPage('prev');
      renderBook();
    }
  } else { // Click on right side
    if (currentPage < totalPages) {
      currentPage += window.innerWidth <= 768 ? 1 : 2;
      flipPage('next');
      renderBook();
    }
  }
});
