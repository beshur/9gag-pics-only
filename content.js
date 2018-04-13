/* StoPlay Content JS */

class NineGagPics {


    constructor() {
        console.info('---------- 9GAG pics ---------');

        this.LOG = '9GAG_PICS';
        this.postSelector = '.post-view';
        this.deferTimer = null;

        this.setScrollHandler();
    }

    setScrollHandler() {
        console.info(this.LOG, 'setScrollHandler');
        window.addEventListener('scroll', this.onScroll.bind(this));
    }

    onScroll(event) {

        if (this.deferTimer) {
            clearTimeout(this.deferTimer);
        }
        this.deferTimer = setTimeout(this.hideByPostSelector.bind(this), 100);
    }

    hideByPostSelector() {
        console.log(this.LOG, 'hideByPostSelector');
        document.querySelectorAll(this.postSelector).forEach(function(item) {
            item.closest('article').style.display = "none"
        });

        clearTimeout(this.deferTimer);
    }
}

var NineGagPicsInstance = new NineGagPics();