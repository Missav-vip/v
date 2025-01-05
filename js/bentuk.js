async function fetchData() {
    const kueResponse = await fetch('css/k.json');
    const plastikResponse = await fetch('css/p.json');
    
    const kueData = await kueResponse.json();
    const plastikData = await plastikResponse.json();

    generateItemRows(kueData.Kue, "kueBody");
    generateItemRows(plastikData.Plastik, "plastikBody");

    enableEditing();
}

function generateItemRows(data, tableId) {
    const tbody = document.getElementById(tableId);
    data.forEach(group => {
        const groupRow = document.createElement("tr");
        groupRow.classList.add("table-subtitle");
        groupRow.innerHTML = `<td colspan="4"></td><td colspan="4">${group.group}</td><td colspan="3"></td>`;
        tbody.appendChild(groupRow);

        group.items.forEach(item => {
            const row = document.createElement("tr");
            if (tableId === "plastikBody") {
                row.innerHTML = `
                    <td>${item.no}</td>
                    <td>${item.ukuran}</td>
                    <td>${item.kode_gudang}</td>
                    <td>${item.kode_toko}</td>
                    <td class="money editable">${item.harga_dus}</td>
                    <td class="money editable">${item.harga_1_pak}</td>
                    <td class="money editable">${item.harga_1_pis}</td>
                    <td class="money editable">${item.harga_1_ons}</td>
                    <td class="money editable">${item.harga_1000_gram}</td>
                    <td class="money editable">${item.harga_500_gram}</td>
                    <td class="money editable">${item.harga_250_gram}</td>
                    <td class="editable">${item.stok_gudang}</td>
                    <td class="editable">${item.stok_toko}</td>
                    <td class="editable">${item.masuk}</td>
                    <td class="editable">${item.keluar}</td>
                `;
            } else {
                row.innerHTML = `
                    <td>${item.no}</td>
                    <td>${item.nama_barang}</td>
                    <td>${item.kode_gudang}</td>
                    <td>${item.kode_toko}</td>
                    <td class="money editable">${item.harga_dus}</td>
                    <td class="money editable">${item.harga_1000_gram}</td>
                    <td class="money editable">${item.harga_500_gram}</td>
                    <td class="money editable">${item.harga_250_gram}</td>
                    <td class="editable">${item.stok_gudang}</td>
                    <td class="editable">${item.stok_toko}</td>
                    <td class="editable">${item.masuk}</td>
                    <td class="editable">${item.keluar}</td>
                `;
            }
            tbody.appendChild(row);
        });
    });
}

function enableEditing() {
    const editableCells = document.querySelectorAll(".editable");

    editableCells.forEach(cell => {
        cell.addEventListener("click", function () {
            const currentValue = cell.innerText;
            const newValue = prompt("Edit Value:", currentValue);

            if (newValue !== null) {
                cell.innerText = newValue;
            }
        });
    });
}

fetchData();
