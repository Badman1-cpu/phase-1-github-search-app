document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");

    searchForm.addEventListener("submit", event => {
        event.preventDefault();
        const searchTerm = searchInput.value.trim();

        if (searchTerm) {
            searchUsers(searchTerm);
        }
    });

    function searchUsers(searchTerm) {
        const url = `https://api.github.com/search/users?q=${searchTerm}`;
        fetch(url, {
            headers: {
                "Accept": "application/vnd.github.v3+json"
            }
        })
        .then(response => response.json())
        .then(data => {
            displayUsers(data.items);
        })
        .catch(error => console.error("Error searching users:", error));
    }

    function displayUsers(users) {
        searchResults.innerHTML = ""; // Clear previous search results

        users.forEach(user => {
            const userCard = createUserCard(user);
            searchResults.appendChild(userCard);
        });
    }

    function createUserCard(user) {
        const userCard = document.createElement("div");
        userCard.className = "user-card";

        const avatar = document.createElement("img");
        avatar.src = user.avatar_url;
        avatar.alt = `${user.login} avatar`;

        const username = document.createElement("h3");
        username.textContent = user.login;

        const profileLink = document.createElement("a");
        profileLink.href = user.html_url;
        profileLink.textContent = "View Profile";
        profileLink.target = "_blank";

        userCard.append(avatar, username, profileLink);
        userCard.addEventListener("click", () => {
            fetchUserRepos(user.login);
        });

        return userCard;
    }

    function fetchUserRepos(username) {
        const url = `https://api.github.com/users/${username}/repos`;
        fetch(url, {
            headers: {
                "Accept": "application/vnd.github.v3+json"
            }
        })
        .then(response => response.json())
        .then(data => {
            displayUserRepos(username, data);
        })
        .catch(error => console.error(`Error fetching ${username}'s repos:`, error));
    }

    function displayUserRepos(username, repos) {
        const repoList = repos.map(repo => {
            return `<li><a href="${repo.html_url}" target="_blank">${repo.name}</a></li>`;
        }).join("");

        const reposContainer = document.createElement("div");
        reposContainer.innerHTML = `<h3>${username}'s Repositories:</h3><ul>${repoList}</ul>`;

        searchResults.innerHTML = "";
        searchResults.appendChild(reposContainer);
    }
});