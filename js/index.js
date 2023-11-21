document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
    let searchType = 'user';

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const searchTerm = document.getElementById('search').value.trim();

        const endpoint = searchType === 'user' ?
            `https://api.github.com/search/users?q=${searchTerm}` :
            `https://api.github.com/search/repositories?q=${searchTerm}`;

        try {
            const response = await fetch(endpoint, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const data = await response.json();

            if (searchType === 'user') {
                displayUsers(data.items);
            } else {
                displayRepos(data.items);
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    });

    function displayUsers(users) {
        userList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user.login;
            li.addEventListener('click', () => {
                showUserRepos(user.login);
            });
            userList.appendChild(li);
        });
    }

    async function showUserRepos(username) {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const repos = await response.json();
            displayRepos(repos);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    function displayRepos(repositories) {
        reposList.innerHTML = '';
        repositories.forEach(repo => {
            const li = document.createElement('li');
            li.textContent = repo.full_name;
            reposList.appendChild(li);
        });
    }

    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle Search Type';
    toggleButton.addEventListener('click', () => {
        searchType = searchType === 'user' ? 'repo' : 'user';
    });

    form.appendChild(toggleButton);
});
