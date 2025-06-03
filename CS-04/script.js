function convertTemperature() {
  const direction = document.getElementById("direction").value;
  const tempInput = document.getElementById("temperature").value;
  const resultDiv = document.getElementById("result");
  const temp = parseFloat(tempInput);

  if (isNaN(tempInput) || tempInput === "") {
    resultDiv.textContent = "Please enter a valid temperature.";
    resultDiv.style.color = "#ff5252";
    return;
  }

  let result;
  if (direction === "CtoF") {
    result = (temp * 9/5) + 32;
    resultDiv.textContent = `${temp}°C = ${result.toFixed(2)}°F`;
    resultDiv.style.color = "#aeea00";
  } else {
    result = (temp - 32) * 5/9;
    resultDiv.textContent = `${temp}°F = ${result.toFixed(2)}°C`;
    resultDiv.style.color = "#aeea00";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("convertBtn").addEventListener("click", convertTemperature);
});
