const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users";
const dataPanel = document.querySelector("#data-panel");
const robotData = [];
let filteredRobotData = [];
const teamList = JSON.parse(localStorage.getItem("myTeamList")) || [];
const robotModal = document.querySelector("#robot-modal");
const robotModalImgHat = document.querySelector(".robot-modal-img-hat");

const CARDS_PER_PAGE = 5;
const paginator = document.querySelector("#paginaor");

function renderRobotCards(data) {
  let cardHTML = "";
  data.forEach((item) => {
    cardHTML += `<div class="card col-sm-4" >
  <div class="robot-card-img-wrapper">
 <img src="./images/img01.png" class="card-img-top robot-card-img-hat" alt="..."  data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#robot-modal">
 <img src="${item.avatar}" alt="" class="robot-card-img" >
 </div>
  <div class="card-body d-flex justify-content-between">
    <p class="card-text" id="robot-card-name">${item.name}</p>
<button type="button" id="robot-card-btn" class="btn " data-bs-toggle="modal" data-bs-target="#robot-modal" data-id="${item.id}"><i class="fa-regular fa-address-card robot-card-btn" ></i></button>
  </div>
</div>`;
  });

  dataPanel.innerHTML = cardHTML;
}

const robotModalRemovebtn = document.querySelector("#robot-modal-removeBtn");

robotModalRemovebtn.addEventListener("click", (event) => {
  robotModalImgHat.classList.remove("active");
  const robotID = Number(event.target.dataset.id);
  removePartner(robotID);
});

function showRobotModal(id) {
  const robotModalImage = document.querySelector("#robot-modal-img");
  const robotModalName = document.querySelector("#robot-modal-name");
  const robotModalGender = document.querySelector("#robot-modal-gender");
  const robotModalAge = document.querySelector("#robot-modal-age");
  const robotModalBirthday = document.querySelector("#robot-modal-birthday");
  const robotModalEmail = document.querySelector("#robot-modal-email");
  const robotModalRegion = document.querySelector("#robot-modal-region");

  axios.get(INDEX_URL).then((response) => {
    const data = response.data.results[id - 1];
    robotModalImage.src = data.avatar;
    robotModalName.innerText = `${data.name} ${data.surname}`;
    const robotModalAge = data.age;
    const female = `<i class="fa-solid fa-venus"></i> ｜ `;
    const male = `<i class="fa-solid fa-mars"></i> ｜ `;
    if (data.gender === female) {
      robotModalGender.innerHTML = female + robotModalAge;
    } else {
      robotModalGender.innerHTML = male + robotModalAge;
    }

    robotModalBirthday.innerHTML = `<i class="fa-solid fa-calendar-week"></i>　${data.birthday}`;
    robotModalEmail.innerHTML = `<i class="fa-solid fa-envelope"></i>　${data.email}`;
    robotModalRegion.innerHTML = `<i class="fa-solid fa-globe"></i>　${data.region}`;
    robotModalRemovebtn.setAttribute("data-id", `${id}`);
  });
}

function removePartner(id) {
  if (!teamList || !teamList.length) return;
  const removeItemIndex = teamList.findIndex((partner) => partner.id === id);
  console.log(removeItemIndex);

  if (removeItemIndex === -1) return;
  teamList.splice(removeItemIndex, 1);
  localStorage.setItem("myTeamList", JSON.stringify(teamList));
  renderRobotCards(teamList);
}

dataPanel.addEventListener(
  "click",
  (event) => {
    if (event.target.matches("#robot-card-btn")) {
      // console.log(event.target.dataset.id);
      const robotID = event.target.dataset.id;
      showRobotModal(Number(robotID));
      robotModalImgHat.classList.add("active");
    }
    if (event.target.matches(".robot-card-img-hat")) {
      const robotID = event.target.dataset.id;
      showRobotModal(Number(robotID));
      robotModalImgHat.classList.add("active");
    }
    // if (event.target.matches("#robot-modal-removeBtn")) {
    //   const robotID = event.target.dataset.id;
    //   console.log(robotID);
    //   removePartner(Number(robotID));
    // }
  },
  true
);

axios.get(INDEX_URL).then((response) => {
  robotData.push(...response.data.results);

  renderRobotCards(getCardsByPage(1));
  renderPaginator(teamList.length);
});

function renderPaginator(amount) {
  // 每頁20個
  // 分頁器共有幾頁 渲染分頁器頁數

  const numberOfPages = Math.ceil(amount / CARDS_PER_PAGE);

  let rawHTML = "";
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}

// 頁面渲染篩選頁數的內容
function getCardsByPage(page) {
  // p1 0-19
  // p2 20-39
  // p3 40-49
  const startIndex = (page - 1) * CARDS_PER_PAGE;
  return teamList.slice(startIndex, startIndex + CARDS_PER_PAGE);
}

//  點擊分頁器時 頁面渲染篩選頁數的內容
paginator.addEventListener("click", (event) => {
  if (event.target.tagName !== "A") return;

  const page = Number(event.target.dataset.page);
  console.log(page);
  renderRobotCards(getCardsByPage(page));
});
