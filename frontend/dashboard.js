/* =========================================================
   GAMEVAULT DASHBOARD
   IMAGE UPLOAD + AUTO RESIZE + AUTO COMPRESSION
   AUTHENTICATION + USER-SPECIFIC GAMES + LOGOUT
   USER PROFILE
   EXPIRED SESSION PROTECTION
   DEPLOYMENT READY
   ========================================================= */


/* =========================================================
   AUTHENTICATION CHECK
   ========================================================= */

function checkAuthentication() {

    const savedUser =
        localStorage.getItem(
            "gamevaultUser"
        );

    const savedToken =
        localStorage.getItem(
            "gamevaultToken"
        );


    if (!savedUser || !savedToken) {

        localStorage.removeItem(
            "gamevaultUser"
        );

        localStorage.removeItem(
            "gamevaultToken"
        );

        window.location.href =
            "auth.html";

        return false;

    }


    try {

        const user =
            JSON.parse(savedUser);


        if (
            !user ||
            !user.id ||
            !user.email
        ) {

            localStorage.removeItem(
                "gamevaultUser"
            );

            localStorage.removeItem(
                "gamevaultToken"
            );

            window.location.href =
                "auth.html";

            return false;

        }


        return true;


    } catch (error) {

        console.error(
            "Invalid login data:",
            error
        );


        localStorage.removeItem(
            "gamevaultUser"
        );

        localStorage.removeItem(
            "gamevaultToken"
        );


        window.location.href =
            "auth.html";


        return false;

    }

}


/* =========================================================
   STOP DASHBOARD IF NOT AUTHENTICATED
   ========================================================= */

if (!checkAuthentication()) {

    throw new Error(
        "User is not authenticated."
    );

}


/* =========================================================
   API
   ========================================================= */

const API_URL =
    "https://gamevault-backend-uf77.onrender.com/api/games";


/* =========================================================
   GLOBAL VARIABLES
   ========================================================= */

let games = [];

let editingGameId = null;

let currentImageData = "";

const IMAGE_SIZE = 64;


/* =========================================================
   SESSION REDIRECT CONTROL
   ========================================================= */

let sessionRedirecting = false;


/* =========================================================
   GET AUTH HEADERS
   ========================================================= */

function getAuthHeaders() {

    const token =
        localStorage.getItem(
            "gamevaultToken"
        );


    return {

        "Content-Type":
            "application/json",

        "Authorization":
            `Bearer ${token}`

    };

}


/* =========================================================
   HANDLE AUTHENTICATION FAILURE
   ========================================================= */

function handleAuthenticationFailure() {

    if (sessionRedirecting) {

        return;

    }


    sessionRedirecting = true;


    console.warn(
        "GameVault session expired or is invalid. Redirecting to login."
    );


    localStorage.removeItem(
        "gamevaultUser"
    );

    localStorage.removeItem(
        "gamevaultToken"
    );


    window.location.replace(
        "auth.html"
    );

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {

    const confirmed =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmed) {

        return;

    }


    localStorage.removeItem(
        "gamevaultUser"
    );

    localStorage.removeItem(
        "gamevaultToken"
    );


    window.location.replace(
        "auth.html"
    );

}


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const gamesContainer =
    document.getElementById(
        "gamesContainer"
    );

const emptyState =
    document.getElementById(
        "emptyState"
    );

const totalGames =
    document.getElementById(
        "totalGames"
    );

const playingGames =
    document.getElementById(
        "playingGames"
    );

const completedGames =
    document.getElementById(
        "completedGames"
    );

