
document.addEventListener("DOMContentLoaded", () => {
  const detailsButtons = document.querySelectorAll(".details-btn");
  const popup = document.getElementById("popup");
  const closeBtn = document.querySelector(".close-btn");

  // Элементы внутри попапа
  const popupTitle = document.getElementById("popup-title");
  const popupDescription = document.getElementById("popup-description");
  const popupPrice = document.getElementById("popup-price");

  // Добавляем обработчик для каждой кнопки
  detailsButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Получаем данные из атрибутов
      const title = btn.getAttribute("data-title");
      const description = btn.getAttribute("data-description");
      const price = btn.getAttribute("data-price");

      // Заполняем попап данными

      popupTitle.textContent = title;
      // popupDescription.textContent = description;
      popupDescription.innerHTML = description;
      popupPrice.textContent = price;

      // Показываем попап
      popup.classList.add("show");
      document.body.classList.add("no-scroll"); // Блокируем скролл
    });
  });

  // Закрытие попапа
  closeBtn.addEventListener("click", () => {
    popup.classList.remove("show");
    document.body.classList.remove("no-scroll"); // Возвращаем скролл
  });

  // Закрытие при клике вне попапа
  popup.addEventListener("click", (event) => {
    if (event.target === popup) {
      popup.classList.remove("show");
      document.body.classList.remove("no-scroll"); // Возвращаем скролл
    }
  });
});