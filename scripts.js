let isLoggedIn = false;
let formerHTML = document.querySelector("main").innerHTML;
// Your OpenAI API key
const apiKey = "ENTER-YOUR-OPENAI-KEY-HERE";
// Placeholder content for the AI-completed part
let aiCompletedContent = "";

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

        // Clear the input fields after adding
        document.getElementById("title").value = "";
        document.getElementById("content").value = "";

				// Refreshing blog tab
        displayShortenedPosts();
        
        // Update the "Edit Post" select options
        populateEditSelectOptions();
    }
}

function removePost(index) {
    if (!isLoggedIn) {
        return;
    }

    posts.splice(index, 1);
    displayShortenedPosts();
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
        displayShortenedPosts();
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
        displayShortenedPosts();
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
    const elementsToHide = ["login-form", "blog"];
    const elementsToShow = ["management", "management-button"];
    const activeButtonIndex = 1; // Index of the active button (0-based)

    elementsToHide.forEach(elementId => {
        document.getElementById(elementId).style.display = "none";
    });

    elementsToShow.forEach(elementId => {
        document.getElementById(elementId).style.display = "block";
    });

    document.querySelectorAll('nav button').forEach((btn, index) => {
        btn.classList.toggle('active', index === activeButtonIndex);
    });

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

// Display shortened posts initially
function displayShortenedPosts() {
    const postSection = document.getElementById("most-watched-posts");
    postSection.innerHTML = '<h2>Most Watched Posts</h2>'; // Reset and keep the title

    posts.forEach((post, index) => {
        // Split the content into lines
        const contentLines = post.content.split(' ');
        // Take the first 20 lines of content
        const shortenedContent = contentLines.slice(0, 20).join(' ');
        
        const hasMoreContent = contentLines.length > 20;
        
        postSection.innerHTML += `
            <article>
                <h3 class="ai-theme">${post.title}</h3>
                <p>${shortenedContent}</p>
                ${hasMoreContent ? `<p onclick="expandPost(${index})" style="color: blue; cursor: pointer">Read more...</p>` : ''}
                ${isLoggedIn ? `<a href="#" onclick="removePost(${index})">Remove</a>` : ''}
            </article>
        `;
    });
}

// Expand post content to show full text
function expandPost(index) {
    const postSection = document.getElementById("most-watched-posts");
    const contentLines = posts[index].content.split(' ');
    const fullContent = contentLines.join(' ');

    // Create a new article element with the expanded content
    const expandedArticle = document.createElement('article');
    expandedArticle.innerHTML = `
        <h3 class="ai-theme">${posts[index].title}</h3>
        <p>${fullContent}</p>
        ${isLoggedIn ? `<a href="#" onclick="removePost(${index})">Remove</a>` : ''}
    `;

    // Find the index of the clicked article within the postSection
    const articleIndex = Array.from(postSection.children).indexOf(event.currentTarget.parentNode);

    // Replace the content of the clicked article with the expanded content
    postSection.replaceChild(expandedArticle, postSection.children[articleIndex]);
}

async function useAI() {
   document.getElementById("loading").style.display = "block";
    const partialContent = document.getElementById("title").value;

    try {
        // Make a request to the OpenAI API to generate AI content
        const contentPrompt = "please write me a post for the title: " + partialContent;
        const response = await generateAIContent(contentPrompt);
				/* console.log(response) */
        // Extract the AI-generated content from the response
        aiCompletedContent = response.choices[0].message.content

        // Display the AI-completed content in the textarea
        document.getElementById("content").value = aiCompletedContent;
    } catch (error) {
        console.error("Error generating AI content:", error);
    } finally {
        document.getElementById("loading").style.display = "none";
    }
}

async function generateBlogSection() {
    try {
        document.getElementById("loading").style.display = "block";

        const prompt = "Design a noval and unique new HTML section that fits within a modern blog format, return only code.";

        const result = await generateAIContent(prompt);
        const aiMessage = result.choices[0].message.content
        console.log(aiMessage);
        if (aiMessage) {
            // Insert the AI's suggestion as a new section to the main content.
            const mainContent = document.querySelector("main");
            mainContent.insertAdjacentHTML("beforeend", aiMessage);
        } else {
            alert("Failed to generate content from AI. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
    } finally {
        document.getElementById("loading").style.display = "none";
    }
}

async function upgradeBlogUsingAI() {
    try {
      const mainContent = document.querySelector("main");
    		formerHTML = mainContent.innerHTML;
    
    		currentCode = document.querySelector("main").innerHTML;
        document.getElementById("loading").style.display = "block";
				console.log(currentCode)
        let prompt = `Given the current blog code: "${currentCode}", please return an upgraded version of it that enhances its visual appeal, functionality, and user experience, the changes should be small but meaningful, make it look unique, you can add new simple sections, be careful not to break any existing functionality, return only the code itself fully in one page without any explanations.`;
        let result = await generateAIContent(prompt);
        let aiMessage = result.choices[0].message.content;

        if (aiMessage) {
            mainContent.innerHTML = aiMessage
        } else {
            alert("Failed to generate upgraded content from AI. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
    } finally {
        document.getElementById("loading").style.display = "none";
    }
}

function returnToFormerHTML() {
  const mainContent = document.querySelector("main");
  mainContent.innerHTML = formerHTML
}

// Send a request to the OpenAI API to generate content
async function generateAIContent(partialContent) {
    const endpoint = "https://api.openai.com/v1/chat/completions";
    
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-4-0613",
	    messages: [{"role": "user", "content": partialContent}],
        })
    });

    return response.json();
}

// Display shortened posts initially
displayShortenedPosts();
