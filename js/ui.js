function validatePhone(phone) {
    const phoneRegex = /^(\+36|06)(20|30|31|50|70)\d{7}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
}

function validateName(name) {
    return name.trim().length >= 2;
}

const allowedServices = [
    "Hajvágás",
    "Szakáll igazítás",
    "Hajfestés",
    "Gyerek hajvágás"
];

function validateService(service) {
    return allowedServices.includes(service);
}

function showError(messageElement, text) {
    messageElement.textContent = text;
    messageElement.style.color = "red";
}

function isPastAppointment(date, time) {
    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    return selectedDateTime < now;
}

function createAppointmentData(name, phone, date, time, service) {
    return {
        hairdresser_id: selectedHairdresser,
        api_key: API_KEY,
        customer_name: name,
        customer_phone: phone.replace(/\s/g, ""),
        appointment_date: `${date} ${time}:00`,
        service: service
    };
}

function isAppointmentAlreadyBooked(appointments, date, time) {
    const selectedAppointmentDate = `${date} ${time}:00`;

    return appointments.some(appointment => {
        return Number(appointment.hairdresser_id) === Number(selectedHairdresser)
            && appointment.appointment_date === selectedAppointmentDate;
    });
}


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
           <input type="tel" id="customer-phone" placeholder="+36301234567" required>
           <small>Formátum: +36301234567 vagy 06301234567</small>
           <br><br>

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
            <select id="service" required>
    <option value="">Válassz szolgáltatást</option>
    <option value="Hajvágás">Hajvágás</option>
    <option value="Szakáll igazítás">Szakáll igazítás</option>
    <option value="Hajfestés">Hajfestés</option>
    <option value="Gyerek hajvágás">Gyerek hajvágás</option>
</select><br><br>


            <button type="submit">Foglalás</button>
        </form>

        <br>
        <button onclick="goBack()">Vissza</button>
    `;

    addBookingEvent();
}

function goBack() {
    const container = document.getElementById("hairdresser-section");

    container.innerHTML = `
        <h2>Fodrászaink</h2>
        <div id="hairdresser-list" class="hairdresser-list">
            <p>Fodrászok betöltése...</p>
        </div>
    `;

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
            showError(message, "Minden mező kitöltése kötelező.");
            return;
        }

        if (!validateName(name)) {
            showError(message, "A név legalább 2 karakter hosszú legyen.");
            return;
        }

        if (!validatePhone(phone)) {
            showError(message, "Adj meg érvényes magyar telefonszámot!");
            return;
        }

        if (!validateService(service)) {
            showError(message, "Csak a listából választható szolgáltatás foglalható.");
            return;
        }

        if (isPastAppointment(date, time)) {
            showError(message, "Múltbeli időpontra nem lehet foglalni.");
            return;
        }

        const appointments = await getAppointments();
        if (isAppointmentAlreadyBooked(appointments, date, time)) {
            showError(message, "Ez az időpont ennél a fodrásznál már foglalt.");
            return;
        }

        const appointmentData = createAppointmentData(name, phone, date, time, service);
        const result = await createAppointment(appointmentData);

        if (result) {
            renderSuccessMessage();
        } else {
            showError(message, "Hiba történt a foglalás mentésekor.");
        }
    });
}

function renderSuccessMessage() {
    const container = document.getElementById("hairdresser-section");

    container.innerHTML = `
        <h2>Sikeres foglalás!</h2>
        <p>Az időpontfoglalásod sikeresen rögzítésre került.</p>
        <button onclick="goBack()">Vissza a fodrászokhoz</button>
    `;
}