const wishlistGames =
    document.getElementById(
        "wishlistGames"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const platformFilter =
    document.getElementById(
        "platformFilter"
    );

const gameModal =
    document.getElementById(
        "gameModal"
    );

const gameForm =
    document.getElementById(
        "gameForm"
    );

const openAddGame =
    document.getElementById(
        "openAddGame"
    );

const sidebarAddGame =
    document.getElementById(
        "sidebarAddGame"
    );

const emptyAddGame =
    document.getElementById(
        "emptyAddGame"
    );

const closeGameModalButton =
    document.getElementById(
        "closeGameModal"
    );

const cancelGameModalButton =
    document.getElementById(
        "cancelGameModal"
    );

const gameLibraryNav =
    document.getElementById(
        "gameLibraryNav"
    );

const dashboardNav =
    document.getElementById(
        "dashboardNav"
    );

const gameImage =
    document.getElementById(
        "gameImage"
    );

const previewImage =
    document.getElementById(
        "previewImage"
    );

const previewPlaceholder =
    document.getElementById(
        "previewPlaceholder"
    );

const imageStatus =
    document.getElementById(
        "imageStatus"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


/* =========================================================
   DISPLAY USER PROFILE
   ========================================================= */

function displayUserProfile() {

    const savedUser =
        localStorage.getItem(
            "gamevaultUser"
        );


    if (!savedUser) {

        return;

    }


    let user;


    try {

        user =
            JSON.parse(
                savedUser
            );

    } catch (error) {

        console.error(
            "Unable to read user profile:",
            error
        );

        return;

    }


    if (
        !user ||
        !user.email
    ) {

        return;

    }


    const sidebarBottom =
        document.querySelector(
            ".sidebar-bottom"
        );


    if (!sidebarBottom) {

        return;

    }


    /*
       Make the sidebar bottom section vertical
       so the profile sits above Logout.
    */

    sidebarBottom.style.display =
        "flex";

    sidebarBottom.style.flexDirection =
        "column";

    sidebarBottom.style.alignItems =
        "stretch";

    sidebarBottom.style.justifyContent =
        "flex-end";

    sidebarBottom.style.gap =
        "14px";


    /*
       Prevent duplicate profile cards
       if the function is called again.
    */

    const existingProfile =
        document.getElementById(
            "userProfileCard"
        );


    if (existingProfile) {

        existingProfile.remove();

    }


    /* -----------------------------------------
       Profile container
       ----------------------------------------- */

    const profileCard =
        document.createElement(
            "div"
        );


    profileCard.id =
        "userProfileCard";


    profileCard.style.width =
        "100%";

    profileCard.style.padding =
        "14px";

    profileCard.style.background =
        "rgba(124, 58, 237, 0.08)";

    profileCard.style.border =
        "1px solid rgba(124, 58, 237, 0.20)";

    profileCard.style.borderRadius =
        "12px";

    profileCard.style.display =
        "flex";

    profileCard.style.alignItems =
        "center";

    profileCard.style.gap =
        "11px";

    profileCard.style.overflow =
        "hidden";


    /* -----------------------------------------
       Avatar
       ----------------------------------------- */

    const avatar =
        document.createElement(
            "div"
        );


    avatar.style.width =
        "38px";

    avatar.style.height =
        "38px";

    avatar.style.minWidth =
        "38px";

    avatar.style.borderRadius =
        "50%";

    avatar.style.display =
        "flex";

    avatar.style.alignItems =
        "center";

    avatar.style.justifyContent =
        "center";

    avatar.style.background =
        "linear-gradient(135deg, #7c3aed, #5b21b6)";

    avatar.style.color =
        "#ffffff";

    avatar.style.fontSize =
        "15px";

    avatar.style.fontWeight =
        "700";


    const displayName =
        user.name ||
        "Gamer";


    avatar.textContent =
        displayName
            .charAt(0)
            .toUpperCase();


    /* -----------------------------------------
       User information
       ----------------------------------------- */

    const userInfo =
        document.createElement(
            "div"
        );


    userInfo.style.minWidth =
        "0";

    userInfo.style.flex =
        "1";


    const userName =
        document.createElement(
            "div"
        );


    userName.style.color =
        "#ffffff";

    userName.style.fontSize =
        "13px";

    userName.style.fontWeight =
        "700";

    userName.style.whiteSpace =
        "nowrap";

    userName.style.overflow =
        "hidden";

    userName.style.textOverflow =
        "ellipsis";


    userName.textContent =
        displayName;


    const userEmail =
        document.createElement(
            "div"
        );


    userEmail.style.marginTop =
        "3px";

    userEmail.style.color =
        "#858b9e";

    userEmail.style.fontSize =
        "11px";

    userEmail.style.whiteSpace =
        "nowrap";

    userEmail.style.overflow =
        "hidden";

    userEmail.style.textOverflow =
        "ellipsis";


    userEmail.textContent =
        user.email;


    userInfo.appendChild(
        userName
    );

    userInfo.appendChild(
        userEmail
    );


    profileCard.appendChild(
        avatar
    );

    profileCard.appendChild(
        userInfo
    );


    /*
       Put profile above logout.
    */

    sidebarBottom.insertBefore(
        profileCard,
        logoutButton
    );

}


/* =========================================================
   LOAD GAMES
   ========================================================= */

async function loadGames() {

    try {

        const response =
            await fetch(
                API_URL,
                {
                    method: "GET",

                    headers:
                        getAuthHeaders()
                }
            );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleAuthenticationFailure();

            return;

        }


        if (!response.ok) {

            throw new Error(
                "Failed to fetch games"
            );

        }


        games =
            await response.json();


        updateStats();

        displayGames();


    } catch (error) {

        if (sessionRedirecting) {

            return;

        }


        console.error(
            "Error loading games:",
            error
        );


        gamesContainer.innerHTML = `

            <div class="error-message">

                <h3>
                    Unable to load games
                </h3>

                <p>
                    Make sure your backend server is running.
                </p>

            </div>

        `;

    }

}


/* =========================================================
   UPDATE STATISTICS
   ========================================================= */

function updateStats() {

    totalGames.textContent =
        games.length;


    const playing =
        games.filter(
            game =>
                String(
                    game.status || ""
                )
                    .toLowerCase() ===
                "playing"
        ).length;


    const completed =
        games.filter(
            game =>
                String(
                    game.status || ""
                )
                    .toLowerCase() ===
                "completed"
        ).length;


    const wishlist =
        games.filter(
            game =>
                String(
                    game.status || ""
                )
                    .toLowerCase() ===
                "wishlist"
        ).length;


    playingGames.textContent =
        playing;


    completedGames.textContent =
        completed;


    wishlistGames.textContent =
        wishlist;

}


/* =========================================================
   DISPLAY GAMES
   ========================================================= */

function displayGames() {

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedPlatform =
        platformFilter.value
            .toLowerCase();


    const activeFilter =
        document
            .querySelector(
                ".filter-btn.active"
            )
            ?.dataset.status ||
        "all";


    const filteredGames =
        games.filter(
            game => {

                const name =
                    String(
                        game.name || ""
                    )
                        .toLowerCase();


                const genre =
                    String(
                        game.genre || ""
                    )
                        .toLowerCase();


                const platform =
                    String(
                        game.platform || ""
                    )
                        .toLowerCase();


                const status =
                    String(
                        game.status || ""
                    )
                        .toLowerCase();


                const matchesSearch =
                    name.includes(
                        searchTerm
                    ) ||
                    genre.includes(
                        searchTerm
                    ) ||
                    platform.includes(
                        searchTerm
                    );


                const matchesPlatform =
                    selectedPlatform ===
                        "all" ||
                    platform ===
                        selectedPlatform;


                const matchesStatus =
                    activeFilter ===
                        "all" ||
                    status ===
                        activeFilter;


                return (
                    matchesSearch &&
                    matchesPlatform &&
                    matchesStatus
                );

            }
        );


    gamesContainer.innerHTML =
        "";


    if (
        filteredGames.length === 0
    ) {

        emptyState.style.display =
            "block";

        return;

    }


    emptyState.style.display =
        "none";


    filteredGames.forEach(
        game => {

            const card =
                createGameCard(
                    game
                );

            gamesContainer.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   CREATE GAME CARD
   ========================================================= */

function createGameCard(game) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "game-card";


    const name =
        game.name ||
        "Unknown Game";


    const genre =
        game.genre ||
        "Unknown";


    const platform =
        game.platform ||
        "Unknown";


    const rating =
        game.rating !== undefined &&
        game.rating !== null
            ? game.rating
            : "N/A";


    const status =
        game.status ||
        "Wishlist";


    const hours =
        game.hours !== undefined &&
        game.hours !== null
            ? game.hours
            : 0;


    const statusClass =
        String(status)
            .toLowerCase()
            .replace(
                /\s+/g,
                "-"
            );


    /* =========================================
       IMAGE HTML
       ========================================= */

    let imageHTML = "";


    if (game.image) {

        imageHTML = `

            <img
                class="game-card-image"
                src="${game.image}"
                alt="${escapeHTML(name)}"
            >

        `;

    } else {

        imageHTML = `

            <span class="game-card-placeholder">
                🎮
            </span>

        `;

    }


    /* =========================================
       CARD HTML
       ========================================= */

    card.innerHTML = `

        <div class="game-top">

            <div class="game-cover">

                ${imageHTML}

            </div>


            <span
                class="game-status ${statusClass}"
            >
                ${escapeHTML(status)}
            </span>

        </div>


        <div class="game-info">

            <h3>
                ${escapeHTML(name)}
            </h3>


            <p class="game-genre">
                ${escapeHTML(genre)}
            </p>


            <div class="game-details">

                <span>

                    <small>
                        PLATFORM
                    </small>

                    <strong>
                        ${escapeHTML(platform)}
                    </strong>

                </span>


                <span>

                    <small>
                        RATING
                    </small>

                    <strong>
                        ⭐ ${escapeHTML(rating)}
                    </strong>

                </span>


                <span>

                    <small>
                        HOURS
                    </small>

                    <strong>
                        ${escapeHTML(hours)} hrs
                    </strong>

                </span>


                <span>

                    <small>
                        STATUS
                    </small>

                    <strong>
                        ${escapeHTML(status)}
                    </strong>

                </span>

            </div>


            <div class="game-actions">

                <button
                    type="button"
                    class="edit-btn"
                    onclick="editGame('${game._id}')"
                >
                    ✏️ Edit
                </button>


                <button
                    type="button"
                    class="delete-btn"
                    onclick="deleteGame('${game._id}')"
                >
                    🗑 Delete
                </button>

            </div>

        </div>

    `;


    return card;

}


/* =========================================================
   OPEN ADD GAME MODAL
   ========================================================= */

function openAddGameModal() {

    editingGameId =
        null;


    currentImageData =
        "";


    gameForm.reset();


    document.getElementById(
        "gameId"
    ).value =
        "";


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Add New Game";


    resetImagePreview();


    gameModal.classList.add(
        "active"
    );

}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeGameModal() {

    gameModal.classList.remove(
        "active"
    );


    editingGameId =
        null;


    currentImageData =
        "";


    gameForm.reset();


    document.getElementById(
        "gameId"
    ).value =
        "";


    resetImagePreview();

}


/* =========================================================
   RESET IMAGE PREVIEW
   ========================================================= */

function resetImagePreview() {

    previewImage.src =
        "";


    previewImage.style.display =
        "none";


    previewPlaceholder.style.display =
        "flex";


    imageStatus.textContent =
        "Recommended: clear game cover";


    imageStatus.className =
        "image-status";

}


/* =========================================================
   IMAGE FILE SELECTED
   ========================================================= */

gameImage.addEventListener(
    "change",
    async function () {

        const file =
            this.files?.[0];


        if (!file) {

            return;

        }


        try {

            imageStatus.textContent =
                "Compressing image...";


            imageStatus.className =
                "image-status processing";


            currentImageData =
                await processImage(
                    file
                );


            previewImage.src =
                currentImageData;


            previewImage.style.display =
                "block";


            previewPlaceholder.style.display =
                "none";


            imageStatus.textContent =
                "Image ready ✓";


            imageStatus.className =
                "image-status success";


        } catch (error) {

            console.error(
                "Image processing error:",
                error
            );


            currentImageData =
                "";


            imageStatus.textContent =
                "Could not process this image";


            imageStatus.className =
                "image-status error";


            this.value =
                "";

        }

    }
);


/* =========================================================
   PROCESS IMAGE
   ========================================================= */

function processImage(file) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const image =
                        new Image();


                    image.onload =
                        function () {

                            try {

                                const canvas =
                                    document.createElement(
                                        "canvas"
                                    );


                                canvas.width =
                                    IMAGE_SIZE;


                                canvas.height =
                                    IMAGE_SIZE;


                                const context =
                                    canvas.getContext(
                                        "2d"
                                    );


                                const size =
                                    Math.min(
                                        image.width,
                                        image.height
                                    );


                                const sourceX =
                                    (
                                        image.width -
                                        size
                                    ) / 2;


                                const sourceY =
                                    (
                                        image.height -
                                        size
                                    ) / 2;


                                context.drawImage(

                                    image,

                                    sourceX,
                                    sourceY,

                                    size,
                                    size,

                                    0,
                                    0,

                                    IMAGE_SIZE,
                                    IMAGE_SIZE

                                );


                                const compressedImage =
                                    canvas.toDataURL(
                                        "image/webp",
                                        0.82
                                    );


                                resolve(
                                    compressedImage
                                );


                            } catch (error) {

                                reject(error);

                            }

                        };


                    image.onerror =
                        function () {

                            reject(
                                new Error(
                                    "Invalid image"
                                )
                            );

                        };


                    image.src =
                        event.target.result;

                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "Unable to read image"
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =========================================================
   EDIT GAME
   ========================================================= */

function editGame(id) {

    const game =
        games.find(
            item =>
                item._id === id
        );


    if (!game) {

        return;

    }


    editingGameId =
        id;


    currentImageData =
        game.image || "";


    document.getElementById(
        "gameId"
    ).value =
        game._id || "";


    document.getElementById(
        "gameName"
    ).value =
        game.name || "";


    document.getElementById(
        "gameGenre"
    ).value =
        game.genre || "";


    document.getElementById(
        "gamePlatform"
    ).value =
        game.platform || "";


    document.getElementById(
        "gameRating"
    ).value =
        game.rating ?? "";


    document.getElementById(
        "gameHours"
    ).value =
        game.hours ?? 0;


    document.getElementById(
        "gameStatus"
    ).value =
        game.status ||
        "Wishlist";


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Game";


    if (game.image) {

        previewImage.src =
            game.image;


        previewImage.style.display =
            "block";


        previewPlaceholder.style.display =
            "none";


        imageStatus.textContent =
            "Current image";


        imageStatus.className =
            "image-status success";


    } else {

        resetImagePreview();

    }


    gameModal.classList.add(
        "active"
    );

}


/* =========================================================
   SAVE GAME
   ========================================================= */

gameForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const gameData = {

            name:
                document
                    .getElementById(
                        "gameName"
                    )
                    .value
                    .trim(),

            genre:
                document
                    .getElementById(
                        "gameGenre"
                    )
                    .value
                    .trim(),

            platform:
                document
                    .getElementById(
                        "gamePlatform"
                    )
                    .value,

            rating:
                Number(
                    document
                        .getElementById(
                            "gameRating"
                        )
                        .value
                ) || 0,

            status:
                document
                    .getElementById(
                        "gameStatus"
                    )
                    .value,

            hours:
                Number(
                    document
                        .getElementById(
                            "gameHours"
                        )
                        .value
                ) || 0

        };


        /* =========================================
           IMAGE
           ========================================= */

        if (currentImageData) {

            gameData.image =
                currentImageData;

        }


        try {

            let response;


            /* =====================================
               UPDATE
               ===================================== */

            if (editingGameId) {

                response =
                    await fetch(

                        `${API_URL}/${editingGameId}`,

                        {

                            method: "PUT",

                            headers:
                                getAuthHeaders(),

                            body:
                                JSON.stringify(
                                    gameData
                                )

                        }

                    );

            }


            /* =====================================
               ADD
               ===================================== */

            else {

                response =
                    await fetch(

                        API_URL,

                        {

                            method: "POST",

                            headers:
                                getAuthHeaders(),

                            body:
                                JSON.stringify(
                                    gameData
                                )

                        }

                    );

            }


            if (
                response.status === 401 ||
                response.status === 403
            ) {

                handleAuthenticationFailure();

                return;

            }


            if (!response.ok) {

                const errorText =
                    await response.text();


                console.error(
                    errorText
                );


                throw new Error(
                    "Failed to save game"
                );

            }


            closeGameModal();


            await loadGames();


        } catch (error) {

            if (sessionRedirecting) {

                return;

            }


            console.error(
                "Error saving game:",
                error
            );


            alert(
                "Unable to save game. Please try again."
            );

        }

    }
);


/* =========================================================
   DELETE GAME
   ========================================================= */

async function deleteGame(id) {

    const game =
        games.find(
            item =>
                item._id === id
        );


    if (!game) {

        return;

    }


    const confirmed =
        confirm(
            `Are you sure you want to delete "${game.name}"?`
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(

                `${API_URL}/${id}`,

                {

                    method: "DELETE",

                    headers:
                        getAuthHeaders()

                }

            );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleAuthenticationFailure();

            return;

        }


        if (!response.ok) {

            throw new Error(
                "Failed to delete game"
            );

        }


        await loadGames();


    } catch (error) {

        if (sessionRedirecting) {

            return;

        }


        console.error(
            "Error deleting game:",
            error
        );


        alert(
            "Unable to delete game. Please try again."
        );

    }

}


