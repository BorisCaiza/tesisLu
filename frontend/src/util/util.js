import flipcard from "../assets/sounds/flipcard.wav";

export const playAudioFlipcard = () => {
    if (flipcard) {
        try {
            const audio = new Audio(flipcard);
            audio.play();
        } catch (error) {
            console.log(error);
        }

    }
};