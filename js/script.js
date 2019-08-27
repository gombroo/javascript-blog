'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML)
};

/* ------------------------------ */
/* Display article after click */
/* ------------------------------ */

/* document.getElementById('test-button').addEventListener('click', function(){
  const links = document.querySelectorAll('.titles a');
  console.log('links:', links);
});
*/

const titleClickHandler = function(event) {
  event.preventDefault();
  const clickedElement = this; // for finding clicked link, 'this' makes possible to refer to this const through the whole function

  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.post.active');

  for (let activeArticle of activeArticles) {
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
/* Generate title links */
/* ------------------------------ */

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post p.post-author',
  optTagsListSelector = '.list.tags',
  optAuthorsListSelector = '.list.authors',
  optCloudClassCount = '5',
  optCloudClassPrefix = 'tag-size-';

function generateTitleLinks(customSelector = '') {

  /* [DONE] remove contents of titleList */
  const clearTitleList = function() {
    document.querySelector(optTitleListSelector).innerHTML = '';
  };

  clearTitleList();

  const titleList = document.querySelector(optTitleListSelector);

  /* [DONE] for each article - find all the articles and save them to variable: articles */
  // const articles = document.querySelectorAll(optArticleSelector);
  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  let html = '';

  for (let article of articles) {

    /* [DONE] get the article id */
    const articleId = article.getAttribute('id');

    /* [DONE] find the title element */
    /* [DONE] get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* [DONE] create HTML of the link */
    // const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

    const linkHTMLData = {
      id: articleId,
      title: articleTitle
    };
    const linkHTML = templates.articleLink(linkHTMLData);

    /* [DONE] insert link into html variable - titleList */
    titleList.insertAdjacentHTML('beforeend', linkHTML);

    /* [DONE] insert link into html variable */
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  // links & eventListener moved here -
  // it shoud be run AFTER generating list of links, not before

  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();


/* ------------------------------ */
/* Generate tags */
/* ------------------------------ */

/* [NEW] find max and min count of each tag's appearance */

function calculateTagsParams(tags) {
  const params = {
    max: 0,
    min: 999999
  };
  for (let tag in tags) {

    if (tags[tag] > params.max) {
      params.max = tags[tag];
    }
  }
  for (let tag in tags) {

    if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }
  return params;
}

function calculateTagClass(count, params) {
  const classNumber = Math.floor(((count - params.min) / (params.max - params.min)) * optCloudClassCount + 1);
  return optCloudClassPrefix + classNumber;
}

function generateTags() {

  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* [DONE] find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  /* [DONE] START LOOP: for every article: */
  for (let article of articles) {

    /* [DONE] find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);

    /* [DONE] make html variable with empty string */
    let html = '';

    /* [DONE] get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');

    /* [DONE] split tags into array */
    const articleTagsArray = articleTags.split(' ');

    /* [DONE] START LOOP: for each tag */
    for (let tag of articleTagsArray) {

      /* [DONE] generate HTML of the link */
      // const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';

      const linkHTMLData = {
        id: tag,
        title: tag
      };
      const linkHTML = templates.tagLink(linkHTMLData);

      /* [DONE] add generated code to html variable */
      html = html + linkHTML;

      /* [NEW] check if this link is NOT already in allTags */
      // if (Object.prototype.hasOwnProperty.call(obj, prop)) // works
      //if (!Object.prototype.hasOwnProperty.call(allTags, tag)) // works

      if (!allTags[tag]) {

        /* [NEW] if not, add tag to allTags object */
        allTags[tag] = 1;

      } else {

        /* [NEW] if yes, increase the counter by 1 */
        allTags[tag]++;
      }
      /* END LOOP: for each tag */
    }

    /* [DONE] insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;

    /* END LOOP: for every article: */
  }

  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector('.tags');

  /* [NEW] w ilu artykułach pojawia się najbardziej i najmniej popularny tag */
  const tagsParams = calculateTagsParams(allTags);

  /* [NEW] create variable for all links in HTML code */
  // let allTagsHTML = '';

  const allTagsData = {tags: []};

  /* [NEW] START LOOP: for each tag in allTagsHTML */
  for (let tag in allTags) {

    /* [DONE] generate code of a link and add it to allTagsHTML */
    // 1a. allTagsHTML += tag + ' (' + allTags[tag] + ')'; // no link
    // 1b. allTagsHTML += tagLinkHTML;
    // 2. allTagsHTML += '<li><a href="#tag-' + tag + '">' + tag + ' (' + allTags[tag] + ')</a></li>';
    // 3. const tagLinkHTML = calculateTagClass(allTags[tag], tagsParams);
    // 4. const tagLinkHTML = '<li>' + calculateTagClass(allTags[tag], tagsParams) + '</li>';

    // const tagLinkHTML = '<li><a class="' + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '" > ' + tag + ' </a></li > ';
    // allTagsHTML += tagLinkHTML;

    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });

    /* [NEW] END LOOP: for each tag in allTags: */
  }

  /* [NEW] add html from allTagsHTML to tagList */
  // tagList.innerHTML = allTagsHTML;

  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log(allTagsData);
}

generateTags();


function tagClickHandler(event) {

  /* [DONE] prevent default action for this event */
  event.preventDefault();

  /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* [DONE] make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');

  /* [DONE] find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* [DONE] START LOOP: for each active tag link */
  for (let activeTagLink of activeTagLinks) {

    /* [DONE] remove class active */
    activeTagLink.classList.remove('active');

    /* END LOOP: for each active tag link */
  }

  /* [DONE] find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* [DONE] START LOOP: for each found tag link */
  for (let tagLink of tagLinks) {

    /* [DONE] add class active */
    tagLink.classList.add('active');

    /* END LOOP: for each found tag link */
  }

  /* [DONE] execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {

  /* find all links to tags */
  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');

  /* START LOOP: for each link */
  for (let tagLink of tagLinks) {

    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
  }
  /* END LOOP: for each link */

}

addClickListenersToTags();


/* ------------------------------ */
/* Generate authors */
/* ------------------------------ */

/* [NEW] find max and min count of each author's appearance */

function calculateAuthorsParams(authors) {
  const params = {
    max: 0,
    min: 999999
  };
  for (let author in authors) {

    if (authors[author] > params.max) {
      params.max = authors[author];
    }
  }
  for (let author in authors) {

    if (authors[author] < params.min) {
      params.min = authors[author];
    }
  }
  return params;
}

function calculateAuthorClass(count, params) {
  const classNumber = Math.floor(((count - params.min) / (params.max - params.min)) * optCloudClassCount + 1);
  return optCloudClassPrefix + classNumber;
}

function generateAuthors() {

  /* [NEW] create a new variable allAuthors with an empty object */
  let allAuthors = [];

  /* [DONE] find all authors */
  const articles = document.querySelectorAll(optArticleSelector); // search in .post

  /* [DONE] START LOOP: for every author: */
  for (let article of articles) { // for each .post

    /* [DONE] find author wrapper */
    const authorWrapper = article.querySelector(optArticleAuthorSelector); // find empty html <p> tag to insert auhtor name

    /* make html variable with empty string */
    let html = ''; // generate empty html string there

    /* [DONE] get author from data-author attribute assigned to article */
    const articleAuthor = article.getAttribute('data-author'); // display articles assigned to author

    /* [DONE] generate HTML link of the author */
    const authorHTML = '<a href="#' + articleAuthor + '">' + articleAuthor + '</a>';
    // const authorHTML = articleAuthor; - no link
    // const linkHTMLData = {id: articleAuthor, title: articleAuthor};
    // const linkHTML = templates.authorLink(linkHTMLData);

    /* [DONE] add generated code to html variable */
    html = html + authorHTML;

    /* [NEW] check if this link is NOT already in allAuthors */
    if (!Object.prototype.hasOwnProperty.call(allAuthors, articleAuthor)) {

      /* [NEW] if not, add author to allAuthors object */
      allAuthors[articleAuthor] = 1;
    } else {
      /* [NEW] if yes, increase the counter by 1 */
      allAuthors[articleAuthor]++;
    }
    authorWrapper.innerHTML = html;
  }

  /* [DONE] insert HTML of all the links into the author wrapper sidebar*/

  /* END LOOP: for every author: */
}

/* [NEW] find list of authors in right column */
const authorList = document.querySelector('.authors');

/* [NEW] in which articles the most and less popular author appears */
// const authorsParams = calculateAuthorsParams(allAuthors);

/* [NEW] create variable for all links in HTML code */
let allAuthorsHTML = '';

/* [NEW] add html from allAuthorsHTML to authorList */
authorList.innerHTML = allAuthorsHTML;

generateAuthors();


function authorClickHandler(event) {

  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "author" and extract author from the "href" constant */
  const author = href.replace('#', '');

  /* find all author links with class active */
  const activeAuthorLinks = document.querySelectorAll('.post-author a.active'); // search author with class active

  /* START LOOP: for each active author link */
  for (let activeAuthorLink of activeAuthorLinks) {

    /* remove class active */
    activeAuthorLink.classList.remove('active');

    /* END LOOP: for each active author link */
  }

  /* find all author links with "href" attribute equal to the "href" constant */
  const authorLinks = document.querySelectorAll('a[href="' + href + '"]'); // author name = href

  /* START LOOP: for each found author link */
  for (let authorLink of authorLinks) { // find articles assigned to particular author

    /* add class active */
    authorLink.classList.add('active');

    /* END LOOP: for each found author link */
  }

  /* execute function "generateTitleLinks" with author selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {

  /* find all links to authors */
  const authorLinks = document.querySelectorAll('.post-author a');

  /* START LOOP: for each author */
  for (let authorLink of authorLinks) {

    /* add authorClickHandler as event listener for that link */
    authorLink.addEventListener('click', authorClickHandler);
  }
  /* END LOOP: for each author */

}

addClickListenersToAuthors();
