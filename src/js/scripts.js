class tableVideos {
    constructor() {
        this.nav = document.querySelector("[data-navigation]");
        this.table = document.querySelector("[data-table]");

        if (!this.navigationElement && !this.table) return;

        this.selectElement = document.getElementById("inputGroupSelect");
        this.inputElement = document.getElementById("inputName");
        this.valueSelectElement = "";
        this.valueInputElement = "";

        this.apiKey = "e3bd5693";
        this.apiUrl = "http://www.omdbapi.com/";

        this.init();
    }

    init() {
        this.setEventListeners();
    }

    setEventListeners() {
        this.selectElement.addEventListener("change", () => {
            this.updateValues();
            this.fetchData();
        });

        this.inputElement.addEventListener("input", () => {
            if (this.inputElement.value.length >= 3) {
                this.updateValues();
                this.fetchData();
            }
        });
    }

    updateValues() {
        this.valueSelectElement = this.selectElement.value;
        this.valueInputElement = this.inputElement.value;
    }

    fetchData() {
        let url = `${this.apiUrl}?apikey=${this.apiKey}`;
        url += `&s=${encodeURIComponent(this.valueInputElement)}`;

        if (this.valueSelectElement) {
            url += `&type=${this.valueSelectElement}`;
        }

        fetch(url)
            .then((response) => response.json())
            .then((data) => this.updateTable(data))
            .catch((error) => console.error("Error fetching data:", error));
    }

    updateTable(data) {
        const tableBody = this.table.querySelector("tbody");
        tableBody.innerHTML = "";

        if (data.Error && data.Error === "Too many results.") {
            const row = `
                <tr>
                    <td colspan="5">Zbyt wiele wyników. Spróbuj bardziej szczegółowego zapytania.</td>
                </tr>
            `;
            tableBody.innerHTML = row;
            return;
        }

        if (data && data.Response === "True") {
            data.Search.forEach((item, index) => {
                const row = `
                    <tr>
                        <th scope="row">${index + 1}</th>
                        <td>${
                            item.Poster && item.Poster !== "N/A"
                                ? `<img class="thumbnail img-thumbnail" src="${item.Poster}">`
                                : "-"
                        }</td>
                        <td>${item.Title || "-"}</td>
                        <td>${item.Year || "-"}</td>
                        <td>${item.Type || "-"}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        } else {
            const row = `
                <tr>
                    <td colspan="5">Brak wyników</td>
                </tr>
            `;
            tableBody.innerHTML = row;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new tableVideos();
});
