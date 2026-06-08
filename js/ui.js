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
    selectedHairdresser = hairdresserId;

    renderBookingForm();
}

function renderBookingForm() {
    const container = document.getElementById("hairdresser-section");

    container.innerHTML = `
        <h2>Időpontfoglalás</h2>

        <form id="booking-form">
        <p id="form-message"></p>
            <label>Név:</label><br>
            <input type="text" id="customer-name" required><br><br>

            <label>Telefonszám:</label><br>
            <input type="text" id="customer-phone" required><br><br>

            <label>Dátum:</label><br>
            <input type="date" id="appointment-date" required><br><br>

            <label>Időpont:</label><br>
            <select id="appointment-time">
                <option value="">Válassz időpontot</option>
                <option value="09:00">09:00</option>
                <option value="09:30">09:30</option>
                <option value="10:00">10:00</option>
                <option value="10:30">10:30</option>
            </select><br><br>

            <label>Szolgáltatás:</label><br>
            <input type="text" id="service" required><br><br>

            <button type="submit">Foglalás</button>
        </form>

        <br>
        <button onclick="goBack()">Vissza</button>
    `;

    addBookingEvent();
}

function goBack() {
    initApp();
}

function addBookingEvent() {
    const form = document.getElementById("booking-form");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("customer-name").value;
        const phone = document.getElementById("customer-phone").value;
        const date = document.getElementById("appointment-date").value;
        const time = document.getElementById("appointment-time").value;
        const service = document.getElementById("service").value;

        const message = document.getElementById("form-message");

        if (!name || !phone || !date || !time || !service) {
            message.textContent = "Minden mező kitöltése kötelező.";
            message.style.color = "red";
            return;
        }

        const selectedDateTime = new Date(`${date}T${time}`);
        const now = new Date();

        if (selectedDateTime < now) {
            message.textContent = "Múltbeli időpontra nem lehet foglalni.";
            message.style.color = "red";
            return;
        }

        const appointments = await getAppointments();

        const selectedAppointmentDate = `${date} ${time}:00`;

        const isAlreadyBooked = appointments.some(appointment => {
            return Number(appointment.hairdresser_id) === Number(selectedHairdresser)
                && appointment.appointment_date === selectedAppointmentDate;
        });

        if (isAlreadyBooked) {
            message.textContent = "Ez az időpont ennél a fodrásznál már foglalt.";
            message.style.color = "red";
            return;
        }

        const appointmentData = {
            hairdresser_id: selectedHairdresser,
            api_key: API_KEY,
            customer_name: name,
            customer_phone: phone,
            appointment_date: `${date} ${time}:00`,
            service: service
        };

        const result = await createAppointment(appointmentData);

        if (result) {
            message.textContent = "Sikeres foglalás!";
            message.style.color = "green";
            form.reset();
        } else {
            message.textContent = "Hiba történt a foglalás mentésekor.";
            message.style.color = "red";
        }
    });
}