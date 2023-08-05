
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
const wordContainer = document.querySelector('.word-container');
const searchinput = document.getElementById('search-input');

function searchWord() {
    
    const word = searchinput.value.trim()
    if (word === '') {
        const errorMessage = 'Please enter something.'
        displayError(errorMessage)
        return;
    }

    searchinput.value = '';

    const apiData = fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)

    apiData
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const wordObj = {
                    word: data[0].word,
                    meaning: data[0].meanings[0].definitions[0].definition
                };
                // console.log(wordObj);

                wordContainer.textContent = '';
                displayWord(wordObj);
                searchHistory.push(wordObj)
                saveSearchHistory()
            }
            else {
                // const wordObj = {
                //     word : word,
                //     meaning: 'Word not found. Please try again with another word.'
                // }
                // wordContainer.textContent = '';
                // displayError(wordObj);
                wordContainer.textContent = '';
                const errorMessage = 'Word not found. Please try again with another word.';
                displayError(errorMessage);

            }
        })
        .catch(error => {
            console.error('Error:', error);
            const errorMessage = 'An error occurred. Please try again later.';
            displayError(errorMessage)
        });
}

function handleEnter(event) {
    if (event.keyCode == 13) {
        searchWord();
    }
}

function displayError(errorMessage) {
    wordContainer.textContent = '';
    const errorCard = document.createElement('p');
    errorCard.textContent = errorMessage
    errorCard.style.color = 'black';
    errorCard.style.fontSize = '20';
    wordContainer.appendChild(errorCard)
}



function displayWord(wordObj) {
    const wordCard = document.createElement('div');
    wordCard.className = 'wordCard';

    const wordHeading = document.createElement('h3');
    wordHeading.textContent = wordObj.word + ":";

    const wordPara = document.createElement('p');
    wordPara.textContent = wordObj.meaning;


    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.className = 'delete-btn';
    deleteButton.addEventListener('click', () => {
        wordCard.remove();
    })

    wordCard.appendChild(wordHeading);
    wordCard.appendChild(wordPara);
    wordCard.appendChild(deleteButton);
    wordContainer.appendChild(wordCard);


};


function saveSearchHistory() {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}


function showHistory() {
    if (searchHistory.length === 0) {
        const errorMessage = 'Nothing to show here. Please search something.'
        displayError(errorMessage);
        return;
    }

    wordContainer.textContent = '';
    const historyTable = document.createElement('table');
    historyTable.className = 'historyTable';
    let tableHTML = '';

    searchHistory.forEach((data) => {
        tableHTML += `
        <tr>
            <td><button onclick="searchFromHistory('${data.word}')" class="btn-history-search">${data.word}</button></td>
            <td>${data.meaning}</td>
            <td><button class="btn-danger" onclick="deleteFromHistory(this,'${data.word}')">X</button></td>
        </tr>
        `
    })


    const clearAllHistory = `
    <tr><td><button class="btn-danger" onclick="clearAllHistory()">Clear History</button></td></tr>
    `
    tableHTML += clearAllHistory;
    historyTable.innerHTML = tableHTML;
    wordContainer.appendChild(historyTable);

}
function deleteFromHistory(button, word) {
    const index = searchHistory.findIndex(data => data.word === word);
    if (index > -1) {
        searchHistory.splice(index, 1);
        saveSearchHistory();
        button.parentNode.parentNode.remove();
    }
    if (searchHistory.length === 0) {
        clearAllHistory();
    }
}
function clearAllHistory() {

    wordContainer.textContent = '';
    searchHistory = [];
    saveSearchHistory();
}

function searchFromHistory(word) {
    searchinput.value = word;
    searchWord()
    
}
