/*
document.getElementById('test-button').addEventListener('click', function(){
    const links = document.querySelectorAll('.titles a');
    console.log('links:', links);
  });
*/

//const { active } = require("browser-sync");

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagsLink: Handlebars.compile(document.querySelector('#template-tags-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-authors-cloud-link').innerHTML)
};

const titleClickHandler = function(event){
  const clickedElement = this;
  event.preventDefault();
  console.log('Link was clicked!');

  /* remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */

  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');

  /* find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);

  /* add class 'active' to the correct article */

  targetArticle.classList.add('active');
};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = 'post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = '5',
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = 'data-author';

function generateTitleLinks(customSelector = '') {

  /* remove contents of titleList */

  const titleList = document.querySelector(optTitleListSelector);

  titleList.innerHTML = '';

  /* for each article */

  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  let html = '';

  for (let article of articles) {

    /* get the article id */

    const articleId = article.getAttribute('id');

    /* find the title element */
    /* get the title from the title element */

    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* create HTML of the link */

    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);

    /* insert link into titleList */

    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagClass(count, params){

  const normalizedCount = count - params.min;

  const normalizedMax = params.max - params.min;

  const percentage = normalizedCount / normalizedMax;

  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );

  Math.floor( classNumber * (optCloudClassPrefix - 1) + 1);
}

function generateTags(){
  /* find all articles */

  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */

  for (let article of articles) {

    /* find tags wrapper */

    const titleList = article.querySelector(optArticleTagsSelector);

    /* make html variable with empty string */

    let html = '';

    /* get tags from data-tags attribute */

    const articleTags = article.getAttribute('data-tags');

    /* split tags into array */

    const articleTagsArray = articleTags.split(' ');

    /* START LOOP: for each tag */

    for (let tag of articleTagsArray) {

      /* generate HTML of the link */

      const linkHTMLData = {id: articleTags, title: tag};
      const linkHTML = templates.articleLink(linkHTMLData);

      /* add generated code to html variable */

      html = html + linkHTML;
    }
    /* END LOOP: for each tag */
    /* insert HTML of all the links into the tags wrapper */

    titleList.innerHTML = html;
  }
  /* END LOOP: for every article: */
}

generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */

  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */

  const tag = href.replace('#tag', '');

  /* find all tag links with class active */

  const activeArticles = document.querySelector('active');

  /* START LOOP: for each active tag link */

  for (let activeArticle of activeArticles) {

    /* remove class active */

    activeArticle.classList.remove('active');
  }
  /* END LOOP: for each active tag link */
  /* find all tag links with "href" attribute equal to the "href" constant */

  const articles = document.querySelector(href);

  /* START LOOP: for each found tag link */

  for (let article of articles) {

    /* add class active */

    article.classList.add('active');
  }
  /* END LOOP: for each found tag link */
  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */

  const tagsArticles = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each link */

  for (let tagsArticle of tagsArticles) {

    /* add tagClickHandler as event listener for that link */

    tagsArticle.addEventListener(tagClickHandler);
  }
  /* END LOOP: for each link */
}

addClickListenersToTags();

function generateAuthors(){

  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles) {

    /* find tags wrapper */

    const authorList = article.querySelector(optArticleAuthorSelector);

    let html = '';

    const articleTags = article.getAttribute(optAuthorsListSelector);
    console.log('articleTags', articleTags);

    const linkHTMLData = {id: articleTags, title: authorList};
    const linkHTML = templates.authorLink(linkHTMLData);

    html = html + linkHTML;

    articles.innerHTML = html;
  }
}
generateAuthors();

function authorClickHandler(event){

  event.preventDefault();

  const clickedElement = this;

  const href = clickedElement.getAttribute('data-author');

  const activeArticles = document.querySelector('active');

  for (let activeArticle of activeArticles) {

    activeArticle.classList.remove('active');

    const articles = document.querySelector(href);

    generateTitleLinks('[data-author="' + articles + '"]');
  }

  function addClickListenersToAuthors(){

    const tagsArticles = document.querySelectorAll('a.active[href^="data-author"]');

    for (let tagsArticle of tagsArticles) {

      tagsArticle.addEventListener(authorClickHandler);
    }
  }

  addClickListenersToAuthors();

  function calculateTagsParams(tags){

    const params = {
      min: 999999,
      max: 0
    };

    for (let tag in tags) {
      console.log(tag + ' is used ' + tags[tag] + ' times');

      if (tags[tag] > params.max) {
        params.max = tags[tag];
      } else if (tags[tag] < params.min) {
        params.min = tags[tag];
      }
    }

    return params;
  }

  function generateTags(){
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};

    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */
    for (let article of articles) {

      /* find tags wrapper */
      const tagsList = article.querySelector(optTagsListSelector);

      /* make html variable with empty string */
      let html = '';

      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');

      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');

      /* START LOOP: for each tag */
      for (let tag of articleTagsArray) {

        /* generate HTML of the link */
        const linkHTML = '<li><a href="#' + articleTags + '"><span>' + tag + '</span></a></li>';

        /* add generated code to html variable */
        html = html + linkHTML;

        /* [NEW] check if this link is NOT already in allTags */
        if(!allTags[tag]){
          /* [NEW] add tag to allTags object */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
      }
      /* END LOOP: for each tag */
      /* insert HTML of all the links into the tags wrapper */
      tagsList.innerHTML = html;
    }
    /* END LOOP: for every article: */

    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector('.tags');

    const tagsParams = calculateTagsParams(allTags);
    console.log('tagsParams:', tagsParams);

    /* [NEW] create variable for all links HTML code */
    const allTagsData = {tags: []};

    /* [NEW] START LOOP: for each tag in allTags: */
    for (let tag in allTags) {
      /* [NEW] generate code of a link and add it to allTagsHTML */
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });
    }
    /* [NEW] END LOOP: for each tag in allTags: */

    /* [NEW] add html from allTags to tagList */
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
    console.log(allTagsData);
  }
  generateTags();
}
authorClickHandler();
