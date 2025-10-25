let startTime = null;

// Load progress from localStorage
let progress = JSON.parse(localStorage.getItem("progress")) || {
  xp: 0,
  lessonsCompleted: 0,
  totalErrors: 0
};

function updateProgressDisplay() {
  const tracker = document.getElementById("progress");
  if (tracker) {
    tracker.innerHTML = `
      <h3>📊 Your Progress</h3>
      <p>⭐ XP: ${progress.xp}</p>
      <p>📚 Lessons Completed: ${progress.lessonsCompleted}</p>
      <p>❌ Total Errors: ${progress.totalErrors}</p>
      <progress value="${progress.xp}" max="100"></progress>
      <br><br>
      <button id="reset-btn">🔄 Reset Progress</button>
    `;

    // Attach reset button event
    document.getElementById("reset-btn").addEventListener("click", () => {
      if (confirm("Are you sure you want to reset your progress?")) {
        progress = { xp: 0, lessonsCompleted: 0, totalErrors: 0 };
        localStorage.setItem("progress", JSON.stringify(progress));
        updateProgressDisplay();
        alert("Progress has been reset ✅");
      }
    });
  }
}

window.onload = function () {
  const inputBox = document.getElementById("input");
  const submitButton = document.getElementById("submit-btn");

  updateProgressDisplay();

  if (inputBox && submitButton) {
    inputBox.addEventListener("focus", () => {
      if (!startTime) {
        startTime = performance.now();
      }
    });

    submitButton.addEventListener("click", () => {
      const original = document.getElementById("code").innerText.trim();
      const typed = inputBox.value.trim();
      const endTime = performance.now();

      let correct = 0;
      let errors = 0;
      for (let i = 0; i < typed.length; i++) {
        if (typed[i] === original[i]) {
          correct++;
        } else {
          errors++;
        }
      }
      if (typed.length < original.length) {
        errors += (original.length - typed.length);
      }

      const accuracy = ((correct / original.length) * 100).toFixed(2);
      const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
      const wordsTyped = typed.trim().split(/\s+/).filter(Boolean).length;
      const minutes = timeTaken / 60;
      const wpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0;

      // Update progress
      progress.xp += Math.max(5, Math.round(accuracy / 10)); // XP based on accuracy
      progress.lessonsCompleted += 1;
      progress.totalErrors += errors;
      localStorage.setItem("progress", JSON.stringify(progress));

      updateProgressDisplay();

      // Friendly feedback
      let feedback = "";
      if (accuracy == 100) {
        feedback = "🎉 Perfect! Excellent typing!";
      } else if (accuracy >= 80) {
        feedback = "👍 Great job! Just a few mistakes.";
      } else if (accuracy >= 50) {
        feedback = "🙂 Keep practicing, you’re improving.";
      } else {
        feedback = "💡 Don’t worry, errors are part of learning!";
      }

      document.getElementById("result").innerHTML = `
        <h3>Results</h3>
        <p>✅ Accuracy: ${accuracy}%</p>
        <p>❌ Errors: ${errors}</p>
        <p>⌛ Time Taken: ${timeTaken} seconds</p>
        <p>📈 Words Per Minute: ${wpm}</p>
        <p>🔤 Total Characters Typed: ${typed.length}</p>
        <p>${feedback}</p>
      `;
    });
  }
};