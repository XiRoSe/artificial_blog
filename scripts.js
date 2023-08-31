let isLoggedIn = false;
let posts = [
    { title: "The Rise of AI in Today's World", content: "The rapid developments in AI technology have greatly impacted various sectors. From healthcare to entertainment, the presence of AI is undeniable..." },
    { title: "Understanding Neural Networks", content: "Neural networks form the backbone of most modern AI systems. They're inspired by the human brain and have an uncanny ability to..." }
];

function displayPosts() {
    const postSection = document.getElementById("most-watched-posts");
    postSection.innerHTML = '<h2>Most Watched Posts</h2>'; // Reset and keep the title

    posts.forEach((post, index) => {
        postSection.innerHTML += `
            <article>
                <h3 class="ai-theme">${post.title}</h3>
                <p>${post.content}</p>
                ${isLoggedIn ? `<a href="#" onclick="removePost(${index})">Remove</a>` : ''}
            </article>
        `;
    });
}

function addPost() {
    if (!isLoggedIn) {
        return;
    }

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    if (title && content) {
        posts.push({ title, content });
        displayPosts();

        // Clear the input fields after adding
        document.getElementById("title").value = "";
        document.getElementById("content").value = "";

        // Update the "Edit Post" select options
        populateEditSelectOptions();
    }
}

function removePost(index) {
    if (!isLoggedIn) {
        return;
    }

    posts.splice(index, 1);
    displayPosts();
    populateEditSelectOptions();
}

function loadPostData(index) {
    const editTitle = document.getElementById("edit-title");
    const editContent = document.getElementById("edit-content");

    if (index !== "-1") {
        editTitle.value = posts[index].title;
        editContent.value = posts[index].content;
    } else {
        editTitle.value = "";
        editContent.value = "";
    }
}

function updatePost() {
    if (!isLoggedIn) {
        return;
    }

    const editIndex = document.getElementById("edit-index").value;
    const editTitle = document.getElementById("edit-title").value;
    const editContent = document.getElementById("edit-content").value;

    if (editIndex !== "-1" && editTitle && editContent) {
        posts[editIndex].title = editTitle;
        posts[editIndex].content = editContent;
        displayPosts();
        loadPostData("-1"); // Clear the edit fields
    }
}

function deletePost() {
    if (!isLoggedIn) {
        return;
    }

    const editIndex = document.getElementById("edit-index").value;

    if (editIndex !== "-1") {
        posts.splice(editIndex, 1);
        displayPosts();
        populateEditSelectOptions();
        clearEditFields();
    }
}

function clearEditFields() {
    document.getElementById("edit-index").value = "-1";
    document.getElementById("edit-title").value = "";
    document.getElementById("edit-content").value = "";
}

function populateEditSelectOptions() {
    const editSelect = document.getElementById("edit-index");
    editSelect.innerHTML = '<option value="-1">Select a post to edit</option>';

    posts.forEach((post, index) => {
        editSelect.innerHTML += `<option value="${index}">${post.title}</option>`;
    });
}

function toggleAdminView() {
    if (isLoggedIn) {
        if (document.getElementById('management').style.display === 'block') {
            switchTab('blog');
        } else {
            switchTab('management');
        }
    } else {
        showLoginForm();
    }
}

let toggleLoginForm = false;
function showLoginForm() {
    toggleLoginForm = !toggleLoginForm;
    if(toggleLoginForm){
        document.getElementById("login-form").style.display = "block";
        document.getElementById("blog").style.display = "none";
        document.getElementById("management").style.display = "none";
    } else {
        document.getElementById("login-form").style.display = "none";
        document.getElementById("blog").style.display = "block";
        document.getElementById("management").style.display = "none";
    }
}

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "admin") {
        isLoggedIn = true;
        showManagementView();
    } else {
        alert("Invalid credentials!");
    }
}

function showManagementView() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("blog").style.display = "none";
    document.getElementById("management").style.display = "block";
    document.getElementById("management-button").style.display = "block";
    populateEditSelectOptions(); // Populate the "Edit Post" options
}

function switchTab(tab) {
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    if (tab === 'blog') {
        document.querySelector('nav button:nth-child(1)').classList.add('active');
        document.getElementById('blog').style.display = 'block';
        document.getElementById('management').style.display = 'none';
    } else if (tab === 'management') {
        document.querySelector('nav button:nth-child(2)').classList.add('active');
        document.getElementById('blog').style.display = 'none';
        document.getElementById('management').style.display = 'block';
        populateEditSelectOptions(); // Populate the "Edit Post" options
    }
}

// Display posts initially
displayPosts();
