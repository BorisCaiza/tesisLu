import gato from "../assets/images/words/gato.png";
import pato from "../assets/images/words/pato.png";
import fresa from "../assets/images/words/fresa.png";
import ojoImage from "../assets/images/words/ojo.png";
import mesaImage from "../assets/images/words/mesa.webp";
import bananaImage from "../assets/images/words/banana.png";
import rojoImage from "../assets/images/words/rojo.png";
import manzanaImage from "../assets/images/words/manzana.png";
import lunaImage from "../assets/images/words/luna.png";
import cunaImage from "../assets/images/words/cuna.png";
import focoImage from "../assets/images/words/foco.png";
import cocoImage from "../assets/images/words/coco.png";
import estrellaImage from "../assets/images/words/estrella.png";
import huellaImage from "../assets/images/words/huella.png";
import rocaImage from "../assets/images/words/roca.png";
import focaImage from "../assets/images/words/foca.png";
import pizarraImage from "../assets/images/words/pizarra.png";
import guitarraImage from "../assets/images/words/guitarra.png";
import carameloImage from "../assets/images/words/caramelo.webp";
import hieloImage from "../assets/images/words/hielo.png";

export const wordsDataService = () => {
    return [
        { id: 1, word: "Gato", rimas: 2, syllable_separation: "ga-to", image: gato },
        { id: 2, word: "Pato", rimas: 1, syllable_separation: "pa-to", image: pato },
        { id: 3, word: "Fresa", rimas: 4, syllable_separation: "fre-sa", image: fresa },
        { id: 4, word: "Mesa", rimas: 3, syllable_separation: "me-sa", image: mesaImage },
        { id: 5, word: "Ojo", rimas: 6, syllable_separation: "o-jo", image: ojoImage },
        { id: 6, word: "Rojo", rimas: 5, syllable_separation: "ro-jo", image: rojoImage },
        { id: 7, word: "Banana", rimas: 8, syllable_separation: "ba-na-na", image: bananaImage },
        { id: 8, word: "Manzana", rimas: 7, syllable_separation: "man-za-na", image: manzanaImage },
        { id: 9, word: "Luna", rimas: 10, syllable_separation: "lu-na", image: lunaImage },
        { id: 10, word: "Cuna", rimas: 9, syllable_separation: "cu-na", image: cunaImage },
        { id: 11, word: "Foco", rimas: 12, syllable_separation: "fo-co", image: focoImage },
        { id: 12, word: "Coco", rimas: 11, syllable_separation: "co-co", image: cocoImage },
        { id: 13, word: "Estrella", rimas: 14, syllable_separation: "es-tre-lla", image: estrellaImage },
        { id: 14, word: "Huella", rimas: 13, syllable_separation: "hue-lla", image: huellaImage },
        { id: 15, word: "Roca", rimas: 16, syllable_separation: "ro-ca", image: rocaImage },
        { id: 16, word: "Foca", rimas: 15, syllable_separation: "fo-ca", image: focaImage },
        { id: 17, word: "Pizarra", rimas: 18, syllable_separation: "pi-zar-ra", image: pizarraImage },
        { id: 18, word: "Guitarra", rimas: 17, syllable_separation: "gui-tar-ra", image: guitarraImage },
        { id: 19, word: "Caramelo", rimas: 20, syllable_separation: "ca-ra-me-lo", image: carameloImage },
        { id: 20, word: "Hielo", rimas: 19, syllable_separation: "hie-lo", image: hieloImage }
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


