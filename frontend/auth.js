/* =========================================================
   GAMEVAULT AUTHENTICATION
   LOGIN + REGISTER + JWT
   BETTER ERROR + LOADING MESSAGES
   PASSWORD VISIBILITY TOGGLE
   ========================================================= */

const API_URL =
    "http://localhost:5000/api/auth";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const loginContainer =
    document.getElementById(
        "loginContainer"
    );

const registerContainer =
    document.getElementById(
        "registerContainer"
    );

const loginForm =
    document.getElementById(
        "loginForm"
    );

const registerForm =
    document.getElementById(
        "registerForm"
    );

const showRegister =
    document.getElementById(
        "showRegister"
    );

const showLogin =
    document.getElementById(
        "showLogin"
    );

const loginMessage =
    document.getElementById(
        "loginMessage"
    );

const registerMessage =
    document.getElementById(
        "registerMessage"
    );


/* =========================================================
   PASSWORD TOGGLE BUTTONS
   ========================================================= */

const toggleLoginPassword =
    document.getElementById(
        "toggleLoginPassword"
    );

const toggleRegisterPassword =
    document.getElementById(
        "toggleRegisterPassword"
    );

const toggleConfirmPassword =
    document.getElementById(
        "toggleConfirmPassword"
    );


/* =========================================================
   SWITCH TO REGISTER
   ========================================================= */

showRegister.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        loginContainer.classList.remove(
            "active"
        );

        registerContainer.classList.add(
            "active"
        );

        clearMessages();

    }
);


/* =========================================================
   SWITCH TO LOGIN
   ========================================================= */

showLogin.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        registerContainer.classList.remove(
            "active"
        );

        loginContainer.classList.add(
            "active"
        );

        clearMessages();

    }
);


/* =========================================================
   PASSWORD VISIBILITY TOGGLE FUNCTION
   ========================================================= */

function togglePasswordVisibility(
    inputId,
    button
) {

    const passwordInput =
        document.getElementById(
            inputId
        );


    if (
        !passwordInput ||
        !button
    ) {
        return;
    }


    if (
        passwordInput.type ===
        "password"
    ) {

        passwordInput.type =
            "text";

        button.textContent =
            "🙈";

        button.setAttribute(
            "aria-label",
            "Hide password"
        );

        button.setAttribute(
            "title",
            "Hide password"
        );

    } else {

        passwordInput.type =
            "password";

        button.textContent =
            "👁";

        button.setAttribute(
            "aria-label",
            "Show password"
        );

        button.setAttribute(
            "title",
            "Show password"
        );

    }

}


/* =========================================================
   LOGIN PASSWORD TOGGLE
   ========================================================= */

if (toggleLoginPassword) {

    toggleLoginPassword.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            togglePasswordVisibility(
                "loginPassword",
                toggleLoginPassword
            );

        }
    );

}


/* =========================================================
   REGISTER PASSWORD TOGGLE
   ========================================================= */

if (toggleRegisterPassword) {

    toggleRegisterPassword.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            togglePasswordVisibility(
                "registerPassword",
                toggleRegisterPassword
            );

        }
    );

}


/* =========================================================
   CONFIRM PASSWORD TOGGLE
   ========================================================= */

if (toggleConfirmPassword) {

    toggleConfirmPassword.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            togglePasswordVisibility(
                "confirmPassword",
                toggleConfirmPassword
            );

        }
    );

}


/* =========================================================
   REGISTER
   ========================================================= */

registerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        clearMessages();


        const name =
            document
                .getElementById(
                    "registerName"
                )
                .value
                .trim();


        const email =
            document
                .getElementById(
                    "registerEmail"
                )
                .value
                .trim();


        const password =
            document
                .getElementById(
                    "registerPassword"
                )
                .value;


        const confirmPassword =
            document
                .getElementById(
                    "confirmPassword"
                )
                .value;


        /* -----------------------------------------
           Basic validation
           ----------------------------------------- */

        if (!name) {

            showMessage(
                registerMessage,
                "Please enter your name.",
                "error"
            );

            return;

        }


        if (!email) {

            showMessage(
                registerMessage,
                "Please enter your email.",
                "error"
            );

            return;

        }


        if (password.length < 6) {

            showMessage(
                registerMessage,
                "Password must be at least 6 characters.",
                "error"
            );

            return;

        }


        if (
            password !==
            confirmPassword
        ) {

            showMessage(
                registerMessage,
                "Passwords do not match.",
                "error"
            );

            return;

        }


        const submitButton =
            registerForm.querySelector(
                ".auth-button"
            );


        setButtonLoading(
            submitButton,
            "Creating Account..."
        );


        try {

            showMessage(
                registerMessage,
                "Creating your GameVault account...",
                "loading"
            );


            const response =
                await fetch(
                    `${API_URL}/register`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                name,
                                email,
                                password
                            })
                    }
                );


            const data =
                await getResponseData(
                    response
                );


            if (!response.ok) {

                throw new Error(
                    getFriendlyServerMessage(
                        data,
                        response.status,
                        "Registration failed"
                    )
                );

            }


            /*
               The register route currently does not
               automatically log the user in.
            */

            showMessage(
                registerMessage,
                "✓ Account created successfully! Redirecting to login...",
                "success"
            );


            registerForm.reset();


            setTimeout(
                function () {

                    registerContainer.classList.remove(
                        "active"
                    );

                    loginContainer.classList.add(
                        "active"
                    );


                    document.getElementById(
                        "loginEmail"
                    ).value =
                        email;


                    clearMessage(
                        registerMessage
                    );


                },
                1500
            );


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            showMessage(
                registerMessage,
                getFriendlyClientMessage(
                    error,
                    "Unable to create your account."
                ),
                "error"
            );


        } finally {

            setButtonNormal(
                submitButton,
                "Create Account"
            );

        }

    }
);


