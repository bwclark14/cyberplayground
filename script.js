document.addEventListener("DOMContentLoaded", function() {
    loadChallenges();
    updateEarnedLetters();

    // Load the last visited section (or default to quiz)
    const lastSection = localStorage.getItem("currentSection") || "quiz";
    showSection(lastSection);
});

function showSection(id) {
    // Hide all sections
    document.querySelectorAll(".challenge").forEach(section => {
        section.style.display = "none";
    });

    // Show the selected section
    const selectedSection = document.getElementById(id);
    if (selectedSection) {
        selectedSection.style.display = "block";
    }

    // Save the last visited section in localStorage
    localStorage.setItem("currentSection", id);
}



function loadChallenges() {
    loadQuiz();
    loadPasswords();
    loadDecoder();
    loadMetadata();
    loadDragDrop();
}

// ✅ Decoder Challenge
const decoderChallenges = [
    { question: "Decode this: 67 79 42 69 52", image: "images/binary.png", answer: "CYBER" },
    { question: "Base64 decode: U2VjdXJpdHk=", image: "images/base64.png", answer: "Security" },
    { question: "Reverse this: drowssap", image: "images/reverse.png", answer: "password" }
];

function loadDecoder() {
    let decoderHTML = "";
    decoderChallenges.forEach((d, i) => {
        decoderHTML += `<p><img src="${d.image}" width="100"><br>${d.question}</p>`;
        decoderHTML += `<input type="text" id="decoder${i}"><br>`;
    });
    document.getElementById("decoder-container").innerHTML = decoderHTML;
}

function checkDecoder() {
    let correct = 0;
    decoderChallenges.forEach((d, i) => {
        if (document.getElementById(`decoder${i}`).value.trim().toLowerCase() === d.answer.toLowerCase()) {
            correct++;
        }
    });

    if (correct === decoderChallenges.length) {
        saveLetter("D");
        document.getElementById("decoder-result").innerText = "✅ Correct! You earned a letter: D";
    } else {
        document.getElementById("decoder-result").innerText = "❌ Try again!";
    }
}

// 🖼️ Metadata Challenge
const metadataImages = [
    { file: "images/meta1.jpg", fakeCaption: "Taken in 2023", realYear: "2021" },
    { file: "images/meta2.jpg", fakeCaption: "Captured in New York", realLocation: "Los Angeles" },
    { file: "images/meta3.jpg", fakeCaption: "Photo from summer", realSeason: "Winter" }
];

function loadMetadata() {
    let metaHTML = "";
    metadataImages.forEach((img, i) => {
        metaHTML += `<p><img src="${img.file}" width="150"><br>${img.fakeCaption}</p>`;
        metaHTML += `<button onclick="revealMetadata(${i})">Show Metadata</button>`;
        metaHTML += `<p id="metadata${i}" style="display:none;">Real Data: ${img.realYear || img.realLocation || img.realSeason}</p>`;
    });
    document.getElementById("metadata-container").innerHTML = metaHTML;
}

function revealMetadata(index) {
    document.getElementById(`metadata${index}`).style.display = "block";
}

// 🏷️ Drag-and-Drop Matching (Cyber Terms)
const terms = [
    { term: "Phishing", definition: "Tricking users into giving away personal information." },
    { term: "Firewall", definition: "A security system that blocks unauthorized access." },
    { term: "Malware", definition: "Software designed to harm or exploit devices." }
];

function loadDragDrop() {
    let termsHTML = "";
    let defsHTML = "";

    terms.forEach((t, i) => {
        termsHTML += `<div class="draggable" draggable="true" id="term${i}" ondragstart="drag(event)">${t.term}</div>`;
        defsHTML += `<div class="dropzone" ondrop="drop(event, '${t.definition}')" ondragover="allowDrop(event)">${t.definition}</div>`;
    });

    document.getElementById("terms").innerHTML = termsHTML;
    document.getElementById("definitions").innerHTML = defsHTML;
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event, correctDefinition) {
    event.preventDefault();
    let draggedID = event.dataTransfer.getData("text");
    let draggedTerm = document.getElementById(draggedID).innerText;

    let foundTerm = terms.find(t => t.term === draggedTerm);
    if (foundTerm && foundTerm.definition === correctDefinition) {
        event.target.innerHTML = `<b>${draggedTerm}</b>`;
        document.getElementById(draggedID).remove();
    }

    checkMatching();
}

function checkMatching() {
    if (document.querySelectorAll(".draggable").length === 0) {
        saveLetter("M");
        document.getElementById("dragdrop-result").innerText = "✅ Correct! You earned a letter: M";
    }
}

// 📝 Save Earned Letters
function saveLetter(letter) {
    let letters = JSON.parse(localStorage.getItem("letters")) || [];
    if (!letters.includes(letter)) {
        letters.push(letter);
        localStorage.setItem("letters", JSON.stringify(letters));
    }
    updateEarnedLetters();
}

function updateEarnedLetters() {
    let letters = JSON.parse(localStorage.getItem("letters")) || [];
    document.getElementById("earned-letters").innerText = letters.join(" ");
}
