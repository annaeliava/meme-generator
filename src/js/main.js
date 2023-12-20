// upload image 

let uploadBtn = document.querySelector("#upload");
uploadBtn.addEventListener("change", function() {
    let reader;
    if (this.files && this.files[0]) {
        reader = new FileReader();
        reader.onload = (e) => {
            // создаем img тэг
            let bg = document.createElement('img');
            bg.setAttribute('id', 'img-preview');
            // отображаем загруженную картинку в preview
            bg.src = e.target.result;
            // добавляем элемент в DOM
            document.getElementById('preview').appendChild(bg);
        }
        reader.readAsDataURL(this.files[0]);
    }
});

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
}

document.getElementById("addText-btn").addEventListener('click', () => {
    showTemplateText();
});

function deleteTextarea(e) {
    let parent = e.parentNode;
    parent.remove();
}

document.addEventListener('DOMContentLoaded', () => {
    showTemplateText();
    showTemplateText();
});