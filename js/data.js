const ISSUES_URL = "https://api.github.com/repos/xudonghuang20/xudonghuang20.github.io/issues";

var article_list = [];
var author_avatar_url;

function get_article_list() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", ISSUES_URL, false);
    xhr.send();

    var response = JSON.parse(xhr.responseText);
    author_avatar_url = response[0].user.avatar_url;
    for (var i = 0; i < response.length; i++) {
        var article = {
            "number": response[i].number,
            "title": response[i].title,
            "url": response[i].url,
            "date": response[i].created_at
        }
        article_list.push(article);
    }
}

function get_article_by_idx(idx) {
    if (idx >= article_list.length) {
        return null;
    }

    var url = article_list[idx].url;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();

    var response = JSON.parse(xhr.responseText);
    var article = {
        "title": response.title,
        "body": response.body,
        "date": response.created_at,
        "author": response.user.login,
        "author_url": response.user.url,
        "author_avatar_url": response.user.avatar_url,
        "comments_num": response.comments
    }
    return article;
}

function get_article_comments(idx) {
    if (idx >= article_list.length) {
        return null;
    }
    
    idx += 1;
    var url = URL + "/" + idx + "/comments";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();

    var response = JSON.parse(xhr.responseText);
    var comments = [];
    for (var i = 0; i < response.length; i++) {
        var comment = {
            "visitor": response[i].user.login,
            "visitor_avatar_url": response[i].user.avatar_url,
            "date": response[i].created_at,
            "body": response[i].body,
        }
        comments.push(comment);
    }
    return comments;
}

function show() {
    // 显示文章列表
    get_article_list();
    var articles = [];
    for (var i = 0; i < article_list.length; i++) {
        articles.push(get_article_by_idx(i));
    }

    var article_list_element = document.getElementsByClassName("article-list")[0];
    article_list_element.innerHTML = "";

    var article, article_element, article_title, article_intro, article_link, article_date;
    for (var i = 0; i < article_list.length; i++) {
        article = articles[i];

        article_element = document.createElement("div");
        article_element.className = "article";

        article_list_element.appendChild(article_element);

        article_title = document.createElement("a");
        article_title.className = "article-title";
        if (article.title.length > 20) {
            article_title.innerText = article.title.substring(0, 10) + "...";
        } else {
            article_title.innerText = article.title;
        }
        article_title.style.fontSize = "24px";
        article_title.style.fontWeight = "bold";
    
        article_intro = document.createElement("div");
        article_intro.className = "article-intro";
        let body = article.body.replace(/[\r\n]/g, " ");
        if (body.length > 100) {
            article_intro.innerText = body.substring(0, 100) + "...";
        } else {
            article_intro.innerText = body;
        }
 
        article_link = document.createElement("a");
        article_link.className = "article-link";
        article_link.innerText = "阅读全文";
        article_link.style.color = "blue";

        article_date = document.createElement("div");
        article_date.className = "article-date";
        article_date.innerText = article.date;
        article_date.style.color = "gray";

        article_element.appendChild(article_title);
        article_element.appendChild(article_intro);
        article_element.appendChild(article_link);
        article_element.appendChild(article_date);
    }

    // 显示作者头像
    var author_avatar_element = document.getElementsByClassName("author-avatar")[0];
    var author_avatar_img = document.createElement("img");
    author_avatar_img.className = "author-avatar-img";
    author_avatar_img.src = author_avatar_url;
    
    author_avatar_element.appendChild(author_avatar_img);
}

show();


