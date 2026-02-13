let user = {
  name: "",
  age: 0,
  goal: "",
  interests: [],
  answers: []
};

// --- Navigation ---
function showSection(sectionId) {
  const sections = ["landing", "info", "questions", "results"];

  sections.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = "none";
    }
  });

  const active = document.getElementById(sectionId);
  if (active) {
    active.style.display = "block";
    window.scrollTo(0, 0); // Scroll to top
  }
}

// --- Step 1: Basic Info ---
function saveBasicInfo() {
  const nameInput = document.getElementById("name").value.trim();
  const ageInput = document.getElementById("age").value;
  const goalInput = document.getElementById("goal").value;

  // Validation
  if (!nameInput || !ageInput || !goalInput) {
    alert("Please fill in all fields!");
    return;
  }

  if (ageInput < 18) {
    alert("You must be 18+ to use this app.");
    return;
  }

  // Get Interests
  let checkedInterests = document.querySelectorAll('input[name="interest"]:checked');
  if (checkedInterests.length === 0) {
    alert("Please select at least one interest!");
    return;
  }

  user.name = nameInput;
  user.age = parseInt(ageInput);
  user.goal = goalInput;
  user.interests = Array.from(checkedInterests).map(checkbox => checkbox.value);

  showSection("questions");
}

// --- Step 2: Questionnaire ---
function saveAnswers() {
  user.answers = [];
  let allAnswered = true;

  for (let i = 1; i <= 10; i++) {
    let selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (!selected) {
      allAnswered = false;
      break;
    }
    user.answers.push(parseInt(selected.value));
  }

  if (!allAnswered) {
    alert("Please answer all 10 questions to get your result!");
    return;
  }

  calculateResults();
}

// --- Step 3: Calculations & Results ---
function calculateResults() {
  // 1. Compatibility Score
  let totalScore = user.answers.reduce((a, b) => a + b, 0);
  let compatibility = Math.round((totalScore / 50) * 100);

  // 2. Personality Type
  let personality = getPersonality();

  // 3. Flags
  let flags = getFlags();

  // 4. Date Ideas
  let dateIdeas = getDateIdeas();

  // --- Update DOM ---
  document.getElementById("score-display").innerText = compatibility + "%";
  document.getElementById("personality-display").innerText = personality.type;

  // Flags
  const flagsList = document.getElementById("flags-display");
  flagsList.innerHTML = "";

  flags.green.forEach(flag => {
    let li = document.createElement("li");
    li.innerText = "✅ " + flag;
    li.style.color = "green";
    flagsList.appendChild(li);
  });

  flags.red.forEach(flag => {
    let li = document.createElement("li");
    li.innerText = "🚩 " + flag;
    li.style.color = "red";
    flagsList.appendChild(li);
  });

  if (flags.green.length === 0 && flags.red.length === 0) {
    let li = document.createElement("li");
    li.innerText = "You are a mystery wrapped in an enigma.";
    flagsList.appendChild(li);
  }

  // Date Ideas
  const datesList = document.getElementById("dates-display");
  datesList.innerHTML = "";
  dateIdeas.forEach(idea => {
    let li = document.createElement("li");
    li.innerText = "💖 " + idea;
    datesList.appendChild(li);
  });

  showSection("results");
}

// --- Logic Helpers ---

function getPersonality() {
  // Simple logic based on dominant traits
  // Q1=Comm, Q2=Priority, Q3=Indep, Q4=Jealousy, Q6=Commit, Q7=PDA, Q8=Trust, Q9=Planner, Q10=Openness

  let scoreComm = user.answers[0]; // Q1
  let scoreIndep = user.answers[2]; // Q3
  let scoreRomantic = user.answers[6]; // Q7 (PDA) - assuming high PDA is romantic
  let scorePlanner = user.answers[8]; // Q9

  if (scoreComm >= 4 && user.answers[9] >= 4) return { type: "The Communicator", desc: "You value deep connection and openness." };
  if (scoreIndep >= 4 && user.answers[5] >= 4) return { type: "The Independent Trailblazer", desc: "You love your freedom and respect others'." };
  if (scoreRomantic >= 4 && user.answers[1] >= 4) return { type: "The Hopeless Romantic", desc: "Love is your top priority." };
  if (scorePlanner >= 4) return { type: "The Planner", desc: "You have a vision and stick to it." };

  return { type: "The Balanced Partner", desc: "You go with the flow but know what you want." };
}

function getFlags() {
  let green = [];
  let red = [];

  // Green Flags
  if (user.answers[0] === 5) green.push("Excellent Communicator");
  if (user.answers[7] === 5) green.push("Trusts Completely"); // Q8
  if (user.answers[9] === 5) green.push("Open to New Things"); // Q10
  if (user.answers[4] === 5) green.push("Financially Responsible"); // Q5

  // Red Flags
  if (user.answers[3] >= 4) red.push("High Jealousy Tendency"); // Q4
  if (user.answers[0] <= 2) red.push("Struggles with Communication"); // Q1
  if (user.answers[7] <= 2) red.push("Trust Issues"); // Q8
  if (user.answers[5] <= 2) red.push("Commitment Phobic?"); // Q6 (Commitment) -> wait Q6 is commit question index 5

  return { green, red };
}

function getDateIdeas() {
  let ideas = [];
  const interests = user.interests;

  if (interests.includes("music")) ideas.push("Live Concert or Karaoke Night");
  if (interests.includes("movies")) ideas.push("Drive-in Movie or Film Marathon");
  if (interests.includes("sports")) ideas.push("Go to a Game or Mini Golf");
  if (interests.includes("travel")) ideas.push("Weekend Road Trip or Exploring a New City");
  if (interests.includes("food")) ideas.push("Cooking Class or Food Truck Festival");
  if (interests.includes("gaming")) ideas.push("Arcade Date or VR Experience");
  if (interests.includes("art")) ideas.push("Museum Visit or Pottery Workshop");
  if (interests.includes("reading")) ideas.push("Bookstore Browsing or Poetry Reading");

  // Default if few matches
  if (ideas.length < 2) {
    ideas.push("Romantic Dinner under the Stars");
    ideas.push("Sunset Picnic");
  }

  // Shuffle and pick 3
  return ideas.sort(() => 0.5 - Math.random()).slice(0, 3);
}

// Initialize
showSection("landing");
