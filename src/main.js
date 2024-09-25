import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';

let input="";
document.getElementById("search-images").addEventListener("input",(event)=>{
    input = event.target.value;
    console.log(input);
        // Eğer arama kutusu boşsa butonu devre dışı bırak
        if (input === "") {
          document.getElementById("button-search").setAttribute("disabled", true);
      } else {
        document.getElementById("button-search").removeAttribute("disabled"); // Butonu etkinleştir
      }
});

document.getElementById("button-search").addEventListener("click",()=>{
    if (input.trim() !== "")
    fetchImages(input);

})
input="";
async function fetchImages(query) {
    const API_KEY="46148629-af6e53c51d7dfe0604412e9db";
    const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=20`;
    try{
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        const data = await response.json();
        //bos bir dizi donduyse bu mesaji kullaniciya göstericem
        if(data.totalHits===0){
            iziToast.show({
                title: 'No Images',
                message: 'Sorry, there are no images matching your search query. Please try again!',
                position: 'topRight', // Bildirimin konumu
                timeout: 5000, // 5 saniye sonra otomatik kapanır
                color: 'warning', // Bildirim rengi (success, warning, info, error)
            });
            return;
        }
        displayImages(data.hits);
    }   
    catch(e){
        console.log("Photos can't taken");
        iziToast.error({
            title: 'Error',
            message: e.message,
            position: 'topRight'
        });
    }
}


 function createListElement(images){

    for (const image of images) {
      const { preview, original, description } = image;


    const galleryUL = document.querySelector("ul.gallery");
    const createdA = document.createElement("a");
    createdA.classList.add("gallery-link");
    createdA.setAttribute("onclick","return false");
    createdA.href = original;

    const createdImg = document.createElement("img");
    createdImg.classList.add("gallery-image");
    createdImg.src= preview;
    createdImg.dataset.source= original;
    createdImg.alt = description;

    createdA.appendChild(createdImg);

    const createdLi = document.createElement("li");
    createdLi.classList.add("gallery-item");

    createdLi.appendChild(createdA);
    galleryUL.appendChild(createdLi);
    
    }
}
function displayImages(images){
    const imagediv = document.getElementById("image-results");
    const galleryUl = document.getElementById("gallery");

    imagediv.innerHTML="";
    images.forEach(image => {


        const img = document.createElement("img");
        img.src = image.webformatURL;
        img.alt = image.tags;

        const link=document.createElement("a");
        link.classList.add("link-a");
        link.href = image.largeImageURL;
        link.setAttribute("data-lightbox", "gallery"); // SimpleLightbox için gerekli
        link.appendChild(img);

                // Bilgileri içeren div oluştur
        const imgList = document.createElement("li");
        imgList.classList.add("image-list");
        imgList.appendChild(link);

        const infoDiv = document.createElement("div");
        infoDiv.classList.add("image-info");

        const likes = document.createElement("p");
        likes.textContent=`Likes:${image.likes}`;

        const views = document.createElement("p");
        views.textContent=`Views:${image.views}`;

        const comments = document.createElement("p");
        comments.textContent=`Comments:${image.comments}`;

        const download = document.createElement("p");
        download.textContent=`Downloads:${image.downloads}`;

        infoDiv.appendChild(likes);
        infoDiv.appendChild(views);
        infoDiv.appendChild(comments);
        infoDiv.appendChild(download);

        imgList.appendChild(infoDiv);

        galleryUl.appendChild(imgList);
        document.body.appendChild(galleryUl);


    });
 

    new SimpleLightbox('#gallery a', {
        captionsData: 'alt',
        captionDelay: 250
      });


}

window.onload = clickTheElements;

export function clickTheElements(){
    const imagesDom = document.querySelectorAll('.link-a');
    let currentLightBox = null; 
    let currentIndex = 0;
console.log("tıklandı resme");
  imagesDom.forEach((link,index) => 
  {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        currentIndex=index;
        console.log( "tıkladım")
        if (event.target.nodeName !== "IMG") {
          return; // kullanıcı fotografların arasına tıkladı
        }
        const selectedImageSrc = link.getAttribute('href');
        const selectedImageAlt = link.querySelector('img').alt;

  // asagidaki galeriyi sadece boyutunu almak icin dom secimi yapıyorum.
        const ulElement = document.querySelector("ul.gallery");
        let ulWidth = ulElement.offsetWidth;
        let ulHeight = ulElement.offsetHeight;
  
          const modal = new SimpleLightbox(
            {
              items: [
                {
                    src: selectedImageSrc,
                    alt: selectedImageAlt,
                },
                ...Array.from(imagesDom).map(img => ({
                    src: img.getAttribute('href'),
                    alt: img.querySelector('img').alt,
                }))
            ],
            captionsData: `${selectedImageAlt}`, // Açıklama için title özniteliğini kullan
            captionDelay: 250
          });
          modal.showModal();
          currentLightBox = modal;
                      // Modal içeriğini güncelle
                      modal.on('show.simplelightbox', () => {
                        modal.select(currentIndex);
                    });
          const prevBtn = modal.element().querySelector('#prev');
          const nextBtn = modal.element().querySelector('#next');

          prevBtn.addEventListener("click", () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : imagesDom.length - 1;
            updateModal(modal, imagesDom[currentIndex]);

            const newSrc = imagesDom[currentIndex].querySelector('img').dataset.source; // Doğru kaynak
            const newAlt = imagesDom[currentIndex].querySelector('img').alt; // Alt metni al
            modal.element().querySelector('img').src = newSrc;
            modal.element().querySelector('img').alt = newAlt;
          });
      
          nextBtn.addEventListener("click", () => {
            currentIndex = (currentIndex < imagesDom.length - 1) ? currentIndex + 1 : 0;
            updateModal(modal, imagesDom[currentIndex]);

            const newSrc = imagesDom[currentIndex].querySelector('img').dataset.source; // Doğru kaynak
            const newAlt = imagesDom[currentIndex].querySelector('img').alt; // Alt metni al
            modal.element().querySelector('img').src = newSrc;
            modal.element().querySelector('img').alt = newAlt;
          });
  
          
      const onKeyDownEsc = (event)=>{
        if((event.key === "Escape" || event.key === "Esc") && currentLightBox){
        currentLightBox.close();
        document.removeEventListener("keydown",onKeyDownEsc);
        currentLightBox = null;
      }
  
    }

    document.addEventListener("keydown",onKeyDownEsc);
    
      });
  });

}