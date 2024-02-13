const Profile = require('../model/Profile.model');

// Obtener todos los perfiles
const getAllProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find();
        res.status(200).json({ perfiles: profiles });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los perfiles', error });
    }
};

// Obtener un perfil por ID
const getProfileById = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: 'Perfil no encontrado' });
        }
        res.status(200).json({ perfil: profile });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el perfil', error });
    }
};

// Crear un nuevo perfil
const createProfile = async (req, res) => {
    const { name } = req.body;
    const newProfile = new Profile({
        name
    });

    try {
        const createdProfile = await newProfile.save();
        res.status(201).json({ profile: createdProfile });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el perfil', error });
    }
};

// Actualizar un perfil por ID
const updateProfileById = async (req, res) => {
    const { name, permisos } = req.body;
    console.log(permisos);
    try {
        const updatedProfile = await Profile.findByIdAndUpdate(
            req.params.id,
            { name, permisos },
            { new: true }
        );
        if (!updatedProfile) {
            return res.status(404).json({ message: 'Perfil no encontrado' });
        }
        res.status(200).json({ profile: updatedProfile });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el perfil', error });
    }
};

// Eliminar un perfil por ID
const deleteProfileById = async (req, res) => {
    try {
        const deletedProfile = await Profile.findByIdAndDelete(req.params.id);
        if (!deletedProfile) {
            return res.status(404).json({ message: 'Perfil no encontrado' });
        }
        res.status(200).json({ message: 'Perfil eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el perfil', error });
    }
};

module.exports = {
    getAllProfiles,
    getProfileById,
    createProfile,
    updateProfileById,
    deleteProfileById,
};
