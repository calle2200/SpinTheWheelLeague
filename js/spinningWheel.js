// Hämta nödvändiga DOM-element
let container = document.querySelector(".container"); // Hjulet
let btn = document.getElementById("spin"); // Spin-knappen
let addButton = document.getElementById("addButton")
let modal = document.getElementById("modal"); // Modal-fönstret
let okButton = document.getElementById("okButton"); // OK-knappen
let modalMessage = modal.querySelector("p"); // Texten i modalen
let teamOnePlayers = document.querySelector(".teamOne .players"); // Lag 1-spelare
let teamTwoPlayers = document.querySelector(".teamTwo .players"); // Lag 2-spelare

// Alla initiala segmentnummer
let segments = [];

// Spåra vilket lag som ska få nästa nummer
let currentTeam = 1;

// Lista med bilder som motsvarar rollerna
let roleImages = ['images/botlane.png', 'images/jungle.png', 'images/toplane.png', 'images/midlane.png', 'images/support.png'];

// Spåra vilka bilder som har använts för varje lag
let teamOneImagesUsed = [];
let teamTwoImagesUsed = [];

// Funktion för att generera left-positionen
function calculateLeft(segments) {
  switch (segments) {
    case 1: return 400;
    case 2: return -165;
    case 3: return -30;
    case 4: return 35;
    case 5: return 75;
    case 6: return 102;
    case 7: return 120;
    case 8: return 135;
    case 9: return 145;
    case 10: return 155;
    default: return 0; // Standardvärde om inget matchar
  }
}

// Funktion för att generera hjulets segment dynamiskt
function updateWheel() {
  // Spara nuvarande rotation för att återställa efter uppdatering
  const currentRotation = getComputedStyle(container).transform;

  // Rensa alla tidigare segment (men behåll spin-knappen och pilen)
  let spinButton = container.querySelector("#spin");
  container.innerHTML = ""; // Rensa allt
  container.appendChild(spinButton); // Lägg tillbaka spin-knappen

  // Beräkna bredden på segmenten baserat på antalet segment
  let segmentWidth = 1600 / segments.length;  // Bredd per segment

  let angleStep = 360 / segments.length;  // Beräkna vinkeln för varje segment

  segments.forEach((number, index) => {
    let segment = document.createElement("div");
    segment.className = `segment segment-${number}`;

    // Sätt bakgrundsfärg baserat på index
    segment.style.backgroundColor = `hsl(${(index * 360) / segments.length}, 70%, 50%)`;

    // Sätt rotation för varje segment så de placeras rätt på hjulet
    segment.style.transform = `rotate(${index * angleStep}deg)`;  // Placera segmentet korrekt

    // Sätt bredden för varje segment
    segment.style.width = `${segmentWidth}px`; // Sätt bredden dynamiskt per segment

    let leftPosition = calculateLeft(segments.length);
    segment.style.left = `${leftPosition}px`;

    // Lägg till texten (numret) i segmentet
    segment.textContent = number;

    // Lägg till segmentet i containern
    container.appendChild(segment);
  });

  // Återställ hjulets rotation efter uppdatering
  container.style.transition = "none"; // Inaktivera transition temporärt
  container.style.transform = currentRotation; // Sätt tillbaka den gamla rotationen
}

function addNameToWheel(element) {
  let clickedName = element.textContent.trim();

  // Kontroll för max antal spelare
  if (segments.length >= 10) {
    alert("Hjulet är fullt! Du kan inte lägga till fler än 10 personer.");
    return; // Stoppa om det redan är 10 personer
  }

  // Kontroll för dubbletter
  if (clickedName && !segments.includes(clickedName)) {
    // Lägg till namnet i segmenten
    segments.push(clickedName);
    updateWheel(); // Uppdatera hjulet

    // Ta bort elementet från DOM
    element.remove();
  } else if (segments.includes(clickedName)) {
    alert("Namnet är redan i hjulet!");
  }
}

// Funktion för att få en unik bild för varje lag
function getUniqueRoleImage(team) {
  let availableImages = roleImages.filter(image => {
    if (team === 1) {
      return !teamOneImagesUsed.includes(image);
    } else {
      return !teamTwoImagesUsed.includes(image);
    }
  });

  // Om inga bilder är tillgängliga (vilket inte borde hända), returnera null
  if (availableImages.length === 0) {
    return null;
  }

  // Slumpa en bild från de tillgängliga
  let randomIndex = Math.floor(Math.random() * availableImages.length);
  let selectedImage = availableImages[randomIndex];

  // Lägg till bilden i den använda listan för rätt lag
  if (team === 1) {
    teamOneImagesUsed.push(selectedImage);
  } else {
    teamTwoImagesUsed.push(selectedImage);
  }

  return selectedImage;
}

