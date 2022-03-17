const popupWrapper = document.getElementById("popupWrapper");
const popupPanel = document.getElementById("popupPanel");

const popupManagaer = {    
    showing: document.getElementById("pQAQ"),
    showPopup: function(target) {
        this.showing && this.showing.classList.remove("active");
        this.showing = target;
        target.classList.add("active");
        popupWrapper.style.display = "block";
        setTimeout(() => {
            popupWrapper.classList.add("active")
            popupPanel.classList.add("active");
        }, 0);
    },
    
    closePopup: function() {
        popupWrapper.classList.remove("active");
        popupPanel.classList.remove("active");
    },

    showQAQ: function() {
        this.showPopup(document.getElementById("pQAQ"));
    },
    showChangeWeblink: function(nowID) {
        let pop = document.getElementById("pChangeWeblink");
        pop.children[0].children[1].value = nowPages[nowPage].pages[nowID].name;
        pop.children[1].children[1].value = nowPages[nowPage].pages[nowID].url;
        pop.children[2].onclick = () => {
            modifyWeblink(
                pop.children[0].children[1].value,
                pop.children[1].children[1].value,
                nowID
            );
            this.closePopup();
        }
        this.showPopup(pop);
    },
    showChangeListname: function(callback) {
        let pop = document.getElementById("pChangeListname");
        pop.children[0].children[0].value = "";
        pop.children[1].onclick = () => {
            callback && callback(pop.children[0].children[0].value); this.closePopup();
        };
        this.showPopup(pop);
    },
    showQuestion: function(title, content, yesCallback, noCallback) {
        let pop = document.getElementById("pQuestion");
        pop.children[0].innerText = title;
        pop.children[1].innerText = content;
        pop.children[2].children[0].onclick = () => {
            yesCallback && yesCallback(); this.closePopup();
        };
        pop.children[2].children[1].onclick = () => {
            noCallback && noCallback();   this.closePopup();
        };
        this.showPopup(pop);
    },
    showInfo: function(title, content) {
        let pop = document.getElementById("pInfo");
        pop.children[0].innerText = title;
        pop.children[1].innerText = content;
        pop.children[2].onclick = () => this.closePopup();
        this.showPopup(pop);
    },
};

popupWrapper.ontransitionend = function() {
    this.style.display = 
        this.classList.contains("active") ? "block" : "none";
};