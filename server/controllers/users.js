import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);   
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE */
export const updateUserData = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUserData = req.body;

        // Проверка существования пользователя
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Обновление только данных самого пользователя
        existingUser.firstName = updatedUserData.firstName || existingUser.firstName;
        existingUser.lastName = updatedUserData.lastName || existingUser.lastName;
        existingUser.occupation = updatedUserData.occupation || existingUser.occupation;
        existingUser.location = updatedUserData.location || existingUser.location;
        existingUser.picturePath = updatedUserData.picturePath || existingUser.picturePath;

        // Сохранение обновленных данных пользователя
        const updatedUser = await existingUser.save();

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getRandomUsers = async (req, res) => {
    try {
        const { id, count } = req.params;
        const user = await User.findById(id);
        const allUsersExceptFriends = await User.find({
            _id: { $nin: [...user.friends, id] } // Исключаем друзей и текущего пользователя
        });

        // Получаем случайные пользователи
        const randomUsers = getRandomElements(allUsersExceptFriends, parseInt(count, 10));

        res.status(200).json(randomUsers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Вспомогательная функция для получения случайных элементов из массива
function getRandomElements(array, count) {
    const shuffledArray = array.sort(() => Math.random() - 0.5);
    return shuffledArray.slice(0, count);
}