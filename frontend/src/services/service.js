import api from "../api/api";

const services = async () => {
    const data = await api.get('/services/');
    return data;

}

export const getScore = async (user) => {
    const score = {
        token: user.token,
        game: "game4"
    }
    try {
        const response = await api.post('/getScore', score)
        if (response.status === 200) {
            return response.data.game.bestTime;
        }
    } catch (error) {
        console.error(error);
    }
    return 0;
}

export const saveScore = async (bestTime, game, token) => {
    try {
        await api.post('/score', {bestTime, game, token})
    } catch (error) {
        console.error(error);
    }
}


export default services