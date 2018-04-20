/* 9gag-pics-only Content JS */

class NineGagPics {


    constructor() {

        this.LOG = '9GAG_PICS_ONLY';
        this.postSelector = '.post-view';
        this.deferTimer = null;
        this.singlePost = !!document.querySelectorAll('#individual-post').length;

        console.info(this.LOG, 'Init');
        this.hideByPostSelector();
        this.setScrollHandler();
    }

    setScrollHandler() {
        window.addEventListener('scroll', this.onScroll.bind(this));
    }

    onScroll(event) {

        if (this.deferTimer) {
            clearTimeout(this.deferTimer);
        }
        this.deferTimer = setTimeout(this.hideByPostSelector.bind(this), 100);
    }

    hideByPostSelector() {
        if (this.singlePost) {
            return;
        }
        document.querySelectorAll(this.postSelector).forEach(function(item) {
            item.closest('article').style.display = "none"
        });

        clearTimeout(this.deferTimer);
    }
}

var NineGagPicsInstance = new NineGagPics();