const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users";
const dataPanel = document.querySelector("#data-panel");
const robotData = [];
let filteredRobotData = [];
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchSubmit = document.querySelector("#search-submit");
const robotModalAddbtn = document.querySelector("#robot-modal-addBtn");
const robotModalImgHat = document.querySelector(".robot-modal-img-hat");
const CARDS_PER_PAGE = 20;
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

robotModalAddbtn.addEventListener("click", (event) => {
  robotModalImgHat.classList.add("active");

  // 按下addbtn後

  // 建立清單 或 把local的清單轉為js物件拿出來
  const teamList = JSON.parse(localStorage.getItem("myTeamList")) || [];
  // 找到btn id 若robotdata有符合的 就find出來
  const targetId = Number(event.target.dataset.id);
  const data = robotData.find((data) => data.id === targetId);

  // 防錯 在teamlist有重複添加的 跳出
  if (teamList.some((item) => Number(item.id) === targetId)) {
    return alert("already added");
  }

  // 與addbtn id 相符的資料 被存入清單中
  teamList.push(data);
  // 清單轉為字串存入local中
  localStorage.setItem("myTeamList", JSON.stringify(teamList));
});

function showRobotModal(id) {
  const robotModalImage = document.querySelector("#robot-modal-img");
  const robotModalName = document.querySelector("#robot-modal-name");
  const robotModalGender = document.querySelector("#robot-modal-gender");
  const robotModalAge = document.querySelector("#robot-modal-age");
  const robotModalBirthday = document.querySelector("#robot-modal-birthday");
  const robotModalEmail = document.querySelector("#robot-modal-email");
  const robotModalRegion = document.querySelector("#robot-modal-region");
  // const robotModalAddbtn = document.querySelector("#robot-modal-addBtn");
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
    robotModalAddbtn.setAttribute("data-id", `${id}`);
  });
}

dataPanel.addEventListener(
  "click",
  (event) => {
    if (event.target.matches("#robot-card-btn")) {
      // console.log(event.target.dataset.id);
      const robotID = event.target.dataset.id;

      showRobotModal(Number(robotID));
      robotModalImgHat.classList.remove("active");
    }
    if (event.target.matches(".robot-card-img-hat")) {
      const robotID = event.target.dataset.id;
      showRobotModal(Number(robotID));
      robotModalImgHat.classList.remove("active");
    }
  },
  true
);

axios.get(INDEX_URL).then((response) => {
  robotData.push(...response.data.results);

  renderRobotCards(getCardsByPage(1));
  renderPaginator(robotData.length);
});

// form區放置監聽器
searchForm.addEventListener("click", function onSearchFormClicked(event) {
  // 當按下submit btn時
  if (event.target.matches("#search-submit")) {
    event.preventDefault();
    const keyword = searchInput.value.trim().toLowerCase();
    // 檢查搜尋欄位是否有填入
    // 搜尋欄中的值小寫 用filter找出 robotData中名字有include的
    if (!keyword.length) {
      return alert("cannot find");
    }
    // 找到後存放在filterData的新陣列中
    filteredRobotData = robotData.filter((data) =>
      data.name.toLowerCase().includes(keyword)
    );
    if (filteredRobotData.length === 0) {
      return alert(`connot find name with keyword ${keyword} `);
    }
    // 畫面渲染新陣列的data

    renderRobotCards(getCardsByPage(1));
    renderPaginator(filteredRobotData.length);
  }
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
  const data = filteredRobotData.length ? filteredRobotData : robotData;
  const startIndex = (page - 1) * CARDS_PER_PAGE;
  return data.slice(startIndex, startIndex + CARDS_PER_PAGE);
}

//  點擊分頁器時 頁面渲染篩選頁數的內容
paginator.addEventListener("click", (event) => {
  if (event.target.tagName !== "A") return;

  const page = Number(event.target.dataset.page);

  renderRobotCards(getCardsByPage(page));
});
