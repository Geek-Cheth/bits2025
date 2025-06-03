const choices = ["Rock", "Paper", "Scissors"];
let userScore = 0;
let computerScore = 0;

function getComputerChoice() {
  return choices[Math.floor(Math.random() * choices.length)];
}

function getResult(user, computer) {
  if (user === computer) return "It's a draw!";
  if (
    (user === "Rock" && computer === "Scissors") ||
    (user === "Paper" && computer === "Rock") ||
    (user === "Scissors" && computer === "Paper")
  ) {
    userScore++;
    return "You win!";
  } else {
    computerScore++;
    return "You lose!";
  }
}

function play(userChoice) {
  const computerChoice = getComputerChoice();
  const result = getResult(userChoice, computerChoice);
  document.getElementById("result").textContent =
    `You chose ${userChoice}. Pasindu chose ${computerChoice}. ${result}`;
  document.getElementById("score").textContent =
    `Score: You ${userScore} - ${computerScore} Pasindu`;
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".choice").forEach(btn => {
    btn.addEventListener("click", () => {
      const label = btn.textContent.trim().split(" ").slice(1).join(" ");
      play(label);
    });
  });
});
