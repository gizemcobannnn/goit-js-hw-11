import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';

let input="";
document.getElementById("search-images").addEventListener("input",()=>{
    input = event.target.value;
});

document.getElementById("button-search").addEventListener("click",()=>{
    fetchImages();

})

async function fetchImages() {
    try{
        const response = await fetch("https://pixabay.com/api?key=46148629-af6e53c51d7dfe0604412e9db/${input}");
        return response.blob();
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        const data = await response.json();
        displayImages(data.hits);
    }   
    catch(e){
        console.log("Photos can't taken");
        iziToast.error({
            title: 'Error',
            message: error.message,
            position: 'topRight'
        });
    }

}

function displayImages(images){
    const imagediv = document.getElementById("image-results");
    imagediv.innerHTML="";
    images.forEach(image => {
        const img = document.createElement("img");
        img.src = image.webformatURL;
        img.alt = image.tags;
        imagediv.appendChild(img);
    
    });
    new SimpleLightbox('#gallery a', {
        captionsData: 'alt',
        captionDelay: 250
      });
}