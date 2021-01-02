fetch('https://randomuser.me/api/?results=12&nat=us')
    .then(checkStatus)
    .then(response => response.json())
    .then(createGallery)
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
    const gallery = document.querySelector('#gallery');
    gallery.innerHTML = peopleGallery;
}

function checkStatus(response) {
    if (response.ok) {
        return Promise.resolved(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}


