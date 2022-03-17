const typeList = document.getElementById("typeList");
const webList = document.getElementById("webList");

let id, user;
let nowPages;       //网站列表们的JSON数据
let nowPage = 0;    //目前选中的网站列表编号
let editmode = false;

function createWebEle(webInfo, i) {
    let li = document.createElement("li");
    let img = document.createElement("img");
    let span = document.createElement("span");
    let a = document.createElement("a");
    // let url = new URL(webInfo.url);
    img.src = "https://ico.hnysnet.com/get.php?url=" + webInfo.url;
    span.innerText = webInfo.name;
    a.classList.add("editor");
    a.onclick = (e) => {
        e.stopPropagation();
        popupManagaer.showChangeWeblink(i);
    };

    li.appendChild(img);
    li.appendChild(span);
    li.appendChild(a);

    li.className = "webItem";
    li.setAttribute("list-id", i);
    li.onclick = () => window.open(webInfo.url, "_blank");

    return li;
}

function modifyWeblink(name, url, nowID) {
    webList.children[nowID].replaceWith(
        createWebEle({name: name, url: url}, nowID)
    );
    
    nowPages[nowPage].pages[nowID] = {name: name, url: url};
    savePages();
}

function changePage(index) {
    typeList.children[nowPage].classList.remove('active');
    typeList.children[index].classList.add('active');
    nowPage = index;
    webList.innerHTML = "";
    let thisPages = nowPages[index].pages;
    for (let i in thisPages) {
        webList.appendChild(createWebEle(thisPages[i], i));
    }
}

function deletePage(index) {
    // if (index == nowPage)   changePage(index ? 0 : 1);
    nowPages.splice(index, 1);
    // typeList.removeChild(typeList.children[index]);
    loadPages(nowPages);
    // if (index == 0) nowPage = 0;
}

function modifyPageName(index, name) {
    nowPages[index].name = name;
    loadPages(nowPages, index);
}

function addPage(name) {
    nowPages.push({name: name, pages: nowPages[nowPage].pages});
    loadPages(nowPages, nowPages.length - 1);
}

//Pages modify

function loadPages(webPage, index = 0) {
    typeList.innerHTML = "";
    nowPages = webPage;
    for (let i in webPage) {
        let li = document.createElement("li");
        let a1 = document.createElement("a");
        let a2 = document.createElement("a");
        li.innerText = webPage[i].name;
        a1.className = "editButton editor";
        a2.className = "removeButton editor";
        a1.onclick = (e) => {
            e.preventDefault();
            popupManagaer.showChangeListname((value) => {
                modifyPageName(i, value);
            });
        };
        a2.onclick = (e) => {
            e.preventDefault();
            if (nowPages.length > 1)
                popupManagaer.showQuestion(
                    "真的要删除这个分类嘛！",
                    "删了就回不来了哦！",
                    () => deletePage(i)
                );
            else    popupManagaer.showInfo(
                "这已经是最后一个分类啦～",
                "再删掉就要出bug了💦"
            )
        };

        li.onclick = () => changePage(i);
        li.onpointerenter = () => {
            if (!editmode)
            li.setAttribute('changeTimeoutID',
                setTimeout(() => changePage(i), 500)
            );
        }
        li.onpointerleave = () =>
            li.hasAttribute('changeTimeoutID') &&
            clearTimeout(li.getAttribute('changeTimeoutID'));

        li.appendChild(a1);
        li.appendChild(a2);

        typeList.appendChild(li);
    }

    let a = document.createElement("a");
    a.classList.add("editor");
    a.onclick = () => popupManagaer.showChangeListname((value) => {
        addPage(value);
    });
    typeList.appendChild(a);

    nowPage = index;
    changePage(index);
}

function savePages() {
    // localStorage.setItem('pages', JSON.stringify(nowPages));
    if (id != null)
    Agent.post('/savePages', {ID: id, page: nowPages});
}

function setEditmode(value = true) {
    editmode = value;
    if (value) {
        document.getElementsByTagName("body")[0].classList.add("editmode");
    } else {
        document.getElementsByTagName("body")[0].classList.remove("editmode");
    }
}

function register(user, pwd) {
    let res = Agent.post('/register', {user: user, pwd: pwd});
    id = res.ID;
    let pages = Agent.post('/getPages', {ID: id});
    loadPages(pages);
    console.log("Register successful:" + id);
    document.getElementById('logoutButton').className = "";
    document.getElementById('loginButton').className = "unshow";
}

function login(user, pwd) {
    let res = Agent.post('/login', {user: user, pwd: pwd});
    if (!res.stat) {
        id = res.ID;
        localStorage.setItem('id', id);
        let pages = Agent.post('/getPages', {ID: id});
        loadPages(pages);
        console.log("Login successful:" + id);
        document.getElementById('logoutButton').className = "";
        document.getElementById('loginButton').className = "unshow";
    } else {
        console.log("Login failed");
    }
}

function logout() {
    id = null;
    user = null;
    localStorage.removeItem('id');
    localStorage.removeItem('user');
    document.getElementById('logoutButton').className = "unshow";
    document.getElementById('loginButton').className = "";
    loadPages(
        Agent.post('/getPages', {ID: 'DEFAULT'})
    );
}

function init() {
    // let pages = localStorage.getItem('pages');
    // if (pages != null) {
    //     loadPages(JSON.parse(pages));
    //     console.log(JSON.parse(pages));
    // } else {
    //     localStorage.setItem('pages', JSON.stringify(defaultWebPage));
    //     loadPages(defaultWebPage);
    // }
    id = localStorage.getItem('id');
    user = localStorage.getItem('user');
    let pages;
    if (id != null) {
        pages = Agent.post('/getPages', {ID: id});
        document.getElementById('loginButton').className = "unshow";
    }
    else {
        pages = Agent.post('/getPages', {ID: 'DEFAULT'});
        document.getElementById('logoutButton').className = "unshow";
    }
    loadPages(pages);
    console.log(id);
    console.log(pages);
}

init();