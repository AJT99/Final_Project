function createElemWithText(elemString = "p", text = "", className) {
    let createdElem = document.createElement(elemString);
    createdElem.textContent = text;
    if (className) {
      createdElem.className = className;
    }
    return createdElem;
  }
  function createSelectOptions(users) {
    if (!users) {
      return undefined;
    }
  
    const options = [];
  
    for (const user of users) {
      const option = document.createElement("option");
      option.value = user.id;
      option.textContent = user.name;
      options.push(option);
    }
  
    return options;
  }
  function toggleCommentSection(postId) {
    if (!postId) {
      return undefined;
    }
  
    const section = document.querySelector(`section[data-post-id="${postId}"]`);
  
    if (!section) {
      return null;
    }
  
    section.classList.toggle('hide');
  
    return section;
  }
  function toggleCommentButton(postId) {
    if (!postId) {
      return undefined;
    }
    const button = document.querySelector(`button[data-post-id="${postId}"]`);
    if (!button) {
      return null;
    }
    button.textContent = button.textContent === 'Show Comments' ? 'Hide Comments' : 'Show Comments';
    return button;
  }
  function deleteChildElements(parentElement) {
    if (!(parentElement instanceof HTMLElement)) {
      return undefined;
    }
    let child = parentElement.lastElementChild;
    while (child) {
      parentElement.removeChild(child);
      child = parentElement.lastElementChild;
    }
    return parentElement;
  }
  function addButtonListeners() {
    const mainElement = document.querySelector("main");
    if (!mainElement) {
      console.error("Could not find main element");
      return [];
    }
  
    const buttons = mainElement.querySelectorAll("button");
    if (!buttons || buttons.length === 0) {
      console.error("No buttons found within main element");
      return [];
    }
  
    buttons.forEach(button => {
      const postId = button.dataset.postId;
      button.addEventListener("click", event => {
        toggleComments(event, postId);
      });
    });
  
    return buttons;
  }
  
  
  
  function removeButtonListeners() {
    const buttons = document.querySelectorAll('main button');
    
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const postId = button.dataset.postId;
      button.removeEventListener('click', () => toggleComments(event, postId));
    }
    
    return buttons;
  }
  function createComments(commentsData) {
    if (!Array.isArray(commentsData)) {
      console.error("Invalid comments data");
      return null;
    }
  
    const fragment = document.createDocumentFragment();
  
    commentsData.forEach(comment => {
      const article = document.createElement("article");
      const name = createElemWithText("h3", comment.name);
      const body = createElemWithText("p", comment.body);
      const email = createElemWithText("p", `From: ${comment.email}`);
  
      article.appendChild(name);
      article.appendChild(body);
      article.appendChild(email);
  
      fragment.appendChild(article);
    });
  
    return fragment;
  }
  function populateSelectMenu(users) {
    const selectMenu = document.querySelector("#selectMenu");
    
    if (!users || users.length === 0) {
      console.error("No users data provided");
      return;
    }
    
    const options = createSelectOptions(users);
    
    options.forEach(option => selectMenu.appendChild(option));
    
    return selectMenu;
  }
  async function getUsers() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
  
  
  
  async function getUserPosts(userId) {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
      const data = await response.json();
      if (data.length === 0) return undefined; // check if data is empty
      return data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  
  
  async function getUser(userId) {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      if (!response.ok) {
        return undefined;
      }
      const user = await response.json();
      return user;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  
  
  async function getPostComments(postId) {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
      const data = await response.json();
      return data.length > 0 ? data : undefined;
    } catch (error) {
      console.error(error);
    }
  }
  
  
  async function displayComments(postId) {
    if (!postId) {
      return undefined;
    }
  
    const section = document.createElement('section');
    section.setAttribute('class', 'comments hide');
    section.setAttribute('data-post-id', postId);
  
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
  
    section.appendChild(fragment);
    return section;
  }
  async function createPosts(postsData) {
    if (!Array.isArray(postsData)) {
      return undefined;
    }
  
    const fragment = document.createDocumentFragment();
  
    for (const post of postsData) {
      const article = document.createElement("article");
  
      const h2 = createElemWithText("h2", post.title);
      const body = createElemWithText("p", post.body);
      const postId = createElemWithText("p", `Post ID: ${post.id}`);
  
      const author = await getUser(post.userId);
      const authorName = createElemWithText(
        "p",
        `Author: ${author.name} with ${author.company.name}`
      );
      const catchPhrase = createElemWithText("p", author.company.catchPhrase);
  
      const button = createElemWithText("button", "Show Comments");
      button.dataset.postId = post.id;
  
      article.append(h2, body, postId, authorName, catchPhrase, button);
  
      const section = await displayComments(post.id);
      article.appendChild(section);
  
      fragment.appendChild(article);
    }
  
    return fragment;
  }
  
  async function displayPosts(posts) {
    const mainEl = document.querySelector("main");
    let element;
  
    if (posts && posts.length > 0) {
      element = await createPosts(posts);
    } else {
      element = createElemWithText("p", "Select an Employee to display their posts.");
    }
  
    mainEl.appendChild(element);
    return element;
  }

  
  function toggleComments(event, postId) {
    if (!event || !postId) {
      return undefined;
    }
    event.target.listener = true;
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
    return [section, button];
  }
  async function refreshPosts(posts) {
    if (!posts) {
      return undefined;
    }
    const removeButtons = removeButtonListeners();
    const main = deleteChildElements(document.querySelector("main"));
    const fragment = await displayPosts(posts);
    const addButtons = addButtonListeners(removeButtons);
    return [removeButtons, main, fragment, addButtons];
  }
  
  async function selectMenuChangeEventHandler(event) {
    if (!event) return undefined;
    const selectMenu = event.target;
    selectMenu.disabled = true;
    const userId = selectMenu.value || 1;
    const posts = await getUserPosts(userId);
    const refreshPostsArray = await refreshPosts(posts);
    selectMenu.disabled = false;
    return [userId, posts, refreshPostsArray];
  }
  
  
  
  async function initPage() {
    const users = await getUsers();
    const select = populateSelectMenu(users);
    return [users, select];
  }
  async function initApp() {
    const [users, select] = await initPage();
    const selectMenu = document.getElementById("selectMenu");
    selectMenu.addEventListener("change", (event) => {
      selectMenuChangeEventHandler(event, users);
    });
  }
  