/* =========================================================
   LOGIN
   ========================================================= */

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        clearMessages();


        const email =
            document
                .getElementById(
                    "loginEmail"
                )
                .value
                .trim();


        const password =
            document
                .getElementById(
                    "loginPassword"
                )
                .value;


        /* -----------------------------------------
           Basic validation
           ----------------------------------------- */

        if (!email) {

            showMessage(
                loginMessage,
                "Please enter your email.",
                "error"
            );

            return;

        }


        if (!password) {

            showMessage(
                loginMessage,
                "Please enter your password.",
                "error"
            );

            return;

        }


        const submitButton =
            loginForm.querySelector(
                ".auth-button"
            );


        setButtonLoading(
            submitButton,
            "Logging In..."
        );


        try {

            showMessage(
                loginMessage,
                "Signing you into GameVault...",
                "loading"
            );


            const response =
                await fetch(
                    `${API_URL}/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                email,
                                password
                            })
                    }
                );


            const data =
                await getResponseData(
                    response
                );


            if (!response.ok) {

                throw new Error(
                    getFriendlyServerMessage(
                        data,
                        response.status,
                        "Login failed"
                    )
                );

            }


            /* -----------------------------------------
               Validate token
               ----------------------------------------- */

            if (!data.token) {

                throw new Error(
                    "Login succeeded, but the authentication token was not received."
                );

            }


            /* -----------------------------------------
               Save JWT token
               ----------------------------------------- */

            localStorage.setItem(
                "gamevaultToken",
                data.token
            );


            /* -----------------------------------------
               Save user information
               ----------------------------------------- */

            if (data.user) {

                localStorage.setItem(
                    "gamevaultUser",
                    JSON.stringify(
                        data.user
                    )
                );

            }


            showMessage(
                loginMessage,
                "✓ Login successful! Opening your dashboard...",
                "success"
            );


            loginForm.reset();


            setTimeout(
                function () {

                    window.location.replace(
                        "dashboard.html"
                    );

                },
                700
            );


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            showMessage(
                loginMessage,
                getFriendlyClientMessage(
                    error,
                    "Unable to login."
                ),
                "error"
            );


        } finally {

            setButtonNormal(
                submitButton,
                "Login"
            );

        }

    }
);


/* =========================================================
   GET RESPONSE DATA
   ========================================================= */

async function getResponseData(
    response
) {

    const contentType =
        response.headers.get(
            "content-type"
        ) || "";


    if (
        contentType.includes(
            "application/json"
        )
    ) {

        try {

            return await response.json();

        } catch (error) {

            return {};

        }

    }


    const text =
        await response.text();


    return {
        message:
            text || ""
    };

}


/* =========================================================
   SERVER ERROR MESSAGE
   ========================================================= */

function getFriendlyServerMessage(
    data,
    status,
    fallback
) {

    const serverMessage =
        data &&
        typeof data.message === "string"
            ? data.message.trim()
            : "";


    if (serverMessage) {

        return serverMessage;

    }


    if (status === 400) {

        return "Please check the information you entered.";

    }


    if (status === 401) {

        return "Invalid email or password.";

    }


    if (status === 404) {

        return "The authentication service could not be found.";

    }


    if (status >= 500) {

        return "GameVault server error. Please try again.";

    }


    return fallback;

}


/* =========================================================
   CLIENT ERROR MESSAGE
   ========================================================= */

function getFriendlyClientMessage(
    error,
    fallback
) {

    const message =
        error &&
        typeof error.message === "string"
            ? error.message.trim()
            : "";


    /*
       Browser fetch() commonly throws
       TypeError when the backend cannot be reached.
    */

    if (
        error instanceof TypeError ||
        message.toLowerCase().includes(
            "failed to fetch"
        ) ||
        message.toLowerCase().includes(
            "networkerror"
        ) ||
        message.toLowerCase().includes(
            "load failed"
        )
    ) {

        return "Unable to connect to GameVault server. Make sure the backend is running.";

    }


    if (message) {

        return message;

    }


    return fallback;

}


/* =========================================================
   BUTTON LOADING STATE
   ========================================================= */

function setButtonLoading(
    button,
    text
) {

    button.disabled = true;

    button.dataset.originalText =
        button.textContent;

    button.textContent =
        text;

}


/* =========================================================
   BUTTON NORMAL STATE
   ========================================================= */

function setButtonNormal(
    button,
    fallbackText
) {

    button.disabled = false;

    button.textContent =
        button.dataset.originalText ||
        fallbackText;

    delete button.dataset.originalText;

}


/* =========================================================
   SHOW MESSAGE
   ========================================================= */

function showMessage(
    element,
    message,
    type
) {

    element.textContent =
        message;

    element.className =
        `auth-message ${type}`;

}


/* =========================================================
   CLEAR ONE MESSAGE
   ========================================================= */

function clearMessage(
    element
) {

    element.textContent =
        "";

    element.className =
        "auth-message";

}


/* =========================================================
   CLEAR ALL MESSAGES
   ========================================================= */

function clearMessages() {

    clearMessage(
        loginMessage
    );

    clearMessage(
        registerMessage
    );

}


/* =========================================================
   CHECK EXISTING LOGIN
   ========================================================= */

function checkExistingLogin() {

    const savedUser =
        localStorage.getItem(
            "gamevaultUser"
        );


    const savedToken =
        localStorage.getItem(
            "gamevaultToken"
        );


    /*
       If only one part of the session exists,
       remove the incomplete session.
    */

    if (
        savedUser &&
        !savedToken
    ) {

        localStorage.removeItem(
            "gamevaultUser"
        );

        return;

    }


    if (
        savedToken &&
        !savedUser
    ) {

        localStorage.removeItem(
            "gamevaultToken"
        );

        return;

    }


    /*
       Validate stored user JSON.
    */

    if (savedUser) {

        try {

            const user =
                JSON.parse(
                    savedUser
                );


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

            }

        } catch (error) {

            localStorage.removeItem(
                "gamevaultUser"
            );

            localStorage.removeItem(
                "gamevaultToken"
            );

        }

    }

}


/* =========================================================
   START
   ========================================================= */

checkExistingLogin();