document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');

  if (!bookId) {
    alert('Идентификатор книги не указан!');
    return;
  }

  fetch(`data/book${bookId}.json`)
    .then(response => response.json())
    .then(book => {
      document.getElementById('book-title').textContent = book.title;
      document.getElementById('book-author').textContent = `Автор: ${book.author}`;
      
      const chapterList = document.getElementById('chapter-list');
      const chapterContent = document.getElementById('chapter-content');
      
      Object.keys(book.chapters).forEach(chapterNumber => {
        const chapterLink = document.createElement('a');
        chapterLink.href = '#';
        chapterLink.textContent = `Глава ${chapterNumber}`;
        chapterLink.addEventListener('click', () => {
          chapterContent.textContent = book.chapters[chapterNumber];
        });
        chapterList.appendChild(chapterLink);
      });

      // Отображение первой главы по умолчанию
      const firstChapter = Object.keys(book.chapters)[0];
      chapterContent.textContent = book.chapters[firstChapter];
    })
    .catch(error => console.error('Ошибка загрузки книги:', error));
});

