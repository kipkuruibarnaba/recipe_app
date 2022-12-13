import * as model from './model.js';
import recipeView from './views/recipeViews.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView';
import {API_URL,RES_PER_PAGE,API_KEY,MODAL_CLOSE_SEC} from './config.js';
// import icons from '../img/icons.svg'; //Parcel 1
import icons from 'url:../img/icons.svg'; //Parcel 2
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
// console.log(icons)

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //0 .Update results view to mark selected search results
    // resultsView.render(model.getSearchResultsPage());
    resultsView.update(model.getSearchResultsPage());
    // debugger;
    bookmarksView.update(model.state.bookmarks);
    //1 .Loading the recipe
    await model.loadRecipe(id);

    //2 .Rendering the recipe
    recipeView.render(model.state.recipe);
    // const recipeView =new recipeView(model.state.recipe)
    // console.log(model.state.recipe)
    // controlServings();

  } catch (err) {
    // alert(error);
    //  console.error(err)
    recipeView.renderError();
    console.error(err)
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1 .Get search query
    const query = searchView.getQuery();
    if (!query) return;
    //2 .Loading search recipes
    await model.loadSearchResults(query);
    //Render results
    // console.log(model.state.search.results)
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(1));
    // console.log(model.state.search)

    //Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};
// controlSearchResults();

const controlPagination = function (goToPage) {
  //Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));
  //Render NEW pagination buttons
  paginationView.render(model.state.search);
  // console.log(goToPage);
};

const controlServings = function (newServings) {
  //1  Update the recipe serings in the state
  model.updateServings(newServings);

  //2  Update the recipeview
  // recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe);
};

const controllerAddBookmark = function () {

    //1  Add remove bookmarks
  if(!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else
   model.deleteBookMark(model.state.recipe.id);
  // console.log(model.state.recipe);

    //2  Update the recipe view
  recipeView.update(model.state.recipe);

    //3  Render bookmark
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe =async function(newRecipe){
  try {
    //Show spinner
    addRecipeView.renderSpinner();
   //  console.log(newRecipe);
 //Upload the new recipe data
 await model.uploadRecipe(newRecipe); 
 console.log(model.state.recipe);
 //Render recipe
 recipeView.render(model.state.recipe);

 //Success message
 addRecipeView.renderMessage();
 //Render Bookmark
 bookmarksView.render(model.state.bookmarks);
 //change ID in the url
 window.history.pushState(null,'',`#${model.state.recipe.id}`);
//  window.history.back();
 //close form window
 setTimeout(function(){
  addRecipeView.toggleWindow();
 },MODAL_CLOSE_SEC*1000)
  } catch (error) {
    console.error(error)
    addRecipeView.renderError(error.message);
    // throw error
  }
}
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controllerAddBookmark);
  searchView.addSearchHandler(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();

// window.addEventListener('hashchange',controlRecipes)
// window.addEventListener('load',controlRecipes)

// const renderSpinner = function(parElem){
//   const markUp = `<div class="spinner">
//   <svg>
//     <use href="${icons}#icon-loader"></use>
//   </svg>
// </div>`
// parElem.innerHTML = '';
// parElem.insertAdjacentHTML('afterbegin', markUp);
// }

// const showRecipe = async function () {
//   try {

//     const id = window.location.hash.slice(1);
//     if(!id) return
//     // console.log(id)
//     renderSpinner(recipeContainer)

//     //1 .Loading the recipe
//     await model.loadRecipe(id);

//     const recipe = model.state.recipe;
//     // console.log(recipe)

//     //2 .Rendering the recipe

//     const markUp = `
//     <figure class="recipe__fig">
//       <img crossorigin="anonymous" src="${recipe.image}" alt="${recipe.title} class="recipe__img" />
//       <h1 class="recipe__title">
//         <span>${recipe.title}</span>
//       </h1>
//     </figure>

//     <div class="recipe__details">
//       <div class="recipe__info">
//         <svg class="recipe__info-icon">
//           <use href="${icons}#icon-clock"></use>
//         </svg>
//         <span class="recipe__info-data recipe__info-data--minutes">${recipe.cookingTime}</span>
//         <span class="recipe__info-text">minutes</span>
//       </div>
//       <div class="recipe__info">
//         <svg class="recipe__info-icon">
//           <use href="${icons}#icon-users"></use>
//         </svg>
//         <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
//         <span class="recipe__info-text">servings</span>

//         <div class="recipe__info-buttons">
//           <button class="btn--tiny btn--increase-servings">
//             <svg>
//               <use href="${icons}#icon-minus-circle"></use>
//             </svg>
//           </button>
//           <button class="btn--tiny btn--increase-servings">
//             <svg>
//               <use href="${icons}#icon-plus-circle"></use>
//             </svg>
//           </button>
//         </div>
//       </div>

//       <div class="recipe__user-generated">
//         <svg>
//           <use href="${icons}#icon-user"></use>
//         </svg>
//       </div>
//       <button class="btn--round">
//         <svg class="">
//           <use href="${icons}#icon-bookmark-fill"></use>
//         </svg>
//       </button>
//     </div>

//     <div class="recipe__ingredients">
//       <h2 class="heading--2">Recipe ingredients</h2>
//       <ul class="recipe__ingredient-list">
//       ${recipe.ingredients.map(ing=>{
//        return `
//        <li class="recipe__ingredient">
//        <svg class="recipe__icon">
//          <use href="${icons}#icon-check"></use>
//        </svg>
//        <div class="recipe__quantity">${ing.quantity}</div>
//        <div class="recipe__description">
//          <span class="recipe__unit">${ing.unit}</span>
//          ${ing.description}
//        </div>
//      </li>
//        `
//       }).join('')}

//       </ul>
//     </div>

//     <div class="recipe__directions">
//       <h2 class="heading--2">How to cook it</h2>
//       <p class="recipe__directions-text">
//         This recipe was carefully designed and tested by
//         <span class="recipe__publisher">${recipe.publisher}</span>. Please check out
//         directions at their website.
//       </p>
//       <a
//         class="btn--small recipe__btn"
//         href="${recipe.sourceUrl}"
//         target="_blank"
//       >
//         <span>Directions</span>
//         <svg class="search__icon">
//           <use href="${icons}#icon-arrow-right"></use>
//         </svg>
//       </a>
//     </div>
//    `;
//    recipeContainer.innerHTML = '';
//     recipeContainer.insertAdjacentHTML('afterbegin', markUp);
//   } catch (error) {
//     // alert(error);
//     console.log(error)
//   }
// };

// // showRecipe();

// window.addEventListener('hashchange',showRecipe)
// window.addEventListener('load',showRecipe)