// Funktion för att hantera snurr
function spinWheel() {
  if (segments.length === 0) {
    btn.disabled = true; // Inaktivera knappen om inga segment kvar
    return;
  }

  // Kontrollera om det bara är två segment kvar
  if (segments.length === 2) {
    let randomRotation = Math.floor(Math.random() * 360) + 1;
    let finalRotation = randomRotation + 360 * 15; // Lägg till fler varv för längre snurr

    let angleStep = 360 / segments.length;

    container.style.transition = "transform 12s cubic-bezier(0.1, 0.7, 0.1, 1)";
    container.style.transform = `rotate(${finalRotation}deg)`;

    setTimeout(() => {
      let resultAngle = finalRotation % 360;
      let adjustedAngle = (360 - resultAngle + angleStep / 2) % 360;
      let segmentIndex = Math.floor(adjustedAngle / angleStep);
      let selectedNumber = segments[segmentIndex]; // Näst sista segmentet

      // Visa popup för näst sista segmentet
      modalMessage.textContent = `Nummer ${selectedNumber} tilldelas Lag ${currentTeam}!`;
      modal.style.display = "flex";

      // Tilldela näst sista segmentet och tilldela en unik bild
      let selectedImage = getUniqueRoleImage(currentTeam);
      if (!selectedImage) {
        alert("Inga fler unika bilder tillgängliga!");
        return;
      }

      let imageElement = document.createElement("img");
      imageElement.src = selectedImage;
      imageElement.style.width = '50px';
      imageElement.style.height = '50px';

      if (currentTeam === 1) {
        teamOnePlayers.innerHTML += `<div>${selectedNumber} <img src="${selectedImage}" style="width:50px;height:50px;"></div>`;
        currentTeam = 2; // Växla till andra laget
      } else {
        teamTwoPlayers.innerHTML += `<div>${selectedNumber} <img src="${selectedImage}" style="width:50px;height:50px;"></div>`;
        currentTeam = 1; // Växla till första laget
      }

      segments.splice(segmentIndex, 1); // Ta bort näst sista segmentet
      updateWheel(); // Uppdatera hjulet utan näst sista segmentet

      // Vänta på att användaren klickar på OK-knappen
      okButton.onclick = function () {
        modal.style.display = "none"; // Stäng modalen

        // Ta bort sista segmentet från hjulet
        let lastNumber = segments[0]; // Hämta det sista segmentet
        segments.splice(0, 1); // Ta bort det sista segmentet
        updateWheel(); // Gör hjulet tomt

        // Visa popup för sista segmentet
        modalMessage.textContent = `${lastNumber} tilldelas Lag ${currentTeam}!`;
        modal.style.display = "flex";

        // Tilldela en unik bild även för den sista spelaren
        let lastSelectedImage = getUniqueRoleImage(currentTeam);
        if (!lastSelectedImage) {
          alert("Inga fler unika bilder tillgängliga!");
          return;
        }

        let lastImageElement = document.createElement("img");
        lastImageElement.src = lastSelectedImage;
        lastImageElement.style.width = '50px';
        lastImageElement.style.height = '50px';

        if (currentTeam === 1) {
          teamOnePlayers.innerHTML += `<div>${lastNumber} <img src="${lastSelectedImage}" style="width:50px;height:50px;"></div>`;
        } else {
          teamTwoPlayers.innerHTML += `<div>${lastNumber} <img src="${lastSelectedImage}" style="width:50px;height:50px;"></div>`;
        }

        // Avsluta spelet
        okButton.onclick = function () {
          modal.style.display = "none";
          btn.disabled = true;
          btn.textContent = "Slut";
        };
      };
    }, 12000); // Vänta tills animationen för näst sista snurren är klar
    return;
  }

  // Om fler än två segment kvarstår, kör vanlig snurrlogik
  let randomRotation = Math.floor(Math.random() * 360) + 1;
  let finalRotation = randomRotation + 360 * 15;

  let angleStep = 360 / segments.length;

  container.style.transition = "transform 12s cubic-bezier(0.1, 0.7, 0.1, 1)";
  container.style.transform = `rotate(${finalRotation}deg)`;

  setTimeout(() => {
    let resultAngle = finalRotation % 360;
    let adjustedAngle = (360 - resultAngle + angleStep / 2) % 360;
    let segmentIndex = Math.floor(adjustedAngle / angleStep);
    let selectedNumber = segments[segmentIndex];

    modalMessage.textContent = `${selectedNumber} tilldelas Lag ${currentTeam}!`;
    modal.style.display = "flex";

    // Tilldela en unik bild för den valda spelaren
    let selectedImage = getUniqueRoleImage(currentTeam);
    if (!selectedImage) {
      alert("Inga fler unika bilder tillgängliga!");
      return;
    }

    let imageElement = document.createElement("img");
    imageElement.src = selectedImage;
    imageElement.style.width = '50px';
    imageElement.style.height = '50px';

    if (currentTeam === 1) {
      teamOnePlayers.innerHTML += `<div>${selectedNumber} <img src="${selectedImage}" style="width:50px;height:50px;"></div>`;
      currentTeam = 2;
    } else {
      teamTwoPlayers.innerHTML += `<div>${selectedNumber} <img src="${selectedImage}" style="width:50px;height:50px;"></div>`;
      currentTeam = 1;
    }

    segments.splice(segmentIndex, 1);
    updateWheel();

    if (segments.length === 0) {
      btn.disabled = true;
      btn.textContent = "Slut";
    }
  }, 12000); // Vänta tills animationen är klar
}

// Lägg till klickhändelse på spin-knappen
btn.addEventListener("click", spinWheel);

// När användaren klickar på OK-knappen
okButton.onclick = function () {
  modal.style.display = "none"; // Dölj modal

  // Återställ hjulets position
  container.style.transition = "none"; // Ta bort transition temporärt
  container.style.transform = "rotate(0deg)"; // Återställ hjulet till 0 grader

  // Återställ animationen efter en kort fördröjning
  setTimeout(() => {
    container.style.transition = "transform 12s cubic-bezier(0.1, 0.7, 0.1, 1)";
  }, 50); // Vänta 50 ms innan vi återställer transitionen
};

document.addEventListener("DOMContentLoaded", addNames);
