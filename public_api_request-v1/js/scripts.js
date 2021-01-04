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
    const peopleModals = data.results.map(person => {
        let formattedNum = formatDetails(person.cell);
        let formattedDOB = formatDetails(person.dob.date);
        return `
        <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${person.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
                <p class="modal-text">${person.email}</p>
                <button id="move-right">Next</button>
                <button id="move-left">Previous</button>
                <p class="modal-text cap">${person.location.city}</p>
                <hr>
                <p class="modal-text">${formattedNum}</p>
                <p class="modal-text">${person.location.street.name} ${person.location.street.number}, ${person.location.state}. ${person.location.postcode}</p>
                <p class="modal-text">Birthday: ${formattedDOB}</p>
            </div>
        </div>
    `
    }); 
    for (let person of peopleModals) {
        gallery.insertAdjacentHTML('beforeend', person);
    }
    const modalList = gallery.children;
    for (let i = 12; i < 24; i++) {
        let modal = modalList[i]
        modal.style.display = 'none';
    }

    const closeButtons = gallery.querySelectorAll('#modal-close-btn');
    for (let button of closeButtons) {
        button.addEventListener('click', closeModal);
    }
}


function displayModal(e) { 
    const target = e.target;
    let email;
    if (target.className === 'card-info-container') {
        email = target.firstElementChild.nextElementSibling;
    } else if (target.tagName === 'IMG') {
        email = target.parentNode.nextElementSibling.children[1];
    } else if (target.tagName === 'P' && target.className === 'card-text') {
        email = target;
    } else if (target.tagName === 'P') {
        email = target.previousElementSibling;
    } else if (target.tagName === 'H3') {
        email = target.nextElementSibling;
    } else if (target.className === 'card') {
        email = target.children[1].children[1];
    } else if (target.className === 'card-img-container') {
        email = target.nextElementSibling.children[1];
    }

    const modalList = gallery.children;
    for (let i = 12; i < 24; i++) {
        currentModal = modalList[i];
        let personEmail = currentModal.querySelector('p').textContent;
        if (email.textContent === personEmail) {
            currentModal.style.display = '';
            break;
        }
    }
}

let currentModal;
function closeModal(e) {
    if (e.key === 'Escape') {
        currentModal.style.display = 'none';
    } else if (e.type === 'click') {
        currentModal.style.display = 'none';
    }
} 

document.addEventListener('keyup', closeModal);


function formatDetails(detail) { 
    const phoneRegex = /^\D*?(\d{3})\D*?(\d{3})\D*?(\d{4})/; 
    const dobRegex = /^(\d{4})\D*(\d{2})\D*(\d{2}).+/;

    if (detail.charAt(0) === '(') {
        return formattedNum = detail.replace(phoneRegex, '($1) $2-$3'); 
    } else {
        return formattedDOB = detail.replace(dobRegex, '$2/$3/$1');   
    }
}


const searchForm = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
`;

const searchContainer = document.querySelector('div.search-container')
searchContainer.innerHTML = searchForm;


searchContainer.addEventListener('keyup', (e, data) => {
    let search = e.target.value;
    const modalList = gallery.children;

    for (let i = 0; i < 12; i++) {
        let fullName = modalList[i].children[1].firstElementChild.textContent.toLowerCase();
        if (!fullName.includes(search.toLowerCase())) {
            modalList[i].style.display = 'none';
        } else {
            modalList[i].style.display = '';
        }
    }
});


















