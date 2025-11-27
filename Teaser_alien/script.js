/************************************************
 * 외계+인 인터랙티브 티저 script.js (3문항 / 4엔딩)
 ************************************************/

/* 1. DOM 요소 가져오기 */
const startPage   = document.querySelector("#start-page");
const qnaPage     = document.querySelector("#qna-page");
const resultPage  = document.querySelector("#result-page");

const startBtn    = document.querySelector("#start-btn");
const nextBtn     = document.querySelector("#next-match-btn");
const restartBtn  = document.querySelector("#restart-btn");

const questionTitle = document.querySelector("#question-title");
const matchInfo = document.querySelector("#question-desc");

const choiceAButton = document.querySelector("#choice-a");
const choiceBButton = document.querySelector("#choice-b");

const progressFill  = document.querySelector("#progress");

const resultTitle = document.querySelector("#result-title");
const resultDesc  = document.querySelector("#result-desc");
const resultImg   = document.querySelector("#result-img");


/* 2. 4가지 결과 데이터 */
const RESULT_DATA = {
  goryeo_1: {
    title: "고려 시대 엔딩",
    desc: "당신은 외계인을 쫓다 ‘고려 시대’에 갇히는 엔딩을 맞이하였습니다. ‘가드’와 ‘썬더’는 어떤 결말일지, 같이 극장으로 가는 건 어떨까요?",
    image: "./images/Youtube.png"
  },
  goryeo_2: {
    title: "신검 탈취 엔딩",
    desc: "신검을 차지한 당신, 신검을 찾는 이들에게 쫓기는 신세가 되었습니다. 이게 뭐길래 다 날 쫓아오는거야!! 극장에서 확인해보는 건 어떨까요?",
    image: "./images/Youtube.png"
  },
  modern_1: {
    title: "현대 귀환 엔딩",
    desc: "당신은 시간의 문을 타고 현대로 돌아왔습니다. 그런데 내 눈앞에 펼쳐진 광경은, 저 이상한 돌은 뭐고 촉수는 뭐지... 극장에서 확인해보는 건 어떨까요?",
    image: "./images/Youtube.png"
  },
  modern_2: {
    title: "기억 상실 엔딩",
    desc: "병원에 갔다가 기억을 잃고 깨어나보니 외계인들이 쫓아오고 있습니다. 이게 무슨 일이지? 극장에서 확인해보는 건 어떨까요?",
    image: "./images/Youtube.png"
  }
};


/* 3. 3개 질문 데이터 */
const QUESTIONS = [
  {
    stage: "고려시대, 1390년",
    desc: 
      "외계인 죄수를 쫓아 인간의 몸에 가두는 ‘썬더’와 ‘가드’<br>" +
      "이번 죄수의 탈옥도 막았다. 근데 이 인간의 아이,<br>" +
      "그대로 뒀다간 죽을 것이 뻔하다<br>" +
      "인간의 일에는 관여하지 않는 것이 원칙이지만…",
    A: { 
      text: "데려간다", 
      img: "./images/Thunder.png",
      score: { goryeo: 1 } 
    },
    B: { 
      text: "복귀한다", 
       img: "./images/Guard.png",
      score: { alien: 1 } 
    }
  },

  {
    stage: "현대, 2022년",
    desc: 
      "휴 결국 아이를 데리고 와버렸군…<br>" +
      "그 후로 10년 8개월이 지났다<br>" +
      "내일은 오랜만에 죄수호송선이 지구에 도착하는 날.<br>" +
      "‘썬더’와 ‘가드’가 은밀하게 대화하는 것을 아이(이안)가 들어버렸다…<br>" +
      "내가 이안이라면",
    A: { 
      text: "보러간다", 
        img: "./images/Iango.png",
      score: { alien: 1 } 
    },
    B: { 
      text: "못 가겠다", 
         img: "./images/Ianstop.png",
      score: { goryeo: 1 } 
    }
  },

  {
    stage: "다시 고려시대, 1390년",
    desc: 
      "신검이란 물건이 아주 용해서 전국 팔도 도사들이 다 노린다는데…<br>" +
      "누가 되어서 신검을 차지하러 가볼까?",
    A: { 
      text: "이래보여도 도술 실력은<br>무척 뛰어나답니다<br>얼치기 도사 무륵", 
        img: "./images/Muruk.png",
      score: { goryeo: 1 } 
    },
    B: { 
      text: "출신이 베일에 가려진<br>백발 백중의 명사수!<br>천둥을 쏘는 처자, 이안", 
      img: "./images/Ian.png",
      score: { alien: 1 } 
    }
  }
];


/* 4. 진행 상태 */
let currentIndex   = 0;                  // 현재 질문 번호 (0,1,2)
let scores         = { goryeo: 0, alien: 0 };
let selectedChoice = null;               // 'A' 또는 'B'


/* 5. 유틸: 선택/버튼/진행바 초기화 */

function resetSelectionUI() {
  // 카드 선택 표시 제거
  choiceAButton.classList.remove("selected");
  choiceBButton.classList.remove("selected");
  // 선택 상태 초기화
  selectedChoice = null;
  // 다음 버튼 비활성화
  nextBtn.disabled = true;
  nextBtn.classList.add("disabled");
}

