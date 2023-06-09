import { generateRandomText, contextMenuItems, generateRandomBackgroundColor } from "./utils.js";

const elementList = document.querySelector('#element-list');
const addElement = document.createElement('button');


function getItem() {
    const xhr = new XMLHttpRequest();
    const url = "http://localhost:3000/items";
    xhr.open("GET", url, true);
    xhr.onloadend = function () {
        if (this.responseText) {
            const item = JSON.parse(this.responseText);
            if (item.length) {
                localStorage.setItem('data', JSON.stringify(item));
            }
        }
    }
    xhr.send();
};

function sendRequest() {
    const xhr = new XMLHttpRequest();
    const url = "http://localhost:3000/items";


    const generetedElementText = generateRandomText(10);
    const generatedBackgroundColor = generateRandomBackgroundColor()

    const newItem = {
        elementText: generetedElementText,
        backgroundColor: generatedBackgroundColor
    };

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    const newItemJSON = JSON.stringify(newItem);
    xhr.send(newItemJSON);

    xhr.onload = function () {
        getItem();
    };
};

const receivedData = JSON.parse(localStorage.getItem('data'));

for (let i = 0; i < receivedData.length; i++) {
    const newItem = document.createElement('li');
    const threeDots = document.createElement('button');
    const itemNum = document.createElement('div');
    const topSide = document.createElement('div');
    const contextMenu = document.createElement('ul');
    const elementText = document.createElement('p');
    const formForEditing = document.createElement('form');
    const inputForRename = document.createElement('input');

    elementText.id = 'elementText';
    formForEditing.id = 'formForEditing'
    contextMenu.id = 'contextMenu'
    contextMenu.style.display = 'none'

    newItem.classList.add('item');
    formForEditing.appendChild(inputForRename)

    setTimeout(function () {
        newItem.classList.add('active');
    }, 10);

    function contextMenuClick(item) {
        const xhttp = new XMLHttpRequest();
        const elementId = receivedData[i].id

        if (item.title === 'Удалить' && i !== 0) {
            xhttp.open("DELETE", `http://localhost:3000/items/${elementId}`, true);
            xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhttp.send(elementId);
            xhttp.onload = function () {
                getItem();
            };
            contextMenu.style.display = 'none';
        } else if (item.title === 'Переименовать') {
            newItem.appendChild(formForEditing);
            elementText.remove();
            contextMenu.style.display = 'none';
            inputForRename.value = receivedData[i].elementText;
            inputForRename.focus();

            inputForRename.addEventListener('keydown', e => {
                if (e.key === 'Escape') {
                    formForEditing.remove();
                    newItem.appendChild(elementText);
                }
            })

            formForEditing.addEventListener('submit', (e) => {
                e.preventDefault();
                const inputValue = inputForRename.value;

                if (inputValue.trim() === "") {
                    alert("Please enter a valid item name.");
                    return;
                }
                const updatedItem = { ...receivedData[i], elementText: inputValue };
                const jsonData = JSON.stringify(updatedItem);
                xhttp.open("PUT", `http://localhost:3000/items/${elementId}`, true);
                xhttp.setRequestHeader("Content-type", "application/json");

                xhttp.onreadystatechange = function () {
                    if (xhttp.readyState === 4) {
                        if (xhttp.status === 200) {
                            console.log("Item updated successfully!");
                        } else {
                            console.log("Failed to update item. Status code: " + xhttp.status);
                        }
                    }
                };
                xhttp.send(jsonData);
                xhttp.onload = function () {
                    getItem();
                };
            })
        } else if (item.title === 'Сдвинуть вперед') {
            const xhr = new XMLHttpRequest();
            const elementId = receivedData[i].id;
            xhr.open("PUT", `http://localhost:3000/items/${elementId}`, true);
            xhr.setRequestHeader("Content-Type", "application/json");

            const updateCurrentElementWithNext = {
                ...receivedData[i], elementText: receivedData[i + 1].elementText,
                backgroundColor: receivedData[i + 1].backgroundColor
            }

            xhr.onreadystatechange = function () {
                if (xhr.status === 200) {
                    const nextElementID = receivedData[i + 1].id;
                    const updateNextElementWithCurrent = {
                        ...receivedData[i + 1], elementText: receivedData[i].elementText,
                        backgroundColor: receivedData[i].backgroundColor
                    };

                    const xhr2 = new XMLHttpRequest();
                    xhr2.open("PUT", `http://localhost:3000/items/${nextElementID}`, true);
                    xhr2.setRequestHeader("Content-type", "application/json");

                    xhr2.onreadystatechange = function () {
                        if (xhr2.readyState === 4) {
                            if (xhr2.status === 200) {
                                console.log("Second PUT request succeeded!");
                            } else {
                                console.log("Second PUT request failed. Status code: " + xhr2.status);
                            }
                        }
                    };
                    xhr2.onloadend = function () {
                        getItem();
                    };
                    xhr2.send(JSON.stringify(updateNextElementWithCurrent));
                }
            }
            xhr.onloadend = function () {
                getItem();
            };
            xhr.send(JSON.stringify(updateCurrentElementWithNext));
        } else if (item.title === 'Сдвинуть назад') {
            const xhr = new XMLHttpRequest();
            const elementId = receivedData[i].id;
            xhr.open("PUT", `http://localhost:3000/items/${elementId}`, true);
            xhr.setRequestHeader("Content-Type", "application/json");

            const updateCurrentElementWithPrev = {
                ...receivedData[i], elementText: receivedData[i - 1].elementText,
                backgroundColor: receivedData[i - 1].backgroundColor
            }
            xhr.onreadystatechange = function () {
                if (xhr.status === 200) {
                    const xhr2 = new XMLHttpRequest();
                    const nextElementID = receivedData[i - 1].id;
                    const updateNextElementWithCurrent = {
                        ...receivedData[i - 1], elementText: receivedData[i].elementText,
                        backgroundColor: receivedData[i].backgroundColor
                    }

                    xhr2.open("PUT", `http://localhost:3000/items/${nextElementID}`, true);
                    xhr2.setRequestHeader("Content-type", "application/json");

                    xhr2.onreadystatechange = function () {
                        if (xhr2.readyState === 4) {
                            if (xhr2.status === 200) {
                                console.log("Second PUT request succeeded!");
                            } else {
                                console.log("Second PUT request failed. Status code: " + xhr2.status);
                            }
                        }
                    };
                    xhr2.onloadend = function () {
                        getItem();
                    };
                    xhr2.send(JSON.stringify(updateNextElementWithCurrent));
                }
            }
            xhr.onloadend = function () {
                getItem();
            };
            xhr.send(JSON.stringify(updateCurrentElementWithPrev));
        }
        else {
            contextMenu.style.display = 'none';
            return
        }
    }

    for (const item of contextMenuItems) {
        const btn = document.createElement('button');
        btn.innerText = item.title;
        contextMenu.appendChild(btn);
        btn.onclick = () => contextMenuClick(item);
    }

    topSide.id = 'topSide';
    itemNum.id = 'itemNumber';
    threeDots.id = 'threeDots';
    itemNum.setHTML(i + 1);
    threeDots.innerText = '. . .';
    newItem.style.background = receivedData[i].backgroundColor;
    elementText.innerText = receivedData[i].elementText;

    threeDots.onclick = () => {
        if (contextMenu.style.display === 'none') {
            contextMenu.style.display = 'block';
        } else {
            contextMenu.style.display = 'none';
        }
    }

    topSide.appendChild(itemNum);
    topSide.appendChild(threeDots);
    newItem.appendChild(topSide);
    newItem.appendChild(elementText);
    newItem.appendChild(contextMenu);
    elementList.appendChild(newItem);
}

addElement.setHTML('<span>+</span>' + ' ' + 'Добавить<br> элемент');
addElement.id = 'addElementBtn';
elementList.appendChild(addElement);
addElement.onclick = () => sendRequest();
getItem();
