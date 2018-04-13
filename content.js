/* StoPlay Content JS */

class NineGagPics {


    constructor() {
        console.info('---------- 9GAG pics ---------');

        this.LOG = '9GAG_PICS';
        this.postSelector = '.post-view';

        this.setScrollHandler();
    }

    setScrollHandler() {
        console.info(this.LOG, 'setScrollHandler');
        window.addEventListener('scroll', this.onScroll.bind(this));
    }

    onScroll(event) {
        console.log(this.LOG, 'onScroll', document.querySelectorAll(this.postSelector));

        document.querySelectorAll(this.postSelector).forEach(function(item) {
            item.closest('article').style.display = "none"
        });
    }
}

var NineGagPicsInstance = new NineGagPics();