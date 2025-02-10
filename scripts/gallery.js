// Ждем, пока DOM загрузится полностью
document.addEventListener('DOMContentLoaded', () => {
  // Выбираем все элементы-заголовки книг
  const headers = document.querySelectorAll('.book-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      // При клике на заголовок ищем ближайший контейнер .book и его галерею
      const bookContainer = header.parentElement;
      const gallery = bookContainer.querySelector('.gallery');
      // Переключаем класс active для показа/скрытия галереи
      gallery.classList.toggle('active');
    });
  });
});