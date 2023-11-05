import gato from "../assets/images/words/gato.png";
import pato from "../assets/images/words/pato.avif";
import fresa from "../assets/images/words/fresa.jpg";
import ojoImage from "../assets/images/words/ojo.jpg";
import mesaImage from "../assets/images/words/mesa.webp";
import bananaImage from "../assets/images/words/banana.avif";
import rojoImage from "../assets/images/words/rojo.jpg";
import manzanaImage from "../assets/images/words/manzana.jpg";
import lunaImage from "../assets/images/words/luna.jpg";
import cunaImage from "../assets/images/words/cuna.jpg";
import focoImage from "../assets/images/words/foco.png";
import cocoImage from "../assets/images/words/coco.jpg";
import estrellaImage from "../assets/images/words/estrella.avif";
import huellaImage from "../assets/images/words/huella.jpg";
import rocaImage from "../assets/images/words/roca.avif";
import focaImage from "../assets/images/words/foca.jpg";
import pizarraImage from "../assets/images/words/pizarra.jpg";
import guitarraImage from "../assets/images/words/guitarra.jpg";
import carameloImage from "../assets/images/words/caramelo.webp";
import hieloImage from "../assets/images/words/hielo.jpg";

export const wordsDataService = () => {
    return [
        { id: 1, word: "gato", rimas: 2, syllable_separation: "ga-to", image: gato },
        { id: 2, word: "pato", rimas: 1, syllable_separation: "pa-to", image: pato },
        { id: 3, word: "fresa", rimas: 4, syllable_separation: "fre-sa", image: fresa },
        { id: 4, word: "mesa", rimas: 3, syllable_separation: "me-sa", image: mesaImage },
        { id: 5, word: "ojo", rimas: 6, syllable_separation: "o-jo", image: ojoImage },
        { id: 6, word: "rojo", rimas: 5, syllable_separation: "ro-jo", image: rojoImage },
        { id: 7, word: "banana", rimas: 8, syllable_separation: "ba-na-na", image: bananaImage },
        { id: 8, word: "manzana", rimas: 7, syllable_separation: "man-za-na", image: manzanaImage },
        { id: 9, word: "luna", rimas: 10, syllable_separation: "lu-na", image: lunaImage },
        { id: 10, word: "cuna", rimas: 9, syllable_separation: "cu-na", image: cunaImage },
        { id: 11, word: "foco", rimas: 12, syllable_separation: "fo-co", image: focoImage },
        { id: 12, word: "coco", rimas: 11, syllable_separation: "co-co", image: cocoImage },
        { id: 13, word: "estrella", rimas: 14, syllable_separation: "es-tre-lla", image: estrellaImage },
        { id: 14, word: "huella", rimas: 13, syllable_separation: "huel-la", image: huellaImage },
        { id: 15, word: "roca", rimas: 16, syllable_separation: "ro-ca", image: rocaImage },
        { id: 16, word: "foca", rimas: 15, syllable_separation: "fo-ca", image: focaImage },
        { id: 17, word: "pizarra", rimas: 18, syllable_separation: "pi-zar-ra", image: pizarraImage },
        { id: 18, word: "guitarra", rimas: 17, syllable_separation: "gui-tar-ra", image: guitarraImage },
        { id: 19, word: "caramelo", rimas: 20, syllable_separation: "ca-ra-me-lo", image: carameloImage },
        { id: 20, word: "hielo", rimas: 19, syllable_separation: "hie-lo", image: hieloImage }
    ];
}

export function getrhymingWords() {
    const palabras = wordsDataService();
    const idAleatorio = Math.floor(Math.random() * palabras.length);
    const palabraAleatoria = palabras[idAleatorio];

    const rima = palabras.find(word => word.id === palabraAleatoria.rimas);
    console.log(rima);
    let idAleatorio2;
    do {
        idAleatorio2 = Math.floor(Math.random() * palabras.length);
    } while (idAleatorio2 === palabraAleatoria.rimas || idAleatorio2 === idAleatorio);

    const seleccionAleatoria = palabras[idAleatorio2];

    return {
        palabra: palabraAleatoria,
        rima,
        seleccionAleatoria,
    };
}


