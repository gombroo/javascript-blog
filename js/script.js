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
  const articleSelector = clickedElement.getAttribute('href');

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);

  /* [DONE] add class 'active' to the correct article */
  targetArticle.classList.add('active');
};


/* ------------------------------ */
/* Generate title list with JS */
/* ------------------------------ */

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post p.post-author',
  optTagsListSelector = '.tags.list';

// function generateTitleLinks() {}
function generateTitleLinks(customSelector = '') {

  /* [DONE] remove contents of titleList */
  const clearTitleList = function() {
    document.querySelector(optTitleListSelector).innerHTML = '';
  };

  clearTitleList();

  const titleList = document.querySelector(optTitleListSelector);
  console.log(titleList);

  /* [DONE] for each article - find all the articles and save them to variable: articles */
  // const articles = document.querySelectorAll(optArticleSelector);
  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  let html = '';

  for(let article of articles){

    /* [DONE] get the article id */
    const articleId = article.getAttribute('id');

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


function generateTags(){

  /* [DONE] find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  console.log('Find all articles: ', articles);

  /* [DONE] START LOOP: for every article: */
  for(let article of articles) {

    /* [DONE] find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    console.log('Find tags wrapper: ', tagsWrapper);

    /* [DONE] make html variable with empty string */
    let html = '';

    /* [DONE] get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    console.log('Get tags from data-tag attribute: ', articleTags);

    /* [DONE] split tags into array */
    const articleTagsArray = articleTags.split(' ');
    console.log('Split tags into array: ', articleTagsArray);

    /* [DONE] START LOOP: for each tag */
    for(let tag of articleTagsArray) {

      /* [DONE] generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      console.log('Make link: ', linkHTML);

      /* [DONE] add generated code to html variable */
      html = html + linkHTML;
      console.log('Add code to html variable: ', html);

      /* END LOOP: for each tag */
    }

    /* [DONE] insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
    console.log('Insert html link into tags wrapper', html);

    /* END LOOP: for every article: */
  }
}

generateTags();


function tagClickHandler(event){

  /* [DONE] prevent default action for this event */
  event.preventDefault();

  /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log('Works?');

  /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log('Read href attirbute of the clicked element');

  /* [DONE] make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  console.log('Extract tag from the href constant');

  /* [DONE] find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  console.log('Find all tag links with class active');

  /* [DONE] START LOOP: for each active tag link */
  for(let activeTagLink of activeTagLinks) {

    /* [DONE] remove class active */
    activeTagLink.classList.remove('active');

  /* END LOOP: for each active tag link */
  }

  /* [DONE] find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks =  document.querySelectorAll('a[href="' + href + '"]');

  /* [DONE] START LOOP: for each found tag link */
  for(let tagLink of tagLinks) {

    /* [DONE] add class active */
    tagLink.classList.add('active');

  /* END LOOP: for each found tag link */
  }

  /* [DONE] execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}


function addClickListenersToTags(){

  /* find all links to tags */
  const tagLinks = document.querySelectorAll('href');

  /* START LOOP: for each link */
  for(let tagLink of tagLinks) {

    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
  }
  /* END LOOP: for each link */

}

addClickListenersToTags();


function generateAuthors(){

  /* [DONE] find all authors */
  const authors = document.querySelectorAll(optArticleAuthorSelector);
  console.log('Find all authors: ', authors);

  /* [DONE] START LOOP: for every author: */
  for(let author of authors) {

    /* [DONE] find author wrapper */
    const authorWrapper = document.querySelector(optArticleAuthorSelector);
    console.log('Find author wrapper:', authorWrapper);

    /* make html variable with empty string */
    let html = '';

    /* [DONE] get author from data-author attribute */
    const articleAuthor = author.getAttribute('data-author');
    console.log('Get author from data-author attr:', articleAuthor);

    /* [DONE] generate HTML link of the author */
    const authorHTML = '<a href="#' + articleAuthor + '">' + articleAuthor + '</a>';
    // const authorHTML = articleAuthor;
    console.log('Make link: ', authorHTML);

    /* [DONE] add generated code to html variable */
    html = html + authorHTML;
    console.log('Add code to html variable: ', html);

    /* [DONE] insert HTML of all the links into the author wrapper */
    authorWrapper.innerHTML = html;
    console.log('Insert html link into author wrapper', html);

  /* END LOOP: for every author: */
  }
}

generateAuthors();


function authorClickHandler(event){

  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "author" and extract author from the "href" constant */
  const author = href.replace('#', '');

  /* find all author links with class active */
  const activeAuthorLinks = document.querySelectorAll('.post-author a.active');

  /* START LOOP: for each active author link */
  for(let activeAuthorLink of activeAuthorLinks) {

    /* remove class active */
    activeAuthorLink.classList.remove('active');

  /* END LOOP: for each active author link */
  }

  /* find all author links with "href" attribute equal to the "href" constant */
  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found author link */
  for(let authorLink of authorLinks) {

    /* add class active */
    authorLink.classList.add('active');

  /* END LOOP: for each found author link */
  }

  /* execute function "generateTitleLinks" with author selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}


function addClickListenersToAuthors() {

  /* find all links to authors */
  const authorLinks = document.querySelectorAll('href');

  /* START LOOP: for each author */
  for(let authorLink of authorLinks) {

    /* add authorClickHandler as event listener for that link */
    authorLink.addEventListener('click', authorClickHandler);
  }
  /* END LOOP: for each author */

}

addClickListenersToAuthors();


function generateTags(){
  /* [NEW] create a new variable allTags with an empty array */
  let allTags = [];

  /* find all articles */

  /* START LOOP: for every article: */

    /* find tags wrapper */

    /* make html variable with empty string */

    /* get tags from data-tags attribute */

    /* split tags into array */

    /* START LOOP: for each tag */

      /* generate HTML of the link */

      /* add generated code to html variable */

      /* [NEW] check if this link is NOT already in allTags */
      if(allTags.indexOf(linkHTML) == -1){
        /* [NEW] add generated code to allTags array */
        allTags.push(linkHTML);
      }

    /* END LOOP: for each tag */

    /* insert HTML of all the links into the tags wrapper */

  /* END LOOP: for every article: */

  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector('.tags');

  /* [NEW] add html from allTags to tagList */
  tagList.innerHTML = allTags.join(' ');
}
