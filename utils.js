export function generateRandomText(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

export function generateRandomBackgroundColor() {
    const randomBackgroundColor = `linear-gradient(to left,rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255}), rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;

    return randomBackgroundColor
}

export const contextMenuItems = [
    { title: 'Переименовать' },
    { title: 'Сдвинуть вперед' },
    { title: 'Сдвинуть назад' },
    { title: 'Удалить' }
];
