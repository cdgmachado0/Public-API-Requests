// Main variable
const gallery = document.querySelector('#gallery');

// Request of data
fetch('https://randomuser.me/api/?results=12&nat=us')
    .then(checkStatus)
    .then(response => response.json())
    .then(createGallery)
    .then(createModalWindow)
    .catch(err => console.error('Something went wrong:', err));


/**
 * Checks if the response was successfully submitted
 * @param {object} response HTTP response from the request made to the server
 */
function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}


/**
 * Creates the gallery of boxes with the general details of each employee
 * @param {object} data JSON data containing the information of each employee
 */
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


/**
 * Creates the modal window for each employee
 * @param {object} data JSON data containing the information of each employee
 */
function createModalWindow(data) {
    //Format the two details that need to be formatted according to the instructions of the project
    function formatDetails(detail) { 
        const phoneRegex = /^\D*?(\d{3})\D*?(\d{3})\D*?(\d{4})/; 
        const dobRegex = /^(\d{4})\D*(\d{2})\D*(\d{2}).+/;
        if (detail.charAt(0) === '(') {
            return formattedNum = detail.replace(phoneRegex, '($1) $2-$3'); 
        } else {
            return formattedDOB = detail.replace(dobRegex, '$2/$3/$1');   
        }
    }

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
                    <p class="modal-text cap">${person.location.city}</p>
                    <hr>
                    <p class="modal-text">${formattedNum}</p>
                    <p class="modal-text">${person.location.street.name} ${person.location.street.number}, ${person.location.state}. ${person.location.postcode}</p>
                    <p class="modal-text">Birthday: ${formattedDOB}</p>
                </div>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
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

    //Adds the EventListeners that act on each modal window
    const closeButtons = gallery.querySelectorAll('#modal-close-btn');
    for (let button of closeButtons) {
        button.addEventListener('click', closeModal);
    }
    const buttonsContainer = document.getElementsByClassName('modal-btn-container');
    for (let buttons of buttonsContainer) {
        for (let button of buttons.children) {
            button.addEventListener('click', switchModal)
        }
    }   
}


/**
 * Displays/Hides the proper modal window depending on user's interaction
 * @param {event} e Event object from an EventListener
 */
function displayModal(e) { 
    const target = e.target;
    let email;
    //Gets the email of the target, and use it as a reference to see which modal window is displayed
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


/**
 * Closes the current modal window (Esc or click on "X")
 * @param {event} e Event object from an EventListener
 */
function closeModal(e) {
    const modalList = gallery.children;
    let currentModal = '';
    if (e.key === 'Escape') {
        for (let modal of modalList) {
            if (modal.className === 'modal-container' && modal.style.display !== 'none') {
                modal.style.display = 'none';
                break;
            }
        }
    } else if (e.type === 'click') {
        if (e.target.id !== 'modal-close-btn') {
            currentModal = e.target.parentNode.parentNode.parentNode;
        } else {
            currentModal = e.target.parentNode.parentNode;
        }
        currentModal.style.display = 'none';
    }
} 


/**
 * Handles the interaction between switching modals back and forth with the Next/Prev buttons
 * @param {event} e Event object from an EventListener
 */
function switchModal(e) {
    const userSearch = document.getElementById('search-input').value;
    const currentModal = e.target.parentNode.parentNode;
    let nextModal = '';
    let prevModal = '';
    let modalArray = [];
    //Adjusts the swicting of modals when a search has been made with the Search Bar
    function adjustSwitching(index1, index2) {
        const currModalIndex = modalArray.indexOf(currentModal);
        if (e.target.id === 'modal-next' && currModalIndex !== index1 && nextModal) {
            currentModal.style.display = 'none';
            nextModal.style.display = '';
        } else if (e.target.id === 'modal-prev' && currModalIndex !== index2) {
            currentModal.style.display = 'none';
            prevModal.style.display = '';
        } 
    }

    if (userSearch === '') {
        modalArray = Array.from(gallery.children);
        nextModal = currentModal.nextElementSibling;
        prevModal = currentModal.previousElementSibling;
        adjustSwitching(23, 12);
    } else {
        let list = gallery.children;
        for (let card of list) {
           if (card.style.display !== 'none' && card.className === 'card') {
            for (let i = 12; i < 24; i++) {
                let nameCard = card.querySelector('h3').textContent;
                let nameModal = list[i].querySelector('h3').textContent;
                if (nameCard === nameModal) {
                    modalArray.push(list[i]);
                }
            }
           }
        }
        const last = modalArray.length;
        nextModal = modalArray[modalArray.indexOf(currentModal) + 1]; 
        prevModal = modalArray[modalArray.indexOf(currentModal) - 1];
        adjustSwitching(last, 0);
    }
}

// EventListener for closing a modal with the "Esc" key
document.addEventListener('keyup', closeModal);


// Addition of the Search Bar to index.html
const searchForm = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
`;
const searchContainer = document.querySelector('div.search-container')
searchContainer.innerHTML = searchForm;

// Handles the dynamic search of the Search Bar
searchContainer.addEventListener('keyup', e => {
    let search = e.target.value;
    const cardList = gallery.children;

    for (let i = 0; i < 12; i++) {
        let fullName = cardList[i].querySelector('h3').textContent.toLowerCase();
        if (!fullName.includes(search.toLowerCase())) {
            cardList[i].style.display = 'none';
        } else {
            cardList[i].style.display = '';
        }
    }
});


















