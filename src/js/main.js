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
let current_text_index = null;
// главный массив, где храним стили и координаты текста
let arr = [];
let colorIDs = [];
let rangeIDs = [];
let fontStyleIds = [];
// x/y
let arrX = [];
let arrY = [];

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
    // radio btns
    let fontStyle = newContainer.querySelectorAll('.settings__text__menu__fontstyle__item');
    let fontStyleId = 'fontstyle-' + num;
    fontStyleIds.push(fontStyleId);
    fontStyle[0].setAttribute("name", fontStyleId);
    fontStyle[1].setAttribute("name", fontStyleId);
    fontStyle[2].setAttribute("name", fontStyleId);
    fontStyle[0].setAttribute("id", fontStyleId);
    fontStyle[1].setAttribute("id", fontStyleId);
    fontStyle[2].setAttribute("id", fontStyleId);

    return newContainer;
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
        let fontStyleValue;
        let radioBtns = document.querySelectorAll(`input[name="${fontStyleIds[i]}"]`);
        for(let radioBtn of radioBtns) {
            if(radioBtn.checked) {
                fontStyleValue = radioBtn.value;
                break;
            }
        }
        // ширина текста
        let measure = ctx.measureText(document.getElementById(`${arrId[i]}`).value);
        let width = Math.ceil(measure.width);

        arr.push({
            color: document.getElementById(`${colorIDs[i]}`).value,
            fontFamily: 'Arial',
            fontSize: document.getElementById(`${rangeIDs[i]}`).value,
            fontStyle: fontStyleValue,
            height: document.getElementById(`${rangeIDs[i]}`).value,
            id: arr.length,
            isDragging: false,
            startX: arrX[i],
            startY: arrY[i],
            text: document.getElementById(`${arrId[i]}`).value.trim(),
            width: width
        });
    }

    drawTexts();
    console.log(arrX)
}

window.addEventListener('DOMContentLoaded', () => {
    arrX.push(100);
    arrY.push(100);
    showTemplateText();
    arrX.push(canvas.width);
    arrY.push(canvas.height);
    showTemplateText();
    // присваиваем функцию 
    canvas.addEventListener('mousedown', mouse_down);
    canvas.addEventListener('mousemove', mouse_move);
    canvas.addEventListener('mouseup', mouse_up);
    canvas.addEventListener('mouseover', mouse_over);
});

// добаляет текст и поле для ввода при нажатии на кнопку "добавить текст"

document.getElementById("addText-btn").addEventListener('click', () => {
    arrX.push(canvas.width/2);
    arrY.push(canvas.height/2);
    showTemplateText();
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

// удаляет текст 
function deleteTextarea(e) {
    // родительский элемент
    let parent = e.parentNode.parentNode;
    let id = getID(e.parentNode, 5)
    // удаляем элемент
    parent.remove();
    arr.splice(id, 1);
    arrX.splice(id, 1);
    arrY.splice(id, 1);
    colorIDs.splice(id, 1);
    rangeIDs.splice(id, 1);
    // отображаем новую картинку
    drawTexts();
}

let current;

// mouse down event для canvas
let mouse_down = function(e) {
    console.log(`Mouse coordinates: (${e.clientX}, ${e.clientY})`);
    arr.forEach(txt => {
        console.log(`Text coordinates: (${txt.startX}, ${txt.startY})`);
        console.log(`Text width: ${txt.width}, Text height: ${txt.height}`);
        let rect = canvas.getBoundingClientRect();
        let mouseX = e.clientX - rect.left;
        let mouseY = e.clientY - rect.top;

        if (
            mouseX > txt.startX &&
            mouseX < txt.startX + txt.width &&
            mouseY > txt.startY &&
            mouseY < txt.startY + txt.height
        ) {
            txt.isDragging = true;
            canvas.style.cursor = 'pointer';
            console.log('clicked');
        } else {
            canvas.style.cursor = 'default';
        }
    });
}

let mouse_up = function() {
    arr.forEach(txt => {
        if(txt.isDragging) {
            arrX.splice(txt.id, 1, txt.startX);
            arrY.splice(txt.id, 1, txt.startY)
        }
        drawTexts();
    })
    
}

// двигаем текст
let mouse_move = function(e) {
    arr.forEach(txt => {
        if(txt.isDragging) {
            let rect = canvas.getBoundingClientRect();
            txt.startX = e.clientX - rect.left;
            txt.startY = e.clientY - rect.top;
            canvas.style.cursor = 'pointer';
        } else {
            canvas.style.cursor = 'default';
        }
    });
}

let mouse_over = function(e) {
    arr.forEach(txt => {
        console.log(`Text coordinates: (${txt.startX}, ${txt.startY})`);
        console.log(`Text width: ${txt.width}, Text height: ${txt.height}`);
        let rect = canvas.getBoundingClientRect();
        let mouseX = e.clientX - rect.left;
        let mouseY = e.clientY - rect.top;

        if (
            mouseX >= txt.startX &&
            mouseX <= txt.startX + txt.width &&
            mouseY >= txt.startY - txt.height &&
            mouseY <= txt.startY
        ) {
            canvas.style.cursor = 'pointer';
            console.log('over');
        } else {
            canvas.style.cursor = 'default';
        }
    });
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