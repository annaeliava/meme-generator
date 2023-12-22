// upload image 

let uploadBtn = document.querySelector("#upload");
let reader;
let image;
uploadBtn.addEventListener("change", function() {
    let imageDataURL = URL.createObjectURL(this.files[0])
    image = new Image();
    image.src = imageDataURL;
    hideBgCanvas();
    image.addEventListener('load', () => {
        let canvas = document.querySelector('#meme-preview');
        showImageCanvas(canvas, image);
        updateCanvas(canvas);
    }, {once:true});
});

function getTextareas() {
    let texts = document.querySelectorAll(".settings__text__textarea");
    let arrId = Array.from(texts).map((a) => a.id);
    let text = []
    for(let i=0; i<arrId.length; i++) {
        text.push(document.getElementById(`${arrId[i]}`).value);
    }
    console.log(text)
}

function hideBgCanvas() {
    let container = document.getElementById('preview');
    container.style.border = 'none';
    container.style.borderRadius = 'none';
    container.style.backgroundColor = 'transparent';
}

function showImageCanvas(canvas, image) {
    const ctx = canvas.getContext('2d');
    const width = image.width;
    const height = image.height;

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0);
}

function updateCanvas(canvas) {
    getTextareas();
    console.log(canvas);
    console.log(image)
}