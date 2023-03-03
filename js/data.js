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

function get_article_by_page(page) {
    if (page > article_list.length || page < 1) {
        return null;
    }

    var idx = 0;
    for (var i = 0; i < article_list.length; i++) {
        if (article_list[i].number == page) {
            idx = i;
            break;
        }
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

function get_article_comments(page) {
    if (page > article_list.length || page < 1) {
        return null;
    }
    
    var url = ISSUES_URL + "/" + page + "/comments";
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

function show_author_avatar() {
    // 显示作者头像
    var author_avatar_element = document.getElementsByClassName("author-avatar")[0];
    var author_avatar_img = document.createElement("img");
    author_avatar_img.className = "author-avatar-img";
    author_avatar_img.src = author_avatar_url;
    
    author_avatar_element.appendChild(author_avatar_img);
}

function show_shortcut_icon() {
    // 显示 shortcut icon
    var head_element = document.getElementsByTagName("head")[0];
    var shortcut_icon = document.createElement("link");
    shortcut_icon.rel = "shortcut icon";
    shortcut_icon.href = author_avatar_url;

    head_element.appendChild(shortcut_icon);
}

function show_article_list_page() {
    get_article_list();

    // 显示作者头像
    show_author_avatar();
    
    // 显示 shortcut icon
    show_shortcut_icon();

    // 显示文章列表
    var articles = [];
    for (var i = article_list.length; i > 0; i--) {
        articles.push(get_article_by_page(i));
    }

    var article_list_element = document.getElementsByClassName("article-item-list")[0];
    article_list_element.innerHTML = "";

    var article, article_element, article_title, article_intro, article_link, article_date;
    for (var i = 0; i < article_list.length; i++) {
        article = articles[i];

        article_element = document.createElement("div");
        article_element.className = "article-item";

        article_list_element.appendChild(article_element);

        article_title = document.createElement("a");
        article_title.className = "article-item-title";
        if (article.title.length > 20) {
            article_title.innerText = article.title.substring(0, 10) + "...";
        } else {
            article_title.innerText = article.title;
        }
        article_title.style.fontSize = "24px";
        article_title.style.fontWeight = "bold";
    
        article_intro = document.createElement("div");
        article_intro.className = "article-item-intro";
        let body = article.body.replace(/[\r\n]/g, " ");
        if (body.length > 100) {
            article_intro.innerText = body.substring(0, 100) + "...";
        } else {
            article_intro.innerText = body;
        }
 
        article_link = document.createElement("a");
        article_link.className = "article-item-link";
        article_link.innerText = "阅读全文";
        article_link.style.color = "blue";
        article_link.href="/articles/" + article_list[i].number + "/index.html";

        article_date = document.createElement("div");
        article_date.className = "article-item-date";
        article_date.innerText = article.date;
        article_date.style.color = "gray";

        article_element.appendChild(article_title);
        article_element.appendChild(article_intro);
        article_element.appendChild(article_link);
        article_element.appendChild(article_date);
    }
}

function show_article_page(page) {
    get_article_list();

    // 显示作者头像
    show_author_avatar();
    
    // 显示 shortcut icon
    show_shortcut_icon();

    // 显示文章
    var article = get_article_by_page(page);
    var main_page_element = document.getElementsByClassName("main-page")[0];
    var article_element = document.createElement("div");
    article_element.className = "article";
    
    var article_title = document.createElement("div");
    article_title.className = "article-title";
    article_title.innerText = article.title;

    var article_sub_title = document.createElement("div");
    article_sub_title.className = "article-sub-title";

    var article_author = document.createElement("a");
    article_author.className = "article-author";
    article_author.innerText = article.author;
    article_author.href = article.author_url;
    article_author.style.color = "blue";

    var article_date = document.createElement("div");
    article_date.className = "article-date";
    article_date.innerText = article.date;
    article_date.style.color = "gray";

    article_sub_title.appendChild(article_author);
    article_sub_title.appendChild(article_date);

    var article_body = document.createElement("div");
    article_body.className = "article-body";
    article_body.innerHTML = article.body;

    article_element.appendChild(article_title);
    article_element.appendChild(article_sub_title);
    article_element.appendChild(article_body);

    main_page_element.appendChild(article_element);

    // 显示评论
    var comment_page_element = document.getElementsByClassName("comment-page")[0];
    var comments = get_article_comments(page);
    var comment_number_element = document.createElement("div");
    comment_number_element.className = "comment-number";
    
    var text_element = document.createElement("div");
    text_element.className = "comment-number-text";
    text_element.innerText = "评论";
    text_element.style.fontWeight = "bold";
    
    var number_element = document.createElement("div");
    number_element.className = "comment-number-number";
    number_element.innerText = comments.length;
    number_element.style.color = "gray";

    comment_number_element.appendChild(text_element);
    comment_number_element.appendChild(number_element);

    comment_page_element.appendChild(comment_number_element);

    var comment, comment_element, comment_visitor_avatar, comment_visitor_name, comment_date, comment_body;
    var comment_visitor_info_element, comment_visitor_detail_element;
    for (var i = 0; i < comments.length; i++) {
        comment = comments[i];

        comment_element = document.createElement("div");
        comment_element.className = "comment";

        comment_visitor_info_element = document.createElement("div");
        comment_visitor_info_element.className = "comment-visitor-info";

        comment_visitor_avatar = document.createElement("img");
        comment_visitor_avatar.className = "comment-visitor-avatar";
        comment_visitor_avatar.src = comment.visitor_avatar_url;

        comment_visitor_name = document.createElement("div");
        comment_visitor_name.className = "comment-visitor-name";
        comment_visitor_name.innerText = comment.visitor;

        comment_visitor_info_element.appendChild(comment_visitor_avatar);
        comment_visitor_info_element.appendChild(comment_visitor_name);

        comment_visitor_detail_element = document.createElement("div");
        comment_visitor_detail_element.className = "comment-visitor-detail";

        comment_date = document.createElement("div");
        comment_date.className = "comment-date";
        comment_date.innerText = comment.date;

        comment_body = document.createElement("div");
        comment_body.className = "comment-body";
        comment_body.innerText = comment.body;

        comment_visitor_detail_element.appendChild(comment_date);
        comment_visitor_detail_element.appendChild(comment_body);

        comment_element.appendChild(comment_visitor_info_element);
        comment_element.appendChild(comment_visitor_detail_element);

        comment_page_element.appendChild(comment_element);
    }
}
