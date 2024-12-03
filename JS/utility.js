const arrOfId = [];
let count = 0;

// All post API load
const dataLoad = async () => {
  try {
    // loading start 
    isLoading('allPostLoader', 'hidden', true);
    const res = await fetch(`https://openapi.programming-hero.com/api/retro-forum/posts`);
    const data = await res.json();
    const posts = data.posts;
    dataDisplay(posts);
  }
  catch (err) {
    console.error('Something Wrong', err);
  }
}

// All post display with dynamic card
const dataDisplay = posts => {
  const cardContainer = document.getElementById('card-container');
  // clear the container 
  cardContainer.textContent = '';
  // card display
  posts.forEach(post => {
    const div = document.createElement('div');
    div.classList = 'card bg-base-100 shadow-xl border-2';
    div.innerHTML = `
              <div class="flex flex-col sm:flex-row justify-between sm:space-x-4 p-4">
                <div class="avatar indicator w-full sm:w-16">
                  <span class="indicator-item badge ${post.isActive ? 'badge-success' : 'badge-error'}"></span>
                  <div class="h-64 sm:h-16 w-full bg-gray-200 sm:w-16 rounded-lg">
                    <img class="object-fill"
                      alt="Tailwind CSS examples"
                      src="${post.image}"
                    />
                  </div>
                </div>
                <div class="flex flex-col divide-y-2 w-full divide-dashed">
                  <div class="flex justify-between mb-2 mt-5 sm:mt-0">
                    <p class="text-sm font-bold">#${post.category}</p>
                    <p class="text-sm">
                      <span class="font-bold">Author: </span>${post.author.name}
                    </p>
                  </div>
                  <div class="mt-2 pt-2">
                    <h1 class="text-lg font-bold">
                      ${post.title}
                    </h1>
                    <p class="mt-3">
                      ${post.description}
                    </p>
                  </div>
                  <!-- icons  -->
                  <div class="flex flex-wrap w-full justify-between mt-4 pt-4 items-center">
                    <div class="flex flex-wrap space-x-5 sm:space-x-8 mb-2">
                      <div class="flex justify-start space-x-2">
                        <p><i class="fa-regular fa-message"></i></p>
                        <span>${post.comment_count}</span>
                      </div>
                      <div class="flex justify-start space-x-2">
                        <p><i class="fa-regular fa-eye"></i></p>
                        <span>${post.view_count}</span>
                      </div>
                      <div class="flex justify-start space-x-2">
                        <p><i class="fa-regular fa-clock"></i></p>
                        <span>${post.posted_time}</span>
                      </div>
                    </div>
                    <div class="mb-2">
                      <button id="${post.id}" class="btn btn-ghost text-green-500 text-[20px]">
                        <i class="fa-regular fa-envelope"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        `;
    cardContainer.appendChild(div);
    const button = document.getElementById(post.id);
    button.addEventListener('click', () => markAsRead(post));
  });
  // loading end 
  isLoading('allPostLoader', 'hidden', false);
}

// Mark as read (content add)
const markAsRead = (post) => {
  if (arrOfId.includes(post.id)) {
    alert('Already add to mark as read');
    return;
  }

  // If not already read, add it
  arrOfId.push(post.id);
  count++;
  document.getElementById('read-no').innerText = count;

  // content add 
  const contentContainer = document.getElementById('content-container');
  const div = document.createElement('div');
  div.classList = 'flex flex-col sm:flex-row mt-3 lg:flex-col w-full xl:flex-row space-y-2 xl:space-y-0 justify-between bg-white p-3 rounded-2xl items-center';
  div.innerHTML = `
        <div class="text-wrap text-center xl:text-start">
            <h2 class="sm:text-lg font-semibold">
            ${post.title}
            </h2>
        </div>
        <div class="flex space-x-1">
            <p><i class="fa-regular fa-eye"></i></p>
            <span>${post.view_count}</span>
        </div>
    `;
  contentContainer.appendChild(div);
}

// search category
const searchCategory = async () => {
  // loading start
  isLoading('allPostLoader', 'hidden', true);
  const cardContainer = document.getElementById('card-container');
  // clear the container 
  cardContainer.textContent = '';
  const searchText = document.getElementById('search-text');
  const category = searchText.value;
  const res = await fetch(`https://openapi.programming-hero.com/api/retro-forum/posts?category=${category}`);
  const data = await res.json();

  // invalid search check
  if (data.posts.length == 0) {
    setTimeout(() => {
      isLoading('allPostLoader', 'hidden', false);
      cardContainer.innerHTML = `
      <div class="card bg-base-100 shadow-2xl border-1">
        <p class="p-5 text-red-500 text-xl">No Data Found !!</p>
      </div>
    `;
    }, 2000);
    searchText.value = '';
  }
  else {
    // 2s loading
    setTimeout(() => {
      dataDisplay(data.posts);
    }, 2000);
    searchText.value = '';
  }
}

// Fetch the latest post
const latestPostFetch = async () => {
  // loading start 
  isLoading('latestPostLoader', 'hidden', true);
  const res = await fetch(`https://openapi.programming-hero.com/api/retro-forum/latest-posts`)
  const data = await res.json();
  latestPostShow(data);
}

// show the latest post
const latestPostShow = (latestPosts) => {
  const latestPostContainer = document.getElementById('latest-post-container');
  latestPosts.forEach(post => {
    const div = document.createElement('div');
    div.classList = 'card h-full flex flex-col justify-between bg-base-100 shadow-2xl';
    div.innerHTML = `
      <figure>
        <img class= ""
          src="${post.cover_image}"
          alt="cover_img"
        />
      </figure>
        <div class="p-4 flex flex-col flex-grow">
          <div class="flex justify-start space-x-3 text-gray-500 text-sm">
            <p><i class="fa-regular fa-calendar-days"></i></p>
            <span>${post.author?.posted_date ? post.author?.posted_date : 'No Publish Date'}</span>
          </div>

         <!-- title and description -->
          <div class="flex-grow">
            <h2 class="text-lg mt-3 font-bold">${post.title}</h2>
            <p class="text-sm text-gray-500 my-2">${post.description}</p>
          </div>

          <!-- author info -->
          <div class="flex justify-start items-center space-x-4 mt-4 pt-3 border-t">
            <img class="w-14 h-14 rounded-full" src="${post.profile_image}" alt="">
            <div>
              <p class="font-bold">${post.author.name}</p>
              <span class="text-sm text-gray-500">${post.author?.designation ? post.author.designation : 'Unknown'}</span>
            </div>
          </div>
        </div>
    `;
    latestPostContainer.appendChild(div);
  });
  // loading end 
  isLoading('latestPostLoader', 'hidden', false);
}

// loading function 
const isLoading = (idName, className, attr) => {
  const loader = document.getElementById(idName);
  if (attr) {
    loader.classList.remove(className);
  }
  else {
    loader?.classList.add(className);
  }
}


// new date
const getDate = () => {
  const dateContainer = document.getElementById('new-date');
  const date = new Date().getFullYear();
  dateContainer.innerText = date;
}

document.getElementById('allPostLoader').classList.remove('hidden');
document.getElementById('latestPostLoader').classList.remove('hidden');

setTimeout(() => {
  document.getElementById('whole-container').classList.remove('hidden');
}, 1250);


getDate();
setTimeout(() => {
  latestPostFetch();
  dataLoad();
}, 1000);
