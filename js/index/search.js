const input = document.getElementById("searchInput");
const suggestion = document.getElementById("searchSuggestion");
const searchButton = document.getElementById("searchButton");

const suggestionAgent = {
    callback: function(data) {
        // console.log(data);
        suggestion.innerHTML = "";
        for(let i in data.s) {
            // console.log(data.s[i]);
            let li = document.createElement("li");
            li.innerText = data.s[i];
            li.onclick = () => {
                console.log(data.s[i]);
                input.value = data.s[i];
                window.open("https://www.baidu.com/s?wd=" + data.s[i], "_blank");
            };
            suggestion.appendChild(li);
        }
    },
    request: function(word) {
        word.trim();
        if (word.length == 0)   return;
        var script = document.createElement("script");
        script.src = "https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd="
            + word + "&cb=suggestionAgent.callback";
        document.body.appendChild(script);
    }
};

input.oninput = function() {
    suggestion.style = "display: block";
    suggestionAgent.request(this.value);
}

input.onblur = function() {
    setTimeout(() => suggestion.style = "display: none", 100);
}

searchButton.onclick = function() {
    window.open("https://www.baidu.com/s?wd=" + input.value, "_blank");
}