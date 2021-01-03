const gallery = document.querySelector('#gallery');


fetch('https://randomuser.me/api/?results=12&nat=us')
    .then(checkStatus)
    .then(response => response.json())
    .then(createGallery)
    .then(createModalWindow)
    .catch(err => console.error('Something went wrong:', err));


function createGallery(data) {
    const peopleGallery = data.results.map(person => `
    <div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${person.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
            <p class="card-text">${person.email}</p>
            <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
        </div>
    </div>
    `).join(''); 

    gallery.innerHTML = peopleGallery;
    const cardList = gallery.children;
    for (let card of cardList) {
        card.addEventListener('click', displayModal);
    } 
    return data; 
}

function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

function createModalWindow(data) {
    const peopleModals = data.results.map(person => `
        <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${person.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
                <p class="modal-text">${person.email}</p>
                <p class="modal-text cap">${person.location.city}</p>
                <hr>
                <p class="modal-text">${person.cell}</p>
                <p class="modal-text">${person.location.street.name} ${person.location.street.number}, ${person.location.state}. ${person.location.postcode}</p>
                <p class="modal-text">Birthday: ${person.dob.date}</p>
            </div>
        </div>
    `);
    for (let person of peopleModals) {
        gallery.insertAdjacentHTML('beforeend', person);
    }
    const list = gallery.children; //manage to get the modal window disappear
    for (let i = 0; i < 12; i++) {
        let div = list[i + 12]
        div.style.display = 'none';
    }
}

function displayModal(e) {
    const cardDiv = e.target;
    console.log(cardDiv);
}











