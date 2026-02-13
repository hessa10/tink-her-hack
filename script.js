let user = {
  name: "",
  age: 0,
  goal: "",
  interests: [],
  answers: []
};

function showSection(sectionId) {
  document.getElementById("landing").style.display = "none";
  document.getElementById("info").style.display = "none";
  document.getElementById("questions").style.display = "none";
  document.getElementById("results").style.display = "none";

  document.getElementById(sectionId).style.display = "block";
}
function saveBasicInfo() {
  user.name = document.getElementById("name").value;
  user.age = document.getElementById("age").value;
  user.goal = document.getElementById("goal").value;

  let checked = document.querySelectorAll('input[name="interest"]:checked');
  user.interests = [];

  checked.forEach((item) => {
    user.interests.push(item.value);
  });

  showSection("questions");
}
function saveAnswers() {
  user.answers = [];

  for (let i = 1; i <= 10; i++) {
    let selected = document.querySelector(`input[name="q${i}"]:checked`);
    user.answers.push(parseInt(selected.value));
  }

  calculateResults();
}
function calculateCompatibility(user, match) {
  let score = 0;

  for (let i = 0; i < 10; i++) {
    let diff = Math.abs(user.answers[i] - match.answers[i]);
    score += (5 - diff);
  }

  return Math.round((score / 50) * 100);
}
function getFlags() {
  let green = [];
  let red = [];

  if (user.answers[0] > 4)
    green.push("Great communicator");

  if (user.answers[4] > 4)
    red.push("High jealousy tendency");

  if (user.answers[9] > 4)
    green.push("Strong commitment mindset");

  return { green, red };
}
function getPersonality() {
  if (user.answers[0] > 4 && user.answers[7] > 4)
    return "The Communicator";

  if (user.answers[2] > 4 && user.answers[3] > 4)
    return "The Independent";

  if (user.answers[5] > 4 && user.answers[9] > 4)
    return "The Romantic";

  return "The Balanced Partner";
}
function getDateIdeas() {
  let ideas = [];

  if (user.interests.includes("music"))
    ideas.push("Attend a live music event");

  if (user.interests.includes("movies"))
    ideas.push("Movie marathon night");

  if (user.interests.includes("sports"))
    ideas.push("Watch a game together");

  return ideas.slice(0,3);
}
showSection("results");
