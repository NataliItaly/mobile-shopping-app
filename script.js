import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://shopping-app-dc08d-default-rtdb.europe-west1.firebasedatabase.app",
};

const app = initializeApp(appSettings);
console.log(app);
const database = getDatabase(app);
const goodsInDB = ref(database, "goods");

const form = document.getElementById("form");
const formInput = document.getElementById("new-good");
const shoppingList = document.getElementById("shopping-list");

window.addEventListener("load", generateShoppingList);

form.addEventListener("submit", function (event) {
  event.preventDefault();
  push(goodsInDB, formInput.value);
  generateShoppingList();

  formInput.value = "";
});

function generateNewShoppingItem(id, value) {
  return `<li class="shopping-item" data-id="${id}">${value}</li>`;
}

function generateShoppingList() {
  shoppingList.innerHTML = "";
  onValue(goodsInDB, function (snapshot) {
    if (snapshot.exists()) {
      const allGoods = Object.entries(snapshot.val());
      allGoods.forEach((good) => {
        const [goodId, currentGood] = good;
        shoppingList.insertAdjacentHTML(
          "afterbegin",
          generateNewShoppingItem(goodId, currentGood)
        );
      });
    } else {
      shoppingList.innerHTML = `You don't have any item...`;
    }
  });
}

window.addEventListener("dblclick", function (event) {
  event.preventDefault();
  if (event.target.classList.contains("shopping-item")) {
    console.log(event.target.dataset.id);
    const exactLocationOfGoodInDB = ref(
      database,
      `goods/${event.target.dataset.id}`
    );
    remove(exactLocationOfGoodInDB);

    generateShoppingList();
  }
});
