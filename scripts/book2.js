const url = 'books/book1.pdf'; // Путь к PDF

const pdfjsLib = window['pdfjs-dist/build/pdf']; // Инициализация библиотеки
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const leftCanvas = document.getElementById('left-page');
const rightCanvas = document.getElementById('right-page');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');

let pdfDoc = null; // Хранение PDF-документа
let currentPage = 1; // Текущая страница
let totalPageCount = 0; // Общее количество страниц
const scale = 1.5; // Масштаб отображения

// Загрузка PDF
pdfjsLib.getDocument(url).promise.then(pdf => {
    pdfDoc = pdf;
    totalPageCount = pdf.numPages;
    renderPages();
}).catch(error => console.error('Ошибка загрузки PDF:', error));

// Рендеринг двух страниц
function renderPages() {
    renderPage(leftCanvas, currentPage);
    renderPage(rightCanvas, currentPage + 1);

    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage + 1 >= totalPageCount;
}

// Рендеринг одной страницы
function renderPage(canvas, pageNumber) {
    if (pageNumber > totalPageCount) {
        canvas.style.display = 'none'; // Скрываем пустую страницу
        return;
    }

    canvas.style.display = 'block';
    pdfDoc.getPage(pageNumber).then(page => {
        const viewport = page.getViewport({ scale });
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        page.render(renderContext);
    });
}

// Навигация
prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage -= 2;
        renderPages();
    }
});

nextBtn.addEventListener('click', () => {
  if (currentPage + 1 < totalPageCount) {
      document.querySelector('.book-container').classList.add('flip');
      setTimeout(() => {
          currentPage += 2;
          renderPages();
          document.querySelector('.book-container').classList.remove('flip');
      }, 600);
  }
});