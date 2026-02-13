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
