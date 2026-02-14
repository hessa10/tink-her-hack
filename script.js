let user = {
  name: "",
  age: 0,
  goal: "",
  interests: [],
  answers: []
};
function updateProgress() {
  let answered = document.querySelectorAll('input[type="radio"]:checked').length;
  let progressPercent = (answered / 10) * 100;

  document.getElementById("progress-fill").style.width = progressPercent + "%";
  document.getElementById("progress-text").textContent =
    "Answered " + answered + " of 10";
}
document.querySelectorAll('input[type="radio"]').forEach(radio => {
  radio.addEventListener("change", updateProgress);
});


// --- Navigation ---
function showSection(sectionId) {
  const sections = ["landing", "info", "questions", "results"];

  sections.forEach(id => {
    document.getElementById(id).style.display = "none";
  });

  let active = document.getElementById(sectionId);
  active.style.display = "block";
  active.style.opacity = 0;

  setTimeout(() => {
    active.style.opacity = 1;
  }, 50);
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

  let scoreElement = document.getElementById("score-display");
  let circle = document.querySelector(".score-circle");

  // Animation Logic
  let current = 0;
  let increment = 1;
  let speed = 20; // 20ms per step

  // If compatibility is 0, just show it
  if (compatibility === 0) {
    scoreElement.textContent = "0%";
  } else {
    let interval = setInterval(() => {
      if (current >= compatibility) {
        clearInterval(interval);
        current = compatibility;
      } else {
        current++;
      }
      scoreElement.textContent = current + "%";
    }, speed);
  }
  let messageElement = document.getElementById("score-message");

  if (compatibility >= 80) {
    messageElement.textContent =
      "You’re emotionally aligned and relationship-ready! 💚";
  }
  else if (compatibility >= 60) {
    messageElement.textContent =
      "There’s potential, but communication is key. 💛";
  }
  else {
    messageElement.textContent =
      "Reflection and growth could strengthen compatibility. ❤️";
  }


  // Color Logic
  // Green for high compatibility
  // Yellow for medium
  // Red for low
  let color = "#e74c3c"; // Red default
  if (compatibility >= 80) color = "#2ecc71"; // Green
  else if (compatibility >= 50) color = "#f1c40f"; // Yellow

  scoreElement.style.color = color;
  circle.style.border = `5px solid ${color}`;

  // 2. Personality Type
  let personality = getPersonality();

  // 3. Flags
  let flags = getFlags();

  // 4. Date Ideas
  let dateIdeas = getDateIdeas();
  dateIdeas.push("Cozy movie night with your favorite snacks and no phone distractions.");
  dateIdeas.push("Sunset coffee date at a quiet place with deep conversations.");
  dateIdeas.push("A spontaneous late-night drive with music and zero plans.");
  dateIdeas.push("Cook dinner together and turn it into a mini home date.");


  // --- Update DOM ---
  let personalityText = "";
  let personalityTitle = personality.type; // Fixed: personality returns an object {type, desc}

  if (personality.type === "The Communicator") {
    personalityText =
      "You value honesty, emotional clarity, and deep conversations. You thrive in relationships built on trust and transparency.";
  }
  else if (personality.type === "The Independent Trailblazer") { // Fixed: Match string from getPersonality
    personalityText =
      "You respect personal space and individuality. You believe strong relationships allow room for growth.";
  }
  else if (personality.type === "The Hopeless Romantic") { // Fixed: Match string from getPersonality
    personalityText =
      "You love emotional connection and thoughtful gestures. You believe love should be expressed openly and passionately.";
  }
  else if (personality.type === "The Planner") {
    personalityText = "You have a vision and stick to it."
  }
  else {
    personalityText =
      "You balance logic and emotion well. You adapt easily and value harmony in relationships.";
  }

  document.getElementById("personality-display").innerHTML =
    "<strong>" + personalityTitle + "</strong><br>" + personalityText;


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


function resetApp() {
  document.getElementById("quiz-form").reset();
  document.getElementById("progress-fill").style.width = "0%";
  document.getElementById("progress-text").textContent = "Question 1 of 10";
  showSection("landing");
}
// Initialize
showSection("landing");
