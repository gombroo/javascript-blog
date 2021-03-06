'use strict';

/*
const opts = {
  tagSizes: {
    count: 5,
    classPrefix: 'tag-size-',
  },
};

const select = {
  all: {
    articles: '.post',
    linksTo: {
      tags: 'a[href^="#tag-"]',
      authors: 'a[href^="#author-"]',
    },
  },
  article: {
    tags: '.post-tags .list',
    author: '.post-author',
  },
  listOf: {
    titles: '.titles',
    tags: '.tags.list',
    authors: '.authors.list',
  },
};
 */

const opt = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post p.post-author',
  tagsListSelector: '.list.tags',
  authorsListSelector: '.list.authors',
  cloudClassCount: '5',
  cloudClassPrefix: 'tag-size-'
};

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
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

/*
  const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post p.post-author',
  optTagsListSelector = '.list.tags',
  optAuthorsListSelector = '.list.authors',
  optCloudClassCount = '5',
  optCloudClassPrefix = 'tag-size-';
*/

function generateTitleLinks(customSelector = '') {

  /* [DONE] remove contents of titleList */
  const clearTitleList = function() {
    document.querySelector(opt.titleListSelector).innerHTML = '';
  };

  clearTitleList();

  const titleList = document.querySelector(opt.titleListSelector);

  /* [DONE] for each article - find all the articles and save them to variable: articles */
  // const articles = document.querySelectorAll(optArticleSelector);
  const articles = document.querySelectorAll(opt.articleSelector + customSelector);

  let html = '';

  for (let article of articles) {

    /* [DONE] get the article id */
    const articleId = article.getAttribute('id');

    /* [DONE] find the title element */
    /* [DONE] get the title from the title element */
    const articleTitle = article.querySelector(opt.titleSelector).innerHTML;

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
  const classNumber = Math.floor(((count - params.min) / (params.max - params.min)) * (opt.cloudClassCount - 1) + 1);
  return opt.cloudClassPrefix + classNumber;
}

function generateTags() {

  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* [DONE] find all articles */
  const articles = document.querySelectorAll(opt.articleSelector);

  /* [DONE] START LOOP: for every article: */
  for (let article of articles) {

    /* [DONE] find tags wrapper */
    const tagsWrapper = article.querySelector(opt.articleTagsSelector);

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
        title: tag,
      };
      const linkHTML = templates.tagLink(linkHTMLData);

      /* [DONE] add generated code to html variable */
      html = html + linkHTML;

      /* [NEW] check if this link is NOT already in allTags */
      // if(Object.prototype.hasOwnProperty.call(obj, prop)) // works
      // if(!Object.prototype.hasOwnProperty.call(allTags, tag)) // works
      // if(!allTags.hasOwnProperty(tag)) // jeśli allTags NIE MA klucza tag

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
  const tagList = document.querySelector(opt.tagsListSelector);

  /* [NEW] w ilu artykułach pojawia się najbardziej i najmniej popularny tag */
  const tagsParams = calculateTagsParams(allTags);

  /* [NEW] create variable for all links in HTML code
  = generate HTML code for tag links in the sidebar */

  // let allTagsHTML = ''; // tu przechowujemy kod wszystkich linków
  const allTagsData = {tags: []};

  /* [NEW] START LOOP: for each tag in allTags object */
  for (let tag in allTags) {

    /* [DONE] generate code of a link and add it to allTagsHTML */
    // 1a. allTagsHTML += tag + ' (' + allTags[tag] + ')'; // no link
    // 1b. allTagsHTML += tagLinkHTML;
    // 2. allTagsHTML += '<li><a href="#tag-' + tag + '">' + tag + ' (' + allTags[tag] + ')</a></li>';
    // 3. const tagLinkHTML = calculateTagClass(allTags[tag], tagsParams);
    // 4. const tagLinkHTML = '<li>' + calculateTagClass(allTags[tag], tagsParams) + '</li>';

    // const tagLinkHTML = '<li><a class="' + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '" > ' + tag + ' </a></li > ';

    // allTagsHTML += tagLinkHTML; // doklejanie kodu kolejnego linka do allTagsHTML
    allTagsData.tags.push({ // zamiast tego do tablicy dodajemy kolejny obiekt
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });

    /* [NEW] END LOOP: for each tag in allTags: */
  }

  /* [NEW] add html from allTagsHTML to tagList */

  // tagList.innerHTML = allTagsHTML; // nie mamy już allTagsHTML
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

function calculateAuthorClass(count, params) {
  const classNumber = Math.floor(((count - params.min) / (params.max - params.min)) * opt.cloudClassCount + 1);
  return opt.cloudClassPrefix + classNumber;
}

function generateAuthors() {

  /* create a new variable allAuthors with an empty object */
  let allAuthors = {};

  /* find all authors */
  const articles = document.querySelectorAll(opt.articleSelector); // search in .post

  /* START LOOP: for every author: */
  for (let article of articles) { // for each .post

    /* find author wrapper */
    const authorWrapper = article.querySelector(opt.articleAuthorSelector); // find empty html <p> tag to insert auhtor name

    /* make html variable with empty string */
    let html = '';

    /* get author from data-author attribute assigned to article */
    const articleAuthor = article.getAttribute('data-author');

    /* generate HTML link of the author */
    // const authorHTML = '<a href="#' + articleAuthor + '">' + articleAuthor + '</a>';
    // const authorHTML = articleAuthor; - no link
    const authorHTMLData = {
      id: articleAuthor,
      title: articleAuthor
    };
    const authorHTML = templates.authorLink(authorHTMLData);

    /* add generated code to html variable */
    html = html + authorHTML;

    /* check if this link is NOT already in allAuthors */
    if (!allAuthors[articleAuthor]) {

      /* if not, add author to allAuthors object */
      allAuthors[articleAuthor] = 1;
    } else {

      /* if yes, increase the counter by 1 */
      allAuthors[articleAuthor]++;
    }

    /* [NEW] find list of authors in right column */
    const authorList = document.querySelector(opt.authorsListSelector);

    /* [NEW] create variable for all links in HTML code */
    // let allAuthorsHTML = '';
    const allAuthorsData = {
      authors: []
    };

    /* START LOOP: for each author in allAuhtorsHTML */
    for (let author in allAuthors) {

      allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author]
      });

      /* add html from allAuthorsHTML to authorList */
      // authorList.innerHTML = allAuthorsHTML;

      authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
      console.log(allAuthorsData);

      /* insert HTML of all the links into the author wrapper sidebar*/
      authorWrapper.innerHTML = html;

      /* END LOOP: for each author in allAuthors */
    }

  /* END LOOP: for every author: */
  }
}

generateAuthors();


function authorClickHandler(event) {

  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "author" and extract author from the "href" constant */
  const author = href.replace('#author-', '');

  /* find all author links with class active */
  // const activeAuthorLinks = document.querySelectorAll('.post-author a.active'); // search author with class active
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');

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
  const authorLinks = document.querySelectorAll('a[href^="#author-"]');

  /* START LOOP: for each author */
  for (let authorLink of authorLinks) {

    /* add authorClickHandler as event listener for that link */
    authorLink.addEventListener('click', authorClickHandler);
  }

  /* END LOOP: for each author */
}

addClickListenersToAuthors();
