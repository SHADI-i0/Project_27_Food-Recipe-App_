const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");

searchBtn.addEventListener("click", getMealList);
mealList.addEventListener("click", getMealRecipe);

function getMealList() {
    let searchInputTxt = document.getElementById("search-input").value.trim().toUpperCase();
    searchInput.value = "";
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.meals) {
                mealList.innerHTML = "";
                data.meals.forEach((meal) => {
                    mealList.innerHTML += `
                        <div class="meal-item" data-id="${meal.idMeal}">
                            <div class="meal-img">
                                <img src="${meal.strMealThumb}" alt="food">
                            </div>
                            <div class="meal-name">
                                <h3>${meal.strMeal}</h3>
                                <a href="#" class="recipe-btn">Get Recipe</a>
                            </div>
                        </div>`;
                });
            } else {
                mealList.innerHTML = `<p class="notFound">"Sorry, We didn't Find any meal..!"</p>`;
            }
        });
}

function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains("recipe-btn")) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then((response) => response.json())
            .then((data) => mealRecipeModal(data.meals));
        mealDetailsContent.parentElement.classList.add("showRecipe");
        document.querySelector(".overlay").classList.add("showRecipe");
    }
}

function mealRecipeModal(meal) {
    meal = meal[0];
    mealDetailsContent.innerHTML = `
            <h2 class="recipe-title">${meal.strMeal}</h2>
            <p class="recipe-category">${meal.strCategory}</p>
            <div class="recipe-instruct">
                <h3>Instructions:</h3>
                <p>${meal.strInstructions}</p>
            </div>
            <div class="recipe-meal-img">
                <img src="${meal.strMealThumb}" alt="#">
            </div>
            <div class="recipe-link">
                <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
            </div>
    `;

    recipeCloseBtn.addEventListener("click", () => {
        document.querySelector(".overlay").classList.remove("showRecipe");
        mealDetailsContent.parentElement.classList.remove("showRecipe");
    });
}