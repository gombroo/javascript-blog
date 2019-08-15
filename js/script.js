'use strict';

/* ------------------------------ */
/* Display article after click */
/* ------------------------------ */

/* document.getElementById('test-button').addEventListener('click', function(){
  const links = document.querySelectorAll('.titles a');
  console.log('links:', links);
});
*/

const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this; // for finding clicked link, 'this' makes possible to refer to this const through the whole function

  /* [DONE] remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

 /* [DONE] add class 'active' to the clicked link */

  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.post.active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute("href");

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);

  /* [DONE] add class 'active' to the correct article */

  targetArticle.classList.add('active');
}


/* ------------------------------ */
/* Generate title list with JS */
/* ------------------------------ */

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles';

function generateTitleLinks(){

  /* [DONE] remove contents of titleList */

  /* clearTitleList();*/

  const clearTitleList = function() {
    document.querySelector(optTitleListSelector).innerHTML = '';
  }

  const titleList = document.querySelector(optTitleListSelector);
  console.log(titleList);

  /* [DONE] for each article - find all the articles and save them to variable: articles */

  const articles = document.querySelectorAll(optArticleSelector);

	let html = '';

    for(let article of articles){

		/* [DONE] get the article id */

		const articleId = article.getAttribute("id");

		/* [DONE] find the title element */
		/* [DONE] get the title from the title element */

		const articleTitle = article.querySelector(optTitleSelector).innerHTML;

		/* [DONE] create HTML of the link */

		const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
		console.log(linkHTML);

		/* [DONE] insert link into html variable - titleList */

		titleList.insertAdjacentHTML('beforeend', linkHTML);

    /* [DONE] insert link into html variable */

		html = html + linkHTML;
    }

	titleList.innerHTML = html;

  // links & eventListener moved here -
  // it shoud be run AFTER generating list of links, not before

  const links = document.querySelectorAll('.titles a');
  console.log('links:', links);

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

/* function clearTitleList(){
  document.querySelector(optTitleListSelector).innerHTML = '';
}
*/
