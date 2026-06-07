function renderHairdressers(hairdressers) {
    const hairdresserList = document.getElementById("hairdresser-list");

    hairdresserList.innerHTML = "";

    if (hairdressers.length === 0) {
        hairdresserList.innerHTML = "<p>Jelenleg nincs megjeleníthető fodrász.</p>";
        return;
    }

    hairdressers.forEach(hairdresser => {
        const card = document.createElement("div");
        card.classList.add("hairdresser-card");

        card.innerHTML = `
            <h3>${hairdresser.name}</h3>
            <p><strong>Szakterület:</strong> ${hairdresser.specialty || "Nincs megadva"}</p>
            <p><strong>Bemutatkozás:</strong> ${hairdresser.description || "Nincs leírás"}</p>
            <button onclick="selectHairdresser(${hairdresser.id})">
                Időpontfoglalás
            </button>
        `;

        hairdresserList.appendChild(card);
    });
}

function selectHairdresser(hairdresserId) {
    console.log("Kiválasztott fodrász ID:", hairdresserId);
}