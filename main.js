function getItems(type) {
    const itemsContainer = document.getElementById('items');

    itemsContainer.innerHTML = '';

    let query = 'topstories';
    if (type === 'ask') {
        query = 'askstories';
    }

    fetch(`https://hacker-news.firebaseio.com/v0/${query}.json`)
        .then(response => response.json())
        .then(itemIds => {
            itemIds.forEach(id => {
                fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
                    .then(response => response.json())
                    .then(item => {
                        itemsContainer.appendChild(createItemElement(item));
                    })
                    .catch(error => console.log(error));
            });
        })
        .catch(error => console.log(error));
}

function createItemElement(item) {
    if (!item.kids) {
        item.kids = [];
    }

    const { title, url, score, kids, by, text } = item;
    const parent = document.createElement('div');
    parent.className = 'item';

    let titleElement = document.createElement('a');
    titleElement.href = url;
    titleElement.target = '_blank';
    if (!url) {
        titleElement = document.createElement('p');
    }
    titleElement.className = 'title';
    titleElement.textContent = title;

    const info = document.createElement('p');
    info.className = 'info';
    info.textContent = `${score} points - ${kids.length} comments - submitted by ${by}`;

    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.commentsIds = JSON.stringify(kids);
    button.textContent = 'View Comments';

    button.addEventListener('click', function () {
        showComments(this);
    });

    parent.appendChild(titleElement);
    if (text) {
        const textElement = document.createElement('p');
        textElement.innerHTML = text;
        textElement.className = 'ask-text';

        parent.appendChild(textElement);
    }
    parent.appendChild(info);
    parent.appendChild(button);

    return parent;
}

function showComments(button) {
    const item = button.parentElement;
    button.remove();

    const commentsIds = JSON.parse(button.dataset.commentsIds);

    commentsIds.forEach(id => {
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            .then(response => response.json())
            .then(comment => {
                const { by, text } = comment;

                const parent = document.createElement('div');
                parent.className = 'comment';

                const textElement = document.createElement('p');
                textElement.className = 'comment-text';
                textElement.innerHTML = text;

                const authorElement = document.createElement('p');
                authorElement.className = 'comment-by';
                authorElement.textContent = by;

                parent.appendChild(textElement);
                parent.appendChild(authorElement);

                item.appendChild(parent);
            })
            .catch(error => console.log(error));
    });
}

(function start() {
    getItems();

    const storiesBtn = document.getElementById('storiesBtn');
    storiesBtn.addEventListener('click', function () {
        getItems();
    });

    const askBtn = document.getElementById('askBtn');
    askBtn.addEventListener('click', function () {
        getItems('ask');
    });
})();