/* =========================================================
   SEARCH
   ========================================================= */

searchInput.addEventListener(
    "input",
    displayGames
);


/* =========================================================
   PLATFORM FILTER
   ========================================================= */

platformFilter.addEventListener(
    "change",
    displayGames
);


/* =========================================================
   STATUS FILTERS
   ========================================================= */

const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );


filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function () {

                filterButtons.forEach(
                    btn => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                this.classList.add(
                    "active"
                );


                displayGames();

            }
        );

    }
);


/* =========================================================
   ADD GAME BUTTONS
   ========================================================= */

openAddGame.addEventListener(
    "click",
    openAddGameModal
);


sidebarAddGame.addEventListener(
    "click",
    openAddGameModal
);


emptyAddGame.addEventListener(
    "click",
    openAddGameModal
);


/* =========================================================
   LOGOUT BUTTON
   ========================================================= */

logoutButton.addEventListener(
    "click",
    logout
);


/* =========================================================
   CLOSE MODAL
   ========================================================= */

closeGameModalButton.addEventListener(
    "click",
    closeGameModal
);


cancelGameModalButton.addEventListener(
    "click",
    closeGameModal
);


/* =========================================================
   CLICK OUTSIDE MODAL
   ========================================================= */

gameModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            gameModal
        ) {

            closeGameModal();

        }

    }
);


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            gameModal.classList.contains(
                "active"
            )
        ) {

            closeGameModal();

        }

    }
);


/* =========================================================
   NAVIGATION
   ========================================================= */

dashboardNav.addEventListener(
    "click",
    function (event) {

        event.preventDefault();


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }
);


gameLibraryNav.addEventListener(
    "click",
    function (event) {

        event.preventDefault();


        document
            .querySelector(
                ".library-header"
            )
            .scrollIntoView({

                behavior:
                    "smooth"

            });

    }
);


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   START
   ========================================================= */

displayUserProfile();

loadGames();