function updateProgressBar() {
  // 현재 질문 번호 기준: 1/3 → 33%, 2/3 → 66%, 3/3 → 100%
  const ratio = (currentIndex) / QUESTIONS.length;
  progressFill.style.width = (ratio * 100) + "%";
}


/* 6. 게임 시작 */

function startGame() {
  // 화면 전환
  startPage.classList.remove("active");
  resultPage.classList.remove("active");
  qnaPage.classList.add("active");

  // 상태 초기화
  currentIndex   = 0;
  scores         = { goryeo: 0, alien: 0 };
  selectedChoice = null;

  // 진행도, 선택 초기화
  progressFill.style.width = "0%";
  resetSelectionUI();

  loadQuestion();
}


/* 7. 질문 로드 */
function loadQuestion() {
  const q = QUESTIONS[currentIndex];

  if (!q) return showResult();

  questionTitle.textContent = q.stage;
  matchInfo.innerHTML = q.desc;

  const choiceATitle = choiceAButton.querySelector(".choice-title");
  const choiceBTitle = choiceBButton.querySelector(".choice-title");
  const choiceAImg   = choiceAButton.querySelector(".choice-img");
  const choiceBImg   = choiceBButton.querySelector(".choice-img");

  // 텍스트 적용
  choiceATitle.innerHTML = q.A.text;
  choiceBTitle.innerHTML = q.B.text;

  // 이미지 적용 (없는 문항은 자동 숨김)
  if (choiceAImg) {
    if (q.A.img) {
      choiceAImg.src = q.A.img;
      choiceAImg.style.display = "block";
    } else {
      choiceAImg.style.display = "none";
    }
  }

  if (choiceBImg) {
    if (q.B.img) {
      choiceBImg.src = q.B.img;
      choiceBImg.style.display = "block";
    } else {
      choiceBImg.style.display = "none";
    }
  }

  resetSelectionUI();

  progressFill.style.width = ((currentIndex + 1) / QUESTIONS.length) * 100 + "%";
}


/* 8. 선택 처리 */

function selectChoice(choice) {
  selectedChoice = choice;

  // UI 표시
  choiceAButton.classList.remove("selected");
  choiceBButton.classList.remove("selected");

  if (choice === "A") {
    choiceAButton.classList.add("selected");
  } else {
    choiceBButton.classList.add("selected");
  }

  // 다음 버튼 활성화
  nextBtn.disabled = false;
  nextBtn.classList.remove("disabled");
}


/* 9. 다음 버튼 클릭 시 로직 */

function nextQuestion() {
  if (!selectedChoice) {
    // 선택 안 했으면 아무 일도 안 함
    return;
  }

  // 현재 질문 점수 반영
  const q = QUESTIONS[currentIndex];
  const chosen = selectedChoice === "A" ? q.A : q.B;

  if (chosen.score.goryeo) scores.goryeo += chosen.score.goryeo;
  if (chosen.score.alien)  scores.alien  += chosen.score.alien;

  // 다음 질문 인덱스로 이동
  currentIndex += 1;

  // 마지막 질문 뒤면 결과 페이지로
  if (currentIndex >= QUESTIONS.length) {
    showResult();
  } else {
    loadQuestion();
  }
}


/* 10. 결과 계산 및 표시 */

function showResult() {
  // QnA 화면 숨기고 결과 화면 표시
  qnaPage.classList.remove("active");
  resultPage.classList.add("active");

  // 진행바 100%
  progressFill.style.width = "100%";

  const g = scores.goryeo;
  const a = scores.alien;

  let key = "";

  if (g > a) {
    key = Math.random() < 0.5 ? "goryeo_1" : "goryeo_2";
  } else if (a > g) {
    key = Math.random() < 0.5 ? "modern_1" : "modern_2";
  } else {
    key = "modern_1"; // 동점이면 현대 귀환으로 고정
  }

  const result = RESULT_DATA[key];
  resultTitle.textContent = result.title;
  resultDesc.textContent  = result.desc;
  resultImg.src           = result.image;
}


/* 11. 다시하기 */

function restartGame() {
  // 결과 페이지 숨기고 시작 화면으로
  resultPage.classList.remove("active");
  qnaPage.classList.remove("active");
  startPage.classList.add("active");

  // 모든 상태 초기화
  currentIndex   = 0;
  scores         = { goryeo: 0, alien: 0 };
  selectedChoice = null;
  progressFill.style.width = "0%";
  resetSelectionUI();
}


/* 12. 이벤트 연결 */

startBtn.addEventListener("click", startGame);
nextBtn.addEventListener("click", nextQuestion);

choiceAButton.addEventListener("click", () => selectChoice("A"));
choiceBButton.addEventListener("click", () => selectChoice("B"));

restartBtn.addEventListener("click", restartGame);


/* 13. 최초 진입 시 시작 화면만 보이도록 */

document.addEventListener("DOMContentLoaded", () => {
  startPage.classList.add("active");
  qnaPage.classList.remove("active");
  resultPage.classList.remove("active");
  progressFill.style.width = "0%";
  resetSelectionUI();
});
