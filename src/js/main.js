const showTemplateText = () => {
    // template
    let tempText = document.querySelector("#template-text");
    // создаем контейнер для элементов из template
    let newContainer = document.createElement("div");
    newContainer.setAttribute("class", "settings__text__container");
    // клонируем 
    let clone = tempText.content.cloneNode(true);
    // добавляем элементы в контейнер
    newContainer.append(clone);

    let container = document.getElementById("text-settings");

    // добавляем в DOM
    container.append(newContainer);

    let textarea = newContainer.querySelectorAll('.settings__text__textarea');

    // placeholder 
    let num = Number(document.getElementById('text-settings').children.length);
    textarea[0].placeholder = 'Text ' + num;
    // id
    let id = 'textarea-' + num;
    textarea[0].setAttribute("id", id);
    // name 
    textarea[0].setAttribute("name", id);
    // input color 
    let colorID = 'color-' + num;
    let input = newContainer.querySelectorAll(".settings__text__color");
    input[0].setAttribute("id", colorID);
    input[0].setAttribute("name", colorID);
    // edit-btn 
    let edit = newContainer.querySelectorAll('.settings__text__btn');
    let editID = 'edit-' + num;
    edit[0].setAttribute("id", editID);
    // menu
    let menu = newContainer.querySelectorAll('.settings__text__menu');
    let menuID = 'menu-' + num;
    menu[0].setAttribute("id", menuID);
}

// добаляет текст и поле для ввода при нажатии на кнопку "добавить текст"

document.getElementById("addText-btn").addEventListener('click', () => {
    showTemplateText();
});

// показывает и скрыввает редактор

function showEditMenu(e) {
    // id элемента, который был нажат
    let id = e.id.slice(5);
    let menuID = 'menu-' + id;
    let menu = document.getElementById(menuID);
    // показываем и скрываем в зависимости от видимости меню
    if(menu.style.display == 'flex') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'flex';
    }
}

// удаляет текст 

function deleteTextarea(e) {
    // родительский элемент
    let parent = e.parentNode;
    // удаляем элемент
    parent.remove();
}

window.addEventListener('DOMContentLoaded', () => {
    showTemplateText();
});