const img = document.querySelector('img.detail-image');
const h2 = document.querySelector('h2.title');
const ul = document.querySelector('ul.ingredients-list');
let listOfIngredients;
const editForm = document.querySelector('form#update-form');
const addIngForm = document.querySelector('form#ingredient-form');
const spiceImages = document.querySelector('div#spice-images');

getFirstSpice(); 
editFormEvent();

IngEvent();
getAllSpices();
spiceImagesEvent();

function getFirstSpice(){
    fetch('http://localhost:3000/spiceblends/1')
    .then(res => res.json())
    .then(spice => {
        listOfIngredients = spice.ingredients;
        renderSpice(spice);
        listOfIngredients.forEach(ing => {
            addIngredientsToUl(ing);
        })
    })
}

function renderSpice(spice){
    img.src = spice.image;
    img.alt = spice.title;
    h2.textContent = spice.title; 
    editForm.dataset.id = spice.id;
    addIngForm.dataset.id = spice.id;
    ul.innerHTML = "";
}

function addIngredientsToUl(ingredient){
    const li = document.createElement('li');
    li.dataset.id = ingredient.id;
    li.textContent = ingredient.name;
    ul.append(li);
}

function editFormEvent(){
    editForm.addEventListener('submit', function(e){
        e.preventDefault();
        let newTitle = e.target.title.value;
        let newSpice = {
            id: e.target.dataset.id,
            title: newTitle
        }
        patchToDB(newSpice);
        e.target.reset();
    })
}

function patchToDB(newSpice){
    fetch(`http://localhost:3000/spiceblends/${newSpice.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSpice),
    })
    .then(res => res.json())
    .then(data => {
        h2.textContent = data.title;
    })
}

//Advanced Deliverables 
function IngEvent(){
    addIngForm.addEventListener('submit', function(e){
        e.preventDefault();
        let newIngName = e.target.name.value;
        let newIng = {
            name: newIngName,
            spiceblendId: parseInt(e.target.dataset.id)
        }
        addIngToDB(newIng);
    })
}

function addIngToDB(newIng){
    fetch(`http://localhost:3000/ingredients`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newIng),
    })
    .then(res => res.json())
    .then(data => {
        addIngredientsToUl(data);
    })
}

function getAllSpices(){
    fetch('http://localhost:3000/spiceblends')
    .then(res => res.json())
    .then(arrOfSpices => {
        arrOfSpices.forEach(spice => {
            renderAllSpices(spice)
        })
    })
}

function renderAllSpices(spice){
    const newImg = document.createElement('img');
    newImg.src = spice.image;
    newImg.dataset.id = spice.id;
    spiceImages.append(newImg);
}

function spiceImagesEvent(){
    spiceImages.addEventListener('click', function(e){
        if (e.target.matches('img')){
            getSpiceInfo(e.target.dataset.id);
        }
    })
}

function getSpiceInfo(spiceId){
    fetch(`http://localhost:3000/spiceblends/${spiceId}`)
    .then(res => res.json())
    .then(spice => {
        listOfIngredients = spice.ingredients;
        renderSpice(spice);
        listOfIngredients.forEach(ing => {
            addIngredientsToUl(ing);
        })
    })
}