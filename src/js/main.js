// кнопка загрузить изображение
let uploadBtn = document.querySelector("#upload");
// изображение, которое загрузили
let image = null;
let imageDataURL;
// канвас
let canvas = document.querySelector('#meme-preview');
// контекст
const ctx = canvas.getContext('2d');
// ширина канваса
let width;
// высота канваса
let height;
// textareas
let texts;
// главный массив, где храним стили и координаты текста
let arr = [];
let colorIDs = [];
let rangeIDs = [];
let fontStyleIds = [];

const showTemplateText = (placeholder) => {
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

    // номер 
    let num = Number(document.getElementById('text-settings').children.length);

    // placeholder 
    textarea[0].placeholder = placeholder;
    // id
    let id = 'textarea-' + num;
    textarea[0].setAttribute("id", id);
    // name 
    textarea[0].setAttribute("name", id);
    // input color 
    let colorID = 'color-' + num;
    colorIDs.push(colorID);
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
    // input range 
    let range = newContainer.querySelectorAll('.input__range');
    let rangeID = 'range-' + num;
    rangeIDs.push(rangeID);
    range[0].setAttribute("id", rangeID);
    // radio btns fontstyle
    let fontStyle = newContainer.querySelectorAll('.settings__text__menu__fontstyle__item');
    let fontStyleId = 'fontstyle-' + num;
    fontStyleIds.push(fontStyleId);
    fontStyle[0].setAttribute("name", fontStyleId);
    fontStyle[1].setAttribute("name", fontStyleId);
    fontStyle[2].setAttribute("name", fontStyleId);
    fontStyle[0].setAttribute("id", fontStyleId);
    fontStyle[1].setAttribute("id", fontStyleId);
    fontStyle[2].setAttribute("id", fontStyleId);
}

// показывает и скрывает редактор
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

// функция, к-рая отрисовывает текст 
function drawTexts() {
    if(image) {
        // убираем все с canvas
        ctx.clearRect( 0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }

    for(let i=0; i<arr.length; i++){
        // цвет текста
        ctx.fillStyle = arr[i].color;
        // стили текста
        ctx.font = `${arr[i].fontStyle} ${arr[i].fontSize}px ${arr[i].fontFamily}`;
        // добавляем
        ctx.fillText(arr[i].text, arr[i].startX, arr[i].startY);
    }
}

// upload image 

function loadImg(e) {
    const file = e.target.files[0];
    // если файл успешно загрузили
    if(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // создаем image
            image = new Image();
            image.onload = function() {
                // убираем прежние стили до загрузки 
                hideBgCanvas();
                // новая ширина и высота canvas
                canvas.width = image.width;
                canvas.height = image.height;
                // отображаем фон
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                // отображаем текст
                drawTexts();
            }
            image.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

// загружаем и отображаем картинку
uploadBtn.addEventListener("change", loadImg);

// textarea
function getTextareas() {
    // собираем все введенные тексты в textarea
    let texts = document.querySelectorAll(".settings__text__textarea");
    // присваиваем текстам id и добавляем и в массив
    let arrId = Array.from(texts).map((a) => a.id);
    // переписываем массив
    arr = []
    // пушим новые значения
    for(let i=0; i<arrId.length; i++) {
        // radio btns проверяем, который checked
        // fontstyle
        let fontStyleValue;
        let radioBtns = document.querySelectorAll(`input[name="${fontStyleIds[i]}"]`);
        for(let radioBtn of radioBtns) {
            if(radioBtn.checked) {
                fontStyleValue = radioBtn.value;
                break;
            }
        }

        // ширина текста
        let width = Math.ceil(ctx.measureText(document.getElementById(`${arrId[i]}`).value.trim()).width);
        
        let x;
        let y;

        if(i == 0) {
            x = canvas.width/2 - width/2;
            y = 50;
        } else {
            x = canvas.width/2 - width/2;
            y = canvas.height - 50;
        }

        arr.push({
            color: document.getElementById(`${colorIDs[i]}`).value,
            fontFamily: 'Arial',
            fontSize: document.getElementById(`${rangeIDs[i]}`).value,
            fontStyle: fontStyleValue,
            height: document.getElementById(`${rangeIDs[i]}`).value,
            id: arr.length,
            isDragging: false,
            startX: x,
            startY: y,
            text: document.getElementById(`${arrId[i]}`).value.trim(),
            width: width
        });
    }

    drawTexts();
}

window.addEventListener('DOMContentLoaded', () => {
    showTemplateText(`top text`);
    showTemplateText(`bottom text`);
});

// индекс
function getID(e, el) {
    let result;
    if(el == '5') {
        result = parseInt(e.id.slice(el)) - 1;
    } else if(el == '6') {
        result = parseInt(e.id.slice(el)) - 1;
    } else {
        result = parseInt(e.id.slice(el)) - 1;
    }

    return result;
}

// размер текста
function getFontSize(e) {
    let id = getID(e, 6);
    arr[id].fontSize = document.getElementById(`${rangeIDs[id]}`).value;
    drawTexts();
}

// стиль текста
function getFontStyle(e) {
    let id = getID(e, 10);

    let fontStyleValue;
    let radioBtns = document.querySelectorAll(`input[name="${fontStyleIds[id]}"]`);
    for(let radioBtn of radioBtns) {
        if(radioBtn.checked) {
            fontStyleValue = radioBtn.value;
            break;
        }
    }

    arr[id].fontStyle = fontStyleValue;
    drawTexts();
}

// цвет текста 
function getColor(e) {
    let id = getID(e, 6);
    let color = document.getElementById(e.id).value;
    arr[id].color = color;
    drawTexts();
}

function hideBgCanvas() {
    let container = document.getElementById('preview');
    container.style.border = 'none';
    container.style.borderRadius = 'none';
    container.style.backgroundColor = 'transparent';
}

// сохранить картинку
document.getElementById('download-btn').addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'meme-generator.png'; 
    link.click();
});