const form = document.querySelector("#productForm")
const tbody = document.querySelector('#tbody')


document.getElementById("productForm").addEventListener("submit", (e) => {
    e.preventDefault()


    const ProductName = document.querySelector('#product_name').value
    const category = document.querySelector("#drop-down").value
    const price = document.querySelector("#price").value


    const rowData = { ProductName, category, price }

    if (editingRow) {
        // Update existing row
        editingRow.children[0].textContent = ProductName;
        editingRow.children[1].textContent = category;
        editingRow.children[2].textContent = `${price} ₹`;
        updateLocalStorageFromTable(); 
        editingRow = null; 
    } else {
        
        addDataToRow(rowData);
        addDataToLocalStorage(rowData);
    }
    
    updateTotal()

    form.reset()

    document.getElementById("drop-down-1").value = "All";
FilterDataByCategory("All");
    

    // console.log(ProductName, category, price);
})

function updateLocalStorageFromTable() {
    const allRows = tbody.querySelectorAll('tr');
    const newData = [];

    allRows.forEach(row => {
        const name = row.children[0].textContent.trim();
        const category = row.children[1].textContent.trim();
        const price = row.children[2].textContent.trim().replace('₹', '').trim();

        newData.push({ ProductName: name, category, price });
    });

    localStorage.setItem('tableData', JSON.stringify(newData));
}


window.addEventListener("DOMContentLoaded", () => {
    const storedData = JSON.parse(localStorage.getItem('tableData')) || [];
    storedData.forEach(addDataToRow)
    updateTotal()
})

//add new data
let addDataToRow = (data) => {

    const newRow = document.createElement('tr')
    newRow.innerHTML = `
    <td>${data.ProductName}</td>
    <td>${data.category}</td>
    <td>${data.price} ₹</td>`

    tbody.appendChild(newRow)
}

//For save in local storage
let addDataToLocalStorage = (data) => {
    const ExistingData = JSON.parse(localStorage.getItem('tableData')) || []
    ExistingData.push(data)
    localStorage.setItem('tableData', JSON.stringify(ExistingData))
}

//Total Price
const updateTotal = () => {
    const rows = tbody.querySelectorAll('tr');
    let total = 0;

    rows.forEach((row) => {
        // console.log(row.children[2].textContent)
        const priceData = row.children[2]
        if (priceData) {
            const price = parseFloat(priceData.textContent.replace('₹', '').trim());
            total += isNaN(price) ? 0 : price;
        }
    })

    document.querySelector('#TotalPrice').innerHTML = `${total} ₹`
}

//Ascending-Descending Price order
const sortTableByPrice =(ascending = true)=>{
    const rows = Array.from(tbody.querySelectorAll('tr'));

    const filteredRows = rows.filter(row =>!row.querySelector('td[colspan]'));

    filteredRows.sort((a,b)=>{
        const priceA = parseFloat(a.children[2].textContent.replace("₹", "").trim())
        const priceB = parseFloat(b.children[2].textContent.replace("₹", "").trim())
        return ascending ? priceA - priceB : priceB - priceA;
    })

    tbody.innerHTML = "";

    filteredRows.forEach((row)=>{
        tbody.appendChild(row)
    })

    updateTotal()
}

document.querySelector("#sort-asc").addEventListener("click",()=>{
    sortTableByPrice(true)
})

document.querySelector("#sort-desc").addEventListener("click",()=>{
    sortTableByPrice(false)
})

//context menu 
const menu = document.querySelector('#context-menu');
const editOption = document.querySelector('#edit-cell');
const deleteOption = document.querySelector('#delete-row');

let currentCell = null;
let currentRow = null;

document.querySelectorAll('tbody').forEach(td => {
    td.addEventListener('contextmenu', (e) => {

        const td = e.target.closest('td');
        const tr = td?.parentElement;

        if (!td || tr.querySelector('td[colspan]')) return;

        e.preventDefault();

        currentCell = td;
        currentRow = td?.parentElement;

        menu.style.top = `${e.pageY}px`;
        menu.style.left = `${e.pageX}px`;
        menu.style.display = 'block';
    });
});

document.addEventListener('click', () => {
    menu.style.display = 'none';
});

let editingRow = null;


//edit data

editOption.addEventListener('click', () => {
    if (!currentRow) return;


    const name = currentRow.children[0].textContent.trim();
    const category = currentRow.children[1].textContent.trim();
    const price = currentRow.children[2].textContent.trim().replace('₹', '').trim();


    document.querySelector('#product_name').value = name;
    document.querySelector('#drop-down').value = category;
    document.querySelector('#price').value = price;

    editingRow = currentRow;

    menu.style.display = 'none';
});

// delete data

deleteOption.addEventListener('click', () => {
    if (currentRow) {
        currentRow.remove();
        updateLocalStorageFromTable();
        updateTotal();
    }
    menu.style.display = 'none';
});

//Fliter out data by category

const FilterDataByCategory = (category) => {
    const rows = tbody.querySelectorAll('tr');

    rows.forEach(row => {
        const rowCategory = row.children[1]?.textContent.trim().toLowerCase();

        if (category.toLowerCase() === 'all' || rowCategory === category.toLowerCase()) {
            row.style.display = ""; 
        } else {
            row.style.display = "none"; 
        }
    });
};

document.querySelector('#drop-down-1').addEventListener("change", (e) => {
    const selectedCategory = e.target.value;
    FilterDataByCategory(selectedCategory);
});
